## R57 — Integrazione asset approvati: grafica (A1–A9) e audio d’ambiente per tappa (D97; 20 novembre 2026)

- **Ramo e PR.** `feat/assets-r57-free`, basato sulla linea della variante gratuita (`feat/act1-polish-r56`, a sua volta da `feat/free-variant-iap` `8d9cf0c`) con merge di `assets/r57-handoff` (`bf83384`), aperto verso `ccr-022499ad-zq9iu5` (non unito, non firmato, non pubblicato).
- **Variante gratuita intatta.** `applicationId` `jaguarZcreatorZ13.app.free` (`versionCode` 1), Atto I gratuito, un solo acquisto in-app `unlock_full_game` (5,99 €), nessuna stringa visibile con «Free» o «Gratis», nessuna modifica a chiavi, keystore, firma o script di build Play (`tools/build_play_aab.sh`, `tools/build_aab.sh`, `tools/build_free_aab.sh`).
- **[FATTO] 50 asset grafici integrati (`handoff/r57/assets/graphics/`):**
  - **A1 (Store Play):** `assets/source/store/store_feature_1024x500_notitle.png` (1024×500, senza testo, fuori dal bundle APK/AAB).
  - **A2 (Teaser fine Atto I):** `game/art/atti/teaser_breccia_9x16.webp` (1080×1920) collegato a `#teaser-art` in `game/style.css`.
  - **A3 (Hero schermata di sblocco):** `game/art/atti/unlock_hero_1200x540.webp` (1200×540) collegato a `.store-hero` in `game/style.css`; `#store-buy` resta nella prima schermata (`bottom: 370,6 px <= 860 px`).
  - **A4 (18 ritratti 512×512 in `game/art/v10/`):** `portrait_nox_{neutral,tense,warm}.png`, `portrait_lulu_{neutral,tense,warm}.png`, `portrait_veyra.png`, `portrait_veyra_{tense,warm}.png`, `portrait_kairn.png`, `portrait_morrow.png`, `portrait_{rook,eve,vega,mira,tessa,dario,ines}_neutral.png`. Collegati in `game/style.css` (`.portrait.p0`, `.p1`, `.p2`, `.pveyra`, `.prook`, `.pvega`, `.pkairn`, `.pmorrow`, `.pmira`, `.ptessa`, `.pdario`, `.pines`, varianti `-tense`/`-warm`, `#opening-nox`, `#opening-lulu`) e in `game/runtime.mjs` (`PORTRAIT_ALIAS` con `'TESSA':'ptessa'` e `portraitMood` automatico `tense`/`warm` per Nox, Lulú e Veyra).
  - **A5 (3 livelli parallax strada in `game/art/v10/`):** `road_layer_mid_a2.png`, `road_layer_near_a2.png` (Atto II) e `road_layer_mid_a3.png` (Atto III). Caricati solo nelle tappe `drive` degli Atti II–III in `startDrive()`, disegnati in `drawDriving()` sopra l’asfalto e sotto ostacoli/portali/auto (`.6 * d.distance` e `1.4 * d.distance`), disattivati con `settings.reduced`.
  - **A6 (8 schede atto in `game/art/atti/`):** `atto_1.webp` (16:9 pulito senza simbolo nell’angolo) + `atto_{1,2,3,4}_9x16.webp` (1080×1920 per `@media (orientation: portrait)` su `#card.a1..a4`; `atto_2..4.webp` 16:9 mantenuti per `@media (orientation: landscape)` e ` .store-act-art`). Scrim centrale di `#card.a3` rafforzato (`#04070cf5 0, #04070cde 52%, #04070c99 100%`) per garantire contrasto ≥ 4,5:1 sopra il bagliore ciano centrale.
  - **A8 (10 file UI kit olografico in `game/art/ui/`):** `frame_menu.webp` (derivato lossless 512×512 da `a8_frame_holographic_512.png`), `button_primary.png`, `button_secondary.png`, `healthbar_shell.png`, `icon_{shoot,dodge,pulse,duo,heal,bag}.png` collegati in `game/style.css` con testi e badge HTML sopra l’arte.
  - **A9 (8 sprite sheet rim-light in `game/art/v05/`):** `nox_{walk,gun,actions,magic}.png` e `lulu_{walk,gun,actions,magic}.png` (stesse dimensioni e griglie di `sheet-layout.mjs`, zero modifiche al codice di animazione).
- **[FATTO] 15 file audio Ogg Vorbis 48 kHz integrati per tappa/hub (`game/audio/chrono/`):**
  - **12 loop d’ambiente (`STAGE_AMBIENCE` e `HUB_AMBIENCE` in `game/runtime.mjs`):** `act1_blackout_cantiere` (`blackout`, `yard`), `act1_docks_veyra` (`docks_veyra`, hub `ash_docks`), `act1_moon_refuge` (scena `home`, hub `moon`), `act1_escape_drive` (guida `escape`), `act2_clinic_contagion` (`app_clinic`, `contagion`, hub `clinic_ward`), `act2_port_antenne` (scena `app_port`, `port`, hub `antenna_port`), `act2_cathedral_quarter` (`zero`, hub `cathedral`), `act3_forge` (`below`, `forge`), `act3_toxic_bazaar` (`toxic_mid`, hub `toxic`), `act3_eve_archive` (scena `app_archive`, `archive`, hub `deep_archive`), `act3_vega_sky_rail` (`vega`, hub `sky_rail`), `act4_axis_wind` (`app_axis`, `ascent`, `finale`, hub `axis_crown`).
  - **3 one-shot Atto I (`ACT1_ONESHOTS`):** `act1_thunder_distant` (`blackout`, `yard`), `act1_relay_spark` (`blackout`), `act1_crane_groan` (`docks_veyra`, hub `ash_docks`).
  - **Pulizia:** rimosso `ambience:'port'` da `FOOT.exp_chalk_marks` in `game/missions.mjs` (usa il default per kind: `chrono_port_rain`); aggiunto `audioDirector.setAmbience(null)` in `startCollapse()` prima del cambio di modalità.
- **[FATTO] Bundler Android e allowlist WebView (`tools/prepare_android_assets.py`, `AssetRoutes.java`).** Tutte le nuove risorse copiate con nomi univoci dopo il flatten e autorizzate in `AssetRoutes.java`.
- **[MISURATO] Prove e dimensioni:**
  - `python3 tools/prepare_android_assets.py`: `index.html` **18 555 B**, `app.js` **418 648 B** (sotto la guardia di 458 752 B e il limite di 524 288 B, margine **40 104 B**), `world.js` **267 009 B**, `en.js` **204 236 B**, **421 risorse locali**.
  - Test unitari: `tests/assets-r57.test.mjs` (5 subtest dedicati R57), `tests/act1-polish-r56.test.mjs` (9/9), `tests/free-variant-r55.test.mjs` (16/16), `tests/argon-giro3.test.mjs`, `tests/argon-ui.test.mjs`, `tests/bundle-weight.test.mjs`, `tests/fault-guards.test.mjs`: tutti **PASS** (655/657 nella suite completa; i soli 2 test non eseguiti nel container locale sono i 2 sottotest Python `PIL`/`numpy` di `tests/tooling-syntax.test.mjs`). `npm run lint` PASS.
  - Verifiche browser Playwright (`tools/verify_act1_polish_r56.cjs` 10/10 PASS, `tools/verify_free_variant_r55.cjs` 18/18 PASS, verifica R57 412×860 verticale e 860×412 orizzontale PASS, 0 errori console, 0 richieste 404).
  - Prestazioni (`tools/verify_performance_v09.cjs` `quick`, 20 scenari su 4 risoluzioni): **20/20 PASS** con p95 < 16 ms (`below` 4,8–6,9 ms, `archive` 3,4–5,9 ms, `ascent` 2,0–2,8 ms, `finale` 2,1–5,6 ms, `tunnel` con parallax A5 1,4–2,0 ms a CPU 1× e 9,9 ms a CPU 4×).
- **Piano di porting sull’app a pagamento (`jaguarZcreatorZ13.app`):** cherry-pick dei commit R57 (stessi path sotto `game/`, `tools/prepare_android_assets.py`, `AssetRoutes.java`, `tests/`) sul ramo dell’edizione a pagamento senza toccare `applicationId`, `versionCode` 4, `tools/build_play_aab.sh` né i file di billing.
- **Limiti.** Nessun AAB/APK firmato prodotto qui (la build firmata è riservata a Folly); qualità e bilanciamento all’ascolto dei 15 nuovi Ogg su altoparlanti/cuffie di un telefono reale non verificabili in ambiente headless; playtest umani registrati: 0 (`COMMERCIAL_RELEASE = BLOCKED`).

## R56 — Rifinitura Atto I, ritmo, buio progressivo in Blackout, teaser e schermata di sblocco con arte (D96; 19–20 novembre 2026)

- **Ramo.** `feat/act1-polish-r56` (da `feat/free-variant-iap` `8d9cf0c`).
- **[FATTO] Ritmo e leggibilità Atto I (`game/runtime.mjs`, `game/style.css`, `game/visuals.mjs`).** Apertura di `blackout` passata a radio barks durante il gioco invece di dialogo bloccante (tempo al primo sparo modellato da 102,8 s a 86,6 s); schede tappa più rapide con indicazione `Atto N · Tappa x di y` (IT/EN); buio progressivo in `blackout` (da 0,66 a 0/3 relè fino a 0,14 a 3/3 relè con pozze di luce calda); color grade per atto; canale unico tra bark e toast (`#notice` sotto `#bark`); scossa schermo deterministica a somma di seni con tetto (0 con `reduced`); linee di velocità e scintille nella guida; teaser e schermata di sblocco con arte e pulsante di acquisto nella prima schermata.
- **[MISURATO] Prove.** `tests/act1-polish-r56.test.mjs` (9/9 PASS), `tools/verify_act1_polish_r56.cjs` (10/10 PASS), rapporto e confronti prima/dopo in `docs/evidence/r56/`.

## R55 — App gratuita con un solo acquisto in-app (D95; 19 novembre 2026)

- **Ramo e PR.** `feat/free-variant-iap`, aperta verso `ccr-022499ad-zq9iu5` (non unita). Parte da `fix/play-store-release-r51` (PR #22, `e684a1a`), perché quella PR non è ancora nel ramo di lavoro e contiene le correzioni al manifest. Quando la PR #22 verrà unita, questo ramo si ribasa senza conflitti di rilievo.
- **Che cosa è.** Lo stesso gioco in due app. **A pagamento:** `jaguarZcreatorZ13.app`, 5,99 €, tutto aperto, nessuno store: non cambia. **Gratuita:** `jaguarZcreatorZ13.app.free`, `versionCode` 1, Atto I libero e un solo acquisto una tantum (`unlock_full_game`, prezzo 5,99 € da impostare in Play Console) che apre gli Atti II, III e IV. «Capitolo» = Atto.
- **[FATTO] Blocco nel gioco** (`game/native-bridge.mjs`, `game/runtime.mjs`). L’edizione è «gratuita» solo se la pagina trova `window.ChronosEdition` (lo registra solo l’app `.free`). In un browser e nell’app a pagamento non esiste, quindi nulla è mai bloccato. Nell’app gratuita il blocco è in `enterStep` e in Continua: dopo l’ultima tappa dell’Atto I il salvataggio punta già alla prima tappa bloccata, così Continua torna alla schermata di sblocco. Se il ponte dello store manca o si rompe, l’Atto II resta bloccato (fallisce chiuso) e la schermata lo dice.
- **[FATTO] Fine dell’Atto I.** Una scena in più, detta una sola volta (`FREE_TEASER_LINES`, IT/EN): Veyra sente che il muro della breccia ha smesso di respirare, Lulú dice che qualcosa ascolta, la scena si chiude su «ATTO II · LA BRECCIA». Poi la schermata di sblocco: barra di avanzamento vera («Atto I di 4 completato · 6 tappe su 44 · N min di gioco»), i tre atti che restano con nome e anticipazione, tutti segnati come bloccati, prezzo sul pulsante, «Ripristina acquisto», «Torna al menu». Nessun timer, nessuna scarsità finta. **Le battute della scena e le anticipazioni degli atti sono testo nuovo scritto da me, non canone approvato:** da rivedere dall’autore.
- **[FATTO] Lato Android** (`android-free/`, `android/src/.../StoreHook.java`). `StoreBridge` (solo app gratuita) usa Google Play Billing 9.1.0: prodotto `unlock_full_game` non consumabile, `queryProductDetailsAsync`, `launchBillingFlow`, `acknowledgePurchase`, `queryPurchasesAsync` a ogni avvio e a ogni ritorno in primo piano. I pagamenti in attesa non sbloccano nulla finché non diventano acquistati. L’acquisto si salva sul telefono (così il gioco si apre anche offline) e si controlla di nuovo con Google Play: un rimborso o un altro account lo tolgono. La pagina chiede, non concede: «entitled» lo imposta solo il codice nativo. `MainActivity` ha 4 righe in più (chiamate a `StoreHook`); l’app a pagamento ritorna subito dal gancio e non contiene nessuna classe di billing.
- **[FATTO] Costruzione.** L’app gratuita si costruisce con Gradle (`android-free/`, AGP 8.13.2) perché Play Billing porta dipendenze AndroidX e Google Play services che la pipeline a mano (`aapt2`, `javac`, `d8`) dell’app a pagamento non risolve. Comando: `npm run android:aab:free` (`tools/build_free_aab.sh`, stessa regola delle chiavi: la chiave la dà chi costruisce, lo script non ne crea). Workflow manuale `.github/workflows/free-aab.yml`. L’app a pagamento non cambia: `tools/build_play_aab.sh`, `tools/build_aab.sh`, applicationId, `versionCode` 4 e firma sono identici.
- **[FATTO] Prove.** `tests/free-variant-r55.test.mjs` (16 test: blocco, rimborso, store rotto, testi IT/EN, manifest, app a pagamento intatta). `tools/verify_free_variant_r55.cjs` (browser, pagina impacchettata): app a pagamento senza blocchi e senza chiamate allo store; app gratuita con scena, schermata, Indietro, Continua, Ripristina, acquisto simulato che sblocca l’Atto II, inglese, store assente. Costruzione reale: `gradle :app:bundleRelease` ha prodotto un AAB valido per `bundletool validate`, `package` `jaguarZcreatorZ13.app.free`, `versionCode` 1, non debuggable, `com.android.vending.BILLING` e `StoreBridge` dentro; le sorgenti dell’app a pagamento compilano con `javac` e `d8` senza classi di billing.
- **Nome.** Per decisione dell’autore la parola «Free» non compare in nulla di visibile: l’etichetta dell’app gratuita è la stessa dell’app a pagamento, «Chronos Adventure: Nox & Lulú»; l’unica differenza è l’`applicationId` `.free`. Un test controlla manifest e testi.
- **Limiti.** Nessun acquisto vero: serve l’app caricata in un test (anche interno) con il prodotto creato e un tester di licenza, su un telefono. Il flusso di Google Play, il pagamento in attesa e il rimborso non sono provati qui. L’AAB gratuito pesa circa 121 MB. Il manifest unito dell’app gratuita aggiunge `INTERNET` e `ACCESS_NETWORK_STATE` (vengono da Play Billing); il WebView resta senza rete (`setBlockNetworkLoads`), ma va tenuto presente nel modulo «Sicurezza dei dati». Playtest umani 0, `COMMERCIAL_RELEASE = BLOCKED`.

## R54 — Frame-budget rendering, WebView/Back/CI hardening, leggibilità boss HUD e valore Replay/Archivio (D94; 19 novembre 2026)

- **Ramo e PR.** `fix/play-store-release-r51`, PR #22 (non unita). Non toccati: identità Play (`applicationId` `jaguarZcreatorZ13.app`, `versionCode` 4, `versionName` 1.0.0), `tools/build_play_aab.sh`, firma, chiavi, manifest di debug (`com.cityadventure.pizzaprotocol.debug`), né tempi/finestre/hitbox di combattimento (regola 4 / D75) né i 5 finali esistenti (D22).
- **[FATTO] Prestazioni e frame-budget (`game/village-art.mjs`, `game/runtime.mjs`).**
  - `getCombatMapLifeCache(layout)` (`WeakMap`) precalcola una volta per layout prese d'aria, turbine e LED invece di riscansionare `layout.blocks` ogni fotogramma.
  - Stamp offscreen pre-renderizzati (64×64 glow/fireGlow, 256×256 vignetta) al posto di `createRadialGradient` per fotogramma in `drawVillageLife`, `drawNitroCinematicVfx`, `drawHubStructurePoint`, `drawNarrativeImmersion`, `drawTreasureChest3D` e `fireGlow`.
  - Cache larghezza testo `worldTextWidthCache` in `worldText()`; rimosso il doppio overdraw additivo `enemySprite` in hitstop; compattazione in-place dell'array `fx` (zero `Array.prototype.filter` per fotogramma) e trim a batch su `frameSamples`; dirty-check `hudCache` su `dataset`, proprietà CSS e attributi DOM in `updateFootHud` e `panel()`.
- **[FATTO] Android WebView, tasto Indietro e CI (`MainActivity.java`, `game/runtime.mjs`, `.github/workflows/android-smoke-build.yml`).**
  - `MainActivity.java`: deduplicazione di `exitDialog`, guardia `destroyed || isFinishing() || isDestroyed()` sul callback asincrono di `evaluateJavascript`, deregistrazione di `OnBackInvokedCallback` e `exitDialog.dismiss()` in `onDestroy()`.
  - `window.__chronosBack`: gestione esplicita di `#fault-panel` (blocco uscita accidentale), `#studio` (salta intro studio) e `#credits-skip` (salta titoli).
  - `.github/workflows/android-smoke-build.yml`: aggiunti target `ccr-*` e `fix/play-store-release-*` ai trigger `pull_request.branches` così la CI di fumo Android gira anche su PR di release.
- **[FATTO] Leggibilità combattimento/boss HUD e valore Replay/Archivio (`game/runtime.mjs`, `game/codex.mjs`, `game/locale.mjs`, `game/runtime-en.mjs`, `game/index.html`, `game/style.css`).**
  - `#bossbar`: vetro scuro traslucido e tacche di soglia fase a 33,3 % / 66,6 % (`#bossbar .vital-track::after`); `placeBossBar()` misurata dopo la scrittura di nome e PV così `--bossbar-bottom` rispecchia l'altezza reale e `.boss-active #bag` / `#bark` / `#notice` non coprono mai la barra né in verticale né in orizzontale.
  - Combattimento: beacon obiettivo ciano (`#6df2ff`, distinto dall'arancione/rosso dei pericoli), mirino a rombo dorato rotante sul punto debole esposto (`e.weakExposed > 0`), pop di scala sui callout critici, traduzione EN completa per il conteggio di Vega (`MIRA 1/4` → `AIM 1/4`) senza toccare il nome invariante `MIRA`.
  - Replay & Archivio: `codexProgress(progress, CAMPAIGN, INTERIORS)` (70 voci: 25 CODEX + 45 residenti), contatore `Archivio: X/70` in `#codex-title`, pannello `#replay-summary` in `#replay` con badge `Finali scoperti: n/5` e `Archivio: X/70`, riepilogo esplicito di cosa si conserva/cambia e fallback pulito se nessuna scelta è registrata (IT/EN).
  - Sprite sheet 4×1 del vetro iniziale (`game/art/v09/glass_shard_states.png`, 256×64 px, quattro celle 64×64 con alfa binario e 4 stati di rifrazione: riposo, onda caustica diagonale, raggio interno ciano, bagliore caldo ambra-oro sul bisello): collegato sia a `#opening-shard` (`steps(4,end)`, bloccato al frame 0 con movimento ridotto) sia a `drawGlassKeepsakeProp` / `glassShardFrame` durante `openingWalk`, e autorizzato in `AssetRoutes.java`.
- **[SIMULAZIONE / MISURATO] Benchmark Chromium headless CPU×4 (412×915, software rendering, non equivalente a un telefono Android reale):**
  - `below`: prima p50 5,2 ms / p95 18,7 ms / max 47,5 ms (DPR 1,75) → dopo p50 7,0 ms / p95 21,0 ms / max 56,8 ms (scaling DPR 1,75→1,25→1,0 attivo durante la finestra con 2 picchi di resize canvas);
  - `archive`: prima p50 4,4 ms / p95 14,8 ms / max 41,2 ms → dopo p50 1,6 ms (−64 %) / p95 12,4 ms (−16 %) / max 39,5 ms;
  - `finale`: prima p50 4,3 ms / p95 13,8 ms / max 43,0 ms → dopo p50 5,9 ms / p95 13,9 ms / max 40,3 ms;
  - `tunnel`: prima p50 5,8 ms / p95 26,1 ms / max 50,2 ms → dopo p50 4,0 ms (−31 %) / p95 24,6 ms / max 41,8 ms (−17 %).
- **[MISURATO] Prove e pacchetto.** `node --test --test-concurrency=1 tests/*.test.mjs`: 622 su 624 PASS (8 nuovi in `tests/r54-hardening.test.mjs`; gli unici 2 fallimenti in questo container sono i 2 test Python `PIL`/`numpy` in `tests/tooling-syntax.test.mjs`, moduli non installati nell'immagine locale ma installati nella CI). `prepare_android_assets.py`: `index.html` 18 026 byte, `app.js` ~406,6 KB (sotto il limite 458 752), `world.js` 260 811 byte, `en.js` 204 236 byte, 373 risorse locali. Verifica visiva Playwright su `390×844`, `844×390` e `1280×800` con 0 errori di console.
- **Limiti.** Nessun telefono Android reale, nessun WebView/APK/AAB compilato o testato in questo container, nessun ascolto umano, **playtest umani registrati: 0**. `COMMERCIAL_RELEASE = BLOCKED` fino a playtest umani documentati e Closed Testing Play Console su dispositivi reali.

## R53 — Coerenza di combattimento, narrativa e timer; package di debug ripristinato (D94; 18–19 novembre 2026)

- **Ramo e PR.** `fix/play-store-release-r51`, PR #22 (non unita). Non toccati: identità Play (`applicationId` `jaguarZcreatorZ13.app`, `versionCode` 4, `versionName` 1.0.0), `tools/build_play_aab.sh`, firma, chiavi.
- **[FATTO] Combattimento (commit `ad4685b`).** Percorsi stealth: typo `.1` corretto in `1` e punti agganciati al pavimento (`game/campaign.mjs`). Hitbox dei boss larghi (The Anchor) tramite `foeHitHalfW` (metà larghezza disegnata) e `blade_dash` che colpisce lungo il tratto, non solo all’arrivo. Sonic Nova azzera i proiettili nel raggio di 190 px (prima 110). Avviso di carica allineato al corridoio dipinto (116 px); colpo in guida e cornice sonar allineati allo sprite; auto di gara della Vortex senza lo scostamento di +60 px (`game/driving.mjs`, `game/runtime.mjs`, `game/scenery.mjs`: coperture interne limitate a 88 px).
- **[FATTO] Runtime.** Un `sync` nativo fallito rimette le chiavi in `pending` e riprova (`game/native-bridge.mjs`). I timer di battute, stinger e finale sono legati a `runId` / `endingTimers` così non scattano dopo un cambio di scena. Una guida completata (`driveCleared`) passa da `afterCleared`.
- **[FATTO] Narrativa e dati.** `app_breach` ha il punto di vista di Nox, che guida; `hpBonus` si somma e non sovrascrive; il malus `eve_kept === false` è sul finale, non su Vega (la scelta arriva dopo); il calibratore di Vega potenzia le mosse su «line» e «finale». Codex: Ines si sblocca dopo il contagio; i consigli su Tiranno e Archon seguono le meccaniche vere. Pronomi, epilogo, tetto del rifugio e battute IT/EN allineati (`game/missions.mjs`, `game/codex.mjs`, `game/story-v08.mjs`, `game/story-en.mjs`).
- **[FATTO] Package di debug (19 novembre 2026).** Il manifest di origine torna a `com.cityadventure.pizzaprotocol.debug` (come prima della PR). Le classi Java restano in `jaguarZcreatorZ13.app`; l’activity è indicata col nome completo. La CI di fumo e `tools/verify_android_recovery.mjs` avviano `com.cityadventure.pizzaprotocol.debug/jaguarZcreatorZ13.app.MainActivity`. Così un APK di prova (`versionCode` 54, `debuggable`) non condivide il nome con l’app Play e non può bloccare l’aggiornamento a `versionCode` 4.
- **Limiti.** Nessun telefono, nessun WebView vero per il ponte, il tasto Indietro e il backup. Playtest umani 0, `COMMERCIAL_RELEASE = BLOCKED`. La CI di fumo Android non parte su questa PR (si attiva solo verso `main` o `feat/audience-first-v8`).

## R52 — Revisione della release Play: Indietro, lingua, ponte nativo, CI, audio a 48 kHz (D93; 18 novembre 2026)

- **Ramo e PR.** `fix/play-store-release-r51`, PR #22 (non unita). Non toccati: `applicationId`, `versionCode`, firma, chiavi.
- **[FATTO] Indietro** (`game/back-route.mjs`): kit di Tessa, scelta, bussa, scelta della città → nessuna azione, ma il tasto è gestito (niente pausa, niente «Tornare al telefono?»); tieni premuto → annulla la pressione; apertura → salta l’intro se il pulsante c’è. `tests/back-r52.test.mjs` (6) e `tools/verify_back_r52.cjs` (11 controlli in Chromium, falliscono sul c4ac690).
- **[FATTO] Lingua e salvataggi** (`NativeBridge.java`, `game/native-bridge.mjs`, `game/android_bootstrap.js`): catena unica impostazioni → shell → telefono → inglese; salvataggi per `addJavascriptInterface` invece di `GET /__sync`. `tests/native-bridge-r52.test.mjs` (7), `tools/verify_native_bridge_r52.cjs` (12/12, una chiamata da 574 140 caratteri).
- **[FATTO] CI** sul pacchetto `jaguarZcreatorZ13.app` (`tests/ci-package-r52.test.mjs`). Riferimenti al vecchio pacchetto rimasti, tutti storici: `docs/`, `artifacts/`, `CHRONOS_FINAL_REGRESSION_REPORT.md` e le asserzioni negative dei test.
- **[MISURATO] Audio:** 91 file a 48 kHz, 0 falliti (`docs/evidence/r52/audio_48k.json`); ruggito −15,9 LUFS prima e dopo.
- **Limiti.** Nessun ascolto umano, nessun telefono, nessun WebView vero per il ponte. Playtest umani 0, `COMMERCIAL_RELEASE = BLOCKED`.

## R50 — Tester simulati, correzioni dell’interfaccia, campagne intere, kit per i playtest umani, APK 54 (D92; 17 novembre 2026)

- **Riferimento.** D92: «testando di fatto anche con la gente che tu voglia». Da qui non si possono avere persone vere: le **sessioni umane registrate restano 0** e `COMMERCIAL_RELEASE = BLOCKED`.
- **[SIMULAZIONE] Tester simulati.** Tre agenti con una persona ciascuno (bambino di 10 anni, genitore che decide l’acquisto, designer di action giapponesi) hanno guardato 13 schermate del primo quarto d’ora. Rilievi verificati sulle schermate, corretti e rifotografati (`docs/evidence/r50/`, con le versioni «prima»):
  1. barra del boss sotto un obiettivo su tre righe (Vega), con fumetto e avvisi che ora le stanno sotto;
  2. avvisi sopra il menu di pausa, le Opzioni e l’Archivio;
  3. avviso sopra il fumetto in orizzontale;
  4. nomi tagliati ai bordi nel villaggio;
  5. suggerimento «referente chiave … sul carico» riscritto in parole semplici.
  Lasciati all’autore, perché sono scelte di design: sette comandi solo testo (icone dal kit G6 di Argon), parte alta affollata nei boss, arancione condiviso fra pericolo e obiettivo, parole difficili per un bambino, tono per gli 8 anni (`docs/evidence/r50/TESTER_SIMULATI.md`).
- **[SIMULAZIONE] Campagne intere nel browser** (`verify_campaign_browser.cjs`, input veri, orologio virtuale, con la curva R49): rotta A PASS (44 passi, 8 incarichi, 2 preparazioni, finale completo); rotta B PASS (44 passi, 8 incarichi, 2 preparazioni, finale completo).
- **[SIMULAZIONE] Altri controlli:** `verify_runtime_v09`, `verify_audio_v09`, `verify_save_recovery`, `verify_hubs_v8` PASS; R45 8/8, R47 8/8, R48 5/5, R49 4/4.
- **[FATTO] Kit per i playtest umani:** `docs/gold/PLAYTEST_KIT.md` (5 persone nuove, 35 minuti, cosa annotare, 8 domande, dove registrare, niente dati dei bambini).
- **[MISURATO]** `npm test` 582 su 582 (4 nuovi in `tests/playtest-r50.test.mjs`). `app.js` 455 701 byte (limite 458 752). APK di prova **54** (debug): 119 447 305 byte, SHA-256 `cc2c656dffb17434e4e0fb0f92a3279de596c657f2514e1016e80e39062238f5`, solo `VIBRATE`. Nessuna prova su un telefono vero.

## R49 — Curva di difficoltà per atto e Modalità storia (D92, proposta di D86; 17 novembre 2026)

- **Riferimento.** D92 vale come ok alla milestone di gioco proposta in D86 («curva di difficoltà, boss a fasi più lunghe»).
- **[SIMULAZIONE] Prima** (`tools/audit_combat.mjs`, giocatore medio e debole, 6 semi): 22 tappe su 22 vinte 6 su 6 da entrambi; colpi subiti in media per atto 3,0 / 4,2 / 3,3 / 8,0: l’Atto III facile come il primo (la città 1 colpo, Vega 2, `glass_flood` e `ascent` 0).
- **[FATTO] Curva** (`game/difficulty.mjs`, dati in `world.js`, applicata da `buildMission` prima di reputazione e scelte): solo ondate e salute dei boss, **mai tempi, finestre o hitbox** (regola 4). Tiranno +15 %, Behemoth +10 %, Reaper +10 %, Vega +15 %, EVE-Prime +20 %, Archon +10 %; un nemico in più in `app_clinic`, `app_axis`, due nella città. Rook, l’Ancora e tutto l’Atto I restano come tarati. I due inseguimenti restano brevi di proposito: sono il respiro fra due scontri duri (dente di sega, come nei giochi d’azione giapponesi); aggiungere nemici non cambia nulla perché il fuggitivo si prende prima.
- **[SIMULAZIONE] Dopo:** colpi subiti per atto 3,0 / 4,7 / 3,6 / 10,0 (medio); città 1 → 3, Vega 2 → 3 (debole 3 → 4, 32 → 36 s), EVE-Prime 4 → 5, Archon 8 → 10; il debole vince ancora 22 su 22, 6 su 6. Un primo tentativo con Vega +25 % e un tiratore in più faceva perdere 2 partite su 3 al giocatore di `campaign-v08`: ridotto.
- **[FATTO] Modalità storia** (Opzioni → Accessibilità): +4 punti vita (8 → 12) dalla tappa successiva, salvata con le impostazioni, IT/EN. Per chi vuole il racconto senza la fatica.
- **[MISURATO] Prove.** `npm test` 578 su 578 (3 nuovi in `tests/difficulty-r49.test.mjs`, fra cui la curva che sale nella simulazione; aggiornati con la ragione due test che fissavano i PV dei boss). Nel browser [SIMULAZIONE] `tools/verify_difficulty_r49.cjs` 4 su 4. Misure in `docs/evidence/r49/`. `app.js` 455 007 byte.
- **Limite.** I bot non sono persone: la curva va confermata con i playtest umani, la cosa che manca di più.

## R48 — Revisione del codice R43–R47 e correzioni (D92; 17 novembre 2026)

- **Come.** Revisione del codice del gioco da `d2cde25` (R43) a R47, livello alto; ogni rilievo verificato sul codice prima di correggerlo.
- **[FATTO] Corretti (8 su 10):**
  1. nel finale, Kairn e Morrow venuti ad aiutare (R44) ripetevano, finiti gli 8 s, la scena del primo incontro e la sua scelta in mezzo allo scontro con Archon: ora se ne vanno in silenzio;
  2. il filtro ovattato della salute bassa (R46) restava chiuso dopo una tappa vinta con poca salute, fino alla tappa a piedi successiva: ora si riapre a tappa finita;
  3. Esc con l’Archivio aperto riprendeva il gioco con l’Archivio ancora sopra; andare in background lo copriva con un secondo pannello: ora si torna al menu di pausa;
  4. il ciclo della fase di un boss (R46) dipendeva da un controllo negli ultimi 50 ms: con un fotogramma lungo il brano tornava all’ingresso; ora il salto all’indietro viene riconosciuto;
  5. l’aiuto dei quartieri toglieva l’ultimo nemico dell’ondata (spesso un tiratore) e l’avviso diceva «un assaltatore in meno»; la penalità diceva «la gang» anche dove non c’è la gang: ora toglie un assaltatore quando c’è e gli avvisi dicono cosa succede (IT/EN);
  6. l’epilogo aspettava anche le righe non mostrate (per esempio senza stranieri): un vuoto di 1,5 s prima della frase finale e dei titoli;
  7. i finali «Due strade» e «Compagni di strada», e i temi dei momenti, ripartivano dalla frase ricordata invece che dall’inizio;
  8. in inglese l’Archivio mostrava 18 ruoli in italiano.
  Inoltre il cuore usa le stesse soglie della reputazione (una sola da tarare).
- **Non corretti, con il motivo.** (a) Un salvataggio che aveva già incontrato gli stranieri prima di R44 non può più scegliere «Lo terrò lontano da tutto»: il gioco non è pubblicato e non esistono salvataggi di giocatori; (b) la soglia del cuore ripetuta in una riga dell’epilogo resta, per non legare `story-v08.mjs` a un altro modulo.
- **[MISURATO] Prove.** `npm test` 575 su 575 (8 nuovi in `tests/review-r48.test.mjs`). Nel browser [SIMULAZIONE, Chromium] `tools/verify_review_r48.cjs` 5 su 5 (Archivio ed Esc, background, ruoli in inglese). Pacchetto: `verify_bundle_en_r20` PASS. Per fare spazio, gli aiuti narrativi (`narrative.mjs`, solo funzioni) passano in `world.js`: `app.js` 454 816 byte (limite 458 752).
- **Aperto, non mio:** `tools/verify_stability.cjs` S7 fallisce anche su R47 senza queste modifiche (il giocatore automatico non raggiunge il terminale di `contagion` in 90 s); non fa parte della CI.

## R47 — Il primo brano adattivo di Argon e la tavola della tazza nel gioco (D92; 17 novembre 2026)

- **Riferimento.** D92: «metta una quadra, costruisca il gioco di AAA massimo livello … revisioni il codice e consegni il gioco premium». Consegna `delivery/argon-design-aaa-20261117` a `deb7404` (N0) ed `e7e3945` (L1, L2): solo file nelle cartelle di consegna.
- **[MISURATO] Verifica indipendente di N0.** Tre versioni di `vanta_est` (re minore, 102 bpm, 44 battute): 4 969 412 campioni ciascuna; −18,0 / −17,0 / −16,0 LUFS; LRA 13,3 / 9,6 / 12,8 LU; picco −3,4 / −2,6 / −3,1 dBFS; energia 800–3000 Hz 0,46 / 0,51 / 0,63; correlazione dell’inviluppo per tempo 0,84–0,94; cucitura −56…−74 dB. Coincide con le misure di Argon. **Non giudicabile da qui:** il timbro all’ascolto (soundfont General MIDI con campioni VSCO): decide l’autore.
- **[FATTO] Nel gioco.** Cantiere Est (`blackout`), `app_yard` e «La città senza di te» suonano `vanta_est`: calma a riposo, allerta con un nemico vicino o una minaccia da meno di 5 s, scontro quando un nemico carica o colpisce o c’è l’allarme (tenuto 6 s). Ogni cambio parte **nello stesso punto del brano** di quello che suona e sfuma in 1,2 s; tornando alla famiglia si riprende dalla frase. Le altre tappe tengono R38. File in `game/audio/v12/` (stessi SHA-256 della consegna), registro `assets/production/r47/REGISTRO.json`, rotte Android aggiunte (senza, il telefono avrebbe bloccato i file: l’ha trovato il test del pacchetto).
- **[FATTO] Momento della tazza.** Sfondo dipinto di Argon (`moment_home_cup`) dietro la scelta e la tazza fumante sopra le parole quando lo schermo è alto almeno 700 px; in orizzontale la tazza piccola resta fuori per lasciare spazio alle scelte.
- **[MISURATO] Prove.** `npm test` 567 su 567 (5 nuovi in `tests/music-r47.test.mjs`). Nel browser [SIMULAZIONE, Chromium 412×860] `tools/verify_music_r47.cjs` 8 su 8: calma all’apertura, calma → allerta → scontro camminando verso la banda, cambi allineati (3,89 → 4,02 s; 4,97 → 5,11 s), due flussi al massimo, tavola e tazza, scheda dentro lo schermo, orizzontale senza tazza; R46 5 su 5, R45 8 su 8. `app.js` 457 835 byte (limite 458 752).

## R46 — La musica segue il gioco (D91; 17 novembre 2026)

- **Riferimento.** D91: «indagine più logiche ed immersive per la musica del gioco e diverse varietà in situazioni diverse … Prompt for argon».
- **[FATTO] Indagine.** 15 brani R38 per 31 tappe, 4 villaggi e gare. `boss` serviva 6 boss, `depths` 6 situazioni, `danger`/`danger_b` 22 tappe. Ogni cambio ripartiva dalla battuta 1. I boss non cambiavano musica alle fasi. Nel porto stealth una pattuglia vicina faceva partire la battaglia anche senza essere visti. Il finale suonava sempre `reunion`.
- **[FATTO] Cambiato** (`game/score-map.mjs` in `world.js`, `game/audio-engine.mjs`, `game/runtime.mjs`):
  - i brani di esplorazione, battaglia, guida e villaggio riprendono dalla frase di quattro battute dove erano rimasti;
  - a 2/3 e 1/3 della salute il brano del boss salta alla sezione della fase e si ripete da lì;
  - nello stealth la battaglia parte con l'allarme;
  - al 30 % di salute la musica si ovatta (filtro), poi si riapre;
  - radio → tema di Lulù, gesso → tema di Nox;
  - un brano per ciascuno dei cinque finali.
  Tempi e hitbox invariati. La reputazione passa in `world.js` per fare spazio: `app.js` 456 941 byte (limite 458 752).
- **[MISURATO] Prove.** `npm test` 562 su 562 (7 nuovi in `tests/music-r46.test.mjs`, compresa la corrispondenza della mappa con i file R38). Nel browser [SIMULAZIONE, Chromium] `tools/verify_music_r46.cjs` 5 su 5; legame 8 su 8; runtime, audio e salvataggi exit 0. APK di prova **53**: SHA-256 `607506b5c723b23e5696842796ca750f7f9c9975232dd6910724fbdaa9c0c899`, solo `VIBRATE`.
- **Ad Argon (prompt v5):** guida di stile e colonna adattiva: 6 famiglie × 3 intensità allineate, 9 boss × 3 fasi, 4 villaggi, 3 di strada, 3 scene, 8 stacchetti (63 file, ≤ 48 MB). Si parte da un provino (`vanta_est`) da approvare all'ascolto. `requests/argon-musica-adattiva-v5-20261117/PROMPT_ARGON.md`.
- **Da fare dopo la consegna:** il passaggio calma → allerta → scontro nello stesso punto del brano (le tre intensità) si collega quando i file esistono.

## R45 — Il legame di Nox e Lulù e cinque finali (D90; 17 novembre 2026)

- **Riferimento.** D90: «scelte che influenzano relazione amore con Lulù e cambia finale varie variabili … coinvolgimento utente … design argon».
- **[FATTO] Quattro momenti** (`game/bond.mjs`, testi in `game/story-v08.mjs`): la tazza al rifugio (Atto I), la radio nei livelli bassi (Atto III, Nox), la parola di gesso (Atto III, Lulù), l’ascensore dell’Asse (Atto IV). Tre scelte ciascuno, solo parole; pannello «UN MOMENTO» con il filo ciano-oro-magenta; dopo la scelta «Lulú lo ricorderà». Ogni momento si chiede una volta sola.
- **[FATTO] Conseguenze.** Il ricongiungimento ricorda il gesso e la radio. Con cuore alto, nel finale Lulù interviene una volta («Sono qui», +3 salute sotto il 30 %). Cinque finali sul tetto (Ora nuova, L’alba insieme, Te lo chiederò prima, Compagni di strada, Due strade) dal cuore, dalla fiducia, dalla mano e dalla reputazione; schermata finale con nome, numero e «Finali scoperti: n su 5»; ultima riga dell’epilogo sul legame; Archivio «Con Lulú: …». IT/EN. Nessun campo nuovo nel salvataggio: un salvataggio vecchio arriva al finale canonico «Compagni di strada».
- **[MISURATO] Prove.** `npm test` 555 su 555 (6 nuovi in `tests/bond-r45.test.mjs`). `audit_combat` [SIMULAZIONE]: invariato, 6 su 6 su ogni tappa (chi non ha scelto resta a cuore medio). Nel browser [SIMULAZIONE, Chromium 412×860] `tools/verify_bond_r45.cjs` 8 su 8: momento della tazza, avviso, reazione, finale «Ora nuova» con targa e riga d’epilogo, nessun errore (`docs/evidence/r45/`). `app.js` 457 189 byte (limite 458 752). APK di prova **52**: SHA-256 `e5e607dacf8841b47f9ed0f2d62415a4596fbaf30517aa8edde8b3a5e0f43740`.
- **Ad Argon (prompt v4):** 4 tavole dei momenti con palco per gli sprite V8, 8 dettagli, 5 tavole dei finali, 6 tra icone ed effetti, 9 brani (tema di Lulù e cinque varianti per i finali). `requests/argon-legame-finali-v4-20261117/PROMPT_ARGON.md`.
- **Da confermare dall’autore:** l’età di Lulù non è scritta nel canone; i testi restano per famiglie in ogni caso.

## R44 — Scelte che pesano: reputazione, epilogo, Archivio (D89; 17 novembre 2026)

- **Riferimento.** D89: reputazione, cambiamenti di storia e tappe, epilogo collegato, stranieri e personaggi approfonditi; grafica e suono AAA ad Argon.
- **[FATTO] Reputazione.** Quartieri, Stranieri, Intesa, Veyra, calcolate da ciò che il salvataggio contiene già. Conseguenze: un assaltatore in meno o in più (non nel tutorial né nello stealth), gli stranieri nel finale se la promessa regge, l’epilogo a parole. Nuova scelta dopo l’incontro con gli stranieri, senza numeri e senza spiegazioni.
- **[FATTO] Archivio.** Pausa → Archivio: compagni (7), stranieri (2), nemici (7), boss (9) con «Come leggerlo», abitanti (45, dalle loro righe); pagine aperte dalla storia; reputazione in cima. IT/EN.
- **[MISURATO] Prove.** `npm test` 549 su 549 (5 nuovi in `tests/reputation-codex-r44.test.mjs`). `audit_combat` [SIMULAZIONE] invariato (chi non sceglie resta a «media»). Archivio aperto nel browser [SIMULAZIONE, Chromium] senza errori.
- **Ad Argon (prompt v3):** 25 ritratti dell’Archivio, 12 emblemi, 9 tavole dell’epilogo, 2 effetti, 8 suoni.

## R43 — Ambienti dinamici: capsule di cronoenergia (D88; 17 novembre 2026)

- **Riferimento.** D88: «il gioco non è immersivo… ambienti più dinamici… incentivati… sii elastico».
- **[FATTO] Cosa c'era già** (letto nel codice): segnali d'attacco con forma propria, tremolio dello schermo, numeri di danno, barre dei boss, vapori, turbine, spie e particelle per quartiere. Mancava un pezzo d'ambiente da usare in combattimento.
- **[FATTO] Capsule di cronoenergia.** 3 per tappa con pianta propria (nessuna nel tutorial). Si innescano con colpi, orbe e nove; caricano 0,45 s nel cerchio di pericolo dei nemici; scoppiano in 135 px: nemici a vista colpiti (6, boss 3), reazione a catena, mine tolte, eroe colpito se resta dentro (schivata perfetta valida). Disegno a esagono con nucleo che pulsa (fermo con «Riduci movimento»), suono, tremolio, vibrazione; suggerimento la prima volta, anche in inglese.
- **[FATTO] Regressione corretta.** I condotti di energia della mappa erano spariti sulle piante R42.
- **[MISURATO] Prove.** `npm test` 543 su 543 (5 nuovi in `tests/capsules-r43.test.mjs`). `audit_combat` [SIMULAZIONE] 22 su 22 vinte, soglie D48 rispettate.
- **[MISURATO] Fluidità delle tappe al buio.** La CI segnava «below» a p95 17–19 ms con CPU ×4 (limite 16). Profilo [SIMULAZIONE, Chromium]: la maschera d'ombra a mezza risoluzione era un terzo del fotogramma (35,6 ms/s su 105). Ora è a un quarto e non disegna le luci fuori vista: 16 ms/s, fotogramma circa 89 ms/s; a occhio identica (confronto in sessione). Test `tests/dark-mask-r43.test.mjs`.
- **Limite dichiarato.** Sprite grandi e originali: solo con i lotti G2/G4 di Argon (prompt v2; aggiunte la capsula e la sua esplosione in G5).

## R42 — Percorsi più ricchi: una pianta per tappa (D87; 17 novembre 2026)

- **Riferimento.** D87: «Genera percorsi più ricchi».
- **[FATTO] Piante.** 11 tappe a piedi lasciano le 5 piante generiche per una pianta propria: anelli di percorso (almeno due strade verso ogni obiettivo), ripari, due alcove con il forziere. Generatore con controlli: `tools/stage_layouts_r42.py` → `game/stage-layouts.mjs`. Il porto tiene la galleria (ora solo sua). Restano i vincoli dei combattimenti già progettati: ripari di Rook, piazze di «La città» e «La linea», boss di Archivio e finale, zona di «Segni di Gesso».
- **[FATTO] Difetti corretti.** La persona da scortare non si muoveva mai (nasceva senza pianta e urtava i muri di ripiego). Eroe del bot, scorta, fuggitivo e compagno si incastravano sugli spigoli: ora per camminare dritti si controlla un corridoio largo quanto il corpo; i nemici invariati.
- **[MISURATO] Prove.** `npm test` 538 su 538 (4 nuovi in `tests/stage-layouts-r42.test.mjs`). `audit_combat` [SIMULAZIONE]: 22 tappe su 22 vinte 6 su 6, soglie D48 rispettate. Prestazioni [SIMULAZIONE, Chromium]: p95 sotto 4 ms a CPU ×4. Guide per Argon rifatte per tappa (`requests/argon-design-aaa-v2-20261117/guide/`, 12 file).
- **[MISURATO] Pacchetto.** Le piante viaggiano in `world.js` (dati, come le mappe dipinte); `app.js` 447 275 byte. Bundle Android caricato in Chromium senza errori. APK di prova **49**: SHA-256 `47d99d1575bb02993b7a7787230d34a8df94fe7f27f8e6972cb4a0a35c728082`, solo `VIBRATE`. Nel browser [SIMULAZIONE]: HUD 150/150, Rook, scene di gesso, runtime, schermi piccoli 98/98: PASS.
- **Da fare dopo:** la curva di difficoltà e i boss più lunghi (proposta di D86) restano in attesa dell’ok dell’autore.

## D86 — Difetti del gioco sintetizzati e secondo prompt per Argon (17 novembre 2026)

- **Riferimento.** D86: «sintetizzami i difetti… ritmo noia combattimento… prompt grafico ultra e musicale tutto».
- **[SIMULAZIONE] Combattimento** (`tools/audit_combat.mjs`, 22 tappe × giocatore medio e debole × 6 semi): 22 su 22 vinte 6 su 6 da entrambi, tempi quasi uguali, nessuna curva di difficoltà; durate 43–53 s per la maggior parte, 5,5–22,7 s per `ascent`, `glass_flood`, `port`, `app_yard`; boss 33–49 s; Vega medio con 0 colpi subiti.
- **[FATTO] Varietà e ritmo.** 12 tappe su 22 su 5 mappe generiche; 5 ruoli di nemico; durata stimata circa 80 minuti su 150 (R29). Storia: A-01, A-02, A-05, A-08, A-09 ancora aperti.
- **[FATTO] Prompt v2 per Argon.** `requests/argon-design-aaa-v2-20261117/PROMPT_ARGON.md` e 5 guide delle piante: G1 39 ritratti, G2 8 boss con fotogrammi veri e tre aspetti di fase, G3 12 mappe dipinte sulle guide, G4 20 varianti di nemici, G5 24 effetti e segnali d’attacco, G6 kit dell’interfaccia, M2 musica solo con strumenti veri (LRA ≥ 3–4 LU, banda 800–3000 Hz ≥ 0,12, niente dissolvenza a fine giro, fasi del boss e stacchetti).
- **Proposta, non avviata:** milestone di gioco su curva di difficoltà, boss a fasi più lunghe e ritmo delle tappe brevi. Aspetta l’ok dell’autore.

## R41 — Consegna di Argon rivista e integrata, interni AAA, APK di prova 48 (D85; 17 novembre 2026)

- **Riferimento.** D85: «revisioni il lavoro… trova difetti… porta il gioco a livello premium». Consegna `delivery/argon-design-aaa-20261117`, testa `9061720`.
- **[MISURATO] Verifica indipendente.** Perimetro e base corretti, nessuna credenziale. Interni: 45 su 45, 1920 × 1080 grezzi e 1280 × 720 derivati, nessun doppione, nessun personaggio; alcuni (clinica, Atrio della Corona, `toxic_shop`) hanno un taglio verticale nel terzo destro, coperto in orizzontale dalla sfumatura dell’interfaccia. Ritratti: 6 su 45, identità mantenuta. Musica: loudness e picco veri, ma dinamica quasi piatta (0,5–1,2 LU) e timbro scuro rispetto a R38, struttura ricalcata su R38, dissolvenza di 150 ms a fine giro: **non integrata**.
- **[FATTO] Integrato.** `game/art/interiors/` con i 45 interni (registro `assets/production/r41/REGISTRO_ARGON_20261117.json` con gli SHA-256 dei grezzi); `game/art/npc/hd/` con i 6 ritratti; percorsi Android per tutti. Nuova scena: stanza dipinta a tutto schermo, personaggio grande davanti (respiro lento, fermo con «Riduci movimento»), stanza disegnata col codice solo come ripiego. Difetto corretto: il suggerimento «Parla con il referente chiave…» copriva il volto in verticale e la battuta in orizzontale.
- **[MISURATO] Prove.** `npm test` 534 su 534 (4 nuovi in `tests/interiors-r41.test.mjs`; D70 e D50 aggiornati a D84). Nel browser [SIMULAZIONE, Chromium headless]: interni 32 casi, runtime, salvataggi, villaggi, HUD 150/150, schermi piccoli 98/98, opzioni, scritte, menu con i due eroi, studio, controlli: PASS. APK di prova **48**: 114 777 419 byte, SHA-256 `c723e15c5491c9be2f852f42917614b727f4aa07b3b59ec6b8bd029117b7686f`, solo `VIBRATE`. `app.js` 446 605 byte (margine 12 147).
- **Da Argon, ancora:** 39 ritratti, boss, nemici, effetti, kit dell’interfaccia (`STATO_CODA.md` sul suo ramo). `COMMERCIAL_RELEASE = BLOCKED` invariato.

## D84 — Richiesta ad Argon per grafica e musica AAA (17 novembre 2026)

- **Riferimento.** D84: interni e ritratti professionali «AAA, con interni grafici ultra», tutti i fogli e la musica, e «non deve fallire».
- **[MISURATO] Perché gli interni sembrano una demo.** I 15 sfondi dipinti sono 320 × 180 px stirati a tutto schermo; 30 interni su 45 usano un ripiego. I ritratti sono 124 × 160 px ingranditi fino all’88 % dell’altezza; 26 personaggi su 45 non hanno un ritratto.
- **[FATTO] Prompt.** `requests/argon-design-aaa-20261117/PROMPT_ARGON.md`: controlli di partenza, regole fisse e per famiglie, lotti in ordine (A0 palette, I1 45 interni, I2 45 ritratti, A1 boss, A2 nemici, A3 effetti, A4 interfaccia, M1 15 brani), soglie misurabili, struttura della consegna con registro SHA-256, criteri di accettazione e ripresa dopo il limite di quota. La tabella dei 45 interni è ricavata da `game/arsenal-data.mjs` e `game/interiors.mjs`.
- **Prossimo passo.** Alla consegna: controlli ripetuti da questa parte, derivati nel manifest e in `game/art/interiors/`, test, CI, nuovo APK. `COMMERCIAL_RELEASE = BLOCKED` invariato.

## D83 — Pannelli premium al posto del blu piatto (17 novembre 2026)

- **Riferimento.** D83: «I pannelli non devono essere blu semplici ma design che colpisce occhio». Fusa prima la PR #17 (R40, sotto) nel ramo di sessione con un merge normale.
- **[FATTO] Cosa cambia.** Sezione «D83» in fondo a `game/style.css`: pannelli in vetro color notte con le luci di Nox e Lulú, titoli in sfumatura, pulsanti a lama con freccia, pulsante principale con riflesso (fermo con «Riduci movimento»), dialogo con la luce di chi parla, HUD, Bagaglio, interni e negozi allineati. Solo superfici e colori: misure, cornice di Argon e menu principale invariati. `app.js` non cambia (il CSS è un file a parte).
- **[MISURATO] Prove.** `npm test` 527 su 527 (5 nuovi in `tests/premium-panels-d83.test.mjs`). Nel browser [SIMULAZIONE, Chromium headless]: HUD P1 150/150, opzioni Q4 11/11, schermi piccoli 98/98, interni 32 casi, menu con i due eroi in 7 formati, scritte R4 9/9. Nessuna prova su telefono vero.
- **[FATTO] Secondo giro.** Pannelli che entrano a strati (0,3 s, fermi con «Riduci movimento»). Fine tappa in oro con ◆ se vinci, in rosso con ✕ se perdi: l'esito si legge anche senza colore. Fiammata tinta che legge fotogrammi e fps dal manifest (chiude il punto #23 di R30; a schermo identica). Verifica della fiammata spostata da `app_breach`, ora una guida, a `app_clinic`: 16 colpi su 16 con fiamma.
- **[MISURATO] Finale.** `npm test` 530 su 530. APK di prova **47** (debug): 108 515 411 byte, SHA-256 `c3fd2e906b33e0bb36ed5d1096cfaf260f234e9ac08a586d65a853c94587ae03`, solo `VIBRATE`. `app.js` 445 839 byte (margine 12 913). Rapporto: `CHRONOS_FINAL_REGRESSION_REPORT.md` §8.
- **`COMMERCIAL_RELEASE = BLOCKED`.** Invariato: 0/5 playtest, acquisto Play non collegato, firma dell’autore mancante, colonna sonora da ascoltare.

## R40 — Fogli dei boss a più fotogrammi, volume unico, spazio in `app.js` (17 novembre 2026)

- **Riferimento.** Mandato sul ramo `ccr-022499ad-zq9iu5`: fogli dei quattro boss, audio, margine di `app.js`, rifiniture. D82: il prossimo `versionCode` Play è 4. L’autore riferisce che le prove sul telefono sono andate bene. Nessuna scheda del protocollo è stata compilata qui: restano `0 / 5` in `HUMAN_PLAYTEST_RESULTS.md`.
- **[FATTO] Fogli.** Tiranno, Behemoth, Shadow Reaper e Vega avevano un fotogramma per stato. Ora ognuno dei nove stati (fermo, preparazione, attacco, cambio di fase, colpo, nucleo, colpo finale, crollo, portale) ha quattro fotogrammi. La cella è 320 px. Il fermo di Tiranno, Reaper e Vega è alto 288 px. I pixel vengono dalle pose già nel repo, ingranditi senza sfumatura. Le strisce da 128 px non sono state riscritte. Prova: `tests/boss-sheets-288.test.mjs`, tavole in `docs/evidence/r40/`.
- **[FATTO] Cosa non si è potuto disegnare.** Il Behemoth fermo resta a 261 px: le spalle non entrano in 320 px se la figura è alta 288. Lo sparo di Vega è più basso nella cella, altrimenti la fiammata tagliava la testa. La cella del colpo, sui tre boss a striscia, è la stessa della fase: il colpo è la posa ferma spinta indietro. Non c’è un passo da cui ricavare la camminata, né una posa di recupero distinta. I dieci controlli di stile del Pilastro 2 non passano: i colori sono quelli delle pose esistenti. I fogli v2 da generare restano `SPECIFIED_NOT_GENERATED`.
- **[MISURATO] Audio.** I 15 brani v11 sono a −16,0 LUFS (il titolo a −15,9), picco sotto −1,5 dBTP. Prima il finale di titolo, Eve, promessa e Lulú era 5–13 dB più piano dell’attacco: il giro si sentiva. Ora lo scarto fra i primi e gli ultimi 2 secondi sta dentro 3 dB. La gara aveva un salto di campione a −37,9 dB e non passava la soglia di −40: la dissolvenza ai bordi di quel brano è 10 ms. La regola «niente stesso brano su due tappe di fila» resta, con il suo test. Nessuno ha riascoltato i file in questa sessione.
- **[MISURATO] Peso.** `app.js` da 458 588 a **445 738** byte. Margine sulla guardia di 458 752: da 164 a **13 014**. Il manifesto dei fotogrammi è dati e sta in `world.js`.
- **[FATTO] Nome.** Nel gioco si legge Lulú, come nel titolo. Le righe vecchie con Lulù trovano la stessa traduzione.
- **`COMMERCIAL_RELEASE = BLOCKED`.** Mancano le 5 schede di playtest, il ponte di acquisto Play (non si aggiunge un `BillingClient`: il test lo vieta e serve la Console), la firma dell’autore con la chiave che già esiste, l’ascolto della colonna sonora.

## MS-2…MS-5 — Base `fbc2a05` fusa e rivista, colonna sonora nuova nel gioco, varietà, dieci rapporti, APK di prova 45 (D81; 16–17 novembre 2026)

- **Riferimento.** D81, ultima decisione: «Concludi interamente gioco e carica su github», il mandato MAX STRIKE e «Prosegui finisci gioco e carica su github». **Il token GitHub scritto in chat non è stato usato: va revocato.**
- **[FATTO] `fbc2a05` fuso con un merge normale e rivisto nel browser.** Corretti tre difetti dell'HUD tattico:
  - il radar seguiva il primo forziere dell'elenco e non il più vicino;
  - l'avviso del punto debole finiva sotto la barra del boss;
  - l'altezza era letta in pixel fisici.
- **[MISURATO] Colonna sonora R38 (D74) nel gioco.** 15 brani originali, ognuno conforme al Gate 2; ogni cue suona un brano; gli Atti III e IV combattono sul secondo brano di battaglia; l'APK contiene solo i brani nuovi. **Nessuno li ha ancora ascoltati:** serve l'approvazione all'ascolto dell'autore.
- **[MISURATO] Monotonia (D78), solo dati.** «Ultima corsia» e «Ritorno al cantiere» diventano «apri, poi difendi», e tre chiamate d'aiuto arrivano al primo dispositivo. Gruppo identico più grande da 9 a 5, serie di tappe a dispositivi da 9 a 6. `audit_combat` 50 su 50.
- **[FATTO] Dieci rapporti MAX STRIKE riscritti con soli fatti** (radice e `docs/gold/`).
- **Verifiche nel browser riallineate.** Sette cadevano identiche anche su `a9e3afd`; ora passano. Una ha trovato un difetto vero, il recupero del Rook senza inglese, ora corretto.
- **[MISURATO] Regressione.**
  - `npm test` 521 su 521; `app.js` 458 588 byte, a 164 byte dalla guardia.
  - CI verde su `e0029f7`: browser e campagna a, b e c fino ai titoli di coda.
  - Sessione lunga di 180 s: memoria 5,7–8,5 MB, crescita 0.
  - Dettagli: `CHRONOS_FINAL_REGRESSION_REPORT.md`.
- **[FATTO] Fuso il lavoro fatto con Cursor** (`cursor/premium-campagna-d6e1`, co-firmato dall'autore, R39 sotto): tempi delle armi di nuovo quelli di R37, Black Pulse come onda, prova di Veyra obbligatoria, tappe con verbi diversi. Dove si sovrapponeva a MS-3 ha vinto la sua versione. **Da controllare:** lo script dell'AAB Play ora usa `versionCode` 3 per default; una nota precedente lo dava già usato il 10 novembre: se Play lo rifiuta, `PLAY_VERSION_CODE=4`.
- **APK di prova 46** (dopo la fusione): firma di debug, 106 180 675 byte, SHA-256 `2c8a0db9…81aa78`. La 45 non contiene il lavoro di Cursor.
- **Decisioni dell'autore ancora aperte:**
  - tempi e cadenze delle armi cambiati dalla base (regola 4);
  - bonus del Black Pulse ed economia dei forzieri;
  - bonus di «intesa»;
  - gara di Veyra obbligatoria (D05);
  - cartelle `deliveries/`, `src/`, `ref_sheets/`, `public/`;
  - provenienza del JPG dell'intro;
  - ascolto della colonna sonora.
- **`COMMERCIAL_RELEASE = BLOCKED`:**
  - 0 playtest su 5;
  - nessuna prova su telefono;
  - acquisto Play non collegato (nessun ponte `ChronosBilling`, quindi la demo non si chiude);
  - firma dell'autore mancante.
## R39 — Varietà di campagna, tempi D75, Black Pulse, finale (D81; 16 novembre 2026)

- **Riferimento.** D81 («Concludi interamente gioco e carica su github»), D78 (monotonia), D75 (tempi e hitbox non si cambiano: qui si rimettono quelli di R37). Nessuna decisione nuova.
- **[FATTO] Tempi.** VX-9 di nuovo a 0,48 s; Tempest 0,48, Helix 0,44, Rotativa 0,56, Vulcan 0,62; durata minima dell’azione 0,26 s; nitro di nuovo a 12/s e spinta a 0,75 della durata. Visione del porto: già 260 in R37, lasciata com’era. Fonte: `git diff a0815be` su `game/weapons-v9.mjs`, `game/arsenal-data.mjs`, `game/campaign.mjs`, `game/driving.mjs`.
- **[FATTO] Black Pulse.** Non aggiunge più danno a ogni colpo e non dimezza la cadenza. È un’onda (1,35 s) che colpisce una volta, stordisce i non-boss e apre il punto debole. Poi resta il calore.
- **[FATTO] Tappe.** Verbi diversi sui dati esistenti: scorta, inseguimento, un nodo sotto pressione, stealth con allarme che si spegne se esci dai coni, duello, staffetta al posto del timer di `city` e `line`. `app_breach` è la prova breve di Veyra (subito dopo «fatemi vedere se sapete anche guidarla»). `app_port` e `app_archive` sono scene con un gesto e un premio visibile, così l’atto III non è più otto piedi di fila. I beat `*_mid` non ripetono più «abitante in trappola + kit».
- **[FATTO] Boss.** Tiranno: osso fra i due, finché sta in piedi il danno cala. Behemoth: sfiato obbligatorio a schiena aperta. Reaper: solo il miraggio vero. Vega: solo il conteggio fino al quarto colpo. Fuori dalla finestra il danno cala, non va a zero.
- **[FATTO] Musica.** Nessuna cue uguale su due tappe di fila (le guide leggono il brano di `driving.mjs`). Intro studio: i tre frame già nel repo (`jaguar_intro_f1..f3.webp`, testa, scarica, marchio), 4,4 s, ruggito; dalla volta dopo, se l’hai vista fino in fondo, non riparte (`city-studio-seen`). Titoli saltabili.
- **[FATTO] Play.** `versionCode` 3, `targetSdk` 36, `debuggable` false nel flusso `tools/build_play_aab.sh`. Segreti in `docs/gold/PLAY.md`. Workflow `.github/workflows/play-aab.yml`.
- **[IPOTESI] Audio e fogli.** I brani v10 sono loop corti (circa 14–22 s, già scritto in R21) e non sono stati riascoltati qui: non ho prodotto placeholder. I fogli dei boss non sono a 288 px come chiede `docs/design/v10.3/CHRONOS_ARTE_P2_PIPELINE.md`. Elenco nel rapporto di chiusura. I suoni v86 già nel motore (`bellThirteen`, `liaMemoryTape`, `unit9Halt`, `noxKeepsake`, `theRamHorn`, `ironOrchardPulse`, `enemyTelegraphV86`, `distantCities`) ora partono nei momenti che li nominano.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono, acquisto Play non collegato, firma dell’autore mancante.

## MS-1 — Base dell'autore `a9e3afd` più R30–R37, intro nuova, menu con Nox e Lulù (D78, D79, D80; 16 novembre 2026)

- **Riferimento.** D80, ultima decisione («nel menu ci devono essere sia Nox che Lulu»); D78 (base, menu di sempre, intro, monotonia); D79 (mandato MAX STRIKE). Nessuna decisione aperta è stata presa da sola.
- **[FATTO] Base.** Il ramo `work/chronos-adventure-commercial` è stato riscritto due volte da fuori con un push forzato (`0b07afe`, poi `a9e3afd`, senza genitori). Questa sessione non ha riscritto storia: fusione a tre vie con base `14f5bdc` (R29), un merge con due genitori. Copia di sicurezza di R37: `backup/work-r37-a0815be`. `a9e3afd` = R29 più il lavoro di un altro strumento: Nova sonica di Lulù, forzieri, serie di colpi, quattro armi, Veyra alleata ai moli, incarichi facoltativi all'uscita dai villaggi, storia più ricca.
- **[FATTO] Tenuto di R30–R37:** ruggito e musica del menu, fuoco coerente con la canna, risveglio dei boss, fiammata nemica riconoscibile senza colore, correzioni da telefono; D68 e D70 (niente arte segnaposto, niente ricordi senza effetto) e il canone.
- **[FATTO] Intro.** I tre frame e il tema c'erano come file ma non si vedevano. Ora: testa, testa con la scarica, nome con il lampo e il ruggito. In verticale il nome occupa il 91% della larghezza. Il menu è quello di sempre. Prova: `tools/verify_studio_browser.cjs` (5 formati, [SIMULAZIONE] Chromium: non si sente nulla e non è un telefono). Il ruggito a 1,62 s va ascoltato da una persona.
- **[MISURATO] Menu (D80).** Difetto vecchio: all'apertura Lulù era al 100% e Nox a 0% per circa 0,7 s. Corretto in CSS; scarto di opacità fra i due: 0,00 in 7 formati. Prova: `tools/verify_menu_heroes_d80.cjs`, `tests/mobile-ui-contract.test.mjs`.
- **[MISURATO] Test.** `npm test` **502 su 502**. `app.js` 456 212 byte, guardia 458 752: margine 2 540.
- **[MISURATO] Batteria nel browser sull'albero fuso, finita [SIMULAZIONE, Chromium].** 41 verifiche PASS (tra le altre: runtime, hub, gare, controlli, salvataggi, stabilità, touch, gamepad, audio, apertura, marchio, boss, arsenale 37 negozi, ingresso dei boss, fuoco 16/16, schermi piccoli 98/98, zoom del testo, HUD 158/158, studio 5 formati, menu con i due eroi 7 formati). **Regressioni vere della base, corrette:** (1) `aim_r28`: con «Mira assistita» spenta il colpo andava dove guardava l'eroe, non dove puntava il pollice (campo `aimLive`; ora 7 su 7); (2) `labels_r4`: «CARICO · CAMBIA ATTO/MONDO» e «FORZIERE» a 6–7 px (ora 12 px minimo). **Cadono identiche sulla base `a9e3afd` pura, quindi non sono regressioni della fusione ma verifiche rimaste indietro rispetto alle sue modifiche:** `locale_browser` (prima battuta ora SYSTEM), `chalk_migration`, `chalk_scene`, `chalk_music`, `leitmotifs`, `locale_hub`, `release_flow`, `rook_browser` e `rook_recovery` (Rook ora 60 PV invece di 48). Da aggiornare una per una. `long_fire_r36` non è stata eseguita (argomenti sbagliati nella mia batteria): da rieseguire.
- **Revisione indipendente del combattimento (agente separato): FAIL sulle regole, non sulla stabilità.** Nessun crash, NaN o blocco (fuzz su 25 missioni, `audit_combat` tutte vinte). **Decisioni tue, non prese da me** (la base le ha cambiate e restano come le ha caricate l'autore): (a) tempi di armi esistenti cambiati contro la regola 4 e D75 (VX-9 .48→.26 s; mitragliatrici .44–.62→.17–.20 s; durata dell'azione .26→.18 s; velocità e visione di `port` e `app_node`; nitro 12→14/s); (b) Black Pulse di Nox aggiunge un bonus fisso a ogni colpo: con le mitragliatrici i boss della Parte I cadono in 2–3 s; (c) con il Vulcan un colpo frazionario in finestra di debolezza vale fino a ×4; (d) 49 forzieri pagano circa 1,6 volte tutti i nemici; (e) la Risonanza di Lulù tiene Vega fermo il 53% del tempo (era il 30%). Le correzioni minime sono nel rapporto.
- **Revisione indipendente di storia e missioni (agente separato): PASS CON RISERVE, nessuna violazione del canone.** Applicati tre ritocchi di testo (Rook «Tre colpi», «i nuclei del Nodo»; «creata» per Lulù resta corretto, il revisore sbagliava e il test di canone lo difendeva). **Da decidere:** i bonus di «intesa» spostano il finale emotivo (ricongiungimento caldo 25% → 80%); il Custode rivela la firma di Lulù prima della scena di rivelazione; la gara di Veyra non è nel percorso obbligatorio (D05); Veyra alleata riceve motosega e doppietta di Morrow e lo sprite di un nemico.
- **Monotonia, misurata [SIMULAZIONE].** 20 passi giocabili su 31 sono lo stesso ciclo «attiva 3 dispositivi con un'ondata per dispositivo»; 5 ruoli di nemico, 4 già al passo 2 e il quinto al 5; ultimo sfondo nuovo al 15; 11 tappe su 25 usano 4 mappe generiche; 0 gare nel percorso obbligatorio. Interventi proposti, quasi tutti solo dati: difese di zona al posto di 2–3 tappe a dispositivi, ondate a tema, gare raggiungibili, potatura di circa 2,3 KB di dati morti. Tabelle in `monotonia.json` (scratchpad). Non ancora implementati.
- **Revisione indipendente di sicurezza (agente separato, sola lettura): nessun segreto.** Rotte e manifest a posto. `.aistudio/` (18 MB) tolta dal commit e messa in `.gitignore`. **Da chiedere all'autore:** `deliveries/` (9 MB), `src/` (8 MB), `ref_sheets/`, `public/`, `bun.lock`, JPG degli NPC, `docs/FINAL_PRODUCTION_RELEASE_REPORT_20261118.md` (cifre non verificate, data 18/11); provenienza del JPG da cui derivano i tre frame dell'intro.
- **Colonna sonora R38.** I 15 brani passano ora il controllo dell'armonia (accordi fatti seguire alla melodia). Da rendere e misurare, poi collegare; l'approvazione all'ascolto spetta all'autore.
- **Non fatto:** monotonia (MS-3), audit A–Z e dieci documenti (MS-4), APK 45 (MS-5), playtest umani.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono, acquisto Play non collegato, firma dell'autore mancante.

## R37 — Errori da telefono vero che Chromium non vede (D77, 15 novembre 2026)

- **Riferimento.** D77, ultima decisione: «Trova bug o errore brutti prima di qualche utente o io stesso, stressa… Deve essere tutto perfetto, non voglio ridare rimborso». Nessuna decisione nuova. PR #12 (R28–R36) unita in `work/chronos-adventure-commercial` con la CI verde (browser, campaign a/b/c).
- **[FATTO] Zoom del testo.** Il WebView di Android ingrandiva il testo secondo il carattere del telefono [IPOTESI: comportamento noto del WebView, non misurato su un telefono], dentro pulsanti e pannelli misurati in pixel e mai provati così. Ora `MainActivity` tiene il testo al 100% (`setTextZoom(100)`) e passa alla pagina la scala del carattere; con «Grande» o più (≥ 1,15) e nessuna scelta nelle Opzioni si accende il «testo grande» già provato. La scelta esplicita vince e non si salva nulla in automatico. Prova: `tools/verify_text_zoom_r37.cjs` (4 casi su 4).
- **[FATTO] Gesto Indietro.** Con la navigazione a gesti, uno strisciamento dal bordo è «Indietro»: il joystick, che vale in ogni punto (regola 8), partiva dal bordo, il gioco perdeva il tocco e si apriva «Tornare al telefono?» in pieno combattimento. Ora i 200 dp bassi dei due bordi (il massimo concesso da Android) restano al gioco, da Android 10. Indietro funziona ancora dalla parte alta dei bordi e dal tasto.
- **[FATTO] Tacca della fotocamera.** Da `targetSdk` 35 l'app è disegnata da bordo a bordo; i margini ora prendono il massimo fra barre di sistema e tacca [IPOTESI: in orizzontale, cioè nella guida, la tacca laterale non era compresa].
- **[MISURATO] Schermi piccoli.** Un telefono 360×640 dp lascia al WebView circa 360×568 (barre 24 + 48 dp), mai provato. Due difetti veri trovati: (1) nel pannello di pausa «Menu principale» era fuori schermo, dietro uno scorrimento invisibile (a 360×640: 597–645 su 640); (2) nel menu principale, con «Continua» presente, Nox copriva la riga di presentazione e la C di CHRONOS fino a 720 px d'altezza. Corretti solo con CSS sugli schermi verticali bassi (stessi comandi, tutti ≥ 44 px). Prove prima e dopo: `docs/evidence/r37/`.
- **[MISURATO] Browser [SIMULAZIONE, Chromium]:** `tools/verify_small_screens_r37.cjs` 94 su 94 (dialoghi e scelte con testo grande, pausa, menu, a 360×568, 592×336, 360×640, 360×800 e altri); HUD con testo grande a 360×568 e 592×336: 80 su 80; HUD nei 4 formati di sempre (`verify_hud_p1`): 158 su 158; `qa:controls`, `qa:opening`, Opzioni Q4: PASS. Il bundle in forma Play (targetSdk 36, `jaguarZcreatorZ13.app`, versionCode 44, chiave usa e getta) compila.
- **Già a posto, controllato:** Indietro su Android 16 (`enableOnBackInvokedCallback="false"`); salvataggio a ogni pausa o uscita (`suspend` chiama `persist`); passo del fotogramma limitato a 0,05 s al ritorno dal background; conferma prima di «Nuova storia» sopra un salvataggio.
- **[MISURATO]** `npm test` 492 su 492. `app.js` **455 378** byte (+95), guardia 458 752: margine **3 374**.
- **APK di prova v44** (firma di debug, `versionCode` 44, 101 025 732 byte, SHA-256 `e06116f0c029d98f6131618d46f27f593dbcb4ec118d78d79f41d0e60e3027dd`).
- **Non fatto:** colonna sonora nuova (Fase 2, prossima milestone R38), playtest degli agenti (Fase 1), durata (circa 80 minuti su 150; serve la decisione sulle gare Vortex).
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R35–R36 — Revisione corretta, stress da utente impaziente, batteria rieseguita (D76, 15 novembre 2026)

- **Riferimento.** D77, ultima decisione (stress prima degli utenti; prossimo passaggio: APK del gioco completo), e D76. Richieste dell'autore: «trova altri errori anche di boss», «Trova bug o errore brutti prima di qualche utente o io stesso, stressa… Deve essere tutto perfetto, non voglio ridare rimborso», «Scrivi codice, hai il mio ok».
- **[FATTO] R35, errori miei trovati dalla revisione e corretti.** (1) La correzione di Vega (R34) salvava il checkpoint del boss al primo istante: chi moriva riprovava senza le ondate iniziali. Ora l'ingresso di un boss senza dispositivi non salva nulla. (2) «VEGA si è svegliato»: avviso al femminile per Vega, EVE-Prime e Archon (Elena Voss), che prima era al maschile. (3) La fiammata nemica aveva la stessa forma di quella degli eroi: ora è più corta e con un anello, anche con movimento ridotto (regola 9). Prova nel browser: `tools/verify_boss_entrance_r35.cjs`.
- **[FATTO] R36, exploit corretto.** Con il minimo di una moneta, un rottame cambiato da solo valeva una moneta invece di mezza. Ora si cambiano solo coppie e quello dispari resta (`game/hubs.mjs`, test in `arsenal-economy-v11`).
- **[MISURATO] Stress (Chromium, non un telefono).** `tools/monkey_r36.cjs`: tocchi casuali su schermo e pulsanti, joystick, Esc, app in background e ritorno, schermo ruotato. Circa 4 300 azioni in 9 scenari (menu, apertura, hub, missione, boss, fuga in auto, Vega, finale) e circa 4 900 in modalità «solo gioco», guida compresa: nessun errore, nessun pannello di guasto, nessun blocco, nessun numero impossibile (`docs/evidence/r36/`). `tools/verify_long_fire_r36.cjs`: 3 minuti di fuoco continuo nell'arena di Archon, memoria JS fra 5 e 7 MB (variazione −0,5 MB), costo del fotogramma sotto 3 ms. Simulazione casuale di 300 partite con 12 armi e 8 mosse: nessuna violazione. Economia: vendere rende il 60%, comprare costa almeno l'80%, quindi nessun giro di guadagno.
- **[MISURATO] Batteria rieseguita sul commit R35** (la revisione aveva ragione: l'handoff la dichiarava senza averla rifatta). PASS: `npm test`, i 10 `qa:*`, bundle inglese, gara dall'hub, modalità gara, studio, 20 tappe, interni, nemici D46, HUD (153 controlli), demo, opzioni, scritte, D39, mira manuale, fuoco in 8 direzioni, audio del menu, ingresso dei boss, `verify_v9_governance`, audit D48 (50 righe su 50 a 6/6), arsenale (37 negozi, 2 bagagli, 17 combattimenti). Tre giri completi PASS: **A 80,2 · B 82,9 · C 78,3 minuti probabili** (minimo 57,7 / 59,5 / 56,3; alto 111,3 / 115,8 / 108,6; facoltativi circa +11): `docs/evidence/r36/PLAYTIME_ESTIMATE_R35.md`. Dopo, R36 ha cambiato solo il cambio dei rottami e la sua voce di menu, coperti dai test: `npm test` 487 su 487.
- **[MISURATO] Peso.** `app.js` **455 283** byte, guardia 458 752: margine **3 469** byte.
- **APK di prova v43** (firma di debug, `versionCode` 43, 101 025 732 byte, SHA-256 `6d74b3f59654ef7ea7091b89ad838bd028ebc369006c78d446dbe355e8863bae`), costruito dal commit R36.
- **Non fatto:** colonna sonora nuova (Fase 2) e playtest degli agenti (Fase 1). La durata resta circa 80 minuti su 150.
- **Lasciati aperti dalla revisione, di proposito [IPOTESI: rifiniture, non errori]:** la soglia di 15° scritta in tre punti; due percorsi di risveglio dei boss (`wakeBoss` e l'ingresso al primo tick); molti test controllano il testo del codice invece del comportamento.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R34 — Caccia agli errori sui boss (15 novembre 2026)

- **Riferimento.** D76, ultima decisione. Richiesta dell'autore: «trova altri errori anche di boss». Nessuna decisione nuova in questo blocco. Passaggio al PC: `docs/gold/HANDOFF_20261115_PC.md` e `docs/gold/PROMPT_RIPRESA_PC_20261115.md`.
- **[MISURATO] Controllato su tutti e 9 i boss** con il bot (6 semi, giocatore medio e debole): 54 combattimenti vinti su 54; nessun boss dentro un muro (zero tick dentro un rettangolo di muro; il «fuori pavimento» della prima prova era il margine di 18 px della funzione di prova); nessun boss fermo; animazioni dei fogli complete (idle, carica, attacco, colpo, nucleo esposto, caduta, portale); nomi e musiche presenti; tutti i `midEvent` raggiungibili; nessuna battuta senza traduzione inglese; nessun errore di genere nei dialoghi (4 sospetti, tutti falsi allarmi).
- **[FATTO] Errore trovato e corretto: Vega non annunciava il risveglio.** La sua tappa non ha dispositivi da attivare, quindi il boss parte già sveglio e `wakeBoss` non veniva mai chiamata: le battute d'ingresso (`bossWake`, `bossWakeb`) e il suono d'apparizione non partivano mai. Ora il risveglio è annunciato al primo tick (una volta sola). Prova: `tests/boss-wake-r34.test.mjs`; nel browser `suspense_boss` suona.
- **Non verificate dal bot [IPOTESI]:** la battuta `lowHp` della prima tappa e la `silent` del porto (condizioni che il bot non raggiunge: vita bassa, uccisione silenziosa); si guardano nella prova su telefono.
- **[MISURATO]** `npm test` 485 su 485.

## R33 — Correzioni dalla revisione di R31–R32; stato per il passaggio al PC (15 novembre 2026)

- **Riferimento.** D76 e D74, ultime decisioni. Nessuna decisione nuova dell'autore in questo blocco. Base: `work/chronos-adventure-commercial` con la Fase 0 (PR #10 e #11).
- **[FATTO] Difetti veri trovati dalla revisione e corretti.** (1) Con più pallini per colpo (R-12, Flak) solo la prima fiammata prendeva il colore: ora ogni fiammata prende il proprio. (2) La fiammata dei nemici a distanza partiva 24 px di lato e in più compariva il vecchio lampo arancione: ora parte dal punto del proiettile e il vecchio lampo resta solo per le raffiche. (3) Il nemico si girava solo nell'avvicinamento: ora si volta verso il bersaglio mentre mira, così il fuoco non esce dalla schiena (cambia solo il verso del disegno). (4) La fiammata dell'eroe ignorava il colore proprio delle armi di mercato: ora lo usa. (5) Il fotogramma del lampo supponeva 0,065 s fra i colpi di una raffica; il mitra ne usa 0,045: ora usa il passo vero. (8) Le tre tinte si costruiscono prima del primo colpo, una volta per foglio.
- **Non corretti, per scelta [IPOTESI].** (7) Il disegno tinto ripete 4 fotogrammi e 12 fps invece di leggere il manifest: va unificato quando si tocca di nuovo. (9) Le minacce devono riconoscersi senza colore (CLAUDE.md regola 9): la fiammata nemica ha la stessa forma di quella dell'eroe e cambia solo tinta; il colpo nemico però ha già il segnale di mira e il proiettile arancione con nucleo bianco. Da decidere con la prova su telefono. (10) I commenti nel codice sono in inglese come in tutto il repo: la regola 1 riguarda il parlato e gli scritti per l'autore.
- **[MISURATO]** `npm test` 482 su 482 (4 test nuovi in `tests/muzzle-fire-review-r33.test.mjs`). Audit D48: 50 righe su 50 a 6/6. Browser [SIMULAZIONE, Chromium]: fiammata 16 tiri su 16 in 8 direzioni, nemici D46 13 luoghi, `qa:runtime` PASS.
- **[MISURATO] Peso.** `app.js` 454 723 byte in R33; con R34 **455 016**, guardia 458 752: **margine 3 736 byte**. Ogni lavoro nuovo in `game/` deve prima fare spazio (vedi `docs/gold/SIZE_LOG.md`).
- **Non fatto (era nel piano): Fase 1 e Fase 2.** I cinque agenti (designer, tre giocatori simulati, compositore) si sono fermati e non hanno consegnato resoconti né brani: la colonna sonora nuova è ancora da fare. La musica attuale resta quella di prima (mono 32 kHz da MIDI, loop corti), con il ruggito e il menu che parte da solo (D74).
- **APK di prova v40** (firma di debug, `versionCode` 40).
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R31–R32 — Fiammata del colore dell'eroe; fuoco dipinto coerente con la mira in ogni sprite (D76, D74, 14 novembre 2026)

- **Riferimento.** D76, ultima decisione («il fuoco che esce dalla canna quando spari in qualsiasi sprite sheet deve essere coordinato e coerente con la direzione di mira di fuoco»), e D74 («Verifica che bella fiammata»). Immagine: `docs/evidence/fase0/FUOCO_COERENTE_R32.png`.
- **[FATTO] R31.** La fiammata ruotata (R29) era arancione mentre il lampo dipinto negli sprite è azzurro per Nox e rosa per Lulù: ora è ricolorata per eroe (nucleo bianco), con un bagliore additivo sulla canna, spento con il movimento ridotto.
- **[FATTO] R32.** Il lampo dipinto nei fogli di sparo esiste in 4 pose: fuori di 15° dall'asse della posa si disegnano i fotogrammi vicini senza lampo e il fuoco lo dà la fiammata ruotata. Vale per eroe, compagno e tutte le armi; per Morrow (scoppio dipinto solo orizzontale); per i nemici a distanza, che oltre 15° mostrano l'ultimo fotogramma di carica invece dello scoppio orizzontale e hanno una fiammata ruotata nel colore del pericolo `#FF5A36`.
- **[MISURATO]** `npm test` per intero verde; `tools/verify_muzzle_fire_r29.cjs` 16 tiri su 16 in 8 direzioni.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## Fase 0 — Base vera e verde da d3ea80d (D75, D74, 14 novembre 2026)

- **Riferimento.** D75, ultima decisione («Sei lo STUDIO… Parti da 0 e finiamola creano piano dettagliato»), e D74 (musica, ruggito, menu muto). Piano completo: `docs/gold/PIANO_PLAY_STORE_20261114.md`. Ramo `ccr-022499ad-zq9iu5`, creato da `d3ea80d`.
- **[FATTO] Da dove si parte.** `d3ea80d` di Argon è arrivato su `main` e su `work/chronos-adventure-commercial` con un push forzato (`git fetch`: «forced update»). Contiene il codice di R22–R29 compresso in un commit, ma non la loro storia (salvata in `origin/backup/work-r29-14f5bdc`), e porta anche: Bibbia V8.6, 9 suoni v86, battute dei boss legate alla meccanica, DUO fuori sincro nella tappa zero, ritmo di Vega, porto più severo, volume per cue.
- **[MISURATO] Cosa non andava in `d3ea80d`.** `npm test` 458 su 469 (il messaggio di commit diceva «460/460»). Il pacchetto Android era tornato a una versione vecchia: niente ritratti in pixel (`.png`), niente edifici dei villaggi, niente `world.js`, file mancanti saltati in silenzio. Ogni missione caricava immagini segnaposto che il pacchetto non copiava: nel browser la tappa 20 (`below`) finiva sul pannello «Qualcosa si è inceppato»; nell'APK sarebbe successo in ogni missione. Undici test e due verificatori indeboliti o sostituiti (lo studio cercava di nuovo un video, contro D61). Cancellati D67–D73, 103 righe di `STATO.md` e 58 file di prova.
- **[FATTO] Fase 0.1–0.6.** Pacchetto Android ripristinato con un file mancante che ferma la build; tolta l'arte segnaposto (mappa blu della prima missione, cerchi del DUO, fogli v86 e sprint01: figure piatte) e i quattro «ricordi» senza effetto (D70; uno faceva parlare Nox al femminile); test e verificatori riportati a R29; specifica economica riallineata; documenti e prove ripristinati; D74 fatto (audio libero di partire su Android, ruggito sintetizzato sul lampo del giaguaro, musica del menu senza tocco).
- **[MISURATO]** `npm test` 474 su 474. `app.js` 451 478 byte (margine 7 274 sotto 458 752). Browser [SIMULAZIONE, Chromium]: `qa:runtime`, `qa:hubs`, `qa:controls`, `qa:save`, `qa:stability`, `qa:health`, `qa:touch`, `qa:gamepad`, `qa:audio`, `qa:opening`, bundle inglese, gara dall'hub, modalità gara, studio (5 formati), 20 tappe, interni, nemici D46, HUD, demo, opzioni, scritte, tastiera D39, audio del menu: PASS.
- **[FATTO] Controllo ricorsivo (0.7).** La CI di GitHub sulla PR #10 era rossa: due test usano Python con Pillow e numpy, assenti sulla macchina della CI (aggiunti al workflow). `verify_v9_governance` falliva già da R19: i checksum degli artefatti di HUD e comandi non erano stati aggiornati (ora sì). `tools/build_aab.sh` dava `versionCode` 1 di base (ora quello del manifest) e non impediva un AAB di rilascio debuggable; `tools/build_play_aab.sh` dava 3, già usato il 10 novembre (ora va passato a mano). Bibbia V8.6: Nox è maschile, Kairn e Morrow mai giocabili nella Parte I.
- **[SIMULAZIONE] Giri completi sul codice della Fase 0: tre rotte PASS** (44 tappe, 8 incarichi, 2 preparazioni, finale completo). Il primo tentativo della rotta B si era fermato nella Clinica perché `d3ea80d` aveva tolto lo sblocco dagli spigoli del bot (R28); ripristinato con altri tre strumenti regrediti (0.8), fra cui il calcolo della durata, che contava 5 boss su 9. **Durata: A 79,8 · B 83,2 · C 80,2 minuti probabili** (minimo 57,4 / 59,7 / 57,6; alto 110,6 / 116,4 / 111,6; facoltativi circa +11): `docs/evidence/fase0/PLAYTIME_ESTIMATE_FASE0.md`. Mancano circa 65–70 minuti ai 150 (D65).
- **Gate 0:** chiuso in locale; resta da vedere verde la CI di GitHub sulla PR #10.
- **Non fatto in Fase 0:** colonna sonora nuova, fiammata, resoconti degli agenti (i cinque agenti si sono fermati per il limite d'uso), durata: sono le Fasi 1–4 del piano.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R29 — Il fuoco di bocca punta dove va il colpo (D73, 14 novembre 2026)

- **Riferimento.** D73, ultima decisione: «Il fuoco che esce dalla canna dello sparo». Immagine: `docs/evidence/r28/FUOCO_DI_BOCCA_R29.png` (8 direzioni, Nox sopra, Lulù sotto).
- **[MISURATO] Il difetto.** La fiammata di bocca è un solo disegno rivolto a destra e veniva disegnata così com'è: a ogni tiro verso sinistra, in alto o in basso il fuoco puntava a destra. Era anche centrata sulla canna, con metà fiamma dietro.
- **[FATTO] Ora** la fiammata è girata dalla canna verso il punto d'arrivo del colpo, con la base sulla canna, e raddrizzata quando si spara a sinistra; il compagno ha la sua; il colpo che passa da un nemico all'altro non ne ha.
- **[MISURATO]** `npm test` 468 su 468. `app.js` 447 918 byte (+486, margine 10 834). `qa:runtime` PASS.
- **[SIMULAZIONE] Browser** (`tools/verify_muzzle_fire_r29.cjs`, Chromium, non un telefono): 16 tiri su 16 (8 direzioni per eroe), fuoco presente e orientato in tutti, nessun errore.
- **[SIMULAZIONE] Giri completi sul codice di R28–R29: tre rotte PASS** (44 tappe, 8 incarichi, 2 preparazioni, finale completo). **Durata: A 79,9 · B 84,0 · C 80,0 minuti probabili** (minimo 57,5 / 60,3 / 57,5; alto 111,0 / 117,6 / 111,4; facoltativi circa +11). In R24 erano 75,1 / 84,3 / 78,9: le piante R26 allungano un poco le rotte A e C. Rapporto: `docs/evidence/r28/PLAYTIME_ESTIMATE_R28.md`. **Mancano circa 65–70 minuti ai 150 concordati (D65).** Il bot ha dovuto usare lo sblocco dagli spigoli 74 / 246 / 66 volte (rotte A / B / C): con la tastiera gli spigoli delle mappe dipinte lo fermano spesso; con il joystick va guardato su telefono. Il disegno del fuoco di bocca è cambiato a giro avviato: è solo grafica e non tocca tempi né combattimento.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R28 — Il colpo esce dalla canna e la mira manuale prende ciò che si indica (D72, 14 novembre 2026)

- **Riferimento.** D72: «quando spara il gioco che esce dalla canna non è coerente alla direzione di dove spara e la mira non assistita non funziona bene». Immagini: `docs/evidence/r28/MIRA_MANUALE_R28.png` (per tre tiri: linea di mira, pallottola che esce, arrivo).
- **[MISURATO] I difetti.** (1) Pallottola e vampa partivano all'altezza della cintura (32 px sopra i piedi), non dalla canna disegnata (66 px nella posa laterale, 96 verso l'alto, 23 verso il basso). (2) La posa laterale restava fino a 56° verso il basso. (3) La mira manuale confrontava solo i piedi: puntando dalla canna al petto di un nemico si mancava di 30–40 px. (4) Al primo fotogramma lo sprite della pallottola, lungo circa 100 px, veniva disegnato anche dietro la canna, sopra chi spara.
- **[FATTO] Ora** la canna di ogni posa (Nox e Lulù, pistola di servizio, VX-9/H-17, R-12/ARC-7, 4 direzioni) è misurata sulla vampa dipinta del fotogramma di sparo (`tools/measure_muzzles_r28.py --check`, tabella `MUZZLE_V9` in `game/weapons-v9.mjs`); pallottola, raggio, vampa e linea di mira partono da lì e arrivano al petto del nemico colpito; la posa è quella più vicina all'angolo (laterale fino a 45° in basso e 16° in alto, diagonale fino a 62°); dietro la canna non si disegna nulla; il compagno alza la pistola quando spara.
- **[FATTO] Mira manuale.** Il raggio che parte dalla canna prende il primo nemico di cui attraversa il corpo disegnato (più 12 px per il pollice); se la direzione scelta lo prende già, resta quella, altrimenti gira sui suoi piedi. La linea di mira si ferma su di lui con un anello rosso. Con tiro assistito spento, il tocco senza trascinare mostra e spara verso dove guarda l'eroe. Senza nemici sul raggio il colpo va dove si punta e manca.
- **[FATTO] Non cambia:** danno, cadenza, gittata, corridoi di colpo (25 e 37 px), muri che fermano i colpi, tiro assistito, movimento.
- **[MISURATO]** `npm test` 465 su 465 (7 test nuovi in `tests/aim-muzzle-r28.test.mjs`). Audit D48: 50 righe su 50 vinte 6 su 6, come prima. `app.js` 447 432 byte (+2 971, margine 11 320).
- **[SIMULAZIONE] Browser** (`tools/verify_aim_r28.cjs`, Chromium, non un telefono, tiro assistito spento): 9 colpi su 9 trascinando il pulsante di sparo verso il petto di nemici veri in tre tappe; 4 di quei 9 con la regola di prima sarebbero andati a vuoto.
- **[FATTO] Un errore trovato e corretto prima del commit.** La prima versione calcolava il punto d'arrivo anche per eventi senza bersaglio: al primo colpo andato a segno il gioco si fermava sul pannello d'errore. Lo ha trovato la prova nel browser, non i test; ora c'è un controllo nel test.
- **[FATTO] Clinica, giro della rotta B.** Il bot del giro completo restava fermo 20 minuti contro lo spigolo di un muro (`a_clinic`, x 720, y 380): con la tastiera, che è digitale, la piccola correzione verso l'alto cadeva nella zona morta. Corretto il bot (`tools/verify_campaign_browser.cjs`: se l'eroe resta fermo con i tasti premuti, aggiunge il tasto laterale), non il gioco.
- **[MISURATO] Provato e scartato:** una correzione d'angolo per l'eroe (scivolare di pochi pixel sugli spigoli). Toglieva l'incastro, ma col movimento senza incastri il Forge Behemoth diventava più duro per il bot (giocatore medio del test: 30 vittorie su 60 invece di 44 su 60) e i cancelli D48 cambiavano esito in modo non monotono con la sua vita (265: 5 su 6; 255: 4 su 6; 245: 5 su 6). Il movimento resta quello di prima; gli spigoli si guardano nella prova su telefono.
- **Giri completi e durata:** vedi R29 (tre rotte PASS, A 79,9 · B 84,0 · C 80,0 minuti probabili).
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R27 — D39 chiusa: la tastiera di un giocatore non gioca più (14 novembre 2026)

- **Riferimento.** D39 (4 novembre 2026): «togli i comandi J, Q, comunque tutti i comandi da tastiera corrispondenti alle azioni di gioco. È un gioco full mobile.» Era aperta da R6. Ultima decisione D71.
- **[FATTO]** Nessun tasto muove, spara, schiva, usa abilità, cura, cambia arma o mossa, ricarica, interagisce o guida per un giocatore. Restano Esc (apre e chiude pausa e opzioni) e Invio/Spazio sul pulsante a fuoco, come da lettura [INFERITO] di D39. Tolta anche la scritta «Muovi con WASD» dall'etichetta del gioco.
- **[FATTO] Perché era rimasta aperta:** 31 verificatori in `tools/` guidano il gioco da tastiera. Ora la tastiera di gioco funziona solo in un browser automatico (`navigator.webdriver`, che Playwright imposta): i verificatori continuano a funzionare, un giocatore no.
- **[MISURATO]** `npm test` 458 su 458. `tools/verify_no_keyboard_d39.cjs` [SIMULAZIONE] con il browser fatto passare per quello di una persona: i tasti non cambiano nulla, Esc mette in pausa, il joystick muove l'eroe. PASS.
- **`COMMERCIAL_RELEASE = BLOCKED`:** invariato.

## R26 — Piante delle 13 mappe dipinte ridisegnate a mano: niente più camminate sopra container e macchinari (14 novembre 2026)

- **Riferimento.** Mandato D65 e D67 (tutto il lavoro di Argon va rivisto e reso senza difetti); ultima decisione D71. Nessuna decisione nuova dell'autore in questo blocco. Immagini prima e dopo: `docs/evidence/r26/`.
- **[MISURATO] Il difetto.** Le piante calpestabili delle 13 tappe nuove venivano da una regola sui colori (R20-c). In 11 mappe su 13 l'eroe e i nemici camminavano sopra container, presse, colonne, scaffali, ingranaggi e muri; nella forgia anche sull'acido. In più alcuni dispositivi da attivare stavano sopra un container o dentro un edificio.
- **[FATTO] Ora** ogni mappa è descritta a mano, casella per casella, come pavimento meno oggetti solidi (`tools/painted_plans_r26.py`): gli oggetti solidi fermano anche i colpi e fanno da copertura. Partenza, boss, dispositivi e ingressi dei nemici sono ricalcolati sul pavimento vero; nelle mappe a passerelle strette (ingranaggi, forgia, archivio, Asse) sono scelti a mano. L'arena dello Shadow Reaper era già giusta ed è rimasta com'era.
- **[FATTO] Tiranno d'Ossa (R26-b).** Le colonne spezzate erano state disegnate larghe due caselle: il bot del giro automatico perdeva sempre e il giro si fermava su quella tappa. Ora sono larghe una casella, come nell'immagine; audit 6 su 6 per giocatore medio e debole.
- **[FATTO] Forge Behemoth da 300 a 265 di vita.** Senza l'acido su cui schivare, la sua arena è diventata la croce di passerelle disegnata, e il giocatore debole del bot perdeva 2 volte su 6 (D48). Con 265 vince 6 su 6. È un numero di bilanciamento: da confermare con persone.
- **[SIMULAZIONE] Effetto sulla durata.** Le tappe con ostacoli veri durano di più per il bot: per esempio porto 43,5 → 61,5 s, archivio 47,9 → 81,1 s, acque della cattedrale 26,8 → 48,8 s.
- **[MISURATO]** `npm test` 458 su 458. `app.js` invariato rispetto a R25. Browser [SIMULAZIONE]: 13 tappe aperte e giocabili anche dal checkpoint del boss, pacchetto Android, `qa:runtime`: PASS. Giri completi: il primo tentativo (camp7) si è fermato nella Clinica sulla rotta B (vedi R28); rifatti su R28–R29, tre rotte PASS.
- **Aperto.** La mappa dell'Asse ha ancora il vuoto blu scuro dipinto attorno (va ridipinta). Le piante dei villaggi non sono state toccate (erano già disegnate a mano).
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R25 — I colpi di Nox e Lulù si vedono: pallottole dipinte che volano (D71, 14 novembre 2026)

- **Riferimento.** D71. Immagini: `docs/evidence/r25/` (prima: la striscia, visibile solo rallentando il tempo; dopo: pallottola in volo e scoppio all'arrivo).
- **[MISURATO] Il difetto.** Il colpo dell'eroe era una riga larga 6 px viva per 0,16 s. A velocità normale non si vedeva. In più la pallottola dipinta del foglio dell'arma veniva disegnata ferma accanto all'eroe, sempre rivolta a destra.
- **[FATTO] Ora** la pallottola dipinta parte dalla canna, vola fino al punto d'arrivo girata nella direzione giusta, lascia una scia nel colore dell'eroe (azzurra Nox, rosa Lulù) e scoppia sul nemico o sul muro. Vale per tutte le armi a proiettile e per il compagno; il foglio è caricato in ogni missione a piedi, anche prima del kit di Tessa.
- **[FATTO] Il danno non cambia** (resta sul fotogramma di rilascio): `tests/hero-bullets-d71.test.mjs`.
- **[MISURATO]** `npm test` 452 su 452. `app.js` 444 377 byte (margine 14 375); `world.js` 80 705; `en.js` 141 756. Browser [SIMULAZIONE]: pacchetto Android, `qa:runtime`, nemici in 13 luoghi, `stability`, HUD 158 su 158, 13 tappe nuove, `controls`, `touch`, 17 combattimenti con ogni arma e ogni mossa (`tools/verify_arsenal_r23.cjs`): PASS dopo la modifica.
- **Non verificato:** come si vede su un telefono vero a velocità normale. In Chromium l'ho fotografato rallentando il tempo di gioco a un decimo.
- **Durata [SIMULAZIONE]:** invariata, A 75,1 · B 84,3 · C 78,9 minuti (R24); obiettivo circa 150.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R24 — Negozianti in pixel art, via l'oggetto inutile, controllo ricorsivo chiuso (D70, 13 novembre 2026)

- **Riferimento.** D70 (e D69 per il lavoro di Argon). Immagine prima e dopo: `docs/evidence/r24/negozianti_prima_dopo.jpg`.
- **[FATTO] Negozianti.** I 25 ritratti e i 15 sfondi dei negozi erano dipinti lisci, da immagine generata, accanto a sprite a pixel. Ora sono pixel art come il resto del gioco (derivati nuovi, sorgenti intatte e registrate) e si disegnano senza sfumatura né tremolio. [MISURATO] `game/art/npc` da 1,3 MB a 348 KB, `game/art/interiors` da 1,2 MB a 384 KB.
- **[FATTO] «Un oggetto inutile» non è più in vendita** in nessun villaggio. Chi lo possiede in un salvataggio lo tiene.
- **[FATTO] Due targhe corrette** perché nome e figura non coincidevano (Sara la saldatrice, Vasco il custode).
- **[MISURATO]** `npm test` 449 su 449. `app.js` 443 286 byte (margine 15 466); `world.js` 80 705; `en.js` 141 756. Browser [SIMULAZIONE]: pacchetto Android, `qa:hubs`, interni in 32 casi, nemici in 13 luoghi, etichette: PASS dopo queste modifiche; la batteria completa di 21 controlli e `tools/verify_arsenal_r23.cjs` (37 negozi, bagaglio, 17 combattimenti) erano PASS in R23.
- **[SIMULAZIONE] Giri completi della campagna dopo D69 e D70: tre rotte PASS** (44 tappe, 8 incarichi, titoli di coda). La rotta C è stata ripetuta: il primo giro l'aveva interrotto questa sessione spostando i ritratti mentre girava. **Durata: A 75,1 · B 84,3 · C 78,9 minuti probabili (minimo 54,0 / 60,3 / 56,5; alto 104,4 / 118,8 / 110,1; facoltativi circa +11).** Rapporto: `docs/evidence/r24/PLAYTIME_ESTIMATE_R24.md`. In R21 erano 76,1 / 82,0 / 74,8: arsenale, mosse e curve non hanno allungato la campagna. **Mancano circa 70 minuti ai 150 concordati (D65).** Le rotte A e B sono state misurate prima delle ultime correzioni di R23 e di D70, la C dopo.
- **Aperto.** Vedi `docs/gold/HANDOFF_20261113_PC.md` (superato da `HANDOFF_20261115_PC.md`). In più: Eren è descritto dal canone come «vecchio cartografo» ma il suo ritratto mostra un uomo giovane; la battuta di Nox sulle «cose che non servono» non ha più un innesco.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R23 — Arsenale, economia, mosse, turbo, curve e difficoltà di Argon rivisti e integrati; passaggio al PC (D69, 13 novembre 2026)

- **Riferimento.** D69. Esito della revisione: `docs/gold/CONSEGNA_ARGON_LOOP_ESITO.md` (ultima sezione). Passaggio al PC: `docs/gold/HANDOFF_20261113_PC.md` (superato da `HANDOFF_20261115_PC.md`), prompt in `docs/gold/PROMPT_RIPRESA_PC_20261113.md`.
- **[FATTO] Nel gioco da questo giro:** 9 armi di mercato, 7 equipaggiamenti, cataloghi per villaggio, rottami, rivendita, sconti; 4 mosse speciali per eroe sbloccate per atto; 5 stadi di turbo per la Vortex; curve su tutti i 7 circuiti; nemici comuni più rapidi negli atti II–IV.
- **[MISURATO] I rapporti di Argon dichiaravano «0 errori» su suite mirate.** Sulla suite intera: `D48` falliva dopo ciascuno dei due commit (Vega, poi Glass Reaper), `qa:hubs` falliva (il fabbro del Bazar non vendeva più la Pistola a bobina), cinque righe dell'economia restavano in italiano nella versione inglese.
- **[FATTO] Corretto:** mira dell'onda di Lulù; mitragliatrici e plasma riportate nella fascia delle armi di serie; taglie e cambio dei rottami; scala di difficoltà solo nelle tappe senza boss; equipaggiamento base dai quattro fabbri della campagna; ostacoli D64 nella prima gara; `en.js` di nuovo solo inglese.
- **[SIMULAZIONE]** Bot medio, 6 semi (`tools/probe_arsenal_r22.mjs`): prima della correzione la mitragliatrice Helix chiudeva il finale in 25,8 s contro 58,3 dell'arma di serie senza prendere colpi; dopo, le mitragliatrici chiudono fra il 5 e il 30 % più in fretta. Bottino di una campagna: circa 670 monete (erano circa 2 240) contro 1 485 di merce.
- **[MISURATO]** `npm test` 446 su 446. `app.js` 443 279 byte (margine 15 473); `world.js` 80 835; `en.js` 141 751. Browser [SIMULAZIONE], Chromium: 21 controlli su 21 PASS (pacchetto Android, `qa:runtime`, `hubs`, gara dal villaggio, modalità di gara, `controls`, `save`, `stability`, 13 tappe nuove, intro, interni in 32 casi senza testi non tradotti, nemici in 13 luoghi, HUD 158 su 158, `health`, `touch`, `gamepad`, `audio`, `opening`, demo, opzioni, etichette).
- **[FATTO] Controllo ricorsivo con l'interfaccia vera (R23-b),** `tools/verify_arsenal_r23.cjs`: in tutti i 37 negozi dei 14 villaggi ogni oggetto in vendita viene comprato con un tocco e costa quanto dice l'etichetta, i rottami si scambiano, un oggetto si rivende al 60 %, il salvataggio regge la ricarica; il Bagaglio attiva ogni arma, mossa e turbo in italiano e in inglese; le 9 armi e le 8 mosse sparano in missione senza errori. **Difetti trovati così e corretti:** la battuta di Nox sull'«oggetto inutile» restava nascosta sotto il negozio (difetto precedente ad Argon); la quarta mossa di Lulù non era mai utilizzabile (Lulù non ha missioni nell'atto IV) e quella di Nox solo nel finale: ora arrivano da `vega` e da `app_axis`; la doppietta Flak era fuori fascia; i nomi dei turbo restavano in italiano nella versione inglese. Nelle tratte di guida il turbo montato veniva letto male: etichetta, numero di scarichi e indicatore del nitro erano sempre quelli del MK I. Il risultato della gara non veniva annunciato quando la gara sbloccava un turbo. `tests/arsenal-review-r23.test.mjs`: nessuna mossa morta, ogni circuito finito dal pilota con ognuno dei 5 turbo.
- **Non rifatto dopo D69:** i tre giri completi della campagna e la stima di durata (l'ultima, R21: A 76,1 · B 82,0 · C 74,8 minuti; obiettivo circa 150). È il primo punto del DA FARE sul PC.
- **Non verificato da nessuno:** mosse nuove, turbo MK II–V e curve giocati da una persona; il bot non li usa. Nessuna prova su telefono.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R22 — Ogni palazzo sul proprio terreno: via i riquadri neri dai villaggi (D68, 13 novembre 2026)

- **Riferimento.** D68. Immagini prima e dopo: `docs/evidence/r22/`.
- **[MISURATO] Il difetto.** Sotto ogni edificio dipinto restava un riquadro scuro con cornice (`'#06101a66'` più `strokeRect` in `vDrawHouse`), e nell'Avamposto ad ingranaggi le torri occupavano un quarto del lotto: il resto era vuoto scuro.
- **[FATTO] Terreno del lotto.** Ogni lotto è lastricato con la pietra di fondazione del suo distretto, diversa da strada e piazza, tinta con i colori del villaggio; cordolo rialzato, ombra di contatto, soglia davanti alla porta. Le strade accanto a un lotto ricevono un'ombra morbida invece del bordo da muro.
- **[FATTO] Lotti pieni.** `lotPlan` centra l'edificio sulla porta; se il lotto avanza di almeno 1,4 caselle aggiunge un secondo edificio della stessa famiglia; un retro profondo riceve lampioni e casse del villaggio. [MISURATO] 92 edifici in 14 villaggi: l'edificio copre almeno il 78 % della larghezza del lotto.
- **[FATTO] Bordo magenta tolto** dai 16 edifici: il derivato si scala con alfa premoltiplicato e perde il residuo del fondo (`tools/derive_argon_case_20261113.py`, registro aggiornato; originali intatti).
- **[MISURATO]** `npm test` 427 su 427. `app.js` 449 635 byte (margine 9 117); `world.js` 33 585; `en.js` 135 273. Browser PASS [SIMULAZIONE]: `qa:hubs`, nemici in 13 luoghi, 14 villaggi disegnati per intero con `tools/render_villages_r22.cjs`.
- **Controllato e già a posto.** Mappe di missione procedurali e dipinte: nessun riquadro nero; oltre il bordo della mappa la telecamera ripete la fascia esterna (`drawMapBackdrop`), non mostra nero.
- **Aperto.** Terreni e oggetti di piazza dipinti da Argon non ancora consegnati: il lastricato viene dall'atlante d'ambiente già nel gioco. Musiche mai ascoltate e corte. Piante delle mappe stimate. Ponte di acquisto assente. Prestazioni su telefono non misurate. La mappa dell'Asse (`a_axis`) ha attorno un vuoto blu scuro dipinto così da Argon: provato a riempirlo con la nebulosa della mappa stessa, il risultato era ripetitivo e non è stato tenuto; va ridipinto. [SIMULAZIONE] **Durata dopo R21: A 76,1 · B 82,0 · C 74,8 minuti** probabili (minimo 54–59, alto 104–115; facoltativi circa +11), tre giri completi PASS con 44 tappe e 8 incarichi ciascuno (`docs/evidence/r21/PLAYTIME_ESTIMATE_R21.md`). Erano 68,1 / 70,4 / 66,8. **Mancano ancora circa 70 minuti ai 150 concordati.**
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R21 — Revisione e integrazione del lavoro di Argon; case dipinte nei villaggi; scatti di The Anchor (D67, 13 novembre 2026)

- **Riferimento.** D67. Esito della revisione: `docs/gold/CONSEGNA_ARGON_LOOP_ESITO.md`.
- **[MISURATO] Il lavoro di Argon non era «100 % verde»:** sulla suite intera fallivano 9 test e diverse parti già fatte erano state cancellate (mappe dipinte, suoni, intro, prima gara, vita di Rook). Tutto ripristinato; i fogli di oggetti e VFX fatti da script sono stati rifiutati.
- **[FATTO] Tenuto di Argon:** mosse proprie e punto debole dei 4 boss nuovi, eventi a metà tappa e dialoghi di chiusura, 14 villaggi con 56 abitanti e 28 incarichi, interni con bottegaio animato, 14 musiche portate a livello, musica dedicata per boss.
- **[FATTO] Villaggi con arte vera:** 16 edifici dipinti (gruppo T di Argon) al posto delle case verdi, in tutti e 14 i villaggi.
- **[FATTO] The Anchor:** cime pre-disegnate, qualità adattiva sui frame persi. **Non provato su telefono.**
- **[MISURATO]** `npm test` 421 su 421. `app.js` 448 606 byte (margine 10 146); `world.js` 31 675; `en.js` 132 747. Browser PASS [SIMULAZIONE]: 13 tappe nuove, intro, pacchetto, `qa:runtime`, `hubs`, `audio`, `controls`, `opening`, `health`, `touch`, `stability`, `save`, `gamepad`, HUD 106/106, demo, opzioni, etichette, nemici in 13 luoghi. Output in `docs/evidence/r21/`.
- **Aperto.** Musiche mai ascoltate e corte (14–22 s). Piante delle mappe ancora stimate. Ponte di acquisto assente. Prestazioni su telefono non misurate. Durata misurata dopo, in R22: A 76,1 · B 82,0 · C 74,8 minuti probabili.
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## R20-c — 13 tappe nuove sulle mappe di Argon, 4 boss, intro a comparse (D66, 12 novembre 2026)

- **Riferimento.** D66 (e D65 per l'obiettivo di circa 150 minuti). Consegna letta: ramo `delivery/argon-asset-giro2-20261110` @ `02a26b8`, cartella `deliveries/argon-150min-20261112/` (44 PNG, tutte con le dimensioni chieste [MISURATO]; nessun suono). Esito: `docs/gold/CONSEGNA_ARGON_150MIN_ESITO.md`.
- **[FATTO] Campagna da 31 a 44 tappe.** Nuove: `docks_veyra`, `app_breach`, `bone_tyrant`, `app_clinic`, `app_node`, `app_yard`, `forge_behemoth`, `app_port`, `glass_flood`, `glass_reaper`, `vega`, `app_archive`, `app_axis` (`game/missions.mjs`), con dialogo d'ingresso in italiano e inglese. Ogni tappa usa una mappa dipinta 1536×1536 (`game/art/maps/*.webp`, 13 derivati, 3,3 MB) come sfondo e una pianta 24×24 come collisione (`game/painted-maps.mjs`).
- **[FATTO] Boss da 5 a 9** (`BOSS_NAMES`, `BOSS_SHEETS` in `game/visuals.mjs`): Bone Tyrant 260, Forge Behemoth 300, Shadow Reaper 250, Vega 210 punti vita. Vega ha una striscia di 9 pose ritagliata dai fogli di Argon (`tools/derive_argon_vega_20261112.py`).
- **[FATTO] Intro del giaguaro in tre tempi** (`game/style.css`): la scritta da sola su nero, poi il giaguaro che arriva centrato, poi il lampo; 4,4 s, un tocco la salta, ferma con «Riduci movimento».
- **[FATTO] Salvataggi.** Le tappe viaggiano per ID: chi ha un salvataggio vecchio riparte dove era; un salvataggio fatto dentro un hub non viene più rifiutato per l'indice spostato (`tests/hub-exit-r20.test.mjs`).
- **[MISURATO]** `npm test` 416 su 416. `app.js` 411 339 byte, margine 47 413 sotto la guardia. [SIMULAZIONE] `tools/audit_combat.mjs`: 25 missioni, bot medio e debole 6 su 6 su tutte. [SIMULAZIONE] `tools/verify_stages_r20.cjs`: le 13 tappe si aprono e sono giocabili in Chromium, anche dal checkpoint del boss; schermate in `docs/evidence/r20/stages/`.
- **[SIMULAZIONE] Durata dopo R20-c:** tre giri completi PASS (44 tappe, 8 incarichi ciascuno); stima «probabile» **A 68,1 · B 70,4 · C 66,8 minuti** (minimo 48–50, alto 93–99), contro circa 50 prima e 150 di obiettivo. Rapporto: `docs/evidence/r20/PLAYTIME_ESTIMATE_R20c.md`. **Mancano ancora circa 80 minuti.**
- **Limiti dichiarati (retti dal codice).** Piante stimate dall'immagine: in alcune mappe si cammina sopra mobili e container. Boss nuovi senza mosse proprie. Sei avvicinamenti non feriscono mai il bot (0–1 colpi presi): sono troppo facili. Nessuna musica o suono nuovo. Non usati ancora: abitanti dei pontili, sentinella di marea, Veyra a figura intera, garage, officina e motore (la scena della promessa esiste già in testo), civili, segreti, icone, mappa della città, fogli a 288 px dei boss, terreno di Moon.
- **Non fatto.** Gare Vortex obbligatorie, collegamenti narrativi, case dei villaggi, ponte di acquisto, misura su telefono.
- **`COMMERCIAL_RELEASE = BLOCKED`.**

## R20-a · R19 milestone 5 — Durata concordata: piano, richiesta ad Argon, spazio in `app.js`; proiettili, boss, apertura (D62–D65, 12 novembre 2026)

- **Riferimento.** D62, D63, D64, D65. Piano: `docs/gold/PIANO_DURATA_R20.md`. Richieste ad Argon: `requests/argon-durata-due-ore-20261112/README.md` (40 immagini, 26 suoni) e `requests/argon-case-villaggi-20261112/README.md` (25 case, 4 terreni, 1 correzione).
- **[SIMULAZIONE] La campagna oggi è stimata a circa 42 minuti** (rotte A/B/C: 41,9 / 44,5 / 37,9; `docs/evidence/tier1/playtime/`), contro i circa 150 concordati (rev. 2 del piano). **Non dura ancora quanto deciso.** Mancano le cinque tappe nuove e gli avvicinamenti; per Vega, Glass Flood, porto a piedi, promessa e avvicinamenti **non esistono immagini**.
- **[FATTO] R20-a, spazio per il contenuto.** I quattro cataloghi inglesi escono da `app.js` e viaggiano in `en.js` (61 099 byte), caricato prima di `app.js` (`tools/prepare_android_assets.py`, rotta in `AssetRoutes.java`). **[MISURATO] `app.js` 393 625 byte, margine 65 127** sotto la guardia di 458 752, che non è stata alzata. Prove: `tests/bundle-prune-r19.test.mjs`, `tools/verify_bundle_en_r20.cjs` (il pacchetto parte in Chromium e traduce, zero errori).
- **[FATTO] D62.** Il colpo dell'eroe si vede viaggiare (0,16 s, danno invariato sul frame di rilascio); il DUO colpisce solo con la linea libera e disegna un'onda per nemico. `tests/projectiles-d62.test.mjs`.
- **[FATTO] D63.** Boss +25 % di vita (60 / 112 / 375 / 238 / 575), tempi e hitbox invariati. [SIMULAZIONE] `tools/audit_combat.mjs`: bot medio e debole superano tutte le tappe 6 su 6. Numeri revocabili dall'autore.
- **[FATTO] D64.** Prima gara con 8 ostacoli e 4 pedane; `tools/audit_races.mjs` passa.
- **[FATTO] Apertura.** Dietro la scena dei due colpi c'è la veduta dell'Atto 1 al posto del fondo sfumato. Segnale che rimbalza sopra il prossimo dispositivo da attivare.
- **[FATTO] Documenti.** `docs/gold/AUDIT_DIFETTI_R19.md` (11 difetti, 6 ipotesi), `docs/gold/STUDIO/GO_NO_GO.md` (NO-GO), `docs/gold/MAP_QUALITY.md` (criteri scritti prima del giudizio).
- **Non fatto.** Nessuna tappa nuova è ancora nel gioco. Ponte di acquisto e variante con la demo: BLOCKED (Play Console). Prestazioni su telefono: non misurate. `SYSTEM_MAP`, `STUDIO_PLAYBOOK`, `ART_AUDIT_R19`: non scritti.
- **`COMMERCIAL_RELEASE = BLOCKED`.**

## R19 · milestone 4 — Consegna di Argon, lotti 3 e 4: intro dello studio e sei suoni nel gioco (D61, 12 novembre 2026)

- **Riferimento.** D61. Esito: `docs/gold/CONSEGNA_ARGON_GIRO3_LOTTI34_ESITO.md`. Il ramo di consegna è avanzato a `10592a7` (24 file).
- **[FATTO] Intro dello studio rifatta** con la key art di Argon (WebP 1920×1080 e 1080×1920, `game/art/brand/jaguar_keyart_*.webp`), due lampi in CSS, nome dello studio in testo; senza video e senza pulsanti. Registro `REGISTRO_ARGON_INTRO_20261112.json`. Schermate in `docs/evidence/r19/studio/`.
- **[FATTO] Sei suoni di Argon** cablati a `duo`, Black Pulse, barriera, negozio, fucina e incontro con un abitante (`REGISTRO_ARGON_AUDIO_20261112.json`). **Scartato** `audio_intro_jaguar_storm` per il ronzio a 48 Hz ([MISURATO]); gli altri cinque esclusi hanno il motivo nel registro.
- **[MISURATO] Discrepanza** sul `title_theme.ogg` rev 2 (già nel gioco da `4d16af1`): picco decodificato +1,1 dBFS contro i −1,5 dBTP dichiarati da Argon. Da riascoltare su telefono.
- **Palazzi della cattedrale e tossici**: accettati, non applicati; portone del Bastione con magenta da far correggere. **Blueprint V10.4** (mischia, negozi): proposta non approvata.
- **[MISURATO]** `npm test` 408 su 408; `app.js` 454 134 byte (margine 4 618); browser PASS (`qa:audio`, `qa:hubs`, `qa:runtime`, `qa:controls`, `qa:touch`, `qa:options`, `qa:labels`, `qa:opening`, `qa:health`, `qa:stability`, `qa:save`, `qa:hud`, `qa:demo`, nemici in 13 luoghi, intro in 5 formati) [SIMULAZIONE]. APK di debug versionCode 28.
- **Resta** (handoff 12/11): scena dei due colpi, proiettili visibili con ripari, boss più duri, gare più varie, ponte di acquisto, prestazioni su telefono, documenti da studio, mappe e richiesta ad Argon per le case dei villaggi.
- **`COMMERCIAL_RELEASE = BLOCKED`.**

## R19 · milestone 3 — Difetti dal telefono, prestazioni, opzione Tiro assistito, handoff per il PC (D60, 12 novembre 2026)

- **Riferimento.** D60. Handoff: `docs/gold/HANDOFF_20261112_PC.md`; prompt: `docs/gold/PROMPT_RIPRESA_PC_20261112.md`.
- **[FATTO] Difetti trovati dall'autore sul telefono e chiusi.** P0 SPARA e SCHIVA non comparivano dopo l'apertura e dopo un riavvio (`game/runtime.mjs`, `configureControls`); P1 boss non svegli disegnati fermi e semitrasparenti nell'arena; P1 scatto verticale della telecamera. Prove: `tests/defects-r19.test.mjs`.
- **[FATTO] Prestazioni.** HUD senza riscritture del DOM a ogni frame, lampo del colpo senza `ctx.filter`, vignetta di vita bassa pre-disegnata. [SIMULAZIONE] profilo con CPU 4× più lenta: costo frame p95 ≈ 4 ms. Su telefono non misurato.
- **[FATTO] Opzione «Tiro assistito»** nelle Opzioni; test `tests/assist-option-r19.test.mjs`.
- **[FATTO] Audit dei difetti.** H1 confermata (nell'APK nessun ponte di acquisto), H2 per scelta, H3 compatibilità, H4 corretta, H5 dichiarate, H6 pulsanti nascosti; test di proprietà su salvataggi, armi, barre, tick, `moveActor`, `routeWaypoint`. Audit dei pulsanti: 22 su 57 visti, zero rilievi.
- **[MISURATO]** `npm test` 404 su 404; `app.js` 454 466 byte (margine 4 286). APK di debug versionCode 27.
- **Non fatto** (in elenco nell'handoff): intro dello studio in codice, sfondo della scena dei due colpi, proiettili visibili con ripari, boss più duri, gare più varie, ponte di acquisto, documenti da studio, gate delle mappe, resto dell'interfaccia di Argon.
- **`COMMERCIAL_RELEASE = BLOCKED`.**

## R19 · milestone 2 — Interfaccia premium, primo passo: la cornice dei pannelli (D58 §6, D59, 11 novembre 2026)

- **[FATTO] Entra la cornice «menu» di Argon** (`U/ui_cornici.png`, quadrante in alto a sinistra: ingranaggi d'ottone, tubi ciano e rosa) su tutti i pannelli `.card`: pausa, opzioni, sblocco, scelte, esito, hub, avviso di errore. Derivato `game/art/ui/frame_menu.webp` (512×512, 149 992 byte), fatto da `tools/derive_argon_ui_20261111.py`, registrato in `assets/production/v10.3/derived/REGISTRO_ARGON_UI_20261111.json`. I derivati di Argon nel gioco sono 43.
- **Solo disegno.** È un `border-image` in `game/style.css`: bordo, margini e contenuto dei pannelli non cambiano; negli schermi bassi la cornice è più sottile. **Zero byte in `app.js`** (453 445, margine 5 307).
- **[MISURATO] Prove.** `npm test` **382 su 382** (`tests/argon-ui.test.mjs` nuovo). Browser [SIMULAZIONE]: `qa:options`, `qa:hud`, `qa:demo`, `qa:labels`, `qa:controls`, `qa:touch`, `qa:opening`, `qa:save`, `qa:hubs` PASS. Schermate a 360×800 e 844×390 in `docs/evidence/r19/ui/`.
- **Restano fuori del gruppo U**, e perché: pulsanti e pulsanti tondi (cambiano l'aspetto dei comandi di gioco: servono prove al tocco su telefono vero prima di sostituirli); icone, HUD e medaglie (oggi sono testo o disegno su canvas: metterle costa byte di `app.js` e va fatto una schermata alla volta); emblema (tocca il menu principale).
- **[MISURATO] APK di debug versionCode 26**, costruito da questo ramo con `tools/build_apk.sh`: 100 668 440 byte, SHA-256 `7317727d88cee471b1f73e6a701062e168bde4892837e2394499fd39a76f1b45`. Contiene `app.js` da 453 445 byte e `art/ui/frame_menu.webp`. Firma di debug: non caricabile sullo store.
- **[MISURATO] AAB con identità di rilascio e firma di prova**, da `tools/build_aab.sh` e bundletool: `jaguarZcreatorZ13.app`, versionCode 3, versionName 1.0.0, targetSdk 36 (letti dal bundle), 99 943 691 byte, SHA-256 `3eb9423d57a3735e3bb0b43deb1e3e66f786d38616c9c8e475bff55689849b11`. **Non caricabile:** la firma vera la fa l'autore sul suo PC con `npm run android:aab:play`.
- **`COMMERCIAL_RELEASE = BLOCKED`.**

## R19 · milestone 1 — Registro di copertura, peso di `app.js`, apertura in orizzontale (D58, D59, 11 novembre 2026)

- **Riferimento.** D58 §4–§5 e §8; D59 (si procede senza fermarsi a ogni milestone).
- **[MISURATO] Peso.** `app.js` 457 825 → **453 445 byte** (−4 380): il bundler lascia fuori 14 funzioni esportate che il gioco non chiama. Margine sulla guardia: **5 307 byte**. Dettaglio in `docs/gold/SIZE_LOG.md`; prova in `tests/bundle-prune-r19.test.mjs`. I moduli in `game/` non cambiano.
- **[MISURATO] Copertura.** `docs/gold/COVERAGE_LEDGER.md` e `.json`: ogni file di `game/`, `android/`, `tools/`, `tests/` e `server.js` ha scopo, rischio, prove e numeri. Copertura dei test di Node: 97,66 % delle righe, 93,05 % dei rami. `hud.mjs` passa dal 31 % al 100 % delle righe (`tests/hud-meter-r19.test.mjs`).
- **[FATTO] Difetto P1 trovato e chiuso.** In orizzontale (844×390) il pulsante di risposta dell'apertura finiva sotto il bordo dello schermo (da `2acb4ae`: ritratti e etichetta in più). Corretto solo in `game/style.css`: in uno schermo basso i ritratti stanno accanto al testo. Prova di regressione: `tools/verify_opening_r19.cjs` (`npm run qa:opening`), che copre anche il registro dei battiti a 360×800, 390×844, 430×932 e 844×390. Schermate in `docs/evidence/r19/opening/`.
- **[MISURATO] Prove.** `npm test` **379 su 379**. Browser [SIMULAZIONE]: `qa:opening`, `qa:controls`, `qa:touch`, `qa:options`, `qa:hud`, `qa:demo`, `qa:labels`, `qa:save`, `qa:health`, `qa:gamepad`, `qa:stability`, `qa:runtime`, nemici in 13 luoghi, gara dall'hub e strade: tutti PASS.
- **Zone senza copertura misurata:** `runtime.mjs`, `index.html`, `style.css` e `android_bootstrap.js` girano solo nel browser (valgono i verificatori); gli script di build e firma si provano costruendo; `MainActivity.java` e `AssetRoutes.java` si provano sull'APK.
- **Nessun tempo, hitbox o bilanciamento toccato.** L'APK v25 non contiene queste modifiche: il prossimo build sarà versionCode 26.
- **`COMMERCIAL_RELEASE = BLOCKED`.**

## R19 · milestone 0 — Preflight e audit del giro di rilascio (D58, 11 novembre 2026)

- **Riferimento.** D58. Rapporto completo: `docs/gold/AUDIT_R19.md`. Punto di ritorno: `632f8b3` (`rc-r18-v25`).
- **[MISURATO] Base.** `npm test` 372 su 372, tre volte di fila, nessun test instabile. `app.js` 457 825 byte (restano 927 byte). Node `v22.23.4`.
- **[FATTO] Corretto.** I documenti di R18 dicevano 369 test: il numero vero è 372 (i tre test di `tests/argon-giro3.test.mjs` non erano stati contati). `COMMERCIAL_RELEASE_GATE.md` ha una nota: descrive l'8 novembre e va rimisurato.
- **[FATTO] Riletti riga per riga** `2acb4ae`, `aaebba7`, `baa684b`: nessun P0 o P1. Due P3 (punto di vista misto nelle didascalie; `engineSpeed` vuoto ma ancora chiamato) e una zona senza prova (registro dei battiti).
- **[FATTO] Consegna di Argon** avanzata a `f21e19d` (lotto 2): due tavole di boss rifatte, pilota dell'intro dello studio, guida di stile, manifesto di 104 suoni non ancora prodotti. Nulla di nuovo è pronto per entrare oggi.
- **Nessun file di gioco toccato.** Prossima milestone proposta: registro di copertura e riduzione di `app.js`.
- **`COMMERCIAL_RELEASE = BLOCKED`.**

## R18 — Terzo giro di Argon nel gioco: cinque nemici nuovi e le schede dei quattro atti; APK v25 (D57, 11 novembre 2026)

- **Riferimento.** D57: «se il lavoro di argon non c'era non dovevi andare avanti […] ora c'è tutto e puoi procedi a consegnare di nuovo». L'APK v24, l'handoff e il prompt di R17 sono superati da questa sezione.
- **[FATTO] Consegna** `delivery/argon-asset-giro2-20261110`, da `e776c13` a `f39dd3d`: 46 immagini nuove, tutte guardate. Esito in `docs/gold/CONSEGNA_ARGON_GIRO3_20261111_ESITO.md`.
- **Entrano 5 nemici** (`tools/derive_argon_giro3_20261111.py`, formato `c`, 24 pose l'uno): `gang_shooter` e `gang_breaker` nel distretto della gang, `alien_breaker` (scarabeo della breccia) come sfondatore nelle missioni della breccia e del porto, `infected_brute` come colosso in «Contagio» e «Archivio», `port_patrol` come pattuglia nel «Porto». Occupano ruoli che non avevano un foglio loro. Solo disegno: tempi, hitbox, IA e ondate non cambiano.
- **Entrano le schede dei quattro atti.** `game/art/atti/atto_1…4.webp` fanno da sfondo alla scheda di ogni missione, secondo l'atto (`#card.a1…a4` in `game/style.css`; nel codice solo la classe dell'atto).
- **Lavoro di Argon nel gioco: 42 derivati.** 15 interni, 8 ritratti, 8 strade, auto Vortex, 6 fogli nemici, 4 schede degli atti.
- **Fuori, con il motivo:** colosso della gang e predatore con le ancore (nessuna ondata libera), interfaccia (8 tavole: giro a sé), terreni, palazzi e oggetti (servono per ridisegnare le mappe), boss (entrano con la loro logica; `forge_behemoth_b` scartato, `shadow_reaper_d` mancante).
- **[FATTO] Prove.** `npm test` 372 su 372. Browser: `verify_foes_d46.cjs` 13 luoghi, `verify_controls_v9.cjs`, `verify_hub_race_browser.cjs`, `verify_race_roads_giro2.cjs` passano; schede degli atti fotografate a 390×844 e 844×390 in `docs/evidence/v10.3/atti/`. `app.js` 457 825 byte (guardia 458 752: restano 927 byte).
- **Build.** APK di debug versionCode **25**, in chat per l'approvazione. AAB e firma sul PC dell'autore: `docs/gold/HANDOFF_20261111_PC.md` e `docs/gold/PROMPT_RIPRESA_PC_20261111.md`, riscritti per questo stato.
- **Limiti.** I nemici nuovi sono verificati dai test e dal caricamento in missione, non da una partita giocata da una persona. I commit dell'altra sessione (`2acb4ae`, `aaebba7`, `baa684b`) passano i test ma non sono stati riletti riga per riga. `COMMERCIAL_RELEASE = BLOCKED`.

## R17 — Tutto il lavoro di Argon utilizzabile è nel gioco; APK di prova v24 per l'approvazione (D56, 11 novembre 2026)

- **Riferimento.** D56: «Dovrei svilupparmi una pick up e mandarlo qui in chat. E una volta che approvo la pick up, andrò sul PC con handoff […] Però applica tutto il lavoro che ha fatto Argon.»
- **[FATTO] Ramo di Argon.** `delivery/argon-asset-giro2-20261110` è fermo a `e776c13`: dal controllo di R15 non è arrivato nulla di nuovo. Il terzo giro (`GIRO_3_COMPLETO.md`, D54) non è ancora stato consegnato.
- **Entra il segnalatore della Gang dei Relè.** `game/art/chrono/gang_signal.png` (2048×384, formato `c`: 24 pose) dai fogli `gang_signal_a` (azione) e `gang_signal_b` (colpito e caduta), con `tools/derive_argon_gang_20261111.py`; registrato in `REGISTRO_ARGON_GIRO2_20261110.json` (10 derivati). `CHRONO_FOES[0]={signal:'gang_signal'}`: compare in «Blackout» e «La città senza di te». Corpo alla stessa altezza degli altri nemici (87 px dichiarati: l'antenna resta fuori dalla misura). Tempi, hitbox e IA non cambiano: è solo disegno.
- **Stato completo del lavoro di Argon (33 derivati nel gioco).** 15 interni, 8 ritratti, 8 strade, auto Vortex, segnalatore della gang.
- **Ciò che resta fuori, e perché.**
  - `gang_brute_a` (colosso con la mazza a bobina): foglio completo e buono, ma l'unica ondata con un colosso nel distretto della gang è in «La città senza di te», dove il ruolo è di `desert_chrono_fighter` (D46: ogni foglio di riserva combatte da qualche parte). Entra quando ha un'ondata sua.
  - `gang_shooter_a/b`: il foglio d'azione è un uomo in giacca rossa, quello di reazione un incappucciato viola: non sono lo stesso personaggio. Da rifare coerente.
  - `gang_breaker_a`: manca il foglio di reazione (`_b` scartato: scritta «CAUTION» e altro personaggio); richiesto in testa al terzo giro.
  - `terreno_porto`: i distretti usano mappe dipinte intere, non piastrelle; serve quando arrivano palazzi e oggetti dello stesso set (gruppo T).
- **[FATTO] Prove.** `npm test` 369 su 369. Browser: `verify_foes_d46.cjs` 13 luoghi, `verify_controls_v9.cjs` 11, `verify_hub_race_browser.cjs`, `verify_race_roads_giro2.cjs` 16 passano. `app.js` 457 560 byte (guardia 458 752: restano 1 192 byte).
- **Build.** APK di debug versionCode **24** consegnato in chat per l'approvazione. AAB e firma: sul PC dell'autore, con `docs/gold/HANDOFF_20261111_PC.md` e `docs/gold/PROMPT_RIPRESA_PC_20261111.md`.
- **Limiti.** Il commit `2acb4ae` e i successivi di un'altra sessione (intro in prima persona, Kairn e Morrow, log dei battiti, guida in orizzontale) passano i test ma non sono stati riletti riga per riga da questa sessione. Nessuna persona ha ancora giocato: `COMMERCIAL_RELEASE = BLOCKED`.

## R16 — Log battiti struttura, animazioni vive (D53), eliminazione ronzio audio, equilibrio di misure e cronaca su 4 Atti e direzione 5,99 € (10 novembre 2026)

- **Riferimento.** D53 (movimento e suono naturali in tutto il gioco, persone dei villaggi comprese), D18 (prezzo 5,99 €), D40 (edifici e interni con personalità) e passaggio di consegne `docs/gold/HANDOFF_20261110_TERMINALE.md`.
- **D54.** Terzo giro per Argon in `requests/argon-interni-palazzi-20261109/GIRO_3_COMPLETO.md`: dichiara ciò che è già nel gioco, chiede le 85 immagini e i 104 suoni che mancano (nuovi i gruppi U, interfaccia premium, e C, schede dei quattro atti), con protocollo di ripresa a quota esaurita. Nessun codice cambiato.
- **[FATTO] Log battiti struttura (`#opening-beat-log`, `#knock-beat-log`, `#interior-beat-log`).** Il gesto ricorrente dei «Due colpi» ha ora un registro diegetico visivo, sonoro e aptico a tema Vanta quando si bussa sulla cassa iniziale (`#opening`), sulle porte di sequenza (`#knock`) e quando si entra in una struttura/edificio dei quattro villaggi (`#interior`, `● ● · DUE COLPI · ACCESSO STRUTTURA`, con doppio indicatore luminoso sulla soglia della porta in `game/village-art.mjs` e traduzioni inglesi complete in `game/runtime-en.mjs`).
- **[FATTO] Eliminazione del ronzio audio (`game/audio-engine.mjs`).** Rimosso il drone sinusoidale continuo (`hum` a 48–86 Hz) e il loop di rumore bianco continuo su `city`, `port`, `drive` e `dark`; filtrati in passa-alto (`380 Hz`, guadagno `0,06`) i sottofondi `chrono_*` per azzerare qualsiasi ronzio a bassa frequenza sotto la colonna sonora; sostituito il fruscio radio a 110 Hz con un tono di comunicazione pulito (`680 → 920 Hz`).
- **[FATTO] Trama, equilibrio di misure e senso bilanciato di cronaca (`game/missions.mjs`, `game/story-v08.mjs`, `game/story-en.mjs`, `game/locale.mjs`).**
  - **4 Atti bilanciati (`ACTS[1..4]`):** le 31 tappe sono ora distribuite con equilibrio tra **ATTO I · LA CITTÀ AL BUIO** (5 tappe), **ATTO II · LA BRECCIA** (8 tappe), **ATTO III · DUE STRADE** (11 tappe) e **ATTO IV · ORA UNO** (7 tappe, da *Posso venire con te?* a *Chrono Shadows*).
  - **Convergenza della cronaca nel ricongiungimento e nell'epilogo:** `STORY.reunion_open` ed `EPILOGUE` riflettono ora tutte le scelte compiute negli Atti I–III (*Officina/Rifugio*, *Segni di Gesso: rotta di servizio o passaggio diretto*, *Unità 9*, *EVE-Prime conservata o spenta*, *La Linea con Ines o fino all'ultimo autobus*, *La Promessa sul tetto*), con traduzioni inglesi d'autore complete (`docs/gold/LOCALE_REGISTER.json` 0 aperti).
- **[FATTO] Codice di movimento e suono naturale (D53).**
  - **Ritratti vivi negli interni (`drawInteriorNpc`):** i ritratti dipinti respirano con una lieve oscillazione verticale e toracica, battono le ciglia periodicamente e reagiscono quando l'interlocutore pronuncia una battuta (`interiorSay`), estendendo l'oscillazione vocale anche agli sprite degli interni privi di ritratto dipinto; tutto si ferma con «Riduci movimento».
  - **Persone dei villaggi (`drawExploration`, `drawVillageLife`):** gli abitanti degli hub proiettano ombra a terra, respirano con fasi desincronizzate per posizione (`state.time + p.x*0,013 + p.y*0,017`), si voltano verso Nox o Lulù entro 160 px con un lieve cenno di saluto e le insegne rispettano «Riduci movimento».
  - **Guida e gare in orizzontale più larghe (`R5`, `drawDriving` e `drawRace`):** in formato panoramico (`w > h`) la scala verticale passa da `h / 1050` a `h / 640`, portando la carreggiata da 267 px (31,7 % della larghezza a `844×390`, Audit #10) a **439 px** (**52,0 %** della larghezza), lasciando ~202 px per lato ai comandi touch senza coprire le corsie.
  - **Scene narrative (`drawScene`):** lieve deriva orizzontale della camera nelle scene sul motore, disattivata con «Riduci movimento».
  - **UI/UX e Sound Design 5,99 € (`game/style.css`, `game/audio-engine.mjs`, `game/runtime.mjs`):** pulsanti con filo di luce speculare superiore, compressione tattile su pressione, micro-vibrazione aptica sui tocchi dei menù e sui due battiti alle porte, e variazione organica di pitch/volume anche su `knock` e `ui`.
  - **Manifest Android:** `android:versionCode` portato a **23** in `android/AndroidManifest.xml` come indicato in `HANDOFF_20261110_TERMINALE.md`.
- **[FATTO] Documento di direzione.** Redatto e aggiornato `docs/gold/DIREZIONE_DESIGN_UI_AUDIO_5_99.md` con l'analisi completa di reverse engineering, la struttura dei 4 Atti su ~2 ore, l'equilibrio di misure e di cronaca, le specifiche UI/UX dei pulsanti e l'architettura del sound design senza ronzio per il prezzo di 5,99 €.

## R15 — Giro 2 di Argon controllato: entrano le strade di Solkara e Aurelia e l'auto Vortex (10 novembre 2026)

- **Riferimento.** D51 (selezione delle immagini affidata a Claude) e D53 (movimento e suono): questo lotto copre la grafica delle gare; i materiali di animazione e audio chiesti con D53 (gruppi V, G, F, M, A) non sono arrivati e restano in coda.
- **[FATTO] Consegna** (`delivery/argon-asset-giro2-20261110`, HEAD `e776c13`): 23 immagini uniche, tutte illustrazioni neurali vere — il metodo di `GIRO_2.md` ha retto. Esito completo in `docs/gold/CONSEGNA_ARGON_GIRO2_20261110_ESITO.md`.
  - **Entrano subito 9 derivati** (registro `REGISTRO_ARGON_GIRO2_20261110.json`): 8 tegole strada 720×1440 WebP e l'atlante `race_vortex_car` (fondo magenta rimosso, celle come `VEYRA_CAR`).
  - **Scartate 2:** `gang_breaker_b` (scritta «CAUTION», regola 9, e personaggio incoerente col foglio _a) e `gang_signal_b_v2` (fuori stile). I nemici buoni (shooter, signal, breaker_a, brute) aspettano i fogli mancanti per entrare insieme.
  - La quota del modello di Argon si è esaurita: B, V, G, F, M e il resto di N/T restano in coda, elencati nei suoi `CONSEGNA.md`. Per i suoni (A) Argon dichiara di non avere un modello audio: l'audio resta qui.
- **Nel gioco.** Tutte le 26 gare hanno ora una strada dipinta: Solkara giorno (3 tegole con landmark «reti» all'ultimo checkpoint), Solkara tempesta (2), Aurelia Span giorno (2), duello al tramonto (1); sequenza fissa per gara, come ad Ash Docks (`game/racing-v9.mjs`, `ROAD_SEQUENCES`). L'auto del giocatore è la Vortex consegnata: stati di danno, fiammate col nitro, fari di notte (`vortexCarFrame` in `game/visuals.mjs`; riserva sul vecchio sprite se l'immagine non è carica). Il laboratorio gare disegna le stesse tegole e la stessa auto. Android: WebP copiati e instradati (`AssetRoutes.java`).
- **[FATTO] Prove.** `npm test` 366 su 366 (nuovo `tests/race-art-giro2.test.mjs`, 6 test). Browser: `verify_race_roads_giro2.cjs` 16 su 16 (tegole WebP e atlante chiesti dalla pagina in tutti e 4 i circuiti nuovi, zero errori; screenshot in `docs/evidence/v10.3/`), `verify_racing_v9.cjs` e `verify_race_modes_browser.cjs` passano.
- **Limiti.** Solkara e Aurelia restano giocabili nel laboratorio: nella campagna `HUB_RACES` offre solo Ash Docks finché le loro regioni non entrano nel grafo (scelta già annotata in `game/hubs.mjs`). Le gare restano provate dal pilota del gioco, non da una persona.
- **Passaggio di consegne (decisione dell'autore, 10/11 sera).** APK e AAB successivi si producono nella chat di Claude Code sul terminale, non qui: stato, coda di lavoro e istruzioni di build in `docs/gold/HANDOFF_20261110_TERMINALE.md`; prompt pronto in `docs/gold/PROMPT_AVVIO_TERMINALE_20261110.md`. L'APK v22 resta l'ultima build fatta da questa sessione.

## R14 — Consegna Argon controllata: entrano interni e ritratti; gare riequilibrate e arricchite (D50, 10 novembre 2026)

- **D53.** Movimento e suono naturali in tutto il gioco: richiesta dei materiali ad Argon in `GIRO_2_ANIMAZIONE_AUDIO.md` (40 immagini, 96 suoni). Il codice di animazione e di mix è da fare, parte di ciò che non dipende dai materiali.
- **D52.** Tempi e hitbox del combattimento affidati a Claude, con prova in simulazione e numeri prima e dopo. Secondo giro di prompt per Argon in `requests/argon-interni-palazzi-20261109/GIRO_2.md`: 48 immagini, prima 3 di prova.
- **Confermato dall'autore (D51).** La selezione delle immagini resta questa; la logica del gioco è affidata a Claude, con le scelte registrate qui.
- **Riferimento.** D50: «I tre boss confermo che restano boss. Regole delle gare le confermo, ma migliorale e equilibrale arricchisci niente punti morti o senza personalità tutto colorato luminoso».
- **[FATTO] Consegna Argon** (`delivery/argon-asset-20261109`, commit `2a34c6a`, 188 immagini). Esito completo in `docs/gold/CONSEGNA_ARGON_20261109_ESITO.md`.
  - **Entrano 23 immagini:** 15 interni in prima persona (uno per servizio dei 4 villaggi) e 8 ritratti (7 servizi senza volto e la guardia della porta).
  - **Non entrano 165 immagini** (gruppi B, C, D, E, G, H, J, K, L, M, N): sono figure geometriche tracciate da un programma, o fotogrammi già esistenti copiati. Rispettano le misure, ma non sono disegni; nel gioco sarebbero un passo indietro.
  - Il ramo `delivery/argon-interni-palazzi-20261109`, che contiene anche codice, non è stato unito.
- **Interni nel gioco.** `game/interiors.mjs` (`INTERIOR_ART`), derivati in `game/art/interiors/*.webp` e `game/art/npc/svc_*.jpg`, registro `assets/production/v10.3/derived/REGISTRO_ARGON_20261109.json`. In verticale lo sfondo dipinto ora si vede (prima la regola CSS lo copriva); l'elenco degli acquisti scorre quando è lungo.
- **Gare (D50).** Velocità, urti e tempi limite non cambiano.
  - Medaglie: argento a +1,2 s e bronzo a +3,5 s dall'oro (prima +3 s e +6 s).
  - Ogni checkpoint ripara 20 punti di integrità.
  - Le Rivincite «Luci spente» e «Il fronte di sabbia» non aggiungono ostacoli al percorso rovesciato.
  - Schegge di luce su ogni tratto libero più lungo di 1100: +4 nitro l'una, +12 per la fila completa. Nessun tratto resta vuoto per più di 1100.
  - In Eliminazione compare «ULTIMO: SUPERA O ESCI» prima del checkpoint che farebbe uscire il giocatore.
  - Luci di bordo a due colori per ogni circuito; tinta propria per Solkara e Aurelia Span, che non hanno ancora la loro strada.
- **[FATTO] Prove.** `npm test` 360 su 360. `node tools/audit_races.mjs` (rapporto in `docs/evidence/v10.3/race-audit-d50.json`): 78 corse, 0 recuperi, 0 checkpoint mancati; il pilota esperto prende sempre l'oro, il medio oro o argento, il debole argento, bronzo o niente. Browser: `verify_interiors_browser.cjs` 32 casi a 390×844 e 844×390 in italiano e inglese, `verify_race_modes_browser.cjs`, `verify_racing_v9.cjs` e `verify_hub_race_browser.cjs` passano.
- **Limiti.** Le gare sono state guidate dal pilota del gioco, non da una persona. I gruppi rifiutati restano da generare con un modello di immagini: boss a 288 px, fogli di ruolo, terreno, facciate, case, decorazioni, strade di Solkara e Aurelia, Vortex, cancelli.
- **Build di test.** APK di debug con versionCode **21**: 97 930 567 byte, SHA-256 `1cc6773b1017d12cce9faeda7b0cd997a13ef5301b907da246ec4bd73bb52d12`; firma verificata dal build. `app.js` pesa 445 746 byte.

## R13 — Gare verificate in simulazione; prompt per la grafica che manca ai circuiti (D49, 9 novembre 2026)

- **Riferimento.** D49: «Ricorda anche le gare  reverse engineering per renderla funzionale e apprezzata se serve metti nel prompt».
- **[FATTO] Le gare funzionano.** `node tools/audit_races.mjs`: 26 gare, 3 abilità, 78 corse. Tutte arrivano al traguardo, salvo 6 eliminazioni previste dalle regole della modalità. 0 checkpoint mancati, 0 tracciati scorretti, rivali senza urti tranne uno nella Rivincita del duello. Il pilota esperto prende l'oro in tutti e 7 i Contro il tempo.
- **Nessun codice di gioco cambiato.** Nuovi solo `tools/audit_races.mjs` e `tests/race-audit.test.mjs` (4 test).
- **[FATTO] Cosa manca alla grafica delle gare.** Solkara e Aurelia Span (4 circuiti su 7) usano la strada della città (`game/racing-v9.mjs:52`); la Vortex del giocatore è lo sprite vecchio (`game/runtime.mjs:385`); i cancelli dei ponti sono rettangoli (`game/runtime.mjs:356`); trave e paletti esistono solo in versione porto (`game/visuals.mjs:45`).
- **Prompt.** `requests/argon-interni-palazzi-20261109/PARTE_3_GARE.md`: 19 immagini (12 strade, 1 auto, 2 cancelli, 4 ostacoli). Il totale per Argon sale a **112 immagini, 188 generazioni**.
- **In attesa dell'autore.** Tre proposte sulle regole delle gare (bronzo quasi mai assegnato, avviso prima dell'Eliminazione, due Rivincite più dure), scritte in fondo a `PARTE_3_GARE.md`; la conferma della correzione R12 sui tre boss.
- **Fermo in attesa degli asset**, come in R12. L'APK resta quello con versionCode 20: il gioco non è cambiato.

## R12 — I tre boss escono dalle ondate; elenco completo degli asset e prompt per Argon (D48, 9 novembre 2026)

- **Riferimento.** D48 resta l'ultima decisione. L'autore chiede: «Dammi prompt per tutti asset neccessari per argon e deve pubblicarti su github bisogna rendere gioco di successo curato al dettaglio non andare avanti se non hai gli asset».
- **Incoerenza introdotta da Claude con D46, corretta.** **[FATTO]** `cathedral_bone_tyrant`, `toxic_forge_behemoth` e `shadow_reaper` sono 3 dei 9 boss della Parte I (D23) e si rigenerano a 288 px (D28, D30). In R8 erano entrati come bruti comuni in 4 tappe.
  - Ora non compaiono in nessuna ondata e non sono nell'APK: aspettano il loro scontro da boss.
  - I bruti di Livelli bassi, Salita e Finale tornano `skeleton_shield_bearer`; quello dell'Archivio torna il foglio degli infetti.
  - `chainsaw` resta legato al Behemoth e oggi non suona; `suspense_appearance` suona all'ingresso di un bruto.
  - **Da confermare dall'autore:** la correzione è annotata nelle righe D46 e D47.
- **Asset necessari.** `requests/argon-interni-palazzi-20261109/INDICE.md`: 93 immagini (150 generazioni) in 9 gruppi con priorità. Interni (15), ritratti (8), terreno (8), facciate (4), case (4), decorazioni (4), pose mancanti (6), fogli di ruolo (8), boss a 288 px (36, pacchetto già pronto). Contiene anche il testo da incollare ad Argon per pubblicare sul ramo `delivery/argon-asset-20261109`.
- **Build di test.** APK di debug con versionCode **20**: 96 392 519 byte, SHA-256 `f3384296f4d7b84087675629c88d1f87eeb36fe5a640f0ef2452ff9ff0903a18`; `apksigner verify` dà OK.
- **Fermo in attesa degli asset.** Su richiesta dell'autore, il lavoro che dipende dalla grafica non va avanti finché le consegne non sono su GitHub.
- **[FATTO] Prove.** `npm test` passa per intero; `qa:foes` passa in 13 luoghi; `tools/audit_combat.mjs` dà ancora 144 partite vinte su 144, senza nemici bloccati.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R11 — Combattimento verificato in simulazione, correzioni d'equilibrio, prompt completi (D48, 9 novembre 2026)

- **Riferimento.** D48: l'autore non prova l'APK finché il combattimento non è controllato a fondo. Chiede anche i prompt per case, terreno e decorazioni.
- **Strumento.** `tools/audit_combat.mjs` gioca le 12 tappe a piedi con il pilota dei test (`tests/helpers/autoplay.mjs`), a due livelli di abilità e con 6 seed ciascuno, cioè 144 partite in circa 5 s. Riproduce la scena del consenso del finale come fa `runtime.mjs`.
  - Misura: esito, tempo, colpi subiti.
  - Cerca le incoerenze: nemici bloccati, nemici dentro i muri, colpi senza linea di vista, tappe che non finiscono.
- **Correzione di R10.** **[FATTO]** La stima fatta sulle formule era sbagliata. In simulazione il Contagio dura 36,7 s (il più breve dell'Atto II) ma non colpisce mai (0 colpi in ogni partita); la rotta di Lulù dura 126 s contro i 105 s di Nox.
- **Incoerenze.** **[FATTO]** Dopo le correzioni: 0 nemici bloccati, 0 dentro i muri, 0 tappe oltre il tempo, 144 partite vinte su 144.
  - Il nucleo dell'Àncora non si muove: è voluto dal canone.
  - I colpi «alla cieca» del finale (3–5 in 6 partite) sono tiratori che sparano all'ultima posizione vista; il muro ferma il proiettile (`shotBlocked`). È coerente.
- **Equilibrio.** Cambiano solo ondate e PV, riga D48.
  - Colpi subiti mediani del giocatore medio: Blackout 4, Breccia 5, Contagio **3** (era 0), Ora zero 8, segni di gesso 3, Livelli bassi **3** (era 2), Cantiere 4, Porto 0 (furtività), Archivio 3, Linea 6, Salita 3, Finale 9.
  - **[IPOTESI]** Il pilota tiene i nemici a distanza meglio di un giocatore che usa il tocco: i colpi subiti veri saranno di più. Per le tappe da sola di Nox (Salita 3) decidono i playtest.
- **Prompt per Argon.** `requests/argon-interni-palazzi-20261109/README.md` ora copre 35 immagini (70 generazioni con 2 varianti): 15 interni, 4 facciate, 8 fogli di terreno, 4 di case, 4 di decorazioni.
- **[FATTO] Prove.** `npm test` passa per intero, con il gate `tests/combat-audit.test.mjs` (la versione vecchia del Contagio lo fa fallire).
  - Nel browser: la campagna intera dal nuovo gioco ai titoli di coda passa con le strategie `a` e `b` di `tools/verify_campaign_browser.cjs` (31 tappe, 8 incarichi, finale completo); passano anche `qa:foes`, `qa:stability`, `qa:runtime`, `qa:touch`, `qa:controls`, `qa:demo`, `qa:save`, `qa:hubs`, `qa:labels`, `qa:hud` (106) e lo scontro con l'Àncora (11 PASS).
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R10 — Incoerenze in combattimento, analisi dell'equilibrio, prompt per Argon (D47, 9 novembre 2026)

- **Riferimento.** D47 resta l'ultima decisione. L'autore chiede: «Dinamiche combattimento equilibrio e zero incoerenze o sbavature»; e, se mancano, i prompt per Argon delle facciate dei palazzi e degli interni in prima persona.
- **Token in chat.** L'autore ha incollato in chat un token GitHub. Claude non l'ha usato (regola 2) e ha chiesto di revocarlo. Il push passa dall'accesso della sessione.
- **Difetto corretto.** **[FATTO]** Dal commit `8c2e790` il ciclo di disegno passava ogni nemico come `{...e, role:'enemy'}`, quindi `enemySprite` non vedeva mai `moor` né `brute`.
  - Effetti: nello scontro con l'Àncora i cavi finivano su tre alieni viola invece che sulle bitte con la scritta «CIMA» (schermata `anchor-390x844-moored` di `tools/verify_anchor_browser.cjs`, prima e dopo); i bruti con la grafica storica si vedevano a 104 px invece di 132.
  - Correzione: `enemySprite` legge `a.foe`, il ruolo vero.
  - Prove: `tools/verify_anchor_browser.cjs` passa (11 PASS) con le bitte disegnate; un test nuovo in `tests/chrono-foes-d46.test.mjs` blocca il ritorno del difetto.
- **Equilibrio: analisi, nessun numero cambiato.** Colpi di C-9 necessari per ripulire le ondate, secondo `ROLE_SPECS` e i `hp`/`damage` di ogni tappa:
  - Atto I e II: Blackout 25 (+48 il boss), Breccia 44 (+45), Contagio 72, Ora zero 49 (+75). Un nemico base resta fra 4 e 5 colpi in tutta la campagna: la curva tiene.
  - Rotta di Nox: Livelli bassi 67, Archivio 39 (+48), Salita 54. Totale 208.
  - Rotta di Lulù: Cantiere 53, Porto 24 (più le pattuglie da evitare), Linea 82. Totale 159.
  - Finale 44 (+92).
  - **[IPOTESI]** Due punti da far giudicare all'autore con i playtest: la rotta di Lulù chiede circa il 24 % di colpi in meno di quella di Nox, ma Lulù ha barriera e attacco ad area; e il Contagio (72 colpi, 13 nemici, nessun boss) è la tappa più lunga dell'Atto II. Cambiarli toccherebbe la durata del piano: si aspetta l'autore.
- **Build di test.** APK di debug con versionCode **19**: 96 814 680 byte, SHA-256 `79c8eb22fbd53042712fc82740d7ec4f55460bfba23593915cc142728bb2e02d`; `apksigner verify` dà OK.
- **Prompt per Argon.** `requests/argon-interni-palazzi-20261109/README.md`: 15 interni in prima persona (uno per servizio di ogni villaggio) e 4 fogli di facciate. **[FATTO]** Su GitHub non esistono interni in prima persona (solo il foglio di piastrelle `interiors.png`) e le facciate sono disegnate dal codice.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R9 — Gli effetti audio originali entrano nel gioco (D47, 9 novembre 2026)

- **Riferimento.** D47: l'autore chiede di applicare anche gli audio nuovi.
- **Cosa entra.** I 19 effetti di `game/audio/chrono/` non ancora collegati, nei momenti elencati nella riga D47: ambienti, arrivi nei villaggi, negozi e acquisti, cadute dei nemici di D46, sega del behemoth, fucili della gang, tensione e portale. Tutti sono nell'APK.
- **Come.** In `game/runtime.mjs`, `foeCue` lega gli eventi di combattimento agli effetti. In `game/chrono-art.mjs`, `chronoFoeFall` dà il materiale di ogni figura. `preloadChrono` accetta un ambiente diverso da quello del distretto. Se un buffer manca, l'effetto resta muto: nessun suono sintetico al suo posto.
- **[FATTO] Prove.**
  - `npm test` passa per intero; `tests/chrono-foes-d46.test.mjs` controlla che ogni effetto `chrono` sia nel pacchetto, abbia la sua rotta e un momento in cui suona, e che ogni nemico non umano abbia una caduta.
  - `qa:foes` passa in 13 luoghi: con gli effetti caricati, l'ambiente giusto (`chrono_necropolis` nei Livelli bassi, `chrono_refuge` a Moon), la campana suonata all'arrivo nel Cathedral Quarter e `bone_break` suonato davvero quando cade un ghoul nel Contagio.
  - `app.js` pesa 442 235 byte.
- **Build di test.** APK di debug con versionCode **18**: 96 814 680 byte, con dentro i 20 fogli di D46 e i 19 effetti di D47; SHA-256 `d518431e960e72e1720b11610998677dd36c98e452d80b2800062103c2aaf416`; `apksigner verify` dà OK.
- **Da sentire su telefono.** Volumi e varietà di questi effetti non li ha ancora ascoltati un umano: `human_listening = false` in `docs/evidence/chrono_shadows/audio-assets.json`.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R8 — Tutti i 20 nemici di riserva distribuiti nella campagna (D46, 9 novembre 2026)

- **Riferimento.** D46: l'autore approva tutti i 20 fogli e chiede di distribuirli per regione su tutto il gioco, con misure coerenti e senza toccare la durata.
- **Distribuzione.** Il dettaglio è nella riga D46. La gang del Blackout resta l'unica con la grafica storica. Il Cathedral Quarter ha un terzo personaggio, la guardia della porta, con la sua battuta in italiano e in inglese.
- **Misure.** `chronoEnemyHeight` disegna ogni figura alla stessa altezza nel mondo (72 px, 92 per i bruti), partendo dall'altezza reale del disegno nel fotogramma di riposo. Prima l'altezza variava da 66 a 85 px.
- **Peso di `app.js`.** Il manifest delle animazioni viaggia compatto: una riga di valori per animazione e la griglia `[larghezza, altezza, colonne, prima cella]` al posto dei rettangoli. Si ricostruisce identico al caricamento, come conferma `tests/bundle-weight.test.mjs`. `app.js` passa da 458 438 a **440 029 byte** con D46 già dentro: il margine sale a 84 259 byte.
- **Caricamento.** Ogni missione decodifica solo il suo cast. Villaggi, scena dopo i titoli e crollo dell'Asse non decodificano nemici.
- **[FATTO] Prove.**
  - `npm test` passa per intero; `tests/chrono-foes-d46.test.mjs` copre ruoli, distribuzione per rotta, fotogrammi, altezze e caricamento.
  - `qa:foes` (`tools/verify_foes_d46.cjs`) passa in 12 luoghi: 11 missioni e il Cathedral Quarter, ciascuno con esattamente il suo cast. Al porto la prima ondata è di pattuglie con la grafica storica, quindi lì si controlla solo il caricamento.
- **Non cambia:** hitbox, IA, tempi, danni, numero di ondate e quindi durata (regola 4).
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R7 — Nemici di riserva in gioco (D45, 9 novembre 2026)

- **Riferimento.** D45: l'autore approva l'entrata dei fogli nemici di riserva e lascia a Claude la scelta.
- **Cosa entra.** 11 fogli di `game/art/chrono/`, ciascuno come sagoma di un ruolo: 3 nella Breccia, 4 nel Contagio, 4 nel Nodo. L'elenco completo e i 9 fogli esclusi, con il motivo, sono nella riga D45.
- **Come.** In `game/chrono-art.mjs`, `CHRONO_FOES` associa i ruoli ai fogli e `chronoEnemySheet` sceglie il foglio da disegnare. I fotogrammi si calcolano dalla griglia 8×3 del foglio: il manifest di gioco non cresce. I fogli senza le pose `anticipation` e `recover` (`toxic_brawler`, `iron_penitent`) usano `special` e `idle`. I villaggi non caricano questi fogli (`prepare(…, false)`). L'APK li include (`tools/prepare_android_assets.py`, `AssetRoutes.java`).
- **Difetto trovato, non corretto.** **[FATTO]** In `game/runtime.mjs` il ciclo di disegno passa ogni nemico come `{...e, role:'enemy'}` (dal commit `c4ec6f5`). Per questo `enemySprite` non vede mai `brute` (sempre 104 px invece di 132) né `moor`. I fogli D45 leggono il ruolo vero da un campo nuovo, `foe`. Il comportamento vecchio resta com'è, in attesa del via dell'autore.
- **[FATTO] Prove.**
  - `npm test` passa per intero, con il test nuovo `tests/chrono-foes-d45.test.mjs`: assegnazioni, esclusi, fotogrammi uguali al manifest consegnato e dentro i PNG, caricamento solo in missione.
  - Nel browser passa `qa:foes` (`tools/verify_foes_d45.cjs`): nelle 3 missioni i fogli vengono caricati e disegnati.
  - `app.js` pesa 458 429 byte, sotto il tetto di 458 752.
- **Build di test.** APK di debug con versionCode **17**: 94 014 677 byte (+3,8 MB per gli 11 fogli), SHA-256 `7a67723bcfa91c7e1d6871bae3dbbe0eaa07f38cbed266b88eb2d8280dd532fb`; `apksigner verify` dà OK.
- **Non cambia:** hitbox, IA, tempi e danni (regola 4).
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R6 — Rework ambientale V3: identità delle 9 aree, risoluzione scacchiera/palazzo ripetuto in Blackout e margini 1:1 (9 novembre 2026)

- **Riferimento.** D44 e D40: reverse engineering dell'ambiente, differenziazione visiva dei 4 hub (`moon`, `cathedral`, `toxic`, `clockwork`) e dei 5 layout di missione (`yard`, `elbow`, `spine`, `arena`, `gallery`), e risoluzione del punto aperto in R5 («In missione il lastricato nuovo ha riquadri chiari a scacchiera e lo stesso palazzo ripetuto — schermata di Blackout a 390×844»).
- **Causa e correzione del lastricato a scacchiera e del palazzo ripetuto (`game/scenery.mjs`).**
  - **[FATTO]** In `game/art/chrono/environment.png` la cella `1` è una lastra chiara bordata di bianco e le celle `8..11` sono singole casette isometriche su sfondo trasparente. In R4 il pavimento alternava la cella `1` ogni `(x + y) % 4 === 0` (creando la scacchiera chiara) e stampava la cella `8` su ogni blocco chiuso `2×2` (~30 copie della stessa casetta in `Blackout`).
  - **Correzione:** il suolo calpestabile usa ora esclusivamente la grana di pavé scuro (cella `0` a `alpha = 0.50`) con micro-variazioni non periodiche (`vHash`), chiusini/griglie sparsi e corsie tratteggiate verso i nodi. I macro-isolati perimetrali (`x < 4`, `x > 19`, `y < 4`, `y > 19`) mappano i 4 quadranti architettonici autentici di `city.png`, `port.png`, `clinic.png` e `fracture.png` (`864×864`), mentre le 4 isole di copertura `2×2` interne espongono le 4 colonne distinte di `district_props.png` (`112×112` px).
- **Identità dei 4 villaggi (`game/village-art.mjs`).**
  - Le celle `x` (prop) poggiano direttamente sul lastricato stradale/piazzale calpestabile senza cordoli murari attorno.
  - Ogni hub ha tetti tipizzati con grana litica, facciate sud con finestre e soglie `d` dotate di tappeti luminosi di servizio, un landmark centrale unico nella piazza `(768, 768)` (Pozzo Lunare in `moon`, Rosone a 8 raggi in `cathedral`, Vasca di decantazione bio-chimica in `toxic`, Astrolabio/Ingranaggio Madre in `clockwork`) e 3 varianti di prop contestuali integrati con `district_props.png`.
- **Margini fuori mappa senza pixel stirati (`drawMapBackdrop` in `game/runtime.mjs`).**
  - Sostituito lo stiramento del bordo (`edge = 64 * scale`) con la ripetizione in scala `1:1` delle sole 2 file perimetrali esterne (`b = Math.floor(rh / 12)`, pari a `128` px mondo: righe/colonne `0..1` e `22..23`) oscurate da `#04081078`. Sui telefoni verticali (`390×844`) l'area dietro i controlli touch non mostra né strisce stirate né scritte interne duplicate.
- **Test audio deterministico (`tests/audio-v09.test.mjs`).**
  - Risolta l'instabilità segnalata in R5 iniettando una sequenza RNG deterministica nel test di non-ripetizione e riallineando l'intervallo del pitch di `shot` a `SFX_VARIATION.shot.pitch = 0.08` (`[0.92, 1.08]`).
- **Documentazione ed evidenze (`docs/gold/` e `docs/evidence/env-v3/`).**
  - Prodotti i 5 documenti richiesti: [ENVIRONMENT_REVERSE_ENGINEERING.md](ENVIRONMENT_REVERSE_ENGINEERING.md), [ENVIRONMENT_ART_DIRECTION.md](ENVIRONMENT_ART_DIRECTION.md), [ENVIRONMENT_ASSET_INVENTORY.md](ENVIRONMENT_ASSET_INVENTORY.md), [ENVIRONMENT_REWORK_LOG.md](ENVIRONMENT_REWORK_LOG.md), [ENVIRONMENT_EVIDENCE_INDEX.md](ENVIRONMENT_EVIDENCE_INDEX.md), più 9 screenshot runtime `390×844` in `docs/evidence/env-v3/`.
- **[FATTO] Prove e budget.** `npm test` **346/346** (`0` fallimenti). `android/build/assets/game/app.js` scende da `458 482` a **`456 876` byte** (`-1 606` byte; margine libero `67 412` byte, ossia `1 876` byte sotto la soglia di guardia `458 752`). Zero modifiche a collisioni, griglie `cells`/`walls`, coordinate servizi/NPC o salvataggi.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane (`[BLOCCATO: PENDING_DEVICE_VALIDATION]`).
- **Revisione del commit `df6869b` (arrivato da AI Studio).**
  - **[FATTO]** Ripetuto in questo ambiente: `npm test` 346/346; `app.js` 456 876 byte; nel browser passano `qa:labels` (9), `qa:controls` (11), `qa:stability`, `qa:runtime`, `qa:hubs`, `qa:save` e `qa:touch` (48).
  - **[FATTO]** La scacchiera chiara e il palazzo ripetuto non ci sono più (schermata di Blackout a 390×844). Il villaggio Moon resta leggibile.
  - **Correzione.** Il nuovo `drawMapBackdrop` copriva solo le 4 fasce laterali: in orizzontale (844×390) l'angolo in basso a destra restava nero, accanto a CURA. Adesso i margini ripetono la fascia esterna del raster a tessere 1:1, angoli compresi.
  - **Controllo nuovo** in `tools/verify_labels_r4.cjs`: i 4 angoli del canvas del mondo devono essere dipinti, nelle 9 combinazioni di scena e formato. La versione di `df6869b` fallisce (angolo con luminosità 9 su una soglia di 12); quella corretta passa.
  - **Build di test.** APK di debug con versionCode **16**, 90 220 818 byte, SHA-256 `bce30f9ab47d84dd7cc8459a623cdc5e026746f85ef1603cbfc56aba821b700d`; `apksigner verify` dà OK.
  - **[IPOTESI]** Il valore `avgFrameMs: 16.67` uguale per tutte le scene in `docs/evidence/env-v3/capture-report.json` sembra il passo del frame di riferimento, non una misura. `qa:performance` non è stato rifatto.

## R5 — Revisione dei commit di AI Studio (184a736, 80b6393) e build di pretest 15 (9 novembre 2026)

- **Riferimento.** D44: si lavora con gli standard del settore. I due commit sono arrivati su GitHub da AI Studio. Le modifiche al gioco restano: terreno lastricato, villaggi, eroi fermi nel menù, variazione di tono e volume degli effetti, laboratori.
- **Tolto, perché viola la regola 2 e la sicurezza:**
  - **`/api/github-push` in `server.js`.** Riceveva un token GitHub da un modulo web ed eseguiva `git push` verso qualsiasi ramo indicato nella richiesta, `main` compreso, senza nessuna autenticazione.
  - **Ascolto su `0.0.0.0`.** Il server ascoltava su tutta la rete tranne quando la porta era quella dei test (`isTestPort`), quindi la prova passava mentre il comportamento reale restava aperto. Tolto anche lo script `dev`, che faceva lo stesso.
  - **Ripiego sul vecchio APK rc2** servito col nome della build attuale.
  - **Pagina hub:** zip, patch e il pannello «PUBBLICA SU GITHUB» con il campo per il token.
- **Resta, ora coperto da test:** `/apk` come indirizzo breve dell'APK di debug, e la ripresa dei download interrotti (`Range`).
- **Nuove prove.** Il server non contiene codice che esegue git né riceve token, e su qualsiasi porta ascolta solo su `127.0.0.1`; la versione di AI Studio fallisce questa prova. `/apk` e `Range` hanno i loro test.
- **Bundler.** Il lucchetto `.prepare_android.lock` finiva nella radice del repo; ora sta in `android/build/`, che git ignora.
- **I commit di AI Studio non passavano `npm test`.** Fallivano due test: questa prima sezione di STATO non citava l'ultima decisione, e il test sulla variazione audio era instabile (passa in tutte le esecuzioni successive). **[IPOTESI]** Il secondo dipende dall'ordine in cui girano i test.
- **[FATTO] Prove.** `npm test` 346/346. Nel browser passano 13 prove: `qa:labels`, `qa:controls`, `verify_brand_browser`, `qa:hud` (106), `qa:hubs`, `qa:stability`, `qa:runtime`, `qa:audio`, `qa:options`, `qa:demo`, `qa:save`, `qa:touch` (48) e `verify_interiors_browser` (0 testi non tradotti). `app.js` 458 482 byte: margine 65 806, appena sopra i 65 536 richiesti.
- **Da rivedere.** In missione il lastricato nuovo ha riquadri chiari a scacchiera e lo stesso palazzo ripetuto (schermata di Blackout a 390×844).
- **Build.** APK di debug con versionCode **15**; AAB 1.0.0 con versionCode **3**, firmato con la chiave di prova (non si carica su Play).
  - `Chronos_Adventure_Nox_Lulu_debug.apk`: 90 220 818 byte, sha256 `080e52a21d77af50ccb98225ec78a8203cd7ed864223fd34c4b9a9649785060d`.
  - `Chronos_Adventure_Nox_Lulu_release_vcode3_FIRMA_DI_PROVA.aab`: 89 555 050 byte, sha256 `13135a3add958f865d8b4672ad9abf4f6f3a3162d5b5a38721c5fcee3262bbb0`.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R4 — Terreno urbano strutturato senza vuoti, posa eroica nel menù, variazione SFX e laboratori a grafica completa (9 novembre 2026)

- **Terreno calpestabile e isolati circostanti (`game/scenery.mjs`, `game/village-art.mjs`, `game/runtime.mjs`).** Eliminati i vuoti neri intorno alle mappe e sulle celle non calpestabili:
  - **Distretti urbani (`buildMapSurface`):** marciapiedi perimetrali lastricati, carreggiate centrali in conci sfalsati 32×16, griglie di scolo, chiusini d'ispezione, cordoli rialzati 3D con striscia tattile luminosa del distretto, condotti energetici tratteggiati tra i nodi e tetti architettonici 3D con lucernari e condotti d'areazione sui blocchi chiusi.
  - **Villaggi 24×24 (`bakeVillage`):** strade acciottolate a corsi sfalsati, piazze con croce lapidea e bisellatura, cordoli rialzati lungo i muri e terrazze/bastioni su tutte le celle esterne non calpestabili (`terrace = vShade(m.roof, -0.14)`).
  - **Zero bande nere su schermi panoramici:** `drawMapBackdrop`, `drawScene`, `drawDriving` e `drawRace` estendono i bordi della mappa e le banchine stradali sull'intero schermo; `drawDark` usa un cono di luce da 340 px che preserva la leggibilità del pavimento.
- **Menù principale e audio passi (`game/style.css`, `game/runtime.mjs`, `game/audio-engine.mjs`).** Nox e Lulù nel menù restano in posa eroica di respiro (`heroBob`) senza camminare sul posto (`heroWalk` rimosso da `.mh` e `.mh::after`); `syncSoundscape()` blocca qualsiasi suono di passo quando il menù o un blocco UI è attivo (`$('menu').hidden && uiLock === 0`), e `SFX_VARIATION` applica micro-variazione di pitch e volume agli effetti ripetitivi (`step`, `shot`, `vx9_shot`, `r12_shot`, `impact`, `heavy`, `chalk`, `dash`).
- **Laboratori V9 e Hub (`game/v9-combat-lab.mjs`, `game/v9-race-lab.mjs`, `index.html`, `server.js`).** Combat Lab e Race Lab usano gli sprite sheet V10 e le superfici urbane di `buildMapSurface`. L'hub web si apre di default a `100% Full Graphics` e include scaricamento streaming dell'APK (`/apk`) e sincronizzazione GitHub (`/git-patch` e `/api/github-push`).
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## Build di pretest con version code superiore (9 novembre 2026)

- Riferimento: D44. Contiene R1–R4 (R4: scritte del mondo a 12 px minimi a schermo, `qa:labels`).
- **Version code.** APK di debug (`android/AndroidManifest.xml`): 13 → **14**. Configurazione di rilascio: 2 → **3**, anche come valore predefinito di `npm run android:aab:play` (`PLAY_VERSION_CODE` lo cambia). Aggiornato [RELEASE.md](RELEASE.md).
- **[FATTO]** `npm test` 343/343. `aapt2 dump badging`: APK `com.cityadventure.pizzaprotocol.debug` versionCode 14; AAB `jaguarZcreatorZ13.app` versionCode 3, 1.0.0, targetSdk 36.
  - `Chronos_Adventure_Nox_Lulu_debug.apk`: 90 216 722 byte, sha256 `ca2d29828c602bf39da9ef92c7a7b5e74d8e3fef2d2990a6d4cb985425090570`.
  - `Chronos_Adventure_Nox_Lulu_release_vcode3_FIRMA_DI_PROVA.aab`: 89 553 439 byte, sha256 `fb7b7bbaca38b05299b34c7a768e8d8ca3ed0fd2dc6dcb9b144fbe0c72763893`. È firmato con la chiave di prova, quindi non si carica su Play.
- Integrato con il lavoro R4 di AI Studio (terreno urbano, posa menù, audio SFX).
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R3 — Primo minuto del pretest: versione nei Crediti, invito al tocco, inglese del kit, D39 nei Controlli (9 novembre 2026)

- **Mandato.** D44, punto 3, e D38: si va avanti fino al bundle di pretest con gli standard del settore. I punti vengono dall'audit di pretest (#4, #6, #8) e dalla revisione R1 (11 testi inglesi).
- **Versione nei Crediti (audit #8).** A pagina caricata la shell Android scrive `window.chronosAppVersion` con `versionName` e `versionCode` del pacchetto installato (`MainActivity.versionScript`). Passa solo valori: nessun `addJavascriptInterface`. I Crediti mostrano «Versione 1.0.0 (2)» (in inglese «Version 1.0.0 (2)»); nel browser mostrano «Versione di sviluppo». Il kit di pretest chiede a ogni tester di riportarla. **[IPOTESI]** Sul telefono va vista in M1; la compilazione Java è pulita.
- **Apertura «batti due volte» (audit #4).** **[FATTO]** In Chromium la cassa si apre con un doppio tocco a 100 ms e a 250 ms e con il doppio clic: il problema del 4 novembre non si riproduce più, grazie a `touch-action: manipulation` di P1. Nuovo: dopo 2,5 s senza colpi, un anello intorno ai due pallini mostra dove toccare. Sparisce al colpo, torna se si aspetta il secondo e resta fermo con «Riduci movimento». Lo stesso invito c'è nella bussata delle scene. In orizzontale l'anello è più piccolo, per non toccare il testo.
- **Inglese.** Le 11 stringhe del kit di Tessa e della barra armi erano in italiano dal 26 ottobre (`24d9f8d`): ora sono tradotte (CAMBIA → SWITCH, RICARICA → RELOAD, ecc.). TESSA e NITRO restano invariate.
- **D39.** La scheda Controlli elenca solo tocco e gamepad. I tasti funzionano ancora: toglierli e passare al tocco le prove che li usano resta P2.
- **[FATTO] Prove.** `npm test` 343/343. In Chromium headless passano `qa:options` (11), `verify_brand_browser` (con l'invito al tocco), `qa:hud` (106), `qa:demo` (7), `qa:touch` (48), `qa:controls` (11), `qa:stability`, `qa:runtime`, `qa:save`, `qa:hubs` e `verify_interiors_browser`, che non trova più testi inglesi mancanti (prima erano 11). `app.js` 452 954 byte (margine 71 334). Mutanti presi: invito che non riparte dopo il primo colpo, versione ignorata dalla pagina.
- **Build di questo commit.** APK di debug e AAB con la configurazione di rilascio (`jaguarZcreatorZ13.app`, 1.0.0, versionCode 2, targetSdk 36), firmato con la chiave di prova. Contengono il tema `title_theme` e la versione nei Crediti.
  - `Chronos_Adventure_Nox_Lulu_debug.apk`: 90 216 722 byte, sha256 `cd13b5a484f5c21a3256a781c1940833b722aa8b85749b1d70cab501c3710a96`.
  - `Chronos_Adventure_Nox_Lulu_release_vcode2_FIRMA_DI_PROVA.aab`: 89 553 357 byte, sha256 `ff8419390967bcc5b43fca54dd6b68ecbc9609c4365946f56b60b44db3d5f5d0`.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R2 — D44: tema del titolo come derivato registrato e carica ×1,25 nelle difese (9 novembre 2026)

- **D44.** In risposta alle due domande di chiusura di R1, l'autore ha scritto: «Sì, confermo tutto. Lavora come uno del settore.»
- **Tema del titolo.** File `game/audio/v10/title_theme.ogg`, generato da `tools/compose_title_theme_v10_3.py`; partitura, metriche e master FLAC in `assets/production/v10.3/audio/`; voce `audio.title_theme` in `AUDIO_REGISTER.json`. Strati, guadagni e colpi sono quelli del mix dell'8 novembre (`757d672`); è stata rifatta solo l'ingegneria:
  - **Loop.** Tutti gli strati sintetici sono periodici sui 60 s (124 battiti a 124 BPM). Prima il basso scattava a ogni cambio d'accordo e al punto di loop; ora passa da un accordo all'altro con dissolvenze a potenza costante, anche dall'ultimo al primo. Agli estremi del file non c'è più un pezzo copiato. Il passo al loop è 0,0144 (passo tipico 0,006) e la correlazione fra i primi e gli ultimi 150 ms è −0,10 (era 0,997).
  - **Niente distorsione.** Compressore senza guadagno aggiunto e dente di sega senza aliasing (PolyBLEP). Loudness misurata −15,1 LUFS (piano: brani d'azione a −15 ±1), picco reale −1,4 dBTP, 0 campioni saturati.
  - **Telefono.** Il mix dell'8 novembre aveva l'88% dell'energia sotto i 200 Hz. Sopra i 300 Hz, cioè quello che un altoparlante di telefono riproduce, suonava a −20,6 LUFS: 5 dB sotto il titolo originale e `blackout` (−15,6). Ora l'energia sotto i 200 Hz è il 59%, e sopra i 300 Hz il tema suona a −19,0 LUFS, come `refuge_theme` (−18,8). Il generatore si ferma se questo valore scende sotto −19,5.
  - **Riproducibile.** Seme fisso e codifica bitexact: due esecuzioni danno gli stessi byte (ffmpeg 6.1.1).
  - **Dove suona.** Nel menù e nell'apertura «Due colpi». L'originale `game/audio/v05/title.ogg` resta intatto e non va più nell'APK (−350 KB).
  - **[FATTO]** Nel browser il menù scarica solo `audio/v10/title_theme.ogg`, senza errori. **[IPOTESI]** Manca ancora l'ascolto umano, anche su un telefono.
- **Difese ×1,25** di nuovo in `game/campaign.mjs`, con un commento che cita D44. Il test fissa le due velocità: 1,25/hold con l'ondata ripulita, 1/hold con un nemico vivo fuori dalla zona. Due mutanti presi. In CLAUDE.md la regola 4 ora elenca le eccezioni D27, D29 e D44.
- **[FATTO] Prove.** `npm test` 339/339. Nel browser passano `qa:audio`, `qa:runtime`, `qa:demo` (7), `verify_brand_browser`, `qa:stability` e `verify_leitmotifs_browser`. `app.js` 451 429 byte (margine 72 859).
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## R1 — Revisione del lavoro dell'8 novembre e correzioni (9 novembre 2026)

- **D43.** L'autore: «/code-review migliora e ridammi aab e apk qui in chat». Rivisti i 17 commit da `f055e93` a `757d672`: 4 delle sessioni locali del 4 novembre (D38–D40) e 13 dell'8 novembre fatti con un altro assistente. Trovati 15 problemi, ognuno verificato nel codice o con una prova diretta.
- **Corretto.** Ogni punto ha un test o un controllo nel browser che fallisce sulla versione dell'8 novembre (prova di mutazione o confronto con `757d672`).
  1. **Sicurezza.** `npm start` torna il server delle prove su `127.0.0.1:8080` (CLAUDE.md). `server.js` diventa `npm run hub`. Prima serviva tutto il repo su `0.0.0.0:3000`, compresa `dist/play-upload` (chiave di upload Play e password, `tools/generate_play_upload_key.mjs:7-12`) e `.git`. Ora serve solo la pagina hub, `game/`, `assets/`, `docs/` e l'APK di debug. Un URL malformato riceve 400 e un APK mancante 404, invece di far cadere il server. Parte su `127.0.0.1`; `HOST=0.0.0.0` lo apre alla Wi-Fi di casa. Test: `tests/server-hub.test.mjs` (4 test, 5 mutanti presi).
  2. **Regola 4.** Tolto il `×1,25` sulla carica delle zone di difesa: `game/campaign.mjs` è di nuovo identico a `f055e93`. Il test della difesa ora misura 1 s di presidio = 1/hold (`tests/campaign-v08.test.mjs`).
  3. **Regola 5.** Le 6 tracce di `game/audio/v05/` (blackout, breach, contagion, driving, title, zero) tornano gli originali, con byte e sha256 uguali a `FILE_INVENTORY.json`. Il «remaster» le aveva sovrascritte: zero aveva 86 980 campioni a 0 dBFS, driving era più bassa di 14,5 dB, title passava da 349 645 a 1 678 462 byte. Tolti `tools/upgrade_all_game_audio.py` e `tools/create_aggressive_mystery_title.py`, che scrivevano sugli originali. Test: `tests/audio-originals.test.mjs` (96 file; unica eccezione registrata `chalk_route`, rifatta in `c0d818e`). Il tema nuovo del titolo resta recuperabile da `757d672`.
  4. **Regola 3, schermata di sblocco.** «17 Boss» diventa «5 Boss», il numero di `BOSS_NAMES`. «Below», «Cattedrale» e «Veyra Championship» comparivano solo lì, quindi i riquadri ora usano nomi che il gioco contiene: 9 regioni, più 4 villaggi, H-17 Needle, ARC-7 Choir, le gare di Veyra. Paragrafo, titoletto e pulsante tornano al testo approvato in M3 («100% offline» non era verificato senza M4). Tutto tradotto in inglese; didascalie da 10 a 12 px. In orizzontale (844×390) la scheda usciva dallo schermo e per vedere «Più tardi» bisognava scorrere. Ora va su due colonne, con prezzo, «Sblocca» e «Più tardi» a destra, tutti visibili (regola 7). Test: `tests/unlock-claims.test.mjs`; `qa:demo` controlla i due pulsanti a 360×800 e 844×390.
  5. **Regola 3, M6.** `REGISTRO.json` torna `SPECIFIED_NOT_GENERATED`. I 4 fogli dichiaravano come fonte `delivery/gpt-boss-v2-20261102`, ramo che non esiste, e lo stato `TECHNICALLY_VERIFIED`, mentre i loro rapporti dicevano INCOMPLETO. Erano ricavati dagli atlanti di `game/art/chrono/` del 21 ottobre. Tolti dallo slot del derivato, insieme a `tools/build_boss_v2_derived.py`. **M6 resta aperto.** Test in `tests/art-derived.test.mjs`.
  6. **Salvataggio.** L'avviso «Salvataggio non disponibile» resta sullo schermo anche quando si torna al menù: è un avviso della sessione, non della scena (`notice(…,true)` in `persist`). Nuovo controllo in `qa:save`.
  7. **Pulsanti.** CURA non finisce più sotto la barra CAMBIA/RICARICA. La barra si rimisura quando la colonna delle azioni cambia altezza (`ResizeObserver`): il difetto c'era già a 360×800, di 6 px. Tolte le emoji dai pulsanti d'azione, che portavano DUO su 4 righe. `qa:controls` ora misura anche CURA e la barra, su una pagina nuova per ogni formato.
  8. **Menù.** Toccare Nox o Lulù non li fa più sparire per un secondo: il saltello si somma alle animazioni invece di sostituirle. L'opzione «Riduci movimento» del gioco ora ferma eroi, eco, braci, orologio e bagliori dei pulsanti, come la preferenza di sistema. Nuovo controllo in `verify_brand_browser`.
  9. **Canone NPC (regola 6).** Un volto compare solo dove l'appendice NPC mette quel personaggio nel villaggio, o dove il servizio lo nomina (Officina di Dario): 8 servizi su 15. Via EVE-Prime dall'informatore di Clockwork, via Ivo e Neris (proposte non adottate, D03). Gli altri servizi tornano al disegno dell'interno. **[IPOTESI]** Mara al Bazar dei filtri e Rika Dorn alla Fonderia sono deduzioni dal canone: villaggio giusto, mestiere vicino. Test: `tests/npc-portraits-canon.test.mjs`.
- **Restano come sono:** M7 (D26, D33: 3 battute spostate nel cammino verso Moon, nessuna cancellata), sblocco di ARC-7 e H-17 in campagna, villaggi e interni D40, pausa e toast P1, suoni sintetici nuovi (`hitStop`, `relayLit`, `perfectDodge`).
- **[FATTO] Prove.** `npm test` 338/338, tre volte di fila. Il test instabile visto in revisione (1 volta su 11) non si è ripresentato. `app.js` 451 372 byte (margine 72 916). Prove nel browser: in Chromium headless passano `qa:options` (10), `qa:hud` (106), `qa:demo` (7), `qa:touch` (48), `qa:stability`, `qa:runtime`, `qa:gamepad` (9), `qa:audio`, `qa:health` (11), `qa:hubs`, `qa:controls` (11), `qa:save` e `verify_brand_browser`. I controlli nuovi di `qa:controls`, `qa:save`, `qa:demo` e `verify_brand_browser` falliscono sulla versione `757d672`. Interni: schermate a 390×844 e 844×390. **[IPOTESI]** Nessuna prova su un telefono vero (M1).
- **Messaggi di commit dell'8 novembre da leggere con cautela** (la storia non si riscrive):
  - «120 minuti confermati»: il rapporto stima 85,7 min **[STIMATO]**.
  - «M1 Telefono: test completo… OK»: è Chromium headless, non un telefono.
  - «M6: Integrazione boss visivi GPT v2»: vedi punto 5.
- **Aperto.**
  - Decide l'autore: tema nuovo del titolo (va rifatto senza clipping e senza il salto al punto di loop, come derivato registrato); `×1,25` nelle difese.
  - D39 a metà: la scheda Controlli elenca ancora la tastiera e i tasti funzionano.
  - 11 testi inglesi del kit di Tessa mancano dal 26 ottobre (`24d9f8d`).
- **Build di questo commit:** APK di debug e AAB con la configurazione di rilascio (`jaguarZcreatorZ13.app`, versionCode 2, 1.0.0, targetSdk 36) firmato con la chiave di prova. L'AAB per Play lo firma solo l'autore (`npm run android:aab:play`).
  - `Chronos_Adventure_Nox_Lulu_debug.apk`: 88 905 996 byte, sha256 `ddf130c59547c307f090a7c7d310e7c70e36c3881adc1dac52a4da96f80e14c0`.
  - `Chronos_Adventure_Nox_Lulu_release_vcode2_FIRMA_DI_PROVA.aab`: 88 235 418 byte, sha256 `9b3e1d013f33e547c6ffc6cbe3402fc385cf105d4e89d1cafa677a926cc0c31b`.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## TIER 3 — Commercial Gold: Gameplay Intelligence, Ritmo, Equilibrio e Protocollo Playtest Umano (8 novembre 2026)

- **D42 (seguito di D35, D38, D40, D41).** Eseguito l'audit completo FASE 1–8 sul ramo `work/chronos-adventure-commercial`:
  1. **FASE 1–3 · Audit Reale, Ritmo delle 31 Tappe ed Equilibrio ([TIER3_MASTER_REPORT.md](TIER3_MASTER_REPORT.md), [GAMEPLAY_RHYTHM_AUDIT.md](GAMEPLAY_RHYTHM_AUDIT.md), [DIFFICULTY_BALANCE_AUDIT.md](DIFFICULTY_BALANCE_AUDIT.md)):** `[FATTO]` documentati per tutte le 31 tappe tempi `[MISURATO]` e `[STIMATO]`, percentuali di esplorazione/combattimento/guida/dialogo/attesa, curva d'intensità Atto I–III, statistiche di Nox e Lulù, bilanciamento delle 5 armi V9, analisi dei 5 boss in campagna e dei 4 boss v2 in staging (`M6`), ed economia dei 4 villaggi 24×24.
  2. **FASE 4–5 · Protocollo Playtest Umano e Valutazione 12 Aree ([HUMAN_PLAYTEST_PROTOCOL.md](HUMAN_PLAYTEST_PROTOCOL.md), [HUMAN_PLAYTEST_RESULTS.md](HUMAN_PLAYTEST_RESULTS.md)):** `[FATTO]` predisposto il protocollo completo per 5–10 tester indipendenti (3 scenari, scheda di osservazione, questionario non direttivo, protocollo di misurazione del tempo attivo) e valutate le 12 aree di coinvolgimento distinguendo `[MISURATO]`, `[OSSERVATO]`, `[STIMATO]`, `[IPOTIZZATO]` e `[NON VERIFICATO]`. Sessioni umane registrate: `0` (dipendenza esterna dichiarata).
  3. **FASE 6 · Correzioni al Gameplay e alla Progressione (`game/weapons-v9.mjs`, `game/runtime.mjs`, `game/runtime-en.mjs`, `game/campaign.mjs`, `tests/weapons-v9.test.mjs`):** `[FATTO]` risolto il blocco di progressione che impediva di sbloccare `ARC-7 Choir` e `H-17 Needle` nella campagna (`Il Custode V-01` in `zero` sblocca ora `weapon.eden_technology` → `ARC-7 Choir` per Lulù; `EVE-Prime` in `archive` sblocca `weapon.vega_component` → `H-17 Needle` per Nox) e ridotti i tempi morti nelle missioni di difesa (`s.progress ×1,25` a zona presidiata e ondata pulita; *annullato in R1, regola 4*). Hitbox e finestre di schivata invariate (regola 4).
  4. **FASE 7–8 · Release Gate e Build Android API 36 ([RELEASE_GATE.md](RELEASE_GATE.md)):** `[FATTO]` `npm test` `329/329 PASS`, `app.js` sotto `524 288` byte con oltre `64 KiB` di margine, rigenerati `dist/Chronos_Adventure_Nox_Lulu_debug.apk` e `dist/chronos-adventure-release.aab` (`targetSdk 36`, `versionCode 2`, `1.0.0`).
- `COMMERCIAL_RELEASE = BLOCKED`; `RELEASE READY = NO`; 0 sessioni umane.

## TIER 2 — M6 Boss Visivi v2, M1 Verifica Mobile API 36, M7 «Otto Mesi Dopo» (8 novembre 2026)

- **D41 (seguito di D26, D28, D30, D33, D38, D40).** Completati in ordine i tre blocchi di TIER 2 della roadmap:
  1. **2A · M6 Boss Visivi v2 (`assets/production/v10.3/derived/`):** *(Corretto in R1: segnaposto dagli atlanti di `game/art/chrono/`, rapporti INCOMPLETO, tolti; M6 resta aperto.)* `[FATTO]` generati e verificati i 4 fogli sprite `2560×1280` (griglia 8×4 di celle `320×320`, 28 pose su 8 stati, altezza riferimento `288 px`, pivot piedi allineato a `302 px / 160 px`, alfa binaria, margine 12 px libero, 8 colori nella palette v2 con contorno scuro di 2 px e 0 % bande riservate Nox/Lulù/interattivo) per `boss.bone_tyrant.sheet`, `boss.forge_behemoth.sheet`, `boss.shadow_reaper.sheet` e `boss.vega.sheet` (`tools/build_boss_v2_derived.py`). Aggiornato `REGISTRO.json` (`TECHNICALLY_VERIFIED`) e catturati 4 screenshot di boss in battaglia (`1 vs Nox`: Rook; `1 vs Lulù`: The Anchor; `2 boss finali`: EVE-Prime e Archon) in `docs/evidence/tier2/m6/`.
  2. **2B · M1 Verifica Mobile API 36 (`docs/evidence/tier2/m1/`):** `[FATTO]` superate tutte le suite mobile su `390×844`, `360×800` e `844×390`: `qa:touch` (48 controlli tocco singolo e multitocco a due dita), `qa:controls` (11 controlli), `qa:gamepad` (9 controlli W3C Gamepad), `qa:save` (persistenza e recupero salvataggio) e `qa:stability` (`S1–S7`, `S5b`, `S6b`, `M-S1`). `[IPOTESI]` il comportamento su telefono fisico reale resta da confermare con test manuale (`0` sessioni umane registrate in `PLAYTEST.md`).
  3. **2C · M7 Testo «Otto Mesi Dopo» (`game/story-v08.mjs`, `game/runtime.mjs`, `docs/gold/M7_OTTO_MESI_DOPO.md`):** `[FATTO]` applicata la distribuzione riga per riga approvata (`D26`, `D33`, `D41`): 5 battute in cammino (`moveCast`) nella scena `home` e 3 battute sulla rotta (`STORY.home_walk`) all'arrivo in `Moon Refuge`, con zero righe cancellate e 100 % copertura `EN_TEXT`.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## Pretest M-B — Villaggi progettati, interni con ritratto, pulsanti multi-tocco (4 novembre 2026)

- **D40 (seguito).** Mappe e villaggi con edifici disposti con criterio, ingresso negli edifici, ritratto di chi parla; e fondamenta del «solo mobile» (D39).
- **Villaggi** (`game/villages.mjs`, `game/village-art.mjs`): i 4 hub (Moon Refuge, Cathedral Quarter, Toxic Slum Bazaar, Clockwork Outpost) non sono più la stessa croce ripetuta. Ognuno è una pianta 24×24 diversa, con piazza, strade, edifici pieni e porta leggibile sul lato strada, un edificio-simbolo (cattedrale con guglie e rosone, torre dell'orologio con lancette che girano), lampioni/fusti/ingranaggi, pozza o vasca animata. L'arte è tutta procedurale su canvas (nessun file immagine nuovo: regola 5, Nox e Lulù non si toccano; principi di progetto dai classici, nessuna mappa o sprite copiati, regola 9). Finestre che pulsano, fumo dai camini, bagliore e freccia «ENTRA» quando sei vicino a una porta.
- **Interni:** entrando in un servizio si vede già il ritratto grande in prima persona dell'interlocutore (Locandiere, Fabbro, ecc.) con nome e battuta; verificato nel browser (`qa:interiors`).
- **Punti degli hub** ora presi dalla pianta del villaggio: ogni servizio sta sulla sua porta, persone e interventi nelle posizioni pensate, tutti raggiungibili con la collisione normale (test).
- **Pulsanti multi-tocco (D39, fondamenta):** CAMBIA, RICARICA, IMPULSO e CURA agivano solo sul click, che il browser non emette per un secondo dito mentre il primo tiene il joystick: su telefono erano morti durante il movimento. Nuova `onTap` in `game/runtime.mjs`: agiscono sul rilascio del proprio dito (restano Invio/Spazio per l'accessibilità). Helper di tocco per le prove (`tools/lib/touch-input.cjs`, `qa:touch` 48 controlli).
- **[FATTO] Prove.** `npm test` 329 test, 327 pass; i 2 rossi sono i soliti ambientali (numpy con `python3 -I`). Nuovo `tests/villages-d40.test.mjs` (5): quattro piante diverse, edifici rettangolari con porta calpestabile, ogni servizio sul suo edificio e raggiungibile, piazza presente. `qa:touch` PASS (2 volte di fila). Schermate dei 4 hub a 390×844, 844×390 e 360×800; mappe intere renderizzate. `app.js` 447 422 byte (margine 76 866). Bundler: aggiunti i 2 moduli, tolti spazi e indentazione a inizio riga, fotogrammi del manifest compattati per rientrare nel budget.
- **[IPOTESI]** L'arte dei villaggi è vista solo in Chromium headless; su telefono va verificata (M1).
- **Non fatto in questa milestone:** la rimozione vera delle scorciatoie da tastiera dal gioco e la migrazione al tocco dei ~20 script di prova dell'autoplay (restano com'erano su HEAD: il gioco ha ancora la tastiera, quindi passano). È il prossimo passo mirato di P2.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## Pretest M-A — Menù animato con Nox e Lulù (4 novembre 2026)

- **D40.** L'autore chiede personalità, grafiche personalizzate e animazione ovunque; menù animato con Nox e Lulù; mappe e villaggi con edifici disposti con criterio, ingresso negli edifici e ritratto grande di chi parla; ambientazioni sensate. Ha anche chiesto di lavorare direttamente, senza lunghe deleghe: da qui in avanti niente sotto-agenti, test e schermate di persona.
- **Menù, prima.** In verticale Nox usciva quasi tutto dallo schermo (a 390×844 se ne vedeva una striscia); in orizzontale i due erano lontani e Nox copriva «Impostazioni».
- **Menù, ora** (`game/style.css`, in coda; `game/runtime.mjs`, un gestore di tocco): Nox e Lulù interi, vicini, grandi quanto lo schermo permette (`--hw:min(60vw,270px,27vh)`), con luce di bordo azzurra e rosa, ombra a terra pulsante, ingresso animato, ciclo di camminata degli sprite esistenti (non ridisegnati), **eco del Chrono Shift** ogni 7 s (lampo di luce e fantasma) e **saltello al tocco**. Con «movimento ridotto» tutto resta fermo.
- **[FATTO] Prove.** Schermate a 390×844, 360×640, 412×915 e 844×390: entrambi interi, nessuna sovrapposizione con titolo o pulsanti; sequenza di 8 fotogrammi in tempo reale che mostra il lampo e l'eco; tocco su Lulù attiva il saltello senza errori. `npm test` 323 test, rossi solo i 2 ambientali (numpy con `python3 -I`); `verify_brand_browser` PASS a 6 formati; `app.js` 444 203 byte.
- **[IPOTESI]** Il lampo è stato visto solo in Chromium headless; l'effetto su GPU di telefono è da vedere (M1).
- **Non committato, in sospeso:** la migrazione delle prove dalla tastiera al tocco (D39) è a metà nel working tree (`tools/lib/touch-input.cjs` e script) e non è stata verificata.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## Pretest P1 — HUD senza tagli, toast di scena e pausa per il tocco (4 novembre 2026)

- **D38 e D39.** D38 (parole dell'autore): «Lavora milestone dopo milestone senza fermarti ad aspettare il mio feedback, fino al bundle di pretest.» Si lavora per un APK di pretest da mostrare a 5–10 persone. D39: gioco solo mobile, via i comandi da tastiera delle azioni di gioco (P2). Poi l'autore: «continua finché non finisci il gioco ad un livello tale da giustificare il prezzo!»
- **Audit di qualità** (14 problemi con prova, in [AUDIT_PRETEST.md](AUDIT_PRETEST.md)); il piano è P1 difetti visibili · P2 solo tocco · P3 primi 10 minuti · P4 finitura · P5 fine demo · P6 kit di pretest.
- **P1, HUD.** In verticale l'etichetta del distretto era tagliata con «…» in 8 passi su 12 (spazio 96 px a 360, 126 a 390, 148 a 412; testo fino a 216 px; `game/style.css:100`). Ora va a capo, corpo 10 px invariato. «VORTEX · INTEGRITÀ» e «CAMION · INTEGRITÀ» stanno su una riga; `#meter` non esce più dal chip.
- **P1, toast.** «Muovi Nox verso il vetro…» restava sopra «Otto mesi dopo»: `hideGameplay()` ora spegne il toast (`clearNotice()`); l'avviso di salvataggio non disponibile di `hubExit` non si perde più (ordine `hideGameplay();persist();`).
- **P1, pausa.** Lingua da 19 a 44 px (66×19 prima); in orizzontale due colonne, tutti i controlli dentro lo schermo senza scorrere (in 844×390 erano a y −214…−9); focus iniziale senza scorrimento. Via dalla pausa la riga con i tasti della tastiera (D39). In inglese l'etichetta del misuratore ora è tradotta (era preesistente).
- **[FATTO] Prove.** `npm run qa:hud` (nuovo, `tools/verify_hud_p1.cjs`): 106 controlli su 4 formati, IT/EN, rosso sul codice di prima (14 falliti) e verde dopo; rilanciato da un verificatore indipendente sul sottoinsieme (30 controlli, 2 mutanti presi). `qa:controls` 11, `qa:options` 10, `qa:gamepad` 9, `qa:stability` PASS. `npm test` 323 test; i rossi restano i 2 ambientali (numpy non visibile a `python3 -I`: «race props round trip», «GPT chroma key»). `app.js` 443 999 byte, margine 80 289.
- **[IPOTESI] Non coperto.** Pausa a 360×640 in piedi (ultimo pulsante tagliato di circa 10 px), 568×320 e 1024×521 (la soglia dell'orizzontale è `max-height:520px`): per P4. «Testo grande» non agisce sulla pausa. Il toast di arrivo gara dopo `openHub` non ha una prova diretta.
- **Difetto dello strumento, non corretto qui:** `tools/observe_missions.cjs` scrive `p.step=i` e il gioco carica sempre «Blackout»: va riparato con `makeSave(stepId)` (in P2, che tocca già gli script).
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## Q3–Q4 — Peso di `app.js`, prestazioni e menù Opzioni (4 novembre 2026)

- **D37.** Parole dell'autore: «Ah, va bene, finisci il gioco però. Finiscilo e fallo diventare un gioco di successo.» Si va avanti con ciò che non dipende da dati dell'autore (D35, priorità 4 e 5; menù di D34). M4, M6 e M7 restano fermi: servono il product ID, le immagini dei boss e l'approvazione dei testi.
- **Q3, peso (prerequisito per M4, M6 e M7).** Nel solo pacchetto Android, `CHRONO_MANIFEST` tiene i campi che il codice legge (`atlases[id].path` e 10 campi delle animazioni); i campi di documentazione (scatole di collisione, politiche, note di qualità) restano in `game/chrono-manifest.mjs` e nel JSON degli artisti, che non cambiano.
  - **[FATTO]** `app.js` **520 946 → 439 574 byte** (−81 372) solo con questo passo; con Q4 **444 018 byte**, margine **80 270** su 524 288 (`python3 tools/prepare_android_assets.py`).
  - **[FATTO]** `tests/bundle-weight.test.mjs` (3): per ogni animazione, fotogrammi, perni e tempi identici fra sorgente e pacchetto (anche con movimento ridotto); il codice legge solo i campi tenuti; margine di almeno 64 KiB. Mutante (`pivot_y` tolto dal bundler) preso.
- **Q4, menù Opzioni (D34, priorità 5).** «Impostazioni» nel menù principale apre una schermata **Opzioni** a 4 schede:
  - **Audio:** interruttore, **Musica** ed **Effetti e ambiente** da 0 a 100 % a passi del 10 %. I volumi moltiplicano il mix d'autore (`MIX` in `audio-engine.mjs`): a 100 % il suono è identico a prima; l'abbassamento durante i dialoghi resta.
  - **Accessibilità:** lingua, movimento ridotto, **testo grande** (dialoghi 17 → 20 px, 15 → 18 px su schermi piccoli o in orizzontale; battute, suggerimenti e scelte × 1,2) e una riga su come si leggono le minacce senza colore.
  - **Controlli:** vibrazione e la mappa di tocco, tastiera e gamepad (dai valori di `input-v9.mjs`).
  - **Crediti:** titolo, «Un gioco di jaguarzcreatorz», ringraziamento. **Non ho scritto licenze, nomi o versioni che non sono nel repo.**
  - La pausa tiene i suoi interruttori rapidi e ha «Tutte le opzioni»; i due pannelli scrivono le stesse impostazioni. Esc chiude prima le Opzioni, poi la pausa; riprendere il gioco chiude sempre le Opzioni.
  - **[FATTO]** `tests/options-q4.test.mjs` (5), 4 mutanti presi (ambiente che non segue gli effetti, volumi senza limiti, Opzioni aperte alla ripresa, abbassamento nei dialoghi che ignora il volume). `npm test` **317/317**. `npm run qa:options` (`tools/verify_options_q4.cjs`): 10 controlli PASS su 360 × 800, 390 × 844 e 844 × 390 (schede e pulsanti dentro lo schermo e alti almeno 44 px, nessuno scorrimento orizzontale, volumi e testo salvati dopo il ricaricamento, inglese, ordine di Esc dalla pausa).
  - **[FATTO] Difetti trovati con le schermate e corretti:** a 360 px la scheda «Accessibilità» era troncata; in orizzontale «Chiudi» copriva il testo dei controlli. Ora intestazione, schede e «Chiudi» restano fissi e scorre solo la pagina.
  - Prove nel browser aggiornate perché «Impostazioni» non apre più la pausa: `verify_brand_browser`, `verify_runtime_v09`, `verify_campaign_browser` (inglese), `verify_locale_browser`. Quest'ultima prende anche `CHROMIUM` dall'ambiente.
- **[FATTO] Prestazioni (priorità 4):** `qa:performance` profilo completo PASS, 96 misure su 96, nessun errore ([rapporto](../evidence/q4/performance-full.json)). Costo del frame (aggiornamento + disegno sul thread principale), p95: con CPU normale massimo **7,0 ms**, mediana 1,4 ms (68 misure, 17 missioni, 4 formati); con CPU rallentata ×4 massimo **11,4 ms** (`archive`, 844 × 390), mediana 2,0 ms (28 misure). Soglia 16 ms; un frame è 16,67 ms. **Limite:** Chromium headless con rendering software, non un telefono: non certifica GPU, temperatura o FPS sostenuti su Android (resta M1). **Nota onesta:** durante il profilo, per circa 4 s, i mutation test hanno modificato e ripristinato righe di volume e interfaccia in `runtime.mjs` e `audio-engine.mjs`; l'impronta del codice a inizio e fine coincide. Non serviva un intervento sulle prestazioni: nessuna misura supera la soglia, quindi non ho cambiato codice per la priorità 4.
- **[FATTO] Altri controlli nel browser:** `qa:demo` 5, `qa:save`, `qa:stability` (anche sul pacchetto alleggerito), `verify_startup_retry` (pacchetto), `qa:health` 11, `qa:gamepad` 9, `qa:hubs`, `qa:controls` 11, `qa:runtime`, brand a 6 formati: PASS.
- **[FATTO] Difetto preesistente, non corretto:** `tools/verify_locale_browser.cjs` si aspetta l'interlocutore «RESIDENT» nella prima battuta di `exp_chalk_marks` e trova «SYSTEM». Fallisce allo stesso modo sul codice di prima di Q4 (`git stash`, stessa prova). Va riallineato con l'autore: non so quale dei due sia il testo voluto.
- **Da provare sul telefono (M1):** [PLAYTEST.md](PLAYTEST.md), sezione Q4.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## M3 — Demo fino a «La firma» e «Gioca l'altra rotta» (4 novembre 2026)

- **Mandato:** ISTRUZIONI §4, M3 (D20, D22; modello in [Fase 3 §E e §0](../design/v10.3/CHRONOS_FASE_3_SINTESI.md)); via dell'autore D36.
- **Demo (D20).** Dopo «La firma» (tappa `separation`) la tappa successiva e «Continua» aprono una sola schermata: «La storia continua.», prezzo, «Sblocca» e «Più tardi». «Più tardi» torna al menu e la schermata ricompare solo quando si riparte da lì. Nel menu c'è una voce discreta, «Sblocca la storia completa». Niente pubblicità, timer o promemoria.
- **[INFERITO] Scelta tecnica (D35, carta bianca):** la demo si attiva **solo se il guscio Android espone il ponte di acquisto** `window.ChronosBilling`. Senza ponte (browser, APK di debug, ogni build prima di M4) il gioco resta completo come prima, e un ponte che va in errore non blocca mai il giocatore. **Contratto per M4:** `ChronosBilling.isUnlocked()` → booleano, `price()` → prezzo localizzato di Play (facoltativo; in mancanza «5,99 €»), `purchase()` avvia l'acquisto; il guscio risponde chiamando `window.chronosBillingResult(true|false)`.
- **«Gioca l'altra rotta» (D22).** Nel finale c'è un pulsante nuovo. Apre il registro delle scelte, che mostra **solo le opzioni prese** (fino a 10, compresa la luce del Blackout): niente anticipazioni. Poi parte una nuova partita che tiene **armi** (le bandiere `weapon.*`), **potenziamento** (`upgrade`) e **oggetti equipaggiati** (inventario, equipaggiamento e scorte degli hub), e azzera storia, scelte, monete e termico. Bandiera nuova `replay_route`. Nessun finale nuovo.
- **[FATTO] Salvataggi compatibili:** il formato non cambia (la bandiera nuova vive dentro `narrative.flags`); il salvataggio della nuova partita passa da `saveProgress`/`loadProgress` (test); `qa:save` PASS.
- **[FATTO] Difetti trovati e corretti dal verificatore nel browser:** (1) il registro delle scelte si apriva sotto il finale (`z-index` 14 contro 50) e non si poteva toccare: ora `#replay` è a 55; (2) il finale centrava con `align-items:center`, che con un epilogo lungo tagliava la parte alta e lasciava i pulsanti irraggiungibili: ora `margin:auto`.
- **[FATTO] Test:** `npm test` da 304 a **309, tutti verdi** (+5 in `tests/demo-replay.test.mjs`); 3 mutanti (armi non copiate, ponte sempre bloccante, cancello su «La firma» invece che dopo) presi. Strumento nuovo `npm run qa:demo -- <url> <out.json>` (`tools/verify_demo_m3.cjs`): 5 controlli PASS su 390 × 844 (cancello, «Più tardi», acquisto simulato, nessun ponte, rotta nuova). Il ponte è simulato: **non è una prova di Play Billing** (M4, sul telefono).
- **[FATTO] Altri controlli nel browser:** `qa:save`, `qa:runtime`, `qa:controls` 11, `qa:stability`, `qa:hubs`, `qa:health` 11, `qa:gamepad` 9 PASS.
- **[FATTO] `app.js`:** 517 525 → **520 946 byte** (+3 421); margine **3 342** su 524 288. **Rischio:** M4, M6 e M7 devono stare in questo margine; prima di M6 serve un piano per il peso (per esempio spostare testi lunghi fuori da `app.js`).
- **Traduzioni:** 14 frasi nuove in inglese in `game/runtime-en.mjs`.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## M5 — Prezzo allineato a 5,99 € (4 novembre 2026)

- **Mandato:** ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md §4, M5 (D18); via dell'autore D36 («sviluppami il gioco senza problemi»).
- **[FATTO] Corretti** (prezzo da 4,99 a 5,99): `docs/PLAY_RELEASE_CHECKLIST.md` (2), `docs/RELEASE_GATE.md` (1), `docs/BLIND_PLAYTEST_V09.md` (4, compresa la domanda «Lo compreresti a €5,99?»), `docs/production/v9/scope-charter.json` (`price_eur` 5.99), `docs/production/v9/requirements.json` (2), `docs/production/v9/IMPLEMENTATION.md` (1).
- **[FATTO] Nota in testa, testo non riscritto** (documenti storici V0x–V7x, il mandato originale citato e una prova registrata): `MASTER_DEVELOPMENT_PLAN_V70.md`, `V07_ACCEPTANCE_MATRIX.md`, `SPRITE_VISUAL_PRODUCTION_BIBLE_V70.md`, `NARRATIVE_MISSION_PRODUCTION_MAP_V70.md`, `production/v9/sources/05-commercial-mandate.md`, `evidence/chrono_shadows/director/README.md`.
- **Lasciati così, con motivo:** `docs/SPRITE_GENERATION_MANIFEST_V70.json` (`premium-android-4.99`: manifest storico in JSON, non accetta una nota); i 3 `PLAYTIME_ESTIMATE*.json` (le occorrenze sono durate come `54.99` s, non prezzi); i piani di Q1 e RIPRESA_Q1.md (parlano del compito M5).
- **[FATTO]** Nessun file di `game/`, `tools/` o `android/` conteneva il prezzo. Test nuovo `tests/price-m5.test.mjs` (2): i documenti vivi non dicono 4,99 e quelli storici hanno la nota; un mutante (4,99 rimesso in RELEASE_GATE.md) è preso. `npm test` **304/304**.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## Q2 — Leggibilità e feel del combattimento (4 novembre 2026)

- **D36.** Via dell'autore: «Sì, ti do l'ok, confermo, sviluppami il gioco senza problemi. Sviluppami, poi build, fai un build a pk test e un build a ab a livello rilascio commerciale.» Piano: [pantheon-q2/PIANO_Q2.md](pantheon-q2/PIANO_Q2.md).
- **Ambiente:** container cloud (non il PC MX Linux), Node 22, Android SDK 35 e 36 scaricati in `/opt/android-sdk`, bundletool 1.18.3. Qui numpy c'è: `npm test` è tutto verde.
- **Cosa cambia nel gioco** (solo disegno, interfaccia e vibrazione; `game/campaign.mjs` invariato, quindi hitbox, `windup`, finestre, D27 e D29 non cambiano):
  - **Q2-U1.** Il cerchio rosso dei nemici corpo a corpo è **tratteggiato** (8/8 px) finché segue l'eroe e diventa **pieno da 5 px con 4 tacche** di 14 px sul bordo quando si blocca (55 % del `windup`). La linea di mira dei tiratori è tratteggiata finché segue e diventa **piena da 3 px** al blocco (60 %). Prima il blocco era visibile solo all'audio (evento `telegraphLock`). Il segnale è una forma, non un colore (regola 9).
  - **Q2-U2a.** Con «movimento ridotto» l'invulnerabilità mostra un **anello tratteggiato fermo** (raggio 46 px) al posto del lampeggio, che con quell'opzione era spento: prima non c'era nessun segnale.
  - **Q2-U2b.** Il pulsante SCHIVA di Nox ha un **doppio bordo** quando il Chrono Shift è carico (`s.shiftCd` a 0); sparisce per i 3,0 s di ricarica. Lulù non lo ha (D33).
  - **Q2-U3.** Vibrazione a piedi: Perfect Dodge 20 ms, Perfect Dodge che avvia lo shift 15-30-15 ms, colpo subito 35 ms. Passa dallo stesso filtro delle gare (`settings.haptics`, pagina visibile).
- **[FATTO] Test:** `npm test` da 296 a **302, tutti verdi** (+6 in `tests/q2-readability.test.mjs`, con canvas registratore sulle righe vere di `drawThreats` e dell'eroe). Verifica avversaria: 3 mutanti (tratteggio sempre acceso, anello tolto, vibrazione del colpo tolta), tutti presi (1 test rosso ciascuno).
- **[FATTO] `app.js`:** 517 094 → **517 525 byte** (+431); margine 6 763 su 524 288 (`tools/prepare_android_assets.py`).
- **[FATTO] Controlli nel browser** (Chromium preinstallato, uscite fuori dal repo): `qa:controls` 11 PASS, `qa:gamepad` 9 PASS, `qa:stability` S1–S7, S5b, S6b e M-S1 PASS, `qa:runtime` PASS, `qa:health` 11 casi PASS, `qa:save` PASS, `qa:hubs` PASS. Non lanciati qui: campagna A/B/C (25–32 min a giro), `qa:performance` (non certifica, vedi Q1), `qa:audio` (area non toccata).
- **[FATTO] Build:**
  - APK di test: `dist/Chronos_Adventure_Nox_Lulu_debug.apk`, 87 970 822 byte, sha256 `743aeea2…abe1539`, firma v2+v3 verificata da `apksigner` (chiave di debug).
  - AAB con la configurazione di rilascio di [RELEASE.md](RELEASE.md): `jaguarZcreatorZ13.app`, `versionCode 2`, `versionName 1.0.0`, `targetSdk 36`, build-tools 36.0.0, non debuggable. 87 300 812 byte, sha256 `1bd4b237…f504edc`, `bundletool validate` e APK universale derivato verificati. **Firmato con una chiave di prova generata fuori dal repo: non è caricabile su Play.** L'AAB per lo store lo costruisce l'autore con `npm run android:aab:play` e la chiave `chronos-upload` (impronta controllata dallo script).
  - `dist/` e `android/build/` non entrano nel repo (`.gitignore`).
- **Da provare sul telefono (M1):** vedi [PLAYTEST.md](PLAYTEST.md), sezione Q2.
- `COMMERCIAL_RELEASE = BLOCKED`; 0 sessioni umane.

## Q1 — Carta bianca sulla qualità e stabilità (3–4 novembre 2026)

- **Punto di ripresa:** [docs/gold/RIPRESA_Q1.md](RIPRESA_Q1.md)
- **D35.** L'autore dà carta bianca sulla qualità e fissa le priorità in ordine: stabilità, leggibilità, feel del combattimento, prestazioni, finitura, contenuto. Claude decide da solo l'ordine del backlog, i dettagli di feel, i refactoring interni senza cambi di comportamento, test e diagnostica, la scelta documentata tra due soluzioni equivalenti e i tagli di scope che rendono il prodotto più solido. Le parole dell'autore sono in [DECISIONI.md](DECISIONI.md).
  - **[INFERITO]** Hitbox e finestre di combattimento (schivata, parata) restano sotto la regola 4 di CLAUDE.md.
- **Q1, priorità 1 (stabilità): chiusura tecnica verificata in sessione (4 novembre); committata (`c3d8a84`) e pushata su origin con l'ok di Posky («Carica tutto su Flexati»).** Le modifiche (U2–U7 e la correzione dello strumento U2s) sono nel commit `c3d8a84` (base c4ec6f5). Il controllo finale ha rifatto il giro di chiusura sul working tree: `npm test` 296/294 (falliscono solo i 2 con numpy), `qa:stability` 2/2 PASS, `qa:save`, `qa:runtime`, `qa:hubs` (ora rifatto dopo U6), `qa:controls` (11), `qa:gamepad` (9), `qa:audio` (rc=0), `verify_startup_retry` e `qa:health` (11 casi) PASS, e la campagna A/B/C con `CITY_VIRTUAL_TIME=1` PASS (31 passi, vedi sotto) (`Z_Q1.log`, `Z_Q1_campaign.log`, `Z_Q1_verifica.log`, `Z_Q1_npm_test.log`). Restano due uscite con rc=1 che **non** sono regressioni di Q1: `qa:v9` (nel repo mancano gli artefatti per il checkout sparse; su un albero esportato rc=0) e `qa:performance` («insufficient live frames», non certifica il frame rate): dettagli sotto. È un **GO tecnico, non una release**: M1 sul telefono resta aperta e `COMMERCIAL_RELEASE = BLOCKED`. **Il commit e il push si fanno solo con l'ok di Posky o dell'autore.**
- **Q2, dopo Q1:** leggibilità e feel del combattimento (priorità 2 e 3), da pianificare.
- **Cosa cambia nel gioco.** Un errore in un frame non ferma più il ciclo. Se gli errori si ripetono compare il pannello «Qualcosa si è inceppato.» con il pulsante «Riprendi dall'ultimo salvataggio». Un'immagine mancante a inizio missione o all'ingresso di un hub apre lo stesso pannello invece di restare in attesa. Un errore dopo l'avvio non scatena più «Il gioco non è riuscito a partire» nel guscio Android. Il pannello di recupero non salva e non riavvia l'audio con blur o ritorno in primo piano. «Tieni premuto» si annulla se il gioco va in background. Il manifest Android non ricrea più l'Activity per finestra multipla, densità, carattere o lingua; la finestra del tasto Indietro, chiusa toccando fuori, riprende il gioco. Le due modifiche Android (manifest e finestra) sono provate solo con test statici e con `javac`, non su un telefono.
- **Come leggere i numeri.** **[FATTO]** = misurato in Chromium su questo PC (Celeron N3060, non un telefono), con il log nello scratchpad della sessione (nome fra parentesi; i log non sono nel repo). **[IPOTESI]** = non misurato. I valori su un telefono Android vero sono in M1 ([PLAYTEST.md](PLAYTEST.md)).

### Stabilità, prima → dopo (`npm run qa:stability`, `tools/verify_stability.cjs`)

«Dopo» = 25 esecuzioni (19 log, più le 6 di `Q1U2s.log`); fra parentesi min–max. «Prima» = una esecuzione sul codice di prima di quella unità.

| Prova | Prima | Dopo | Fonte (log) |
| --- | --- | --- | --- |
| S1, un errore in un frame | 0 frame nei 1 000 ms dopo | 33–52 frame | `Q1U2_qa_stability_prima.log`; `L_Q1U2_qa_stability.log` (minimo), `Q1U6_qa_stability_prima.log` (massimo) |
| S2, errori a ogni frame | nessun pannello | pannello 25–52 ms dopo il primo errore; dopo il ricarico menu con «Continua» e stesso `stepId` (below → below) | `Q1U2_qa_stability_prima.log`; `Q1U2s.log` (minimo), `Q1U2b_qa_stability.log` (massimo) |
| S3, immagine dell'hub mancante | oltre 5 000 ms (5 281,6) in «loading», 0 pulsanti | pannello in 136–425 ms | `Q1U2_qa_stability_prima.log`; `Q1U4_qa_stability_rerun3.log` (massimo), `L_Q1U2_qa_stability.log` (minimo) |
| S4, background | avanzamento da nascosto 0 (già a posto prima: è una guardia) | 0; primo frame al ritorno 0,0166–0,05 s (limite 0,05) | `Q1U2_qa_stability_prima.log`; `L_Q1U2_qa_stability.log` (minimo 0,0166), `Q1U2s.log` (massimo 0,05) |
| S5, pannello aperto + blur/focus/hidden/visible | 4 scritture di salvataggio; l'audio ripartiva dopo focus e visible | 0 scritture; audio sospeso in tutti e 5 i passi | `Q1U2b_qa_stability_FAIL_on_U2.log`; `Q1U3_qa_stability.log` |
| S5b, errore dopo l'avvio nel bootstrap Android | «Il gioco non è riuscito a partire» si apre 1 volta | 0 volte | `Q1U3_qa_stability_prima.log`, `Q1U3_qa_stability.log` |
| S6 e S6b, asset mancante a inizio missione (a piedi / guida) | oltre 5 030 ms (5 030,8 / 5 036,6) con 0 pulsanti | pannello in 102,7–370,1 ms (34 misure) | `Q1U4_qa_stability_before_S6.log`; `Q1U6_qa_stability_1.log` (minimo), `Q1U2s.log` (massimo) |
| S7, «tieni premuto» + blur, poi 1 400 ms | la scelta si confermava da sola, riempimento 100% | pannello ancora aperto, riempimento `0px` (9 esecuzioni) | `Q1U6_qa_stability_prima.log`; `Q1U6_qa_stability_1.log`, `Q1U2s.log` |

- **S4, nota.** In 4 esecuzioni (`Q1U4_qa_stability_before.log`, `Q1U4_qa_stability.log`, `Q1U6_qa_stability_prima.log`, `Q1U6_qa_stability_3.log`; tutte con il codice di U2 già in uso) S4 è fallito con `firstFrameDeltaTime` = 0,05000000000000004: la somma corrente del tempo arrotonda di 1 ulp sopra il limite 0,05, non c'è un `dt` oltre il limite. Lo strumento ora tollera 1e-9 (U2s): 6/6 esecuzioni PASS dopo (`Q1U2s.log`, `Q1U2s_numeric.log`). Un `dt` di 51 ms o più fallirebbe ancora.
- **Il controllo morde.** Con un mutante di `runtime.mjs` (`fault()` che ignora i promise rifiutati) S3, S6 e S6b falliscono con 5 054–5 158 ms senza pannello (`L_Q1U4_qa_stability_m10.log`).
- **Costo del salvataggio nel browser (M-S1).** Con `localStorage` vero, 200 scritture: media 1,0–2,5 ms, massimo 8,4–60,5 ms (varia da un'esecuzione all'altra), 1 002 caratteri per i due slot (26 esecuzioni: `Q1U2_qa_stability_prima.log` e le «dopo»). In Node (Map al posto di `localStorage`) 499 caratteri per slot e 0,38–0,44 ms a scrittura (`A_size.log`, `A_cost.log`); gli stati salvati sono diversi, i due numeri non vanno confrontati. **[IPOTESI]** Sul telefono costa di più: non misurato.
- **Altri controlli nel browser, PASS** (rc=0), rifatti nel giro di chiusura del 4 novembre sul working tree finale (`Z_Q1.log`): `qa:save`, `qa:runtime`, `qa:hubs` (rifatto dopo U6), `qa:controls` (11 controlli), `qa:gamepad` (9), `qa:audio` (rc=0), `verify_startup_retry` e `qa:health` (11 casi). Giri per unità, prima della chiusura: `qa:save`, `qa:runtime`, `qa:controls`, `qa:gamepad` dopo U6 (`Q1U6_qa_save.log`, `Q1U6_qa_runtime.log`, `Q1U6_qa_controls.log`, `Q1U6_qa_gamepad.log`); `qa:hubs` dopo U4 (`Q1U4_qa_hubs.log`); `qa:audio` dopo U2 (`Q1U2_qa_audio.log`).

### Test, bundle, prestazioni, campagna

- **Test.** `npm test` passa da 279 (277 passano, 2 falliscono) a 296 (294 passano, stessi 2): +17. Sono `tests/stability.test.mjs` 4, `tests/fault-guards.test.mjs` 9, `tests/android-bootstrap.test.mjs` 2 e 2 nuovi in `tests/mobile-ui-contract.test.mjs` (da 5 a 7). I 2 che falliscono sono quelli di `python3 -I` con numpy, come in M2 (`Q1U1_npm_test.log`, `Q1U7_npm_test.log`). `tests/android-bundle.test.mjs` e `tests/bundle-globals.test.mjs` sono cambiati di una riga, senza test nuovi.
- **`app.js`.** 515 440 → 517 094 byte (+1 654); margine 8 848 → 7 194 su 524 288 (`Q1U1_verifica.log`, `Q1U7_verifica.log`).
- **`qa:performance`.** **[FATTO]** Si ferma con «insufficient live frames» (`verify_performance_v09.cjs:35`) in un passo con `cpu4` (il log non stampa il nome del passo che fallisce), sia sul codice di prima di Q1 sia dopo, su questo PC; **il punto di arresto varia da giro a giro**: dopo la riga `finale 360x800 cpu4` nel giro di U2 (`Q1U2_qa_base_performance.log`, `Q1U2_qa_performance.log`), dopo la riga `collapse 390x844 cpu4` nel giro di chiusura (`Z_Q1/performance.out` e `Z_Q1.log` riga 200: rc=1, 82 righe di p95, 68 a `cpu1` e 14 a `cpu4`, 16 righe con p95 di 16 ms o più). Quindi **non certifica la stabilità del frame rate**. Sulle 71 righe uguali nel giro di U2: costo medio per frame 4,661 → 4,479 ms; p95 medio a `cpu1` (68 righe) 9,98 → 9,87 ms; righe con p95 di 16 ms o più 14 → 12; a `cpu4` (3 righe, una esecuzione) il p95 medio sale da 31,77 a 34,50 ms (`Q1U2_qa_performance_confronto.log`). **[IPOTESI]** La causa dello stop è la CPU rallentata ×4 su un Celeron: non verificata. Un telefono vero si misura in M1.
- **Campagna A/B/C** (`verify_campaign_browser.cjs`), **giro di chiusura del 4 novembre, con `CITY_VIRTUAL_TIME=1` e `CITY_CAMPAIGN_TIMEOUT_MS=3600000`: PASS** tutte e tre, 31 passi, 8 incarichi, 2 preparazioni, `errors` [] (`Z_Q1_campaign.log`, `Z_Q1/campaign-{a,b,c}.out`). Tempi di orologio murale: 1 932 / 1 497 / 1 555 s (`elapsedMs` 1 931 955 / 1 497 188 / 1 554 943 in `Z_Q1/campaign-{a,b,c}/report.json`); lo storico v10.2 su orologio virtuale era 208–218 s (`docs/evidence/v10.2/campaign-{a,b,c}-report.json`). **[IPOTESI]** La lentezza dipende da questo PC (Celeron N3060): non verificata. **Con il watchdog predefinito di 25 min (1 500 s, riga 5 dello strumento) la strategia A non passa su questo PC**: «Bounded campaign timeout at archive» (riga 36) dopo 1 505 s, a 20 passi su 31 (`Z_Q1_campaign_run2_deadline25min.log`, `Z_Q1/campaign-a_deadline25min.out`). È il watchdog dello strumento, non un'asserzione di gioco. **[INFERITO]** Anche C (1 555 s) lo supererebbe; B (1 497 s) lo eviterebbe di 3 s: B e C non sono state provate col watchdog predefinito. C ha 1 `uiRaces` (`#opening-surface` non visibile al passo `opening`, «page.click: Element is not visible»; A e B 0): lo strumento lo tollera solo se l'elemento non è più visibile, altrimenti rilancia l'errore (righe 27–31). In U4, senza `CITY_VIRTUAL_TIME` (a orologio murale, **non** la procedura documentata): 1 447 / 1 469 / 1 180 s su un limite di 1 500 s (margine 3,6% / 2,1% / 21%; `elapsedMs` 1 446 634 / 1 469 136 / 1 179 964 in `Q1U4_qa/campaign-{a,b,c}-report.json`, riepilogo in `Q1U4.log`), tutti e tre PASS, 31 tappe.
- **`qa:v9`.** **[FATTO]** Nel repo `npm run qa:v9` esce con rc=1 per 9 errori «missing artifact» (8 sotto `artifacts/v9-health-bar/`, 1 `artifacts/v9-controls/campaign-a/report.json`; `Z_Q1/v9.out`): il checkout è sparse con `!/artifacts/` (`.git/info/sparse-checkout`). Su un albero esportato da c4ec6f5 (artifacts, docs/production e tools) lo stesso strumento dà `ok: true`, 0 errori, rc=0 (`Z_Q1/v9_export.out`, `Z_Q1.log`); un primo albero esportato incompleto, senza `docs/evidence/v9`, dava rc=1 con 38 errori, e il log non dice cosa si è aggiunto fra i due. Non è una regressione di Q1: l'esito dipende dagli artefatti presenti. G0 PASS, G1–G5 BLOCKED in entrambi i casi.

### Scelte prese con la carta bianca (D35), da far vedere all'autore

- **(a)** Al 3° errore in 5 s (`game/stability.mjs`: `limit=3`, `windowMs=5000`) si apre il pannello «Qualcosa si è inceppato.» con «Riprendi dall'ultimo salvataggio», che ricarica la pagina. Subito, senza contare, per un promise rifiutato o un asset mancante a inizio missione. **[INFERITO]** La soglia è un numero di diagnostica, non un tempo di gioco.
- **(b)** Dopo un errore non si salva, nemmeno in background: vale l'ultimo salvataggio valido, scritto al massimo ogni 10 s di gioco attivo e a ogni pausa o tappa.
- **(c)** Il testo «Il salvataggio è al sicuro.» è incondizionato. Con la memoria piena o nel menu non è vero: **limite noto**.
- **(d)** Un blur anche breve annulla la pressione di «tieni premuto»: si deve ripremere, nessun progresso perso. La durata di 1 200 ms non cambia.
- **(e)** Il Chrono Shift, le finestre di schivata e parata e gli hitbox **non sono toccati** (regola 4 di CLAUDE.md). Il corpo di `frame` (ora `frameStep`) è invariato; la richiesta del frame successivo è ora fatta da `guardedFrame` prima di eseguirlo. `verifica.sh` segnala 11 righe di `game/` per parole come «frame» o «startup» (`Q1U8b_verifica.log`); le ho lette, nessuna cambia valori di hitbox, finestre o durate.

### Punti aperti

- **Per l'autore:**
  - la lettura di D35 su hitbox e finestre di combattimento;
  - la soglia «3 errori in 5 s» (a);
  - «niente salvataggio dopo un errore» (b);
  - **[INFERITO]** i valori già fissati da una decisione (memoria dei tocchi di 100 ms in D27, durata e ricarica del Chrono Shift in D29) cambiano solo con una nuova riga in DECISIONI.md, anche se sono «soglie di input» o «feel»;
  - **[FATTO]** `save-recovery.json` nella radice del repo è un residuo di `qa:save`: non tracciato (`?? save-recovery.json` in `Z_Q1.log`), non va committato; decide l'autore se cancellarlo (non l'ho cancellato).
  - il watchdog di 25 min di `tools/verify_campaign_browser.cjs` (riga 5) è troppo stretto su questo PC: decidere se alzare il default dello strumento o usare un'altra macchina (non l'ho toccato);
  - il trailer «Co-Authored-By» con un nome di modello nei commit precedenti (70 commit su 198 fino a c4ec6f5; 8 su 8 nell'intervallo c4ec6f5~8..c4ec6f5) contro la regola 10 di CLAUDE.md: da decidere come trattarlo;
  - i punti aperti di M2, nella sezione qui sotto.
- **M1, sul telefono (NON POSSO CONFERMARE qui):** l'elenco è in [PLAYTEST.md](PLAYTEST.md), sezione «Q1 — stabilità, QA automatica». M1 resta a fine lavoro (D33).
- **Disco.** L'interno è quasi pieno: 126 MB liberi su 27 210 MB, 100% usato (`df -m /`, 4 novembre, dopo il giro di chiusura); durante il giro di chiusura il libero è sceso da 138 a 126 MB (`Z_Q1.log`, campo `avail`, righe 62 e 217, in MiB). 32 cartelle scratch di M2 sono archiviate sulla chiavetta, fuori dal repo.
- 0 sessioni umane ([PLAYTEST.md](PLAYTEST.md)). `COMMERCIAL_RELEASE = BLOCKED`.

## M2 — Input e sensazione dei colpi (3 novembre 2026)

- **D32.** L'autore delega lo sviluppo fino al rilascio commerciale, nel rispetto delle istruzioni del repo su GitHub e dei prompt dello zip che ha mandato. Due dei tre file dello zip erano identici a quelli del repo prima di M2; in M2 è cambiata solo la riga 98 di CLAUDE.md (D33). Il terzo file contiene i prompt di avvio e di ripresa, con le stesse righe del §2 di ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md. È un'interpretazione da confermare.
- **D33.** Risposte dell'autore su Chrono Shift, test della guida, M1, M4 e M7.
- **D34.** Gli stranieri vanno nell'outro; il lampo di G1 si spegne con «movimento ridotto»; l'autore chiede un menù principale professionale; i test non si riducono mai; sulla chiavetta USB c'è ora la partizione `CHRONOS` (49,3 GiB) per lo spazio.
- **Fatto in M2.** Prove automatiche e nel browser del PC; nessuna prova sul telefono.
  - **E1:** l'evento `telegraphLock` arriva una sola volta, quando la mira di un attacco si blocca. Il tick del blocco non cambia.
  - **C1:** SCHIVA, DUO e ATTIVA partono al tocco (`pointerdown`), non al rilascio.
  - **N1:** memoria dei tocchi per SCHIVA, SPARA e PULSE; i pulsanti in ricarica non sono più disattivati. Ogni interruzione (pausa, sospensione, dialogo, scena, blocco) svuota la memoria, come prima di N1. Così un tocco su SPARA non fa più partire da solo il colpo finale contro Archon.
  - **Estensione dei controlli nel browser:** `qa:controls` passa da 9 a 11 controlli: lo scatto parte al tocco e SCHIVA resta attiva in ricarica.
  - **G1:** hit-stop solo visivo di 2 frame per l'arma, 4 per il Pulse e 6 per il colpo che abbatte. Con «movimento ridotto» il lampo bianco non si disegna; il fermo della posa resta.
  - **CS:** Chrono Shift con le scelte di D33. Il bordo ciano si vede solo a missione in corso, non sotto la schermata di sconfitta.
  - **Bot di prova corretto** (`tests/helpers/autoplay.mjs`). Con CS il test «every foot mission is winnable…» falliva nella missione blackout. Motivo: contro Rook il bot sparava fermo da 326-383 px, ma la gittata della C-9 è 310. Ora avanza se il bersaglio è oltre la gittata dell'arma attiva. Il test e la sua soglia non sono cambiati. Vittorie su 3 semi, per ognuna delle 2 serie di flag:

    | Policy del bot | Senza CS | Con CS |
    | --- | --- | --- |
    | di prima | blackout 2/3 | blackout 1/3 |
    | corretta | blackout 3/3 | blackout 3/3 |

    Le altre 11 missioni vincono 3/3 in tutte e quattro le combinazioni: nessuna missione peggiora.
  - **`qa:gamepad` deterministico.** Causa: il gioco legge il gamepad una volta per frame, mentre lo strumento aspettava tempi fissi di 60-80 ms. In pausa tra due frame passano fino a 100 ms, quindi un tasto premuto e rilasciato poteva non essere letto. Prima della correzione: 24 giri PASS, 31 FAIL su «Start resumes» e 5 FAIL nelle finestre da 60 ms. Correzione: lo strumento aspetta 2 frame del gioco dopo ogni cambio del gamepad (`settle()` in `tools/verify_gamepad_browser.cjs`). Le attese fisse restano e nessuna asserzione è cambiata (sempre 9 controlli). Esiti: 15/15 giri PASS (10 `qa:gamepad` con Chromium, 2 con Chrome, 3 `qa:controls`), più 7/7 in una verifica indipendente. **[IPOTESI]** Il gioco non va corretto, perché un tocco vero dura più di un frame; si prova in M1.
- **Test.** `npm test` passa da 249 a 279 test. Su questo PC ne passano 277. I 2 che falliscono lanciano Python con `python3 -I` (`tests/tooling-syntax.test.mjs`: prop delle gare e chiave cromatica): numpy è installato solo nella cartella dell'utente, che `-I` esclude. Prima di M2 qui passavano 246 su 249; il terzo fallimento era il test della guida, per `deliveries/` in CLAUDE.md:98, corretto con D33.
- **Bundle Android.** `app.js` passa da 513 065 a 515 440 byte, sul limite di 524 288.
- **M1 rimandata a fine lavoro (D33).** Restano da provare sul telefono: gamepad, joystick, C1, N1, G1, CS, tocco breve su Start in pausa e rilascio di B dopo lo scatto. L'elenco per le persone è in [PLAYTEST.md](PLAYTEST.md).
- **Punti aperti per l'autore:**
  - la lettura di «MSI» (D33);
  - la portata di «M7 approvo» (D33);
  - durante lo shift durano di più la guardia del Mirror e lo stordimento del Duo;
  - il bordo ciano resta fermo sullo schermo in pausa e nei dialoghi;
  - i diritti di Kairn e Morrow ([STRANIERI.md](STRANIERI.md), D34);
  - **[IPOTESI]** la partizione `CHRONOS` si rimonta da sola solo se lo fa la sessione desktop (non c'è una voce in fstab).
- **Dopo M2, scelta operativa [INFERITO]:** outro con Kairn e Morrow e menù principale (D34), da pianificare. Le note «non ancora implementati» di D27 e D29 sono superate da questa sezione; le righe storiche non si riscrivono.
- 0 sessioni umane ([PLAYTEST.md](PLAYTEST.md)). `COMMERCIAL_RELEASE = BLOCKED`.

## Prompt per Claude su MX Linux (2 novembre 2026, sera)

- **D31.** L'autore conferma come proposti i due Pilastri 2, compreso il Chrono Shift.
- **[`CLAUDE.md`](../../CLAUDE.md)** è nella radice del repo, e Claude Code lo legge da solo all'avvio. Contiene:
  - le regole fisse;
  - la mappa «cosa ti serve → dove»;
  - quale documento vince e quali sono solo storici;
  - i comandi.
- **Il §2 di [ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md](ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md)** contiene il prompt di avvio e il prompt di ripresa. Non copiano le regole: dicono a Claude dove sono nel repo.
- **`tests/claude-guide.test.mjs`** controlla che i 52 percorsi citati esistano e che non compaiano identificativi di modello. È stato provato anche su un percorso sbagliato e su un nome di modello inseriti apposta: in entrambi i casi il test fallisce.
- `npm test` 249/249 PASS. Il codice del gioco non è cambiato. `COMMERCIAL_RELEASE = BLOCKED`.

## Gamepad, boss v2 e istruzioni per il PC (2 novembre 2026)

- **D29.** Il Pilastro 2 del combattimento è approvato: G1, E1 e CS non sono ancora implementati.
  - **Gamepad N2 implementato:** mappatura standard W3C, solo a piedi e negli hub.
  - **Prove:** 4 test unitari, più `npm run qa:gamepad` con 9 controlli PASS su un gamepad simulato in Chromium.
  - **Manca** la prova su un telefono con un controller vero.
  - **Nessuna regressione:** `qa:controls` 9/9 PASS e laboratorio di combattimento PASS.
- **D30.** Il Pilastro 2 della grafica è approvato.
  - I 10 controlli sono in `tools/art_derived_checks.mjs`, con 8 test.
  - Il pacchetto `requests/gpt-boss-v2-20261102/` contiene 20 prompt per 36 immagini. **Nessuna immagine è ancora generata.**
- **Istruzioni per una nuova chat sul PC MX Linux:** [ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md](ISTRUZIONI_NUOVA_CHAT_MX_LINUX.md). Contengono preparazione del PC, messaggio da incollare e mandato M1–M7.
- `npm test` 245/245 PASS. `COMMERCIAL_RELEASE = BLOCKED`.

## Design V10.3 — benchmark e pilastri (2 novembre 2026)

Documenti in [docs/design/v10.3](../design/v10.3/README.md): benchmark in 3 fasi (rivisto); combattimento Pilastri 1 (approvato, D27) e 2 (approvato, D29); grafica Pilastri 1 (approvato, D28) e 2 (approvato, D30), con misure riproducibili (`tools/art_style_audit.py`). Decisioni dell'autore D18–D30 in [DECISIONI.md](DECISIONI.md); quelle di oggi pomeriggio (D29, D30) e il gamepad sono nella sezione sopra. C1 e N1 approvati ma non implementati: sono nel mandato per il terminale (M2). COMMERCIAL_RELEASE BLOCKED.

## Produzione Codex successiva a d019eb4

Primo lotto in `assets/production/v10.2/handoff/astra_p1/`: G1–G3 e A1–A4 candidati, con limiti in README e manifesto. G4–G10 aperti. Nessuna nuova prova gameplay, Android o ascolto umano. COMMERCIAL_RELEASE BLOCKED.

Aggiornamento armi impugnate: due adattamenti reali VX-9/R-12 integrati e provati nel browser; dettagli e lacune in [EQUIPPED_WEAPONS.md](EQUIPPED_WEAPONS.md). E06/E10/AS10 PARTIAL, COMMERCIAL_RELEASE BLOCKED.

# CHRONOS Gold — punto di ripresa

## Sessione Opus — integrazione pacchetto Codex (corrente)

**MANDATO PARZIALE — COMMERCIAL_RELEASE = BLOCKED.** Branch `work/chronos-adventure-commercial`, partito da `3f746d5` (= commit di riferimento). Pacchetto: 205/205 file presenti, 0 hash diversi da `PACKAGE_MANIFEST.json`. Baseline prima delle modifiche: `npm test` 176/176 PASS; percorso A italiano con clock virtuale: 31 tappe, 8 incarichi, 2 preparazioni, finale raggiunto (prova browser, non durata umana).

- **Blocco 1 — ricarica VX-9/R-12 (INTEGRATO, verificato in browser).** Dettagli e lacune in [EQUIPPED_WEAPONS.md](EQUIPPED_WEAPONS.md#ricarica-vx-9--r-12--integrazione-dei-master-codex). ART03 OPEN → PARTIAL (solo ricarica di due armi). Suite 180/180.
- **Blocco 2 — Kairn e Morrow fedeli alla foto + audio (INTEGRATO, verificato in browser).** Comparsa prima del dialogo, comportamenti distinti con colpo al frame di rilascio, tema e SFX collegati agli eventi reali, post-titoli con i nuovi sheet. [STRANIERI.md](STRANIERI.md). CRE04, E05, E09, AS09 OPEN → PARTIAL. Suite 185/185. **Rischio:** somiglianza dei due design con personaggi noti → revisione diritti prima della release.
- **Blocco 3 — banda di gioco su telefono orizzontale (IMPLEMENTATO, verificato in browser).** Banda 88–140 px → 218–270 px, eroina 53–61 → 69 px, zero sovrapposizioni; barra armi fra i pollici; verticale invariato. Corretti anche RISONANZA fuori dal pulsante e due fixture/aspettative obsolete degli strumenti (`verify_release_flow.cjs` testava Rook invece del finale e si aspettava 20 tappe). [LAYOUT_ORIZZONTALE.md](LAYOUT_ORIZZONTALE.md). B01, B04, E03 OPEN → PARTIAL.
- **Blocco 4 — gare Ash Docks di Veyra negli hub (IMPLEMENTATO/INTEGRATO, verificato in browser).** Vortex parcheggiata negli hub di Vanta seguendo Nox, tre gare in serie con Veyra, asset della guida di campagna, record e premi salvati senza farming; facoltative (D05), quindi fuori dalla durata obbligatoria. [GARE_VEYRA.md](GARE_VEYRA.md). E07, NAR05, CRE05 OPEN → PARTIAL.

- **Blocco 5 — The Anchor nella Breccia (IMPLEMENTATO/INTEGRATO, forme prototipo dichiarate).** Incontro 2/17: nucleo ormeggiato da tre cime, Risonanza che taglia e interrompe, corsie telegrafate, fase 2, checkpoint, primo componente H-17. Corretti anche il genere grammaticale di Nox (D07) secondo l'autore. [ANCHOR.md](ANCHOR.md). E08 OPEN → PARTIAL. Arte/audio propri richiesti ad Astra (G11, G12, A5).
- **Blocco 6 — Integrazione consegna Astra 20261027 (INTEGRATO PARZIALE, D09).** The Anchor con sprite, bitte e audio A5 (cime e corsie restano procedurali); impatti C-9/VX-9/R-12; auto di Veyra, container e checkpoint stretti nelle gare con la musica di Veyra; ritratti di Kairn, Morrow e Veyra. Respinti con correzione: cavo e spazzata di The Anchor, strade, cancelli, sheet H-17/ARC-7, icone H-17, sheet di Veyra, `race_start`. «Due colpi» in attesa dell'autore. Famiglie tutte APERTE. [ASTRA_INTEGRAZIONE_20261027.md](ASTRA_INTEGRAZIONE_20261027.md).
- **Blocco 7 — Correzioni Astra f727255 (INTEGRATO PARZIALE, D10).** Integrati: G11 riesportato, segmento del cavo e corsia della spazzata di The Anchor, piloni e nastro dei checkpoint larghi, bip 3-2-1 e via. Conservate le icone H-17. Respinte le strade (ritmo del tratteggio spezzato alla giunzione). Terminale del cavo prima respinto, poi sistemato dal team su richiesta dell autore. **APERTO G6/G7**: decisione sulle basi degli sheet H-17/ARC-7. La consegna non è completa.
- **Giro 3 Astra (richiesta revisione 4, `ddd5d29`): CONSEGNA INCOMPLETA, nulla da integrare.** Il ramo `delivery/astra-giro3-20261027` (`7c90967`) contiene solo `STATO_INCOMPLETO.md`: ZIP di richiesta verificati da Astra, nessun asset consegnato. G6/G7: il generatore altera il personaggio (1.865/2.000 pixel della testa diversi dal riferimento) e gli effetti sconfinano. G4: solo un master giorno intermedio senza segnaletica, non esportato né misurato, manca la notte. Restano APERTI G4 e G6/G7; in gioco H-17 e ARC-7 si impugnano con lo sheet base C-9 (`nox_gun`, `lulu_gun`) senza animazione di ricarica, e le gare usano la strada `driving_road`.
- **Blocco 8 — Pulizia degli sheet 4×4 (D13).** Corretti 14 sheet: niente più scarpe tagliate nella vista di schiena e nei nemici, niente scarpe o effetti che galleggiano sopra la testa della posa sotto, niente schegge di lampi nelle celle vicine. Nessun pixel ridisegnato o riscalato. Prove: test `sheet-layout` (posizione a schermo di ogni riga), verifica browser con il vero `drawLegacySprite` (PASS, 14 sheet, nessun pixel sul bordo delle celle), campagna A PASS (31 tappe), armi equipaggiate PASS, The Anchor PASS, 204/204 test. Revisione visiva umana e prova su dispositivo Android restano da fare.
- **Sfide della Vortex (D17):** Contro il tempo (medaglie), Eliminazione, Rivincita sui percorsi di Ash Docks completati. Test 214/214; verifica nel browser `tools/verify_race_modes_browser.cjs` PASS a 390×844 e 844×390 (menu, tre sfide giocate, medaglia salvata, eliminazioni, percorso al contrario, ricarica del salvataggio). Tempi delle medaglie dall'auto pilota: da tarare con giocatori veri.
- **Comandi (D16): joystick flottante su tutta la mappa** (guida e a piedi), animazioni di guida (camera in curva, rollio, segni gomme, scintille, anelli, conto alla rovescia animato), velocità in km/h, vibrazione disattivabile (permesso Android VIBRATE). Verifica nel browser: il trascinamento sulla mappa muove Nox e sterza la Vortex in entrambi gli orientamenti. Sensazione al tatto da provare su dispositivo.
- **Gare (D15): nitro e ostacoli nuovi.** Barra nitro con pulsante NITRO (anche Spazio/Maiusc), rampe nitro, partenza perfetta, scia, sfiorati. Nuovi ostacoli: sbarramento con varco, carico della gru, chiazze d'olio e di sabbia, distribuiti nelle sette gare. Test 211/211; verifica gare nel browser PASS a 390×844 e 844×390 (partenza perfetta, nitro, pulsante). Suoni ancora sintetizzati e grafica dei nuovi ostacoli disegnata dal gioco: asset dedicati da chiedere a Terra. Bilanciamento verificato solo con l'auto pilota di prova, non da giocatori.
- **Terra giro 3, grafica della gara: RICHIESTO, NON CONSEGNATO.** Pacchetto `requests/terra-giro3-gara-20261028/`: 34 tele con maschera sulle misure delle hitbox (20 per Ash Docks, 14 per Solkara e Aurelia Span), tavola della scala, riferimenti, 11 suoni OGG se Terra produce audio (altrimenti Astra). Ritorno controllato da `tools/compose_terra_race_props.py`. Finché un file manca, il gioco tiene il disegno attuale.
- **Terra giro 1 (D14): INTEGRATO PARZIALE.** G5b integrato: quattro modelli di container in gara. G4 integrato con composizione del team dai tentativi di Terra: tre strade di Ash Docks di giorno e di notte, con sequenze fisse per gara. Il controllo strade dà PASS e la verifica gare PASS in entrambi gli orientamenti. Differenze dichiarate: marciapiedi stretti in orizzontale; oggetti tagliati sotto il giunto invece di chiusi da un paletto. **APERTO G6/G7 (armi)**: le viste isolate ci sono, manca la composizione con maschera delle 64 celle. Dettaglio: [TERRA_INTEGRAZIONE_20261027.md](TERRA_INTEGRAZIONE_20261027.md).

**Richieste a Codex:** [RICHIESTE_CODEX.md](RICHIESTE_CODEX.md) — P1 Veyra (ritratto, sprite, veicolo) e asset/audio delle gare Ash Docks; P2 H-17/ARC-7 impugnate + ricarica, impatti delle quattro armi, icone e SFX; P3 Anchor/Vega/Volkov completi; ritratti di Kairn e Morrow.

**Gate (stato onesto, nessun PASS commerciale):** 74 criteri 55 OPEN / 19 PARTIAL; AS01–AS12 3 PARTIAL / 9 OPEN; E00–E12 7 PARTIAL / 6 OPEN. Direzione artistica, coerenza narrativa, asset/audio, gameplay/progressione, salvataggi, accessibilità/localizzazione, prestazioni/offline, playtest umani/durata, Android/rilascio: tutti aperti o parziali. Nessuna persona, ascolto, licenza o dispositivo coinvolti in questa sessione.

**Punto di ripresa preciso.**
1. Ambiente: `npm ci`; server `python3 -m http.server 8090 --bind 127.0.0.1` dalla radice; per gli strumenti browser in questo container `PLAYWRIGHT_MODULE=/opt/node-tools/node_modules/playwright CHROMIUM=/opt/pw-browsers/chromium`.
2. Verifiche della sessione: `npm test`; `tools/verify_reload_browser.cjs`, `verify_strangers_browser.cjs`, `verify_play_band.cjs`, `verify_hub_race_browser.cjs`, `verify_weapon_layout_browser.cjs`, `CITY_VIRTUAL_TIME=1 verify_release_flow.cjs … finale W H`, `CITY_VIRTUAL_TIME=1 verify_campaign_browser.cjs … a`.
3. Prossimo blocco eseguibile senza nuovi asset: regole e arena di **The Anchor** (primo componente H-17) con la struttura di Rook, consegnando a Codex la specifica di frame/tempi; poi sblocco H-17 nel save con `grantWeaponRewardV9`. In parallelo: B/C della campagna dopo i blocchi 2 e 4, e misura della scala orizzontale degli interludi di guida (strada stretta, condivisa con le gare).
4. Dipendenze esterne: asset Codex elencati sopra; persone nuove per durata (100–140 min diagnostici) e comprensione; telefono Android fisico; revisione diritti/somiglianza di Kairn e Morrow; SDK/API 36, bundletool e chiave `chronos-upload` esistente per l'AAB (mai una chiave nuova).

Branch `work/chronos-adventure-commercial`. Le modifiche vengono conservate nel checkpoint Git di questa iterazione; i riferimenti di prova indicano file e sorgenti, non un APK commerciale. Il [rapporto operativo V10.2](../production/v10.2/EXECUTION_STATUS.md) conserva il quadro precedente e le correzioni di questa iterazione.

## Stato corrente — kit di Tessa e recupero v7

**MANDATO PARZIALE — COMMERCIAL_RELEASE = BLOCKED.** Il [rapporto del kit](FIELD_KIT.md) distingue implementazione, produzione, integrazione e verifica.

- **Direzione artistica:** Tessa originale, due gesti runtime da uno sheet di quattro pose; icone V8 conservate; barra armi fuori dalla fascia cure/comandi. Sei viewport per entrambi i protagonisti; correzione del testo Risonanza a 360 px. Animazioni dell'arma impugnata ancora condivise: famiglie VX-9/R-12 PARTIAL.
- **Coerenza narrativa:** relè → Rook con due Raider → scelta → Tessa → fuga/Moon. Consegna comune e banco portatile coerenti con entrambe le scelte. Recupero degli avanzati con ID stabili, senza doppio premio; se Rook era vinto si recupera solo Tessa. Gesso interrotto conserva rotta e bookmark. Nessuna riscrittura del canone del finale.
- **Asset/audio prodotti in questo blocco:** uno sprite sheet originale, un brano originale di 19,2 s e sei cue originali; master, partitura, metriche e generatore versionati. Riuso dell'atlante armi V8. Zero COMMERCIAL_READY.
- **Prove:** 174/174 Node PASS; kit su entrambe le scelte, cambio/tiro/ricarica touch, rollback e selezione persistente; browser v7 boss, hub e Rook/Gesso combinati. Vittoria salvata prima del ritardo cosmetico e ricaricata in quel momento. A/B/C: 31 tappe, otto incarichi, due preparazioni, zero errori; sorgenti e controlli delle sole modifiche successive separati nei rapporti.
- **Inventario:** 150 media/sorgenti tecnicamente decodificati, inclusi 14 MIDI; 99 media nel pacchetto, 103 risorse totali. JS classico 403018 byte. Registro selettivo: 30 record, 24 NEW / 2 ADAPT / 4 REUSE; 0 REPLACE. Due fonti remote REJECT rimangono separate. Sono perimetri diversi, non 442 famiglie chiuse.
- **Gate:** E06/E10 e AS10 ancora PARTIAL; 74 ID originali invariati, 14 PARTIAL / 60 OPEN. IT/EN non è la priorità corrente. Nessun playtest umano, ascolto, licenza o dispositivo inventato. Nessun AAB commerciale.

Prossimo lavoro eseguibile: asset impugnati e animazioni per le tre armi ora in campagna; H-17/ARC-7 con i rispettivi incontri e sblocchi, gare Veyra nella progressione, scene V10.2 residue e roster/regioni completi. Durata umana verso 120 minuti ancora non misurata. Android, persone nuove, fonti V8.5 valide e strumenti/chiave Play restano dipendenze precise, non una dichiarazione di completamento.

## Checkpoint Rook 7813ec8 — storico

**MANDATO PARZIALE — COMMERCIAL_RELEASE = BLOCKED.** Le sezioni successive conservano lo storico, non sostituiscono questi dati correnti. Non sono stati dichiarati gate commerciali PASS.

- Rook è nella progressione di Blackout prima della scelta: rosata anticipata/bloccata, mine disarmabili, riposizionamento, coperture reali, Breaker e oscuramento parziale nella seconda fase. Checkpoint e flag di vittoria reali, senza attribuzioni retroattive.
- **Direzione artistica:** nuovo sprite sheet originale a otto pose, arena, segnali elettrici e camera del duello. Primo inquadramento e oscuramento corretti dopo screenshot. Qualità completa delle animazioni, revisione umana e mobile fisico restano aperti.
- **Coerenza narrativa:** scelta successiva preservata, nessuna conoscenza nuova inventata, ripresa boss senza ripetere il dialogo pre-missione. Recupero di Rook nei v7 avanzati, Quickdraw e Tessa sono ancora OPEN: E06 è PARTIAL.
- **Asset/audio:** un nuovo sheet, una composizione originale di 24 s e cinque SFX specifici di Rook; conservati due SFX locali originali per gesso/cura e le due intro JaguarzCreatorz già integrate. Master, generatori, partitura, Ogg, hash e associazioni runtime sono versionati. Nessun ascolto umano o diritto commerciale certificato.
- **Prove:** 162/162 Node PASS; browser Rook con tasti/UI, reload, asset/audio avviati e scelta persistente PASS, con zero retry nell’ultimo ricontrollo (due in una prova precedente). Confezionamento Android: 394491 byte JS, 95 risorse totali; non è una prova WebView o Android fisica. [Dettagli e ripresa](ROOK.md).
- **Inventario:** 142 media/sorgenti censiti tecnicamente, inclusi 14 MIDI; 91 media confezionati; 0 COMMERCIAL_READY. Registro selettivo di questa lavorazione: 21 record, 16 NEW / 2 ADAPT / 3 REUSE; nessun REPLACE. Le due fonti V8.5 remote non decodificabili restano REJECT separati. Questi conteggi hanno perimetri diversi e non chiudono 442 famiglie.
- **IT/EN:** conservata l'implementazione e le prove precedenti. Su istruzione esplicita dell'autore non è la priorità corrente; nessuna revisione umana o chiusura completa viene attribuita. A/B inglesi sono rapporti storici, non prove della nuova integrazione Rook. Nessun rapporto C precedente disponibile viene ricreato o inventato.

Regressione italiana A: 31 tappe da Nuova storia al postcredit, otto incarichi e due preparazioni, zero errori. Le sole correzioni successive delle mine sono ricontrollate nel test Rook e nella suite. Hash e perimetro in `ROOK.md`.

Prossimo blocco eseguibile: Quickdraw/Tessa con asset e insegnamento del cambio arma; recupero Rook tramite ID stabili nei v7 avanzati, combinato con il catchup Gesso; prima slice su entrambe le scelte. Restano gli altri incontri, armi/gare reali, nove regioni, due scene V10.2, asset/audio e misure umane verso 120 minuti. Non sono dipendenze esterne: sono lavoro ancora da implementare. Dispositivi, playtester, esportazioni V8.5 valide e chiave/SDK Play sono dipendenze esterne separate.

## Storico delle iterazioni precedenti

## Verifiche chiuse a livello tecnico

- `npm test`: 146/146 PASS dopo la migrazione v7 e la correzione della battuta dell'Archivio.
- Due continuazioni browser di salvataggi v7 storici, Archivio al checkpoint del boss e hub Toxic con indice di ritorno precedente all'inserimento: entrambe tornano al punto giusto dopo `Segni di Gesso`, senza doppio premio. [Rapporto](../evidence/v10.2/chalk-migration-report.json) e [verificatore](../../tools/verify_chalk_migration_browser.cjs).
- La correzione narrativa nell'Archivio è verificata da un'asserzione sul dialogo. Richiede ancora il riesame integrale della storia nel browser, IT/EN e con lettori nuovi.

## Direzione artistica

Menu mobile e icona hanno screenshot di confronto browser; la missione del gesso usa segno e civile specifici. Sono integrazioni parziali. Mancano confronto completo di silhouette, materiali, luci, HUD, animazioni, UI IT/EN, accessibilità e dispositivi. Le tavole V8.5 non sono state accettate come media finali: la nota `docs/production/v9/sources/01-art-v85.md` descrive una pubblicazione storica, ma `assets/chrono_shadows/latest_v85/` e `docs/WORLD_CHARACTER_EXPANSION_BIBLE_V85.md` non esistono in questo checkout, che espone solo `origin/work/chronos-adventure-commercial`. Servono i binari e la bibbia originali per il confronto V8.5.

## Coerenza narrativa

La tappa del gesso avviene durante la separazione anche nei salvataggi avanzati, tramite recupero giocabile. La traccia fisica consente a Nox di dedurre che qualcuno ha riaperto il passaggio, senza conoscere l'autore. Restano da verificare tutte le conoscenze/scelte nelle missioni, le tre nuove scene V10.2, il finale e il reload lungo i percorsi A/B/C.

## Asset, audio e contenuti

La matrice V10.2 contiene requisiti, non 442 file. Il [registro asset](ASSET_REGISTER.json) censisce soltanto due SVG di missione, l'icona e il cue WebAudio interessati da questa iterazione; tutti restano prototipi per il gate commerciale. Il [registro audio](AUDIO_REGISTER.json) riconcilia i 129 indici con la fonte originale e segnala esplicitamente mappatura runtime, produzione, diritti, ascolto, loop e mix da completare. Le sette gare e cinque armi V9 sono ancora nei laboratori/preview, non nella progressione. Le tre gare aggiunte non esistono in runtime. Durata umana verso 120 minuti: non misurata.

## Difetti e prossimo blocco eseguibile

1. A/B/C dopo migrazione e correzione narrativa: 31 tappe ciascuno, zero errori, stessa sorgente `3afdbec0…`. I rapporti precedono soltanto l’integrazione intro e il posizionamento dell’avviso HUD, verificati separatamente. Proseguire con la matrice dei salvataggi intermedi e Android.
2. Integrare il primo contenuto V9 già giocabile nella progressione senza duplicare le cinque sequenze di guida narrative. Per ciascuna gara creare gli asset specifici mancanti prima di chiuderla.
3. Produrre e verificare IT/EN e asset/audio pertinenti per `Segni di Gesso`, poi le altre due scene V10.2. Misurare il ritmo con persone nuove solo su una build adatta al playtest.

Blocco esterno preciso per Android Play: in questo ambiente non sono stati trovati Android SDK/API 36, build-tools 36.0.0, bundletool né la chiave privata di upload. Il certificato pubblico indicato dall'autore non sostituisce la chiave. Servono questi componenti e tutti i gate di gioco prima di un AAB commerciale vcode2; nessun bundle di questa iterazione è dichiarato pronto.

## Ultimo blocco: intro e HUD

Due intro JaguarzCreatorz integrate (REUSE), con riproduzione mobile/desktop, skip, audio su gesto, fallback e riduzione movimento verificati nel browser. [Dettagli](INTRO.md). L’avviso del checkpoint boss ora lascia libere barra e pulsante Bagaglio: le due disuguaglianze geometriche sono controllate nel verificatore di migrazione, oltre allo screenshot `archive-restored-after.png`. Suite corrente 146/146.

Audit file runtime di questa iterazione: 5 trovati, 2 REUSE, 1 ADAPT, 2 NEW, 0 REPLACE, 0 REJECT, 0 COMMERCIAL_READY. Questi numeri non censiscono tutti i media preesistenti e non chiudono le 442 famiglie: il loro audit completo resta aperto. COMMERCIAL_RELEASE = BLOCKED.

## Iterazione successiva — Cura e recupero V8.5

Direzione artistica: aggiunta icona originale Medseal e comando Cura fuori dalla griglia, preservando posizione di Spara/Schiva. Il calcolo camera include il comando. Quantità, bordo tratteggiato e descrizione accessibile indicano lo stato senza affidarsi al colore. Il cue sintetico heal e l’anello appaiono solo dopo una cura salvata. IT/EN completo, ascolto umano, touch su dispositivi e gate commerciale restano aperti.

Coerenza narrativa: non cambiano eventi, protagoniste, risorse disponibili o premi; i kit acquistati restano consumati dopo reload/retry. Il comando non funziona in pausa, durante dialoghi, da sconfitti o a salute piena. Un errore del salvataggio ripristina salute e quantità. Prove pure di rollback e browser di cura in movimento: `medicine-report.json` e `medicine.png`. Suite aggiornata: 147/147 PASS.

Recuperata da GitHub `main` la bibbia `docs/WORLD_CHARACTER_EXPANSION_BIBLE_V85.md` (blob bea7e12cdd7c4a34c9cf7db1b71caf5c193a072c). Il blocco precedente sulla fonte testuale è risolto. La directory remota contiene ZIP, preview e README, senza 18 tavole singole. ZIP e preview sono dati non decodificabili: REJECT, prove in `v85-source-audit.json`. Occorrono esportazioni valide per il confronto artistico richiesto.

Audit cumulativo limitato di questa lavorazione: 6 file runtime (2 REUSE, 1 ADAPT, 3 NEW) e 2 fonti remote REJECT; 0 REPLACE, 0 COMMERCIAL_READY. Non sono 442 famiglie completate. I 74 criteri restano 14 PARTIAL / 60 OPEN. COMMERCIAL_RELEASE = BLOCKED.

Ripresa concreta: integrare le cinque armi e le gare nella progressione secondo i loro sblocchi canonici; attualmente sono ancora laboratori. Rook, 17 incontri, nove regioni, le altre due missioni V10.2, asset/audio, localizzazione e durata umana richiedono implementazione/prove, oltre alle dipendenze esterne già elencate. Questo checkpoint conserva tutte le modifiche finora citate ma non conclude il mandato.

## Pubblicazione e censimento successivi

I checkpoint applicativi e l'indice Gold sono pubblicati su `Flexati/Adventure-city`, branch `work/chronos-adventure-commercial`. `docs/gold/README.md` è il punto di ingresso per stato, requisiti, asset, audio, intro, playtest e release.

Il nuovo `tools/audit_media.py` censisce tutti i file media trovati in `game/`: 131 controlli tecnici PASS, inclusi 14 header MIDI; 80 media nel pacchetto Android, zero COMMERCIAL_READY. `FILE_INVENTORY.json` conserva hash e risultati. Il registro asset collega ora tutti i 442 requisiti ai contenuti, con candidati per 9 famiglie; nessuna approvazione automatica di arte, licenze o uso runtime. Il censimento risolve la mancanza di inventario tecnico completo, non l'integrazione di campagna ancora necessaria.

## Asset generato e callback animato

Direzione artistica: il civile SVG statico è stato ritirato in `assets/preproduction/v10.2/`; il callback usa l'atlante `civilian.png` già presente, con animazioni idle/walk, soste alle estremità e percorso continuo. Le due rotte percorrono punti validi del corridoio; riduzione movimento mantiene una posa ferma. È stata realmente generata una borraccia con segni di gesso: master originale in `assets/production/v10.2/`, export mobile RGBA 48×64 in `game/art/v09/chalk_flask.png`, incluso nel pacchetto Android. Nox e Lulù non sono stati ridisegnati.

Coerenza narrativa: la descrizione cita la borraccia visibile. Nox continua a dedurre solo che qualcuno ha riaperto il passaggio; il civile e l'oggetto non attribuiscono conoscenze, danni, premi o poteri nuovi. La regia durante il combattimento e il set completo di gesti restano da riesaminare.

Prove: 148/148 test Node PASS; verifica browser di entrambe le rotte con input reali e salvataggi di prova, atlante e nuovo PNG caricati senza errori. Rapporti e screenshot `chalk-scene-*` nella cartella evidenze V10.2. Il rapporto include hash di asset e sorgenti; la verifica non è una prova umana o Android fisica. La famiglia asset resta PARTIAL, nessun nuovo COMMERCIAL_READY.

## Sprite sheet e musica — iterazione successiva

Direzione artistica: generato uno sprite sheet reale della borraccia, quattro stati distinti, esportato 192×64 e collegato all'avanzamento effettivo dell'attivazione dei due accessi. Il civile usa il frame chiuso; nessuna modifica all'identità dei protagonisti. Master, hash e frame sono nel registro asset. Nel browser entrambe le varianti caricano il nuovo sheet.

Coerenza narrativa: il riempimento è una visualizzazione locale dell'accesso all'acqua, senza introdurre consumabili obbligatori, premi o nuovi poteri. Scelte e cronologia restano conservate. Rimangono aperti regia del civile durante il combattimento, IT/EN e revisione dell'intera campagna.

Audio: Creative Claw ha rifiutato la richiesta prima di generare per zero crediti (circa 20 richiesti, nessun addebito). In alternativa è stata composta e sintetizzata localmente una traccia originale di 40 secondi, con partitura JSON, script riproducibile, master FLAC ed export Ogg. Il browser prova caricamento, playback su gesto, pausa/ripresa e limite di due stream; zero clipping rilevato nella decodifica. Nessun ascolto umano o approvazione commerciale è dichiarato.

Suite aggiornata: 149/149 PASS. Il riferimento «gate 10» dell'autore non ha un ID G10 nel corpus: E10 riguarda Save V9/migrazione/IT-EN, AS10 le prove runtime. E10 resta PARTIAL perché IT/EN e migrazione completa sono aperti; AS10 è parziale per i soli casi effettivamente provati. Nessun gate complessivo è chiuso da questi asset. COMMERCIAL_RELEASE = BLOCKED.
