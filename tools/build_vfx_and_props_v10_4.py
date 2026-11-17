"""Generate weapon VFX sprite sheets (vfx_h17.png, vfx_arc7.png) and
village prop/decoration sprite sheets (oggetti_moon.png, oggetti_cathedral.png,
oggetti_toxic.png, oggetti_clockwork.png) in game/art/v10/ using pure Python stdlib.
"""
from pathlib import Path
import struct
import zlib
import math
import random

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'game/art/v10'
DELIV = ROOT / 'deliveries/argon-loop-20261112/BLOCCO_OGGETTI_VFX'


def save_png(path: Path, w: int, h: int, rows: list[bytes]):
    raw = b''.join(b'\x00' + r for r in rows)
    compressed = zlib.compress(raw, level=3)

    def chunk(tag: bytes, data: bytes) -> bytes:
        crc = zlib.crc32(tag + data) & 0xffffffff
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', crc)

    ihdr = struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)
    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')
    path.write_bytes(png)


def make_vfx_h17():
    """512x512 (4x4 cells of 128x128): H-17 Pierce Railgun muzzle lance, impact shatter, wall spark, temporal ring."""
    W, H = 512, 512
    buf = bytearray(W * H * 4)

    for row in range(4):
        for col in range(4):
            phase = (col + 1) / 4.0
            for y in range(128):
                dy = y - 64.0
                row_off = ((row * 128 + y) * W + col * 128) * 4
                for x in range(128):
                    dx = x - 64.0
                    r = math.hypot(dx, dy)
                    ang = math.atan2(dy, dx)
                    rgba = None
                    if row == 0:
                        max_x = 24 + 34 * phase
                        if -30 < dx < 18 + 30 * phase and abs(dy) < 5 * (1 - (dx + 30) / (56 + 30 * phase)):
                            rgba = (240, 252, 255, 255)
                        elif abs(math.hypot((dx + 10) * 1.4, dy) - (16 + 24 * phase)) < 3.2:
                            rgba = (130, 235, 255, int(235 - 90 * phase))
                        elif -36 < dx < max_x and abs(dy) < 12 * (1 - (dx + 36) / (68 + 34 * phase)):
                            rgba = (110, 225, 255, 210)
                    elif row == 1:
                        ring_r = 16 + 32 * phase
                        if r < 10 * (1.2 - 0.5 * phase):
                            rgba = (255, 255, 255, 250)
                        elif abs(math.sin(ang * 4 + col * 0.4)) > 0.92 and 8 * phase < r < 22 + 34 * phase:
                            rgba = (230, 250, 255, 245)
                        elif abs(r - ring_r) < 3.0:
                            rgba = (120, 230, 255, int(230 - 90 * phase))
                    elif row == 2:
                        md = abs(dx) + abs(dy)
                        if md < 8 + 14 * phase:
                            rgba = (240, 252, 255, 245)
                        elif md < 16 + 28 * phase:
                            rgba = (100, 210, 255, int(195 - 75 * phase))
                    else:
                        ring_r = 18 + 34 * phase
                        if abs(r - ring_r) < 3.5:
                            rgba = (255, 195, 110, 240)
                        elif r < 10 + 14 * phase:
                            rgba = (140, 235, 255, int(210 - 85 * phase))
                    if rgba:
                        idx = row_off + x * 4
                        buf[idx:idx + 4] = bytes(rgba)

    rows = [bytes(buf[y * W * 4:(y + 1) * W * 4]) for y in range(H)]
    out_path = OUT / 'vfx_h17.png'
    save_png(out_path, W, H, rows)
    return out_path


def make_vfx_arc7():
    """512x512 (4x4 cells of 128x128): ARC-7 Coro Elettrico plasma discharge, chain node resonance, wall fault, choir burst."""
    W, H = 512, 512
    buf = bytearray(W * H * 4)

    for row in range(4):
        for col in range(4):
            phase = (col + 1) / 4.0
            for y in range(128):
                dy = y - 64.0
                row_off = ((row * 128 + y) * W + col * 128) * 4
                for x in range(128):
                    dx = x - 64.0
                    r = math.hypot(dx, dy)
                    ang = math.atan2(dy, dx)
                    rgba = None
                    if row == 0:
                        b1 = abs(dy - 12 * math.sin(dx * 0.22 + col)) < 3.0 and -28 < dx < 48
                        b2 = abs(dy + 10 * math.cos(dx * 0.19 - col)) < 2.5 and -24 < dx < 44
                        if b1 or b2:
                            rgba = (210, 245, 255, 255)
                        elif r < 14 + 22 * phase:
                            rgba = (155, 120, 255, 180)
                    elif row == 1:
                        ring_r = 18 + 30 * phase
                        if abs(math.sin(ang * 3 + r * 0.15 + col * 0.6)) > 0.90 and r < ring_r + 10:
                            rgba = (230, 248, 255, 255)
                        elif abs(r - ring_r) < 3.2:
                            rgba = (165, 130, 255, 235)
                    elif row == 2:
                        er = math.hypot(dx, dy * 1.8)
                        lim = 18 + 28 * phase
                        if abs(er - lim) < 3.0:
                            rgba = (220, 240, 255, 245)
                        elif er < lim:
                            rgba = (130, 105, 245, 185)
                    else:
                        if abs(r - (20 + 34 * phase)) < 3.5:
                            rgba = (255, 140, 225, 240)
                        elif abs(r - (12 + 22 * phase)) < 3.0:
                            rgba = (135, 235, 255, 245)
                    if rgba:
                        idx = row_off + x * 4
                        buf[idx:idx + 4] = bytes(rgba)

    rows = [bytes(buf[y * W * 4:(y + 1) * W * 4]) for y in range(H)]
    out_path = OUT / 'vfx_arc7.png'
    save_png(out_path, W, H, rows)
    return out_path


def make_oggetti_sheet(name: str, theme: str):
    """1536x1024 sprite sheet (4x3 grid of 384x341 cells) with village props & decorations."""
    W, H = 1536, 1024
    cw, ch = W // 4, H // 3
    palettes = {
        'moon': {
            'wood': (112, 78, 46), 'wood_hi': (156, 112, 68),
            'metal': (76, 92, 114), 'glow': (255, 196, 98),
            'cloth': (56, 118, 164), 'accent': (108, 218, 255),
        },
        'cathedral': {
            'wood': (92, 64, 52), 'wood_hi': (138, 98, 78),
            'metal': (148, 132, 96), 'glow': (255, 214, 118),
            'cloth': (146, 44, 62), 'accent': (255, 236, 168),
        },
        'toxic': {
            'wood': (68, 74, 58), 'wood_hi': (98, 108, 82),
            'metal': (62, 88, 78), 'glow': (132, 245, 96),
            'cloth': (118, 62, 142), 'accent': (184, 255, 120),
        },
        'clockwork': {
            'wood': (104, 72, 44), 'wood_hi': (164, 118, 64),
            'metal': (178, 134, 68), 'glow': (118, 228, 255),
            'cloth': (64, 96, 138), 'accent': (255, 212, 118),
        },
    }[theme]

    # Build 4 archetype cells (each 384x341) and stamp across the 4x3 grid with subtle variations
    cx, cy = cw // 2, ch // 2 + 16
    cells = []
    for kind in range(4):
        cbuf = bytearray(cw * ch * 4)
        for y in range(ch):
            dy = y - cy
            roff = y * cw * 4
            for x in range(cw):
                dx = x - cx
                # Deterministic pixel-art dither grain
                hval = ((x * 374761393 + y * 668265263 + kind * 982451653) ^ 0x5bf03635) & 0xff
                g = ((hval & 31) - 15)
                rgb = None
                alpha = 255
                if kind == 0:
                    # Streetlamp / Brazier / Beacon
                    if abs(dx) < 30 and -112 <= dy <= -68:
                        rgb = palettes['glow']
                    elif abs(dx) < 12 and -82 <= dy <= 42:
                        rgb = palettes['metal']
                    elif abs(dx) < 34 and 36 <= dy <= 74:
                        rgb = palettes['metal']
                    else:
                        hd = math.hypot(dx, dy + 90.0)
                        if hd < 76:
                            rgb = palettes['glow']
                            alpha = int((1.0 - hd / 76.0) * 140)
                elif kind == 1:
                    # Market Stall / Canopy Counter
                    if abs(dx) < 108 and -96 <= dy <= -34:
                        rgb = palettes['accent'] if (((dx + 120) // 22) % 2 == 0) else palettes['cloth']
                    elif abs(dx) < 86 and -8 <= dy <= 16:
                        rgb = palettes['wood_hi']
                    elif abs(dx) < 92 and -8 <= dy <= 68:
                        rgb = palettes['wood']
                elif kind == 2:
                    # Crate / Barrel / Pressurized Vat
                    if math.hypot(dx - 44, dy - 8) < 22:
                        rgb = palettes['glow']
                    elif math.hypot((dx - 44) / 42.0, (dy - 18) / 48.0) < 1.0:
                        rgb = palettes['metal']
                    elif -82 <= dx <= 14 and -32 <= dy <= 64:
                        rgb = palettes['wood_hi'] if (abs((dx + 34) - (dy - 16)) < 8 or abs(dy - 16) < 5) else palettes['wood']
                else:
                    # Mechanical Monument / Gear Shrine / Fountain
                    gr = math.hypot(dx, dy + 38)
                    gang = math.atan2(dy + 38, dx)
                    if gr <= 18:
                        rgb = palettes['accent']
                    elif 18 < gr < 54 + (8 if math.sin(gang * 8) > 0 else 0):
                        rgb = palettes['wood_hi']
                    elif math.hypot(dx / 68.0, (dy - 22) / 32.0) < 1.0:
                        rgb = palettes['glow']
                    elif math.hypot(dx / 92.0, (dy - 22) / 46.0) < 1.0:
                        rgb = palettes['metal']

                if rgb is None and math.hypot(dx / 106.0, (dy - 68.0) / 26.0) < 1.0:
                    cbuf[roff + x * 4:roff + x * 4 + 4] = bytes((10, 14, 20, 125))
                elif rgb is not None:
                    r_c = max(0, min(255, rgb[0] + g))
                    g_c = max(0, min(255, rgb[1] + g))
                    b_c = max(0, min(255, rgb[2] + g))
                    cbuf[roff + x * 4:roff + x * 4 + 4] = bytes((r_c, g_c, b_c, alpha))
        cells.append(cbuf)

    rows = []
    for y in range(H):
        grid_r = min(2, y // ch)
        cy_local = y - grid_r * ch
        if cy_local >= ch:
            rows.append(b'\x00' * (W * 4))
            continue
        row_bytes = bytearray(W * 4)
        for grid_c in range(4):
            cbuf = cells[(grid_c + grid_r) % 4]
            src_off = cy_local * cw * 4
            dst_off = grid_c * cw * 4
            row_bytes[dst_off:dst_off + cw * 4] = cbuf[src_off:src_off + cw * 4]
        rows.append(bytes(row_bytes))

    out_path = OUT / f'{name}.png'
    save_png(out_path, W, H, rows)
    DELIV.mkdir(parents=True, exist_ok=True)
    save_png(DELIV / f'{name}.png', W, H, rows)
    return out_path


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    p1 = make_vfx_h17()
    p2 = make_vfx_arc7()
    print(f"Generated {p1.name} ({p1.stat().st_size} B), {p2.name} ({p2.stat().st_size} B)")
    for t in ('moon', 'cathedral', 'toxic', 'clockwork'):
        p = make_oggetti_sheet(f'oggetti_{t}', t)
        print(f"Generated {p.name} ({p.stat().st_size} B)")
