# City Adventure — art-v07

Target: **Premium Vertical Slice v0.7**.

Canonical sources:
- `../SPRITE_VISUAL_PRODUCTION_BIBLE_V70.md`
- `../SPRITE_GENERATION_MANIFEST_V70.json`
- `PROMPTS_P0.json`

## Identity lock

Nox and Lulù must first pass master-turnaround approval. Animation sheets generated before the corresponding master is approved are disposable candidates, not production assets.

Nox canonical visual identity:
- young adult man;
- warm brown skin;
- short tight black curls;
- small moustache and neat goatee;
- white/black technical street jacket;
- black cargo trousers;
- blue/cyan footwear accent.

Lulù canonical visual identity:
- young adult woman;
- long straight black hair with fringe;
- olive technical bomber;
- black technical cropped top;
- black cargo trousers;
- magenta footwear accent.

## P0 generation order

1. `nox_master_turnaround`
2. `lulu_master_turnaround`
3. `nox_walk_v07`
4. `lulu_walk_v07`
5. `nox_combat_v07`
6. `lulu_combat_v07`
7. `nox_dodge_v07`
8. `lulu_resonance_v07`
9. `nox_interact_v07`
10. `lulu_terminal_v07`
11. Relay Gang trio
12. Blackout story props
13. Vortex states
14. Driver/navigation portraits
15. Breach organism reveal
16. EVE-Prime FX

## Approval pipeline

`PLANNED → GENERATED → TECH_PASS → IN_GAME → ART_PASS → FINAL`

No generated image skips a stage.

### TECH_PASS
- correct PNG dimensions;
- exact grid;
- transparent gutters;
- no cell overflow;
- decode valid;
- stable baseline;
- no duplicated frames.

### IN_GAME
- loaded by runtime;
- correct direction/row;
- correct gameplay scale;
- no clipping;
- no broken mirroring.

### ART_PASS
- identity matches master;
- motion reads at phone scale;
- no color/hair/weapon drift;
- silhouette remains readable in combat;
- effect does not hide telegraphs.

## Rule

Store key art is produced **after** the gameplay P0 set passes. The store page cannot be more polished than the first playable session.
