# Prompt di ripresa per la chat sul PC (12 novembre 2026)

Copiare il blocco nella nuova chat di Claude Code, avviata dalla cartella del repo.

---

Sei nella cartella del repo CHRONOS Adventure: Nox & Lulù. Parla sempre in italiano. Prima di toccare qualsiasi cosa leggi, in quest'ordine: `CLAUDE.md`, `docs/gold/DECISIONI.md` (fino a D60), `docs/gold/STATO.md` (sezioni R19 in cima) e `docs/gold/HANDOFF_20261112_PC.md`: lì c'è dove trovare ogni cosa e l'elenco del DA FARE.

Come lavori: sei uno studio che consegna. Ho già detto (D59) che le scelte tecniche le prendi tu senza fermarti a ogni milestone. A me restano canone e storia, prezzo, firma, store e i numeri di bilanciamento che cambiano la difficoltà (proponili tu, io approvo). Ogni cosa nuova va in `DECISIONI.md` con le mie parole.

1. Allineati: `git fetch origin work/chronos-adventure-commercial delivery/argon-asset-giro2-20261110`, `git checkout work/chronos-adventure-commercial && git pull origin work/chronos-adventure-commercial`. Mai `main`, mai force-push, mai i rami `delivery/*`. Controlla se Argon ha pubblicato qualcosa dopo `f21e19d`.
2. `npm ci`, `npm test` (404 su 404 al commit di handoff). Se un test fallisce, fermati e riporta l'errore; non indebolire i test.
3. Esegui il **DA FARE** dell'handoff nell'ordine scritto (1→15). Per ogni punto: prova che fallisce prima, correzione, test, controllo nel browser dell'area (server `python3 -m http.server 8090 --bind 127.0.0.1`; Chromium in `/opt/pw-browsers/chromium-*/chrome-linux64/chrome` nel container, sul PC usa il tuo), commit. Chiudi un blocco logico, riassumi, continua.
4. Vincoli: `app.js` sotto 458 752 byte (oggi 454 466, margine 4 286: **misura prima e dopo ogni modifica** e scrivila in `docs/gold/SIZE_LOG.md`; la guardia non si alza e non si bypassa); preferisci asset e CSS al codice. Tempi e hitbox solo secondo D27/D29/D44/D48/D52, salvo le modifiche che ti chiedo qui sopra e che registri come nuove decisioni. Nox maschile, Lulù femminile, i loro corpi V8 non si ridisegnano. Niente testo leggibile negli sprite. Niente segnaposto al posto di arte mancante: se manca, lo scrivi come richiesta per Argon.
5. Prima richiesta a me, in una sola risposta: i numeri proposti per boss più duri e gare più varie (sono i soli punti in cui non decidi da solo).
6. Build: `ANDROID_SDK_ROOT=<sdk> bash tools/build_apk.sh` e `bash tools/build_aab.sh` (versionCode da alzare a 28 per il prossimo APK). La firma di rilascio la faccio io con il mio keystore: non chiedermi mai chiavi o password, non pubblicare sullo store, non creare nulla in Play Console, non eseguire `npm run android:key:play`.
7. Onestà: [FATTO] con fonte, [IPOTESI], [MISURATO], [SIMULAZIONE]. Un bot non è un playtest. `COMMERCIAL_RELEASE = BLOCKED` finché non ci sono playtest umani, prova su telefono, acquisto Play reale e firma mia. Nessun identificativo di modello nei commit, nel codice o nei documenti. `dist/`, keystore e `.env` mai in un commit.
8. Consegna l'APK di prova solo quando hai finito un blocco completo (l'ultimo mi è arrivato troppo presto). Alla fine: elenco di cosa è PASS / PARTIAL / BLOCKED, APK e AAB con SHA-256, e il documento `AUDIT_DIFETTI_R19.md`.

---
