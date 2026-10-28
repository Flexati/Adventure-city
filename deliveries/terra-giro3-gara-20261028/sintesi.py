import numpy as np, wave, subprocess, json, pathlib, hashlib
ROOT=pathlib.Path(__file__).parent
SR=48000
rng=np.random.default_rng(281026)
def noise(n,lo,hi):
    f=np.fft.rfftfreq(n,1/SR); z=np.fft.rfft(rng.normal(size=n))
    w=np.minimum(1,np.maximum(0,(f-lo)/max(lo*.4,40)))*np.minimum(1,np.maximum(0,(hi-f)/max(hi*.25,40)))
    y=np.fft.irfft(z*w,n); return y/(np.std(y)+1e-9)
def chirp(t,a,b):
    k=np.log(b/a)/max(t[-1],1/SR); return np.sin(2*np.pi*a*np.expm1(k*t)/k)
def bell(t,f):
    return sum(g*np.sin(2*np.pi*f*h*t)*np.exp(-d*t) for h,g,d in [(1,1,4),(2,.3,8),(3,.12,12),(4.01,.07,18)])
def render(name,dur):
    t=np.arange(round(dur*SR))/SR;n=len(t)
    air=noise(n,400,9000)
    if name=='nitro': y=.38*air*np.exp(-5*t)+.35*chirp(t,160,1150)*(1-t/dur)**1.6+.14*chirp(t,75,38)*np.exp(-18*t)
    elif name=='pad': y=.3*air*np.exp(-15*t)+.5*chirp(t,180,800)*np.exp(-7*t)+.2*bell(t,1340)
    elif name=='near_miss': y=noise(n,900,11000)*(.17+np.sin(np.pi*t/dur)**2)*np.exp(-1.8*t/dur)
    elif name in ['slick','wheelspin']:
        f=1350+220*np.sin(2*np.pi*8*t)+130*np.sin(2*np.pi*19*t)
        if name=='wheelspin': f+=650*t/dur
        p=2*np.pi*np.cumsum(f)/SR
        y=(.4*noise(n,600,6500)+.3*np.sin(p)+.08*np.sin(2*p))*(.7+.3*np.sin(2*np.pi*31*t))*(1-t/dur)**.7
    elif name=='slick_sabbia':
        y=(.5*noise(n,250,5500)*(.5+.5*np.sin(2*np.pi*43*t)**2)+.18*noise(n,60,500))*(1-t/dur)**.8
    elif name=='perfect_start':
        y=.7*bell(t,880)
        s=t-.16; y+=np.where(s>=0,.8*bell(np.maximum(s,0),1320),0)
    elif name=='eliminated': y=(.5*chirp(t,340,48)+.2*chirp(t,510,72)+.12*noise(n,80,1600))*(1-t/dur)**1.3
    else:
        rank=name.split('_')[-1]; notes={'bronze':[392,493.88,587.33],'silver':[440,554.37,659.25,880],'gold':[523.25,659.25,783.99,1046.5]}[rank]
        y=np.zeros(n)
        for i,f in enumerate(notes):
            s=t-i*.12;u=np.maximum(s,0); a=np.minimum(u/.004,1)
            y+=np.where(s>=0,bell(u,f)*a*.5,0)
        if rank=='gold':
            for f in [523.25,659.25,783.99]:
                u=np.maximum(t-.5,0);y+=np.where(t>=.5,.18*bell(u,f)*np.minimum(u/.008,1),0)
    return y


# Loudness targets: highest short-term level over 50 ms windows, in dBFS. A measured mix hierarchy
# (key moments louder, small cues softer), not the result of listening: nobody has listened yet.
TARGET = {'nitro': -10, 'perfect_start': -10, 'medal_gold': -10, 'medal_silver': -10.5, 'medal_bronze': -11,
          'eliminated': -10.5, 'pad': -11, 'slick': -12, 'slick_sabbia': -12, 'wheelspin': -12, 'near_miss': -12.5}
PEAK = -4.0


def st50(y):
    w = 2400
    return max(20 * np.log10(np.sqrt(np.mean(y[i:i + w] ** 2)) + 1e-12) for i in range(0, max(1, len(y) - w), 480))


def decode(ogg):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(ogg), '-f', 'f32le', '-acodec', 'pcm_f32le', '-'])
    return np.frombuffer(raw, dtype='<f4')


def finish(name, dur, raw):
    n = len(raw)
    t = np.arange(n) / SR
    # Attack in 1 ms; smooth 65 ms fade followed by 12 ms silence.
    env = np.minimum(t / .001, 1) * np.sin(np.clip((dur - .012 - t) / .065, 0, 1) * np.pi / 2) ** 2
    # Drive the soft clipper until the short-term level reaches the target with the peak at PEAK at most.
    for g in np.geomspace(.8, 6, 40):
        y = np.tanh(raw * g) * env
        y = y / (np.max(np.abs(y)) + 1e-12) * 10 ** (PEAK / 20)
        if st50(y) >= TARGET[name]:
            break
    level = st50(y)
    if level > TARGET[name]:
        y *= 10 ** ((TARGET[name] - level) / 20)
    wav = ROOT / 'master' / ('race_' + name + '.wav')
    ogg = ROOT / 'suoni' / ('race_' + name + '.ogg')
    # The encoder can drop the last partial block: pad the master with silence until the decoded OGG
    # has exactly the nominal number of samples.
    pad = 0
    for _ in range(4):
        pcm = np.concatenate([y, np.zeros(pad)])
        with wave.open(str(wav), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((pcm * 32767).round().astype('<i2').tobytes())
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav), '-c:a', 'libvorbis', '-q:a', '7', str(ogg)], check=True)
        z = decode(ogg)
        if len(z) >= n:
            break
        pad += n - len(z)
    z = decode(ogg)
    peak = 20 * np.log10(np.max(np.abs(z)))
    first = np.flatnonzero(np.abs(z) > 10 ** (-60 / 20))[0] / SR
    print(name, round(peak, 2), round(first * 1000, 3), len(z) / SR, dur, round(st50(z), 2), pad)
    assert peak <= -3 and first <= .005 and abs(len(z) / SR - dur) <= .001
    sp = np.abs(np.fft.rfft(z * np.hanning(len(z)))) + 1e-12
    fr = np.fft.rfftfreq(len(z), 1 / SR)
    return dict(file=ogg.name, duration=len(z) / SR, nominal=dur, master_samples=n + pad, sample_rate=SR, channels=1, codec='vorbis',
                peak_dbfs=float(peak), short_term_50ms_max_dbfs=float(st50(z)), target_50ms_dbfs=TARGET[name],
                rms_dbfs=float(20 * np.log10(np.sqrt(np.mean(z ** 2)))), spectral_centroid_hz=float((sp * fr).sum() / sp.sum()),
                spectral_flatness=float(np.exp(np.mean(np.log(sp))) / np.mean(sp)),
                onset_above_minus60_dbfs_ms=float(first * 1000),
                first_sample_abs=float(abs(z[0])),
                tail_last_5ms_peak_dbfs=float(20 * np.log10(max(np.max(np.abs(z[-240:])), 1e-12))),
                sha256=hashlib.sha256(ogg.read_bytes()).hexdigest())


spec={'nitro':.9,'pad':.4,'near_miss':.35,'slick':.6,'slick_sabbia':.6,'perfect_start':.5,'wheelspin':.6,'eliminated':.8,'medal_gold':1.5,'medal_silver':1.5,'medal_bronze':1.5}
raws={k:render(k,v) for k,v in spec.items()}  # same seeded noise as before: synthesis order unchanged
report=[finish(k,v,raws[k]) for k,v in spec.items()]
(ROOT/'VERIFICA_AUDIO.json').write_text(json.dumps({'misure':report,'nota':'Misure su OGG decodificati (durata, picco, livello a breve termine su 50 ms, RMS, centroide e piattezza spettrale, attacco, coda). Nessun ascolto umano o test in gioco effettuato: chi ha rifinito il set (Claude) non può ascoltare; la qualità percepita resta da valutare.'},indent=2)+'\n')
print(json.dumps(report,indent=2))
