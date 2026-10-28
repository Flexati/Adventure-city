"""Small pixel-art toolkit for the race props (Terra round 3, drawn by code).

Every asset is painted at its in-game size on a boolean silhouette plus an RGB layer, with a
seeded generator so the result is reproducible. Light comes from the top left, as in the game.
"""
import numpy as np


def C(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)


def mix(a, b, t):
    return a * (1 - t) + b * t


OUT = C('#120e0c')


class Canvas:
    def __init__(self, w, h, seed):
        self.w, self.h = w, h
        self.rgb = np.zeros((h, w, 3))
        self.a = np.zeros((h, w), bool)
        self.Y, self.X = np.mgrid[0:h, 0:w]
        self.rng = np.random.default_rng(seed)

    # Shapes return boolean masks.
    def rect(self, x0, y0, x1, y1):
        return (self.X >= x0) & (self.X <= x1) & (self.Y >= y0) & (self.Y <= y1)

    def ellipse(self, cx, cy, rx, ry):
        return ((self.X - cx) / rx) ** 2 + ((self.Y - cy) / ry) ** 2 <= 1

    def poly(self, pts):
        from PIL import Image, ImageDraw
        im = Image.new('L', (self.w, self.h), 0)
        ImageDraw.Draw(im).polygon([tuple(p) for p in pts], fill=255)
        return np.asarray(im) > 0

    def blob(self, cx, cy, rx, ry, wobble=.18, lobes=7, phase=0):
        ang = np.arctan2((self.Y - cy) / ry, (self.X - cx) / rx)
        r = np.hypot((self.X - cx) / rx, (self.Y - cy) / ry)
        k = np.ones_like(ang)
        rng = np.random.default_rng(int(cx * 7 + cy * 13 + lobes + phase))
        for n in range(2, lobes + 1):
            k += wobble / n ** .7 * np.sin(n * ang + rng.uniform(0, 6.28))
        return r <= k

    # Painting.
    def fill(self, m, col, var=.07, tones=(.88, 1, 1.1), p=(.2, .6, .2)):
        """Fill with a speckled 3-tone texture (pixel-art grain, no smooth noise)."""
        m = m.copy()
        pick = self.rng.choice(len(tones), size=m.shape, p=p)
        t = np.array(tones)[pick] if var else np.ones(m.shape)
        t = 1 + (t - 1) * (var / .07)
        self.rgb[m] = np.clip(col * t[m, None], 0, 255)
        self.a |= m

    def paint(self, m, col):
        self.rgb[m] = col
        self.a |= m

    def tint(self, m, col, t):
        m = m & self.a
        self.rgb[m] = mix(self.rgb[m], col, t)

    def specks(self, m, col, density, size=1):
        pts = (self.rng.random(m.shape) < density) & m
        if size > 1:
            ys, xs = np.nonzero(pts)
            for y, x in zip(ys, xs):
                self.paint(self.rect(x, y, x + size - 1, y) & m, col)
        else:
            self.paint(pts, col)

    def hline(self, y, x0, x1, col):
        self.paint(self.rect(x0, y, x1, y), col)

    def vline(self, x, y0, y1, col):
        self.paint(self.rect(x, y0, x, y1), col)

    def line(self, x0, y0, x1, y1, col, w=1):
        n = int(max(abs(x1 - x0), abs(y1 - y0))) + 1
        for t in np.linspace(0, 1, n):
            x, y = round(x0 + (x1 - x0) * t), round(y0 + (y1 - y0) * t)
            self.paint(self.rect(x - (w - 1) // 2, y - (w - 1) // 2, x + w // 2, y + w // 2), col)

    def bevel(self, m, hi=1.22, lo=.7):
        """Top/left edge pixels lighter, bottom/right darker: light from the top left."""
        up = np.zeros_like(m)
        up[1:] = m[:-1]
        left = np.zeros_like(m)
        left[:, 1:] = m[:, :-1]
        down = np.zeros_like(m)
        down[:-1] = m[1:]
        right = np.zeros_like(m)
        right[:, :-1] = m[:, 1:]
        top = m & (~up | ~left)
        bot = m & (~down | ~right)
        self.rgb[top] = np.clip(self.rgb[top] * hi, 0, 255)
        self.rgb[bot] = self.rgb[bot] * lo

    def outline(self, m=None, col=OUT):
        """Dark one-pixel outline on the inner edge of the silhouette."""
        m = self.a if m is None else m
        e = np.zeros_like(m)
        e[1:] |= ~m[:-1]
        e[:-1] |= ~m[1:]
        e[:, 1:] |= ~m[:, :-1]
        e[:, :-1] |= ~m[:, 1:]
        e[0, :] = e[-1, :] = e[:, 0] = e[:, -1] = True
        self.rgb[m & e] = col

    def stripes(self, m, a, b, period=8, slope=1):
        band = ((self.X + slope * self.Y) // (period // 2)) % 2 == 0
        self.paint(m & band, a)
        self.paint(m & ~band, b)

    def dither(self, keep):
        """Drop silhouette pixels where keep (0-1) is low with a 4x4 Bayer pattern: hard edges, no alpha."""
        bayer = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16 + 1 / 32
        th = bayer[self.Y % 4, self.X % 4]
        self.a &= keep > th

    def rgba(self):
        out = np.zeros((self.h, self.w, 4), np.uint8)
        out[..., :3] = np.clip(self.rgb.round(), 0, 255)
        out[..., 3] = np.where(self.a, 255, 0)
        return out
