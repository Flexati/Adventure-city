"""Choose and install the race props used by the game (game/art/v10/race_*.png).

Two candidate sets, both checked by compose_terra_race_props.py against race_props.json:
  - procedural: Terra round 3 delivery (delivery/terra-giro3-gara-20261028, immagini/*_edit.png),
    34 assets drawn in code at game size;
  - GPT: 15 hand-drawn images (delivery/gpt-rigenerazione-92-20261028, gara/), fitted by
    tools/fit_gpt_race_props.py.
For every asset the GPT version is used when it PASSES its checks and, for states, when its base
also uses the GPT version (a hit or night frame must come from the same drawing as its base);
otherwise the procedural one. Assets the game does not draw (nitro flames) are not installed.

usage: build_race_props_runtime.py <procedural edits dir> <gpt dir> <work dir> <report.json>
"""
import hashlib
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tools'))
from race_props_lib import load_spec  # noqa: E402

UNUSED = {'race_nitro_flame_vortex', 'race_nitro_flame_veyra', 'race_nitro_flame_rivali'}


def run(*a):
    return subprocess.run([sys.executable, '-I', *a], cwd=ROOT, capture_output=True, text=True)


def main(proc_edits, gpt_dir, work, report):
    work = Path(work)
    fit = work / 'gpt_fit'
    run('tools/fit_gpt_race_props.py', gpt_dir, str(fit), str(work / 'gpt_fit.json'))
    run('tools/compose_terra_race_props.py', proc_edits, str(work / 'proc'), str(work / 'proc.json'))
    run('tools/compose_terra_race_props.py', str(fit), str(work / 'gpt'), str(work / 'gpt.json'))
    proc = json.loads((work / 'proc.json').read_text())['assets']
    gpt = json.loads((work / 'gpt.json').read_text())['assets']
    spec = load_spec()
    chosen, rows = {}, {}
    for a in sorted(spec['assets'], key=lambda a: bool(a.get('hit_of') or a.get('night_of'))):
        n = a['name']
        if n in UNUSED:
            continue
        base = a.get('hit_of') or a.get('night_of')
        g = gpt.get(n, {}).get('result') == 'PASS' and (not base or chosen.get(base) == 'gpt')
        src = 'gpt' if g else 'proc'
        if src == 'proc' and proc.get(n, {}).get('result') != 'PASS':
            rows[n] = {'installed': False, 'why': 'no candidate passes its checks'}
            continue
        chosen[n] = src
        f = work / src / f'{n}.png'
        dst = ROOT / f'game/art/v10/{n}.png'
        shutil.copyfile(f, dst)
        b = dst.read_bytes()
        rows[n] = {'installed': True, 'source': 'GPT (fitted)' if g else 'procedural (Terra round 3)',
                   'gpt_check': gpt.get(n, {}).get('result', 'not delivered'), 'gpt_fails': gpt.get(n, {}).get('fails', []),
                   'procedural_check': proc.get(n, {}).get('result'), 'runtime': f'game/art/v10/{n}.png',
                   'bytes': len(b), 'sha256': hashlib.sha256(b).hexdigest()}
    Path(report).write_text(json.dumps(rows, indent=1, ensure_ascii=False) + '\n')
    print(sum(1 for r in rows.values() if r.get('source', '').startswith('GPT')), 'GPT,',
          sum(1 for r in rows.values() if r.get('source', '').startswith('proc')), 'procedural,',
          sum(1 for r in rows.values() if not r['installed']), 'not installed')


if __name__ == '__main__':
    main(*sys.argv[1:5])
