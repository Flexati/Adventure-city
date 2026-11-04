# City Adventure v0.7 — Premium Slice Acceptance Matrix

> **Nota (M5, 4 novembre 2026):** documento storico, non riscritto. Il prezzo ufficiale è **5,99 €**, acquisto unico (D18 in [DECISIONI.md](gold/DECISIONI.md)). Dove qui si legge 4,99 € vale 5,99 €.

**Target price:** €4.99  
**Baseline branch:** `main`  
**PR gate:** #2 — MERGED  
**Technical slice:** PASS  
**Commercial release:** BLOCKED

Legend:
- ✅ evidence exists
- 🟡 implemented / evidence incomplete
- ⬜ not yet executed
- ❌ failed

| Gate | Requirement | Evidence type | Status |
| --- | --- | --- | --- |
| SAVE-1 | v5 saves validate before load | Node tests | ✅ |
| SAVE-2 | v4 checkpoint migration | Node tests | ✅ |
| SAVE-3 | narrative state survives retry/transition | Node tests | ✅ |
| NAR-1 | narrative beat engine is DOM-independent | Node tests | ✅ |
| NAR-2 | opening writes persistent canonical flags | Android WebView verifier | ✅ |
| NAR-3 | HELIOS promise persists | Node + Android end-to-end path | ✅ run 39139227028 |
| NAR-4 | first relay clue persists | Node + Android end-to-end path | ✅ run 39139227028 |
| COMBAT-1 | Perfect Dodge has narrow timing window | Node tests | ✅ |
| COMBAT-2 | counter bonus is consumed once | Node tests | ✅ |
| COMBAT-3 | Lulù Resonance is mechanically distinct | Node tests | ✅ |
| DRIVE-1 | routes remain deterministic | Node tests | ✅ |
| DRIVE-2 | Officina/Rifugio consequences remain distinct | Node tests | ✅ |
| DRIVE-3 | shoulder slows before damaging hard edge | Node tests | ✅ |
| ANDROID-1 | flattened v0.7 JS bundle compiles | Node + packager test | ✅ |
| ANDROID-2 | exact v0.7 APK builds/signs/verifies | GitHub Actions | ✅ run 39139227028 |
| ANDROID-3 | APK installs and launches API 35 | GitHub Actions | ✅ run 39139227028 |
| ANDROID-4 | real WebView completes opening | CDP verifier | ✅ run 39139227028 |
| ANDROID-5 | real WebView moves and pauses | CDP verifier | ✅ run 39139227028 |
| UI-1 | touch targets >=48px/dp-equivalent | static + CDP metrics | ✅ |
| UI-2 | safe-area horizontal/vertical | CSS contract + CDP layout | ✅ structural |
| UI-3 | 360x800 no clipping | Android WebView capture + bounds | ✅ |
| UI-4 | 390x844 no clipping | Android WebView capture + bounds | ✅ |
| UI-5 | 412x915 no clipping | Android WebView capture + bounds | ✅ |
| UI-6 | 844x390 no clipped controls | Android WebView capture + bounds | ✅ |
| ART-1 | Nox master identity approved | human art gate | ⬜ |
| ART-2 | Lulù master identity approved | human art gate | ⬜ |
| ART-3 | P0 animation exact-grid TECH_PASS | automated + human | ⬜ |
| ART-4 | P0 art proven in-game | capture | ⬜ |
| AUDIO-1 | current cues decode/no clipping | existing QA | ✅ baseline |
| AUDIO-2 | subjective phone speaker pass | human listening | ⬜ |
| PERF-1 | 20-min combat soak | device | ⬜ |
| PERF-2 | 20-min driving/restart soak | device | ⬜ |
| PERF-3 | no runaway paused/background loop | device/profile | ⬜ |
| STORY-1 | first input <30s | launch + opening flow | ✅ technical path; human timing still recommended |
| STORY-2 | player understands Nox/Lulù roles | blind playtest | ⬜ |
| STORY-3 | player understands Officina/Rifugio tradeoff | blind playtest | ⬜ |
| STORY-4 | Breach promise understood without design doc | blind playtest | ⬜ |
| VALUE-1 | first 10 min contain no obvious placeholder path | review | 🟡 |
| VALUE-2 | first session feels worth €4.99 | blind tester question | ⬜ |

## Current automated boundary

A green Node suite does **not** certify:
- APK runtime;
- mobile visual layout;
- art quality;
- physical-device performance;
- subjective audio;
- €4.99 value perception.

A green Android emulator run does **not** certify:
- physical devices;
- battery/thermal behavior;
- final commercial art;
- final campaign content.

The slice may expand beyond Breach only after Android + UX + P0 art gates reach a credible PASS.


## Android intermediate evidence — run 39137835505

This evidence validates the v0.7 runtime snapshot before the latest safe-area/player-copy patch. It is intentionally **not** treated as final-head certification.

- delivery branch: `build/v07-premium-39137835505`
- cold launch: Status OK, TotalTime 3385 ms
- WebView assets ready: true
- artwork resource count observed: 15
- opening rendered: true
- save schema observed: 5
- opening canonical state committed: true
- movement: y 1130 → 1027.5205
- pause/resume verifier: PASS
- no fatal app exception was reported by the workflow gate

Proof: `dist/android-proof/android-renderer-proof.json` on the delivery branch.

Final Android rows must be reconfirmed against the current PR head after the safe-area/touch-target changes.


## Current-head Android + viewport proof — run 39138403470

Validated code head: `055aee4fd55d8333a524b11cb0a8731ce8b8b39a`.

- workflow conclusion: SUCCESS
- exact v0.7 APK build/sign/verify: PASS
- API 35 emulator boot: PASS
- APK install/cold launch: PASS
- v0.7 opening shown/completed: PASS
- native lifecycle pause/resume state: PASS
- save schema v5: PASS
- movement: y 1130 → 1017.25
- pause simulation freeze: PASS
- 360×800: no overflow; critical buttons >=48px
- 390×844: no overflow; critical buttons >=48px
- 412×915: no overflow; critical buttons >=48px
- 844×390: no overflow; critical buttons >=48px

Delivery branch: `build/v07-premium-39138403470`.

Captured screenshots:
- `viewport-360x800.png`
- `viewport-390x844.png`
- `viewport-412x915.png`
- `viewport-844x390.png`

This is a **technical layout PASS**, not an ART_PASS. Final art identity, subjective composition, physical-device thermals and human value perception remain blocked.


## Final technical v0.7 evidence — run 39139227028

Validated feature head: `e57e7fecdd0386b3082e87a46c0c84bc1316d443`.

PASS:
- logic suite;
- exact v0.7 APK build/sign/verify;
- API 35 emulator boot;
- cold launch;
- Android WebView opening;
- native pause/resume lifecycle;
- save schema v5;
- opening persistence;
- real movement and pause freeze;
- 360×800, 390×844, 412×915 and 844×390 layout bounds;
- Officina choice persistence;
- Blackout HELIOS connector clue persistence;
- Vortex transition and city consequence callback;
- Breach entry;
- HELIOS promise persistence;
- Thermal Anchoring authored delta 50 → 53.

Delivery evidence branch: `build/v07-premium-39139227028`.

This closes the **technical vertical-slice gate**. It does not convert unresolved ART / physical-device / blind-playtest rows into PASS.
