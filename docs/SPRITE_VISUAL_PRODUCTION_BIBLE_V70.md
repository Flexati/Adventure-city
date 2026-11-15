# CITY ADVENTURE — SPRITE & VISUAL PRODUCTION BIBLE v7.0

> **Nota (M5, 4 novembre 2026):** documento storico, non riscritto. Il prezzo ufficiale è **5,99 €**, acquisto unico (D18 in [DECISIONI.md](gold/DECISIONI.md)). Dove qui si legge 4,99 € vale 5,99 €.

## Nox + Lulù · Premium Mobile Art Pipeline

**Status:** ART PIPELINE LOCKED  
**Target:** paid Android release at €4.99  
**Baseline art:** `docs/art-v05/`  
**Rule:** existing v0.5 assets remain valid prototype references until a replacement passes in-game QA.

---

# 1. ART DIRECTION

Working identity:

**Modern Retro Pixel Art + Romantic Cyberpunk Ruins**

Not:
- generic neon cyberpunk;
- 16-bit parody;
- photorealism reduced to pixels;
- noisy AI contact sheets;
- random costume changes between frames.

Visual pillars:

1. **Human silhouettes first.**
2. **Controlled neon, not neon everywhere.**
3. **Industrial darkness + warm human light.**
4. **Technology embedded in lived-in spaces.**
5. **Nox/Lulù color language always readable.**
6. **Romance shown through distance, gesture and shared light, not hearts/icons.**

Nox:
- cyan/ice highlights;
- sharper angular motion;
- white/black clothing mass;
- blue shoe accent.

Lulù:
- magenta/warm violet resonance;
- olive/black clothing mass;
- softer circular field shapes;
- magenta shoe accent.

Shared scenes:
- warm amber/civilian light signals safety and chosen intimacy.

Elyon:
- overexposed pale gold + sterile white;
- clean geometry;
- intentionally less “alive” than lower Vanta.

---

# 2. CURRENT ASSET AUDIT

The v0.5 catalog proves the pipeline but is not the final production standard.

Observed structural issues to eliminate in future replacements:

- several character atlases are approximately 1305×1206 rather than exact grid multiples;
- current renderer infers cells by dividing natural dimensions;
- some generated poses vary in apparent body scale;
- effects can approach cell edges;
- some vehicle orientations exist but are not production-validated;
- enemy sheets use one identity per entire threat family;
- no explicit per-frame anchor metadata.

Premium replacements must not repeat these weaknesses.

---

# 3. ATLAS STANDARD

## 3.1 v0.7 compatibility mode

For the vertical slice, preserve 4×4 compatibility where economical.

Preferred character sheet:
- **1024×1024 PNG**
- exact 4×4 grid
- 256×256 cell
- alpha background
- 20–28 px transparent safety gutter minimum
- fixed foot baseline
- fixed nominal body height
- no frame crosses cell bounds

This gives stable math and smaller decoded memory than oversized sheets.

## 3.2 Production mode

After animation metadata becomes variable-grid:

Allowed:
- 4×4
- 6×4
- 8×4

Only when animation actually benefits.

Never create 8 frames because “premium means more frames”.  
Use more frames where timing clarity improves:
- run;
- boss telegraph;
- large finisher;
- emotional acting.

## 3.3 Metadata

Every atlas needs a JSON metadata entry:

- id
- file
- grid columns/rows
- cell width/height
- anchor x/y
- nominal character height
- rows semantic meaning
- frame durations
- loop
- flip allowed
- event frame
- hit frame
- invulnerability interval when applicable
- generated source id
- SHA-256
- approval state

Renderer reads metadata. It does not guess semantics from file names forever.

---

# 4. CHARACTER MASTER LOCKS

Before generating animation sheets, create and approve one master turnaround per major character.

Required views:
- front;
- back;
- right profile;
- 3/4 front;
- 3/4 back.

Required neutral-expression portrait:
- head and shoulders;
- same hair;
- same facial proportions;
- same clothing;
- same skin tone;
- same accessories.

No action sheet is accepted if it changes identity from the master.

---

# 5. NOX MASTER SPEC

Canonical production identity:

- young adult man;
- warm brown skin;
- short tight black curls;
- small moustache/goatee if retained from current established game identity;
- white/black technical street jacket;
- black cargo trousers;
- blue/cyan footwear accent;
- compact biosynthetic seams only visible at close range;
- no generic chrome robot limbs in base form.

Silhouette:
- narrow upper body;
- jacket shoulder contrast;
- compact weapon profile;
- forward athletic posture.

Motion language:
- direct;
- efficient;
- low wasted movement;
- momentary “too perfect” mechanical transitions during EVE-Prime interference.

---

# 6. LULÙ MASTER SPEC

Canonical production identity:

- young adult woman;
- long black hair with fringe;
- olive technical bomber;
- black cropped/technical inner layer;
- black cargo trousers;
- magenta footwear accent;
- civilian-network interface details;
- no “mage robe” language.

Silhouette:
- hair mass distinguishes her immediately;
- slightly wider arm arcs;
- field emitter gesture visible in profile.

Motion language:
- adaptive;
- lateral;
- protective;
- uses space rather than brute force.

---

# 7. HERO SPRITE MATRIX

## 7.1 Nox — required

### Priority A — vertical slice
1. `nox_walk_v07`
   - down / up / right / run-right
2. `nox_combat_v07`
   - aim/fire/recoil/recover in required directions
3. `nox_dodge_v07`
   - anticipation / launch / travel / landing
4. `nox_hurt_down_v07`
   - hit / stagger / recovery / non-gory down
5. `nox_interact_v07`
   - inspect / touch / relay use / glass pickup
6. `nox_drive_portrait_v07`
   - focused driver close-up states

### Priority B — post slice
7. `nox_perfect_dodge`
8. `nox_counter`
9. `nox_black_pulse`
10. `nox_bodymod_titan`
11. `nox_bodymod_falcon`
12. `nox_bodymod_ghost`
13. `nox_bodymod_pulse`
14. `nox_emote_micro`
   - neutral / uncertain / guarded / soft
15. `nox_eve_intrusion`
   - body tension states without possession cliché

## 7.2 Lulù — required

### Priority A — vertical slice
1. `lulu_walk_v07`
2. `lulu_combat_v07`
3. `lulu_dodge_v07`
4. `lulu_hurt_down_v07`
5. `lulu_resonance_v07`
6. `lulu_terminal_v07`
   - scan / connect / reject / confirm
7. `lulu_drive_nav_portrait_v07`

### Priority B — post slice
8. `lulu_tether`
9. `lulu_barrier`
10. `lulu_node_override`
11. `lulu_emote_micro`
12. `lulu_separation`
13. `lulu_reunion`

---

# 8. COUPLE / SHARED ANIMATION SHEETS

These are high-value premium moments and should be authored only after individual identities are stable.

Required:
- back-to-back idle;
- shared relay interaction;
- injury support;
- hand offered;
- hand refused;
- hand accepted;
- “two knocks” close-up;
- reunion distance pose;
- final window/dawn pose.

Important:
Do not encode relationship level through kisses or constant physical contact.

Use:
- distance;
- eye line;
- hesitation;
- who initiates;
- whether the other respects refusal.

---

# 9. ENEMY PRODUCTION MATRIX

One generic enemy per district is insufficient for a full paid campaign.

Each threat family needs at least 3 readable combat roles before release.

## 9.1 Gang dei Relè

- Relay Raider — basic ranged pursuer
- Breaker — armored charger
- Signal Tech — support/controller

Sprites:
- walk
- attack
- hurt
- down
- special telegraph

## 9.2 Elyon Maintenance Organisms

- Skitter — fast close-range
- Spitter — ranged suppressor
- Anchor Beast — controller/elite

Visual rule:
biosynthetic maintenance origins must be visible under the “alien” appearance.

## 9.3 Neural Infected

- Drifter — melee
- Echo — burst movement
- Carrier — area hazard/support

No gore dependence.

## 9.4 Custodians

- Warden — heavy melee
- Prism — ranged geometry attack
- Binder — field controller

---

# 10. BOSS SPRITE REQUIREMENTS

Bosses require dedicated sheets, never scaled-up normal enemies.

## Scrap/Blackout elite
If retained as named encounter:
- idle
- locomotion
- 2 attacks
- stagger
- phase shift
- defeat

## ZERO / EVE-00
Critical production boss.

Needs:
- neutral mirror stance;
- observed-player imitation;
- perfect attack;
- broken rhythm reaction;
- adaptive counter;
- defeat/conversation stance.

## ARCHON / ELENA VOSS
Two visual states:

1. reconstructed human presentation;
2. defense architecture.

Human state must remain emotionally legible. Do not turn her immediately into a monster because she is antagonist.

---

# 11. VORTEX ART SET

Existing car identity stays:
- midnight graphite;
- cyan headlights;
- restrained magenta underglow;
- no real-world logo.

Required premium sheets:

1. 8 directions;
2. damage progression;
3. skid/turn readable states;
4. brake light state;
5. impact flash layer;
6. interior dashboard cut-in;
7. Nox driver portrait;
8. Lulù navigator portrait.

Driving road art requires:
- road base;
- Cantiere variant;
- Porto variant;
- Clinical variant;
- Elyon approach variant.

Use modular overlays to avoid four fully duplicated giant textures.

---

# 12. NPC SET

Premium story needs recurring civilians with identity.

Minimum recurring NPCs:
- Mira — shelter/city consequence callback;
- mechanic — workshop callback;
- clinic coordinator;
- HELIOS archivist/survivor;
- Ascension civilian;
- one Iron Ring contact.

For minor NPCs use modular heads/clothing, but recurring named NPCs get dedicated silhouettes.

---

# 13. PROPS

Props are narrative vocabulary.

Required families:

## Blackout
- relay off/on
- emergency battery
- workshop lift
- shelter lamp
- HELIOS connector
- glass pickup

## Breach
- anchor
- beacon
- synthetic tissue casing
- old HELIOS terminal

## Clinic
- neural filter
- patient support chair
- sealed door
- EVE authorization terminal

## Veil/Elyon
- memory cradle
- distributed node
- archive interface
- shutdown device
- consent terminal

If a prop matters to a choice, it must be visually distinct from decoration.

---

# 14. FX BIBLE

Nox:
- cyan;
- thin angular streak;
- precise impact.

Lulù:
- magenta;
- arcs/rings;
- area boundaries.

EVE-Prime:
- desaturated white/cyan;
- frame discontinuity;
- minimal glitch, never unreadable screen corruption.

Elyon:
- pale gold;
- perfect geometry;
- low-noise high-contrast effects.

Rules:
- VFX never hide telegraphs;
- alpha edges remain inside atlas cells;
- separate gameplay cue from decorative particles;
- cap simultaneous particles.

---

# 15. PORTRAITS AND NARRATIVE CLOSE-UPS

Use portraits only for moments where body language on the playfield is insufficient.

Required expressions per lead:
- neutral;
- alert;
- afraid but controlled;
- angry;
- vulnerable;
- exhausted;
- soft/affectionate.

Do not generate a new face per scene.

Identity lock is more valuable than expression variety.

---

# 16. ENVIRONMENT ART

Each district gets:

- gameplay map;
- lighting overlay;
- foreground occluders;
- 6–10 unique story props;
- 2–3 consequence variants;
- ambient FX layer.

## Cantiere Est
steel, amber, rain, improvised power.

## Porto delle Antenne
cyan signal structures, wind, wet industrial decks.

## Distretto Clinico
green-white clinical light contaminated by memory artifacts.

## Nodo Centrale
violet/black transitional infrastructure.

## Boneyard
white dust, crushed synthetic shells, huge discarded forms.

## Eden
controlled greenery, clean white confinement.

## Veil
near-black space, CRT-like light, fiber roots.

## Elyon
pale gold, silence, geometric perfection.

---

# 17. GENERATION PROMPT CONTRACT

Every future image-generation prompt must include:

- exact asset purpose;
- exact character identity;
- exact grid;
- exact output background;
- exact directions;
- exact frame phases;
- fixed scale;
- fixed baseline;
- transparent gutter requirement;
- prohibited elements;
- relationship to approved master.

Prompt must never say only “make a cool sprite sheet”.

For character animation:
- identity master is reference;
- current action described per frame;
- no extra character;
- no text;
- no borders;
- no cut-off body;
- no perspective drift;
- no costume variation.

---

# 18. QA AUTOMATION FOR SPRITES

Automated checks:

- PNG signature;
- decode success;
- expected dimensions;
- dimensions divisible by grid;
- alpha mode where required;
- cell occupancy;
- no opaque pixels within safety gutter;
- bounding-box scale variance;
- baseline variance;
- SHA-256;
- duplicate-frame similarity warning.

Warnings do not automatically reject artistic variation, but they force review.

---

# 19. HUMAN VISUAL QA

Every approved sheet receives an in-game proof at target scale.

Review:
- identity;
- silhouette;
- foot sliding;
- scale;
- direction;
- attack timing;
- frame-to-frame color drift;
- hair drift;
- weapon drift;
- effect clipping;
- left/right mirroring artifacts.

Approval states:

- GEN
- TECH_PASS
- IN_GAME
- ART_PASS
- FINAL

No asset goes from generation directly to FINAL.

---

# 20. V0.7 ART ORDER

Generate/repair in this exact order:

1. Nox master turnaround
2. Lulù master turnaround
3. Nox v0.7 walk
4. Lulù v0.7 walk
5. Nox combat/dodge
6. Lulù combat/resonance
7. glass pickup + hand interaction
8. HELIOS terminal
9. Relay Raider refinement
10. Breaker
11. Signal Tech
12. Blackout story props
13. Vortex premium damage/turn states
14. driver/navigator cut-ins
15. Breach organism first reveal
16. first EVE-Prime FX
17. v0.7 key art update only after gameplay assets pass

Never start with store art before the playable scene looks premium.

---

# 21. PREMIUM ART ACCEPTANCE

A sprite set is rejected if:

- character identity changes frame to frame;
- hair or facial hair teleports;
- body scale drift is obvious at gameplay size;
- feet slide during walk;
- left-facing mirror creates wrong weapon hand where it matters;
- attack anticipation is unreadable;
- effect covers threat;
- colors change without narrative reason;
- transparent gutter is violated;
- animation looks like four unrelated illustrations.

The bar is not “good AI image”.

The bar is **usable game animation**.
