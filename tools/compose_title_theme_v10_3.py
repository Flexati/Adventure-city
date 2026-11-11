"""V10.3 title theme (D44): the 8 November menu mix rebuilt as a registered derivative.

The author kept the theme mixed on 8 November (757d672, written over game/audio/v05/title.ogg there) and asked for it
without distortion and without the jump at the loop point. Same layers, gains and knocks; the engineering is redone:
  * every synthetic layer is periodic over the 60 s loop (124 beats at 124 BPM): ticks on the 8th-note grid, drone at
    36.7 Hz (2202 cycles) with its 0.1 Hz swell (6 cycles), and the reese bass in chord segments that each start at
    phase 0 and meet the next one in an equal-power crossfade, the last chord wrapping into the first;
  * band-limited saws (PolyBLEP) instead of naive ones, so the drive does not fold aliasing into the top end;
  * the stems keep their own ending and restart, with the 24 ms tail past 60 s folded onto the start;
  * no copied segment at the boundaries (the old "seam" wrote one crossfade at both ends of the file);
  * the compander has no make-up gain; loudness is measured (EBU R128) to the action target of AUDIO_PLAN_V10_3.md
    (-15 LUFS +-1) under a soft ceiling, and the decoded file must show no clipped sample and a true peak under -1 dBTP;
  * the tick noise is seeded and the encoders run bitexact: the same stems and the same ffmpeg/libvorbis give the same bytes.
The original game/audio/v05/title.ogg is never written. Human listening and final mix approval pending.
"""
from pathlib import Path
import numpy as np, json, subprocess, hashlib, re

ROOT = Path(__file__).resolve().parents[1]
SR, BPM, N = 48000, 124.0, 48000 * 60
SEED = 20261111
STEMS = ROOT / 'assets/preproduction/v9/audio'
SOURCE = ROOT / 'assets/production/v10.3/audio'
OUT = ROOT / 'game/audio/v10/title_theme.ogg'
ORIGINAL = ROOT / 'game/audio/v05/title.ogg'
TARGET, TOLERANCE = -15.0, 1.0
NOTES = [73.42, 58.27, 43.65, 65.41, 73.42, 58.27, 65.41, 73.42]
GAINS = {'title_stem': .72, 'danger_stem': .64, 'synth': .32, 'ticks': .14, 'bass': .38, 'drone': .0}
KNOCKS = [(0.5, .90), (30.0, .75)]
CHAIN = 'highpass=f=35:poles=2,bass=g=-4:f=140:w=0.7,equalizer=f=1600:t=q:w=0.8:g=2.5,treble=g=1.2:f=4200:w=0.7,compand=attacks=0.015:decays=0.18:points=-80/-80|-24/-20|-12/-10|-0.1/-0.1:gain=0'
PHONE = 'highpass=f=300:poles=2,highpass=f=300:poles=2'
PHONE_MIN = -19.5


def decode(path):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'])
    return np.frombuffer(raw, dtype='<f4').reshape(-1, 2).astype(np.float64)


def ffmpeg_pcm(x, args, out='-'):
    # bitexact: no random Ogg serial and no encoder version tag, so the same PCM gives the same bytes.
    cmd = ['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', *args, *(['-fflags', '+bitexact', '-flags:a', '+bitexact'] if out != '-' else []), out]
    return subprocess.run(cmd, input=np.ascontiguousarray(x, dtype='<f4').tobytes(), capture_output=True, check=True)


def loudness(source, pre=''):
    """Integrated loudness and true peak (EBU R128) of a file path or of a PCM array; pre filters first (phone band)."""
    af = (pre + ',' if pre else '') + 'ebur128=peak=true'
    if isinstance(source, np.ndarray):
        err = subprocess.run(['ffmpeg', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', af,
                              '-f', 'null', '-'], input=np.ascontiguousarray(source, dtype='<f4').tobytes(), capture_output=True).stderr.decode()
    else:
        err = subprocess.run(['ffmpeg', '-nostats', '-i', str(source), '-af', af, '-f', 'null', '-'],
                             capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', err)[-1]), float(re.findall(r'Peak:\s+(-?[\d.inf]+) dBFS', err)[-1])


def periodic_stem(name):
    x = decode(STEMS / f'{name}.ogg')
    loop = x[:N].copy()
    tail = x[N:]
    loop[:len(tail)] += tail
    return loop


def ticks(_rng=None):
    step = 60 / (BPM * 2)
    L = int(.035 * SR)
    tt = np.arange(L) / SR
    click = (np.sin(2 * np.pi * 1480 * tt) * .45 + np.sin(2 * np.pi * 2960 * tt) * .20) * np.exp(-tt * 115)
    out = np.zeros((N, 2))
    for i in range(int(round(60 / step))):
        at = int(round(i * step * SR))
        pan = .25 * np.sin(i * .5)
        g = .65 if i % 4 == 0 else (.38 if i % 2 == 0 else .20)
        idx = np.arange(at, at + L) % N
        out[idx, 0] += click * g * (.5 - pan)
        out[idx, 1] += click * g * (.5 + pan)
    return out


def bass():
    seg, xf = N // len(NOTES), int(.08 * SR)
    out = np.zeros(N)
    r = np.arange(xf) / xf
    for k, f0 in enumerate(NOTES):
        n = np.arange(seg + xf)
        ph = 2 * np.pi * f0 / SR * n
        mono = np.sin(ph) * .74 + np.sin(2 * ph) * .20 + np.sin(3 * ph) * .06
        env = np.ones(len(n))
        env[:xf] = np.sin(r * np.pi / 2)
        env[-xf:] = np.cos(r * np.pi / 2)
        np.add.at(out, (k * seg - xf // 2 + n) % N, np.tanh(mono * 1.12) * .52 * env)
    t = np.arange(N) / SR
    return out * (.85 + .15 * (.5 + .5 * np.cos(2 * np.pi * (BPM / 60) * t)) ** 4)


def compose():
    tk, bs = ticks(), bass()
    synth = tk * GAINS['ticks'] + (bs * GAINS['bass'])[:, None]
    mix = periodic_stem('title') * GAINS['title_stem'] + periodic_stem('danger') * GAINS['danger_stem'] + synth * GAINS['synth']
    knock = decode(STEMS / 'knock.ogg')
    for at, vol in KNOCKS:
        idx = (int(at * SR) + np.arange(len(knock))) % N
        mix[idx] += knock * vol
    return mix


def master(mix, ogg):
    y = mix - mix.mean(axis=0)
    y *= .96 / np.abs(y).max()
    # EQ and compander run on three periods; the middle one is the loop in steady state, so filter memory never meets silence.
    processed = np.frombuffer(ffmpeg_pcm(np.tile(y, (3, 1)), ['-af', CHAIN, '-f', 'f32le']).stdout, dtype='<f4').reshape(-1, 2)
    y = processed[N:2 * N].astype(np.float64)
    for ceiling_db in (-1.5, -2.0, -2.5, -3.0):
        z, ceil = y.copy(), 10 ** (ceiling_db / 20)
        for _ in range(3):
            i, _tp = loudness(z)
            z *= 10 ** ((TARGET - i) / 20)
            k = ceil * .8
            z = np.where(np.abs(z) > k, np.sign(z) * (k + ceil * .2 * np.tanh((np.abs(z) - k) / (ceil * .2))), z)
        ffmpeg_pcm(z, ['-c:a', 'libvorbis', '-q:a', '5'], str(ogg))
        i, tp = loudness(ogg)
        if tp <= -1.0 and abs(i - TARGET) <= TOLERANCE:
            return z, ceiling_db
    raise SystemExit(f'title_theme: no ceiling met -1 dBTP at {TARGET} LUFS (last {i} LUFS, {tp} dBTP)')


def main():
    assert OUT.resolve() != ORIGINAL.resolve()
    original_sha = hashlib.sha256(ORIGINAL.read_bytes()).hexdigest()
    # Nothing replaces the shipped files until every check below passes.
    ogg, flac = OUT.with_name('title_theme.tmp.ogg'), SOURCE / 'title_theme-master.tmp.flac'
    z, ceiling_db = master(compose(), ogg)
    SOURCE.mkdir(parents=True, exist_ok=True)
    dec = decode(ogg)
    mono = dec.mean(axis=1)
    S, fr = np.abs(np.fft.rfft(mono)) ** 2, np.fft.rfftfreq(len(mono), 1 / SR)
    w = int(.15 * SR)
    head, tail = mono[:w], mono[-w:]
    i, tp = loudness(ogg)
    phone, _ = loudness(ogg, PHONE)
    metrics = {'cue': 'title_theme', 'revision': 1, 'decision': 'D44', 'duration_seconds': round(len(dec) / SR, 3),
               'integrated_lufs': i, 'true_peak_dbfs': tp, 'phone_band_lufs': phone, 'soft_ceiling_dbfs': ceiling_db, 'peak': round(float(np.abs(dec).max()), 4),
               'rms': round(float(np.sqrt(np.mean(dec ** 2))), 4),
               'energy_bands': {f'{a}-{b}Hz': round(float(S[(fr >= a) & (fr < b)].sum() / S.sum()), 3)
                                for a, b in [(0, 200), (200, 800), (800, 3000), (3000, 20000)]},
               'loop_boundary_step': round(float(np.abs(dec[0] - dec[-1]).max()), 4),
               'typical_step': round(float(np.median(np.abs(np.diff(dec, axis=0)))), 4),
               'head_tail_correlation': round(float(np.corrcoef(head, tail)[0, 1]), 3),
               'clipped_samples': int((np.abs(dec) >= 1).sum()), 'bytes': ogg.stat().st_size,
               'sha256': hashlib.sha256(ogg.read_bytes()).hexdigest(), 'original_untouched_sha256': original_sha,
               'human_listening': False, 'commercial_ready': False}
    assert hashlib.sha256(ORIGINAL.read_bytes()).hexdigest() == original_sha
    problems = [k for k, bad in [('clipped', metrics['clipped_samples']), ('true peak', tp > -1.0), ('loudness', abs(i - TARGET) > TOLERANCE),
                                 ('loop step', metrics['loop_boundary_step'] >= .02), ('copied seam', metrics['head_tail_correlation'] >= .9),
                                 ('length', len(dec) != N), ('phone band', phone < PHONE_MIN)] if bad]
    if problems:
        ogg.unlink(missing_ok=True)
        raise SystemExit('title_theme failed: ' + ', '.join(problems) + ' ' + json.dumps(metrics))
    ffmpeg_pcm(z, ['-af', 'aresample=osf=s16:dither_method=triangular', '-c:a', 'flac'], str(flac))
    ogg.replace(OUT)
    flac.replace(SOURCE / 'title_theme-master.flac')
    stems = {n: hashlib.sha256((STEMS / f'{n}.ogg').read_bytes()).hexdigest() for n in ('title', 'danger', 'knock')}
    (SOURCE / 'title_theme-score.json').write_text(json.dumps({
        'title': 'CHRONOS — tema del titolo (D44)', 'revision': 1, 'bpm': BPM, 'bars': 31, 'loop_seconds': 60,
        'progression_hz': NOTES, 'chord_seconds': 7.5, 'knocks': KNOCKS, 'gains': GAINS, 'master_chain': CHAIN, 'seed': SEED,
        'stems': {f'assets/preproduction/v9/audio/{n}.ogg': h for n, h in stems.items()},
        'derived_from': '757d672 game/audio/v05/title.ogg (mix of 8 November, approved by the author in D44)',
        'provenance': 'Project preproduction stems plus deterministic synthesis in tools/compose_title_theme_v10_3.py; '
                      'no external samples, recordings, providers or artist imitation. Human listening and final mix approval pending.'},
        indent=1, ensure_ascii=False) + '\n')
    (SOURCE / 'title_theme-metrics.json').write_text(json.dumps(metrics, indent=2) + '\n')
    print(json.dumps(metrics, indent=1))


if __name__ == '__main__':
    main()
