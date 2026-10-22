"""Original layered vector artwork. Deterministic, no external fonts, raster images or filters.
The restrained graphic-novel style deliberately differs from the gameplay pixel art.
"""
from pathlib import Path
import random
ROOT=Path(__file__).resolve().parents[1]/'game/art/v09'
ROOT.mkdir(parents=True,exist_ok=True)

def skyline(seed,ink,light):
 r=random.Random(seed);out=[]
 for layer in range(3):
  x=-30
  while x<1630:
   w=r.randint(35,100);h=r.randint(90,360)+(layer==0)*100;y=650-h+layer*65
   out.append(f'<path d="M{x} 800V{y}H{x+w}V800" fill="{ink[layer]}"/>')
   if h>300:out.append(f'<path d="M{x+w/2} {y}v-40" stroke="{ink[layer]}" stroke-width="3"/><circle cx="{x+w/2}" cy="{y-40}" r="2" fill="#f4889e"/>')
   for yy in range(y+16,730,22):
    for xx in range(x+10,x+w-6,15):
     if r.random()<.35:out.append(f'<path d="M{xx} {yy}h4v8h-4Z" fill="{light}" opacity="{r.uniform(.12,.65):.2f}"/>')
   x+=w+r.randint(5,20)
 return ''.join(out)

def make(name,seed,top,horizon,accent):
 sky=skyline(seed,['#263448','#172637','#0c1a29'],accent)
 r=random.Random(seed)
 rain=''.join(f'<path d="M{r.randrange(1600)} {r.randrange(900)}l-4 22"/>' for _ in range(110)) if name=='fragile' else ''
 # The paired apertures echo the two-knock motif at different emotional distances.
 architecture=f'<path d="M0 0h1600v90H0ZM0 0h180v1000H0ZM1420 0h180v1000h-180Z" fill="#07111b"/><path d="M171 90v760m1258-760v760" stroke="{accent}" opacity=".4" stroke-width="3"/><path d="M0 820h1600v180H0" fill="#09131e"/><path d="M160 821h1280" stroke="#6a7d8b" stroke-width="4"/><path d="M920 815l32-57 26 49-18 9Z" fill="{accent}" opacity=".55" stroke="#d5efef" stroke-width="2"/><path d="M905 830h92" stroke="{accent}" opacity=".4"/>'
 if name=='warm':architecture+='<path d="M695 790v-75h48v75m17 0v-75h48v75" fill="#ffd49b" opacity=".65"/>'
 elif name=='tentative':architecture+='<path d="M680 790v-75h48v75m74 0v-75h48v75" fill="#aec9d1" opacity=".45"/>'
 else:architecture+='<path d="M660 790v-75h48v75m114 0v-75h48v75" fill="#849ec9" opacity=".35"/>'
 return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
 <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="{top}"/><stop offset=".67" stop-color="{horizon}"/><stop offset="1" stop-color="#152338"/></linearGradient>
 <radialGradient id="sun"><stop stop-color="{accent}" stop-opacity=".7"/><stop offset="1" stop-color="{accent}" stop-opacity="0"/></radialGradient>
 <linearGradient id="floor" x2="0" y2="1"><stop stop-color="#1c3041"/><stop offset="1" stop-color="#050d17"/></linearGradient></defs>
 <path d="M0 0h1600v1000H0Z" fill="url(#sky)"/><ellipse cx="800" cy="480" rx="650" ry="480" fill="url(#sun)"/>
 <circle cx="800" cy="430" r="150" fill="none" stroke="{accent}" opacity=".28" stroke-width="2"/><path d="M800 100v180m0 300v135M455 430h165m360 0h165" stroke="{accent}" opacity=".2"/>
 {sky}<path d="M0 740h1600v260H0Z" fill="url(#floor)"/>
 <g stroke="#7298aa" opacity=".12">{''.join(f'<path d="M800 680L{x} 1000"/>' for x in range(-1200,3000,180))}<path d="M0 790h1600M0 850h1600M0 940h1600"/></g>
 <path d="M0 722h1600m-1600 22h1600" stroke="#09131e" stroke-width="8"/><path d="M0 720h1600" stroke="{accent}" opacity=".55" stroke-width="2"/>
 <g stroke="#13202e" stroke-width="10">{''.join(f'<path d="M{x} 722v80"/>' for x in range(40,1600,130))}</g>
 <ellipse cx="810" cy="930" rx="230" ry="18" fill="#010710" opacity=".7"/>{architecture}
 <g stroke="#c4d3ec" opacity=".16">{rain}</g>
 <path d="M40 100v-60h100m1320 0h100v60M40 900v60h100m1320 0h100v-60" fill="none" stroke="{accent}" opacity=".28" stroke-width="2"/>
 </svg>'''

for name,seed,top,horizon,accent in [
 ('warm',31,'#192b48','#b87966','#ffd5a0'),
 ('tentative',42,'#0d203c','#626f91','#a8dae6'),
 ('fragile',53,'#080f25','#3b3c63','#829ed0')]:
 (ROOT/(name+'.svg')).write_text(make(name,seed,top,horizon,accent))
print('Three original SVG illustrations written to',ROOT)
