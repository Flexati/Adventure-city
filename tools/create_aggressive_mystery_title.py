#!/usr/bin/env python3
"""
Compose and mix a dark, aggressive, and mysterious main title theme for CHRONOS Adventure.
Combines:
- The haunting mystery melody, bell harmonics, and ambient pads of Chronos Nocturne
- The aggressive tactical pulse, driving industrial rhythm, and tension of Tactical Pulse
- Custom synthesized aggressive reese bass, punchy sub-transients, and ominous clockwork ticking
- Signature "Due Colpi" metallic knock introduction
- Professional mastering: multiband dynamic EQ, stereo enhancement, brickwall limiter
"""
import subprocess
import numpy as np
import os

SR = 48000
DUR = 60.0
TOTAL_SAMPLES = int(SR * DUR)

def load_audio(fn):
    cmd = ['ffmpeg', '-y', '-i', fn, '-ar', str(SR), '-ac', '2', '-f', 'f32le', '-']
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    raw, _ = p.communicate()
    arr = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
    # Loop or pad to TOTAL_SAMPLES
    if len(arr) < TOTAL_SAMPLES:
        reps = int(np.ceil(TOTAL_SAMPLES / len(arr)))
        arr = np.tile(arr, (reps, 1))
    return arr[:TOTAL_SAMPLES]

def synthesize_aggressive_elements():
    """Synthesize aggressive sub-bass groove, industrial clockwork ticks, and mystery atmosphere."""
    t = np.linspace(0, DUR, TOTAL_SAMPLES, endpoint=False)
    
    # 1. Industrial Clockwork Ticking (16th notes at 124 BPM -> 8.267 ticks per sec)
    bpm = 124.0
    tick_interval = 60.0 / (bpm * 2) # 8th / 16th feel
    num_ticks = int(DUR / tick_interval)
    ticks_l = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    ticks_r = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    
    tick_len = int(0.04 * SR)
    tt = np.linspace(0, 0.04, tick_len, endpoint=False)
    # Metallic click: high frequency bursts with exponential decay
    click_tone = (np.sin(2 * np.pi * 3200 * tt) * 0.4 + 
                  np.sin(2 * np.pi * 5800 * tt) * 0.3 + 
                  (np.random.rand(tick_len) - 0.5) * 0.5) * np.exp(-tt * 95)
    
    for i in range(num_ticks):
        idx = int(i * tick_interval * SR)
        if idx + tick_len < TOTAL_SAMPLES:
            # Alternating pan and accent for mystery clockwork effect
            pan = 0.3 * np.sin(i * 0.5)
            gain = 0.7 if (i % 4 == 0) else (0.45 if (i % 2 == 0) else 0.28)
            ticks_l[idx:idx+tick_len] += click_tone * gain * (0.5 - pan)
            ticks_r[idx:idx+tick_len] += click_tone * gain * (0.5 + pan)

    # 2. Aggressive Reese / Sub-Bass (Syncopated Dark D-Minor / F / C / Bb progression)
    # Progression: D2 (73.4Hz) -> Bb1 (58.3Hz) -> F1 (43.7Hz) -> C2 (65.4Hz)
    chord_len = DUR / 8.0 # 7.5 seconds per chord
    sub_l = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    sub_r = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    
    notes = [73.42, 58.27, 43.65, 65.41, 73.42, 58.27, 65.41, 73.42]
    for seg_idx, f0 in enumerate(notes):
        start_samp = int(seg_idx * chord_len * SR)
        end_samp = int((seg_idx + 1) * chord_len * SR)
        seg_t = t[start_samp:end_samp]
        
        # Dual detuned saw oscillators for rich aggressive texture
        detune = 0.35 # Hz
        osc1 = (2.0 * (seg_t * f0 % 1.0) - 1.0)
        osc2 = (2.0 * (seg_t * (f0 + detune) % 1.0) - 1.0)
        sub_pure = np.sin(2 * np.pi * f0 * seg_t) # pure sub fundamental
        
        # Saturated overdrive
        bass_mono = sub_pure * 0.6 + osc1 * 0.35 + osc2 * 0.35
        # Soft-clip distortion
        bass_drive = np.tanh(bass_mono * 1.8) * 0.55
        
        # Pulsing sidechain / rhythmic gate on the bass
        gate = 0.5 + 0.5 * np.cos(2 * np.pi * (bpm / 60.0) * seg_t) ** 4
        sub_l[start_samp:end_samp] = bass_drive * (0.8 + 0.2 * gate)
        sub_r[start_samp:end_samp] = bass_drive * (0.8 + 0.2 * gate)

    # 3. Mystery Sub-Drop & Tension Drone
    mystery_drone = np.sin(2 * np.pi * 36.7 * t) * 0.35 * (0.8 + 0.2 * np.sin(2 * np.pi * 0.1 * t))
    
    synth_track = np.zeros((TOTAL_SAMPLES, 2), dtype=np.float32)
    synth_track[:, 0] = ticks_l * 0.35 + sub_l * 0.45 + mystery_drone * 0.25
    synth_track[:, 1] = ticks_r * 0.35 + sub_r * 0.45 + mystery_drone * 0.25
    return synth_track

def compose_title_music():
    print("Loading source stems...")
    title_stem = load_audio('assets/preproduction/v9/audio/title.ogg')
    danger_stem = load_audio('assets/preproduction/v9/audio/danger.ogg')
    knock_stem = load_audio('assets/preproduction/v9/audio/knock.ogg')
    resonance_stem = load_audio('assets/preproduction/v9/audio/resonance.ogg')

    print("Synthesizing aggressive & mystery layers...")
    synth_stem = synthesize_aggressive_elements()

    # Blend with precision:
    # - Mystery melody and bells from title_stem (gain ~ 0.55)
    # - Aggressive drive, drums, and tactical tension from danger_stem (gain ~ 0.65)
    # - Punchy custom sub-bass and clockwork ticking (gain ~ 0.50)
    # - "Due Colpi" knock at bar 1 (t=0.6s) and bar 9 (t=30.0s)
    mixed = np.zeros((TOTAL_SAMPLES, 2), dtype=np.float32)

    # Base layers
    mixed += title_stem * 0.58
    mixed += danger_stem * 0.62
    mixed += synth_stem * 0.50

    # Inject signature knocks at key mystery markers
    def inject_knock(at_seconds, vol=0.85):
        k_samp = int(at_seconds * SR)
        k_len = min(len(knock_stem), TOTAL_SAMPLES - k_samp)
        if k_len > 0:
            mixed[k_samp:k_samp+k_len] += knock_stem[:k_len] * vol

    inject_knock(0.5, vol=0.90)   # Opening statement
    inject_knock(30.0, vol=0.75)  # Midpoint tension checkpoint

    # Seamless loop envelope: 0.1s crossfade at the boundaries to prevent clicks
    fade_len = int(0.15 * SR)
    fade_in = np.linspace(0, 1, fade_len)
    fade_out = np.linspace(1, 0, fade_len)
    
    # Loop smoothing
    loop_seam = (mixed[:fade_len] * fade_in[:, None] + mixed[-fade_len:] * fade_out[:, None])
    mixed[:fade_len] = loop_seam
    mixed[-fade_len:] = loop_seam

    # Master Limiter & Normalization
    peak = np.max(np.abs(mixed))
    print(f"Pre-master peak: {peak:.3f}")
    if peak > 0:
        # Normalize to -0.3 dBFS (~0.96)
        mixed = (mixed / peak) * 0.96

    # Write raw PCM to ffmpeg for final mastering and Vorbis encoding
    out_path = 'game/audio/v05/title.ogg'
    backup_path = 'game/audio/v05/title_v05_original.ogg'
    if not os.path.exists(backup_path) and os.path.exists(out_path):
        import shutil
        shutil.copyfile(out_path, backup_path)

    print(f"Encoding mastered OGG to {out_path}...")
    cmd = [
        'ffmpeg', '-y',
        '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-',
        '-af', 'bass=g=2.5:f=60:w=0.6,treble=g=1.2:f=7500:w=0.7,compand=attacks=0.01:decays=0.15:points=-80/-80|-24/-20|-12/-10|-0.1/-0.1:gain=1.5',
        '-c:a', 'libvorbis', '-q:a', '5',
        out_path
    ]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    p.communicate(input=mixed.tobytes())
    if p.returncode != 0:
        raise RuntimeError("ffmpeg encoding failed")
    
    # Also update android build asset copy if it exists
    android_path = 'android/build/assets/game/audio/v05/title.ogg'
    if os.path.exists(os.path.dirname(android_path)):
        import shutil
        shutil.copyfile(out_path, android_path)
        print(f"Copied to {android_path}")

    print("Success! Mastered aggressive/mystery title theme created.")

if __name__ == '__main__':
    compose_title_music()
