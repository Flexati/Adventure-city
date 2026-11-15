"""Clean layout for the 4x4 character and enemy sheets: no cut feet, no stray soles.

Usage: python3 tools/clean_sheet_layout.py [--check]

The masters were generated with poses crossing their nominal cell lines. The renderer crops exact
quarters, so a back-view pose lost its soles at the cell bottom while those soles floated above the
head of the pose below (front view), and side poses showed slivers of the neighbouring cell.

Each pose is isolated by connected components (tools/lib/sprite_isolation.py) and pasted into a
larger integer cell. A row whose bodies cross the bottom line moves up just enough for the lowest
sole to sit on the cell's last usable line, which is where every uncut pose already stands, so
reload and shooting share the ground line. Every other pixel keeps its place relative to the old
cell. game/sheet-layout.mjs tells drawLegacySprite the padding, so the on-screen scale is unchanged.
Pixels are never redrawn or rescaled. Originals: assets/source/sheets_v05_v10_original/.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent / 'lib'))
from sprite_isolation import HALO, OPAQUE, components, main_body  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'assets/source/sheets_v05_v10_original'
LAYOUT = ROOT / 'game/sheet-layout.mjs'
REPORT = ROOT / 'docs/evidence/v10.2/sheet-layout-report.json'
SHEETS = [('v05', n) for n in ('nox_walk', 'lulu_walk', 'nox_actions', 'lulu_actions', 'nox_gun', 'lulu_gun',
                               'nox_magic', 'lulu_magic', 'gang_states', 'infected_states', 'alien_states',
                               'custodian_states')] + [('v10', 'nox_vx9_gun'), ('v10', 'lulu_r12_gun')]
GROUND = 2  # an uncut pose ends 1-2 px above its cell bottom
SPLIT = .25  # a component with this share of its px in a second cell joins two poses (an attack touching its neighbour)


def isolate(rgba):
    """sprite_isolation.isolate, except that a component holding two poses is cut on the cell line."""
    h, w = rgba.shape[:2]
    cw, ch = w / 4, h / 4
    alpha = rgba[..., 3]
    labels, n = components(alpha > OPAQUE)
    yy, xx = np.indices(labels.shape)
    geo = np.minimum(3, (yy // ch).astype(int)) * 4 + np.minimum(3, (xx // cw).astype(int))
    cell_of = np.full(labels.shape, -1, int)
    ys, xs = np.nonzero(labels)
    lab = labels[ys, xs]
    count = np.bincount(lab, minlength=n + 1)
    cy = np.bincount(lab, ys, n + 1) / np.maximum(count, 1)
    cx = np.bincount(lab, xs, n + 1) / np.maximum(count, 1)
    owner = np.minimum(3, cy // ch).astype(int) * 4 + np.minimum(3, cx // cw).astype(int)
    per_cell = np.zeros((n + 1, 16), int)
    np.add.at(per_cell, (lab, geo[ys, xs]), 1)
    split = np.sort(per_cell, axis=1)[:, -2] >= SPLIT * np.maximum(count, 1)
    cell_of[ys, xs] = np.where(split[lab], geo[ys, xs], owner[lab])
    grown = cell_of.copy()
    for _ in range(HALO):
        src = grown.copy()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            shifted = np.roll(src, (dy, dx), (0, 1))
            fill = (grown < 0) & (shifted >= 0) & (alpha > 0)
            grown[fill] = shifted[fill]
    out = {}
    for idx in range(16):
        keep = grown == idx
        out[divmod(idx, 4)] = (np.where(keep[..., None], rgba, 0).astype(np.uint8), keep & (alpha > OPAQUE))
    return out, (cw, ch), int(split[1:].sum())


def build(folder, name):
    rgba = np.asarray(Image.open(SRC / f'{folder}_{name}.png').convert('RGBA'))
    h, w = rgba.shape[:2]
    poses, (cw, ch), splits = isolate(rgba)
    # Half-up rounding, as Math.round in the renderer and the tests (Python's round() is half-even).
    ox = [int(np.floor(c * cw + .5)) for c in range(5)]
    oy = [int(np.floor(r * ch + .5)) for r in range(5)]
    cwi, chi = int(np.ceil(cw)), int(np.ceil(ch))
    # Row lift: the lowest body of the row lands on the ground line; walk bob and recoil stay intact.
    lift, boxes = [], {}
    for r in range(4):
        low = 0
        for c in range(4):
            layer, mask = poses[(r, c)]
            if mask.any():
                low = max(low, int(np.nonzero(main_body(layer, mask))[0].max()) - oy[r])
        lift.append(int(max(0, low - (oy[r + 1] - oy[r] - GROUND))))
    for (r, c), (layer, mask) in poses.items():
        ys, xs = np.nonzero(layer[..., 3])
        if len(ys):
            boxes[(r, c)] = (ys.min() - oy[r] - lift[r], ys.max() - oy[r] - lift[r], xs.min() - ox[c], xs.max() - ox[c])
    # One empty line around every stored cell: nothing can bleed into a neighbour when sampled.
    top = int(max([0] + [-b[0] for b in boxes.values()])) + 1
    bottom = int(max([0] + [b[1] - (chi - 1) for b in boxes.values()])) + 1
    pad = int(max([0] + [max(-b[2], b[3] - (cwi - 1)) for b in boxes.values()])) + 1
    CW, CH = cwi + 2 * pad, chi + top + bottom
    out = np.zeros((CH * 4, CW * 4, 4), np.uint8)
    cells = {}
    for (r, c), (layer, mask) in poses.items():
        ys, xs = np.nonzero(layer[..., 3])
        if not len(ys):
            continue
        dy, dx = r * CH + top - oy[r] - lift[r], c * CW + pad - ox[c]
        out[ys + dy, xs + dx] = layer[ys, xs]
        cut = 0 if len(ys) == 0 else int(((ys - oy[r] >= oy[r + 1] - oy[r]) | (ys < oy[r])).sum())
        cells[f'{r},{c}'] = {'outside_old_cell_px': cut, 'opaque_px': int(mask.sum())}
    # Opaque pixels that no pose claimed would vanish; the sheets must not lose any.
    claimed = sum(int(m.sum()) for _, m in poses.values())
    lost = int((rgba[..., 3] > OPAQUE).sum()) - claimed
    meta = {'cw': cw, 'ch': ch, 'CW': CW, 'CH': CH, 'px': pad, 'top': top, 'lift': lift}
    return out, meta, {'size': [w, h], 'new_size': [CW * 4, CH * 4], **meta, 'lost_opaque_px': lost, 'split_components': splits,
                       'pixels_restored': sum(v['outside_old_cell_px'] for v in cells.values()), 'cells': cells}


def main(check=False):
    layout, report = {}, {}
    for folder, name in SHEETS:
        out, meta, info = build(folder, name)
        if info['lost_opaque_px']:
            raise SystemExit(f'{name}: {info["lost_opaque_px"]} opaque px unassigned')
        target = ROOT / f'game/art/{folder}/{name}.png'
        if check:
            if not np.array_equal(np.asarray(Image.open(target).convert('RGBA')), out):
                raise SystemExit(f'{target} is stale; rerun tools/clean_sheet_layout.py')
        else:
            Image.fromarray(out).save(target, optimize=True)
        layout[f'{folder}/{name}.png'] = {k: (round(v, 4) if isinstance(v, float) else v) for k, v in meta.items()}
        report[f'{folder}/{name}'] = info
    text = ('// Generated by tools/clean_sheet_layout.py: padded cells of the cleaned 4x4 sheets.\n'
            '// cw/ch: original cell (draw scale), CW/CH: stored cell, px/top: padding before the original origin.\n'
            'export const SHEET_LAYOUT=Object.freeze(' + json.dumps(layout, separators=(',', ':')) + ');\n')
    if check:
        if LAYOUT.read_text() != text:
            raise SystemExit('game/sheet-layout.mjs is stale')
        return
    LAYOUT.write_text(text)
    REPORT.write_text(json.dumps(report, indent=1) + '\n')
    for k, v in report.items():
        print(k, v['size'], '->', v['new_size'], 'lift', v['lift'], 'top', v['top'], 'px', v['px'], 'restored', v['pixels_restored'], 'split', v['split_components'])


if __name__ == '__main__':
    main('--check' in sys.argv)
