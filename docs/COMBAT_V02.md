# Combat prototype 0.2

Nox and Lulù now use the generated transparent combat atlas in the world. Internal kai/zara save IDs remain compatible. Both have energy pistols (J/Space), automatic aim toward the nearest enemy within 300 units, four animation phases, and one damage resolution after the wind-up. L casts magic: Nox a focused blue bolt (430 units), Lulù a magenta forward area (230 units). Magic deals 4 damage, has a 4.5 second cooldown, and respects the boss shield. Touch controls include a separate Magic button. Q retains the earned Duo support ability.

Dialogue is a lower panel with the world visible. Original unrelated character portraits are suppressed. This is still a prototype: sprites face left/right during combat; full eight-direction attacks, neutral locomotion, Ciro, lip sync and redesigned environments remain unfinished. Some generated effects approach atlas cell edges. The image is integrated without modifying its bytes; grid sampling uses naturalWidth/4 and naturalHeight/4. No claim of finished production animation or device QA.

## Asset provenance and prompt
Built-in image_gen used with the two attached character reference images. Original output copied byte-for-byte to game/art/combat.png. RGBA 1254×1254; four columns and four rows. Rows: Nox pistol, Nox magic, Lulù pistol, Lulù magic. Prompt requested a usable transparent sprite atlas, consistent identities and scale, four gun phases (aim, fire, recoil, recovery), four blue magic poses for Nox and four magenta crescent poses for Lulù, no text or presentation-board framing. No image postprocessing applied.

## Verification
14 logic tests passed, including delayed gun damage exactly once, magic cooldown, cast exclusion, boss shield, and hero-specific area targeting. JavaScript syntax checked. APK built with Android 35 tooling, debug signing v2/v3 and zip alignment verified. No emulator or physical-device runtime verification was available. Test on device before evaluating visual polish/performance. APK has the same debug application ID and signing key as 0.1, with versionCode 2.
