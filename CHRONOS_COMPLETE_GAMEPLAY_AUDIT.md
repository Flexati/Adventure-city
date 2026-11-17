# CHRONOS — Audit completo del gameplay

Fonti:
- revisione indipendente del combattimento, eseguita da un agente separato in sola lettura, con simulazioni Node;
- revisione indipendente di missioni e monotonia, stesso metodo;
- `tools/audit_combat.mjs`;
- batteria nel browser [SIMULAZIONE, Chromium].

Il bot non è una persona: i minuti e le vittorie misurano la coerenza del gioco, non il divertimento.

## 1. Struttura misurata [SIMULAZIONE, dati di `buildMission`]

- **Campagna.** 44 passi: 25 a piedi, 5 alla guida, 1 fuga, 4 hub, 9 scene.
- **Rotte.** Le tre rotte a, b e c hanno la stessa sequenza di tappe; cambiano statistiche e testi.
- **Prima di MS-3.**
  - Obiettivi a piedi: 12 a dispositivi, 8 a dispositivi più boss, 2 di difesa, 1 ibrido, 1 di furtività, 1 duello.
  - 9 tappe avevano lo stesso schema.
  - 9 tappe a dispositivi venivano di fila.
  - La chiamata d'aiuto a metà arrivava al secondo dispositivo in 13 tappe su 14.
- **Dopo MS-3 (`e0029f7`).**
  - 10 a dispositivi, 3 ibride.
  - Gruppo identico più grande: 5.
  - Serie di tappe a dispositivi: 6.
  - Chiamate d'aiuto: 4 al primo dispositivo, 10 al secondo.
  - Prova: `docs/evidence/ms3/varieta.json`, `tests/variety-ms3.test.mjs`.
- **Ancora monotono, misurato.**
  - 5 ruoli di nemico: 4 compaiono già al passo 2, il quinto al passo 5.
  - L'ultimo sfondo nuovo arriva al passo 15.
  - 11 tappe su 25 usano 4 mappe generiche.
  - Nessuna gara nel percorso obbligatorio (decisione aperta, D05).

## 2. Combattimento [SIMULAZIONE]

- **Stabilità.** Fuzz su 25 missioni, 2 insiemi di scelte e 3 semi, 120 s simulati con tasti casuali: nessuna eccezione, nessun NaN, vita e munizioni sempre nei limiti.
- **Vittorie.** `audit_combat`: 50 combattimenti su 50 vinti (25 tappe, bot medio e debole, 6 semi); nessun nemico bloccato, nessun timeout.
- **Regressione corretta.** La mira trascinata con «Mira assistita» spenta: `aim_r28` passa da 1 su 6 a 7 su 7.
- **Equilibrio fuori dai limiti, introdotto dalla base `a9e3afd`.** Valori misurati, decisione dell'autore:

| Arma | Danno al secondo con danno base 3, prima (R29) | Ora |
|---|---|---|
| Vulcan | 10,1 | 19,0 |
| Helix | 8,8 | 21,8 |
| Tempest | 9,9 | 20,6 |
| Shredder (nuova) | — | 19,8 |
| C-9 (riferimento) | 6,0 | 6,0 |

  - Il Black Pulse aggiunge un bonus fisso a ogni colpo: con Pyre si arriva a 140/s.
  - Nella finestra di debolezza del boss un colpo frazionario vale almeno 1: il Vulcan fa 128 invece di 30.
  - La Risonanza di Lulù tiene Vega fermo il 53% del tempo (era il 30%); i colpi presi in mediana da Vega scendono da 4 a 0.
- **Stabile, controllato.**
  - Le mosse nuove sono nella fascia delle vecchie: Fendente 4,6/s per bersaglio, contro 4,0 e 4,3.
  - La combo non moltiplica nulla.
  - Il bottino si incassa una volta sola.
  - Nessun forziere è dentro un muro.

## 3. Leggibilità e controlli [SIMULAZIONE, Chromium]

- HUD P1: 158 su 158.
- Schermi piccoli R37: 98 su 98.
- Scritte R4: 9 su 9.
- Tocco: 48 su 48.
- Gamepad: 9 su 9.
- D39 (nessun comando di gioco da tastiera): PASS.
- Il punto debole del boss si legge in parole e con ◆ sulla barra del boss (regola 9), anche a 320×568.
