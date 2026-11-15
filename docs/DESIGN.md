# Pizza Protocol — implementation specification

Date: 2026-10-16. Working title, branding deferred.
Source: original GDD v3 and Story Bible inside the production archive, plus the user's later requirement to choose either protagonist in single player. New dialogue is original implementation text, not quoted source material.

## Player promise

Two people who love each other help a city that remembers their decisions. Comedy comes from incompatible plans and strange orders; affection is conveyed through mutual support. The robot is not inherently evil. The chosen protagonist stays under player control throughout the mission; neither gender is a lesser version. The partner remains present and the player earns an assist through successful combat.

## Mission flow

1. Short opening interrupted by the robot's impossible order.
2. Lia gives an immediate understandable objective: retrieve three deliveries.
3. Three cart enemies teach range, cooldown and a marked danger area. Their count persists.
4. Optional northern clue: a box labeled for an event that has not happened yet.
5. Robot boss alternates protected idle, marked attack and exposed recovery. Attacking the shield communicates failure; evading reveals the opportunity. Story mode lengthens anticipation and recovery and reduces boss damage.
6. Three choices are presented with the immediate benefit and tradeoff. No hidden payment or clue gate.
7. Return conversation acknowledges the choice. A visible usable world feature changes.
8. Vortex scene closes the chapter with affectionate banter and a small mystery.

The intended 8–12 minute duration is a design target, not an observed user median. Automated completion is not a measure of human pacing.

## Outcome matrix

| Choice | Physical/useful change | Relationship and dialogue | Tradeoff |
|---|---|---|---|
| Repair directive | Northern delivery shortcut teleports across the block | Robot ally; Lia acknowledges slow recovery | Pizzeria is not immediately restored |
| Protect pizzeria | A free refill station near Lia restores health | Owner grateful; robot cautiously shares a clue | No allied shortcut |
| Friendly public challenge | Replay arena with a stronger boss | Robot becomes a sportsmanlike rival | No refill station or allied shortcut |

The public-humiliation idea in the old GDD becomes a consensual friendly challenge; this fits affectionate, colourful all-ages comedy better. No morality score is exposed. The state schema stores the chosen outcome and optional clue separately.

## Combat and navigation decisions

- Kai: nearest-target assisted ranged shot, smaller single-target impact, shorter cooldown.
- Zara: short-range area attack, stronger boss hit, longer cooldown.
- Dodge gives a short movement burst and invulnerability, with a visible cooldown.
- The Duo assist heals one heart and opens recovery; it does not steal the final hit.
- Boss damage only lands during recovery. Telegraph shape, label and animation communicate danger independently of colour and sound.
- Scenery collision, bounded map and a directional objective arrow prevent wandering into an unmarked void.
- Failure resets the encounter with no currency penalty or ad offer.

## Narrative editing rules

Every scene must advance an objective, relationship or mystery. Spoken lines remain player-paced. Dialogue pauses combat. Banter expresses their established relationship without treating one protagonist as incompetent. Chapter resolution is playable and visible rather than merely described. The full narrative source is `game/story.mjs`, separate from simulation.

## Known prototype compromises

Vector actors and buildings test silhouette/readability but do not meet the illustrated art bible. The companion follows at an offset, not a finished independent navigation/animation system. No voice acting. No camera-shake dependency. Exploration and combat share a top-down plane; production movement style should be re-evaluated after playtesting. True co-op is a separate architecture task; the companion is not a second human player.
