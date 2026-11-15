"""Compose Terra's per-cell weapon edits into a game sheet (Terra round 2, weapon sheets by mask).

Usage: python3 -I tools/compose_terra_weapon_edits.py <zones.json> <edits dir> <out sheet.png>

For every cell, Terra returns <name>_r<row>c<col>_edit.png: the enlarged cell from
make_terra_weapon_masks.py, edited inside its mask only, at the same size. Here each edit is scaled
back to the cell (Lanczos), the key green is removed (with spill suppression), and out = zone ? edit : reference, so nothing
outside the approved zones can change. Cells without an edit keep the reference. The result goes to
verify_terra_weapon_sheet.py with --zones; the mask written next to it marks the cells actually edited.
"""
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
KEY_TOL = 90  # distance from pure green treated as background


def main(zones, edits, out):
    spec = json.loads(Path(zones).read_text())
    ref = Image.open(ROOT / spec['sheet']).convert('RGBA')
    name = Path(spec['sheet']).stem
    cw, ch = spec['cell']
    edge = lambda v: math.floor(v + .5)
    sheet = np.asarray(ref).copy()
    used = Image.new('L', ref.size, 0)
    draw = ImageDraw.Draw(used)
    edits, done = Path(edits), []
    for key, polys in spec['cells'].items():
        r, c = map(int, key.split(','))
        x0, y0, x1, y1 = edge(c * cw), edge(r * ch), edge((c + 1) * cw), edge((r + 1) * ch)
        f = edits / f'{name}_r{r}c{c}_edit.png'
        if not f.exists():
            continue
        zone = Image.new('L', (x1 - x0, y1 - y0), 0)
        for poly in polys:
            pts = [(min(max(x, 1), x1 - x0 - 2), min(max(y, 1), y1 - y0 - 2)) for x, y in poly]
            ImageDraw.Draw(zone).polygon(pts, fill=255)
            draw.polygon([(x0 + x, y0 + y) for x, y in pts], fill=255)
        e = np.asarray(Image.open(f).convert('RGB').resize((x1 - x0, y1 - y0), Image.LANCZOS)).astype(int)
        green = np.sqrt(((e - (0, 255, 0)) ** 2).sum(axis=2)) < KEY_TOL
        # Spill suppression: the Lanczos edge between weapon and key green turns greenish.
        e[..., 1] = np.minimum(e[..., 1], np.maximum(e[..., 0], e[..., 2]) + 24)
        rgba = np.dstack([e, np.where(green, 0, 255)]).astype(np.uint8)
        rgba[green, :3] = 0
        z = np.asarray(zone) > 0
        sheet[y0:y1, x0:x1][z] = rgba[z]
        done.append(key)
    Image.fromarray(sheet).save(out)
    m = np.asarray(used)
    Image.fromarray(np.dstack([m, m, m, m])).save(Path(out).with_name(Path(out).stem + '_mask.png'))
    print(f'{len(done)} cells composed:', ' '.join(done) or '-')


if __name__ == '__main__':
    main(*sys.argv[1:4])
