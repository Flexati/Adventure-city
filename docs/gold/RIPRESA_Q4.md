# CHRONOS — Handoff e punto di ripresa dopo Q4 (4 novembre 2026)

Questo file serve a una sessione fredda: nessuna memoria della chat, nessuno scratchpad. Si legge dopo [`CLAUDE.md`](../../CLAUDE.md) e prima di toccare qualsiasi cosa. Sostituisce [`RIPRESA_Q1.md`](RIPRESA_Q1.md) come punto di ripresa; quel file resta valido per la sezione D (13 punti aperti).

Legenda: **[FATTO]** = verificato con una fonte (file, riga, comando, rapporto); **[IPOTESI]** = non verificato, con il motivo.

---

## A. Punto di ripresa

| Voce | Valore | Fonte |
| --- | --- | --- |
| Repo e ramo | Flexati/Adventure-city, `work/chronos-adventure-commercial` (mai `main`, mai force-push) | `CLAUDE.md` |
| Commit di questa giornata | `1832c64` Q2 · `8f9fbfe` M5 · `8bfb4b4` M3 · `185428e` Q3–Q4 · il commit di questo file | `git log --oneline` |
| Test | `npm test` **317/317** | [`STATO.md`](STATO.md), sezione Q3–Q4 |
| `app.js` | **444 018** byte su 524 288 (margine **80 270**) | `python3 tools/prepare_android_assets.py` |
| Prestazioni | `qa:performance` completo PASS: p95 massimo 7,0 ms (CPU ×1), 11,4 ms (CPU ×4) | [`../evidence/q4/performance-full.json`](../evidence/q4/performance-full.json) |
| Ultima decisione | **D37** («finisci il gioco»): si va avanti con ciò che non dipende da dati dell'autore | [`DECISIONI.md`](DECISIONI.md) |
| Stato | `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane | [`PLAYTEST.md`](PLAYTEST.md) |

## B. Cosa è fatto (4 novembre 2026)

- **Q2 (D35 priorità 2–3):** cerchi delle minacce tratteggiati e poi pieni al blocco, anello fermo con movimento ridotto, doppio bordo sullo shift di Nox, vibrazione su Perfect Dodge e colpo subito. Hitbox e tempi invariati.
- **M5:** prezzo 5,99 € in tutti i documenti vivi; test contro il ritorno del 4,99.
- **M3:** demo fino a «La firma», attiva **solo** se esiste il ponte Android `window.ChronosBilling` (contratto in STATO, sezione M3); «Gioca l'altra rotta» con registro delle sole scelte prese.
- **Q3:** `app.js` −81 372 byte (manifest degli sprite snello solo nel pacchetto Android; test di equivalenza).
- **Q4 (D34):** schermata Opzioni a 4 schede (Audio con volumi, Accessibilità con testo grande, Controlli, Crediti); `npm run qa:options` 10 controlli.
- **Priorità 4:** misurata, nessun intervento necessario (nessuna misura sopra 16 ms). Limite: Chromium headless, non un telefono.

## C. Cosa resta, in ordine

1. **M4, acquisto Play Billing.** Serve dall'autore il **billing product ID** creato in Play Console. Poi: guscio Android che espone `ChronosBilling` (`isUnlocked`, `price`, `purchase`, risposta `chronosBillingResult(ok)`), libreria Play Billing nel build senza Gradle, prova su telefono con account di test. Niente Play Console senza ok scritto (regola 2).
2. **M7, «Otto mesi dopo».** Prima una proposta riga per riga da far approvare; `game/story-v08.mjs` non si tocca prima del via.
3. **M6, i 4 boss nuovi.** Aspetta le immagini GPT (`requests/gpt-boss-v2-20261102/README.md`).
4. **Finitura (D35 priorità 5), senza dati dell'autore:** transizioni fra schermate, coerenza dei pulsanti fra menù, pausa e finale; versione dell'app nei Crediti (oggi assente: va presa da `versionName`, non scritta a mano).
5. **Difetto preesistente:** `tools/verify_locale_browser.cjs` si aspetta «RESIDENT» e trova «SYSTEM» nella prima battuta di `exp_chalk_marks`. Chiedere all'autore quale testo è voluto.
6. **M1:** prove sul telefono con le liste di [`PLAYTEST.md`](PLAYTEST.md) (sezioni Q2, M3, Q4).
7. **Build:** gli APK/AAB del 4 novembre sono di **prima** di Q3–Q4. L'AAB per lo store lo costruisce solo l'autore con `npm run android:aab:play` e la chiave `chronos-upload` (fingerprint in `tools/build_play_aab.sh`).

## D. Ambiente

- Sul PC dell'autore: `verifica.sh` e la skill pantheon ci sono. In un container cloud: Android SDK da scaricare (`/opt/android-sdk`, platforms 35 e 36, build-tools 35.0.0 e 36.0.0), Chromium preinstallato da passare con `CHROMIUM=<percorso>`.
- Server per le prove: `python3 -m http.server 8090 --bind 127.0.0.1` dalla radice del repo. Le uscite delle prove vanno **fuori** dal repo.
- `qa:performance` legge l'impronta del codice: non modificare `game/*.mjs` mentre gira (circa 45 minuti per il profilo completo).

## E. Prompt di continuazione (da incollare in una nuova chat)

```text
Riprendiamo CHRONOS Adventure. Sei nel repo Flexati/Adventure-city, ramo work/chronos-adventure-commercial.
Le regole sono in CLAUDE.md e valgono anche ora. Parla in italiano.

Prima di fare qualsiasi cosa:
1. git pull origin work/chronos-adventure-commercial e dimmi il commit in cima.
2. Leggi docs/gold/RIPRESA_Q4.md, la prima sezione di docs/gold/STATO.md e le righe D34–D37 di docs/gold/DECISIONI.md.
3. Lancia npm test e dimmi quanti test passano (atteso: 317/317).
4. Dimmi in 3 righe dove eravamo e quale è il prossimo passo.

Non modificare file finché non ti do l'ok.

Dati che ti do adesso (compila prima di incollare):
- Billing product ID per M4: ______ (se vuoto, M4 resta fermo)
- M7: [ ] prepara la proposta riga per riga  [ ] aspetta
- M6: immagini GPT dei boss consegnate sul ramo delivery/______ (se vuoto, M6 resta fermo)
- Testo voluto per la prima battuta di exp_chalk_marks: [ ] RESIDENT  [ ] SYSTEM

Lavora a milestone: a ogni chiusura npm test intero, prove nel browser dell'area, commit, push,
riepilogo con [FATTO]/[IPOTESI] e numeri, poi fermati per il mio feedback.
Niente store né Play Console senza un mio ok scritto. Nessuna chiave nel repo o in chat.
```
