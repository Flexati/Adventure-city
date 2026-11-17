# STATO CODA — Giro 2 (`deliveries/argon-design-aaa-v2-20261117/`)

## 1. Controlli di partenza (Sezione 1)
- **Ramo**: `delivery/argon-design-aaa-20261117`
- **Allineamento col ramo di lavoro**: eseguito `git fetch origin work/chronos-adventure-commercial` e `git merge --no-edit FETCH_HEAD` (`8b09635`) senza rebase e senza force-push.
- **File del primo giro**: intatti in `deliveries/argon-design-aaa-20261117/` (26 palette A0, 45 interni I1, 6 ritratti I2, 15 tracce M1).
- **Verifica strumenti**:
  - Generatore immagini raster disponibile fino a esaurimento quota (`generic::resource_exhausted`, reset in ~11h 47m).
  - Strumento musicale (DAW / sintetizzatore a campioni / modello musicale commerciale): **NON presente nell'ambiente di esecuzione** (`which fluidsynth timidity ffmpeg sox csound` vuoto; nessun modello musicale esterno provisionato).

## 2. Riepilogo Lotti Giro 2

| Lotto | Consegnati | Saltati | Mancanti | Motivo / Stato |
|---|---|---|---|---|
| **G1_ritratti** | 0 / 39 | 0 | 39 | In coda per limite quota modello immagini (`resource_exhausted`) |
| **G2_boss** | 0 / 128 | 0 | 128 | In coda per limite quota modello immagini (`resource_exhausted`) |
| **G3_stage** | 0 / 12 | 0 | 12 | In coda per limite quota modello immagini (`resource_exhausted`) |
| **G4_nemici** | 0 / 160 | 0 | 160 | In coda per limite quota modello immagini (`resource_exhausted`) |
| **G5_effetti** | 0 / 26 | 0 | 26 | In coda per limite quota modello immagini (`resource_exhausted`) |
| **G6_ui** | 0 / 25 | 0 | 25 | In coda per limite quota modello immagini (`resource_exhausted`) |
| **M2_audio** | 0 / 23 | 23 | 0 | **Saltato come da regola M2**: nessun sintetizzatore a campioni, DAW o modello musicale commerciale presente nell'ambiente; vietata la sintesi scritta a mano in Python/NumPy |

## 3. Elenco ordinato dei file mancanti (coda di produzione)

### Priorità 1 — G1_ritratti (39 ritratti 512×512 PNG + WebP + report + scheda)
1. `portrait_varn_neutral` (`cinder_step`)
2. `portrait_varn_smirk` (`cinder_step`)
3. `portrait_varn_broken` (`cinder_step`)
4. `portrait_harlan_neutral` (`grand_central`)
5. `portrait_harlan_stern` (`grand_central`)
6. `portrait_harlan_yield` (`grand_central`)
7. `portrait_sera_neutral` (`skyline`)
8. `portrait_sera_resolve` (`skyline`)
9. `portrait_sera_wounded` (`skyline`)
10. `portrait_dahl_neutral` (`neon_sprawl`)
11. `portrait_dahl_calculating` (`neon_sprawl`)
12. `portrait_dahl_cornered` (`neon_sprawl`)
13. `portrait_orla_neutral` (`echo_quarry`)
14. `portrait_orla_warning` (`echo_quarry`)
15. `portrait_orla_relief` (`echo_quarry`)
16. `portrait_tomas_neutral` (`helion_marsh`)
17. `portrait_tomas_tired` (`helion_marsh`)
18. `portrait_tomas_grateful` (`helion_marsh`)
19. `portrait_voss_neutral` (`axis_tower`)
20. `portrait_voss_cold` (`axis_tower`)
21. `portrait_voss_cracked` (`axis_tower`)
22. `portrait_mira_neutral` (`old_town`)
23. `portrait_mira_warm` (`old_town`)
24. `portrait_mira_worried` (`old_town`)
25. `portrait_keel_neutral` (`docks`)
26. `portrait_keel_alert` (`docks`)
27. `portrait_keel_nod` (`docks`)
28. `portrait_sola_neutral` (`glass_greenhouse`)
29. `portrait_sola_quiet` (`glass_greenhouse`)
30. `portrait_sola_hope` (`glass_greenhouse`)
31. `portrait_ren_neutral` (`foundry_heights`)
32. `portrait_ren_focused` (`foundry_heights`)
33. `portrait_ren_proud` (`foundry_heights`)
34. `portrait_noor_neutral` (`waterworks`)
35. `portrait_noor_calm` (`waterworks`)
36. `portrait_noor_smile` (`waterworks`)
37. `portrait_ivo_neutral` (`clockwork_outpost`)
38. `portrait_ivo_distant` (`clockwork_outpost`)
39. `portrait_nox_endgame_resolve` (`moon_refuge`, visiera sempre chiusa)

### Priorità 2 — G2_boss (8 boss × 16 file = 128 pose 256×256 PNG + strip + scheda + report)
1. `boss_cinder_warden` (16 pose: `idle_1..2`, `walk_1..2`, `tell_primary_1..2`, `attack_primary_1..2`, `tell_secondary_1..2`, `attack_secondary_1..2`, `phase_shift`, `stagger`, `hurt`, `defeat`)
2. `boss_rail_colossus` (16 pose)
3. `boss_sky_harpy_alpha` (16 pose)
4. `boss_neon_mirage` (16 pose)
5. `boss_quarry_resonator` (16 pose)
6. `boss_marsh_leviathan` (16 pose)
7. `boss_foundry_overseer` (16 pose)
8. `boss_axis_arbiter` (16 pose)

### Priorità 3 — G3_stage (12 mappe dipinte sulle guide R42 3840×1080 PNG + WebP + report)
1. `stage_old_town_paint`
2. `stage_cinder_step_paint`
3. `stage_grand_central_paint`
4. `stage_skyline_paint`
5. `stage_neon_sprawl_paint`
6. `stage_echo_quarry_paint`
7. `stage_helion_marsh_paint`
8. `stage_docks_paint`
9. `stage_glass_greenhouse_paint`
10. `stage_foundry_heights_paint`
11. `stage_waterworks_paint`
12. `stage_axis_tower_paint`

### Priorità 4 — G4_nemici (20 varianti × 8 pose = 160 file 128×128 PNG + strip + scheda)
- `enemy_ash_crawler`, `enemy_cinder_hound`, `enemy_rail_sniper`, `enemy_switch_guard`, `enemy_gale_drone`, `enemy_spire_lancer`, `enemy_holo_decoy`, `enemy_neon_stalker`, `enemy_shard_beetle`, `enemy_echo_sentry`, `enemy_mire_leech`, `enemy_spore_carrier`, `enemy_Bilge_bruiser`, `enemy_harbor_hook`, `enemy_thorn_weaver`, `enemy_glass_moth`, `enemy_slag_golem`, `enemy_rivet_turret`, `enemy_valve_stalker`, `enemy_axis_enforcer` (8 pose ciascuno: `idle_1`, `idle_2`, `move_1`, `move_2`, `tell`, `attack`, `hurt`, `defeat`).

### Priorità 5 — G5_effetti (26 file PNG con trasparenza)
- 5 colpi delle 5 armi di Nox (`fx_strike_chrono`, `fx_strike_cinder`, `fx_strike_rail`, `fx_strike_echo`, `fx_strike_prism`)
- 8 telegrafi a terra / in aria con forma interna distinta per daltonismo (`fx_telegraph_line`, `fx_telegraph_circle`, `fx_telegraph_cone`, `fx_telegraph_ring`, `fx_telegraph_cross`, `fx_telegraph_wave`, `fx_telegraph_drop`, `fx_telegraph_pillar`)
- 5 capsule ed effetti di stato (`fx_capsule_heal`, `fx_capsule_charge`, `fx_capsule_shield`, `fx_status_slow`, `fx_status_overclock`)
- 8 impatti e particelle (`fx_hit_spark`, `fx_guard_flash`, `fx_parry_ring`, `fx_dash_ghost`, `fx_land_dust`, `fx_phase_crack`, `fx_boss_seal_break`, `fx_portal_ripple`)

### Priorità 6 — G6_ui (25 elementi interfaccia PNG con trasparenza)
- Cornici dialogo, indicatori armi, slot abilità, bussola distretto, badge salvataggio, pulsanti tattili Android 48×48 dp, cornici boss e indicatori stato.

## 4. Saltati con motivazione (M2_audio)
- Tutte le 23 voci di `M2_audio` (temi boss, fanfare, stinger ed effetti sonori) sono **saltate** in conformità alla regola esplicita del Prompt v2 (Sezione 0 e Sezione M2): *"NON ammesso: sintesi scritta a mano in Python/NumPy. Se non hai uno strumento ammesso, salta M2, scrivilo in STATO_CODA.md e chiudi così."*
