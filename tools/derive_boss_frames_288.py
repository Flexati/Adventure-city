#!/usr/bin/env python3
"""Multi-frame boss sheets at 288 px, derived from the poses already in the game.

The 128 px strips (and Vega's nine poses) stay where they are: D28 keeps them as the reference.
This writes a new sheet per boss, game/art/chrono/<id>_288.png, and points the two manifests at it.

Each of the nine states the game already draws gets four frames. Frame 0 is the source pose,
scaled with nearest-neighbour so the pixels stay the pixels of the original. The other three
move that pose: weight, squash, smear, glow. No new colours, no flat stand-ins.

Not produced, because the source has no such pose: a walk cycle, and a recover pose of its own
(the game already draws idle for that). Listed in docs/evidence/r40/boss-frames.json.
"""
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
CELL, MARGIN, SUBJECT = 320, 12, 288
COLS = 6
FEET = CELL - MARGIN - 1  # 307: 12 px of empty floor under the feet
INNER = CELL - 2 * MARGIN  # 296
# Source rectangles on the untouched strips. Stagger shares the phase cell on the three 128 px strips;
# that is a repeated pose, not a hit of its own. Vega's nine poses are all different cells.
def _row(cell):
    # Eight cells, left to right. The hit cell is the same painting as the phase cell.
    order = ['idle', 'anticipation', 'attack', 'phase_transition', 'core_exposed', 'final_hit', 'collapse', 'reward_portal']
    out = {name: (i * cell, 0, cell, 128) for i, name in enumerate(order)}
    out['stagger'] = out['phase_transition']
    return out

SOURCE_RECTS = {
    'cathedral_bone_tyrant': _row(144),
    'toxic_forge_behemoth': _row(192),
    'shadow_reaper': _row(160),
    'vega': {
        'idle': (0, 0, 384, 256), 'anticipation': (384, 0, 384, 256), 'attack': (768, 0, 384, 256),
        'phase_transition': (1152, 0, 384, 256), 'stagger': (1536, 0, 384, 256),
        'core_exposed': (0, 256, 384, 256), 'final_hit': (384, 256, 384, 256),
        'collapse': (768, 256, 384, 256), 'reward_portal': (1152, 256, 384, 256),
    },
}
BOSSES = (
    ('cathedral_bone_tyrant', 'art/chrono/cathedral_bone_tyrant.png'),
    ('toxic_forge_behemoth', 'art/chrono/toxic_forge_behemoth.png'),
    ('shadow_reaper', 'art/chrono/shadow_reaper.png'),
    ('vega', 'art/chrono/vega.png'),
)
STATES = (
    'idle', 'anticipation', 'attack', 'phase_transition', 'stagger',
    'core_exposed', 'final_hit', 'collapse', 'reward_portal',
)
# How the game spends each clip. Idle, core and the portal loop; the others play once and hold.
TIMING = {
    'idle': (6, True), 'anticipation': (8, False), 'attack': (10, False),
    'phase_transition': (8, False), 'stagger': (12, False), 'core_exposed': (6, True),
    'final_hit': (14, False), 'collapse': (10, False), 'reward_portal': (8, True),
    'defeat': (8, False),
}


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def bbox(img):
    ys, xs = np.nonzero(img[..., 3] > 0)
    if len(xs) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())


def crop(img):
    x0, y0, x1, y1 = bbox(img)
    return img[y0:y1 + 1, x0:x1 + 1].copy()


def nn(img, nh, nw):
    h, w = img.shape[:2]
    ys = np.minimum((np.arange(nh) * h / nh).astype(np.int32), h - 1)
    xs = np.minimum((np.arange(nw) * w / nw).astype(np.int32), w - 1)
    return img[ys][:, xs]


def idle_scale(cell):
    """One scale for the whole boss, taken from the idle pose. A wide idle (the Behemoth) stays under 288 rather than lose its shoulders."""
    spr = crop(cell)
    h, w = spr.shape[:2]
    scale = SUBJECT / h
    if round(w * scale) > INNER:
        scale = INNER / w
    return scale


def scale_pose(cell, scale):
    """Same scale as idle when the pose fits in the cell. A weapon wider than the cell is reduced until it fits,
    so the head and the muzzle both stay in the frame instead of being cut off."""
    spr = crop(cell)
    h, w = spr.shape[:2]
    s = scale
    if round(h * s) > SUBJECT:
        s = SUBJECT / h
    if round(w * s) > INNER:
        s = INNER / w
    nh, nw = max(1, round(h * s)), max(1, round(w * s))
    return nn(spr, nh, nw), nh, s


def foot_point(spr):
    """Horizontal centre of the lowest quarter: the stance, not the muzzle flash."""
    ys, xs = np.nonzero(spr[..., 3] > 0)
    y0, y1 = int(ys.min()), int(ys.max())
    band = ys >= y0 + int((y1 - y0) * 0.72)
    feet = xs[band]
    return float(feet.mean() if len(feet) else xs.mean()), y1


def place(spr, dy=0):
    """Feet on the shared baseline. A weapon wider than the cell keeps both the stance and the bright tip of the attack."""
    cell = np.zeros((CELL, CELL, 4), np.uint8)
    cx, foot = foot_point(spr)
    y = FEET - foot + dy
    x = int(round(CELL / 2 - cx))
    h, w = spr.shape[:2]
    y0, x0 = max(0, y), max(0, x)
    ys, xs = max(0, -y), max(0, -x)
    ye, xe = min(CELL, y + h), min(CELL, x + w)
    if ye > y0 and xe > x0:
        cell[y0:ye, x0:xe] = spr[ys:ys + (ye - y0), xs:xs + (xe - x0)]
    # 1 px gutter. A 12 px margin is kept by the idle scale when the pose fits; wiping it here would cut the Behemoth's hands.
    cell[0] = 0
    cell[-1] = 0
    cell[:, 0] = 0
    cell[:, -1] = 0
    cell[..., 3] = np.where(cell[..., 3] >= 128, 255, 0).astype(np.uint8)
    return cell


def shift(img, dx, dy):
    out = np.zeros_like(img)
    h, w = img.shape[:2]
    ys = slice(max(0, dy), h + min(0, dy))
    xs = slice(max(0, dx), w + min(0, dx))
    out[ys, xs] = img[slice(ys.start - dy, ys.stop - dy), slice(xs.start - dx, xs.stop - dx)]
    return out


def squash(cell, sy):
    """Vertical scale about the feet. sy < 1 crouches; nearest-neighbour, so no new colours."""
    out = np.zeros_like(cell)
    dest = np.arange(CELL)
    src = np.rint(FEET - (FEET - dest) / sy).astype(np.int32)
    ok = (src >= 0) & (src < CELL)
    out[dest[ok]] = cell[src[ok]]
    return out


def shear_top(cell, dx):
    """The upper body leans. The gap at the waist is filled with the row below it, not with a new colour."""
    box = bbox(cell)
    if not box or dx == 0:
        return cell.copy()
    _, y0, _, y1 = box
    cut = y0 + int((y1 - y0) * 0.42)
    out = cell.copy()
    top = shift(cell, dx, 0)
    out[:cut] = top[:cut]
    # Where the lean opened a hole, repeat the waist row. Same colours, no invented pixel.
    gap = (out[:cut, :, 3] == 0) & (cell[:cut, :, 3] > 0)
    ys, xs = np.nonzero(gap)
    if len(xs) and cut < CELL:
        out[ys, xs] = cell[min(cut, CELL - 1), xs]
    return out


def glow_mask(img):
    r, g, b, a = (img[..., i].astype(np.int16) for i in range(4))
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    return (a > 0) & (mx >= 175) & ((mx - mn) >= 45)


def dilate_glow(cell, times):
    out = cell.copy()
    for _ in range(times):
        m = glow_mask(out)
        if not m.any():
            return out
        grow = np.zeros(m.shape, bool)
        grow[1:] |= m[:-1]
        grow[:-1] |= m[1:]
        grow[:, 1:] |= m[:, :-1]
        grow[:, :-1] |= m[:, 1:]
        new = grow & (out[..., 3] == 0)
        if not new.any():
            return out
        # Colour comes from a glowing neighbour, so the palette does not grow.
        src = np.zeros_like(out)
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            shifted = shift(out, dx, dy)
            take = new & (src[..., 3] == 0) & (shifted[..., 3] > 0) & glow_mask(shifted)
            src[take] = shifted[take]
        out[src[..., 3] > 0] = src[src[..., 3] > 0]
    return out


def smear_limb(cell, dist):
    """The side that sticks out furthest leaves a trail of its own pixels: the swing, or the shot."""
    box = bbox(cell)
    if not box:
        return cell.copy()
    x0, y0, x1, y1 = box
    right = (x1 - CELL // 2) >= (CELL // 2 - x0)
    mask = np.zeros(cell.shape[:2], bool)
    mid = (x0 + x1) // 2
    if right:
        mask[:, mid:] = True
        dx = abs(dist)
    else:
        mask[:, :mid] = True
        dx = -abs(dist)
    mask[y1 - 8:] = False
    part = cell.copy()
    part[~mask] = 0
    ghost = shift(part, dx, 0)
    out = ghost.copy()
    keep = cell[..., 3] > 0
    out[keep] = cell[keep]
    return out


def rotate_glow(cell, degrees):
    mask = glow_mask(cell)
    if int(mask.sum()) < 12:
        return cell.copy()
    ys, xs = np.nonzero(mask)
    px, py = float(xs.mean()), float(ys.mean())
    rad = np.deg2rad(-degrees)
    c, s = np.cos(rad), np.sin(rad)
    out = cell.copy()
    out[mask] = 0
    pad = 10
    x0, x1 = max(0, int(xs.min()) - pad), min(CELL, int(xs.max()) + pad + 1)
    y0, y1 = max(0, int(ys.min()) - pad), min(CELL, int(ys.max()) + pad + 1)
    yy, xx = np.mgrid[y0:y1, x0:x1]
    dx, dy = xx - px, yy - py
    sx = np.rint(px + c * dx - s * dy).astype(np.int32)
    sy = np.rint(py + s * dx + c * dy).astype(np.int32)
    ok = (sx >= 0) & (sx < CELL) & (sy >= 0) & (sy < CELL)
    take = np.zeros(ok.shape, bool)
    take[ok] = mask[sy[ok], sx[ok]]
    # Do not paint over the body that stayed put.
    take &= out[y0:y1, x0:x1, 3] == 0
    sub = out[y0:y1, x0:x1]
    sub[take] = cell[sy[take], sx[take]]
    return out


def finish(cell):
    """Keep a 1 px gutter (the atlas test) and a binary alpha. The 12 px margin belongs to the resting pose;
    a bob or a smear may use the space inside that gutter, and is never clipped back off the figure."""
    cell = cell.copy()
    cell[0] = 0
    cell[-1] = 0
    cell[:, 0] = 0
    cell[:, -1] = 0
    cell[..., 3] = np.where(cell[..., 3] >= 128, 255, 0).astype(np.uint8)
    return cell


def frames_of(keys, stagger_is_own):
    idle, anti, attack = keys['idle'], keys['anticipation'], keys['attack']
    phase, core = keys['phase_transition'], keys['core_exposed']
    final, fall, portal = keys['final_hit'], keys['collapse'], keys['reward_portal']
    hit = keys['stagger'] if stagger_is_own else idle
    made = {
        'idle': [
            idle,
            finish(shear_top(shift(idle, 0, -12), 6)),
            finish(dilate_glow(shift(idle, 0, -6), 2)),
            finish(shear_top(shift(idle, 0, -3), -6)),
        ],
        'anticipation': [
            anti,
            finish(shear_top(shift(anti, -10, -4), -8)),
            finish(squash(anti, 0.86)),
            finish(squash(shift(anti, 10, 2), 0.94)),
        ],
        'attack': [
            attack,
            finish(smear_limb(attack, 18)),
            finish(dilate_glow(squash(attack, 0.90), 2)),
            finish(shift(squash(attack, 0.96), -8, 4)),
        ],
        'phase_transition': [
            phase,
            finish(dilate_glow(squash(phase, 0.88), 2)),
            finish(shift(phase, 0, -12)),
            finish(dilate_glow(shift(phase, 0, -6), 3)),
        ],
        'stagger': [
            finish(squash(shift(hit, -16, 4), 0.88)),
            finish(squash(shift(hit, -26, 8), 0.78)),
            finish(shift(hit, -10, 2)),
            finish(shift(hit, -4, 0)),
        ],
        'core_exposed': [
            core,
            finish(dilate_glow(shift(core, 0, -8), 2)),
            finish(dilate_glow(shift(core, 0, -14), 4)),
            finish(dilate_glow(shift(core, 0, -4), 1)),
        ],
        'final_hit': [
            final,
            finish(dilate_glow(final, 4)),
            finish(squash(final, 0.86)),
            finish(squash(shift(final, 0, 10), 0.74)),
        ],
        'collapse': [
            fall,
            finish(squash(shift(fall, 0, 6), 0.90)),
            finish(squash(shift(fall, 0, 12), 0.78)),
            finish(squash(shift(fall, 0, 18), 0.66)),
        ],
        'reward_portal': [
            portal,
            finish(rotate_glow(portal, 28)),
            finish(rotate_glow(dilate_glow(portal, 1), 56)),
            finish(rotate_glow(portal, 84)),
        ],
    }
    # A frame that came out identical to another is not a hold: lift it until the pixels differ.
    for group in made.values():
        seen = set()
        for i, frame in enumerate(group):
            digest = hashlib.sha256(frame.tobytes()).hexdigest()
            lift = 0
            while digest in seen and lift < 6:
                lift += 1
                frame = finish(shift(squash(group[i], 1 - 0.04 * lift), 0, -3 * lift))
                digest = hashlib.sha256(frame.tobytes()).hexdigest()
            group[i] = frame
            seen.add(digest)
    return made


def height_of(cell):
    box = bbox(cell)
    if not box:
        return 0
    return box[3] - box[1] + 1


def build_sheet(manifest, boss, src_path):
    im = np.asarray(Image.open(ROOT / 'game' / src_path).convert('RGBA'))
    keys, meta = {}, {}
    same = {}
    idle_cell = im[SOURCE_RECTS[boss]['idle'][1]:SOURCE_RECTS[boss]['idle'][1] + SOURCE_RECTS[boss]['idle'][3],
                   SOURCE_RECTS[boss]['idle'][0]:SOURCE_RECTS[boss]['idle'][0] + SOURCE_RECTS[boss]['idle'][2]]
    shared = idle_scale(idle_cell)
    for name in STATES:
        x, y, w, h = SOURCE_RECTS[boss][name]
        cell = im[y:y + h, x:x + w]
        digest = hashlib.sha256(np.ascontiguousarray(cell).tobytes()).hexdigest()
        spr, nh, scale = scale_pose(cell, shared)
        keys[name] = place(spr)
        meta[name] = {'source_px': int(crop(cell).shape[0]), 'scaled_px': int(nh), 'scale': round(float(scale), 3), 'same_pixels_as': None}
        same.setdefault(digest, name)
        if same[digest] != name:
            meta[name]['same_pixels_as'] = same[digest]
    stagger_is_own = meta['stagger']['same_pixels_as'] is None
    if not stagger_is_own:
        # The strip repeats another pose in the hit cell. The hit is derived from idle instead.
        keys['stagger'] = keys['idle']
    made = frames_of(keys, stagger_is_own)
    sheet = np.zeros((CELL * 6, CELL * COLS, 4), np.uint8)
    order = []
    for name in STATES:
        for frame in made[name]:
            order.append((name, frame))
    assert len(order) == 36
    heights = {}
    for i, (name, frame) in enumerate(order):
        row, col = divmod(i, COLS)
        sheet[row * CELL:(row + 1) * CELL, col * CELL:(col + 1) * CELL] = frame
        heights.setdefault(name, []).append(height_of(frame))
    distinct = {}
    for name in STATES:
        group = [f for n, f in order if n == name]
        distinct[name] = len({hashlib.sha256(f.tobytes()).hexdigest() for f in group})
    return sheet, meta, heights, distinct, stagger_is_own


def rect(i):
    row, col = divmod(i, COLS)
    return {'x': col * CELL, 'y': row * CELL, 'width': CELL, 'height': CELL}


def write_manifests(sheets):
    path = ROOT / 'game/art/chrono/manifest.json'
    manifest = json.loads(path.read_text())
    for boss, info in sheets.items():
        atlas = manifest['atlases'][boss]
        atlas.update({
            'path': f'art/chrono/{boss}_288.png', 'width': CELL * COLS, 'height': CELL * 6,
            'cell_width': CELL, 'atlas_columns': COLS, 'frame_count': 36,
            'bytes': info['bytes'], 'reserve': False,
            'anchor_method': 'Feet on one baseline, 12 px margin, nearest-neighbour from the existing pose',
            'source': info['source'],
        })
        atlas.pop('source_row', None)
        template = next(a for a in manifest['animations'] if a['character_id'] == boss and a['animation_id'] == 'idle')
        kept = [a for a in manifest['animations'] if a['character_id'] != boss]
        fresh = []
        start = 0
        for name in STATES:
            fps, loop = TIMING[name]
            entry = json.loads(json.dumps(template))
            entry.update({
                'animation_id': name, 'frame_count': 4, 'fps': fps, 'loop': loop,
                'sprite_width': CELL, 'sprite_height': CELL, 'pivot_x': CELL // 2, 'pivot_y': FEET + 1,
                'atlas_reference': boss,
                'frame_rectangles': [rect(start + k) for k in range(4)],
                'status': 'derived_from_existing_pose',
                'animation_quality': 'four frames; frame 0 is the source pose scaled to the cell, the rest move it',
            })
            fresh.append(entry)
            start += 4
        defeat = json.loads(json.dumps(template))
        fps, loop = TIMING['defeat']
        defeat.update({
            'animation_id': 'defeat', 'frame_count': 12, 'fps': fps, 'loop': loop,
            'sprite_width': CELL, 'sprite_height': CELL, 'pivot_x': CELL // 2, 'pivot_y': FEET + 1,
            'atlas_reference': boss,
            'frame_rectangles': [rect(24 + k) for k in range(12)],
            'status': 'derived_from_existing_pose',
            'animation_quality': 'final hit, collapse, portal',
        })
        fresh.append(defeat)
        manifest['animations'] = kept + fresh
    path.write_text(json.dumps(manifest, indent=1, ensure_ascii=False) + '\n')
    mjs = ROOT / 'game/chrono-manifest.mjs'
    text = mjs.read_text()
    head = 'export const CHRONO_MANIFEST='
    i = text.index(head) + len(head)
    runtime = json.loads(text[i:].strip()[:-1])
    for boss in sheets:
        runtime['atlases'][boss] = manifest['atlases'][boss]
        runtime['animations'] = [a for a in runtime['animations'] if a['character_id'] != boss] + [a for a in manifest['animations'] if a['character_id'] == boss]
    mjs.write_text(text[:i] + json.dumps(runtime, separators=(',', ':'), ensure_ascii=False) + ';\n')


def contact(boss, before_path, after, out):
    """One board: the old strip on top, the nine new clips underneath. Evidence, not a game asset."""
    old = Image.open(ROOT / 'game' / before_path).convert('RGBA')
    scale = 2 if old.height <= 160 else 1
    old_big = old.resize((old.width * scale, old.height * scale), Image.NEAREST)
    thumb = 150
    sheet = Image.fromarray(after, 'RGBA')
    board_w = max(old_big.width + 40, COLS * thumb + 40)
    board_h = old_big.height + 36 + 6 * thumb + 28
    board = Image.new('RGB', (board_w, board_h), (12, 14, 20))
    board.paste(old_big, (20, 28), old_big)
    draw = ImageDraw.Draw(board)
    draw.text((20, 6), f'{boss}  prima: un fotogramma per stato', fill=(220, 214, 200))
    for i in range(36):
        row, col = divmod(i, COLS)
        cell = sheet.crop((col * CELL, row * CELL, (col + 1) * CELL, (row + 1) * CELL))
        cell.thumbnail((thumb - 4, thumb - 4), Image.NEAREST)
        x, y = 20 + col * thumb, old_big.height + 48 + row * thumb
        board.paste(cell, (x + (thumb - cell.width) // 2, y + thumb - cell.height - 2), cell)
    draw.text((20, old_big.height + 30), 'dopo: quattro fotogrammi, altezza di posa 288 px nella cella da 320', fill=(220, 214, 200))
    board.save(out, optimize=True)


def main():
    manifest = json.loads((ROOT / 'game/art/chrono/manifest.json').read_text())
    evidence = ROOT / 'docs/evidence/r40'
    evidence.mkdir(parents=True, exist_ok=True)
    report = {'cell': CELL, 'subject_px': SUBJECT, 'margin_px': MARGIN, 'columns': COLS, 'not_produced': [
        'Camminata a 4 fotogrammi: le strisce non hanno un passo, e un bob non è un passo.',
        'Recupero come posa propria: il gioco, in recover, disegna già idle o il nucleo. Non c’è una posa di recupero distinta da copiare.',
        'Il colpo del Tiranno, del Behemoth e del Reaper: la cella della striscia è la stessa della fase. Il colpo è la posa ferma spinta indietro, non una posa dipinta apposta.',
        'Behemoth fermo a 261 px, non 288: le spalle non entrano in una cella da 320 se la figura è alta 288. Tagliarle avrebbe tolto la sagoma.',
        'Lo sparo di Vega è più basso nella cella: a 288 px di corpo la fiammata non entra in 320 px. Si è rimpicciolita la posa intera, così restano testa e fiammata.',
        'I 10 controlli del Pilastro 2 (palette del distretto, contorno di 2 px, bande riservate): i fogli tengono i colori delle pose esistenti. I fogli v2 da generare restano SPECIFIED_NOT_GENERATED.',
    ], 'bosses': {}}
    built = {}
    for boss, src in BOSSES:
        before = sha256(ROOT / 'game' / src)
        sheet, meta, heights, distinct, stagger_own = build_sheet(manifest, boss, src)
        out = ROOT / 'game/art/chrono' / f'{boss}_288.png'
        Image.fromarray(sheet, 'RGBA').save(out, optimize=True)
        after_src = sha256(ROOT / 'game' / src)
        if after_src != before:
            raise SystemExit(f'source strip changed: {src}')
        contact(boss, src, sheet, evidence / f'{boss}-prima-dopo.png')
        idle_h = heights['idle'][0]
        report['bosses'][boss] = {
            'source': src, 'source_sha256': before, 'sheet': f'game/art/chrono/{boss}_288.png',
            'sheet_sha256': sha256(out), 'bytes': out.stat().st_size,
            'idle_frame0_height_px': idle_h,
            'poses': meta, 'frame_heights': heights, 'distinct_frames': distinct,
            'stagger_had_its_own_pose': stagger_own,
        }
        built[boss] = {'bytes': out.stat().st_size, 'source': src}
        short = [name for name, h in ((n, heights[n][0]) for n in STATES) if h < SUBJECT - 6]
        if short:
            report['bosses'][boss]['under_288_on_frame0'] = {n: heights[n][0] for n in short}
        print(boss, 'idle', idle_h, 'distinct', distinct, 'bytes', out.stat().st_size)
    write_manifests(built)
    (evidence / 'boss-frames.json').write_text(json.dumps(report, indent=1, ensure_ascii=False) + '\n')
    print('wrote', evidence / 'boss-frames.json')


if __name__ == '__main__':
    main()
