"""Original Tessa workshop cue and weapon mechanisms, no samples or recordings."""
from pathlib import Path
import numpy as np,subprocess,tempfile,wave,json,hashlib
R=Path(__file__).resolve().parents[1]; SR=44100; rng=np.random.default_rng(2771); source=R/'assets/production/v10.2'; out=R/'game/audio/v10';metrics=[]
def export(name,y,loop=False):
 y-=y.mean(axis=0);y*=.32/max(abs(y).max(),1e-9)
 with tempfile.NamedTemporaryFile(suffix='.wav') as f:
  with wave.open(f.name,'wb') as w:w.setnchannels(1 if y.ndim==1 else 2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(np.rint(y*32767).astype('<i2').tobytes())
  for p,args in [(source/(name+'-master.flac'),['-c:a','flac']),(out/(name+'.ogg'),['-c:a','libvorbis','-q:a','4'])]:subprocess.run(['ffmpeg','-v','error','-y','-i',f.name,*args,str(p)],check=True)
 a=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(out/(name+'.ogg')),'-f','f32le','-ac','1','-']),dtype='<f4');metrics.append(dict(id=name,sha256=hashlib.sha256((out/(name+'.ogg')).read_bytes()).hexdigest(),duration_seconds=len(a)/SR,peak=float(abs(a).max()),clipped_samples=int((abs(a)>=1).sum()),loop=loop,human_listening=False,commercial_ready=False))
for name,duration in [('tessa_case',.7),('weapon_switch',.24),('weapon_reload',.85),('vx9_shot',.18),('r12_shot',.45),('quickdraw_ready',.28)]:
 t=np.arange(int(SR*duration))/SR;noise=rng.normal(size=len(t));y=np.zeros(len(t))
 if name in ['vx9_shot','r12_shot']:
  y=np.convolve(noise,np.ones(3 if name=='vx9_shot' else 11)/(3 if name=='vx9_shot' else 11),'same')*np.exp(-t*(42 if name=='vx9_shot' else 15));y+=.4*np.sin(2*np.pi*(100 if name=='vx9_shot' else 58)*t)*np.exp(-t*20)
 elif name=='quickdraw_ready':y=(np.sin(2*np.pi*(660*t+600*t*t))+.2*np.sin(2*np.pi*1320*t))*np.sin(np.pi*t/duration)**2
 else:
  for start,pitch in ([(.02,880),(.18,580),(.4,1100)] if name=='tessa_case' else [(.01,660),(.12,990)] if name=='weapon_switch' else [(.02,520),(.34,330),(.65,780)]):
   q=np.maximum(0,t-start);env=np.exp(-q*65)*(t>=start);y+=(noise*.5+np.sin(2*np.pi*pitch*q)*.3)*env
 y*=np.minimum(1,t/.003)*np.minimum(1,(duration-t)/.015);export(name,y)
# Eight bars at 100 BPM: warm A-minor / F-major workshop motif, sparse metal counter-rhythm.
D=19.2;N=int(SR*D);y=np.zeros((N,2));events=[]
def note(beat,midi,length,voice,volume,pan):
 duration=length*.6;t=np.arange(int(duration*SR))/SR;f=440*2**((midi-69)/12)
 a=(np.sin(2*np.pi*f*t)+.23*np.sin(2*np.pi*2.01*f*t))*np.exp(-t*(4 if voice=='key' else 1.4));a*=np.minimum(1,t/.015)*np.minimum(1,(duration-t)/.06)*volume;idx=(int(beat*.6*SR)+np.arange(len(t)))%N
 np.add.at(y[:,0],idx,a*np.sqrt((1-pan)/2));np.add.at(y[:,1],idx,a*np.sqrt((1+pan)/2));events.append(dict(beat=beat,midi=midi,length=length,voice=voice,volume=volume,pan=pan))
for bar in range(8):
 chord=[57,60,64,71] if bar%4<2 else [53,57,60,64]
 note(bar*4,chord[0]-12,3.5,'bass',.15,0)
 for j,m in enumerate(chord[1:]):note(bar*4+[.5,1.75,3][j],m+12,1.6,'key',.11,[-.25,.3,-.1][j])
 if bar in [1,3,5,7]:note(bar*4+2.5,[76,74,72,69][bar//2],1.4,'key',.095,.15)
export('tessa_workbench',y,True)
(source/'workshop-score.json').write_text(json.dumps(dict(title='Mani di officina',bpm=100,bars=8,duration_seconds=D,events=events,provenance='Original authored notes and deterministic synthesis; no external samples/recordings.'),indent=2)+'\n');(source/'workshop-audio-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n');print('Produced',len(metrics),'original workshop/weapon audio files')
