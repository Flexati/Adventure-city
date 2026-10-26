"""Original deterministic synthesis; no samples. Production candidates, not listening approval."""
import numpy as np,subprocess,json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[1];O=R/'assets/production/v10.2/handoff/strangers_audio';O.mkdir(exist_ok=True)
sr=44100;rng=np.random.default_rng(12218);rows=[]
def save(name,x,event):
 x=np.asarray(x,dtype=np.float32);x*=.78/max(.78,float(np.max(np.abs(x))));raw=x.astype('<f4').tobytes()
 master=O/(name+'.flac');out=O/(name+'.ogg')
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','1','-i','pipe:0',str(master)],input=raw,check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(master),'-c:a','libvorbis','-q:a','5',str(out)],check=True)
 decoded=subprocess.check_output(['ffmpeg','-v','error','-i',str(out),'-f','f32le','-ac','1','pipe:1']);y=np.frombuffer(decoded,dtype='<f4')
 rows.append(dict(file=out.name,master=master.name,sha256=hashlib.sha256(out.read_bytes()).hexdigest(),seconds=len(x)/sr,decoded_peak=float(np.max(np.abs(y))),event=event,status='PRODUCED_NOT_INTEGRATED',rights='Original procedural synthesis; commercial review pending',listening='NOT_HUMAN_REVIEWED'))
t=np.arange(int(sr*.38))/sr;save('kairn_impact',(.4*np.sin(2*np.pi*(95*t-55*t*t))+.22*rng.normal(size=len(t)))*np.exp(-18*t)*np.minimum(1,t/.004),'contact frame of Kairn punch; only after confirmed impact')
t=np.arange(int(sr*.9))/sr;phase=2*np.pi*(80*t+27*t*t);save('morrow_saw',(.2*np.sin(phase)+.12*np.sin(phase*3)+.06*rng.normal(size=len(t)))*np.sin(np.pi*t/.9)**2,'Morrow chainsaw sweep; one voice per accepted action')
t=np.arange(int(sr*.55))/sr;save('morrow_shot',(.38*rng.normal(size=len(t))+.25*np.sin(2*np.pi*63*t))*np.exp(-14*t)*np.minimum(1,t/.002),'Morrow shotgun discharge; not player weapon cue')
# Eight bars at 80 BPM, 24 seconds; pitched attacks decay before loop boundary.
length=24;track=np.zeros(sr*length);score=[]
def note(beat,midi,dur,amp,voice):
 start=int(beat*.75*sr);n=min(int(dur*.75*sr),len(track)-start);t=np.arange(n)/sr;f=440*2**((midi-69)/12);env=np.sin(np.pi*np.arange(n)/max(1,n-1))**2
 sig=np.sin(2*np.pi*f*t)+(.25*np.sin(2*np.pi*f*2*t) if voice=='bell' else .15*np.sin(2*np.pi*f*3*t));track[start:start+n]+=amp*env*sig;score.append([beat,midi,dur,amp,voice])
for bar,root in enumerate([38,38,34,36,38,41,36,38]):
 for beat in [0,1.5,2,3]:note(bar*4+beat,root,.7,.14,'bass')
 for j,pitch in enumerate([root+24,root+31,root+27,root+29]):note(bar*4+j,pitch,.8,.08,'bell')
 for beat in [0,2]:
  start=int((bar*4+beat)*.75*sr);n=int(.22*sr);t=np.arange(n)/sr;track[start:start+n]+=.16*np.sin(2*np.pi*(70*t-50*t*t))*np.exp(-20*t)
save('strangers_rift',track,'Varco held by Kairn and Morrow; 24-second score candidate, 80 BPM, eight bars')
(O/'score-and-metrics.json').write_text(json.dumps({'title':'Due uomini al varco','bpm':80,'bars':8,'notes':score,'assets':rows,'limits':'Decode/peak only; mix, loop perception, human listening and runtime not verified.'},indent=2)+'\n')
print('Produced 4 original OGG cues, 4 FLAC masters and score; no runtime acceptance')
