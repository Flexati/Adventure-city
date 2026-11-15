# Passaggio di consegne per il PC — 11 novembre 2026

Sostituisce `HANDOFF_20261110_TERMINALE.md`, che resta come cronologia. Il prompt da incollare nella nuova
chat è in `docs/gold/PROMPT_RIPRESA_PC_20261111.md`. Le regole fisse sono in `CLAUDE.md`.

## Dove siamo

- **Ramo:** `work/chronos-adventure-commercial`. Lo stato è la sezione **R19 · milestone 2** in cima a `docs/gold/STATO.md`;
  l'ultima decisione è **D59**.
- **Test:** `npm test` 382 su 382.
- **Browser, tutti PASS l'11/11:** `verify_foes_d46.cjs` (13 luoghi), `verify_controls_v9.cjs`,
  `verify_hub_race_browser.cjs`, `verify_race_roads_giro2.cjs`.
- **app.js:** 453 445 byte. La guardia è 458 752: **restano 5 307 byte** (`docs/gold/SIZE_LOG.md`). Ogni aggiunta al codice va
  compensata; il limite duro è 524 288.
- **Build:** APK di debug versionCode **26** (R19), fatto in chat e mandato all'autore: sostituisce il v25.
  L'AAB non è stato fatto: si fa sul PC dopo l'approvazione.
  **Attenzione:** dopo il v25 sono entrate le modifiche di R19 (peso del bundle, apertura in orizzontale). Un APK o
  un AAB costruito da questo ramo non è più identico al v25: va fatto con versionCode 26 e riprovato.
- **Stato commerciale:** `COMMERCIAL_RELEASE = BLOCKED`, zero playtest umani.

## Cosa c'è nel gioco, in breve

- **Lavoro di Argon integrato (43 derivati):** 15 interni in prima persona, 8 ritratti, 8 strade di gara
  (Solkara e Aurelia), auto Vortex del giocatore, 6 fogli nemici (tre della Gang dei Relè, scarabeo della
  breccia, infermiere infetto, guardia del porto), 4 schede degli atti, la cornice dei pannelli.
  Registri in `assets/production/v10.3/derived/`: `REGISTRO_ARGON_20261109.json`,
  `REGISTRO_ARGON_GIRO2_20261110.json`, `REGISTRO_ARGON_GIRO3_20261111.json`. Esiti: i tre file
  `docs/gold/CONSEGNA_ARGON_*_ESITO.md`; il terzo elenca ciò che resta fuori e perché.
- **Gare:** 26 gare con strada dipinta, medaglie a tre fasce, schegge di luce, riparazione ai checkpoint (D50).
- **Lavoro dell'altra sessione (commit `2acb4ae`, `aaebba7`, `baa684b`):** intro in prima persona, Kairn e
  Morrow, log dei battiti, guida in orizzontale con strada al 52 %, vita nei villaggi. Passa i test; non è
  stato riletto riga per riga dalla sessione che ha scritto questo documento.

## Sul PC, dopo l'approvazione dell'APK

1. Allinearsi al ramo e verificare (`npm ci`, `npm test`).
2. `ANDROID_SDK_ROOT=<sdk> bash tools/build_aab.sh` → AAB in `dist/`. Se serve anche un APK nuovo,
   alzare prima il versionCode a 26.
3. La **firma di rilascio** la fa l'autore con il suo keystore locale. Keystore, chiavi e password non
   entrano mai nel repo né in chat. Niente store e niente Play Console senza la sua autorizzazione.
4. `dist/` non si committa.

## Coda di lavoro

1. **Interfaccia premium (gruppo U, già consegnato e accettato):** tagliare le 8 tavole e applicarle a
   pulsanti, cornici, icone, HUD e medaglie, una schermata alla volta, con prove al tocco in ogni formato.
2. **Resto di Argon:** `shadow_reaper_d`, `forge_behemoth_b` rifatto, poi i gruppi M, V, G, F (elenco in
   `STATO_CODA.md` sul ramo di consegna). Alla consegna: prima verificare che il ramo sia avanzato (D57),
   poi controllo immagine per immagine, derivazione con registro, un test per gruppo.
3. **Boss, terreni, palazzi, oggetti** già accettati: entrano con la logica dei boss (D23) e con il ridisegno
   delle mappe.
4. **R6 / D39:** via i comandi da tastiera delle azioni di gioco. I verificatori browser guidano con la
   tastiera: vanno aggiornati nello stesso giro.
5. **Peso di app.js:** 5 307 byte di margine dopo il primo giro di riduzione; la riserva è spostare i testi inglesi in un file dati (`SIZE_LOG.md`).
6. **Suoni:** Argon non ha un modello audio; piano in `docs/gold/AUDIO_PLAN_V10_3.md`.
7. **M1 playtest umani** (il blocco vero della release) e **M4 product ID billing**.

## Decisioni aperte per l'autore

- Solkara e Aurelia si corrono nel laboratorio gare; nella campagna il Vortex offre solo Ash Docks
  (`HUB_RACES` in `game/hubs.mjs`). Serie completa di 7 anche nella campagna?
- Il colosso della gang (`gang_brute_a` + `_b`) è pronto ma senza ondata: sostituisce `desert_chrono_fighter`
  in «La città senza di te», o aspetta una missione nuova?

## Sicurezza

- Due token `ghp_…` sono stati incollati in chat (uno il 10/11): **mai usati**. Vanno revocati su GitHub.
- Mai `main`, mai force-push, mai i rami `delivery/*`; `dist/`, keystore e `.env` fuori dai commit.
