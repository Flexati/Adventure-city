# Stato della consegna Astra giro 3

Consegna incompleta: nessun asset è dichiarato pronto o integrabile. Base: `work/chronos-adventure-commercial`, commit `49e353241b4ca8c10774cd2626b758e19937fd7c`.

## Verifica dei materiali

Prima della lavorazione, confrontati byte e SHA-256 dei due ZIP con `requests/astra-giro3-20261027/INDICE.json` e verificati anche i file interni elencati:

- AMBIENTE: 10.619.540 byte; SHA-256 `27af3a6e4e30b4a5670e1ba4510286d4bc508f682926b8f4ac4d95a252342392`.
- PERSONAGGI: 12.047.678 byte; SHA-256 `864f2c228e8ff459bbf2c169101432aa003d59c7091d1d464257a56a68cf5b2e`.

## G6/G7: fermati su decisione dell'autore

Nel JSON, `lulu_r12_gun`, riga 1 colonna 1 (indici da zero), ha `body_height=300` e piedi a y 300. La cella è alta 301 px: con 12 px vuoti sopra, il contenuto tra y 12 e y 300 copre al massimo 289 righe; 300 × 0,97 = 291 px. Non è quindi possibile rispettare insieme tale misura, il margine e l'isolamento nella cella. Il riferimento visivo suggerisce che la misura possa includere il lampo, ma l'autore ha esplicitamente rifiutato di sostituirla con una nuova misura del solo corpo e ha chiesto di fermare G6/G7. Nessuno sheet è stato consegnato.

## G12 e G4: non pronti

Un tentativo con image_gen per il terminale ha prodotto un master 1254×1254 invece del PNG 64×64 richiesto; non è stata verificata una giunzione conforme con il segmento. Un tentativo giorno per la strada ha prodotto 887×1774 invece di 720×1440, con trattini troncati al bordo. Non è stata prodotta una versione notte conforme. Questi tentativi non sono asset di consegna e non sono presenti nel ramo. Servono elaborazione ed esame supplementari per ottenere e misurare i formati, la giunzione e il passo richiesti.

Non sono stati effettuati test di gioco, approvazioni artistiche né ascolti. Questa relazione non sostituisce gli ZIP, i rapporti di misura e la provenienza richiesti per una consegna completa.
