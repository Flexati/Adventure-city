"""Runtime impact atlases from the Astra G9 candidates for the weapons already in play.

Usage: python3 tools/build_astra_vfx.py <astra asset_nuovi dir>

Each candidate is 512x384, 4x3 cells of 128x128: rows projectile, body impact, wall impact. C-9 and
VX-9 are copied as delivered. R-12 carries a few specks (3-19 px) cut at the top of the export frame
in rows 1-2; detached specks lying wholly in the band y 16-30 of a cell are dropped. Never redrawn.
H-17 and ARC-7 are not built: those weapons are not reachable in the campaign yet.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent / 'lib'))
from sprite_isolation import components  # noqa: E402

OUT = Path(__file__).resolve().parents[1] / 'game/art/v10'


def specks(a):
    removed = 0
    for r in range(3):
        for c in range(4):
            cell = a[r * 128:(r + 1) * 128, c * 128:(c + 1) * 128]
            labels, n = components(cell[..., 3] > 24)
            for i in range(1, n + 1):
                ys, _ = np.nonzero(labels == i)
                if ys.min() >= 16 and ys.max() < 30 and len(ys) < 30:
                    cell[labels == i] = 0
                    removed += 1
    return removed


def main(src):
    for weapon in ('c9', 'vx9', 'r12'):
        a = np.asarray(Image.open(Path(src) / f'VFX_{weapon}_impact.png').convert('RGBA')).copy()
        assert a.shape[:2] == (384, 512), a.shape
        removed = specks(a) if weapon == 'r12' else 0
        Image.fromarray(a).save(OUT / f'vfx_{weapon}.png', optimize=True)
        print(weapon, 'specks removed', removed)


if __name__ == '__main__':
    main(sys.argv[1])
