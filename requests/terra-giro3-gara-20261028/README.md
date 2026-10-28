# Richiesta a GPT 6.1 Terra — giro 3, grafica della gara (28 ottobre 2026)

Richiesta dell'autore: grafica dedicata per tutti gli ostacoli della gara, sbarramenti, rampe, «tutto». Stesso metodo del giro 2 (D14): Terra disegna solo dentro maschere del team, il team ricompone e controlla.

| File | Contenuto |
|---|---|
| `PROMPT_TERRA.md` | Testo da incollare in Terra |
| `pacchetto/modelli/` | 34 tele su verde #00FF00, già ingrandite, ciascuna con la sua maschera |
| `pacchetto/TAVOLA_SCALA.png` | Zone dei file sulla strada di Ash Docks alla scala del gioco, con l'urto in giallo |
| `pacchetto/MISURE.json` | Copia di `assets/source/race_props/race_props.json`: misure, zone, riquadri obbligatori, posizione in gioco |
| `pacchetto/riferimenti/` | Container in gioco, auto di Veyra, pilone, strada della gru giorno/notte, gara di oggi |
| `INDICE.json` | Byte e SHA-256 di ogni file |

Priorità 1, Ash Docks (in gioco adesso), 20 file: rampa nitro, segnale e paletti del varco, due ostacoli nuovi in due stati, gru a portale di giorno e di notte, carrello, due carichi appesi in due stati, due chiazze d'olio, tre fiamme del nitro (Vortex, Veyra, rivali), traguardo. Priorità 2, Solkara e Aurelia Span, 14 file. Suoni: 11 file OGG se Terra può produrre audio, altrimenti vanno ad Astra.

Le misure vengono dalle hitbox di `game/racing-v9.mjs` e dal disegno in `game/runtime.mjs`: **le hitbox non cambiano**.

Ritorno di Terra: `<nome>_edit.png`. Ricomposizione e controllo: `python3 -I tools/compose_terra_race_props.py <cartella edit> <cartella uscita> <rapporto.json>` (riduzione Lanczos, verde in trasparenza, sfumato per chiazze e fiamme, tutto fuori zona azzerato; poi misura, zona, riquadro dell'urto, copertura, trave che attraversa la strada, stessa sagoma per «colpito» e notte). Tele e tavola: `python3 -I tools/make_terra_race_props.py <cartella>`.

L'integrazione in gioco si fa dopo la consegna, solo per i file che passano il controllo; finché un file manca, il gioco tiene il disegno attuale.
