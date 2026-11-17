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
