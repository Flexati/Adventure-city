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
