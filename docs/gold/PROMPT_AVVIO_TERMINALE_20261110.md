# Prompt di avvio per la chat di Claude Code sul terminale (10 novembre 2026)

Copiare tutto il blocco qui sotto nella nuova chat, avviata dalla cartella del repo.

---

Sei nella cartella del repo CHRONOS Adventure: Nox & Lulù. Prima di toccare qualsiasi cosa leggi,
in quest'ordine: `CLAUDE.md`, `docs/gold/DECISIONI.md` (fino a D53), `docs/gold/STATO.md` (sezione
R15 in cima) e `docs/gold/HANDOFF_20261110_TERMINALE.md`. Parla sempre in italiano.

Compito di questa chat: produrre l'APK di debug e il bundle AAB aggiornati, senza nessun altro
sviluppo se non te lo chiedo io.

1. Allineati: `git fetch origin work/chronos-adventure-commercial` poi
   `git checkout work/chronos-adventure-commercial && git pull origin work/chronos-adventure-commercial`.
   L'HEAD atteso è `5c2096e` o un commit successivo. Mai `main`, mai force-push, mai i rami `delivery/*`.
2. Verifica: `npm ci` e `npm test` — devono passare tutti (366 al 10/11). Se uno fallisce, fermati
   e riporta l'errore: non «aggiustare» i test per farli passare.
3. Controlli browser dell'area gare (server: `python3 -m http.server 8090 --bind 127.0.0.1`):
   - `node tools/verify_racing_v9.cjs http://127.0.0.1:8090/game/v9-race-lab.html <cartella-esiti>`
   - `node tools/verify_race_roads_giro2.cjs`
   - `node tools/verify_race_modes_browser.cjs http://127.0.0.1:8090/game/ <cartella-esiti>`
   - `node tools/verify_hub_race_browser.cjs http://127.0.0.1:8090/game/ <cartella-esiti>`
4. Porta `android:versionCode` da 22 a **23** in `android/AndroidManifest.xml`. Non toccare altro.
5. Build con l'SDK locale:
   - `ANDROID_SDK_ROOT=<percorso sdk> bash tools/build_apk.sh`
   - `ANDROID_SDK_ROOT=<percorso sdk> bash tools/build_aab.sh`
   Riporta per ciascun file di `dist/`: percorso completo, byte e SHA-256.
6. Commit del solo versionCode, messaggio chiaro in italiano, poi
   `git push -u origin work/chronos-adventure-commercial`. `dist/`, keystore e `.env` non entrano mai
   in un commit.
7. Fermati e consegnami APK, AAB e un riepilogo con [FATTO] e fonti. La firma di rilascio dell'AAB
   la faccio io con il mio keystore: non chiedermi mai chiavi o password in chat, non pubblicare
   nulla sullo store e non creare nulla in Play Console.

Vincoli che non si discutono: `app.js` ≤ 458 752 byte (guardia); tempi e hitbox solo secondo
D27/D29/D44/D48/D52; nessun identificativo di modello in commit, codice o documenti; niente test o
risultati inventati; `COMMERCIAL_RELEASE = BLOCKED` finché non ci sono playtest umani.

Dopo la consegna delle build, la coda di lavoro possibile è nel §«Coda di lavoro» di
`HANDOFF_20261110_TERMINALE.md`: non iniziarla senza il mio ok.

---
