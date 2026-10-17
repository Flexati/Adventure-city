"""Original, deterministic adventure score and SFX. No third-party samples or melodies."""
from pathlib import Path
import json, math, struct, subprocess, tempfile, wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'game/audio/v05'; OUT.mkdir(parents=True,exist_ok=True)
SR=32000; RNG=np.random.default_rng(5172026)
CONFIG={
 'title':dict(bpm=96,root=62,mode=[0,2,3,5,7,9,10],progression=[0,3,5,4],energy=.55),
 'blackout':dict(bpm=112,root=64,mode=[0,2,3,5,7,8,10],progression=[0,5,3,4],energy=.8),
 'breach':dict(bpm=120,root=62,mode=[0,2,3,5,7,9,10],progression=[0,1,5,3],energy=.85),
 'contagion':dict(bpm=100,root=57,mode=[0,2,3,5,7,8,10],progression=[0,5,1,4],energy=.6),
 'zero':dict(bpm=132,root=62,mode=[0,2,3,5,7,8,10],progression=[0,5,3,4],energy=1.0),
 'driving':dict(bpm=138,root=64,mode=[0,2,3,5,7,9,10],progression=[0,3,1,4],energy=.95)
}
# Newly composed phrases, scale degrees and durations in beats. Every bar totals four.
PHRASES=[[(0, .5),(2,.5),(4,1),(3,.5),(1,.5),(2,1)],[(5,.75),(4,.25),(2,1),(1,.5),(0,.5),(2,1)],[(3,.5),(5,.5),(7,.75),(6,.25),(4,1),(2,1)],[(1,.5),(3,.5),(2,1),(0,1),(None,1)],[(4,.5),(7,.5),(6,.5),(5,.5),(2,1),(3,1)],[(5,1),(3,.5),(2,.5),(4,.75),(2,.25),(1,1)],[(0,.5),(2,.5),(5,1),(4,.5),(3,.5),(1,1)],[(2,1),(1,.5),(6-.0,.5),(0,1),(None,1)]]
def hz(note):return 440*2**((note-69)/12)
def pitch(root,scale,degree,octave=0):
 degree=int(degree);return root+scale[degree%7]+12*(degree//7+octave)
def tone(note,seconds,kind,volume):
 n=max(1,int(seconds*SR)); t=np.arange(n,dtype=np.float32)/SR; f=hz(note); phase=2*np.pi*f*t
 if kind=='lead': y=np.sin(phase+.012*np.sin(t*31))+.18*np.sin(2*phase)+.05*np.sin(3*phase)
 elif kind=='arp':y=np.sin(phase)+.35*np.sin(2*phase)+.08*np.sin(4*phase)
 elif kind=='bass':y=np.sin(phase)+.11*np.sin(3*phase)
 else:y=np.sin(phase)+.22*np.sin(2*phase)
 attack=.008 if kind!='pad' else .06
 release=min(seconds*.3,.09 if kind!='pad' else .18)
 env=np.minimum(t/attack,1)*np.minimum(np.maximum(seconds-t,0)/max(.001,release),1)
 if kind=='arp':env*=np.exp(-t*5)
 return (y*env*volume).astype(np.float32)
def add(buf,start,sound):
 start=int(start*SR)%len(buf);remaining=len(buf)-start
 buf[start:start+min(len(sound),remaining)]+=sound[:remaining]
 if len(sound)>remaining:buf[:len(sound)-remaining]+=sound[remaining:]
def varlen(n):
 out=[n&127];n>>=7
 while n:out.insert(0,(n&127)|128);n>>=7
 return bytes(out)
def midi(events,bpm,length,path):
 tracks=[]
 for ch,kind in enumerate(['lead','arp','bass','pad']):
  ev=[(0,bytes([0xC0+ch,[80,10,38,88][ch]]))]
  if ch==0:ev.append((0,b'\xff\x51\x03'+int(60000000/bpm).to_bytes(3,'big')))
  for e in events:
   if e['voice']!=kind:continue
   ev.extend([(round(e['beat']*480),bytes([0x90+ch,e['note'],max(1,min(127,round(e['volume']*380)))])),(round((e['beat']+e['beats'])*480),bytes([0x80+ch,e['note'],0]))])
  ev.sort(key=lambda p:p[0]);data=b'';last=0
  for tick,msg in ev:data+=varlen(tick-last)+msg;last=tick
  data+=varlen(max(0,round(length*480)-last))+b'\xff\x2f\x00';tracks.append(b'MTrk'+struct.pack('>I',len(data))+data)
 path.write_bytes(b'MThd'+struct.pack('>IHHH',6,1,len(tracks),480)+b''.join(tracks))
def export(name,buf):
 edge=min(96,len(buf)//4);buf[:edge]*=np.linspace(0,1,edge);buf[-edge:]*=np.linspace(1,0,edge)
 peak=float(np.max(np.abs(buf)));buf=buf*(.7/max(peak,.0001))
 with tempfile.TemporaryDirectory() as tmp:
  f=Path(tmp)/'render.wav'
  with wave.open(str(f),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((np.clip(buf,-1,1)*32767).astype('<i2').tobytes())
  subprocess.run(['ffmpeg','-v','error','-y','-i',str(f),'-c:a','libvorbis','-q:a','5',str(Path(tmp)/'render.ogg')],check=True)
  encoded=(Path(tmp)/'render.ogg').read_bytes()
  if len(encoded)<100:raise ValueError('Empty encoded audio: '+name)
  (OUT/(name+'.ogg')).write_bytes(encoded)
 return dict(seconds=round(len(buf)/SR,3),peak=round(float(np.max(np.abs(buf))),4),rms=round(float(np.sqrt(np.mean(buf**2))),4),seam_step=round(float(abs(buf[0]-buf[-1])),5))
def compose(name,c):
 beat=60/c['bpm'];bars=24;total=bars*4;buf=np.zeros(round(total*beat*SR),dtype=np.float32);events=[]
 def put(at,dur,note,voice,vol):
  events.append(dict(beat=at,beats=dur,note=int(note),voice=voice,volume=vol));add(buf,at*beat,tone(note,dur*beat,voice,vol))
 for bar in range(bars):
  base=bar*4;deg=c['progression'][bar%4];root=c['root'];scale=c['mode'];energy=c['energy']
  # Three eight-bar sections share an original motif, with counterpoint and register lift.
  phrase=PHRASES[(bar+(0 if name=='title' else 2 if name=='contagion' else 4))%8];at=base
  for degree,dur in phrase:
   if degree is not None:
    note=pitch(root,scale,degree,1 if bar<16 else 2)
    put(at,dur*.88,note,'lead',.12 if name=='contagion' else .16)
   at+=dur
  for step in range(8):
   note=pitch(root,scale,deg+[0,2,4,2,1,4,2,4][step],0)
   put(base+step*.5,.42,note,'arp',.065)
  for step in range(4):put(base+step,.82,pitch(root,scale,deg+(4 if step==2 else 0),-2),'bass',.14)
  for degree in [deg,deg+2,deg+4]:put(base,3.8,pitch(root,scale,degree,0),'pad',.035)
  if bar%4==3:put(base+2,1.7,pitch(root,scale,deg+7,1),'arp',.07)
  # Synthesized kick, rim/noise snare and hats. No sample recordings.
  for step in range(8):
   t=np.arange(int(.07*SR))/SR;hat=RNG.uniform(-1,1,len(t))*np.exp(-t*65)*.022*energy;add(buf,(base+step*.5)*beat,hat.astype(np.float32))
  for step in [0,2]:
   t=np.arange(int(.16*SR))/SR;k=np.sin(2*np.pi*(52*t+2*(1-np.exp(-t*32))))*np.exp(-t*30)*.18*energy;add(buf,(base+step)*beat,k.astype(np.float32))
  for step in [1,3]:
   t=np.arange(int(.1*SR))/SR;sn=(RNG.uniform(-1,1,len(t))*.5+np.sin(2*np.pi*180*t)*.5)*np.exp(-t*40)*.065*energy;add(buf,(base+step)*beat,sn.astype(np.float32))
 midi(events,c['bpm'],total,OUT/(name+'.mid'))
 return export(name,buf),events
report={};score={}
for name,c in CONFIG.items():report[name],score[name]=compose(name,c)
for name,start,end,duration in [('hit',900,180,.11),('zara',220,100,.2),('dodge',450,1100,.16),('duo',400,1600,.45),('choice',660,1320,.38)]:
 t=np.arange(int(duration*SR))/SR;phase=2*np.pi*(start*t+(end-start)/(2*duration)*t*t);env=np.sin(np.pi*t/duration)**2;buf=(np.sin(phase)+.2*np.sin(2*phase))*env
 report[name]=export(name,buf.astype(np.float32))
(OUT/'score.json').write_text(json.dumps({'original':True,'sample_rate':SR,'config':CONFIG,'events':score},indent=2)+'\n')
(OUT/'audio_qa.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
