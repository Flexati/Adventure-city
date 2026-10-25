# V10 runtime e mobile QA

GAMEPLAY_GATE / MOBILE_UI_GATE / PLAYTEST_GATE = BLOCKED.

Evidenze raccolte:

| Verifica | Risultato e limite |
|---|---|
| Suite Node | 149/149 PASS; log `artifacts/v10/unit-tests.log` |
| Auditor Python | 8/8 PASS, inclusi casi negativi; `audit-tests.log` |
| Browser audio/lifecycle | PASS tecnico; `runtime.json`; notifiche native simulate |
| Rendering audio | 11 PASS tecnici; `audio-render.json`; nessun ascolto umano |
| Mobile browser | 33 screenshot; `mobile/report.json`; tre viewport richiesti |
| Android packaging | Compilazione APK debug, firma e zipalign PASS; `android-build.log` |
| Bundle Android in Chromium | PASS tecnico; `packaged-browser.json`; esecuzione dello script classico realmente impacchettato, non WebView Android |
| Android su dispositivo | NOT_TESTED; nessun adb/dispositivo collegato disponibile |
| Campagna umana ~120 minuti | NOT_TESTED |

I tre viewport sono 360×800, 390×844 e 412×915.
Per ciascuno sono state catturate: title, Nox, Lulù, combat, boss attivo da
checkpoint, dialogue, hub, inventory, drive, pause e race-lab.
Il codice verifica assenza di overflow orizzontale, errori JS e caricamenti
V10 falliti; non certifica automaticamente contrasto, comfort o qualità grafica.

La schermata race-lab è la preview V9 separata, dichiarata nel report:
non dimostra integrazione gare nella campagna e non è una schermata APK.
Le scene sono seeded: non sono un attraversamento completo da Nuova partita.
I checkpoint, la route Nox e la route Lulù sono verifiche di caricamento,
non la prova che nove regioni e 17 incontri siano completi.

Nessuna modifica al formato dei salvataggi in questo strike.
La suite verifica i comportamenti esistenti di save/load; non si inventa
una nuova migrazione o una prova umana della progressione.

Procedura per riprodurre:

```sh
python3 -m http.server 8091 --bind 127.0.0.1
# In un secondo terminale, dalla radice del repository:
CHROMIUM=/usr/bin/chromium node tools/v10_asset_pack/runtime_qa.cjs
node tools/v10_asset_pack/audio_qa.cjs
CHROMIUM=/usr/bin/chromium node tools/verify_runtime_v09.cjs http://127.0.0.1:8091/game/ artifacts/v10/runtime.json
```

Le misure di prestazioni vanno eseguite separatamente, senza altre sessioni
browser/build concorrenti. Consultare V10_PERFORMANCE_REPORT.md.
