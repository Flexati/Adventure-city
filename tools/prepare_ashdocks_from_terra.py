"""Ash Docks road bodies from Terra's G4 attempts (team composition, Terra round 1).

Usage: python3 -I tools/prepare_ashdocks_from_terra.py <master dir> <out dir>

Terra's attempts (887x1774) have the right content but not the game geometry. This tool only
resamples them, it does not paint: each source band (sidewalk, kerb, carriageway, kerb, sidewalk)
is mapped onto the game band (0-117, 118-129, 130-589, 590-602, 603-719), the height is scaled by
V and a 1392-row window at OFFSET is kept. Light maps go through the same mapping. The joint is the
lower plate of Terra's joint attempt, scaled to 720x48. The result is then checked and built by
tools/build_ashdocks_roads.py.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

W, BODY, JOINT = 720, 1392, 48
DEST = (0, 118, 130, 590, 603, 720)
V = .82
# source x of: left kerb outer edge, carriageway start, carriageway end, right kerb outer edge
# (measured on the attempts, gutter included in the kerb); OFFSET = first source row after scaling
VARIANTS = {
    'banchina': {'x': (210, 226, 662, 678), 'offset': 0},
    'gru': {'x': (188, 202, 683, 698), 'offset': 0},
    'deposito': {'x': (176, 202, 685, 710), 'offset': 0},
}
JOINT_ROWS = (None, None)  # filled from the joint attempt: rows of its lower plate


def remap(im, xs, offset):
    src_w = im.width
    edges = (0, *xs, src_w)
    h = round(im.height * V)
    cols = []
    for (s0, s1), (d0, d1) in zip(zip(edges, edges[1:]), zip(DEST, DEST[1:])):
        cols.append(im.crop((s0, 0, s1, im.height)).resize((d1 - d0, h), Image.LANCZOS))
    out = Image.new(im.mode, (W, h))
    for c, d0 in zip(cols, DEST):
        out.paste(c, (d0, 0))
    return out.crop((0, offset, W, offset + BODY))


def plate(joint):
    """Rows of the lowest non-white band of the joint attempt (two strips on white)."""
    a = np.asarray(joint.convert('RGB')).astype(int)
    white = (a.min(axis=2) > 235).mean(axis=1) > .9
    rows = np.nonzero(~white)[0]
    runs = np.split(rows, np.nonzero(np.diff(rows) > 1)[0] + 1)
    low = max(runs, key=lambda r: r[0])
    return joint.crop((0, int(low[0]), joint.width, int(low[-1]) + 1))


def main(src, dest):
    src, dest = Path(src), Path(dest)
    dest.mkdir(parents=True, exist_ok=True)
    for v, p in VARIANTS.items():
        for kind, name in (('body', f'road_{v}_attempt.png'), ('light', f'road_{v}_light_attempt.png')):
            im = Image.open(src / name).convert('RGB')
            remap(im, p['x'], p['offset']).convert('RGBA').save(dest / f'ASHDOCKS_road_{v}_{kind}.png')
    p = plate(Image.open(src / 'joint_attempt.png'))
    p.convert('RGB').resize((W, JOINT), Image.LANCZOS).convert('RGBA').save(dest / 'ASHDOCKS_joint.png')
    Image.new('RGBA', (W, JOINT), (0, 0, 0, 255)).save(dest / 'ASHDOCKS_joint_light.png')
    print('written', dest)


if __name__ == '__main__':
    main(*sys.argv[1:3])
