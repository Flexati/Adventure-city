# Consegna Argon del 9 novembre 2026: esito del controllo

10 novembre 2026 · ramo `delivery/argon-asset-20261109`, commit `2a34c6a` · decisione D50

Il ramo contiene 188 immagini e 13 file `CONSEGNA.md`, tutti sotto `deliveries/argon-asset-20261109/`; nessun altro file è stato toccato (**[FATTO]** `git diff --name-only 4bcabf3 origin/delivery/argon-asset-20261109`). Il ramo non è stato modificato.

Dimensioni e formati rispettano i contratti in tutti i gruppi. Il controllo che decide è però guardare le immagini: **solo due gruppi sono disegni**. Gli altri sono figure geometriche tracciate da un programma (rettangoli, cerchi, tinte piatte), come mostra anche il peso dei file.

| Gruppo | Cosa | Esito | Motivo |
|---|---|---|---|
| A | 30 interni 1920×1080 | **Entra** (15, una variante per servizio) | Disegni veri, senza scritte e senza persone. Pesano 110–354 KB |
| I | 16 ritratti 768×1024 | **Entra** (8, variante 1) | Disegni veri, coerenti con i ritratti già nel gioco |
| H | 12 strisce di preparazione | Non entra | Non sono fotogrammi nuovi: sono fotogrammi del foglio di oggi copiati, schiacciati in altezza o con una scintilla sopra. Le 6 seconde varianti sono identiche alle prime, pixel per pixel |
| J | 16 fogli di ruolo | Non entra | Omini fatti di rettangoli (10–31 KB per foglio). Oggi il gioco usa sprite disegnati: sarebbe un passo indietro |
| G | 36 tavole dei boss | Non entra | Sagome geometriche su verde (11–62 KB per tavola 1536×1024). Non sono i boss a 288 px richiesti |
| C | 16 terreni | Non entra | Bande di colore piatto (19–21 KB) |
| B, D, E | 24 fogli di facciate, case, decorazioni | Non entra | Icone geometriche (6–34 KB); le case sono 5 in tutto il foglio |
| K | 24 strade delle gare | Non entra | Bande piatte con ovali ripetuti (11–21 KB); la strada di oggi è più ricca |
| L | 2 fogli della Vortex | Non entra | Auto fatta di poligoni; la seconda variante è identica alla prima |
| M, N | 12 cancelli, travi, paletti | Non entra | File sotto 1 KB: rettangoli |

**In tutto:** 23 immagini entrano nel gioco, 165 no. 12 seconde varianti sono identiche alla prima.

## Scelta delle varianti degli interni

Regola: la variante che mostra ciò che il testo del luogo racconta (`game/interiors.mjs`).

- Variante 1: Moon Refuge (locanda con le prese sotto la vernice, officina di Dario, banco fatto con porte d'ascensore), Cathedral Quarter (forgia con le campane, sacrestia con gli orologi, mercato coperto, confessionale), fonderia e torre delle molle di Clockwork.
- Variante 2: i quattro interni di Toxic Bazaar, il magazzino e la camera delle fondamenta di Clockwork.

## Derivati

`tools/derive_argon_20261109.py` riduce gli interni a 1280×720 WebP e i ritratti a 375×500 JPEG. Ogni derivato è in `assets/production/v10.3/derived/REGISTRO_ARGON_20261109.json` con l'SHA-256 dell'originale.

## L'altro ramo: `delivery/argon-interni-palazzi-20261109`

Contiene anche modifiche al codice (interni, facciate, particelle), fatte partendo da una versione vecchia del ramo di lavoro. Non è stato unito: gli interni arrivano dal ramo degli asset, le facciate sono dello stesso tipo geometrico, e le modifiche al combattimento non sono passate dai controlli di questo ramo.

## Cosa serve ancora

Per i gruppi rifiutati i prompt restano validi (`requests/argon-interni-palazzi-20261109/`). Servono immagini generate da un modello di immagini, non disegnate da un programma: è la stessa strada che ha prodotto gli interni e i ritratti.
