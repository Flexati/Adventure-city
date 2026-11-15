# Passaggio di consegne al PC — 15 novembre 2026 (Fase 0, R28–R34)

Scritto dalla sessione cloud per la chat che riprende sul PC. Vale insieme a `CLAUDE.md` e a `docs/gold/DECISIONI.md` (ultima: **D77**). Lo stato è in cima a `docs/gold/STATO.md`. Il piano è `docs/gold/PIANO_PLAY_STORE_20261114.md`. Sostituisce `HANDOFF_20261113_PC.md`.

## Dove siamo

- **Ramo.** R28–R36 sono in `work/chronos-adventure-commercial` (PR #12 unita con la CI verde). R37 (errori da telefono vero: zoom del testo, gesto Indietro, tacca, schermi piccoli) sta su `ccr-022499ad-zq9iu5` in una PR nuova. Controlla se è stata unita: se sì lavora da `work/chronos-adventure-commercial`, se no parti da `ccr-022499ad-zq9iu5`. **Non partire da `d3ea80d`** né da `main`: `d3ea80d` è stato pubblicato con un push forzato, aveva 11 test falliti, un crash nella tappa 20 e il pacchetto Android rotto. I 29 commit R22–R29 originali sono in `origin/backup/work-r29-14f5bdc`.
- **[MISURATO] Test:** `npm test` 492 su 492 dopo R37 (487 al commit R36). Audit di combattimento D48: 50 righe su 50 a 6/6. Browser [SIMULAZIONE, Chromium]: batteria completa rieseguita sul commit R35, tutta PASS, più stress casuale e sessione lunga (prima sezione di `STATO.md`, R35–R36). Rilanciala comunque prima di cambiare qualcosa (comandi sotto).
- **[SIMULAZIONE] Durata:** A 80,2 · B 82,9 · C 78,3 minuti probabili (minimo 57,7 / 59,5 / 56,3; alto 111,3 / 115,8 / 108,6; facoltativi circa +11), tre giri completi PASS sul commit R35: `docs/evidence/r36/PLAYTIME_ESTIMATE_R35.md`. Obiettivo dell'autore: circa 150 (D65). **Mancano circa 65–70 minuti.**
- **[MISURATO] Peso:** `app.js` **455 378** byte dopo R37, guardia 458 752: **margine 3 374 byte**. Qualunque codice nuovo in `game/` va compensato prima (vedi `docs/gold/SIZE_LOG.md`).
- **APK di prova v44** (firma di debug, `versionCode` 44, 101 025 732 byte, SHA-256 `e06116f0c029d98f6131618d46f27f593dbcb4ec118d78d79f41d0e60e3027dd`), costruito con R37. Il v43 (R36) è superato. **AAB di produzione:** prova generale riuscita in cloud con chiave usa e getta; si firma solo sul PC (`docs/gold/BUNDLE_PRODUZIONE_20261114.md`).
- **`COMMERCIAL_RELEASE = BLOCKED`:** 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato (oggi il gioco è tutto aperto), firma dell'autore mancante.

## Cosa è stato fatto in questo giro

- **Fase 0** (piano): base riportata a verde da `d3ea80d`, pacchetto Android ripristinato, arte segnaposto tolta, test riportati a R29, documenti e prove ripristinati, CI di GitHub sistemata, `versionCode` degli AAB sistemati. Dettagli nella sezione «Fase 0» di `STATO.md`.
- **D74:** il menu suona da solo su Android, ruggito del giaguaro nell'intro (sintetizzato, originale).
- **D72/D73/D76/R31/R32:** il proiettile e il fuoco escono dalla canna nella direzione di mira, in ogni sprite sheet (eroi, compagno, armi, Morrow, nemici a distanza); mira manuale che prende ciò che si indica; fiammata del colore dell'eroe.
- **R33/R34:** correzioni dalla revisione del codice di R31–R32; caccia agli errori sui boss: Vega non annunciava il risveglio (corretto). I 9 boss: 54 combattimenti su 54 vinti dal bot, nessuno nei muri o fermo.

## DA FARE, in ordine

1. **Allinearsi.** `git fetch origin`, ramo giusto (vedi sopra), `npm ci`, `npm test`, batteria browser.
2. **Prova su telefono, con l'autore.** Sblocca tutto il resto. Da guardare: ruggito e musica del menu (D74) senza toccare lo schermo; mira trascinando il pulsante di sparo con tiro assistito spento; fuoco dalla canna in tutte le direzioni (D76); **spigoli dei muri nelle mappe dipinte** (con la tastiera il bot si incastra 66–246 volte per rotta; con il joystick va guardato); scatti con The Anchor; villaggi; gare; mosse nuove. Si registra in `docs/gold/PLAYTEST.md`.
3. **Fase 1 del piano — agenti.** I cinque agenti (designer, tre giocatori simulati, compositore) si sono fermati e **non hanno consegnato nulla**. Vanno rilanciati con il brief: tre giocatori (casual da metro, veterano con mira manuale, esploratore) che giocano nel browser con profilo telefono e consegnano resoconti con foto; il designer delle logiche rivede ciclo, curva, economia, durata. Etichetta [SIMULAZIONE]: non sostituisce le persone.
4. **Fase 2 — colonna sonora nuova (D74: «La musica è orribile… alza la qualità»).** Oggi: file mono a 32 kHz resi da MIDI (~60 s), loop di 13–22 s. Da fare: 12–14 brani originali stereo 44,1 kHz di 90–150 s, mappa cue→brano, mastering −16 LUFS ±1 e true peak ≤ −1,5 dBTP, script riproducibile in `tools/`, approvazione all'ascolto dell'autore (un agente non può ascoltare).
5. **Fase 4 — durata.** Seguire `docs/gold/PIANO_DURATA_R20.md`: collegamenti narrativi, asset veri di Argon non ancora usati. Niente riempitivi. **Le gare Vortex obbligatorie sono una DOMANDA APERTA per l'autore (cambierebbe D05 e i salvataggi): non sono decise, non vanno costruite finché non c'è una riga in `DECISIONI.md`.**
6. **Acquisto e AAB.** Ponte Google Play Billing (serve l'ID del prodotto a 5,99 € e un account di prova; l'agente non crea nulla in Play Console). AAB firmato con la chiave dell'autore (`BUNDLE_PRODUZIONE_20261114.md`); `PLAY_VERSION_CODE` più alto di ogni bundle già caricato (3 è usato).
7. **Aperti, da non improvvisare (D65).** Mappa `a_axis` con vuoto blu dipinto; ritratto di Eren (canone: vecchio cartografo, ritratto giovane); icone proprie per le 9 armi di mercato; la minaccia nemica deve riconoscersi anche senza colore (la fiammata nemica ha la stessa forma di quella dell'eroe: da decidere con la prova su telefono); `app.js` quasi al limite.

## Aperti ereditati dal passaggio del 13 novembre (non dimenticati)

- **Turbo.** Si sbloccano tutti da soli con gli atti (`unlockedTurbosV12`): comprarli dal fabbro serve solo ad averli prima. **Da decidere con l'autore** se va bene.
- **Nox e le «cose che non servono».** La battuta era legata all'oggetto tolto con D70: oggi non si attiva. Da chiedere all'autore se riscriverla.
- **Eren.** Il canone lo descrive «vecchio cartografo» di Moon Refuge, il ritratto mostra un uomo giovane e Argon lo ha messo nella Volta delle Spore. Da chiedere all'autore.
- **Cosa il bot non prova.** I turbo oltre il primo e gli acquisti di armi non sono esercitati da nessun verificatore automatico. Armi di mercato e mosse sono ora esercitate da `tools/verify_arsenal_r23.cjs` (PASS in R35: 37 negozi, 2 bagagli, 17 combattimenti) e da una simulazione casuale di 300 partite con 12 armi e 8 mosse (nessuna violazione); i numeri di bilanciamento restano da provare con persone.
- **Mappe dipinte.** Se Argon ridipinge una mappa, va ridisegnata anche la sua pianta (`tools/painted_plans_r26.py`).
- **Esito delle consegne di Argon:** `docs/gold/CONSEGNA_ARGON_LOOP_ESITO.md`.
- **Comandi in più per armi e villaggi:** `node tools/verify_arsenal_r23.cjs $U $O/arsenale` (circa 10 minuti), `node tools/probe_arsenal_r22.mjs`, `node tools/render_villages_r22.cjs $U $O/villaggi`, `node tools/verify_boss_entrance_r35.cjs $U`.

## Comandi

```bash
npm ci && npm test
python3 -m http.server 8090 --bind 127.0.0.1          # lasciarlo acceso; CHROMIUM=<percorso di chrome>
U=http://127.0.0.1:8090/game/; O=<cartella fuori dal repo>
for t in qa:runtime qa:hubs qa:controls qa:save qa:stability qa:health qa:touch qa:gamepad qa:audio qa:opening; do npm run $t || { echo "FALLITO: $t"; break; }; done   # si ferma al primo errore
node tools/verify_bundle_en_r20.cjs && node tools/verify_hub_race_browser.cjs && node tools/verify_race_modes_browser.cjs && node tools/verify_studio_browser.cjs
node tools/verify_stages_r20.cjs $U $O/stages; node tools/verify_interiors_browser.cjs $U $O/int; node tools/verify_foes_d46.cjs $U $O/foes
node tools/verify_hud_p1.cjs $U $O/hud.json; node tools/verify_demo_m3.cjs $U $O/demo.json; node tools/verify_options_q4.cjs $U $O/opt; node tools/verify_labels_r4.cjs $U $O/lab
node tools/verify_no_keyboard_d39.cjs
node tools/verify_aim_r28.cjs $U $O/mira               # mira manuale
node tools/verify_muzzle_fire_r29.cjs $U $O/fuoco      # fuoco in 8 direzioni, Nox e Lulù
node tools/verify_menu_audio_r30.cjs $U $O/audio       # ruggito e musica del menu
node tools/monkey_r36.cjs $U $O/scimmia                # stress: tocchi casuali, background, rotazione (MONKEY_PLAY_ONLY=1 resta in partita)
node tools/verify_long_fire_r36.cjs $U finale 180      # 3 minuti di fuoco: memoria e fotogrammi
node tools/verify_small_screens_r37.cjs $U $O/schermi  # R37: 360x568, 592x336…: dialoghi con testo grande, pausa, menu
node tools/verify_text_zoom_r37.cjs $U                 # R37: testo grande dalla scala del carattere del telefono
node tools/audit_combat.mjs $O/audit.json              # D48: 6/6 su 50 righe
node tools/verify_v9_governance.mjs                    # i checksum degli artefatti in docs/production/v9
# Giro completo (circa mezz'ora per rotta) e stima di durata
for r in a b c; do CITY_VIRTUAL_TIME=1 CITY_CAMPAIGN_TIMEOUT_MS=3000000 node tools/verify_campaign_browser.cjs $U $r $O/camp-$r; done
node tools/estimate_playtime.mjs $O/est.json $O/est.md $O/camp-a/report.json $O/camp-b/report.json $O/camp-c/report.json
ANDROID_SDK_ROOT=<sdk> bash tools/build_apk.sh          # APK di debug in dist/ (alza versionCode in android/AndroidManifest.xml)
```

## Argon

- Ha pubblicato sul ramo del gioco e con un push forzato su `main` (`d3ea80d`). **Il suo ramo è `argon/…`: sul ramo del gioco non scrive.** Ogni consegna si verifica per intero (`npm test`, batteria `qa:*`, giro completo) prima di credere al rapporto: `d3ea80d` dichiarava «460/460» e ne falliva 11.
- **Azione dell'autore:** attivare su GitHub la protezione di `main` e di `work/chronos-adventure-commercial` (PR obbligatoria, niente force-push).

## Sicurezza

- In chat è passato un token GitHub in chiaro (dentro un rapporto di Argon). Non è stato usato. **L'autore deve revocarlo.**
- Chiavi, token, keystore e `.env` non entrano nel repo né in chat. Niente `npm run android:key:play`. Niente pubblicazione sullo store e niente azioni in Play Console senza autorizzazione esplicita.
- Mai `main`, mai force-push, mai riscrittura della storia, mai i rami `delivery/*`.
