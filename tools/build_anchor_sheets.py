"""Runtime sheets for The Anchor from the Astra candidates (G11 core sheet, G12 bollards).

Usage: python3 tools/build_anchor_sheets.py <astra asset_nuovi dir>

The candidates are already cut into cells, but rows 3-7 of the core sheet were exported from master
cells whose content touched the master edges (EXPORT_REPORT source_touched_edge): their bodies sit
up to 130 px higher than rows 0-2, fragments of the next row hang below the base, and the smoke is
cut flat at the top. Technical treatment only, never redrawing:
- detached components lying entirely below the body's base are dropped (they belong to the next row);
- every cell is translated so the body's base sits on the common baseline of rows 0-2;
- where the content was cut at the export padding, the first 48 px fade in instead of ending flat.
One bollard carries a stray crescent touching the export padding; small detached components touching
the padding are dropped. The core sheet is halved for Android (cells 384x256).
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
BASELINE = 493  # body base of rows 0-2 in the 768x512 cells
FADE = 48
SMALL = .1


def parts(a):
    labels, n = components(a[..., 3] > 24)
    sizes = np.bincount(labels.ravel(), minlength=n + 1)
    sizes[0] = 0
    return labels, n, sizes, int(sizes.argmax())


def drop(a, labels, i, sizes, dropped):
    ys, xs = np.nonzero(labels == i)
    # Halo pixels (alpha <= 24) of the fragment go with it: clear its 2 px neighbourhood of faint pixels.
    a[labels == i] = 0
    y0, y1, x0, x1 = max(0, ys.min() - 2), ys.max() + 3, max(0, xs.min() - 2), xs.max() + 3
    box = a[y0:y1, x0:x1]
    box[box[..., 3] <= 24] = 0
    dropped.append({'px': int(sizes[i]), 'bbox': [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]})


def core_cell(cell):
    a = np.asarray(cell).copy()
    labels, n, sizes, main = parts(a)
    body = np.nonzero(labels == main)[0]
    base = int(body.max())
    dropped = []
    for i in range(1, n + 1):
        if i != main and np.nonzero(labels == i)[0].min() > base:
            drop(a, labels, i, sizes, dropped)
    shift = BASELINE - base
    out = np.zeros_like(a)
    if shift >= 0:
        out[shift:] = a[:a.shape[0] - shift]
    else:
        out[:shift] = a[-shift:]
    rows = np.nonzero(out[..., 3].max(1) > 24)[0]
    top = int(rows.min())
    cut = bool(np.nonzero(a[..., 3].max(1) > 24)[0].min() <= PAD)
    if cut:
        ramp = np.clip((np.arange(out.shape[0]) - top) / FADE, 0, 1)[:, None]
        out[..., 3] = (out[..., 3] * ramp).astype(np.uint8)
    return Image.fromarray(out), {'base': base, 'shift': shift, 'top_cut_faded': cut, 'dropped': dropped}


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
            drop(a, labels, i, sizes, dropped)
    return Image.fromarray(a), dropped


def main(src):
    src = Path(src)
    report = {'source': 'Astra delivery astra-opus-20261027 (G11, G12)', 'core': {}, 'bollards': {}}
    sheet = Image.open(src / 'BOSS_anchor_sheet.png').convert('RGBA')
    cw, ch = 768, 512
    assert sheet.size == (cw * 4, ch * 8), sheet.size
    out = Image.new('RGBA', sheet.size)
    for r in range(8):
        for c in range(4):
            cell, info = core_cell(sheet.crop((c * cw, r * ch, (c + 1) * cw, (r + 1) * ch)))
            out.paste(cell, (c * cw, r * ch))
            if info['shift'] or info['dropped'] or info['top_cut_faded']:
                report['core'][f'{r},{c}'] = info
    out.resize((sheet.width // 2, sheet.height // 2), Image.LANCZOS).save(OUT / 'anchor_core.png', optimize=True)
    strip = Image.new('RGBA', (128 * 3, 192))
    for i, state in enumerate(['tesa', 'tagliata', 'riormeggio']):
        im = Image.open(src / f'ARENA_anchor_bollard_{state}.png').convert('RGBA')
        assert im.size == (128, 192), im.size
        cell, dropped = bollard(im)
        strip.paste(cell, (i * 128, 0))
        if dropped:
            report['bollards'][state] = dropped
    strip.save(OUT / 'anchor_bollards.png', optimize=True)
    print(json.dumps(report, indent=1))


if __name__ == '__main__':
    main(sys.argv[1])
