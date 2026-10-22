# CHRONOS: NOX & LULÙ — controllo V9

Repository operativo: **Flexati/Adventure-city**. Baseline congelata: PR #6,
`feat/audience-first-v8`, `70b18933610e140f43a36de9ace8fde655e508c2`.
Ramo di intervento: `work/v9-g0-media`. Nessun trasferimento o force-push del main.

**BASELINE_STATUS = PARTIALLY_VERIFIED · COMMERCIAL_RELEASE = BLOCKED**

## Risultato e limiti

La baseline originale completa localmente A/B/C con Chromium di sistema: 30 tappe,
otto incarichi, due preparazioni e postcrediti. La CI storica dello stesso commit
fallisce A/B e supera C. I log/artifact della run non sono scaricabili in questo
ambiente: l'endpoint di download restituisce HTTP 403. La causa dei timeout CI
rimane **non determinata**: il PASS locale non autorizza G0 PASS.

Con il browser incluso in Playwright è riprodotta una seconda anomalia concreta:
il prologo cambia pannello fra `isVisible` e l'input del bot. Il test tentava di
cliccare un pulsante ormai nascosto. Il nuovo harness tollera soltanto la
scomparsa del controllo, conserva gli errori sui controlli ancora visibili,
rilascia i tasti durante i lock e controlla il limite temporale anche nei rami UI.
Registra versione browser, clock, commit, hash sorgenti, input e stato all'errore.
Questa correzione **non è dichiarata causa dimostrata dei timeout CI A/B**.

Il salvataggio schema 7 ora ha checksum, copia locale di recupero e gestione
esplicita di corruzione, quota e accesso negato. Package, firma, versionCode,
canone, prezzi, missioni, collisioni e difficoltà non vengono modificati.

Verifiche locali registrate: **103 test PASS**, ulteriori 12 controlli mirati PASS,
A/B/C completi sul browser Playwright (C sul bundle classico), runtime/audio,
hub e recupero dei salvataggi PASS. La galleria presenta otto immagini e quattro
audio senza overflow nei quattro formati di riferimento. I report delle campagne
sono legati al commit applicativo tramite confronto dell'hash dei sorgenti,
documentato in `docs/evidence/v9/source-binding.json`.

| Requisito G0 | Esito corrente |
|---|---|
| Baseline congelata e percorsi locali | Verificati negli ambienti dichiarati |
| Causa dei timeout CI A/B | **Non determinata — BLOCKED** |
| Salvataggi: checksum, backup e fault injection | Verificati in unit/browser |
| Offline e kill Android sulla nuova build | Prova nativa CI predisposta, ancora pendente |
| Tracciabilità e controllo della chiusura gate | Verificati; G0 non chiuso |

## Artefatti obbligatori

| Artefatto | File autorevole V9 | Stato |
|---|---|---|
| Tracciabilità | `requirements.json` | 31 requisiti con owner, costo stimato, rischio, criterio ed evidenza |
| Evidence Pack | `evidence.json` | Evidenze con hash; non sostituisce prove mancanti |
| Gate | `gates.json` | G0–G5 bloccati finché i criteri sono incompleti |
| Canone | `canon-compliance.json` | Revisione umana pendente; canone v8 prevale sui testi v6 |
| Economia | `economy.json` | Spec derivata da `game/hubs.mjs`, verificata contro il runtime |
| Salvataggi | `save-spec.json` | Schema 7, integrità, backup, atomicità e limiti documentati |
| Missioni/boss | `completion-cards.json` | 19 card preliminari; nessuna accettazione di produzione implicita |
| Scope | `scope-charter.json`, `scope-changes.json` | Slice come minimo; nessuno scope commerciale approvato |

Gli owner sono ruoli di responsabilità; i ruoli umani non ancora assegnati o
approvati restano pendenti. Le stime in ore non sono consuntivi né budget approvati.

## Grafica e audio

Anteprime locali in `assets/preproduction/v9/index.html`, servite dal server del
repository. Gli originali generati sono preservati. Copertine, logo, modello con
Nox lievemente schiarito, atlanti candidati e tavole di successo sono **bozze**.
Gli atlanti prodotti hanno dimensioni 1254×1254, incompatibili con il contratto
1024×1024/4×4: sono messi in quarantena; il renderer non li usa.

Sonilo ha prodotto due brani da 60 s e due SFX: titolo, tensione, due colpi,
Risonanza. I master M4A restano integri; gli OGG locali sono derivati con mix
prudente e decodifica verificata. Ascolto umano, loop e licenze specifiche per
distribuzione nel gioco restano da verificare. Nessun nuovo audio è caricato dal
runtime o incluso nel pacchetto Android.

La quota Sonilo è terminata dopo queste quattro generazioni. Mancano quattro
temi, stinger, dieci effetti e ambiente. Le alternative sono state provate:
Everygen richiede nuova autorizzazione audio; VideoGen/Runway/ImagineArt sono
limitati dall'account; Magnific richiede il completamento dell'accesso iniziale.
Non sono riportate come generazioni riuscite.

## Riproduzione

```sh
npm ci
npx playwright install chromium
npm test
node tools/verify_v9_governance.mjs
node tools/verify_preproduction.mjs
python3 -m http.server 8090 --bind 127.0.0.1
# In un secondo terminale:
node tools/verify_save_recovery.cjs http://127.0.0.1:8090/game/ save-recovery.json
CITY_VIRTUAL_TIME=1 node tools/verify_campaign_browser.cjs http://127.0.0.1:8090/game/ a campaign-a
# Ripetere b e c; per il bundle usare android/build/assets/game/ dopo il packager.
```

`verify_preproduction.mjs --strict` deve fallire finché esistono bozze o atlanti
non conformi. La modalità normale passa solo se tali asset restano dichiarati
non integrabili. `ffmpeg` è necessario per la verifica audio.

I test fixture sono distinti dalle campagne da Nuova storia. Clock accelerato,
browser e simulazione della chiusura del processo non misurano durata umana,
FPS su telefono, kill Android, termiche o qualità percepita. Ogni gate successivo
resta dipendente da G0; il rilascio commerciale resta subordinato a G5.
