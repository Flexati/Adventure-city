"""Derive rival03 damage and night states from GPT's rival03_base.png by editing it in place.

The prompt asks that every state is the base image modified: same silhouette, size and
position, only damage, smoke and lights change. GPT delivered the base only, so the five
states are painted here on top of it, deterministically (fixed seed):

  danno1  scratches and a dented front-left fender
  danno2  danno1 + creased hood, cracked windscreen, chipped paint
  danno3  danno2 + more chips, rear dent, soot and grey smoke from the hood
  notte_a headlights violet, tail lamps red, both lit
  notte_b notte_a + violet side position lights

Marks are drawn on a 6 px grid, close to the ~5.7 px pseudo-pixel of the GPT image.
Paint and glass marks stay inside the base silhouette; smoke and light glow may leave it
by a few cells, never towards the image edges. The states are written as RGBA (base keyed
with gpt_chroma), because translucent smoke and glow over green would turn green.

usage: derive_rival03_states.py <rival03_base.png> <out dir>
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gpt_chroma import greenness, key  # noqa: E402

P = 6
SEED = 20261028
# Lamp boxes measured on rival03_base.png (1122x1402), in source pixels (x0, y0, x1, y1).
HEAD = [(368, 228, 458, 362), (662, 228, 752, 362)]
TAIL = [(368, 1032, 474, 1084), (650, 1032, 756, 1084)]


def grid(base):
    h, w = base.shape[:2]
    gw, gh = -(-w // P), -(-h // P)
    pad = np.zeros((gh * P, gw * P, 3), np.float64)
    pad[:h, :w] = base
    small = pad.reshape(gh, P, gw, P, 3).mean(axis=(1, 3))
    return small, (gw, gh)


def up(a, shape):
    big = np.repeat(np.repeat(a, P, 0), P, 1)
    return big[:shape[0], :shape[1]]


def classes(small):
    r, g, b = small[..., 0], small[..., 1], small[..., 2]
    body = (g - np.maximum(r, b)) < 60
    lum = .3 * r + .59 * g + .11 * b
    violet = (b > 110) & (b > g + 40) & (r > g)
    paint = body & ((lum > 150) | violet)
    glass = body & (lum < 115) & (b > r + 8) & (b < 170)
    return body, paint, glass


def erode(m, n=1):
    out = m.copy()
    for _ in range(n):
        out = out & np.roll(out, 1, 0) & np.roll(out, -1, 0) & np.roll(out, 1, 1) & np.roll(out, -1, 1)
    return out


class Layer:
    """RGBA edits on the grid; later strokes cover earlier ones."""

    def __init__(self, size):
        self.im = Image.new('RGBA', size, (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.im)

    def arr(self):
        return np.array(self.im).astype(np.float64)


def jag(rng, x, y, dx, dy, n):
    pts = [(x, y)]
    for _ in range(n):
        x += dx + rng.integers(-1, 2); y += dy + rng.integers(-1, 2)
        pts.append((x, y))
    return pts


def scratches(L, rng, paint, count, area):
    x0, y0, x1, y1 = area
    done = 0
    while done < count:
        x, y = rng.integers(x0, x1), rng.integers(y0, y1)
        if not paint[y, x]:
            continue
        pts = jag(rng, int(x), int(y), int(rng.choice([-2, 2])), int(rng.integers(-1, 2)), int(rng.integers(3, 7)))
        L.d.line(pts, fill=(70, 66, 78, 255), width=1)
        L.d.line([(px, py + 1) for px, py in pts], fill=(236, 236, 242, 200), width=1)
        done += 1


def dent(L, box, deep):
    x0, y0, x1, y1 = box
    L.d.arc((x0, y0, x1, y1), 200, 340, fill=(60, 56, 70, 255), width=1)
    L.d.arc((x0 + 1, y0 + 1, x1 + 1, y1 + 1), 20, 160, fill=(250, 250, 255, 230), width=1)


def chips(L, rng, paint, count, area):
    x0, y0, x1, y1 = area
    done = 0
    while done < count:
        x, y = int(rng.integers(x0, x1)), int(rng.integers(y0, y1))
        if not paint[y, x]:
            continue
        w, h = int(rng.integers(1, 4)), int(rng.integers(1, 3))
        L.d.rectangle((x, y, x + w, y + h), fill=(132, 136, 146, 255))
        L.d.line([(x, y + h + 1), (x + w, y + h + 1)], fill=(52, 50, 60, 255))
        L.d.point((x, y), fill=(178, 182, 190, 255))
        done += 1


def cracks(L, rng, centre, rays, length):
    cx, cy = centre
    L.d.rectangle((cx - 1, cy - 1, cx + 1, cy + 1), fill=(225, 235, 250, 255))
    for k in range(rays):
        ang = 2 * np.pi * (k + rng.random() * .6) / rays
        x, y = float(cx), float(cy)
        pts = [(cx, cy)]
        for _ in range(int(length * (.6 + .4 * rng.random()))):
            ang += rng.normal(0, .25)
            x += np.cos(ang); y += np.sin(ang)
            pts.append((round(x), round(y)))
        L.d.line(pts, fill=(212, 226, 245, 235), width=1)


def smoke(L, rng, start, puffs):
    """Opaque stepped puffs rising from the hood and drifting right: shadow lower right,
    mid tone, highlight upper left. Puffs grow and fade with height."""
    x, y = start
    path = []
    for i in range(puffs):
        path.append((x, y, 2 + i // 2, i))
        x += int(rng.integers(0, 3)); y -= 3
    for x, y, r, i in reversed(path):
        tone = 62 + 13 * i
        a = 255 if i < 6 else 255 - 30 * (i - 5)
        L.d.ellipse((x - r + 1, y - r + 1, x + r + 1, y + r + 1), fill=(tone - 44, tone - 44, tone - 38, a))
        L.d.ellipse((x - r, y - r, x + r, y + r), fill=(tone, tone, tone + 6, a))
        h = max(1, r // 2)
        L.d.ellipse((x - r + 1, y - r + 1, x - r + 1 + h, y - r + 1 + h), fill=(tone + 42, tone + 42, tone + 48, a))


def lamp_mask(base, box, kind):
    x0, y0, x1, y1 = box
    a = base[y0:y1, x0:x1].astype(np.int32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    if kind == 'head':
        m = (b > r + 6) & (r + g + b < 520) & (greenness(a) < 60)
    else:
        m = (r > 120) & (b > 120) & (g < 110)
    full = np.zeros(base.shape[:2], bool)
    full[y0:y1, x0:x1] = m
    return full


def glow(mask, direction, reach):
    """Stepped glow strength (0..1, 4 levels) spreading `reach` cells from a lamp, mostly one way."""
    strength = np.zeros(mask.shape)
    grown = mask.copy()
    for k in range(1, reach + 1):
        step = np.roll(grown, direction * P, 0) if direction else grown
        grown = step | np.roll(grown, P, 1) | np.roll(grown, -P, 1) | grown
        strength = np.maximum(strength, np.where(grown, (reach + 1 - k) / (reach + 1), 0))
    strength[mask] = 0
    return np.ceil(strength * 4) / 4


def lit(rgb, mask, core, rim):
    inner = mask & np.roll(mask, 3, 0) & np.roll(mask, -3, 0) & np.roll(mask, 3, 1) & np.roll(mask, -3, 1)
    rgb[mask] = rim
    rgb[inner] = core


def over(rgba, layer_rgb, layer_a):
    """Porter-Duff 'over' of a colour layer with alpha (0..1) on an RGBA float image."""
    a0 = rgba[..., 3:4] / 255
    a1 = layer_a[..., None]
    a = a1 + a0 * (1 - a1)
    rgb = (layer_rgb * a1 + rgba[..., :3] * a0 * (1 - a1)) / np.maximum(a, 1e-6)
    return np.dstack([rgb, a[..., 0] * 255])


def main(src, out_dir):
    out_dir = Path(out_dir); out_dir.mkdir(parents=True, exist_ok=True)
    img = Image.open(src).convert('RGB')
    src_rgb = np.array(img)
    keyed = key(img).astype(np.float64)
    sil = keyed[..., 3] > 127
    small, gsize = grid(src_rgb.astype(np.float64))
    body, paint, glass = classes(small)
    paint_in = erode(paint, 1)
    rng = np.random.default_rng(SEED)
    ys, xs = np.nonzero(body)
    bx0, by0, bx1, by1 = xs.min(), ys.min(), xs.max(), ys.max()
    whole = (bx0, by0, bx1, by1)
    cx = (bx0 + bx1) // 2

    def inside(base, layer):
        e = up(layer.arr(), keyed.shape)
        a = e[..., 3:4] / 255 * sil[..., None]
        out = base.copy()
        out[..., :3] = base[..., :3] * (1 - a) + e[..., :3] * a
        return out

    def outside_ok(base, layer):
        e = up(layer.arr(), keyed.shape)
        return over(base, e[..., :3], e[..., 3] / 255)

    gy, gx = np.nonzero(glass)
    windscreen = (int(np.median(gx[gy < np.median(gy)])), int(np.percentile(gy, 20)))
    rear_glass = (int(np.median(gx)), int(np.percentile(gy, 70)))
    states = {}
    L = Layer(gsize)
    scratches(L, rng, paint_in, 7, whole)
    dent(L, (bx0 + 2, by0 + 10, bx0 + 12, by0 + 24), 1)
    states['danno1'] = inside(keyed, L)
    # creased hood: two short bent folds, not ruled lines across the car
    for i, y in enumerate((by0 + 9, by0 + 13)):
        w = 7 - 2 * i
        L.d.line([(cx - w - 3, y + 2), (cx - 2, y), (cx + 3, y + 2), (cx + w + 4, y)], fill=(96, 92, 108, 255))
        L.d.line([(cx - w - 3, y + 3), (cx - 2, y + 1), (cx + 3, y + 3), (cx + w + 4, y + 1)], fill=(246, 246, 252, 220))
    cracks(L, rng, windscreen, 7, 9)
    chips(L, rng, paint_in, 12, whole)
    states['danno2'] = inside(keyed, L)
    chips(L, rng, paint_in, 16, whole)
    scratches(L, rng, paint_in, 6, whole)
    dent(L, (bx1 - 20, by1 - 34, bx1 - 9, by1 - 22), 1)
    cracks(L, rng, rear_glass, 5, 6)
    L.d.ellipse((bx0 + 20, by0 + 3, bx1 - 20, by0 + 26), fill=(30, 28, 34, 90))
    d3 = inside(keyed, L)
    sm = Layer(gsize)
    smoke(sm, rng, (cx + 3, by0 + 22), 10)
    states['danno3'] = outside_ok(d3, sm)

    head = np.zeros(sil.shape, bool)
    for b in HEAD:
        head |= lamp_mask(src_rgb, b, 'head')
    tail = np.zeros(sil.shape, bool)
    for b in TAIL:
        tail |= lamp_mask(src_rgb, b, 'tail')
    night = keyed.copy()
    rgb = night[..., :3]
    lit(rgb, head, (246, 226, 255), (176, 96, 255))
    lit(rgb, tail, (255, 214, 206), (236, 40, 52))
    night = over(night, np.full(rgb.shape, (170, 90, 255), float), glow(head, -1, 3) * .6)
    night = over(night, np.full(rgb.shape, (230, 40, 50), float), glow(tail, 1, 2) * .55)
    states['notte_a'] = night.copy()
    side = np.zeros(sil.shape, bool)
    for frac in (.34, .80):
        yy = int(by0 * P + (by1 - by0) * P * frac)
        row = np.nonzero(sil[yy])[0]
        for x in (row.min() + 8, row.max() - 8 - 18):
            side[yy:yy + 24, x:x + 18] = True
    side &= sil
    rgb = night[..., :3]
    lit(rgb, side, (250, 236, 255), (186, 110, 255))
    states['notte_b'] = over(night, np.full(rgb.shape, (170, 90, 255), float), glow(side, 0, 2) * .55)

    report = {}
    for name, arr in states.items():
        arr = np.clip(np.round(arr), 0, 255).astype(np.uint8)
        arr[arr[..., 3] == 0] = 0
        Image.fromarray(arr, 'RGBA').save(out_dir / f'rival03_{name}.png', optimize=True)
        changed = np.any(arr != np.round(keyed).astype(np.uint8), axis=2)
        vis = arr[..., 3] > 127
        report[name] = {'changed_pixels': int(changed.sum()),
                        'changed_outside_silhouette': int((changed & ~sil).sum()),
                        'opaque_outside_silhouette': int((vis & ~sil).sum())}
    Image.fromarray(np.round(keyed).astype(np.uint8), 'RGBA').save(out_dir / 'rival03_base_keyed.png', optimize=True)
    print(json.dumps(report, indent=1))


if __name__ == '__main__':
    main(*sys.argv[1:3])
