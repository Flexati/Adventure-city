# Richiesta a GPT: 4 boss della Parte I, versione 2

2 novembre 2026 · decisioni D23, D28 e D30 · `COMMERCIAL_RELEASE = BLOCKED`

**Un prompt pronto non è un'immagine.** Nel registro i boss restano `SPECIFIED_NOT_GENERATED` finché i file non arrivano e non superano i 10 controlli.

## Cosa c'è qui

| File | Contenuto |
|---|---|
| `brief/boss.<id>.sheet.v2.json` | Il brief: soggetto, colori, colori vietati, contorno, luce, contratto di cella, stati. **Non si modifica:** una correzione è una v3 |
| `prompt/boss.<id>.identita.v2.md` | L'identità: 3 pose (riposo, preparazione, attacco). **4 varianti** |
| `prompt/boss.<id>.sheet_A.v2.md` | Fermo e cammina. **2 varianti**: fissano proporzioni e costume |
| `prompt/boss.<id>.sheet_B.v2.md`, `_C`, `_D` | Preparazione e attacco; recupero, colpito e cambio di fase; sconfitto ed effetti. **1 immagine ciascuno** |
| `riferimenti/` | Le strisce di oggi da 128 px (solo idea, non da copiare), `ref_boss.png` e `ref_scala.png` (Nox in nero, il riquadro grigio è l'altezza del boss). `SORGENTI.json` riporta l'SHA-256 di ogni sorgente |
| `INDICE.json` | Ogni prompt con SHA-256, brief, allegati e nomi dei file da consegnare |

I file li scrive `node tools/build_boss_v2.mjs`. Il test `tests/art-derived.test.mjs` controlla che il pacchetto sia identico a quello che lo strumento produce.

## L'ordine di lavoro, per ogni boss

1. **Identità.** Carica gli allegati e incolla il prompt `identita`, 4 volte. Si sceglie una variante.
2. **Sheet, parte A.** Nuova chat con l'identità scelta allegata, 2 volte. Si sceglie una variante.
3. **Parti B, C e D.** Nella stessa chat, con l'identità e la parte A scelte, una volta ciascuna.
4. **Consegna** sul ramo `delivery/gpt-boss-v2-20261102`, cartella `deliveries/gpt-boss-v2-20261102/<id>/`, con i nomi scritti in cima a ogni prompt. Gli originali non si toccano più.
5. **Pulizia e controlli** (Pilastro 2, §3 e §4): sfondo, alfa binaria, celle, pivot, scala con filtro Lanczos a 288 px, margini, colori. Il derivato va in `assets/production/v10.3/derived/boss.<id>.sheet/v2/sheet.png` e nel registro `REGISTRO.json` di quella cartella; poi `npm test`.

## Conto delle immagini

| Boss | Identità | Parte A | B + C + D | Totale |
|---|---:|---:|---:|---:|
| Cathedral Bone Tyrant | 4 | 2 | 3 | 9 |
| Toxic Forge Behemoth | 4 | 2 | 3 | 9 |
| Shadow Reaper | 4 | 2 | 3 | 9 |
| Vega | 4 | 2 | 3 | 9 |
| **Totale** | | | | **36**, più circa 4 correzioni |

**Perché 36 e non 28 come nel Pilastro 2.** GPT consegna al massimo 1536 × 1024 nella pipeline di oggi: tutti i 310 prompt usano quel formato **[FATTO]**. In un'immagine sola, 28 pose sarebbero alte circa 220 px e andrebbero ingrandite fino a 288, sfocando i pixel. Divise in 4 parti da 8 pose, ogni posa è alta circa 430 px e si riduce a 288 senza perdite. Le varianti restano 2 solo per la parte A, che fissa le proporzioni.

## Colori cambiati rispetto alla v01

| Boss | v01 | v2 | Perché |
|---|---|---|---|
| Shadow Reaper | #9AE8FF | #8FB8C8 | Il ciano brillante è di Nox |
| Shadow Reaper | nucleo magenta (3,87 % nella banda di Lulù) | #6A4ED8 | Viola-blu, fuori dalla banda di Lulù |
| Vega | #59E0FF | #4A78D8, #A8C0E8 | Il ciano brillante è di Nox |
| Cathedral Bone Tyrant | #7AE8D8 | #5E8A80, #3E625C | Verde acqua al confine fra Nox e «interattivo» |
| Toxic Forge Behemoth | #FF8A4A sul corpo | #D89A3A | L'arancio brillante è il pericolo: resta solo negli effetti |

## Cosa manca ancora

- **La palette del distretto** (regola P2) non esiste: finché non c'è, il controllo 7 conta solo i colori e resta `NON_VERIFICABILE` sulla quota di palette.
- **Il budget di peso** lo fissa il Pilastro 3: fino ad allora il controllo 10 verifica solo che il grezzo sia intatto.
- **L'arena di Vega** non è ancora decisa: il brief dice «un poligono di precisione».
- **Le mosse dei boss** non sono progettate: gli stati sono quelli del contratto (28 fotogrammi), le durate non si disegnano.
