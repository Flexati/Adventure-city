# Batch 3 — oggetti di gara: 15 immagini GPT, correzione della ricomposizione, integrazione (28 ottobre 2026)

`COMMERCIAL_RELEASE = BLOCKED`.

## 1. Correzione della ricomposizione (difetto noto, Lanczos + verde)

In `tools/compose_terra_race_props.py`:
- **Prima:** riduzione Lanczos, chiave sulla distanza da #00FF00, limite globale al canale verde su tutta l'immagine. L'ultimo passo alterava anche i colori interni della pixel art.
- **Dopo:** chiave G−max(R,B) alla scala del modello (`tools/gpt_chroma.py`), poi riduzione per media d'area sul colore premoltiplicato. L'alone viene soppresso solo sul bordo; l'alfa torna binario, tranne per le chiazze.

Misura sui 34 disegni procedurali (ricomposizione confrontata con il disegno esatto in `anteprime/`):

| | Prima (Lanczos) | Dopo (area) |
|---|---:|---:|
| Differenza media RGB sui pixel visibili | 16,96 | **0,26** |
| Pixel con alfa diverso, in totale | 943 | **151** |
| Esito dei controlli dei 34 | PASS | PASS |

I file della misura sono `ricomposizione_lanczos_prima.json` e `ricomposizione_area_dopo.json`.

## 2. I 15 disegni GPT (`delivery/gpt-rigenerazione-92-20261028`, gara/)

`tools/fit_gpt_race_props.py` porta ogni immagine nel riquadro di gioco: chiave, ritaglio, riduzione per area. Gli stati «colpito» e «notte» usano la trasformazione della base. I controlli sono quelli del team (`compose_terra_race_props.py`).

| Oggetto | Esito | Nota |
|---|---|---|
| ostacolo casse + colpito | PASS | allungato 2,3% per riempire il riquadro d'urto |
| carico reti + colpito | PASS | 1,2% |
| carico tubi + colpito | PASS | 7,8% |
| gru giorno + notte | PASS | GPT l'ha disegnata 3,3:1 invece di 6:1; la trave è allungata ripetendo un tratto liscio della trave ai lati, senza deformare nulla |
| carrello gru | PASS | |
| rampa nitro porto | PASS | 9,2% |
| paletto del varco | PASS | |
| **bobina + colpito** | **FAIL** | proporzione 0,91 contro 2:3 del prompt: riempirebbe il riquadro solo con il 39% di deformazione, quindi non è stata stirata |
| **chiazza olio A** | **FAIL** | copre il 46% della zona (minimo 50%): gli schizzi isolati limitano la scala |
| **chiazza olio B** | **FAIL** | 45% |

## 3. Integrazione in gioco

`tools/build_race_props_runtime.py` sceglie per ogni oggetto:
- **la versione GPT**, se passa i controlli (e, per gli stati, se anche la base è GPT): 11 oggetti;
- **altrimenti il disegno procedurale**: 20 oggetti.

La scelta è registrata in `race_props_runtime.json`.

Sono installati 31 file in `game/art/v10/`. Le 3 fiamme nitro non sono installate, perché il gioco non le disegna.

**Cosa cambia in `game/runtime.mjs`.** `visuals.RACE_PROPS` e `raceRegion` associano le modalità alle regioni:
- porto: `docks`, `precision`, `night`;
- sabbia: `sand`, `storm`;
- ponte: `bridges`, `duel`.

Rampe, chiazze, ostacoli, carichi della gru (con trave e carrello), paletti del varco e traguardo sono disegnati con gli sprite **negli stessi rettangoli del modello di gara**. Collisioni, posizioni, tempi e fisica non cambiano. Se manca un file, resta il disegno a codice di prima.

Varietà visiva:
- porto: 4 container + bobina + casse;
- sabbia: cassa, cisterna + 2 container;
- ponte: barriera, carrello + 2 container.

## Controlli eseguiti

- `npm test`: 218/218. È nuovo il test sulla mappa per regione e sull'esistenza di ogni file usato.
- `verify_race_modes_browser.cjs` (Chromium, 390×844, Ash Docks: contro il tempo, eliminazione, rivincita): tutto PASS, 0 errori pagina. Lo screenshot è `batch03_race_modes_props_390x844.png` e mostra:
  - la rampa GPT;
  - lo sbarramento con bobina, container e paletti;
  - il rivale 03 con la sua auto nuova.
- **Non verificato nel browser:** le gare di Solkara (sabbia) e Aurelia Span (ponte). Il test conferma solo che i file esistono e che la mappa è corretta.

## Lacune

- Bobina e chiazze d'olio GPT vanno rifatte con le proporzioni giuste. Il prompt pronto è sotto.
- Revisione artistica umana. In particolare, nei carichi della gru il gancio occupa la parte alta del riquadro d'urto, quindi la massa visiva del carico è più in basso della collisione.
- Nessun dispositivo Android, nessun playtest.

### Prompt di rifacimento, da incollare in GPT

```
Rifai tre immagini per CHRONOS Adventure, stesso stile delle precedenti (pixel art dettagliata, contorno scuro 1 px, ombre a gradini, luce dall'alto a sinistra, sfondo verde puro #00FF00, 40 px di margine).
1. gpt_obstacle_porto_bobina.png, 1024x1536: la bobina di cavo deve occupare un rettangolo ALTO 2:3 (larghezza:altezza = 0,67): bobina in piedi più alta, con il pallet sotto, non un disco largo. Poi gpt_obstacle_porto_bobina_colpito.png modificando la stessa immagine.
2. gpt_slick_olio_a.png e gpt_slick_olio_b.png, 1024x1024: chiazza d'olio compatta che riempie un'ellisse, schizzi vicini al bordo della chiazza, nessuno schizzo isolato lontano.
```
