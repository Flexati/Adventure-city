#!/usr/bin/env python3
"""Build runtime reload sheets from the Codex reload masters.

The masters share the 4x4 grid of the equipped VX-9/R-12 sheets (rows: side, back, front,
diagonal; columns: lower, extract, insert, ready), but soles and barrels cross the nominal cell
lines. The renderer crops exact cells, so each pose is isolated by connected components, its feet
are re-anchored to the equipped sheet of the same row, and it is pasted into a clean cell.
Pixels are never redrawn or rescaled: identity, palette and pixel density stay those of the master.

Usage: python3 tools/build_reload_sheets.py [--check]
"""
import hashlib, json, sys
from pathlib import Path
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
from sprite_isolation import OPAQUE, isolate, foot  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
SHEETS = [
    {"id": "nox.vx9.reload", "master": "assets/production/v10.2/handoff/nox-vx9-reload-master.png",
     "reference": "game/art/v10/nox_vx9_gun.png", "runtime": "game/art/v10/nox_vx9_reload.png",
     "weapon": "vx9", "hero": "nox", "reload_seconds": 1.4},
    {"id": "lulu.r12.reload", "master": "assets/production/v10.2/handoff/lulu-r12-reload-master.png",
     "reference": "game/art/v10/lulu_r12_gun.png", "runtime": "game/art/v10/lulu_r12_reload.png",
     "weapon": "r12", "hero": "lulu", "reload_seconds": 1.6},
]
TOP_PAD = 20


def build(spec, check=False):
    master = np.array(Image.open(ROOT / spec["master"]).convert("RGBA"))
    ref = np.array(Image.open(ROOT / spec["reference"]).convert("RGBA"))
    if master.shape != ref.shape:
        raise SystemExit(f"{spec['id']}: master {master.shape} differs from equipped sheet {ref.shape}")
    poses, (cw, ch) = isolate(master)
    ref_poses, _ = isolate(ref)
    h, w = master.shape[:2]
    # Top headroom keeps raised barrels whole; the renderer scales the draw so pixel density and
    # the feet baseline match the equipped sheet exactly (see RELOAD_DRAW_SCALE in visuals.mjs).
    ch2 = ch + TOP_PAD
    h2 = int(round(4 * ch2))
    canvas = np.zeros((h2, w, 4), np.uint8)
    cells = []
    for r in range(4):
        ref_feet = [foot(ref_poses[(r, c)][1]) for c in range(4)]
        ref_x = float(np.median([f[0] - c * cw for c, f in enumerate(ref_feet)]))
        ref_bottom = float(np.median([f[1] - r * ch for f in ref_feet]))
        target_bottom = min(ref_bottom, ch - 2) + TOP_PAD
        for c in range(4):
            layer, mask = poses[(r, c)]
            fx, fb, ft = foot(mask)
            ys, xs = np.nonzero(layer[..., 3])
            by0, by1, bx0, bx1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
            crop = layer[by0:by1, bx0:bx1]
            ox = int(round(c * cw + ref_x - fx)) + bx0
            oy = int(round(r * ch2 + target_bottom - fb)) + by0
            x0, x1 = int(round(c * cw)), int(round((c + 1) * cw))
            y0, y1 = int(round(r * ch2)), int(round((r + 1) * ch2))
            cx0, cy0 = max(ox, x0), max(oy, y0)
            cx1, cy1 = min(ox + crop.shape[1], x1), min(oy + crop.shape[0], y1)
            part = crop[cy0 - oy:cy1 - oy, cx0 - ox:cx1 - ox]
            canvas[cy0:cy1, cx0:cx1] = np.where(part[..., 3:4] > 0, part, canvas[cy0:cy1, cx0:cx1])
            clipped = int((crop[..., 3] > OPAQUE).sum() - (part[..., 3] > OPAQUE).sum())
            cells.append({"row": r, "col": c, "foot_x_in_cell": round(ref_x, 1),
                          "baseline_in_cell": round(target_bottom, 1), "pose_height_px": fb - ft + 1,
                          "clipped_opaque_px": clipped, "opaque_px": int(mask.sum())})
    out = Image.fromarray(canvas, "RGBA")
    data_path = ROOT / spec["runtime"]
    if check:
        current = np.array(Image.open(data_path).convert("RGBA"))
        if not np.array_equal(current, canvas):
            raise SystemExit(f"{spec['runtime']} is stale; rerun tools/build_reload_sheets.py")
    else:
        out.save(data_path, optimize=True)
    sha = lambda p: hashlib.sha256((ROOT / p).read_bytes()).hexdigest()
    return {**{k: spec[k] for k in ("id", "hero", "weapon", "reload_seconds", "master", "reference", "runtime")},
            "classification": "ADAPT", "producer": "Codex master; isolation and foot re-anchoring by this tool",
            "master_sha256": sha(spec["master"]), "runtime_sha256": sha(spec["runtime"]),
            "dimensions_px": [w, h2], "cell_px": [round(cw, 2), round(ch2, 2)],
            "reference_cell_height_px": round(ch, 2), "draw_scale": round(ch2 / ch, 6), "grid": "4 columns x 4 directional rows",
            "rows": ["side", "back", "front", "diagonal"], "columns": ["lower", "extract", "insert", "ready"],
            "runtime_event": "arsenal.reloadRemaining > 0 for the active weapon while the hero stands; "
                             "column = elapsed fraction of the weapon reload x 4",
            "cells": cells, "max_clipped_opaque_px": max(c["clipped_opaque_px"] for c in cells)}


if __name__ == "__main__":
    check = "--check" in sys.argv
    report = [build(s, check) for s in SHEETS]
    if not check:
        (ROOT / "assets/production/v10.2/reload-production.json").write_text(json.dumps(report, indent=2) + "\n")
    for r in report:
        print(r["id"], r["runtime_sha256"][:12], "max clipped", r["max_clipped_opaque_px"])
