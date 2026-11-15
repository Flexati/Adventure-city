# Richiesta ad Argon, parte 3: le gare di Veyra

9 novembre 2026 · decisione D49 · `COMMERCIAL_RELEASE = BLOCKED`

Leggi prima `INDICE.md`. Il **blocco di stile comune** è in `README.md`: incollalo per primo in ogni chat.

## Cosa è stato verificato (nel codice e in simulazione)

- **[FATTO]** Le gare funzionano. `tools/audit_races.mjs` guida tutte le 26 gare (7 circuiti, più Contro il tempo, Eliminazione e Rivincita) con tre livelli di abilità: 78 corse, tutte arrivano al traguardo o finiscono con un'eliminazione prevista dalle regole. Nessun checkpoint mancato, nessun tracciato scorretto (ostacolo dentro un checkpoint, rampa nitro che porta contro un ostacolo, ostacolo a ridosso di un cancello). Un pilota medio arriva a meno di 6 s dal primo.
- **[FATTO]** Quattro circuiti su sette non hanno la loro strada. Solkara (2 gare nel deserto) e Aurelia Span (2 gare sui ponti) usano `game/art/v05/driving_road.png`, cioè il viale al neon della città: `raceRoadArt()` in `game/racing-v9.mjs:52` restituisce un elenco vuoto per loro. Solo Ash Docks ha 6 lastre proprie.
- **[FATTO]** L'auto del giocatore (la Vortex) è ancora lo sprite vecchio di `driving_cars.png` (`game/runtime.mjs:385`), mentre Veyra e i due rivali hanno un foglio nuovo: in gara il protagonista è l'auto meno curata.
- **[FATTO]** I cancelli a tempo di Aurelia Span sono un rettangolo colorato con una scritta (`game/runtime.mjs:356`).
- **[FATTO]** La trave mobile e i paletti delle barriere esistono solo in versione porto (`RACE_CRANE` in `game/visuals.mjs:45`): sui ponti e nel deserto compare la gru gialla del porto.

## K. Contratto delle strade (12 lastre)

Allega sempre `game/art/v10/race_ashdocks_gru_day.png` come **riferimento di formato** (non di ambiente).

```
Deliver ONE road tile: PNG, exactly 720 x 1440 pixels, opaque, strict top-down view (camera straight above), the road
runs vertically from the bottom edge to the top edge.
Layout, mandatory to the pixel:
- x 0-110: left roadside scenery. x 110-130: left kerb or guard rail. x 130-590: the driving surface, flat and
  uncluttered, with FIVE lanes whose centres are at x = 176, 268, 360, 452, 544 (four dashed lane lines between them).
  x 590-610: right kerb. x 610-720: right roadside scenery.
- Nothing may stand on the driving surface: no vehicles, no crates, no cones, no arrows, no start line.
- The tile repeats vertically: the top row of pixels must continue seamlessly into the bottom row.
- The outermost 64 pixel columns on each side are stretched by the game to fill wide screens: keep them plain
  (ground, water or sky far below), without objects cut in half.
- The driving surface must stay darker and calmer than the obstacles drawn on it by the game (rust, cobalt, green
  containers, cyan nitro pads). No text, no numbers, no logos, no road signs with letters.
Pixel art, crisp pixels, same level of detail as the attached reference.
```

### Solkara, di giorno (gara «Fra i convogli»): pista nel deserto, luce calda

| File | Cosa mostra ai lati |
|---|---|
| `race_solkara_pista_day.png` | asfalto consumato e chiazzato di sabbia; ai lati dune basse, paletti di segnalazione e reti frangivento |
| `race_solkara_convogli_day.png` | stessa pista; ai lati una fila di autocarri pesanti e rimorchi fermi sotto teloni, fusti e pneumatici |
| `race_solkara_duna_day.png` | stessa pista; ai lati una stazione di pompaggio semisepolta e tubi che entrano nella sabbia; lingue di sabbia sottili che toccano solo il cordolo |

### Solkara, tempesta (gara «Il fronte di sabbia»): stessi tre luoghi sotto la tempesta

Stesse tre scene, con cielo assente (vista dall'alto), luce ocra spenta, strisce di sabbia portate dal vento **in diagonale sui lati** e veli leggeri sulla pista che non nascondono le linee di corsia.

`race_solkara_pista_storm.png` · `race_solkara_convogli_storm.png` · `race_solkara_duna_storm.png`

### Aurelia Span, di giorno (gara «Ponti del tempo»): ponte sospeso sopra l'acqua, pietra chiara e ottone

| File | Cosa mostra ai lati |
|---|---|
| `race_aurelia_campata_day.png` | impalcato del ponte in lastre chiare; ai lati parapetto d'ottone, cavi tesi e, molto più in basso, acqua profonda |
| `race_aurelia_torre_day.png` | la base di una torre del ponte su ogni lato, con ingranaggi a vista e un grande quadrante **senza numeri**; ombra della torre sui lati |
| `race_aurelia_giunto_day.png` | un giunto d'espansione metallico che attraversa la pista (piatto, non un ostacolo) e, ai lati, argani e contrappesi |

### Aurelia Span, al tramonto (gara finale «La linea di Ash»)

Stesse tre scene con luce bassa arancio-viola, lampioni accesi sul parapetto, acqua scura. La pista resta leggibile.

`race_aurelia_campata_dusk.png` · `race_aurelia_torre_dusk.png` · `race_aurelia_giunto_dusk.png`

## L. L'auto del giocatore: la Vortex (1 foglio)

Allega `game/art/v10/race_veyra_car.png` come **riferimento di griglia e di scala** e `game/art/v05/driving_cars.png` come riferimento d'identità: la Vortex è l'auto in alto a sinistra di quel foglio.

**`race_vortex_car.png`**
```
Deliver ONE sprite sheet: PNG, exactly 1536 x 512 pixels, transparent background, a strict grid of 4 columns x 2 rows,
each cell 384 x 256 pixels. One car per cell, centred in the cell, about 196 pixels long.
The car is the Vortex: a low, wide sports coupe in dark graphite with cyan light lines and a single offset stripe.
It must NOT look like the attached orange rival car: different roof line, different rear lights, no rear wing.
Row 1, top-down view, nose pointing UP: cell 1 intact; cell 2 lightly damaged (scratches, cracked rear glass);
cell 3 heavily damaged (dented bonnet, one light out); cell 4 wrecked, with dark smoke.
Row 2: cell 1 three-quarter beauty view facing left (used in the garage); cell 2 top-down with nitro flames at the
rear; cells 3 and 4 top-down with headlights on, two frames of the same light flicker for night races.
No driver visible, no text, no numbers, no logos. Crisp pixels, 1-pixel dark outline, no glow outside the outline
except the flames and the lights.
```

## M. Cancelli a tempo dei ponti (2 immagini)

```
Deliver ONE image: PNG, exactly 460 x 96 pixels, transparent background, strict top-down view.
A time gate that spans the whole bridge deck from left to right, brass and pale stone like a clockwork drawbridge lock.
```

| File | Stato |
|---|---|
| `race_gate_ponte_closed.png` | **chiuso**: due sbarre piene che si incontrano al centro, con denti d'ingranaggio serrati. Si capisce che è chiuso dalla **forma** (linea continua), non dal colore |
| `race_gate_ponte_open.png` | **aperto**: le due sbarre ritirate dentro i pilastri laterali, centro del tutto libero per almeno 380 pixel |

## N. Ostacoli mobili fuori dal porto (4 immagini)

Allega il corrispondente del porto come riferimento di formato: `race_crane_beam_porto_day.png`, `race_crane_trolley_porto.png`, `race_barrier_post_porto.png`.

| File | Formato | Cosa mostra |
|---|---|---|
| `race_crane_beam_ponte.png` | 720 × 120, trasparente, dall'alto | una trave orizzontale d'ottone a traliccio che attraversa tutto il ponte, con una cremagliera dentata lungo il bordo |
| `race_crane_trolley_ponte.png` | 64 × 112, trasparente, dall'alto | il carrello che scorre sulla trave: scatola d'ottone con due ruote dentate e una catena che scende |
| `race_barrier_post_ponte.png` | 48 × 96, trasparente, dall'alto | paletto d'ottone con lanterna accesa in cima: segna il varco di una barriera |
| `race_barrier_post_sabbia.png` | 48 × 96, trasparente, dall'alto | paletto da cantiere arrugginito con una bandierina di stoffa piegata dal vento |

## Proposte sul gioco, in attesa del tuo sì (non servono immagini)

La simulazione mostra tre punti che un giocatore noterebbe. Toccano regole e premi, quindi non li cambio senza una decisione.

1. **Il bronzo non esce quasi mai.** Nel Contro il tempo anche il pilota debole prende l'argento in 6 circuiti su 7; il bronzo serve solo a chi sbatte più volte.
2. **Eliminazione punisce chi è lento.** Il pilota debole viene eliminato in 4 circuiti su 6, quello medio in 1. È nello spirito della modalità, ma il gioco non lo avvisa prima.
3. **Due Rivincite sono molto più dure delle altre.** In «Luci spente» e «Il fronte di sabbia» il pilota debole prende 3–4 urti e un recupero, e arriva a oltre 11 s dal primo; nelle altre resta entro 7 s.
