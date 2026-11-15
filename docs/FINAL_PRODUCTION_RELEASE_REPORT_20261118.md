# Chronos Adventure: Nox & Lulù — Final Production Release Report

**Lead Game Designer Persona:** Ciro (Senior 2D Action & Platform Designer)  
**Target:** Commercial Release Candidate (Web + Android Asset Bundle)  
**Build & Test Verification Date:** Latest post-fix run (all metrics observed directly after final code edits)

---

## 1. Executive Summary

Chronos Adventure: Nox & Lulù passes all **479** automated unit, narrative, economy, bundle-weight, muzzle-calibration, and combat-balance tests (`479/479 PASS, 0 FAIL`), builds cleanly (`compile_applet` + `lint_applet`), stays safely inside the Android `app.js` byte ceiling (**451,251 bytes <= 458,752 bytes**, leaving **7,501 bytes** of headroom), and has been visually inspected in live Chromium via Playwright across menus, dialogue portraits, `01 · Blackout`, `Il porto esterno (docks_veyra)`, `Moon Refuge` hub, NPC interior (`Officina di Dario`), and consequential Key Character Arc story choices (`0` console errors).

---

## 2. Firing Behavior Investigation (`L'errore del fuoco di sparo`)

Detailed diagnosis of the gunfire behavior separating **intentional early-stage manual aim design** from **two verified later-weapon bugs (now resolved)**:

### A. Specific to the Beginning (`01 · Blackout` / `c9`) — Intentional Manual Aim UX
- In `01 · Blackout`, `state.arsenal` is disabled (`campaignArsenalV9` unlocks the full arsenal after Rook is defeated / Tessa's Field Kit is delivered). Even with `c9`, its stats are `cooldown: 0.40s` and `burst: 1`.
- In `game/runtime.mjs:882`, continuous hold-to-fire (`autoGun`) activates only when `aw?.burst >= 3 || aw?.fastWindup || aw?.proj === 'flame' || aw?.cooldown <= 0.36`.
- Therefore, in `01 · Blackout`, holding the `#gun` touch button intentionally draws the dashed white aim sightline and fires **on finger release** (`onpointerup`), matching the pause help copy (*"trascina e rilascia per mirare"*). Verified visually in Playwright (`01 · Blackout` right & left shots).
- All four core sprite-sheet weapons (`c9`, `vx9`, `r12`, `h17`, `arc7`) match their painted spritesheets within `<= 2 px` across all 4 facing/aim vectors (`python3 tools/measure_muzzles_r28.py --check` -> `MUZZLE_V9 matches the sheets`).

### B. Proven Bugs on Rapid & Custom Market Weapons — Both Fixed & Verified
1. **Sprite Firing Animation Freeze (`game/visuals.mjs`)**:  
   `heroFrame()` previously hardcoded `.09s` windup instead of `a.windup ?? .09`. Rapid weapons (`windup: 0.015s`, `0.08s` burst) finished or restarted before ever leaving frame `col=0`. Respecting `a.windup` restores crisp recoil/flash frames across all burst rates.
2. **Custom Weapon ~20 px Barrel-to-Muzzle Offset (`game/village-art.mjs` & `game/runtime.mjs`)**:  
   `drawHeldWeaponAndMuzzle()` drew market guns (`mg_*`, `flame_pyre`, `orb_*`, `cryo_shard`, etc.) offset from `(actor.x ± 14, actor.y - 46 + dir.y * 10)` while projectiles and `muzzle_flash` spawned from `muzzleV9()` (`[±42, -66]` horizontal, `[0, -96]` up). Anchoring each custom gun's barrel tip directly at `muzzleV9(name, state.arsenal.active, wd)` eliminates the barrel-to-flash offset in all directions.

---

## 3. Gameplay, Economy, Narrative & UI Fixes Completed

- **Machine-Gun Spin-Up & Rapid Arsenal (`game/campaign.mjs`, `game/weapons-v9.mjs`)**:  
  Continuous bursts build `spinUp` (`0 → 1`, scaling fire cooldown down by up to `40%`) on rapid-fire/tracer/flame weapons while remaining responsive and balanced.
- **Interactive Treasure Chests (`game/campaign.mjs`, `game/village-art.mjs`)**:  
  Each combat mission spawns up to 2 interactive 3D chests (`supply` / `chrono`) that open within `64 px` touch or `104 px` prompt (`APRI FORZIERE`), granting `+3 HP`, `+25 DUO`, `+15 Coins`, `+12 Scrap`, and active magazine refill.
- **Consequential Story Choices & Key Character Arcs (`game/arsenal-data.mjs`, `game/missions.mjs`, `game/story-v08.mjs`)**:  
  14 district hubs and Key Character Arcs (e.g., Dario/Mira in `Moon Refuge`, Veyra, Tessa, etc.) unlock mechanical mission perks and narrative reactivity. Fixed `glass_truth` perk scaling (`game/missions.mjs`) so `duoBonus` applies cleanly to `['contagion', 'app_clinic', 'app_node']` while maintaining the difficulty progression curve `blackout <= zero <= finale` across all 25 foot missions (`tests/combat-audit.test.mjs`).
- **Hub Exploration Mode Regression Fixed (`game/runtime.mjs:309`)**:  
  Live Playwright testing revealed `openHub()` set `mode = 'loading'` during async asset decode without restoring `mode = 'hub'` afterward, preventing hub canvas rendering and movement. Restored `mode = 'hub'` right after `prepareMapRasters()`; verified live navigation into `Moon Refuge`, entering `Officina di Dario`, and triggering `PIANO DI SFONDAMENTO · ATTO II`.
- **Combo HUD Non-Overlap Fix (`game/village-art.mjs:902`)**:  
  Visual inspection of combat screenshots caught `#bag` (`Bagaglio`) overlapping the canvas-drawn `SERIE ×n` streak panel. Moved `drawComboStreakHud` cleanly beneath `#bag` (`y = 148` standard, `y = 202` when boss bar shifts `#bag`, `y = 124` in compact landscape `<= 500 px`), verified visually in Chromium.
- **Android Bundle Weight Compliance (`game/interiors.mjs`, `game/arsenal-data.mjs`)**:  
  Relocated `INTERIORS` table into `world.js` via `arsenal-data.mjs`, bringing `app.js` back under the strict `458,752` byte budget.

---

## 4. Verification Metrics (Post-Final-Edit)

### Automated Test Suite
- **Command:** `node --test tests/*.test.mjs`
- **Result:** **479 / 479 PASS, 0 FAIL** (`0` cancelled, `0` skipped, `~36.7 s`)
- **Muzzle Verification:** `python3 tools/measure_muzzles_r28.py --check` -> **`MUZZLE_V9 matches the sheets`**

### Android Asset Bundle (`tools/prepare_android_assets.py`)
| Artifact | Size (bytes) | Constraint |
|---|---:|---|
| `android/build/assets/game/app.js` | **451,251** | `<= 458,752` (`7,501` bytes headroom) |
| `android/build/assets/game/world.js` | **149,712** | Packed world/economy/interiors module |
| `android/build/assets/game/en.js` | **171,151** | English localization bundle |
| `android/build/assets/game/index.html` | **18,196** | Entry HTML |
| `android/build/assets/game/style.css` | **73,144** | Unified game stylesheet |

### Live Browser (Playwright Chromium `1440×900`)
- Verified `0` JavaScript console errors across all tested states (`AudioContext` autoplay notice pre-gesture only).
- Inspected rendered screenshots for:
  - Main Menu & Portal Frame (`Chronos Adventure: Nox & Lulù`)
  - Dialogue Portrait Box (`#talk`, Nox speaker badge & portrait)
  - `01 · Blackout` manual aim line on hold (`#gun`) and aligned left/right gunfire flash
  - `Il porto esterno (docks_veyra)` with `mg_shredder` (`Mitragliatrice Rotativa V-12`) auto-fire on hold (`72 -> 48` ammo), `VEYRA · ALLEATA`, aligned tracer chain, and non-overlapping `SERIE ×2` HUD badge
  - `Moon Refuge` animated village hub, compass waypoint (`★ CHIAVE Fabbro`), `Officina di Dario` interior, and `Come forzare il cordone verso l’Atto II?` Key Character Arc choice modal.
