"""Ash Docks race roads from Terra's unmarked bodies (Terra round 1, G4 with variants).

Usage: python3 -I tools/build_ashdocks_roads.py <delivery dir> [--check] [--out=<dir>]

Terra delivers, for each variant in VARIANTS:
  ASHDOCKS_road_<variant>_body.png   720x1392, daylight, no lane markings
  ASHDOCKS_road_<variant>_light.png  720x1392, night light map: lamp pools, reflections, windows on black
and once: ASHDOCKS_joint.png 720x48 (the steel expansion joint shared by every variant) and
ASHDOCKS_joint_light.png 720x48.
Night is built, not redrawn: the day body is graded to night (NIGHT_GRADE) and the light map is added,
so day and night share every pixel of geometry by construction.
A runtime tile is joint[24:48] + body + joint[0:24] (720x1440): every tile starts and ends inside the
same joint, so any variant follows any other without a seam to repaint. Lane markings are drawn here,
last and technically: four dashed lines at x 222/314/406/498, 43 px dashes every 144 px from y 48, so
the rhythm is exact across tiles (1440 = 10 x 144) and no dash meets the joint.

Checks (the delivery is refused, never repaired): sizes; no markings already painted on the lane
lines; kerbs at x 130 and 590 (+-6 px) in every body; light maps black where nothing is lit (they
add light, they do not repaint the road). Output: game/art/v10/race_ashdocks_<variant>_<light>.png and a report.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
VARIANTS = ('banchina', 'gru', 'deposito')
W, H, BODY, JOINT = 720, 1440, 1392, 48
LANES, DASH, PERIOD, FIRST, DASH_W = (222, 314, 406, 498), 43, 144, 48, 6
KERBS, KERB_TOL, KERB_STEP = (130, 590), 6, 25
NIGHT_GRADE, DARK_SHARE = np.array([.30, .36, .50]), .5
INK = {'day': (226, 222, 204), 'night': (150, 172, 184)}


def lum(a):
    return a[..., :3].astype(float) @ (.299, .587, .114)


def painted_markings(body):
    """Bright, long vertical runs on a lane line mean the generator painted markings anyway."""
    g = lum(body)
    found = []
    for x in LANES:
        line = g[:, x - 3:x + 4].mean(axis=1)
        side = np.concatenate([g[:, x - 16:x - 8], g[:, x + 9:x + 17]], axis=1).mean(axis=1)
        bright = line - side > 28
        run = best = 0
        for v in bright:
            run = run + 1 if v else 0
            best = max(best, run)
        if best >= 25:
            found.append({'x': x, 'longest_bright_run_px': int(best)})
    return found


def kerbs(body):
    """Light kerb against dark asphalt: brightness falls at x 130 and rises at x 590."""
    grad = np.diff(lum(body).mean(axis=0))
    out = []
    for k, sign in zip(KERBS, (-1, 1)):
        lo, hi = k - KERB_TOL, k + KERB_TOL + 1
        x = int(lo + (sign * grad[lo:hi]).argmax())
        out.append({'expected': k, 'found': x, 'step': round(float(sign * grad[x]), 1), 'ok': bool(sign * grad[x] >= KERB_STEP)})
    return out


def night(body, light):
    """Day graded to night plus Terra's light map (additive)."""
    out = body[..., :3].astype(float) * NIGHT_GRADE + light[..., :3].astype(float) * (light[..., 3:4] / 255)
    return np.dstack([np.minimum(out, 255).round().astype(np.uint8), body[..., 3]])


def mark(tile, light):
    out = tile.astype(float)
    ink = np.array(INK[light], float)
    for x in LANES:
        for y in range(FIRST, H, PERIOD):
            seg = out[y:y + DASH, x - DASH_W // 2:x + DASH_W // 2, :3]
            seg[:] = seg * .12 + ink * .88
    return out.round().astype(np.uint8)


def dashes(tile, x):
    """[start y, length] of every dash on column x, joint rows excluded."""
    g = lum(tile)[:, x].copy()
    g[:JOINT // 2] = g[-JOINT // 2:] = np.median(g)
    on = g > np.median(g) + 40
    runs, start = [], None
    for y, v in enumerate(np.append(on, False)):
        if v and start is None:
            start = y
        elif not v and start is not None:
            runs.append([int(start), int(y - start)])
            start = None
    return runs


def main(src, check=False, dest=None):
    dest = Path(dest) if dest else ROOT / 'game/art/v10'
    dest.mkdir(parents=True, exist_ok=True)
    src = Path(src)
    fails, report = [], {'variants': {}, 'joint': {}}
    load = lambda name: np.asarray(Image.open(src / name).convert('RGBA'))
    joint, joint_light = load('ASHDOCKS_joint.png'), load('ASHDOCKS_joint_light.png')
    for name, j in (('joint', joint), ('joint light', joint_light)):
        if j.shape[:2] != (JOINT, W):
            fails.append(f'{name}: {j.shape[1]}x{j.shape[0]}, expected {W}x{JOINT}')
    bodies = {}
    for v in VARIANTS:
        b, light = load(f'ASHDOCKS_road_{v}_body.png'), load(f'ASHDOCKS_road_{v}_light.png')
        if b.shape[:2] != (BODY, W) or light.shape[:2] != (BODY, W):
            fails.append(f'{v}: body {b.shape[1]}x{b.shape[0]}, light {light.shape[1]}x{light.shape[0]}, expected {W}x{BODY}')
            continue
        if (b[..., 3] < 255).any():
            fails.append(f'{v}: transparent pixels in a road body')
        lit = lum(light) * light[..., 3] / 255 > 12
        info = {'painted_markings': painted_markings(b), 'kerbs': kerbs(b), 'lit_share': round(float(lit.mean()), 3)}
        if info['painted_markings']:
            fails.append(f'{v}: lane markings already painted {info["painted_markings"]}')
        if not all(k['ok'] for k in info['kerbs']):
            fails.append(f'{v}: kerbs not found at {list(KERBS)} +-{KERB_TOL} ({info["kerbs"]})')
        if info['lit_share'] > 1 - DARK_SHARE:
            fails.append(f'{v}: light map lights {info["lit_share"]:.0%} of the tile; it must stay black where nothing is lit')
        bodies[v] = (b, light)
        report['variants'][v] = info
    if fails:
        report.update(result='FAIL', fails=fails)
        print(json.dumps(report, indent=1))
        return 1
    tiles = {}
    for v, (b, light) in bodies.items():
        day = np.concatenate([joint[24:], b, joint[:24]])
        lights = np.concatenate([joint_light[24:], light, joint_light[:24]])
        tiles[(v, 'day')] = mark(day, 'day')
        tiles[(v, 'night')] = mark(night(day, lights), 'night')
    for (v, tod), tile in tiles.items():
        info = report['variants'][v].setdefault(tod, {})
        info['dashes_x222'] = dashes(tile, 222)
        info['dashes_x314'] = dashes(tile, 314)
        info['seam_rgb_diff_1439_0'] = round(float(np.abs(tile[-1, :, :3].astype(int) - tile[0, :, :3].astype(int)).mean()), 2)
        out = dest / f'race_ashdocks_{v}_{tod}.png'
        if check:
            if not np.array_equal(np.asarray(Image.open(out).convert('RGBA')), tile):
                print(f'{out} is stale')
                return 1
        else:
            Image.fromarray(tile).save(out, optimize=True)
    report['result'] = 'PASS'
    if not check:
        (dest / 'ashdocks-roads-report.json' if dest != ROOT / 'game/art/v10' else ROOT / 'docs/evidence/v10.2/ashdocks-roads-report.json').write_text(json.dumps(report, indent=1) + '\n')
    print('PASS')
    return 0


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    out = next((a.split('=', 1)[1] for a in sys.argv if a.startswith('--out=')), None)
    sys.exit(main(args[0], '--check' in sys.argv, out))
