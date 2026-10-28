# Stato — Terra giro 3 gara

Aggiornato il 2026-10-28 da Claude, che ha eseguito `PROMPT_CLAUDE.md`.

## Grafica: 34 immagini su 34 (priorità 1 e 2)

Tutte in `immagini/<nome>_edit.png` sul modello del pacchetto. Le stesse opere alla misura di gioco, con trasparenza esatta, sono in `anteprime/<nome>.png`. Panoramica sulla strada di Ash Docks: `anteprima_tutto.png`.

| Gruppo | File | Commit |
|---|---|---|
| Rampe P1 | race_pad_nitro_porto | 84ccd88 |
| Sbarramento P1 | race_barrier_gap_porto, race_barrier_post_porto | b061aa5 |
| Ostacoli P1 | race_obstacle_porto_bobina(_colpito), race_obstacle_porto_casse(_colpito) | de8c676 |
| Gru P1 | race_crane_beam_porto_day/night, race_crane_trolley_porto, race_crane_load_porto_reti(_colpito), race_crane_load_porto_tubi(_colpito) | b656088 |
| Chiazze P1 | race_slick_olio_a, race_slick_olio_b | aae9120 |
| Fiamme P1 | race_nitro_flame_vortex, _veyra, _rivali | 04fea32 |
| Traguardo P1 | race_finish_porto | 57f878b |
| Rampe P2 | race_pad_nitro_sabbia, race_pad_nitro_ponte | 204884c |
| Ostacoli P2 | race_obstacle_sabbia_cassa/cisterna, race_obstacle_ponte_barriera/carrello, ognuno con _colpito | 2025471 |
| Chiazze P2 | race_slick_sabbia_a, race_slick_sabbia_b | d938507 |
| Traguardi P2 | race_finish_sabbia, race_finish_ponte | c3e451a |

**Come sono fatte.** In questo ambiente non c'era un generatore di immagini. Le immagini sono pixel art disegnata in codice, riproducibile: `python3 -I sorgenti/disegna_gara.py`, con `sorgenti/pixel.py` e un seme fisso.
- Ogni opera è disegnata alla misura di gioco, ingrandita al vicino più prossimo e posata sul modello solo dentro la maschera.
- Chiazze e fiamme sfumano a retino, senza trasparenza parziale, così nessun colore si mescola al verde.
- Le versioni `_colpito` e `_night` partono dallo stesso disegno della versione normale o diurna, con la stessa sagoma.

**Controlli eseguiti** (`python3 -I sorgenti/controlla_immagini.py`, rapporti `CONTROLLI_IMMAGINI.json` e `RICOMPOSIZIONE.json`), risultato **PASS** su 34 immagini su 34:
- misura identica al modello;
- 0 px cambiati fuori maschera;
- 0 px vicini al verde chiave dentro la maschera;
- con lo strumento del team `tools/compose_terra_race_props.py`: zona, riquadro d'urto (16, 22, 111, 168) per ostacoli e carichi, copertura minima di MISURE.json, trave che attraversa la strada e sagoma delle varianti entro ±2 px.

**Blocco misurato nello strumento del team, non nelle immagini.** `compose_terra_race_props.py` riduce con Lanczos e applica la soppressione del verde a tutti i pixel. Questo altera i colori della pixel art:
- frecce verde menta del varco: 84% dei pixel cambiati di oltre 8 livelli, massimo 68;
- ostacoli: dall'11% al 31% dei pixel;
- fiamme: circa 110 px di trasparenza diversi nella coda a retino.

Il dettaglio per file è nella sezione `recomposition_vs_exact_art` di `CONTROLLI_IMMAGINI.json`. Per l'integrazione conviene usare `anteprime/`, che lo strumento accetta così come sono. In alternativa va corretto lo strumento sul ramo di lavoro: riduzione per campione centrale quando l'edit è un ingrandimento esatto, e soppressione del verde solo sul bordo.

**Non controllato.** Qualità artistica, leggibilità in corsa e resa sul dispositivo: nessuna revisione umana e nessuna prova nel gioco. La resa è più semplice dei container dipinti in gioco: meno materia e meno sfumature. È da giudicare a occhio prima dell'integrazione.

## Suoni: 11 file rifiniti

Commit b09d45e. `sintesi.py` rigenera master WAV, OGG e `VERIFICA_AUDIO.json`.

**Cosa ho cambiato**
- **Durata:** otto file decodificati duravano 2,67 ms meno del nominale, perché l'encoder perde 128 campioni. Il master ora riceve 128 campioni di silenzio in coda e la durata OGG decodificata è quella nominale (scarto 0,0 ms su 11 file su 11; le medaglie non avevano bisogno di correzione).
- **Livello:** il nitro era il suono più debole del set (RMS −19,5 dBFS, contro −12,6 della partenza perfetta). Ora ogni suono raggiunge un livello a breve termine misurato su 50 ms: −10 dBFS per nitro, partenza perfetta e oro; −10,5 per argento ed eliminazione; −11 per rampa e bronzo; −12 per olio, sabbia e pattinamento; −12,5 per lo sfiorato (raggiunto −12,9).
- **Vincoli:** picchi da −5,1 a −3,8 dBFS, attacco entro 0,15 ms, ultimi 5 ms in silenzio.

**Misure per il confronto olio/sabbia.** L'olio ha un fischio tonale a 1350 Hz, la sabbia è solo rumore; centroide spettrale e piattezza sono in `VERIFICA_AUDIO.json`.

**Nessun suono è stato ascoltato.** Chi ha rifinito il set (Claude) non può ascoltare. Chiarezza, peso, differenza percepita fra olio e sabbia, clic udibili, resa delle fanfare e leggibilità nel mix restano da valutare con cuffie e altoparlante piccolo. Nessuna prova nel gioco.

## Fuori consegna

`prove_non_conformi/race_pad_nitro_porto_prova.png` resta una prova non conforme e non è stata usata.
