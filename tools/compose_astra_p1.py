"""Original authored P1 synthesis. 48 kHz FLAC/OGG, deterministic score; no external samples."""
import numpy as np,subprocess,json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[1];O=R/'assets/production/v10.2/handoff/astra_p1';O.mkdir(parents=True,exist_ok=True)
SR=48000;rng=np.random.default_rng(901);records=[]
def ring(d,freqs,decay=14):
 t=np.arange(int(d*SR))/SR;x=np.zeros(len(t))
 for i,f in enumerate(freqs):x+=np.sin(2*np.pi*f*t+.15*i)*np.exp(-decay*(1+i*.18)*t)/(1+i)
 return x*np.minimum(1,t/.002)
def put(dst,src,at,gain=1):
 at=int(at*SR);n=min(len(src),len(dst)-at)
 if n>0:dst[at:at+n]+=src[:n]*gain
def write(name,x,family,loop=False):
 x=np.asarray(x,dtype=np.float32);x*=.68/max(.68,float(np.max(np.abs(x))))
 master=O/(name+'.flac');out=O/(name+'.ogg')
 subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac',str(2 if x.ndim==2 else 1),'-i','pipe:0',str(master)],input=x.astype('<f4').tobytes(),check=True)
 subprocess.run(['ffmpeg','-v','error','-y','-i',str(master),'-c:a','libvorbis','-q:a','6',str(out)],check=True)
 y=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(out),'-f','f32le','-ac','1','pipe:1']),dtype='<f4')
 assert np.max(np.abs(y))<=10**(-1/20)
 records.append(dict(file=out.name,master=master.name,family=family,sha256=hashlib.sha256(out.read_bytes()).hexdigest(),sample_rate=SR,duration=len(x)/SR,decoded_peak_dbfs=float(20*np.log10(max(1e-9,np.max(np.abs(y))))),loop=loop,status='PRODUCED_NOT_INTEGRATED',listening='PENDING_HUMAN',license='Original local synthesis without samples; no external legal approval claimed'))
for name,shift,level in [('a',0,1),('b',12,.85),('answer',35,.9),('unanswered',0,1),('far',-28,.45)]:
 x=np.zeros(int(1.5*SR));hit=ring(.36,[183+shift,397+shift,681+shift,1110+shift],16)
 put(x,hit,0,.32*level);put(x,hit,.5,.43*level)
 if name=='unanswered':
  x[int(.70*SR):int(.72*SR)]*=np.linspace(1,0,int(.72*SR)-int(.70*SR));x[int(.72*SR):]=0
 if name=='answer':put(x,ring(.2,[260,517],22),1.12,.18)
 if name=='far':x=np.convolve(x,np.ones(13)/13,'same')
 write('two_knocks_'+name,x,'motif.two_knocks.two_knocks_signature_sfx')
for name in ['start','checkpoint','container_hit','rival_pass','finish']:
 x=np.zeros(int(1.5*SR))
 if name=='start':
  for at,f in [(0,330),(.32,330),(.64,330),(.98,660)]:put(x,ring(.2,[f,f*2.17],18),at,.3)
 elif name=='checkpoint':put(x,ring(.55,[710,1193,1900],12),0,.35)
 elif name=='container_hit':
  t=np.arange(int(.85*SR))/SR;put(x,ring(.85,[82,193,467],7)+.12*rng.normal(size=len(t))*np.exp(-22*t),0,.4)
 elif name=='rival_pass':
  t=np.arange(len(x))/SR;env=np.sin(np.pi*t/1.5)**2;mono=(np.sin(2*np.pi*(180*t-38*t*t))*.18+rng.normal(size=len(t))*.035)*env;pan=t/1.5*np.pi/2;x=np.column_stack([mono*np.cos(pan),mono*np.sin(pan)])
 else:
  for at,f in [(0,440),(.16,550),(.36,660)]:put(x,ring(.6,[f,f*2.03],9),at,.25)
 write('race_'+name,x,'race.ash_docks.race_sfx_family')
for weapon in ['h17','arc7']:
 for action in ['shot','reload']:
  x=np.zeros(SR)
  if action=='reload':
   for i in range(4 if weapon=='h17' else 3):put(x,ring(.18,[290+i*70,730+i*110],25),i*.18,.3)
  elif weapon=='h17':
   t=np.arange(int(.33*SR))/SR;put(x,(rng.normal(size=len(t))*.25+np.sin(2*np.pi*(2400*t-1700*t*t))*.12)*np.exp(-23*t),0)
  else:
   for i in range(3):put(x,ring(.38,[440+i*110,880+i*165,1760+i*220],13),i*.09,.22)
  write(weapon+'_'+action,x,'weapon.'+weapon+'.weapon_sfx_family')
# 32 bars at 96 BPM = 80 s. Cyclic additive rendering carries every tail across boundary.
notes=[];N=SR*80;beat=.625
for night in [False,True]:
 x=np.zeros(N)
 def add(start,dur,midi,amp,kind):
  n=int(dur*SR);t=np.arange(n)/SR;f=440*2**((midi-69)/12);env=np.minimum(1,t/.018)*np.exp(-t/(dur*.36));env[-200:]*=np.linspace(1,0,min(200,n))
  sig=(np.sin(2*np.pi*f*t)+(.28*np.sin(2*np.pi*f*3*t) if kind=='bass' else .18*np.sin(2*np.pi*f*2.01*t)))*env*amp
  idx=(int(start*SR)+np.arange(n))%N;np.add.at(x,idx,sig)
  if not night:notes.append([start,dur,midi,amp,kind])
 for bar in range(32):
  root=[38,38,41,36,34,34,36,33][bar%8];base=bar*4*beat
  for b in [0,1.5,2.75]:add(base+b*beat,.5,root,.095 if night else .14,'bass')
  if bar%2==0:
   for b,note in [(0,root+24),(.5,root+24),(2,root+31),(3,root+27)]:add(base+b*beat,1.35,note,.035 if night else .055,'bell')
  for b in ([1,3] if night else [0,1,2.5,3]):
   hit=ring(.23,[116,281,503],22)*(.035 if night else .065);idx=(int((base+b*beat)*SR)+np.arange(len(hit)))%N;np.add.at(x,idx,hit)
 # continuous infrastructure tone, exactly integer cycles across the loop.
 t=np.arange(N)/SR;x+=.012*np.sin(2*np.pi*55*t)+.006*np.sin(2*np.pi*82.5*t)
 write('veyra_championship'+('_night' if night else ''),x,'race.ash_docks.ambience_or_music_variant',True)
(O/'AUDIO_PRODUCTION.json').write_text(json.dumps({'tool':'numpy synthesis + ffmpeg Vorbis','source':'tools/compose_astra_p1.py','source_briefs':['PROMPT 00','PROMPT 01 motif only, not title theme','PROMPT 09'],'bpm':96,'music_seconds':80,'music_score':notes,'files':records,'limits':'Loop construction and peak measured; human listening, mono/mobile mix, runtime and rights acceptance pending. Rival pass uses equal-power stereo pan; mono downmix decoded for peak check.'},indent=2)+'\n')
print('Produced',len(records),'OGG + FLAC pairs')
