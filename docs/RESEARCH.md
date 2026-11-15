# Research translated into this game

Consulted 2026-10-16. Focused primary-source review; not an exhaustive global literature review or evidence of a 90% chance of commercial success. Developer accounts describe practices in their own contexts. Proposed applications below are design hypotheses.

| Source | Relevant evidence | Application and limit |
|---|---|---|
| Nintendo, Ask the Developer, Super Mario Bros. Wonder, Part 1 | The team explored mechanics through prototypes before settling on the core. | Build and play one mission with a consequential resolution before expanding seven districts. Does not imply copying Mario or promising its sales. |
| Supercell, 10 Learnings from 10 Years | Polished games were cancelled when the team did not expect durable player return. | Separate technical completion from reasons to continue. For this finite story, chapter completion and satisfaction matter alongside voluntary return; years-long live-service retention is not the same objective. |
| inkle, ink | Narrative tooling supports playing branches during writing and keeping interactive structure inspectable. | Dialogue is data separate from the engine; exercise each outcome and persistence. This prototype uses plain JavaScript dialogue data, not the ink runtime. |
| Game Accessibility Guidelines, Basic | Control options, text readability, subtitles and adjustable difficulty are recurring concerns. | Touch/keyboard alternatives, speaker labels, larger text, pausing, reduced motion and story difficulty. Full remapping and screen-reader gameplay remain missing; do not claim full accessibility. |
| Android app-quality guidance | Core value and user experience are separate from technical correctness. | Test movement and combat feedback, not just executable code; mobile/device validation remains a release gate. |
| Google Play Families Policies | Child-directed or mixed-audience games carry additional audience, advertising and data obligations. | Prototype has no advertising, payments, analytics, chat or accounts. Audience declarations and SDK decisions must be reviewed before adding monetization or publishing. |

## Direct sources

- https://www.nintendo.com/us/whatsnew/ask-the-developer-vol-11-super-mario-bros-wonder-part-1/
- https://supercell.com/en/news/10-learnings-10-years/7436/
- https://www.inklestudios.com/ink/
- https://gameaccessibilityguidelines.com/basic/
- https://developer.android.com/quality
- https://support.google.com/googleplay/android-developer/answer/9893335?hl=en

## Commercial and retention experiment

No artificial urgency is implemented. Curiosity about the impossible box, the affectionate duo, learnable combat, alternative endings and persistent district changes are the current return hypotheses. Later optional challenges should be replayable with recoverable cosmetics; do not punish absence or use scarcity pressure directed at children.

Initial business hypothesis: a free opening chapter followed by a clearly priced full adventure. Compare willingness to continue, completion and price expectations before investing in acquisition. Optional ads are not a default requirement; their interruption cost and younger-audience constraints may outweigh revenue for this game.

Define success before a commercial test: sustainable net revenue after store fees, tax, acquisition and support, at an agreed budget and time horizon. Track acquisition, tutorial progress, chapter completion, voluntary replay, return and purchase conversion separately. No benchmark from another genre supplies a reliable success probability here.

## Practical evidence still needed

Observed first-session play, dialogue comprehension, difficulty for both heroes, response to each outcome, physical Android performance, and optional later market/price testing. Automated tests can establish reachability, consistency and failures; they cannot establish enjoyment, attachment or purchase intent.
