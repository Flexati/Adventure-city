"""Chroma key for images returned by GPT on a 'pure' green that is never pure.

GPT backgrounds measure around (18, 242, 17) with noise and slight gradients, so a
distance from #00FF00 is unreliable. Greenness = G - max(R, B) separates them well:
background >= 226, art below ~110 (petrol, teal and green side lamps included).
Spill is removed only on the edge band, never on the inside of the art.
"""
import numpy as np
from PIL import Image

BG_LO, ART_HI = 200, 120  # greenness >= BG_LO is background (GPT backgrounds measure >= 226), <= ART_HI is art
EDGE_BAND = 3            # pixels from the background where spill is suppressed


def greenness(rgb):
    a = rgb.astype(np.int32)
    return a[..., 1] - np.maximum(a[..., 0], a[..., 2])


def _dilate(m, r):
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= np.roll(np.roll(m, dy, 0), dx, 1)
    return out


def key(img):
    """RGB(A) image -> RGBA uint8 array with the green removed and edge spill suppressed."""
    rgb = np.array(img.convert('RGB'))
    g = greenness(rgb)
    alpha = np.clip((BG_LO - g) / (BG_LO - ART_HI), 0, 1)
    bg = alpha == 0
    edge = _dilate(bg, EDGE_BAND) & ~bg
    out = rgb.astype(np.int32)
    cap = np.maximum(out[..., 0], out[..., 2]) + 8
    out[..., 1] = np.where(edge, np.minimum(out[..., 1], cap), out[..., 1])
    rgba = np.dstack([np.clip(out, 0, 255), np.round(alpha * 255)]).astype(np.uint8)
    rgba[bg] = 0
    return rgba


def largest_component_box(mask):
    """Bounding box (x0, y0, x1, y1 exclusive) of the largest 4-connected component."""
    from collections import deque
    h, w = mask.shape
    seen = np.zeros_like(mask, bool)
    best, best_box = 0, None
    ys, xs = np.nonzero(mask)
    for y0, x0 in zip(ys, xs):
        if seen[y0, x0]:
            continue
        q = deque([(y0, x0)]); seen[y0, x0] = True
        n, bx0, by0, bx1, by1 = 0, x0, y0, x0, y0
        while q:
            y, x = q.popleft(); n += 1
            bx0, bx1, by0, by1 = min(bx0, x), max(bx1, x), min(by0, y), max(by1, y)
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True; q.append((ny, nx))
        if n > best:
            best, best_box = n, (bx0, by0, bx1 + 1, by1 + 1)
    return best_box


def resize_rgba(rgba, size):
    """Area-average downscale on premultiplied colour: no ringing, no dark or green halo."""
    a = rgba.astype(np.float64)
    pm = np.dstack([a[..., :3] * a[..., 3:4] / 255, a[..., 3]])
    chans = [np.array(Image.fromarray(pm[..., i].astype(np.float32), 'F').resize(size, Image.BOX)) for i in range(4)]
    al = np.clip(chans[3], 0, 255)
    rgb = np.dstack(chans[:3]) * 255 / np.maximum(al, 1e-6)[..., None]
    out = np.dstack([np.clip(rgb, 0, 255), al])
    out[al < 1] = 0
    return np.round(out).astype(np.uint8)
