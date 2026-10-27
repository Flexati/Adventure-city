"""Runtime sheets for The Anchor from the Astra candidates (G11 core sheet, G12 bollards).

Usage: python3 tools/build_anchor_sheets.py <BOSS_anchor_sheet.png> <dir with ARENA_anchor_bollard_*.png>

Core: since the 20261027 correction the export already puts the body's base on y 493 (+-3) in every
768x512 cell with the smoke whole. The builder only checks that contract (base, no detached fragment
below the base, nothing touching a cell edge) and halves the sheet for Android (cells 384x256). It
refuses a sheet that breaks the contract instead of repairing it.
Bollards: one carries a stray crescent touching the export padding; small detached components touching
the padding are dropped. Pixels are never redrawn.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent / 'lib'))
from sprite_isolation import components  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'game/art/v10'
PAD = 16  # export padding used by Astra's tool
BASELINE, TOLERANCE = 493, 3
SMALL = .1


def parts(a):
    labels, n = components(a[..., 3] > 24)
    sizes = np.bincount(labels.ravel(), minlength=n + 1)
    sizes[0] = 0
    return labels, n, sizes, int(sizes.argmax())


def check_core(cell):
    a = np.asarray(cell)
    labels, n, sizes, main = parts(a)
    base = int(np.nonzero(labels == main)[0].max())
    below = [i for i in range(1, n + 1) if i != main and np.nonzero(labels == i)[0].min() > base]
    ys, xs = np.nonzero(a[..., 3] > 24)
    edge = ys.min() == 0 or xs.min() == 0 or ys.max() == a.shape[0] - 1 or xs.max() == a.shape[1] - 1
    return {'base': base, 'top': int(ys.min()), 'width': int(xs.max() - xs.min()), 'fragments_below': len(below), 'touches_edge': bool(edge)}


def bollard(cell):
    a = np.asarray(cell).copy()
    h, w = a.shape[:2]
    labels, n, sizes, main = parts(a)
    dropped = []
    for i in range(1, n + 1):
        if i == main or sizes[i] >= sizes[main] * SMALL:
            continue
        ys, xs = np.nonzero(labels == i)
        if xs.min() <= PAD or xs.max() >= w - PAD - 1 or ys.min() <= PAD or ys.max() >= h - PAD - 1:
            a[labels == i] = 0
            box = a[max(0, ys.min() - 2):ys.max() + 3, max(0, xs.min() - 2):xs.max() + 3]
            box[box[..., 3] <= 24] = 0  # the fragment's faint halo goes with it
            dropped.append({'px': int(sizes[i]), 'bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]})
    return Image.fromarray(a), dropped


def main(core_path, bollard_dir):
    sheet = Image.open(core_path).convert('RGBA')
    cw, ch = 768, 512
    assert sheet.size == (cw * 4, ch * 8), sheet.size
    cells = {f'{r},{c}': check_core(sheet.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch))) for r in range(8) for c in range(4)}
    bad = {k: v for k, v in cells.items() if abs(v['base'] - BASELINE) > TOLERANCE or v['fragments_below'] or v['touches_edge']}
    if bad:
        raise SystemExit(f'core sheet breaks the contract, ask for a re-export: {bad}')
    sheet.resize((sheet.width // 2, sheet.height // 2), Image.LANCZOS).save(OUT / 'anchor_core.png', optimize=True)
    strip = Image.new('RGBA', (128 * 3, 192))
    report = {'core_cells': cells, 'body_width_px': max(v['width'] for k, v in cells.items() if k.startswith('0,')), 'bollards': {}}
    for i, state in enumerate(['tesa', 'tagliata', 'riormeggio']):
        im = Image.open(Path(bollard_dir) / f'ARENA_anchor_bollard_{state}.png').convert('RGBA')
        assert im.size == (128, 192), im.size
        cell, dropped = bollard(im)
        strip.paste(cell, (i * 128, 0))
        if dropped:
            report['bollards'][state] = dropped
    strip.save(OUT / 'anchor_bollards.png', optimize=True)
    print(json.dumps(report, indent=1))


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
