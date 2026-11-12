#!/usr/bin/env python3
"""R20-c: striscia di Vega dai due fogli di Argon (D1/vega_a.png, D1/vega_b.png; originali mai modificati).

Uso: python3 tools/derive_argon_vega_20261112.py <cartella consegna> [--list]
Taglia le pose per componenti connesse sul fondo #00FF00, ne sceglie nove (stesso ordine delle strisce dei boss:
idle, anticipation, attack, phase_transition, stagger, core_exposed, final_hit, collapse, reward_portal) e le
allinea ai piedi in celle 384x256. Scrive game/art/chrono/vega.png e aggiunge le voci ai due manifesti.
"""
import sys,json,hashlib
from pathlib import Path
from PIL import Image
import numpy as np
ROOT=Path(__file__).resolve().parents[1];CW,CH=384,256
def poses(path):
    im=Image.open(path).convert('RGB');a=np.asarray(im).astype(int)
    fg=~((a[:,:,1]>170)&(a[:,:,0]<110)&(a[:,:,2]<110));small=fg[::4,::4];lab=np.zeros(small.shape,int);boxes=[];n=0
    for y,x in zip(*np.nonzero(small)):
        if lab[y,x]: continue
        n+=1;st=[(y,x)];lab[y,x]=n;x0=x1=x;y0=y1=y;c=0
        while st:
            cy,cx=st.pop();c+=1;x0=min(x0,cx);x1=max(x1,cx);y0=min(y0,cy);y1=max(y1,cy)
            for dy in(-2,-1,0,1,2):
                for dx in(-2,-1,0,1,2):
                    ny,nx=cy+dy,cx+dx
                    if 0<=ny<small.shape[0] and 0<=nx<small.shape[1] and small[ny,nx] and not lab[ny,nx]: lab[ny,nx]=n;st.append((ny,nx))
        if c>250: boxes.append([int(x0)*4,int(y0)*4,int(x1)*4+4,int(y1)*4+4])
    boxes.sort(key=lambda b:b[1]);rows=[]
    for b in boxes:
        if rows and b[1]<rows[-1][0][3]-40: rows[-1].append(b)
        else: rows.append([b])
    return im,fg,[sorted(r,key=lambda b:b[0]) for r in rows]
PICK=[('a',0,0),('a',2,0),('a',3,0),('b',2,5),('b',0,0),('b',0,4),('b',0,1),('b',3,2),('b',3,4)]
NAMES=['idle','anticipation','attack','phase_transition','stagger','core_exposed','final_hit','collapse','reward_portal']
def main():
    src=Path(sys.argv[1])/'D1';S={k:poses(src/('vega_%s.png'%k)) for k in 'ab'}
    if '--list' in sys.argv:
        for k in 'ab': print(k,[len(r) for r in S[k][2]],[[b[3]-b[1] for b in r] for r in S[k][2]])
        return
    tall=max(S[k][2][r][i][3]-S[k][2][r][i][1] for k,r,i in PICK);scale=min(1,(CH-14)/tall)
    strip=Image.new('RGBA',(CW*5,CH*2),(0,0,0,0))
    for n,(k,r,i) in enumerate(PICK):
        im,fg,rows=S[k];x0,y0,x1,y1=rows[r][i];cut=im.crop((x0,y0,x1,y1)).convert('RGBA');m=Image.fromarray((fg[y0:y1,x0:x1]*255).astype('uint8'));cut.putalpha(m)
        px=np.asarray(cut).copy();g=(px[:,:,1]>px[:,:,0]*1.5)&(px[:,:,1]>px[:,:,2]*1.5)&(px[:,:,1]>120);px[g,3]=0;cut=Image.fromarray(px)
        k2=min(scale,(CW-8)/cut.width);w,h=max(1,round(cut.width*k2)),max(1,round(cut.height*k2));cut=cut.resize((w,h),Image.LANCZOS)
        strip.alpha_composite(cut,((n%5)*CW+(CW-w)//2,(n//5)*CH+CH-10-h))
    out=ROOT/'game/art/chrono/vega.png';strip.save(out,optimize=True)
    sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
    def entries(M):
        base=[a for a in M['animations'] if a['character_id']=='shadow_reaper'];M['animations']=[a for a in M['animations'] if a['character_id']!='vega']
        for a in base:
            b=json.loads(json.dumps(a));b['character_id']='vega'
            if 'atlas_reference' in b: b['atlas_reference']='vega'
            b['sprite_width']=CW;b['sprite_height']=CH;b['pivot_x']=CW//2;b['pivot_y']=CH-10
            cell=lambda i:{'x':(i%5)*CW,'y':(i//5)*CH,'width':CW,'height':CH}
            b['frame_rectangles']=[cell(i) for i in(4,5,6,7,8)] if a['animation_id']=='defeat' else [cell(NAMES.index(a['animation_id']))]
            M['animations'].append(b)
        at=json.loads(json.dumps(M['atlases']['shadow_reaper']));at.update(path='art/chrono/vega.png',width=CW*5,height=CH*2,cell_width=CW,atlas_columns=5,frame_count=len(PICK),bytes=out.stat().st_size,source='argon-150min-20261112/D1',reserve=False);at.pop('source_row',None);M['atlases']['vega']=at
    p=ROOT/'game/art/chrono/manifest.json';M=json.loads(p.read_text());entries(M);p.write_text(json.dumps(M,indent=1,ensure_ascii=False)+'\n')
    full=M;p=ROOT/'game/chrono-manifest.mjs';t=p.read_text();head='export const CHRONO_MANIFEST=';i=t.index(head)+len(head);R=json.loads(t[i:].strip()[:-1])
    for id in ('shadow_reaper','cathedral_bone_tyrant','toxic_forge_behemoth','vega'):
        R['atlases'][id]=full['atlases'][id];R['animations']=[a for a in R['animations'] if a['character_id']!=id]+[a for a in full['animations'] if a['character_id']==id]
    p.write_text(t[:i]+json.dumps(R,separators=(',',':'),ensure_ascii=False)+';\n')
    reg=ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_150_20261112.json';J=json.loads(reg.read_text());J['derivati']=[d for d in J['derivati'] if d['id']!='vega']+[{'id':'vega','originale':['deliveries/argon-150min-20261112/D1/vega_a.png','deliveries/argon-150min-20261112/D1/vega_b.png'],'sha256_originale':[sha(src/'vega_a.png'),sha(src/'vega_b.png')],'derivato':'game/art/chrono/vega.png','sha256_derivato':sha(out),'byte':out.stat().st_size,'operazione':'nove pose ritagliate per componenti connesse, fondo verde reso trasparente, scala %.3f, allineate ai piedi in celle 384x256'%scale}];reg.write_text(json.dumps(J,indent=1,ensure_ascii=False)+'\n')
    print('vega.png',strip.size,out.stat().st_size,'scala',round(scale,3))
if __name__=='__main__': main()
