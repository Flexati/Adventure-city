"""Audit of the V10.2 production: what exists on GitHub for the 92 immediate images and the
310 preproduction boards, read from the branches themselves (git ls-tree, no checkout).

States per item:
  missing      no file at the expected place on any branch
  present      a file exists (candidate), not yet composed or checked
  checked      a measured report exists for it (path given)
  integrated   used by a runtime sheet in game/art on the work branch
  rejected     present but recorded as not usable

usage: audit_v10_2_production.py <out.json> <out.md>   (run after `git fetch origin`)
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORK = 'HEAD'  # the work branch as checked out, so a batch is counted in the commit that delivers it
GPT = 'origin/delivery/gpt-rigenerazione-92-20261028'
ARMI = 'origin/delivery/terra-giro2-armi-20261027'
GARA = 'origin/delivery/terra-giro3-gara-20261028'
SHEETS = ['nox_vx9_gun', 'nox_vx9_reload', 'lulu_r12_gun', 'lulu_r12_reload']
RACE = ['gpt_barrier_post_porto', 'gpt_crane_beam_porto_day', 'gpt_crane_beam_porto_night', 'gpt_crane_load_porto_reti',
        'gpt_crane_load_porto_reti_colpito', 'gpt_crane_load_porto_tubi', 'gpt_crane_load_porto_tubi_colpito',
        'gpt_crane_trolley_porto', 'gpt_obstacle_porto_bobina', 'gpt_obstacle_porto_bobina_colpito',
        'gpt_obstacle_porto_casse', 'gpt_obstacle_porto_casse_colpito', 'gpt_pad_nitro_porto', 'gpt_slick_olio_a',
        'gpt_slick_olio_b']
STATES = ['base', 'danno1', 'danno2', 'danno3', 'notte_a', 'notte_b']


def git(*a):
    return subprocess.run(['git', *a], cwd=ROOT, capture_output=True, text=True).stdout


def tree(ref):
    return set(git('ls-tree', '-r', '--name-only', ref).split('\n')) - {''}


def label(ref):
    return 'work/chronos-adventure-commercial (HEAD)' if ref == WORK else ref.removeprefix('origin/')


def head(ref):
    return git('rev-parse', '--short', ref).strip()


def main(out_json, out_md):
    t = {r: tree(r) for r in (WORK, GPT, ARMI, GARA)}
    items = []

    def add(group, name, where=None, checked=None, integrated=None, rejected=None, note=''):
        state = 'missing'
        if where:
            state = 'present'
        if checked and checked in t[WORK]:
            state = 'checked'
        if integrated and integrated in t[WORK]:
            state = 'integrated'
        if rejected:
            state = 'rejected'
        items.append({'group': group, 'name': name, 'state': state, 'file': where, 'report': checked,
                      'runtime': integrated if state == 'integrated' else None, 'note': note})

    for sheet in SHEETS:
        for r in range(4):
            for c in range(4):
                n = f'{sheet}_r{r}c{c}_edit.png'
                p = f'deliveries/terra-giro2-armi-20261027/{sheet}/{n}'
                where = f'{label(ARMI)}:{p}' if p in t[ARMI] else None
                rep = f'deliveries/terra-giro2-armi-20261027/{sheet}/REPORT.json'
                add('armi', n, where, checked=None)
    for n in RACE:
        p = f'deliveries/gpt-rigenerazione-92-20261028/gara/{n}.png'
        add('gara', n + '.png', f'{label(GPT)}:{p}' if p in t[GPT] else None,
            checked='docs/evidence/v10.2/production/gara_gpt_report.json')
    for car in ('rival02', 'rival03'):
        for s in STATES:
            n = f'{car}_{s}.png'
            p = f'deliveries/gpt-rigenerazione-92-20261028/auto-store/{n}'
            derived = f'assets/source/rival_cars/derived/{n}'
            where = f'{label(GPT)}:{p}' if p in t[GPT] else (f'work:{derived}' if derived in t[WORK] else None)
            note = 'derived by tools/derive_rival03_states.py from the GPT base' if where and 'derived' in where else ''
            add('auto', n, where, checked=f'assets/source/rival_cars/{car}_report.json',
                integrated=f'game/art/v10/race_{car}_car.png', note=note)
    p = 'deliveries/gpt-rigenerazione-92-20261028/auto-store/store_feature.png'
    add('store', 'store_feature.png', f'{label(GPT)}:{p}' if p in t[GPT] else None,
        checked='docs/evidence/v10.2/production/store_feature_report.json')

    reg = json.loads((ROOT / 'docs/gold/VARIANTI_PREPRODUZIONE_V10_2_20261028.json').read_text())
    boards = []
    for e in reg['entries']:
        present = e['expected_master_path'] in t[WORK]
        boards.append({'asset_id': e['asset_id'], 'category': e['category'],
                       'state': 'present' if present else 'missing', 'registry_status': e['status']})

    def count(xs, key='group'):
        out = {}
        for x in xs:
            g = out.setdefault(x[key], {})
            g[x['state']] = g.get(x['state'], 0) + 1
        return out

    rep = {'heads': {label(r): head(r) for r in t}, 'immediate_92': {'total': len(items), 'by_group': count(items), 'items': items},
           'boards_310': {'total': len(boards), 'by_category': count(boards, 'category'), 'items': boards},
           'commercial_release': 'BLOCKED'}
    Path(out_json).write_text(json.dumps(rep, indent=1, ensure_ascii=False) + '\n')

    L = ['# Audit produzione V10.2', '', 'Generato da `tools/audit_v10_2_production.py` leggendo i branch su GitHub (git ls-tree). '
         'Stati: missing = nessun file; present = candidato non ancora controllato; checked = rapporto di misura esistente; '
         'integrated = usato da uno sheet in `game/art`; rejected = scartato. `COMMERCIAL_RELEASE = BLOCKED`.', '', '## Branch', '']
    L += [f'- `{b}` @ `{h}`' for b, h in rep['heads'].items()]
    L += ['', '## 92 immagini immediate', '', '| Gruppo | Totale | missing | present | checked | integrated | rejected |', '|---|---:|---:|---:|---:|---:|---:|']
    for g, c in rep['immediate_92']['by_group'].items():
        L.append(f'| {g} | {sum(c.values())} | ' + ' | '.join(str(c.get(s, 0)) for s in ('missing', 'present', 'checked', 'integrated', 'rejected')) + ' |')
    tot = {}
    for x in items:
        tot[x['state']] = tot.get(x['state'], 0) + 1
    L.append(f'| **Totale** | **{len(items)}** | ' + ' | '.join(f"**{tot.get(s, 0)}**" for s in ('missing', 'present', 'checked', 'integrated', 'rejected')) + ' |')
    L += ['', '## 310 tavole di preproduzione', '', '| Categoria | Totale | present | missing |', '|---|---:|---:|---:|']
    for g, c in rep['boards_310']['by_category'].items():
        L.append(f'| {g} | {sum(c.values())} | {c.get("present", 0)} | {c.get("missing", 0)} |')
    L += ['', '## Dettaglio 92', '', '| Gruppo | File | Stato | Dove | Nota |', '|---|---|---|---|---|']
    for x in items:
        L.append(f"| {x['group']} | `{x['name']}` | {x['state']} | {('`' + x['file'] + '`') if x['file'] else '—'} | {x['note']} |")
    Path(out_md).write_text('\n'.join(L) + '\n')
    print(json.dumps({'92': rep['immediate_92']['by_group'], '310': rep['boards_310']['by_category']}))


if __name__ == '__main__':
    main(*sys.argv[1:3])
