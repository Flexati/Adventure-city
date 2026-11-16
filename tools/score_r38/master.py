"""R38: bus processing, room and echo, mastering to the Gate 2 targets, Opus encoding and measurement."""
import hashlib, json, re, subprocess
import numpy as np
from scipy import signal
from . import dsp
from .dsp import SR

PHONE = 'highpass=f=300:poles=2,highpass=f=300:poles=2'


def ffmpeg_measure(x=None, path=None, pre=''):
    """EBU R128 integrated loudness, true peak and loudness range of a PCM array or a file."""
    af = (pre + ',' if pre else '') + 'ebur128=peak=true'
    if path is None:
        err = subprocess.run(['ffmpeg', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', af, '-f', 'null', '-'],
                             input=np.ascontiguousarray(x, dtype='<f4').tobytes(), capture_output=True).stderr.decode()
    else:
        err = subprocess.run(['ffmpeg', '-nostats', '-i', str(path), '-af', af, '-f', 'null', '-'], capture_output=True).stderr.decode()
    i = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', err)[-1])
    tp = float(re.findall(r'Peak:\s+(-?[\d.inf]+) dBFS', err)[-1])
    lra = float(re.findall(r'LRA:\s+(-?[\d.]+) LU', err)[-1])
    return i, tp, lra


def encode_opus(x, path, kbps):
    # bitexact: no random Ogg serial and no encoder version tag, so the same PCM and ffmpeg/libopus give the same bytes.
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'libopus', '-b:a', f'{kbps}k',
                    '-vbr', 'on', '-compression_level', '10', '-application', 'audio', '-frame_duration', '20', '-map_metadata', '-1',
                    '-fflags', '+bitexact', '-flags:a', '+bitexact', str(path)],
                   input=np.ascontiguousarray(x, dtype='<f4').tobytes(), capture_output=True, check=True)


def decode(path):
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'])
    return np.frombuffer(raw, dtype='<f4').reshape(-1, 2).astype(np.float64)


def sidechain(song, depth=.35, release=.18):
    """Gain curve that dips on every kick and recovers: the pump of the dance tracks, circular over the loop."""
    g = np.zeros(song.n)
    t = np.arange(int(release * 5 * SR)) / SR
    shape = depth * np.exp(-t / release) * np.minimum(1, t / .004 + .3)
    for b in song.kicks:
        s = song.sample(b) % song.n
        L = len(shape)
        idx = (s + np.arange(L)) % song.n
        g[idx] = np.maximum(g[idx], shape)
    return 1 - g


def mixdown(song, spec):
    """Process the buses, add room and echo, return the stereo mix before mastering."""
    b = song.bus
    out = np.zeros((song.n, 2))
    duck = sidechain(song, spec.get('duck', 0)) if spec.get('duck') else None
    eq = {
        'drums': lambda x: dsp.highpass(x, 30),
        'perc': lambda x: dsp.highpass(x, 400),
        'bass': lambda x: dsp.lowpass(dsp.highpass(x, 30), 6000),
        'pad': lambda x: signal.sosfilt(dsp.peaking(320, -2.5, .9), dsp.highpass(x, 140), axis=0),
        'keys': lambda x: dsp.highpass(x, 110),
        'lead': lambda x: signal.sosfilt(dsp.peaking(2800, 1.5, .8), dsp.highpass(x, 150), axis=0),
        'fx': lambda x: dsp.highpass(x, 40),
    }
    # Static balance by perceived loudness where each part plays (BS.1770, active blocks), relative to the melody: the melody
    # on top, drums and bass under it, harmony behind. A piece can move a part with `balance`.
    targets = {'lead': 0.0, 'drums': -2.5, 'bass': -4.5, 'keys': -4.0, 'pad': -7.0, 'perc': -13.0, 'fx': -9.0}
    targets.update(spec.get('balance', {}))
    processed = {}
    for name, x in b.items():
        if not np.any(x):
            continue
        y = dsp.periodic(x.astype(np.float64), eq[name], 2)
        if name == 'drums':
            y = dsp.glue(y, -16, 3.0, .004, .08)
        if duck is not None and name in ('pad', 'bass', 'keys'):
            y = y * duck[:, None]
        processed[name] = y
    ref = 'lead' if 'lead' in processed else spec.get('reference', 'keys' if 'keys' in processed else next(iter(processed)))
    ref_l = dsp.active_loudness(processed[ref]) - targets.get(ref, 0.0)
    report, gain = {}, {}
    for name, y in processed.items():
        gain[name] = g = 10 ** ((ref_l + targets[name] - dsp.active_loudness(y)) / 20)
        report[name] = round(20 * np.log10(g), 1)
        out += y * g
    song.balance = report
    room = sum((x.astype(np.float64) * gain.get(k, 0) for k, x in song.room.items()), np.zeros((song.n, 2)))
    echo = sum((x.astype(np.float64) * gain.get(k, 0) for k, x in song.echo.items()), np.zeros((song.n, 2)))
    rt = spec.get('room', (2.2, 1.7, .8))
    ir = dsp.room_ir(song.n, np.random.default_rng(7), rt=rt, predelay=spec.get('predelay', .02), length=max(rt) * 1.4)
    wet_room = dsp.circular_convolve(dsp.periodic(room, lambda x: dsp.highpass(x, 180), 2), ir)
    out += wet_room * spec.get('room_level', .55)
    if np.any(echo):
        e = dsp.circular_convolve(echo, dsp.echo_ir(song.n, spec.get('echo_step', .75) * song.beat, spec.get('echo_fb', .4)))
        out += e * spec.get('echo_level', .35)
        out += dsp.circular_convolve(e, ir) * .15
    return out


def master(mix, target, ceiling_db=-2.2):
    """Tone, glue, loudness to `target` LUFS and a true-peak ceiling; loop-aware all the way."""
    def tone(x):
        sos = np.vstack([signal.butter(2, 28, 'high', fs=SR, output='sos'), dsp.peaking(260, -1.2, .8), dsp.peaking(3200, 1.2, .9),
                         dsp.shelf(9500, 1.0, True)])
        return signal.sosfilt(sos, x, axis=0)
    y = dsp.periodic(mix - mix.mean(axis=0), tone, 2)
    y *= .5 / (np.sqrt((y ** 2).mean()) * 4 + 1e-9)
    y = dsp.glue(y, -18, 1.8, .02, .25)
    for _ in range(4):
        i, _, _ = ffmpeg_measure(y)
        y = y * 10 ** ((target - i) / 20)
        y = np.tanh(y / .95) * .95 if np.abs(y).max() > .95 else y
        y = dsp.true_peak_limit(y, ceiling_db)
    return dsp.edge_fade(y)


def metrics(path, n, target):
    dec = decode(path)
    i, tp, lra = ffmpeg_measure(path=path)
    phone, _, _ = ffmpeg_measure(path=path, pre=PHONE)
    mono = dec.mean(axis=1)
    S, fr = np.abs(np.fft.rfft(mono)) ** 2, np.fft.rfftfreq(len(mono), 1 / SR)
    # Loop seam: the step from the last sample to the first against the typical step, and the RMS of the last and first 50 ms.
    w = int(.05 * SR)
    seam_db = 20 * np.log10(np.abs(dec[0] - dec[-1]).max() + 1e-9)
    rms = lambda a: 20 * np.log10(np.sqrt((a ** 2).mean()) + 1e-9)
    return {
        'duration_seconds': round(len(dec) / SR, 3), 'samples': len(dec), 'samples_expected': n,
        'integrated_lufs': i, 'target_lufs': target, 'true_peak_dbtp': tp, 'loudness_range_lu': lra, 'phone_band_lufs': phone,
        'energy_bands': {f'{a}-{b}Hz': round(float(S[(fr >= a) & (fr < b)].sum() / S.sum()), 3) for a, b in [(0, 200), (200, 800), (800, 3000), (3000, 20000)]},
        'loop_seam_step_db': round(seam_db, 1), 'typical_step_db': round(20 * np.log10(np.median(np.abs(np.diff(dec, axis=0))) + 1e-9), 1),
        'loop_rms_tail_db': round(rms(dec[-w:]), 1), 'loop_rms_head_db': round(rms(dec[:w]), 1),
        'clipped_samples': int((np.abs(dec) >= 1).sum()), 'bytes': path.stat().st_size,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
    }
