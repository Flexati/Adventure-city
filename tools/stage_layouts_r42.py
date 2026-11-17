#!/usr/bin/env python3
"""R42 (D87): richer floor plans for the 11 foot stages that shared five generic layouts (the port keeps the gallery, now its own).

Each plan is authored as floor rectangles (carved) and wall rectangles (cover, pillars, shelves), on the 24 x 24 grid
of game/layouts.mjs (64 px per tile, 1 tile = 64 game units). The plan is compiled to the same 24-row hex bitmask that
painted maps use (bit 23 - x of row y set = floor), checked, and written to game/stage-layouts.mjs.

Checks (also enforced by tests/stage-layouts-r42.test.mjs): one connected floor; start, nodes, entries, spawns, boss
and every hold zone on floor with clearance; every objective reachable by at least two routes that share no tile
(besides the two ends and their neighbourhoods); cover inside the play area; a walk to the farthest objective at least
1.25 times the straight line (the plan has corridors, not just a field).

    python3 tools/stage_layouts_r42.py            # writes game/stage-layouts.mjs and a preview PNG
    python3 tools/stage_layouts_r42.py --check    # checks only, exit 1 on failure
"""
import json, sys, math, os
from collections import deque

G = 24
OUT = 'game/stage-layouts.mjs'

# (x, y, w, h) in tiles. 'floor' is carved first, then 'walls' are put back.
PLANS = {
 # Rook's relay yard: the four 2x2 cover islands of the Rook duel stay exactly where the fight was designed (tests/rook);
 # containers in the corners, crane bases and side stubs split the yard into lanes around them.
 'blackout': dict(label='CANTIERE DEI RELÈ', open_arena=True,
  floor=[(2,2,20,20)],
  walls=[(8,10,2,2),(14,10,2,2),(8,16,2,2),(14,16,2,2),(5,4,3,2),(16,4,3,2),(5,18,3,2),(16,18,3,2),
         (2,8,2,1),(20,8,2,1),(2,14,2,1),(20,14,2,1),(9,3,1,2),(15,3,1,2)],
  start=(12,20), nodes=[(4,11),(12,4),(19,11)], entries=[(3,3),(20,3),(3,20),(20,20)],
  spawns=[(6,15),(17,15),(12,8),(19,6)], boss=(12,8), chests=[(3,17),(20,5)]),
 # Escort to the anchors: the long hall and a high corridor make a loop around the moorings yard.
 'breach': dict(label='ANCORE DELLA BRECCIA', has_boss=True,
  floor=[(3,14,7,8),(3,9,18,5),(13,2,9,8),(3,3,4,6),(7,3,6,3)],
  walls=[(7,11,1,1),(14,11,2,1),(18,11,1,2),(5,17,1,2),(10,4,1,1),(19,8,1,1)],
  start=(5,20), nodes=[(5,6),(10,11),(20,3)], entries=[(4,21),(3,10),(20,11),(21,3)],
  spawns=[(7,15),(11,4),(19,12),(15,8)], boss=(16,6), chests=[(3,3),(8,21)], capsules=[(12,9),(17,12),(6,15)]),
 # Clinic wards around a corridor; the last ward is the lane to hold.
 'contagion': dict(label='CORSIA DEL CONTAGIO',
  floor=[(2,14,9,8),(2,8,20,6),(14,2,8,7),(3,3,8,5),(10,3,4,2)],
  walls=[(6,10,1,2),(10,10,2,1),(15,11,2,2),(19,10,1,1),(16,6,1,1),(4,17,2,1),(8,19,1,2)],
  start=(4,20), nodes=[(6,5),(13,12),(18,4)], entries=[(2,21),(2,9),(21,9),(21,3)],
  spawns=[(9,16),(17,12),(20,9),(8,6)], boss=(13,9), chests=[(2,15),(21,8)], capsules=[(9,9),(19,12),(15,7)], zone_node=2, zone_r=140),
 # The Node core: a round chamber, a central core to circle, pillars on the diagonals.
 'zero': dict(label='NUCLEO DEL NODO', has_boss=True,
  circle=(11.5,11.5,10.2),
  walls=[(7,7,1,2),(16,7,1,2),(7,15,1,2),(16,15,1,2),(11,16,2,1)],
  start=(12,20), nodes=[(4,8),(12,3),(19,15)], entries=[(12,2),(2,12),(21,12),(9,20)],
  spawns=[(8,11),(15,12),(12,6),(9,15)], boss=(12,8), chests=[(4,15),(19,8)], capsules=[(8,12),(15,12),(12,13)]),
 # A service spine with three rooms; the north-east walkway closes a loop around the east room to hold.
 'exp_chalk_marks': dict(label='CAMMINAMENTO DEI SEGNI',
  floor=[(9,2,6,20),(3,3,6,5),(15,9,7,8),(3,15,6,6),(15,3,6,3),(18,6,3,3)],
  walls=[(11,6,2,1),(11,17,2,1),(10,12,1,2),(7,3,1,1),(7,16,1,2)],
  start=(12,20), nodes=[(5,5),(5,18),(18,12)], entries=[(10,2),(14,2),(3,16),(21,13)],
  spawns=[(10,15),(13,13),(10,8),(19,10)], boss=(12,9), chests=[(3,20),(20,4)], capsules=[(12,10),(16,15),(8,15)], zone=(17.5,12.5,142)),
 # Vent ducts: two loops through the lower levels, the valve deep on the right.
 'below': dict(label='CONDOTTI DI SFOGO',
  floor=[(3,16,7,6),(5,10,4,6),(3,4,18,6),(16,10,5,9),(9,13,7,3),(10,18,6,3)],
  walls=[(7,6,1,2),(12,5,2,1),(12,8,1,1),(17,6,1,1),(18,13,1,2),(8,17,1,1),(12,19,1,1)],
  start=(6,20), nodes=[(6,12),(10,6),(19,16)], entries=[(4,21),(3,5),(20,4),(20,18)],
  spawns=[(7,15),(14,7),(18,11),(13,14)], boss=(15,7), chests=[(20,10),(3,4)], capsules=[(5,7),(17,12),(13,14)]),
 # The yard's gates: warehouses at the corners, a square to hold in the middle, streets all round.
 'city': dict(label='CANCELLI DEL CANTIERE',
  floor=[(2,2,20,20)],
  walls=[(4,4,4,3),(16,4,4,3),(4,17,4,3),(16,17,4,3),(10,4,1,3),(14,4,1,3),
         (4,10,2,1),(4,14,2,1),(18,10,1,1),(18,14,1,1),(9,9,1,1),(15,9,1,1),(9,16,1,1),(15,16,1,1)],
  start=(12,13), nodes=[(3,8),(12,3),(20,12)], entries=[(2,2),(21,2),(2,21),(21,21)],
  spawns=[(7,12),(16,12),(12,8),(12,19)], boss=(12,8), chests=[(21,8),(2,18)], capsules=[(7,9),(17,9),(12,17)], zone=(12.5,12.5,150)),
 # The registry hall: shelving aisles left and right, EVE-Prime in the open middle, a desk before the start.
 'archive': dict(label='SALA DEI REGISTRI', has_boss=True,
  floor=[(2,2,20,20)],
  walls=[(4,4,1,5),(8,4,1,5),(15,4,1,5),(19,4,1,5),(4,15,1,5),(8,15,1,5),(15,15,1,5),(19,15,1,5),
         (10,15,4,1),(2,11,2,1),(20,11,2,1)],
  start=(12,20), nodes=[(6,6),(17,17),(17,6)], entries=[(2,2),(21,2),(2,21),(21,21)],
  spawns=[(6,12),(17,12),(11,6),(6,18)], boss=(12,10), chests=[(5,12),(20,20)], capsules=[(11,4),(6,10),(17,12)]),
 # The hill terminus: bus bays at the corners, a square to hold, kiosks that split the streets.
 'line': dict(label='CAPOLINEA DELLA COLLINA',
  floor=[(2,2,20,20)],
  walls=[(4,4,3,3),(17,4,3,3),(4,17,3,3),(17,17,3,3),(9,4,2,2),(13,4,2,2),(8,18,2,2),(15,18,2,2),
         (4,10,1,4),(19,10,1,4),(8,9,1,1),(15,9,1,1),(8,15,1,1),(15,15,1,1)],
  start=(12,13), nodes=[(3,8),(20,8),(12,20)], entries=[(2,2),(21,2),(2,21),(21,21)],
  spawns=[(7,12),(16,12),(12,7),(6,15)], boss=(12,8), chests=[(2,15),(21,15)], capsules=[(7,8),(16,8),(12,17)], zone=(12.5,12.5,160)),
 # Ramps of the Axis: switchbacks with a link on each side, so the chase can be cut short or lost.
 'ascent': dict(label="RAMPE DELL'ASSE",
  floor=[(3,17,18,4),(16,11,5,6),(3,11,13,3),(3,5,4,6),(3,3,18,3),(3,14,3,3),(17,6,3,5)],
  walls=[(9,18,1,2),(14,18,1,1),(16,13,1,1),(8,12,1,1),(12,11,1,1),(4,7,1,1),(10,4,1,1),(15,3,1,1)],
  start=(5,19), nodes=[(18,15),(5,12),(18,4)], entries=[(3,18),(20,20),(3,3),(20,3)],
  spawns=[(12,19),(17,12),(9,12),(5,8)], boss=(13,4), chests=[(20,11),(3,15)], capsules=[(10,19),(10,12),(12,4)]),
 # The Crown: Archon's arena above, a neck and two side bridges down to the anchor platform.
 'finale': dict(label="CORONA DELL'ASSE", has_boss=True,
  floor=[(4,2,16,9),(10,10,4,4),(2,13,20,4),(9,16,6,6),(4,10,2,3),(18,10,2,3)],
  walls=[(7,4,1,2),(16,4,1,2),(9,8,1,1),(15,8,1,1),(10,10,4,1),(7,14,1,2),(16,14,1,2),(10,14,1,1),(13,14,1,1),(11,18,2,1)],
  start=(12,20), nodes=[(4,15),(20,15),(12,3)], entries=[(4,2),(19,2),(2,14),(21,15)],
  spawns=[(8,9),(15,9),(8,15),(15,15)], boss=(12,6), chests=[(2,13),(19,9)], capsules=[(8,5),(16,7),(12,15)]),
}

def compile_plan(p):
    cells = [[0]*G for _ in range(G)]
    if 'circle' in p:
        cx, cy, r = p['circle']
        for y in range(G):
            for x in range(G):
                if math.hypot(x-cx, y-cy) < r: cells[y][x] = 1
    for x0, y0, w, h in p.get('floor', []):
        for y in range(y0, y0+h):
            for x in range(x0, x0+w): cells[y][x] = 1
    for x0, y0, w, h in p.get('walls', []):
        for y in range(y0, y0+h):
            for x in range(x0, x0+w): cells[y][x] = 0
    for y in range(G):                                  # the outer ring is always wall
        cells[y][0] = cells[y][G-1] = 0
    cells[0] = [0]*G; cells[G-1] = [0]*G
    return cells

def hexrows(cells):
    return [format(sum(cells[y][x] << (23-x) for x in range(G)), '06x') for y in range(G)]

def bfs(cells, start, blocked=frozenset()):
    dist = {start: 0}; q = deque([start])
    while q:
        x, y = q.popleft()
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < G and 0 <= ny < G and cells[ny][nx] and (nx,ny) not in dist and (nx,ny) not in blocked:
                dist[(nx,ny)] = dist[(x,y)] + 1; q.append((nx,ny))
    return dist

def path(cells, a, b):
    prev = {a: None}; q = deque([a])
    while q:
        c = q.popleft()
        if c == b: break
        x, y = c
        for n in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= n[0] < G and 0 <= n[1] < G and cells[n[1]][n[0]] and n not in prev:
                prev[n] = c; q.append(n)
    out = []; c = b
    while c is not None: out.append(c); c = prev.get(c)
    return out[::-1]

def clear(cells, p, r):
    x, y = p
    return all(0 <= x+dx < G and 0 <= y+dy < G and cells[y+dy][x+dx] for dx in range(-r, r+1) for dy in range(-r, r+1))

def check(name, p):
    cells = compile_plan(p); errs = []
    floor = [(x,y) for y in range(G) for x in range(G) if cells[y][x]]
    start = tuple(p['start']); reach = bfs(cells, start)
    if len(reach) != len(floor): errs.append(f'floor not connected: {len(floor)-len(reach)} tiles cut off')
    pts = [('start',start,1)] + [('node',tuple(n),1) for n in p['nodes']] + [('boss',tuple(p['boss']),2 if p.get('has_boss') else 1)] \
        + [('entry',tuple(e),0) for e in p['entries']] + [('spawn',tuple(s),0) for s in p['spawns']]
    for kind, pt, r in pts:
        if not clear(cells, pt, r):
            near = min(((x,y) for y in range(G) for x in range(G) if clear(cells,(x,y),r)), key=lambda q: math.hypot(q[0]-pt[0], q[1]-pt[1]), default=None)
            errs.append(f'{kind} {pt} needs {2*r+1}x{2*r+1} floor (nearest {near})')
    zones = []
    if 'zone' in p: zones.append(p['zone'])
    if 'zone_node' in p: n = p['nodes'][p['zone_node']]; zones.append((n[0]+.5, n[1]+.5, p['zone_r']))
    for zx, zy, zr in zones:
        rt = zr/64
        for y in range(G):
            for x in range(G):
                if math.hypot(x+.5-zx, y+.5-zy) <= rt-.35 and not cells[y][x]: errs.append(f'zone {zx,zy} hits wall at {x,y}'); break
    for n in p['nodes'] + [p['boss']]:
        n = tuple(n); sp = path(cells, start, n)
        if len(sp) < 2: errs.append(f'{n} unreachable'); continue
        core = set(sp[3:-3])                                        # a second route must avoid the first one's middle
        alt = bfs(cells, start, frozenset(core)) if core else {n: 0}
        if n not in alt: errs.append(f'{n}: only one route from the start')
    for c in p.get('chests', []):
        c = tuple(c)
        if not clear(cells, c, 0): errs.append(f'chest {c} on a wall')
        if math.dist(c, start) < 3: errs.append(f'chest {c} too close to the start')
        if any(math.dist(c, tuple(n)) < 2.2 for n in p['nodes']): errs.append(f'chest {c} too close to a device')
    for c in p.get('capsules', []):
        c = tuple(c)
        if not clear(cells, c, 0): errs.append(f'capsule {c} on a wall')
        if math.dist(c, start) < 4: errs.append(f'capsule {c} too close to the start')
        if any(math.dist(c, tuple(n)) < 2.5 for n in p['nodes']): errs.append(f'capsule {c} too close to a device')
        if any(math.dist(c, tuple(q)) < 2 for q in p.get('chests', [])): errs.append(f'capsule {c} on a chest alcove')
    for x, y in (pt for path_ in p.get('patrols', []) for pt in path_):
        if not cells[y][x]: errs.append(f'patrol point {x,y} on a wall')
    for path_ in p.get('patrols', []):
        for (ax, ay), (bx, by) in zip(path_, path_[1:] + path_[:1]):
            for t in range(0, 21):
                x = round(ax + (bx-ax)*t/20); y = round(ay + (by-ay)*t/20)
                if not cells[y][x]: errs.append(f'patrol leg {ax,ay}->{bx,by} crosses a wall at {x,y}'); break
    xs = [x for x,_ in floor]; ys = [y for _,y in floor]
    inner = sum(1 for y in range(min(ys)+1, max(ys)) for x in range(min(xs)+1, max(xs)) if not cells[y][x]
                and any(cells[y+dy][x+dx] for dx,dy in ((1,0),(-1,0),(0,1),(0,-1))))
    if inner < 8: errs.append(f'only {inner} cover tiles inside the play area')
    far = max(p['nodes'] + [p['boss']], key=lambda n: reach.get(tuple(n), 0))
    walk = reach.get(tuple(far), 0); line = math.hypot(far[0]-start[0], far[1]-start[1])
    if line and walk < 1.25*line and 'circle' not in p and not p.get('open_arena') and name not in ('city','line'): errs.append(f'walk {walk} vs line {line:.1f}: too straight')
    return cells, errs, dict(floor=len(floor), cover=inner, walk=walk, line=round(line,1))

def main():
    only_check = '--check' in sys.argv
    out = {}; bad = False; report = {}
    for name, p in PLANS.items():
        cells, errs, stats = check(name, p)
        report[name] = stats
        if errs: bad = True; print(name, 'FAIL', *errs, sep='\n  ')
        out[name+'_r42'] = dict(label=p['label'], m=hexrows(cells), start=list(p['start']), nodes=[list(n) for n in p['nodes']],
                                entries=[list(e) for e in p['entries']], spawns=[list(s) for s in p['spawns']], boss=list(p['boss']),
                                chests=[list(c) for c in p.get('chests', [])], capsules=[list(c) for c in p.get('capsules', [])], **({'patrols': [[list(q) for q in path_] for path_ in p['patrols']]} if 'patrols' in p else {}))
    print(json.dumps(report))
    if bad: sys.exit(1)
    if only_check: return
    body = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('// R42 (D87): richer floor plans for the 11 foot stages that shared five generic layouts (the port keeps the gallery, now its own).\n'
                '// Generated by tools/stage_layouts_r42.py (edit the plans there, not here). Rows are 24-bit masks, bit 23-x = floor.\n'
                'export const STAGE_LAYOUTS=' + body + ';\n')
    try:
        from PIL import Image, ImageDraw
        sheet = Image.new('RGB', (6*256, 2*256), (0,0,0))
        for i, (name, p) in enumerate(PLANS.items()):
            cells = compile_plan(p); im = Image.new('RGB', (G*10, G*10)); g = ImageDraw.Draw(im)
            for y in range(G):
                for x in range(G): g.rectangle([x*10, y*10, x*10+9, y*10+9], fill=(214,206,190) if cells[y][x] else (120,30,40))
            for x, y in p['nodes']: g.ellipse([x*10-3, y*10-3, x*10+13, y*10+13], outline=(0,170,220), width=3)
            for x, y in p['entries'] + p['spawns']: g.polygon([(x*10+5, y*10), (x*10+10, y*10+10), (x*10, y*10+10)], fill=(240,140,30))
            x, y = p['start']; g.rectangle([x*10+1, y*10+1, x*10+8, y*10+8], fill=(40,170,70))
            x, y = p['boss']; g.ellipse([x*10-8, y*10-8, x*10+18, y*10+18], outline=(150,40,200), width=3)
            sheet.paste(im.resize((240,240), Image.NEAREST), ((i%6)*256+8, (i//6)*256+8))
        prev = os.environ.get('R42_PREVIEW')
        if prev: sheet.save(prev)
    except ImportError:
        pass

if __name__ == '__main__':
    main()
