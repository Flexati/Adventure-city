# Richiesta ad Argon (AI Studio): interni in prima persona, facciate, case, terreno e decorazioni

9 novembre 2026 · decisioni D40, D44, D46, D48 · `COMMERCIAL_RELEASE = BLOCKED`

Leggi prima `INDICE.md`: è l'elenco completo, con priorità e istruzioni di pubblicazione.

**Un prompt pronto non è un'immagine.** Finché i file non arrivano e non superano i controlli, gli interni restano come oggi: villaggio sfocato con l'NPC ingrandito (`game/interiors.mjs`, `INTERIOR_ART.backgrounds` vuoto).

## Cosa manca, verificato su GitHub

- **[FATTO]** Nessun ramo del repo contiene immagini degli interni in prima persona. In tutti i rami `delivery/*`, `art/*` e `work/*` c'è solo il foglio di piastrelle `game/art/chrono/interiors.png` (512×512) e la tavola `tavola_pixel_art_degli_interni_avventura.webp`. Non sono scene in prima persona.
- **[FATTO]** Le facciate dei palazzi dei 4 villaggi sono disegnate dal codice (`game/village-art.mjs`, `bakeVillage`). Nessun foglio sprite le contiene.
- **[FATTO]** Anche le case dei villaggi (celle `H` delle mappe in `game/villages.mjs`) sono disegnate dal codice.
- **[FATTO]** Il terreno delle missioni usa 12 celle di `game/art/chrono/environment.png` (512×512) e le 4 mappe `city`, `port`, `clinic`, `fracture` (864×864). Le decorazioni sono le 16 celle di `game/art/v05/district_props.png`. In R5 una cella chiara e una casetta ripetuta 30 volte facevano la scacchiera nel Blackout: servono fogli più ricchi, con varianti.

## Regole che valgono per ogni immagine (CLAUDE.md, regola 9)

- Nessun testo leggibile: niente lettere, numeri, insegne con scritte o loghi. Le insegne usano solo simboli.
- Nessuna copia di opere protette, di giochi esistenti o dei loro personaggi.
- Nessuna persona negli interni: l'NPC viene sovrapposto dal gioco. Nox e Lulù non compaiono mai.
- Pixel art pulita, senza sfocature fotografiche né filigrane.

## Come lavorare con Argon

1. Una chat per ogni villaggio. Incolla prima il **blocco di stile comune**, poi un prompt alla volta.
2. Due varianti per prompt; scegli quella che rispetta meglio la composizione.
3. Consegna come scritto in `INDICE.md`: ramo `delivery/argon-asset-20261109`, cartella `deliveries/argon-asset-20261109/<lettera del gruppo>/`, con i nomi scritti sopra ogni prompt. Gli originali poi non si toccano più: Claude lavora su derivati registrati.

## Conto delle immagini

| Gruppo | Immagini | Varianti | Totale da generare |
|---|---|---|---|
| Interni in prima persona | 15 | 2 | 30 |
| Fogli delle facciate | 4 | 2 | 8 |
| Terreno (4 distretti di missione + 4 villaggi) | 8 | 2 | 16 |
| Case dei villaggi | 4 | 2 | 8 |
| Decorazioni dei distretti di missione | 4 | 2 | 8 |
| **Totale** | **35** | | **70** |

## Cosa fa Claude quando arrivano

- **Interni.** Converte ciascuno in WebP 1920×1080 (al massimo 300 KB) e lo registra in `assets/production/v10.3/derived/REGISTRO.json`. Poi lo collega in `INTERIOR_ART.backgrounds` con la chiave `<villaggio>_<servizio>` e lo controlla a 390×844 e a 844×390.
- **Facciate.** Taglia le celle, controlla trasparenza, griglia e colori, poi sostituisce il disegno a codice in `bakeVillage`. Collisioni, porte e posizioni restano quelle di oggi.

---

## Blocco di stile comune (incollalo per primo in ogni chat)

```
You are the environment artist of "CHRONOS Adventure", an original top-down action game for Android phones.
Setting: a near-future city whose power grid belongs to a controlling system called Elyon. After a blackout,
people rebuild small independent quarters with salvaged parts. The mood is hopeful, warm light inside, cold
neon outside. Style: high-resolution pixel art with crisp, visible pixels (no blur, no painterly smears),
limited palette, strong silhouettes, soft rim light. Absolutely no readable text, letters, numbers or logos
anywhere: signs use simple symbols only. No people, no characters, no animals. Original design only: do not
imitate any existing game, film or artist.
```

---

## A. Interni in prima persona (15 immagini)

**Composizione uguale per tutti** (il gioco mette l'NPC a sinistra e il pannello dei testi a destra; sul telefono in verticale mostra la fascia centrale):

```
Format: 1920x1080, 16:9. First-person view from the doorway, eye height about 1.6 m, looking into the room.
Keep the floor space between 15% and 45% of the width clear and well lit: a shopkeeper will be composited
standing there, behind or beside the counter. The most recognisable element of the room sits in the centre
band (40%-60% of the width) so the room still reads when cropped to a tall phone screen. The right 35% stays
calmer and darker (a text panel covers it). No people. No readable text.
```

### Moon Refuge (tinta `#83cbb2`, verde acqua; rifugio sotterraneo caldo)

**`moon_inn.png` — Locanda della Luna**
```
Interior of a small underground inn that used to be an electric charging station. Old charging sockets still
show under layers of teal paint on the walls. Mismatched tables, two mugs on the counter, many hand-made lamps
glowing amber against the dark: the room keeps the darkness outside. Teal and amber palette.
```

**`moon_smith.png` — Officina di Dario**
```
Cramped mechanic's workshop. A heavy workbench still hot, faint orange glow on the metal, a big hand-forged
wrench made from a salvaged power relay hanging in the centre, cables coiled on hooks, tool silhouettes on a
pegboard (no labels). Teal walls, orange heat light.
```

**`moon_shop.png` — Banco del rifugio**
```
A shop counter built from the brushed-steel doors of an old elevator laid sideways. Shelves of dry goods,
sealed jars, batteries, folded blankets, all neatly arranged. Warm lamp over the counter, teal shadows.
```

### Cathedral Quarter (tinta `#d6bd91`, pietra chiara e bronzo; quartiere gotico riadattato)

**`cathedral_smith.png` — Forgia del Chiostro**
```
A forge set inside a stone cloister arcade. The stone keeps the heat; an anvil, a glowing hearth in the centre,
cracked bronze bells hanging from a beam as raw material, faint vibration lines suggesting they hum by themselves.
Sand-coloured stone, bronze and fire.
```

**`cathedral_relic.png` — Sacrestia delle reliquie**
```
A quiet sacristy full of antique clocks of every size on shelves and walls, all with stopped or broken hands.
In the centre, under a stone altar, a broken clock face is carved into the floor stone, older than the building.
Candle light, pale stone, gold highlights. The atmosphere asks you to speak softly.
```

**`cathedral_shop.png` — Mercato coperto**
```
A covered market stall under gothic stone vaults: a brand-new wooden counter, crates from the harbour with
rope and rust marks, hanging lanterns, fabric awnings. Busy but empty of people. Sand stone, bronze lanterns.
```

**`cathedral_info.png` — Stanza delle voci**
```
A former confessional turned into a meeting room: carved wooden lattice screens, a small table with two chairs,
one candle, papers with illegible scribbles only. Intimate, shadowy, warm candle light on dark wood and stone.
```

### Toxic Slum Bazaar (tinta `#b7c56b`, verde acido e ruggine; bazar sull'acqua)

**`toxic_smith.png` — Officina dei tubi**
```
A welding workshop made of hand-mounted pipes running in every direction, each pipe tagged with a small
coloured symbol plate (no letters). One pipe drips into a bucket in the centre. Sparks from a welding station,
puddles reflecting acid-green light, rust and patched metal.
```

**`toxic_alchemist.png` — Laboratorio dell'alchimista**
```
A cramped alchemy lab: rows of glass vials, the green ones glowing and clearly dangerous, the others amber and
violet. Recipe sheets pinned to the wall are the backs of old bureaucratic forms covered in illegible
handwriting. Copper stills bubbling in the centre. Green glow, warm amber lamp.
```

**`toxic_shop.png` — Bazar dei filtri**
```
A bazaar stall selling breathing filters, rubber gaskets and small corked bottles. In the centre an old radio
with its casing open is repairing smaller radios connected to it by wires. Tarp roof, hanging filters like
lanterns, acid-green and rust palette.
```

**`toxic_info.png` — Retro del bazar**
```
The back room of the bazaar: a narrow space above a water channel, a plank floor, a hand-drawn map of safe dry
bridges pinned on a crate (only lines and symbols, no text), a hanging lamp swaying. Dark water reflections,
green and rust light. Feels secret.
```

### Clockwork Outpost (tinta `#bba1ed`, viola tenue e ottone; avamposto meccanico sotto l'Asse)

**`clockwork_smith.png` — Fonderia degli ingranaggi**
```
A gear foundry: huge brass gears turning on the walls, a crucible pouring molten metal, moulds on the floor.
In the centre, on a stand, one impossible gear with teeth on both sides, kept as a souvenir. Brass, violet
shadows, orange molten light.
```

**`clockwork_shop.png` — Magazzino dell'Asse**
```
A storage room of spare parts: drawers of springs, coils and cogs, a row of clocks that show no hours (blank
faces), an inactive small automaton slumped on a shelf with its chest open showing a coiled spring. Brass and
violet palette, cool lamp light.
```

**`clockwork_relic.png` — Camera delle fondamenta**
```
An underground chamber of foundation stones much older than the city. In the centre the same broken clock face
carved into stone as in the cathedral (a circle with a cracked dial and stopped hands). Faint violet light
seeping from the cracks, brass support beams added later.
```

**`clockwork_info.png` — Torre delle molle**
```
A tall narrow tower room seen from inside: a very low wooden beam crosses the view at head height in the
foreground, giant springs coiled along the walls, a small desk with a lamp, tiny repair automatons working on
each other on a shelf. Violet and brass, warm desk lamp.
```

---

## B. Fogli delle facciate dei palazzi (4 immagini, una per villaggio)

**Contratto uguale per tutti:**

```
Format: 1024x1024 PNG with a fully transparent background, a strict grid of 8x8 cells of 128x128 pixels each,
1 pixel = 1 game pixel, no anti-aliased halo against the transparency. Camera: top-down with a slight 3/4 tilt
toward the south, the same angle as a classic top-down RPG town, light from the top-left.
Row 1: 4 tileable roof fill tiles (seamless on all sides), then 4 roof variants with a chimney, vent, skylight
and antenna.
Row 2: roof edges: north, south, east, west, then the 4 outer corners.
Row 3: south facade wall tiles (seen from the front, 128 px tall): 2 plain, 3 with a lit window, 3 with pipes
or pillars.
Row 4: 8 door tiles, each with a symbol-only sign: forge hammer, shop bag, bed or cup (inn), relic star,
eye (information), flask (alchemist), plain house door, closed door.
Rows 5-6: 2 landmarks of 2x2 cells (256x256) for the central square, then 4 square props of 1x1 cell.
Rows 7-8: 16 small street props of 1x1 cell (crates, lamps, barrels, benches, planters, posts), each centred,
with a soft contact shadow.
No text anywhere. Every module must tile cleanly with its neighbours.
```

**`facciate_moon.png` — Moon Refuge**
```
Underground refuge quarter: teal-painted metal roofs with rivets, amber window light, salvaged
cables and lamps. Landmarks: a moon well (round stone well with a glowing teal core) and a hanging-lamp
pavilion. Palette teal #83cbb2, amber, dark slate.
```

**`facciate_cathedral.png` — Cathedral Quarter**
```
Gothic stone quarter reused by people: pale sand stone roofs, slate and bronze trims, pointed windows with warm
light. Landmarks: an eight-spoked rose window set in the square floor and a bell frame with one cracked bronze
bell. Palette sand #d6bd91, bronze, deep blue shadows.
```

**`facciate_toxic.png` — Toxic Slum Bazaar**
```
Bazaar on the water: patched corrugated roofs, tarps, hand-mounted pipes along the facades, rust and acid-green
puddles. Landmarks: a bio-chemical settling tank and a pump tower. Palette acid green #b7c56b, rust, dark teal
water.
```

**`facciate_clockwork.png` — Clockwork Outpost**
```
Mechanical outpost under a giant orbital axis: brass and violet roofs with exposed gears, round windows,
springs and pistons on the facades. Landmarks: an astrolabe with turning rings and a mother gear set into the
square. Palette violet #bba1ed, brass, cool grey.
```

---

## C. Terreno (8 fogli: 4 distretti di missione e 4 villaggi)

**Contratto uguale per tutti:**

```
Format: 1024x1024 PNG, opaque, a strict grid of 8x8 cells of 128x128 pixels (one cell = one 64-unit game tile at 2x).
Camera: straight top-down, light from the top-left. Every ground tile must be seamless with every other ground tile
of the same sheet: no light patches, no frames, no checkerboard effect when repeated.
Row 1: 8 walkable ground variants with low contrast between them (the base and 7 subtle variations).
Row 2: 8 walkable details on the same ground (manhole, grate, crack, puddle, painted lane mark, stain, debris, drain).
Row 3: 8 edge tiles where the walkable ground meets a raised block: north, south, east, west and the 4 inner corners.
Row 4: 8 tops of raised blocks or roofs seen from above (tileable), the area where the player cannot walk.
Row 5: 4 outer corners of raised blocks, then 4 thresholds or entrances.
Row 6: 8 ground tiles for the off-map margin: darker, readable as "outside", seamless with row 4.
Rows 7-8: 16 more ground tiles of the same base, each with one small scattered detail painted on it (oil, chalk
marks without letters, leaves, glass, cables, footprints, scorch marks, rubble), so detail can be spread without
repeating.
The walkable ground must stay darker and calmer than characters (value at most 40% brightness) so enemies and
heroes always read on top of it. No text, no symbols that look like letters.
```

**`terreno_cantiere_est.png` — Cantiere Est (Blackout, Cantiere)**
```
Industrial yard of an eastern construction district at night after a blackout: dark cobbles and concrete slabs,
relay cabinets, cable trenches, orange work-light reflections. Palette dark slate blue, rust, orange accents #ffb65c.
```

**`terreno_porto.png` — Porto delle Antenne (Breccia, Porto, segni di gesso)**
```
Harbour of antennas: wet steel deck plates, rivets, mooring rings, salt stains, cyan reflections of antenna lights.
Palette deep teal, steel grey, cyan accents #58d9ff.
```

**`terreno_clinica.png` — Distretto Clinico (Contagio, Archivio, Linea)**
```
Clinical district: cracked white and green hospital tiles, drainage gutters, biohazard spill stains (no symbols with
letters), sickly green light. Palette dirty white, hospital green, acid lime accents #b8f27c.
```

**`terreno_nodo.png` — Nodo Centrale e Asse (Ora zero, Livelli bassi, Salita, Finale)**
```
The central node of the fracture: dark basalt plates split by thin violet energy cracks, brass inlays, orbital
platform seams. Palette near-black violet, brass, violet accents #d395ff.
```

**`terreno_villaggio_moon.png` — Moon Refuge**
```
Underground refuge streets: worn teal-painted paving, hand-laid stones, lamp light pools. Palette teal #83cbb2, amber.
```

**`terreno_villaggio_cathedral.png` — Cathedral Quarter**
```
Gothic quarter square: pale sand flagstones, a worn central path, moss in the joints. Palette sand #d6bd91, bronze.
```

**`terreno_villaggio_toxic.png` — Toxic Slum Bazaar**
```
Plank walkways over shallow toxic water, patched metal sheets, ropes. Palette acid green #b7c56b, rust, dark water.
```

**`terreno_villaggio_clockwork.png` — Clockwork Outpost**
```
Brass grate floors over turning gears, riveted plates, oil marks. Palette violet #bba1ed, brass, cool grey.
```

---

## D. Case dei villaggi (4 fogli, uno per villaggio)

**Contratto uguale per tutti:**

```
Format: 1024x1024 PNG with a fully transparent background. Camera: top-down with a slight 3/4 tilt toward the south,
same angle and light as the facade sheets (section B). Content: 3 complete residential houses of different sizes,
each drawn as one piece with roof and south facade: a small house of 2x2 tiles (256x256), a medium house of 3x2 tiles
(384x256) and a long house of 4x2 tiles (512x256), plus 2 variants of the small house (different roof and door).
Leave at least 16 transparent pixels between pieces. The door of every house is on the south facade, centred, and
reads as a door at phone size. Lived-in details: laundry, plant pots, patched panels, a lit window. No text.
```

**`case_moon.png`** · rifugio sotterraneo: tetti in lamiera verde acqua, lampade appese, cavi recuperati.

**`case_cathedral.png`** · case in pietra chiara addossate al chiostro, tetti in ardesia, finestre ogivali.

**`case_toxic.png`** · baracche su palafitte, tetti ondulati rattoppati, teli e tubi lungo i muri.

**`case_clockwork.png`** · case in ottone e lamiera viola con oblò, ingranaggi a vista, comignoli a molla.

Ognuna eredita il blocco di stile comune e il contratto qui sopra.

---

## E. Decorazioni dei distretti di missione (4 fogli)

**Contratto uguale per tutti:**

```
Format: 1024x1024 PNG with a fully transparent background, a grid of 8x8 cells of 128x128 pixels.
Camera and light as the terrain (straight top-down, light from the top-left), each object centred in its cell with a
soft contact shadow, no anti-aliased halo.
Rows 1-2: 8 cover objects of 2x2 cells (256x256) that sit on the tactical cover islands of the maps (they block movement
in the game, so they must look solid: crates, machines, barricades, statues, tanks).
Rows 3-4: 16 objects of 1x1 cell placed along walls (lamps, cabinets, pipes, signs with symbols only, vents).
Rows 5-6: 16 small scatter objects of 1x1 cell (debris, bottles, cones, papers without writing, cables, bones only
where the district allows it).
Rows 7-8: 8 light sources (lamps, fires, screens, neon symbols) and their soft glow pool as a separate cell each.
Every object must read as scenery, never as an enemy or a pickup: muted colours, no glowing outlines.
```

**`decorazioni_cantiere_est.png`** · relè, gruppi elettrogeni, transenne, bobine di cavo, fari da cantiere.

**`decorazioni_porto.png`** · casse portuali, bitte, reti, boe, pali delle antenne, gru in miniatura.

**`decorazioni_clinica.png`** · barelle, carrelli, filtri, sacchi sigillati, cartelle senza scritte, lampade verdi.

**`decorazioni_nodo.png`** · cristalli viola spenti, colonne in basalto, anelli d'ottone, frammenti dell'Asse.

---

## Cosa fa Claude quando arrivano C, D ed E

- **Terreno.** Sostituisce le 12 celle di `environment.png` e i ritagli delle mappe in `game/scenery.mjs` e `game/village-art.mjs`. Prima misura il contrasto con eroi e nemici e controlla che la ripetizione non crei motivi visibili (R5).
- **Case.** Prendono il posto delle celle `H` disegnate dal codice. Porte e collisioni restano dove sono.
- **Decorazioni.** Vanno sulle isole di copertura e lungo i muri. Le isole restano quelle di oggi, perché bloccano il movimento nel gioco.
