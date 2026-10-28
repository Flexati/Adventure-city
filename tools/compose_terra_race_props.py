"""Bring Terra's race props back to game PNGs and check them (Terra round 3).

Usage: python3 -I tools/compose_terra_race_props.py <edits dir> <out dir> [report.json] [spec.json]

For every asset of the spec with <name>_edit.png in the edits dir (the template from
make_terra_race_props.py, drawn inside its mask): key green to alpha at the template scale
(tools/gpt_chroma.py), area-average back to the final size (binary alpha except soft art: flames,
puddles), clear everything outside the zone, save
<out dir>/<name>.png. A file already at the final size with transparency is taken as is.
Then each output is checked against the spec (race_props_lib.check): size, zone, opaque box where
the game collides, cover, road crossing for the crane beam, same silhouette for hit and night
states. Missing assets are listed, not failed. Exit 1 if any delivered asset fails.
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gpt_chroma import key, resize_rgba  # noqa: E402
from race_props_lib import SPEC, check, load_spec, zone_mask  # noqa: E402


def compose(a, src):
    im = Image.open(src)
    if im.size == tuple(a['size']) and (im.mode in ('RGBA', 'LA') or 'transparency' in im.info):
        out = np.asarray(im.convert('RGBA')).copy()
    else:
        # Key at the template scale, then area-average down on premultiplied colour: no Lanczos
        # ringing, no green fringe, and the inside of the art keeps its colours (no global spill
        # clamp). Hard art gets a binary alpha again, soft art (flames, puddles) keeps its grades.
        out = resize_rgba(key(im), tuple(a['size']))
        if not a.get('soft', False):
            out[..., 3] = np.where(out[..., 3] >= 128, 255, 0)
            out[out[..., 3] == 0] = 0
    out[np.asarray(zone_mask(a)) == 0] = 0
    return out


def main(edits, dest, report=None, spec_path=SPEC):
    spec, edits, dest = load_spec(spec_path), Path(edits), Path(dest)
    dest.mkdir(parents=True, exist_ok=True)
    done, rows, fails, missing = {}, {}, [], []
    # States last, so the hit and night checks find their base asset.
    for a in sorted(spec['assets'], key=lambda a: bool(a.get('hit_of') or a.get('night_of'))):
        src = edits / f'{a["name"]}_edit.png'
        if not src.exists():
            missing.append(a['name'])
            continue
        img = compose(a, src)
        Image.fromarray(img).save(dest / f'{a["name"]}.png', optimize=True)
        f, info = check(a, img, done)
        done[a['name']] = img
        rows[a['name']] = {'result': 'FAIL' if f else 'PASS', **info, 'fails': f}
        fails += f
    result = {'result': 'FAIL' if fails else ('PASS' if rows else 'EMPTY'), 'composed': len(rows), 'missing': missing, 'assets': rows}
    if report:
        Path(report).write_text(json.dumps(result, indent=1) + '\n')
    print(result['result'], f'{len(rows)} composed, {len(missing)} missing', *fails[:30], sep='\n')
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main(*sys.argv[1:5]))
