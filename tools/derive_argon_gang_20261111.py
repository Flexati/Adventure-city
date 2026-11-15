#!/usr/bin/env python3
"""Foglio nemico `gang_signal` dai due fogli Argon giro 2 (gang_signal_a = azione, gang_signal_b = reazione).
Uso: python3 tools/derive_argon_gang_20261111.py <cartella>/deliveries/argon-asset-giro2-20261110
Scrive game/art/chrono/gang_signal.png nel formato 'c' di game/chrono-art.mjs (8 colonne da 256 px, righe da 128 px:
idle 4, walk 4, anticipation 4, attack 2, recover 2, hurt 4, defeat 4) e aggiunge la voce al registro del giro 2.
Le pose vengono solo ritagliate, scalate e allineate ai piedi: nessun pixel è disegnato da questo script."""
import hashlib,json,sys
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];SRC=Path(sys.argv[1]);COMMIT='e776c13'
CW,CH,FOOT=256,128,120
def chroma(im):
    im=im.convert('RGBA');px=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=px[x,y]
            if r>175 and b>175 and g<110 and (r-g)>90 and (b-g)>90: px[x,y]=(r,g,b,0);continue
            if r>g+15 and b>g+15:
                spill=min(r-g,b-g)-15;px[x,y]=(r-spill,g,b-spill,a)
    return im
def poses(im,step=4,min_px=3000):
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
            if n*step*step>=min_px: boxes.append([x1*step,y1*step,(x2+1)*step,(y2+1)*step])
    merged=True
    while merged:  # scintille e fiammate staccate tornano alla loro figura
        merged=False
        for i in range(len(boxes)):
            for j in range(i+1,len(boxes)):
                a,b=boxes[i],boxes[j]
                if a[0]<b[2]+6 and b[0]<a[2]+6 and a[1]<b[3]+6 and b[1]<a[3]+6:
                    boxes[i]=[min(a[0],b[0]),min(a[1],b[1]),max(a[2],b[2]),max(a[3],b[3])];boxes.pop(j);merged=True;break
            if merged: break
    top=sorted([b for b in boxes if (b[1]+b[3])/2<im.height/2],key=lambda b:b[0]);bottom=sorted([b for b in boxes if (b[1]+b[3])/2>=im.height/2],key=lambda b:b[0])
    return [im.crop(tuple(b)) for b in top+bottom]
A=poses(chroma(Image.open(SRC/'N/gang_signal_a.png')));B=poses(chroma(Image.open(SRC/'N/gang_signal_b.png')))
assert len(A)==7 and len(B)==7,(len(A),len(B))
# a: 0 fermo col razzo, 1-2 passi, 3 razzo alzato, 4 fermo, 5 lancio, 6 fermo. b: 0 fermo, 1 colpito, 2 barcolla, 3-4 in ginocchio, 5 cade, 6 a terra.
ka=118/A[0].height                # figura in piedi con antenna: 118 px nella cella
kb=ka*(A[0].height*.74)/(B[0].height*.80)  # stessa altezza del corpo: nel foglio b la figura è disegnata più grande
ORDER=[('a',0),('a',4),('a',0),('a',6), ('a',1),('a',2),('a',1),('a',2), ('a',0),('a',3),('a',3),('a',3), ('a',5),('a',5), ('a',3),('a',0),
       ('b',1),('b',2),('b',2),('b',1), ('b',3),('b',5),('b',6),('b',6)]
sheet=Image.new('RGBA',(CW*8,CH*3),(0,0,0,0))
body_w=round(A[0].width*ka)
for i,(src,n) in enumerate(ORDER):
    im=(A if src=='a' else B)[n];k=ka if src=='a' else kb
    s=im.resize((max(1,round(im.width*k)),max(1,round(im.height*k))),Image.LANCZOS)
    if s.height>FOOT: s=s.crop((0,s.height-FOOT,s.width,s.height))
    cx,cy=(i%8)*CW,(i//8)*CH
    x=cx+(CW-body_w)//2 if (src,n)==('a',5) else cx+(CW-s.width)//2   # nel lancio la fiammata esce a destra: si allinea il corpo
    x=max(cx,min(x,cx+CW-s.width))
    sheet.alpha_composite(s,(x,cy+FOOT-s.height))
out=ROOT/'game/art/chrono/gang_signal.png';sheet.save(out,optimize=True)
reg_path=ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_GIRO2_20261110.json';reg=json.loads(reg_path.read_text())
raws=['N/gang_signal_a.png','N/gang_signal_b.png']
entry={'asset_id':'enemy.gang_signal','versione':1,'brief':'requests/argon-interni-palazzi-20261109/GIRO_2.md','derivato':str(out.relative_to(ROOT)),
 'grezzo':[f'delivery/argon-asset-giro2-20261110@{COMMIT}:deliveries/argon-asset-giro2-20261110/{r}' for r in raws],
 'grezzo_sha256':[hashlib.sha256((SRC/r).read_bytes()).hexdigest() for r in raws],'derivato_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'stato':'INTEGRATED',
 'nota':f'foglio nemico 2048x384, celle 256x128 formato c; azione dal foglio _a (scala {ka:.3f}), colpito e caduta dal foglio _b (scala {kb:.3f}); fondo magenta rimosso; piedi a y={FOOT}'}
reg['assets']=[a for a in reg['assets'] if a['asset_id']!=entry['asset_id']]+[entry]
reg_path.write_text(json.dumps(reg,ensure_ascii=False,indent=1)+'\n')
print('gang_signal scritto',sheet.size,'ka',round(ka,3),'kb',round(kb,3),'altezza corpo dichiarata',round(118*.74))
