# U0 — v0.7 Baseline Freeze

**Branch:** `feature/v07-premium-slice`  
**Base branch:** `main`  
**Base commit at branch creation:** `7cf695aa663985674c10a5d8cdf31670ed837884`  
**Playable baseline:** Blackout v0.6  
**Android evidence:** API 35 workflow run 39123494225  
**Verified APK SHA-256:** `dee64e7e34bec960660aa15ecf6cb81d34023b13920fb6576d5e96713f62975c`

## Frozen behaviors

The v0.7 strike must preserve until intentionally superseded and re-tested:

- four on-foot districts;
- three deterministic Vortex routes;
- Nox as Vortex driver;
- Officina/Rifugio persistent Blackout consequence;
- v4 save compatibility;
- pause/resume lifecycle behavior;
- Android WebView startup;
- reduced-motion setting;
- offline campaign path.

## Known baseline limits

- v0.5 character atlases are prototype-quality and not exact 4×4 multiples;
- art identity/animation consistency still needs premium replacement;
- physical-device performance and battery are not certified;
- current narrative is mostly briefing-driven;
- save schema v4 lacks narrative/relationship state;
- runtime owns too much presentation flow.

## Change policy

Every v0.7 unit must:
1. add or update tests;
2. preserve v4 migration unless explicitly retired after release;
3. avoid modifying final store release state;
4. record new limitations;
5. keep main usable until feature branch gates pass.

## Rollback point

If v0.7 destabilizes startup, saves or Blackout consequences, revert to base commit above rather than patching around an unknown regression.
