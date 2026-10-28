"""Shared geometry for the race props request (Terra round 3): spec, zones, key removal, checks.

Used by tools/make_terra_race_props.py (templates and masks for Terra) and
tools/compose_terra_race_props.py (Terra's edits back to game PNGs, with the checks).
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SPEC = ROOT / 'assets/source/race_props/race_props.json'
KEY = (0, 255, 0)
KEY_TOL, SOFT_LO = 90, 40  # distance from pure green: background below SOFT_LO, ramp to KEY_TOL for soft art
OPAQUE = 24


def load_spec(path=SPEC):
    spec = json.loads(Path(path).read_text())
    for a in spec['assets']:
        if a.get('box') == 'container':
            a['box'] = spec['container_box']
    return spec


def zone_mask(a, scale=1):
    """White = content allowed, at the final size times scale."""
    w, h = a['size']
    m = Image.new('L', (w * scale, h * scale), 0)
    d, z = ImageDraw.Draw(m), a['zone']
    if 'rect' in z:
        x0, y0, x1, y1 = z['rect']
        d.rectangle([x0 * scale, y0 * scale, x1 * scale - 1, y1 * scale - 1], fill=255)
    elif 'ellipse' in z:
        cx, cy, rx, ry = z['ellipse']
        d.ellipse([(cx - rx) * scale, (cy - ry) * scale, (cx + rx) * scale - 1, (cy + ry) * scale - 1], fill=255)
    else:
        d.polygon([(x * scale, y * scale) for x, y in z['polygon']], fill=255)
    return m


def unkey(rgb, soft):
    """Key green to alpha; soft art (flames, puddles) keeps a graded edge."""
    e = rgb.astype(float)
    dist = np.sqrt(((e - KEY) ** 2).sum(axis=2))
    alpha = np.clip((dist - SOFT_LO) / (KEY_TOL - SOFT_LO), 0, 1) * 255 if soft else np.where(dist < KEY_TOL, 0, 255)
    # Spill suppression: the Lanczos edge against the key turns greenish.
    e[..., 1] = np.minimum(e[..., 1], np.maximum(e[..., 0], e[..., 2]) + 24)
    out = np.dstack([e, alpha]).round().astype(np.uint8)
    out[alpha == 0, :3] = 0
    return out


def opaque_box(alpha):
    ys, xs = np.nonzero(alpha > OPAQUE)
    return None if not len(xs) else (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))


def check(a, img, done):
    """Contract of one final PNG. done: name -> RGBA array of assets already checked (hit/night states)."""
    fails, info = [], {}
    w, h = a['size']
    if img.shape[1::-1] != (w, h):
        return [f'{a["name"]}: {img.shape[1]}x{img.shape[0]}, expected {w}x{h}'], info
    alpha = img[..., 3]
    zone = np.asarray(zone_mask(a)) > 0
    out = (alpha > 0) & ~zone
    if out.any():
        fails.append(f'{a["name"]}: {int(out.sum())} px outside the zone')
    b = opaque_box(alpha)
    info['box'] = b
    if b is None:
        return fails + [f'{a["name"]}: empty'], info
    info['cover'] = round(float(((alpha > OPAQUE) & zone).sum() / zone.sum()), 3)
    if 'box' in a and any(abs(x - y) > a.get('tol', 2) for x, y in zip(b, a['box'])):
        fails.append(f'{a["name"]}: opaque box {b}, expected {tuple(a["box"])} +-{a.get("tol", 2)}')
    if info['cover'] < a.get('min_cover', 0):
        fails.append(f'{a["name"]}: covers {info["cover"]:.0%} of its zone, at least {a["min_cover"]:.0%}')
    if 'span' in a:
        x0, x1 = a['span']
        gap = [x for x in range(x0, x1) if not (alpha[:, x] > OPAQUE).any()]
        if gap:
            fails.append(f'{a["name"]}: does not cross the road, empty columns from x {gap[0]} ({len(gap)} px)')
    for key in ('hit_of', 'night_of'):
        ref = done.get(a.get(key))
        if a.get(key) and ref is None:
            fails.append(f'{a["name"]}: {a[key]} missing, checked first')
        elif ref is not None:
            rb = opaque_box(ref[..., 3])
            if rb is None or any(abs(x - y) > 2 for x, y in zip(b, rb)):
                fails.append(f'{a["name"]}: opaque box {b}, {a[key]} has {rb} (+-2)')
    return fails, info
