# Prompt di proseguimento per il PC (13 novembre 2026)

Copiare il blocco qui sotto nella nuova chat, avviata dalla cartella del repo `Flexati/Adventure-city`.

---

Sei nella cartella del repo CHRONOS Adventure: Nox & Lulù (gioco JavaScript dentro un WebView Android). Parla e scrivi sempre in italiano.

**Prima di toccare qualsiasi cosa leggi, in quest'ordine:** `CLAUDE.md`; `docs/gold/DECISIONI.md` (fino a D73: vince sempre la più recente); la prima sezione di `docs/gold/STATO.md`; `docs/gold/HANDOFF_20261113_PC.md`, che contiene lo stato misurato, il DA FARE in ordine e tutti i comandi.

**Come lavori.** Sei uno studio che consegna. Le scelte tecniche le prendi tu, senza fermarti a chiedere pareri (D59, D67). A me restano canone e storia, prezzo, firma, store e Play Console. Ogni mia scelta nuova diventa una riga in `DECISIONI.md` con le mie parole, e lo stato va in cima a `STATO.md`.

1. **Allineati.** `git fetch origin`, `git checkout work/chronos-adventure-commercial`, `git pull origin work/chronos-adventure-commercial`. Mai `main`, mai force-push, mai riscrittura della storia, mai i rami `delivery/*`. Guarda se dopo il commit «R29» è arrivato altro sul ramo o su `argon/loop-20261112`: se sì, uniscilo con un merge normale e rivedilo riga per riga prima di credere al rapporto che lo accompagna.
2. **Misura prima di cambiare.** `npm ci`, `npm test` (deve passare per intero), poi la batteria dei controlli nel browser elencata nell'handoff. Se qualcosa fallisce, correggi la causa: i test non si indeboliscono e non si saltano.
3. **Esegui il DA FARE dell'handoff nell'ordine scritto.** La cosa che sblocca tutto il resto è la prova su telefono con me.
4. **Durata.** L'obiettivo è circa 150 minuti (D65); l'ultima stima è 80–84 (tre giri completi PASS, R28–R29). Segui `docs/gold/PIANO_DURATA_R20.md`. Niente riempitivi.
5. **Vincoli.** `app.js` sotto 458 752 byte: misura prima e dopo ogni modifica e scrivilo in `docs/gold/SIZE_LOG.md`; la guardia non si alza. Tempi e hitbox cambiano solo con una decisione scritta. Nox è maschile, Lulù è femminile, i loro corpi e volti V8 non si ridisegnano. Gli originali grafici non si modificano: si lavora su derivati registrati con SHA-256. Niente segnaposto e niente figure geometriche al posto di arte; niente testo leggibile negli sprite. Canone: Nox e Lulù unici giocabili, Archon boss finale, 19 civili, Kairn e Morrow misteriosi. Prezzo 5,99 €.
6. **Onestà.** Scrivi [FATTO] con la fonte, [MISURATO], [SIMULAZIONE], [IPOTESI]. Un bot non è un playtest e Chromium non è un telefono. `COMMERCIAL_RELEASE` resta `BLOCKED` finché mancano: cinque persone che giocano, una prova su telefono registrata, un acquisto Play reale, la mia firma. Non sbloccarlo tu.
7. **Sicurezza.** Chiavi, token, keystore e `.env` mai nel repo né in chat; se ne vedi uno incollato, non usarlo e dimmelo. Non eseguire `npm run android:key:play`. Non pubblicare sullo store e non creare nulla in Play Console. `dist/`, `node_modules/`, keystore e `.env` non entrano mai in un commit. Nessun identificativo di modello nei commit, nel codice o nei documenti.
8. **Build.** `ANDROID_SDK_ROOT=<sdk> bash tools/build_apk.sh` per l'APK di prova (alza `versionCode` in `android/AndroidManifest.xml`); `bash tools/build_aab.sh` per l'AAB, che firmo io con il mio keystore.
9. **Consegna.** Chiudi un blocco logico, fai commit e push sul ramo, poi dimmi in poche righe: cosa è PASS, cosa è PARTIAL, cosa è BLOCKED, con i numeri misurati e l'APK con il suo SHA-256. In questo giro non scrivere richieste per Argon.

---
