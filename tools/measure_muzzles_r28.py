#!/usr/bin/env python3
"""R28 (D72): where the barrel of each gun sheet is.

For every equipped gun sheet and every row (0 side, 1 up, 2 down, 3 up-diagonal) the release frame (column 1) carries a
painted flash that column 0 does not. Its whitest core sits on the muzzle. This script finds it and turns it into world
pixels from the hero's feet, facing right, with the same transform as drawLegacySprite (game/chrono-art.mjs, size 112).

  python3 tools/measure_muzzles_r28.py            # prints the table
  python3 tools/measure_muzzles_r28.py --check    # exits 1 if MUZZLE_V9 in game/weapons-v9.mjs differs by more than 2 px

Reads the sheets only; writes nothing.
"""
import json, re, sys
from collections import deque
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LAYOUT = {  # game/sheet-layout.mjs: cw, ch, CW, CH, px, top
    'nox': ('game/art/v05/nox_gun.png', 326.25, 301.5, 357, 343, 15, 36),
    'lulu': ('game/art/v05/lulu_gun.png', 326.25, 301.5, 369, 346, 21, 39),
    'nox_vx9': ('game/art/v10/nox_vx9_gun.png', 326.25, 301.25, 419, 337, 46, 30),
    'lulu_r12': ('game/art/v10/lulu_r12_gun.png', 326.25, 301.25, 377, 348, 25, 41),
}


def cell(px, CW, CH, col, row):
    return [[px[col * CW + x, row * CH + y] for x in range(CW)] for y in range(CH)]


def flash_core(sheet, CW, CH, row):
    c0, c1 = cell(sheet, CW, CH, 0, row), cell(sheet, CW, CH, 1, row)
    H, W = len(c1), len(c1[0])
    mask = [[False] * W for _ in range(H)]
    for y in range(H):
        for x in range(W):
            r, g, b, a = c1[y][x]
            hi, lo = max(r, g, b), min(r, g, b)
            diff = sum(abs(c1[y][x][k] - c0[y][x][k]) for k in range(4))
            mask[y][x] = a > 150 and hi > 200 and hi - lo > 70 and diff > 150
    # largest blob of flash pixels (8-neighbours, 3 px of slack so the rays join the core)
    seen = [[False] * W for _ in range(H)]
    best = []
    for y in range(H):
        for x in range(W):
            if not mask[y][x] or seen[y][x]:
                continue
            blob, q = [], deque([(x, y)])
            seen[y][x] = True
            while q:
                u, v = q.popleft()
                blob.append((u, v))
                for dy in range(-3, 4):
                    for dx in range(-3, 4):
                        a, b = u + dx, v + dy
                        if 0 <= a < W and 0 <= b < H and mask[b][a] and not seen[b][a]:
                            seen[b][a] = True
                            q.append((a, b))
            if len(blob) > len(best):
                best = blob
    near = {(u + dx, v + dy) for u, v in best for dx in range(-3, 4) for dy in range(-3, 4)}  # the blob, 3 px wider
    core = [(x, y) for x, y in near if 0 <= x < W and 0 <= y < H and c1[y][x][3] > 200 and min(c1[y][x][:3]) > 225]
    return sum(p[0] for p in core) / len(core), sum(p[1] for p in core) / len(core)


def measure():
    table = {}
    for name, (path, cw, ch, CW, CH, px, top) in LAYOUT.items():
        sheet = Image.open(ROOT / path).convert('RGBA').load()
        s = 112 / ch
        rows = []
        for row in range(4):
            u, v = flash_core(sheet, CW, CH, row)
            rows.append([round(-(cw / 2 + px) * s + u * s), round(-112 + 6 - top * s + v * s)])
        table[name] = rows
    return table


if __name__ == '__main__':
    table = measure()
    print(json.dumps(table))
    if '--check' in sys.argv:
        src = (ROOT / 'game/weapons-v9.mjs').read_text()
        m = re.search(r'MUZZLE_V9=Object\.freeze\((\{.*?\})\);', src)
        game = json.loads(re.sub(r'(\w+):', r'"\1":', m.group(1)))
        bad = [(k, i, game[k][i], table[k][i]) for k in table for i in range(4)
               if max(abs(game[k][i][0] - table[k][i][0]), abs(game[k][i][1] - table[k][i][1])) > 2]
        for b in bad:
            print('differs:', *b)
        print('MUZZLE_V9 matches the sheets' if not bad else 'MUZZLE_V9 does not match the sheets')
        sys.exit(1 if bad else 0)
