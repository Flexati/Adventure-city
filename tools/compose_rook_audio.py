"""Original Rook score and mechanical cues. Deterministic synthesis, no samples."""
from pathlib import Path
import numpy as np, subprocess, tempfile, wave, json, hashlib
R=Path(__file__).resolve().parents[1]; SR=44100; rng=np.random.default_rng(2718)
source=R/'assets/production/v10.2'; out=R/'game/audio/v10'; metrics=[]
def export(name,y,loop=False):
 y=np.asarray(y); y-=y.mean(axis=0); y*=.36/max(abs(y).max(),1e-9)
 with tempfile.NamedTemporaryFile(suffix='.wav') as f:
  with wave.open(f.name,'wb') as w:
   w.setnchannels(1 if y.ndim==1 else y.shape[1]); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.rint(y*32767).astype('<i2').tobytes())
  for p,args in [(source/(name+'-master.flac'),['-c:a','flac']),(out/(name+'.ogg'),['-c:a','libvorbis','-q:a','4'])]: subprocess.run(['ffmpeg','-v','error','-y','-i',f.name,*args,str(p)],check=True)
 a=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(out/(name+'.ogg')),'-f','f32le','-ac','1','-']),dtype='<f4')
 metrics.append(dict(id=name,sha256=hashlib.sha256((out/(name+'.ogg')).read_bytes()).hexdigest(),duration_seconds=len(a)/SR,peak=float(abs(a).max()),clipped_samples=int((abs(a)>=1).sum()),loop=loop,human_listening=False,commercial_ready=False))
for name,duration in [('rook_aim',.6),('rook_shot',.5),('rook_mine',.32),('rook_burst',.55),('rook_disarm',.24)]:
 t=np.arange(int(SR*duration))/SR; noise=rng.normal(size=len(t))
 if name=='rook_aim': y=(np.sin(2*np.pi*(520*t+130*t*t))+.2*np.sin(2*np.pi*1040*t))*np.sin(np.pi*t/duration)**2*(.6+.4*np.sin(2*np.pi*12*t)**2)
 elif name=='rook_shot':
  low=np.convolve(noise,np.ones(9)/9,'same');y=low*np.exp(-t*20)+.5*np.sin(2*np.pi*(65*t+9*(1-np.exp(-t*18))))*np.exp(-t*14)
 elif name=='rook_mine': y=(np.sin(2*np.pi*740*t)+.4*np.sin(2*np.pi*1480*t))*np.exp(-t*9)*(np.sin(2*np.pi*9*t)>0)
 elif name=='rook_disarm': y=np.sin(2*np.pi*(900*t-950*t*t))*np.exp(-t*13)+.2*noise*np.exp(-t*80)
 else: y=np.convolve(noise,np.ones(7)/7,'same')*np.exp(-t*11)+.25*np.sin(2*np.pi*92*t)*np.exp(-t*12)
 y*=np.minimum(1,t/.004)*np.minimum(1,(duration-t)/.016);export(name,y)
# 12 bars at 120 BPM. Sparse 3+3+2 bass, metallic offbeats and a two-note warning motif.
N=24*SR;y=np.zeros((N,2));events=[]
def note(beat,midi,length,voice,volume,pan=0):
 t=np.arange(int(length*.5*SR))/SR;f=440*2**((midi-69)/12)
 if voice=='bass': a=(np.sin(2*np.pi*f*t)+.18*np.sin(2*np.pi*2*f*t))*np.exp(-t*8)
 elif voice=='metal': a=(np.sin(2*np.pi*f*t)+.35*np.sin(2*np.pi*2.71*f*t))*np.exp(-t*24)
 elif voice=='kick': a=np.sin(2*np.pi*(48*t+3*(1-np.exp(-t*28))))*np.exp(-t*19)
 else: a=(np.sin(2*np.pi*f*t)+.16*np.sin(2*np.pi*1.004*f*t))*np.sin(np.pi*t/(length*.5))**2
 a*=volume*np.minimum(1,t/.006)*np.minimum(1,(length*.5-t)/.02); idx=(int(beat*.5*SR)+np.arange(len(t)))%N
 np.add.at(y[:,0],idx,a*np.sqrt((1-pan)/2));np.add.at(y[:,1],idx,a*np.sqrt((1+pan)/2));events.append(dict(beat=beat,midi=midi,length_beats=length,voice=voice,volume=volume,pan=pan))
for bar in range(12):
 root=[38,38,39,45][bar%4];base=bar*4
 for offset in [0,1.5,3]:note(base+offset,root,.8,'bass',.24)
 for offset in [0,2]:note(base+offset,36,.4,'kick',.26)
 for offset in [.75,2.25,3.5]:note(base+offset,74+(bar%2)*6,.3,'metal',.06,-.3 if offset<2 else .3)
 if bar%4 in [0,2]:note(base+1,62+(bar%4)*3,1.5,'signal',.08,.2)
export('rook_line',y,True)
(source/'rook-audio-score.json').write_text(json.dumps(dict(title='La linea migliore',bpm=120,bars=12,duration_seconds=24,events=events,provenance='Original authored notes and deterministic synthesis; no third-party recordings, samples or artist imitation.'),indent=2)+'\n')
(source/'rook-audio-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n');print(json.dumps(metrics))
