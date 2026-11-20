# R57 asset manifest — Chronos Adventure: Nox & Lulú

Approved finals only, for Gemini to integrate on the **free variant** first (`jaguarZcreatorZ13.app.free`). Loris approved these graphics (style) and these audio beds (listening, 20 Nov 2026, Europe/Rome). Folly cannot hear audio; two beds (clinic, bazaar) are technically uneven and were approved with that caveat.

Package convention: paths below are relative to this folder. SHA-256 is of the packaged file. Formats: PNG (RGBA unless noted), WebP (RGB, no alpha), OGG Vorbis 48 kHz mono. **Ship WebP/OGG only in the Android bundle for new opaque art and all audio; no WAV.** PNG is required for transparent portraits, rims, UI and road layers, and for the Play feature graphic.

Helper: `_inventory.json` repeats size, dimensions, SHA-256 and provenance for every asset.

Style lock (do not break): dark neon-noir; cyan rim `#64deff` for Nox; magenta rim `#ff75d8` for Lulú; danger telegraph `#ff765e`; mint objectives `#7dffd0`; amber only for practical lights. **No text, letters, numbers, logos, watermarks or UI chrome inside artwork.** Do not redraw Nox or Lulú identities; the rim sheets keep the existing v05 grid.

---

## 1. Store / teaser / unlock

| Package file | Purpose | Target repo path | Size / format | Used on | Notes |
|---|---|---|---|---|---|
| `assets/graphics/store/a1_feature_1024x500.png` | Google Play feature graphic (no title). Replaces the old asset that contained a brand logo. | `assets/source/store/store_feature_1024x500_notitle.png` | 665 407 B · PNG RGB · **1024×500 exact, no alpha** | Play Console listing (not inside the APK gameplay bundle) | Batch 1 A1 **v2** (chosen). Keep important elements inside the central 924×400. Do not add a title or logo. |
| `assets/graphics/teaser/a2_teaser_1080x1920.webp` | Act I cliffhanger / breach wall, vertical. | Suggested: `game/art/atti/teaser_breccia_9x16.webp`. Point `#teaser-art` in `game/style.css` here (today it reuses `art/atti/atto_2.webp`). | 78 406 B · WebP RGB · 1080×1920 | Free-edition Act I teaser (`#teaser-art`, `FREE_TEASER_LINES` in `game/native-bridge.mjs`). Paid app must **not** show this teaser. | Batch 2 **fix**: crane pilot is Veyra with correct hair; the clock face has ticks only (no numerals). Lower ~30 % is darker for the dialogue box. No 16:9 teaser is in this pack. |
| `assets/graphics/unlock/a3_unlock_hero_1200x540.webp` | Unlock-screen hero: Acts II–IV as one blended triptych. | Suggested: `game/art/atti/unlock_hero_1200x540.webp`. Point `.store-hero` in `game/style.css` here (today it reuses `atto_2.webp`). | 48 800 B · WebP RGB · 1200×540 | `#store-panel` / `.store-hero` on the free app after Act I (IAP `unlock_full_game`). | Batch 2 **fix**: three panels blend with no hard borders. Honest, inviting, no scarcity/timer/alarm language in the art (and none in the UI). |

---

## 2. Dialogue portraits (A4)

All 512×512 PNG RGBA, transparent busts. They replace the tiny `game/art/v08/portraits.png` (576×192, three 192 px cells) and `game/art/v10/portrait_veyra.png` / `portrait_kairn.png` / `portrait_morrow.png` (128 px class). **Do not change speaker IDs.** Hook them through `SPEAKERS` in `game/story-v08.mjs` and `PORTRAIT_ALIAS` + `portraitClass()` in `game/runtime.mjs`, plus CSS in `game/style.css` (today only `.portrait.p0/.p1/.p2` use the strip; `.pkairn/.pmorrow/.pveyra` already use one file each). Suggested on-disk names: `game/art/v10/portrait_{name}_{expression}.png`. Default to **neutral**; use tense for combat barks and warm for refuge/hub lines if you can do it without new story text. Register new files in `tools/prepare_android_assets.py` (v10 `*.png` is already glob-copied) **and** in the `AssetRoutes.java` allowlist (today it only lists `portrait_kairn|portrait_morrow|portrait_veyra`).

Nox and Lulú already have three expressions. Veyra has three. Everyone else in this pack is **neutral only**.

| Package file | Character / expression | Bytes | Used on | Notes |
|---|---|---|---|---|
| `assets/graphics/portraits/a4_portrait_nox_neutral_512.png` | Nox · neutral | 159 828 | Dialogue / opening face / barks (`SPEAKERS['NOX']`, alias `p0`) | Cyan rim. Identity from existing v08 portrait, refined, not redrawn. |
| `assets/graphics/portraits/a4_portrait_nox_tense_512.png` | Nox · tense | 153 444 | Combat barks | |
| `assets/graphics/portraits/a4_portrait_nox_warm_512.png` | Nox · warm | 140 711 | Refuge / quiet hub lines | |
| `assets/graphics/portraits/a4_portrait_lulu_neutral_512.png` | Lulú · neutral | 153 504 | Dialogue / opening face (`SPEAKERS['LULÚ']`, alias `p1`) | Magenta rim, green jacket. |
| `assets/graphics/portraits/a4_portrait_lulu_tense_512.png` | Lulú · tense | 188 548 | Combat barks | |
| `assets/graphics/portraits/a4_portrait_lulu_warm_512.png` | Lulú · warm **fixed** | 201 525 | Refuge / quiet hub lines | Green fringe removed in a later pass. Use this file only. |
| `assets/graphics/portraits/a4_portrait_veyra_neutral_512.png` | Veyra · neutral | 201 993 | Dialogue (`SPEAKERS['VEYRA']`, `.pveyra`), Act I teaser | **Style is more painted than the pixel portraits.** Usable; keep her identity consistent across expressions. |
| `assets/graphics/portraits/a4_portrait_veyra_tense_512.png` | Veyra · tense | 210 411 | Tense Veyra lines | Same painted-leaning style. |
| `assets/graphics/portraits/a4_portrait_veyra_warm_512.png` | Veyra · warm | 208 356 | Warm Veyra lines | Same painted-leaning style. |
| `assets/graphics/portraits/a4_portrait_rook_neutral_512.png` | Rook · neutral | 202 201 | `SPEAKERS['ROOK']` (alias `prook` exists; no CSS file yet) | Orange jacket + mask, faithful to the original. Neutral only. |
| `assets/graphics/portraits/a4_portrait_eve_neutral_512.png` | Eve · neutral | 230 673 | `SPEAKERS['EVE']` (today `p2` on the 192 px strip) | **Eyes a little light.** Neutral only. |
| `assets/graphics/portraits/a4_portrait_vega_neutral_512.png` | Vega · neutral | 167 823 | `SPEAKERS['VEGA']` (`pvega`) | Neutral only. |
| `assets/graphics/portraits/a4_portrait_mira_neutral_512.png` | Mira · neutral | 151 346 | `SPEAKERS['MIRA']` (`pmira`) | **Eyes a little light.** Neutral only. |
| `assets/graphics/portraits/a4_portrait_tessa_neutral_512.png` | Tessa · neutral | 189 436 | Field kit / Moon Refuge context. **Tessa is not in `SPEAKERS` today.** | Add a portrait class only if you show her face; do not invent new story lines. Neutral only. |
| `assets/graphics/portraits/a4_portrait_dario_neutral_512.png` | Dario · neutral | 236 784 | `SPEAKERS['DARIO']` (`pdario`) | Neutral only. |
| `assets/graphics/portraits/a4_portrait_ines_neutral_512.png` | Ines · neutral | 175 148 | `SPEAKERS['INES']` (`pines`) | Neutral only. |
| `assets/graphics/portraits/a4_portrait_kairn_neutral_512.png` | Kairn · neutral | 209 510 | `SPEAKERS['KAIRN']` (`.pkairn`, today `art/v10/portrait_kairn.png`) | Neutral only. |
| `assets/graphics/portraits/a4_portrait_morrow_neutral_512.png` | Morrow · neutral | 196 992 | `SPEAKERS['MORROW']` (`.pmorrow`) | Neutral only. |

Missing from this pack (do not invent, leave existing art): tense/warm for Rook, Eve, Vega, Mira, Tessa, Dario, Ines, Kairn, Morrow; any portrait for Lia, Archon, Custode, Unità 9, The Anchor, Abitante, Sistema.

---

## 3. Act cards (A6)

Replace `game/art/atti/atto_1.webp` … `atto_4.webp` (today 1280×720) behind `#card.a1`–`#card.a4`, the opening screen (`atto_1` on `.opening-screen`), and the act menu. **Ship both 9:16 and 16:9** and switch with a CSS orientation / aspect-ratio media query (e.g. `atto_N_9x16.webp` + `atto_N_16x9.webp`). Update `AssetRoutes.java` (today only `atto_[1-4]\.webp`) and any tests that assume a single filename (`tests/argon-giro3.test.mjs`). Existing `#card` radial darkening must keep title + 16 px objective readable.

| Package file | Act / title | Bytes · size | Mid-band luminance (35–65 % height) | Notes |
|---|---|---|---|---|
| `assets/graphics/act_cards/a6_act1_citta_al_buio_1080x1920.webp` | I · La città al buio · 9:16 | 99 846 B · 1080×1920 | 7.8 % | Batch 2. Strong, dark, recommended. |
| `assets/graphics/act_cards/a6_act1_citta_al_buio_1920x1080.webp` | I · 16:9 | 143 892 B · 1920×1080 | 6.7 % | Batch 3 **clean plate** (no dark bars). **Do not use** the older batch-2 16:9 (58 468 B, barred). |
| `assets/graphics/act_cards/a6_act2_la_breccia_1080x1920.webp` | II · La breccia · 9:16 | 76 692 B · 1080×1920 | 15.4 % | Batch 4. |
| `assets/graphics/act_cards/a6_act2_la_breccia_1920x1080.webp` | II · 16:9 | 97 356 B · 1920×1080 | 16.4 % | Batch 4. |
| `assets/graphics/act_cards/a6_act3_due_strade_1080x1920.webp` | III · Due strade · 9:16 | 238 102 B · 1080×1920 | **27.2 %** | Batch 4. **Caveat: mid luminance ≈ 26–27 %** (authoring target was &lt; 25 %). Verify title contrast on top of the existing dark gradient; do not add text into the image. |
| `assets/graphics/act_cards/a6_act3_due_strade_1920x1080.webp` | III · 16:9 | 225 396 B · 1920×1080 | **26.8 %** | Same mid-luminance caveat. |
| `assets/graphics/act_cards/a6_act4_ora_uno_1080x1920.webp` | IV · Ora uno · 9:16 | 106 402 B · 1080×1920 | 21.0 % | Batch 4. Overall brighter (dawn); the mid band is within target, the frame overall is ~29 %. |
| `assets/graphics/act_cards/a6_act4_ora_uno_1920x1080.webp` | IV · 16:9 | 101 988 B · 1920×1080 | 25.0 % | Mid band at the 25 % edge; keep the card gradient. |

---

## 4. UI kit (A8)

PNG RGBA, no letters in the art (the game writes IT/EN). Current menu frame is `game/art/ui/frame_menu.webp` (allowlisted as `.webp` in `AssetRoutes.java`; `tests/argon-ui.test.mjs` expects that path). If you keep WebP, convert the frame **to WebP** without introducing text; if you ship PNG, update the route, the copier (`prepare_android_assets.py` currently copies `art/ui/*.webp` only) and the tests. Touch targets stay ≥ 44 px. 9-slice: uniform corners, empty centre.

| Package file | Purpose | Suggested target | Bytes · size | Notes |
|---|---|---|---|---|
| `assets/graphics/ui/a8_frame_holographic_512.png` | Holographic glass frame (replaces bronze steampunk `frame_menu.webp`) | `game/art/ui/frame_menu.webp` (after convert) or a new `frame_holographic` + CSS `border-image` | 181 879 B · 512×512 | Cyan/magenta neon edge, navy fill, 48 px corners. |
| `assets/graphics/ui/a8_button_primary_384x96.png` | Primary button skin | `game/art/ui/button_primary_384x96.png` (or WebP) | 34 873 B · 384×96 | No label in the image. |
| `assets/graphics/ui/a8_button_secondary_384x80.png` | Secondary button skin | `game/art/ui/button_secondary_384x80.png` | 29 905 B · 384×80 | Use for «Ripristina» / «Torna al menu»: readable, not disabled-looking. |
| `assets/graphics/ui/a8_healthbar_shell_512x48.png` | Health / boss bar empty shell | `game/art/ui/healthbar_shell_512x48.png` | 20 277 B · 512×48 | Fill stays code-drawn. |
| `assets/graphics/ui/a8_icon_bag_96.png` | Bagaglio | `game/art/ui/icon_bag_96.png` | 14 035 B · 96×96 | |
| `assets/graphics/ui/a8_icon_dodge_96.png` | Schiva | `game/art/ui/icon_dodge_96.png` | 14 410 B · 96×96 | |
| `assets/graphics/ui/a8_icon_duo_96.png` | Duo | `game/art/ui/icon_duo_96.png` | 14 246 B · 96×96 | |
| `assets/graphics/ui/a8_icon_heal_96.png` | Cura | `game/art/ui/icon_heal_96.png` | 13 607 B · 96×96 | |
| `assets/graphics/ui/a8_icon_pulse_96.png` | Pulse | `game/art/ui/icon_pulse_96.png` | 16 840 B · 96×96 | |
| `assets/graphics/ui/a8_icon_shoot_96.png` | Spara | `game/art/ui/icon_shoot_96.png` | 13 453 B · 96×96 | |

The composite contact sheet `a8_ui_kit_sheet.png` is **not** included (preview only).

---

## 5. Hero rim light (A9)

Drop-in replacements for the v05 hero sheets. **Pixel size matches the originals exactly.** Keep `game/sheet-layout.mjs` cell size, frame order, hitboxes and timings. Cyan rim on Nox, magenta on Lulú. These **replace** (do not sit beside) the current files, so APK weight should stay roughly neutral.

| Package file | Target repo path | Bytes · size | Match vs current v05 |
|---|---|---|---|
| `assets/graphics/rims/a9_nox_walk_rim.png` | `game/art/v05/nox_walk.png` | 1 186 138 B · 1332×1280 | identical size |
| `assets/graphics/rims/a9_lulu_walk_rim.png` | `game/art/v05/lulu_walk.png` | 1 121 101 B · 1340×1236 | identical size |
| `assets/graphics/rims/a9_nox_gun_rim.png` | `game/art/v05/nox_gun.png` | 1 239 050 B · 1428×1372 | identical size |
| `assets/graphics/rims/a9_lulu_gun_rim.png` | `game/art/v05/lulu_gun.png` | 1 193 340 B · 1476×1384 | identical size |
| `assets/graphics/rims/a9_nox_actions_rim.png` | `game/art/v05/nox_actions.png` | 1 530 576 B · 1924×1232 | identical size |
| `assets/graphics/rims/a9_lulu_actions_rim.png` | `game/art/v05/lulu_actions.png` | 1 511 846 B · 1788×1284 | identical size |
| `assets/graphics/rims/a9_nox_magic_rim.png` | `game/art/v05/nox_magic.png` | 1 650 037 B · 1804×1360 | identical size |
| `assets/graphics/rims/a9_lulu_magic_rim.png` | `game/art/v05/lulu_magic.png` | 1 722 909 B · 1628×1328 | identical size |

`prepare_android_assets.py` already glob-copies `art/v05/*.png`. `AssetRoutes.java` already allowlists these eight names. After replace, keep `npm test` and sheet-layout tests green. Do not retouch faces or clothes.

---

## 6. Driving parallax (A5) — partial, approved subset only

Suggested paths: `game/art/v10/road_layer_{mid,near}_a2.png` and `road_layer_mid_a3.png`. Keep `game/art/v05/driving_road.png` as the road itself. Draw extra layers only when `!settings.reduced`, at different scroll speeds (design: far 0.25× / mid 0.6× / near 1.4×). Do **not** cover the car, obstacles or danger telegraphs. Do **not** use the excluded layers (Act I far/mid, Act II far — wrong or badly seamed).

| Package file | Layer | Bytes · size | Used on | Notes |
|---|---|---|---|---|
| `assets/graphics/road_layers/a5_road_layer_mid_a2_512x1774.png` | Mid, Act II | 220 627 B · 512×1774 | Drives `app_breach`, `signal`, `evacuation` (Act II) | **Usable, not perfect** — vertical seams may show. |
| `assets/graphics/road_layers/a5_road_layer_near_a2_256x1774.png` | Near, Act II | 108 584 B · 256×1774 | Same Act II drives | **Usable, not perfect** seams. |
| `assets/graphics/road_layers/a5_road_layer_mid_a3_512x1774.png` | Mid, Act III | 246 930 B · 512×1774 | Drives `ring`, `tunnel` (Act III) | **Usable, not perfect** seams. Mid only (no far/near for Act III). |

Missing (leave current road only): all Act I layers, Act II far, Act III far/near, all Act IV. Do not invent replacements in this pass.

New v10 PNGs are glob-copied by the packer, but must be added to the `AssetRoutes.java` v10 PNG allowlist.

---

## 7. Ambience loops (approved)

Copy into `game/audio/chrono/` under **unique filenames** (keep the `actN_…` names). Do not overwrite `old_town.ogg`, `cathedral.ogg`, `toxic_market.ogg`, `clockwork.ogg`, `necropolis.ogg`, `refuge.ogg` in place: those 8 s beds remain fallbacks for places that still have no unique bed. Wire **per stage / hub**, not by replacing a kind default. See `INTEGRATION_PLAN.md`.

Engine today (`game/audio-engine.mjs`): only `chrono_<name>` kinds with a decoded buffer make nodes. Kinds `city`, `port`, `dark`, `drive` spawn **0 nodes** (`tests/narrative-links-v10_3.test.mjs`). `preloadChrono(kind, extra[], ambience?)` loads `audio/chrono/<name>.ogg`. Defaults: kind `0 → old_town`, `1 → cathedral`, `2 → toxic_market`, `3 → clockwork`. Existing overrides: `below → necropolis`, hub `moon → refuge`. If `def.ambience === 'port'` (`exp_chalk_marks`) that **wins and stays silent**. Drive missions call `setAmbience('drive')` and stay silent. `collapse` never calls preload/setAmbience.

Register every new `.ogg` in `prepare_android_assets.py` (explicit chrono list) and `AssetRoutes.java` (chrono allowlist). Audio stays **out of `app.js`**. Engine already sets `source.loop = true` and a 380 Hz high-pass; fade-in 1 s to gain 0.06, fade-out 0.4 s; follows the **effects** slider; silent when sound is off.

Format: OGG Vorbis q5, 48 kHz mono, TP ≤ −1 dBTP (Moon Refuge was re-peaked to about **−1.4 dBTP**, I ≈ −19.1 LUFS — use the file in this pack, not the older louder one). Act I beds ≈ 14.75 s (escape 7.75 s); Acts II–IV beds 11.75 s (12 s minus 250 ms equal-power crossfade).

| Package file | Bytes · duration | Target repo path | Stages / hubs | Notes |
|---|---|---|---|---|
| `assets/audio/loops/act1_blackout_cantiere.ogg` | 145 708 B · 14.75 s | `game/audio/chrono/act1_blackout_cantiere.ogg` | `blackout`, `app_yard`, `city` (same quarter, including the Act III return) | Kind `'city'` must stay silent; use `chrono_act1_blackout_cantiere`. |
| `assets/audio/loops/act1_docks_veyra.ogg` | 142 442 B · 14.75 s | `game/audio/chrono/act1_docks_veyra.ogg` | `docks_veyra`, hub `ash_docks` | **Bug today:** uses `old_town`. Fix with a per-stage override. |
| `assets/audio/loops/act1_moon_refuge.ogg` | 134 417 B · 14.75 s | `game/audio/chrono/act1_moon_refuge.ogg` | hub `moon` | True-peak already lowered. Moon already has a `refuge` override — point it at this unique name (keep old `refuge.ogg` as unused fallback or leave it for anything still mapped there). |
| `assets/audio/loops/act1_escape_drive.ogg` | 75 088 B · 7.75 s | `game/audio/chrono/act1_escape_drive.ogg` | **`escape` only** | **Bug today:** `setAmbience('drive')` is silent. Prefer a new kind `chrono_act1_escape_drive` so the generic `'drive'` kind can stay silent (see tests). **Do not** reuse this bed for `app_breach`, `signal`, `evacuation`, `ring`, `tunnel` (those beds are still missing). |
| `assets/audio/loops/act2_clinic_contagion.ogg` | 109 510 B · 11.75 s | `game/audio/chrono/act2_clinic_contagion.ogg` | `app_clinic`, `contagion`, hub `clinic_ward` | **Caveat: uneven bed** (LRA ≈ 17.9 LU). Approved anyway; do not substitute `toxic_market`. Listen-flag for the device build. |
| `assets/audio/loops/act2_port_antenne.ogg` | 108 077 B · 11.75 s | `game/audio/chrono/act2_port_antenne.ogg` | `breach`, `port`, hub `antenna_port`; also Act III `port` (same place) | Today `breach` wrongly gets `cathedral.ogg`. |
| `assets/audio/loops/act2_cathedral_quarter.ogg` | 105 455 B · 11.75 s | `game/audio/chrono/act2_cathedral_quarter.ogg` | hub `cathedral`, `bone_tyrant` (same nave) | `bone_tyrant` is kind 2 and would take `toxic_market` — override is mandatory. Do not share with the port. |
| `assets/audio/loops/act3_forge.ogg` | 107 932 B · 11.75 s | `game/audio/chrono/act3_forge.ogg` | `forge_behemoth` | Distinct from the bazaar. |
| `assets/audio/loops/act3_toxic_bazaar.ogg` | 109 240 B · 11.75 s | `game/audio/chrono/act3_toxic_bazaar.ogg` | hub `toxic` | **Caveat: uneven bed** (LRA ≈ 19.3 LU). Approved anyway. Distinct from clinic and forge. |
| `assets/audio/loops/act3_eve_archive.ogg` | 112 712 B · 11.75 s | `game/audio/chrono/act3_eve_archive.ogg` | `archive`, hub `deep_archive` | Distinct from the clinic. `archive` would otherwise take `toxic_market`. |
| `assets/audio/loops/act3_vega_sky_rail.ogg` | 110 013 B · 11.75 s | `game/audio/chrono/act3_vega_sky_rail.ogg` | `vega`, hub `sky_rail` | Distinct from clockwork and from Axis wind. |
| `assets/audio/loops/act4_axis_wind.ogg` | 111 511 B · 11.75 s | `game/audio/chrono/act4_axis_wind.ogg` | `app_axis`, `ascent`; for now also `finale` / hub `axis_crown` | Same bed shared on purpose until a platform variant exists (missing). High-pass at 380 Hz may thin the wind — re-check on device. |

### Still missing (keep current 8 s fallbacks; do not recycle a different place’s new bed)

Glass Flood / `glass_terrace` / `glass_reaper`; Clockwork Outpost hub `clockwork`; Central Node `app_node` / `zero` / `node_commons` (must stay **distinct** from the outpost); `below` / `lower_hearth` (keep `necropolis` override; `'dark'` is silent); `line`; a unique bed for `exp_chalk_marks` / `chalk_harbor` (provisional: use the port bed, but remove `ambience: 'port'` so it is not silent); a finale-platform variant; `collapse` (must call preload in `startCollapse()`, do not leave the previous stage’s bed); drives other than `escape`.

### One special silent-case fix

`exp_chalk_marks` (hub `chalk_harbor`): today `ambience: 'port'` forces silence. Remove that field and preload `act2_port_antenne` as a **provisional** same-harbour bed. A unique chalk bed is still missing.

---

## 8. Act I one-shots (approved)

OGG Vorbis, 48 kHz mono, 2.0 s each. Suggested path: `game/audio/chrono/` (or `game/audio/v10/` if you prefer to keep beds and SFX apart — then extend the loader). Register in the packer + `AssetRoutes`. Preload on Act I stages. Follow the effects slider; do not invent a second bus. **Not** in `app.js`.

| Package file | Bytes | Suggested cue | Notes |
|---|---|---|---|
| `assets/audio/oneshots/act1_thunder_distant.ogg` | 22 117 | Sparse distant thunder during `blackout` / the yard in the rain | Do not loop; cap frequency so it does not become a bed. |
| `assets/audio/oneshots/act1_relay_spark.ogg` | 23 325 | When a Blackout relay lights | One shot per relay, not a spray. |
| `assets/audio/oneshots/act1_crane_groan.ogg` | 22 077 | Sparse crane groan in `docks_veyra` / `ash_docks` | Near cranes, not on every step. |

The concatenated listening preview `anteprima_oneshot_tuono_scintilla_gru.ogg` is **not** included and must not be shipped.

---

## 9. Explicitly excluded (do not integrate)

- Act I road layers `a5_road_layer_far_a1`, `mid_a1`, `near_a1` (visible seams / not approved).
- Act II far layer `a5_road_layer_far_a2` (wrong; to be redone later).
- All A7 enemy / boss sheets (grids not game-ready).
- Batch 2 Act I 16:9 `a6_act1_citta_al_buio_1920x1080.webp` with dark bars.
- Raws, QA previews, contact sheets, listening previews, WAV / MP3 intermediates.
- Any audio still listed as missing in `INTEGRATION_PLAN.md`.

---

## 10. Weight (for the APK / CI note)

- New unique audio in this pack: **≈ 1.44 MB** OGG (12 loops + 3 one-shots).
- New portraits + UI + act cards + teaser/unlock + road layers: several MB added.
- A9 rims **replace** v05 sheets of the same dimensions, so they are roughly weight-neutral.
- A1 feature graphic lives under `assets/source/store/` (listing), not in the gameplay APK.
- The debug APK was already about **113.94 MB**, above the **GitHub 100 MB** file-size limit that bites if CI commits the APK. Report the new size; do not add WAV; do not commit the debug APK. Do not change `applicationId`, signing or `versionCode` in an attempt to work around CI.

---

## 11. Provenance

Higgsfield batches 1–4 under `/workspace/analisi_cap1/higgsfield_batch{1,2,3,4}/` and final OGG under `audio_ambient/final/` + `final_acts2_4/`. Loris approved the style of the included graphics and, after listening, the included audio (20 Nov 2026). Folly did not certify the audio as “AAA”; clinic and bazaar remain flagged as uneven.
