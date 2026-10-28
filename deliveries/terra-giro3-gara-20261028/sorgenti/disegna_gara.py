"""Race props for CHRONOS Adventure, Terra round 3, drawn by code (pixel art, light from the top left).

Usage: python3 -I sorgenti/disegna_gara.py [names...]   (from deliveries/terra-giro3-gara-20261028)

Each asset is painted at its in-game size (MISURE.json), enlarged with nearest neighbour to the
template scale and laid on the template: out = mask ? art : template (pure green #00FF00). Soft art
(puddles, flames) fades by dithering, never by partial alpha, so no colour mixes with the key.
Writes immagini/<name>_edit.png and anteprime/<name>.png (in-game size, transparent).
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
from pixel import C, Canvas, OUT, mix  # noqa: E402

DELIVERY = HERE.parent
ROOT = DELIVERY.parents[1]
PACK = ROOT / 'requests/terra-giro3-gara-20261028/pacchetto'
BOX = (16, 22, 111, 168)

STEEL, STEEL_D, STEEL_L = C('#3a434c'), C('#232a31'), C('#6d7a86')
CYAN, CYAN_D, WHITE = C('#59e0ff'), C('#1f7fa6'), C('#e9feff')
YEL, BLK = C('#f2b33d'), C('#1b1a1c')
WOOD, WOOD_D, WOOD_L = C('#8a5a33'), C('#5a3720'), C('#b98352')


def pallet(c, y0=152, y1=168, x0=16, x1=111, hazard=True):
    """Wooden pallet seen from the front: slats, dark gaps, three blocks."""
    c.fill(c.rect(x0, y0, x1, y1), WOOD_D, var=.05)
    for y in range(y0 + 1, y1, 5):
        c.fill(c.rect(x0 + 1, y, x1 - 1, min(y + 2, y1 - 1)), WOOD, var=.09)
        c.hline(y, x0 + 1, x1 - 1, WOOD_L)
    for bx in (x0, (x0 + x1) // 2 - 6, x1 - 12):
        c.fill(c.rect(bx, y1 - 6, bx + 12, y1), WOOD_D * .8, var=.05)
    if hazard:
        m = c.rect(x0 + 2, y0 + 1, x1 - 2, y0 + 4)
        c.stripes(m, YEL, BLK, period=8)


def finish(c, name):
    c.outline()
    return c


# ---------------------------------------------------------------- pads

def pad(name, plate, plate_d, accent, seed):
    c = Canvas(116, 124, seed)
    full = c.rect(1, 1, 114, 122)
    c.fill(full, CYAN_D, var=.04)
    c.fill(c.rect(4, 4, 111, 119), CYAN, var=.03)
    inner = c.rect(8, 8, 107, 115)
    c.fill(inner, plate, var=.08)
    # Diamond tread on the plate.
    tread = inner & (((c.X + c.Y) % 6 == 0) | ((c.X - c.Y) % 6 == 0)) & ((c.X // 3 + c.Y // 3) % 2 == 0)
    c.paint(tread, plate_d)
    c.bevel(inner, 1.18, .72)
    # Three chevrons pointing up (direction of travel), brightest at the front.
    for k, cy in enumerate((90, 62, 34)):
        outer = c.poly([(22, cy + 14), (58, cy - 16), (94, cy + 14), (94, cy + 26), (58, cy - 4), (22, cy + 26)])
        core = c.poly([(26, cy + 15), (58, cy - 11), (90, cy + 15), (90, cy + 21), (58, cy - 5), (26, cy + 21)])
        c.paint(outer, OUT)
        col = mix(CYAN, WHITE, .25 + .3 * k)
        c.fill(core, col, var=.03)
        hl = core & ~np.roll(core, 1, axis=0)
        c.paint(hl, WHITE)
    # Recessed lights in the corners and along the sides.
    for x, y in ((14, 14), (101, 14), (14, 109), (101, 109), (14, 62), (101, 62)):
        c.paint(c.rect(x - 2, y - 2, x + 2, y + 2), OUT)
        c.paint(c.rect(x - 1, y - 1, x + 1, y + 1), CYAN)
        c.paint(c.rect(x - 1, y - 1, x - 1, y - 1), WHITE)
    # Bolts on the frame.
    for x in range(12, 106, 16):
        for y in (2, 120):
            c.paint(c.rect(x, y, x + 1, y), accent)
    # Hazard ticks on the trailing edge.
    c.stripes(c.rect(30, 116, 85, 118), YEL, BLK, period=6)
    return c


def race_pad_nitro_porto():
    c = pad('porto', C('#252c34'), C('#171c22'), STEEL_L, 11)
    c.specks(c.rect(9, 9, 106, 114), C('#4a3a2c'), .01)
    return finish(c, 'porto')


def race_pad_nitro_sabbia():
    c = pad('sabbia', C('#7d5b3a'), C('#5c3f26'), C('#c99a55'), 12)
    sand = C('#e2c48a')
    # Sand drifted onto the frame and plate edges.
    for cx, cy, rx, ry in ((10, 30, 9, 16), (106, 92, 8, 20), (40, 116, 18, 5), (88, 6, 14, 4)):
        m = c.blob(cx, cy, rx, ry, .3) & c.rect(1, 1, 114, 122)
        c.fill(m, sand, var=.1)
    c.specks(c.rect(9, 9, 106, 114), sand, .03)
    return finish(c, 'sabbia')


def race_pad_nitro_ponte():
    c = pad('ponte', C('#6f7b87'), C('#59646f'), C('#ffffff'), 13)
    # Brushed metal: faint horizontal lines; optical guide lines on both sides.
    inner = c.rect(8, 8, 107, 115)
    c.paint(inner & (c.Y % 4 == 0) & (c.rng.random((124, 116)) < .5) & (c.rgb.mean(axis=2) < 140), C('#8a96a2'))
    for x in (11, 104):
        c.paint(c.rect(x, 20, x, 104) & (c.Y % 6 < 3), C('#8ff0ff'))
    return finish(c, 'ponte')


# ---------------------------------------------------------------- barrier

def race_barrier_gap_porto():
    c = Canvas(80, 64, 21)
    mint, mint_d = C('#9ff7b8'), C('#3e9a68')
    for cy in (40, 14):
        outer = c.poly([(10, cy + 16), (40, cy - 8), (70, cy + 16), (70, cy + 24), (40, cy + 2), (10, cy + 24)])
        core = c.poly([(13, cy + 17), (40, cy - 4), (67, cy + 17), (67, cy + 21), (40, cy + 4), (13, cy + 21)])
        c.paint(outer, OUT)
        c.fill(core, mint, var=.05)
        c.paint(core & ~np.roll(core, 1, axis=0), C('#e8fff0'))
        c.paint(core & ~np.roll(core, -1, axis=0), mint_d)
    # Worn paint: a few pixels of asphalt showing through.
    c.paint(c.a & (c.rng.random((64, 80)) < .04) & ~(c.rgb == OUT).all(axis=2), C('#2a3a33'))
    return c


def race_barrier_post_porto():
    c = Canvas(48, 96, 22)
    # Base plate at the bottom centre, seen from above 3/4.
    base = c.ellipse(24, 86, 15, 6)
    c.fill(base, STEEL_D, var=.06)
    c.paint(c.ellipse(24, 85, 13, 4), STEEL)
    for x in (13, 33):
        c.paint(c.rect(x, 85, x + 1, 86), STEEL_L)
    # Pole: yellow and black bands, cylinder shading.
    pole = c.rect(19, 18, 29, 84)
    band = ((c.Y - 18) // 8) % 2 == 0
    c.paint(pole & band, YEL)
    c.paint(pole & ~band, BLK)
    c.tint(pole & (c.X <= 20), WHITE, .25)
    c.tint(pole & (c.X >= 27), OUT, .45)
    # Lamp head with the green light.
    head = c.rect(16, 6, 32, 18)
    c.fill(head, STEEL, var=.05)
    c.bevel(head)
    glow = c.ellipse(24, 11, 6, 4)
    c.paint(glow, C('#58e08c'))
    c.paint(c.ellipse(24, 10, 3, 2), C('#d9ffe6'))
    halo = c.ellipse(24, 11, 10, 7) & ~head & ~pole
    c.paint(halo & ((c.X + c.Y) % 2 == 0), C('#9ff7b8'))
    c.outline(c.a & ~halo)
    return c


# ---------------------------------------------------------------- obstacles (container footprint)

def box_shell(c, top_col, front_col, split=100):
    x0, y0, x1, y1 = BOX
    c.fill(c.rect(x0, y0, x1, split), top_col)
    c.fill(c.rect(x0, split + 1, x1, y1), front_col)


def bobina(c, hit=False):
    """Cable reel standing on a pallet: top flange as a wooden disc, cable wraps on the drum below."""
    x0, y0, x1, y1 = BOX
    pallet(c)
    flange, flange_d, flange_l = C('#a8723f'), C('#6a4424'), C('#d39a5c')
    # Bottom flange edge, drum with horizontal wraps, then the top disc over them.
    c.fill(c.rect(x0, 138, x1, 151), flange_d, var=.05)
    c.paint(c.rect(x0, 138, x1, 139), flange)
    cable, cable_l, cable_d = C('#2f4650'), C('#5f8494'), C('#121c22')
    drum = c.rect(x0 + 6, 96, x1 - 6, 137)
    for y in range(96, 138):
        k = (y - 96) % 4
        col = (cable_l, cable, cable, cable_d)[k]
        u = np.clip((c.X - x0 - 6) / (x1 - x0 - 12), 0, 1)
        shade = np.where(u < .3, 1.25, np.where(u > .75, .6, 1.0))
        row = drum & (c.Y == y)
        c.rgb[row] = np.clip(col * shade[row, None], 0, 255)
        c.a |= row
    c.paint(drum & ((c.Y - 96) % 12 == 5) & ((c.X // 3) % 2 == 0), C('#c99a2e'))
    disc = c.ellipse(63.5, 62, 47.6, 40.5)
    c.fill(disc, flange, var=.06)
    c.paint(disc & ~c.ellipse(63.5, 62, 45, 38), flange_d)
    c.tint(disc & c.ellipse(52, 50, 30, 22), flange_l, .35)
    c.tint(disc & ~c.ellipse(60, 56, 44, 36), OUT, .35)
    # Planks of the disc, spokes, hub, bolts.
    c.paint(disc & ((c.X - x0) % 16 == 0) & c.ellipse(63.5, 62, 44, 37), flange_d)
    hub = c.ellipse(64, 62, 11, 9)
    c.fill(hub, STEEL, var=.05)
    c.paint(c.ellipse(64, 62, 5, 4), C('#0d1013'))
    c.paint(c.ellipse(62, 60, 2, 1), STEEL_L)
    for ang in np.linspace(0, 2 * np.pi, 8, endpoint=False):
        bx, by = 64 + 34 * np.cos(ang), 62 + 29 * np.sin(ang)
        c.paint(c.rect(int(bx), int(by), int(bx) + 1, int(by)), STEEL_L)
    # Invented stencil on the disc: arrow and three bars.
    c.paint(c.poly([(38, 46), (44, 40), (50, 46)]) | c.rect(42, 46, 46, 54), C('#3a2414'))
    c.paint(c.rect(78, 74, 92, 75) | c.rect(78, 78, 92, 79) | c.rect(78, 82, 88, 83), C('#3a2414'))
    c.stripes(c.rect(x0 + 2, 141, x1 - 2, 145), YEL, BLK, period=8)
    # Loose cable end over the bottom flange.
    c.line(96, 120, 104, 148, cable_l, 2)
    c.paint(c.rect(103, 147, 106, 149), C('#c47a3a'))
    if hit:
        # Dents in the disc rim, frayed copper wraps, scratched paint, a broken pallet slat.
        for fx, fy in ((22, 70), (96, 36), (70, 101)):
            d = c.ellipse(fx, fy, 4, 3) & disc
            c.paint(d, flange_d * .6)
            c.paint(d & (c.Y == fy - 3), flange_l)
        for sx, sy in ((36, 112), (60, 124), (84, 106)):
            c.paint(c.rect(sx, sy, sx + 7, sy + 1), C('#0a1014'))
            for k in range(4):
                c.paint(c.rect(sx + 1 + k * 2, sy - 1 - k % 2, sx + 1 + k * 2, sy - k % 2), C('#e0904a'))
        for k in range(18):
            c.paint(c.rect(30 + k * 2, 36 + k, 31 + k * 2, 36 + k), C('#efc48e'))
        c.paint(c.rect(46, 157, 70, 158), OUT)
        c.paint(c.rect(58, 159, 60, 166), WOOD_D * .6)
    c.outline()
    return c


def race_obstacle_porto_bobina():
    return bobina(Canvas(128, 192, 31))


def race_obstacle_porto_bobina_colpito():
    return bobina(Canvas(128, 192, 31), hit=True)


def casse(c, hit=False):
    x0, y0, x1, y1 = BOX
    pallet(c)
    # Top: four crate lids with planks.
    lids = [(x0, y0, 62, 60), (65, y0, x1, 60), (x0, 63, 62, 101), (65, 63, x1, 101)]
    for i, (a, b, d, e) in enumerate(lids):
        m = c.rect(a, b, d, e)
        c.fill(m, mix(WOOD_L, C('#c49a62'), .3 * (i % 2)), var=.03)
        c.paint(m & ((c.Y * 7 + c.X // 9 * 3) % 11 == 0) & (c.rng.random(m.shape) < .6), WOOD * 1.05)
        c.paint(m & ((c.Y - b) % 7 == 6), WOOD_D)
        c.bevel(m, 1.2, .72)
        for nx in (a + 3, d - 3):
            for ny in range(b + 2, e, 7):
                c.paint(c.rect(nx, ny, nx, ny), STEEL_D)
    c.paint(c.rect(x0, 61, x1, 62) | c.rect(63, y0, 64, 101), OUT)
    # Front: crate sides with vertical boards and corner brackets.
    front = c.rect(x0, 102, x1, 151)
    c.fill(front, WOOD * 1.02, var=.03)
    c.paint(front & ((c.X * 5 + c.Y // 7) % 13 == 0), WOOD_D * 1.1)
    c.paint(front & ((c.X - x0) % 8 == 7), WOOD_D)
    c.paint(c.rect(x0, 102, x1, 103), WOOD_D * .8)
    c.paint(c.rect(63, 102, 64, 151), OUT)
    for bx in (x0, 57, 65, x1 - 5):
        c.fill(c.rect(bx, 104, bx + 5, 109) | c.rect(bx, 144, bx + 5, 149), STEEL, var=.05)
    # Invented stencil: an up arrow and a fragile glass shape.
    c.paint(c.poly([(36, 116), (40, 111), (44, 116)]) | c.rect(39, 116, 41, 124), C('#1d140c'))
    c.paint(c.rect(84, 113, 92, 115) | c.rect(87, 116, 89, 122) | c.rect(84, 123, 92, 124), C('#1d140c'))
    # Orange straps: one around each axis, over top and front.
    strap, strap_d = C('#f07a28'), C('#a8481a')
    sv = c.rect(38, y0, 41, 151) | c.rect(88, y0, 91, 151)
    sh = c.rect(x0, 80, x1, 83)
    straps = sv | sh
    if hit:
        straps &= ~c.rect(85, 70, 95, 96)
    c.paint(straps, strap)
    c.paint(straps & ((c.X == 38) | (c.X == 88) | (c.Y == 80)), mix(strap, WHITE, .3))
    c.paint(straps & ((c.X == 41) | (c.X == 91) | (c.Y == 83)), strap_d)
    for bx in (38, 88):
        c.fill(c.rect(bx - 1, 140, bx + 4, 144), STEEL_L, var=.04)
    if hit:
        # Broken strap ends curling, split planks, splinters.
        c.paint(c.rect(88, 66, 91, 69) | c.rect(92, 69, 95, 71), strap_d)
        c.paint(c.rect(86, 97, 89, 100) | c.rect(90, 95, 92, 97), strap)
        for (a, b), (d, e) in (((20, 30), (50, 46)), ((70, 70), (104, 90)), ((24, 112), (52, 138)), ((96, 108), (108, 140))):
            c.line(a, b, d, e, C('#2a170b'))
            c.line(a + 1, b, d + 1, e, WOOD_L * 1.2)
        for sx, sy in ((50, 46), (104, 90), (52, 138)):
            c.paint(c.rect(sx, sy, sx + 2, sy + 1), C('#e6bf86'))
        c.paint(c.rect(70, 112, 82, 120), C('#1a0f08'))
        c.paint(c.rect(71, 113, 81, 113), WOOD_L)
    c.outline()
    return c


def race_obstacle_porto_casse():
    return casse(Canvas(128, 192, 32))


def race_obstacle_porto_casse_colpito():
    return casse(Canvas(128, 192, 32), hit=True)


# ---------------------------------------------------------------- crane

def beam(night=False):
    c = Canvas(720, 120, 41)
    dark = C('#2b3137')
    # Legs on the sidewalks: portal columns with bracing, bogies on rails at the bottom.
    for lx0, lx1 in ((32, 104), (616, 688)):
        leg = c.rect(lx0, 4, lx1, 115)
        c.fill(leg, C('#7a2b22'), var=.07)
        c.fill(c.rect(lx0 + 6, 10, lx1 - 6, 109), C('#5a1f19'), var=.06)
        for k in range(0, 100, 24):
            c.line(lx0 + 6, 10 + k, lx1 - 6, 10 + k + 24, C('#9a3a2c'), 2)
            c.line(lx1 - 6, 10 + k, lx0 + 6, 10 + k + 24, C('#9a3a2c'), 2)
        c.bevel(leg)
        bog = c.rect(lx0 - 6, 100, lx1 + 6, 117)
        c.fill(bog, dark, var=.06)
        for wx in range(lx0, lx1 + 1, 14):
            c.paint(c.ellipse(wx, 112, 4, 3), C('#14181c'))
            c.paint(c.rect(wx - 1, 110, wx, 110), STEEL_L)
        c.stripes(c.rect(lx0 - 4, 101, lx1 + 4, 104), YEL, BLK, period=8)
    # Main beam crossing the whole canvas: top face, front face with hazard stripes.
    top = c.rect(0, 30, 719, 60)
    c.fill(top, dark, var=.07)
    c.paint(top & ((c.X % 48) == 0), C('#1a1e22'))
    for x in range(6, 720, 24):
        c.paint(c.rect(x, 33, x + 1, 33) | c.rect(x, 57, x + 1, 57), STEEL_L)
    # Trolley rail: two rails on the top face.
    for ry in (39, 50):
        c.paint(c.rect(0, ry, 719, ry + 1), C('#8d99a4'))
        c.paint(c.rect(0, ry + 2, 719, ry + 2), C('#14181c'))
    front = c.rect(0, 61, 719, 76)
    c.fill(front, C('#1f2428'), var=.05)
    c.stripes(c.rect(0, 64, 719, 72), YEL, BLK, period=16)
    c.paint(c.rect(0, 77, 719, 79), OUT)
    c.bevel(top, 1.25, 1)
    # Invented maker plate in the middle of the beam.
    c.fill(c.rect(332, 34, 388, 46), C('#c8d0d6'), var=.03)
    c.paint(c.rect(336, 38, 344, 42) | c.rect(348, 38, 350, 42) | c.rect(354, 38, 384, 39), C('#2a3036'))
    c.outline()
    lights = []
    if night:
        # Cold dark light, amber warning lights on, warm spill on the beam near them.
        c.rgb *= np.array([.3, .36, .52])
        for lx, ly in ((68, 8), (652, 8), (68, 96), (652, 96), (140, 53), (360, 53), (580, 53)):
            spill = c.ellipse(lx, ly, 16, 10) & c.a
            c.tint(spill & ((c.X + c.Y) % 2 == 0), C('#ffb347'), .45)
            c.paint(c.rect(lx - 2, ly - 2, lx + 2, ly + 2), C('#7a3e10'))
            c.paint(c.rect(lx - 1, ly - 1, lx + 1, ly + 1), C('#ffb347'))
            c.paint(c.rect(lx, ly - 1, lx, ly - 1), C('#fff1c8'))
    else:
        for lx, ly in ((68, 8), (652, 8), (68, 96), (652, 96), (140, 53), (360, 53), (580, 53)):
            c.paint(c.rect(lx - 2, ly - 2, lx + 2, ly + 2), C('#3a1c08'))
            c.paint(c.rect(lx - 1, ly - 1, lx + 1, ly + 1), C('#c27a2a'))
    return c


def race_crane_beam_porto_day():
    return beam()


def race_crane_beam_porto_night():
    return beam(night=True)


def race_crane_trolley_porto():
    c = Canvas(64, 112, 42)
    body = c.rect(4, 2, 59, 38)
    c.fill(body, C('#6b7681'), var=.06)
    c.fill(c.rect(8, 6, 55, 26), C('#8794a0'), var=.05)
    c.paint(c.rect(8, 15, 55, 16), C('#55606b'))
    c.bevel(body)
    for wx in (6, 52):
        c.fill(c.rect(wx, 0, wx + 5, 4) | c.rect(wx, 36, wx + 5, 40), C('#22282e'), var=.04)
    c.stripes(c.rect(8, 28, 55, 31), YEL, BLK, period=6)
    # Headlights on the side facing the cars.
    for hx in (12, 48):
        c.paint(c.rect(hx - 3, 33, hx + 3, 37), OUT)
        c.paint(c.rect(hx - 2, 34, hx + 2, 36), C('#fff3c4'))
        c.paint(c.rect(hx - 1, 34, hx, 34), WHITE)
    # Hoist drums and two steel cables down to the bottom edge.
    c.fill(c.rect(20, 18, 43, 24), C('#3a434c'), var=.05)
    for x in (24, 39):
        cab = c.rect(x, 39, x + 1, 111)
        c.paint(cab, C('#9aa6b1'))
        c.paint(cab & (c.X == x + 1), C('#4c5660'))
        c.paint(cab & (c.Y % 6 == 0), C('#c8d2dc'))
    c.outline(c.a & ~c.rect(23, 41, 41, 111))
    return c


def hook(c, cx=64, top=22):
    """Hook block at the top centre with four ropes to the load corners."""
    c.fill(c.rect(cx - 6, top, cx + 6, top + 9), C('#d9a12a'), var=.05)
    c.paint(c.rect(cx - 6, top + 3, cx + 6, top + 4), BLK)
    c.paint(c.rect(cx - 2, top + 10, cx + 2, top + 14), STEEL)
    return [(cx - 3, top + 14), (cx + 3, top + 14)]


def reti(c, hit=False):
    x0, y0, x1, y1 = BOX
    pallet(c, hazard=False)
    sack, sack_d, sack_l = C('#b59a6a'), C('#7e6842'), C('#d8c08e')
    # Top: six sacks as rounded bulges, then the sides of the front row.
    for i in range(3):
        for j in range(2):
            a, b = x0 + 2 + i * 31, 40 + j * 36
            m = c.blob(a + 15, b + 17, 16, 19, .08, 4, i * 2 + j)
            c.fill(m, sack, var=.09)
            c.tint(m & (c.X < a + 10) & (c.Y < b + 14), sack_l, .6)
            c.tint(m & ((c.X > a + 22) | (c.Y > b + 28)), sack_d, .6)
    front = c.rect(x0, 112, x1, 151)
    c.fill(front, sack_d * 1.05, var=.09)
    for i in range(3):
        c.paint(c.rect(x0 + 32 * i + 31, 112, x0 + 32 * i + 32, 151), sack_d * .6)
    c.fill(c.rect(x0, 36, x1, 40), sack_d, var=.06)
    c.paint(c.rect(x0, 36, x0, 151) | c.rect(x1, 36, x1, 151), sack_d)
    # Net: diamond grid of rope over everything below the hook.
    net = c.rect(x0, 36, x1, 151) & (((c.X + c.Y) % 9 == 0) | ((c.X - c.Y) % 9 == 0))
    if hit:
        torn = c.blob(50, 76, 16, 14, .3)
        net &= ~torn
        # Frayed ends around the tear, one sack open with spilled grain.
        edge = torn & ~c.blob(50, 76, 13, 11, .3) & (((c.X + c.Y) % 9 < 2) | ((c.X - c.Y) % 9 < 2))
        c.paint(edge, C('#3a2c1a'))
        c.paint(c.ellipse(52, 78, 7, 5), C('#2b1e10'))
        c.specks(c.ellipse(52, 82, 12, 9), C('#e8d6a0'), .35)
        c.specks(c.rect(30, 128, 70, 150), C('#e8d6a0'), .06)
    c.paint(net, C('#2b241a'))
    # Four ropes from the corners to the hook.
    ends = hook(c)
    for (a, b), e in zip(((x0 + 1, 37), (x0 + 30, 37), (x1 - 30, 37), (x1 - 1, 37)), (ends[0], ends[0], ends[1], ends[1])):
        c.line(a, b, *e, C('#c9b48a'), 2)
    c.outline()
    return c


def race_crane_load_porto_reti():
    return reti(Canvas(128, 192, 51))


def race_crane_load_porto_reti_colpito():
    return reti(Canvas(128, 192, 51), hit=True)


def tubi(c, hit=False):
    x0, y0, x1, y1 = BOX
    pipe, pipe_l, pipe_d = C('#7f8b96'), C('#c3ccd4'), C('#3b444c')
    # Top: eight pipes lying front to back, cylinder shading across x.
    for i in range(8):
        a = x0 + i * 12
        kink = hit and i in (2, 5)
        for x in range(a, a + 12):
            u = (x - a) / 11
            col = mix(pipe_l, pipe, min(1, u * 2.4)) if u < .5 else mix(pipe, pipe_d, (u - .5) * 2)
            m = c.rect(x, 38, x, 126)
            if kink:
                m = (c.rect(x, 38, x, 80) | c.rect(x, 89, x, 126)) & c.rect(x0, 0, x1, 200)
                c.paint(c.rect(min(x + 2, x1), 81, min(x + 2, x1), 88), col)
            c.paint(m, col)
        c.paint(c.rect(a, 38, a, 126), pipe_d * .7)
        if kink:
            c.paint(c.rect(a + 1, 80, a + 13, 81) | c.rect(a + 1, 88, a + 13, 89), OUT)
    # Front: pipe ends, two staggered rows.
    c.fill(c.rect(x0, 127, x1, 168), C('#2a3036'), var=.05)
    for row, (cy, off) in enumerate(((137, 0), (157, 6))):
        for i in range(8 if off == 0 else 7):
            cx = x0 + 6 + i * 12 + off
            c.paint(c.ellipse(cx, cy, 6, 9), pipe_l)
            c.paint(c.ellipse(cx + 1, cy + 1, 5, 8), pipe)
            c.paint(c.ellipse(cx + 1, cy + 1, 3, 5), C('#0d1013'))
    # Two straps across, red-orange with buckles.
    strap = C('#d0432a')
    s1 = c.rect(x0, 56, x1, 60)
    s2 = c.rect(x0, 104, x1, 108) if not hit else c.poly([(x0, 104), (x1, 110), (x1, 115), (x0, 109)])
    for s in (s1, s2):
        c.paint(s, strap)
        c.paint(s & ~np.roll(s, 1, axis=0), mix(strap, WHITE, .35))
        c.paint(s & ~np.roll(s, -1, axis=0), strap * .6)
    c.fill(c.rect(58, 55, 68, 61), STEEL_L, var=.04)
    c.fill(c.rect(58, 103 + (4 if hit else 0), 68, 109 + (4 if hit else 0)), STEEL_L, var=.04)
    ends = hook(c)
    for (a, b), e in zip(((x0 + 1, 39), (x0 + 30, 39), (x1 - 30, 39), (x1 - 1, 39)), (ends[0], ends[0], ends[1], ends[1])):
        c.line(a, b, *e, C('#c9b48a'), 2)
    c.outline()
    return c


def race_crane_load_porto_tubi():
    return tubi(Canvas(128, 192, 52))


def race_crane_load_porto_tubi_colpito():
    return tubi(Canvas(128, 192, 52), hit=True)


# ---------------------------------------------------------------- slicks

def slick(blobs, seed, base, tones, sheen):
    c = Canvas(160, 176, seed)
    m = np.zeros((176, 160), bool)
    for b in blobs:
        m |= c.blob(*b)
    m &= c.ellipse(80, 88, 75, 83)
    c.fill(m, base, var=.05)
    # Soft border: distance to the outside, dithered out over a few pixels.
    d = np.zeros(m.shape)
    cur = m.copy()
    for k in range(1, 6):
        e = cur.copy()
        e[1:] &= cur[:-1]
        e[:-1] &= cur[1:]
        e[:, 1:] &= cur[:, :-1]
        e[:, :-1] &= cur[:, 1:]
        d[cur & ~e] = k
        cur = e
    d[cur] = 6
    for col, cx, cy, rx, ry in tones:
        c.tint(m & c.ellipse(cx, cy, rx, ry), col, .55)
    ang = np.arctan2(c.Y - 88, c.X - 80)
    rim = m & (d == 3)
    hue = (np.sin(ang * 3 + c.Y / 9) + 1) / 2
    c.paint(rim & (hue > .66), C('#59e0ff'))
    c.paint(rim & (hue < .3), C('#ff8fd0'))
    c.paint(rim & (hue >= .3) & (hue <= .45), C('#9a7cff'))
    for col, cx, cy, rx, ry in sheen:
        arc = c.blob(cx, cy, rx, ry, .25, 5) & ~c.blob(cx, cy + 1, rx - 1.5, ry - 1.5, .25, 5) & m & (d > 3)
        c.paint(arc & (c.Y < cy + ry * .2) & ((c.X // 3) % 4 != 0), col)
    c.dither(np.where(m, np.minimum(1, d / 4), 0))
    return c


def race_slick_olio_a():
    blobs = [(80, 88, 58, 62, .22, 7, 1), (124, 46, 12, 10, .3, 5, 2), (34, 140, 10, 8, .3, 5, 3), (132, 128, 7, 6, .3, 4, 4), (40, 36, 6, 5, .3, 4, 5)]
    c = slick(blobs, 61, C('#07090e'),
              [(C('#151c2a'), 70, 80, 40, 30), (C('#1a1430'), 96, 110, 22, 16)],
              [(C('#59e0ff'), 68, 70, 26, 14), (C('#ff8fd0'), 96, 108, 18, 9), (C('#9a7cff'), 60, 104, 14, 7)])
    c.specks(c.a & c.ellipse(70, 72, 30, 20), C('#e9feff'), .012)
    return c


def race_slick_olio_b():
    blobs = [(76, 96, 44, 76, .2, 6, 7), (128, 36, 16, 13, .25, 5, 8), (130, 150, 11, 10, .3, 5, 9)]
    c = slick(blobs, 62, C('#07090e'),
              [(C('#151c2a'), 72, 70, 26, 40), (C('#1a1430'), 80, 132, 22, 20)],
              [(C('#59e0ff'), 70, 60, 18, 24), (C('#ff8fd0'), 82, 126, 16, 12), (C('#59e0ff'), 128, 36, 8, 5)])
    c.specks(c.a & c.ellipse(70, 60, 20, 30), C('#e9feff'), .012)
    return c


def sand(blobs, seed):
    c = Canvas(160, 176, seed)
    m = np.zeros((176, 160), bool)
    for b in blobs:
        m |= c.blob(*b)
    m &= c.ellipse(80, 88, 75, 83)
    c.fill(m, C('#e2bd76'), var=.08)
    # Wind ripples: curved darker crests with a light lee.
    for k in range(-6, 7):
        y = 88 + k * 12 + 4 * np.sin(c.X / 18 + k)
        crest = m & (np.abs(c.Y - y) < .8)
        c.paint(crest, C('#b98a4c'))
        c.paint(m & (np.abs(c.Y - y + 1.6) < .8), C('#f6dca2'))
    c.tint(m & (c.X > 100), C('#a8783e'), .25)
    d = np.zeros(m.shape)
    cur = m.copy()
    for k in range(1, 8):
        e = cur.copy()
        e[1:] &= cur[:-1]
        e[:-1] &= cur[1:]
        e[:, 1:] &= cur[:, :-1]
        e[:, :-1] &= cur[:, 1:]
        d[cur & ~e] = k
        cur = e
    d[cur] = 8
    c.dither(np.where(m, np.minimum(1, d / 6), 0))
    return c


def race_slick_sabbia_a():
    return sand([(80, 90, 62, 66, .2, 6, 11), (40, 40, 18, 14, .3, 5, 12)], 63)


def race_slick_sabbia_b():
    return sand([(60, 70, 44, 48, .2, 6, 13), (104, 116, 46, 50, .2, 6, 14)], 64)


# ---------------------------------------------------------------- nitro flames

def flame(core, mid, tail, seed):
    c = Canvas(32, 112, seed)
    zone = c.poly([(2, 0), (30, 0), (20, 112), (12, 112)])
    t = c.Y / 111
    half = 13 * (1 - t) ** .8 + 1.5
    jag = 1.5 * np.sin(c.Y / 5 + 1) + np.sin(c.Y / 2.3)
    body = (np.abs(c.X + .5 - 16 + .3 * jag) <= half) & zone
    inner = (np.abs(c.X + .5 - 16) <= half * .45) & body
    col = np.where((t < .35)[..., None], mix(mid, WHITE, .35), np.where((t < .7)[..., None], mid, tail))
    c.rgb[:] = col
    c.a |= body
    c.tint(body & (t > .55), tail, .7)
    c.paint(inner & (t < .55), mix(core, mid, .25))
    c.paint(inner & (t < .25), core)
    c.paint(body & (c.Y < 3) & (np.abs(c.X - 16) < 10), core)
    # Tail: dithered fade over the last third.
    c.dither(np.where(body, np.clip((1 - t) / .4, 0, 1), 0))
    return c


def race_nitro_flame_vortex():
    return flame(WHITE, CYAN, C('#1f4fd6'), 71)


def race_nitro_flame_veyra():
    return flame(C('#fff4ee'), C('#ed857c'), C('#4a1f6a'), 72)


def race_nitro_flame_rivali():
    return flame(C('#fffaf0'), C('#f4bd72'), C('#b0541a'), 73)


# ---------------------------------------------------------------- finish lines

def finish_line(seed, light, dark, joint=None, studs=C('#ffcf6a'), side=None):
    c = Canvas(460, 40, seed)
    for row in range(2):
        for i in range(23):
            m = c.rect(i * 20, row * 20, i * 20 + 19, row * 20 + 19)
            c.fill(m, light if (i + row) % 2 == 0 else dark, var=.06)
    # Worn paint: asphalt showing through the white squares.
    wear = c.rng.random((40, 460)) < .025
    c.paint(wear & (c.rgb.mean(axis=2) > 150), C('#5a5f66'))
    if joint is not None:
        c.paint((c.X % 46 == 0) | (c.Y == 20), joint)
        c.specks(c.rect(0, 0, 459, 39), C('#e2c48a'), .03)
    # Reflective studs on the line between the rows.
    for x in range(10, 460, 40):
        c.paint(c.rect(x - 2, 18, x + 2, 21), OUT)
        c.paint(c.rect(x - 1, 19, x + 1, 20), studs)
        c.paint(c.rect(x - 1, 19, x - 1, 19), WHITE)
    if side is not None:
        c.paint(c.rect(0, 0, 3, 39) | c.rect(456, 0, 459, 39), side)
        c.paint((c.rect(1, 0, 1, 39) | c.rect(458, 0, 458, 39)) & (c.Y % 4 < 2), WHITE)
    c.paint(c.rect(0, 0, 459, 0) | c.rect(0, 39, 459, 39), C('#2a2f35'))
    return c


def race_finish_porto():
    return finish_line(81, C('#eef2f8'), C('#15202a'))


def race_finish_sabbia():
    return finish_line(82, C('#f1e6cf'), C('#3a2a1c'), joint=C('#c9a46a'))


def race_finish_ponte():
    return finish_line(83, C('#f4f7ff'), C('#1c2a3a'), studs=C('#8ff0ff'), side=CYAN)


# ---------------------------------------------------------------- priority 2 obstacles

def sabbia_cassa(c, hit=False):
    x0, y0, x1, y1 = BOX
    pallet(c, hazard=False)
    tarp, tarp_d, tarp_l = C('#c9a875'), C('#8d6f45'), C('#e6cc9c')
    top = c.rect(x0, y0, x1, 100)
    c.fill(top, tarp, var=.08)
    # Folds in the tarp and rope ties.
    for k in range(5):
        y = y0 + 12 + k * 17 + 3 * np.sin(c.X / 9 + k)
        c.paint(top & (np.abs(c.Y - y) < 1), tarp_d)
        c.paint(top & (np.abs(c.Y - y + 2) < .6), tarp_l)
    front = c.rect(x0, 101, x1, 151)
    c.fill(front, tarp_d * 1.05, var=.08)
    c.paint(front & ((c.Y - 101) % 10 == 9), tarp_d * .7)
    rope = C('#5a4026')
    for x in (30, 63, 96):
        c.paint(c.rect(x, y0, x + 1, 151), rope)
        c.paint(c.rect(x, y0, x, 151) & (c.Y % 3 == 0), C('#9a7a4c'))
    c.paint(c.rect(x0, 98, x1, 99), rope)
    # Invented convoy mark: three bars and a circle, sun-faded.
    c.paint(c.ellipse(46, 124, 7, 7) & ~c.ellipse(46, 124, 4, 4), C('#7a3a22'))
    c.paint(c.rect(74, 118, 86, 119) | c.rect(74, 123, 86, 124) | c.rect(74, 128, 86, 129), C('#7a3a22'))
    c.bevel(top, 1.15, .8)
    if hit:
        tear = c.blob(80, 56, 14, 9, .35)
        c.paint(tear, C('#3a2a1a'))
        c.paint(tear & c.rect(0, 0, 200, 52), C('#6a4a2a'))
        c.specks(tear, C('#e2c48a'), .2)
        c.paint(c.poly([(x0, 140), (x0 + 10, 151), (x0, 151)]), C('#4a3220'))
        c.paint(c.rect(x0 + 1, 141, x0 + 6, 142), tarp_l)
    c.outline()
    return c


def race_obstacle_sabbia_cassa():
    return sabbia_cassa(Canvas(128, 192, 91))


def race_obstacle_sabbia_cassa_colpito():
    return sabbia_cassa(Canvas(128, 192, 91), hit=True)


def cisterna(c, hit=False):
    x0, y0, x1, y1 = BOX
    # Skid at the bottom.
    c.fill(c.rect(x0, 150, x1, 168), C('#5c4a38'), var=.06)
    c.paint(c.rect(x0, 158, x1, 160), C('#3a2e22'))
    c.stripes(c.rect(x0 + 2, 152, x1 - 2, 155), YEL, BLK, period=8)
    metal, metal_l, metal_d = C('#9ca8a8'), C('#d6dedb'), C('#5a6466')
    # Tank: cylinder along y, shaded across x, ribs every 16 px.
    for x in range(x0, x1 + 1):
        u = (x - x0) / (x1 - x0)
        col = mix(metal_l, metal, min(1, u * 3)) if u < .35 else mix(metal, metal_d, (u - .35) / .65)
        c.paint(c.rect(x, y0, x, 116), col)
    tank = c.rect(x0, y0, x1, 116)
    c.specks(tank, C('#c9b48a'), .012)
    c.paint(tank & ((c.Y - y0) % 16 == 0), metal_d * .8)
    # Hatch on top.
    c.fill(c.ellipse(64, 50, 12, 9), metal_d, var=.05)
    c.paint(c.ellipse(63, 49, 9, 6), metal)
    # Round end at the front with a valve.
    end = c.ellipse(64, 133, 48, 18) | c.rect(x0, 117, x1, 133)
    c.fill(end & c.rect(x0, 117, x1, 151), metal_d * 1.1, var=.06)
    c.paint(c.ellipse(64, 133, 40, 13) & ~c.ellipse(64, 133, 38, 11), metal)
    c.fill(c.rect(58, 128, 70, 140), C('#2d6f8a'), var=.04)
    c.paint(c.rect(62, 132, 66, 136), C('#0e1a20'))
    c.paint(c.rect(x0, 134, x1, 149) & ~c.ellipse(64, 133, 48, 18), C('#3a3020'))
    if hit:
        dent = c.ellipse(90, 70, 9, 12)
        c.paint(dent, metal_d * .8)
        c.paint(dent & (c.X < 86), metal_l)
        c.paint(c.rect(66, 136, 66, 149) | c.rect(65, 145, 67, 149), C('#7fd6ff'))
        c.paint(c.rect(67, 142, 67, 149), C('#d8f6ff'))
    c.outline()
    return c


def race_obstacle_sabbia_cisterna():
    return cisterna(Canvas(128, 192, 92))


def race_obstacle_sabbia_cisterna_colpito():
    return cisterna(Canvas(128, 192, 92), hit=True)


def ponte_barriera(c, hit=False):
    x0, y0, x1, y1 = BOX
    conc, conc_l, conc_d = C('#c4c7c4'), C('#e2e4e0'), C('#8e928f')
    top = c.rect(x0, y0, x1, 108)
    c.fill(top, conc, var=.035)
    c.paint(top & ((c.Y - y0) % 28 == 27), conc_d)
    c.bevel(top, 1.12, .8)
    front = c.rect(x0, 109, x1, 168)
    c.fill(front, conc_d, var=.035)
    # Reflective band red and white on the front.
    band = c.rect(x0 + 2, 122, x1 - 2, 134)
    c.stripes(band, C('#e8ecef'), C('#d0342a'), period=12, slope=-1)
    c.paint(c.rect(x0, 160, x1, 168), C('#6a6e6b'))
    # Flashing light on top.
    lamp = c.rect(56, 32, 72, 46)
    c.fill(lamp, C('#2a2f35'), var=.04)
    light = c.ellipse(64, 39, 5, 4)
    c.paint(light, C('#7a4410') if hit else C('#ffb347'))
    if not hit:
        c.paint(c.rect(63, 37, 64, 38), C('#fff1c8'))
    c.specks(top, conc_d, .008)
    if hit:
        chip = c.poly([(x1 - 18, y0), (x1, y0), (x1, y0 + 20)])
        c.paint(chip, C('#7a7e7b'))
        c.paint(c.poly([(x1 - 16, y0 + 1), (x1 - 2, y0 + 1), (x1 - 2, y0 + 14)]), C('#a6aaa6'))
        c.line(40, 60, 58, 90, C('#6a6e6b'))
        c.line(58, 90, 54, 108, C('#6a6e6b'))
        c.paint(c.rect(56, 46, 72, 47), C('#c8ccc8'))
    c.outline()
    return c


def race_obstacle_ponte_barriera():
    return ponte_barriera(Canvas(128, 192, 93))


def race_obstacle_ponte_barriera_colpito():
    return ponte_barriera(Canvas(128, 192, 93), hit=True)


def carrello(c, hit=False):
    x0, y0, x1, y1 = BOX
    body, body_l, body_d = C('#2f6fb0'), C('#6aa6e0'), C('#1b3f66')
    deck = c.rect(x0, y0, x1, 118)
    c.fill(deck, C('#d8dde2'), var=.06)
    c.fill(c.rect(x0 + 4, y0 + 4, x1 - 4, 114), C('#b9c1c8'), var=.07)
    c.bevel(deck)
    front = c.rect(x0, 119, x1, 156)
    c.fill(front, body, var=.06)
    c.paint(c.rect(x0, 119, x1, 121), body_l)
    c.stripes(c.rect(x0 + 4, 146, x1 - 4, 150), YEL, BLK, period=8)
    for wx in (x0 + 10, x1 - 10):
        c.fill(c.rect(wx - 8, 156, wx + 8, 168), C('#1a1d21'), var=.04)
        c.paint(c.rect(wx - 3, 160, wx + 3, 163), STEEL_L)
    c.fill(c.rect(x0 + 20, 157, x1 - 20, 162), body_d, var=.05)
    # Cable reels and an optical instrument on the deck.
    for cx, cy in ((40, 50), (40, 88)):
        c.paint(c.ellipse(cx, cy, 15, 13), C('#2a2f35'))
        c.paint(c.ellipse(cx, cy, 12, 10), C('#d07a2a'))
        c.paint(c.ellipse(cx, cy, 12, 10) & ((c.X + c.Y) % 3 == 0), C('#a85a1a'))
        c.paint(c.ellipse(cx, cy, 3, 3), C('#2a2f35'))
    inst = c.rect(68, 40, 104, 96)
    c.fill(inst, C('#3a434c'), var=.05)
    c.bevel(inst)
    lens = c.ellipse(86, 60, 11, 11)
    c.paint(lens, C('#101820'))
    c.paint(c.ellipse(86, 60, 8, 8), C('#59e0ff'))
    c.paint(c.ellipse(84, 58, 3, 3), WHITE)
    c.fill(c.rect(74, 78, 98, 90), C('#22282e'), var=.04)
    c.paint(c.rect(76, 80, 80, 82) | c.rect(84, 80, 88, 82), C('#9ff7b8'))
    # Invented bridge-service mark on the front.
    c.paint(c.rect(50, 128, 78, 130) | c.rect(50, 134, 70, 136) | c.ellipse(90, 133, 5, 5), C('#e8ecef'))
    if hit:
        c.line(80, 52, 92, 68, C('#e9feff'))
        c.line(80, 53, 92, 69, C('#101820'))
        for sx, sy in ((50, 104), (58, 108), (30, 110)):
            c.fill(c.rect(sx, sy, sx + 6, sy + 3), C('#8a939c'), var=.05)
        c.paint(c.rect(x1 - 12, 124, x1 - 4, 128), body_d * .6)
    c.outline()
    return c


def race_obstacle_ponte_carrello():
    return carrello(Canvas(128, 192, 94))


def race_obstacle_ponte_carrello_colpito():
    return carrello(Canvas(128, 192, 94), hit=True)


# ---------------------------------------------------------------- export

def export(name, spec):
    canvas = globals()[name]()
    art = Image.fromarray(canvas.rgba())
    (DELIVERY / 'anteprime').mkdir(exist_ok=True)
    art.save(DELIVERY / 'anteprime' / f'{name}.png', optimize=True)
    k = spec['scale']
    big = np.asarray(art.resize((art.width * k, art.height * k), Image.NEAREST))
    tpl = np.asarray(Image.open(PACK / 'modelli' / f'{name}.png').convert('RGB')).copy()
    mask = np.asarray(Image.open(PACK / 'modelli' / f'{name}_mask.png').convert('RGBA'))[..., 3] > 127
    draw = mask & (big[..., 3] > 0)
    tpl[draw] = big[draw, :3]
    (DELIVERY / 'immagini').mkdir(exist_ok=True)
    Image.fromarray(tpl).save(DELIVERY / 'immagini' / f'{name}_edit.png', optimize=True)


def main(names):
    import json
    spec = {a['name']: a for a in json.loads((PACK / 'MISURE.json').read_text())['assets']}
    for name in names or spec:
        export(name, spec[name])
        print('drawn', name)


if __name__ == '__main__':
    main(sys.argv[1:])
