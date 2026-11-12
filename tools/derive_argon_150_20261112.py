#!/usr/bin/env python3
"""R20-c: derivati delle mappe dipinte di Argon (consegna argon-150min-20261112) e loro piante calpestabili.

Originali: ramo delivery/argon-asset-giro2-20261110, cartella deliveries/argon-150min-20261112/ (mai modificati).
Uso: python3 tools/derive_argon_150_20261112.py <cartella con la consegna estratta> [--sheet overlay.png]
Scrive game/art/maps/<id>.webp, game/painted-maps.mjs (piante 24x24) e il registro con gli SHA-256.
La pianta nasce da una regola dichiarata (vuoto scuro, acqua, acido, cielo = non calpestabile) e viene poi
tenuta solo la zona collegata piu' grande: e' una stima del codice, non un rilievo fatto a mano.
"""
import sys,json,hashlib,colorsys
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
MAPS={ # id: (file, regola in piu')
 'docks':('D3/mappa_ashdocks_vicolo.png','night'),'flood':('D2/mappa_glassflood_a.png','water'),'reaper':('D2/mappa_glassflood_b.png','water'),
 'vega':('D1/arena_vega.png','sky'),'tyrant':('D7/arena_bone_tyrant.png',''),'behemoth':('D7/arena_forge_behemoth.png','acid'),
 'a_yard':('D5/avvicinamento_cantiere.png',''),'a_breach':('D5/avvicinamento_breccia.png',''),'a_clinic':('D5/avvicinamento_clinica.png',''),
 'a_node':('D5/avvicinamento_nodo.png',''),'a_port':('D5/avvicinamento_porto.png','water'),'a_archive':('D5/avvicinamento_archivio.png',''),
 'a_axis':('D5/avvicinamento_asse.png','')}
# The eight broken columns of the nave, read off the picture: they are cover.
PILLARS={'tyrant':[(5,6),(19,6),(5,10),(18,10),(5,15),(18,15),(5,19),(18,19)]}
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def blocked(px,rule):
    n=len(px);r=sum(p[0] for p in px)/n;g=sum(p[1] for p in px)/n;b=sum(p[2] for p in px)/n;lum=.3*r+.59*g+.11*b
    dark=sum(1 for p in px if .3*p[0]+.59*p[1]+.11*p[2]<26)/n
    if rule=='night':
        return sum(1 for p in px if .3*p[0]+.59*p[1]+.11*p[2]<11)/n>.6
    if rule=='acid' and sum(1 for p in px if p[1]>150 and p[1]>p[0]*1.25 and p[1]>p[2]*1.6)/n>.22: return True
    if dark>.55 or lum<22: return True
    h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255)
    if rule=='water' and .42<h<.58 and s>.45 and lum<95: return True
    if rule=='acid' and .22<h<.40 and s>.6 and v>.55: return True
    if rule=='sky' and (h>.72 or h<.09) and s>.25 and v>.45: return True
    return False
def plan(im,rule):
    small=im.convert('RGB').resize((24*8,24*8),Image.BOX);cells=[]
    for y in range(24):
        for x in range(24):
            px=[small.getpixel((x*8+i,y*8+j)) for i in range(8) for j in range(8)]
            cells.append(0 if (x in(0,23) or y in(0,23) or blocked(px,rule)) else 1)
    best=[];seen=set()
    for i,c in enumerate(cells):
        if not c or i in seen: continue
        comp=[i];seen.add(i)
        for k in comp:
            x,y=k%24,k//24
            for n in ((k-1) if x>0 else -1,(k+1) if x<23 else -1,k-24,k+24):
                if 0<=n<576 and cells[n] and n not in seen: seen.add(n);comp.append(n)
        if len(comp)>len(best): best=comp
    keep=set(best);return [1 if i in keep else 0 for i in range(576)]
def spots(cells):
    free=[(i%24,i//24) for i,c in enumerate(cells) if c]
    # A spot needs free neighbours all around, so a 36 px body never starts inside a wall.
    roomy=[p for p in free if all(cells[(p[1]+dy)*24+p[0]+dx] for dx in(-1,0,1) for dy in(-1,0,1))] or free
    far=lambda p,q:abs(p[0]-q[0])+abs(p[1]-q[1])
    start=max(roomy,key=lambda p:(p[1],-abs(p[0]-12)));boss=min(roomy,key=lambda p:far(p,(12,9)))
    picks=[start];nodes=[]
    for _ in range(3):
        n=max(roomy,key=lambda p:min(far(p,q) for q in picks));nodes.append(n);picks.append(n)
    spawns=[]
    for _ in range(4):
        n=max(roomy,key=lambda p:min(far(p,q) for q in picks+spawns)*(1 if far(p,start)>5 else 0));spawns.append(n)
    return {'start':start,'boss':boss,'nodes':nodes,'spawns':spawns,'entries':spawns}
def main():
    src=Path(sys.argv[1]);out=ROOT/'game/art/maps';out.mkdir(parents=True,exist_ok=True);reg=[];data={};tiles=[]
    for id,(rel,rule) in MAPS.items():
        im=Image.open(src/rel).convert('RGB');assert im.size==(1536,1536),rel
        dest=out/(id+'.webp');im.save(dest,'WEBP',quality=82,method=6)
        cells=plan(im,rule)
        for x,y in PILLARS.get(id,()): cells[y*24+x]=0
        s=spots(cells)
        data[id]={'m':[format(int(''.join(map(str,cells[y*24:y*24+24])),2),'06x') for y in range(24)],**{k:(list(v) if k in('start','boss') else [list(p) for p in v]) for k,v in s.items()}}
        reg.append({'id':id,'originale':'deliveries/argon-150min-20261112/'+rel,'sha256_originale':sha(src/rel),'derivato':'game/art/maps/'+id+'.webp','sha256_derivato':sha(dest),'byte':dest.stat().st_size,'operazione':'conversione RGB a WebP q82, stesse dimensioni','caselle_calpestabili':sum(cells),'regola_pianta':rule or 'solo vuoto scuro'})
        ov=im.resize((384,384));px=ov.load()
        for i,c in enumerate(cells):
            if not c:
                for a in range(16):
                    for b in range(0,16,2):
                        X=(i%24)*16+a;Y=(i//24)*16+b;p=px[X,Y];px[X,Y]=(255,p[1]//3,p[2]//3)
        for k,col in(('start',(0,255,0)),('boss',(255,255,0))):
            x,y=s[k]
            for a in range(4,12):
                for b in range(4,12): px[x*16+a,y*16+b]=col
        for x,y in s['nodes']:
            for a in range(5,11):
                for b in range(5,11): px[x*16+a,y*16+b]=(0,255,255)
        tiles.append(ov)
    (ROOT/'game/painted-maps.mjs').write_text('// Generated by tools/derive_argon_150_20261112.py from the painted maps of the Argon delivery (R20-c). Do not edit by hand.\n// m: 24 rows, one hex word of 24 bits each (1 = floor); positions are tiles.\nexport const PAINTED_MAPS='+json.dumps(data,separators=(',',':'))+';\n')
    (ROOT/'assets/production/v10.3/derived/REGISTRO_ARGON_150_20261112.json').write_text(json.dumps({'consegna':'argon-150min-20261112','ramo':'delivery/argon-asset-giro2-20261110','strumento':'tools/derive_argon_150_20261112.py','derivati':reg},indent=1,ensure_ascii=False)+'\n')
    if '--sheet' in sys.argv:
        S=Image.new('RGB',(384*5,384*3),'#222')
        for i,t in enumerate(tiles): S.paste(t,((i%5)*384,(i//5)*384))
        S.save(sys.argv[sys.argv.index('--sheet')+1])
    print(sum(r['byte'] for r in reg),'byte in',len(reg),'mappe')
if __name__=='__main__': main()
