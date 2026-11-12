# Passaggio di consegne per il PC — 12 novembre 2026 (R19)

Sostituisce `HANDOFF_20261111_PC.md` (resta come cronologia). Il prompt da incollare è in
`docs/gold/PROMPT_RIPRESA_PC_20261112.md`. Regole fisse: `CLAUDE.md`. Decisioni: `docs/gold/DECISIONI.md` (ultima **D66**).

## Aggiornamento del 12 novembre, sera (R19 milestone 5 e R20-a) — LEGGERE PRIMA DEL RESTO

Ultima decisione: **D65**. Stato in cima a `docs/gold/STATO.md`.

- **Chiusi dall'elenco sotto:** punto 2 (sfondo della scena dei due colpi), punto 3 (proiettili visibili, DUO con linea libera: D62), punto 4 (boss +25 % di vita: D63, numeri revocabili), parte del 5 (prima gara: D64), parte del 6 (segnale sul prossimo dispositivo), parte del 10 (richiesta ad Argon per le case: `requests/argon-case-villaggi-20261112/README.md`), parte del 13 (`AUDIT_DIFETTI_R19.md`, `STUDIO/GO_NO_GO.md`, `MAP_QUALITY.md`).
- **Il lavoro principale ora è la durata (D65).** [SIMULAZIONE] campagna ≈ 42 minuti contro circa 150. Piano: `docs/gold/PIANO_DURATA_R20.md`. Asset mancanti: `requests/argon-durata-due-ore-20261112/README.md`.
- **Spazio in `app.js`:** 393 625 byte, margine 65 127 (testi inglesi in `en.js`). Verifica: `node tools/verify_bundle_en_r20.cjs`.
- **Prossimo passo (R20-b), senza bisogno di Argon:** collegamenti narrativi, un incarico obbligatorio in più a Moon e Cathedral (`hubExit` in `game/runtime.mjs`; aggiornare i bot in `tests/helpers/autoplay.mjs` e `tools/verify_campaign_browser.cjs`), gara di presentazione obbligatoria dopo Moon. Poi nuova stima: tre giri `CITY_VIRTUAL_TIME=1 node tools/verify_campaign_browser.cjs <url> a|b|c <cartella>` e `node tools/estimate_playtime.mjs`.
- **Poi, un gruppo di Argon alla volta:** Vega (D1), Glass Flood (D2), porto (D3), promessa (D4), avvicinamenti (D5, D6). Nessun segnaposto se il gruppo non è completo.
- APK di debug **versionCode 29**. L'AAB di prova va rifatto dopo R20-b.

## Aggiornamento R20-c (12 novembre, notte) — LEGGERE PER PRIMO

Ultima decisione **D66**. La campagna ha 44 tappe e 9 boss; stato e limiti in cima a `docs/gold/STATO.md`; esito della consegna in `docs/gold/CONSEGNA_ARGON_150MIN_ESITO.md`. Prossimi lavori, in ordine: (1) piante delle mappe corrette a mano dove si cammina sui mobili (`tools/derive_argon_150_20261112.py`, tabella `PILLARS`); (2) mosse proprie dei boss nuovi (`bossThink` in `game/campaign.mjs`); (3) avvicinamenti più duri; (4) tagliare i fogli a 288 px dei boss; (5) usare abitanti, sentinella, civili, segreti, Veyra, garage, officina; (6) gare obbligatorie e collegamenti narrativi; (7) le case dei villaggi quando Argon le consegna. Verifiche: `node tools/verify_stages_r20.cjs`, `node tools/audit_combat.mjs`, tre giri `verify_campaign_browser.cjs` e `estimate_playtime.mjs`.

## Dove trovare tutto

| Cosa | Dove |
|---|---|
| Ramo di lavoro (mai `main`) | `work/chronos-adventure-commercial`, ultimo commit del giro R19 `986604c` più il commit di handoff |
| Consegne di Argon (originali, mai modificate) | ramo `delivery/argon-asset-giro2-20261110` @ `f21e19d`; per leggerle senza checkout: `git archive origin/delivery/argon-asset-giro2-20261110 deliveries/argon-asset-giro2-20261110 \| tar -x -C <cartella>` |
| Stato del giro | `docs/gold/STATO.md`, sezioni **R19** in cima (milestone 0, 1, 2, 3) |
| Audit e rilettura dei tre commit | `docs/gold/AUDIT_R19.md` |
| Registro di copertura di ogni file | `docs/gold/COVERAGE_LEDGER.md` e `.json` (rigenerabile: `python3 tools/build_coverage_ledger.py docs/evidence/r19/coverage-raw.txt`) |
| Peso di `app.js`, misure e candidati alla riduzione | `docs/gold/SIZE_LOG.md` |
| Registri dei derivati di Argon | `assets/production/v10.3/derived/REGISTRO_ARGON_*.json` (quattro file; l'ultimo è `…_UI_20261111.json`) |
| Prove (schermate, JSON) | `docs/evidence/r19/` (`opening/`, `ui/`, `buttons/buttons.json`, `coverage-raw.txt`) |
| Test dei difetti e di proprietà | `tests/defects-r19.test.mjs`, `tests/properties-r19.test.mjs`, `tests/assist-option-r19.test.mjs`, `tests/hud-meter-r19.test.mjs`, `tests/bundle-prune-r19.test.mjs`, `tests/argon-ui.test.mjs` |
| Strumenti nuovi | `tools/verify_buttons_audit.cjs`, `tools/verify_opening_r19.cjs` (`npm run qa:opening`), `tools/profile_boss_r19.cjs`, `tools/build_coverage_ledger.py`, `tools/derive_argon_ui_20261111.py` |
| Build | `tools/build_apk.sh`, `tools/build_aab.sh`, `tools/build_play_aab.sh` (firma vera: solo sul PC dell'autore). SDK nel container: `/opt/android-sdk`, bundletool `/opt/android-sdk/bundletool.jar` |

## Stato misurato (R19, 12/11)

- **[MISURATO]** `npm test` **408 su 408**. `app.js` **454 134 byte**; guardia 458 752 → **restano 4 618 byte**; limite duro 524 288.
- **[MISURATO]** Browser PASS (Chromium, tocco emulato = [SIMULAZIONE]): `qa:controls`, `qa:touch`, `qa:opening`, `qa:options`, `qa:hud`, `qa:demo`, `qa:labels`, `qa:save`, `qa:health`, `qa:stability`, `qa:gamepad`, `qa:runtime`, nemici in 13 luoghi.
- **APK di debug versionCode 28** (R19, milestone 4) costruito da questo ramo e mandato in chat (v26 e v25 sono superati). AAB di prova `jaguarZcreatorZ13.app` vcode 3 (firma di prova, **non caricabile**; è del commit 541145b, da rifare).
- `COMMERCIAL_RELEASE = BLOCKED`: zero playtest umani, nessun telefono fisico, acquisto Play non cablato, firma finale dell'autore.

## Fatto in R19

- Bundler: lascia fuori 14 funzioni mai chiamate (−4 380 byte). Cornice dei pannelli di Argon (`game/art/ui/frame_menu.webp`).
- Opzione **«Tiro assistito»** (Opzioni, attiva di default; spenta il colpo parte dove guarda l'eroe).
- Difetti dal telefono: **P0** SPARA e SCHIVA non tornavano dopo l'apertura (ora `configureControls` li rimostra); **P1** boss non svegli disegnati fermi (ora non vengono disegnati); **P1** scatto della telecamera (ora raggiunge la nuova altezza in pochi frame).
- Prestazioni nei boss: HUD scrive nel DOM solo se cambia, lampo del colpo senza `ctx.filter`, vignetta di vita bassa pre-disegnata. Profilo con CPU 4× più lenta: costo frame p95 ~4 ms (390×844), nessuno scatto nel simulatore. **Su telefono vero non misurato.**
- Ipotesi del mandato: H1 **confermata** (nell'APK non c'è nessun ponte di acquisto: il gioco è tutto aperto); H2 **per scelta** (il backup è parte della garanzia, test lo fissa); H3 **compatibilità** con salvataggi senza checksum (lo schema li controlla comunque); H4 **corretta** (barre in inglese); H5 pngjs e playwright **sono dichiarati** in `package.json`; H6 i tasti vengono nascosti nella fuga, `dash` non è letto.

## DA FARE (in ordine) — ricavato dalle parole dell'autore

1. ~~Intro dello studio~~ **FATTA nella milestone 4 (D61)**: key art di Argon + lampi in CSS, senza video né pulsanti (`tools/verify_studio_browser.cjs`). Resta da riguardare su telefono.
2. **Scena dei due colpi (cassa/struttura):** l'autore vede solo scritte dietro uno sfondo sfocato. Serve uno sfondo vero (luogo/struttura, orizzontale e verticale) dietro `#knock` e `#opening`; vedi `game/style.css` righe ~206-214 e ~258-293, markup in `game/index.html`.
3. **Proiettili visibili e coperture:** l'autore vuole vedere i proiettili e le onde del DUO viaggiare verso il nemico; se il nemico è dietro un riparo non vengono colpiti (sfida di calcolo). Oggi lo sparo è istantaneo (`fireShot`, `aimAt`, `visible` in `game/campaign.mjs`). È un **cambio di combattimento**: scriverlo in `DECISIONI.md` (D62 proposta, parole dell'autore: «voglio vedere i proiettili che escono e i proiettili anche delle onde di energia fatte dal duo che vanno verso il nemico… se il nemico si ripara dietro qualcosa non possono essere colpiti»), poi proiettili con velocità e collisione con muri/ripari, test e verificatore. Verifica di non rompere i tempi approvati (D27/D29/D44).
4. **Boss più impegnativi:** da concordare i numeri (vita, ritmo di attacco). Registrare come decisione; nessun cambio di hitbox senza D.
5. **Gare livello alto con nitro/turbo e varietà:** nitro già c'è (`tickRaceV9`, `racing-v9.mjs`). Aggiungere varietà vera (modalità, ostacoli, scorciatoie, rivali con carattere); partire dall'**inizio** (prime gare e primi combattimenti noiosi): ritmo, obiettivo chiaro in 5 secondi, prima ricompensa entro un minuto.
6. **Tutto intuitivo:** obiettivi chiari anche nelle missioni piccole (testo dell'obiettivo, freccia, evidenziazione); tutorial minimo. Parte dal primo minuto.
7. **Versione premium senza demo; la demo gratuita resta una variante separata** (l'autore la pubblicherà). Oggi l'APK è tutto aperto per assenza del ponte (H1). Decidere come produrre due build (flag di build, es. `AAB_DEMO=1` che inietta un ponte finto «bloccato»), senza byte in più nel bundle premium. Il ponte nativo vero (Google Play Billing, `isUnlocked/price/purchase/restore`) resta **BLOCKED** (serve Play Console e un account di prova); preparare Java, `tools/build_apk.sh` con AAR manuale e test con ponte finto.
8. **Audio:** sei suoni di Argon sono nel gioco (D61); il ronzio del tema del titolo è stato tolto da Argon (rev 2, commit `4d16af1`) ma il file ha picco +1,1 dBFS contro i −1,5 dichiarati: **riascoltare su telefono**. Mancano ancora i suoni dei boss e dell'ambiente (13 su 104 arrivati). Mischia (`sfx_melee_*`) e alchimista in attesa di una decisione.
9. **Menu:** giudicare se i ritratti di Nox e Lulù in primo piano vanno bene; il resto aspetta Argon. Il pilota dell'intro di Argon (`JAGUAR_INTRO`) non è un'intro finita.
10. **Mappe e villaggi:** l'autore pensava che Argon avesse fatto gli sprite delle singole case; **non è così** (11 tavole T accettate ma non applicate: terreni, palazzi, oggetti; decisione D45/D46 sulla mappa dipinta intera). Scrivere in `requests/` il **prompt per Argon** con: sprite delle case dei villaggi (uno per edificio, fondo `#FF00FF`, nessun testo), paesaggio e dintorni per ogni distretto, coerenza logica delle mappe (strade, piazze, ingressi). Prima il gate delle mappe (`docs/gold/MAP_QUALITY.md`, criteri scritti prima del giudizio).
11. **Prestazioni su Android:** misurare su telefono vero nel boss (il simulatore dice ~4 ms ma non è il telefono). Se ci sono ancora scatti: ridurre lo scatto della luce (`drawDark`), la risoluzione di disegno nei boss, le riscritture del DOM rimaste (`label`, `setText`); `tools/profile_boss_r19.cjs` dà il profilo.
12. **Resto del mandato «difetti e logica»:** audit dei pulsanti negli stati non ancora coperti (35 su 57 non visti: opening, studio, unlock, result, city-choice, ending, hub, fault; `buttons.json` elenca i nomi), «Ripristina acquisti», test di proprietà per `racing-v9`, `missions`, `hubs`, `villages`, `input-v9`, `stability` (fatti: progress-store, weapons, hud, tick, moveActor, routeWaypoint, round trip).
13. **Documenti da studio mai scritti:** `docs/gold/STUDIO/TRIAGE.md`, `SYSTEM_MAP.md`, `STUDIO_PLAYBOOK.md`, `GO_NO_GO.md`, `docs/gold/MAP_QUALITY.md`, `ART_AUDIT_R19.md` (con `tools/audit_media.py` e `tools/art_style_audit.py`), `AUDIT_DIFETTI_R19.md`. Ogni difetto: ID, P0–P3, file:riga, prova, correzione, byte.
14. **Interfaccia premium di Argon:** applicata solo la cornice. Restano pulsanti, icone, HUD, medaglie, emblema, **una schermata alla volta**, con prove al tocco; ogni cosa che costa byte in `app.js` va misurata prima (margine 4 286).
15. **Regressione finale tre volte** (npm test, lint, tutti i `qa:*`, audit pulsanti), commit esatto e output grezzo in `docs/evidence/`; poi AAB di prova e, sul PC dell'autore, firma vera.

## Argon (ramo di consegna a `f21e19d`)

Esito dei lotti 3 e 4: `docs/gold/CONSEGNA_ARGON_GIRO3_LOTTI34_ESITO.md`. Ancora **da generare**: il portone del Bastione senza magenta, `shadow_reaper_d`, `forge_behemoth_b` (golem di bronzo, il precedente era grigio), key art intro 16:9 e 9:16, gruppi M (6), V (16), G (12), F (6), 104 suoni (nessun modello audio). Arrivato ma **non applicato**: gruppo U (8 tavole, una applicata), T (11 tavole), boss `bone_tyrant a..d`, `forge_behemoth a/c/d`, `shadow_reaper a..c`. Regola D57: prima verificare che il ramo di consegna sia avanzato; se è fermo, non andare avanti con asset che non ci sono.

## Sicurezza

Mai `main`, mai force-push, mai i rami `delivery/*`. Nessuna chiave nel repo né in chat. Nessun token incollato in chat va usato: **vanno revocati su GitHub**. Il rapporto dell'altra sessione dice di aver usato un token: non è stato questa sessione.
