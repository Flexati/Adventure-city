# CHRONOS — Regressione finale

Data: 17 novembre 2026. Albero: ramo `ccr-022499ad-zq9iu5`, commit `c1e09d7` (fusione del lavoro fatto con Cursor) più il passaggio della versione a 46. **[FATTO] Nessuna prova su un telefono:** tutto ciò che segue gira in Node o in Chromium headless [SIMULAZIONE] e nelle macchine della CI di GitHub.

## 1. Test automatici [MISURATO]

| Comando | Esito |
|---|---|
| `npm test` | **521 su 521**, 98 file di test, 0 saltati |
| `npm run lint` | riuscito |
| `npm run build` | riuscito: `app.js` 458 588 byte (guardia 458 752: margine 164 byte, da tenere d'occhio), `world.js` e `en.js` separati |
| `node tools/audit_combat.mjs` | 50 combattimenti su 50 vinti (25 tappe a piedi × bot medio e debole × 6 semi); 0 nemici bloccati, 0 nei muri, 0 timeout |

## 2. CI di GitHub, PR #14 [FATTO]

- **`e0029f7`** (colonna sonora R38 più varietà MS-3): `browser` verde; `campaign (a)`, `(b)` e `(c)` verdi. Vuol dire che il bot gioca la campagna intera dalla Nuova storia ai titoli di coda su tre rotte, in 7–8 minuti di orologio virtuale ciascuna.
- **Storia dei rossi, tutti chiusi.**
  - `c404731`: campagna ferma al villaggio «moon», chiuso nel bot.
  - `c404731` e `4032efd`: budget dei fotogrammi di «below», chiuso dal taglio di ciò che è fuori inquadratura.
  - `bea86f3`: `STATO.md` non citava D81, chiuso.

## 3. Batteria nel browser sull'albero finale [SIMULAZIONE, Chromium]

**PASS:**
- studio, 5 formati;
- menu con Nox e Lulù insieme, 7 formati;
- HUD P1, 158 su 158;
- schermi piccoli R37, 98 su 98;
- scritte R4, 9 su 9;
- mira manuale, 7 su 7;
- fuoco di bocca, 16 su 16;
- arsenale: 37 negozi, 2 bagagli, 23 combattimenti;
- ingresso dei boss;
- zoom del testo;
- audio, runtime, ciclo di vita, finali;
- menu che suona da solo;
- leitmotiv;
- stranieri;
- gare dall'hub e modalità di gara;
- chrono;
- kit di Tessa;
- Rook e recupero del Rook;
- lingua italiano/inglese, anche negli hub;
- le tre prove del gesso;
- flusso di rilascio (boss, sconfitta, riprova, ricarica, vittoria);
- salvataggi;
- stabilità;
- tocco, 48 su 48;
- gamepad, 9 su 9;
- tappe ibride nuove, giocate dal bot fino alla fine in verticale e in orizzontale.

**Sessione lunga.** `tools/verify_long_fire_r36.cjs`: 180 s di fuoco continuo nell'arena di Archon. Memoria fra 5,7 e 8,5 MB, crescita 0 MB, p95 al massimo 3,3 ms, 0 errori.

**Le verifiche erano davvero allineate al gioco?** Sette verifiche cadevano identiche anche sulla base `a9e3afd`: aspettavano file, punti vita o salvataggi di prima della base. Sono state riallineate senza indebolirle (`98bf068`). Una ha trovato un difetto vero, il recupero del Rook senza inglese, che è stato corretto.

## 4. APK di prova 46 [MISURATO, `aapt2 dump badging`, `apksigner`]

| Dato | Valore |
|---|---|
| File | `dist/Chronos_Adventure_Nox_Lulu_debug.apk` |
| Byte | 106 180 675 |
| SHA-256 | `2c8a0db9436cff2ab4dd62c3581035c1a822bcb70a587f22f85179141b81aa78` |
| Pacchetto e versione | `com.cityadventure.pizzaprotocol.debug`, `versionCode` 46, `versionName` 0.10-v8-rc.2-debug |
| SDK | target 35, minimo 26 |
| Permessi | solo `VIBRATE` |
| Firma | chiave di debug locale (non è una firma di produzione) |
| Contenuto controllato | i 15 brani di `audio/v11`; nessuna traccia di `audio/v05` o `audio/v09`; i tre frame dell'intro; `app.js` di 456 320 byte |

## 4bis. Dopo la fusione con il lavoro di Cursor (`c1e09d7`)

- [MISURATO] nel browser: studio (5 formati), menu con i due eroi (7), scritte R4 (9), schermi piccoli (98), mira manuale, audio del menu, runtime, audio, ingresso dei boss, Rook: tutti PASS.
- I tre giri di campagna della CI giocano le modalità nuove (scorta, inseguimento, pressione, staffetta, furtività): esito nella PR #14.
- La 45 consegnata prima non contiene il lavoro di Cursor; la 46 sì.

## 5. Non eseguito, e perché

- **Telefono, Play Console, playtest umani.** Non disponibili in questa sessione.
- **`tools/monkey_r36.cjs`** (tocchi casuali per 9 scenari). Non rieseguito sull'albero finale; l'ultimo giro valido è di R36.
- **Prova di prestazioni completa in locale.** La esegue la CI a ogni push (`browser`).


## 8. Aggiornamento finale — PR #17, D83 e APK di prova 47 [MISURATO salvo dove indicato]

Albero: ramo `ccr-022499ad-zq9iu5`, sopra `fc4dd9c`. Contiene la PR #17 di Cursor (fogli dei boss a quattro fotogrammi, 15 brani a −16 LUFS, `app.js` con 13 014 byte di margine, `versionCode` Play 4, D82) e i pannelli premium D83.

| Controllo | Esito |
|---|---|
| `npm test` | **530 su 530** (8 nuovi: pannelli D83, esito della fine tappa, fiammata dal manifest) |
| `npm run lint` | riuscito |
| `app.js` impacchettato | 445 839 byte (guardia 458 752: margine 12 913) |
| CI della PR #17 | `browser`, `campaign (a)`, `(b)`, `(c)` verdi [FATTO] |
| CI della PR #14 su `53fc7d6` | verde [FATTO] |

**Nel browser [SIMULAZIONE, Chromium headless]:** HUD P1 150/150; opzioni Q4 11/11; schermi piccoli R37 98/98; interni 32 casi, nessuna riga senza traduzione; menu con i due eroi in 7 formati; scritte R4 9/9; recupero salvataggi PASS; runtime/audio/finali PASS; fiammata di bocca 16 colpi su 16 con fiamma, 0 errori.

**Corretto in questo giro:**
- **Pannelli (D83):** vetro color notte con le luci di Nox e Lulú al posto del blu piatto; entrata a strati (0,3 s, ferma con «Riduci movimento»); fine tappa in oro con ◆ se vinci e in rosso con ✕ se perdi, quindi l'esito si legge anche senza colore (regola 9).
- **Fiammata (#23):** il disegno tinto ora legge fotogrammi e fps dal manifest invece di 4 e 12 scritti a mano. Il risultato a schermo è lo stesso, perché il manifest dice 4 a 12 fps.
- **Verifica della fiammata:** usava `app_breach`, che dopo il lavoro di Cursor è una guida, e si fermava senza pulsante di sparo. Ora usa `app_clinic`, una tappa a piedi con Lulú.

**APK di prova 47 (debug, non firmato per lo store):** 108 515 411 byte. SHA-256 `c3fd2e906b33e0bb36ed5d1096cfaf260f234e9ac08a586d65a853c94587ae03`. Permessi: solo `VIBRATE`. Contiene i 15 brani v11, i 4 fogli dei boss da 288 px e lo stile D83.

**Resta fuori dal codice (`COMMERCIAL_RELEASE = BLOCKED`):**
- 5 playtest registrati: ne abbiamo 0;
- prova su telefono vero misurata;
- ponte d'acquisto Play collegato a `window.ChronosBilling`;
- firma dell'AAB con la chiave dell'autore;
- ascolto della colonna sonora;
- conferma della grafia «Lulú».


## 9. R41 — Consegna di Argon e APK di prova 48 [MISURATO salvo dove indicato]

- Consegna `delivery/argon-design-aaa-20261117` (`9061720`) verificata da capo. Entrano 45 interni e 6 ritratti HD; la musica M1 resta fuori (dinamica 0,5–1,2 LU contro 2,7–7,8 di R38, banda 800–3000 Hz da 2 a 4 volte più bassa, struttura ricalcata su R38).
- Interni: stanza dipinta come scena intera, personaggio grande davanti; corretto il suggerimento del villaggio che copriva volto e battuta.
- `npm test` 534 su 534. Browser [SIMULAZIONE]: interni, runtime, salvataggi, villaggi, HUD, schermi piccoli, opzioni, scritte, menu, studio, controlli: PASS.
- APK 48 (debug): 114 777 419 byte, SHA-256 `c723e15c5491c9be2f852f42917614b727f4aa07b3b59ec6b8bd029117b7686f`, solo `VIBRATE`, 45 interni e 6 ritratti HD dentro.
- Fuori dal codice, invariato: 0/5 playtest, prova su telefono, acquisto Play, firma, ascolto della musica.

## 10. R45 — Il legame di Nox e Lulù, cinque finali e APK di prova 52 [MISURATO salvo dove indicato]

- Quattro momenti con tre scelte (`game/bond.mjs`), un cuore ricavato dalle scelte salvate, «Sono qui» di Lulù nel finale a cuore alto, cinque finali sul tetto con targa e conteggio nella schermata finale (D90).
- `npm test` 555 su 555 (6 nuovi in `tests/bond-r45.test.mjs`). `audit_combat` [SIMULAZIONE] invariato: a cuore medio il finale non cambia.
- Browser [SIMULAZIONE, Chromium 412×860]: `tools/verify_bond_r45.cjs` 8 su 8, immagini in `docs/evidence/r45/`.
- APK 52 (debug): 114 793 803 byte, SHA-256 `e5e607dacf8841b47f9ed0f2d62415a4596fbaf30517aa8edde8b3a5e0f43740`, solo `VIBRATE`. `app.js` 457 189 byte.
- Grafica e suono del legame: prompt v4 per Argon, `requests/argon-legame-finali-v4-20261117/PROMPT_ARGON.md`.
- Fuori dal codice, invariato: 0/5 playtest, prova su telefono, acquisto Play, firma, ascolto della musica.
