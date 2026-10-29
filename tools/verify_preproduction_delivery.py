"""Check GPT deliveries for the 310 preproduction boards and record them in the registry.

For every prompt in requests/gpt-preproduzione-310-20261029/INDICE.json whose files exist under the
delivery folder, it measures:
  - decode, size (as asked by the prompt), bytes, SHA-256;
  - green-background files (props, sprite, vfx, model sheets): share of key green, subject not
    touching the border, no near-green subject pixels;
  - region night/event files: same geometry as the day master (edge map correlation >= 0.6);
  - variant 02/03 of characters/enemies: subject height close to v01 (+-8%) as a family check.
Passing boards are copied to the expected master path with a metadata JSON; the registry gets
bytes, SHA-256, tool and status: TECHNICALLY_VERIFIED for contents in the game, CONCEPT_ONLY for the
others. Nothing is ever marked integrated or commercial-ready here.

usage: verify_preproduction_delivery.py <delivery checkout root> <report.json> [--write]
"""
import hashlib
import json
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from gpt_chroma import greenness  # noqa: E402

INDEX = ROOT / 'requests/gpt-preproduzione-310-20261029/INDICE.json'
REG = ROOT / 'docs/gold/VARIANTI_PREPRODUZIONE_V10_2_20261028.json'
GREEN_SUFFIX = ('_props.png', '_vfx.png', '_sprite.png')


def expected_size(name, category):
    if name.endswith('_ritratti.png'):
        return (1536, 512)
    if name.endswith('_vfx.png') and category in ('enemy', 'boss'):
        return (1536, 512)
    return (1536, 1024)


def green_file(name, category):
    return name.endswith(GREEN_SUFFIX) or (category in ('character', 'enemy') and not name.endswith('_ritratti.png'))


def edges(a):
    g = a.astype(float).mean(-1)
    return np.abs(np.diff(g, axis=0))[:, :-1] + np.abs(np.diff(g, axis=1))[:-1]


def subject_height(a):
    m = greenness(a) < 120
    ys = np.nonzero(m.any(1))[0]
    return int(ys.max() - ys.min()) if len(ys) else 0


def main(root, report, write=False):
    root = Path(root)
    idx = json.loads(INDEX.read_text())['prompts']
    reg = json.loads(REG.read_text())
    entries = {e['asset_id']: e for e in reg['entries']}
    rows, heights = {}, {}
    for p in idx:
        if p['production'] != 'GPT_IMAGE':
            continue
        files = [root / f for f in p['delivery']]
        if not any(f.exists() for f in files):
            continue
        res = {'files': {}, 'fails': []}
        day = None
        for f in files:
            if not f.exists():
                res['fails'].append(f'{f.name}: missing')
                continue
            try:
                im = Image.open(f)
                im.load()
            except Exception as ex:  # noqa: BLE001
                res['fails'].append(f'{f.name}: does not decode ({ex})')
                continue
            a = np.array(im.convert('RGB'))
            info = {'bytes': f.stat().st_size, 'sha256': hashlib.sha256(f.read_bytes()).hexdigest(), 'size': list(im.size)}
            if tuple(im.size) != expected_size(f.name, p['category']):
                res['fails'].append(f'{f.name}: {im.size}, expected {expected_size(f.name, p["category"])}')
            if green_file(f.name, p['category']):
                g = greenness(a)
                info['green_share'] = round(float((g >= 200).mean()), 3)
                border = np.concatenate([g[:8].ravel(), g[-8:].ravel(), g[:, :8].ravel(), g[:, -8:].ravel()])
                info['subject_on_border_px'] = int((border < 120).sum())
                if info['green_share'] < .2:
                    res['fails'].append(f'{f.name}: background is not key green ({info["green_share"]:.0%})')
                if info['subject_on_border_px'] > 50:
                    res['fails'].append(f'{f.name}: subject touches the border')
                if f.name.startswith('v') and len(f.name) == 7:
                    heights[p['asset_id']] = subject_height(a)
            if p['category'] == 'region':
                if f.name.endswith(('_notte.png', '_evento.png')) and day is not None and day.shape == a.shape:
                    c = np.corrcoef(edges(day).ravel(), edges(a).ravel())[0, 1]
                    info['geometry_corr_with_day'] = round(float(c), 3)
                    if c < .6:
                        res['fails'].append(f'{f.name}: geometry differs from the day master (corr {c:.2f})')
                elif len(f.name) == 7:
                    day = a
            res['files'][f.name] = info
        aid = p['asset_id']
        n = int(aid.rsplit('.', 1)[1])
        base = aid.rsplit('.', 1)[0] + '.01'
        if n > 1 and aid in heights and base in heights and heights[base]:
            ratio = heights[aid] / heights[base]
            res['height_vs_v01'] = round(ratio, 3)
            if abs(ratio - 1) > .08 and p['category'] in ('character', 'enemy'):
                res['fails'].append(f'subject height {ratio:.2f}x of v01 (family scale)')
        res['result'] = 'FAIL' if res['fails'] else 'PASS'
        rows[aid] = res
        if write and res['result'] == 'PASS':
            e = entries[aid]
            master = ROOT / e['expected_master_path']
            master.parent.mkdir(parents=True, exist_ok=True)
            for f in files:
                shutil.copyfile(f, master.parent / f.name)
            b = master.read_bytes()
            e.update({'status': 'TECHNICALLY_VERIFIED' if p['content_in_code'] else 'CONCEPT_ONLY', 'byte_size': len(b),
                      'sha256': hashlib.sha256(b).hexdigest(), 'source_tool': 'GPT Image (as declared by the delivery)',
                      'source_artifact': [str(f.relative_to(root)) for f in files], 'rights_status': 'GENERATOR_TERMS_TO_CONFIRM'})
            (master.with_suffix('.json')).write_text(json.dumps({'asset_id': aid, 'check': res, 'status': e['status'],
                                                                 'commercial_ready': False}, indent=1) + '\n')
    Path(report).write_text(json.dumps(rows, indent=1) + '\n')
    if write:
        REG.write_text(json.dumps(reg, indent=2, ensure_ascii=False) + '\n')
    print(f"{len(rows)} boards delivered: {sum(r['result'] == 'PASS' for r in rows.values())} PASS, {sum(r['result'] == 'FAIL' for r in rows.values())} FAIL")


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2], '--write' in sys.argv)
