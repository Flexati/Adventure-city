"""Compose the six Nox/Lulù preproduction boards (character.{nox,lulu}.01-03) from real game frames.

Rule of the author: the V8 body and face are never redrawn. Each board pastes untouched cells of
the game sheets (scale 1, no filter) plus the in-game portrait, with production labels outside the
art. The check re-reads every pasted region and compares it pixel by pixel with its source cell.

usage: compose_protagonist_boards.py
"""
import hashlib
import json
import platform
import sys
import textwrap
from pathlib import Path

import numpy as np
import PIL
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
REG = ROOT / 'docs/gold/VARIANTI_PREPRODUZIONE_V10_2_20261028.json'
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONT_B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
W, H, BG = 1536, 1024, (20, 23, 29)

# (sheet, row, col, caption); rows: walk = front, back, side, run; gun = side, back, front, diagonal
BOARDS = {
    ('nox', 1): {'title': 'Esplorazione', 'frames': [('v05/nox_walk', 0, 0, 'fronte'), ('v05/nox_walk', 1, 0, 'schiena'), ('v05/nox_walk', 2, 1, 'lato'),
                                                    ('v05/nox_gun', 3, 0, 'diagonale'), ('v05/nox_walk', 3, 2, 'corsa'), ('v05/nox_actions', 0, 1, 'scatto')]},
    ('nox', 2): {'title': 'H-17 «Needle»', 'frames': [('v10/nox_h17_gun', 2, 1, 'fronte, tiro'), ('v10/nox_h17_gun', 1, 1, 'schiena, tiro'), ('v10/nox_h17_gun', 0, 1, 'lato, tiro'),
                                                     ('v10/nox_h17_gun', 3, 1, 'diagonale, tiro'), ('v10/nox_h17_gun', 0, 0, 'anticipo'), ('v10/nox_h17_reload', 0, 1, 'ricarica')]},
    ('nox', 3): {'title': 'Controcolpo', 'frames': [('v05/nox_actions', 0, 0, 'carica'), ('v05/nox_actions', 0, 2, 'scatto'), ('v05/nox_magic', 0, 2, 'Pulse'),
                                                   ('v05/nox_gun', 0, 2, 'rinculo'), ('v05/nox_actions', 3, 2, 'Duo'), ('v05/nox_walk', 0, 0, 'ritorno neutro')]},
    ('lulu', 1): {'title': 'Esplorazione', 'frames': [('v05/lulu_walk', 0, 0, 'fronte'), ('v05/lulu_walk', 1, 0, 'schiena'), ('v05/lulu_walk', 2, 1, 'lato'),
                                                     ('v05/lulu_gun', 3, 0, 'diagonale'), ('v05/lulu_walk', 3, 2, 'corsa'), ('v05/lulu_actions', 0, 1, 'scatto')]},
    ('lulu', 2): {'title': 'ARC-7 «Choir»', 'frames': [('v10/lulu_arc7_gun', 2, 0, 'fronte'), ('v10/lulu_arc7_gun', 1, 1, 'schiena, scarica'), ('v10/lulu_arc7_gun', 0, 1, 'lato, scarica'),
                                                       ('v10/lulu_arc7_gun', 3, 0, 'diagonale'), ('v10/lulu_arc7_gun', 0, 0, 'anticipo'), ('v10/lulu_arc7_reload', 0, 1, 'cella ARC-7')]},
    ('lulu', 3): {'title': 'Reunion', 'frames': [('v05/lulu_actions', 3, 0, 'Duo, apertura'), ('v05/lulu_actions', 3, 1, 'Duo'), ('v05/lulu_walk', 0, 0, 'fronte'),
                                                 ('v05/lulu_magic', 0, 0, 'mano aperta'), ('v05/lulu_actions', 3, 3, 'Duo, chiusura'), ('v05/lulu_walk', 2, 0, 'lato')]},
}
PORTRAIT_COL = {'nox': 0, 'lulu': 1}  # game/art/v08/portraits.png, 192x192 cells


def font(size, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, size)


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def cell(sheet, r, c):
    im = Image.open(ROOT / f'game/art/{sheet}.png').convert('RGBA')
    cw, ch = im.width / 4, im.height / 4
    box = (int(round(c * cw)), int(round(r * ch)), int(round((c + 1) * cw)), int(round((r + 1) * ch)))
    t = im.crop(box)
    a = np.array(t)
    ys, xs = np.nonzero(a[..., 3] > 0)
    tb = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    return t.crop(tb), (box[0] + tb[0], box[1] + tb[1], box[0] + tb[2], box[1] + tb[3])


def main():
    reg = json.loads(REG.read_text())
    entries = {e['asset_id']: e for e in reg['entries']}
    portraits = Image.open(ROOT / 'game/art/v08/portraits.png').convert('RGBA')
    report = {}
    for (hero, n), spec in BOARDS.items():
        e = entries[f'character.{hero}.{n:02d}']
        board = Image.new('RGB', (W, H), BG)
        d = ImageDraw.Draw(board)
        d.rectangle((0, 0, W, 55), fill=(12, 14, 18))
        d.text((20, 8), f"{e['content_name']} · variante {n:02d} · {spec['title']}", font=font(24, True), fill=(226, 230, 238))
        d.text((20, 36), e['description'].split(' Master +')[0], font=font(13), fill=(140, 150, 166))
        tag = 'PREPRODUZIONE · composta da fotogrammi reali del gioco, nessun ridisegno'
        d.text((W - 20 - d.textlength(tag, font=font(13, True)), 10), tag, font=font(13, True), fill=(119, 245, 210))
        idt = f"{e['asset_id']} · v{n:02d}"
        d.text((W - 20 - d.textlength(idt, font=font(13)), 32), idt, font=font(13), fill=(140, 150, 166))
        placed, sources = [], {}
        slots = [(i * 384, 64, 384, 470) for i in range(4)] + [(0, 548, 384, 470), (384, 548, 384, 470)]
        for (sheet, r, c, cap), (sx, sy, sw, shh) in zip(spec['frames'], slots):
            fr, src_box = cell(sheet, r, c)
            d.rectangle((sx + 6, sy, sx + sw - 6, sy + shh - 4), fill=(30, 34, 42))
            # feet on a common line; wide gun frames may overlap the next slot but never leave the board
            at = (min(max(0, sx + (sw - fr.width) // 2), W - fr.width), max(60, sy + shh - 34 - fr.height))
            board.paste(fr, at, fr)
            d.text((sx + 16, sy + shh - 28), f'{cap}  ·  {sheet}.png r{r}c{c}', font=font(12), fill=(170, 178, 192))
            placed.append({'sheet': f'game/art/{sheet}.png', 'row': r, 'col': c, 'source_box': list(src_box), 'board_at': list(at), 'size': [fr.width, fr.height]})
            sources[f'game/art/{sheet}.png'] = sha(ROOT / f'game/art/{sheet}.png')
        pc = PORTRAIT_COL[hero]
        por = portraits.crop((pc * 192, 0, pc * 192 + 192, 192)).resize((384, 384), Image.NEAREST)
        d.rectangle((774, 548, 1158, 1018), fill=(30, 34, 42))
        board.paste(por, (774, 560))
        d.text((790, 990), 'ritratto in gioco · v08/portraits.png ×2 (nearest)', font=font(12), fill=(170, 178, 192))
        sources['game/art/v08/portraits.png'] = sha(ROOT / 'game/art/v08/portraits.png')
        # palette read from the frames themselves
        allpx = np.concatenate([np.array(cell(s, r, c)[0]).reshape(-1, 4) for s, r, c, _ in spec['frames']])
        allpx = allpx[allpx[:, 3] > 200][:, :3]
        q = Image.fromarray(allpx.reshape(1, -1, 3).astype(np.uint8), 'RGB').quantize(colors=8, method=Image.MEDIANCUT)
        pal = q.getpalette()[:24]
        d.text((1176, 560), 'Palette letta dai fotogrammi', font=font(12, True), fill=(140, 150, 166))
        for i in range(8):
            d.rectangle((1176 + (i % 4) * 88, 584 + (i // 4) * 60, 1176 + (i % 4) * 88 + 80, 584 + (i // 4) * 60 + 52), fill=tuple(pal[i * 3:i * 3 + 3]))
        notes = ['Identità V8 invariata: ogni figura è una cella del gioco incollata a scala 1.',
                 f"Genere: {'maschile' if hero == 'nox' else 'femminile'} (canone).",
                 'Pivot e misure runtime: quelli degli sheet di gioco (nessuna nuova misura).']
        y = 720
        for line in notes:
            for part in textwrap.wrap(line, 46):
                d.text((1176, y), part, font=font(12), fill=(200, 206, 216))
                y += 18
            y += 8
        out = ROOT / e['expected_master_path']
        out.parent.mkdir(parents=True, exist_ok=True)
        board.save(out, optimize=True)
        # check: every pasted figure equals its source cell where the figure is opaque
        back = np.array(Image.open(out).convert('RGB')).astype(int)
        mism = 0
        for p in placed:
            src = np.array(Image.open(ROOT / p['sheet']).convert('RGBA').crop(p['source_box'])).astype(int)
            x, y0 = p['board_at']
            reg_ = back[y0:y0 + src.shape[0], x:x + src.shape[1]]
            opaque = src[..., 3] == 255
            mism += int((np.abs(reg_[opaque] - src[..., :3][opaque]).sum(-1) > 0).sum())
        b = out.read_bytes()
        meta = {'asset_id': e['asset_id'], 'content_id': e['content_id'], 'variant_number': n, 'master_path': e['expected_master_path'],
                'bytes': len(b), 'sha256': hashlib.sha256(b).hexdigest(), 'dimensions_px': [W, H], 'mode': 'RGB',
                'background': 'opaque board', 'pivot': None, 'runtime_dimensions': None, 'hitbox': None,
                'production': 'TEAM_COMPOSITION from real game frames (no redraw)', 'frames': placed, 'source_sha256': sources,
                'source_tool': f'tools/compose_protagonist_boards.py (repository code written by Claude), Python {platform.python_version()}, numpy {np.__version__}, Pillow {PIL.__version__}',
                'font': 'DejaVu Sans, production labels only',
                'rights_status': 'Composition of existing game sheets: their registered conditions apply (docs/gold/ASSET_REGISTER.json); commercial rights to be confirmed by the author.',
                'check': {'opaque_pixels_different_from_source': mism, 'result': 'PASS' if mism == 0 else 'FAIL'},
                'status': 'TECHNICALLY_VERIFIED' if mism == 0 else 'GENERATED_UNVERIFIED', 'concept_only': False, 'date': '2026-10-29', 'commercial_ready': False}
        out.with_suffix('.json').write_text(json.dumps(meta, indent=1, ensure_ascii=False) + '\n')
        e.update({'status': meta['status'], 'source_tool': 'tools/compose_protagonist_boards.py', 'source_artifact': sorted(sources),
                  'byte_size': len(b), 'sha256': meta['sha256'], 'rights_status': 'GAME_SHEETS_CONDITIONS_TO_CONFIRM'})
        report[e['asset_id']] = meta['check']['result']
    REG.write_text(json.dumps(reg, indent=2, ensure_ascii=False) + '\n')
    print(report)
    return 0 if all(v == 'PASS' for v in report.values()) else 1


if __name__ == '__main__':
    sys.exit(main())
