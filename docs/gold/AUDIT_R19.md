# Audit R19 — riconciliazione prima del giro di rilascio (11 novembre 2026)

Mandato: D58, §2 (preflight) e §3 (audit). Tutto quello che segue è stato misurato su `632f8b3`
(`work/chronos-adventure-commercial`), albero pulito, Node `v22.23.4`, dopo `npm ci`.
Punto di ritorno: commit `632f8b3`, nome `rc-r18-v25` (tag locale; non pubblicato: decide l'autore).

## 1. Base di partenza

| Voce | Valore | Fonte |
|---|---|---|
| [MISURATO] `npm test`, tre volte di fila | 372 / 372 / 372, zero falliti, zero saltati | riepilogo di `node --test` |
| [MISURATO] File di test | 66 file; 363 chiamate `test(` scritte a inizio riga; le altre 9 sono dichiarate in altro modo (non contate una per una) | `ls tests/*.test.mjs`, `grep` |
| [MISURATO] `app.js` | 457 825 byte; guardia 458 752 → **927 byte**; limite 524 288 | `python3 tools/prepare_android_assets.py` |
| [FATTO] Risorse locali nel pacchetto | 293 | stesso comando |
| [FATTO] Ramo di consegna di Argon | avanzato da `f39dd3d` a `f21e19d` (6 commit, 13 file) | `git fetch`, `git diff --stat` |

Nessun test instabile nelle tre esecuzioni.

## 2. Dichiarazioni dei documenti contro lo stato vero

| Dichiarazione | Dove | Verificata | Discrepanza |
|---|---|---|---|
| `npm test` 369 su 369 | `STATO.md` R18 e R17, `HANDOFF_20261111_PC.md`, `PROMPT_RIPRESA_PC_20261111.md` | **No** | Il numero vero su `632f8b3` è **372**. 369 era il conteggio prima dei tre test di `tests/argon-giro3.test.mjs`; i documenti di R18 non sono stati aggiornati. Corretto in questo giro (R18, handoff, prompt). R17 resta a 369: era vero per quel commit. |
| `app.js` 457 825 byte, margine 927 | `STATO.md` R18, handoff, prompt | Sì | — |
| versionCode 25 | `android/AndroidManifest.xml:1` | Sì | — |
| APK v25 = HEAD | handoff | Sì per il codice | L'APK è stato costruito dallo stesso albero di `632f8b3`; i documenti del commit sono stati scritti dopo la build, ma non entrano nell'APK. |
| 42 derivati di Argon nel gioco | handoff | Sì | 15 + 8 + 8 + 1 + 1 + 9 = 42, dai tre registri in `assets/production/v10.3/derived/`. |
| targetSdk 36, id `jaguarZcreatorZ13.app`, versione 1.0.0 | mandato §10 | Parziale | Il manifesto di debug ha `targetSdkVersion="35"` e `versionName="0.10-v8-rc.2-debug"` (`AndroidManifest.xml:1-2`); i valori di rilascio li sostituisce `tools/build_aab.sh:51-54` con le variabili di `tools/build_play_aab.sh:14`. Da misurare sul bundle nella milestone di build. |
| Gate: «codice, asset, audio e test al 100 % PASS», AAB validato | `COMMERCIAL_RELEASE_GATE.md`, datato 8 novembre | **Superato** | Il gate descrive lo stato dell'8/11: dopo sono entrati R15–R18. Le righe PASS vanno rimisurate (milestone di regressione). Aggiunta una nota in testa al file; il verdetto BLOCKED resta. |
| Gate riga 13: «interfaccia JS pronta (`window.ChronosBilling`)» | gate | Sì | [FATTO] `ChronosBilling` compare solo in `game/runtime.mjs`; in `android/src` non c'è nessun `BillingClient`. L'acquisto vero resta BLOCKED. |
| Permessi | `AndroidManifest.xml:3` | Sì | Solo `VIBRATE`. Nessun permesso di rete o pubblicitario. |

## 3. I tre commit mai riletti

### `2acb4ae` — intro in prima persona, Kairn e Morrow, registro dei battiti, audio senza ronzio (16 file)

- **Intento.** Apertura riscritta dal punto di vista di Nox, con i due ritratti e l'etichetta di chi parla; registro
  dei due colpi su cassa, porte e interni; quarto atto (`ACTS[4]`, tappe da `reunion` a `postcredits`); epilogo che
  ricorda rotta del gesso, scelta sulla linea e incontro con gli stranieri; ambiente sonoro senza oscillatore né
  rumore continuo; vibrazione breve su ogni pulsante.
- **Verifiche fatte.**
  - [FATTO] I flag dell'epilogo esistono e vengono scritti: `strangers_met` e `broken_clock_fragment` in
    `game/runtime.mjs:503`, `line_choice` in `game/story-v08.mjs:86`.
  - [FATTO] Morrow ha le animazioni `attack` e `shotgun` (`game/campaign.mjs:129`); `drawStrangers` ricade su `idle`
    se un'animazione manca (`game/runtime.mjs:488`).
  - [FATTO] `haptic` rispetta l'opzione e la scheda nascosta (`game/runtime.mjs:326`).
  - [FATTO] Nessuna hitbox e nessun tempo di combattimento toccati: il diff di `game/missions.mjs` cambia solo il
    campo `act`; `game/campaign.mjs` non è nel commit.
  - [FATTO] Canone: Kairn e Morrow restano non giocabili e non spiegano la Frattura (la battuta «Perché noi
    l'abbiamo fatto» c'era già prima).
- **Test che lo coprono.** `tests/narrative-links-v10_3.test.mjs` (cronaca, quattro atti, epilogo, zero oscillatori
  d'ambiente); i test di lingua per le chiavi inglesi.
- **Difetti e rischi.**
  - **P3 — punto di vista misto.** Alcune didascalie sono in prima persona («Una fenditura si apre davanti a me»,
    `story-v08.mjs`, `strangers`), altre in terza nello stesso racconto («Lulù consegna il terminale a Nox»,
    `reunion_open`). È una scelta di scrittura: la decide l'autore.
  - **P3 — codice morto.** `engineSpeed(){}` in `game/audio-engine.mjs:67` non fa più nulla ma è ancora chiamato a
    ogni frame di guida e di gara (`game/runtime.mjs:83`). Candidato al giro di riduzione.
  - **Scoperto — registro dei battiti.** `#knock-beat-log`, `#opening-beat-log` e `#interior-beat-log` non sono
    letti da nessun test né da nessun verificatore. Serve un controllo nel browser (milestone di copertura).
  - **Nota.** L'apertura mostra a schermo «EVE-47 · NOX SERIES»: è testo dell'interfaccia, non di uno sprite, quindi
    la regola 9 non è toccata.

### `aaebba7` — script `dev` sulla porta 3000 (1 riga)

- **Difetto, già chiuso.** Lo script apriva un server su `0.0.0.0`, cioè su tutta la rete. `baa684b` lo ha
  sostituito con `node server.js`, che ascolta su `127.0.0.1` salvo `HOST` esplicito (`server.js:70`). Nessuna
  azione.

### `baa684b` — guida in orizzontale al 52 %, vita degli NPC

- **Intento.** In orizzontale la scala di guida e gara passa da `h/1050` a `h/640`; gli NPC degli hub salutano da
  vicino e hanno un'ombra; negli interni la figura oscilla mentre parla.
- **Verifiche fatte.** [MISURATO] a 844×390: `min(844/720, 390/640) = 0,609`; strada `720 × 0,609 / 844 = 52 %`.
  In verticale la formula non cambia. La simulazione di gara lavora in coordinate di mondo: la scala è solo disegno.
  «Riduci movimento» spegne saluto e oscillazione.
- **Test.** `narrative-links-v10_3.test.mjs` «R5 landscape road scale…»; nel browser `verify_race_roads_giro2.cjs`.
- **Rischio.** Il test legge la formula dal sorgente: protegge dal ritorno indietro, non dalla sovrapposizione
  dell'HUD. Da ricontrollare con gli screenshot nella milestone di QA (844×390, 800×360, 932×430).

## 4. Consegna di Argon, lotto 2 (`f39dd3d` → `f21e19d`)

[FATTO] File nuovi o cambiati: `B/bone_tyrant_b.png` e `_c.png` rifatti, quattro file in `JAGUAR_INTRO/`,
`STYLE_BIBLE.md`, `A/AUDIO_MANIFEST_104.json`, `STATO_CODA.md` e tre `CONSEGNA.md`. In questo audit sono stati
solo elencati: il controllo immagine per immagine è nella milestone degli asset.

- **Niente di nuovo è pronto per il gioco oggi.** I boss entrano con la loro logica (D23); il manifesto audio
  descrive 104 suoni che non esistono (`MISSING_NO_AUDIO_MODEL`).
- **Decisione che spetta all'autore.** Argon propone di sostituire l'intro dello studio, in contrasto con D34
  (intro invariata). La proposta non è registrata come decisione: resta fuori finché l'autore non la conferma.
- **Mancano ancora:** `shadow_reaper_d`, `forge_behemoth_b`, le due tavole intere dell'intro, i gruppi M, V, G, F
  (40 tavole) e i 104 suoni.

## 5. Sicurezza

Nel messaggio che accompagna il mandato si legge che il controllo remoto è stato fatto «con il token fornito».
Questa sessione non ha usato nessun token incollato in chat. Ogni token passato per una chat va revocato su GitHub.

## 6. Esito

Base verde, nessun P0 o P1 trovato nella rilettura. Aperti: due P3, una zona scoperta (registro dei battiti), il
gate dell'8/11 da rimisurare. Milestone successiva proposta: registro di copertura (§4 del mandato) e giro di
riduzione di `app.js` (§5), prima di qualsiasi integrazione.
