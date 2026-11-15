"""Read-only style audit of the current CHRONOS sprites (baseline for the V10.3 art rules).

Reproduces every [FATTO] number of docs/design/v10.3/CHRONOS_ARTE_P1_STILE.md:
colours per frame, edge luminance and pure black, light ratio, partial alpha,
32 px silhouette overlap (IoU), palette-reduction error on a scaled copy of Nox
and Lulù, reserved hue bands, WCAG contrast of the danger circle against each
map, and the ground-shadow band. Game files are only read, never written.

Usage: python3 -I tools/art_style_audit.py [repo_root] [out_dir]
Writes out_dir/art_style_audit.json and out_dir/silhouettes_32px.png.
"""
import json
import os
import re
import sys

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..'))
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, 'docs/evidence/v10.3/art-style')
ART = os.path.join(ROOT, 'game/art')

# Draw heights in world units, as read in the renderer (see the cited lines).
DENSITY = [
    ('Nox e Lulù (v05)', 'v05/nox_walk.png', None, 112, 'runtime.mjs:772'),
    ('Nemico base della gang (v05)', 'v05/gang_states.png', None, 104, 'runtime.mjs:826'),
    ('Bruto (v05)', 'v05/gang_states.png', None, 132, 'runtime.mjs:826'),
    ('Boss v05', 'v05/custodian_states.png', None, 190, 'runtime.mjs:826'),
    ('Archon (Custode ricolorato)', 'v05/custodian_states.png', None, 230, 'runtime.mjs:825'),
    ('Kairn', None, 288, 122.18, 'chrono-manifest.mjs'),
    ('Morrow', None, 308, 140.8, 'chrono-manifest.mjs'),
    ('Nemico chrono (purple guard)', None, 128, 104, 'runtime.mjs:823'),
    ('Civili chrono', None, 128, 88, 'runtime.mjs:846'),
    ('Boss chrono (overlord)', None, 128, 230, 'runtime.mjs:821'),
    ('Pavimento chrono', None, 128, 64, 'scenery.mjs:13'),
    ('Muri chrono', None, 128, 128, 'scenery.mjs:26'),
]
BOSS_STRIPS = [('Cathedral Bone Tyrant', 'chrono/cathedral_bone_tyrant.png', 144), ('Toxic Forge Behemoth', 'chrono/toxic_forge_behemoth.png', 192),
               ('Shadow Reaper', 'chrono/shadow_reaper.png', 160), ('Chrono overlord', 'chrono/chrono_overlord.png', 160)]
BANDS = {'pericolo 340-40': lambda h: (h >= 340) | (h <= 40), 'Nox 175-200': lambda h: (h >= 175) & (h <= 200),
         'Lulu 275-325': lambda h: (h >= 275) & (h <= 325), 'interattivo 140-170': lambda h: (h >= 140) & (h <= 170)}
MAPS = ['city.png', 'port.png', 'clinic.png', 'fracture.png']


def sheet_layout():
    src = open(os.path.join(ROOT, 'game/sheet-layout.mjs'), encoding='utf-8').read()
    return json.loads(re.search(r'Object\.freeze\((\{.*\})\);', src, re.S).group(1))


def rgba(path):
    return Image.open(os.path.join(ART, path)).convert('RGBA')


def cell(layout, key, col=0, row=0):
    g = layout[key]
    return rgba(key).crop((col * g['CW'], row * g['CH'], (col + 1) * g['CW'], (row + 1) * g['CH']))


def bbox(im):
    m = np.array(im)[..., 3] >= 128
    ys, xs = np.nonzero(m)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def luma(rgb):
    return 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]


def frame_metrics(im):
    c = np.array(bbox(im))
    op = c[..., 3] >= 128
    pad = np.pad(op, 1)
    inner = pad[1:-1, 1:-1] & pad[:-2, 1:-1] & pad[2:, 1:-1] & pad[1:-1, :-2] & pad[1:-1, 2:]
    edge = op & ~inner
    lum = luma(c[..., :3].astype(float))
    h, w = op.shape
    yy, xx = np.mgrid[0:h, 0:w]
    top_left, bottom_right = op & (xx / w + yy / h < 1), op & (xx / w + yy / h >= 1)
    black = np.all(c[..., :3] <= 8, axis=-1) & edge
    visible = c[..., 3] > 0
    return {
        'bbox': f'{w}x{h}',
        'colori': len({tuple(v) for v in c[op][:, :3]}),
        'bordo_luma_mediana': round(float(np.median(lum[edge])), 1),
        'interno_luma_mediana': round(float(np.median(lum[inner])), 1),
        'bordo_nero_puro_pct': round(100 * float(black.sum()) / max(1, int(edge.sum())), 1),
        'luce_alto_sx_su_basso_dx': round(float(lum[top_left].mean() / max(1e-6, lum[bottom_right].mean())), 2),
        'alfa_parziale_pct': round(100 * float(((c[..., 3] > 0) & (c[..., 3] < 255)).sum()) / max(1, int(visible.sum())), 1),
        'fascia_bassa_6pct_larghezza_pct': round(100 * float(op[int(h * .94):].any(0).sum()) / w),
    }


def silhouette32(im):
    b = bbox(im)
    m = np.array(b)[..., 3] >= 128
    w = max(1, round(b.width * 32 / b.height))
    return np.array(Image.fromarray((m * 255).astype(np.uint8)).resize((w, 32), Image.NEAREST)) > 127


def iou(a, b):
    width = max(a.shape[1], b.shape[1])
    pa, pb = np.zeros((32, width), bool), np.zeros((32, width), bool)
    pa[:, (width - a.shape[1]) // 2:(width - a.shape[1]) // 2 + a.shape[1]] = a
    pb[:, (width - b.shape[1]) // 2:(width - b.shape[1]) // 2 + b.shape[1]] = b
    return round(float((pa & pb).sum() / max(1, (pa | pb).sum())), 2)


def band_pct(im, s_min=.35, v_min=.9):
    a = np.array(im.convert('RGBA'))
    rgb = a[..., :3][a[..., 3] >= 128] / 255.0
    mx, mn = rgb.max(1), rgb.min(1)
    d = mx - mn
    dd = np.maximum(d, 1e-9)
    s = np.where(mx > 0, d / np.maximum(mx, 1e-9), 0)
    r, g, b = rgb.T
    nz = d > 1e-9
    h = np.zeros_like(mx)
    h = np.where(nz & (mx == r), ((g - b) / dd) % 6, h)
    h = np.where(nz & (mx == g) & (mx != r), (b - r) / dd + 2, h)
    h = np.where(nz & (mx == b) & (mx != r) & (mx != g), (r - g) / dd + 4, h)
    h = h * 60
    vivid = nz & (s >= s_min) & (mx >= v_min)
    return {k: round(100 * float((vivid & f(h)).mean()), 2) for k, f in BANDS.items()}


def rel_lum(c):
    c = np.array(c) / 255.0
    c = np.where(c <= .03928, c / 12.92, ((c + .055) / 1.055) ** 2.4)
    return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]


def contrast(a, b):
    hi, lo = sorted([rel_lum(a), rel_lum(b)], reverse=True)
    return round((hi + .05) / (lo + .05), 1)


def main():
    layout = sheet_layout()
    report = {'nota': 'Misura in sola lettura degli asset in gioco. Nessun file del gioco viene scritto.'}

    report['densita_px_per_unita'] = []
    for name, key, px, units, ref in DENSITY:
        height = layout[key]['ch'] if key else px
        report['densita_px_per_unita'].append({'asset': name, 'altezza_px': height, 'disegnato_unita': units, 'densita': round(height / units, 2), 'fonte': ref})

    frames = {'Nox · camminata f0': cell(layout, 'v05/nox_walk.png', 0), 'Lulù · camminata f0': cell(layout, 'v05/lulu_walk.png', 0),
              'Nox · camminata f2': cell(layout, 'v05/nox_walk.png', 2), 'Lulù · camminata f2': cell(layout, 'v05/lulu_walk.png', 2),
              'Gang f0': cell(layout, 'v05/gang_states.png', 0), 'Purple guard f0': rgba('chrono/purple_guard.png').crop((0, 0, 208, 128))}
    for name, path, cw in BOSS_STRIPS:
        frames[name + ' f0'] = rgba(path).crop((0, 0, cw, 128))
    report['fotogrammi'] = {name: frame_metrics(im) for name, im in frames.items()}

    sil = {name: silhouette32(im) for name, im in frames.items()}
    report['sagome_32px_iou'] = {'Nox–Lulù f0': iou(sil['Nox · camminata f0'], sil['Lulù · camminata f0']),
                                 'Nox–Lulù f2': iou(sil['Nox · camminata f2'], sil['Lulù · camminata f2']),
                                 'Nox–gang f0': iou(sil['Nox · camminata f0'], sil['Gang f0'])}

    report['alfa_sheet'] = {}
    for key in ['v05/nox_walk.png', 'v05/lulu_walk.png', 'v05/gang_states.png', 'v10/kairn.png', 'chrono/purple_guard.png']:
        hist = rgba(key).getchannel('A').histogram()
        visible = sum(hist[1:])
        report['alfa_sheet'][key] = {'alfa_255': hist[255], 'alfa_250_253': sum(hist[250:254]), 'parziale_pct_dei_visibili': round(100 * sum(hist[1:255]) / max(1, visible), 1)}

    report['riduzione_palette_copia_densita_1_25'] = {}
    for key, name in [('v05/nox_walk.png', 'Nox'), ('v05/lulu_walk.png', 'Lulù')]:
        c = cell(layout, key)
        scale = 134 / 301.5
        small = c.resize((round(c.width * scale), round(c.height * scale)), Image.LANCZOS)
        a = np.array(small)
        op = a[..., 3] >= 128
        rgb = a[..., :3][op].astype(float)
        rows = {}
        for n in (16, 32, 48, 64):
            q = Image.fromarray(a[..., :3]).quantize(n, method=Image.Quantize.MEDIANCUT).convert('RGB')
            err = np.linalg.norm(np.array(q)[op].astype(float) - rgb, axis=1)
            rows[str(n)] = {'errore_medio': round(float(err.mean()), 1), 'p95': round(float(np.percentile(err, 95)), 1)}
        report['riduzione_palette_copia_densita_1_25'][name] = rows

    report['bande_riservate_pct'] = {}
    for name, path in [('mappa ' + m[:-4], m) for m in MAPS] + [('tile chrono', 'chrono/environment.png'), ('Nox (sheet)', 'v05/nox_walk.png'),
                                                              ('Lulù (sheet)', 'v05/lulu_walk.png'), ('Gang (sheet)', 'v05/gang_states.png')] + [(n, p) for n, p, _ in BOSS_STRIPS[:3]]:
        report['bande_riservate_pct'][name] = band_pct(rgba(path))

    ring, text = (0xff, 0x99, 0x7b), (0xff, 0xf0, 0xdf)
    report['contrasto_cerchio_pericolo'] = {}
    for m in MAPS:
        px = np.array(rgba(m))[..., :3].reshape(-1, 3)[::97].astype(float)
        order = np.argsort([rel_lum(v) for v in px])
        median, bright = px[order[len(order) // 2]], px[order[int(len(order) * .9)]]
        report['contrasto_cerchio_pericolo'][m] = {'terreno_mediano': [int(v) for v in median], 'cerchio_su_mediano': contrast(ring, median),
                                                  'testo_su_mediano': contrast(text, median), 'terreno_chiaro_p90': [int(v) for v in bright],
                                                  'cerchio_su_chiaro': contrast(ring, bright)}

    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, 'art_style_audit.json'), 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=1)

    shown = ['Nox · camminata f0', 'Lulù · camminata f0', 'Gang f0', 'Cathedral Bone Tyrant f0', 'Toxic Forge Behemoth f0', 'Shadow Reaper f0']
    sheet = Image.new('RGB', (len(shown) * 150, 408), (255, 255, 255))
    draw = ImageDraw.Draw(sheet)
    for i, name in enumerate(shown):
        s = Image.fromarray(np.where(sil[name], 0, 255).astype(np.uint8))
        sheet.paste(s.resize((s.width * 4, 128), Image.NEAREST), (i * 150 + 10, 4))
        draw.text((i * 150 + 10, 136), name.replace(' f0', '').replace(' · camminata', ''), fill=(0, 0, 0))
        big = bbox(frames[name])
        big = big.resize((round(big.width * 240 / big.height), 240), Image.NEAREST)
        back = Image.new('RGB', big.size, (40, 46, 58))
        back.paste(big, (0, 0), big)
        sheet.paste(back, (i * 150 + 5, 152))
    sheet.save(os.path.join(OUT, 'silhouettes_32px.png'))
    print(json.dumps(report, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
