"""R38 (D74): the fifteen pieces of the new score. Original material; the four motifs come from AUDIO_PLAN_V10_3.md.

  NOX      Re3 Fa3 La3 Sol3 · Fa3 Re3 (long-short-short, falls and lands), D minor
  LULU     La4 Do5 Mi5 Re5 · Mi5 Sol5 (rises, leans forward)
  PROMISE  NOX answered by LULU, stopping on A sus4; it resolves only in `reunion` (the 4th falls to the 3rd, D major)
  EVE      glass fifths, Mi Si La Mi, over the 60-per-minute tick of the menu clock
  ARCHON   new in R38: Re Mib Re · Lab (a semitone that leans, then a tritone that falls), over a D pedal
Each function writes one loop into a Song; SPEC holds tempo, length, mix and loudness per piece. The finale quotes the
title theme: the heroes' tune comes back against Archon.
"""
from .song import Song, m

NOX = [(0, 'D3', 1.5), (1.5, 'F3', .5), (2, 'A3', 1), (3, 'G3', 1)]
NOX_TAIL = [(0, 'F3', 1), (1, 'D3', 3)]
LULU = [(0, 'A4', .5), (.5, 'C5', .5), (1, 'E5', 1), (2, 'D5', 2)]
LULU_TAIL = [(0, 'E5', 1), (1, 'G5', 3)]
EVE = [(0, 'E5', 1), (1, 'B5', 1), (2, 'A5', 1), (3, 'E5', 1)]
EVE_TAIL = [(0, 'F#5', 2), (2, 'B4', 2)]
ARCHON = [(0, 'D3', 2), (2, 'Eb3', 1), (3, 'D3', 1), (4, 'Ab2', 4)]


def up(notes, semis):
    return [(a, m(n) + semis, d, *rest) for a, n, d, *rest in notes]


def two(head, tail, semis=0):
    """A two-bar motif: head in the first bar, tail in the second."""
    return up(head, semis) + [(4 + a, n, d) for a, n, d in up(tail, semis)]


def bars(*rows):
    """Melody written bar by bar: each row is a list of (beat, note, beats) inside its bar."""
    out = []
    for i, row in enumerate(rows):
        out += [(4 * i + a, n, d, *r) for a, n, d, *r in row]
    return out


# ------------------------------------------------------------------------------------------------ the title theme
THEME = bars(
    [(0, 'D5', 1.5), (1.5, 'F5', .5), (2, 'A5', 1), (3, 'G5', 1)],
    [(0, 'F5', 1), (1, 'D5', 3)],
    [(0, 'A4', .5), (.5, 'C5', .5), (1, 'E5', 1), (2, 'D5', 2)],
    [(0, 'E5', 1), (1, 'G5', 3)],
    [(0, 'Bb5', 1.5), (1.5, 'A5', .5), (2, 'G5', 1), (3, 'D5', 1)],
    [(0, 'F5', 2), (2, 'D5', 1), (3, 'Bb4', 1)],
    [(0, 'C#5', 1.5), (1.5, 'E5', .5), (2, 'A5', 2)],
    [(0, 'G5', 1), (1, 'F5', 1), (2, 'E5', 1), (3, 'C#5', 1)])
THEME2 = bars(
    [(0, 'D5', 1.5), (1.5, 'F5', .5), (2, 'A5', 1), (3, 'D6', 1)],
    [(0, 'C6', 1), (1, 'Bb5', 1), (2, 'A5', 1), (3, 'F5', 1)],
    [(0, 'A5', .5), (.5, 'C6', .5), (1, 'E6', 1), (2, 'D6', 2)],
    [(0, 'E6', 1), (1, 'G6', 1), (2, 'E6', 1), (3, 'C6', 1)],
    [(0, 'Bb5', 1), (1, 'A5', 1), (2, 'G5', 1), (3, 'Bb5', 1)],
    [(0, 'A5', 1), (1, 'G5', 1), (2, 'E5', 1), (3, 'C#5', 1)],
    [(0, 'D5', 4)])
THEME_CHORDS = ['Dm', 'Bb', 'F', 'C', 'Gm', 'Bb', 'A', 'A7', 'Dm', 'Bb', 'F', 'C', 'Gm', 'A7', 'Dm', 'Bb']


def title(s: Song):
    """Menu and «Due colpi». The clock, the two motifs, the theme in full, then the promise on A sus4 back to the top."""
    s.section('orologio', 0, 8); s.section('risveglio', 8, 8); s.section('tema', 16, 16); s.section('promessa', 32, 8)
    s.progression(0, ['Dm', '-', 'Bb', '-', 'Gm', '-', 'A7sus4', 'A'])
    s.progression(8, ['Dm', 'F', 'C', 'Am', 'Bb', 'F', 'Gm', 'A'])
    s.progression(16, THEME_CHORDS)
    s.progression(32, ['Gm', 'Dm', 'Bb', 'F', 'C', 'Dm', 'Asus4', '-'])
    # I · the clock and NOX in the low piano
    s.tick(0, 8, 1.0, .32)
    s.pad(0, 8, 'strings', .32, center=55, voices=4, low_root=True)
    s.melody(0, two(NOX, NOX_TAIL), 'piano', .62, 'keys', -.1, .35)
    s.melody(2, two(NOX, NOX_TAIL, -12), 'strings', .38, 'keys', .1, .3, attack=.12)
    s.melody(4, [(0, 'D6', 2), (2, 'A5', 2), (4, 'Bb5', 2), (6, 'A5', 2)], 'glass', .33, 'keys', .35, .5, echo=.35)
    s.pad(6, 2, 'choir', .26, center=62, voices=3)
    s.riser(8, 4, .45)
    # II · the city wakes: half-time, bass, harp, LULU in the bells and NOX in the horns
    s.groove(8, 8, 'halftime', .55)
    s.bassline(8, 8, ((0, 1.5), (1.5, .5), (2, 1.5), (3.5, .5)), 'bass', 2, .7)
    s.pad(8, 8, 'strings', .34, center=57, voices=4)
    s.arp(8, 8, 'pluck', .5, (0, 1, 2, 3, 1, 2, 3, 2), 62, .38, room=.3, echo=.15)
    s.tick(8, 8, 2.0, .2)
    s.melody(9, two(LULU, LULU_TAIL), 'bell', .5, 'lead', .2, .35, echo=.25)
    s.melody(12, two(NOX, NOX_TAIL, 12), 'brass', .55, 'lead', -.15, .3)
    s.melody(14, [(0, 'G4', .5), (.5, 'Bb4', .5), (1, 'D5', 1), (2, 'C5', 2), (4, 'E5', 1), (5, 'C#5', 1), (6, 'A4', 2)], 'bell', .45, 'lead', .2, .35, echo=.25)
    s.riser(16, 4, .6)
    # III · the theme
    s.impact(16, .55)
    s.groove(16, 8, 'pop', .9, crash_first=True)
    s.groove(24, 8, 'pop', 1.0, crash_first=True)
    s.bassline(16, 16, tuple((k * .5, .5) for k in range(8)), 'bass', 2, .72, degrees=(0, 0, 8, 0, 0, 8, 0, 5))
    s.pad(16, 16, 'strings', .36, center=60, voices=4, low_root=True)
    s.arp(16, 16, 'spiccato', .5, (0, 2, 1, 2, 0, 2, 1, 3), 55, .42, room=.2, pan_sweep=.5)
    for bar in (16, 20, 24, 28):
        s.hit('timpani', bar * 4, .8, 'drums', 0, room=.25, variants=2, f=73.42)
    s.melody(16, THEME, 'brass', .66, 'lead', 0, .3)
    s.melody(16, up(THEME, -12), 'strings', .3, 'lead', -.2, .3, attack=.06)
    s.melody(24, up(THEME2, -12), 'brass', .62, 'lead', 0, .3)
    s.melody(24, THEME2, 'strings', .36, 'lead', .2, .35, attack=.05)
    s.pad(28, 4, 'choir', .3, center=64, voices=3)
    s.melody(31, [(0, 'F4', 1), (1, 'D4', 1), (2, 'Bb3', 2)], 'strings', .3, 'keys', 0, .4, attack=.1)
    # IV · the promise: piano and celesta, choir, stopping on A sus4
    s.pad(32, 8, 'strings', .24, center=57, voices=3)
    s.pad(32, 6, 'choir', .2, center=62, voices=3)
    s.melody(33, two(NOX, NOX_TAIL, 12), 'piano', .55, 'keys', -.15, .4)
    s.melody(35, two(LULU, LULU_TAIL, 12), 'bell', .36, 'keys', .25, .45, echo=.3)
    s.melody(38, [(0, 'A3', 8), (0, 'D4', 8), (0, 'E4', 8)], 'piano', .4, 'keys', 0, .5)
    s.tick(36, 4, 1.0, .22)
    s.riser(40, 3, .3)


def refuge(s: Song):
    """Moon Refuge, the Cathedral, home, Tessa's bench: warm and safe, piano and harp, the two motifs in F major."""
    s.section('casa', 0, 8); s.section('vita', 8, 8); s.section('insieme', 16, 8); s.section('sera', 24, 8)
    s.progression(0, ['F', 'C/E', 'Dm', 'Bb', 'F', 'C/E', 'Bb', 'Csus4'])
    s.progression(8, ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'Gm', 'C'])
    s.progression(16, ['Bb', 'Dm', 'Am', 'C', 'Bb', 'C', 'F', 'F'])
    s.progression(24, ['Dm', 'Am', 'Bb', 'F', 'Gm', 'C', 'Bb', 'C'])
    s.arp(0, 32, 'piano', .5, (0, 2, 1, 3, 2, 1, 3, 2), 58, .34, room=.4, pan_sweep=.2, gate=2.0)
    s.pad(0, 32, 'strings', .2, center=57, voices=3, attack=.8)
    s.melody(2, two([(0, 'C5', .5), (.5, 'E5', .5), (1, 'G5', 1), (2, 'G5', 2)], [(0, 'G5', 1), (1, 'Bb5', 3)]), 'bell', .4, 'lead', .2, .4, echo=.2)
    s.melody(6, two(NOX, NOX_TAIL, 12), 'strings', .32, 'lead', -.15, .35, attack=.15)
    # II · life in the refuge: harp, soft beat, the refuge tune in the electric piano
    s.groove(8, 16, 'soft', .55)
    s.bassline(8, 16, ((0, 2), (2, 1.5), (3.5, .5)), 'bass', 2, .5, degrees=(0, 5, 0), bright=.3)
    s.arp(8, 16, 'pluck', .5, (0, 1, 2, 3, 2, 1, 2, 3), 67, .26, room=.35, echo=.2)
    tune = bars([(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'D5', 1), (3, 'A4', 1)],
                [(0, 'Bb4', 1), (1, 'D5', 1), (2, 'F5', 2)],
                [(0, 'A5', 1.5), (1.5, 'G5', .5), (2, 'F5', 1), (3, 'C5', 1)],
                [(0, 'E5', 2), (2, 'G5', 1), (3, 'E5', 1)],
                [(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'D5', 1), (3, 'A4', 1)],
                [(0, 'D5', 1), (1, 'F5', 1), (2, 'Bb5', 2)],
                [(0, 'A5', 1), (1, 'G5', 1), (2, 'F5', 1), (3, 'D5', 1)],
                [(0, 'E5', 3), (3, 'C5', 1)])
    s.melody(8, tune, 'epiano', .55, 'lead', .05, .35, echo=.15)
    # III · together: NOX in the cello and LULU in the strings answer each other
    s.melody(16, two(NOX, NOX_TAIL, 12), 'strings', .42, 'lead', -.2, .4, attack=.12)
    s.melody(18, two(LULU, LULU_TAIL), 'strings', .4, 'lead', .2, .4, attack=.1)
    s.melody(20, bars([(0, 'F5', 1), (1, 'D5', 1), (2, 'Bb4', 2)], [(0, 'C5', 1), (1, 'E5', 1), (2, 'G5', 2)], [(0, 'A5', 4)], [(0, 'F5', 4)]),
             'epiano', .45, 'lead', 0, .4)
    s.pad(16, 8, 'choir', .16, center=64, voices=3, vowel='o')
    # IV · evening: piano and glass, no beat
    s.melody(24, [(0, 'A5', 2), (2, 'F5', 2), (4, 'E5', 2), (6, 'C5', 2), (8, 'D5', 4), (12, 'F5', 4), (16, 'D5', 2), (18, 'Bb4', 2),
                  (20, 'C5', 4), (24, 'D5', 2), (26, 'F5', 2), (28, 'E5', 4)], 'glass', .3, 'keys', .3, .5, echo=.3)


def nox(s: Song):
    """Nox's streets at night (Acts I-II on foot): a pulse, a muted pluck, NOX in the piano and the cello, a cold Eb."""
    s.section('ombra', 0, 16); s.section('passo', 16, 16); s.section('caccia', 32, 16)
    s.progression(0, ['Dm', '-', 'Bb', '-', 'Gm', '-', 'A', '-', 'Dm', '-', 'Bb', '-', 'Eb', '-', 'A', '-'])
    s.progression(16, ['Gm', '-', 'Dm', '-', 'Bb', '-', 'F', 'C', 'Gm', '-', 'Dm', '-', 'Eb', '-', 'A', '-'])
    s.progression(32, ['Dm', 'C', 'Bb', 'A', 'Dm', 'C', 'Bb', 'A', 'Dm', 'C', 'Bb', 'A', 'Dm', '-', 'Bb', 'A'])
    s.bassline(0, 48, tuple((k * .5, .45) for k in range(8)), 'bass', 2, .5, bright=.35)
    s.groove(0, 16, 'pulse', .5, fill=False)
    s.groove(16, 16, 'halftime', .6)
    s.groove(32, 16, 'pulse', .8)
    s.groove(40, 8, 'halftime', .5, fill=True)
    s.arp(0, 16, 'synthpluck', .25, (0, 2, 1, 2, 3, 2, 1, 2), 62, .22, room=.25, echo=.3, bright=.45)
    s.arp(16, 16, 'pluck', .5, (0, 1, 2, 1, 3, 1, 2, 1), 60, .3, room=.3, echo=.2)
    s.arp(32, 16, 'synthpluck', .25, (0, 1, 2, 3, 2, 1, 2, 3), 64, .24, room=.25, echo=.3, bright=.6)
    s.pad(0, 48, 'strings', .22, center=52, voices=3, attack=1.0)
    s.pad(32, 16, 'choir', .15, center=62, voices=3, vowel='o')
    s.melody(2, two(NOX, NOX_TAIL, 12), 'piano', .55, 'keys', -.2, .35)
    s.melody(8, two(NOX, NOX_TAIL), 'strings', .5, 'lead', .15, .3, attack=.1)
    for b in (16, 20, 24, 28):
        s.play('glass', b * 4, 'D6' if b % 8 == 0 else 'A5', 4, .3, 'keys', .35, .5, .35)
    s.melody(24, two(NOX, NOX_TAIL, 12), 'piano', .5, 'keys', -.2, .35)
    line = bars([(0, 'D5', 1.5), (1.5, 'E5', .5), (2, 'F5', 1), (3, 'A5', 1)],
                [(0, 'G5', 2), (2, 'E5', 1), (3, 'C5', 1)],
                [(0, 'F5', 1.5), (1.5, 'D5', .5), (2, 'Bb4', 1), (3, 'D5', 1)],
                [(0, 'C#5', 2), (2, 'E5', 1), (3, 'A4', 1)],
                [(0, 'A5', 1.5), (1.5, 'G5', .5), (2, 'F5', 1), (3, 'D5', 1)],
                [(0, 'E5', 1), (1, 'G5', 1), (2, 'C6', 1), (3, 'G5', 1)],
                [(0, 'F5', 2), (2, 'D5', 2)],
                [(0, 'E5', 2), (2, 'C#5', 2)])
    s.melody(32, line, 'lead', .5, 'lead', 0, .3, echo=.25, bright=.5)
    s.melody(40, up(line, -12), 'strings', .42, 'lead', .1, .35, attack=.08)
    s.melody(44, two(NOX, NOX_TAIL), 'brass', .5, 'lead', -.2, .3)


def lulu(s: Song):
    """Lulù's city (her steps, the clinic, the flood): marimba and bells, a light break, LULU leaning forward."""
    s.section('mattino', 0, 16); s.section('corsa', 16, 16); s.section('aperto', 32, 8); s.section('respiro', 40, 8)
    s.progression(0, ['Am', 'F', 'C', 'G', 'Am', 'F', 'Dm', 'E', 'Am', 'F', 'C', 'G', 'F', 'G', 'Am', 'Am'])
    s.progression(16, ['F', 'G', 'Em', 'Am', 'F', 'G7', 'C', 'E', 'Dm', 'Em', 'F', 'G', 'Dm', 'E', 'Am', 'E'])
    s.progression(32, ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'E'])
    s.progression(40, ['Am', 'F', 'C', 'G', 'Dm', 'F', 'Esus4', 'E'])
    s.arp(0, 16, 'mallet', .5, (0, 2, 1, 3, 2, 1, 3, 2), 67, .4, room=.3, pan_sweep=.4)
    s.arp(16, 16, 'pluck', .5, (0, 1, 2, 3, 1, 2, 3, 2), 64, .32, room=.3, echo=.2)
    s.arp(32, 8, 'mallet', .25, (0, 1, 2, 3, 2, 1, 2, 3), 69, .32, room=.3, pan_sweep=.5)
    s.arp(40, 8, 'mallet', .5, (0, 2, 1, 3), 67, .3, room=.4)
    s.bassline(0, 40, ((0, .75), (.75, .75), (1.5, .5), (2, 1), (3, .5), (3.5, .5)), 'bass', 2, .55, degrees=(0, 0, 5, 0, 8, 5), bright=.45)
    s.bassline(40, 8, ((0, 2), (2, 2)), 'bass', 2, .45, bright=.3)
    s.groove(0, 16, 'break', .45)
    s.groove(16, 16, 'break', .7)
    s.groove(32, 8, 'break', .9, crash_first=True)
    s.groove(40, 8, 'soft', .5, fill=False)
    s.pad(0, 48, 'strings', .2, center=60, voices=3, attack=.6)
    s.melody(0, two(LULU, LULU_TAIL), 'bell', .5, 'lead', .15, .35, echo=.25)
    s.melody(8, two(LULU, LULU_TAIL, 12), 'glass', .38, 'lead', .25, .4, echo=.3)
    s.melody(20, two(NOX, NOX_TAIL, 12), 'strings', .4, 'lead', -.2, .35, attack=.1)
    s.melody(24, bars([(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'D5', 1), (3, 'A4', 1)], [(0, 'B4', 1), (1, 'E5', 1), (2, 'G5', 2)],
                      [(0, 'A5', 1), (1, 'F5', 1), (2, 'C5', 2)], [(0, 'D5', 2), (2, 'B4', 2)],
                      [(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'D5', 1), (3, 'F5', 1)], [(0, 'E5', 2), (2, 'G#4', 2)],
                      [(0, 'A4', .5), (.5, 'C5', .5), (1, 'E5', 1), (2, 'A5', 2)], [(0, 'G#5', 2), (2, 'B4', 2)]),
             'epiano', .5, 'lead', .1, .35, echo=.15)
    chorus = bars([(0, 'E4', 1), (1, 'G4', 1), (2, 'C5', 1.5), (3.5, 'B4', .5)],
                  [(0, 'D5', 1), (1, 'B4', 1), (2, 'G4', 2)],
                  [(0, 'A4', .5), (.5, 'C5', .5), (1, 'E5', 1), (2, 'D5', 2)],
                  [(0, 'E5', 1), (1, 'G5', 3)],
                  [(0, 'G5', 1), (1, 'E5', 1), (2, 'C5', 1.5), (3.5, 'D5', .5)],
                  [(0, 'B4', 1), (1, 'D5', 1), (2, 'G5', 2)],
                  [(0, 'A5', 1), (1, 'G5', 1), (2, 'F5', 1), (3, 'C5', 1)],
                  [(0, 'B4', 2), (2, 'G#4', 2)])
    s.melody(32, chorus, 'lead', .55, 'lead', 0, .3, echo=.2, bright=.7)
    s.melody(34, two(LULU, LULU_TAIL, 12), 'bell', .4, 'lead', .3, .4)
    s.melody(42, [(0, 'A5', 2), (2, 'G5', 2), (4, 'F5', 4), (8, 'A5', 4), (12, 'B5', 2), (14, 'G#5', 2)], 'glass', .3, 'keys', .3, .45, echo=.3)


def danger(s: Song):
    """Every fight of Acts I-II: a break at 140, reese bass, strings in sixteenths, NOX in the horns."""
    s.section('assalto', 0, 8); s.section('pressione', 8, 8); s.section('tema', 16, 16); s.section('respiro', 32, 8)
    s.section('contrattacco', 40, 16); s.section('ritorno', 56, 8)
    s.progression(0, ['Dm', '-', 'Bb', 'C', 'Dm', '-', 'Bb', 'A'])
    s.progression(8, ['Dm', 'F', 'Gm', 'A', 'Dm', 'F', 'Bb', 'A'])
    s.progression(16, ['Dm', 'Bb', 'F', 'C', 'Gm', 'Bb', 'A', 'A7', 'Dm', 'Bb', 'F', 'C', 'Gm', 'Bb', 'Dm', 'A'])
    s.progression(32, ['Bb', 'C', 'Dm', '-', 'Bb', 'C', 'A', '-'])
    s.progression(40, ['Gm', 'Bb', 'Dm', 'C', 'Gm', 'A', 'Dm', '-', 'Gm', 'Bb', 'Dm', 'C', 'Gm', 'A', 'Dm', '-'])
    s.progression(56, ['Dm', '-', 'Bb', 'C', 'Gm', '-', 'A', '-'])
    s.groove(0, 8, 'break', .85, crash_first=True)
    s.groove(8, 8, 'break', .9)
    s.groove(16, 16, 'break', 1.0, crash_first=True)
    s.groove(32, 8, 'halftime', .6)
    s.groove(40, 16, 'break', 1.0, crash_first=True)
    s.groove(56, 8, 'break', .95)
    for a, n in ((0, 32), (40, 24)):
        s.bassline(a, n, tuple((k * .5, .45) for k in range(8)), 'reese', 2, .6, degrees=(0, 0, 8, 0, 0, 8, 5, 0))
    s.bassline(32, 8, ((0, 4),), 'sub', 2, .6)
    s.arp(0, 32, 'spiccato', .25, (0, 1, 2, 1, 3, 1, 2, 1), 57, .38, room=.15, pan_sweep=.5)
    s.arp(40, 24, 'spiccato', .25, (0, 1, 2, 1, 3, 1, 2, 1), 57, .38, room=.15, pan_sweep=.5)
    s.pad(8, 24, 'strings', .28, center=62, voices=3)
    for b in range(8, 16):
        for at in (1.5, 3.5):
            sym = s.chord_at(b * 4 + at)
            for note in s.voicing(sym, 'stab', 64, 3):
                s.play('brass', b * 4 + at, note, .35, .4, 'keys', 0, .2)
    theme = bars([(0, 'D4', 1.5), (1.5, 'F4', .5), (2, 'A4', 1), (3, 'G4', 1)], [(0, 'F4', 1), (1, 'D4', 3)],
                 [(0, 'A4', 1.5), (1.5, 'C5', .5), (2, 'F5', 1), (3, 'E5', 1)], [(0, 'D5', 1), (1, 'C5', 1), (2, 'G4', 2)],
                 [(0, 'Bb4', 1.5), (1.5, 'D5', .5), (2, 'G5', 1), (3, 'F5', 1)], [(0, 'F5', 2), (2, 'D5', 2)],
                 [(0, 'E5', 1.5), (1.5, 'C#5', .5), (2, 'A4', 1), (3, 'E5', 1)], [(0, 'G5', 1), (1, 'F5', 1), (2, 'E5', 1), (3, 'C#5', 1)])
    s.melody(16, theme, 'brass', .66, 'lead', 0, .25)
    s.melody(24, up(theme[:-6], 12) + bars(*[[]] * 6, [(0, 'D5', 2), (2, 'A4', 2)], [(0, 'C#5', 2), (2, 'E5', 2)]), 'brass', .62, 'lead', 0, .25)
    s.melody(24, up(theme[:-6], 24), 'strings', .3, 'lead', .25, .3, attack=.05)
    s.pad(32, 8, 'choir', .26, center=62, voices=3)
    s.arp(32, 8, 'synthpluck', .25, (0, 1, 2, 3), 64, .26, room=.3, echo=.3)
    s.riser(40, 8, .55)
    s.impact(40, .5)
    counter = bars([(0, 'G4', 1.5), (1.5, 'A4', .5), (2, 'Bb4', 1), (3, 'D5', 1)], [(0, 'C5', 1), (1, 'Bb4', 1), (2, 'F4', 2)],
                   [(0, 'A4', .5), (.5, 'C5', .5), (1, 'E5', 1), (2, 'D5', 2)], [(0, 'E5', 1), (1, 'G5', 3)],
                   [(0, 'Bb4', 1.5), (1.5, 'A4', .5), (2, 'G4', 1), (3, 'D5', 1)], [(0, 'C#5', 2), (2, 'E5', 1), (3, 'A5', 1)],
                   [(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'D5', 2)], [(0, 'A4', 4)])
    s.melody(40, counter, 'strings', .5, 'lead', .15, .3, attack=.05)
    s.melody(40, counter, 'lead', .35, 'lead', -.1, .25, bright=.6)
    s.melody(48, up(counter, 12), 'strings', .45, 'lead', .2, .3, attack=.05)
    s.melody(48, two(NOX, NOX_TAIL), 'brass', .6, 'lead', -.15, .25)
    # the last statement falls to the fifth of the dominant (E over A), not to F: the counter-line above needs the C# of A
    s.melody(52, two(NOX, [(0, 'E3', 1), (1, 'D3', 3)]), 'brass', .55, 'lead', -.15, .25)
    s.riser(64, 4, .45)


def danger_b(s: Song):
    """Every fight of Acts III-IV: harder and more electric, four on the floor under a break, LULU in the lead."""
    s.section('assalto', 0, 8); s.section('pressione', 8, 8); s.section('tema', 16, 16); s.section('respiro', 32, 8)
    s.section('contrattacco', 40, 16); s.section('ritorno', 56, 8)
    s.progression(0, ['Am', '-', 'F', 'G', 'Am', '-', 'F', 'E'])
    s.progression(8, ['Am', 'F', 'C', 'G', 'Dm', 'F', 'E', '-'])
    s.progression(16, ['F', 'G', 'Am', '-', 'F', 'G', 'Esus4', 'E', 'F', 'G', 'Am', 'C', 'Dm', 'G', 'Am', 'E'])
    s.progression(32, ['Am', 'F', 'C', 'G', 'Am', 'F', 'E', '-'])
    s.progression(40, ['Dm', 'Am', 'F', 'G', 'Dm', 'Am', 'E', '-', 'Dm', 'Am', 'F', 'G', 'Dm', 'Am', 'E', '-'])
    s.progression(56, ['Am', '-', 'F', 'G', 'F', '-', 'E', '-'])
    s.groove(0, 8, 'drive', .85, crash_first=True)
    s.groove(0, 8, 'break', .45, fill=False, bus='perc')
    s.groove(8, 8, 'break', .95)
    s.groove(16, 16, 'drive', 1.0, crash_first=True)
    s.groove(16, 16, 'break', .5, fill=False, bus='perc')
    s.groove(32, 8, 'halftime', .65)
    s.groove(40, 16, 'break', 1.0, crash_first=True)
    for b in (40, 44, 48, 52):
        s.hit('taiko', b * 4, .8, 'drums', 0, room=.2)
        s.hit('taiko', b * 4 + 2.5, .6, 'drums', 0, room=.2, f=80.0)
    s.groove(56, 8, 'drive', .95)
    s.bassline(0, 32, tuple((k * .5, .45) for k in range(8)), 'reese', 2, .6, degrees=(0, 8, 0, 8, 0, 8, 5, 8))
    s.bassline(32, 8, ((0, 2), (2, 2)), 'sub', 2, .6)
    s.bassline(40, 24, tuple((k * .5, .45) for k in range(8)), 'reese', 2, .6, degrees=(0, 8, 0, 8, 0, 8, 5, 8))
    s.arp(0, 32, 'synthpluck', .25, (0, 1, 2, 3, 1, 2, 3, 2), 64, .3, room=.2, echo=.25, bright=.8)
    s.arp(40, 24, 'synthpluck', .25, (0, 2, 1, 3, 2, 1, 3, 2), 64, .3, room=.2, echo=.25, bright=.8)
    s.pad(8, 24, 'strings', .26, center=64, voices=3)
    s.pad(40, 16, 'choir', .22, center=64, voices=3)
    theme = bars([(0, 'A4', .5), (.5, 'C5', .5), (1, 'E5', 1), (2, 'D5', 2)], [(0, 'E5', 1), (1, 'G5', 3)],
                 [(0, 'A5', 1.5), (1.5, 'G5', .5), (2, 'E5', 1), (3, 'C5', 1)], [(0, 'D5', 1), (1, 'C5', 1), (2, 'A4', 2)],
                 [(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'C5', 1), (3, 'A4', 1)], [(0, 'B4', 1), (1, 'D5', 1), (2, 'G5', 2)],
                 [(0, 'A5', 2), (2, 'E5', 2)], [(0, 'G#5', 1), (1, 'B5', 1), (2, 'B4', 2)])
    s.melody(16, theme, 'lead', .6, 'lead', 0, .25, echo=.15, bright=.8)
    s.melody(24, up(theme, 12)[:-4] + bars(*[[]] * 6, [(0, 'A5', 2), (2, 'C6', 2)], [(0, 'B5', 2), (2, 'G#5', 2)]), 'lead', .55, 'lead', 0, .25, echo=.15, bright=.8)
    s.melody(24, theme, 'brass', .45, 'lead', -.2, .25)
    s.arp(32, 8, 'bell', .5, (0, 1, 2, 3), 72, .26, room=.4, echo=.3)
    s.riser(40, 8, .55)
    s.impact(40, .55)
    line = bars([(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'D5', 1), (3, 'A4', 1)], [(0, 'C5', 1), (1, 'E5', 1), (2, 'A5', 2)],
                [(0, 'A5', 1), (1, 'F5', 1), (2, 'C5', 2)], [(0, 'B4', 1), (1, 'D5', 1), (2, 'G5', 2)],
                [(0, 'F5', 1.5), (1.5, 'A5', .5), (2, 'D6', 1), (3, 'A5', 1)], [(0, 'C6', 1), (1, 'A5', 1), (2, 'E5', 2)],
                [(0, 'E5', 2), (2, 'G#5', 2)], [(0, 'B5', 4)])
    s.melody(40, line, 'brass', .6, 'lead', 0, .25)
    s.melody(48, line[:-2] + [(28, 'G#5', 4)], 'strings', .5, 'lead', .2, .3, attack=.05)
    s.melody(48, two(LULU, LULU_TAIL), 'lead', .45, 'lead', -.15, .25, bright=.8)
    s.riser(64, 4, .45)


def drive(s: Song):
    """The five drives: four on the floor with the pump, a sixteenth arp, the theme of NOX turned into an open road."""
    s.section('partenza', 0, 8); s.section('rettilineo', 8, 8); s.section('tema', 16, 16); s.section('tunnel', 32, 8); s.section('uscita', 40, 8)
    s.progression(0, ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'Gm', 'A'])
    s.progression(8, ['Bb', 'Csus4', 'Dm', '-', 'Bb', 'C', 'A', '-'])
    s.progression(16, ['F', 'C', 'Dm', 'Bb', 'F', 'C', 'Gm', 'A', 'F', 'C', 'Dm', 'Bb', 'Gm', 'A', 'Dm', '-'])
    s.progression(32, ['Bb', '-', 'C', '-', 'Dm', '-', 'A', '-'])
    s.progression(40, ['F', 'C', 'Dm', 'Bb', 'Gm', 'Bb', 'A', '-'])
    s.groove(0, 32, 'drive', .9, crash_first=True)
    s.groove(32, 6, 'pulse', .6, fill=False)
    s.groove(38, 2, 'drive', .7)
    s.groove(40, 8, 'drive', 1.0, crash_first=True)
    s.bassline(0, 48, tuple((k * .5, .45) for k in range(8)), 'bass', 2, .6, degrees=(0, 8, 0, 8, 0, 8, 0, 8), bright=.6)
    s.arp(0, 48, 'synthpluck', .25, (0, 1, 2, 3, 2, 1, 2, 3), 62, .3, room=.2, echo=.3, bright=.8)
    s.pad(0, 48, 'strings', .3, center=62, voices=4)
    theme = bars([(0, 'F5', 1.5), (1.5, 'G5', .5), (2, 'A5', 1), (3, 'C6', 1)], [(0, 'G5', 2), (2, 'E5', 1), (3, 'C5', 1)],
                 [(0, 'D5', 1.5), (1.5, 'F5', .5), (2, 'A5', 1), (3, 'G5', 1)], [(0, 'F5', 1), (1, 'D5', 3)],
                 [(0, 'A5', 1.5), (1.5, 'Bb5', .5), (2, 'C6', 1), (3, 'A5', 1)], [(0, 'G5', 1), (1, 'E5', 1), (2, 'G5', 2)],
                 [(0, 'Bb5', 1), (1, 'A5', 1), (2, 'G5', 1), (3, 'D5', 1)], [(0, 'E5', 2), (2, 'C#5', 2)],
                 [(0, 'A5', 1.5), (1.5, 'G5', .5), (2, 'F5', 1), (3, 'C5', 1)], [(0, 'E5', 1), (1, 'G5', 1), (2, 'C6', 2)],
                 [(0, 'D6', 1.5), (1.5, 'C6', .5), (2, 'A5', 1), (3, 'F5', 1)], [(0, 'D5', 2), (2, 'F5', 2)],
                 [(0, 'G5', 1), (1, 'Bb5', 1), (2, 'D6', 1), (3, 'Bb5', 1)], [(0, 'A5', 2), (2, 'E5', 2)],
                 [(0, 'F5', 1), (1, 'E5', 1), (2, 'D5', 2)], [(0, 'A4', 4)])
    s.melody(16, theme, 'lead', .62, 'lead', 0, .25, echo=.25, bright=.8)
    s.melody(16, up(theme, -12), 'brass', .3, 'lead', -.25, .2)
    s.melody(8, two(NOX, NOX_TAIL, 12), 'brass', .5, 'lead', -.1, .25)
    s.melody(12, two(LULU, LULU_TAIL), 'bell', .42, 'lead', .2, .3, echo=.3)
    s.riser(16, 4, .55)
    s.pad(32, 8, 'choir', .22, center=64, voices=3)
    s.melody(34, two(NOX, NOX_TAIL, 24), 'glass', .3, 'keys', .3, .45, echo=.35)
    s.riser(40, 8, .55)
    s.melody(40, theme[:16], 'lead', .55, 'lead', 0, .25, echo=.25, bright=.8)


def race(s: Song):
    """The Veyra championship, day and night: a fast break, a bright lead, the crowd in the strings."""
    s.section('griglia', 0, 16); s.section('sorpasso', 16, 16); s.section('tema', 32, 16); s.section('ultimo giro', 48, 16)
    s.progression(0, ['Em', 'C', 'G', 'D', 'Em', 'C', 'Am', 'B'] * 2)
    s.progression(16, ['C', 'D', 'Em', '-', 'C', 'Dsus4', 'B', '-', 'C', 'D', 'B', 'Em', 'C', 'D', 'B', '-'])
    s.progression(32, ['Em', 'C', 'G', 'D', 'Em', 'C', 'Am', 'B'] * 2)
    s.progression(48, ['Am', 'B', 'Em', 'C', 'Am', 'B', 'Em', '-', 'Em', 'C', 'G', 'D', 'Em', 'C', 'Am', 'B'])
    s.groove(0, 16, 'break', .85, crash_first=True)
    s.groove(16, 16, 'break', .95)
    s.groove(32, 16, 'break', 1.0, crash_first=True)
    s.groove(48, 8, 'halftime', .75)
    s.groove(56, 8, 'break', 1.0)
    s.bassline(0, 64, tuple((k * .5, .45) for k in range(8)), 'reese', 2, .6, degrees=(0, 0, 8, 0, 5, 0, 8, 0))
    s.arp(0, 64, 'synthpluck', .25, (0, 2, 1, 3, 2, 1, 3, 2), 64, .28, room=.2, echo=.25, bright=.9)
    s.pad(16, 48, 'strings', .28, center=64, voices=3)
    s.melody(4, two(LULU, LULU_TAIL, 7), 'bell', .4, 'lead', .2, .3, echo=.3)
    s.melody(20, two(NOX, NOX_TAIL, 14), 'brass', .5, 'lead', -.15, .25)
    s.melody(24, bars([(0, 'E5', 1), (1, 'G5', 1), (2, 'B5', 2)], [(0, 'A5', 1), (1, 'F#5', 1), (2, 'D5', 2)],
                      [(0, 'D#5', 2), (2, 'F#5', 2)], [(0, 'B5', 4)]), 'lead', .5, 'lead', 0, .25, echo=.2, bright=.8)
    theme = bars([(0, 'E5', 1), (1, 'G5', 1), (2, 'B5', 1.5), (3.5, 'A5', .5)], [(0, 'G5', 1), (1, 'E5', 1), (2, 'C5', 2)],
                 [(0, 'D5', 1), (1, 'G5', 1), (2, 'B5', 2)], [(0, 'A5', 1), (1, 'F#5', 1), (2, 'D5', 2)],
                 [(0, 'E5', .5), (.5, 'G5', .5), (1, 'B5', 1), (2, 'A5', 2)], [(0, 'B5', 1), (1, 'E6', 3)],
                 [(0, 'C6', 1), (1, 'B5', 1), (2, 'A5', 1), (3, 'E5', 1)], [(0, 'D#5', 2), (2, 'F#5', 2)])
    s.melody(32, theme, 'lead', .62, 'lead', 0, .25, echo=.2, bright=.9)
    s.melody(40, theme, 'brass', .55, 'lead', -.1, .25)
    s.melody(40, up(theme, 12), 'strings', .32, 'lead', .2, .3, attack=.04)
    s.pad(48, 8, 'choir', .22, center=64, voices=3)
    s.riser(56, 8, .5)
    s.impact(56, .45)
    s.melody(56, theme, 'lead', .6, 'lead', 0, .25, echo=.2, bright=.9)
    s.riser(64, 4, .45)


def boss(s: Song):
    """Rook, The Anchor, the Bone Tyrant, the Warden, the Behemoth, the Reaper: taiko, choir, low brass, a Phrygian Eb,
    and the heroes' tune in the horns."""
    s.section('ingresso', 0, 8); s.section('minaccia', 8, 8); s.section('eroi', 16, 16); s.section('fase due', 32, 8); s.section('assalto finale', 40, 16)
    s.progression(0, ['Dm', 'Eb', 'Dm', 'Eb', 'Dm', 'Eb', 'Bb', 'A'])
    s.progression(8, ['Gm', 'Eb', 'Dm', '-', 'Gm', 'Eb', 'A', '-'])
    s.progression(16, ['Dm', 'Bb', 'Gm', 'A', 'Dm', 'Bb', 'Eb', 'A', 'Gm', 'Eb', 'Dm', 'Bb', 'Gm', 'A', 'Dm', 'A'])
    s.progression(32, ['Eb', '-', 'Dm', '-', 'Eb', 'A', 'Dm', 'A'])
    s.progression(40, ['Dm', 'Bb', 'Gm', 'A', 'Dm', 'Bb', 'Eb', 'A', 'Gm', 'Eb', 'Dm', 'Bb', 'Gm', 'A', 'Dm', 'A'])
    s.groove(0, 8, 'taiko', .85)
    s.groove(8, 8, 'taiko', .95)
    s.groove(8, 8, 'march', .5, fill=False, bus='perc')
    s.groove(16, 16, 'break', 1.0, crash_first=True)
    s.groove(16, 16, 'taiko', .6, fill=False, bus='perc')
    s.groove(32, 8, 'taiko', .7)
    s.groove(40, 16, 'break', 1.0, crash_first=True)
    s.groove(40, 16, 'taiko', .7, fill=False, bus='perc')
    s.bassline(0, 56, tuple((k * .5, .45) for k in range(8)), 'reese', 2, .62, degrees=(0, 0, 0, 8, 0, 0, 5, 0))
    s.arp(0, 32, 'spiccato', .5, (0, 0, 1, 0, 2, 0, 1, 0), 50, .45, room=.15, pan_sweep=.4)
    s.arp(40, 16, 'spiccato', .25, (0, 1, 2, 1, 3, 1, 2, 1), 55, .4, room=.15, pan_sweep=.5)
    s.pad(0, 16, 'choir', .3, center=60, voices=3)
    s.pad(32, 8, 'choir', .34, center=62, voices=4)
    s.pad(40, 16, 'choir', .26, center=64, voices=3)
    s.pad(16, 16, 'strings', .26, center=60, voices=3)
    for bar in (0, 8, 16, 24, 32, 40, 48):
        s.hit('timpani', bar * 4, .85, 'drums', 0, room=.25, variants=2, f=73.42)
    for b in range(0, 8):
        for at in (0, 1.5, 3):
            sym = s.chord_at(b * 4 + at)
            for note in s.voicing(sym, 'lowbrass', 50, 2):
                s.play('brass', b * 4 + at, note, .45, .45, 'keys', 0, .15)
    s.impact(16, .5)
    s.impact(40, .55)
    heroes = bars([(0, 'D4', 1.5), (1.5, 'F4', .5), (2, 'A4', 1), (3, 'G4', 1)], [(0, 'F4', 1), (1, 'D4', 3)],
                  [(0, 'G4', 1.5), (1.5, 'Bb4', .5), (2, 'D5', 1), (3, 'C5', 1)], [(0, 'A4', 1), (1, 'C#5', 1), (2, 'E5', 2)],
                  [(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'D5', 1), (3, 'A4', 1)], [(0, 'Bb4', 1), (1, 'D5', 1), (2, 'F5', 2)],
                  [(0, 'G5', 1.5), (1.5, 'F5', .5), (2, 'Eb5', 1), (3, 'Bb4', 1)], [(0, 'A4', 1), (1, 'C#5', 1), (2, 'E5', 1), (3, 'A5', 1)],
                  [(0, 'Bb5', 2), (2, 'G5', 1), (3, 'D5', 1)], [(0, 'Eb5', 1), (1, 'G5', 1), (2, 'Bb5', 2)],
                  [(0, 'A5', 1.5), (1.5, 'G5', .5), (2, 'F5', 1), (3, 'D5', 1)], [(0, 'F5', 2), (2, 'D5', 2)],
                  [(0, 'G5', 1), (1, 'Bb5', 1), (2, 'D5', 2)], [(0, 'C#5', 2), (2, 'E5', 2)],
                  [(0, 'D5', 4)], [(0, 'E4', 1), (1, 'A4', 1), (2, 'C#5', 2)])
    s.melody(16, heroes, 'brass', .66, 'lead', 0, .25)
    s.melody(24, up(heroes[16:], 12)[:0] + [(a, n, d) for a, n, d in heroes if a >= 32], 'strings', .34, 'lead', .2, .3, attack=.05, shift=12)
    s.melody(40, heroes, 'brass', .64, 'lead', 0, .25)
    s.melody(40, heroes, 'choir', .3, 'lead', .1, .3, shift=12)
    s.melody(48, [(a - 32, n, d) for a, n, d in heroes if a >= 32], 'strings', .36, 'lead', .2, .3, attack=.05, shift=12)
    s.riser(16, 4, .5)
    s.riser(40, 8, .5)


def vega(s: Song):
    """The duel with Vega: a rigid metronome and a machine arp, until LULU breaks the grid with syncopation."""
    s.section('metronomo', 0, 16); s.section('rottura', 16, 16); s.section('duello', 32, 16)
    s.progression(0, ['Am', '-', 'Dm', '-', 'E', '-', 'Am', '-', 'F', '-', 'E', '-', 'Am', '-', 'E', '-'])
    s.progression(16, ['F', 'G', 'Am', '-', 'F', 'G', 'E', 'E7', 'Dm', 'F', 'E', 'Am', 'F', 'G', 'E', '-'])
    s.progression(32, ['Am', 'Dm', 'E', 'Am'] * 4)
    s.tick(0, 48, 1.0, .4, pitch=3000.0)
    s.groove(0, 16, 'four', .7, fill=False)
    s.groove(16, 16, 'break', .9, crash_first=True)
    s.groove(32, 16, 'four', .95, crash_first=True)
    s.groove(32, 16, 'break', .45, fill=False, bus='perc')
    s.bassline(0, 16, tuple((k * .5, .45) for k in range(8)), 'bass', 2, .55, bright=.5)
    s.bassline(16, 16, ((0, .75), (.75, .75), (1.5, .5), (2, 1), (3, .5), (3.5, .5)), 'reese', 2, .58, degrees=(0, 0, 5, 0, 8, 5))
    s.bassline(32, 16, tuple((k * .5, .45) for k in range(8)), 'reese', 2, .6, degrees=(0, 8, 0, 8, 0, 8, 0, 8))
    s.arp(0, 16, 'synthpluck', .25, (0, 1, 2, 3) * 2, 64, .3, room=.15, pan_sweep=0, bright=.5, accent=(1.0, 1.0))
    s.arp(16, 16, 'mallet', .5, (0, 2, 1, 3, 2, 1, 3, 2), 69, .32, room=.3, pan_sweep=.5)
    s.arp(32, 16, 'synthpluck', .25, (0, 1, 2, 3, 2, 1, 2, 3), 64, .3, room=.2, echo=.2, bright=.7)
    s.pad(0, 48, 'strings', .22, center=60, voices=3)
    s.melody(4, [(0, 'E5', 2), (2, 'E5', 2), (4, 'E5', 2), (6, 'G#5', 2)], 'glass', .3, 'keys', .3, .3)
    s.melody(12, [(0, 'A5', 4), (4, 'G#5', 4)], 'glass', .3, 'keys', .3, .3)
    broken = bars([(0, 'A4', .5), (.5, 'C5', .5), (1.5, 'E5', .5), (2, 'D5', 2)], [(0, 'B4', .5), (.5, 'D5', 1), (1.5, 'G5', 2.5)],
                  [(0, 'A5', 1.5), (1.5, 'G5', .5), (2, 'E5', 1), (3, 'C5', 1)], [(0, 'E5', .5), (.5, 'D5', .5), (1, 'C5', .5), (1.5, 'A4', 2.5)],
                  [(0, 'A4', .5), (.5, 'C5', .5), (1, 'E5', 1), (2, 'D5', 2)], [(0, 'E5', 1), (1, 'G5', 3)],
                  [(0, 'G#5', 1.5), (1.5, 'B5', .5), (2, 'E5', 2)], [(0, 'D5', 1), (1, 'B4', 1), (2, 'G#4', 2)],
                  [(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'D5', 1), (3, 'A4', 1)], [(0, 'C5', 1), (1, 'F5', 1), (2, 'A5', 2)],
                  [(0, 'G#5', 1), (1, 'E5', 1), (2, 'B4', 2)], [(0, 'C5', 1), (1, 'E5', 1), (2, 'A5', 2)],
                  [(0, 'A5', 1), (1, 'G5', 1), (2, 'F5', 1), (3, 'C5', 1)], [(0, 'D5', 2), (2, 'B4', 2)],
                  [(0, 'E5', 2), (2, 'G#5', 2)], [(0, 'B5', 4)])
    s.melody(16, broken, 'lead', .58, 'lead', 0, .25, echo=.2, bright=.8)
    s.melody(24, up(broken[16:], -12)[:0] + [(a - 32, n, d) for a, n, d in broken if a >= 32], 'bell', .38, 'lead', .25, .3)
    duel = bars([(0, 'E5', 1), (1, 'A5', 1), (2, 'C6', 1), (3, 'B5', 1)], [(0, 'A5', 1), (1, 'F5', 1), (2, 'D5', 2)],
                [(0, 'G#5', 1.5), (1.5, 'B5', .5), (2, 'E5', 2)], [(0, 'A4', .5), (.5, 'C5', .5), (1, 'E5', 1), (2, 'A5', 2)])
    s.melody(36, duel + [(16 + a, n, d) for a, n, d in duel], 'lead', .55, 'lead', 0, .25, echo=.2, bright=.8)
    s.melody(36, duel, 'brass', .4, 'lead', -.2, .25, shift=-12)
    s.melody(44, two(LULU, LULU_TAIL), 'strings', .45, 'lead', .2, .3, attack=.05)


def eve(s: Song):
    """The Archive, EVE-Prime, the mirror: glass fifths over the tick at 60 a minute, then the cold machine wakes up."""
    s.section('archivio', 0, 16); s.section('indice', 16, 16); s.section('specchio', 32, 12); s.section('silenzio', 44, 8)
    s.progression(0, ['Em', '-', 'Cmaj7', '-', 'Em', '-', 'Am', 'B7sus4'] * 2)
    s.progression(16, ['Am', 'Cmaj7', 'Em', 'D', 'Am', 'Cmaj7', 'B7sus4', 'B'] * 2)
    s.progression(32, ['Em', 'C', 'Am', 'B', 'Em', 'C', 'D', 'B', 'Am', 'C', 'B', '-'])
    s.progression(44, ['Em', '-', 'Cmaj7', 'B7sus4'] * 2)
    s.tick(0, 52, 2.0, .45, pitch=1900.0, accent_every=2)
    s.pad(0, 16, 'strings', .22, center=59, voices=3, attack=1.2)
    s.pad(44, 8, 'strings', .2, center=59, voices=3, attack=1.2)
    for at in (0, 4, 8, 12):
        s.melody(at, two(EVE, EVE_TAIL, 12 if at == 8 else 0), 'glass', .45, 'lead', .2 * (1 if at % 8 else -1), .45, echo=.3)
    s.arp(0, 16, 'bell', 1.0, (0, 2, 1, 3), 76, .18, room=.5, echo=.3)
    s.groove(16, 16, 'pulse', .65)
    s.bassline(16, 16, tuple((k * .5, .45) for k in range(8)), 'bass', 2, .5, bright=.4)
    s.arp(16, 16, 'synthpluck', .25, (0, 1, 2, 3, 2, 1, 2, 3), 71, .24, room=.25, echo=.3, bright=.6)
    s.pad(16, 16, 'strings', .24, center=60, voices=3)
    line = bars([(0, 'A5', 1), (1, 'E5', 1), (2, 'B5', 2)], [(0, 'G5', 1), (1, 'E5', 1), (2, 'B5', 2)],
                [(0, 'E5', 1), (1, 'B5', 1), (2, 'A5', 1), (3, 'E5', 1)], [(0, 'F#5', 2), (2, 'A5', 2)],
                [(0, 'C6', 1.5), (1.5, 'B5', .5), (2, 'A5', 1), (3, 'E5', 1)], [(0, 'B5', 2), (2, 'G5', 2)],
                [(0, 'E5', 2), (2, 'F#5', 2)], [(0, 'D#5', 2), (2, 'F#5', 2)])
    s.melody(16, line, 'glass', .5, 'lead', 0, .4, echo=.25)
    s.melody(24, line, 'bell', .4, 'lead', .2, .35, echo=.2)
    s.melody(24, line, 'lead', .32, 'lead', -.2, .3, bright=.4, shift=-12)
    s.riser(32, 4, .5)
    s.impact(32, .45)
    s.groove(32, 12, 'break', .9, crash_first=True)
    s.bassline(32, 12, tuple((k * .5, .45) for k in range(8)), 'reese', 2, .58, degrees=(0, 0, 8, 0, 0, 8, 5, 0))
    s.arp(32, 12, 'spiccato', .25, (0, 1, 2, 1, 3, 1, 2, 1), 59, .36, room=.15, pan_sweep=.5)
    s.pad(32, 12, 'choir', .28, center=64, voices=3)
    s.melody(32, bars([(0, 'E4', 1), (1, 'B4', 1), (2, 'A4', 1), (3, 'E4', 1)], [(0, 'G4', 2), (2, 'E4', 2)],
                      [(0, 'E4', 1), (1, 'B4', 1), (2, 'A4', 1), (3, 'E4', 1)], [(0, 'F#4', 2), (2, 'D#4', 2)],
                      [(0, 'E5', 1), (1, 'B5', 1), (2, 'A5', 1), (3, 'E5', 1)], [(0, 'G5', 2), (2, 'E5', 2)],
                      [(0, 'F#5', 2), (2, 'A5', 2)], [(0, 'B5', 2), (2, 'F#5', 2)],
                      [(0, 'A5', 1), (1, 'E5', 1), (2, 'C6', 2)], [(0, 'B5', 2), (2, 'G5', 2)], [(0, 'F#5', 4)], [(0, 'D#5', 4)]),
             'brass', .6, 'lead', 0, .25)
    s.melody(44, two(EVE, EVE_TAIL) + [(16 + a, n, d) for a, n, d in two(EVE, EVE_TAIL, 12)], 'glass', .4, 'lead', .15, .5, echo=.3)


def depths(s: Song):
    """Act III below the city: Below, the Toxic Bazaar, the Clockwork Outpost, the Axis, the strangers. G minor,
    clockwork mallets, a slow groove, NOX and LULU heard from far away."""
    s.section('discesa', 0, 12); s.section('mercato', 12, 12); s.section('ingranaggi', 24, 12); s.section('quiete', 36, 8)
    s.progression(0, ['Gm', '-', 'Eb', '-', 'Cm', '-', 'D', '-', 'Gm', 'Eb', 'Cm', 'D'])
    s.progression(12, ['Eb', 'F', 'Gm', '-', 'Eb', 'F', 'D', '-', 'Cm', 'Eb', 'D', '-'])
    s.progression(24, ['Gm', '-', 'Eb', 'D', 'Gm', 'F', 'Eb', 'D', 'Cm', 'Gm', 'D', '-'])
    s.progression(36, ['Eb', '-', 'Gm', '-', 'Cm', '-', 'D7', 'D'])
    s.pad(0, 44, 'strings', .22, center=55, voices=3, attack=1.0, low_root=True)
    s.tick(0, 12, 1.0, .25, pitch=1500.0)
    s.arp(0, 12, 'mallet', .5, (0, 2, 1, 3, 2, 1, 0, 2), 62, .32, room=.35, pan_sweep=.5)
    s.melody(4, [(0, 'G5', 4), (4, 'F#5', 4)], 'glass', .28, 'keys', .3, .45, echo=.3)
    s.groove(12, 24, 'soft', .7)
    s.bassline(12, 24, ((0, 1), (1.5, .5), (2, 1), (3, .5), (3.5, .5)), 'bass', 2, .55, degrees=(0, 5, 0, 8, 5), bright=.4)
    s.arp(12, 12, 'pluck', .5, (0, 1, 2, 3, 2, 1, 2, 3), 64, .3, room=.3, echo=.2)
    s.arp(24, 12, 'mallet', .25, (0, 1, 2, 3, 2, 1, 2, 3), 67, .26, room=.3, pan_sweep=.6)
    tune = bars([(0, 'G5', 1.5), (1.5, 'F5', .5), (2, 'Eb5', 1), (3, 'Bb4', 1)], [(0, 'C5', 1), (1, 'F5', 1), (2, 'A5', 2)],
                [(0, 'Bb5', 1.5), (1.5, 'A5', .5), (2, 'G5', 1), (3, 'D5', 1)], [(0, 'G5', 4)],
                [(0, 'Bb5', 1), (1, 'G5', 1), (2, 'Eb5', 2)], [(0, 'F5', 1), (1, 'A5', 1), (2, 'C6', 2)],
                [(0, 'F#5', 1.5), (1.5, 'A5', .5), (2, 'D6', 1), (3, 'C6', 1)], [(0, 'A5', 4)])
    s.melody(12, tune, 'epiano', .5, 'lead', .1, .35, echo=.2)
    s.melody(12, tune, 'bell', .28, 'lead', .3, .35, shift=12)
    s.organ = True
    s.pad(20, 4, 'organ', .2, center=60, voices=3, bus='pad')
    s.melody(24, two(NOX, NOX_TAIL, 5), 'strings', .48, 'lead', -.15, .35, attack=.1)
    s.melody(28, [(0, 'D5', .5), (.5, 'F5', .5), (1, 'A5', 1), (2, 'G5', 2)], 'bell', .4, 'lead', .25, .35, echo=.25)
    s.melody(29, [(0, 'A5', 1), (1, 'C6', 3)], 'bell', .38, 'lead', .25, .35, echo=.25)
    s.melody(32, bars([(0, 'Eb5', 1), (1, 'G5', 1), (2, 'C6', 2)], [(0, 'Bb5', 2), (2, 'G5', 2)], [(0, 'F#5', 2), (2, 'A5', 2)], [(0, 'D5', 4)]),
             'epiano', .45, 'lead', 0, .35, echo=.2)
    s.melody(36, [(0, 'G5', 4), (4, 'Bb5', 4), (8, 'G5', 4), (12, 'D5', 4), (16, 'Eb5', 4), (20, 'C5', 4), (24, 'A4', 4), (28, 'F#4', 4)],
             'glass', .3, 'keys', .25, .5, echo=.3)


def promise(s: Song):
    """The rooftop: NOX in the piano, LULU in the celesta, the Vortex watch ticking; it stops on A sus4 and never resolves."""
    s.section('domanda', 0, 8); s.section('risposta', 8, 8); s.section('insieme', 16, 8)
    s.progression(0, ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'Gm', 'Asus4'])
    s.progression(8, ['Bb', 'F', 'Gm', 'Dm', 'Bb', 'F', 'Gm', 'Asus4'])
    s.progression(16, ['Dm', 'Bb', 'F', 'C', 'Gm', 'Bb', 'Asus4', '-'])
    s.tick(0, 24, 1.0, .2, pitch=3200.0)
    s.arp(0, 24, 'piano', 1.0, (0, 1, 2, 1), 55, .3, room=.45, pan_sweep=.15, gate=2.5)
    s.pad(0, 24, 'strings', .22, center=57, voices=3, attack=1.0)
    s.melody(0, two(NOX, NOX_TAIL, 12), 'piano', .58, 'lead', -.1, .45)
    s.melody(2, two(LULU, LULU_TAIL, 12), 'bell', .42, 'lead', .25, .45, echo=.25)
    s.melody(4, two(NOX, NOX_TAIL), 'strings', .42, 'lead', -.2, .4, attack=.15)
    s.melody(6, [(0, 'G5', 1), (1, 'Bb5', 1), (2, 'A5', 2), (4, 'D6', 4)], 'bell', .38, 'lead', .25, .45, echo=.25)
    tune = bars([(0, 'D5', 1.5), (1.5, 'C5', .5), (2, 'Bb4', 1), (3, 'F5', 1)], [(0, 'C5', 1), (1, 'F5', 1), (2, 'A5', 2)],
                [(0, 'Bb5', 1.5), (1.5, 'A5', .5), (2, 'G5', 1), (3, 'D5', 1)], [(0, 'F5', 2), (2, 'A4', 2)],
                [(0, 'D5', 1), (1, 'F5', 1), (2, 'Bb5', 2)], [(0, 'C6', 1.5), (1.5, 'A5', .5), (2, 'F5', 2)],
                [(0, 'G5', 1), (1, 'Bb5', 1), (2, 'D5', 2)], [(0, 'E5', 4)])
    s.melody(8, tune, 'strings', .46, 'lead', 0, .45, attack=.12)
    s.pad(12, 4, 'choir', .14, center=62, voices=3, vowel='o')
    s.melody(16, two(NOX, NOX_TAIL, 12), 'piano', .55, 'lead', -.15, .45)
    s.melody(18, two(LULU, LULU_TAIL, 12), 'bell', .4, 'lead', .25, .45, echo=.25)
    s.melody(20, [(0, 'G5', 1), (1, 'Bb5', 1), (2, 'D6', 2), (4, 'D6', 1), (5, 'F6', 1), (6, 'D6', 2)], 'bell', .34, 'lead', .25, .45, echo=.2)
    s.melody(22, [(0, 'A3', 8), (0, 'D4', 8), (0, 'E4', 8), (0, 'A4', 8)], 'piano', .4, 'keys', 0, .55)


def reunion(s: Song):
    """«Posso venire con te?» and everything after: the promise resolves, the 4th falls to the 3rd, NOX and LULU in D major."""
    s.section('ritorno', 0, 8); s.section('promessa mantenuta', 8, 8); s.section('noi due', 16, 8); s.section('casa', 24, 8)
    s.progression(0, ['D', 'A/C#', 'Bm', 'G', 'D', 'A/C#', 'G'] + ['Asus4', 'A'], per_bar=1)
    s.chords[7] = [(0, 'Asus4'), (2, 'A')]
    s.progression(8, ['G', 'A', 'F#m', 'Bm', 'G', 'A', 'D', '-'])
    s.progression(16, ['Bm', 'G', 'D', 'A7', 'Bm', 'G', 'Em', 'A'])
    s.progression(24, ['G', 'A', 'D', 'Bm', 'G', 'A'])
    s.chords[30] = [(0, 'Asus4')]
    s.chords[31] = [(0, 'A')]
    s.arp(0, 32, 'piano', .5, (0, 2, 1, 3, 2, 1, 3, 2), 60, .3, room=.45, pan_sweep=.2, gate=2.0)
    s.pad(0, 32, 'strings', .26, center=60, voices=4, attack=.9, low_root=True)
    nox_major = [(0, 'D4', 1.5), (1.5, 'F#4', .5), (2, 'A4', 1), (3, 'G4', 1)]
    s.melody(0, nox_major + [(4, 'F#4', 1), (5, 'D4', 3)], 'strings', .48, 'lead', -.15, .4, attack=.12)
    s.melody(2, [(0, 'A5', .5), (.5, 'C#6', .5), (1, 'E6', 1), (2, 'D6', 2), (4, 'E6', 1), (5, 'G6', 3)], 'bell', .38, 'lead', .25, .45, echo=.2)
    s.melody(4, bars([(0, 'F#5', 1.5), (1.5, 'E5', .5), (2, 'D5', 1), (3, 'A4', 1)], [(0, 'C#5', 1), (1, 'E5', 1), (2, 'A5', 2)],
                     [(0, 'B5', 1.5), (1.5, 'A5', .5), (2, 'G5', 1), (3, 'D5', 1)], [(0, 'D5', 2), (2, 'C#5', 2)]), 'piano', .55, 'lead', 0, .45)
    s.groove(8, 16, 'soft', .6)
    s.bassline(8, 16, ((0, 2), (2, 1.5), (3.5, .5)), 'bass', 2, .5, degrees=(0, 5, 0), bright=.3)
    s.arp(8, 16, 'pluck', .5, (0, 1, 2, 3, 2, 1, 2, 3), 67, .24, room=.35, echo=.2)
    theme = bars([(0, 'B4', 1.5), (1.5, 'C#5', .5), (2, 'D5', 1), (3, 'G5', 1)], [(0, 'C#5', 1), (1, 'E5', 1), (2, 'A5', 2)],
                 [(0, 'C#6', 1.5), (1.5, 'B5', .5), (2, 'A5', 1), (3, 'F#5', 1)], [(0, 'F#5', 2), (2, 'D5', 2)],
                 [(0, 'D5', 1), (1, 'G5', 1), (2, 'B5', 2)], [(0, 'C#6', 1.5), (1.5, 'B5', .5), (2, 'A5', 1), (3, 'E5', 1)],
                 [(0, 'F#5', 1.5), (1.5, 'E5', .5), (2, 'D5', 2)], [(0, 'A5', 4)])
    s.melody(8, theme, 'strings', .52, 'lead', 0, .45, attack=.08)
    s.melody(8, theme, 'brass', .3, 'lead', -.2, .35, shift=-12)
    duet = bars([(0, 'D5', 1.5), (1.5, 'F#5', .5), (2, 'A5', 1), (3, 'G5', 1)], [(0, 'F#5', 1), (1, 'D5', 3)],
                [(0, 'A5', .5), (.5, 'C#6', .5), (1, 'E6', 1), (2, 'D6', 2)], [(0, 'E6', 1), (1, 'G6', 3)],
                [(0, 'D6', 1.5), (1.5, 'C#6', .5), (2, 'B5', 1), (3, 'F#5', 1)], [(0, 'G5', 1), (1, 'B5', 1), (2, 'D6', 2)],
                [(0, 'E6', 1.5), (1.5, 'D6', .5), (2, 'B5', 1), (3, 'G5', 1)], [(0, 'C#6', 2), (2, 'A5', 2)])
    s.melody(16, duet, 'strings', .5, 'lead', .1, .45, attack=.06)
    s.melody(16, duet, 'piano', .32, 'keys', -.2, .4, shift=-12)
    s.pad(16, 8, 'choir', .2, center=64, voices=3, vowel='o')
    s.hit('timpani', 16 * 4, .6, 'drums', 0, room=.3, f=73.42)
    s.melody(24, [(0, 'B5', 2), (2, 'D6', 2), (4, 'C#6', 4), (8, 'A5', 4), (12, 'F#5', 4), (16, 'B5', 2), (18, 'G5', 2), (20, 'E5', 4)],
             'glass', .3, 'keys', .3, .5, echo=.3)
    s.melody(30, [(0, 'D5', 4), (4, 'C#5', 4)], 'piano', .5, 'lead', 0, .5)


def archon(s: Song):
    """Archon, the collapse of the Axis, Chrono Shadows: ARCHON over a D pedal, organ and choir, and the title theme
    coming back as the heroes' answer."""
    s.section('trono', 0, 8); s.section('pressione', 8, 8); s.section('eroi', 16, 16); s.section('archon', 32, 8)
    s.section('scontro', 40, 16); s.section('crollo', 56, 8)
    s.progression(0, ['Eb/D', 'Ab', 'Dm', 'A', 'Eb/D', 'Ab', 'Bbm', 'A'])
    s.progression(8, ['Gm', 'Ab', 'Dm', '-', 'Gm', 'Ab', 'A', '-'])
    s.progression(16, THEME_CHORDS[:-2] + ['Dm', 'A'])
    s.progression(32, ['Eb/D', 'Ab', 'Dm', '-', 'Eb/D', 'Ab', 'A', '-'])
    s.progression(40, ['Eb/D', 'Ab', 'Dm', 'A', 'Eb/D', 'Ab', 'Bbm', 'A', 'Gm', 'Ab', 'Dm', '-', 'Gm', 'Ab', 'A', '-'])
    s.progression(56, ['Gm', 'Ab', 'Dm', '-', 'Bbm', '-', 'A', '-'])
    s.pad(0, 16, 'organ', .26, center=57, voices=3)
    s.pad(0, 16, 'choir', .26, center=62, voices=3)
    s.melody(0, ARCHON, 'brass', .66, 'lead', 0, .3)
    s.melody(4, ARCHON, 'brass', .66, 'lead', 0, .3)
    s.melody(4, ARCHON, 'choir', .4, 'lead', .1, .35, shift=24)
    for bar in range(0, 8, 2):
        s.hit('timpani', bar * 4, .9, 'drums', 0, room=.3, variants=2, f=73.42)
    s.groove(0, 8, 'taiko', .7, fill=False)
    s.groove(8, 8, 'taiko', .95)
    s.groove(8, 8, 'march', .55, fill=False, bus='perc')
    s.bassline(0, 64, tuple((k * .5, .45) for k in range(8)), 'reese', 2, .62, degrees=(0, 0, 0, 8, 0, 0, 0, 8))
    s.arp(8, 8, 'spiccato', .25, (0, 1, 2, 1, 3, 1, 2, 1), 55, .4, room=.15, pan_sweep=.5)
    s.melody(8, [(0, 'D5', 2), (2, 'Eb5', 1), (3, 'D5', 1), (4, 'Ab4', 4), (16, 'D5', 2), (18, 'Eb5', 1), (19, 'D5', 1), (20, 'C#5', 4)][0:0]
             + [(0, 'Bb4', 2), (2, 'D5', 2), (4, 'C5', 2), (6, 'Eb5', 2), (8, 'D5', 4), (12, 'F5', 4), (16, 'G5', 2), (18, 'Bb4', 2),
                (20, 'C5', 2), (22, 'Eb5', 2), (24, 'C#5', 4), (28, 'E5', 4)], 'choir', .34, 'lead', 0, .35)
    s.riser(16, 4, .55)
    s.impact(16, .6)
    s.groove(16, 16, 'break', 1.0, crash_first=True)
    s.groove(16, 16, 'taiko', .6, fill=False, bus='perc')
    s.arp(16, 16, 'spiccato', .25, (0, 1, 2, 1, 3, 1, 2, 1), 57, .4, room=.15, pan_sweep=.5)
    s.pad(16, 16, 'strings', .3, center=62, voices=4)
    s.melody(16, up(THEME, -12), 'brass', .66, 'lead', 0, .25)
    s.melody(24, up(THEME2, -12), 'brass', .62, 'lead', 0, .25)
    s.melody(24, THEME2, 'strings', .36, 'lead', .2, .3, attack=.04)
    s.melody(16, THEME, 'strings', .3, 'lead', .2, .3, attack=.04)
    s.pad(32, 8, 'choir', .36, center=62, voices=4)
    s.pad(32, 8, 'organ', .24, center=55, voices=3)
    s.melody(32, ARCHON, 'brass', .7, 'lead', 0, .3)
    s.melody(36, ARCHON, 'brass', .7, 'lead', 0, .3)
    s.groove(32, 8, 'taiko', .9)
    s.riser(40, 8, .55)
    s.impact(40, .6)
    s.groove(40, 16, 'break', 1.0, crash_first=True)
    s.groove(40, 16, 'taiko', .7, fill=False, bus='perc')
    s.arp(40, 16, 'spiccato', .25, (0, 1, 2, 1, 3, 1, 2, 1), 57, .4, room=.15, pan_sweep=.5)
    s.melody(40, ARCHON + [(16 + a, n, d) for a, n, d in ARCHON], 'brass', .6, 'lead', -.2, .25)
    s.melody(40, [(0, 'D5', 4), (4, 'C5', 4), (8, 'D5', 4), (12, 'C#5', 4), (16, 'D5', 4), (20, 'Eb5', 4), (24, 'F5', 4), (28, 'E5', 4),
                  (32, 'D5', 4), (36, 'C5', 4), (40, 'D5', 4), (44, 'F5', 4), (48, 'Bb4', 4), (52, 'C5', 4), (56, 'C#5', 4), (60, 'E5', 4)],
             'choir', .36, 'lead', .15, .35)
    s.melody(48, THEME[:16], 'strings', .45, 'lead', .2, .3, attack=.04, shift=-12)
    s.melody(56, [(0, 'G4', 4), (4, 'Ab4', 4), (8, 'A4', 8), (16, 'Bb4', 8), (24, 'C#5', 8)], 'brass', .55, 'lead', 0, .3)
    s.groove(56, 8, 'taiko', 1.0)
    s.riser(64, 8, .5)


SPEC = {
    'title': dict(fn=title, bpm=96, bars=40, seed=3801, target=-16.0, kbps=72, cues=['title_theme'],
                  mix=dict(room=(2.6, 2.0, .9), room_level=.6, echo_step=.75)),
    'refuge': dict(fn=refuge, bpm=80, bars=32, seed=3802, target=-16.0, kbps=64, cues=['refuge_theme', 'tessa_workbench'],
                   mix=dict(room=(2.8, 2.2, 1.0), room_level=.7, echo_step=.75)),
    'nox': dict(fn=nox, bpm=100, bars=48, seed=3803, target=-16.0, kbps=64,
                cues=['nox', 'blackout', 'breach', 'zero', 'docks_veyra', 'chalk_route', 'port_stealth'],
                mix=dict(room=(2.2, 1.7, .8), room_level=.55, echo_step=.75)),
    'lulu': dict(fn=lulu, bpm=108, bars=48, seed=3804, target=-16.0, kbps=64, cues=['lulu', 'contagion', 'glass_flood'],
                 mix=dict(room=(2.0, 1.6, .8), room_level=.5, echo_step=.75)),
    'danger': dict(fn=danger, bpm=140, bars=64, seed=3805, target=-16.0, kbps=72, cues=['danger'],
                   mix=dict(room=(1.6, 1.2, .6), room_level=.4, echo_step=.75)),
    'danger_b': dict(fn=danger_b, bpm=150, bars=64, seed=3806, target=-16.0, kbps=72, cues=['danger_b'],
                     mix=dict(room=(1.6, 1.2, .6), room_level=.4, echo_step=.75, duck=.25)),
    'drive': dict(fn=drive, bpm=128, bars=48, seed=3807, target=-16.0, kbps=72, cues=['driving'],
                  mix=dict(room=(1.8, 1.4, .7), room_level=.45, echo_step=.75, duck=.4)),
    'race': dict(fn=race, bpm=152, bars=64, seed=3808, target=-16.0, kbps=72, fade_ms=10.0, cues=['veyra_championship', 'veyra_championship_night'],
                 mix=dict(room=(1.6, 1.2, .6), room_level=.4, echo_step=.75, duck=.2)),
    'boss': dict(fn=boss, bpm=132, bars=56, seed=3809, target=-16.0, kbps=72,
                 cues=['rook_line', 'anchor_fight_loop', 'bone_tyrant', 'warden_node', 'forge_behemoth', 'glass_reaper'],
                 mix=dict(room=(2.2, 1.6, .7), room_level=.45, echo_step=.75)),
    'vega': dict(fn=vega, bpm=120, bars=48, seed=3810, target=-16.0, kbps=72, cues=['vega_duel'],
                 mix=dict(room=(1.8, 1.4, .7), room_level=.45, echo_step=.75)),
    'eve': dict(fn=eve, bpm=120, bars=52, seed=3811, target=-16.0, kbps=64, cues=['archive_theme'],
                mix=dict(room=(2.6, 2.0, 1.0), room_level=.6, echo_step=.75)),
    'depths': dict(fn=depths, bpm=92, bars=44, seed=3812, target=-16.0, kbps=64,
                   cues=['below_descent', 'toxic_bazaar', 'clockwork_outpost', 'axis_ascent', 'strangers_rift'],
                   mix=dict(room=(2.4, 1.8, .9), room_level=.6, echo_step=.75)),
    'promise': dict(fn=promise, bpm=72, bars=24, seed=3813, target=-16.0, kbps=64, cues=['promise_theme'],
                    mix=dict(room=(3.0, 2.4, 1.1), room_level=.75, echo_step=.75)),
    'reunion': dict(fn=reunion, bpm=76, bars=32, seed=3814, target=-16.0, kbps=64, cues=['reunion'],
                    mix=dict(room=(2.8, 2.2, 1.0), room_level=.7, echo_step=.75)),
    'archon': dict(fn=archon, bpm=138, bars=64, seed=3815, target=-16.0, kbps=72, cues=['archon_finale'],
                   mix=dict(room=(2.4, 1.8, .8), room_level=.5, echo_step=.75)),
}
