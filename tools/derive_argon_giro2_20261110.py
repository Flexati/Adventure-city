#!/usr/bin/env python3
"""Derivati della consegna Argon del 10 novembre 2026 (ramo delivery/argon-asset-giro2-20261110, mai modificato).
Uso: git archive origin/delivery/argon-asset-giro2-20261110 deliveries/argon-asset-giro2-20261110 | tar -x -C <cartella>
     python3 tools/derive_argon_giro2_20261110.py <cartella>/deliveries/argon-asset-giro2-20261110
Scrive game/art/v10/race_*.webp (strade 720x1440 e atlante auto Vortex 1536x512) e aggiorna il registro dei derivati.
Le strade scelte sono solo quelle con la carreggiata parallela per tutta l'altezza: prova_strada.png e
strada_aurelia_tramonto.png hanno la prospettiva che converge e non diventano tegole."""
import hashlib,json,sys
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SRC=Path(sys.argv[1]);COMMIT='e776c13'
# Strade: sorgente 1024x2048 -> tegola 720x1440 (stesso formato delle race_ashdocks_*).
ROADS={
 'race_solkara_convogli_day':('S/strada_solkara_giorno.png','convogli sotto i teloni e condotte interrate'),
 'race_solkara_pozzo_day':('S/strada_solkara_giorno_v2.png','accampamento e pompa petrolifera'),
 'race_solkara_reti_day':('P/prova_strada_v2.png','reti frangivento e tubi affioranti (prova approvata)'),
 'race_solkara_convogli_storm':('S/strada_solkara_tempesta.png','convogli nella tempesta di sabbia'),
 'race_solkara_pozzo_storm':('S/strada_solkara_tempesta_v2.png','impianto di pompaggio nella tempesta'),
 'race_aurelia_campata_day':('S/strada_aurelia_giorno.png','campata con parapetti in ottone e lanterne'),
 'race_aurelia_torri_day':('S/strada_aurelia_giorno_v2.png','torri a ingranaggi con quadranti senza numeri'),
 'race_aurelia_torri_dusk':('S/strada_aurelia_tramonto_v2.png','torri al tramonto con lanterne accese'),
}
# Auto Vortex: foglio 1536x1024 con 8 viste su fondo magenta, NON allineate a una griglia fissa:
# si separano per componenti connesse. Ordinate per riga e poi da sinistra: r0 = integra, graffiata,
# ammaccata, distrutta col fumo; r1 = isometrica, nitro, fari, fari con alone.
# Atlante derivato 1536x512, celle 384x256 come VEYRA_CAR: riga 0 = 4 stati di integrità; riga 1 = nitro, isometrica, fari, fari con alone.
# Allineamento verticale: il fumo sta sopra e le fiamme sotto, quindi la cella si ancora alla cima o al fondo del corpo dell'auto integra.
VORTEX_ORDER=[((0,0),(0,0),'c'),((0,1),(0,1),'c'),((0,2),(0,2),'c'),((0,3),(0,3),'b'),((1,1),(1,0),'t'),((1,0),(1,1),'c'),((1,2),(1,2),'b'),((1,3),(1,3),'b')]
BODY_H=196  # altezza del corpo auto nell'atlante, come VEYRA_CAR.bodyHeight
def chroma(im):
    im=im.convert('RGBA');px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=px[x,y]
            if r>175 and b>175 and g<110 and (r-g)>90 and (b-g)>90: px[x,y]=(r,g,b,0);continue
            # despill: toglie il velo magenta dai bordi e dai fasci semitrasparenti (il rosso dei fanali ha b basso e resta intatto)
            if r>g+15 and b>g+15:
                spill=min(r-g,b-g)-15
                px[x,y]=(r-spill,g,b-spill,a)
    return im
reg_path=ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_GIRO2_20261110.json'
reg={'nota':'Derivati della consegna Argon giro 2 del 10 novembre 2026. Gli originali restano sul ramo di consegna e non si modificano.','assets':[]}
def record(asset_id,raws,out,note):
    entry={'asset_id':asset_id,'versione':1,'brief':'requests/argon-interni-palazzi-20261109/GIRO_2.md','derivato':str(out.relative_to(ROOT)),
     'grezzo':[f'delivery/argon-asset-giro2-20261110@{COMMIT}:deliveries/argon-asset-giro2-20261110/{r}' for r in raws],
     'grezzo_sha256':[hashlib.sha256((SRC/r).read_bytes()).hexdigest() for r in raws],
     'derivato_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'stato':'INTEGRATED','nota':note}
    reg['assets']=[a for a in reg['assets'] if a['asset_id']!=asset_id]+[entry]
for name,(rel,note) in ROADS.items():
    out=ROOT/'game/art/v10'/f'{name}.webp'
    Image.open(SRC/rel).convert('RGB').resize((720,1440),Image.LANCZOS).save(out,'WEBP',quality=84,method=6)
    record(f'race.road.{name}',[rel],out,f'tegola strada 720x1440, WebP qualità 84 — {note}')
# Atlante Vortex
sheet=chroma(Image.open(SRC/'S/auto_vortex.png'))
def components(im,step=4,min_px=400):
    w,h=im.width//step,im.height//step;px=im.load()
    mask=[[any(px[x*step+dx,y*step+dy][3]>0 for dx in range(step) for dy in range(step)) for x in range(w)] for y in range(h)]
    seen=[[False]*w for _ in range(h)];boxes=[]
    for y0 in range(h):
        for x0 in range(w):
            if not mask[y0][x0] or seen[y0][x0]: continue
            stack=[(x0,y0)];seen[y0][x0]=True;x1=x2=x0;y1=y2=y0;n=0
            while stack:
                x,y=stack.pop();n+=1;x1=min(x1,x);x2=max(x2,x);y1=min(y1,y);y2=max(y2,y)
                for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1),(x-1,y-1),(x+1,y-1),(x-1,y+1),(x+1,y+1)):
                    if 0<=nx<w and 0<=ny<h and mask[ny][nx] and not seen[ny][nx]: seen[ny][nx]=True;stack.append((nx,ny))
            if n*step*step>=min_px: boxes.append([x1*step,y1*step,(x2+1)*step,(y2+1)*step])
    # unisce scatole che si sovrappongono o quasi (effetti staccati dal corpo, es. fiammate)
    merged=True
    while merged:
        merged=False
        for i in range(len(boxes)):
            for j in range(i+1,len(boxes)):
                a,b=boxes[i],boxes[j]
                if a[0]<b[2]+12 and b[0]<a[2]+12 and a[1]<b[3]+12 and b[1]<a[3]+12:
                    boxes[i]=[min(a[0],b[0]),min(a[1],b[1]),max(a[2],b[2]),max(a[3],b[3])];boxes.pop(j);merged=True;break
            if merged: break
    return boxes
boxes=components(sheet)
assert len(boxes)==8,f'attese 8 viste, trovate {len(boxes)}: {boxes}'
rows={0:[],1:[]}
for b in boxes: rows[0 if (b[1]+b[3])/2<sheet.height/2 else 1].append(b)
grid={}
for r in (0,1):
    assert len(rows[r])==4,f'riga {r}: {len(rows[r])} viste'
    for c,b in enumerate(sorted(rows[r],key=lambda b:b[0])): grid[(r,c)]=b
b0=grid[(0,0)];h0=b0[3]-b0[1];k=BODY_H/h0
top_y=128-BODY_H/2;bot_y=128+BODY_H/2
atlas=Image.new('RGBA',(1536,512),(0,0,0,0))
for (sr,sc),(dr,dc),anchor in VORTEX_ORDER:
    b=grid[(sr,sc)];cut=sheet.crop(tuple(b))
    scaled=cut.resize((max(1,round(cut.width*k)),max(1,round(cut.height*k))),Image.LANCZOS)
    x=dc*384+round(192-scaled.width/2)
    y=dr*256+round({'c':128-scaled.height/2,'t':top_y,'b':bot_y-scaled.height}[anchor])
    atlas.alpha_composite(scaled,(x,y))
out=ROOT/'game/art/v10/race_vortex_car.webp'
atlas.save(out,'WEBP',quality=92,method=6)
record('race.car.vortex',['S/auto_vortex.png'],out,
 f'atlante 1536x512, celle 384x256 (riga 0: integrità 100-0; riga 1: nitro, isometrica, fari, fari con alone), corpo auto {BODY_H}px, scala {k:.3f}, fondo magenta rimosso')
reg_path.write_text(json.dumps(reg,ensure_ascii=False,indent=1)+'\n')
print('derivati scritti:',len(reg['assets']),'| scala vortex',round(k,3),'| viste:',{k2:tuple(v) for k2,v in sorted(grid.items())})
