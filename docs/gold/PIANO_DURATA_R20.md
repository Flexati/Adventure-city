# Piano per la durata concordata (R20) — 12 novembre 2026

Parole dell'autore: «fammi tutto il gioco completo, assicurati che duri come ci siamo detti».

## Dove siamo, misurato

| Voce | Valore | Fonte |
|---|---|---|
| Obiettivo | almeno 105 minuti attivi, mediana di progetto circa 120 | `docs/gold/PLAYTEST.md:3` |
| [SIMULAZIONE] Campagna obbligatoria oggi | rotta A 41,9 min, B 44,5, C 37,9 (modello «probabile») | `docs/evidence/tier1/playtime/PLAYTIME_ESTIMATE.md` |
| Facoltativi (mai sommati) | circa 13 min | stesso rapporto |
| Persone che hanno giocato | 0 | `PLAYTEST.md` |
| **Distanza dall'obiettivo** | **circa 63 minuti** | 105 − 42 |

La stima viene da un bot con orologio virtuale e un modello dichiarato: non è una durata umana. Ma lo scarto
è troppo grande per essere un errore di modello: **oggi il gioco non dura quanto concordato.**

## Come si arriva a 105–120 (piano già scritto, ora approvato dalle parole sopra)

Da `docs/gold/NARRATIVA_V10_3_DUE_ORE.md`. Per ogni blocco: minuti stimati, cosa manca, chi lo sblocca.

| # | Blocco | Minuti | Asset | Stato |
|---|---|---:|---|---|
| 1 | `docks_veyra`: porto a piedi + gara breve obbligatoria (Atto I) | +8 | Gara: ci sono. Parte a piedi: **mancano** mappa del vicolo, oggetti, Veyra a figura intera | Gara di presentazione costruibile subito; il resto aspetta Argon D3 |
| 2 | `promise`: notte nell'officina (Atto II) | +4 | **Mancano** interno dell'officina, motore, mani | Aspetta Argon D4 |
| 3 | `glass_flood` + `glass_reaper` (Atto III, Nox) | +18 | **Manca tutto l'ambiente**; il boss Shadow Reaper ha i fogli a, b, c (manca d) | Aspetta Argon D2 |
| 4 | `vega` (Atto III, Lulù) + armi H-17 e ARC-7 in campagna | +10 | **Manca tutto di Vega**; le armi ci sono | Aspetta Argon D1 |
| 5 | Sezioni d'avvicinamento in 8 missioni a piedi (incontro, persona da aiutare, segreto) | +25 | **Mancano** le 8 mappe, i civili, gli oggetti dei segreti | Aspetta Argon D5 e D6 |
| 6 | Collegamenti narrativi (fiducia, gesso, movente dei boss, Veyra) | +5 | Solo testo | Costruibile subito |
| 7 | Un incarico obbligatorio in più per hub (moon, cathedral) | +6 | Ci sono | Costruibile subito |
| | **Totale** | **+76** | | 42 + 76 ≈ 118 |

Senza Argon si costruiscono subito i blocchi 6, 7 e la gara del blocco 1: circa **+13 minuti** (≈ 55).
Il resto, circa 63 minuti, dipende da 38 immagini e 24 suoni: `requests/argon-durata-due-ore-20261112/README.md`.
Generarli in proprio darebbe figure geometriche, già rifiutate una volta (165 immagini del giro 1): non si fa.

## Vincolo di peso

`app.js` ha 4 027 byte di margine sotto la guardia di 458 752. Le tappe nuove costano, a stima, 30–45 mila
byte fra dati, testi italiani e inglesi. Prima di costruirle si spostano i testi inglesi (~55 000 byte) in un
file dati caricato all'avvio: è la riserva già scritta in `docs/gold/SIZE_LOG.md`. La guardia non si alza.

## Ordine dei lavori

1. **R20-a** Testi inglesi fuori da `app.js` (prove di lingua, `qa:labels`, APK).
2. **R20-b** Blocchi 6 e 7 e gara di presentazione; nuova stima con i tre giri automatici.
3. **R20-c…f** Una tappa per ogni gruppo di Argon che arriva completo: Vega (D1), Glass Flood (D2), porto (D3), promessa (D4).
4. **R20-g** Avvicinamenti (D5, D6), due missioni alla volta.
5. A ogni passo: `npm test`, controlli nel browser, `tools/estimate_playtime.mjs`, riga in `PLAYTEST.md`.

La durata vera la misura solo una persona: i cinque playtest restano la condizione del rilascio.
