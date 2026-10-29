"""v0.8 themes: Nox, Lulù, danger, reunion. Original, deterministic, built on one motif.

The "two knocks" motif (two short repeated notes, then an answer) is the game's first input and
its last. Nox carries it low and alone, Lulù carries it in moving arpeggios, danger distorts it,
the reunion plays both answers together. Synthesis reuses the v0.5 voices; no samples, no quotes.
"""
from pathlib import Path
import json
import numpy as np
import compose_soundtrack as base

OUT=Path(__file__).resolve().parents[1]/'game/audio/v08'
OUT.mkdir(parents=True,exist_ok=True)
base.OUT=OUT
SR=base.SR
RNG=np.random.default_rng(8082026)
KNOCK=[(0,.25),(None,.25),(0,.5)]
# Answers: what follows the knocks. Nox steps down and waits, Lulù climbs and turns.
NOX_ANSWER=[(-1,.5),(-3,1),(None,.5),(-2,.5),(-1,.5)]
LULU_ANSWER=[(2,.5),(4,.5),(3,.5),(2,.5),(4,.5)]
THEMES={
 'nox':dict(bpm=92,root=57,mode=[0,2,3,5,7,8,10],progression=[0,5,3,4],energy=.55,bars=24,answers=[NOX_ANSWER],lead=.15,arp=.03,pad=.05,drums=.7),
 'lulu':dict(bpm=104,root=62,mode=[0,2,3,5,7,9,10],progression=[0,3,4,1],energy=.7,bars=24,answers=[LULU_ANSWER],lead=.14,arp=.075,pad=.035,drums=.85),
 'danger':dict(bpm=144,root=52,mode=[0,1,3,5,7,8,10],progression=[0,1,0,6],energy=1.0,bars=24,answers=[[(1,.5),(0,.5),(1,.5),(3,.5),(1,1)]],lead=.15,arp=.07,pad=.03,drums=1.15),
 'reunion':dict(bpm=76,root=60,mode=[0,2,4,5,7,9,11],progression=[0,5,3,4],energy=.35,bars=16,answers=[NOX_ANSWER,LULU_ANSWER],lead=.16,arp=.045,pad=.06,drums=.25)
}
def compose(name,c):
 beat=60/c['bpm'];bars=c['bars'];total=bars*4;buf=np.zeros(round(total*beat*SR),dtype=np.float32);events=[]
 def put(at,dur,note,voice,vol):
  events.append(dict(beat=at,beats=dur,note=int(note),voice=voice,volume=vol));base.add(buf,at*beat,base.tone(note,dur*beat,voice,vol))
 root,scale=c['root'],c['mode']
 for bar in range(bars):
  start=bar*4;deg=c['progression'][bar%4]
  # Lead: knock + answer every bar; the octave lifts in the second half; reunion alternates answers.
  if name!='danger' or bar%2==0:
   phrase=KNOCK+c['answers'][(bar//2)%len(c['answers'])];at=start
   octave=1 if bar<bars//2 else (2 if name=='lulu' else 1)
   for degree,dur in phrase:
    if degree is not None:put(at,dur*.9,base.pitch(root,scale,degree+deg%2*2+7,octave-1),'lead',c['lead'])
    at+=dur
  else:
   for step in range(8):put(start+step*.5,.3,base.pitch(root,scale,deg+[0,1,0,3,0,1,4,3][step],1),'lead',c['lead']*.7)
  for step in range(8):put(start+step*.5,.42,base.pitch(root,scale,deg+[0,2,4,2,1,4,2,4][step],0),'arp',c['arp'])
  for step in range(4 if name!='reunion' else 2):put(start+step*(1 if name!='reunion' else 2),.85 if name!='reunion' else 1.8,base.pitch(root,scale,deg,-2),'bass',.15)
  for degree in [deg,deg+2,deg+4]:put(start,3.8,base.pitch(root,scale,degree,0),'pad',c['pad'])
  e=c['drums']
  if e>.3:
   for step in range(8):
    t=np.arange(int(.06*SR))/SR;hat=RNG.uniform(-1,1,len(t))*np.exp(-t*70)*.02*e;base.add(buf,(start+step*.5)*beat,hat.astype(np.float32))
  # The knock itself as percussion: two muted hits on beat one, every bar.
  for k in [0,.5]:
   t=np.arange(int(.12*SR))/SR;knock=np.sin(2*np.pi*(95*t+3*(1-np.exp(-t*40))))*np.exp(-t*34)*.16*max(.5,e);base.add(buf,(start+k)*beat,knock.astype(np.float32))
  if e>.6:
   for k in [2,3]:
    t=np.arange(int(.1*SR))/SR;sn=(RNG.uniform(-1,1,len(t))*.5+np.sin(2*np.pi*180*t)*.5)*np.exp(-t*40)*.06*e;base.add(buf,(start+k)*beat,sn.astype(np.float32))
 base.midi(events,c['bpm'],total,OUT/(name+'.mid'))
 return base.export(name,buf),events
def main():
 report={};score={}
 for name,c in THEMES.items():report[name],score[name]=compose(name,c)
 (OUT/'score.json').write_text(json.dumps({'original':True,'motif':'two knocks','sample_rate':SR,'themes':{k:{x:v for x,v in t.items() if x!='answers'} for k,t in THEMES.items()},'events':score})+'\n')
 (OUT/'audio_qa.json').write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps(report,indent=2))
if __name__=='__main__':main()
