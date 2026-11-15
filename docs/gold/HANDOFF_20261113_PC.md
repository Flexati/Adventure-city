# Passaggio di consegne al PC — 13–14 novembre 2026 (R23–R29)

Scritto dalla sessione cloud per la chat che riprende sul PC. Vale insieme a `CLAUDE.md` e a `docs/gold/DECISIONI.md` (ultima: **D73**). Lo stato è in cima a `docs/gold/STATO.md`.

## Dove siamo

- **Ramo:** `work/chronos-adventure-commercial`, commit di questa consegna: vedi `git log -1` (ultimo blocco: R29 fuoco di bocca orientato; prima R28 colpo dalla canna e mira manuale; prima R27 tastiera, R26 piante delle mappe dipinte, R25 pallottole visibili, R24 negozianti in pixel art, R23 revisione dell'arsenale di Argon).
- **[MISURATO] `npm test`:** 468 su 468.
- **[MISURATO] Peso:** `app.js` 447 918 byte (guardia 458 752, margine 10 834); `world.js` 80 729; `en.js` 141 756.
- **[SIMULAZIONE] Controlli nel browser (Chromium, non un telefono):** 21 su 21 PASS fino a R27, più `tools/verify_aim_r28.cjs` (mira manuale, 9 colpi su 9) in R28 e `tools/verify_muzzle_fire_r29.cjs` (fuoco di bocca, 16 tiri in 8 direzioni) in R29.
- **[SIMULAZIONE] Durata:** A 79,9 · B 84,0 · C 80,0 minuti probabili (minimo 57,5 / 60,3 / 57,5; alto 111,0 / 117,6 / 111,4; facoltativi circa +11), tre giri completi PASS sul codice di R28–R29 (`docs/evidence/r28/PLAYTIME_ESTIMATE_R28.md`). Obiettivo dell'autore: circa 150 (D65). **Mancano circa 65–70 minuti.**
- **APK di prova:** versionCode 36, firma di debug. L'AAB non è stato rifatto.
- **`COMMERCIAL_RELEASE = BLOCKED`.** Le quattro condizioni non sono tecniche: 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## Cosa c'è nel gioco oggi

- Campagna di 44 tappe su tre rotte, 9 boss; le 13 mappe dipinte hanno piante disegnate a mano (R26), 14 villaggi (4 della campagna, 10 facoltativi) con 16 edifici dipinti, ognuno sul proprio lotto (D68).
- Negozi: 45 bottegai con ritratto o figura animata e sfondo, tutto in pixel art (D70); «Un oggetto inutile» non è più in vendita.
- Colpi: pallottole dipinte che escono dalla canna della posa (misurata sui fogli), volano fino al petto del bersaglio e scoppiano all'arrivo (D71, D72); la fiammata di bocca punta dove va il colpo (D73). Mira manuale: trascinare il pulsante di sparo; la linea parte dalla canna e si ferma, con un anello rosso, sul nemico che verrà colpito. Da confermare su telefono.
- Arsenale: 5 armi di storia più 9 di mercato, 7 equipaggiamenti, rottami, rivendita, sconti (D69).
- Mosse speciali: 4 per eroe, sbloccate con la storia; si cambiano dal Bagaglio (nessun tasto: D39).
- Gare di Veyra: 7 circuiti con curve, 5 stadi di turbo per la Vortex.
- Difficoltà per atti: nemici comuni più rapidi nelle tappe senza boss; i boss restano tarati a mano.

## DA FARE, in ordine

1. **Allinearsi.** `git pull`, `npm ci`, `npm test`, poi la batteria dei controlli nel browser (elenco sotto). I tre giri completi e la stima di durata sono stati rifatti su R28–R29 (tre rotte PASS): vanno ripetuti solo dopo modifiche a tappe, combattimento o gare.
2. **Prova su telefono, con l'autore.** È la prima cosa che sblocca il resto. Da guardare: la mira trascinando il pulsante di sparo e con tiro assistito spento (D72), gli spigoli dei muri nelle mappe dipinte (l'eroe può incastrarsi se si spinge dritto: vedi R28), scatti con The Anchor (mitigati in R21, mai confermati su telefono), le 14 musiche di Argon (mai ascoltate, 14–22 secondi in loop), villaggi (D68), curve e turbo, mosse nuove, leggibilità delle bande cinematografiche. Si registra in `docs/gold/PLAYTEST.md`.
3. **Durata.** Seguire `docs/gold/PIANO_DURATA_R20.md`: gare Vortex obbligatorie nella campagna (ora hanno curve e turbo, valgono di più), collegamenti narrativi fra le tappe, uso degli asset di Argon non ancora nel gioco (abitanti dei pontili, sentinella di marea, Veyra a figura intera, garage, officina, civili, segreti, icone). Nessun riempitivo: ogni minuto in più deve avere qualcosa da fare.
4. **Acquisto.** Nell'app non c'è il ponte con Google Play Billing: oggi il gioco è tutto aperto. Serve dall'autore l'ID del prodotto a 5,99 € (D18) e un account di prova. L'agente non crea nulla in Play Console. Con il ponte va anche la variante demo (M3).
5. **AAB firmato.** `bash tools/build_aab.sh` sul PC, firma con il keystore dell'autore, che non entra mai nel repo né in chat. Alzare `versionCode`.
6. **Bilanciamento con persone.** Il bot non usa mosse nuove, turbo oltre il primo, né compra armi: quei numeri sono stati messi in fascia con una sonda (`tools/probe_arsenal_r22.mjs`), non provati. Cinque persone, come da `PLAYTEST.md`.
7. **Arte ancora aperta** (non si improvvisa, D65): la mappa dell'Asse (`a_axis`) ha attorno un vuoto blu scuro dipinto così; le piante delle 13 mappe dipinte sono state ridisegnate a mano in R26 (`tools/painted_plans_r26.py`): se Argon ridipinge una mappa, va ridisegnata anche la sua pianta; terreni e oggetti di piazza dei villaggi; musiche lunghe; icone proprie per le 9 armi di mercato (oggi riusano quelle di serie).
8. **Due cose da chiedere all'autore.** Il canone descrive Eren come «vecchio cartografo» di Moon Refuge, ma il ritratto mostra un uomo giovane e Argon lo ha messo nella Volta delle Spore. La battuta di Nox sulle «cose che non servono» era legata all'oggetto tolto con D70: oggi non si attiva.
- **D39 / R6:** chiusa in R27 (la tastiera di un giocatore non gioca; i verificatori sì).
9. **I turbo si sbloccano tutti da soli con gli atti** (`unlockedTurbosV12`): comprarli dal fabbro serve solo ad averli prima. Decidere con l'autore se va bene così.

## Comandi

```bash
npm ci && npm test
python3 -m http.server 8090 --bind 127.0.0.1          # lasciarlo acceso; CHROMIUM=<percorso di chrome>
node tools/verify_bundle_en_r20.cjs
npm run qa:runtime && npm run qa:hubs && npm run qa:controls && npm run qa:save && npm run qa:stability
npm run qa:health && npm run qa:touch && npm run qa:gamepad && npm run qa:audio && npm run qa:opening
node tools/verify_hub_race_browser.cjs && node tools/verify_race_modes_browser.cjs && node tools/verify_studio_browser.cjs
U=http://127.0.0.1:8090/game/; O=<cartella fuori dal repo>
node tools/verify_stages_r20.cjs $U $O/stages; node tools/verify_interiors_browser.cjs $U $O/int
node tools/verify_foes_d46.cjs $U $O/foes; node tools/verify_hud_p1.cjs $U $O/hud.json
node tools/verify_demo_m3.cjs $U $O/demo.json; node tools/verify_options_q4.cjs $U $O/opt; node tools/verify_labels_r4.cjs $U $O/lab
node tools/render_villages_r22.cjs $U $O/villaggi      # i 14 villaggi interi, da guardare
node tools/probe_arsenal_r22.mjs                       # armi e mosse contro i boss, bot
node tools/verify_arsenal_r23.cjs $U $O/arsenale       # 37 negozi, bagaglio, 9 armi e 8 mosse in missione (circa 10 minuti)
node tools/verify_aim_r28.cjs $U $O/mira                # mira manuale: trascina il pulsante verso nemici veri (circa 5 minuti)
python3 tools/measure_muzzles_r28.py --check            # la tabella delle canne corrisponde ai fogli
node tools/verify_muzzle_fire_r29.cjs $U $O/fuoco       # fuoco di bocca in 8 direzioni, Nox e Lulù (circa 3 minuti)

# Giro completo (circa mezz'ora per rotta) e stima di durata
for r in a b c; do CITY_VIRTUAL_TIME=1 CITY_CAMPAIGN_TIMEOUT_MS=3000000 node tools/verify_campaign_browser.cjs $U $r $O/camp-$r; done
node tools/estimate_playtime.mjs $O/est.json $O/est.md $O/camp-a/report.json $O/camp-b/report.json $O/camp-c/report.json

ANDROID_SDK_ROOT=<sdk> bash tools/build_apk.sh         # APK di debug in dist/
```

## Argon

- Ha pubblicato due volte direttamente sul ramo del gioco e una volta con un push forzato. Tutto è stato recuperato con merge normali. **Il suo ramo è `argon/loop-20261112`: sul ramo del gioco non scrive.**
- I suoi rapporti dichiarano «tutto verde» su suite mirate. A ogni consegna si esegue `npm test` per intero e la batteria `qa:*` prima di credere a un numero. Esiti: `docs/gold/CONSEGNA_ARGON_LOOP_ESITO.md`.
- In questo giro l'autore non vuole richieste per Argon.

## Sicurezza

- In chat è passato un token GitHub in chiaro (dentro un rapporto di Argon). Non è stato usato. **L'autore deve revocarlo.**
- Chiavi, token, keystore e `.env` non entrano nel repo né in chat. Niente `npm run android:key:play`. Niente pubblicazione sullo store e niente azioni in Play Console senza l'autorizzazione esplicita dell'autore.
- Mai `main`, mai force-push, mai riscrittura della storia, mai i rami `delivery/*`.
