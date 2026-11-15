# CITY ADVENTURE — MASTER DEVELOPMENT PLAN v7.0

> **Nota (M5, 4 novembre 2026):** documento storico, non riscritto. Il prezzo ufficiale è **5,99 €**, acquisto unico (D18 in [DECISIONI.md](gold/DECISIONI.md)). Dove qui si legge 4,99 € vale 5,99 €.

## Nox + Lulù · Premium Android Production

**Status:** PRODUCTION PLAN LOCKED  
**Commercial target:** paid premium Android game — **€4.99**  
**Playable baseline:** Blackout v0.6  
**Narrative canon:** `docs/NOX_LULU_NARRATIVE_FUSION_V60.md`  
**Next executable target:** Vertical Slice v0.7  
**Primary platform:** Android  
**Runtime:** JavaScript simulation/rendering + Android WebView wrapper

> This plan defines target quality, engineering sequence and acceptance gates. It does not claim future systems are already implemented. Blackout v0.6 remains the verified fallback until each new unit passes technical, narrative, visual and Android gates.

---

# 1. PRODUCT PROMISE

City Adventure is a paid mobile action-adventure about **Nox and Lulù**, two protagonists crossing a city that remembers what they choose.

The €4.99 purchase must immediately communicate:

- complete playable product, not a shell;
- no forced advertising;
- no energy timers;
- no pay-to-win;
- no mandatory online account for campaign play;
- meaningful campaign progression;
- authored story and endings;
- polished controls designed for touch;
- coherent art and audio direction;
- reliable offline save;
- no obvious placeholder assets in the shipped path.

The price is not justified by content quantity alone. It is justified by **density, finish, identity and trust**.

---

# 2. PREMIUM QUALITY BAR

A feature is not accepted because it “works”.

It must pass four levels:

1. **Functional** — it behaves according to spec.
2. **Readable** — a player understands it without developer explanation.
3. **Pleasurable** — feedback, timing and animation feel intentional.
4. **Integrated** — it supports story, art, audio and the next decision.

Any feature that stops at Functional is prototype quality.

## 2.1 €4.99 gate

Before release, a blind tester should be able to answer “yes” to:

- Does the first 10 minutes feel like a finished game?
- Are Nox and Lulù memorable?
- Do attacks, dodge and movement feel deliberate?
- Can I understand threats on a phone without zooming?
- Does the game avoid obvious recycled filler?
- Do my choices visibly change something?
- Do the environments feel authored rather than generated at random?
- Does the game respect my time?
- Did I encounter a technical issue that would make me regret paying?
- Would I describe the product as premium rather than “mobile free-to-play without ads”?

If more than two answers are “no”, release stays blocked.

---

# 3. ENGINEERING STRATEGY

## 3.1 Do not migrate engines for prestige

The current codebase is compact and already testable:

- `campaign.mjs`
- `driving.mjs`
- `runtime.mjs`
- `visuals.mjs`
- Node tests
- Android WebView wrapper

Keep it until a measured limitation requires migration.

Migration to another engine is permitted only if at least one hard condition is proven:

- renderer cannot maintain target frame pacing;
- asset memory cannot be controlled;
- input/lifecycle bugs cannot be fixed cleanly;
- future content authoring cost becomes materially higher than migration cost.

No speculative rewrite.

## 3.2 Architecture rule

Target flow:

`Input → Simulation → Events → Presentation → Platform`

Simulation owns rules.  
Presentation owns rendering/audio/haptics.  
Platform owns Android lifecycle, storage and packaging.

## 3.3 Fixed simulation

Evolve current tick into:

- fixed-step simulation;
- accumulator;
- rendering independent of simulation cadence;
- deterministic combat and driving;
- hard clamp only as safety fallback.

Goal: gameplay behaves the same at 30, 60 and irregular render cadence.

## 3.4 Data-driven content

Move content out of logic only when there are at least two real consumers.

Target data types:

- missions;
- beats;
- enemy archetypes;
- dialogue IDs;
- consequences;
- animation metadata;
- Body Mods;
- ending requirements.

Avoid “framework-first” engineering.

## 3.5 Save system

Create schema v5 with:

- schemaVersion;
- current mission;
- city consequence ledger;
- narrative flags;
- Thermal Anchoring;
- unlocked Body Mods;
- settings;
- optional collectibles;
- migration from v4.

Requirements:

- validate before load;
- never partially apply corrupt state;
- test legacy saves;
- serialize deterministically;
- save only at safe state boundaries plus periodic checkpoint.

---

# 4. MOBILE PERFORMANCE BUDGETS

These are acceptance targets, not current measurements.

## 4.1 Frame pacing

Primary target: **60 fps** where practical.  
Supported floor: **30 fps stable**.

Budgets:

- simulation average < 4 ms;
- frame p95 < 16.7 ms on target mid-range device at 60 fps mode;
- no normal gameplay hitch > 100 ms;
- no GC spike caused by per-frame large allocations;
- no asset decode during critical combat if avoidable.

## 4.2 Memory

Scene target:

- decoded active art budget: ~96 MB or less;
- release previous district resources;
- atlas max preferred dimension: 2048;
- avoid giant sheets mixing unrelated systems;
- no duplicate decoded copies of same asset.

## 4.3 Startup

Target:

- menu interactive within ~4 s on mid-range Android;
- first useful visual before full asset load;
- visible load status;
- campaign playable offline.

## 4.4 Battery and thermals

Release gate requires:

- 20-minute combat/driving soak;
- no runaway CPU loop while paused;
- no rendering at full speed behind modal/pause;
- Android background pause stops simulation/audio;
- no accidental wake-lock behavior.

---

# 5. TOUCH-FIRST INPUT

## 5.1 Principles

- 48 dp equivalent minimum touch targets;
- safe-area respected;
- no primary combat control at system gesture edge;
- player can move and attack simultaneously;
- gesture does not require precision smaller than a thumb;
- visual control state mirrors actual input state.

## 5.2 Nox controls

Primary:
- move;
- attack;
- dodge;
- ability/Body Mod;
- context action.

Secondary:
- Black Pulse;
- Duo when narratively available.

## 5.3 Lulù controls

Primary:
- move;
- pulse;
- Resonance;
- dodge;
- node/route override.

Lulù must not feel like Nox with magenta VFX.

## 5.4 Accessibility

Required:
- reduced motion;
- haptics optional;
- haptics never sole feedback;
- readable text scaling strategy;
- choices never depend only on timed input;
- hold interactions have accessible alternative when important.

---

# 6. COMBAT SYSTEM

## 6.1 Nox identity

Nox = precision + mobility + controlled escalation.

Final kit:
- rapid attack;
- charged attack;
- Perfect Dodge;
- counter window;
- Body Mod active;
- Black Pulse.

## 6.2 Lulù identity

Lulù = control + routing + protection.

Final kit:
- pulse attack;
- Resonance arc;
- tether/slow;
- temporary barrier corridor;
- node override;
- support interactions with environment.

## 6.3 Perfect Dodge

Acceptance:

- enemy telegraph readable before hit;
- dodge window measured and tested;
- brief perceptual slowdown;
- player retains control;
- counter window optional, not mandatory;
- no hidden latency;
- reduced-motion variant.

## 6.4 Black Pulse

State machine:

`ready → active → unstable → recovery → ready`

Active:
- damage increase;
- stagger resistance;
- threat visualization.

Recovery:
- vulnerability rises;
- player still has defensive agency.

Narrative scenes must use the same rules. No fake “story Black Pulse” with contradictory behavior.

---

# 7. ENEMY DESIGN

Build from small reusable archetypes:

- pursuer;
- ranged suppressor;
- charger;
- controller;
- support;
- elite;
- boss.

Every enemy requires:

- silhouette;
- telegraph;
- attack window;
- recovery window;
- counter strategy;
- hit reaction;
- defeat reaction;
- audio cue;
- mobile readability proof.

Difficulty comes from composition and timing, not only HP multiplication.

---

# 8. NARRATIVE ENGINEERING

Narrative data must not become scattered `if` chains in `runtime.mjs`.

Each beat has:

- stable id;
- trigger;
- prerequisites;
- participants;
- delivery type;
- writes;
- optional choice;
- consequence IDs;
- replay rule.

Example:

```text
beat_id: breach_helios_promise
trigger: breach_terminal_reached
requires: blackout_complete
writes: helios_promise=true
delivery: dialogue_short
```

## 8.1 Consequence ledger

Each major choice stores:

- choice id;
- selected option;
- immediate effect;
- delayed effect;
- affected mission/system;
- callback scene.

No visible morality score.

## 8.2 Thermal Anchoring

Hidden 0–100 relationship state.

Increases with:
- truth;
- consent;
- costly reliability;
- responsibility;
- help without control.

Decreases with:
- coercion;
- manipulation;
- broken promise;
- deliberate instrumentalization.

Never changes because the player takes combat damage.

Influences:
- micro-dialogue;
- animation proximity;
- support behavior;
- ending eligibility.

---

# 9. LEVEL DESIGN STANDARD

Every mission follows:

**Hook → Learn → Pressure → Choice → Consequence → Exit**

Every mission must change at least one:

- city state;
- relationship state;
- knowledge state;
- access;
- mechanical capability;
- future risk.

If it changes none, cut or merge it.

## 9.1 Mobile session target

Normal mission:
- 4–8 min active gameplay;
- checkpoint every meaningful phase;
- micro-scenes 20–35 s;
- optional exploration extends duration;
- no 10-minute unskippable dialogue.

## 9.2 Environmental storytelling

Each district must communicate story without dialogue using:

- signage;
- repeated hardware;
- destroyed infrastructure;
- civilian behavior;
- props;
- lighting;
- audio beds.

---

# 10. CAMERA + VISUAL READABILITY

Camera:
- soft follow;
- movement look-ahead;
- bounded boss framing;
- no excessive zoom-out.

Combat readability:
- silhouette > surface detail;
- telegraphs use shape + motion + color;
- hit flash short;
- VFX count capped;
- screen shake scalable;
- no full-screen noise that hides projectiles.

UI:
- one primary objective;
- max two lines;
- cooldown represented by more than color;
- subtitles never cover active threats;
- critical choices get full focus state.

---

# 11. AUDIO STANDARD

Audio is gameplay infrastructure.

Per combat action:
- anticipation;
- execution;
- impact;
- recovery.

Per district:
- unique ambience bed;
- music layer;
- danger layer;
- consequence sting.

Nox and Lulù need separate sonic identity.

No use of copyrighted melodies or obvious imitation.

Release gate includes subjective listening on:
- phone speaker;
- cheap earbuds;
- normal headphones.

---

# 12. HAPTICS

Optional layer:

- light: UI confirm, relay activation;
- medium: Perfect Dodge, weapon impact;
- heavy: boss slam, Black Pulse activation.

Never vibrate continuously.  
Never use haptics as sole indicator.

---

# 13. PRODUCTION UNITS

## U0 — Baseline Freeze

Record:
- source SHA;
- test count;
- Android proof;
- asset catalog;
- known limitations.

Gate:
- reproducible baseline.

## U1 — Save v5 + Narrative State

Implement:
- schema v5;
- migration v4;
- narrative flags;
- choice ledger;
- Thermal Anchoring storage.

Gate:
- legacy save PASS;
- corrupt save rejection PASS;
- deterministic serialization PASS.

## U2 — Narrative Beat Engine

Implement:
- beat resolver;
- prerequisites;
- one-shot/replay;
- short dialogue delivery;
- state writes.

Gate:
- headless tests;
- no DOM dependency;
- missing beat fails safely.

## U3 — Opening Sequence

Implement:
- container/cassa;
- “batti due volte”;
- Nox naming beat;
- glass object;
- first EVE-Prime interference.

Gate:
- first meaningful input <30 s;
- tutorial skippable after completion;
- no input trap.

## U4 — Blackout Premium Pass

Keep existing gameplay.

Add:
- HELIOS environmental clues;
- authored micro-dialogue;
- better enemy staging;
- stronger city-choice presentation;
- callback line during driving.

Gate:
- both city choices fully playable;
- no regression to v0.6 consequence logic.

## U5 — Driving Feel Pass

Implement:
- acceleration curve tuning;
- readable lane hazards;
- lateral damping;
- hit recovery;
- better road feedback;
- consequence callback.

Gate:
- first-time tester completes route without explanation after one retry max median target;
- no invisible collision complaints.

## U6 — Breach Promise

Implement:
- biosynthetic reveal;
- terminal interaction;
- “non inviarlo” promise;
- Lulù respects refusal.

Gate:
- narrative setup understandable without lore document.

## U7 — Perfect Dodge

Implement and tune.

Gate:
- input timing tests;
- 30/60 fps parity;
- reduced-motion mode;
- no accidental double trigger.

## U8 — Clinical Betrayal

Implement:
- civilian emergency;
- EVE signature decision;
- rescue payoff;
- hidden cost;
- save consequence.

Gate:
- testers understand both saved lives and violation of consent.

## U9 — Evacuation Premium Pass

Upgrade third drive:
- visible pickup feedback;
- civilian state;
- consequence carryover.

## U10 — Ora Zero + Separation

Implement:
- Custodian boss;
- EVE-Prime intrusion;
- log discovery;
- Nox/Lulù confrontation;
- physical split.

Gate:
- separation reads as earned, not arbitrary.

## U11 — Parallel Campaign Prototype

One Nox mission + one Lulù mission.

Gate:
- characters feel mechanically distinct;
- both lines affect common city state.

## U12 — Body Mod Foundation

Introduce only after Nox combat is stable.

## U13 — Black Pulse

Implement shared gameplay/narrative state machine.

## U14 — Act IV Production

Alternate authored Nox/Lulù missions.

## U15 — Veil / Zero

Boss behavior adaptation; archive revelations.

## U16 — Reunion + Cooperative Ascent

Environmental cooperative mechanics, not simple assist cooldown.

## U17 — Ending System

Human / Signal / Rebirth based on recorded consequences.

## U18 — Premium Content Pass

Cut filler, improve weak mission beats, fix repetition.

## U19 — Full Mobile Optimization

Memory, frame time, startup, battery, asset streaming.

## U20 — Release Candidate

No new features. Only:
- critical fixes;
- polish;
- QA;
- store package.

---

# 14. VERTICAL SLICE v0.7 DEFINITION

Scope:

1. opening “two knocks”;
2. name choice beat;
3. glass collectible;
4. first combat;
5. Blackout;
6. Officina/Rifugio;
7. first Vortex run;
8. arrival at Breach;
9. HELIOS terminal;
10. Lulù promise.

Target length:
- 25–35 min first play;
- 18–25 min replay.

Must demonstrate:
- combat;
- touch;
- story;
- city consequence;
- driving;
- art direction;
- audio identity;
- Android stability.

If v0.7 is not premium, do not expand Acts IV–VI.

---

# 15. TEST STRATEGY

## Unit
- combat state;
- save;
- choices;
- relationship;
- driving;
- beat resolver;
- migrations.

## Integration
- mission transitions;
- save/load during campaign;
- consequence callbacks;
- Android lifecycle.

## Visual
Mandatory viewport captures:
- 360×800
- 390×844
- 412×915
- landscape supported target

Checks:
- no clipped controls;
- no text overlap;
- sprite scale;
- enemy readability;
- modal safe-area.

## Soak
- 20 min combat;
- 20 min driving/restarts;
- repeated pause/resume;
- repeated save/load.

## Physical device
Release cannot rely only on emulator.

Minimum:
- one lower-mid Android;
- one modern mid/high Android;
- one tall/narrow screen profile.

---

# 16. DEFINITION OF DONE

A production unit is DONE only if:

- code merged;
- tests added;
- old tests still pass;
- visual capture reviewed;
- mobile interaction checked;
- save migration considered;
- performance impact measured;
- narrative continuity checked;
- asset catalog updated when relevant;
- known limitations documented.

“Looks good in browser” is not DONE.

---

# 17. KILL / REWORK CRITERIA

Rework or remove a system if:

- it requires tutorial text longer than the action itself;
- players repeatedly misread its purpose;
- it cannot maintain target frame pacing;
- it duplicates another mechanic;
- it weakens Nox/Lulù identity;
- it adds content but no meaningful decision;
- it exists only because an asset was already generated.

Premium production rewards subtraction.

---

# 18. COMMERCIAL RULES FOR €4.99

Recommended launch model:

**one-time paid app.**

Default product rules:
- no forced ads;
- no interstitials;
- no rewarded ads required for progress;
- no consumable currency;
- no energy;
- no paid power boosts.

Possible post-launch:
- free quality updates;
- optional substantial expansion only if it adds real campaign content.

Store promise should emphasize:
- complete offline-capable campaign;
- no ads;
- story-driven choices;
- two protagonists;
- multiple endings.

Do not claim “5 hours” until measured with external testers.

---

# 19. RELEASE BLOCKERS

Release stays BLOCKED if any is true:

- crash or black screen on supported Android;
- save corruption;
- first 10 min contain placeholder art;
- touch targets fail;
- repeated frame hitch during normal combat;
- visual overlap on supported viewport;
- audio clipping;
- story contradiction;
- ending condition can be triggered incorrectly;
- a major choice has no observable consequence;
- paid build still contains prototype/debug language;
- app requires network unexpectedly;
- tester cannot understand why Nox and Lulù separate.

---

# 20. FINAL QUALITY QUESTION

Before publishing at €4.99:

> If the player had paid before launching, does every minute of the first session increase confidence in the purchase?

If the answer is not consistently yes, release stays blocked.
