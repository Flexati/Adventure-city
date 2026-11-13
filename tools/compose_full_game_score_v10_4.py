"""V10.4 full-game score generator for CHRONOS Adventure: Nox & Lulù.

Generates 14 original seamless-looping Ogg Vorbis music tracks in game/audio/v10/
using pure Python stdlib (math, array, wave, subprocess, tempfile) + ffmpeg
to ensure continuous, distinct musical coverage across all 44 campaign stages,
4 village hubs, and all 9 bosses (~150 minutes of gameplay).
"""
from pathlib import Path
import array
import math
import subprocess
import tempfile
import wave

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'game/audio/v10'
SR = 22050  # Fast synthesis, resampled to 44.1kHz stereo Ogg Vorbis by ffmpeg

hz = lambda m: 440.0 * (2.0 ** ((m - 69.0) / 12.0))

# Chords: (bass_midi, [pad_voicing], [arp_tones])
DM = (38, [57, 62, 65, 69], [50, 57, 62, 65])
BB = (34, [58, 62, 65, 69], [46, 53, 58, 62])
F_ = (41, [57, 60, 65, 69], [53, 57, 60, 65])
C_ = (36, [55, 60, 64, 67], [48, 55, 60, 64])
GM = (43, [55, 58, 62, 67], [55, 58, 62, 67])
A_ = (33, [57, 61, 64, 69], [45, 52, 57, 61])
ASUS = (33, [57, 62, 64, 69], [45, 52, 57, 62])
EM = (40, [55, 59, 64, 67], [52, 55, 59, 64])
E_ = (40, [56, 59, 64, 68], [52, 56, 59, 64])
AM = (33, [57, 60, 64, 69], [45, 52, 57, 60])
CM = (36, [55, 60, 63, 67], [48, 55, 60, 63])
FM = (41, [56, 60, 65, 68], [53, 56, 60, 65])
AB = (44, [56, 60, 63, 68], [44, 51, 56, 60])
EB = (39, [55, 58, 63, 67], [51, 55, 58, 63])
DB = (37, [56, 61, 65, 68], [49, 56, 61, 65])
D_PHRYG = (38, [57, 62, 63, 69], [50, 53, 57, 62])
A_DOM = (33, [55, 61, 64, 69], [45, 52, 55, 61])

NOX = [(0.0, 62, 1.5), (1.5, 65, 0.5), (2.0, 69, 1.0), (3.0, 67, 1.0), (4.0, 65, 1.0), (5.0, 62, 3.0)]
LULU = [(0.0, 69, 0.5), (0.5, 72, 0.5), (1.0, 76, 1.0), (2.0, 74, 2.0), (4.0, 76, 1.0), (5.0, 79, 3.0)]


def add_note(buf_l, buf_r, n_total, start_s, dur_s, midi, voice, vel, pan=0.0):
    f = hz(midi)
    tail = 0.45 if voice in ('epiano', 'bell', 'pad') else 0.12
    length = int((dur_s + tail) * SR)
    s0 = int(start_s * SR)
    l_gain = math.sqrt((1.0 - pan) * 0.5) * vel
    r_gain = math.sqrt((1.0 + pan) * 0.5) * vel
    two_pi_f = 2.0 * math.pi * f

    for i in range(length):
        t = i / SR
        att = min(1.0, t / (0.04 if voice == 'pad' else 0.005))
        rel = max(0.0, 1.0 - max(0.0, t - dur_s) / tail)
        if voice == 'bass':
            raw = math.sin(two_pi_f * t) + 0.45 * math.sin(2.0 * two_pi_f * t) + 0.2 * math.sin(3.0 * two_pi_f * t)
            sig = math.tanh(1.8 * raw) * att * rel * math.exp(-t * 1.4)
        elif voice == 'pad':
            sig = (math.sin(two_pi_f * t) + 0.5 * math.sin(two_pi_f * 1.004 * t + 0.7) + 0.35 * math.sin(2.0 * two_pi_f * t)) * 0.55 * att * rel
        elif voice == 'bell':
            mod = 1.6 * math.exp(-t * 3.0) * math.sin(two_pi_f * 3.5 * t)
            sig = math.sin(two_pi_f * t + mod) * math.exp(-t * 1.8) * att * rel
        elif voice == 'tick':
            sig = math.sin(2.0 * math.pi * f * t + 3.0 * math.sin(two_pi_f * 2.7 * t)) * math.exp(-t * 45.0)
        else:  # epiano
            mod = (1.3 * math.exp(-t * 3.5) + 0.2) * math.sin(two_pi_f * 2.0 * t)
            sig = (math.sin(two_pi_f * t + mod) + 0.15 * math.sin(two_pi_f * 6.0 * t) * math.exp(-t * 18.0)) * math.exp(-t * 1.5) * att * rel

        idx = (s0 + i) % n_total
        buf_l[idx] += sig * l_gain
        buf_r[idx] += sig * r_gain


def build_cue(name, bpm, bars, prog, style='explore', shift=0):
    beat = 60.0 / bpm
    n_total = int(round(SR * bars * 4 * beat))
    buf_l = [0.0] * n_total
    buf_r = [0.0] * n_total

    for bar in range(bars):
        root, voicing, tones = prog[bar % len(prog)]
        at = bar * 4.0
        arc = 0.7 + 0.3 * math.sin(math.pi * (bar + 0.5) / bars)
        # Pad chord
        for j, m in enumerate(voicing):
            pan = -0.45 + 0.9 * (j / max(1, len(voicing) - 1))
            add_note(buf_l, buf_r, n_total, at * beat, 3.9 * beat, m + shift, 'pad', 0.085 * arc, pan)

        if style == 'boss':
            for s_i in range(8):
                bn = root + (12 if s_i in (3, 7) else 0) + (7 if s_i == 5 else 0)
                add_note(buf_l, buf_r, n_total, (at + s_i * 0.5) * beat, 0.42 * beat, bn, 'bass', 0.22 * arc, 0.0)
                tn = tones[(s_i * 3 + bar) % len(tones)] + shift + (12 if s_i % 2 else 0)
                add_note(buf_l, buf_r, n_total, (at + s_i * 0.5) * beat, 0.40 * beat, tn, 'epiano', 0.12 * arc, 0.3 if s_i % 2 else -0.3)
                add_note(buf_l, buf_r, n_total, (at + s_i * 0.5) * beat, 0.06 * beat, 84 + (s_i % 3) * 3, 'tick', 0.07, -0.25 if s_i % 2 else 0.25)
        elif style == 'stealth':
            add_note(buf_l, buf_r, n_total, at * beat, 1.8 * beat, root, 'bass', 0.19 * arc, 0.0)
            add_note(buf_l, buf_r, n_total, (at + 2.5) * beat, 1.2 * beat, root + 7, 'bass', 0.14 * arc, 0.0)
            for s_i in range(4):
                tn = tones[(s_i + bar) % len(tones)] + shift + 12
                add_note(buf_l, buf_r, n_total, (at + s_i) * beat, 0.85 * beat, tn, 'bell', 0.11 * arc, 0.35 if s_i % 2 else -0.35)
        elif style == 'village':
            add_note(buf_l, buf_r, n_total, at * beat, 2.1 * beat, root, 'bass', 0.19 * arc, 0.0)
            add_note(buf_l, buf_r, n_total, (at + 2.5) * beat, 1.3 * beat, root + 7, 'bass', 0.15 * arc, 0.0)
            for s_i in range(8):
                tn = tones[(s_i + bar) % len(tones)] + shift
                add_note(buf_l, buf_r, n_total, (at + s_i * 0.5) * beat, 0.55 * beat, tn, 'epiano', 0.11 * arc, 0.25 if s_i % 2 else -0.25)
        else:
            add_note(buf_l, buf_r, n_total, at * beat, 1.4 * beat, root, 'bass', 0.20 * arc, 0.0)
            add_note(buf_l, buf_r, n_total, (at + 1.5) * beat, 0.9 * beat, root, 'bass', 0.16 * arc, 0.0)
            add_note(buf_l, buf_r, n_total, (at + 2.5) * beat, 1.3 * beat, root + 7, 'bass', 0.18 * arc, 0.0)
            for s_i in range(8):
                tn = tones[(s_i * 2 + bar) % len(tones)] + shift
                add_note(buf_l, buf_r, n_total, (at + s_i * 0.5) * beat, 0.50 * beat, tn, 'epiano', 0.115 * arc, 0.28 if s_i % 2 else -0.28)
            for k in range(4):
                add_note(buf_l, buf_r, n_total, (at + k) * beat, 0.05 * beat, 84 + (k == 0) * 3, 'tick', 0.055, -0.2 if k % 2 else 0.2)

    # Leitmotif phrases
    for b_off, m, d in NOX:
        add_note(buf_l, buf_r, n_total, (4.0 + b_off) * beat, d * beat, m + shift, 'epiano', 0.24, -0.22)
    for b_off, m, d in LULU:
        add_note(buf_l, buf_r, n_total, (16.0 + b_off) * beat, d * beat, m + shift, 'bell', 0.20, 0.24)
    if bars >= 8:
        for b_off, m, d in NOX:
            add_note(buf_l, buf_r, n_total, (24.0 + b_off * 0.5) * beat, d * 0.5 * beat, m + shift + 12, 'epiano', 0.22, -0.18)

    # Circular stereo delay/reverb tap for lush room cohesion
    tap1 = int(0.18 * SR)
    tap2 = int(0.31 * SR)
    peak = 1e-6
    out_l = [0.0] * n_total
    out_r = [0.0] * n_total
    for i in range(n_total):
        vl = buf_l[i] + 0.26 * buf_r[(i - tap1) % n_total] + 0.14 * buf_l[(i - tap2) % n_total]
        vr = buf_r[i] + 0.26 * buf_l[(i - tap1) % n_total] + 0.14 * buf_r[(i - tap2) % n_total]
        out_l[i] = vl
        out_r[i] = vr
        av = max(abs(vl), abs(vr))
        if av > peak:
            peak = av

    scale = 0.82 / peak
    pcm = array.array('h', [0] * (n_total * 2))
    for i in range(n_total):
        pcm[i * 2] = int(max(-1.0, min(1.0, math.tanh(out_l[i] * scale * 1.2))) * 32000)
        pcm[i * 2 + 1] = int(max(-1.0, min(1.0, math.tanh(out_r[i] * scale * 1.2))) * 32000)

    OUT.mkdir(parents=True, exist_ok=True)
    ogg = OUT / f'{name}.ogg'
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'm.wav'
        with wave.open(str(wav), 'wb') as w:
            w.setnchannels(2)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        subprocess.run([
            'ffmpeg', '-v', 'error', '-y', '-i', str(wav),
            '-ar', '44100', '-ac', '2', '-c:a', 'libvorbis', '-q:a', '5',
            str(ogg)
        ], check=True)
    return ogg


SPECS = [
    ('docks_veyra', 104, 8, [DM, GM, BB, A_DOM, DM, C_, BB, ASUS], 'explore', 0),
    ('bone_tyrant', 128, 8, [D_PHRYG, BB, GM, A_DOM, D_PHRYG, EB, A_DOM, DM], 'boss', 0),
    ('warden_node', 132, 8, [CM, AB, FM, GM, CM, EB, AB, A_DOM], 'boss', -2),
    ('below_descent', 92, 8, [AM, FM, DM, E_, AM, C_, DM, E_], 'stealth', -2),
    ('toxic_bazaar', 96, 8, [GM, EB, CM, D_PHRYG, GM, BB, EB, A_DOM], 'village', 2),
    ('forge_behemoth', 124, 8, [EM, F_, DM, E_, EM, C_, BB, E_], 'boss', -3),
    ('port_stealth', 88, 8, [CM, FM, AB, GM, CM, EB, FM, GM], 'stealth', 0),
    ('glass_flood', 112, 8, [FM, DB, AB, EB, FM, CM, DB, C_], 'explore', 3),
    ('glass_reaper', 136, 8, [AM, F_, DM, E_, AM, BB, DM, E_], 'boss', 4),
    ('vega_duel', 134, 8, [DM, A_DOM, BB, GM, DM, C_, F_, A_DOM], 'boss', 2),
    ('archive_theme', 98, 8, [AM, F_, C_, GM, AM, DM, F_, E_], 'explore', 5),
    ('clockwork_outpost', 88, 8, [DM, C_, BB, ASUS, DM, GM, F_, A_], 'village', 0),
    ('axis_ascent', 118, 8, [DM, BB, F_, C_, GM, BB, C_, A_DOM], 'explore', 2),
    ('archon_finale', 140, 8, [DM, BB, GM, A_DOM, D_PHRYG, F_, C_, A_DOM], 'boss', 0),
]


if __name__ == '__main__':
    for spec in SPECS:
        p = build_cue(*spec)
        print(f"Generated {p.name} ({p.stat().st_size} B)")
    print(f"Completed {len(SPECS)} full-game tracks.")
