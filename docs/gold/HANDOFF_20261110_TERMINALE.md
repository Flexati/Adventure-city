# Passaggio di consegne — 10 novembre 2026, sera

Per la prossima chat di Claude Code sul terminale dell'autore (MX Linux). Il prompt di avvio pronto
da incollare è in `docs/gold/PROMPT_AVVIO_TERMINALE_20261110.md`. Le regole fisse sono in `CLAUDE.md`
e non si ripetono qui.

## Dove siamo

- **Ramo:** `work/chronos-adventure-commercial`, HEAD `5c2096e` (dopo `c06bc28`, R15). Tutto pushato.
- **Test:** `npm test` 366 su 366 al commit `c06bc28`.
- **Browser (tutti PASS al 10/11):** `verify_racing_v9.cjs`, `verify_race_modes_browser.cjs`,
  `verify_hub_race_browser.cjs`, `verify_race_roads_giro2.cjs` (nuovo), `verify_interiors_browser.cjs`.
- **app.js:** 446 946 byte (limite 524 288, guardia 458 752).
- **Ultima build fatta qui:** APK di debug versionCode **22**, 98 988 177 byte,
  SHA-256 `51bb5daba1d5357b6d8d6a2a6583c1787e8b47cb6d902ab084716c496d72e798`, già consegnato all'autore.
  **La prossima build (APK + AAB) si fa nella chat sul terminale, non qui.**
- **Stato commerciale:** `COMMERCIAL_RELEASE = BLOCKED` — zero playtest umani (`docs/gold/PLAYTEST.md`).

## Cosa è entrato per ultimo (R15, dettagli in STATO.md e CONSEGNA_ARGON_GIRO2_20261110_ESITO.md)

- Tutte le 26 gare hanno la strada dipinta: 8 tegole WebP nuove (Solkara giorno/tempesta, Aurelia
  giorno/tramonto) da `delivery/argon-asset-giro2-20261110` (`e776c13`), sequenze in
  `game/racing-v9.mjs` (`ROAD_SEQUENCES`).
- L'auto del giocatore è la Vortex consegnata (`race_vortex_car.webp`): danni, nitro, fari
  (`vortexCarFrame` in `game/visuals.mjs`), con riserva sul vecchio sprite.
- Derivati registrati in `assets/production/v10.3/derived/REGISTRO_ARGON_GIRO2_20261110.json`
  tramite `tools/derive_argon_giro2_20261110.py`. Gli originali restano sul ramo di consegna.
- Scarti: `gang_breaker_b` (scritta «CAUTION», regola 9, e personaggio incoerente),
  `gang_signal_b_v2` (fuori stile).

## Come si fanno le build nella chat sul terminale

1. `git fetch origin work/chronos-adventure-commercial && git pull origin work/chronos-adventure-commercial`.
2. `npm ci && npm test`: devono passare tutti.
3. Alzare `android:versionCode` a **23** in `android/AndroidManifest.xml` (oggi è 22).
4. `ANDROID_SDK_ROOT=<sdk> bash tools/build_apk.sh` → APK di debug in `dist/`.
5. `ANDROID_SDK_ROOT=<sdk> bash tools/build_aab.sh` → AAB in `dist/`.
6. Riportare byte e SHA-256 di entrambi. `dist/` non si committa; il commit è il solo versionCode.
7. **La firma di rilascio dell'AAB spetta all'autore con il suo keystore locale.** Keystore, chiavi e
   password non entrano mai nel repo né in chat. Niente store e niente Play Console senza la sua
   autorizzazione esplicita (regola 2 di CLAUDE.md).

## Coda di lavoro dopo le build (in ordine ragionato)

1. **Task aperti approvati:** R5 (guida in orizzontale con strada più larga) e R6/D39 (via i comandi
   da tastiera delle azioni di gioco — attenzione: i verificatori browser guidano con la tastiera,
   vanno aggiornati nello stesso giro).
2. **Argon, giro 2 — resto dei lotti** su `delivery/argon-asset-giro2-20261110` quando la sua quota
   si ricarica: l'elenco esatto dei file mancanti è nei suoi `CONSEGNA.md` (gruppi N, T, B, V, G, F, M).
   Alla consegna: controllo immagine per immagine, derivazione con registro, un test per gruppo —
   stesso metodo di `CONSEGNA_ARGON_GIRO2_20261110_ESITO.md`.
3. **D53, codice che non dipende dai materiali:** motore di animazione (battiti di ciglia, gesti
   casuali, head-tracking, camera lenta) e mix audio a strati/varianti, nel rispetto di «riduci
   movimento» e della leggibilità senza audio. I materiali V/G/F/M/A non sono arrivati.
4. **Suoni:** Argon non ha un modello audio; il piano resta `docs/gold/AUDIO_PLAN_V10_3.md`.
5. **M1 playtest umani** (il blocco vero della release) e **M4 product ID billing**.

## Decisione aperta da porre all'autore

- Solkara e Aurelia oggi si corrono nel **laboratorio gare**; nella campagna il Vortex offre solo
  Ash Docks (`HUB_RACES` in `game/hubs.mjs`, scelta annotata: le regioni non sono nel grafo della
  storia). Vuole la serie completa di 7 anche nella campagna? Se sì, va registrata in DECISIONI.md
  e va esteso `HUB_RACES` con la validazione del salvataggio e le prove.

## Promemoria di sicurezza

- Un token `ghp_…` è stato incollato in chat in passato: **mai usato**; all'autore resta il consiglio
  di revocarlo su GitHub.
- Mai `main`, mai force-push, mai toccare i rami `delivery/*`; `dist/`, keystore e `.env` fuori dai commit.
