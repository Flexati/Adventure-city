# Misura dopo i collegamenti narrativi V10.3 — ESTIMATE_NOT_HUMAN

`COMMERCIAL_RELEASE = BLOCKED`. Nessuna persona ha giocato questa build: i valori sono stime ricavate dai giri automatici.

## Metodo

- **Giri:** tre giri automatici completi (A, B, C) con `CITY_VIRTUAL_TIME=1`, con lo stesso browser (`/opt/pw-browsers/chromium`) e lo stesso verificatore, su due versioni:
  - **base** `35a606d`: prima delle battute nuove;
  - **dopo** `94dba2c`: con echi, righe dei boss, registro, epilogo di Veyra e promessa.
- **Modello:** `tools/estimate_playtime.mjs`, invariato.
- **Confrontabilità:** la stima del 2026-10-31 in `docs/evidence/v10.2/playtime` era stata misurata con `chrome-headless-shell`, che in questo ambiente non c'è più. Il suo tempo di combattimento non è confrontabile con queste misure.
- **Tutti i giri:** PASS 31 tappe, 8 incarichi, 2 preparazioni, finale completo, zero errori di pagina.

## Risultato (modello probabile, minuti)

| Rotta | Base | Dopo | Lettura base → dopo | Ritentativi del bot (base / dopo) |
|---|---:|---:|---:|---:|
| A | 40,2 | 35,3 | 21,7 → 22,3 | 5 / 0 |
| B | 37,2 | 38,3 | 20,9 → 22,8 | 2 / 1 |
| C | 35,0 | 36,9 | 20,8 → 22,9 | 1 / 1 |

## Lettura onesta

- **Effetto della narrativa:** circa +1 a +2 minuti di lettura e di scelte per rotta, soprattutto sul tetto (da 42 s a 110 s, rotta A) e nel ricongiungimento (da 26 s a 51 s).
- **Rotta A:** il calo viene dai 5 ritentativi del bot nella base contro 0 dopo. È rumore del bot, non un effetto delle modifiche.
- **Rumore:** la differenza fra due giri dello stesso codice (±3–5 min sul combattimento) è più grande dell'aggiunta narrativa. Questa misura serve a mostrare l'ordine di grandezza; i minuti veri richiedono il playtest con persone.
- **Stato rispetto all'obiettivo:** la campagna probabile resta intorno a 35–40 minuti. I 120 minuti dipendono dalle tappe nuove con le tavole GPT (Glass Flood, Reaper, Vega, porto di Veyra) e dall'allungamento delle missioni (4.7).
