"""Runtime end cap for The Anchor's lines from the rejected Astra candidate (decision of the author).

Usage: python3 tools/build_cable_end.py <ARENA_anchor_cable_end.png>

The candidate had three defects: an isolated 1 px line at x 8, the cap centred on x 45 instead of the
rope axis (columns 22-41 of the integrated segment) and 16 empty rows under it. Technical treatment only:
everything outside the cap's main component is cleared, the cap is translated 14 px left and 15 px down
so its body spans x 21-41 and its tip ends on row 63. No pixel is redrawn.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent / 'lib'))
from sprite_isolation import components  # noqa: E402

OUT = Path(__file__).resolve().parents[1] / 'game/art/v10/anchor_cable_end.png'
AXIS, BOTTOM = 31.5, 63


def main(src):
    a = np.asarray(Image.open(src).convert('RGBA')).copy()
    assert a.shape[:2] == (64, 64), a.shape
    labels, n = components(a[..., 3] > 24)
    sizes = np.bincount(labels.ravel())
    main_label = int(sizes[1:].argmax()) + 1
    ys, xs = np.nonzero(labels == main_label)
    # Faint halo pixels belong to the cap only when they touch it; the stray line and its halo go.
    keep = labels == main_label
    for _ in range(2):
        grown = keep.copy()
        grown[1:] |= keep[:-1]; grown[:-1] |= keep[1:]; grown[:, 1:] |= keep[:, :-1]; grown[:, :-1] |= keep[:, 1:]
        keep = grown & (a[..., 3] > 0)
    a[~keep] = 0
    dx = int(round(AXIS - (xs.min() + xs.max()) / 2))
    dy = BOTTOM - int(ys.max())
    out = np.zeros_like(a)
    out[max(0, dy):, max(0, dx) if dx > 0 else 0:64 + min(0, dx)] = a[:64 - max(0, dy), -min(0, dx):64 - max(0, dx)]
    Image.fromarray(out).save(OUT, optimize=True)
    ys2, xs2 = np.nonzero(out[..., 3] > 24)
    print({'shift': [dx, dy], 'body_x': [int(xs2.min()), int(xs2.max())], 'rows': [int(ys2.min()), int(ys2.max())]})


if __name__ == '__main__':
    main(sys.argv[1])
