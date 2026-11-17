# CHRONOS Adventure: Nox & Lulù — MAX STRIKE, audit principale

Data: 16–17 novembre 2026. Ramo: `ccr-022499ad-zq9iu5` → PR #14 verso `work/chronos-adventure-commercial`.
Regola di questo documento (CLAUDE.md, regola 3): **[FATTO]** con la fonte, **[MISURATO]** con il comando, **[SIMULAZIONE]** quando a giocare è un bot o Chromium e non una persona, **[IPOTESI]** con il motivo. Questa versione sostituisce quella caricata con `fbc2a05`, che conteneva cifre non verificate (D81).

## 1. Come è stato organizzato il lavoro

- **[FATTO] Agenti indipendenti veri, non simulati.** Tre revisioni in sola lettura sono state eseguite da agenti separati, con istruzioni scritte e senza poter modificare il repo:
  1. sicurezza e pacchetto Android (ruoli 08 e 09);
  2. combattimento (ruoli 02, 06 e 10);
  3. storia, missioni e monotonia (ruoli 03 e 04).
- **[FATTO] Ruoli simulati in sequenza.** Gli altri ruoli (01 architettura, 05 grafica, 07 audio, 11 direzione) sono stati svolti in sequenza da un solo esecutore, ed è dichiarato qui.
- **[FATTO] Ciò che le revisioni hanno trovato è stato verificato prima di agire, e in un caso le smentiva.** «Non ti ho creata per essere Lia» è rivolta a Lulù, quindi il femminile era giusto; lo ha difeso un test di canone.

## 2. Forensica del repository [FATTO, `git log`, `git merge-base`]

- Il ramo di lavoro è stato riscritto due volte da fuori con un push forzato: prima `0b07afe`, poi `a9e3afd`, un commit senza genitori. R30–R37 era uscito dalla sua storia. Copia di sicurezza: `backup/work-r37-a0815be`.
- `a9e3afd` corrisponde a R29 (`14f5bdc`) più il lavoro di un altro strumento. Dopo è arrivato `fbc2a05`, un commit normale.
- Questa sessione non ha riscritto storia. Ha fatto due merge con due genitori: `acb8e1b`, la base più R30–R37, e `5394e74`, il ramo di lavoro aggiornato.
- Baseline dichiarata «479/479» riprodotta su `a9e3afd`: `npm test` 479 su 479, lint e build riusciti.
- **[MISURATO] Oggi:** `npm test` **520 su 520** (98 file di test); `app.js` **456 320 byte** su una guardia di 458 752.

## 3. Difetti trovati e corretti, per gravità

| Gravità | Difetto (fonte della prova) | Stato |
|---|---|---|
| ALTA | Con «Mira assistita» spenta il colpo andava dove guardava l'eroe, non dove puntava il pollice: regressione della base su D72 (`tools/verify_aim_r28.cjs` 1 su 6) | Corretto, 7 su 7 (`9a5deeb`) |
| ALTA | Il bot di campagna restava fermo al villaggio «moon»: la base chiede di parlare col referente chiave. CI rossa su a, b e c | Corretto nel bot, il gioco non cambia (`c404731`). Campagna a, b e c verde in CI |
| ALTA | Menu: Lulù compariva da sola per circa 0,7 s prima di Nox (D80) | Corretto, scarto di opacità 0,00 in 7 formati |
| MEDIA | I tre frame dell'intro caricati dall'autore non si vedevano | Integrati (D78), 5 formati |
| MEDIA | Scritte in mondo a 6–7 px («CARICO · CAMBIA ATTO/MONDO», «FORZIERE», portale) | 12 px minimo, `labels_r4` PASS |
| MEDIA | Radar dei forzieri sul primo forziere dell'elenco e non sul più vicino; avviso del punto debole sotto la barra del boss («PUNTO D 265/265 SPOSTO»); altezza letta in pixel fisici | Corretto (`bea86f3`), HUD 158 su 158 |
| MEDIA | Missione «below» a ridosso del budget dei fotogrammi con CPU 4× (CI 16,5–18,3 ms contro 16) | Disegno fuori inquadratura tolto, CI verde su `ad8a543` (sezione 8) |
| MEDIA | Monotonia: 9 tappe con lo stesso schema, 9 tappe a dispositivi di fila | Ridotti a 5 e 6 (`e0029f7`) |
| BASSA | `.aistudio/` (18 MB di file temporanei di un altro strumento) nel commit | Tolto dal commit, `.gitignore` completato |

## 4. Aperto, decisioni dell'autore (non prese da chi scrive)

- **Tempi delle armi cambiati da `a9e3afd`, contro la regola 4 e D75.** VX-9 è passata da 0,48 a 0,26 s, le mitragliatrici da 0,44–0,62 a 0,17–0,20 s, la durata dell'azione da 0,26 a 0,18 s. Sono cambiate anche velocità e visione di `port` e `app_node` e la nitro (da 12 a 14/s).
- **Bonus fisso del Black Pulse.** Si somma a ogni colpo: con le mitragliatrici i boss della Parte I cadono in 2–3 s [SIMULAZIONE].
- **Forzieri.** Pagano circa 1,6 volte tutti i nemici.
- **Bonus di «intesa».** Spostano il finale caldo dal 25% all'80% [SIMULAZIONE].
- **Gara di Veyra fuori dal percorso obbligatorio (D05).**
- **Cartelle da chiarire:** `deliveries/`, `src/`, `ref_sheets/`, `public/`, `bun.lock`.
- **Provenienza del JPG** da cui derivano i frame dell'intro.

## 5. Stato di rilascio

`COMMERCIAL_RELEASE = BLOCKED`. Mancano:
- 5 playtest umani (ne sono stati fatti 0);
- una prova su un telefono fisico;
- l'acquisto Play di prova;
- la firma con la chiave di produzione dell'autore.

Nessuna di queste cose si può fare o fingere da qui.
