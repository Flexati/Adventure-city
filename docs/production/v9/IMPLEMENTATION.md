# V9 — stato dell’implementazione

## Mandato confermato

Chronos Adventure: Nox & Lulú, Android premium offline €4,99, italiano e inglese.
Tutte le regioni dell’espansione sono obbligatorie nel primo gioco. La richiesta
«Implement the proposed plan» autorizza il lavoro; i gate misurano la qualità,
non richiedono una nuova approvazione dell’utente per ogni intervento.

Correzione confermata dall’utente il 24 ottobre 2026: **7 gare**, con la rivale
Veyra “Ash” Kor. La precedente selezione di tre eventi non è lo scope finale.

Fonti: le cinque risposte condivise conservate in `sources/`, canone
`docs/NARRATIVE_V80.md`, Bible V8.5 sul ramo `origin/main`. I collegamenti pubblici
espongono risposte singole: non costituiscono accesso alla cronologia privata.

## Implementato in questa consegna

- Android: errori HTTP della pagina principale mostrano il recupero nativo;
  la WebView in errore viene distrutta e i callback obsoleti vengono ignorati.
- CI: test di cold start con radio disabilitate, crash reale del renderer,
  pressione del pulsante nativo Riprova, conservazione di entrambe le copie
  del salvataggio, background e ripresa tramite comandi del sistema operativo.
  Il test ripristina lo stato delle radio anche in caso di errore.
- Gate G4.5 incluso nell’ordine obbligatorio; prove tecniche non possono
  sostituire le prove umane. Scope completo e lingue registrati.
- Sistema armi V9: C-9, raffica VX-9, rosata R-12, perforazione H-17,
  concatenamento/stordimento ARC-7; munizioni, ricarica, cambio, cooldown,
  ricompense idempotenti e validazione dei salvataggi dell’equipaggiamento.
- Integrazione nel motore tramite `combatV9` esplicito della missione. Nessuna
  missione della campagna corrente attiva ancora il sistema: il G0 rimane aperto.
- Arena browser IT/EN con sprite esistenti, tastiera/touch, pausa e salvataggio
  separato. Tutte le armi sono sbloccate per le prove; non simula gli sblocchi
  narrativi e non modifica i salvataggi della campagna.

## Seconda consegna: gare competitive

- Sette eventi di sviluppo giocabili: tre ad Ash Docks, due a Solkara,
  uno ad Aurelia Span e il duello conclusivo contro Veyra.
- Veyra e due rivali, conto alla rovescia, guida con acceleratore/freno/sterzo,
  classifica, tre checkpoint per evento, danni e recupero del veicolo.
- Penalità al traguardo incluse nei tempi e nella classifica definitiva.
  Completare basta per registrare progresso; vincere assegna un premio extra.
- Registro separato della preview: 15 crediti alla prima conclusione e 10 alla
  prima vittoria; replay e riavvio non duplicano i premi. Queste cifre non sono
  ancora integrate o bilanciate nell’economia della campagna.
- UI italiano/inglese, tastiera e touch, pausa, ripartenza e persistenza dei
  risultati. Il motore non modifica le cinque sequenze di guida esistenti.
- Le gare usano grafica funzionale di sviluppo; non rappresentano l’arte finale
  delle città, né sostituiscono le rispettive missioni narrative.
- Prove: `tests/racing-v9.test.mjs`, `tools/verify_racing_v9.cjs`, report in
  `artifacts/v9-seven-races/`. Tutti e sette gli eventi completati nel browser con
  input tastiera reali e clock accelerato; touch mobile verificato.

## Cosa non è completato

Il circuito di sviluppo ora comprende sette eventi e una rivalità progressiva:
Ash Docks, Fra le gru, Luci spente, Fra i convogli, Il fronte di sabbia,
Ponti del tempo e La linea di Ash. Slalom a varchi stretti, visibilità notturna,
convogli mobili, raffiche di vento e ponti temporali cambiano le regole.
Il settimo evento è un duello fra Nox e Veyra. Dialoghi IT/EN prima e dopo ogni
gara reagiscono all’esito. Le sfide si sbloccano completando la precedente,
anche senza vittoria; i record delle tre vecchie prove restano leggibili.
La relazione raggiunge la conclusione attraverso sette risultati distinti,
senza poter accumulare progressione o premi ripetendo un solo evento.
Questi sistemi restano da integrare nella campagna narrativa e da rifinire
artisticamente: non costituiscono ancora una release commerciale.

## Chiusura obbligatoria delle cinque chat

I cinque documenti in `sources/` sono capitoli obbligatori dello stesso prodotto:
direzione artistica V8.5; combattimento, guida e comandi; produzione audio;
campagna e canone narrativo; mandato commerciale Android. Una preview o una
prova isolata non conclude il relativo capitolo. La release richiede che tutti
e cinque siano integrati nella stessa build, verificati secondo G0–G5 e privi
di placeholder commerciali. Il campo `required_chat_workstreams` dello scope
charter registra questa condizione e impedisce di ridurre la consegna alle sole
gare o ai soli sistemi tecnici.

Il gioco commerciale V9 **non è completato**. Non sono implementati i nuovi
boss, le nuove città, l’integrazione narrativa delle gare, l’intera localizzazione della storia, il cambio
cooperativo delle protagoniste, il salvataggio campagna V9 e la migrazione V8,
la nuova produzione artistica/audio o il rilascio AAB. Il salvataggio delle
armi dell’arena non è il nuovo schema di salvataggio della campagna.

G0 resta BLOCKED: nell’ambiente corrente non ci sono un dispositivo collegato,
platform-tools/emulatore installati o `/dev/kvm`. La compilazione dell’APK e le
prove Chromium non certificano le nuove procedure native. Non è stata avviata
una workflow remota, né pubblicata una release.

## Sequenza da integrare dopo il G0

1. Slice: Blackout → Rook → fuga → Moon, equipaggiamento Tessa e gara Veyra.
2. Famiglie Relay/Maintenance/Infected/Custodian e abilità progressive;
   Anchor, Volkov e Vega con incontri propri, non semplici sostituzioni grafiche.
3. Prima della separazione: Necropoli dopo Cathedral, quindi Glass Flood.
4. Nox: inseguimento esistente distinto dall’arena Iron Ring; Toxic Forge,
   Ash Docks e The Ram. Lulù: Iron Orchard → Eden → Archivio.
5. Ricongiungimento → Solkara → Noctis Vale → Aurelia Span → Osservatorio
   del Mezzogiorno Perduto → Ascesa cooperativa → Archon → conclusione.
6. Sette gare competitive ad Ash Docks, Solkara, Aurelia Span, distinte dalle cinque
   sequenze di guida attuali. Completarle permette di avanzare; vincerle premia.
7. Salvataggio campagna versionato, identificatori stabili, copia V8 conservata,
   migrazione all’ultimo punto compatibile senza saltare le regioni nuove.
8. IT/EN di tutto il gioco, asset V8.5 animati e verificati, 129 brief audio
   organizzati per funzione e nuovi brani per l’espansione.
9. G4 completo → due cicli umani con cinque nuovi giocatori ciascuno → G5:
   tre fasce Android fisiche, firma definitiva, aggiornamento, licenze e AAB.

I 14 incontri previsti sono Rook, Anchor, Volkov, Custode, Vega, EVE-Prime,
Archon, Bone Tyrant, Shadow Reaper, Forge Behemoth, Root Engine, The Ram,
Twelfth Observer e Lamplight King. Preservare i 19 civili, il vetro privo di
poteri, il consenso, la reunion non forzata, il colpo finale di Nox e la
sopravvivenza dell’infrastruttura Elyon.

## Riproduzione

```sh
npm test
npm run qa:v9
python3 tools/build_preview.py
python3 -m http.server 8090 --bind 127.0.0.1
# In un altro terminale, con Chromium disponibile:
CHROMIUM=/usr/bin/chromium node tools/verify_combat_v9.cjs
CHROMIUM=/usr/bin/chromium node tools/verify_startup_retry.cjs
```

Arena: `http://localhost:8090/game/v9-combat-lab.html`.
Preview portatile: `dist/Chronos_Adventure_Preview.zip`; servire via HTTP e
aprire `v9-combat-lab.html` oppure `v9-race-lab.html`. L’APK resta la campagna corrente con correzioni G0;
l’arena browser non è inserita nel menu dell’APK.

Su Android, dopo `verify_android_renderer.mjs` e la prova di riavvio:
`ADB=/percorso/platform-tools/adb node tools/verify_android_recovery.mjs`.
Usare un dispositivo di prova: la procedura modifica temporaneamente le radio
e provoca intenzionalmente il crash del renderer. Non dichiara PASS in assenza
della schermata nativa di recupero e del ritorno al gioco con dati intatti.
