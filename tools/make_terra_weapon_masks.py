"""Edit-zone masks and per-cell edit packages for Terra (weapon sheets by mask, Terra round 2).

Usage: python3 -I tools/make_terra_weapon_masks.py <zones.json> <out dir> [--scale=3]

The zones file lists, for every cell of a 4x4 weapon sheet, polygons in cell coordinates covering the
weapon, the hands and the muzzle flash, with face and hair left outside. Output:
  <name>_zones.png             full-sheet zones (white = editable): verify_terra_weapon_sheet.py --zones=
  celle/<name>_r<row>c<col>.png       the cell on the key green #00FF00, enlarged by --scale (nearest)
  celle/<name>_r<row>c<col>_mask.png  its edit mask at the same size (white = editable, transparent = keep)
  <name>_zones_view.png        contact sheet: zones in magenta over the sheet
Terra edits each enlarged cell inside its mask only; the team scales the edit back to the cell
and composes out = mask ? edit : reference, so outside the mask nothing can change.
"""
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
KEY = (0, 255, 0)


def main(zones, dest, scale=3):
    spec = json.loads(Path(zones).read_text())
    sheet = Image.open(ROOT / spec['sheet']).convert('RGBA')
    cw, ch = spec['cell']
    # Cells may be fractional (reload sheets: 326.25 x 321.25): edges round half up, as in the game.
    edge = lambda v: math.floor(v + .5)
    boxes = {(r, c): (edge(c * cw), edge(r * ch), edge((c + 1) * cw), edge((r + 1) * ch)) for r in range(4) for c in range(4)}
    name = Path(spec['sheet']).stem
    dest = Path(dest)
    (dest / 'celle').mkdir(parents=True, exist_ok=True)
    mask = Image.new('L', sheet.size, 0)
    draw = ImageDraw.Draw(mask)
    for key, polys in spec['cells'].items():
        r, c = map(int, key.split(','))
        x0, y0, x1, y1 = boxes[(r, c)]
        for poly in polys:
            pts = [(x0 + min(max(x, 1), x1 - x0 - 2), y0 + min(max(y, 1), y1 - y0 - 2)) for x, y in poly]
            draw.polygon(pts, fill=255)
    Image.merge('RGBA', [mask] * 3 + [mask]).save(dest / f'{name}_zones.png')
    m = np.asarray(mask) > 0
    view = np.asarray(sheet).copy()
    bg = np.full_like(view, (90, 90, 90, 255))
    a = view[..., 3:4] / 255
    view = (view * a + bg * (1 - a)).astype(np.uint8)
    view[m] = (view[m] * .55 + np.array([255, 0, 255, 255]) * .45).astype(np.uint8)
    Image.fromarray(view).convert('RGB').save(dest / f'{name}_zones_view.png')
    for r in range(4):
        for c in range(4):
            box = boxes[(r, c)]
            big = ((box[2] - box[0]) * scale, (box[3] - box[1]) * scale)
            # Image editors rarely keep transparency: the cell sits on key green, removed at composition.
            keyed = Image.new('RGBA', (box[2] - box[0], box[3] - box[1]), KEY + (255,))
            keyed.alpha_composite(sheet.crop(box))
            keyed.convert('RGB').resize(big, Image.NEAREST).save(dest / 'celle' / f'{name}_r{r}c{c}.png')
            cm = mask.crop(box).resize(big, Image.NEAREST)
            Image.merge('RGBA', [cm] * 3 + [cm]).save(dest / 'celle' / f'{name}_r{r}c{c}_mask.png')
    print('written', dest)


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    scale = next((int(a.split('=')[1]) for a in sys.argv if a.startswith('--scale=')), 3)
    main(args[0], args[1], scale)
