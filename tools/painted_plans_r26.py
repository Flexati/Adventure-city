#!/usr/bin/env python3
"""R26: walkable plans of the 13 painted maps, drawn by hand on the pictures.

The plans written by tools/derive_argon_150_20261112.py came from a colour rule: in most maps the hero walked over
containers, machines, columns, shelves and walls. Here every map is described as rectangles of floor (OPEN) minus
rectangles of solid things (BLOCK), in tiles of 64 px (x0, y0, x1, y1, inclusive), read off a 24x24 grid laid on
the picture (tools/render overlay: `python3 tools/painted_plans_r26.py --overlay <dir>`).
Start, boss, nodes and spawns are then recomputed on the new floor with the same rule as before (spots() of the
derive script), keeping only the largest connected area.
Usage: python3 tools/painted_plans_r26.py [--overlay <dir>]      Writes game/painted-maps.mjs.
"""
import sys,json,importlib.util
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'game/painted-maps.mjs'
spec=importlib.util.spec_from_file_location('derive',ROOT/'tools/derive_argon_150_20261112.py');derive=importlib.util.module_from_spec(spec);spec.loader.exec_module(derive)

PLANS={
 # Ash Docks alley: three stacks of containers, the crane base, the warehouse row, the fence with its gate.
 'docks':{'open':[(9,4,15,4),(18,4,22,4),(5,5,22,6),(6,7,19,19),(1,17,22,19),(1,10,22,16),(9,20,14,20),(10,21,13,22)],
          'block':[(1,5,4,6),(1,7,5,9),(1,10,3,16),(7,7,10,16),(13,7,15,16),(20,7,22,12),(8,17,9,17),(1,19,7,19),(23,0,23,23)]},
 # Rooftop of Vega: central square, side walkways, the ladders between the towers, bottom walkway and stairs.
 'vega':{'open':[(3,6,4,19),(19,6,20,19),(3,9,20,11),(7,9,16,17),(3,19,20,19),(9,20,14,22)],'block':[]},
 # Nave of the Bone Tyrant: four broken columns per side, the altar wall, the door frame at the bottom.
 'tyrant':{'open':[(1,5,22,21),(10,22,13,22)],
           # Each broken column covers one tile across (x 205-265 on the left, 695-760 on the right) and two down.
           'block':[(5,6,5,7),(18,6,18,7),(5,10,5,11),(18,10,18,11),(5,14,5,15),(18,14,18,15),(5,18,5,19),(18,18,18,19),(8,18,9,21),(14,18,15,21)]},
 # Forge of the Behemoth: only the cross of catwalks; the presses stand on islands in the acid.
 'behemoth':{'open':[(10,4,13,22),(1,11,22,12),(9,10,14,13)],'block':[],
             'spots':{'nodes':[(2,11),(21,12),(11,5)],'spawns':[(4,12),(19,11),(12,4),(11,17)]}},
 # Building yard: dirt road, two paved yards full of machines, pallets, pipes and containers.
 'a_yard':{'open':[(1,2,22,22)],
           'block':[(1,4,9,4),(14,4,22,4),(1,5,2,8),(3,5,3,6),(5,5,9,6),(2,7,3,8),(5,7,7,9),(2,9,4,10),(1,11,5,13),(6,10,7,11),(6,12,8,13),(8,11,9,13),(10,11,10,12),
                    (2,14,3,15),(3,15,4,16),(5,14,5,14),(6,14,8,16),(2,17,8,18),(9,18,9,22),(10,18,10,19),(14,19,14,22),
                    (14,5,18,5),(19,4,20,6),(14,6,16,8),(18,7,20,8),(20,6,21,9),(13,9,15,11),(15,10,16,12),(14,12,15,13),(16,13,16,13),(18,9,18,11),(19,10,20,11),
                    (20,10,21,12),(19,13,21,15),(22,3,22,13),(18,14,19,16),(20,15,21,17),(13,15,16,16),(15,17,16,17),(13,17,13,17),(14,18,15,18)]},
 # Ruined courtyard before the breach: fallen columns, rubble, crates, the side chapel with its statues.
 'a_breach':{'open':[(5,3,16,17),(11,1,12,2),(9,17,14,22),(17,13,20,16),(18,10,21,12)],
             'block':[(5,3,10,3),(13,3,16,3),(5,4,5,6),(7,7,10,7),(9,6,10,6),(13,8,13,8),(15,8,16,8),(5,11,6,11),(14,12,16,13),(8,15,10,15),(19,10,20,11),(19,15,20,16)]},
 # Clinic ward: tiled corridors between cabinets, beds, tanks, glass cases and the long wall; two side rooms.
 'a_clinic':{'open':[(1,2,16,22),(17,8,22,13),(17,17,22,22)],
             'block':[(1,2,9,3),(13,2,16,2),(14,3,16,4),(1,6,1,20),(1,21,4,22),(4,7,5,9),(4,11,5,12),(4,13,5,15),(5,6,6,16),(7,6,10,7),(13,6,16,7),(7,9,11,11),(7,12,9,14),
                      (13,9,14,10),(15,8,16,11),(13,12,13,14),(7,16,10,17),(13,16,16,17),(7,19,9,19),(14,18,16,19),(5,21,8,22),(14,22,16,22),
                      (17,8,17,9),(17,13,17,13),(18,8,20,8),(21,8,22,10),(20,12,22,13),(17,17,17,19),(17,21,17,22),(18,17,22,17),(20,19,21,20),(18,21,19,21)]},
 # Clockwork node: only the brass walkways and the grates; the gears are machinery.
 'a_node':{'open':[(2,3,3,21),(2,3,9,4),(11,1,12,7),(7,7,16,7),(7,7,8,16),(15,7,16,15),(7,15,16,16),(16,11,22,12),(20,9,22,13),(11,16,12,22),(2,20,9,20),(4,10,6,13)],
           'block':[(8,9,8,10),(8,20,9,20)],
           'spots':{'start':(11,21),'boss':(11,7),'nodes':[(3,8),(21,11),(6,20)],'spawns':[(11,3),(7,13),(16,13),(19,11)]}},
 # Pier of the port: lanes between containers and crates, the chest platform on the left, the stairs at the bottom.
 'a_port':{'open':[(4,1,21,20),(1,1,4,2),(1,9,4,13),(10,21,13,22)],
           'block':[(6,1,9,2),(15,1,17,2),(8,4,10,5),(9,5,11,6),(7,5,7,8),(8,6,9,7),(7,8,8,9),(13,3,13,6),(13,7,15,7),(14,5,16,6),(17,6,17,9),(10,9,11,9),(9,10,10,11),
                    (8,11,9,11),(11,12,11,13),(8,12,10,12),(8,13,9,14),(10,13,10,13),(14,9,16,10),(14,11,15,11),(13,10,13,10),(17,10,17,10),(13,12,13,14),(14,13,16,13),
                    (15,14,16,14),(17,14,17,16),(13,15,13,16),(8,16,10,18),(15,17,17,18),(18,17,18,18),(15,19,16,19),(19,7,20,9),(19,12,20,13),(2,11,3,11)]},
 # Archive: halls between bookcases, broken columns and reading tables; stairs join the upper hall on the right.
 'a_archive':{'open':[(6,5,22,5),(11,2,12,4),(20,6,21,9),(11,7,12,8),(6,9,17,22),(18,9,21,22),(1,8,3,12),(4,11,5,13),(1,13,5,22)],
              'block':[(7,9,10,10),(9,10,9,12),(7,11,8,12),(14,9,14,11),(9,13,11,14),(13,12,15,12),(15,10,16,12),(7,14,8,14),(9,15,9,16),
                       (14,14,14,16),(15,13,16,16),(13,17,13,17),(6,9,6,16),(17,9,17,16),(6,17,10,19),(14,17,19,19),(7,22,9,22),(14,22,16,22),(6,22,6,22),(2,10,2,10),
                       (1,14,3,16),(2,17,4,18),(2,21,4,21),(4,19,4,19),(1,17,1,22),(20,10,20,11),(19,13,20,15),(22,9,22,21),(21,11,21,11),(20,16,20,16),(20,21,22,22),(18,13,18,15)],
              'spots':{'nodes':[(2,9),(20,12),(16,5)],'spawns':[(10,15),(21,16),(8,5),(3,20)]}},
 # Approach to the Axis: the platform over the void, its obelisks, the bridge to the chest.
 'a_axis':{'open':[(10,2,13,7),(8,8,15,14),(10,15,13,17),(9,18,14,21),(10,22,13,22),(16,11,17,12),(18,10,20,13)],
           'block':[(10,7,10,7),(13,7,13,7),(8,10,8,10),(15,10,15,10),(8,13,8,13),(15,13,15,13),(10,15,10,16),(13,15,13,16),(10,19,10,19),(13,19,13,19),(20,11,20,12)],
           'spots':{'nodes':[(11,3),(19,12),(8,12)],'spawns':[(12,5),(15,9),(11,17),(17,11)]}},
}
# The flooded quarter was close already: only its mistakes are corrected. The reaper's wheel is kept as it was.
PATCH={
 'flood':{'keep_rows':{1:(11,12),2:(11,12)},'block':[(10,11,12,13),(3,13,3,13),(3,15,3,15),(20,7,20,9)]},
}
def load():
    txt=OUT.read_text();return txt,json.loads(txt[txt.index('{',txt.index('PAINTED_MAPS=')):txt.rindex(';')])
def grid_from(m):return [[(int(h,16)>>(23-x))&1 for x in range(24)] for h in m]
def rects(g,rs,v):
    for x0,y0,x1,y1 in rs:
        for y in range(max(0,y0),min(23,y1)+1):
            for x in range(max(0,x0),min(23,x1)+1):g[y][x]=v
def largest(g):
    cells=[g[y][x] for y in range(24) for x in range(24)];best=[];seen=set()
    for i,c in enumerate(cells):
        if not c or i in seen:continue
        comp=[i];seen.add(i)
        for k in comp:
            x,y=k%24,k//24
            for n in ((k-1) if x>0 else -1,(k+1) if x<23 else -1,k-24,k+24):
                if 0<=n<576 and cells[n] and n not in seen:seen.add(n);comp.append(n)
        if len(comp)>len(best):best=comp
    keep=set(best);return [1 if i in keep else 0 for i in range(576)]
def build():
    txt,data=load()
    for id,p in PLANS.items():
        g=[[0]*24 for _ in range(24)];rects(g,p['open'],1);rects(g,p['block'],0);data[id]['_g']=g
    for id,p in PATCH.items():
        g=grid_from(data[id]['m'])
        for y,(a,b) in p.get('keep_rows',{}).items():
            for x in range(24):
                if not a<=x<=b:g[y][x]=0
        rects(g,p['block'],0);data[id]['_g']=g
    for id,d in data.items():
        g=d.pop('_g',None) or grid_from(d['m'])
        if id not in PLANS and id not in PATCH:continue
        cells=largest(g);s=derive.spots(cells)
        # Narrow walkways have no tile free on all sides, where the automatic rule fails: those spots are picked by hand.
        for k,v in (PLANS.get(id) or PATCH.get(id) or {}).get('spots',{}).items():s[k]=v
        if 'spawns' in s:s['entries']=s['spawns']
        for q in [s['start'],s['boss'],*s['nodes'],*s['spawns']]:assert cells[q[1]*24+q[0]],(id,q,'not on the floor')
        d['m']=[format(int(''.join(map(str,cells[y*24:y*24+24])),2),'06x') for y in range(24)]
        for k,v in s.items():d[k]=list(v) if k in('start','boss') else [list(q) for q in v]
    head=txt[:txt.index('export const PAINTED_MAPS=')].replace('Do not edit by hand.','Plans redrawn by hand in R26 (tools/painted_plans_r26.py).')
    OUT.write_text(head+'export const PAINTED_MAPS='+json.dumps(data,separators=(',',':'))+';\n');return data
def overlay(data,out):
    from PIL import Image,ImageDraw
    Path(out).mkdir(parents=True,exist_ok=True)
    for id,m in data.items():
        g=grid_from(m['m']);im=Image.open(ROOT/f'game/art/maps/{id}.webp').convert('RGBA').resize((960,960));ov=Image.new('RGBA',im.size,(0,0,0,0));d=ImageDraw.Draw(ov);c=40
        for y in range(24):
            for x in range(24):d.rectangle([x*c,y*c,x*c+c-1,y*c+c-1],fill=(255,0,0,80)) if not g[y][x] else d.rectangle([x*c,y*c,x*c+c-1,y*c+c-1],outline=(0,255,120,110))
        for k,col in (('start',(0,255,0,255)),('boss',(255,230,0,255))):x,y=m[k];d.ellipse([x*c+8,y*c+8,x*c+32,y*c+32],fill=col)
        for x,y in m['nodes']:d.rectangle([x*c+10,y*c+10,x*c+30,y*c+30],fill=(0,200,255,255))
        for x,y in m['spawns']:d.polygon([(x*c+20,y*c+6),(x*c+34,y*c+34),(x*c+6,y*c+34)],fill=(255,80,255,255))
        im.alpha_composite(ov);im.convert('RGB').save(Path(out)/f'{id}.png')
if __name__=='__main__':
    data=build();print({k:sum(bin(int(h,16)).count('1') for h in v['m']) for k,v in data.items()})
    if '--overlay' in sys.argv:overlay(data,sys.argv[sys.argv.index('--overlay')+1])
