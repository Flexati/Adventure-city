"""V10.3 leitmotif cues: refuge_theme and promise_theme.

Original authored score; deterministic additive synthesis, no provider, samples,
recordings or artist imitation. Human listening and final mix approval pending.

Motifs (shared with the plan docs/gold/AUDIO_PLAN_V10_3.md):
  NOX   D minor, low register, long-short-short, falls and lands: D F A G | F D
  LULU  high register, rises and leans forward:            A C E D | E G
  PROMISE  the two motifs answer each other and stop on a suspended chord,
           never resolving. Only the reunion is allowed to resolve it.
"""
from pathlib import Path
import numpy as np, json, wave, subprocess, tempfile, hashlib

ROOT = Path(__file__).resolve().parents[1]
SR = 44100
SOURCE = ROOT / 'assets/production/v10.3/audio'
OUT = ROOT / 'game/audio/v10'
NOX = [(0, 50, 1.5), (1.5, 53, .5), (2, 57, 1), (3, 55, 1)]          # D3 F3 A3 G3
NOX_TAIL = [(0, 53, 1), (1, 50, 3)]                                  # F3 D3
LULU = [(0, 69, .5), (.5, 72, .5), (1, 76, 1), (2, 74, 2)]           # A4 C5 E5 D5
LULU_TAIL = [(0, 76, 1), (1, 79, 3)]                                  # E5 G5


class Score:
    def __init__(self, bpm, bars, seed):
        self.bpm, self.bars = bpm, bars
        self.beat = 60 / bpm
        self.n = int(round(SR * bars * 4 * self.beat))
        self.y = np.zeros((self.n, 2))
        self.rng = np.random.default_rng(seed)
        self.events = []

    def note(self, beat, midi, beats, voice, vel, pan=0.0):
        start = int(beat * self.beat * SR)
        dur = beats * self.beat
        tail = {'pad': 1.2, 'piano': 1.6, 'bell': 2.4}.get(voice, .2)
        n = int((dur + tail) * SR)
        t = np.arange(n) / SR
        f = 440 * 2 ** ((midi - 69) / 12)
        if voice == 'piano':
            sig = sum(a * np.sin(2 * np.pi * f * k * 1.0007 ** (k - 1) * t) * np.exp(-t * (1.6 + k * .9))
                      for k, a in [(1, 1), (2, .42), (3, .2), (4, .09), (5, .04)])
            env = np.minimum(1, t / .006)
        elif voice == 'bell':
            sig = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 2)
                   + .18 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 4)) * np.exp(-t * 1.1)
            env = np.minimum(1, t / .004)
        elif voice == 'pad':
            sig = (np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 1.003 * t)
                   + .12 * np.sin(2 * np.pi * f * 2.002 * t))
            env = np.minimum(1, t / .9) * np.clip((dur + tail - t) / tail, 0, 1)
        elif voice == 'bass':
            sig = (np.sin(2 * np.pi * f * t) + .15 * np.sin(2 * np.pi * f * 2 * t)) * np.exp(-t * .6)
            env = np.minimum(1, t / .02) * np.clip((dur + .2 - t) / .2, 0, 1)
        else:  # tick: the clock of the Vortex, a soft wooden click
            sig = self.rng.normal(0, .25, n) * np.exp(-t * 90) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 140) * .3
            env = 1
        sig = sig * env * vel
        idx = (start + np.arange(n)) % self.n          # wrap: the loop is seamless by construction
        np.add.at(self.y[:, 0], idx, sig * np.sqrt((1 - pan) / 2))
        np.add.at(self.y[:, 1], idx, sig * np.sqrt((1 + pan) / 2))
        self.events.append(dict(beat=beat, midi=midi, beats=beats, voice=voice, velocity=vel, pan=pan))

    def motif(self, at, motif, voice, vel, pan=0.0, shift=0, scale=1.0):
        for b, m, d in motif:
            self.note(at + b * scale, m + shift, d * scale, voice, vel, pan)

    def chord(self, at, notes, beats, vel=.03):
        for j, m in enumerate(notes):
            self.note(at, m, beats, 'pad', vel, -.45 + .3 * j)

    def master(self, name, title, mode, provenance, level=.34):
        y = self.y - self.y.mean(axis=0)
        # gentle stereo reverb tail via two feedback-free taps, wrapped to keep the seam
        for delay, gain, side in [(.083, .22, 1), (.131, .18, 0), (.211, .12, 1)]:
            y[:, side] += np.roll(y[:, 1 - side], int(delay * SR)) * gain
        y *= level / max(abs(y).max(), 1e-9)   # level chosen so calm cues sit near -17 LUFS, action cues at about -15
        pcm = np.rint(y * 32767).astype('<i2')
        SOURCE.mkdir(parents=True, exist_ok=True)
        OUT.mkdir(parents=True, exist_ok=True)
        ogg = OUT / f'{name}.ogg'
        with tempfile.NamedTemporaryFile(suffix='.wav') as f:
            with wave.open(f.name, 'wb') as w:
                w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
            for path, args in [(SOURCE / f'{name}-master.flac', ['-c:a', 'flac']),
                               (ogg, ['-c:a', 'libvorbis', '-q:a', '4'])]:
                subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f.name, *args, str(path)], check=True)
        dec = np.frombuffer(subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(ogg), '-f', 'f32le', '-ac', '2',
                                                     '-ar', str(SR), '-']), dtype='<f4').reshape(-1, 2)
        metrics = {'cue': name, 'duration_seconds': round(len(dec) / SR, 3), 'peak': round(float(abs(dec).max()), 4),
                   'rms': round(float(np.sqrt(np.mean(dec ** 2))), 4),
                   'loop_boundary_step': round(float(abs(dec[0] - dec[-1]).max()), 4),
                   'clipped_samples': int((abs(dec) >= 1).sum()), 'bytes': ogg.stat().st_size,
                   'sha256': hashlib.sha256(ogg.read_bytes()).hexdigest(),
                   'human_listening': False, 'commercial_ready': False}
        (SOURCE / f'{name}-score.json').write_text(json.dumps(
            {'title': title, 'bpm': self.bpm, 'bars': self.bars, 'mode': mode, 'events': self.events,
             'provenance': provenance}, indent=1) + '\n')
        (SOURCE / f'{name}-metrics.json').write_text(json.dumps(metrics, indent=2) + '\n')
        return metrics


PROV = ('Authored score and deterministic additive synthesis in tools/compose_leitmotifs_v10_3.py; '
        'no external samples, recordings, providers or artist imitation. Human listening and final mix approval pending.')


def refuge():
    """Hubs, home, Moon Refuge, Cathedral: warm and safe, the motifs only as fragments."""
    s = Score(bpm=80, bars=16, seed=1031)
    chords = [[50, 57, 62, 65], [46, 53, 62, 65], [48, 55, 60, 64], [45, 52, 61, 64]]   # Dm Bb C A
    roots = [38, 34, 36, 33]
    for bar in range(16):
        at = bar * 4
        s.chord(at, chords[bar % 4], 4.2, .028)
        s.note(at, roots[bar % 4], 3.5, 'bass', .13)
        for off in (1, 3):
            s.note(at + off, 60, .1, 'tick', .02, -.3 if off == 1 else .3)
    for phrase in range(4):
        at = phrase * 16
        if phrase % 2 == 0:
            s.motif(at + 4, LULU, 'bell', .07, .25, shift=12 if phrase == 2 else 0)
        else:
            s.motif(at + 4, NOX, 'piano', .12, -.2, shift=12)
        s.motif(at + 10, [(0, 69, 1), (1, 67, 1), (2, 65, 2)], 'piano', .07, .1)
    return s.master('refuge_theme', 'Un posto dove tornare', 'D dorian / minor, Dm-Bb-C-A', PROV, level=.60)


def promise():
    """Rooftop and the promise: the two motifs answer each other and stop unresolved (Dsus4)."""
    s = Score(bpm=72, bars=16, seed=1032)
    chords = [[50, 57, 62, 65], [46, 53, 58, 62], [43, 50, 58, 62], [45, 50, 55, 57]]   # Dm Bb Gm Asus4 (left open)
    roots = [38, 34, 31, 33]
    for bar in range(16):
        at = bar * 4
        s.chord(at, chords[bar % 4], 4.4, .026 if bar < 8 else .032)
        s.note(at, roots[bar % 4], 3.8, 'bass', .11)
    for k in range(64):                         # the clock of the Vortex, one tick per beat, slightly alive
        s.note(k, 60, .08, 'tick', .014 + .006 * (k % 4 == 0), -.15 if k % 2 else .15)
    s.motif(4, NOX, 'piano', .13, -.25)
    s.motif(12, LULU, 'bell', .07, .3)
    s.motif(20, NOX, 'piano', .12, -.25, shift=12)
    s.motif(24, LULU, 'bell', .065, .3)
    s.motif(36, NOX, 'piano', .12, -.2, shift=12, scale=.5)       # closer now: they overlap
    s.motif(37, LULU, 'bell', .06, .25, scale=.5)
    s.motif(44, NOX_TAIL, 'piano', .1, -.2, shift=12)
    s.motif(48, LULU_TAIL[:1], 'bell', .06, .25)                    # E5 asks ... and G5 never comes
    s.note(56, 62, 6, 'piano', .07, 0)                                # D4 alone over Asus4: open, unanswered
    return s.master('promise_theme', 'Prima del clinico', 'D minor, Dm-Bb-Gm-Asus4, unresolved', PROV, level=.76)


if __name__ == '__main__':
    print(json.dumps([refuge(), promise()], indent=1))
