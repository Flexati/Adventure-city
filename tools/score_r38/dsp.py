"""R38 (D74): signal processing and instruments for the new score. Deterministic, no samples, no recordings.

Everything is synthesized at 48 kHz from oscillators, noise and filters written here:
  * band-limited oscillators (PolyBLEP saw and pulse, additive partials), so nothing folds aliasing into the top end;
  * instruments: strings, brass, choir, felt piano, FM electric piano, bells, pluck, mallets, bass, sub, lead, arp synth,
    organ, drums (kick, snare, clap, hats, toms, cymbals, shaker, rim), taiko, timpani, clock tick, risers and impacts;
  * effects: circular convolution room, tempo-synced echo, sidechain duck, glue compressor, true-peak limiter.
The loop is seamless by construction: a note that rings past the end is folded onto the start, the room and the echo are
circular, and every filter with memory runs on several periods and keeps one in steady state.
"""
import numpy as np
from scipy import signal
from scipy.ndimage import minimum_filter1d, uniform_filter1d

SR = 48000
TWO_PI = 2 * np.pi


def hz(m):
    return 440.0 * 2 ** ((np.asarray(m, dtype=float) - 69) / 12)


def env_adsr(n, dur, a=.005, d=.1, s=.7, r=.2):
    """Linear attack, exponential decay to sustain, release after `dur` seconds; n samples."""
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-6), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-6)))
    rel = np.where(t < dur, 1.0, np.exp(-(t - dur) / max(r / 4.6, 1e-6)))
    level_at_release = np.where(dur < a, dur / max(a, 1e-6), s + (1 - s) * np.exp(-(dur - a) / max(d, 1e-6)))
    e = np.where(t < dur, e, level_at_release * rel)
    return e


def polyblep(ph, dt):
    out = np.zeros_like(ph)
    m = ph < dt
    if np.any(m):
        x = ph[m] / (dt[m] if np.ndim(dt) else dt)
        out[m] = 2 * x - x * x - 1
    m = ph > 1 - (dt if not np.ndim(dt) else dt)
    if np.any(m):
        x = (ph[m] - 1) / (dt[m] if np.ndim(dt) else dt)
        out[m] = x * x + 2 * x + 1
    return out


def phase(f, n, ph0=0.0):
    """Phase in cycles for a constant or per-sample frequency."""
    if np.ndim(f):
        return (ph0 + np.cumsum(f) / SR) % 1.0
    return (ph0 + np.arange(n) * f / SR) % 1.0


def saw(f, n, ph0=0.0):
    ph = phase(f, n, ph0)
    dt = (np.asarray(f) / SR) if np.ndim(f) else f / SR
    return 2 * ph - 1 - polyblep(ph, dt)


def pulse(f, n, width=.5, ph0=0.0):
    ph = phase(f, n, ph0)
    dt = (np.asarray(f) / SR) if np.ndim(f) else f / SR
    a = np.where(ph < width, 1.0, -1.0) + polyblep(ph, dt) - polyblep((ph + 1 - width) % 1.0, dt)
    return a


def sine(f, n, ph0=0.0):
    return np.sin(TWO_PI * phase(f, n, ph0))


def lowpass(x, fc, order=2):
    fc = float(min(max(fc, 20), SR * .45))
    sos = signal.butter(order, fc, 'low', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def highpass(x, fc, order=2):
    fc = float(min(max(fc, 10), SR * .45))
    sos = signal.butter(order, fc, 'high', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def bandpass(x, lo, hi, order=2):
    sos = signal.butter(order, [max(lo, 20), min(hi, SR * .45)], 'band', fs=SR, output='sos')
    return signal.sosfilt(sos, x, axis=0)


def peaking(f0, gain_db, q):
    """RBJ peaking biquad as an sos row."""
    A = 10 ** (gain_db / 40)
    w = TWO_PI * f0 / SR
    al = np.sin(w) / (2 * q)
    b = np.array([1 + al * A, -2 * np.cos(w), 1 - al * A])
    a = np.array([1 + al / A, -2 * np.cos(w), 1 - al / A])
    return np.concatenate([b / a[0], a / a[0]])[None, :]


def shelf(f0, gain_db, high=True, s=.8):
    A = 10 ** (gain_db / 40)
    w = TWO_PI * f0 / SR
    al = np.sin(w) / 2 * np.sqrt((A + 1 / A) * (1 / s - 1) + 2)
    c = np.cos(w)
    if high:
        b = [A * ((A + 1) + (A - 1) * c + 2 * np.sqrt(A) * al), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - 2 * np.sqrt(A) * al)]
        a = [(A + 1) - (A - 1) * c + 2 * np.sqrt(A) * al, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - 2 * np.sqrt(A) * al]
    else:
        b = [A * ((A + 1) - (A - 1) * c + 2 * np.sqrt(A) * al), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - 2 * np.sqrt(A) * al)]
        a = [(A + 1) + (A - 1) * c + 2 * np.sqrt(A) * al, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - 2 * np.sqrt(A) * al]
    b, a = np.array(b), np.array(a)
    return np.concatenate([b / a[0], a / a[0]])[None, :]


def periodic(x, fn, periods=3):
    """Run a filter with memory on a loop in steady state: process `periods` copies and keep the last one."""
    n = len(x)
    y = fn(np.concatenate([x] * periods, axis=0))
    return y[(periods - 1) * n:periods * n]


# ----------------------------------------------------------------------------------------------- instruments
# Every instrument returns (signal, tail_seconds_used); signal is mono (n,) or stereo (n, 2), velocity applied by caller.

def inst_strings(f, dur, rng, bright=1.0, attack=.35, release=.9):
    """Ensemble of five detuned band-limited saws, slow attack, gentle vibrato, warm low-pass; stereo."""
    n = int((dur + release + .1) * SR)
    t = np.arange(n) / SR
    out = np.zeros((n, 2))
    vib = 1 + .0016 * np.sin(TWO_PI * (5.2 + rng.uniform(-.3, .3)) * t) * np.clip((t - .25) / .5, 0, 1)
    for j, cents in enumerate((0, -7, 7, -13, 12)):
        fj = f * 2 ** (cents / 1200) * vib
        s = saw(fj, n, rng.uniform())
        pan = (-.8, -.3, .3, .8, 0)[j]
        out[:, 0] += s * np.sqrt((1 - pan) / 2)
        out[:, 1] += s * np.sqrt((1 + pan) / 2)
    fc = min(f * 7 * bright + 600, 5200 * bright)
    out = lowpass(lowpass(out, fc), fc * 1.6)
    out = highpass(out, max(60, f * .5))
    e = env_adsr(n, dur, a=attack, d=.6, s=.85, r=release)
    return out * e[:, None] * .22


def inst_spiccato(f, dur, rng, bright=1.0):
    """Short bowed strings: fast attack, quick decay; stereo."""
    d = min(dur, .22)
    n = int((d + .25) * SR)
    out = np.zeros((n, 2))
    for j, cents in enumerate((0, -9, 8)):
        s = saw(f * 2 ** (cents / 1200), n, rng.uniform())
        pan = (-.5, 0, .5)[j]
        out[:, 0] += s * np.sqrt((1 - pan) / 2)
        out[:, 1] += s * np.sqrt((1 + pan) / 2)
    out = lowpass(out, min(f * 9 * bright + 900, 7000))
    out = highpass(out, max(70, f * .6))
    e = env_adsr(n, d, a=.006, d=.08, s=.35, r=.12)
    return out * e[:, None] * .32


def additive(f, n, amp, ph=None, stretch=0.0, kmax=40):
    """Sum of partials k*f*(1+stretch*k^2); amp(k, fk) returns a scalar or a per-sample array."""
    out = np.zeros(n)
    t = np.arange(n) / SR
    for k in range(1, kmax + 1):
        fk = f * k * (1 + stretch * k * k)
        if fk >= SR * .45:
            break
        a = amp(k, fk)
        if np.isscalar(a) and a < 1e-4:
            continue
        p = 0.0 if ph is None else ph[k % len(ph)]
        out += a * np.sin(TWO_PI * fk * t + p)
    return out


def inst_brass(f, dur, rng, bright=1.0):
    """Two detuned additive voices with a filter envelope that opens on the attack, a scoop and late vibrato."""
    rel = .25
    n = int((dur + rel + .05) * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    open_ = np.minimum(1, t / .06)
    fc = f * (1.5 + (4.5 * bright) * open_ * (.75 + .25 * np.exp(-t / .3)))
    for cents in (-5, 5):
        fd = f * 2 ** (cents / 1200)
        scoop = 2 ** ((-25 * np.exp(-t / .045)) / 1200)
        vib = 1 + .003 * np.sin(TWO_PI * 5.4 * t) * np.clip((t - .35) / .4, 0, 1)
        ph = TWO_PI * np.cumsum(fd * scoop * vib) / SR
        for k in range(1, 30):
            if fd * k > SR * .4:
                break
            a = (1 / k) / np.sqrt(1 + (fd * k / fc) ** 4)
            out += a * np.sin(k * ph)
    e = env_adsr(n, dur, a=.03, d=.25, s=.8, r=rel)
    return np.tanh(out * e * 1.4) * .32


def inst_choir(f, dur, rng, vowel='a'):
    """Formant-filtered pulse ensemble ('a' or 'o'), slow attack; stereo."""
    rel = .8
    n = int((dur + rel + .05) * SR)
    t = np.arange(n) / SR
    formants = {'a': [(800, 1.0, 80), (1150, .5, 90), (2900, .25, 120)], 'o': [(450, 1.0, 70), (800, .4, 80), (2830, .12, 100)]}[vowel]
    out = np.zeros((n, 2))
    for j, cents in enumerate((-8, 0, 9, 15)):
        vib = 1 + .004 * np.sin(TWO_PI * (5.0 + j * .23) * t + j)
        src = pulse(f * 2 ** (cents / 1200) * vib, n, .3 + .05 * j, rng.uniform())
        v = np.zeros(n)
        for fc, g, bw in formants:
            v += g * bandpass(src, fc - bw, fc + bw, 1)
        pan = (-.6, -.2, .2, .6)[j]
        out[:, 0] += v * np.sqrt((1 - pan) / 2)
        out[:, 1] += v * np.sqrt((1 + pan) / 2)
    e = env_adsr(n, dur, a=.45, d=.8, s=.9, r=rel)
    return out * e[:, None] * .55


def inst_piano(f, dur, rng, bright=1.0):
    """Felt piano: two slightly detuned stretched-partial strings, per-partial decay, soft hammer."""
    rel = .35
    tail = min(3.5, 1.2 + 260 / f)
    n = int((dur + tail) * SR)
    t = np.arange(n) / SR
    B = 3e-5 * (f / 261) ** 1.5
    out = np.zeros(n)
    for cents in (-1.2, 1.2):
        fd = f * 2 ** (cents / 1200)
        def amp(k, fk):
            base = (1 / k ** 1.15) / np.sqrt(1 + (fk / (2600 * bright)) ** 2)
            return base * np.exp(-t * (.6 + .9 * k ** 1.1 * (f / 300) ** .4))
        out += additive(fd, n, amp, stretch=B, kmax=18)
    hammer = lowpass(rng.normal(0, 1, int(.012 * SR)), 1800) * np.exp(-np.arange(int(.012 * SR)) / (.003 * SR)) * .05
    out[:len(hammer)] += hammer
    damp = np.where(t < dur, 1.0, np.exp(-(t - dur) / .12))
    return out * damp * np.minimum(1, t / .0025) * .45


def inst_epiano(f, dur, rng, bright=1.0):
    """FM tine piano: ratio 1 body with decaying index, ratio 14 tine click."""
    tail = 1.6
    n = int((dur + tail) * SR)
    t = np.arange(n) / SR
    idx = (1.4 * bright) * np.exp(-t * 3.2) + .2
    s = np.sin(TWO_PI * f * t + idx * np.sin(TWO_PI * f * t))
    s += .14 * np.sin(TWO_PI * f * 14 * t) * np.exp(-t * 45) if f * 14 < SR * .45 else 0
    s *= np.exp(-t * (.9 + f / 1100)) * np.minimum(1, t / .002)
    s *= np.where(t < dur, 1.0, np.exp(-(t - dur) / .15))
    return s * .42


def inst_bell(f, dur, rng, ratio=3.5):
    tail = 3.0
    n = int((dur + tail) * SR)
    t = np.arange(n) / SR
    idx = 2.0 * np.exp(-t * 2.6)
    if f * ratio * 3 > SR * .45:
        idx = idx * .3
    s = np.sin(TWO_PI * f * t + idx * np.sin(TWO_PI * f * ratio * t))
    s += .22 * np.sin(TWO_PI * f * 2 * t) * np.exp(-t * 2.2)
    return s * np.exp(-t * 1.0) * np.minimum(1, t / .0015) * .30


def inst_glass(f, dur, rng):
    """Glass harmonica / EVE: pure partials 1, 2.0, 3.0 with slow shimmer; cold and precise."""
    tail = 2.4
    n = int((dur + tail) * SR)
    t = np.arange(n) / SR
    s = np.sin(TWO_PI * f * t) + .35 * np.sin(TWO_PI * f * 2.003 * t) * np.exp(-t * 1.5) + .12 * np.sin(TWO_PI * f * 3.01 * t) * np.exp(-t * 3)
    s *= 1 + .12 * np.sin(TWO_PI * 4.1 * t)
    e = env_adsr(n, dur, a=.04, d=.9, s=.55, r=1.6)
    return s * e * .3


def inst_mallet(f, dur, rng):
    """Marimba-like: partials 1, 4, 9.9 with fast decay of the upper ones."""
    tail = .9
    n = int((dur + tail) * SR)
    t = np.arange(n) / SR
    s = np.sin(TWO_PI * f * t) * np.exp(-t * (3 + f / 400))
    if f * 4 < SR * .45:
        s += .35 * np.sin(TWO_PI * f * 4 * t) * np.exp(-t * 18)
    if f * 9.9 < SR * .45:
        s += .12 * np.sin(TWO_PI * f * 9.9 * t) * np.exp(-t * 40)
    return s * np.minimum(1, t / .001) * .45


def inst_pluck(f, dur, rng, bright=1.0):
    """Harp / nylon pluck: additive partials, upper ones decay faster; precisely tuned."""
    tail = min(2.5, .6 + 300 / f)
    n = int((dur + tail) * SR)
    t = np.arange(n) / SR
    pos = .13 + rng.uniform(-.02, .02)

    def amp(k, fk):
        return abs(np.sin(np.pi * k * pos)) / k ** 1.0 / np.sqrt(1 + (fk / (3800 * bright)) ** 2) * np.exp(-t * (1.2 + .35 * k * k * (f / 400)))
    s = additive(f, n, amp, kmax=24)
    s *= np.minimum(1, t / .0015) * np.where(t < dur + .6, 1.0, np.exp(-(t - dur - .6) / .2))
    return s * .55


def inst_synthpluck(f, dur, rng, bright=1.0, width=.0):
    """Arp synth: two saws, fast filter envelope; additive so the envelope stays band-limited."""
    tail = .35
    n = int((min(dur, .5) + tail) * SR)
    t = np.arange(n) / SR
    fc = f * (1.2 + 9 * bright * np.exp(-t / .07))
    out = np.zeros(n)
    for cents in (-6, 6):
        fd = f * 2 ** (cents / 1200)
        out += additive(fd, n, lambda k, fk: (1 / k) / np.sqrt(1 + (fk / fc) ** 4), kmax=32)
    e = np.exp(-t / .16) * np.minimum(1, t / .002)
    return out * e * .30


def inst_lead(f, dur, rng, bright=1.0):
    """Singing lead: saw plus square an octave down, gliding filter, delayed vibrato."""
    rel = .2
    n = int((dur + rel + .05) * SR)
    t = np.arange(n) / SR
    vib = 1 + .0045 * np.sin(TWO_PI * 5.6 * t) * np.clip((t - .25) / .35, 0, 1)
    fc = f * (2.0 + 3.5 * bright * (.6 + .4 * np.exp(-t / .2)))
    ph = TWO_PI * np.cumsum(f * vib) / SR
    out = np.zeros(n)
    for k in range(1, 26):
        if f * k > SR * .4:
            break
        a = (1 / k) / np.sqrt(1 + (f * k / fc) ** 4)
        out += a * np.sin(k * ph)
        if k % 2 == 1:
            out += .35 * (1 / k) / np.sqrt(1 + (f * k / 2 / fc) ** 4) * np.sin(k * ph / 2)
    e = env_adsr(n, dur, a=.02, d=.3, s=.85, r=rel)
    return np.tanh(out * e * 1.2) * .3


def inst_organ(f, dur, rng):
    """Drawbar organ 8' 4' 2 2/3' 2' with slow rotary shimmer; stereo."""
    rel = .15
    n = int((dur + rel) * SR)
    t = np.arange(n) / SR
    s = sum(g * np.sin(TWO_PI * f * m * t) for m, g in ((.5, .6), (1, 1), (2, .55), (3, .3), (4, .25)) if f * m < SR * .45)
    lfo = np.sin(TWO_PI * .8 * t)
    e = env_adsr(n, dur, a=.012, d=.1, s=1, r=rel)
    s = s * e * .2
    return np.stack([s * (1 + .25 * lfo), s * (1 - .25 * lfo)], axis=1)


def inst_bass(f, dur, rng, bright=1.0, drive=1.6):
    """Electric/synth bass: sine fundamental plus filtered saw harmonics a phone speaker can play; saturated."""
    rel = .08
    n = int((dur + rel + .02) * SR)
    t = np.arange(n) / SR
    fc = f * (2.5 + 6 * bright * np.exp(-t / .12))
    s = np.sin(TWO_PI * f * t) * .9
    s += additive(f, n, lambda k, fk: 0 if k == 1 else (.55 / k) / np.sqrt(1 + (fk / fc) ** 4), kmax=20)
    s = np.tanh(drive * s) / np.tanh(drive)
    e = env_adsr(n, dur, a=.004, d=.25, s=.75, r=rel)
    return s * e * .5


def inst_sub(f, dur, rng):
    rel = .1
    n = int((dur + rel) * SR)
    t = np.arange(n) / SR
    s = np.sin(TWO_PI * f * t) + .15 * np.sin(TWO_PI * 2 * f * t)
    return s * env_adsr(n, dur, a=.01, d=.3, s=.9, r=rel) * .5


def inst_reese(f, dur, rng):
    """Detuned saw bass for the heavy tracks; low-passed, with the sine underneath."""
    rel = .1
    n = int((dur + rel) * SR)
    s = saw(f * 2 ** (-11 / 1200), n, rng.uniform()) + saw(f * 2 ** (11 / 1200), n, rng.uniform())
    s = lowpass(s, min(f * 6, 1400), 2) * .6 + np.sin(TWO_PI * f * np.arange(n) / SR) * .8
    s = np.tanh(1.8 * s)
    return s * env_adsr(n, dur, a=.006, d=.2, s=.85, r=rel) * .45


# ----------------------------------------------------------------------------------------------- percussion

def drum_kick(rng, punch=1.0, tone=48.0):
    n = int(.55 * SR)
    t = np.arange(n) / SR
    f = tone + 110 * np.exp(-t / .035) * punch
    body = np.sin(TWO_PI * np.cumsum(f) / SR) * np.exp(-t / .22)
    click = bandpass(rng.normal(0, 1, n), 1500, 6000) * np.exp(-t / .004) * .35
    knock = np.sin(TWO_PI * 180 * t) * np.exp(-t / .02) * .25
    return np.tanh((body + click + knock) * 1.3) * .9


def drum_snare(rng, tone=190.0, snap=1.0):
    n = int(.4 * SR)
    t = np.arange(n) / SR
    body = (np.sin(TWO_PI * tone * t) + .5 * np.sin(TWO_PI * tone * 1.8 * t)) * np.exp(-t / .06)
    noise = bandpass(rng.normal(0, 1, n), 1500, 9000) * np.exp(-t / (.11 * snap))
    return (body * .55 + noise * .75) * .7


def drum_clap(rng):
    n = int(.35 * SR)
    t = np.arange(n) / SR
    nz = bandpass(rng.normal(0, 1, n), 900, 5000)
    e = np.zeros(n)
    for d in (0, .011, .022, .034):
        e += np.where(t >= d, np.exp(-(t - d) / .008), 0) * (.7 if d < .03 else 1)
    e += np.where(t >= .034, np.exp(-(t - .034) / .12), 0) * .6
    return nz * e * .5


def drum_hat(rng, open_=False):
    n = int((.45 if open_ else .08) * SR)
    t = np.arange(n) / SR
    metal = sum(np.sign(np.sin(TWO_PI * fr * t + rng.uniform(0, 6))) for fr in (205.3, 304.4, 369.6, 522.7, 540.0, 800.0))
    s = highpass(metal * .3 + rng.normal(0, 1, n) * .5, 7000)
    return s * np.exp(-t / (.12 if open_ else .018)) * .32


def drum_shaker(rng):
    n = int(.09 * SR)
    t = np.arange(n) / SR
    return bandpass(rng.normal(0, 1, n), 4000, 12000) * np.sin(np.pi * np.minimum(1, t / .08)) ** 2 * .22


def drum_rim(rng):
    n = int(.08 * SR)
    t = np.arange(n) / SR
    s = np.sin(TWO_PI * 1650 * t) * np.exp(-t / .012) + bandpass(rng.normal(0, 1, n), 2000, 7000) * np.exp(-t / .006) * .5
    return s * .4


def drum_tom(rng, f=110.0):
    n = int(.6 * SR)
    t = np.arange(n) / SR
    fr = f * (1 + .5 * np.exp(-t / .05))
    s = np.sin(TWO_PI * np.cumsum(fr) / SR) * np.exp(-t / .22) + bandpass(rng.normal(0, 1, n), 200, 2000) * np.exp(-t / .03) * .2
    return np.tanh(s * 1.2) * .6


def drum_crash(rng, length=2.2):
    n = int(length * SR)
    t = np.arange(n) / SR
    metal = sum(np.sin(TWO_PI * fr * t + rng.uniform(0, 6)) for fr in (420, 563, 701, 899, 1201, 1660, 2210, 3150))
    s = highpass(rng.normal(0, 1, n) * .8 + metal * .08, 3500)
    return s * np.exp(-t / (length / 4.5)) * np.minimum(1, t / .002) * .28


def drum_taiko(rng, f=62.0):
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    fr = f * (1 + .35 * np.exp(-t / .06))
    body = np.sin(TWO_PI * np.cumsum(fr) / SR) * np.exp(-t / .45)
    skin = bandpass(rng.normal(0, 1, n), 120, 1800) * np.exp(-t / .05) * .5
    slap = bandpass(rng.normal(0, 1, n), 1200, 5000) * np.exp(-t / .008) * .25
    return np.tanh((body + skin + slap) * 1.5) * .8


def drum_timpani(rng, f=73.4):
    n = int(2.0 * SR)
    t = np.arange(n) / SR
    s = np.sin(TWO_PI * f * t) * np.exp(-t / .8) + .5 * np.sin(TWO_PI * f * 1.5 * t) * np.exp(-t / .5) + .3 * np.sin(TWO_PI * f * 1.98 * t) * np.exp(-t / .4)
    s += bandpass(rng.normal(0, 1, n), 80, 900) * np.exp(-t / .04) * .4
    return s * np.minimum(1, t / .003) * .5


def fx_tick(rng, pitch=2400.0):
    n = int(.05 * SR)
    t = np.arange(n) / SR
    s = (np.sin(TWO_PI * pitch * t) + .5 * np.sin(TWO_PI * pitch * 2.7 * t)) * np.exp(-t / .006) + highpass(rng.normal(0, 1, n), 3000) * np.exp(-t / .002) * .4
    return s * .3


def fx_riser(rng, seconds, lo=300.0, hi=7000.0):
    """Filtered noise rising into the next section, block-wise time-varying band-pass with carried filter state."""
    n = int(seconds * SR)
    x = rng.normal(0, 1, n)
    out = np.zeros(n)
    blk = 512
    zi = None
    for i in range(0, n, blk):
        p = i / n
        fc = lo * (hi / lo) ** p
        sos = signal.butter(2, [fc * .7, min(fc * 1.4, SR * .45)], 'band', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2))
        out[i:i + blk], zi = signal.sosfilt(sos, x[i:i + blk], zi=zi)
    e = (np.arange(n) / n) ** 2
    return out * e * .5


def fx_impact(rng, f=40.0):
    n = int(2.5 * SR)
    t = np.arange(n) / SR
    boom = np.sin(TWO_PI * np.cumsum(f * (1 + 1.5 * np.exp(-t / .08))) / SR) * np.exp(-t / .7)
    crack = bandpass(rng.normal(0, 1, n), 300, 4000) * np.exp(-t / .05) * .4
    return np.tanh((boom + crack) * 1.4) * .7


# ----------------------------------------------------------------------------------------------- effects

def room_ir(n, rng, rt=(2.2, 1.7, .8), predelay=.02, length=3.0, early=True):
    """Stereo decaying room, frequency-damped per band, with a few early reflections; returned at loop length n."""
    L = int(length * SR)
    t = np.arange(L) / SR
    fr = np.fft.rfftfreq(L, 1 / SR)
    ir = np.zeros((n, 2))
    for ch in range(2):
        spec = np.fft.rfft(rng.normal(0, 1, L))
        out = np.zeros(L)
        for mask, r in zip([(fr < 500), (fr >= 500) & (fr < 4000), (fr >= 4000)], rt):
            out += np.fft.irfft(spec * mask, L) * np.exp(-6.9 * t / r)
        out *= np.minimum(1, t / .02)
        if early:
            for d, g in ((.011, .5), (.017, .35), (.029, .3), (.041, .2)):
                k = int((d + .003 * ch) * SR)
                out[k] += g * 6 * (1 if ch == 0 else -1) ** int(d * 1000)
        dly = int(predelay * SR) + ch * 23
        m = min(L, n - dly)
        ir[dly:dly + m, ch] = out[:m]
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    return ir


def echo_ir(n, step_s, feedback=.38, taps=6, damp=3500.0):
    """Ping-pong echo: taps every `step_s`, alternating sides, each one darker."""
    ir = np.zeros((n, 2))
    for k in range(1, taps + 1):
        d = int(round(k * step_s * SR))
        if d >= n:
            break
        ir[d, (k + 1) % 2] = feedback ** (k - 1)
    for k in range(2):
        ir[:, k] = lowpass(ir[:, k], damp, 1)
    return ir


def circular_convolve(x, ir):
    n = len(x)
    out = np.zeros_like(x)
    for ch in range(2):
        out[:, ch] = np.fft.irfft(np.fft.rfft(x[:, ch]) * np.fft.rfft(ir[:, ch]), n)
    return out


def glue(x, threshold_db=-14.0, ratio=2.0, attack=.01, release=.15):
    """Feed-forward RMS compressor on the stereo sum, loop-aware (periodic)."""
    def fn(y):
        p = (y ** 2).mean(axis=1)
        a = np.exp(-1 / (attack * SR))
        r = np.exp(-1 / (release * SR))
        # attack/release on the power envelope with a one-pole each way: approximate with two passes
        env = signal.lfilter([1 - r], [1, -r], p)
        env = np.maximum(env, signal.lfilter([1 - a], [1, -a], p))
        level = 10 * np.log10(env + 1e-12)
        over = np.maximum(0, level - threshold_db)
        g = 10 ** (-(over * (1 - 1 / ratio)) / 20)
        return y * g[:, None]
    return periodic(x, fn, 2)


K_SOS = np.array([[1.53512485958697, -2.69169618940638, 1.19839281085285, 1.0, -1.69065929318241, 0.73248077421585],
                  [1.0, -2.0, 1.0, 1.0, -1.99004745483398, 0.99007225036621]])


def active_loudness(x, window=.4, span_db=20.0):
    """BS.1770 K-weighted loudness of the blocks within `span_db` of the loudest one: how loud a part is where it plays."""
    k = signal.sosfilt(K_SOS, x, axis=0)
    w = int(window * SR)
    hop = w // 4
    p = (k ** 2).sum(axis=1)
    c = np.concatenate([[0], np.cumsum(p)])
    starts = np.arange(0, len(p) - w, hop)
    ms = (c[starts + w] - c[starts]) / w
    lb = -0.691 + 10 * np.log10(ms + 1e-15)
    keep = lb > lb.max() - span_db
    return -0.691 + 10 * np.log10(ms[keep].mean() + 1e-15)


def edge_fade(x, ms=6.0):
    """Raised-cosine fade at both ends: the media element restarts a loop after a short gap, so it must stop and start at
    zero or it clicks twice."""
    n = int(ms / 1000 * SR)
    r = .5 - .5 * np.cos(np.pi * np.arange(n) / n)
    y = x.copy()
    y[:n] *= r[:, None]
    y[-n:] *= r[::-1][:, None]
    return y


def true_peak_limit(x, ceiling_db=-2.0, look_ms=1.5):
    """Lookahead limiter driven by 4x-oversampled peaks; the gain envelope is a min filter smoothed by a box filter."""
    ceil = 10 ** (ceiling_db / 20)
    up = signal.resample_poly(np.concatenate([x[-64:], x, x[:64]]), 4, 1, axis=0)
    pk = np.abs(up).max(axis=1)
    pk = pk.reshape(-1, 4).max(axis=1)[64:-64]
    need = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    # min over [i-L, i+L], then the mean over the same centred window: every value averaged is <= need[i], so g <= need.
    L = max(3, int(look_ms / 1000 * SR))
    g = minimum_filter1d(need, size=2 * L + 1, mode='wrap')
    g = uniform_filter1d(g, size=2 * L + 1, mode='wrap')
    return x * g[:, None]
