#!/usr/bin/env python3
"""Derivati dell'interfaccia premium di Argon (gruppo U, ramo delivery/argon-asset-giro2-20261110 @ f21e19d, mai modificato).
Uso: git archive origin/delivery/argon-asset-giro2-20261110 deliveries/argon-asset-giro2-20261110/U | tar -x -C <cartella>
     python3 tools/derive_argon_ui_20261111.py <cartella>/deliveries/argon-asset-giro2-20261110/U
Scrive game/art/ui/frame_menu.webp: la cornice «menu» di ui_cornici.png, ritagliata, senza fondo magenta e senza il
centro scuro, a 512x512. Si usa come border-image in game/style.css. Nessun pixel è disegnato da questo script."""
import hashlib,json,sys
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SRC=Path(sys.argv[1]);COMMIT='f21e19d'
def chroma(im):
    im=im.convert('RGBA');px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=px[x,y]
            if r>175 and b>175 and g<110 and (r-g)>90 and (b-g)>90: px[x,y]=(r,g,b,0);continue
            if r>g+15 and b>g+15 and not (r>200 and g>90):  # despill, ma non sui tubi rosa della cornice
                spill=min(r-g,b-g)-15;px[x,y]=(r-spill,g,b-spill,a)
    return im
def frame(board,quadrant,size,inner):
    w,h=board.width//2,board.height//2;qx,qy=quadrant
    im=chroma(board.crop((qx*w,qy*h,qx*w+w,qy*h+h)));im=im.crop(im.getbbox())
    im=im.resize((size,size),Image.LANCZOS);px=im.load()
    lo,hi=int(size*inner),int(size*(1-inner))
    for y in range(lo,hi):
        for x in range(lo,hi): px[x,y]=(0,0,0,0)  # il centro lo riempie il pannello del gioco
    return im
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
out=ROOT/'game/art/ui';out.mkdir(parents=True,exist_ok=True)
board=Image.open(SRC/'ui_cornici.png')
dest=out/'frame_menu.webp';frame(board,(0,0),512,.22).save(dest,'WEBP',lossless=True,method=6)
reg={'nota':"Derivati dell'interfaccia premium di Argon (gruppo U, 11 novembre 2026). Gli originali restano sul ramo di consegna e non si modificano.",
 'assets':[{'asset_id':'ui.frame.menu','versione':1,'brief':'requests/argon-interni-palazzi-20261109/GIRO_3_COMPLETO.md','derivato':'game/art/ui/frame_menu.webp',
  'grezzo':[f'delivery/argon-asset-giro2-20261110@{COMMIT}:deliveries/argon-asset-giro2-20261110/U/ui_cornici.png'],'grezzo_sha256':[sha(SRC/'ui_cornici.png')],
  'derivato_sha256':sha(dest),'stato':'INTEGRATED','nota':'cornice «menu» (quadrante in alto a sinistra), 512x512, senza fondo e senza centro, WebP senza perdita; border-image dei pannelli .card'}]}
(ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_UI_20261111.json').write_text(json.dumps(reg,ensure_ascii=False,indent=1)+'\n')
print(dest,dest.stat().st_size,'byte')
