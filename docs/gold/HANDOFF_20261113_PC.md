# Passaggio di consegne al PC — 13 novembre 2026 (R23)

Scritto dalla sessione cloud per la chat che riprende sul PC. Vale insieme a `CLAUDE.md` e a `docs/gold/DECISIONI.md` (ultima: **D69**). Lo stato è in cima a `docs/gold/STATO.md`.

## Dove siamo

- **Ramo:** `work/chronos-adventure-commercial`, commit di questa consegna: vedi `git log -1` (messaggio «R23»).
- **[MISURATO] `npm test`:** 446 su 446.
- **[MISURATO] Peso:** `app.js` 443 279 byte (guardia 458 752, margine 15 473); `world.js` 80 835; `en.js` 141 751.
- **[SIMULAZIONE] Controlli nel browser (Chromium, non un telefono):** 21 su 21 PASS (elenco nella prima sezione di `docs/gold/STATO.md`).
- **[SIMULAZIONE] Durata:** A 76,1 · B 82,0 · C 74,8 minuti probabili, misurati **prima** dell'arsenale e delle curve (`docs/evidence/r21/PLAYTIME_ESTIMATE_R21.md`). Obiettivo dell'autore: circa 150 (D65). **Mancano circa 70 minuti.** Va rimisurata.
- **APK di prova:** versionCode 33, firma di debug. L'AAB non è stato rifatto.
- **`COMMERCIAL_RELEASE = BLOCKED`.** Le quattro condizioni non sono tecniche: 0 playtest su 5, nessuna prova su telefono registrata, acquisto Play non collegato, firma dell'autore mancante.

## Cosa c'è nel gioco oggi

- Campagna di 44 tappe su tre rotte, 9 boss, 14 villaggi (4 della campagna, 10 facoltativi) con 16 edifici dipinti, ognuno sul proprio lotto (D68).
- Arsenale: 5 armi di storia più 9 di mercato, 7 equipaggiamenti, rottami, rivendita, sconti (D69).
- Mosse speciali: 4 per eroe, una per atto; si cambiano dal Bagaglio (o con il tasto K).
- Gare di Veyra: 7 circuiti con curve, 5 stadi di turbo per la Vortex.
- Difficoltà per atti: nemici comuni più rapidi nelle tappe senza boss; i boss restano tarati a mano.

## DA FARE, in ordine

1. **Allinearsi e rimisurare.** `git pull`, `npm ci`, `npm test`, poi la batteria dei controlli nel browser (elenco sotto). Poi i tre giri completi e la stima di durata (comandi sotto): servono a sapere se la campagna si finisce ancora dall'inizio ai titoli dopo D69 e quanto dura adesso. Non è stato rifatto dopo l'arsenale e le curve.
2. **Prova su telefono, con l'autore.** È la prima cosa che sblocca il resto. Da guardare: scatti con The Anchor (mitigati in R21, mai confermati su telefono), le 14 musiche di Argon (mai ascoltate, 14–22 secondi in loop), villaggi (D68), curve e turbo, mosse nuove, leggibilità delle bande cinematografiche. Si registra in `docs/gold/PLAYTEST.md`.
3. **Durata.** Dopo la misura del punto 1, seguire `docs/gold/PIANO_DURATA_R20.md`: gare Vortex obbligatorie nella campagna (ora hanno curve e turbo, valgono di più), collegamenti narrativi fra le tappe, uso degli asset di Argon non ancora nel gioco (abitanti dei pontili, sentinella di marea, Veyra a figura intera, garage, officina, civili, segreti, icone). Nessun riempitivo: ogni minuto in più deve avere qualcosa da fare.
4. **Acquisto.** Nell'app non c'è il ponte con Google Play Billing: oggi il gioco è tutto aperto. Serve dall'autore l'ID del prodotto a 5,99 € (D18) e un account di prova. L'agente non crea nulla in Play Console. Con il ponte va anche la variante demo (M3).
5. **AAB firmato.** `bash tools/build_aab.sh` sul PC, firma con il keystore dell'autore, che non entra mai nel repo né in chat. Alzare `versionCode`.
6. **Bilanciamento con persone.** Il bot non usa mosse nuove, turbo oltre il primo, né compra armi: quei numeri sono stati messi in fascia con una sonda (`tools/probe_arsenal_r22.mjs`), non provati. Cinque persone, come da `PLAYTEST.md`.
7. **Arte ancora aperta** (non si improvvisa, D65): la mappa dell'Asse (`a_axis`) ha attorno un vuoto blu scuro dipinto così; le piante delle 13 mappe dipinte sono stimate (in alcune si cammina sopra i mobili: vanno corrette a mano in `game/painted-maps.mjs`); terreni e oggetti di piazza dei villaggi; musiche lunghe; icone proprie per le 9 armi di mercato (oggi riusano quelle di serie).
8. **D39 / R6.** Togliere i comandi da tastiera delle azioni di gioco. Il tasto K per cambiare mossa è arrivato con D69 e va nella stessa direzione sbagliata: il cambio dal Bagaglio resta.
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
