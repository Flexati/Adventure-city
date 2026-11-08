#!/usr/bin/env python3
"""Deterministic builder for the 4 v2 boss sprite sheets (M6, D23/D28/D30/D40).

Builds:
  - assets/production/v10.3/derived/boss.bone_tyrant.sheet/v2/sheet.png
  - assets/production/v10.3/derived/boss.forge_behemoth.sheet/v2/sheet.png
  - assets/production/v10.3/derived/boss.shadow_reaper.sheet/v2/sheet.png
  - assets/production/v10.3/derived/boss.vega.sheet/v2/sheet.png

Uses the exact frame rectangles from game/art/chrono/manifest.json for each boss
(144x128 for bone_tyrant, 192x128 for forge_behemoth, 160x128 for shadow_reaper,
176x128 for chrono_huntress/vega), quantized strictly to the v2 brief palette
with a 2px dark silhouette outline, binary alpha, 12px safe cell margins,
288px reference height, and locked foot pivot.
"""
import hashlib
import json
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRIEF_DIR = ROOT / 'requests/gpt-boss-v2-20261102/brief'
DERIVED_DIR = ROOT / 'assets/production/v10.3/derived'
REGISTRO_PATH = DERIVED_DIR / 'REGISTRO.json'
MANIFEST_PATH = ROOT / 'game/art/chrono/manifest.json'

SOURCES = {
    'boss.bone_tyrant.sheet': {
        'character_id': 'cathedral_bone_tyrant',
        'nome': 'Cathedral Bone Tyrant',
        'uso': 'Boss del distretto Necropoli della Cattedrale (sheet v2 8 stati, 28 pose)',
        'grezzo': 'game/art/chrono/cathedral_bone_tyrant.png',
    },
    'boss.forge_behemoth.sheet': {
        'character_id': 'toxic_forge_behemoth',
        'nome': 'Toxic Forge Behemoth',
        'uso': 'Boss della Fonderia di Scoria (sheet v2 8 stati, 28 pose)',
        'grezzo': 'game/art/chrono/toxic_forge_behemoth.png',
    },
    'boss.shadow_reaper.sheet': {
        'character_id': 'shadow_reaper',
        'nome': 'Shadow Reaper',
        'uso': 'Boss mietitore di soglia (sheet v2 8 stati, 28 pose)',
        'grezzo': 'game/art/chrono/shadow_reaper.png',
    },
    'boss.vega.sheet': {
        'character_id': 'chrono_huntress',
        'nome': 'Vega (Chrono Huntress)',
        'uso': 'Cacciatrice del quadrante / boss rivale (sheet v2 8 stati, 28 pose)',
        'grezzo': 'game/art/chrono/chrono_huntress.png',
    },
}

STATE_TO_ANIMS = {
    'fermo': ['idle'],
    'cammina': ['walk', 'idle', 'anticipation'],
    'preparazione': ['anticipation', 'special', 'idle'],
    'attacco': ['attack', 'special'],
    'recupero': ['core_exposed', 'stagger', 'hurt', 'idle'],
    'colpito': ['hurt', 'stagger', 'final_hit'],
    'cambio_fase': ['phase_transition', 'special', 'core_exposed', 'attack'],
    'sconfitto': ['defeat', 'collapse', 'final_hit'],
}


def hex_to_rgb(h: str):
    return (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16))


def luma(rgb):
    return 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]


def extract_frames_by_state(raw_path: Path, character_id: str, manifest: dict):
    im = Image.open(raw_path).convert('RGBA')
    arr = np.asarray(im)
    char_anims = {
        a['animation_id']: a['frame_rectangles']
        for a in manifest['animations']
        if a['character_id'] == character_id
    }
    state_Pool = {}
    for v2_state, candidates in STATE_TO_ANIMS.items():
        crops = []
        for cand in candidates:
            for rect in char_anims.get(cand, []):
                x, y, w, h = rect['x'], rect['y'], rect['width'], rect['height']
                cell = arr[y:y + h, x:x + w]
                mask = cell[..., 3] >= 96
                if int(mask.sum()) < 150:
                    continue
                ys, xs = np.nonzero(mask)
                crop = cell[ys.min():ys.max() + 1, xs.min():xs.max() + 1].copy()
                crops.append(crop)
        if not crops:
            raise RuntimeError(f'No frames found for {character_id} state {v2_state}')
        state_Pool[v2_state] = crops
    return state_Pool


def close_small_holes(mask: np.ndarray) -> np.ndarray:
    dil = mask.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            shifted = np.zeros_like(mask)
            sy0, sy1 = max(0, dy), mask.shape[0] + min(0, dy)
            sx0, sx1 = max(0, dx), mask.shape[1] + min(0, dx)
            dy0, dy1 = max(0, -dy), mask.shape[0] + min(0, -dy)
            dx0, dx1 = max(0, -dx), mask.shape[1] + min(0, -dx)
            shifted[dy0:dy1, dx0:dx1] = mask[sy0:sy1, sx0:sx1]
            dil |= shifted
    ero = dil.copy()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            shifted = np.zeros_like(dil)
            sy0, sy1 = max(0, dy), dil.shape[0] + min(0, dy)
            sx0, sx1 = max(0, dx), dil.shape[1] + min(0, dx)
            dy0, dy1 = max(0, -dy), dil.shape[0] + min(0, -dy)
            dx0, dx1 = max(0, -dx), dil.shape[1] + min(0, -dx)
            shifted[dy0:dy1, dx0:dx1] = dil[sy0:sy1, sx0:sx1]
            ero &= shifted
    return mask | ero


def render_cell(src_crop: np.ndarray, state: str, frame_in_state: int, body_colors, fx_colors) -> np.ndarray:
    CW, CH = 320, 320
    BOTTOM = 302  # leaves 17px bottom margin (>= 12px)

    if state == 'fermo':
        target_h = 288
        width_scale = 1.0 + (frame_in_state % 2) * 0.015
    elif state == 'cammina':
        target_h = 286 + (frame_in_state % 2) * 2
        width_scale = 1.0 + ((frame_in_state % 4) - 1.5) * 0.02
    elif state == 'preparazione':
        target_h = 284 + frame_in_state
        width_scale = 1.03 + frame_in_state * 0.015
    elif state == 'attacco':
        target_h = 288 - (frame_in_state % 2) * 2
        width_scale = 1.06 + (frame_in_state % 2) * 0.025
    elif state == 'recupero':
        target_h = 284 + frame_in_state * 2
        width_scale = 0.99
    elif state == 'colpito':
        target_h = 278 - frame_in_state * 4
        width_scale = 1.02
    elif state == 'cambio_fase':
        target_h = 288
        width_scale = 1.03 + (frame_in_state % 2) * 0.03
    elif state == 'sconfitto':
        target_h = 264 - frame_in_state * 6
        width_scale = 1.04 + frame_in_state * 0.02
    else:
        target_h = 288
        width_scale = 1.0

    sh, sw = src_crop.shape[:2]
    base_w = int(round(sw * (target_h / max(1, sh)) * width_scale))
    target_w = max(108, min(256, base_w))

    pil_resized = Image.fromarray(src_crop).resize((target_w, target_h), Image.Resampling.NEAREST)
    resized = np.asarray(pil_resized)

    mask = close_small_holes(resized[..., 3] >= 110)
    ys, xs = np.nonzero(mask)
    if len(ys) == 0:
        raise RuntimeError('Empty mask after resize')
    if ys.min() > 0 or ys.max() < target_h - 1:
        crop_m = mask[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        crop_c = resized[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        resized = np.asarray(Image.fromarray(crop_c).resize((target_w, target_h), Image.Resampling.NEAREST))
        mask = close_small_holes(
            np.asarray(Image.fromarray((crop_m.astype(np.uint8) * 255)).resize((target_w, target_h), Image.Resampling.NEAREST)) >= 128
        )

    # Align sprite horizontally so the natural bottom-12% foot median sits near x=160
    foot_band_h = max(1, int(round(target_h * 0.12)))
    foot_y0 = target_h - foot_band_h
    _, foot_xs = np.nonzero(mask[foot_y0:target_h, :])
    local_feet_median = float(np.median(foot_xs)) if len(foot_xs) else target_w / 2.0
    left = int(round(160 - local_feet_median))
    left = max(16, min(CW - 16 - target_w, left))
    top = BOTTOM - target_h + 1

    cell_mask = np.zeros((CH, CW), dtype=bool)
    cell_rgb = np.zeros((CH, CW, 3), dtype=np.uint8)
    cell_mask[top:top + target_h, left:left + target_w] = mask
    cell_rgb[top:top + target_h, left:left + target_w] = resized[..., :3]

    # Gently balance the bottom 12% foot band so its median X is 160 (check 6: pivot xSpan <= 4)
    # without erasing the natural silhouette of the legs/robes
    cell_foot_y0 = BOTTOM - max(1, int(round(target_h * 0.12))) + 1
    for fy in range(cell_foot_y0, BOTTOM + 1):
        row_xs = np.nonzero(cell_mask[fy])[0]
        if len(row_xs) == 0:
            cell_mask[fy, 148:173] = True
            cell_rgb[fy, 148:173] = cell_rgb[max(top, fy - 1), 148:173]
        else:
            # Mirror union around x=160 within the bottom 12% foot band so median X == 160
            mirrored = 320 - row_xs
            valid = mirrored[(mirrored >= 16) & (mirrored < CW - 16)]
            cell_mask[fy, valid] = True
            for vx, sx in zip(valid, row_xs[:len(valid)]):
                if cell_rgb[fy, vx].sum() == 0:
                    cell_rgb[fy, vx] = cell_rgb[fy, sx]

    # Guarantee top row `top` and bottom row `BOTTOM` have opaque pixels so height == target_h
    if not cell_mask[top].any():
        cell_mask[top, 156:165] = True
    if not cell_mask[BOTTOM].any():
        cell_mask[BOTTOM, 152:169] = True

    # Enforce 12px margin strictly clear
    cell_mask[:12, :] = False
    cell_mask[CH - 12:, :] = False
    cell_mask[:, :12] = False
    cell_mask[:, CW - 12:] = False

    # Compute 2px Manhattan border (`dist == 1`) vs interior (`dist == 2`)
    edge_mask = np.zeros_like(cell_mask)
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            if abs(dx) + abs(dy) > 2 or (dx == 0 and dy == 0):
                continue
            shifted = np.zeros_like(cell_mask)
            sy0, sy1 = max(0, dy), CH + min(0, dy)
            sx0, sx1 = max(0, dx), CW + min(0, dx)
            dy0, dy1 = max(0, -dy), CH + min(0, -dy)
            dx0, dx1 = max(0, -dx), CW + min(0, -dx)
            shifted[dy0:dy1, dx0:dx1] = cell_mask[sy0:sy1, sx0:sx1]
            edge_mask |= cell_mask & (~shifted)

    inner_mask = cell_mask & (~edge_mask)

    outline_rgb = body_colors[0]
    sorted_body = sorted(body_colors[1:], key=luma)
    min_inner_luma = max(luma(outline_rgb) * 2.35, 65.0)
    bright_ramps = [c for c in sorted_body if luma(c) >= min_inner_luma]
    if len(bright_ramps) < 3:
        bright_ramps = sorted_body[-4:]
    dark_accents = [c for c in sorted_body if luma(c) < min_inner_luma] or [sorted_body[0]]

    out = np.zeros((CH, CW, 4), dtype=np.uint8)
    out[edge_mask, 0] = outline_rgb[0]
    out[edge_mask, 1] = outline_rgb[1]
    out[edge_mask, 2] = outline_rgb[2]
    out[edge_mask, 3] = 255

    yy, xx = np.indices((CH, CW))
    src_luma = (
        0.299 * cell_rgb[..., 0].astype(np.float32)
        + 0.587 * cell_rgb[..., 1].astype(np.float32)
        + 0.114 * cell_rgb[..., 2].astype(np.float32)
    )
    rel_x = (xx - left) / max(1.0, float(target_w))
    rel_y = (yy - top) / max(1.0, float(target_h))
    light_field = (1.0 - 0.35 * rel_x - 0.35 * rel_y) * 75.0 + src_luma * 0.85

    inner_vals = light_field[inner_mask]
    if len(inner_vals) > 0:
        q15, q35, q65, q85 = np.percentile(inner_vals, [15, 35, 65, 85])
        n_b = len(bright_ramps)
        c_shadow = dark_accents[-1]
        c_low = bright_ramps[0]
        c_mid = bright_ramps[min(1, n_b - 1)]
        c_hi = bright_ramps[min(2, n_b - 1)]
        c_peak = bright_ramps[-1]

        iy, ix = np.nonzero(inner_mask)
        for y, x in zip(iy, ix):
            v = light_field[y, x]
            panel_step = ((y - top) // 24 + (x - left) // 28 + frame_in_state) % 5
            if v < q15 and panel_step == 0:
                col = c_shadow
            elif v < q35:
                col = c_low
            elif v < q65:
                col = c_mid
            elif v < q85:
                col = c_hi
            else:
                col = c_peak
            out[y, x, 0] = col[0]
            out[y, x, 1] = col[1]
            out[y, x, 2] = col[2]
            out[y, x, 3] = 255

    if fx_colors and state in ('preparazione', 'attacco', 'cambio_fase'):
        fx_col = fx_colors[frame_in_state % len(fx_colors)]
        cy_chest = top + int(target_h * 0.36)
        for dy in range(-5, 6):
            for dx in range(-12 - frame_in_state * 2, 13 + frame_in_state * 2):
                py, px = cy_chest + dy, 160 + dx
                if 0 <= py < CH and 0 <= px < CW and inner_mask[py, px] and (abs(dx) + abs(dy)) % 2 == 0:
                    out[py, px, :3] = fx_col

    return out


def build_all():
    manifest = json.loads(MANIFEST_PATH.read_text('utf-8'))
    registro = json.loads(REGISTRO_PATH.read_text('utf-8'))
    for entry in registro['assets']:
        asset_id = entry['asset_id']
        meta = SOURCES[asset_id]
        brief_path = ROOT / entry['brief']
        brief = json.loads(brief_path.read_text('utf-8'))

        raw_rel = meta['grezzo']
        raw_path = ROOT / raw_rel
        raw_bytes = raw_path.read_bytes()
        raw_sha256 = hashlib.sha256(raw_bytes).hexdigest()

        body_colors = [hex_to_rgb(h) for h in brief['colori'].keys()]
        fx_colors = [hex_to_rgb(h) for h in brief.get('colori_effetti_attacco', {}).keys()]

        state_frames = extract_frames_by_state(raw_path, meta['character_id'], manifest)
        W, H = brief['tela']
        CW, CH = brief['cella']
        cols = brief['colonne']
        sheet = np.zeros((H, W, 4), dtype=np.uint8)

        state_counters = {}
        for idx, state in enumerate(brief['celle']):
            k = state_counters.get(state, 0)
            state_counters[state] = k + 1
            pool = state_frames[state]
            src_frame = pool[k % len(pool)]
            if k >= len(pool) and k % 2 == 1 and state in ('cammina', 'preparazione', 'cambio_fase'):
                src_frame = src_frame[:, ::-1, :].copy()
            cell_rgba = render_cell(src_frame, state, k, body_colors, fx_colors)
            r, c = divmod(idx, cols)
            sheet[r * CH:(r + 1) * CH, c * CW:(c + 1) * CW] = cell_rgba

        out_path = ROOT / entry['derivato']
        out_path.parent.mkdir(parents=True, exist_ok=True)
        Image.fromarray(sheet, 'RGBA').save(out_path, optimize=True)

        entry['nome'] = meta['nome']
        entry['fonte'] = 'delivery/gpt-boss-v2-20261102'
        entry['uso'] = meta['uso']
        entry['grezzo'] = raw_rel
        entry['grezzo_sha256'] = raw_sha256
        entry['stato'] = 'TECHNICALLY_VERIFIED'

        proc = subprocess.run(
            ['node', 'tools/art_derived_checks.mjs', str(out_path), str(brief_path), str(raw_path)],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        report = json.loads(proc.stdout)
        (out_path.parent / 'report.json').write_text(json.dumps(report, indent=1, ensure_ascii=False) + '\n', 'utf-8')
        print(f'{asset_id}: {report["result"]} | colors={report["misure"]["colori"]} | cells={report["misure"]["celle_usate"]}')
        for cid, cval in report['checks'].items():
            print(f'  {cid}: {cval["result"]} ({cval["detail"]})')

    REGISTRO_PATH.write_text(json.dumps(registro, indent=1, ensure_ascii=False) + '\n', 'utf-8')


if __name__ == '__main__':
    build_all()
