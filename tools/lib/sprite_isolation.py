"""Pose isolation shared by the sheet builders: masters routinely cross their nominal cell lines.

Each 4x4 master is split by 8-connected components; a component belongs to the cell holding its
centroid, and low-alpha halo pixels follow the nearest owned pixel. Pixels are never redrawn.
"""
from collections import deque
import numpy as np

OPAQUE, HALO = 64, 6


def components(mask):
    """8-connected labels; plain BFS keeps the tool dependency-free (numpy + Pillow only)."""
    labels = np.zeros(mask.shape, np.int32)
    h, w = mask.shape
    n = 0
    for y0, x0 in zip(*np.nonzero(mask)):
        if labels[y0, x0]:
            continue
        n += 1
        labels[y0, x0] = n
        q = deque([(y0, x0)])
        while q:
            y, x = q.popleft()
            for yy in (y - 1, y, y + 1):
                if yy < 0 or yy >= h:
                    continue
                for xx in (x - 1, x, x + 1):
                    if 0 <= xx < w and mask[yy, xx] and not labels[yy, xx]:
                        labels[yy, xx] = n
                        q.append((yy, xx))
    return labels, n


def isolate(rgba, rows=4, cols=4):
    """Return {(row,col): (layer, opaque_mask)} with each pose's pixels in master coordinates."""
    h, w = rgba.shape[:2]
    cw, ch = w / cols, h / rows
    alpha = rgba[..., 3]
    labels, n = components(alpha > OPAQUE)
    ys, xs = np.nonzero(labels)
    lab = labels[ys, xs]
    count = np.bincount(lab, minlength=n + 1)
    cy = np.bincount(lab, ys, n + 1) / np.maximum(count, 1)
    cx = np.bincount(lab, xs, n + 1) / np.maximum(count, 1)
    owner = np.minimum(rows - 1, cy // ch).astype(int) * cols + np.minimum(cols - 1, cx // cw).astype(int)
    owner[0] = -1
    cell_of = owner[labels]
    # Antialias/halo pixels (alpha <= OPAQUE) follow the nearest owned pixel within HALO px.
    grown = cell_of.copy()
    for _ in range(HALO):
        src = grown.copy()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            shifted = np.roll(src, (dy, dx), (0, 1))
            fill = (grown < 0) & (shifted >= 0) & (alpha > 0)
            grown[fill] = shifted[fill]
    out = {}
    for idx in range(rows * cols):
        keep = grown == idx
        layer = np.where(keep[..., None], rgba, 0).astype(np.uint8)
        out[divmod(idx, cols)] = (layer, keep & (alpha > OPAQUE))
    return out, (cw, ch)


def main_body(rgba, mask):
    """Largest opaque component of one isolated pose: detached VFX never moves the ground line."""
    labels, n = components(mask)
    if n <= 1:
        return mask
    sizes = np.bincount(labels.ravel())
    sizes[0] = 0
    return labels == sizes.argmax()


def foot(mask):
    ys, xs = np.nonzero(mask)
    top, bottom = ys.min(), ys.max()
    low = xs[ys > bottom - (bottom - top) * 0.12]
    return float(np.median(low)), int(bottom), int(top)
