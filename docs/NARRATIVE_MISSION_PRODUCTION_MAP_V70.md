# CITY ADVENTURE — NARRATIVE & MISSION PRODUCTION MAP v7.0

> **Nota (M5, 4 novembre 2026):** documento storico, non riscritto. Il prezzo ufficiale è **5,99 €**, acquisto unico (D18 in [DECISIONI.md](gold/DECISIONI.md)). Dove qui si legge 4,99 € vale 5,99 €.

## Premium campaign structure for Nox + Lulù

**Commercial target:** €4.99 paid Android game  
**Narrative canon:** v6.0  
**Engineering plan:** v7.0  
**Campaign target:** ~5 hours main path, before optional exploration/retries  
**Mission rule:** every mission changes city, relationship, knowledge, capability or future risk.

---

# 1. PACING MODEL

The campaign alternates:

- **action pressure**
- **short decompression**
- **meaningful choice**
- **visible consequence**
- **new question**

Never stack more than two high-intensity missions without a quieter beat.

Narrative delivery budget per standard mission:
- 0–2 pre-mission lines;
- 1 environmental discovery;
- 1 mid-mission micro-beat;
- 1 short end beat;
- optional deeper conversation outside combat.

No exposition monologue should explain what the player can discover through level art, enemy behavior or interaction.

---

# 2. ACT MAP

## ACT 0 / OPENING — “DUE COLPI”

### O01 — LA CASSA
**POV:** Nox  
**Target:** 2–4 min  
**Purpose:** establish body, response, Lulù, choice of name.  
**Mechanic:** first input is two taps/knocks; movement unlocks after opening.  
**Narrative change:** Nox chooses “Nox” for herself.  
**Asset needs:** container interior, Nox wake/hand, Lulù opening pose, close-up hand, dust/light FX.  
**Exit question:** Why was Nox sealed here?

This is not a cinematic tutorial. The player acts within the first 30 seconds.

---

# 3. ACT I — BLACKOUT / “WE CHOOSE WHO GETS THE LIGHT”

## M01 — BLACKOUT
**POV:** selectable Nox/Lulù for legacy compatibility  
**Target:** 6–8 min  
**Existing base:** Cantiere Est / Gang dei Relè  
**Purpose:** teach combat + establish city consequence philosophy.  
**Mechanics:** movement, attack, dodge, relay activation, partner.  
**Discovery:** HELIOS connector hidden inside relay hardware.  
**Micro-beat:** Nox collects useless glass fragment.  
**Choice:** Officina or Rifugio.  
**Persistent writes:** `blackout_choice`, `glass_owned`.  
**Asset needs:** premium gang trio, HELIOS connector prop, glass pickup, consequence lighting states.

### D01 — FUGA DAL CANTIERE
**POV:** Nox driver / Lulù navigator  
**Target:** 3–5 min  
**Purpose:** immediate mechanical payoff of M01 choice.  
**Mechanics:** Vortex.  
**Narrative beat:** first EVE-Prime interference appears as false route marker/syllable.  
**Consequence:** Officina gives reinforced car; Rifugio gives safer route.  
**Asset needs:** Vortex turn/damage, navigator portrait, EVE glitch marker.

---

# 4. ACT II — BREACH / “A PROMISE MADE WHEN IT IS EASY”

## M02 — LA BRECCIA
**POV:** Nox or Lulù  
**Target:** 7–9 min  
**District:** Porto delle Antenne  
**Purpose:** reveal “alien” organisms as old Elyon maintenance biology.  
**Mechanic introduced:** Resonance interaction / stronger ranged threat.  
**Story beat:** Nox recognizes an obsolete HELIOS door without knowing why.  
**Choice beat:** Lulù wants to transmit a deep scan. Nox says no. Lulù respects it.  
**Persistent write:** `helios_promise_respected=true`.  
**Asset needs:** organism trio, HELIOS door, old terminal, resonance VFX.

### D02 — SOTTO LA BRECCIA
**POV:** Nox driver / Lulù mapper  
**Target:** 4–5 min  
**Purpose:** convert existing 3-signal route into triangulation.  
**Mechanic:** drive through three signal volumes.  
**Hidden consequence:** map makes Nox more legible to Elyon later.  
**No morality:** player needs these signals to close the breach.  
**Asset needs:** signal pylons, map overlay, storm/wind road variant.

## Q02 — QUIET BEAT: TETTO DEL PORTO
**POV:** non-combat interactive scene  
**Target:** 2–3 min  
**Purpose:** give relationship oxygen.  
**Interaction:** optional sit/stand, inspect glass, short dialogue.  
**Thermal Anchoring:** can change through truth/refusal respect.  
**Asset needs:** rooftop pose sheet, two distance variants.

---

# 5. ACT III — CLINIC / “THE COST OF SAVING SOMEONE”

## M03 — ULTIMA CORSIA
**POV:** Nox/Lulù  
**Target:** 8–10 min  
**District:** Distretto Clinico  
**Purpose:** first true moral injury.  
**Mechanics:** filters, infected memory echoes, environmental hazards.  
**EVE-Prime:** first clear phrase: “Non toccarla.”  
**Crisis:** civilians trapped behind HELIOS-auth door.  
**Lulù action:** uses Nox EVE signature knowing it may expose her.  
**Immediate result:** civilians saved.  
**Hidden result:** `eve_signature_exposed=true`.  
**Asset needs:** infected trio, patient props, auth terminal, trapped civilians, EVE phrase FX.

### D03 — L’ULTIMA EVACUAZIONE
**POV:** Nox driver / Lulù coordinator  
**Target:** 5–6 min  
**Purpose:** force player to live the positive result before the negative reveal.  
**Mechanic:** stop and pick up survivors.  
**Narrative:** named civilians rescued in M03 appear here.  
**Asset needs:** pickup silhouettes, ambulance lights, Vortex loaded state.

## M04 — ORA ZERO
**POV:** Nox primary  
**Target:** 10–12 min  
**District:** Nodo Centrale  
**Purpose:** connect all four crises to Elyon and break the pair apart.  
**Mechanics:** Custodian boss, EVE intrusion, objective splitting.  
**Reveal:** attack is a retrieval operation for Nox.  
**Evidence:** clinical log shows Lulù transmitted signature.  
**Confrontation:** Lulù admits knowledge of risk.  
**Physical event:** infrastructure collapse separates them.  
**Persistent write:** `separation=true`.  
**Asset needs:** Custodian variants, boss, log UI, confrontation poses, collapse environment.

End of first movement.

---

# 6. ACT IV-A — NOX LINE / “WHO COMMANDS THE BODY?”

## N05 — NESSUNO AL COMANDO
**POV:** Nox only  
**Target:** 7–9 min  
**Location:** Boneyard inferiore  
**Purpose:** prove Nox can survive without Lulù.  
**Constraint:** Black Pulse disabled by choice, not damage.  
**Mechanic:** solo thermal stabilization alternatives.  
**Choice:** spend scarce heat resource on self or trapped synthetic survivor.  
**Asset needs:** Boneyard map, synthetic shells, thermal station, survivor unit.

## N06 — MEMORIA UTILE
**POV:** Nox  
**Target:** 6–8 min  
**Location:** old HELIOS station  
**Purpose:** memories become tools; test whether Nox treats them as commands.  
**Mechanic:** memory echo can reveal routes but also mark false “optimal” target.  
**Choice:** follow protocol or inspect a slower human route.  
**Asset needs:** memory overlay, archived worker echoes, station props.

## N07 — L’IRON RING
**POV:** Nox  
**Target:** 8–10 min  
**Purpose:** face a culture that rewards her for being exactly the weapon she fears.  
**Mechanic:** combat challenge with optional non-max-efficiency objectives.  
**Opponent:** elite unit/arena fighter.  
**Narrative:** crowd celebrates Black Pulse.  
**Choice:** use it for prize/access or win slower without it. Neither is morality-coded.  
**Asset needs:** arena, crowd silhouettes, elite fighter, Black Pulse preview.

## N08 — ARCHIVIO EVE
**POV:** Nox  
**Target:** 8–10 min  
**Purpose:** reveal Nox did not kill Lia; EVE-Prime did.  
**Mechanic:** archive reconstruction.  
**Discovery:** distributed transfer protocol.  
**Persistent write:** `distributed_protocol=true`.  
**Key line:** “Non l’ho fatto io. Ma so quanto sarebbe facile farlo.”  
**Asset needs:** Lia memory silhouettes, EVE-Prime visual identity, archive nodes.

---

# 7. ACT IV-B — LULÙ LINE / “WHO HAS THE RIGHT TO SAVE?”

## L05 — LA CITTÀ SENZA DI TE
**POV:** Lulù only  
**Target:** 6–8 min  
**Location:** Cantiere consequence return  
**Purpose:** callback to Officina/Rifugio.  
**Mechanics:** Resonance, routing, civilian aid.  
**Visible consequence:** chosen site is healthier; unchosen site has adapted at a cost.  
**Narrative:** Lulù does useful work that has nothing to do with winning Nox back.  
**Asset needs:** both consequence environment variants, named NPC callback.

## L06 — LINEA ROSSA
**POV:** Lulù  
**Target:** 7–9 min  
**Location:** service corridor  
**Purpose:** define her unique playstyle.  
**Mechanics:** reroute power while moving, deploy barrier, protect evacuees.  
**Choice:** power clinic machinery or open evacuation bridge.  
**Asset needs:** barrier VFX, node override, civilian route states.

## D04 — VORTEX: TUNNEL MUTO
**POV:** Lulù driving or remote-assisted Vortex prototype  
**Target:** 4–5 min  
**Purpose:** change driving grammar after separation.  
**Mechanic:** limited sensor visibility; Lulù reads route pulses.  
**Narrative:** empty passenger seat is visually present.  
**Asset needs:** interior absence beat, tunnel road, sensor pulses.

## L07 — EDEN
**POV:** Lulù  
**Target:** 8–10 min  
**Purpose:** reveal Ascension’s attractive face.  
**Mechanics:** low-combat infiltration, social/environmental routing.  
**Discovery:** archived people are preserved but not free.  
**Choice:** release data now causing panic, or copy it and prepare safe disclosure.  
**Asset needs:** Eden, ascension chairs, civilian upper-class variants.

## L08 — NON CHIAMARLA
**POV:** Lulù  
**Target:** 5–7 min  
**Purpose:** prove change through action.  
**Setup:** finds a channel that can reach Nox.  
**Risk:** activation would expose Nox again.  
**Action:** does not transmit without consent.  
**Narrative reward:** none immediate.  
**Persistent write:** `consent_channel_respected=true`.  
**Asset needs:** comm tower, silent call UI, restraint acting poses.

---

# 8. ACT V — VEIL / “THE RIGHT TO SAY NO”

## N09 — THE VEIL
**POV:** Nox  
**Target:** 8–10 min  
**Purpose:** enter deep infrastructure and reclaim EVE authority.  
**Mechanics:** controlled Black Pulse prototype, memory hazards.  
**Asset needs:** Veil environment, fiber roots, EVE security.

## N10 — ZERO
**POV:** Nox  
**Target:** 10–12 min  
**Boss:** ZERO / EVE-00  
**Purpose:** mechanical thesis boss.  
**Behavior:** observes repeated attack patterns and counters overused sequence.  
**Player solution:** vary rhythm, delay damage, use environment.  
**Choice after defeat:** preserve testimony or honor shutdown request.  
**Asset needs:** dedicated ZERO sheets, adaptation VFX, defeat dialogue state.

## N11 — AUTORITÀ
**POV:** Nox  
**Target:** 5–7 min  
**Purpose:** resolve EVE-Prime relationship.  
**Mechanic:** inner-space interaction based on learned anchors.  
**Outcome:** remove motor authority, optionally preserve memory.  
**Unlock:** governed Black Pulse.  
**Asset needs:** transformed cassa space, glass anchor, EVE-Prime close-up.

## L09 — LA VIA VERSO L’ASSE
**POV:** Lulù  
**Target:** 7–9 min  
**Purpose:** prepare reunion causally.  
**Mechanics:** reopen evacuation route while building ascent access.  
**Constraint:** choose between fastest route to Nox and civilians trapped below.  
**Main path:** Lulù stays to help civilians.  
**Asset needs:** ascent base, evacuation machinery, railgun preview.

---

# 9. ACT VI — REUNION / “STAY WITHOUT POSSESSING”

## R01 — LA BASE DELL’ASSE
**POV:** Nox  
**Target:** 4–6 min  
**Purpose:** reunion without automatic forgiveness.  
**Scene:** Lulù presents logs and admits responsibility.  
**Choice:** Nox may accept operational help without reconciling emotionally.  
**Asset needs:** reunion poses with 3 Thermal Anchoring variants.

## C01 — ASCESA
**POV:** Nox combat + Lulù environmental control  
**Target:** 9–12 min  
**Purpose:** true cooperative gameplay.  
**Mechanics:** Lulù opens routes, moves cover, powers railgun, reroutes energy.  
**Nox:** fights and protects fixed Lulù interaction windows.  
**Asset needs:** ascent modular map, railgun, support overlays.

## B01 — ARCHON: OUTER
**POV:** Nox  
**Target:** 8–10 min  
**Purpose:** destroy Archon’s monopoly on transfer.  
**Boss state:** Elena reconstructed human → defense architecture.  
**Asset needs:** Archon human master, defense form, transfer structures.

## B02 — ARCHON: INNER
**POV:** Nox narrative/combat hybrid  
**Target:** 7–9 min  
**Purpose:** identity trial.  
**Mechanic:** system offers traumatic/function memories; player can choose small chosen memories too.  
**Critical anchors:** glass, hand, sound, refusal, promise.  
**Lia:** asks Elena to stop, not to resurrect her.  
**Asset needs:** memory tableau, Lia, glass close-up, shared-hand variations.

## F01 — FINAL CHOICE
**POV:** Nox  
**Target:** 5–8 min  
**Available outcomes:** Human / Signal / Rebirth according to state.  
**No fake choices:** unavailable ending is not shown as a disabled moral reward.

---

# 10. ENDINGS

## HUMAN
Destroy central preservation monopoly.

Requires no special romance threshold.

Consequences depend on evacuation preparation.

Nox disables permanent regeneration.

## SIGNAL
Nox governs network temporarily and publishes truth/options.

Ambiguous continuity of identity.

## REBIRTH
Requires:
- distributed protocol;
- high Thermal Anchoring;
- Lulù accountability resolved;
- consent channel respected;
- at least one archived-consciousness consent choice;
- cooperative final process.

This ending is technical + ethical preparation, not “love magic”.

---

# 11. OPTIONAL CONTENT

Optional content must deepen theme or mechanics.

Allowed:
- memory objects;
- named civilian callbacks;
- Body Mod side encounters;
- Iron Ring rematches;
- alternate Vortex routes;
- archived voices with consent choices.

Not allowed:
- generic kill 20 enemies;
- meaningless collectibles;
- repeated rooms only to increase hours.

---

# 12. CAMPAIGN ASSET SCHEDULING

Generate assets no more than two production units ahead.

Reason:
- prevents expensive unused art;
- keeps designs aligned with real gameplay;
- avoids asset-driven feature creep.

Example:
During U4 Blackout, art may prepare U5 Driving and U6 Breach, but not final Archon animation.

---

# 13. NARRATIVE QA GATES

For every mission:

### Causality
Can tester explain why this mission happens now?

### Character
Does at least one action reveal Nox or Lulù?

### Consequence
Does something persist or change?

### Ludonarrative
Do mechanics express the stated conflict?

### Compression
Can any dialogue line be removed without losing necessary meaning?

### Mobile
Can all essential narrative information be understood in short sessions?

Fail any two → mission returns to design.

---

# 14. CAMPAIGN PREMIUM GATE

Before content-complete:

- no two consecutive missions feel mechanically identical;
- every Act has one memorable visual location;
- every Act has one meaningful decision;
- Nox and Lulù each have independent competence;
- separation is understandable;
- reunion is earned;
- endings reflect recorded play;
- first and final “two knocks” form a readable motif;
- glass remains useless in mechanical terms.

The campaign must feel authored, not assembled.
