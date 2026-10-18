# City Adventure — Blackout v0.6 playtest

The pilot extends the existing JavaScript/Android WebView game. It is not a Unity port or a production release.

## Playable changes

After clearing Blackout's gang and three relay devices, the player allocates the last battery to the workshop or shelter. The decision is committed once and saved with the district checkpoint. The first driving mission applies the chosen consequence on every restart:

- Workshop: six vehicle integrity points instead of five; the original obstacle layout remains.
- Shelter: five integrity points; Mira's route removes every third obstacle (11 obstacles instead of 17).

After the first successful escape, a lit/unlit district status panel shows which site received power. This is a schematic consequence view, not a new explorable hub. Continuing reaches the existing second district; the city decision remains saved through subsequent chapters. New game resets it. Existing v4 checkpoints remain readable.

## Artwork repair

Eight legacy PNG files in the previous repository were incomplete (~786 kB each), although some browsers still emitted an image load event. Complete originals from the previous production workspace were restored and optimized as indexed PNGs. Maps are capped at 864 pixels and 192 colors; older sprite sheets at 1024 pixels and 256 colors. The 18 v0.5 atlases are preserved unchanged. The Android asset preparation step now verifies PNG signatures, chunk lengths, CRCs, IEND and complete zlib pixel streams before packaging.

## Verification

- 35 Node tests pass, including both consequences, checkpoint persistence, legacy saves, and district transitions.
- Browser: 844×390 and 390×844, no page errors or missing resources; movement, attack, pause/resume; all four districts load.
- Browser: both city choices tested from a cleared checkpoint through actual driving inputs to a successful escape, consequence panel, and chapter two. This does not certify a fresh-player five-minute completion time.
- Truncated PNG regression: the packager rejects a deliberately truncated map.
- Android CI additionally compiles/signs/verifies the debug APK, launches it on API 35, and checks loaded state, movement and pause against the actual WebView through CDP. Inspect the workflow result before claiming Android PASS.

## Limits

No new store release, billing, AdMob integration, performance/battery certification or physical-device certification. Final UI/audio/art judgment and difficulty require player feedback. The APK uses a newly generated debug certificate; updating an older installation may fail if its signing key differs. Avoid uninstalling an old copy without accepting loss of its local progress.

## Verified Android result — 2026-10-18

PASS on API 35, workflow run 39123494225. The exact delivered APK (SHA-256 `dee64e7e34bec960660aa15ecf6cb81d34023b13920fb6576d5e96713f62975c`) was installed and launched. Actual WebView checks: loaded=true, 15 artwork requests, movement y=1130 → 1024.097, simulation paused without advancing and resumed successfully. No fatal Android exception detected. APK v2/v3 signatures and ZIP integrity pass. This is an emulator smoke check; battery, framerate stability, physical devices and fresh-player difficulty remain unverified.

Download APK and evidence: [delivery branch](https://github.com/amzajaguar-blip/City-Adventure-/tree/build/blackout-v06-39123494225/dist). Main retains source and documentation. Test deliveries use private branches because Actions artifact storage is currently full. The workflow reuses this exact APK only while relevant game/Android/build sources match; future source changes invoke the builder again.
