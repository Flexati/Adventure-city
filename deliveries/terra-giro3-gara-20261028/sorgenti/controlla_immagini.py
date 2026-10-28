"""Check the delivered race props against template, mask and MISURE.json (Terra round 3).

Usage: python3 -I sorgenti/controlla_immagini.py   (from deliveries/terra-giro3-gara-20261028)

Per image in immagini/:
- same size and mode as the template in the request package;
- outside the mask every pixel is still the template's pure green #00FF00;
- inside the mask no pixel is near the key green without being it (no ambiguous key edges);
- then the team's own tool, tools/compose_terra_race_props.py, brings every edit back to game size
  and checks zone, collision box, cover, beam crossing and same silhouette for hit and night states.
Writes CONTROLLI_IMMAGINI.json and RICOMPOSIZIONE.json, exit 1 on any failure.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

DELIVERY = Path(__file__).resolve().parents[1]
ROOT = DELIVERY.parents[1]
PACK = ROOT / 'requests/terra-giro3-gara-20261028/pacchetto'
NEAR = 90


def main():
    spec = json.loads((PACK / 'MISURE.json').read_text())['assets']
    rows, fails, missing = {}, [], []
    for a in spec:
        name, f = a['name'], DELIVERY / 'immagini' / f'{a["name"]}_edit.png'
        if not f.exists():
            missing.append(name)
            continue
        tpl = np.asarray(Image.open(PACK / 'modelli' / f'{name}.png').convert('RGB')).astype(int)
        mask = np.asarray(Image.open(PACK / 'modelli' / f'{name}_mask.png').convert('RGBA'))[..., 3] > 127
        im = Image.open(f)
        e = np.asarray(im.convert('RGB')).astype(int)
        f_ = []
        if e.shape != tpl.shape:
            f_.append(f'size {e.shape[1]}x{e.shape[0]}, template {tpl.shape[1]}x{tpl.shape[0]}')
        else:
            out = (np.abs(e - tpl).sum(axis=2) > 0) & ~mask
            if out.any():
                f_.append(f'{int(out.sum())} px changed outside the mask')
            dist = np.sqrt(((e - (0, 255, 0)) ** 2).sum(axis=2))
            amb = mask & (dist > 0) & (dist < NEAR)
            if amb.any():
                f_.append(f'{int(amb.sum())} px close to the key green inside the mask')
            drawn = mask & (dist > 0)
            rows[name] = {'size': [e.shape[1], e.shape[0]], 'mask_px': int(mask.sum()), 'drawn_px': int(drawn.sum()),
                          'drawn_share_of_mask': round(float(drawn.sum() / mask.sum()), 3), 'fails': f_}
        fails += [f'{name}: {x}' for x in f_]
    tool = subprocess.run([sys.executable, '-I', str(ROOT / 'tools/compose_terra_race_props.py'), str(DELIVERY / 'immagini'),
                           str(DELIVERY / 'ricomposte'), str(DELIVERY / 'RICOMPOSIZIONE.json')], capture_output=True, text=True)
    team = json.loads((DELIVERY / 'RICOMPOSIZIONE.json').read_text())
    result = 'FAIL' if fails or team['result'] == 'FAIL' else 'PASS'
    report = {'result': result, 'checked': len(rows), 'missing': missing, 'template_and_mask': rows,
              'team_tool': {'command': 'python3 -I tools/compose_terra_race_props.py immagini ricomposte RICOMPOSIZIONE.json',
                            'result': team['result'], 'composed': team['composed'], 'missing': team['missing']},
              'not_checked': 'Artistic quality, readability while racing and look on device: no human review and no in-game test.'}
    (DELIVERY / 'CONTROLLI_IMMAGINI.json').write_text(json.dumps(report, indent=1) + '\n')
    print(result, f'{len(rows)} checked, {len(missing)} missing', *fails, tool.stdout.strip(), sep='\n')
    return 1 if result == 'FAIL' else 0


if __name__ == '__main__':
    sys.exit(main())
