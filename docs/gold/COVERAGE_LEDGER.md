# Registro di copertura R19

Generato da `tools/build_coverage_ledger.py` sul commit `7bfd5bc`, dal rapporto `docs/evidence/r19/coverage-raw.txt`.
La copertura è **[MISURATO]** da `node --test --experimental-test-coverage`: conta le righe eseguite dai test di Node.
I file che girano solo nel browser non compaiono in quel rapporto: per loro valgono i verificatori `tools/verify_*.cjs`.
«Solo riferimenti» vuol dire che un test o un verificatore nomina il file, non che ogni riga sia provata.

File censiti: **247**.

## Gioco (39)

| File | Scopo | Rischio | Livello | Righe % | Rami % | Funzioni % | Prove | Stato |
|---|---|---|---|---|---|---|---|---|
| `game/android_bootstrap.js` | Avvio dentro il WebView | build, input | alto | — | — | — | android-bootstrap.test.mjs, bundle-prune-r19.test.mjs | solo riferimenti |
| `game/audio-engine.mjs` | Missaggio, musica in streaming, effetti | audio | medio | 91.09 | 62.65 | 53.13 | audio-leitmotifs-v10_3.test.mjs, audio-v09.test.mjs, bundle-globals.test.mjs (+7) | misurata |
| `game/campaign.mjs` | Simulazione del combattimento, nemici, Perfect Dodge | combattimento | alto | 100.0 | 96.0 | 97.09 | aim-preview.test.mjs, anchor.test.mjs, autoplay-policy.test.mjs (+26) | misurata |
| `game/chrono-art.mjs` | Atlanti e animazioni dei personaggi e dei nemici | rendering | medio | 97.14 | 80.0 | 91.67 | argon-giro3.test.mjs, bundle-globals.test.mjs, bundle-weight.test.mjs (+7) | misurata |
| `game/chrono-lab.html` | Laboratorio degli atlanti | strumento | basso | — | — | — | verify_chrono.cjs | solo riferimenti |
| `game/chrono-manifest.mjs` | Manifesto degli atlanti (dati) | rendering | basso | 100.0 | 100.0 | 100.0 | bundle-globals.test.mjs, bundle-weight.test.mjs, strangers.test.mjs (+1) | misurata |
| `game/driving.mjs` | Missioni di guida della campagna | guida | medio | 100.0 | 93.98 | 100.0 | blackout.test.mjs, bundle-globals.test.mjs, campaign-driving-policy.test.mjs (+5) | misurata |
| `game/hubs.mjs` | Hub, incarichi, servizi | campagna | medio | 100.0 | 89.27 | 95.65 | bundle-globals.test.mjs, chalk-mission.test.mjs, chrono-foes-d46.test.mjs (+15) | misurata |
| `game/hud.mjs` | Calcoli dell'HUD | rendering | medio | 100.0 | 83.33 | 100.0 | hud-meter-r19.test.mjs, hud-v9.test.mjs | misurata |
| `game/index.html` | Pagina e pannelli del gioco | rendering, input | medio | — | — | — | android-bundle.test.mjs, bundle-prune-r19.test.mjs, demo-replay.test.mjs (+11) | solo riferimenti |
| `game/input-v9.mjs` | Joystick, mappature, lettura del gamepad | input | alto | 100.0 | 91.94 | 100.0 | bundle-globals.test.mjs, input-v9.test.mjs | misurata |
| `game/interiors-en.mjs` | Testi inglesi degli interni | testi | basso | 100.0 | 100.0 | 100.0 | — | misurata |
| `game/interiors.mjs` | Interni in prima persona | rendering, testi | medio | 99.19 | 78.13 | 100.0 | interiors-v10_3.test.mjs, npc-portraits-canon.test.mjs | misurata |
| `game/layouts.mjs` | Mappe, muri, percorsi | combattimento, collisioni | alto | 100.0 | 90.82 | 100.0 | anchor.test.mjs, bundle-globals.test.mjs, chalk-mission.test.mjs (+12) | misurata |
| `game/locale.mjs` | Lingua, traduzione a vista | testi | medio | 91.92 | 81.16 | 66.67 | first-minute-r3.test.mjs, interiors-v10_3.test.mjs, locale.test.mjs (+3) | misurata |
| `game/missions.mjs` | Le 31 tappe di ogni rotta | campagna | alto | 100.0 | 95.3 | 100.0 | anchor.test.mjs, audio-leitmotifs-v10_3.test.mjs, bundle-globals.test.mjs (+45) | misurata |
| `game/narrative.mjs` | Stato narrativo, scelte, flag | salvataggi, storia | alto | 100.0 | 84.62 | 100.0 | bundle-globals.test.mjs, narrative.test.mjs | misurata |
| `game/progress-store.mjs` | Salvataggi e recupero | salvataggi | alto | 100.0 | 96.55 | 100.0 | bundle-globals.test.mjs, progress-store.test.mjs, verify_chalk_migration_browser.cjs (+1) | misurata |
| `game/racing-v9.mjs` | Gare di Veyra: simulazione, strade, medaglie | gare | medio | 100.0 | 95.1 | 100.0 | hub-races.test.mjs, race-art-giro2.test.mjs, race-audit.test.mjs (+6) | misurata |
| `game/runtime-en.mjs` | Testi inglesi dell'interfaccia | testi | basso | 100.0 | 100.0 | 100.0 | — | misurata |
| `game/runtime.mjs` | Ciclo dei frame, disegno, tocco, tastiera, gamepad, schermate | input, rendering, salvataggi, acquisto | alto | — | — | — | argon-giro3.test.mjs, audio-leitmotifs-v10_3.test.mjs, bundle-globals.test.mjs (+26) | solo riferimenti |
| `game/scenery.mjs` | Scenografia dipinta a runtime | rendering | basso | — | — | — | bundle-globals.test.mjs, verify_performance_v09.cjs | solo riferimenti |
| `game/sheet-layout.mjs` | Geometria dei fogli sprite | rendering | basso | 100.0 | 100.0 | 100.0 | bundle-globals.test.mjs, sheet-layout.test.mjs, verify_sheet_layout_browser.cjs (+1) | misurata |
| `game/stability.mjs` | Protezione del ciclo dei frame | stabilità | alto | 100.0 | 100.0 | 87.5 | bundle-globals.test.mjs, stability.test.mjs | misurata |
| `game/story-en.mjs` | Testi inglesi della storia | testi | basso | 100.0 | 100.0 | 100.0 | — | misurata |
| `game/story-v08.mjs` | Dialoghi e varianti | storia | medio | 100.0 | 95.96 | 100.0 | bundle-globals.test.mjs, campaign-v08.test.mjs, chalk-mission.test.mjs (+6) | misurata |
| `game/style.css` | Stile e impaginazione | rendering | medio | — | — | — | android-bundle.test.mjs, argon-giro3.test.mjs, first-minute-r3.test.mjs (+6) | solo riferimenti |
| `game/traversal.mjs` | Attraversamento e punti di passaggio | collisioni | medio | 100.0 | 86.67 | 100.0 | bundle-globals.test.mjs, hubs-v8.test.mjs, verify_performance_v09.cjs | misurata |
| `game/v9-combat-lab.html` | Pagina del laboratorio di combattimento | strumento | basso | — | — | — | verify_combat_v9.cjs | solo riferimenti |
| `game/v9-combat-lab.mjs` | Laboratorio di combattimento (non entra nell'APK) | strumento | basso | — | — | — | — | nessuna prova |
| `game/v9-race-lab.css` | Stile del laboratorio gare | strumento | basso | — | — | — | — | nessuna prova |
| `game/v9-race-lab.html` | Pagina del laboratorio gare | strumento | basso | — | — | — | verify_race_roads_giro2.cjs, verify_racing_v9.cjs | solo riferimenti |
| `game/v9-race-lab.mjs` | Laboratorio gare (non entra nell'APK) | strumento | basso | — | — | — | — | nessuna prova |
| `game/veyra-v9.mjs` | Serie di gare e rivalità con Veyra | gare | medio | 100.0 | 66.67 | 100.0 | racing-v9.test.mjs | misurata |
| `game/village-art.mjs` | Disegno dei villaggi e della loro vita | rendering | basso | — | — | — | — | nessuna prova |
| `game/villages.mjs` | Dati dei villaggi | rendering | basso | 100.0 | 91.43 | 100.0 | villages-d40.test.mjs | misurata |
| `game/visuals.mjs` | Fotogrammi di eroi, auto, effetti | rendering | medio | 92.14 | 90.91 | 96.3 | anchor.test.mjs, bundle-globals.test.mjs, chalk-scene.test.mjs (+12) | misurata |
| `game/weapons-v9.mjs` | Armi, caricatori, ricompense | combattimento | alto | 100.0 | 97.53 | 100.0 | aim-preview.test.mjs, autoplay-policy.test.mjs, bundle-globals.test.mjs (+9) | misurata |
| `game/world-en.mjs` | Testi inglesi del mondo | testi | basso | 100.0 | 100.0 | 100.0 | — | misurata |

## Android (6)

| File | Scopo | Rischio | Livello | Righe % | Rami % | Funzioni % | Prove | Stato |
|---|---|---|---|---|---|---|---|---|
| `android/AndroidManifest.xml` | App Android (WebView, risorse, manifest) | build, sicurezza | alto | — | — | — | mobile-ui-contract.test.mjs | solo riferimenti |
| `android/res/drawable-nodpi/chronos_icon.png` | App Android (WebView, risorse, manifest) | build, sicurezza | basso | — | — | — | — | nessuna prova |
| `android/res/drawable/icon.xml` | App Android (WebView, risorse, manifest) | build, sicurezza | alto | — | — | — | — | nessuna prova |
| `android/res/values/styles.xml` | App Android (WebView, risorse, manifest) | build, sicurezza | alto | — | — | — | — | nessuna prova |
| `android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java` | Explicit APK allowlist; no arbitrary paths or network fallbacks. | build, sicurezza | alto | — | — | — | android-bundle.test.mjs, argon-giro3.test.mjs, audio-leitmotifs-v10_3.test.mjs (+3) | solo riferimenti |
| `android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java` | App Android (WebView, risorse, manifest) | build, sicurezza | alto | — | — | — | first-minute-r3.test.mjs, mobile-ui-contract.test.mjs | solo riferimenti |

## Server (1)

| File | Scopo | Rischio | Livello | Righe % | Rami % | Funzioni % | Prove | Stato |
|---|---|---|---|---|---|---|---|---|
| `server.js` | Pretest hub: serves only the hub page, game/, assets/, docs/ and the debug APK. Never dotfiles, keys or other build output | server locale | medio | 94.52 | 73.21 | 83.33 | server-hub.test.mjs | misurata |

## Strumenti (131)

| File | Scopo | Rischio | Livello | Righe % | Rami % | Funzioni % | Prove | Stato |
|---|---|---|---|---|---|---|---|---|
| `tools/art_derived_checks.mjs` | The ten automatic checks of the art pipeline (CHRONOS_ARTE_P2_PIPELINE.md, section 4; decision D30). | strumento | basso | 95.93 | 88.89 | 96.67 | art-derived.test.mjs | misurata |
| `tools/art_style_audit.py` | Read-only style audit of the current CHRONOS sprites (baseline for the V10.3 art rules). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/audio_coverage_v9.mjs` |  | strumento | basso | 100.0 | 90.91 | 100.0 | audio-catalog-v9.test.mjs, verify_v9_governance.mjs | misurata |
| `tools/audit_310_github.py` |  | strumento | basso | — | — | — | — | nessuna prova |
| `tools/audit_combat.mjs` | Combat audit by simulation: every foot mission, played by the deterministic average-player bot (tests/helpers/autoplay.mjs) | strumento | basso | 100.0 | 88.68 | 100.0 | combat-audit.test.mjs | misurata |
| `tools/audit_locale.mjs` |  | strumento | basso | — | — | — | — | nessuna prova |
| `tools/audit_media.py` | Decode and fingerprint repository media. Never approves art, rights or commercial readiness. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/audit_races.mjs` | Race audit by simulation: every Veyra race, driven by the game's own pilot (racePilot) degraded to three skill levels. | strumento | basso | 82.22 | 81.67 | 100.0 | race-audit.test.mjs | misurata |
| `tools/audit_v10_2_production.py` | Audit of the V10.2 production: what exists on GitHub for the 92 immediate images and the | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_aab.sh` |  | build, firma | alto | — | — | — | — | nessuna prova |
| `tools/build_anchor_sheets.py` | Runtime sheets for The Anchor from the Astra candidates (G11 core sheet, G12 bollards). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_apk.sh` |  | build, firma | alto | — | — | — | tooling-syntax.test.mjs | solo riferimenti |
| `tools/build_ashdocks_roads.py` | Ash Docks race roads from Terra's unmarked bodies (Terra round 1, G4 with variants). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_asset_needs_doc.py` | Write docs/gold/ASSET_NECESSARI.md: every asset the game still needs, in one document. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_astra_requests.py` | Build the asset and audio request workbook for an external producer (GPT Astra). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_astra_vfx.py` | Runtime impact atlases from the Astra G9 candidates for the weapons already in play. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_audio_catalog_v9.mjs` | Mechanical index of the user's full audio chat. Production claims are authored | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_boss_v2.mjs` | Brief v2 and GPT prompts for the four Part I bosses to regenerate (D23, D28, D30). | strumento | basso | 97.96 | 93.65 | 100.0 | art-derived.test.mjs | misurata |
| `tools/build_cable_end.py` | Runtime end cap for The Anchor's lines from the rejected Astra candidate (decision of the author). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_coverage_ledger.py` | R19: builds docs/gold/COVERAGE_LEDGER.{json,md} from `git ls-files` and a raw `node --test` coverage report. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_finale_art.py` | Original layered vector artwork. Deterministic, no external fonts, raster images or filters. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_manus_remaining.py` |  | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_play_aab.sh` |  | build, firma | alto | — | — | — | — | nessuna prova |
| `tools/build_preproduction_prompts.py` | Write one GPT image prompt per preproduction board (310), from the registry and the art direction. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_preproduction_refs.py` | Reference sheets for the GPT preproduction prompts, assembled ONLY from real game art. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_preview.py` | Create a portable directory preview with streamed assets, sharing Android packaging. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_race_props_runtime.py` | Choose and install the race props used by the game (game/art/v10/race_*.png). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_reload_sheets.py` | Build runtime reload sheets from the Codex reload masters. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/build_stranger_sheets.py` | Build Kairn and Morrow runtime atlases from the author-reference Codex masters. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/campaign-driving-policy.cjs` | Read-only test driver. Hold the brake through pickup instead of oscillating at its speed limit. | strumento | basso | 100.0 | 88.46 | 75.0 | campaign-driving-policy.test.mjs, verify_campaign_browser.cjs | misurata |
| `tools/chrono-requirements.txt` |  | strumento | basso | — | — | — | — | nessuna prova |
| `tools/chrono_audio.py` | Original deterministic, offline sound design. No recordings, samples or network. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/chrono_inventory.cjs` |  | strumento | basso | — | — | — | — | nessuna prova |
| `tools/chrono_memory.cjs` | Comparable host measurements; process RSS sums include shared pages more than once. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/chrono_pack.cjs` | Deterministic technical atlas packing; artwork comes from retained image_gen originals. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/chrono_previews.cjs` |  | strumento | basso | — | — | — | — | nessuna prova |
| `tools/clean_sheet_layout.py` | Clean layout for the 4x4 character and enemy sheets: no cut feet, no stray soles. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_astra_p1.py` | Original authored P1 synthesis. 48 kHz FLAC/OGG, deterministic score; no external samples. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_chalk_score.py` | Original authored score; deterministic synthesis, no provider, samples or recordings. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_chalk_sfx.py` | Original chalk friction and field-medicine seal sounds, without external recordings. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_leitmotifs_v10_3.py` | V10.3 leitmotif cues: refuge_theme and promise_theme (revision 2). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_protagonist_boards.py` | Compose the six Nox/Lulù preproduction boards (character.{nox,lulu}.01-03) from real game frames. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_rival_cars.py` | Compose race_rivalNN_car.png from GPT car states, in the layout of race_veyra_car.png. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_rook_audio.py` | Original Rook score and mechanical cues. Deterministic synthesis, no samples. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_soundtrack.py` | Original, deterministic adventure score and SFX. No third-party samples or melodies. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_soundtrack_v08.py` | v0.8 themes: Nox, Lulù, danger, reunion. Original, deterministic, built on one motif. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_strangers_handoff.py` | Original deterministic synthesis; no samples. Production candidates, not listening approval. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_terra_race_props.py` | Bring Terra's race props back to game PNGs and check them (Terra round 3). | strumento | basso | — | — | — | tooling-syntax.test.mjs | solo riferimenti |
| `tools/compose_terra_weapon_edits.py` | Compose Terra's per-cell weapon edits into a game sheet (Terra round 2, weapon sheets by mask). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/compose_title_theme_v10_3.py` | V10.3 title theme (D44): the 8 November menu mix rebuilt as a registered derivative. | strumento | basso | — | — | — | audio-leitmotifs-v10_3.test.mjs | solo riferimenti |
| `tools/compose_workshop_audio.py` | Original Tessa workshop cue and weapon mechanisms, no samples or recordings. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/derive_argon_20261109.py` | Derivati della consegna Argon del 9 novembre 2026 (ramo delivery/argon-asset-20261109, mai modificato). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/derive_argon_gang_20261111.py` | Foglio nemico `gang_signal` dai due fogli Argon giro 2 (gang_signal_a = azione, gang_signal_b = reazione). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/derive_argon_giro2_20261110.py` | Derivati della consegna Argon del 10 novembre 2026 (ramo delivery/argon-asset-giro2-20261110, mai modificato). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/derive_argon_giro3_20261111.py` | Derivati del terzo giro di Argon (ramo delivery/argon-asset-giro2-20261110 @ f39dd3d, mai modificato). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/derive_rival03_states.py` | Derive rival03 damage and night states from GPT's rival03_base.png by editing it in place. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/estimate_playtime.mjs` | Playtime ESTIMATE (not human duration) from the instrumented campaign runs of | strumento | basso | 31.97 | 83.33 | 28.57 | playtime-estimate.test.mjs, verify_campaign_browser.cjs | misurata |
| `tools/fit_arc7_cells.py` | Paint ARC-7 «Choir» into Lulù's R-12 cells, in Terra's delivery format (<sheet>_rRcC_edit.png). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/fit_gpt_race_props.py` | Fit GPT's hand-drawn race props (requests/terra-giro3-gara-20261028/PROMPT_GPT.md) to the game. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/generate_play_upload_key.mjs` |  | build, firma | alto | — | — | — | — | nessuna prova |
| `tools/gpt_chroma.py` | Chroma key for images returned by GPT on a 'pure' green that is never pure. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/lib/android-cdp.mjs` | Real WebView transport. No browser simulation and no gameplay state mutation. | strumento | basso | — | — | — | tooling-syntax.test.mjs, verify_android_recovery.mjs | solo riferimenti |
| `tools/lib/sprite_isolation.py` | Pose isolation shared by the sheet builders: masters routinely cross their nominal cell lines. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/lib/touch-input.cjs` | Touch input for the automatic checks (D39: the game is mobile-only, so checks play it with fingers, not keys). | strumento | basso | — | — | — | input-v9.test.mjs, verify_touch_input.cjs | solo riferimenti |
| `tools/make_terra_race_props.py` | Templates, masks and the scale board for Terra's race props (Terra round 3). | strumento | basso | — | — | — | tooling-syntax.test.mjs | solo riferimenti |
| `tools/make_terra_weapon_masks.py` | Edit-zone masks and per-cell edit packages for Terra (weapon sheets by mask, Terra round 2). | strumento | basso | — | — | — | verify_terra_weapon_sheet.py | solo riferimenti |
| `tools/observe_missions.cjs` | Opens every campaign step from a valid v7 save and captures what the player sees once play starts: | strumento | basso | — | — | — | — | nessuna prova |
| `tools/pack_veyra_p1.py` | Technical pose isolation/packing of image_gen output; no repainting. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/package_opus_assets.py` | Package actual files, never infer commercial completeness from file counts. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/prepare_android_assets.py` | Prepare streamed APK resources, never a binary-filled entry document. | build, firma | alto | — | — | — | android-bundle.test.mjs, argon-giro3.test.mjs, bundle-prune-r19.test.mjs (+5) | solo riferimenti |
| `tools/prepare_ashdocks_from_terra.py` | Ash Docks road bodies from Terra's G4 attempts (team composition, Terra round 1). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/preproduction_art_direction.py` | Art direction data for the 310 V10.2 preproduction prompts (tools/build_preproduction_prompts.py). | strumento | basso | — | — | — | — | nessuna prova |
| `tools/qa_v8.cjs` | Seeded checks are explicitly distinct from the NEW GAME/full-campaign verifier. | strumento | basso | — | — | — | verify_chrono.cjs, verify_chrono_boss.cjs, verify_controls_v9.cjs (+15) | solo riferimenti |
| `tools/race_props_lib.py` | Shared geometry for the race props request (Terra round 3): spec, zones, key removal, checks. | strumento | basso | — | — | — | — | nessuna prova |
| `tools/run_l1_audit.mjs` |  | strumento | basso | — | — | — | — | nessuna prova |
| `tools/ux_audit.cjs` | Set viewports | strumento | basso | — | — | — | — | nessuna prova |
| `tools/verify_anchor_browser.cjs` | The Anchor in the real Breach, through ordinary inputs: explicit save at the Breach step, keyboard | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_android_recovery.mjs` | Requires the installed test APK and an emulator/device. Performs a real renderer crash. | verificatore browser | — | — | — | — | tooling-syntax.test.mjs | è una prova |
| `tools/verify_android_renderer.mjs` | Runs against the debug APK's actual Android WebView over adb-forwarded CDP. | verificatore browser | — | — | — | — | tooling-syntax.test.mjs | è una prova |
| `tools/verify_audio_v09.cjs` | Real Chromium Web Audio: decoded music + overlapping procedural SFX through the shipping master bus. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_brand_browser.cjs` | Exercise public branding, touch targets, local artwork, and existing-save continuation. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_campaign_browser.cjs` | NEW GAME → postcredits. Read-only snapshots and real UI inputs; never injects save/game state. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_chalk_migration_browser.cjs` | A real-UI continuation of a pre-expansion v7 checkpoint; the fixture is only the old save. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_chalk_music_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_chalk_scene_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_chrono.cjs` | Browser-only evidence. No claim of physical Android, human listening or sustained device FPS. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_chrono_boss.cjs` | Final mission fixture, then ordinary player keys only. Virtual clock: not an FPS test. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_combat_v9.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_controls_v9.cjs` | Seeded interaction QA for E03. This proves input behavior, not campaign completion or human comfort. | verificatore browser | — | — | — | — | tooling-syntax.test.mjs | è una prova |
| `tools/verify_demo_m3.cjs` | M3 (D20, D22) in Chromium: demo end after «La firma» with a simulated purchase bridge, the same save without the bridge, | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_equipped_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_field_kit_browser.cjs` | Explicit fixtures for handoff and next fight; real touch/UI inputs afterwards. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_foes_d46.cjs` | D45-D46 in Chromium: every mission with enemies decodes its own cast (and nothing from other regions) and draws it; | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_gamepad_browser.cjs` | Gamepad QA for D27/N2. A scripted pad replaces navigator.getGamepads in desktop Chromium. | verificatore browser | — | — | — | — | tooling-syntax.test.mjs | è una prova |
| `tools/verify_health_bar.cjs` | Browser evidence for the shared life/integrity HUD. Seeded states are not campaign-completion evidence. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_hub_race_browser.cjs` | Veyra's first race from Moon Refuge, through ordinary inputs: walk to the parked Vortex, accept, | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_hubs_v8.cjs` | Declared seeded fixtures: real UI purchases, native lifecycle, save/re-entry, travel and legacy preservation. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_hud_p1.cjs` | U1 in Chromium: HUD text never truncated (no «…») at the four target sizes, on every playable step with an HUD, | verificatore browser | — | — | — | — | pause-touch-u2.test.mjs | è una prova |
| `tools/verify_interiors_browser.cjs` | M-I1 interiors: real taps on #interact, the scene in both orientations, shop, ask, errand, leave, English. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_labels_r4.cjs` | R4 in Chromium: every text drawn on the world canvas is at least 11.5 px on screen (audit #12 measured 6.8-7.9 px on phones), | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_leitmotifs_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_locale_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_locale_hub_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_medicine_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_opening_r19.cjs` | R19: the first-person opening and its beat log, by touch-sized taps, in portrait and landscape. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_options_q4.cjs` | Q4 (D34) in Chromium: the Options screen from the main menu and from pause, on small portrait, tall portrait and landscape. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_performance_v09.cjs` | Measures the actual requestAnimationFrame update+Canvas call time, plus wall-clock presentation gaps. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_play_band.cjs` | Play-band geometry in the real runtime: for each viewport the hero is walked to the centre and | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_preproduction.mjs` | Read-only QA: generated images are never silently cropped or promoted into runtime. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_preproduction_delivery.py` | Check GPT deliveries for the 310 preproduction boards and record them in the registry. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_race_modes_browser.cjs` | Vortex challenge modes (D17) from Moon Refuge with Ash Docks already completed: walk to the Vortex, | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_race_roads_giro2.cjs` | Strade Solkara/Aurelia e auto Vortex (Argon giro 2, 10/11/2026), nel laboratorio gare: per ogni | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_racing_v9.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_release_flow.cjs` | Release-flow proof in the real runtime, through ordinary inputs only: | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_reload_browser.cjs` | Reload animation proof in the real runtime with ordinary touch inputs, for both earned weapons: | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_rook_browser.cjs` | Seeded Blackout fixture, then ordinary keyboard/UI only. No gameplay state mutation. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_rook_recovery_browser.cjs` | Seeded Blackout fixture, then ordinary keyboard/UI only. No gameplay state mutation. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_runtime_v09.cjs` | Save re-entry, real-input audio, native lifecycle, ending images and touch layout. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_save_recovery.cjs` | Declared fixtures and storage fault injection, never a full-campaign completion claim. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_sheet_layout_browser.cjs` | Draws every pose of the cleaned 4x4 sheets with the game's own drawLegacySprite, next to the | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_stability.cjs` | Q1 stability checks in real Chromium: injected faults only, never a full-campaign claim. | verificatore browser | — | — | — | — | android-bootstrap.test.mjs, fault-guards.test.mjs | è una prova |
| `tools/verify_startup_retry.cjs` | Test the packaged Android JavaScript bootstrap in Chromium. Not native WebView proof. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_strangers_browser.cjs` | Kairn and Morrow in the real Ascent, through ordinary inputs: an explicit save at the Ascent step, | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_studio_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_terra_containers.py` | Footprint check for the Ash Docks container variants (Terra round 1). | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_terra_weapon_sheet.py` | Contract check for a weapon sheet edited from an in-game reference (Terra round 1, G6/G7). | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_tessa_hub_recovery_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_touch_input.cjs` | Self-test of tools/lib/touch-input.cjs on the real game in Chromium (U4a). Seeded states, real touch only. | verificatore browser | — | — | — | — | — | è una prova |
| `tools/verify_v9_governance.mjs` | A passing legacy campaign is not proof that the approved expansion ships. | verificatore browser | — | 97.92 | 67.54 | 89.47 | v9-governance.test.mjs | è una prova |
| `tools/verify_weapon_layout_browser.cjs` |  | verificatore browser | — | — | — | — | — | è una prova |
| `tools/visual_tour.cjs` | Visual QA tour: opens every campaign step from a v7 save (as a returning player would), plays a few | strumento | basso | — | — | — | — | nessuna prova |

## Test (70)

| File | Scopo | Rischio | Livello | Righe % | Rami % | Funzioni % | Prove | Stato |
|---|---|---|---|---|---|---|---|---|
| `tests/aim-preview.test.mjs` | preview reflects weapon reach and R12 fan without consuming ammo | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/anchor.test.mjs` | A floor point at `d` from the target with a clear line to it (walls block shots and sweeps alike). | test | — | 100.0 | 91.3 | 100.0 | — | è una prova |
| `tests/android-bootstrap.test.mjs` | game/android_bootstrap.js is shipped as a classic script (bootstrap.js). It runs here in node:vm against a minimal | test | — | 100.0 | 95.83 | 95.0 | — | è una prova |
| `tests/android-bundle.test.mjs` | Android flattened bundle includes v0.9 modules, assets and compiles as a classic script | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/argon-giro3.test.mjs` | Terzo giro di Argon (11/11/2026): cinque fogli nemici e le schede dei quattro atti. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/art-derived.test.mjs` | ---------- Boss v2 package (D30) ---------- | test | — | 96.36 | 95.74 | 100.0 | — | è una prova |
| `tests/audio-catalog-v9.test.mjs` | the full audio chat remains required beyond the initial twenty-item lot | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/audio-leitmotifs-v10_3.test.mjs` | the reunion theme is reserved for the reunion and what follows it | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/audio-originals.test.mjs` | Shipped audio is never rewritten in place (rule 5): a new mix is a new, registered file. docs/gold/FILE_INVENTORY.json is the reference. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/audio-v09.test.mjs` | a late old play promise cannot retire the newer soundtrack (slow mobile decoder) | test | — | 100.0 | 97.5 | 81.82 | — | è una prova |
| `tests/autoplay-policy.test.mjs` | One walking raider straight east of the hero in the open centre band of the default map. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/blackout.test.mjs` | Retrying a failed district preserves the committed city choice. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/bundle-globals.test.mjs` | The Android build concatenates every module into one classic script. A duplicated top-level | test | — | 100.0 | 94.2 | 100.0 | — | è una prova |
| `tests/bundle-prune-r19.test.mjs` | R19 weight pass: exports that only tests call are left out of app.js. The game must not lose anything it calls. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/bundle-weight.test.mjs` | Q3 weight plan: the APK copy of CHRONO_MANIFEST drops documentation fields. Every value the game reads must be identical. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/campaign-driving-policy.test.mjs` | baseline driver reproduces missed rescues when inputs arrive every 130–250 ms | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/campaign-v08.test.mjs` | the campaign separates the two heroes after Ora zero and alternates their stories before the reunion | test | — | 100.0 | 95.79 | 94.59 | — | è una prova |
| `tests/campaign.test.mjs` | Clears a district the way a player does: defeat what is alive, light the devices, let reinforcements arrive. | test | — | 100.0 | 97.62 | 100.0 | — | è una prova |
| `tests/chalk-mission.test.mjs` | chalk mission is causally between separation and Nox finding the physical trace | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/chalk-scene.test.mjs` | chalk civilian walks a valid corridor without teleporting and rests at each endpoint | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/chrono-art.test.mjs` | Chrono frame rectangles fit actual RGBA atlases and actor frames have clear gutters and a ground pivot | test | — | 100.0 | 97.87 | 100.0 | — | è una prova |
| `tests/chrono-foes-d46.test.mjs` | D45-D46: the author approved the reserve sheets and left the placement to Claude. | test | — | 100.0 | 98.39 | 100.0 | — | è una prova |
| `tests/claude-guide.test.mjs` | CLAUDE.md and the prompts in §2 of the MX Linux instructions tell a new Claude session where every | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/combat-audit.test.mjs` | D48: the combat audit by simulation (tools/audit_combat.mjs) is a gate. Every foot mission is won by the average-player bot | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/demo-replay.test.mjs` | M3 (D20, D22): the demo ends after «La firma» only with the purchase bridge; «Gioca l'altra rotta» keeps weapons and upgrades. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/driving.test.mjs` | Nox drives every mission and all three routes are deterministic | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/fault-guards.test.mjs` | The recovery panel (#fault-panel) means the simulation state may be inconsistent: lifecycle events must neither | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/field-kit.test.mjs` | Tessa requires the actual Rook victory and a city decision; either choice gives the same kit once | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/first-minute-r3.test.mjs` | R3, the first minute of a pretest: the build a tester reports, where to tap first, the field kit in English, D39 in the Controls tab. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/fixtures/campaign-driving-policy-v8.cjs` | Frozen control policy from baseline 70b1893. Regression fixture; never used by runtime. | test | — | 100.0 | 87.5 | 75.0 | campaign-driving-policy.test.mjs | è una prova |
| `tests/helpers/autoplay.mjs` | Deterministic "average player" policy used to prove every foot mission is winnable through | test | — | 94.87 | 99.0 | 100.0 | autoplay-policy.test.mjs, campaign-v08.test.mjs, chalk-mission.test.mjs (+12) | è una prova |
| `tests/hub-races.test.mjs` | Drive the player with the same pilot rules as the rivals until the race ends. | test | — | 100.0 | 90.91 | 100.0 | — | è una prova |
| `tests/hubs-v8.test.mjs` | four distinct hubs: every service, secret and errand can be reached with ordinary collision movement | test | — | 100.0 | 100.0 | 96.43 | — | è una prova |
| `tests/hud-meter-r19.test.mjs` | R19 characterization: setVitalMeter was only exercised in the browser. A minimal stand-in for the four nodes it touches. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/hud-v9.test.mjs` | life meter derives full, partial, low and zero states from current and maximum HP | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/input-buffer.test.mjs` | N1 (D27, Pilastro 1 righe 156-173): 100 ms buffer for SCHIVA, SPARA and PULSE only. | test | — | 100.0 | 93.48 | 88.89 | — | è una prova |
| `tests/input-v9.test.mjs` | joystick deadzone removes center drift and reaches full range | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/interiors-v10_3.test.mjs` | every hub service has an interior and every person a street scene | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/layouts-v09.test.mjs` | all modular objectives, arrivals, patrol segments and boss platforms are reachable with actor clearance | test | — | 100.0 | 90.0 | 100.0 | — | è una prova |
| `tests/locale.test.mjs` | initial and chalk scenes have authored English for both physical consequences | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/mobile-ui-contract.test.mjs` | premium mobile controls retain 48px minimum critical targets | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/narrative-links-v10_3.test.mjs` | reunion echoes follow the separation flags and Act I-III choices | test | — | 100.0 | 94.87 | 84.85 | — | è una prova |
| `tests/narrative.test.mjs` | narrative state is strict, deterministic and bounded | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/npc-portraits-canon.test.mjs` | Rule 6 (canon): a painted face appears only on an adopted character who lives in that village, or whom the service names. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/options-q4.test.mjs` | Q4 (D34, D35 priority 5): a professional Options screen. Volumes ride on the authored mix; 100 % is the mix as it was. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/pause-touch-u2.test.mjs` | U2: a pause panel made for touch, and three small fixes. The pixel sizes are measured in a browser by tools/verify_hud_p1.cjs; this file keeps the sou | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/perfect-dodge.test.mjs` | Perfect Dodge triggers only when an attack would land inside the narrow window | test | — | 100.0 | 100.0 | 97.56 | — | è una prova |
| `tests/play-band.test.mjs` | 844x390 landscape: stick and weapon bar bottom-left/centre, actions and heal bottom-right. | test | — | 100.0 | 91.67 | 100.0 | — | è una prova |
| `tests/playtime-estimate.test.mjs` | playtime model: factors, reading and boss share as declared; bot dialogue time never counted | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/price-m5.test.mjs` | M5 (D18): the official price is 5,99 €, one purchase. Live release documents must not drift back to 4,99. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/progress-store.test.mjs` | schema 7 upgrades to integrity protection without touching v4/v5/v6 data | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/q2-readability.test.mjs` | Q2 (D35, priorities 2 and 3): readability without audio or colour, and touch feel. Timings and hitboxes are untouched (rule 4). | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/race-art-giro2.test.mjs` | Consegna Argon giro 2 (10/11/2026): strade Solkara/Aurelia e atlante dell'auto Vortex nelle gare. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/race-audit.test.mjs` | D49: the races are checked by simulation, like the combat (D48). tools/audit_races.mjs drives every race with the game's own pilot. | test | — | 100.0 | 97.06 | 100.0 | — | è una prova |
| `tests/racing-v9.test.mjs` | A full-skill test driver also times the start (throttle in the last half second of the countdown). | test | — | 100.0 | 97.96 | 100.0 | — | è una prova |
| `tests/release-flow.test.mjs` | Phone layouts measured in Chromium: HUD bottom and controls top, in CSS pixels. | test | — | 100.0 | 94.59 | 100.0 | — | è una prova |
| `tests/reload-animation.test.mjs` | reload pose follows the model timer through lower, extract, insert and ready | test | — | 100.0 | 94.74 | 100.0 | — | è una prova |
| `tests/rook-recovery.test.mjs` | Rook recovery retains an advanced v7 boss location, choices, upgrades, money and inventory | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/rook.test.mjs` | Rook commits aim for half the telegraph and releases finite colliding shotgun pellets | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/save-v5.test.mjs` | new saves use schema v5 and preserve narrative state across load and district transition | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/server-hub.test.mjs` | The pretest hub runs on the author's PC, where dist/play-upload holds the Play upload key and its password: only the game, | test | — | 100.0 | 100.0 | 96.77 | — | è una prova |
| `tests/sheet-layout.test.mjs` | cleaned sheets keep every pose where the old quarter drew it, lifting only rows with cut feet | test | — | 100.0 | 100.0 | 90.0 | — | è una prova |
| `tests/stability.test.mjs` | guardedFrame requests the next frame before the step, even when the step throws | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/strangers.test.mjs` | Two raiders, the hero still; allies arrive where meetStrangers() places them. | test | — | 100.0 | 95.35 | 95.45 | — | è una prova |
| `tests/tooling-syntax.test.mjs` | Android verifier has valid ESM syntax | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/unlock-claims.test.mjs` | Rule 3 on the paywall: what the unlock screen promises for 5,99 € is counted from the game itself, and every line reads in English too. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/v9-governance.test.mjs` | preview evidence cannot certify integrated V9 content or full story localization | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/villages-d40.test.mjs` | D40: villages are authored plans with real buildings, doors and a plaza, not one cross copied four times. | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/visuals.test.mjs` | hero locomotion selects back, front and mirrored side views | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |
| `tests/weapons-v9.test.mjs` | story rewards unlock only the protagonist kit; Needle needs both components and duplicate rewards cannot refill | test | — | 100.0 | 100.0 | 100.0 | — | è una prova |

## Zone a rischio medio o alto senza copertura misurata

| File | Livello | Stato | Prove che lo nominano |
|---|---|---|---|
| `android/AndroidManifest.xml` | alto | solo riferimenti | 1 |
| `android/res/drawable/icon.xml` | alto | nessuna prova | 0 |
| `android/res/values/styles.xml` | alto | nessuna prova | 0 |
| `android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java` | alto | solo riferimenti | 6 |
| `android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java` | alto | solo riferimenti | 2 |
| `game/android_bootstrap.js` | alto | solo riferimenti | 2 |
| `game/index.html` | medio | solo riferimenti | 14 |
| `game/runtime.mjs` | alto | solo riferimenti | 29 |
| `game/style.css` | medio | solo riferimenti | 9 |
| `tools/build_aab.sh` | alto | nessuna prova | 0 |
| `tools/build_apk.sh` | alto | solo riferimenti | 1 |
| `tools/build_play_aab.sh` | alto | nessuna prova | 0 |
| `tools/generate_play_upload_key.mjs` | alto | nessuna prova | 0 |
| `tools/prepare_android_assets.py` | alto | solo riferimenti | 8 |
