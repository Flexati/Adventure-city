"""Contract check for a weapon sheet edited from an in-game reference (Terra round 1, G6/G7).

Usage: python3 -I tools/verify_terra_weapon_sheet.py <reference.png> <candidate.png> <mask.png> [report.json] [--zones=<zones mask>]
(with a report path it also writes <report>.mask.png for the visual review)

The candidate is the reference with only weapon, hands and effects changed. The mask (white or
opaque = changed) marks every pixel the producer touched. The check is mechanical:
- same size as the reference;
- outside the mask every RGBA value is identical to the reference (the hero is never redrawn);
- the mask and the content stay inside their cell, with the one-pixel empty border of the cleaned
  layout (game/sheet-layout.mjs) or of the reload sheets;
- per cell the mask covers at most 40% of the reference figure and at most 60% of the head band
  (top 18% of the body without glow and thin parts). In back and diagonal views the weapon is held
  over the head, so the band cannot be stricter: the face is protected by the identity rule above
  and by the visual review of the overlay this tool writes (mask in magenta over the reference);
- the feet line of the main body is the reference's (+-2 px).
With --zones (the edit zones the team drew with tools/make_terra_weapon_masks.py, face and hair left
outside by hand) the mask must lie inside the zones; that replaces the head-band estimate, which in
back views falls on the raised weapon.
"""
import json
import re
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools/lib'))
from sprite_isolation import OPAQUE, components  # noqa: E402

MAX_MASK, MAX_HEAD, HEAD_BAND, FEET_TOL, OPEN = .40, .60, .18, 2, 15


def box_count(mask, k):
    """Opaque px in the k x k window centred on each pixel (integral image, numpy only)."""
    pad = k // 2
    m = np.pad(mask.astype(np.int32), pad)
    ii = np.pad(m.cumsum(0).cumsum(1), ((1, 0), (1, 0)))
    h, w = mask.shape
    return ii[k:k + h, k:k + w] - ii[:h, k:k + w] - ii[k:k + h, :w] + ii[:h, :w]


def opened(mask, k=OPEN):
    """Morphological opening: barrels and muzzle flashes thinner than k px vanish, the head stays."""
    return box_count(box_count(mask, k) == k * k, k) > 0


def cells_for(reference, shape):
    h, w = shape
    text = (ROOT / 'game/sheet-layout.mjs').read_text()
    layout = json.loads(re.search(r'freeze\((\{.*\})\);', text).group(1))
    key = re.search(r'(v0[5-9]|v10)/[^/]+\.png$', str(reference).replace('\\', '/'))
    entry = layout.get(key.group(0)) if key else None
    if entry and (entry['CW'] * 4, entry['CH'] * 4) == (w, h):
        return [(r, c, c * entry['CW'], r * entry['CH'], (c + 1) * entry['CW'], (r + 1) * entry['CH']) for r in range(4) for c in range(4)]
    edge = lambda n, k: int(np.floor(n * k / 4 + .5))
    return [(r, c, edge(w, c), edge(h, r), edge(w, c + 1), edge(h, r + 1)) for r in range(4) for c in range(4)]


def main_body(alpha):
    labels, n = components(alpha > OPAQUE)
    if not n:
        return None
    sizes = np.bincount(labels.ravel())
    sizes[0] = 0
    return labels == sizes.argmax()


def check(ref_path, cand_path, mask_path, zones_path=None):
    ref = np.asarray(Image.open(ref_path).convert('RGBA')).astype(int)
    cand = np.asarray(Image.open(cand_path).convert('RGBA')).astype(int)
    m = Image.open(mask_path)
    m = np.asarray(m.convert('RGBA'))
    mask = (m[..., 3] > 127) & (m[..., :3].max(axis=2) > 127)
    fails, cells = [], []
    if ref.shape != cand.shape or mask.shape != ref.shape[:2]:
        return {'result': 'FAIL', 'fails': [f'size: reference {ref.shape[1]}x{ref.shape[0]}, candidate {cand.shape[1]}x{cand.shape[0]}, mask {mask.shape[1]}x{mask.shape[0]}']}
    zones = None
    if zones_path:
        z = np.asarray(Image.open(zones_path).convert('RGBA'))
        zones = (z[..., 3] > 127) & (z[..., :3].max(axis=2) > 127)
        if zones.shape != mask.shape:
            return {'result': 'FAIL', 'fails': ['zones mask size differs from the reference']}
        if (mask & ~zones).any():
            ys, xs = np.nonzero(mask & ~zones)
            fails.append(f'{int((mask & ~zones).sum())} mask px outside the approved edit zones (first at x {xs[0]}, y {ys[0]})')
    outside = (np.abs(ref - cand).sum(axis=2) > 0) & ~mask
    if outside.any():
        ys, xs = np.nonzero(outside)
        fails.append(f'{int(outside.sum())} px changed outside the mask (first at x {xs[0]}, y {ys[0]})')
    for r, c, x0, y0, x1, y1 in cells_for(ref_path, ref.shape[:2]):
        rc, cc, mc = ref[y0:y1, x0:x1], cand[y0:y1, x0:x1], mask[y0:y1, x0:x1]
        border = np.zeros(mc.shape, bool)
        border[0, :] = border[-1, :] = border[:, 0] = border[:, -1] = True
        body = main_body(rc[..., 3])
        info = {'cell': [r, c], 'mask_px': int(mc.sum())}
        if (mc & border).any() or ((cc[..., 3] > OPAQUE) & border).any():
            fails.append(f'cell {r},{c}: mask or content on the cell border (content must stay inside its cell)')
        if body is not None:
            ys, xs = np.nonzero(body)
            fig = rc[..., 3] > OPAQUE
            info['mask_share_of_figure'] = round(float((mc & fig).sum() / max(1, fig.sum())), 3)
            # Head band from the reference figure without thin parts, so a weapon raised over the head
            # (back view) and bright muzzle flashes or cyan glow do not count as the head.
            rgb = rc[..., :3]
            glow = (rgb.max(axis=2) > 200) | ((rgb[..., 2] > 150) & (rgb[..., 0] < 100))
            solid = opened(body & ~glow)
            sy = np.nonzero(solid)[0] if solid.any() else ys
            band = np.zeros(mc.shape, bool)
            band[sy.min():sy.min() + int((ys.max() - sy.min()) * HEAD_BAND) + 1] = True
            head = fig & band & solid
            info['mask_share_of_head'] = round(float((mc & head).sum() / max(1, head.sum())), 3)
            nb = main_body(cc[..., 3])
            info['feet_y'] = [int(ys.max()), int(np.nonzero(nb)[0].max()) if nb is not None else None]
            if info['mask_share_of_figure'] > MAX_MASK:
                fails.append(f'cell {r},{c}: mask covers {info["mask_share_of_figure"]:.0%} of the figure (max {MAX_MASK:.0%})')
            if zones is None and info['mask_share_of_head'] > MAX_HEAD:
                fails.append(f'cell {r},{c}: mask covers {info["mask_share_of_head"]:.0%} of the head band (max {MAX_HEAD:.0%})')
            if info['feet_y'][1] is None or abs(info['feet_y'][1] - info['feet_y'][0]) > FEET_TOL:
                fails.append(f'cell {r},{c}: feet at {info["feet_y"][1]}, reference {info["feet_y"][0]}')
        cells.append(info)
    if not mask.any() or not (np.abs(ref - cand).sum(axis=2) > 0).any():
        fails.append('nothing changed: candidate equals reference')
    return {'result': 'FAIL' if fails else 'PASS', 'reference': str(ref_path), 'candidate': str(cand_path), 'fails': fails, 'cells': cells}


def overlay(ref_path, mask_path, out):
    im = Image.new('RGBA', Image.open(ref_path).size, (64, 104, 76, 255))
    im.alpha_composite(Image.open(ref_path).convert('RGBA'))
    m = np.asarray(Image.open(mask_path).convert('RGBA'))
    tint = np.zeros(m.shape, np.uint8)
    tint[(m[..., 3] > 127) & (m[..., :3].max(axis=2) > 127)] = (255, 0, 200, 150)
    im.alpha_composite(Image.fromarray(tint))
    im.save(out, optimize=True)


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--zones=')]
    zones = next((a.split('=', 1)[1] for a in sys.argv[1:] if a.startswith('--zones=')), None)
    report = check(*args[:3], zones)
    if len(args) > 3:
        Path(args[3]).write_text(json.dumps(report, indent=1) + '\n')
        overlay(args[0], args[2], str(Path(args[3]).with_suffix('.mask.png')))
    print(report['result'], *report['fails'][:20], sep='\n')
    sys.exit(report['result'] != 'PASS')
