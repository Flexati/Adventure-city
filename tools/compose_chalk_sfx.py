"""Original chalk friction and field-medicine seal sounds, without external recordings."""
from pathlib import Path
import numpy as np,subprocess,tempfile,wave,json,hashlib
R=Path(__file__).resolve().parents[1];out=R/'game/audio/v10';src=R/'assets/production/v10.2';SR=44100;rng=np.random.default_rng(1033);metrics=[]
for name,duration in [('chalk_scrape',.46),('heal_seal',.39)]:
 t=np.arange(int(SR*duration))/SR
 if name=='chalk_scrape':
  noise=rng.normal(size=len(t));freq=np.fft.rfftfreq(len(t),1/SR);spectrum=np.fft.rfft(noise);spectrum*=((freq>650)&(freq<6800))/(1+(freq/2400)**2);friction=np.fft.irfft(spectrum,n=len(t));env=(np.sin(np.pi*t/duration)**2)*(.7+.3*np.sin(2*np.pi*23*t)**2);y=friction*env+.035*np.sin(2*np.pi*1700*t)*np.exp(-t*95)
 else:
  y=.23*rng.normal(size=len(t))*np.exp(-t*130)+(.22*np.sin(2*np.pi*440*t)+.12*np.sin(2*np.pi*660*t))*np.exp(-t*13)*(1-np.exp(-t*80))
 fade=np.minimum(1,t/.004)*np.minimum(1,(duration-t)/.018);y*=fade;y-=y.mean();y*=.28/max(abs(y).max(),1e-9);pcm=np.rint(y*32767).astype('<i2')
 with tempfile.NamedTemporaryFile(suffix='.wav') as f:
  with wave.open(f.name,'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes())
  for path,args in [(src/(name+'-master.flac'),['-c:a','flac']),(out/(name+'.ogg'),['-c:a','libvorbis','-q:a','4'])]:subprocess.run(['ffmpeg','-v','error','-y','-i',f.name,*args,str(path)],check=True)
 a=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(out/(name+'.ogg')),'-f','f32le','-ac','1','-']),dtype='<f4');metrics.append({'id':name,'duration_seconds':len(a)/SR,'peak':float(abs(a).max()),'clipped_samples':int((abs(a)>=1).sum()),'sha256':hashlib.sha256((out/(name+'.ogg')).read_bytes()).hexdigest(),'provenance':'Original deterministic noise/filter/additive synthesis; no external recordings.','human_listening':False,'commercial_ready':False})
(src/'sfx-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n');print(json.dumps(metrics))
