"""Original deterministic, offline sound design. No recordings, samples or network.
Requires numpy and ffmpeg. WAV masters are temporary; Ogg and metrics are retained.
"""
from pathlib import Path
import json, math, subprocess, tempfile, wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'game/audio/chrono'
OUT.mkdir(parents=True,exist_ok=True)
SR=44100
RNG=np.random.default_rng(0xC470)
report=[]

def render(name,samples,loop=False,purpose='',integrated=False):
    samples=np.asarray(samples,dtype=float)
    samples-=np.mean(samples)
    if not loop:
        fade=min(int(.025*SR),len(samples)//4)
        samples[:fade]*=np.sin(np.linspace(0,math.pi/2,fade))**2
        samples[-fade:]*=np.cos(np.linspace(0,math.pi/2,fade))**2
    samples*=.30/max(np.max(np.abs(samples)),1e-12)
    pcm=np.rint(samples*32767).astype('<i2')
    with tempfile.NamedTemporaryFile(suffix='.wav') as temp:
        with wave.open(temp.name,'wb') as w:
            w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes())
        subprocess.run(['ffmpeg','-v','error','-y','-i',temp.name,'-c:a','libvorbis','-q:a','4',str(OUT/(name+'.ogg'))],check=True)
    decoded=subprocess.check_output(['ffmpeg','-v','error','-i',str(OUT/(name+'.ogg')),'-f','f32le','-ac','1','-ar',str(SR),'-'])
    a=np.frombuffer(decoded,dtype='<f4')
    report.append(dict(id=name,file='audio/chrono/'+name+'.ogg',loop=loop,duration=len(a)/SR,sample_rate=SR,channels=1,decoded_peak=float(np.max(np.abs(a))),rms=float(np.sqrt(np.mean(a*a))),dc=float(np.mean(a)),loop_boundary_step=float(abs(a[0]-a[-1])),max_sample_step=float(np.max(np.abs(np.diff(a)))),bytes=(OUT/(name+'.ogg')).stat().st_size,purpose=purpose,status='integrated' if integrated else 'validated technical reserve',provenance='Original numpy additive/subtractive synthesis; deterministic RNG 0xC470; Vorbis via ffmpeg; no recordings. Human listening not performed.'))

def tone(t,freq): return np.sin(2*math.pi*freq*t)
def periodic_noise(n,rolloff=.8,low=40,high=1400):
    # Integer Fourier bins make the entire texture periodic without a fade seam.
    f=np.fft.rfftfreq(n,1/SR);amp=np.zeros(len(f));use=(f>=low)&(f<high)
    amp[use]=1/np.maximum(f[use],1)**rolloff
    z=amp*np.exp(1j*RNG.uniform(0,2*math.pi,len(f)))
    a=np.fft.irfft(z,n=n);return a/max(np.max(np.abs(a)),1e-9)

duration=8;n=int(SR*duration);t=np.arange(n)/SR
for i,name in enumerate(['old_town','refuge','cathedral','toxic_market','clockwork','necropolis']):
    air=periodic_noise(n,.9,35,900 if i!=3 else 1700)
    base=.19*air+.08*tone(t,[48,62,55,71,50,43][i])
    if i==2:
        # Loop ambience uses distant steady resonances; bell strikes are separate.
        base+=.03*tone(t,110)+.02*tone(t,164.875)
    if i==4:
        base+=.03*np.sin(2*math.pi*137*t)*(np.maximum(0,np.cos(2*math.pi*3*t))**12)
    if i==3:
        base+=.04*periodic_noise(n,.2,300,2200)*(1+.2*tone(t,.5))
    if i==1:
        base+=.03*periodic_noise(n,.4,240,1100)*(1+.2*tone(t,.375))
    render(name,base,True,'District ambience; stable eight-second periodic sound field',True)

specs={
 'cathedral_bell':(3.8,110,'bell'),'mechanism':(1.1,95,'gear'),'toxic_reactor':(1.6,68,'toxic'),
 'crowd_shop':(2.2,270,'crowd'),'chrono_energy':(.65,220,'chrono'),'chainsaw':(1.1,89,'saw'),
 'shotgun':(.7,64,'gun'),'impact':(.3,110,'impact'),'boss_collapse':(1.7,46,'impact'),
 'purchase':(.28,660,'ui'),'upgrade':(.55,440,'ui'),'save':(.48,523.25,'ui'),
 'suspense_appearance':(1.4,52,'suspense'),'suspense_activation':(1.1,78,'suspense'),
 'suspense_entry':(1.3,61,'suspense'),'suspense_boss':(1.6,43,'suspense'),
 'suspense_final':(1.8,58,'suspense'),'relic':(.7,740,'ui'),'bone_break':(.5,180,'gear'),
 'gear_break':(.6,130,'gear'),'toxic_splash':(.65,96,'toxic'),'portal':(1.4,147,'chrono')}
for name,(duration,f,kind) in specs.items():
    t=np.arange(int(SR*duration))/SR;u=t/duration
    noise=RNG.normal(0,1,len(t));smooth=np.convolve(noise,np.ones(9)/9,'same')
    decay=np.exp(-7*u)
    if kind=='bell':
        a=sum(tone(t,f*r)*np.exp(-t*(.7+j*.32))/(j+1)**1.4 for j,r in enumerate([1,2.01,2.76,4.13,5.43]))
    elif kind=='gear':
        a=(smooth*.6+tone(t,f)*.2)*decay*(.4+.6*np.maximum(0,tone(t,19))**8)
    elif kind=='toxic':a=(smooth+.3*tone(t,f))*(np.sin(math.pi*u)**2)*(1+.35*tone(t,11))
    elif kind=='crowd':a=(.8*smooth+.08*tone(t,270)+.05*tone(t,390))*(np.sin(math.pi*u)**2)*(1+.2*tone(t,3))
    elif kind=='chrono':a=(tone(t,f+45*u)+.3*tone(t,f*2))*np.sin(math.pi*u)**2+.1*smooth*decay
    elif kind=='saw':a=(np.sin(2*math.pi*f*t)+.5*np.sin(2*math.pi*f*3*t)+.3*noise)*np.sin(math.pi*u)**2*(.8+.2*tone(t,22))
    elif kind=='gun':a=(noise*.8+tone(t,f)*.7)*np.exp(-13*u)+.25*smooth*np.exp(-5*u)
    elif kind=='impact':a=(.65*smooth+.7*np.sin(2*math.pi*(f*t-20*t*t)))*decay
    elif kind=='ui':a=(tone(t,f)*np.exp(-t*14)+.45*tone(t,f*1.5)*np.exp(-np.maximum(0,t-.07)*18)*(t>=.07))
    else:a=(.4*tone(t,f)+.2*tone(t,f*1.0625)+.3*smooth)*(np.sin(math.pi*u)**2)*.6
    render(name,a,False,'Original '+kind+' cue; no new narrative trigger',name in ['chrono_energy','impact','boss_collapse','save','suspense_boss'])

assert all(0<r['decoded_peak']<.5 and abs(r['dc'])<.01 for r in report)
(ROOT/'docs/evidence/chrono_shadows/audio-assets.json').write_text(json.dumps({'tool':'tools/chrono_audio.py + numpy + ffmpeg/libvorbis','human_listening':False,'assets':report},indent=2)+'\n')
print('Rendered',len(report),'original Ogg cues; decoded peaks below -6 dBFS')
