# Richiesta ad Argon, parte 2: nemici e ritratti

9 novembre 2026 · decisioni D23, D28, D30, D45, D46, D48 · `COMMERCIAL_RELEASE = BLOCKED`

Leggi prima `INDICE.md`. Il **blocco di stile comune** è in `README.md`: incollalo per primo in ogni chat.

## Perché servono (verificato nel codice)

- **[FATTO]** Cathedral Bone Tyrant, Toxic Forge Behemoth e Shadow Reaper sono boss della Parte I (D23) e si rigenerano a 288 px (D28, D30). Il loro pacchetto è già pronto in `requests/gpt-boss-v2-20261102/` (vedi `INDICE.md`, gruppo G): **non vanno disegnati come nemici comuni** e non compaiono nelle ondate.
- **[FATTO]** Sei fogli non hanno le pose di preparazione e recupero (`toxic_brawler`, `iron_penitent`, `valkyrie_striker`, `chrono_huntress`, `demon_hunter_survivor`, `desert_chrono_fighter`, schema `f`): oggi il gioco usa al loro posto la mossa speciale e la posa ferma, quindi l'avviso prima dell'attacco è meno leggibile.
- **[FATTO]** Otto ruoli usano ancora il foglio unico della loro famiglia: nella gang del Blackout tutti e cinque i ruoli hanno la stessa sagoma; nella Breccia `breaker` e `brute`; nel Contagio `brute`; le pattuglie del porto.
- **[FATTO]** Sette servizi dei villaggi e la guardia della porta non hanno un ritratto: nell'interno si vede lo sprite ingrandito (`game/interiors.mjs`, `NPC_PORTRAIT`).

## F. Contratto unico dei fogli di combattimento

Vale per le sezioni H e J. Allega sempre a ogni richiesta `game/art/chrono/purple_guard.png` come **riferimento di griglia e di scala** (non di soggetto).

```
Deliver ONE sprite sheet: PNG, fully transparent background, a strict grid of 8 columns x 3 rows.
Every cell is exactly 128 pixels tall and W pixels wide (W is given in each request, the same for all 24 cells).
The character faces RIGHT in every cell. Feet (or the lowest point of a floating body) touch the line 8 pixels
above the bottom of the cell, horizontally centred in the cell. Leave at least 1 fully transparent pixel on every
side of every cell. Same character, same proportions, same palette in all 24 cells.
Cell order, left to right, top to bottom:
 1-4   idle (breathing loop)
 5-8   walk (loop, clearly different leg or body positions)
 9-12  anticipation (wind-up that warns the player: the body leans back or raises the weapon, readable in silhouette)
13-14  attack (release and follow-through)
15-16  recover (returning to guard)
17-20  hurt (recoil)
21-24  defeat (collapse, the last cell lies still)
Pixel art with crisp pixels, 1-pixel dark outline, no anti-aliased halo, no glow outside the outline, no text.
The threat must be recognisable by SHAPE alone, in black silhouette at 32 pixels tall, not by colour.
```

**Nomi dei file:** `<id>.png`, con l'`id` scritto in ogni richiesta.

## G. I quattro boss della Parte I (pacchetto già pronto, 36 immagini)

Non ci sono prompt nuovi qui: si usa il pacchetto `requests/gpt-boss-v2-20261102/`, scritto per GPT ma valido anche per Argon. Contiene brief, 20 prompt, riferimenti di scala e l'ordine di lavoro per Cathedral Bone Tyrant, Toxic Forge Behemoth, Shadow Reaper e Vega (cella 320 × 320, figura alta 288 px, 28 fotogrammi). La consegna va nella cartella indicata in quel README.

## H. Fogli da completare: preparazione e recupero (6 strisce)

Qui si consegna solo **una striscia di 6 celle** (non il foglio intero): 4 di preparazione e 2 di recupero. Stessa altezza di cella (128), stessa larghezza W del foglio di oggi, stesse regole di allineamento. Allega il foglio di oggi (`game/art/chrono/<id>.png`): il personaggio deve restare identico.

```
Deliver ONE strip: PNG, transparent background, 6 cells in one row, each 128 pixels tall and W pixels wide.
Cells 1-4: anticipation (the wind-up before the attack, readable in silhouette). Cells 5-6: recover (back to guard).
Same character as the attached sheet: identical proportions, costume, palette and outline. Facing right, feet on the
line 8 pixels above the bottom, centred. No text.
```

| File | W | Preparazione da disegnare |
|---|---|---|
| `toxic_brawler_prep.png` | 160 | carica il pugno guantato dietro la spalla, le fiale verdi sul guanto si accendono |
| `iron_penitent_prep.png` | 208 | solleva il flagello di ferro sopra la testa con due mani |
| `valkyrie_striker_prep.png` | 208 | arretra un piede e porta la lancia all'altezza della spalla |
| `chrono_huntress_prep.png` | 176 | alza la balestra e prende la mira, il mantello si apre |
| `demon_hunter_survivor_prep.png` | 192 | trascina la lama larga dietro di sé e piega le ginocchia |
| `desert_chrono_fighter_prep.png` | 176 | incrocia le braccia fasciate davanti al petto e abbassa il baricentro |

## J. Ruoli che usano ancora il foglio unico della famiglia (8 fogli)

Altezza della figura: circa 88 px (104 px per i bruti). Ogni ruolo deve avere una **sagoma diversa dagli altri della stessa famiglia**. Allega il foglio della famiglia di oggi come riferimento d'identità: `game/art/v05/gang_states.png`, `alien_states.png` o `infected_states.png`.

### Gang dei Relè (Cantiere Est, Blackout e Cantiere): persone, abiti da strada, toni rosso scuro e arancio

**`gang_shooter.png`** · W = 176
```
A gang member in a dark red hooded jacket holding a short pump shotgun at the hip. Slim, stands sideways.
Anticipation: shoulders the shotgun and aims. Attack: muzzle recoil.
```

**`gang_breaker.png`** · W = 192
```
A broad gang member with a riot shield made from a relay cabinet door and a crowbar. Runs low behind the shield.
Anticipation: lowers the shield and leans forward to ram. Attack: shield bash.
```

**`gang_signal.png`** · W = 176
```
A gang signaller with a backpack radio and a tall bent antenna, one arm raised holding a flare. Not armoured.
Anticipation: raises the flare high, sparks on the antenna. Attack: brings the arm down, a ring of sparks at the feet.
```

**`gang_brute.png`** · W = 208
```
A very large gang enforcer in a welder's mask and a heavy apron, carrying a sledgehammer made from a relay coil.
Anticipation: lifts the hammer over the head. Attack: overhead smash.
```

### Predatori della breccia (Porto): creature aliene viola e ciano, mai umane

**`alien_breaker.png`** · W = 208
```
A low, armoured breach predator like a horned beetle on four legs, violet shell with cyan seams, a ram plate on the
head. Anticipation: scrapes the ground and lowers the head. Attack: lunging ram.
```

**`alien_brute.png`** · W = 224
```
A tall hunched breach predator with two massive forearms like anchors, small head, cyan core in the chest.
Anticipation: both arms rise. Attack: double ground slam.
```

### Infetti (Distretto Clinico)

**`infected_brute.png`** · W = 208
```
A bloated infected orderly in a torn hospital gown, one arm swollen into a club of spore growths with lime-green
glow, slow and heavy. Anticipation: drags the heavy arm back. Attack: wide swing.
```

### Pattuglie di manutenzione (Porto, furtività)

**`port_patrol.png`** · W = 176
```
A maintenance patrol guard in a grey-teal waterproof coat with a hood, carrying a long inspection lamp pole whose
light points forward (the vision cone in the game starts from that lamp). Calm walk.
Anticipation: raises the lamp pole like a staff. Attack: thrust.
```

## I. Ritratti (8 immagini)

Stile identico ai ritratti già nel gioco (allega `game/art/npc/dario.jpg` e `game/art/npc/maelis.jpg` come riferimento di stile, non di soggetto).

```
Deliver ONE portrait: 768x1024, opaque. Painterly high-resolution pixel art bust, chest up, three-quarter view,
the character busy with a small gesture of their trade, a soft out-of-focus background of their workplace.
Warm key light, strong readable face, original design. No text, no logos, no letters on clothes or objects.
```

| File | Chi è | Indicazioni |
|---|---|---|
| `moon_shop.png` | Commerciante del rifugio | donna sui 50, grembiule verde acqua, pesa merce asciutta su una bilancia; banco fatto con porte d'ascensore |
| `cathedral_smith.png` | Fabbro del Chiostro | uomo magro e anziano, grembiule di cuoio, tiene una piccola campana di bronzo incrinata; pietra chiara e fuoco |
| `cathedral_info.png` | Informatore della Stanza delle voci | figura con mezza maschera di stoffa dietro una grata di legno intagliato, candela |
| `toxic_smith.png` | Fabbro dei tubi | donna robusta, maschera da saldatore alzata sulla fronte, tubi e scintille verdi |
| `clockwork_shop.png` | Mercante del Magazzino dell'Asse | uomo con monocolo da orologiaio e gilet d'ottone, tiene una molla carica fra due dita |
| `clockwork_relic.png` | Custode della Camera delle fondamenta | persona anziana con una lanterna viola, davanti a una pietra incisa con un quadrante spezzato (senza numeri) |
| `clockwork_info.png` | Informatore della Torre delle molle | giovane con occhialoni e guanti da riparatore, un piccolo automa sulla spalla |
| `cathedral_gate_guard.png` | Guardia della porta | la guardia del foglio `game/art/chrono/gate_guard.png` (allegalo): mantello rosso, elmo, alabarda; sguardo calmo, porta aperta dietro |
