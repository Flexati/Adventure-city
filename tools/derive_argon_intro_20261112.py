#!/usr/bin/env python3
"""Derivati della key art dell'intro JaguarzCreatorz (Argon, ramo delivery/argon-asset-giro2-20261110 @ 10592a7, mai modificato).
Uso: git archive origin/delivery/argon-asset-giro2-20261110 deliveries/argon-asset-giro2-20261110/JAGUAR_INTRO | tar -x -C <cartella>
     python3 tools/derive_argon_intro_20261112.py <cartella>/deliveries/argon-asset-giro2-20261110/JAGUAR_INTRO
Scrive game/art/brand/jaguar_keyart_{16x9,9x16}.webp (stessa risoluzione, WebP qualità 80) e il registro. Nessun pixel è ridisegnato."""
import hashlib,json,sys
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SRC=Path(sys.argv[1]);COMMIT='10592a7'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
out=ROOT/'game/art/brand';assets=[]
for n,size in (('16x9',(1920,1080)),('9x16',(1080,1920))):
    src=SRC/f'jaguar_intro_keyart_{n}.png';im=Image.open(src).convert('RGB');assert im.size==size,(n,im.size)
    dest=out/f'jaguar_keyart_{n}.webp';im.save(dest,'WEBP',quality=80,method=6)
    assets.append({'asset_id':f'brand.studio.keyart.{n}','versione':1,'brief':'requests/argon-interni-palazzi-20261109/GIRO_3_COMPLETO.md','derivato':f'game/art/brand/{dest.name}',
     'grezzo':[f'delivery/argon-asset-giro2-20261110@{COMMIT}:deliveries/argon-asset-giro2-20261110/JAGUAR_INTRO/{src.name}'],'grezzo_sha256':[sha(src)],'derivato_sha256':sha(dest),
     'stato':'INTEGRATED','nota':f'key art a tutto schermo {size[0]}x{size[1]}, WebP qualità 80; sfondo dell\'intro dello studio (CSS), il nome dello studio è testo del gioco'})
    print(dest,dest.stat().st_size,'byte')
(ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_INTRO_20261112.json').write_text(json.dumps({'nota':"Derivati dell'intro dello studio (12 novembre 2026). Gli originali restano sul ramo di consegna e non si modificano.",'assets':assets},ensure_ascii=False,indent=1)+'\n')
