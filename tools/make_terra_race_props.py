"""Templates, masks and the scale board for Terra's race props (Terra round 3).

Usage: python3 -I tools/make_terra_race_props.py <out dir> [spec.json]

For every asset of assets/source/race_props/race_props.json:
  modelli/<name>.png        key green #00FF00, the final size enlarged by the asset scale
  modelli/<name>_mask.png   same size, white = Terra may draw here, transparent = leave green
  TAVOLA_SCALA.png          the props' zones in place on an Ash Docks road tile, with an in-game container
Terra draws inside the mask and returns <name>_edit.png at the same size; the team brings it back
with tools/compose_terra_race_props.py, which also checks it.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from race_props_lib import KEY, ROOT, SPEC, load_spec, zone_mask  # noqa: E402

# Where each prop sits on the board: (asset, centre x, anchor y, how the game anchors it).
BOARD = [('race_finish_porto', 130, 60, 'finish'), ('race_obstacle_porto_bobina', 176, 250, 'container'),
         ('race_slick_olio_a', 360, 250, 'slick'), ('race_pad_nitro_porto', 544, 250, 'centre'),
         ('race_barrier_gap_porto', 268, 440, 'gap'), ('race_barrier_post_porto', 268, 440, 'posts'),
         ('race_crane_beam_porto_day', 0, 760, 'beam'), ('race_crane_trolley_porto', 452, 760, 'trolley'),
         ('race_crane_load_porto_reti', 452, 760, 'load'), ('race_nitro_flame_vortex', 360, 930, 'flame')]


def board(spec, out):
    road = Image.open(ROOT / 'game/art/v10/race_ashdocks_banchina_day.png').convert('RGBA').crop((0, 0, 720, 1100))
    by = {a['name']: a for a in spec['assets']}
    d = ImageDraw.Draw(road)

    def outline(name, x, y, sx=1, sy=1, label=True):
        a = by[name]
        m = zone_mask(a).resize((max(1, round(a['size'][0] * sx)), max(1, round(a['size'][1] * sy))))
        tint = Image.new('RGBA', m.size, (255, 0, 200, 0))
        tint.putalpha(m.point(lambda v: v * 90 // 255))
        road.alpha_composite(tint, (round(x), round(y)))
        d.rectangle([x, y, x + m.size[0] - 1, y + m.size[1] - 1], outline=(255, 0, 200, 255), width=2)
        if label:
            d.text((x + 2, y - 12), name.replace('race_', ''), fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))
    box = Image.open(ROOT / 'game/art/v10/race_container_ruggine.png').convert('RGBA').resize((80, 120), Image.NEAREST)
    road.alpha_composite(box, (176 - 40, 760 - 60))
    d.text((176 - 40, 760 - 76), 'container in gioco', fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))
    for name, x, y, kind in BOARD:
        w, h = by[name]['size']
        if kind == 'container':
            outline(name, x - 40, y - 60, .625, .625)
        elif kind == 'centre':
            outline(name, x - w / 2, y - h / 2)
        elif kind == 'slick':
            outline(name, x - w / 2, y - h / 2)
        elif kind == 'beam':
            outline(name, 0, y - 150)
        elif kind == 'trolley':
            outline(name, x - w / 2, y - 150, label=False)
        elif kind == 'load':
            outline(name, x - 64 * .7, y - 96 * .7, .7, .7)
        elif kind == 'gap':
            outline(name, x - w / 2, y + 84 - h / 2)
            d.rectangle([x - 55, y - 42, x + 55, y + 42], outline=(255, 210, 0, 255), width=2)
            d.text((x - 52, y - 8), 'varco', fill=(255, 210, 0, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))
        elif kind == 'posts':
            for px in (x - 46, x + 46):
                outline(name, px - w / 2, y + 40 - h, label=False)
        elif kind == 'finish':
            outline(name, x, y)
        elif kind == 'flame':
            d.rounded_rectangle([x - 30, y - 59, x + 30, y + 59], 10, outline=(255, 255, 255, 255), width=2)
            d.text((x - 26, y - 6), 'Vortex', fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))
            for off in (-22, 22):
                outline(name, x + off - w / 2, y + 92 - 60, 1, 70 / h, label=off < 0)
    # Collision of a container-sized obstacle: |dx| < 55, |distance| < 65 (42 px on screen).
    d.rectangle([176 - 55, 250 - 42, 176 + 55, 250 + 42], outline=(255, 210, 0, 255), width=2)
    d.text((8, 1070), 'magenta = zona del file  ·  giallo = urto (non cambia)  ·  scala 1 = come in gioco', fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))
    road.convert('RGB').save(out)


def main(dest, spec_path=SPEC):
    spec, dest = load_spec(spec_path), Path(dest)
    (dest / 'modelli').mkdir(parents=True, exist_ok=True)
    for a in spec['assets']:
        k = a['scale']
        size = (a['size'][0] * k, a['size'][1] * k)
        Image.new('RGB', size, KEY).save(dest / 'modelli' / f'{a["name"]}.png')
        m = zone_mask(a, k)
        Image.merge('RGBA', [m] * 4).save(dest / 'modelli' / f'{a["name"]}_mask.png')
    board(spec, dest / 'TAVOLA_SCALA.png')
    print(len(spec['assets']), 'templates and masks in', dest / 'modelli')


if __name__ == '__main__':
    main(*sys.argv[1:3])
