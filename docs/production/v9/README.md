# CHRONOS: NOX & LULÙ — controllo V9

Repository operativo: **Flexati/Adventure-city**. Baseline congelata: PR #6,
`feat/audience-first-v8`, `70b18933610e140f43a36de9ace8fde655e508c2`.
Ramo di intervento: `work/chronos-adventure-commercial`; build Android verificata
dal sorgente `50b9d94`. Nessun
trasferimento o force-push del main.

**BASELINE_STATUS = VERIFIED · COMMERCIAL_RELEASE = BLOCKED**

## Risultato e limiti

La baseline originale completa localmente A/B/C con Chromium di sistema: 30 tappe,
otto incarichi, due preparazioni e postcrediti. La CI storica dello stesso commit
fallisce A/B e supera C. Il connettore GitHub ha ora recuperato log e snapshot storici, dopo i precedenti
403 dei download diretti. A/B ripetono 98/102 retry in `evacuation`: il pilota di
test oscilla attorno alla soglia di velocità e azzera la sosta di soccorso da 0,8 s.
La policy originale fallisce anche nella riproduzione deterministica a 130/250 ms
fra input; la nuova mantiene il freno fino al caricamento. La fisica e la missione
restano identiche. La correzione è confermata dalla CI 39844388435: A/B/C completano 30 tappe,
otto incarichi, due preparazioni e postcrediti, senza retry né errori.

Con il browser incluso in Playwright è riprodotta una seconda anomalia concreta:
il prologo cambia pannello fra `isVisible` e l'input del bot. Il test tentava di
cliccare un pulsante ormai nascosto. Il nuovo harness tollera soltanto la
scomparsa del controllo, conserva gli errori sui controlli ancora visibili,
rilascia i tasti durante i lock e controlla il limite temporale anche nei rami UI.
Registra versione browser, clock, commit, hash sorgenti, input e stato all'errore.
La race del prologo è distinta dai timeout di evacuazione documentati negli snapshot storici.

Il salvataggio schema 7 ora ha checksum, copia locale di recupero e gestione
esplicita di corruzione, quota e accesso negato. Package, firma, versionCode,
canone, prezzi, missioni, collisioni e difficoltà non vengono modificati.

Verifiche locali correnti: **141 test PASS**. Il run web `40107047107` sul commit
esatto `105782b` è PASS nei job campagna A/B/C e browser, incluse le preview di
combattimento e delle sette gare. Queste restano prove di laboratorio, non
integrazione nella campagna. Le precedenti prove comprendono inoltre
A/B/C completi sul browser Playwright (C sul bundle classico), runtime/audio,
hub e recupero dei salvataggi PASS. La galleria presenta otto immagini e quattro
audio senza overflow nei quattro formati di riferimento. I report delle campagne
sono legati al commit applicativo tramite confronto dell'hash dei sorgenti,
documentato in `docs/evidence/v9/source-binding.json`.

Il run Android autoritativo `40183475468` sul commit `50b9d94` è PASS: compila
e installa l’APK, usa una WebView reale con touch fidati, attraversa l’apertura,
verifica audio e viewport, termina e riavvia il processo conservando lo schema 7,
recupera la copia di backup dopo corruzione, avvia con entrambe le radio disattivate,
recupera da un crash reale del renderer e osserva background/ripresa del sistema.
L’APK e le prove sono preservati nel ramo `build/chronos-v8-rc-40183475468`.

| Requisito G0 | Esito corrente |
|---|---|
| Baseline congelata e percorsi locali | Verificati negli ambienti dichiarati |
| Timeout CI A/B | Pilota di test in evacuation riprodotto; fix confermato A/B/C in CI |
| Salvataggi: checksum, backup e fault injection | Verificati in unit/browser |
| Offline e kill Android sulla nuova build | Verificati nel run Android `40183475468` |
| Tracciabilità e controllo della chiusura gate | Verificati; G0 PASS |

## Artefatti obbligatori

| Artefatto | File autorevole V9 | Stato |
|---|---|---|
| Tracciabilità | `requirements.json` | 33 requisiti con owner, costo stimato, rischio, criterio ed evidenza |
| Evidence Pack | `evidence.json` | Evidenze con hash; non sostituisce prove mancanti |
| Gate | `gates.json` | G0 PASS; G1–G5 e G4.5 restano bloccati finché i criteri sono incompleti |
| Canone | `canon-compliance.json` | Revisione umana pendente; canone v8 prevale sui testi v6 |
| Economia | `economy.json` | Spec derivata da `game/hubs.mjs`, verificata contro il runtime |
| Salvataggi | `save-spec.json` | Schema 7, integrità, backup, atomicità e limiti documentati |
| Missioni/incontri | `completion-cards.json` | 22 card preliminari; nessuna accettazione di produzione implicita |
| Scope | `scope-charter.json`, `scope-changes.json` | Prodotto approvato: 9 regioni, 17 incontri, 7 gare; gate tecnici pendenti |

Gli owner sono ruoli di responsabilità; i ruoli umani non ancora assegnati o
approvati restano pendenti. Le stime in ore non sono consuntivi né budget approvati.

## Grafica e audio

Il riferimento `origin/main@93c128e` contiene README e Bible V8.5 leggibili, ma
i due binari dichiarati come master WebP e archivio ZIP non hanno formati validi:
il WebP non è riconosciuto e lo ZIP non possiede una directory centrale. Hash e
procedura sono in `docs/evidence/v9/v85-reference-audit.json`. Non vengono copiati
nel ramo operativo né contati come diciotto tavole disponibili.

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

I test fixture sono distinti dalle campagne da Nuova storia. Clock accelerato e
browser non misurano durata umana, FPS su telefono, termiche o qualità percepita.
Il run Android copre kill e recovery su emulatore, non certifica dispositivi fisici.
Ogni gate successivo resta obbligatorio; il rilascio commerciale è subordinato a G5.

## HUD vita V9

I cuoricini sono stati sostituiti nel runtime da una barra numerica collegata a
`hp/maxHp`, con coda breve sul danno e aggiornamento immediato sulla cura. Vita
di Nox/Lulù, integrità del veicolo, monete e boss usano componenti distinti.
L’avviso basso aggiunge testo e tratteggio, non solo colore. Le prove mirate sono
in `artifacts/v9-health-bar/`: 11 casi browser, quattro viewport, lifecycle e un
percorso A completo. La WebView Android mostra la barra numerica nella build
pertinente; `G3-HUD` è `VERIFIED`. Il controllo umano su telefoni fisici resta
un requisito dei gate successivi e non autorizza il rilascio.

## Controlli touch V9

Il joystick applica una deadzone radiale e normalizza le diagonali; la guida usa
deadzone assiale e sterzo limitato. Pointer touch e tastiera mantengono stati
indipendenti, `pointercancel`, perdita della cattura, blur e pagehide azzerano i
comandi trattenuti, mentre Spazio/Invio sui pulsanti non propagano azioni globali.
Le prove in `artifacts/v9-controls/` coprono 9 casi automatici, quattro viewport,
multitouch e campagna A completa. Il run Android `40183475468` lega lo stesso
sorgente a WebView, lifecycle e cold start offline: `G3-INPUT` è `VERIFIED` sul
piano tecnico. Comfort a due pollici e dispositivi fisici restano prove umane.
