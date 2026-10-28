"""Compose race_rivalNN_car.png from GPT car states, in the layout of race_veyra_car.png.

Each state is keyed (tools/gpt_chroma.py), scaled with ONE factor per car so the base body
is 196 px tall (VEYRA_CAR.bodyHeight) and placed with ONE offset so the base body box is
centred on (192, 128) of a 384x256 cell. Using the base transform for every state keeps
damage and night frames registered on the base.

Sheet (1536x512): row 0 base, danno1, danno2, danno3; row 1 base, base, notte_a, notte_b
(row 1 col 0/1 are the parked and braking cells of Veyra's sheet; rivals have no own art).

Checks, written to the report (no PASS without a measure):
  body_height      base body box height after scaling, 196 +-4
  silhouette       per state, body box (largest component) vs base within +-2 px at sheet scale;
                   IoU of body masks vs base (smoke and glow are outside the body component)
  outside_cell     opaque pixels touching the cell border (must be 0)
  green_left       pixels with greenness > 150 (chroma-like) and alpha > 0 (must be 0); petrol and
                   teal paint measure up to ~60 and is art
  interior_holes   translucent pixels inside the body, away from its edge (must be 0): paint keyed
                   out by mistake
Smoke and glow are not body: the body of a state is its opaque mask inside the base body
dilated by the tolerance, and what lies outside is reported as extra pixels.

usage: compose_rival_cars.py <spec.json> <out sheet.png> <report.json>
spec: {"car": "rival02", "states": {"base": path, "danno1": path, ...},
       "fade_top_px": {"danno3": 10}}  optional: fade smoke that reaches the cell top (reported)
"""
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gpt_chroma import greenness, key, largest_component_box, resize_rgba  # noqa: E402

CELL, CENTRE, BODY_H = (384, 256), (192, 128), 196
LAYOUT = [['base', 'danno1', 'danno2', 'danno3'], ['base', 'base', 'notte_a', 'notte_b']]
TOL = 2


def rgba_of(path):
    im = Image.open(path)
    if im.mode == 'RGBA' and np.array(im)[..., 3].min() == 0:
        return np.array(im)
    return key(im)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def dilate(m, r):
    out = m.copy()
    for _ in range(r):
        out = out | np.roll(out, 1, 0) | np.roll(out, -1, 0) | np.roll(out, 1, 1) | np.roll(out, -1, 1)
    return out


def erode(m, r):
    return ~dilate(~m, r)


def bbox_of(m):
    ys, xs = np.nonzero(m)
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)


def body_mask(rgba):
    m = rgba[..., 3] > 127
    box = largest_component_box(m)
    return m, box


def main(spec_path, out, report_path):
    spec = json.loads(Path(spec_path).read_text())
    states = {k: rgba_of(v) for k, v in spec['states'].items()}
    base = states['base']
    _, (x0, y0, x1, y1) = body_mask(base)
    k = BODY_H / (y1 - y0)
    size = (round(base.shape[1] * k), round(base.shape[0] * k))
    ox = round(CENTRE[0] - (x0 + x1) / 2 * k)
    oy = round(CENTRE[1] - (y0 + y1) / 2 * k)
    cells = {}
    for name, rgba in states.items():
        small = resize_rgba(rgba, size)
        cell = np.zeros((CELL[1], CELL[0], 4), np.uint8)
        sx0, sy0 = max(0, -ox), max(0, -oy)
        dx0, dy0 = max(0, ox), max(0, oy)
        w = min(size[0] - sx0, CELL[0] - dx0)
        h = min(size[1] - sy0, CELL[1] - dy0)
        cell[dy0:dy0 + h, dx0:dx0 + w] = small[sy0:sy0 + h, sx0:sx0 + w]
        lost = int((small[..., 3] > 0).sum() - (cell[..., 3] > 0).sum())
        fade = spec.get('fade_top_px', {}).get(name, 0)
        if fade:
            # smoke that leaves the cell: fade it out over the top rows instead of a hard cut
            ramp = np.clip(np.arange(CELL[1]) / fade, 0, 1)[:, None]
            cell[..., 3] = np.round(cell[..., 3] * ramp).astype(np.uint8)
            cell[cell[..., 3] == 0] = 0
            lost = 0
        cells[name] = (cell, lost)
    sheet = np.zeros((CELL[1] * 2, CELL[0] * 4, 4), np.uint8)
    for r, row in enumerate(LAYOUT):
        for c, name in enumerate(row):
            sheet[r * CELL[1]:(r + 1) * CELL[1], c * CELL[0]:(c + 1) * CELL[0]] = cells[name][0]
    Path(out).parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(sheet, 'RGBA').save(out, optimize=True)

    bm, bbox = body_mask(cells['base'][0])
    rep = {'car': spec['car'], 'scale': round(k, 5), 'offset': [ox, oy],
           'source_body_box': [x0, y0, x1, y1], 'source_aspect_w_over_h': round((x1 - x0) / (y1 - y0), 3),
           'states': {}}
    ok = True
    for name, (cell, lost) in cells.items():
        m = cell[..., 3] > 127
        inter = (m & bm).sum(); union = (m | bm).sum()
        border = np.concatenate([cell[0, :, 3], cell[-1, :, 3], cell[:, 0, 3], cell[:, -1, 3]])
        g = greenness(cell[..., :3]); green_left = int(((g > 150) & (cell[..., 3] > 0)).sum())
        core = erode(bm, 3)
        holes = int((core & (cell[..., 3] < 250)).sum())
        near = dilate(bm, TOL)
        extra = int(((cell[..., 3] > 127) & ~near).sum())
        m = m & near
        box = bbox_of(m)
        d = [box[i] - bbox[i] for i in range(4)]
        st = {'source': spec['states'][name], 'source_sha256': sha(spec['states'][name]),
              'body_box': list(box), 'delta_vs_base_px': d, 'iou_vs_base': round(float(inter / union), 4),
              'cropped_pixels': lost, 'faded_top_px': spec.get('fade_top_px', {}).get(name, 0), 'interior_holes': holes, 'extra_outside_body_px': extra, 'opaque_on_cell_border': int((border > 0).sum()), 'green_left': green_left}
        st['silhouette_within_tol'] = all(abs(v) <= TOL for v in d)
        st['result'] = 'PASS' if st['silhouette_within_tol'] and lost == 0 and st['opaque_on_cell_border'] == 0 and green_left == 0 and holes == 0 and st['iou_vs_base'] >= .97 else 'FAIL'
        ok &= st['result'] == 'PASS'
        rep['states'][name] = st
    rep['body_height'] = bbox[3] - bbox[1]
    rep['body_height_ok'] = abs(rep['body_height'] - BODY_H) <= 4
    rep['sheet'] = {'path': out, 'size': list(sheet.shape[1::-1]), 'bytes': Path(out).stat().st_size, 'sha256': sha(out)}
    rep['result'] = 'PASS' if ok and rep['body_height_ok'] else 'FAIL'
    Path(report_path).write_text(json.dumps(rep, indent=1, ensure_ascii=False, default=int) + '\n')
    print(spec['car'], rep['result'], 'h', rep['body_height'], {n: (s['result'], s['delta_vs_base_px'], s['iou_vs_base'], s['green_left'], s['interior_holes'], s['extra_outside_body_px']) for n, s in rep['states'].items()})


if __name__ == '__main__':
    main(*sys.argv[1:4])
