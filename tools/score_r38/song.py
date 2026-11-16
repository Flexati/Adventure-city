"""R38: a small score engine. Chords, voicings with voice leading, arpeggios, bass lines, drum grooves, melodies and a
harmony check, all written into stereo buses of one seamless loop."""
import numpy as np
from . import dsp
from .dsp import SR

PC = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
QUAL = {'': (0, 4, 7), 'm': (0, 3, 7), '7': (0, 4, 7, 10), 'm7': (0, 3, 7, 10), 'maj7': (0, 4, 7, 11), 'sus4': (0, 5, 7),
        'sus2': (0, 2, 7), 'dim': (0, 3, 6), 'aug': (0, 4, 8), 'add9': (0, 4, 7, 14), 'madd9': (0, 3, 7, 14), 'm9': (0, 3, 7, 10, 14),
        '5': (0, 7), 'm6': (0, 3, 7, 9), '6': (0, 4, 7, 9), '7sus4': (0, 5, 7, 10), 'maj9': (0, 4, 7, 11, 14), '7b9': (0, 4, 7, 10, 13)}


def m(name):
    """'D3' -> 50, 'Bb4' -> 70, 'C#5' -> 73; ints pass through."""
    if isinstance(name, (int, np.integer)):
        return int(name)
    p = PC[name[0]]
    i = 1
    while i < len(name) and name[i] in '#b':
        p += 1 if name[i] == '#' else -1
        i += 1
    return 12 * (int(name[i:]) + 1) + p


def parse_chord(sym):
    """'Dm7' -> (root pc, intervals, bass pc); slash chords 'C/E'."""
    bass = None
    if '/' in sym:
        sym, b = sym.split('/')
        bass = m(b + '0') % 12
    i = 1
    root = PC[sym[0]]
    while i < len(sym) and sym[i] in '#b':
        root += 1 if sym[i] == '#' else -1
        i += 1
    q = QUAL[sym[i:]]
    root %= 12
    return root, q, root if bass is None else bass


def chord_pcs(sym):
    r, q, _ = parse_chord(sym)
    return {(r + x) % 12 for x in q}


class Song:
    BUSES = ('drums', 'perc', 'bass', 'pad', 'keys', 'lead', 'fx')

    def __init__(self, name, bpm, bars, seed, meter=4, swing=0.0):
        self.name, self.bpm, self.bars, self.meter = name, bpm, bars, meter
        self.beat = 60.0 / bpm
        self.n = int(round(SR * bars * meter * self.beat))
        self.bus = {k: np.zeros((self.n, 2), np.float32) for k in self.BUSES}
        self.room = {}  # per bus, so the reverb follows the balance of its part
        self.echo = {}
        self.rng = np.random.default_rng(seed)
        self.events = []
        self.kicks = []
        self.chords = {}
        self.memory = {}
        self.swing = swing
        self.cache = {}
        self.sections = []

    # ------------------------------------------------------------------ placement
    def sample(self, beat):
        b = beat
        if self.swing:
            frac = (b * 2) % 2
            if abs(frac - 1) < 1e-6:
                b += self.swing * .5
        return int(round(b * self.beat * SR))

    def add(self, sig, beat, bus, pan=0.0, room=0.0, echo=0.0, vel=1.0, jitter=.004):
        if sig.ndim == 1:
            l, r = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
            st = np.stack([sig * l, sig * r], axis=1) * np.sqrt(2)
        else:
            st = sig.copy()
            if pan:
                st[:, 0] *= np.sqrt(1 - pan)
                st[:, 1] *= np.sqrt(1 + pan)
        st *= vel
        start = (self.sample(beat) + (int(self.rng.normal(0, jitter) * SR) if jitter else 0)) % self.n
        L = len(st)
        for kind, g in (('dry', 1.0), ('room', room), ('echo', echo)):
            if not g:
                continue
            buf = self.bus[bus] if kind == 'dry' else getattr(self, kind).setdefault(bus, np.zeros((self.n, 2), np.float32))
            k = 0
            while k < L:
                s = (start + k) % self.n
                c = min(L - k, self.n - s)
                buf[s:s + c] += st[k:k + c] * g
                k += c

    def play(self, inst, beat, note, beats, vel=.8, bus='keys', pan=0.0, room=.2, echo=0.0, human=True, **kw):
        midi = m(note)
        v = vel * (self.rng.uniform(.92, 1.06) if human else 1)
        sig = INSTR[inst](float(dsp.hz(midi)), beats * self.beat, self.rng, **kw)
        self.add(sig, beat, bus, pan, room, echo, v, .004 if human else 0)
        self.events.append((round(beat, 4), midi, round(beats, 4), inst, bus, round(v, 3)))

    def hit(self, kind, beat, vel=.8, bus='drums', pan=0.0, room=.08, echo=0.0, variants=4, **kw):
        key = (kind, tuple(sorted(kw.items())))
        if key not in self.cache:
            self.cache[key] = [DRUMS[kind](self.rng, **kw) for _ in range(variants)]
        sig = self.cache[key][int(self.rng.integers(len(self.cache[key])))]
        self.add(sig, beat, bus, pan, room, echo, vel * self.rng.uniform(.9, 1.05), .002)
        if kind in ('kick', 'taiko'):
            self.kicks.append(beat)

    def section(self, name, bar0, bars):
        self.sections.append((name, bar0, bars))

    # ------------------------------------------------------------------ harmony
    def progression(self, bar0, syms, per_bar=1):
        """Store chords: per_bar chords per bar, evenly spaced; '-' repeats the previous chord."""
        prev = None
        for i, s in enumerate(syms):
            if s == '-':
                s = prev
            bar = bar0 + i // per_bar
            beat_in = (i % per_bar) * self.meter / per_bar
            self.chords.setdefault(bar, []).append((beat_in, s))
            prev = s

    def chord_at(self, beat):
        bar = int(beat // self.meter) % self.bars
        inbar = beat - (beat // self.meter) * self.meter
        best = None
        for b in range(bar, bar - self.bars, -1):
            for at, s in reversed(self.chords.get(b % self.bars, [])):
                if b < bar or at <= inbar + 1e-6:
                    best = s
                    break
            if best:
                break
        return best

    def changes(self, bar0, bars):
        out = []
        for b in range(bar0, bar0 + bars):
            for at, s in self.chords.get(b % self.bars, []):
                out.append((b * self.meter + at, s))
        return out

    def voicing(self, sym, key, center=62, voices=4, spread=False):
        r, q, _ = parse_chord(sym)
        pcs = [(r + x) % 12 for x in q][:max(voices, 3)]
        cands = []
        for lo in range(center - 9, center + 4):
            notes = []
            for pc in pcs:
                n = lo + ((pc - lo) % 12)
                notes.append(n)
            notes.sort()
            while len(notes) < voices:
                notes.append(notes[len(notes) - len(pcs)] + 12)
            if spread:
                notes[1] += 12
                notes.sort()
            cands.append(notes[:voices])
        prev = self.memory.get(key)
        if prev is None or len(prev) != voices:
            best = min(cands, key=lambda c: abs(np.mean(c) - center))
        else:
            best = min(cands, key=lambda c: sum(abs(a - b) for a, b in zip(c, prev)) + .3 * abs(np.mean(c) - center))
        self.memory[key] = best
        return best

    # ------------------------------------------------------------------ layers
    def pad(self, bar0, bars, inst='strings', vel=.5, center=60, voices=4, bus='pad', room=.45, low_root=False, spread=False, **kw):
        ch = self.changes(bar0, bars)
        end = (bar0 + bars) * self.meter
        for i, (at, sym) in enumerate(ch):
            nxt = ch[i + 1][0] if i + 1 < len(ch) else end
            vs = self.voicing(sym, inst + str(center), center, voices, spread)
            for j, note in enumerate(vs):
                self.play(inst, at, note, nxt - at, vel, bus, pan=(j / max(1, len(vs) - 1) - .5) * .6, room=room, human=False, **kw)
            if low_root:
                r, _, b = parse_chord(sym)
                root = 36 + ((b - 36) % 12) + 12
                self.play(inst, at, root, nxt - at, vel * .8, bus, 0, room, human=False, **kw)

    def arp(self, bar0, bars, inst='pluck', rate=.5, pattern=(0, 1, 2, 3, 2, 1), center=64, vel=.5, bus='keys', room=.3, echo=0.0,
            accent=(1.2, 1.0), pan_sweep=.35, gate=1.5, skip=(), **kw):
        total = int(bars * self.meter / rate)
        for i in range(total):
            beat = bar0 * self.meter + i * rate
            if (i % len(pattern)) in skip:
                continue
            sym = self.chord_at(beat)
            vs = self.voicing(sym, 'arp' + inst + str(center), center, 4)
            idx = pattern[i % len(pattern)]
            note = vs[idx % len(vs)] + 12 * (idx // len(vs))
            a = accent[0] if (i * rate) % 1 < 1e-6 else accent[1]
            self.play(inst, beat, note, rate * gate, vel * a, bus, pan=pan_sweep * np.sin(i * .7), room=room, echo=echo, **kw)

    def bassline(self, bar0, bars, rhythm=((0, 1.5), (1.5, .5), (2, 2)), inst='bass', octave=2, vel=.8, bus='bass', degrees=None, **kw):
        for b in range(bar0, bar0 + bars):
            for k, (at, dur) in enumerate(rhythm):
                beat = b * self.meter + at
                sym = self.chord_at(beat)
                r, q, bass_pc = parse_chord(sym)
                deg = degrees[k % len(degrees)] if degrees else 0
                pc = bass_pc if deg in (0, 8) else (r + {5: 7, 3: q[1] if len(q) > 1 else 4, 7: 10}[deg]) % 12
                lo = 12 * (octave + 1) + 2
                note = lo + ((pc - lo) % 12) + (12 if deg == 8 else 0)
                self.play(inst, beat, note, dur, vel, bus, 0, room=.04, human=True, **kw)

    def groove(self, bar0, bars, style, intensity=1.0, fill=True, crash_first=False, bus='drums'):
        """Drum grooves on a 16-step grid. Steps are (step, kind, vel)."""
        g = GROOVES[style]
        for b in range(bar0, bar0 + bars):
            last = fill and b == bar0 + bars - 1
            steps = g['fill'] if last and 'fill' in g else (g['alt'] if (b - bar0) % 2 == 1 and 'alt' in g else g['main'])
            for step, kind, v, *kw in steps:
                if v * intensity < .12 and kind in ('hat', 'shaker', 'rim'):
                    continue
                if kind in ('hat', 'ohat', 'shaker') and intensity < .5 and step % 2 == 1:
                    continue
                opts = dict(kw[0]) if kw else {}
                drum = {'ohat': 'hat'}.get(kind, kind)
                if kind == 'ohat':
                    opts['open_'] = True
                pan = {'hat': .28, 'ohat': .3, 'shaker': -.35, 'rim': -.2, 'tom': -.25, 'clap': .05}.get(kind, 0)
                self.hit(drum, b * self.meter + step / 4, v * (.55 + .45 * intensity), bus, pan, room=.1 if kind in ('snare', 'clap', 'tom') else .04, **opts)
            if crash_first and b == bar0:
                self.hit('crash', b * self.meter, .7, bus, .2, room=.15, variants=2)

    def melody(self, bar0, notes, inst='lead', vel=.7, bus='lead', pan=0.0, room=.3, echo=0.0, shift=0, **kw):
        for item in notes:
            at, note, dur = item[:3]
            vm = item[3] if len(item) > 3 else 1.0
            if note is None:
                continue
            self.play(inst, bar0 * self.meter + at, m(note) + shift, dur, vel * vm, bus, pan, room, echo, **kw)

    def tick(self, bar0, bars, every=1.0, vel=.35, pitch=2400.0, accent_every=4):
        for i in range(int(bars * self.meter / every)):
            beat = bar0 * self.meter + i * every
            a = 1.25 if i % accent_every == 0 else .85
            self.hit('tick', beat, vel * a, 'perc', pan=.4 * (1 if i % 2 else -1), room=.15, pitch=pitch, variants=1)

    def riser(self, bar_end, beats=4, vel=.5):
        sig = dsp.fx_riser(self.rng, beats * self.beat)
        self.add(sig * .7, bar_end * self.meter - beats, 'fx', 0, .25, 0, vel, 0)

    def impact(self, bar, vel=.7):
        self.hit('impact', bar * self.meter, vel, 'fx', 0, room=.3, variants=1)

    # ------------------------------------------------------------------ checks
    def harmony_report(self, buses=('lead',), allow=()):
        """Long notes on strong beats of melodic buses must be chord tones or a 9th/sus of the chord under them."""
        clashes = []
        for beat, midi, dur, inst, bus, v in self.events:
            if bus not in buses or dur < .99:
                continue
            if (beat % 2) > 1e-6:
                continue
            sym = self.chord_at(beat)
            r, q, _ = parse_chord(sym)
            pcs = chord_pcs(sym)
            # chord tones, the 9th, the 11th over a minor chord, the 6th over a major one, the major 7th over a major chord and the
            # minor 7th over a minor or a dominant chord (Gm7, A7): all consonant; anything else on a strong beat is a clash.
            ok = pcs | {(r + 2) % 12, (r + 5) % 12 if 3 in q else None, (r + 9) % 12 if 4 in q else None, (r + 11) % 12 if 4 in q and 10 not in q else None,
                        (r + 10) % 12 if 3 in q else None}
            if midi % 12 not in ok and (beat, midi) not in allow:
                clashes.append({'beat': beat, 'note': midi, 'chord': sym})
        return clashes


INSTR = {'strings': dsp.inst_strings, 'spiccato': dsp.inst_spiccato, 'brass': dsp.inst_brass, 'choir': dsp.inst_choir,
         'piano': dsp.inst_piano, 'epiano': dsp.inst_epiano, 'bell': dsp.inst_bell, 'glass': dsp.inst_glass, 'mallet': dsp.inst_mallet,
         'pluck': dsp.inst_pluck, 'synthpluck': dsp.inst_synthpluck, 'lead': dsp.inst_lead, 'organ': dsp.inst_organ, 'bass': dsp.inst_bass,
         'sub': dsp.inst_sub, 'reese': dsp.inst_reese}
DRUMS = {'kick': dsp.drum_kick, 'snare': dsp.drum_snare, 'clap': dsp.drum_clap, 'hat': dsp.drum_hat, 'shaker': dsp.drum_shaker,
         'rim': dsp.drum_rim, 'tom': dsp.drum_tom, 'crash': dsp.drum_crash, 'taiko': dsp.drum_taiko, 'timpani': dsp.drum_timpani,
         'tick': dsp.fx_tick, 'impact': dsp.fx_impact}


def _hats(v=.5, every=2, start=0, kind='hat', acc=1.25):
    return [(s, kind, v * (acc if s % 4 == 0 else 1)) for s in range(start, 16, every)]


GROOVES = {
    # half-time: kick 1 and the "and" of 2, snare on 3
    'halftime': {'main': [(0, 'kick', .95), (6, 'kick', .6), (10, 'kick', .5), (8, 'snare', .85)] + _hats(.4),
                 'alt': [(0, 'kick', .95), (7, 'kick', .55), (8, 'snare', .85), (14, 'snare', .25)] + _hats(.4),
                 'fill': [(0, 'kick', .9), (8, 'snare', .8), (12, 'tom', .6, {'f': 140.0}), (13, 'tom', .6, {'f': 120.0}), (14, 'tom', .7, {'f': 100.0}), (15, 'tom', .75, {'f': 85.0})] + _hats(.35)},
    'pop': {'main': [(0, 'kick', .95), (8, 'kick', .8), (10, 'kick', .45), (4, 'snare', .85), (12, 'snare', .85)] + _hats(.42),
            'alt': [(0, 'kick', .95), (7, 'kick', .5), (8, 'kick', .75), (4, 'snare', .85), (12, 'snare', .85), (15, 'snare', .2)] + _hats(.42),
            'fill': [(0, 'kick', .95), (4, 'snare', .85), (8, 'kick', .8), (12, 'snare', .7), (13, 'snare', .5), (14, 'snare', .65), (15, 'snare', .8)] + _hats(.4)[:4]},
    'four': {'main': [(s, 'kick', .95) for s in (0, 4, 8, 12)] + [(4, 'clap', .8), (12, 'clap', .8)] + _hats(.5, 4, 2, 'ohat', 1) + _hats(.25, 1),
             'fill': [(s, 'kick', .95) for s in (0, 4, 8, 12)] + [(4, 'clap', .8), (12, 'snare', .7), (13, 'snare', .6), (14, 'snare', .75), (15, 'snare', .85)] + _hats(.25, 1)[:10]},
    'break': {'main': [(0, 'kick', .95), (6, 'kick', .55), (10, 'kick', .75), (4, 'snare', .9), (12, 'snare', .9), (7, 'snare', .18), (15, 'snare', .2)] + _hats(.32, 1),
              'alt': [(0, 'kick', .95), (3, 'kick', .45), (10, 'kick', .7), (11, 'kick', .4), (4, 'snare', .9), (12, 'snare', .9), (9, 'snare', .18)] + _hats(.32, 1),
              'fill': [(0, 'kick', .95), (4, 'snare', .9), (6, 'kick', .5), (8, 'tom', .7, {'f': 150.0}), (10, 'tom', .7, {'f': 120.0}), (12, 'snare', .8), (13, 'snare', .6), (14, 'tom', .8, {'f': 95.0}), (15, 'tom', .85, {'f': 80.0})] + _hats(.3, 2)},
    'drive': {'main': [(s, 'kick', .9) for s in (0, 4, 8, 12)] + [(4, 'snare', .85), (12, 'snare', .85)] + _hats(.45, 4, 2, 'ohat', 1) + _hats(.22, 1),
              'alt': [(s, 'kick', .9) for s in (0, 4, 8, 12)] + [(4, 'snare', .85), (12, 'snare', .85), (14, 'snare', .25)] + _hats(.45, 4, 2, 'ohat', 1) + _hats(.22, 1),
              'fill': [(s, 'kick', .9) for s in (0, 4, 8)] + [(4, 'snare', .85), (10, 'snare', .5), (11, 'snare', .6), (12, 'snare', .7), (13, 'snare', .75), (14, 'snare', .8), (15, 'snare', .9)] + _hats(.22, 1)[:8]},
    'taiko': {'main': [(0, 'taiko', 1.0), (3, 'taiko', .55, {'f': 80.0}), (6, 'taiko', .7), (8, 'taiko', .9, {'f': 80.0}), (11, 'taiko', .5), (12, 'snare', .7), (14, 'taiko', .65, {'f': 90.0})] + _hats(.25, 2),
              'alt': [(0, 'taiko', 1.0), (4, 'taiko', .6, {'f': 80.0}), (8, 'taiko', .9), (10, 'taiko', .55, {'f': 90.0}), (12, 'snare', .7), (13, 'taiko', .5), (15, 'taiko', .6, {'f': 80.0})] + _hats(.25, 2),
              'fill': [(0, 'taiko', 1.0), (4, 'taiko', .8), (8, 'taiko', .85, {'f': 80.0}), (10, 'taiko', .85, {'f': 80.0}), (12, 'taiko', .9, {'f': 90.0}), (13, 'taiko', .9, {'f': 90.0}), (14, 'taiko', 1.0), (15, 'taiko', 1.0)]},
    'march': {'main': [(0, 'kick', .9), (8, 'kick', .8), (4, 'snare', .8), (12, 'snare', .8), (6, 'snare', .3), (7, 'snare', .35), (14, 'snare', .3), (15, 'snare', .4)] + _hats(.25, 2),
              'fill': [(0, 'kick', .9), (8, 'kick', .8)] + [(s, 'snare', .3 + .04 * s) for s in range(4, 16)]},
    'pulse': {'main': [(0, 'kick', .7), (8, 'kick', .45), (4, 'rim', .5), (12, 'rim', .5)] + _hats(.3, 2, 0, 'shaker'),
              'alt': [(0, 'kick', .7), (10, 'kick', .4), (4, 'rim', .5), (12, 'rim', .5), (14, 'rim', .25)] + _hats(.3, 2, 0, 'shaker')},
    'soft': {'main': [(0, 'kick', .55), (10, 'kick', .3), (8, 'rim', .4)] + _hats(.22, 2, 0, 'shaker'),
             'alt': [(0, 'kick', .55), (7, 'kick', .25), (8, 'rim', .4), (14, 'rim', .18)] + _hats(.22, 2, 0, 'shaker')},
}
