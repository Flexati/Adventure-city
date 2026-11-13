#!/usr/bin/env python3
"""R24 (D70): i ritratti di bottegai e abitanti passano allo stesso linguaggio a pixel del gioco.

Sorgenti (mai modificate): assets/production/v10.3/derived/npc_src/*.jpg, cioe' i derivati precedenti, gia' registrati
(REGISTRO.json e REGISTRO_ARGON_20261109.json), spostati qui da game/art/npc/.
Uso: python3 tools/derive_portraits_pixel_20261113.py
Ogni ritratto viene ridotto a un terzo con media d'area (un pixel nuovo = 3x3 pixel vecchi), contrasto +8 %,
saturazione +6 %, poi portato a una tavolozza di 48 colori senza retinatura. Il gioco lo ingrandisce senza
sfumare. Scrive game/art/npc/<nome>.png, gli sfondi game/art/interiors/<nome>.webp (da
assets/production/v10.3/derived/interior_src/) e il registro con gli SHA-256.
"""
import json,hashlib
from pathlib import Path
from PIL import Image,ImageEnhance
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/production/v10.3/derived/npc_src';DEST=ROOT/'game/art/npc'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def pixel(im,colors=48):
    im=im.convert('RGB');small=im.resize((round(im.width/3),round(im.height/3)),Image.BOX)
    small=ImageEnhance.Color(ImageEnhance.Contrast(small).enhance(1.08)).enhance(1.06)
    return small.quantize(colors=colors,method=Image.MEDIANCUT,dither=Image.NONE)
def main():
    reg=[];total=0
    for src in sorted(SRC.glob('*.jpg')):
        out=DEST/(src.stem+'.png');im=pixel(Image.open(src));im.save(out,'PNG',optimize=True);total+=out.stat().st_size
        reg.append({'id':src.stem,'sorgente':str(src.relative_to(ROOT)),'sha256_sorgente':sha(src),'derivato':str(out.relative_to(ROOT)),'sha256_derivato':sha(out),'dimensioni':list(im.size),'byte':out.stat().st_size,
                    'operazione':'riduzione a un terzo con media d\'area, contrasto +8 %, saturazione +6 %, tavolozza di 48 colori senza retinatura'})
    # The fifteen shop backdrops get the same treatment (a quarter of the size, 56 colours), so figure and room match.
    BSRC=ROOT/'assets/production/v10.3/derived/interior_src';BDEST=ROOT/'game/art/interiors'
    for src in sorted(BSRC.glob('*.webp')):
        im=Image.open(src).convert('RGB');small=im.resize((im.width//4,im.height//4),Image.BOX);small=ImageEnhance.Color(ImageEnhance.Contrast(small).enhance(1.08)).enhance(1.06).quantize(colors=56,method=Image.MEDIANCUT,dither=Image.NONE).convert('RGB')
        out=BDEST/src.name;small.save(out,'WEBP',lossless=True,method=6);total+=out.stat().st_size
        reg.append({'id':'interno_'+src.stem,'sorgente':str(src.relative_to(ROOT)),'sha256_sorgente':sha(src),'derivato':str(out.relative_to(ROOT)),'sha256_derivato':sha(out),'dimensioni':list(small.size),'byte':out.stat().st_size,
                    'operazione':'riduzione a un quarto con media d\'area, contrasto +8 %, saturazione +6 %, tavolozza di 56 colori senza retinatura, WebP senza perdita'})
    (ROOT/'assets/production/v10.3/derived/REGISTRO_RITRATTI_PIXEL_20261113.json').write_text(json.dumps({'strumento':'tools/derive_portraits_pixel_20261113.py','derivati':reg},indent=1,ensure_ascii=False)+'\n')
    print(len(reg),'derivati',total,'byte')
if __name__=='__main__': main()
