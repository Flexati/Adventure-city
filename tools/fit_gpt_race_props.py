"""Fit GPT's hand-drawn race props (requests/terra-giro3-gara-20261028/PROMPT_GPT.md) to the game.

For each gpt_<name>.png the game asset is race_<name> in assets/source/race_props/race_props.json.
The image is keyed (tools/gpt_chroma.py), cropped to the object and scaled by area average to
the asset's target box:
  - assets with a collision box ('box', containers, pads): the object box must fill it +-2 px;
    a different aspect is accepted up to MAX_STRETCH per axis, beyond that it is reported as a
    proportion failure and NOT stretched;
  - the crane beam must cross the road (span): GPT drew it at 3.3:1 instead of 6:1, so the beam
    is lengthened by repeating a plain slice of the girder on each side of the centre (legs,
    centre carriage and every drawn pixel kept, nothing scaled unevenly);
  - the others are fitted uniformly inside their zone (ellipse for slicks), centred.
Hit and night states use the transform of their base, so silhouettes stay registered.
The result is a final-size RGBA <name>_edit.png, which compose_terra_race_props.py takes as is
and checks (zone, box, cover, span, hit/night silhouette).

usage: fit_gpt_race_props.py <gpt dir> <out dir> [report.json]
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gpt_chroma import key, resize_rgba  # noqa: E402
from race_props_lib import load_spec, zone_mask  # noqa: E402

MAX_STRETCH = .10
OPAQUE = 24


def crop_box(rgba):
    ys, xs = np.nonzero(rgba[..., 3] > OPAQUE)
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def lengthen(rgba, box, target_ratio, rep):
    """Repeat a plain girder slice on each side, between leg and centre, until width/height = target_ratio.
    The left slice is [rep0, rep1] of the object width, the right one its mirror position."""
    x0, y0, x1, y1 = box
    crop = rgba[y0:y1, x0:x1]
    h, w = crop.shape[:2]
    need = int(round(target_ratio * h)) - w
    if need <= 0:
        return crop, 0
    s0, s1 = int(w * rep[0]), int(w * rep[1])
    r0, r1 = w - s1, w - s0

    def run(sl, n):
        reps = -(-n // sl.shape[1])
        return np.concatenate([sl] * reps, axis=1)[:, :n]
    left, right = need // 2, need - need // 2
    out = np.concatenate([crop[:, :s1], run(crop[:, s0:s1], left), crop[:, s1:r0], run(crop[:, r0:r1], right), crop[:, r0:]], axis=1)
    return out, need


def place(obj, size, at):
    out = np.zeros((size[1], size[0], 4), np.uint8)
    x, y = at
    h, w = obj.shape[:2]
    out[y:y + h, x:x + w] = obj
    return out


def fit(a, rgba, base_transform=None):
    """Return the final-size RGBA image and the transform used (for the states of this asset)."""
    W, H = a['size']
    if base_transform:
        t = base_transform
    else:
        bx = crop_box(rgba)
        ow, oh = bx[2] - bx[0], bx[3] - bx[1]
        t = {'crop': bx, 'note': ''}
        if 'span' in a:
            # beam: height fills the zone, length extended by girder slices
            t['lengthen'] = {'ratio': W / H, 'rep': a.get('gpt_rep', [.2, .26])}
            t['size'] = [W, H]
            t['at'] = [0, 0]
        elif a.get('box'):
            x0, y0, x1, y1 = a['box']
            tw, th = x1 - x0 + 1, y1 - y0 + 1
            sx, sy = tw / ow, th / oh
            stretch = max(sx, sy) / min(sx, sy) - 1
            t['stretch'] = round(stretch, 3)
            if stretch > MAX_STRETCH:
                s = min(sx, sy)
                t['size'] = [max(1, round(ow * s)), max(1, round(oh * s))]
                t['at'] = [x0 + (tw - t['size'][0]) // 2, y1 + 1 - t['size'][1]]
                t['note'] = f'proportion {ow / oh:.2f} vs box {tw / th:.2f}: stretch {stretch:.0%} > {MAX_STRETCH:.0%}, fitted uniformly (box will not be filled)'
            else:
                t['size'] = [tw, th]
                t['at'] = [x0, y0]
                if stretch > .01:
                    t['note'] = f'stretched {stretch:.1%} to fill the collision box'
        else:
            zm = np.asarray(zone_mask(a)) > 0
            zy, zx = np.nonzero(zm)
            zw, zh = zx.max() - zx.min() + 1, zy.max() - zy.min() + 1
            s = min(zw / ow, zh / oh)
            # shrink until the object lies inside the zone (ellipses)
            obj = rgba[bx[1]:bx[3], bx[0]:bx[2]]
            for _ in range(40):
                size = [max(1, round(ow * s)), max(1, round(oh * s))]
                at = [int(zx.min() + (zw - size[0]) // 2), int(zy.min() + (zh - size[1]) // 2)]
                small = resize_rgba(obj, tuple(size))
                img = place(small, (W, H), at)
                if not ((img[..., 3] > 0) & ~zm).any():
                    break
                s *= .97
            t['size'], t['at'] = size, at
    x0, y0, x1, y1 = t['crop']
    if 'lengthen' in t:
        obj, added = lengthen(rgba, t['crop'], t['lengthen']['ratio'], t['lengthen']['rep'])
        t['lengthened_px_source'] = added
        t['note'] = f'girder lengthened by {added} source px (slices {t["lengthen"]["rep"]} of the width repeated)'
    else:
        obj = rgba[y0:y1, x0:x1]
    small = resize_rgba(obj, tuple(t['size']))
    if not a.get('soft'):
        al = small[..., 3]
        small[..., 3] = np.where(al >= 128, 255, 0)
        small[small[..., 3] == 0] = 0
    return place(small, a['size'], t['at']), t


def main(src, dest, report=None):
    spec = load_spec()
    by = {a['name']: a for a in spec['assets']}
    src, dest = Path(src), Path(dest)
    dest.mkdir(parents=True, exist_ok=True)
    rows, transforms = {}, {}
    files = sorted(src.glob('gpt_*.png'), key=lambda p: ('_colpito' in p.stem or '_night' in p.stem, p.stem))
    for f in files:
        name = 'race_' + f.stem[4:]
        a = by.get(name)
        if a is None:
            rows[f.name] = {'result': 'NO_ASSET'}
            continue
        base = a.get('hit_of') or a.get('night_of')
        rgba = key(Image.open(f))
        img, t = fit(a, rgba, transforms.get(base))
        transforms[name] = t
        Image.fromarray(img, 'RGBA').save(dest / f'{name}_edit.png', optimize=True)
        rows[name] = {'source': str(f), 'transform': t, 'from_base': base}
    if report:
        Path(report).write_text(json.dumps(rows, indent=1, default=int) + '\n')
    for n, r in rows.items():
        print(n, r.get('transform', {}).get('note', '') or 'ok')


if __name__ == '__main__':
    main(*sys.argv[1:4])
