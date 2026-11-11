#!/usr/bin/env python3
"""Derivati del terzo giro di Argon (ramo delivery/argon-asset-giro2-20261110 @ f39dd3d, mai modificato).
Uso: git archive origin/delivery/argon-asset-giro2-20261110 deliveries/argon-asset-giro2-20261110 | tar -x -C <cartella>
     python3 tools/derive_argon_giro3_20261111.py <cartella>/deliveries/argon-asset-giro2-20261110
Scrive:
- game/art/chrono/<id>.png: fogli nemici nel formato 'c' di game/chrono-art.mjs (8 colonne, righe da 128 px:
  idle 4, walk 4, anticipation 4, attack 2, recover 2, hurt 4, defeat 4) da <id>_a (azione) e <id>_b (reazione);
- game/art/atti/atto_<n>.webp: le quattro schede degli atti a 1280x720.
Le pose vengono solo ritagliate, scalate e allineate ai piedi: nessun pixel è disegnato da questo script.
Stampa per ogni nemico la riga da mettere in FOE_CELLS."""
import hashlib,json,sys
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SRC=Path(sys.argv[1]);COMMIT='f39dd3d'
CH,FOOT=128,120
# id: altezza in px della figura ferma dentro la cella (lascia spazio alle armi alzate)
FOES={'gang_shooter':96,'gang_breaker':92,'alien_breaker':62,'infected_brute':92,'port_patrol':96}
def chroma(im):
    im=im.convert('RGBA');px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=px[x,y]
            if r>175 and b>175 and g<110 and (r-g)>90 and (b-g)>90: px[x,y]=(r,g,b,0);continue
            if r>g+15 and b>g+15:
                spill=min(r-g,b-g)-15;px[x,y]=(r-spill,g,b-spill,a)
    return im
def poses(im,count=6,step=4,min_px=2500):
    w,h=im.width//step,im.height//step;px=im.load()
    mask=[[any(px[x*step+dx,y*step+dy][3]>0 for dx in (0,2) for dy in (0,2)) for x in range(w)] for y in range(h)]
    seen=[[False]*w for _ in range(h)];boxes=[]
    for y0 in range(h):
        for x0 in range(w):
            if not mask[y0][x0] or seen[y0][x0]: continue
            stack=[(x0,y0)];seen[y0][x0]=True;x1=x2=x0;y1=y2=y0;n=0
            while stack:
                x,y=stack.pop();n+=1;x1=min(x1,x);x2=max(x2,x);y1=min(y1,y);y2=max(y2,y)
                for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1),(x-1,y-1),(x+1,y-1),(x-1,y+1),(x+1,y+1)):
                    if 0<=nx<w and 0<=ny<h and mask[ny][nx] and not seen[ny][nx]: seen[ny][nx]=True;stack.append((nx,ny))
            boxes.append([x1*step,y1*step,(x2+1)*step,(y2+1)*step,n*step*step])
    big=[b for b in boxes if b[4]>=min_px];small=[b for b in boxes if b[4]<min_px]
    gap=lambda a,b:max(max(b[0]-a[2],a[0]-b[2],0),max(b[1]-a[3],a[1]-b[3],0))
    while len(big)>count:  # numero di figure noto per foglio: il pezzo più piccolo (scudo caduto, arma a terra) torna alla figura più vicina
        s=min(big,key=lambda b:b[4]);big.remove(s);b=min(big,key=lambda b:gap(b,s))
        b[0]=min(b[0],s[0]);b[1]=min(b[1],s[1]);b[2]=max(b[2],s[2]);b[3]=max(b[3],s[3]);b[4]+=s[4]
    for s in small:  # scintille e schizzi: alla figura più vicina, se entro 40 px
        best=None
        for b in big:
            dx=max(b[0]-s[2],s[0]-b[2],0);dy=max(b[1]-s[3],s[1]-b[3],0);d=max(dx,dy)
            if d<=40 and (best is None or d<best[0]): best=(d,b)
        if best: b=best[1];b[0]=min(b[0],s[0]);b[1]=min(b[1],s[1]);b[2]=max(b[2],s[2]);b[3]=max(b[3],s[3])
    top=sorted([b for b in big if (b[1]+b[3])/2<im.height/2],key=lambda b:b[0]);bottom=sorted([b for b in big if (b[1]+b[3])/2>=im.height/2],key=lambda b:b[0])
    return [im.crop(tuple(b[:4])) for b in top+bottom]
# a: 0 guardia, 1-2 passi, 3 carica, 4 colpo, 5 ritorno. b: 0 fermo, 1-2 colpito, 3 in ginocchio, 4 cade, 5 a terra.
ORDER=[('a',0),('a',5),('a',0),('a',5), ('a',1),('a',2),('a',1),('a',2), ('a',0),('a',3),('a',3),('a',3), ('a',4),('a',4), ('a',5),('a',0),
       ('b',1),('b',2),('b',2),('b',1), ('b',3),('b',4),('b',5),('b',5)]
# Lo sfondatore ha 7 pose per foglio. a: 0 accovacciato dietro lo scudo, 1-2 corsa, 3-4 carica, 5 colpo, 6 guardia in piedi.
# b: 0 fermo, 1-2 colpito, 3-4 si riprende, 5 cade, 6 a terra (scudo e piede di porco caduti accanto).
SPECIAL={'gang_breaker':(7,6,[('a',6),('a',6),('a',0),('a',0), ('a',1),('a',2),('a',1),('a',2), ('a',6),('a',3),('a',4),('a',4), ('a',5),('a',5), ('a',6),('a',0),
 ('b',1),('b',2),('b',2),('b',1), ('b',2),('b',5),('b',6),('b',6)])}
reg_path=ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_GIRO3_20261111.json'
reg={'nota':'Derivati del terzo giro di Argon (11 novembre 2026). Gli originali restano sul ramo di consegna e non si modificano.','assets':[]}
def record(asset_id,raws,out,note):
    reg['assets'].append({'asset_id':asset_id,'versione':1,'brief':'requests/argon-interni-palazzi-20261109/GIRO_3_COMPLETO.md','derivato':str(out.relative_to(ROOT)),
     'grezzo':[f'delivery/argon-asset-giro2-20261110@{COMMIT}:deliveries/argon-asset-giro2-20261110/{r}' for r in raws],
     'grezzo_sha256':[hashlib.sha256((SRC/r).read_bytes()).hexdigest() for r in raws],'derivato_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'stato':'INTEGRATED','nota':note})
for fid,target in FOES.items():
    n,ra,order=SPECIAL.get(fid,(6,0,ORDER))
    A=poses(chroma(Image.open(SRC/f'N/{fid}_a.png')),n);B=poses(chroma(Image.open(SRC/f'N/{fid}_b.png')),n)
    assert len(A)==n and len(B)==n,(fid,len(A),len(B))
    ka=target/A[ra].height;kb=ka*A[ra].height/B[0].height   # la figura in piedi dei due fogli ha la stessa altezza
    tallest=max([p.height*ka for p in A]+[p.height*kb for p in B])
    if tallest>FOOT-2: f=(FOOT-2)/tallest;ka*=f;kb*=f
    scaled=[]
    for src,n in order:
        im=(A if src=='a' else B)[n];k=ka if src=='a' else kb
        scaled.append((src,n,im.resize((max(1,round(im.width*k)),max(1,round(im.height*k))),Image.LANCZOS)))
    cw=max(160,-(-max(s.width for _,_,s in scaled)//16)*16)
    sheet=Image.new('RGBA',(cw*8,CH*3),(0,0,0,0));body_w=scaled[0][2].width
    for i,(src,n,s) in enumerate(scaled):
        cx,cy=(i%8)*cw,(i//8)*CH
        x=cx+(cw-body_w)//2 if (src,n)==order[12] else cx+(cw-s.width)//2   # nel colpo l'effetto esce in avanti: si allinea il corpo
        x=max(cx,min(x,cx+cw-s.width));sheet.alpha_composite(s,(x,cy+FOOT-s.height))
    out=ROOT/'game/art/chrono'/f'{fid}.png';sheet.save(out,optimize=True)
    idle_h=scaled[0][2].height
    record(f'enemy.{fid}',[f'N/{fid}_a.png',f'N/{fid}_b.png'],out,f'foglio nemico {sheet.width}x{sheet.height}, celle {cw}x128 formato c; azione dal foglio _a (scala {ka:.3f}), colpito e caduta dal foglio _b (scala {kb:.3f}); fondo magenta rimosso; piedi a y={FOOT}')
    print(f"{fid}:[{cw},'c',{idle_h}]  ({out.stat().st_size//1024} KB)")
(ROOT/'game/art/atti').mkdir(exist_ok=True)
for n in (1,2,3,4):
    out=ROOT/'game/art/atti'/f'atto_{n}.webp'
    Image.open(SRC/f'C/atto_{n}.png').convert('RGB').resize((1280,720),Image.LANCZOS).save(out,'WEBP',quality=82,method=6)
    record(f'act.card.{n}',[f'C/atto_{n}.png'],out,'scheda dell\'atto, ridotta a 1280x720, WebP qualità 82')
    print(out.name,out.stat().st_size//1024,'KB')
reg_path.write_text(json.dumps(reg,ensure_ascii=False,indent=1)+'\n')
