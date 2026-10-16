# City Adventure — Pizza Protocol 0.1

A playable **single-player chapter prototype**, not a finished commercial game or Android release. The original three ZIP files remain byte-for-byte unchanged at the repository root.

## Run locally (Debian/Linux, Windows or macOS)

Requirements: Python 3.10+; a modern browser. Node 18+ only for automated engine tests. No npm dependencies or build step are needed to play.

```sh
python3 tools/prepare_assets.py
python3 -m http.server 8080 --bind 127.0.0.1
```

Open **http://localhost:8080/game/**. Keep the terminal running. `prepare_assets.py` verifies the SHA-256 of all three archives and copies 12 selected original members to the ignored `game/assets/` directory. No archives are rewritten; nothing is downloaded. These assets are not duplicated in Git. If an archive is missing or changed, preparation stops with an error.

For a phone on your trusted local network, deliberately bind the server to your LAN interface and open its address on the phone. The default above is local-only. Browser/mobile rendering checks and physical-device certification remain pending in this environment.

## Play

Choose Kai (precise ranged attack) or Zara (close-range area attack). Their partner accompanies them and provides the earned Duo assist. Both can complete every branch; a romantic relationship is already established, not a reward to unlock.

- Move: WASD / arrows or touch joystick.
- Attack: J / Space or Attacca. Hold to repeat, with a cooldown.
- Dodge: K / Shift or Schiva. Move in the direction you want to dodge.
- Interact: E or the contextual button.
- Duo assist: Q / Insieme at 100%; restores one heart and opens the boss's guard.
- Escape / pause: settings, story difficulty, reduced motion, larger text and audio.

Speak to Lia, stop the three delivery carts, evade the boss's marked attack area, then hit during its recovery. Investigate the optional box in the north alley. Choose an outcome, return to Lia, then reach the Vortex to finish. Continue exploring afterward.

A saved boss encounter restarts from a safe full-health checkpoint. Choices, clue, recovered deliveries and completed chapter persist locally. Restart explicitly confirms replacement of the local save. No account or network telemetry is used. Browser storage may be cleared by the user/browser.

## What's implemented

Connected scrolling district, collision, objective guidance, touch and keyboard input, two combat styles, companion assist, three delivery encounters, telegraphed boss, optional clue, Italian dialogue, three persistent outcomes with usable world changes, epilogue, replay arena, music/SFX, local save and settings.

The drawn in-world characters are **prototype vector art**. The original illustrated sheets provide dialogue portraits; they are not falsely represented as production-ready animations. The ZIPs contain annotated opaque sheets requiring a proper runtime animation pass. Audio comes directly from the original pack.

## Verification

```sh
node --test tests/engine.test.mjs
```

See `docs/QA.md`, `docs/DESIGN.md`, `docs/RESEARCH.md`, and `docs/ROADMAP.md`. Browser automation requires Playwright and Chromium; `tests/browser.cjs` provides the pending UI smoke test. No revenue, retention or commercial-success percentage has been measured.

**Not implemented:** chapters 2–7, online/local two-player co-op, production sprite animation, Play Billing, AdMob, storefront, real-device performance certification. A debug APK is now built for user testing; no AAB or store release has been created. See `docs/APK_TEST.md`.

## Optional single-file build

After preparing assets, run `python3 tools/build_preview.py` to create `preview.html` with bundled source, images and audio. This generated file is ignored by Git and can be opened offline in a normal browser. Its syntax is checked, but browser rendering was not verified in this environment.

## Android test APK

The offline debug wrapper is in `android/`. Build details, verification limits and phone test steps are in `docs/APK_TEST.md`.
