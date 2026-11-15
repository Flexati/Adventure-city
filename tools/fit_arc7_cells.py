"""Paint ARC-7 «Choir» into Lulù's R-12 cells, in Terra's delivery format (<sheet>_rRcC_edit.png).

Terra round 2 delivered Nox's H-17 cells only. This fills Lulù's two sheets from Terra's own
ARC-7 master views (delivery/terra-giro1-20261027, master/arc7_{side,back,front,diag_back,cell}.png):

  1. in the cell's approved zone, find the old R-12: dark low-saturation metal (its magenta
     light and the muzzle flash are left out of the measure), split in connected parts (gun, and in reload frames the loose magazine);
  2. measure each part's axis (PCA), length and muzzle end (the end away from the hands);
  3. rotate and scale the ARC-7 view chosen by the row (0 side, 1 back, 2 front, 3 diag back;
     the magazine becomes arc7_cell) onto that axis, at least as long as the old part;
  4. draw the hands (skin pixels of the original) back on top, and turn the R-12 magenta
     flash and sparks violet (the ARC-7 burst colour);
  5. write the result at cell size, enlarged x3 with nearest neighbour onto the package cell,
     inside the mask only, so the team tools (compose_terra_weapon_edits.py,
     verify_terra_weapon_sheet.py --zones) treat it exactly like a Terra edit.

Per-cell corrections (offsets, scale, view) live in assets/source/weapon_masks/arc7_fit.json.

usage: fit_arc7_cells.py <sheet name> <arc7 master dir> <out dir> [debug.png]
"""
import json
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from gpt_chroma import resize_rgba  # noqa: E402

SCALE = 3
VIEWS = {0: 'arc7_side', 1: 'arc7_back', 2: 'arc7_front', 3: 'arc7_diag_back'}
# Muzzle direction of each master view, in image coordinates (x right, y down).
MUZZLE = {'arc7_side': (1, 0), 'arc7_back': (0, -1), 'arc7_front': (0, 1), 'arc7_diag_back': (1, -.55), 'arc7_cell': (1, 0)}


def zone_mask(polys, w, h):
    z = Image.new('L', (w, h), 0)
    for poly in polys:
        pts = [(min(max(x, 1), w - 2), min(max(y, 1), h - 2)) for x, y in poly]
        ImageDraw.Draw(z).polygon(pts, fill=255)
    return np.array(z) > 0


def classify(cell):
    a = cell.astype(np.int32)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    mx, mn = a[..., :3].max(-1), a[..., :3].min(-1)
    lum = (r * 3 + g * 6 + b) / 10
    opaque = al > 100
    skin = opaque & (r > 140) & (r > g + 25) & (g > b + 10) & (g > 70) & (b < 150)
    magenta = opaque & (r > 150) & (b > 110) & (g < r - 60)
    metal = opaque & (mx - mn < 40) & (lum < 120) & ~skin
    return skin, magenta, metal


def components(m):
    from collections import deque
    h, w = m.shape
    lab = np.zeros(m.shape, np.int32)
    n = 0
    for y0, x0 in zip(*np.nonzero(m)):
        if lab[y0, x0]:
            continue
        n += 1
        q = deque([(y0, x0)]); lab[y0, x0] = n
        while q:
            y, x = q.popleft()
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and m[ny, nx] and not lab[ny, nx]:
                        lab[ny, nx] = n; q.append((ny, nx))
    return [lab == i for i in range(1, n + 1)]


def axis(m):
    ys, xs = np.nonzero(m)
    c = np.array([xs.mean(), ys.mean()])
    pts = np.stack([xs, ys], 1) - c
    w, v = np.linalg.eigh(pts.T @ pts / len(pts))
    d = v[:, 1]
    proj = pts @ d
    return c, d, proj.min(), proj.max()


def view_image(masters, name):
    im = Image.open(masters / f'{name}.png').convert('RGBA')
    a = np.array(im)
    if name == 'arc7_burst':
        return a
    ys, xs = np.nonzero(a[..., 3] > 20)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def place(view, muzzle_dir, centre, direction, length, width_ratio, shape):
    """Rotate/scale the view so its muzzle points along `direction` and its extent along the
    axis is `length`; centre it on `centre`. Returns an RGBA layer of `shape`."""
    vh, vw = view.shape[:2]
    m = np.array(muzzle_dir, float); m /= np.linalg.norm(m)
    ang_view = math.degrees(math.atan2(m[1], m[0]))
    ang_target = math.degrees(math.atan2(direction[1], direction[0]))
    # extent of the view along its own muzzle axis
    ys, xs = np.nonzero(view[..., 3] > 20)
    pts = np.stack([xs, ys], 1).astype(float)
    ext = (pts @ m).max() - (pts @ m).min()
    k = length / ext
    k *= width_ratio
    big = Image.fromarray(view, 'RGBA')
    big = Image.fromarray(resize_rgba(np.array(big), (max(1, round(vw * k)), max(1, round(vh * k)))), 'RGBA')
    # PIL rotates counter-clockwise for positive angles in screen coordinates (y down): use -delta
    rot = big.rotate(-(ang_target - ang_view), resample=Image.NEAREST, expand=True)
    ra = np.array(rot)
    ys, xs = np.nonzero(ra[..., 3] > 20)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    layer = Image.new('RGBA', (shape[1], shape[0]), (0, 0, 0, 0))
    layer.alpha_composite(rot, (int(round(centre[0] - cx)), int(round(centre[1] - cy)))) if False else None
    ox, oy = int(round(centre[0] - cx)), int(round(centre[1] - cy))
    out = np.zeros((shape[0], shape[1], 4), np.uint8)
    sx0, sy0 = max(0, -ox), max(0, -oy)
    dx0, dy0 = max(0, ox), max(0, oy)
    w = min(ra.shape[1] - sx0, shape[1] - dx0); h = min(ra.shape[0] - sy0, shape[0] - dy0)
    if w > 0 and h > 0:
        out[dy0:dy0 + h, dx0:dx0 + w] = ra[sy0:sy0 + h, sx0:sx0 + w]
    return out


def inpaint(img, hole):
    """Fill `hole` pixels by repeated averaging of known 4-neighbours (colour and alpha)."""
    out = img.astype(float).copy()
    known = ~hole
    out[hole] = 0
    for _ in range(64):
        if known.all():
            break
        acc = np.zeros(out.shape[:2] + (3,)); wsum = np.zeros(out.shape[:2]); asum = np.zeros(out.shape[:2]); cnt = np.zeros(out.shape[:2])
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            k = np.roll(np.roll(known, dy, 0), dx, 1)
            nb = np.roll(np.roll(out, dy, 0), dx, 1)
            w = k * nb[..., 3] / 255
            acc += nb[..., :3] * w[..., None]; wsum += w
            asum += nb[..., 3] * k; cnt += k
        grow = ~known & (cnt > 0)
        out[grow, 3] = asum[grow] / cnt[grow]
        col = grow & (wsum > 0)
        out[col, :3] = acc[col] / wsum[col][:, None]  # colour only from opaque neighbours
        known = known | grow
    out[..., 3] = np.where(out[..., 3] > 127, 255, 0)
    out[out[..., 3] == 0] = 0
    return out.round().astype(np.uint8)


def over(dst, src):
    a = src[..., 3:4].astype(float) / 255
    out = dst.astype(float)
    out[..., :3] = src[..., :3] * a + out[..., :3] * (1 - a)
    out[..., 3] = np.maximum(out[..., 3], src[..., 3])
    return out.round().astype(np.uint8)


def violet(cell, sel):
    """Turn the R-12 magenta light violet (ARC-7 burst): keep brightness, move hue."""
    a = cell.astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = np.maximum(r, b)
    white = np.minimum(r, np.minimum(g, b)) / np.maximum(lum, 1)
    nr = lum * (.62 + .38 * white); ng = lum * (.30 + .70 * white) * np.where(white > .5, 1, .9); nb = lum
    out = cell.copy()
    out[..., 0] = np.where(sel, nr, r).clip(0, 255)
    out[..., 1] = np.where(sel, np.maximum(ng, g * .6), g).clip(0, 255)
    out[..., 2] = np.where(sel, np.maximum(nb, 200 * (lum > 120)), b).clip(0, 255)
    return out


def main(sheet, masters, out_dir, debug=None):
    spec = json.loads((ROOT / f'assets/source/weapon_masks/{sheet}.json').read_text())
    fits = json.loads((ROOT / 'assets/source/weapon_masks/arc7_fit.json').read_text()).get(sheet, {})
    ref = np.array(Image.open(ROOT / spec['sheet']).convert('RGBA'))
    cw, ch = spec['cell']
    masters = Path(masters)
    out_dir = Path(out_dir); out_dir.mkdir(parents=True, exist_ok=True)
    pkg = ROOT / f'requests/terra-giro2-armi-20261027/pacchetti/{sheet}/celle'
    views = {n: view_image(masters, n) for n in set(VIEWS.values()) | {'arc7_cell'}}
    report, previews = {}, []
    for key, polys in spec['cells'].items():
        r, c = map(int, key.split(','))
        x0, y0 = math.floor(c * cw + .5), math.floor(r * ch + .5)
        x1, y1 = math.floor((c + 1) * cw + .5), math.floor((r + 1) * ch + .5)
        cell = ref[y0:y1, x0:x1].copy()
        z = zone_mask(polys, x1 - x0, y1 - y0)
        skin, magenta, metal = classify(cell)
        skin &= z; magenta &= z; metal &= z
        fit = fits.get(f'r{r}c{c}', {})
        # the gun's own magenta light is small; the muzzle flash is large and must not stretch the gun
        parts = [p for p in components(metal & ~fit_exclude(fit, cell.shape)) if p.sum() >= 40]
        parts.sort(key=lambda p: -p.sum())
        new = cell.copy()
        placed = []
        skin_c = np.array(np.nonzero(skin)[::-1]).mean(1) if skin.any() else None
        # a loose magazine only exists in the reload frames that hold it (extract, insert)
        n_parts = 2 if sheet.endswith('reload') and c in (1, 2) else 1
        zy, zx = np.nonzero(z)
        for i, part in enumerate(parts[:n_parts]):
            pf = fit.get('parts', [{}, {}])[i] if i < len(fit.get('parts', [])) else {}
            if pf.get('skip'):
                continue
            c0, d, lo, hi = axis(part)
            length = hi - lo
            if i == 0 and r == 2 and not pf.get('free_axis'):
                # front rows: the gun points at the viewer and its dark metal merges with the
                # black trousers, so the measure comes from the zone top instead of the pixels
                d = np.array([0., 1.])
                c0 = np.array([(zx.min() + zx.max()) / 2, zy.min() + 26.])
                length = 48
            # muzzle = end away from the hands
            if skin_c is not None and np.dot(skin_c - c0, d) > 0:
                d = -d
            if 'dir' in pf:
                d = np.array(pf['dir'], float); d /= np.linalg.norm(d)
            if 'centre' in pf:
                c0 = np.array(pf['centre'], float)
            if 'length' in pf:
                length = pf['length']
            name = pf.get('view') or ('arc7_cell' if i == 1 else VIEWS[r])
            length = max(length, pf.get('min_len', 0)) * pf.get('scale', 1.15 if i == 0 else 1.1)
            centre = c0 + np.array(pf.get('offset', [0, 0]), float) + d * pf.get('forward', 0)
            # the new weapon must stay inside the zone: shrink it (down to 75%) rather than cut it
            for _ in range(5):
                layer = place(views[name], MUZZLE[name], centre, d, length, 1, cell.shape)
                vis = layer[..., 3] > 60
                if (vis & ~z).sum() <= .03 * max(1, vis.sum()):
                    break
                length *= .94
            layer[~z] = 0
            if r != 2 and not pf.get('keep_old'):
                # old metal the new gun does not cover is filled from its neighbours: background
                # where the gun stood free, jacket where it crossed the arm (no holes in the body);
                # front views keep it, the trousers are behind
                # the R-12 outline highlights are light grey: take them with the part
                a = cell.astype(int)
                grey = (a[..., :3].max(-1) - a[..., :3].min(-1) < 40) & (a[..., 3] > 100) & z
                halo = part.copy()
                for _ in range(3):
                    halo |= (np.roll(halo, 1, 0) | np.roll(halo, -1, 0) | np.roll(halo, 1, 1) | np.roll(halo, -1, 1)) & grey
                gone = halo & (layer[..., 3] < 60) & ~skin
                new = inpaint(new, gone)
            new = over(new, layer)
            placed.append({'view': name, 'centre': [round(float(v), 1) for v in centre], 'dir': [round(float(v), 3) for v in d],
                           'old_len_px': round(float(hi - lo), 1), 'new_len_px': round(float(length), 1)})
        # flash and sparks: R-12 magenta becomes ARC-7 violet, wherever the new gun did not cover it
        new = violet(new, magenta & (new[..., 3] > 0) & np.all(new[..., :3] == cell[..., :3], axis=-1))
        # hands back on top of the grip
        hands = skin & (cell[..., 3] > 100)
        new[hands] = cell[hands]
        new[~z] = cell[~z]
        changed = np.any(new != cell, axis=-1)
        report[f'r{r}c{c}'] = {'parts': placed, 'changed_px': int(changed.sum()), 'changed_outside_zone_px': int((changed & ~z).sum())}
        # Terra format: package cell (x3 on green) with the zone replaced by the new pixels
        base = np.array(Image.open(pkg / f'{sheet}_r{r}c{c}.png').convert('RGB'))
        mask = np.array(Image.open(pkg / f'{sheet}_r{r}c{c}_mask.png'))[..., 3] > 0
        up = np.repeat(np.repeat(new, SCALE, 0), SCALE, 1)
        up_rgb = np.where(up[..., 3:4] > 127, up[..., :3], np.array([0, 255, 0], np.uint8))
        hh, ww = min(base.shape[0], up.shape[0]), min(base.shape[1], up.shape[1])
        edit = base.copy()
        sel = mask[:hh, :ww]
        edit[:hh, :ww][sel] = up_rgb[:hh, :ww][sel]
        Image.fromarray(edit, 'RGB').save(out_dir / f'{sheet}_r{r}c{c}_edit.png', optimize=True)
        previews.append((r, c, new))
    (out_dir / 'FIT_REPORT.json').write_text(json.dumps(report, indent=1) + '\n')
    if debug:
        sheet_img = ref.copy()
        for r, c, new in previews:
            x0, y0 = math.floor(c * cw + .5), math.floor(r * ch + .5)
            sheet_img[y0:y0 + new.shape[0], x0:x0 + new.shape[1]] = new
        bg = Image.new('RGBA', (sheet_img.shape[1], sheet_img.shape[0]), (70, 70, 82, 255))
        bg.alpha_composite(Image.fromarray(sheet_img, 'RGBA'))
        bg.save(debug)
    print(sheet, len(report), 'cells', sum(len(v['parts']) for v in report.values()), 'parts placed')


def fit_exclude(fit, shape):
    m = np.zeros(shape[:2], bool)
    for x0, y0, x1, y1 in fit.get('exclude', []):
        m[y0:y1, x0:x1] = True
    return m


if __name__ == '__main__':
    main(*sys.argv[1:5])
