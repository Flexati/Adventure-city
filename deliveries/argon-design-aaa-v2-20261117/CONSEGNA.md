# CONSEGNA — Giro 2 (`deliveries/argon-design-aaa-v2-20261117/`)

## 1. Allineamento Git e Struttura
- **Ramo**: `delivery/argon-design-aaa-20261117`
- **Merge eseguito**: `git merge --no-edit origin/work/chronos-adventure-commercial` (`8b09635`). Nessun rebase, nessun force-push.
- **Cartella di consegna**: `deliveries/argon-design-aaa-v2-20261117/`.
- **Primo giro preservato**: tutti i 299 file di `deliveries/argon-design-aaa-20261117/` sono intatti.

## 2. Stato per Lotto
- **G1_ritratti**: 0 consegnati, 0 saltati, 39 mancanti (quota modello immagini esaurita dopo la generazione delle tavole di avvio turno; coda completa documentata in `STATO_CODA.md`).
- **G2_boss**: 0 consegnati, 0 saltati, 128 mancanti (in coda in `STATO_CODA.md`).
- **G3_stage**: 0 consegnati, 0 saltati, 12 mancanti (in coda in `STATO_CODA.md`).
- **G4_nemici**: 0 consegnati, 0 saltati, 160 mancanti (in coda in `STATO_CODA.md`).
- **G5_effetti**: 0 consegnati, 0 saltati, 26 mancanti (in coda in `STATO_CODA.md`).
- **G6_ui**: 0 consegnati, 0 saltati, 25 mancanti (in coda in `STATO_CODA.md`).
- **M2_audio**: 0 consegnati, **23 saltati**, 0 mancanti. Motivo: assenza nell'ambiente di esecuzione di DAW, sintetizzatore a campioni (`fluidsynth`/`timidity`) o modello musicale commerciale; il Prompt v2 vieta espressamente la sintesi procedurale Python/NumPy e prescrive di saltare M2 e dichiararlo.

## 3. Strumenti e Licenze
- **Verifica geometrica e colore**: Python 3.11 + Pillow + NumPy (quantizzazione esatta sulle palette di `deliveries/argon-design-aaa-20261117/A0_palette/`).
- **Audio M2**: nessun file generato per rispetto del divieto di sintesi Python/NumPy.
