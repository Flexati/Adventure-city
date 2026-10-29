"""Reference sheets for the GPT preproduction prompts, assembled ONLY from real game art.

Each sheet is a plain contact sheet of existing repository images (no new drawing), on a dark
neutral background, scaled to fit 1600 px, so the illustrator receives the canonical style and identities in a few
attachments. The list of source files and their SHA-256 goes to riferimenti/SORGENTI.json.

usage: build_preproduction_refs.py <out dir>
"""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BG = (28, 30, 36)

SHEETS = {
    'ref_stile_mappe.png': ['game/art/city.png', 'game/art/port.png', 'game/art/clinic.png', 'game/art/fracture.png',
                            'game/art/v05/district_props.png', 'game/art/chrono/environment.png'],
    'ref_ash_docks.png': ['game/art/v10/race_ashdocks_banchina_day.png', 'game/art/v10/race_ashdocks_banchina_night.png',
                          'game/art/v10/race_ashdocks_gru_day.png', 'game/art/v10/race_ashdocks_deposito_day.png',
                          'game/art/v10/race_container.png', 'game/art/v10/race_crane_beam_porto_day.png',
                          'game/art/v10/race_crane_load_porto_tubi.png', 'game/art/v10/race_obstacle_porto_casse.png'],
    'ref_protagonisti.png': ['game/art/v05/menu_keyart.png', 'game/art/v08/portraits.png'],
    'ref_nox.png': ['game/art/v05/nox_walk.png', 'game/art/v05/nox_actions.png', 'game/art/v10/nox_h17_gun.png'],
    'ref_lulu.png': ['game/art/v05/lulu_walk.png', 'game/art/v05/lulu_actions.png', 'game/art/v10/lulu_arc7_gun.png'],
    'ref_kairn.png': ['game/art/v10/kairn.png', 'game/art/v10/portrait_kairn.png'],
    'ref_morrow.png': ['game/art/v10/morrow.png', 'game/art/v10/portrait_morrow.png'],
    'ref_tessa.png': ['game/art/v09/tessa.png'],
    'ref_veyra.png': ['game/art/v10/portrait_veyra.png', 'game/art/v10/race_veyra_car.png'],
    'ref_rook.png': ['game/art/v09/rook.png'],
    'ref_anchor.png': ['game/art/v10/anchor_core.png', 'game/art/v10/anchor_bollards.png', 'game/art/v10/anchor_sweep.png'],
    'ref_nemici.png': ['game/art/v05/gang_states.png', 'game/art/v05/infected_states.png', 'game/art/v05/custodian_states.png',
                       'game/art/v05/alien_states.png'],
    'ref_boss.png': ['game/art/chrono/shadow_reaper.png', 'game/art/chrono/cathedral_bone_tyrant.png',
                     'game/art/chrono/toxic_forge_behemoth.png', 'game/art/chrono/chrono_overlord.png', 'game/art/v09/rook.png'],
    'ref_npc_stile.png': ['game/art/chrono/innkeeper.png', 'game/art/chrono/blacksmith.png', 'game/art/chrono/potion_alchemist.png',
                          'game/art/chrono/relic_priestess.png', 'game/art/chrono/mechanic.png', 'game/art/chrono/scavenger_kid.png',
                          'game/art/chrono/merchant.png', 'game/art/chrono/masked_informant.png', 'game/art/chrono/civilian.png'],
    'ref_vfx.png': ['game/art/v10/vfx_c9.png', 'game/art/v10/vfx_vx9.png', 'game/art/v10/vfx_r12.png', 'game/art/v05/fx_atlas.png',
                    'game/art/chrono/effects.png'],
}
MAX_W = 2048
MAX_SIDE = 1600  # final sheets fit in 1600 px: light enough to attach, still readable


def pack(paths):
    """Shelf layout: each image keeps its pixels (downscaled by nearest only if wider than the sheet)."""
    ims = []
    for p in paths:
        im = Image.open(ROOT / p).convert('RGBA')
        if im.width > MAX_W - 32:
            k = (MAX_W - 32) / im.width
            im = im.resize((int(im.width * k), int(im.height * k)), Image.NEAREST)
        ims.append(im)
    x, y, row_h, placed = 16, 16, 0, []
    for im in ims:
        if x + im.width > MAX_W - 16:
            x, y, row_h = 16, y + row_h + 16, 0
        placed.append((im, x, y))
        x += im.width + 16
        row_h = max(row_h, im.height)
    sheet = Image.new('RGBA', (MAX_W, y + row_h + 16), BG + (255,))
    for im, px, py in placed:
        sheet.alpha_composite(im, (px, py))
    sheet = sheet.convert('RGB')
    k = MAX_SIDE / max(sheet.size)
    if k < 1:
        sheet = sheet.resize((int(sheet.width * k), int(sheet.height * k)), Image.LANCZOS)
    return sheet


def main(out):
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    record = {}
    for name, paths in SHEETS.items():
        sheet = pack(paths)
        sheet.save(out / name, optimize=True)
        b = (out / name).read_bytes()
        record[name] = {'bytes': len(b), 'sha256': hashlib.sha256(b).hexdigest(), 'size': list(sheet.size),
                        'sources': [{'path': p, 'sha256': hashlib.sha256((ROOT / p).read_bytes()).hexdigest()} for p in paths]}
    (out / 'SORGENTI.json').write_text(json.dumps({'note': 'Contact sheets of existing game art only; no new drawing.', 'sheets': record}, indent=1) + '\n')
    print(len(record), 'reference sheets')


if __name__ == '__main__':
    main(sys.argv[1])
