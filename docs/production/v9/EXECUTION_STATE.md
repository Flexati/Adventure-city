# CHRONOS V9 — stato di ripresa

Aggiornato: 2026-10-24 UTC

Branch / HEAD / worktree pertinente: `work/chronos-adventure-commercial` /
`105782bded77603e052551aaf478813c288b984e`; modifiche E00 non ancora commit.

Build e piattaforma: sorgenti web/Android wrapper della baseline V8 + laboratori
V9. Nessuna build commerciale. Run web GitHub Actions `40107047107` PASS sullo
stesso HEAD; ultima prova Android PASS `40086634128` su `83908a7`, quindi non
certifica il commit corrente.

Gate correnti e prove che li sostengono: G0–G5 e G4.5 restano BLOCKED. G0 dispone
di 133 test locali PASS e del run web corrente PASS; manca una prova Android
pertinente al commit corrente per offline, restart processo, renderer recovery e
lifecycle. Le preview V9 non valgono come integrazione campagna.

Blocco in lavorazione: E00 — riconciliazione di fonti e scope; pronto per
verifica governance. E01 resta bloccato sulla prova Android corrente.

Ultimo risultato verificato: baseline locale prima delle modifiche, 133/133 test
PASS; `qa:v9` e `qa:preproduction` PASS. CI `40107047107` confermata PASS per
campagne A/B/C e browser sul commit `105782b`.

File modificati: scope charter/change, requirements, evidence pack, completion
cards, verifier/test governance, fonte 06, audit V8.5, README/IMPLEMENTATION e
questo stato. Consultare `git status --short` per l’elenco autorevole.

Test eseguiti, risultati e limiti: `npm test` 133 PASS; `npm run qa:v9` PASS con
il vecchio scope di 38 soggetti prima della modifica; `npm run qa:preproduction`
PASS in modalità non strict. Browser e clock accelerato non misurano touch su
vetro, FPS, termiche, ascolto o divertimento. Rieseguire dopo E00.

Difetti e dipendenze esterne: i binari V8.5 su `origin/main@93c128e` non sono un
WebP e uno ZIP validi; README e Bible sono leggibili. Recuperare le 18 tavole
sorgente valide. Serve inoltre una build Android del commit pertinente e il
dispositivo/emulatore previsto per chiudere G0; tester e telefoni fisici restano
dipendenze successive.

Aggiunta creativa in sperimentazione: nessuna; i tre nuovi incontri sono scope
confermato, non aggiunte opzionali, e restano `NOT_ACCEPTED`.

Prossima azione concreta: rieseguire unit test e governance sul conteggio 41
(9 regioni + 17 incontri + 7 gare + Veyra + 5 armi + 2 lingue); poi tentare la
build Android locale e classificare con precisione il blocco E01. Se G0 resta
dipendente dall’ambiente nativo, procedere con E02 barra vita, che è isolabile.
