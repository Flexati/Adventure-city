# CHRONOS V9 — stato di ripresa

Aggiornato: 2026-10-24 UTC

Branch / HEAD / worktree pertinente: `work/chronos-adventure-commercial` /
`2f3ae016da83d2da50ee1fc63055915fa2793ef8`; evidence pack e stato in
aggiornamento dopo il commit applicativo.

Build e piattaforma: web ESM e bundle classico Android generato localmente dal
commit `2f3ae01`; nessun APK compilato e nessuna build commerciale. Run web
GitHub Actions `40107047107` PASS sul predecessore `105782b`; ultima prova
Android PASS `40086634128` su `83908a7`, quindi non certifica il commit corrente.

Gate correnti e prove che li sostengono: G0–G5 e G4.5 restano BLOCKED. G0 dispone
di 137 test locali PASS e del run web precedente PASS; manca una prova Android
pertinente al commit corrente per offline, restart processo, renderer recovery e
lifecycle. Le preview V9 non valgono come integrazione campagna.

Blocco in lavorazione: E02 — barra vita implementata e verificata in browser e
bundle; stato `PARTIALLY_VERIFIED` finché manca la WebView Android pertinente.
E00 è VERIFICATA come riconciliazione. E01 resta BLOCCATA_DA_DIPENDENZA nativa.

Ultimo risultato verificato: 137/137 test PASS; `qa:v9` PASS con 41 soggetti di
scope e 129 brief audio esplicitamente mancanti; `qa:preproduction` PASS non
strict. Prova HUD browser 11 casi PASS, runtime/lifecycle PASS, tour di 20 casi
su quattro viewport PASS e campagna A 30/30 fino ai postcrediti PASS.

File modificati: il commit `2f3ae01` contiene E00, HUD, bundle, test e artefatti.
Questo evidence pack e lo stato sono la seconda modifica, da commit separato.

Test eseguiti, risultati e limiti: `npm test` 137 PASS; `npm run qa:v9` PASS;
`npm run qa:preproduction` PASS non strict; `verify_health_bar.cjs` 11 casi;
`verify_runtime_v09.cjs` PASS; tour mirato 20 casi; campagna A 30/30. Browser e
clock accelerato non misurano touch su vetro, FPS, termiche, ascolto o divertimento.

Difetti e dipendenze esterne: i binari V8.5 su `origin/main@93c128e` non sono un
WebP e uno ZIP validi; README e Bible sono leggibili. Recuperare le 18 tavole
sorgente valide. Serve inoltre una build Android del commit pertinente e il
dispositivo/emulatore previsto per chiudere G0; tester e telefoni fisici restano
dipendenze successive.

Aggiunta creativa in sperimentazione: nessuna; i tre nuovi incontri sono scope
confermato, non aggiunte opzionali, e restano `NOT_ACCEPTED`.

Prossima azione concreta: ottenere Android SDK + emulatore/dispositivo e provare
il commit `2f3ae01` per E01/E02; in parallelo iniziare E03 dai percorsi reali di
pointer cancel, focus/background, doppio evento e stabilità dei pulsanti.
