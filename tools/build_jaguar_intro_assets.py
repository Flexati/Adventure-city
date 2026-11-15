#!/usr/bin/env python3
"""
Slice and pixel-align the 3 JaguarZCreatorZ studio intro frames into:
  - game/art/brand/jaguar_intro_f1.webp (Frame 1: fierce white/black jaguar head)
  - game/art/brand/jaguar_intro_f2.webp (Frame 2: electrified jaguar head + blue neon rim + lightning)
  - game/art/brand/jaguar_intro_f3.webp (Frame 3: electrified jaguar head + JAGUARZCREATORZ metallic wordmark + blade + lightning storm)
And synthesize the mastered 4.4s studio anthem:
  - game/audio/v10/jaguar_intro_theme.ogg
"""
from pathlib import Path
import subprocess
import tempfile
import wave
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC_IMG = ROOT / "src/assets/images/jaguarzcreatorz_intro_frames_1794755861435.jpg"
BRAND_DIR = ROOT / "game/art/brand"
AUDIO_DIR = ROOT / "game/audio/v10"


def extract_rgba_panel(rgb_crop: np.ndarray, mode: str = "f1") -> Image.Image:
    """Convert a black-background RGB crop into a crisp RGBA image keeping solid dark outlines on the emblem/text and clean glow on lightning."""
    arr = rgb_crop.astype(np.float32)
    h, w, _ = arr.shape
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    lum = np.maximum(np.maximum(r, g), b)
    blue_glow = np.clip(b - 0.45 * (r + g), 0, 255)

    if mode == "f1":
        # Frame 1: clean white/black jaguar head on pure black background
        fur_mask = (lum > 38).astype(np.uint8) * 255
        fur_img = Image.fromarray(fur_mask, mode="L")
        dilated = fur_img.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(1.4))
        alpha = np.clip((np.array(dilated, dtype=np.float32) - 20.0) * (255.0 / 160.0), 0, 255)
    else:
        # Frames 2 & 3: separate thick emblem core (jaguar head + wordmark + blade) from thin lightning bolts
        # Erode first with MinFilter(7) so thin lightning filaments disappear, leaving only the solid head & letters,
        # then dilate with MaxFilter(19) so the dark ink interior and black outer contour of the head & letters stay 100% opaque!
        bright_core = ((lum > 110) | (blue_glow > 75)).astype(np.uint8) * 255
        core_img = Image.fromarray(bright_core, mode="L")
        eroded = core_img.filter(ImageFilter.MinFilter(7))
        emblem_hull = np.array(
            eroded.filter(ImageFilter.MaxFilter(21)).filter(ImageFilter.GaussianBlur(2.0)),
            dtype=np.float32,
        )
        emblem_alpha = np.clip((emblem_hull - 16.0) * (255.0 / 130.0), 0, 255)

        # For the outer lightning bolts & neon glow, derive alpha smoothly from luminance + blue glow
        bolt_alpha = np.clip((lum - 14.0) * 1.45 + blue_glow * 2.1, 0, 255)
        alpha = np.maximum(emblem_alpha, bolt_alpha)

        # Boost RGB brightness slightly on semi-transparent lightning pixels so they never look muddy
        bolt_only = (emblem_alpha < 40) & (bolt_alpha > 10)
        arr[bolt_only, 0] = np.clip(arr[bolt_only, 0] * 1.15, 0, 255)
        arr[bolt_only, 1] = np.clip(arr[bolt_only, 1] * 1.20, 0, 255)
        arr[bolt_only, 2] = np.clip(arr[bolt_only, 2] * 1.30, 0, 255)

    # Smooth elliptical + border feather so outer lightning tips fade naturally
    vy = np.minimum(np.arange(h), np.arange(h)[::-1])
    vx = np.minimum(np.arange(w), np.arange(w)[::-1])
    edge_y = np.clip(vy / 26.0, 0.0, 1.0)[:, None]
    edge_x = np.clip(vx / 32.0, 0.0, 1.0)[None, :]
    alpha = alpha * edge_y * edge_x

    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[:, :, :3] = np.clip(arr, 0, 255).astype(np.uint8)
    rgba[:, :, 3] = np.clip(alpha, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba, mode="RGBA")


def find_head_translation(ref_rgb: np.ndarray, mov_rgb: np.ndarray) -> tuple[int, int]:
    """Find (dx, dy) that aligns mov_rgb's jaguar head interior onto ref_rgb's jaguar head interior."""
    def fur_feature(a):
        f = a.astype(np.float32)
        lum = f.max(axis=2)
        sat = f.max(axis=2) - f.min(axis=2)
        return ((lum > 185) & (sat < 45)).astype(np.float32)

    fa = fur_feature(ref_rgb)
    fb = fur_feature(mov_rgb)
    best_score = -1.0
    best_shift = (0, 0)
    for dy in range(-45, 46, 3):
        for dx in range(-60, 61, 3):
            y0a = max(0, dy)
            y1a = min(fa.shape[0], fb.shape[0] + dy)
            x0a = max(0, dx)
            x1a = min(fa.shape[1], fb.shape[1] + dx)
            if y1a <= y0a or x1a <= x0a:
                continue
            sub_a = fa[y0a:y1a, x0a:x1a]
            sub_b = fb[y0a - dy : y1a - dy, x0a - dx : x1a - dx]
            score = float((sub_a * sub_b).sum())
            if score > best_score:
                best_score = score
                best_shift = (dx, dy)
    bx, by = best_shift
    for dy in range(by - 3, by + 4):
        for dx in range(bx - 3, bx + 4):
            y0a = max(0, dy)
            y1a = min(fa.shape[0], fb.shape[0] + dy)
            x0a = max(0, dx)
            x1a = min(fa.shape[1], fb.shape[1] + dx)
            sub_a = fa[y0a:y1a, x0a:x1a]
            sub_b = fb[y0a - dy : y1a - dy, x0a - dx : x1a - dx]
            score = float((sub_a * sub_b).sum())
            if score > best_score:
                best_score = score
                best_shift = (dx, dy)
    return best_shift


def build_frames():
    im = Image.open(SRC_IMG).convert("RGB")
    arr = np.array(im)

    f1_raw = arr[8:342, 110:610].copy()
    f2_raw = arr[0:346, 750:1366].copy()
    f3_raw = arr[320:768, 100:1276].copy()
    # Cleanly mask out top-left and top-right in f3_raw where Frame 1/2 bottom tips were near y < 64
    for y in range(64):
        fade = np.clip((y - 24.0) / 40.0, 0.0, 1.0)
        f3_raw[y, :330] = (f3_raw[y, :330] * fade).astype(np.uint8)
        f3_raw[y, 760:] = (f3_raw[y, 760:] * fade).astype(np.uint8)

    f3_head_ref = f3_raw[0:325, 340:840]
    f1_head_mov = f1_raw[0:325, 0:500]
    f2_head_mov = f2_raw[0:325, 55:555]

    dx1, dy1 = find_head_translation(f3_head_ref, f1_head_mov)
    dx2, dy2 = find_head_translation(f3_head_ref, f2_head_mov)
    print(f"Head alignment shifts vs F3 -> F1: ({dx1}, {dy1}), F2: ({dx2}, {dy2})")

    f1_rgba = extract_rgba_panel(f1_raw, mode="f1")
    f2_rgba = extract_rgba_panel(f2_raw, mode="f2")
    f3_rgba = extract_rgba_panel(f3_raw, mode="f3")

    # Target canvas: 1180 x 520, with F3 placed at (12, 48)
    cw, ch = 1180, 520
    f3_x, f3_y = 12, 48
    # Since f3_head_ref is at f3_raw[0:, 340:], its canvas origin is (f3_x + 340, f3_y + 0)
    f1_x = f3_x + 340 + dx1
    f1_y = f3_y + dy1
    # Since f2_head_mov is at f2_raw[0:, 55:], f2_raw origin is shifted by -55 in x
    f2_x = f3_x + 340 + dx2 - 55
    f2_y = f3_y + dy2

    canv1 = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    canv2 = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    canv3 = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))

    canv1.alpha_composite(f1_rgba, (f1_x, f1_y))
    canv2.alpha_composite(f2_rgba, (f2_x, f2_y))
    canv3.alpha_composite(f3_rgba, (f3_x, f3_y))

    # Resize to a crisp 960x424 (16:7 widescreen) or 960x440 WebP so file sizes stay ultra-lean (~25-45 KB each)
    out_size = (960, 424)
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    for idx, c in enumerate((canv1, canv2, canv3), 1):
        resized = c.resize(out_size, Image.Resampling.LANCZOS)
        out_path = BRAND_DIR / f"jaguar_intro_f{idx}.webp"
        resized.save(out_path, "WEBP", quality=90, method=6)
        print(f"Saved {out_path.relative_to(ROOT)} ({out_path.stat().st_size} bytes)")


def build_intro_audio():
    """Synthesize a mastered 4.4s epic studio intro anthem (jaguar_intro_theme.ogg) synchronized with the 3 frames:
    - 0.00s - 0.85s (Frame 1): Sub-bass slam + metallic claw resonance + dark atmospheric pad
    - 0.85s - 1.80s (Frame 2): High-voltage electric arc crackles + rising Tesla coil sweep
    - 1.80s - 4.40s (Frame 3): Thunderous JaguarZCreatorZ power-chord + sub drop + lightning burst + heroic D-minor/Bb/C/D cadence
    """
    sr = 44100
    dur = 4.4
    n = int(sr * dur)
    t = np.linspace(0.0, dur, n, endpoint=False)
    rng = np.random.default_rng(20261118)

    left = np.zeros(n, dtype=np.float64)
    right = np.zeros(n, dtype=np.float64)

    def add_stereo(sig, pan=0.0, gain=1.0):
        nonlocal left, right
        gl = gain * np.cos((pan + 1.0) * np.pi / 4.0)
        gr = gain * np.sin((pan + 1.0) * np.pi / 4.0)
        left += sig * gl
        right += sig * gr

    # 1. Beat 1 (0.04s): Frame 1 Jaguar Head Impact Slam (Deep sub-drop + metallic anvil transient)
    t1 = np.maximum(0.0, t - 0.04)
    m1 = t >= 0.04
    f_sub1 = 42.0 + 95.0 * np.exp(-t1 * 18.0)
    phase_sub1 = 2.0 * np.pi * np.cumsum(f_sub1) / sr
    sub1 = np.sin(phase_sub1) * np.exp(-t1 * 3.2) * m1
    # Metallic transient
    metal1 = (
        np.sin(2 * np.pi * 440 * t1)
        + 0.6 * np.sin(2 * np.pi * 660 * t1)
        + 0.4 * np.sin(2 * np.pi * 1320 * t1)
    ) * np.exp(-t1 * 16.0) * m1
    add_stereo(np.tanh(sub1 * 1.8) * 0.55 + metal1 * 0.18, pan=0.0)

    # Dark cinematic D2 drone pad (73.42 Hz + 110 Hz + 146.83 Hz)
    pad_env = np.clip(t / 0.15, 0.0, 1.0) * np.exp(-np.maximum(0.0, t - 3.2) * 2.2)
    for freq, det, pan, amp in [
        (73.42, 0.3, -0.25, 0.22),
        (110.0, -0.4, 0.25, 0.16),
        (146.83, 0.5, 0.0, 0.18),
    ]:
        osc = np.sin(2 * np.pi * (freq + det) * t) + 0.35 * np.sin(4 * np.pi * freq * t)
        add_stereo(osc * pad_env, pan=pan, gain=amp)

    # 2. Beat 2 (0.85s): Frame 2 Electric Blue Ignition (High-voltage Tesla arcs + pitch riser)
    t2 = np.maximum(0.0, t - 0.85)
    m2 = (t >= 0.85) & (t < 1.95)
    # Rising pitch sweep into the 1.80s drop
    riser_f = 146.83 * (2.0 ** (np.clip((t - 0.85) / 0.95, 0.0, 1.2) * 2.0))
    riser_p = 2.0 * np.pi * np.cumsum(riser_f) / sr
    riser_env = np.clip((t - 0.85) / 0.85, 0.0, 1.0) * m2
    riser = np.sawtooth(riser_p) if hasattr(np, "sawtooth") else (2.0 * ((riser_p / (2 * np.pi)) % 1.0) - 1.0)
    add_stereo(riser * riser_env * 0.18, pan=-0.15)
    add_stereo(np.sin(riser_p * 1.5) * riser_env * 0.15, pan=0.15)

    # Electric arc crackles at 0.86s, 1.05s, 1.28s, 1.52s
    for spark_t, pan in [(0.86, -0.4), (1.04, 0.45), (1.26, -0.25), (1.50, 0.35)]:
        ts = np.maximum(0.0, t - spark_t)
        ms = (t >= spark_t) & (t < spark_t + 0.22)
        noise = rng.standard_normal(n)
        zap_f = 1800.0 + 1400.0 * np.sin(2 * np.pi * 55.0 * ts)
        zap = np.sin(2 * np.pi * zap_f * ts) * noise * np.exp(-ts * 19.0) * ms
        add_stereo(zap * 0.28, pan=pan)

    # 3. Beat 3 (1.80s): Frame 3 "JAGUARZCREATORZ" Eruption (Massive Power Chord + Thunder Strike + Heroic Brass/Synth Fanfare)
    t3 = np.maximum(0.0, t - 1.80)
    m3 = t >= 1.80
    # Sub-bass thunder boom at 1.80s
    f_sub3 = 36.71 + 120.0 * np.exp(-t3 * 22.0)
    phase_sub3 = 2.0 * np.pi * np.cumsum(f_sub3) / sr
    sub3 = np.tanh(np.sin(phase_sub3) * 2.2) * np.exp(-t3 * 1.65) * m3
    add_stereo(sub3 * 0.62, pan=0.0)

    # Lightning thunder crackle at 1.80s
    thunder_noise = rng.standard_normal(n)
    # Simple moving-average filter for thunder body
    kernel = np.ones(12) / 12.0
    thunder_body = np.convolve(thunder_noise, kernel, mode="same")
    thunder_env = np.exp(-t3 * 4.5) * m3
    add_stereo(thunder_body * thunder_env * 0.36, pan=-0.2)
    add_stereo(np.roll(thunder_body, 19) * thunder_env * 0.36, pan=0.2)

    # Heroic D-minor / F-major / A5 power chord progression at 1.80s -> 2.35s -> 2.85s
    # Chord 1 (1.80s): D2, A2, D3, F3, A3, D4
    # Chord 2 (2.32s): Bb1, F2, Bb2, D3, F3, D4
    # Chord 3 (2.82s - 4.40s): D2, A2, D3, A3, F#4/F4 heroic sustain + high shimmer D5 (587.33 Hz)
    notes = [
        (1.80, 0.55, [73.42, 110.0, 146.83, 174.61, 220.0, 293.66, 440.0]),
        (2.32, 0.52, [58.27, 87.31, 116.54, 174.61, 233.08, 349.23, 466.16]),
        (2.82, 1.55, [73.42, 110.0, 146.83, 220.0, 293.66, 440.0, 587.33]),
    ]
    for start, length, freqs in notes:
        tn = np.maximum(0.0, t - start)
        mn = t >= start
        attack = np.clip(tn / 0.018, 0.0, 1.0)
        decay = np.exp(-tn / (length * 0.82))
        env = attack * decay * mn
        for idx, f in enumerate(freqs):
            pan = ((idx % 3) - 1) * 0.35
            # Rich brassy/synth waveform (fundamental + harmonics with soft saturation)
            wave_sig = (
                np.sin(2 * np.pi * f * tn)
                + 0.55 * np.sin(2 * np.pi * (2 * f + 0.4) * tn)
                + 0.30 * np.sin(2 * np.pi * (3 * f - 0.3) * tn)
                + 0.15 * np.sin(2 * np.pi * (4 * f) * tn)
            )
            add_stereo(np.tanh(wave_sig * 1.3) * env, pan=pan, gain=0.095)

    # Fade out cleanly in the last 0.28s
    fade_out = np.clip((dur - t) / 0.28, 0.0, 1.0)
    left *= fade_out
    right *= fade_out

    # Normalize to -16 LUFS (~0.158 RMS, peak <= -1.2 dBFS)
    rms = np.sqrt(0.5 * (np.mean(left**2) + np.mean(right**2)))
    target_rms = 10.0 ** (-16.0 / 20.0)
    gain = target_rms / max(rms, 1e-6)
    left = np.tanh(left * gain * 0.92) * 0.86
    right = np.tanh(right * gain * 0.92) * 0.86

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    out_ogg = AUDIO_DIR / "jaguar_intro_theme.ogg"
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        wav_path = Path(tmp.name)
    try:
        pcm = np.empty((n, 2), dtype=np.int16)
        pcm[:, 0] = np.clip(left * 32767.0, -32768, 32767).astype(np.int16)
        pcm[:, 1] = np.clip(right * 32767.0, -32768, 32767).astype(np.int16)
        with wave.open(str(wav_path), "wb") as wf:
            wf.setnchannels(2)
            wf.setsampwidth(2)
            wf.setframerate(sr)
            wf.writeframes(pcm.tobytes())
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loglevel",
                "error",
                "-i",
                str(wav_path),
                "-c:a",
                "libvorbis",
                "-q:a",
                "5",
                str(out_ogg),
            ],
            check=True,
        )
        print(f"Saved {out_ogg.relative_to(ROOT)} ({out_ogg.stat().st_size} bytes)")
    finally:
        wav_path.unlink(missing_ok=True)


if __name__ == "__main__":
    build_frames()
    build_intro_audio()
