# STATO CODA — Colonna Sonora Adattiva v5 (`deliveries/argon-musica-adattiva-v5-20261117/`)

**«N0 consegnato, in attesa dell'ascolto dell'autore»**

## 1. Controlli di partenza e Stato corrente
- **Ramo**: `delivery/argon-design-aaa-20261117`
- **Allineamento con il ramo di lavoro**: eseguito il merge del commit `2685500` (*R46 / D91: la musica segue il gioco — ripresa dalla frase, fasi dei boss, stealth, salute bassa, temi nei momenti e nei finali; prompt v5 per Argon*) senza rebase e senza force-push.
- **Codice e documentazione letti (senza modifiche fuori dalla cartella di consegna)**: `CLAUDE.md`, `docs/gold/DECISIONI.md` (D52–D91), `docs/gold/STATO.md` (R40–R46), `game/audio-engine.mjs`, `game/score-map.mjs`, `tests/music-r46.test.mjs`, `assets/production/r38/audio/*-score.json`.
- **Strumento musicale e licenza**:
  - **Motore**: `FluidSynth 2.3.1` (motore di campionamento a 64 bit, `LGPL-2.1+`) + `FFmpeg` per missaggio, equalizzazione e limitazione True Peak. Zero sintesi procedurale scritta a mano in Python/NumPy (Python è usato esclusivamente per generare le partiture MIDI/JSON e per misurare i campioni decodificati dai file `.ogg`).
  - **Libreria campionata**: `MuseScore_General_Full.sf2` (489,5 MB lossless: *Versilian Studios Chamber Orchestra 2.1.1 Community Edition* `CC0`, *AKAI S5000 Splendid Grand Piano* `Public Domain`, *MuseScore Drumline* `CC0`, *VCSL Cymbals* `CC0`, *FluidR3 GM* e adattamento *MuseScore_General* di S. Christian Collins `MIT`).
  - **Licenza d'uso**: **MIT / CC0 / Public Domain** — pienamente idonea alla distribuzione commerciale in un'applicazione a pagamento (5,99 € su Android).
- **Punto di arresto obbligatorio (Sezione 4)**:
  Come prescritto dalla Sezione 4 (*"N0. Provino: una famiglia intera (3 file). Poi FERMATI. vanta_est_calma, vanta_est_allerta, vanta_est_scontro, 96–128 s ciascuno, con il motivo NOX. Consegna, scrivi in STATO_CODA.md «N0 consegnato, in attesa dell'ascolto dell'autore» e fermati"*), la sessione si ferma dopo la consegna e la verifica completa di **N0** in attesa del riscontro d'ascolto dell'autore.

## 2. Riepilogo Lotti (Totale: 63 file)

| Lotto | Previsti | Consegnati | Saltati | Mancanti | Stato |
|---|---:|---:|---:|---:|---|
| **N0 (`N0_provino`)** | 3 | **3** | 0 | 0 | **«N0 consegnato, in attesa dell'ascolto dell'autore»** |
| **N1 (`N1_famiglie`)** | 15 | 0 | 0 | 15 | In attesa di approvazione ascolto N0 |
| **N2 (`N2_boss`)** | 27 | 0 | 0 | 27 | In attesa di approvazione ascolto N0 |
| **N3 (`N3_villaggi_strada`)** | 7 | 0 | 0 | 7 | In attesa di approvazione ascolto N0 |
| **N4 (`N4_scene_stacchetti`)** | 11 | 0 | 0 | 11 | In attesa di approvazione ascolto N0 |
| **TOTALE** | **63** | **3** | **0** | **60** | Peso OGG N0: `4.482.739` byte (~4,28 MB su 48 MB max) |

## 3. Misure Reali del Lotto Consegnato (`N0_provino` — Famiglia `vanta_est`)

- **Tonalità**: Re minore (`Dm`), `102 BPM`, `44 battute` in `4/4` (`103,529 s`, `4.969.412` campioni esatti per tutte e 3 le versioni, differenza `0` campioni).
- **Sezioni**: `[["pioggia_gru", 0, 12], ["passo_nox", 12, 12], ["risonanza_rele", 24, 12], ["ritorno_ombra", 36, 8]]`.

| Brano | LUFS integrata (target) | True Peak OGG / Peak WAV | Clip | LRA (soglia) | Energia 800–3000 Hz (≥0,12) | Energia 3000–20000 Hz (≥0,03) | Salto cucitura loop (≤-40 dB) | Δ RMS ultimi/primi 200 ms (|Δ|≤3 dB) | Corr. inviluppo tempi forti (≥0,80) |
|---|---|---|---|---|---|---|---|---|---|
| `vanta_est_calma` | `-18.0 LUFS` (-18 ±1) | `-3.4 dBTP` / `-3.80 dB` | `0` | `13.3 LU` (≥5 LU) | `0.457` | `0.136` | `-50.9 dB` | `+2.52 dB` | `0.9087` (`allerta`), `0.8913` (`scontro`) |
| `vanta_est_allerta` | `-17.0 LUFS` (-17 ±1) | `-2.6 dBTP` / `-3.00 dB` | `0` | `9.6 LU` (≥4 LU) | `0.499` | `0.093` | `-52.4 dB` | `+1.72 dB` | `0.9087` (`calma`), `0.9054` (`scontro`) |
| `vanta_est_scontro` | `-16.0 LUFS` (-16 ±1) | `-3.1 dBTP` / `-3.33 dB` | `0` | `12.8 LU` (≥3 LU) | `0.635` | `0.114` | `-51.0 dB` | `-0.22 dB` | `0.8913` (`calma`), `0.9054` (`allerta`) |

## 4. Elenco Ordinato dei 60 File Mancanti (in coda dopo l'ok dell'autore su N0)

### N1 — Le altre cinque famiglie (15 file, 96–128 s ciascuno)
1. `porto_calma`, `porto_allerta`, `porto_scontro` (Fa maggiore / La minore, 104–112 bpm, motivo LULÙ)
2. `clinico_calma`, `clinico_allerta`, `clinico_scontro` (Si minore con colori modali, 108–116 bpm, motivo LULÙ)
3. `profondo_calma`, `profondo_allerta`, `profondo_scontro` (Do minore con accordi napoletani, 84–94 bpm, motivo NOX)
4. `vetro_calma`, `vetro_allerta`, `vetro_scontro` (Mi minore con maj7 e sus, 116–124 bpm, motivo EVE)
5. `asse_calma`, `asse_allerta`, `asse_scontro` (Re minore che sale a Mi minore, 124–132 bpm, tutti i motivi verso il culmine)

### N2 — Boss a tre fasi (27 file, 64–96 s ciascuno, con sezione `ingresso` + `ciclo`)
6. `rook_f1`, `rook_f2`, `rook_f3` (fucile e cantiere; metallo percosso, ritmo spezzato)
7. `anchor_f1`, `anchor_f2`, `anchor_f3` (tre cime tese; tre note gravi che tornano, catene)
8. `tyrant_f1`, `tyrant_f2`, `tyrant_f3` (cattedrale; organo e coro a vocali)
9. `custode_f1`, `custode_f2`, `custode_f3` (recupero; segnale di riconoscimento che si chiude)
10. `behemoth_f1`, `behemoth_f2`, `behemoth_f3` (fabbrica; presse e sfiati in tempo)
11. `reaper_f1`, `reaper_f2`, `reaper_f3` (miraggi; eco sfasate, una sola voce vera)
12. `vega_f1`, `vega_f2`, `vega_f3` (metronomo rigido in 4, che nella fase 3 si rompe)
13. `eve_prime_f1`, `eve_prime_f2`, `eve_prime_f3` (lo specchio del motivo NOX suonato al contrario sul vetro)
14. `archon_f1`, `archon_f2`, `archon_f3` (tutti e quattro i motivi, che Archon toglie uno alla volta fase dopo fase)

### N3 — Villaggi e strada (7 file)
15. `hub_moon` (Moon Refuge, casa e sera; motivo PROMESSA sospeso, 90–150 s)
16. `hub_cathedral` (mercato della cattedrale; campane e liuti, 90–150 s)
17. `hub_toxic` (bazar tossico; percussioni di latta, ottoni stonati con garbo, 90–150 s)
18. `hub_clockwork` (avamposto a orologeria; ingranaggi a tempo, carillon, 90–150 s)
19. `strada_crociera`, `strada_inseguimento`, `strada_ultimo_giro` (guida e gare, 120–150 bpm, motivo NOX alla guida, allineati al campione)

### N4 — Scene e stacchetti (11 file)
20. `separation` (la firma; motivo PROMESSA spezzato a metà, 60–90 s)
21. `collapse_run` (la fuga dall'Asse che crolla, 60–90 s, allineato in tempo con `archon_f3`)
22. `credits_suite` (i quattro motivi in una suite, con la risoluzione della PROMESSA in Re maggiore, 150–210 s, senza loop)
23. `sting_vittoria`, `sting_sconfitta`, `sting_fase_boss`, `sting_allarme`, `sting_ondata`, `sting_obiettivo`, `sting_scoperta`, `sting_ricompensa` (8 stacchetti senza loop, 1–5 s, -14 LUFS ±1)
