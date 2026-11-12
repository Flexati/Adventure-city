# Piano per la durata concordata (R20) — rev. 2, 150 minuti — 12 novembre 2026

Parole dell'autore: «fammi tutto il gioco completo, assicurati che duri come ci siamo detti» e, dopo la prima stesura: «Rimandami il piano durata, deve essere di 150 minuti circa».

**Obiettivo corretto: circa 150 minuti attivi** (prima 105–120). Fascia di diagnosi 135–165. Resta una stima: la misura la dà solo chi gioca.

## Dove siamo, misurato

| Voce | Valore | Fonte |
|---|---|---|
| Obiettivo precedente | almeno 105, mediana 120 | `docs/gold/PLAYTEST.md:3` |
| **Obiettivo ora** | **circa 150** | parole dell'autore, 12/11 |
| [SIMULAZIONE] Campagna obbligatoria oggi | rotta A 41,9 min, B 44,5, C 37,9 (modello «probabile») | `docs/evidence/tier1/playtime/PLAYTIME_ESTIMATE.md` |
| Facoltativi (mai sommati) | circa 13 min | stesso rapporto |
| Persone che hanno giocato | 0 | `PLAYTEST.md` |
| **Distanza dall'obiettivo** | **circa 108 minuti** | 150 − 42 |

La stima viene da un bot con orologio virtuale e un modello dichiarato: non è una durata umana. Ma lo scarto
è troppo grande per essere un errore di modello: **oggi il gioco non dura quanto concordato.**

## Come si arriva a 150

I blocchi 1–7 vengono da `docs/gold/NARRATIVA_V10_3_DUE_ORE.md` (arrivano a circa 118). I blocchi 8–11 sono nuovi e colmano gli ultimi 32 minuti. Per ogni blocco: minuti stimati, cosa manca, chi lo sblocca.

| # | Blocco | Minuti | Asset | Stato |
|---|---|---:|---|---|
| 1 | `docks_veyra`: porto a piedi + gara breve obbligatoria (Atto I) | +8 | Gara: ci sono. Parte a piedi: **mancano** mappa del vicolo, oggetti, Veyra a figura intera | Gara di presentazione costruibile subito; il resto aspetta Argon D3 |
| 2 | `promise`: notte nell'officina (Atto II) | +4 | **Mancano** interno dell'officina, motore, mani | Aspetta Argon D4 |
| 3 | `glass_flood` + `glass_reaper` (Atto III, Nox) | +18 | **Manca tutto l'ambiente**; il boss Shadow Reaper ha i fogli a, b, c (manca d) | Aspetta Argon D2 |
| 4 | `vega` (Atto III, Lulù) + armi H-17 e ARC-7 in campagna | +10 | **Manca tutto di Vega**; le armi ci sono | Aspetta Argon D1 |
| 5 | Sezioni d'avvicinamento in 8 missioni a piedi (incontro, persona da aiutare, segreto) | +25 | **Mancano** le 8 mappe, i civili, gli oggetti dei segreti | Aspetta Argon D5 e D6 |
| 6 | Collegamenti narrativi (fiducia, gesso, movente dei boss, Veyra) | +5 | Solo testo | Costruibile subito |
| 7 | Un incarico obbligatorio in più per hub (moon, cathedral) | +6 | Ci sono | Costruibile subito |
| 8 | `bone_tyrant`: missione e boss nel Cathedral Quarter (terzo boss maggiore della Parte I, D23) | +10 | Fogli `bone_tyrant a..d` **già consegnati, non applicati**; **manca** l'arena | Fogli pronti; arena in Argon D7 |
| 9 | `forge_behemoth`: missione e boss nel Toxic Slum Bazaar (D23) | +10 | Fogli a, c, d consegnati; **manca `forge_behemoth_b`** (golem di bronzo) e l'arena | Aspetta Argon D7 |
| 10 | Secondo incarico obbligatorio in tutti e quattro gli hub (moon, cathedral, toxic, clockwork) | +8 | Ci sono | Costruibile subito |
| 11 | Serie Vortex: due gare obbligatorie nel corso della campagna (Solkara e Aurelia, con nitro) invece che solo facoltative | +6 | Strade e auto ci sono | Costruibile subito (decisione D05 va superata: la scelta è dell'autore, vedi sotto) |
| | **Totale** | **+108** | | 42 + 108 = **150** |

Senza Argon si costruiscono subito i blocchi 6, 7, 10, 11 e la gara del blocco 1: circa **+27 minuti** (≈ 69). Con i fogli dei boss già consegnati (blocco 8, parte giocabile) si sale verso 75.
Il resto, circa 75 minuti, dipende da 40 immagini e 26 suoni: `requests/argon-durata-due-ore-20261112/README.md`.
Generarli in proprio darebbe figure geometriche, già rifiutate una volta (165 immagini del giro 1): non si fa.

## Vincolo di peso

`app.js` ha 4 027 byte di margine sotto la guardia di 458 752. Le tappe nuove costano, a stima, 45–65 mila
byte fra dati, testi italiani e inglesi. I testi inglesi sono già fuori da `app.js` (R20-a): margine **65 127 byte**, al limite per 150 minuti. Se non basta, il passo successivo è spostare in un file dati anche i testi italiani delle tappe (`story-v08`, `missions`). La guardia non si alza.

## Ordine dei lavori

1. **R20-a** Testi inglesi fuori da `app.js` (prove di lingua, `qa:labels`, APK).
2. **R20-b** Blocchi 6, 7, 10, 11 e gara di presentazione; nuova stima con i tre giri automatici.
3. **R20-c…h** Una tappa per ogni gruppo di Argon che arriva completo: Bone Tyrant (fogli già qui), Vega (D1), Glass Flood (D2), porto (D3), promessa (D4), Forge Behemoth (D7).
4. **R20-g** Avvicinamenti (D5, D6), due missioni alla volta.
5. A ogni passo: `npm test`, controlli nel browser, `tools/estimate_playtime.mjs`, riga in `PLAYTEST.md`.

## Da decidere dall'autore

- **Blocco 11:** rendere obbligatorie due gare Vortex cambia D05 (le gare erano facoltative per non toccare i salvataggi). Si può fare con migrazione sicura; alternativa: gare facoltative con una ricompensa così buona che il giocatore le fa (meno minuti garantiti).
- **Blocchi 8 e 9:** due boss in più della Parte I, già dentro D23, ma ogni boss è una scelta di ritmo e difficoltà.

Se l'autore non risponde, si costruisce il blocco 11 con le gare obbligatorie (D59: scelta tecnica) e il ritmo dei boss resta quello di D63.

La durata vera la misura solo una persona: i cinque playtest restano la condizione del rilascio.
