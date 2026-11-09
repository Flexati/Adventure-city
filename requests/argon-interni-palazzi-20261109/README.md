# Richiesta ad Argon (AI Studio): interni in prima persona e facciate dei palazzi

9 novembre 2026 · decisioni D40, D44, D46 · `COMMERCIAL_RELEASE = BLOCKED`

**Un prompt pronto non è un'immagine.** Finché i file non arrivano e non superano i controlli, gli interni restano come oggi: villaggio sfocato con l'NPC ingrandito (`game/interiors.mjs`, `INTERIOR_ART.backgrounds` vuoto).

## Cosa manca, verificato su GitHub

- **[FATTO]** Nessun ramo del repo contiene immagini degli interni in prima persona. In tutti i rami `delivery/*`, `art/*` e `work/*` c'è solo il foglio di piastrelle `game/art/chrono/interiors.png` (512×512) e la tavola `tavola_pixel_art_degli_interni_avventura.webp`. Non sono scene in prima persona.
- **[FATTO]** Le facciate dei palazzi dei 4 villaggi sono disegnate dal codice (`game/village-art.mjs`, `bakeVillage`). Nessun foglio sprite le contiene.

## Regole che valgono per ogni immagine (CLAUDE.md, regola 9)

- Nessun testo leggibile: niente lettere, numeri, insegne con scritte o loghi. Le insegne usano solo simboli.
- Nessuna copia di opere protette, di giochi esistenti o dei loro personaggi.
- Nessuna persona negli interni: l'NPC viene sovrapposto dal gioco. Nox e Lulù non compaiono mai.
- Pixel art pulita, senza sfocature fotografiche né filigrane.

## Come lavorare con Argon

1. Una chat per ogni villaggio. Incolla prima il **blocco di stile comune**, poi un prompt alla volta.
2. Due varianti per prompt; scegli quella che rispetta meglio la composizione.
3. Consegna sul ramo `delivery/argon-interni-palazzi-20261109`, nella cartella `deliveries/argon-interni-palazzi-20261109/`, con i nomi scritti sopra ogni prompt. Gli originali poi non si toccano più: Claude lavora su derivati registrati.

## Conto delle immagini

| Gruppo | Immagini | Varianti | Totale da generare |
|---|---|---|---|
| Interni in prima persona | 15 | 2 | 30 |
| Fogli delle facciate | 4 | 2 | 8 |
| **Totale** | **19** | | **38** |

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
