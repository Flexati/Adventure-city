# CONSEGNA GRUPPO A — Audio: tutto il gioco (~150 minuti, 158 suoni)

- **Data**: 2026-11-12
- **Regola applicata da `PROMPT_ARGON.md` (§ A — Audio)**:
  > *"Solo con un modello di generazione audio. Se non c'è, non consegnare nulla e scrivere `A/CONSEGNA.md`: un suono sintetizzato da codice non vale come un suono vero."*
- **Stato Modello Audio Nativo**: **[FATTO]** Nell'ambiente di esecuzione AI Studio Build non è presente uno strumento/modello neurale di generazione audio diretta (`generate_audio` / Lyria file export OGG). Pertanto, in rigorosa conformità alla direttiva di non consegnare suoni sintetizzati da codice come se fossero generati da un modello audio, in `deliveries/argon-150min-20261112/A/` viene consegnato esclusivamente il presente `CONSEGNA.md` con l'elenco completo dei 158 file saltati e il relativo motivo tecnico.
- *(Nota tecnica separata sul ramo codice `work/chronos-adventure-commercial`: il bug del ronzio sui bassi di `game/audio/v10/title_theme.ogg` segnalato dall'utente è stato riparato sul ramo `work/chronos-adventure-commercial` nel commit `4d16af1` rimuovendo `saw()` e `drone` 36.7 Hz; qui nel ramo di consegna `delivery/argon-asset-giro2-20261110` non viene incluso alcun segnaposto sintetizzato per i 158 asset richiesti).*

## Elenco completo dei 158 file audio (Saltati — Motivo: assenza di modello di generazione audio)

### 1. Musica (14 brani, 90–150 s, loop, 48 kHz, picco ≤ −1,0 dBFS) — SALTATI (0/14)
1. `music_act1_city_dark.ogg` — Saltato (nessun modello di generazione audio disponibile)
2. `music_act2_breach.ogg` — Saltato (nessun modello di generazione audio disponibile)
3. `music_act3_split_nox.ogg` — Saltato (nessun modello di generazione audio disponibile)
4. `music_act3_split_lulu.ogg` — Saltato (nessun modello di generazione audio disponibile)
5. `music_act4_one.ogg` — Saltato (nessun modello di generazione audio disponibile)
6. `music_bone_tyrant.ogg` — Saltato (nessun modello di generazione audio disponibile)
7. `music_forge_behemoth.ogg` — Saltato (nessun modello di generazione audio disponibile)
8. `music_vega_duel.ogg` — Saltato (nessun modello di generazione audio disponibile)
9. `music_glass_flood.ogg` — Saltato (nessun modello di generazione audio disponibile)
10. `music_glass_reaper.ogg` — Saltato (nessun modello di generazione audio disponibile)
11. `music_docks_veyra.ogg` — Saltato (nessun modello di generazione audio disponibile)
12. `music_promise_workshop.ogg` — Saltato (nessun modello di generazione audio disponibile)
13. `music_approach_tension.ogg` — Saltato (nessun modello di generazione audio disponibile)
14. `music_credits.ogg` — Saltato (nessun modello di generazione audio disponibile)

### 2. Ambienti (8 × 30 s, loop, 48 kHz, picco ≤ −1,0 dBFS) — SALTATI (0/8)
15. `amb_glass_flood_water.ogg` — Saltato (nessun modello di generazione audio disponibile)
16. `amb_docks_night.ogg` — Saltato (nessun modello di generazione audio disponibile)
17. `amb_workshop_rain.ogg` — Saltato (nessun modello di generazione audio disponibile)
18. `amb_rail_wind.ogg` — Saltato (nessun modello di generazione audio disponibile)
19. `amb_cathedral_nave.ogg` — Saltato (nessun modello di generazione audio disponibile)
20. `amb_forge_toxic.ogg` — Saltato (nessun modello di generazione audio disponibile)
21. `amb_village_day.ogg` — Saltato (nessun modello di generazione audio disponibile)
22. `amb_village_night.ogg` — Saltato (nessun modello di generazione audio disponibile)

### 3. Boss (24 file: 6 boss × 4 stati + 4 extra Vega) — SALTATI (0/24)
- **Bone Tyrant**: `sfx_bone_tyrant_windup.ogg`, `sfx_bone_tyrant_attack.ogg`, `sfx_bone_tyrant_hurt.ogg`, `sfx_bone_tyrant_phase.ogg`
- **Forge Behemoth**: `sfx_forge_behemoth_windup.ogg`, `sfx_forge_behemoth_attack.ogg`, `sfx_forge_behemoth_hurt.ogg`, `sfx_forge_behemoth_phase.ogg`
- **Shadow Reaper**: `sfx_shadow_reaper_windup.ogg`, `sfx_shadow_reaper_attack.ogg`, `sfx_shadow_reaper_hurt.ogg`, `sfx_shadow_reaper_phase.ogg`
- **Vega**: `sfx_vega_windup.ogg`, `sfx_vega_attack.ogg`, `sfx_vega_hurt.ogg`, `sfx_vega_phase.ogg`, plus `sfx_vega_aim_tick.ogg`, `sfx_vega_shot.ogg`, `sfx_vega_charged_shot.ogg`, `sfx_vega_reload.ogg`, `sfx_vega_defeat.ogg`
- **Rook**: `sfx_rook_windup.ogg`, `sfx_rook_attack.ogg`, `sfx_rook_hurt.ogg`, `sfx_rook_phase.ogg`
- **The Anchor**: `sfx_the_anchor_windup.ogg`, `sfx_the_anchor_attack.ogg`, `sfx_the_anchor_hurt.ogg`, `sfx_the_anchor_phase.ogg`

### 4. Glass Flood, promessa, segreti (8 file) — SALTATI (0/8)
- `sfx_tide_rise.ogg`, `sfx_plank_step.ogg`, `sfx_sentinel_emerge.ogg`, `sfx_sentinel_hit.ogg`, `sfx_weld_spark.ogg`, `sfx_part_hold.ogg`, `sfx_secret_found.ogg`, `sfx_civilian_thanks_chime.ogg`

### 5. I 96 file del Giro 2 (`GIRO_2_ANIMAZIONE_AUDIO.md`) + 8 nuovi stinger/medaglie (104 file) — SALTATI (nessun modello di generazione audio)
- **8 nuovi stinger/medaglie**: `atto_1_apertura.ogg`, `atto_2_apertura.ogg`, `atto_3_apertura.ogg`, `atto_4_apertura.ogg` (4–6 s), `medaglia_oro.ogg`, `medaglia_argento.ogg`, `medaglia_bronzo.ogg`, `sblocco.ogg` (1–2 s).
- **96 file di `GIRO_2_ANIMAZIONE_AUDIO.md`**: tutti documentati in `deliveries/argon-asset-giro2-20261110/A/AUDIO_MANIFEST_104.json` come non generabili senza modello audio neurale.
