#!/usr/bin/env python3
"""R30 (D74): the roar of the jaguar in the studio intro, synthesized from nothing (original, reproducible).

  python3 tools/synth_jaguar_roar_r30.py            # writes game/audio/v10/jaguar_roar.ogg (+ a WAV and a spectrogram if asked)
  python3 tools/synth_jaguar_roar_r30.py --wav out.wav --png spec.png

Model of a big cat roar: a voiced source (glottal pulses with a rising-then-falling pitch, jitter, shimmer and period
doubling for the growl) through a time-varying vocal tract (four formant resonators opening and closing with the
mouth), pulsed breath noise through the same tract, a 34 Hz roughness tremolo, soft saturation, then a low boom and a
thin thunder crack under the peak (the "lightning jaguars" of the logo, D61/D66), and a stereo room. Deterministic seed.
"""
import argparse, subprocess, sys, tempfile
from pathlib import Path
import numpy as np
from scipy import signal

SR = 44100
ROOT = Path(__file__).resolve().parents[1]
rng = np.random.default_rng(7301)


def env(t, points):
    """Piecewise-linear envelope through (time, value) points."""
    ts, vs = zip(*points)
    return np.interp(t, ts, vs)


def glottal_source(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    f0 = env(t, [(0, 120), (.10, 165), (.32, 215), (.75, 190), (1.4, 150), (2.0, 112), (dur, 92)])
    out = np.zeros(n); phase = 0.0; amp = 1.0; jit = 1.0; cycle = 0
    for i in range(n):
        phase += f0[i] * jit / SR
        if phase >= 1.0:
            phase -= 1.0; cycle += 1
            jit = 1 + rng.normal(0, .028)                      # pitch jitter, cycle to cycle
            rough = env(t[i], [(0, .15), (.2, .55), (1.2, .45), (dur, .7)])
            amp = (1 + rng.normal(0, .14)) * (1 - rough * .55 if cycle % 2 else 1)  # shimmer + period doubling
        p = phase
        # Rosenberg pulse: smooth opening (60 % of the cycle), sharp closing, closed phase
        out[i] = amp * (.5 * (1 - np.cos(np.pi * p / .6)) if p < .6 else np.cos(np.pi * (p - .6) / .8) if p < 1.0 else 0)
    d = np.diff(out, prepend=0)                                # radiated derivative: brighter, like a mouth
    return d / (np.max(np.abs(d)) + 1e-9), t


def formant_bank(x, t, tracks, block=256):
    """Parallel 2-pole resonators whose centre and width follow `tracks` [(freqs(t), bw, gain)], block by block."""
    y = np.zeros_like(x)
    for freq_env, bw, gain in tracks:
        zi = np.zeros(2); out = np.zeros_like(x)
        for s in range(0, len(x), block):
            f = float(np.interp(t[s], *freq_env)); r = np.exp(-np.pi * bw / SR); w = 2 * np.pi * f / SR
            b = [(1 - r) * np.sqrt(1 - 2 * r * np.cos(2 * w) + r * r)]; a = [1, -2 * r * np.cos(w), r * r]
            out[s:s + block], zi = signal.lfilter(b, a, x[s:s + block], zi=zi)
        y += gain * out
    return y


def room_ir(seconds=1.6, seed=11):
    g = np.random.default_rng(seed); n = int(seconds * SR); t = np.arange(n) / SR
    ir = np.zeros((n, 2))
    for ch in range(2):
        tail = g.normal(0, 1, n) * np.exp(-t * 4.2) * (1 - np.exp(-t * 90))
        b, a = signal.butter(2, [180 / (SR / 2), 5200 / (SR / 2)], 'band'); ir[:, ch] = signal.lfilter(b, a, tail)
        for k, (dt, gk) in enumerate([(.011, .5), (.017, .38), (.023, .3), (.031, .22)]):  # early reflections
            ir[int((dt + ch * .0023 + k * .0007) * SR), ch] += gk
    return ir / np.max(np.abs(ir))


def render(dur=2.7):
    src, t = glottal_source(dur)
    mouth = (t.tolist(), None)
    # mouth opens fast, holds wide, closes slowly: formants rise then fall
    F = lambda pts: ([p[0] for p in pts], [p[1] for p in pts])
    tracks = [(F([(0, 330), (.25, 640), (1.0, 600), (2.0, 430), (dur, 360)]), 140, 1.0),
              (F([(0, 900), (.25, 1250), (1.0, 1180), (2.0, 980), (dur, 900)]), 200, .62),
              (F([(0, 2200), (.3, 2550), (dur, 2300)]), 280, .32),
              (F([(0, 3200), (.3, 3500), (dur, 3250)]), 380, .16)]
    voiced = formant_bank(src, t, tracks)
    # breath: noise pulsed by the glottal cycle, through the same tract, louder at the start and in the tail
    noise = rng.normal(0, 1, len(t)); pulse = np.clip(np.abs(src) * 3, 0, 1)
    breath = formant_bank(noise * (.35 + .65 * pulse), t, tracks) * env(t, [(0, .9), (.25, .45), (1.6, .5), (dur, 1.0)])
    x = voiced / np.max(np.abs(voiced)) + .42 * breath / np.max(np.abs(breath))
    x *= 1 - env(t, [(0, .1), (.25, .38), (1.6, .32), (dur, .2)]) * (.5 + .5 * np.sin(2 * np.pi * 34 * t))  # roughness
    x *= env(t, [(0, 0), (.06, .55), (.22, 1.0), (.9, .92), (1.7, .55), (2.4, .18), (dur, 0)])               # body of the roar
    x = np.tanh(2.2 * x) / np.tanh(2.2)                                                                       # grit
    b, a = signal.butter(2, 60 / (SR / 2), 'high'); x = signal.lfilter(b, a, x)
    b, a = signal.butter(4, 6800 / (SR / 2), 'low'); x = signal.lfilter(b, a, x)
    # low boom and a thin thunder crack under the peak (the flash of the logo lands ~0.15 s after the roar starts)
    tb = np.clip(t - .14, 0, None); boom = np.sin(2 * np.pi * np.cumsum(env(tb, [(0, 72), (.5, 38), (dur, 34)])) / SR)
    boom *= np.where(t >= .14, np.exp(-tb * 4.5) * (1 - np.exp(-tb * 120)), 0)
    crack = rng.normal(0, 1, len(t)) * np.where(t >= .13, np.exp(-np.clip(t - .13, 0, None) * 9), 0)
    b, a = signal.butter(2, [900 / (SR / 2), 7000 / (SR / 2)], 'band'); crack = signal.lfilter(b, a, crack) * (rng.random(len(t)) < .35)
    dry = x + .55 * boom + .10 * crack / (np.max(np.abs(crack)) + 1e-9)
    # stereo: a slightly wider breath, then the room
    st = np.stack([dry, np.roll(dry, int(.0009 * SR))], 1)
    ir = room_ir(); wet = np.stack([signal.fftconvolve(st[:, c], ir[:, c])[:len(st)] for c in range(2)], 1)
    out = .82 * st + .26 * wet / np.max(np.abs(wet)) * np.max(np.abs(st))
    fade = np.ones(len(out)); fade[-int(.25 * SR):] = np.linspace(1, 0, int(.25 * SR)) ** 2; out *= fade[:, None]
    return out / np.max(np.abs(out)) * 10 ** (-7.0 / 20)        # -16.0 LUFS (peak -7 dBFS, coherent with intro theme)


def write_wav(path, x):
    from scipy.io import wavfile
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('--wav'); ap.add_argument('--png'); ap.add_argument('--out', default=str(ROOT / 'game/audio/v10/jaguar_roar.ogg'))
    a = ap.parse_args(); x = render()
    with tempfile.TemporaryDirectory() as d:
        w = a.wav or str(Path(d) / 'roar.wav'); write_wav(w, x)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', w, '-ar', '48000', '-c:a', 'libvorbis', '-q:a', '5', a.out], check=True)
    if a.png:
        import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
        f, tt, S = signal.spectrogram(x[:, 0], SR, nperseg=1024, noverlap=768)
        plt.figure(figsize=(9, 4)); plt.pcolormesh(tt, f, 10 * np.log10(S + 1e-12), vmin=-110, vmax=-30, shading='auto'); plt.ylim(0, 8000)
        plt.xlabel('s'); plt.ylabel('Hz'); plt.title('jaguar_roar'); plt.colorbar(); plt.tight_layout(); plt.savefig(a.png, dpi=90)
    print(a.out, f'{len(x) / SR:.2f} s')
