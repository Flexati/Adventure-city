# CHRONOS V10.2: cosa resta da generare con Manus

Verifica del 1 novembre 2026. Ho confrontato i file presenti davvero su GitHub, controllando lo SHA-256 di ciascuno, con il manifesto dei 623 PNG attesi dai 310 prompt canonici (checkpoint 083).

- Ramo di backup `backup/chronos-v10-2-recovery-20261031`, commit `447a0d2`.
- Ramo di consegna `delivery/gpt-preproduzione-310-20261029`, commit `1a88b8f`.

## 1. Stato reale

| Voce | Numero |
|---|---:|
| PNG attesi | 623 |
| **PNG presenti su GitHub, SHA identico al manifesto dei 296** | **271** |
| PNG che esistono nei 3 ZIP del recupero ma **non** sono su GitHub | 25 |
| PNG mai generati | 327 |
| ...di cui da far generare a **Manus** | **321** |
| ...di cui **non** da Manus: tavole di Nox e Lulù, composte dagli sheet reali V8 | 6 |

Per prompt, sui 310:
- 118 COMPLETE;
- 5 PARTIAL;
- 187 MISSING.

Nessuna tavola è APPROVED: tutte restano QA_PENDING.

**Correzione importante.** L'altra chat diceva che i 26 PNG mancanti erano stati caricati e che quindi tutti i 296 erano su GitHub. Non è vero. Ne è arrivato uno solo, `enemy_breaker/v03_vfx.png` (commit `447a0d2`). Gli altri 25 sono ancora soltanto negli ZIP:
- 3 per Aurelia 04: notte, evento, props;
- 15 per Solkara;
- 7 per Breaker ed Echo.

## 2. Contenuto della cartella

| File | A cosa serve |
|---|---|
| `TUTTI_I_PROMPT_DA_FARE.md` | I 176 prompt da dare a Manus, in un unico file e in ordine di ondata. Il testo è identico all'originale. In testa a ogni prompt c'è l'elenco dei file da generare e di quelli già fatti |
| `prompt/NNN_asset.md` | Gli stessi 176 prompt, uno per file |
| `riferimenti/` | Le 8 immagini da allegare: ogni prompt dice quali usare |
| `ELENCO_FILE_DA_FARE.csv` | Una riga per ogni PNG: ondata, nome del file, cartella di consegna, allegati da usare. Le righe con ondata 0 vanno recuperate dagli ZIP, quelle con ondata T non vanno a Manus |
| `STATO_310_PROMPT.csv` | Lo stato di ciascuno dei 310 prompt |
| `STATO_623_PNG_VERIFICATO.csv` | I 623 percorsi attesi, con SHA-256, byte e dimensioni dei file presenti |

## 3. Ordine di lavoro

| Ondata | Cosa | PNG |
|---|---|---:|
| 0 | **Prima di tutto cerca i 3 ZIP** `CHRONOS_V10_2_RECUPERO_296_PNG_PARTE_1/2/3_DI_3.zip`. Se li ritrovi, mandameli e carico io i 25 file: non rigenerarli | 25 |
| 1 | Personaggi (NPC e comprimari: Dario, Elena, Mara, Vesper e gli altri) | 102 |
| 2 | Nemici | 58 |
| 3 | Boss | 117 |
| 4 | Abilità (effetti visivi) | 44 |
| T | Nox e Lulù: **non a Manus**. Le compongo io dagli sheet reali, per la regola che vieta di ridisegnare corpo e volto V8 | 6 |

## 4. Regole per Manus

1. **Un prompt alla volta.** Allega le immagini di `riferimenti/` indicate nella riga «Allegati».
2. **Nomi e dimensioni esatti**, come scritto nel prompt:
   - le tavole 1536×1024;
   - i ritratti 1536×512;
   - gli sprite e i VFX secondo la sezione 7 del prompt.
3. **Sfondo verde pieno #00FF00** dove il prompt lo chiede: niente trasparenza finta, niente scacchiera.
4. **Notte, evento e varianti si ottengono modificando l'immagine base**, mai rigenerandola: la geometria deve restare identica.
5. **Niente testo leggibile, loghi, marchi, numeri di gioco o stili di altre opere.**
6. **Nessun file segnato «già su GitHub» va rifatto.**
7. **Consegna:** uno ZIP per ondata, con i percorsi esatti della colonna `cartella_consegna`. Esempio: `deliveries/gpt-preproduzione-310-20261029/boss/boss_vega/v01.png`.

## 5. Dopo la consegna

Quando mi mandi gli ZIP di Manus:
- controllo formato, dimensioni, verde, geometria delle varianti e coerenza con i riferimenti;
- calcolo lo SHA-256;
- carico su GitHub, sul ramo di backup, a gruppi verificati, senza toccare `main`.

Avere i file su GitHub non vuol dire che siano approvati: QA artistico ancora da fare.

`ASSET_PRODUCTION = IN_PROGRESS` · `COMMERCIAL_RELEASE = BLOCKED`
