# Richiesta ad Argon, secondo giro: ciò che manca ancora

10 novembre 2026 · decisioni D50, D51, D52 · `COMMERCIAL_RELEASE = BLOCKED`

Nel primo giro sono entrati nel gioco i 15 interni e gli 8 ritratti. Gli altri gruppi non sono entrati perché erano figure geometriche tracciate da un programma (esito in `docs/gold/CONSEGNA_ARGON_20261109_ESITO.md`).

**Cosa cambia in questo giro.** Non chiediamo più griglie precise al pixel: un modello di immagini non le sa fare, ed è per questo che il primo giro è finito in rettangoli. Ora Argon consegna **illustrazioni libere su fondo piatto**, e il taglio, l'allineamento e la griglia li fa Claude sui derivati.

## 1. Testo da incollare per primo, in ogni chat

```
You are producing game art for CHRONOS Adventure, a top-down pixel-art action game for Android.

METHOD, mandatory:
- Every image must be created with your IMAGE GENERATION model (the same way you produced the painted shop
  interiors and the character portraits). 
- It is FORBIDDEN to draw images with code: no Python, PIL, canvas, SVG, matplotlib or any script that draws
  rectangles, circles, polygons or flat fills. An image made of geometric primitives will be rejected.
- Do not copy, scale, squash or recolour frames from the reference files. Every pose must be newly drawn.
- If the image model cannot produce something, do NOT replace it with a placeholder: skip it and write why in
  CONSEGNA.md. A missing image is fine; a fake one is not.

STYLE, the same for every image:
- Detailed 16-bit-era pixel art, rich shading with 3 to 5 tones per material, 1-pixel dark outline, crisp pixels,
  no blur, no anti-aliased halo. Same level of detail as the attached reference sprites.
- Colourful and luminous: saturated accents and visible light sources against darker surroundings.
- No text, letters, numbers, logos or watermarks anywhere. No real brands. Original designs only.
- Enemies and hazards must be recognisable by SHAPE alone in a black silhouette, not by colour.
- Never draw the heroes Nox and Lulu.

LAYOUT is free: I do not need exact pixel grids. Follow the canvas size and the background colour given in each
request, keep every figure fully inside the canvas with empty space around it, and keep figures from touching
each other. The game team will cut and align the figures.

SELF-CHECK before delivering each image. Reject and regenerate if any answer is yes:
1. Is any figure built from plain rectangles, circles or flat single-colour areas?
2. Is the PNG smaller than 150 KB? (real pixel art at these sizes is larger)
3. Is the second variant identical or nearly identical to the first?
4. Is there any text or number in the image?
5. Does a character change costume, proportions or palette between poses?
```

## 2. Come pubblica Argon

```
Publish to the GitHub repository Flexati/Adventure-city.
1. Use ONLY the new branch delivery/argon-asset-giro2-20261110, started from work/chronos-adventure-commercial.
   Never commit to main, to work/chronos-adventure-commercial or to any existing delivery branch.
2. Add ONLY image files under deliveries/argon-asset-giro2-20261110/<group>/, with the exact file names given.
   Second variant: suffix _v2.
3. Add deliveries/argon-asset-giro2-20261110/<group>/CONSEGNA.md with, for every file: the prompt used, the name of
   the image model that generated it, and anything that does not respect the request. List skipped images too.
4. Change no other file. No code, no documents, no game files, no integration: the game team integrates.
5. Never write a token, password or key anywhere.
6. One commit per group: "Consegna Argon giro 2: gruppo <group>, <n> immagini".
```

## 3. Ordine di lavoro

| Ordine | Gruppo | Cosa | Immagini |
|---|---|---|---|
| 1 | P | Prova: 3 immagini per controllare il metodo prima di fare tutto | 3 |
| 2 | S | Strade delle gare e auto del giocatore | 5 |
| 3 | N | Nemici per i ruoli senza sagoma propria | 16 |
| 4 | T | Terreno e ambiente | 12 |
| 5 | B | Boss a 288 px | 12 |
| | | **Totale** | **48** (96 con le seconde varianti) |

Sono meno delle 89 del primo giro perché ogni immagine ora contiene più figure e il taglio lo fa Claude.

**Fermati dopo il gruppo P e aspetta il via.** Se le 3 prove sono disegni veri, si prosegue; se no, si corregge il metodo prima di sprecare il resto.

## Gruppo P: prova del metodo (3 immagini)

Allega `game/art/chrono/iron_penitent.png` come riferimento del livello di dettaglio.

**`prova_nemico.png`** · 1536 × 1024, fondo piatto magenta `#FF00FF`
```
Six poses of ONE character in a single row, evenly spaced, each about 300 pixels tall, facing right, feet on the
same line: a very large gang enforcer in a welder's mask and a heavy leather apron, carrying a sledgehammer whose
head is an electric relay coil with copper windings. Poses left to right: standing guard; walking; lifting the
hammer over the head; overhead smash at full extension; staggering back hurt; collapsed on the ground.
```

**`prova_strada.png`** · 1024 × 2048 (verticale), opaca
```
Strict top-down view of a desert race track running from the bottom edge to the top edge. The central 64 percent of
the width is worn dark asphalt with five lanes separated by four dashed lines, completely empty: no vehicles, no
objects. On both sides: low guard rails, then sand dunes, windbreak nets, marker poles with orange lamps, half-
buried pipes. Warm late-afternoon light, long shadows. The top edge must continue seamlessly into the bottom edge.
```

**`prova_terreno.png`** · 1024 × 1024, opaca
```
Strict top-down seamless ground texture, tiles in all four directions: wet dark cobblestones of an old harbour
district at night, with a few puddles reflecting teal and amber light, scattered rope fibres and rust stains.
Even, calm and dark overall (it is the floor under the characters), no objects, no walls, no shadows of buildings.
```

## Gruppo S: gare (5 immagini)

Stesso formato di `prova_strada.png`: 1024 × 2048, vista dall'alto, 64% centrale libero con cinque corsie, bordo alto che continua in quello basso.

| File | Cosa mostra |
|---|---|
| `strada_solkara_giorno.png` | la pista nel deserto della prova, con una fila di autocarri fermi sotto teloni su un lato e una stazione di pompaggio semisepolta sull'altro |
| `strada_solkara_tempesta.png` | lo stesso luogo sotto una tempesta di sabbia: luce ocra, strisce di sabbia in diagonale ai lati, veli leggeri sull'asfalto che lasciano leggere le corsie |
| `strada_aurelia_giorno.png` | l'impalcato di un grande ponte sospeso in pietra chiara e ottone; ai lati parapetti d'ottone con lanterne, cavi tesi, torri con ingranaggi a vista e quadranti **senza numeri**; molto più in basso acqua turchese |
| `strada_aurelia_tramonto.png` | lo stesso ponte al tramonto: luce arancio e viola, lanterne accese, acqua scura con riflessi |

**`auto_vortex.png`** · 1536 × 1024, fondo piatto magenta `#FF00FF`. Allega `game/art/v10/race_veyra_car.png` come riferimento di dettaglio (non di forma).
```
Eight views of ONE car, in two rows of four, each car about 260 pixels long, well separated.
The car is the Vortex: a low, wide sports coupe in dark graphite with glowing cyan light lines and one offset white
stripe, no rear wing, a different shape from the attached orange car.
Row 1, seen from directly above with the nose pointing up: intact; lightly damaged (scratches, cracked rear glass);
heavily damaged (dented bonnet, one light out); wrecked with dark smoke.
Row 2: three-quarter beauty view; from above with blue nitro flames at the rear; from above with headlights on;
from above with headlights on and brighter. No driver visible.
```

## Gruppo N: nemici (16 immagini)

Per ogni personaggio **due immagini**, 1536 × 1024, fondo magenta `#FF00FF`, sei pose in una riga, figure alte circa 300 px, rivolte a destra, piedi sulla stessa linea.

- `<id>_a.png`: fermo in guardia · passo 1 · passo 2 · carica dell'attacco (deve avvisare: il corpo arretra o l'arma si alza) · colpo · ritorno in guardia
- `<id>_b.png`: fermo che respira · colpito 1 · colpito 2 · in ginocchio · a terra · a terra immobile

Allega il foglio di famiglia come riferimento d'identità: `game/art/v05/gang_states.png`, `alien_states.png` o `infected_states.png`.

| id | Personaggio |
|---|---|
| `gang_shooter` | membro della gang in giacca rosso scuro col cappuccio, fucile a pompa corto; magro, di profilo |
| `gang_breaker` | uomo largo con uno scudo fatto con lo sportello di un armadio elettrico e un piede di porco; corre basso dietro lo scudo |
| `gang_signal` | segnalatore con radio a zaino e antenna alta piegata, un razzo luminoso in mano; senza armatura |
| `gang_brute` | il colosso della prova (`prova_nemico.png`): se la prova è stata approvata, completa solo `gang_brute_b.png` |
| `alien_breaker` | predatore della breccia basso e corazzato, come uno scarabeo cornuto a quattro zampe; guscio viola con giunture ciano; mai umano |
| `alien_brute` | predatore alto e curvo con due avambracci enormi a forma d'ancora, testa piccola, nucleo ciano nel petto |
| `infected_brute` | infermiere infetto e gonfio in camice strappato, un braccio trasformato in una clava di spore con bagliore verde lime; lento |
| `port_patrol` | guardia di manutenzione in cappotto impermeabile grigio-verde col cappuccio, lunga asta con lampada d'ispezione puntata in avanti |

## Gruppo T: terreno e ambiente (12 immagini)

**Terreno**, stesso formato di `prova_terreno.png` (1024 × 1024, opaco, continuo nelle quattro direzioni, scuro e calmo, senza oggetti):

| File | Superficie |
|---|---|
| `terreno_cantiere.png` | cemento di cantiere incrinato con polvere, segni di gesso e bulloni; luce arancio debole |
| `terreno_porto.png` | la prova approvata (non rifarla) |
| `terreno_clinica.png` | piastrelle d'ospedale sporche, alcune rotte, con muffa verde chiaro nelle fughe |
| `terreno_nodo.png` | lastre di pietra antica con sottili incisioni circolari e venature viola luminose |

**Edifici e oggetti**: 1536 × 1024, fondo magenta `#FF00FF`, **vista dall'alto inclinata a tre quarti** come in un gioco di ruolo classico (si vedono tetto e facciata sud), oggetti ben separati.

| File | Contenuto |
|---|---|
| `palazzi_moon.png` | 4 edifici di un rifugio sotterraneo moderno: locanda con lampade, officina con serranda, banco coperto, casa con pannelli riparati; toni verde acqua |
| `palazzi_cathedral.png` | 4 edifici di un quartiere gotico in pietra chiara: forgia con campane, sacrestia, mercato coperto con tende, casa a schiera; luce calda |
| `palazzi_toxic.png` | 4 edifici di una baraccopoli industriale: officina di tubi, laboratorio con serra, bazar di lamiere, casa su palafitte; bagliori verdi |
| `palazzi_clockwork.png` | 4 edifici d'ottone e pietra viola: fonderia con ingranaggi, magazzino, torre delle molle, casa con tetto a cupola |
| `oggetti_cantiere.png` | 10 oggetti: transenne, bobine di cavo, generatore, faro da cantiere, sacchi, betoniera, pallet, cassetta attrezzi, cono, bidone |
| `oggetti_porto.png` | 10 oggetti: bitte, cime arrotolate, casse, reti, lampione, argano, barile, carrello, ancora, boa |
| `oggetti_clinica.png` | 10 oggetti: barella, flebo, armadietto, sedia a rotelle, carrello medico, paravento, bombola, pianta morente, panca, cestino |
| `oggetti_nodo.png` | 10 oggetti: pilastro spezzato, cristallo viola, quadrante di pietra senza numeri, braciere, statua consumata, cavo luminoso, obelisco, catene, lastra incisa, lanterna |

## Gruppo B: boss a 288 px (12 immagini)

Tre boss, quattro immagini ciascuno, 1536 × 1024, fondo verde `#00FF00`, figure alte circa 420 px, rivolte a destra. Il brief di ciascuno è in `requests/gpt-boss-v2-20261102/brief/boss.<boss>.sheet.v2.json` (leggilo prima: descrive forma, materiali e ciò che non va cambiato). Allega il foglio di oggi come riferimento d'identità.

- `<boss>_a.png`: 4 pose: fermo, fermo che respira, passo 1, passo 2
- `<boss>_b.png`: 4 pose: carica dell'attacco 1, carica 2, colpo, ritorno
- `<boss>_c.png`: 4 pose: attacco speciale 1, 2, 3, cambio di fase (più aggressivo)
- `<boss>_d.png`: 4 pose: colpito, in ginocchio, caduta, a terra

| boss | Riferimento da allegare | In breve |
|---|---|---|
| `bone_tyrant` | `game/art/chrono/cathedral_bone_tyrant.png` | re scheletrico in armatura da cattedrale con una grande mazza d'ossa |
| `forge_behemoth` | `game/art/chrono/toxic_forge_behemoth.png` | colosso da fonderia con un braccio a sega e serbatoi verdi sulla schiena |
| `shadow_reaper` | `game/art/chrono/shadow_reaper.png` | mietitore d'ombra incappucciato con una falce lunga e mantello che si dissolve |

Vega, il quarto boss, resta per un giro successivo.

## Cosa fa Claude a ogni consegna

1. Guarda ogni immagine: disegno vero o no, scritte, coerenza del personaggio, sagoma a 32 px.
2. Taglia le figure, le allinea ai piedi e le monta nella griglia del gioco; rende continue le strade e i terreni.
3. Registra i derivati con l'SHA-256 dell'originale e li collega al gioco con un test per gruppo.
4. Scrive in `docs/gold/STATO.md` cosa è entrato e cosa no, con il motivo.
