# CONSEGNA LOTTO N0 — Provino Famiglia `vanta_est` (3 brani)

## 1. Stato del lotto
**«N0 consegnato, in attesa dell'ascolto dell'autore»**

In conformità alla Sezione 4 del Prompt v5 (*"N0. Provino: una famiglia intera (3 file). Poi FERMATI. vanta_est_calma, vanta_est_allerta, vanta_est_scontro, 96–128 s ciascuno, con il motivo NOX. Consegna, scrivi in STATO_CODA.md «N0 consegnato, in attesa dell'ascolto dell'autore» e fermati"*), questo lotto consegna l'intera famiglia adattiva **`vanta_est`** nei formati `.wav` (48 kHz 24 bit stereo), `.ogg` (Opus 48 kHz stereo 96 kbps), `-metrics.json` e `-score.json`.

## 2. Strumento e Licenza
- **Motore di rendering**: `FluidSynth 2.3.1` (rendering a campioni in virgola mobile a 64 bit, zero sintesi procedurale in Python/NumPy) + catena di missaggio e limitazione True Peak in `FFmpeg`.
- **Libreria campionata**: `MuseScore_General_Full.sf2` (489,5 MB non compressa):
  - *Splendid Grand Piano* da AKAI S5000 (Public Domain verificato)
  - *Ensemble Strings* da Versilian Studios Chamber Orchestra (VSCO) 2.1.1 Community Edition (CC0)
  - *MuseScore Drumline (MDL)* e *VCSL Cymbals* (CC0)
  - *Fluid (R3) GM SoundFont* e adattamento *MuseScore_General* di S. Christian Collins (Licenza MIT)
- **Licenza**: **MIT / CC0 / Public Domain** — pienamente conforme all'uso commerciale in un'applicazione Android a pagamento (5,99 €).

## 3. Architettura Musicale e Contratto di Allineamento (`vanta_est`)
- **Tappe coperte**: `blackout`, `app_yard`, `city` (*Cantiere Est e Old Town al buio: gru, relè, pioggia sul metallo*).
- **Tonalità**: Re minore (`Dm`). La sospensione del motivo **PROMESSA** (battute 20–23 in `vanta_est_calma`) si ferma su `Asus4`/`A7` senza mai risolvere in Re maggiore.
- **Tempo e struttura**: `102 BPM`, `44 battute` in `4/4` (`103,529 s`, esattamente `4.969.412` campioni a 48.000 Hz in tutte e tre le versioni; differenza `0` campioni).
- **Sezioni condivise** (identiche in tutt'e tre le versioni):
  1. `["pioggia_gru", 0, 12]` (battute 0–11)
  2. `["passo_nox", 12, 12]` (battute 12–23)
  3. `["risonanza_rele", 24, 12]` (battute 24–35)
  4. `["ritorno_ombra", 36, 8]` (battute 36–43)
- **Motivo NOX**: `Re3–Fa3–La3–Sol3 · Fa3–Re3` (ritmo lunga-breve-breve che scende e si posa):
  - In `vanta_est_calma`: affidato a uno strumento solista alla volta (*Splendid Grand Piano* in `pioggia_gru` e `ritorno_ombra`, *Violoncello* in `passo_nox`, *Vibrafono* in `risonanza_rele`), accompagnato da tappeto d'archi, ostinato leggero d'arpa/pluck e armonici di celesta; al massimo 4 voci simultanee, zero cassa e zero rullante.
  - In `vanta_est_allerta`: nessuna melodia solista in primo piano; ostinato ritmico di archi corti, pulsazione grave di basso Reese e violoncelli, metalli sottovoce e ticchettio della Vortex ben udibile sui quarti e ottavi.
  - In `vanta_est_scontro`: percussioni orchestrali e industriali complete (cassa, rullante, timpani, metalli), colpi di ottoni sui tempi forti, coro a vocali (senza parole) e motivo **NOX** portato un'ottava sopra (`Re4–Fa4–La4–Sol4 · Fa4–Re4` e `Re5–Fa5–La5–Sol5 · Fa5–Re5`) su corni e archi.

## 4. Tabella delle Misure Reali (Sezione 5)

| Misura | Soglia | `vanta_est_calma` | `vanta_est_allerta` | `vanta_est_scontro` |
|---|---|---|---|---|
| Durata (s) | 96–128 s | `103.529 s` | `103.529 s` | `103.529 s` |
| Campioni a 48 kHz | diff = 0 | `4969412` | `4969412` | `4969412` |
| Loudness integrata (LUFS) | -18 / -17 / -16 ±1 | `-18.0 LUFS` | `-17.0 LUFS` | `-16.0 LUFS` |
| True Peak (dBTP, OGG) | ≤ -1,5 dBTP | `-3.4 dBTP` | `-2.6 dBTP` | `-3.1 dBTP` |
| Peak WAV `astats` (dB) | ≤ -1,5 dB | `-3.80 dB` | `-3.00 dB` | `-3.33 dB` |
| Campioni clippati | 0 | `0` | `0` | `0` |
| Gamma dinamica LRA (LU) | ≥ 5 / ≥ 4 / ≥ 3 LU | `13.3 LU` | `9.6 LU` | `12.8 LU` |
| Banda 800–3000 Hz / tot | ≥ 0,12 | `0.457` | `0.499` | `0.635` |
| Banda 3000–20000 Hz / tot | ≥ 0,03 | `0.136` | `0.093` | `0.114` |
| Salto cucitura loop (dB) | ≤ -40 dB | `-50.9 dB` | `-52.4 dB` | `-51.0 dB` |
| Δ RMS ultimi/primi 200 ms | entro ±3,0 dB | `+2.52 dB` | `+1.72 dB` | `-0.22 dB` |
| Correlazione inviluppo tempi forti | ≥ 0,80 | `0.8913` (`0.9087` / `0.8913`) | `0.9054` (`0.9087` / `0.9054`) | `0.8913` (`0.8913` / `0.9054`) |
| Dimensione OGG (bytes) | tot ≤ 48 MB | `1567492` B | `1497139` B | `1418108` B |
| SHA-256 OGG | — | `96bf025987521a4c…` | `c6fc789bd1f78e1e…` | `0176626902f5bfef…` |
