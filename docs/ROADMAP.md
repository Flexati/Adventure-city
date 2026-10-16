# Production roadmap and release gates

The source packs describe seven chapters. Version 0.1 implements one playable chapter prototype, not the whole game.

1. **Validate the first mission.** First-session observation, time-to-understand, missed touch actions, combat fairness, which dialogue drags, recognition of world change. Change the mechanic before producing more content if it fails. No human-result claim until observed.
2. **Production art pass.** Use original sheets as reference. Prepare consistent transparent sprites, atlases, frame bounds, directional movement, attack anticipation, hurt/recovery and companion interactions. Audit image rights and source provenance. Replace prototype vector art after visual and runtime checks, not by stretching annotated sheets.
3. **Expand narrative and city state.** School/Prof Zombie → park/anti-gravity → family birthday → driving school/Vortex → mall → Broadcast Core. Each chapter introduces one useful verb and at least two persistent consequences. Carry the first chapter's ally/shop/rival state into later missions, test branch convergence and final epilogue composition.
4. **Two-player mode.** User requested optional co-op but did not choose same-device versus separate phones. Select the target before network/input architecture work. Preserve complete single-player access. Test join/leave, ownership, camera, dialogue voting, save authority and disconnect recovery. Do not label companion AI as multiplayer.
5. **Android integration.** Choose wrapper/engine based on measured render/audio/input behaviour; implement lifecycle pause/resume, Android back, safe areas, offline resources, save migration, memory and battery testing. Test on the user's low-end target class, not only desktop emulation.
6. **Business and audience.** Establish target age range and regional distribution; review Play Families implications if children are included. Implement verified Billing entitlements and restore if premium unlock is selected. Evaluate AdMob only after deciding whether ads suit the experience. No pay-to-reveal story clues or paid accessibility.
7. **Store production.** Final name and brand only once the identity is stable; original icon and honest gameplay screenshots, localization, privacy/data disclosures, ratings, tested release build, signing and staged rollout.

## Release status

**PLAY STORE RELEASE: BLOCKED.** Missing full chapters, production animation, multiplayer decision, real-device QA, production Android validation, business integration, asset rights review, store setup and user evidence. This is a production gate, not a blocker to playing the prototype or reviewing its code.

No budget changes, paid services, advertising campaigns, public hosting or store release were performed.

Android debug wrapper and test APK now exist (see `APK_TEST.md`); production release remains blocked.
