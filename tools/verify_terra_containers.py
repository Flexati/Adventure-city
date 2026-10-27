"""Footprint check for the Ash Docks container variants (Terra round 1).

Usage: python3 -I tools/verify_terra_containers.py <delivery dir>

Every variant must stand exactly where the model collides: same 128x192 canvas and the same opaque
box as the integrated container (x 16-111, y 22-168, +-2 px), base on y 168, nothing in the outer
8 px. The hit state keeps the box of its normal state (+-2 px).
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

VARIANTS = ('ruggine', 'cobalto', 'verde')
SIZE, BOX, TOL, MARGIN = (128, 192), (16, 22, 111, 168), 2, 8


def box(path):
    a = np.asarray(Image.open(path).convert('RGBA'))
    if a.shape[1::-1] != SIZE:
        return None, f'{path.name}: {a.shape[1]}x{a.shape[0]}, expected {SIZE[0]}x{SIZE[1]}'
    ys, xs = np.nonzero(a[..., 3] > 24)
    if not len(xs):
        return None, f'{path.name}: empty'
    b = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))
    if b[0] < MARGIN or b[1] < MARGIN or b[2] > SIZE[0] - 1 - MARGIN or b[3] > SIZE[1] - 1 - MARGIN:
        return b, f'{path.name}: content inside the outer {MARGIN} px {b}'
    return b, None


def main(src):
    src, fails, report = Path(src), [], {}
    for v in VARIANTS:
        boxes = {}
        for state in ('normale', 'colpito'):
            b, err = box(src / f'RACE_ashdocks_container_{v}_{state}.png')
            boxes[state] = b
            if err:
                fails.append(err)
            elif any(abs(x - y) > TOL for x, y in zip(b, BOX)):
                fails.append(f'{v} {state}: opaque box {b}, expected {BOX} +-{TOL}')
        report[v] = boxes
    print(json.dumps({'result': 'FAIL' if fails else 'PASS', 'fails': fails, 'boxes': report}, indent=1))
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1]))
