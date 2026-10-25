"""Original authored score; deterministic synthesis, no provider, samples or recordings."""
from pathlib import Path
import numpy as np,json,wave,subprocess,tempfile,hashlib
ROOT=Path(__file__).resolve().parents[1];SR=44100;BPM=96;BEAT=60/BPM;DURATION=40;N=int(SR*DURATION)
source=ROOT/'assets/production/v10.2';out=ROOT/'game/audio/v10';source.mkdir(parents=True,exist_ok=True);out.mkdir(parents=True,exist_ok=True)
y=np.zeros((N,2));rng=np.random.default_rng(1032);events=[]
def note(beat,midi,beats,voice,velocity,pan=0):
 start=int(beat*BEAT*SR);duration=beats*BEAT;n=int(duration*SR);t=np.arange(n)/SR;f=440*2**((midi-69)/12)
 attack=np.minimum(1,t/(.025 if voice=='mallet' else .12));release=np.minimum(1,(duration-t)/(.25 if voice=='pad' else .06));env=attack*release
 if voice=='mallet':signal=(np.sin(2*np.pi*f*t)+.22*np.sin(2*np.pi*f*2.003*t)+.08*np.sin(2*np.pi*f*3.98*t))*np.exp(-t*3.2)
 elif voice=='bass':signal=(np.sin(2*np.pi*f*t)+.12*np.sin(2*np.pi*f*2*t))*np.exp(-t*.8)
 elif voice=='pad':signal=(np.sin(2*np.pi*f*t)+.25*np.sin(2*np.pi*f*1.001*t))*np.sin(np.pi*t/duration)**2
 else:signal=(rng.normal(0,.2,n)+np.sin(2*np.pi*f*2.1*t)*.15)*np.exp(-t*55)
 signal*=env*velocity;indices=(start+np.arange(n))%N
 np.add.at(y[:,0],indices,signal*np.sqrt((1-pan)/2));np.add.at(y[:,1],indices,signal*np.sqrt((1+pan)/2));events.append(dict(beat=beat,midi=midi,beats=beats,voice=voice,velocity=velocity,pan=pan))
chords=[[62,65,69,76],[62,67,71,76],[64,67,71,74],[60,64,67,74]]
phrases=[[74,76,77],[77,76,74],[69,74,76],[76,74,69]]
for bar in range(16):
 base=bar*4;chord=chords[bar%4]
 for j,pitch in enumerate(chord):note(base,pitch,4.6,'pad',.035,(-.4+j*.27))
 note(base+.25,[38,43,40,45][bar%4],2.3,'bass',.15)
 if bar%4!=3:note(base+2.5,[38,43,40,45][bar%4]+12,.8,'bass',.05)
 for j,pitch in enumerate(phrases[(bar//4+bar%4)%4]):
  if bar%4==3 and j>0:continue
  note(base+[.75,1.5,3][j],pitch,1.5,'mallet',.11 if j==0 else .075,[-.22,.12,.3][j])
 for offset in [.5,2.5,3.5]:note(base+offset,55+bar%3,.16,'tick',.027,-.35 if offset==.5 else .35)
y-=y.mean(axis=0);y*=.34/max(abs(y).max(),1e-9);pcm=np.rint(y*32767).astype('<i2')
with tempfile.NamedTemporaryFile(suffix='.wav') as f:
 with wave.open(f.name,'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes())
 for path,args in [(source/'chalk-route-master.flac',['-c:a','flac']),(out/'chalk_route.ogg',['-c:a','libvorbis','-q:a','4'])]:subprocess.run(['ffmpeg','-v','error','-y','-i',f.name,*args,str(path)],check=True)
(source/'chalk-route-score.json').write_text(json.dumps({'title':'Una strada per chi torna','bpm':BPM,'bars':16,'duration_seconds':DURATION,'mode':'D dorian','events':events,'provenance':'Authored score and deterministic additive synthesis, no external samples or artist imitation. Human listening and final mix approval pending.'},indent=2)+'\n')
decoded=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(out/'chalk_route.ogg'),'-f','f32le','-ac','2','-ar',str(SR),'-']),dtype='<f4').reshape(-1,2)
metrics={'duration_seconds':len(decoded)/SR,'peak':float(abs(decoded).max()),'rms':float(np.sqrt(np.mean(decoded**2))),'loop_boundary_step':float(abs(decoded[0]-decoded[-1]).max()),'clipped_samples':int((abs(decoded)>=1).sum()),'sha256':hashlib.sha256((out/'chalk_route.ogg').read_bytes()).hexdigest(),'human_listening':False,'commercial_ready':False}
(source/'chalk-route-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n');print(json.dumps(metrics))
