# Verification record — v0.1

Date: 2026-10-16. Evidence concerns the chapter prototype, not commercial success or Play Store release.

## Executed

- `node --test tests/engine.test.mjs`: **11/11 PASS**.
- Both heroes: delivery combat → boss shield/recovery → victory → all three outcomes → owner acknowledgement → ending → save reload, exercised through the simulation API.
- Choice timing/immutability; branch-specific shortcut, refill and rematch actions.
- Dodge cooldown; earned Duo meter and repeated-use prevention.
- Collision/bounds; equal diagonal speed.
- Invalid saves rejected, values bounded, optional clue persisted.
- Boss-load checkpoint and defeat preserve deliveries while restoring safe health.
- `node --check` on game, engine, story, UI-test script and bundled preview JavaScript: PASS.
- Asset preparation: all three SHA-256 hashes match the uploaded originals. Twelve selected members copied byte-for-byte; provenance JSON is generated locally.

Simulation tests position actors to exercise mechanics directly. They prove state consistency and combat/branch reachability under the test scenarios; they do not prove an uninterrupted human playthrough or browser rendering.

## Blocked / not claimed

- Actual browser rendering, input/audio playback, responsive screenshots and browser end-to-end completion: **NOT VERIFIED**. The local Playwright package exists but Chromium is absent; its official downloader returned an invalid archive and failed. The cloud browser separately refused `file:` navigation under its URL security policy. No workaround was used to evade that restriction.
- `tests/browser.cjs` is supplied for repeatable UI smoke checks when Chromium is available, but was not successfully run here.
- No physical Android run, measured frame-time distribution, AAB build, multiplayer test, accessibility certification, listening review or human enjoyment study.

## Fixes during implementation

Moved the repair-route interaction out of a building collision rectangle. Added modal focus containment, blur/visibility input reset and pause. Protected fresh-start save replacement with explicit in-game confirmation. Saved boss encounters resume at a safe checkpoint rather than mid-telegraph.

## Gates

- Source and simulation logic: PASS within the test scope above.
- Runtime/visual acceptance: BLOCKED pending real browser/device evidence.
- Commercial validation and Play Store release: BLOCKED.

## Android build addendum

An offline debug APK has subsequently been compiled, signed and package-verified. See `APK_TEST.md` for exact checksum and checks. This does not clear the outstanding browser/device runtime gate.
