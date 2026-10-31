# INTERNI_V10_3.md: entrare in negozi e palazzi

**Stato:** PROPOSTA, in attesa di approvazione dell'autore.
**Riferimento:** l'immagine inviata dall'autore il 2026-10-31 serve **solo per l'impaginazione**: illustrazione grande a mezzo busto, targhetta col nome, scelte a destra. Non usiamo né copiamo il personaggio dell'immagine, perché la sua fonte e i suoi diritti non sono noti e lo stile è diverso dal nostro.
**Blocco:** `COMMERCIAL_RELEASE = BLOCKED`.

## 1. Oggi

Negli hub (Moon Refuge, Cathedral Quarter, Toxic Slum Bazaar, Clockwork Outpost):
- locanda, fabbro, negozio, reliquie, alchimista e informatore sono punti della mappa che aprono un **menu di testo** (`hubMenu`);
- le persone dicono **una sola frase** nella banda di dialogo;
- gli NPC esistono solo come sprite pixel 1:1 (`game/art/chrono/*.png`). Non c'è nessuna illustrazione grande né interni.

## 2. Come diventa

1. Nox (o Lulù) cammina fino a una porta: compare un'**insegna** con il nome del locale e l'icona del servizio.
2. Si tocca **Entra**: si sente la porta e la campanella, l'immagine sfuma in 0,4 s (istantaneo con «movimento ridotto»).
3. **Scena d'interno a schermo pieno:**
   - **in orizzontale:** come nel riferimento. L'interno dipinto fa da sfondo, l'NPC a mezzo busto sta a sinistra, la targhetta col nome in basso a sinistra, la banda di dialogo in basso, da 2 a 4 scelte a destra;
   - **in verticale:** l'illustrazione occupa il 55% in alto, sotto il dialogo e le scelte in colonna. Ogni pulsante è alto almeno 48 dp.
4. **Scelte standard di ogni interno:**
   - **Compra** / **Ripara** / **Riposa**: il servizio di oggi, con la stessa economia e gli stessi prezzi;
   - **Chiedi**: due o tre battute che cambiano con l'avanzare della storia (prima e dopo la separazione, dopo il ricongiungimento), così l'hub si «ricorda» di te;
   - **Incarico**: quando l'NPC ha un lavoro della bacheca, lo propone di persona;
   - **Esci**.
5. **Le persone per strada** usano la stessa scena, ma senza sfondo d'interno: l'NPC appare sopra la mappa sfocata.
6. **Espressioni:** ogni NPC ha 3 espressioni (neutra, sorriso, preoccupata). Ogni battuta indica quale usare.
7. **Audio:** campanella e porta (effetti P1 del piano audio), ambiente d'interno, musica `refuge_theme` abbassata.

**Cosa non cambia:** economia, prezzi, incarichi, salvataggi (si aggiunge solo un flag `interiors.seen`), hitbox e tempi di gioco.

**Perché conviene al prodotto:**
- gli hub diventano posti da visitare e non solo menu: più tempo di gioco di qualità, senza riempitivi;
- le schermate sono belle da mettere nella scheda del Play Store;
- gli NPC acquistano un volto e una memoria, e questo aiuta la retention.

## 3. Asset necessari (tavole GPT)

### 3.1 NPC a mezzo busto: 10 tavole, 3 espressioni ciascuna

| ID | Sprite di riferimento (da allegare a GPT) | Ruolo |
|---|---|---|
| npc_innkeeper | `art/chrono/innkeeper.png` | locandiera del Moon Refuge |
| npc_blacksmith | `art/chrono/blacksmith.png` | fabbro, Dario |
| npc_merchant | `art/chrono/merchant.png` | commerciante del porto |
| npc_relic_priestess | `art/chrono/relic_priestess.png` | custode delle reliquie |
| npc_potion_alchemist | `art/chrono/potion_alchemist.png` | alchimista del Bazaar |
| npc_masked_informant | `art/chrono/masked_informant.png` | informatore |
| npc_mechanic | `art/chrono/mechanic.png` | meccanica del Clockwork |
| npc_scavenger_kid | `art/chrono/scavenger_kid.png` | bambina del rifugio |
| npc_traveling_bard | sprite `traveling_bard` | vecchio del rifugio |
| npc_toxic_mutant | sprite `toxic_mutant_zombie` | abitante mutato, che non è un nemico |

**Prompt (uno per NPC, allegando il suo sprite):**

> Painted semi-realistic character illustration for a mobile adventure game, half-body portrait, 3/4 view. Faithful to the attached pixel sprite: same hairstyle, hair colour, clothing, colours and accessories, same age and body type. Cinematic night lighting with warm interior key light and a cyan rim light, soft painterly brushwork, detailed eyes, no text, no logo, no watermark. Three versions side by side on one sheet, same pose and framing, only the facial expression changes: 1) neutral, 2) gentle smile, 3) worried. Each panel 768×1024, transparent or flat #00FF00 background, figure cut at the waist, head in the upper third, nothing cropped at the top.

### 3.2 Interni: 15 sfondi 1920×1080, senza persone

| Hub | Interni |
|---|---|
| Moon Refuge | locanda, fabbro, negozio |
| Cathedral Quarter | fabbro, reliquie, negozio, informatore |
| Toxic Slum Bazaar | fabbro, alchimista, negozio, informatore |
| Clockwork Outpost | fabbro, negozio, reliquie, informatore |

**Prompt (uno per interno):**

> Painted interior background for a mobile adventure game, 16:9, 1920×1080, no characters, no text. [HUB] — [INTERIOR]: [3 dettagli concreti dalla tabella sotto]. Night outside the windows, warm lamp light inside, a cool cyan accent from a screen or a clock, painterly semi-realistic style, depth of field, the left third of the image darker and less detailed (a character will stand there), the bottom quarter calm (a dialogue box will cover it).

| Hub | Dettagli dell'interno |
|---|---|
| Moon Refuge | lampade a batteria, tazze spaiate, finestre accese con nastro sulle crepe |
| Cathedral Quarter | vetrine, quadranti antichi, pietra incisa con l'orologio spezzato |
| Toxic Slum Bazaar | tubi montati a mano, filtri appesi, radio riparata |
| Clockwork Outpost | ingranaggi a vista, banco di lavoro, pezzi della Vortex |

### 3.3 Insegne: 1 tavola

> Sheet of 7 small painted shop sign icons for a mobile game, 256×256 each, transparent background, no text: inn (cup and moon), blacksmith (hammer and gear), shop (bag and coin), relics (broken clock), alchemist (flask), informant (eye and mask), mechanic (wrench and spark).

Le tavole passano dai controlli che usiamo già:
- ritaglio e croma: `tools/gpt_chroma.py`;
- confronto con lo sprite, per volto, colori e accessori: la tavola viene respinta se non corrisponde;
- consegna: `tools/verify_preproduction_delivery.py`.

## 4. Milestone

| ID | Contenuto | Serve arte GPT? |
|---|---|---|
| M-I1 | Il sistema della scena d'interno (porta, dissolvenza, impaginazione nei due orientamenti, scelte, battute «Chiedi» per stato della storia, testi inglesi, test). Fino all'arrivo delle tavole usa l'arte che c'è: hub sfocato e lo sprite NPC ingrandito con un bordo morbido | no, si può fare subito |
| M-I2 | Moon Refuge completo: 3 interni, 4 NPC (locandiera, fabbro, bambina, vecchio), insegne | sì |
| M-I3 | Gli altri 3 hub | sì |
| M-I4 | Effetti audio d'interno, schermate per lo Store, misura della durata | no |

## 5. Verifica

- `npm test`: ogni battuta ha la traduzione inglese; ogni servizio ha una scena; l'economia non cambia (stessi risultati di `buyHubItem`).
- Controllo nel browser a 390×844 e 844×390: nessun pulsante fuori dallo schermo, scelte leggibili, zero errori di pagina.
- Un'occhiata umana alle tavole prima dell'integrazione: fedeltà allo sprite e diritti.
