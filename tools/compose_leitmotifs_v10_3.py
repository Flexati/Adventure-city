"""V10.3 leitmotif cues: refuge_theme and promise_theme (revision 2).

Original authored score; deterministic synthesis (FM electric piano, FM bells,
band-limited detuned saw pads, saturated bass) and a synthetic convolution room.
No provider, samples, recordings or artist imitation. Human listening and final
mix approval pending.

Revision 2 (2026-10-31), after the author asked to review the audio:
  * rev 1 had 64% of its energy below 200 Hz and almost nothing above 800 Hz:
    on a phone speaker it sounded empty and dull. Bass now carries harmonics that
    small speakers reproduce, instruments have real attack and brightness.
  * rev 1 used three discrete echo taps (audible slapback); now a decaying,
    frequency-damped stereo room, convolved circularly so the loop stays seamless.
  * more musical motion: broken-chord arpeggio, counter-melody, a dynamic arc
    over the 16 bars, small timing and velocity humanisation.
  * loudness set by measurement (EBU R128), not by peak guess.

Motifs (docs/gold/AUDIO_PLAN_V10_3.md):
  NOX   low, long-short-short, falls and lands: D F A G | F D
  LULU  high, rises and leans forward:          A C E D | E G
  PROMISE  the two answer each other and stop on Asus4, never resolving.
"""
from pathlib import Path
import numpy as np, json, wave, subprocess, tempfile, hashlib, re

ROOT = Path(__file__).resolve().parents[1]
SR = 44100
SOURCE = ROOT / 'assets/production/v10.3/audio'
OUT = ROOT / 'game/audio/v10'
NOX = [(0, 50, 1.5), (1.5, 53, .5), (2, 57, 1), (3, 55, 1)]
NOX_TAIL = [(0, 53, 1), (1, 50, 3)]
LULU = [(0, 69, .5), (.5, 72, .5), (1, 76, 1), (2, 74, 2)]
LULU_TAIL = [(0, 76, 1), (1, 79, 3)]
hz = lambda m: 440 * 2 ** ((m - 69) / 12)


def lufs(path):
    out = subprocess.run(['ffmpeg', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    i = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', out)[-1])
    tp = float(re.findall(r'Peak:\s+(-?[\d.inf]+) dBFS', out)[-1])
    return i, tp


class Score:
    def __init__(self, bpm, bars, seed):
        self.bpm, self.bars, self.beat = bpm, bars, 60 / bpm
        self.n = int(round(SR * bars * 4 * self.beat))
        self.dry = np.zeros((self.n, 2))
        self.send = np.zeros((self.n, 2))          # what goes to the room
        self.rng = np.random.default_rng(seed)
        self.events = []

    # --- instruments -------------------------------------------------------
    def _voice(self, voice, f, dur):
        tail = {'epiano': 2.5, 'bell': 3.5, 'pad': 1.6, 'bass': .35, 'tick': .08}[voice]
        n = int((dur + tail) * SR); t = np.arange(n) / SR
        rel = np.clip((dur + tail - t) / tail, 0, 1)
        if voice == 'epiano':                           # FM tine piano: ratio 1 body + ratio 14 tine
            idx = 1.6 * np.exp(-t * 3) + .25
            sig = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t))
            sig += .18 * np.sin(2 * np.pi * f * 14 * t) * np.exp(-t * 40)
            sig *= np.exp(-t * (.9 + f / 900)) * np.minimum(1, t / .003)
            gate = np.where(t < dur, 1, np.exp(-(t - dur) * 6))
            return sig * gate * rel
        if voice == 'bell':                             # FM bell: inharmonic ratio 3.5
            idx = 2.2 * np.exp(-t * 2.5)
            sig = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * 3.5 * t))
            sig += .25 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 2)
            return sig * np.exp(-t * 1.1) * np.minimum(1, t / .002) * rel
        if voice == 'pad':                              # three detuned band-limited saws, soft low-pass
            sig = np.zeros(n)
            for det in (-7, 0, 7):
                fd = f * 2 ** (det / 1200); ph = self.rng.uniform(0, 2 * np.pi)
                for k in range(1, int(min(5200, SR / 2.2) / fd) + 1):
                    w = (1 / k) / np.sqrt(1 + (k * fd / 1400) ** 4)
                    if w < .004: break
                    sig += w * np.sin(2 * np.pi * fd * k * t + ph * k)
            sig *= (1 + .08 * np.sin(2 * np.pi * .23 * t)) / 3
            env = np.minimum(1, t / 1.1) * np.where(t < dur, 1, np.clip(1 - (t - dur) / tail, 0, 1))
            return sig * env
        if voice == 'bass':                             # sine + saturation: harmonics a phone can play
            sig = np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * 2 * f * t)
            sig = np.tanh(2.2 * sig) / np.tanh(2.2)
            sig *= (.75 + .25 * np.exp(-t * 4)) * np.minimum(1, t / .006)
            return sig * np.where(t < dur, 1, np.clip(1 - (t - dur) / tail, 0, 1))
        # tick: the Vortex clock, short filtered click
        noise = self.rng.normal(0, 1, n)
        noise = np.convolve(noise, np.ones(6) / 6, 'same')
        return (noise * .5 + np.sin(2 * np.pi * 2400 * t)) * np.exp(-t * 160)

    def note(self, beat, midi, beats, voice, vel, pan=0.0, wet=.35, human=True):
        jit = self.rng.normal(0, .008) if human and voice != 'tick' else 0
        vel *= self.rng.uniform(.9, 1.08) if human else 1
        start = int((beat * self.beat + jit) * SR)
        sig = self._voice(voice, hz(midi), beats * self.beat) * vel
        idx = (start + np.arange(len(sig))) % self.n
        l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
        for buf, g in ((self.dry, 1 - wet * .5), (self.send, wet)):
            np.add.at(buf[:, 0], idx, sig * l * g); np.add.at(buf[:, 1], idx, sig * r * g)
        self.events.append(dict(beat=round(beat, 3), midi=midi, beats=beats, voice=voice, velocity=round(vel, 4), pan=pan))

    def motif(self, at, motif, voice, vel, pan=0.0, shift=0, scale=1.0, wet=.35):
        for b, m, d in motif:
            self.note(at + b * scale, m + shift, d * scale, voice, vel, pan, wet)

    def pad(self, at, notes, beats, vel):
        for j, m in enumerate(notes):
            self.note(at, m, beats, 'pad', vel, -.5 + j / max(1, len(notes) - 1), wet=.5, human=False)

    def arp(self, at, chord, bars_beats, vel, pattern=(0, 2, 3, 1, 2, 3, 1, 2), step=.5, pan=.15):
        for i in range(int(bars_beats / step)):
            self.note(at + i * step, chord[pattern[i % len(pattern)]], step * 1.6, 'epiano',
                      vel * (1.15 if i % 4 == 0 else 1), pan * (1 if i % 2 else -1), wet=.4)

    # --- room and master ---------------------------------------------------
    def room(self, rt=(2.6, 2.0, .9), predelay=.022):
        L = int(3.2 * SR); t = np.arange(L) / SR
        fr = np.fft.rfftfreq(L, 1 / SR)
        ir = np.zeros((self.n, 2))
        for ch in range(2):
            spec = np.fft.rfft(self.rng.normal(0, 1, L))
            band = [(fr < 400), (fr >= 400) & (fr < 3500), (fr >= 3500)]
            out = np.zeros(L)
            for mask, r in zip(band, rt):
                out += np.fft.irfft(spec * mask, L) * np.exp(-6.9 * t / r)
            out *= np.minimum(1, t / .015)
            d = int(predelay * SR) + ch * 37
            ir[d:d + L, ch] = out[: self.n - d]
        ir /= np.sqrt((ir ** 2).sum(axis=0))
        # circular convolution keeps the loop seamless
        wet = np.fft.irfft(np.fft.rfft(self.send, axis=0) * np.fft.rfft(ir, axis=0), self.n, axis=0)
        return wet

    def master(self, name, title, mode, target=-17.0, provenance=''):
        y = self.dry + self.room() * .9
        y -= y.mean(axis=0)
        y *= .3 / max(abs(y).max(), 1e-9)
        SOURCE.mkdir(parents=True, exist_ok=True); OUT.mkdir(parents=True, exist_ok=True)
        ogg = OUT / f'{name}.ogg'
        with tempfile.TemporaryDirectory() as tmp:
            wav = Path(tmp) / 'm.wav'
            def write(sig):
                with wave.open(str(wav), 'wb') as w:
                    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
                    w.writeframes(np.rint(np.clip(sig, -1, 1) * 32767).astype('<i2').tobytes())
            for _ in range(3):                      # measure, set gain, soft-limit peaks, re-measure
                write(y); i, _tp = lufs(wav)
                y *= 10 ** ((target - i) / 20)
                ceil = 10 ** (-1.5 / 20)
                y = np.where(abs(y) > ceil * .8, np.sign(y) * (ceil * .8 + ceil * .2 * np.tanh((abs(y) - ceil * .8) / (ceil * .2))), y)
            write(y)
            for path, args in [(SOURCE / f'{name}-master.flac', ['-c:a', 'flac']),
                               (ogg, ['-c:a', 'libvorbis', '-q:a', '5'])]:
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(wav), *args, str(path)], check=True)
        dec = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(ogg), '-f', 'f32le', '-ac', '2',
                                                     '-ar', str(SR), '-']), dtype='<f4').reshape(-1, 2)
        mono = dec.mean(axis=1); S = np.abs(np.fft.rfft(mono)) ** 2; fr = np.fft.rfftfreq(len(mono), 1 / SR)
        bands = {f'{a}-{b}Hz': round(float(S[(fr >= a) & (fr < b)].sum() / S.sum()), 3)
                 for a, b in [(0, 200), (200, 800), (800, 3000), (3000, 20000)]}
        i, tp = lufs(ogg)
        metrics = {'cue': name, 'revision': 2, 'duration_seconds': round(len(dec) / SR, 3),
                   'integrated_lufs': i, 'true_peak_dbfs': tp, 'peak': round(float(abs(dec).max()), 4),
                   'rms': round(float(np.sqrt(np.mean(dec ** 2))), 4), 'energy_bands': bands,
                   'loop_boundary_step': round(float(abs(dec[0] - dec[-1]).max()), 4),
                   'clipped_samples': int((abs(dec) >= 1).sum()), 'bytes': ogg.stat().st_size,
                   'sha256': hashlib.sha256(ogg.read_bytes()).hexdigest(),
                   'human_listening': False, 'commercial_ready': False}
        (SOURCE / f'{name}-score.json').write_text(json.dumps(
            {'title': title, 'revision': 2, 'bpm': self.bpm, 'bars': self.bars, 'mode': mode,
             'events': self.events, 'provenance': provenance}, indent=1) + '\n')
        (SOURCE / f'{name}-metrics.json').write_text(json.dumps(metrics, indent=2) + '\n')
        return metrics


PROV = ('Authored score and deterministic synthesis (FM, additive band-limited saws, synthetic convolution room) in '
        'tools/compose_leitmotifs_v10_3.py; no external samples, recordings, providers or artist imitation. '
        'Human listening and final mix approval pending.')

# chords as (bass root, pad voicing, arpeggio tones)
DM = (38, [57, 62, 65, 69], [50, 57, 62, 65]); BB = (34, [58, 62, 65, 69], [46, 53, 58, 62])
F_ = (41, [57, 60, 65, 69], [53, 57, 60, 65]); C_ = (36, [55, 60, 64, 67], [48, 55, 60, 64])
GM = (43, [55, 58, 62, 67], [55, 58, 62, 67]); A_ = (33, [57, 61, 64, 69], [45, 52, 57, 61])
ASUS = (33, [57, 62, 64, 69], [45, 52, 57, 62])


def refuge():
    """Hubs, home, Moon Refuge, Cathedral: a place to come back to. Motifs only as warm fragments."""
    s = Score(bpm=80, bars=16, seed=2031)
    prog = [DM, BB, F_, C_, DM, BB, F_, C_, GM, BB, F_, A_, DM, BB, C_, A_]
    density = [.55, .6, .65, .7, .8, .85, .9, .9, 1, 1, 1, 1, .8, .7, .6, .55]   # arc, low at the seam
    for bar, (root, voicing, tones) in enumerate(prog):
        at, d = bar * 4, density[bar]
        s.pad(at, voicing, 4.1, .05 * d)
        s.note(at, root, 2.6, 'bass', 0.110 * d, 0, wet=.15)
        s.note(at + 2.5, root + 7 if root < 40 else root - 5, 1.3, 'bass', 0.060 * d, 0, wet=.15)
        if bar >= 1:
            s.arp(at, tones, 4, .065 * d)
        s.note(at + 1, 84, .05, 'tick', .03, -.4); s.note(at + 3, 84, .05, 'tick', .03, .4)
    s.motif(6, LULU, 'bell', 0.208, .3, shift=12)                        # bar 2: Lulù, far and high
    s.motif(22, NOX, 'epiano', 0.286, -.25, shift=12)                     # bar 6: Nox answers
    s.motif(26, NOX_TAIL, 'epiano', 0.234, -.25, shift=12)
    s.motif(36, NOX, 'epiano', 0.260, -.3, shift=12)                       # bars 9-12: together, overlapping
    s.motif(37, LULU, 'bell', 0.195, .35, shift=12)
    s.motif(42, LULU_TAIL[:1], 'bell', 0.169, .35, shift=12)              # ... and the answer stays open (A chord)
    s.motif(52, [(0, 69, 1), (1, 67, 1), (2, 65, 1.5), (3.5, 64, .5), (4, 62, 3)], 'epiano', .21, .1)  # homeward line
    return s.master('refuge_theme', 'Un posto dove tornare', 'D minor/dorian, Dm-Bb-F-C | Gm-Bb-F-A | Dm-Bb-C-A',
                    -17.0, PROV)


def promise():
    """Rooftop and the promise: the two motifs answer each other and stop unresolved on Asus4."""
    s = Score(bpm=72, bars=16, seed=2032)
    prog = [DM, BB, GM, ASUS] * 4
    for bar, (root, voicing, tones) in enumerate(prog):
        at = bar * 4; d = .6 if bar < 4 else .8 if bar < 8 else 1 if bar < 12 else .7
        s.pad(at, voicing, 4.2, .045 * d)
        s.note(at, root, 3.6, 'bass', 0.085 * d, 0, wet=.2)
        if 4 <= bar < 12:
            s.arp(at, tones, 4, .045 * d, pattern=(0, 2, 1, 3), step=1)
    for k in range(64):                                                  # the Vortex clock, one tick per beat
        s.note(k, 84, .04, 'tick', .022 + .01 * (k % 4 == 0), -.2 if k % 2 else .2, wet=.25)
    s.motif(4, NOX, 'epiano', 0.312, -.25, shift=12)
    s.motif(12, LULU, 'bell', 0.195, .3, shift=12)
    s.motif(20, NOX, 'epiano', 0.286, -.25, shift=12)
    s.motif(24, LULU, 'bell', 0.182, .3, shift=12)
    s.motif(36, NOX, 'epiano', 0.286, -.2, shift=12, scale=.5)             # closer now: they overlap
    s.motif(37, LULU, 'bell', 0.169, .25, shift=12, scale=.5)
    s.motif(44, NOX_TAIL, 'epiano', 0.260, -.2, shift=12)
    s.motif(48, LULU_TAIL[:1], 'bell', 0.182, .25, shift=12)               # E asks ... and G never comes
    s.note(56, 74, 6, 'epiano', .17, 0)                                  # D5 alone over Asus4: open
    return s.master('promise_theme', 'Prima del clinico', 'D minor, Dm-Bb-Gm-Asus4, unresolved', -17.0, PROV)


if __name__ == '__main__':
    print(json.dumps([refuge(), promise()], indent=1))
