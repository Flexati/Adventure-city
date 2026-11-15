#!/usr/bin/env python3
"""Derivati della consegna Argon del 9 novembre 2026 (ramo delivery/argon-asset-20261109, mai modificato).
Uso: git archive origin/delivery/argon-asset-20261109 deliveries/argon-asset-20261109 | tar -x -C <cartella>
     python3 tools/derive_argon_20261109.py <cartella>/deliveries/argon-asset-20261109
Scrive game/art/interiors/*.webp (1280x720) e game/art/npc/svc_*.jpg (375x500) e aggiorna il registro dei derivati."""
import hashlib,json,sys
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SRC=Path(sys.argv[1]);COMMIT='2a34c6a'
# Variante scelta per ogni interno: quella che mostra ciò che il testo del luogo racconta (game/interiors.mjs).
INTERIORS={'moon_inn':'','moon_smith':'','moon_shop':'','cathedral_smith':'','cathedral_relic':'','cathedral_shop':'','cathedral_info':'',
 'toxic_smith':'_v2','toxic_alchemist':'_v2','toxic_shop':'_v2','toxic_info':'_v2','clockwork_smith':'','clockwork_shop':'_v2','clockwork_relic':'_v2','clockwork_info':''}
PORTRAITS=['moon_shop','cathedral_smith','cathedral_info','toxic_smith','clockwork_shop','clockwork_relic','clockwork_info','cathedral_gate_guard']
# Registro a parte: REGISTRO.json resta dei fogli che passano i 10 controlli (tests/art-derived.test.mjs).
reg_path=ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_20261109.json'
reg={'nota':'Derivati della consegna Argon del 9 novembre 2026. Gli originali restano sul ramo di consegna e non si modificano.','assets':[]}
def record(asset_id,raw,out,note):
    entry={'asset_id':asset_id,'versione':1,'brief':'requests/argon-interni-palazzi-20261109/INDICE.md','derivato':str(out.relative_to(ROOT)),
     'grezzo':f'delivery/argon-asset-20261109@{COMMIT}:deliveries/argon-asset-20261109/{raw.relative_to(SRC)}','grezzo_sha256':hashlib.sha256(raw.read_bytes()).hexdigest(),
     'derivato_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'stato':'INTEGRATED','nota':note}
    reg['assets']=[a for a in reg['assets'] if a['asset_id']!=asset_id]+[entry]
(ROOT/'game/art/interiors').mkdir(exist_ok=True)
for name,variant in INTERIORS.items():
    raw=SRC/'A'/f'{name}{variant}.png';out=ROOT/'game/art/interiors'/f'{name}.webp'
    Image.open(raw).convert('RGB').resize((1280,720),Image.LANCZOS).save(out,'WEBP',quality=84,method=6)
    record(f'interior.{name}',raw,out,'ridotto a 1280x720, WebP qualità 84')
for name in PORTRAITS:
    raw=SRC/'I'/f'{name}.png';out=ROOT/'game/art/npc'/f'svc_{name}.jpg'
    Image.open(raw).convert('RGB').resize((375,500),Image.LANCZOS).save(out,'JPEG',quality=88,optimize=True)
    record(f'portrait.svc_{name}',raw,out,'ridotto a 375x500, JPEG qualità 88')
reg_path.write_text(json.dumps(reg,ensure_ascii=False,indent=1)+'\n')
