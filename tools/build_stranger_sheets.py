#!/usr/bin/env python3
"""Build Kairn and Morrow runtime atlases from the author-reference Codex masters.

The masters (4x4, facing right) follow strangers-author-reference.jpg; the old 8x3 atlases
(bald fighter, red huntress) stay in game/art/chrono as the historical baseline. Each pose is
isolated by connected components, its feet are anchored on one ground line using only the main
body (detached sparks, swooshes and smoke never move the ground) and it is pasted into a uniform
cell with transparent gutters. Pixels are not redrawn or rescaled. The tool writes the atlases, the
manifest entries in game/art/chrono/manifest.json and game/chrono-manifest.mjs, and a production
report with hashes and per-cell anchors.

Usage: python3 tools/build_stranger_sheets.py [--check]
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from sprite_isolation import OPAQUE, isolate, foot, main_body  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
GUTTER = 6
# Idle figure height in world units; Nox's idle figure is about 100 units, adults stand taller.
FIGURE_WORLD_HEIGHT = 112
COLLISION = {"x": -16, "y": -10, "width": 32, "height": 20, "space": "world",
             "source": "campaign.mjs moveActor(): x +/-16, y +/-10; anchor is actor XY ground point"}
POLICY = "campaign.mjs tickAllies() owns targets, release timing and damage; artwork cannot apply damage."
SHEETS = [
    {"id": "kairn", "name": "Kairn", "master": "assets/production/v10.2/handoff/kairn-master.png",
     "runtime": "game/art/v10/kairn.png",
     "rows": [("idle", 4, True, None), ("walk", 8, True, None), ("attack", 10, False, "kairn_impact"),
              ("guard", 6, False, None)]},
    {"id": "morrow", "name": "Morrow", "master": "assets/production/v10.2/handoff/morrow-master.png",
     "runtime": "game/art/v10/morrow.png",
     "rows": [("idle", 4, True, None), ("walk", 8, True, None), ("attack", 10, False, "morrow_saw"),
              ("shotgun", 10, False, "morrow_shot")]},
]


def build(spec, check=False):
    master = np.array(Image.open(ROOT / spec["master"]).convert("RGBA"))
    poses, (cw, ch) = isolate(master)
    feet = {}
    for key, (layer, mask) in poses.items():
        body = main_body(layer, mask)
        fx, fb, ft = foot(body)
        ys, xs = np.nonzero(layer[..., 3])
        feet[key] = (fx, fb, ft, ys.min(), ys.max(), xs.min(), xs.max())
    # Uniform cell: widest reach left/right of the feet and tallest reach above them.
    left = max(fx - x0 for fx, fb, ft, y0, y1, x0, x1 in feet.values())
    right = max(x1 - fx for fx, fb, ft, y0, y1, x0, x1 in feet.values())
    up = max(fb - y0 for fx, fb, ft, y0, y1, x0, x1 in feet.values())
    down = max(y1 - fb for fx, fb, ft, y0, y1, x0, x1 in feet.values())
    pivot_x, pivot_y = int(np.ceil(left)) + GUTTER, int(up) + GUTTER
    cell_w, cell_h = pivot_x + int(np.ceil(right)) + GUTTER + 1, pivot_y + int(down) + GUTTER + 1
    canvas = np.zeros((cell_h * 4, cell_w * 4, 4), np.uint8)
    cells = []
    for (r, c), (layer, mask) in sorted(poses.items()):
        fx, fb, ft, y0, y1, x0, x1 = feet[(r, c)]
        crop = layer[y0:y1 + 1, x0:x1 + 1]
        ox = c * cell_w + pivot_x - int(round(fx - x0))
        oy = r * cell_h + pivot_y - (fb - y0)
        dst = canvas[oy:oy + crop.shape[0], ox:ox + crop.shape[1]]
        dst[:] = np.where(crop[..., 3:4] > 0, crop, dst)
        cells.append({"row": r, "col": c, "animation": spec["rows"][r][0], "figure_height_px": fb - ft + 1,
                      "opaque_px": int(mask.sum())})
    idle_h = float(np.median([fb - ft + 1 for (r, c), (fx, fb, ft, *_) in feet.items() if r == 0]))
    draw_height = round(cell_h * FIGURE_WORLD_HEIGHT / idle_h, 2)
    out = ROOT / spec["runtime"]
    if check:
        if not np.array_equal(np.array(Image.open(out).convert("RGBA")), canvas):
            raise SystemExit(f"{spec['runtime']} is stale; rerun tools/build_stranger_sheets.py")
    else:
        Image.fromarray(canvas, "RGBA").save(out, optimize=True)
    atlas = {"path": spec["runtime"].removeprefix("game/"), "width": cell_w * 4, "height": cell_h * 4,
             "cell_width": cell_w, "atlas_columns": 4, "frame_count": 16, "reserve": False,
             "anchor_method": "Main-body median foot pixels in lower 12%; constant ground baseline; uniform cells",
             "source": spec["master"]}
    animations = []
    for r, (name, fps, loop, audio) in enumerate(spec["rows"]):
        animations.append({"character_id": spec["id"], "animation_id": name, "frame_count": 4, "fps": fps, "loop": loop,
                           "sprite_width": cell_w, "sprite_height": cell_h, "pivot_x": pivot_x, "pivot_y": pivot_y,
                           "draw_height": draw_height, "collision_box": COLLISION, "attack_box": None,
                           "attack_box_policy": POLICY, "effect_layer": "actor", "audio_event": audio,
                           "atlas_reference": spec["id"],
                           "frame_rectangles": [{"x": c * cell_w, "y": r * cell_h, "width": cell_w, "height": cell_h}
                                                for c in range(4)],
                           "status": "integrated",
                           "animation_quality": "four author-reference frames; non-playable AI support"})
    sha = lambda p: hashlib.sha256((ROOT / p).read_bytes()).hexdigest()
    report = {"id": f"character.{spec['id']}.sprite_animation_set", "name": spec["name"], "classification": "NEW",
              "master": spec["master"], "master_sha256": sha(spec["master"]), "runtime": spec["runtime"],
              "runtime_sha256": sha(spec["runtime"]), "dimensions_px": [cell_w * 4, cell_h * 4],
              "cell_px": [cell_w, cell_h], "pivot_px": [pivot_x, pivot_y], "draw_height": draw_height,
              "reference": "assets/production/v10.2/handoff/strangers-author-reference.jpg",
              "rows": [r[0] for r in spec["rows"]], "facing": "right; left by mirroring",
              "cells": cells}
    return atlas, animations, report


def write_manifests(results, check=False):
    path = ROOT / "game/art/chrono/manifest.json"
    manifest = json.loads(path.read_text())
    runtime_path = ROOT / "game/chrono-manifest.mjs"
    text = runtime_path.read_text()
    head, body = text.split("export const CHRONO_MANIFEST=", 1)
    runtime = json.loads(body.rstrip().rstrip(";"))
    for target in (manifest, runtime):
        for spec, (atlas, animations, _) in zip(SHEETS, results):
            target["atlases"][spec["id"]] = atlas
            target["animations"] = [a for a in target["animations"] if a["character_id"] != spec["id"]] + animations
    new_manifest = json.dumps(manifest, indent=2, ensure_ascii=False) + "\n"
    new_runtime = head + "export const CHRONO_MANIFEST=" + json.dumps(runtime, separators=(",", ":"), ensure_ascii=False) + ";\n"
    if check:
        if path.read_text() != new_manifest or text != new_runtime:
            raise SystemExit("chrono manifests are stale; rerun tools/build_stranger_sheets.py")
        return
    path.write_text(new_manifest)
    runtime_path.write_text(new_runtime)


if __name__ == "__main__":
    check = "--check" in sys.argv
    results = [build(s, check) for s in SHEETS]
    write_manifests(results, check)
    if not check:
        (ROOT / "assets/production/v10.2/strangers-production.json").write_text(
            json.dumps([r for *_, r in results], indent=2) + "\n")
    for _, _, r in results:
        print(r["name"], r["dimensions_px"], "cell", r["cell_px"], "draw", r["draw_height"], r["runtime_sha256"][:12])
