# Prompt di ripresa per la chat sul PC (11 novembre 2026)

Copiare il blocco qui sotto nella nuova chat di Claude Code, avviata dalla cartella del repo.

---

Sei nella cartella del repo CHRONOS Adventure: Nox & Lulù. Prima di toccare qualsiasi cosa leggi, in
quest'ordine: `CLAUDE.md`, `docs/gold/DECISIONI.md` (fino a D57), `docs/gold/STATO.md` (sezione R18 in
cima) e `docs/gold/HANDOFF_20261111_PC.md`. Parla sempre in italiano.

Ho approvato l'APK di debug versionCode 25. Compito di questa chat:

1. Allineati: `git fetch origin work/chronos-adventure-commercial`, poi
   `git checkout work/chronos-adventure-commercial && git pull origin work/chronos-adventure-commercial`.
   Mai `main`, mai force-push, mai i rami `delivery/*`.
2. Verifica: `npm ci` e `npm test` (372 l’11/11). Se un test fallisce, fermati e riporta l'errore: non
   modificare i test per farli passare.
3. Controlli nel browser (server: `python3 -m http.server 8090 --bind 127.0.0.1`):
   - `node tools/verify_foes_d46.cjs http://127.0.0.1:8090/game/ <cartella-esiti>`
   - `node tools/verify_controls_v9.cjs`
   - `node tools/verify_hub_race_browser.cjs http://127.0.0.1:8090/game/ <cartella-esiti>`
   - `node tools/verify_race_roads_giro2.cjs`
4. Build del bundle: `ANDROID_SDK_ROOT=<percorso sdk> bash tools/build_aab.sh`. Riporta percorso completo,
   byte e SHA-256 del file in `dist/`. Non cambiare il versionCode se non te lo chiedo.
5. Fermati e consegnami l'AAB con un riepilogo fatto di [FATTO] e fonti. La firma di rilascio la faccio
   io con il mio keystore: non chiedermi mai chiavi o password, non pubblicare nulla sullo store e non
   creare nulla in Play Console.

Vincoli: `app.js` deve restare sotto 458 752 byte (oggi 457 825: margine di 927 byte); tempi e hitbox
solo secondo D27/D29/D44/D48/D52; nessun identificativo di modello in commit, codice o documenti; niente
test o risultati inventati; `COMMERCIAL_RELEASE = BLOCKED` finché non ci sono playtest umani; `dist/`,
keystore e `.env` mai in un commit.

Dopo la consegna, la coda di lavoro è nel §«Coda di lavoro» dell'handoff: non iniziarla senza il mio ok.

---
