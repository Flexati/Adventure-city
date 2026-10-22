# RELEASE_GATE — CHRONOS: Nox & Lulù, canone v8.0

**Stato corrente: BLOCKED per la vendita.** L’applicazione `0.10.0-v8.0-rc.1` introduce il canone
Audience-First v8: quattro hub esplorabili con ritorni, otto incarichi, negozi e preparazioni,
ricongiungimento prima di Archon, fuga dal crollo, conclusione e scena del seguito.

Le nuove prove sono in [evidence/v8](evidence/v8/README.md). Le sezioni seguenti documentano la base
v0.9 e non certificano automaticamente questa versione. Restano necessari telefono fisico,
ascolto umano, test cieco e adeguamento Play Store; l’APK consegnato è debug/API 35.
La CI storica `39687984453` è completata: nessuna attesa `sleep 900` viene riavviata.

---

# RELEASE_GATE — City Adventure v0.9-rc.1

**Stato: BLOCKED per la vendita.** Questa è una release candidate tecnica, non una certificazione
commerciale. Nessun AAB di produzione pubblicato. Le prove automatiche non sostituiscono persone,
speaker di un telefono, controlli su vetro e prestazioni sostenute su Android.

## Direzione di gioco rc.2 — 2026-10-21

**Resta BLOCKED.** Branch `ccr-02793d11-6genwh` (base `75e8452` + `main`). Modifiche giocabili:
eroe inquadrato fra HUD e comandi, obiettivi con verbo e progresso, card con obiettivo/tappa/salvataggio,
checkpoint dei tre boss con ripresa dopo sconfitta o riavvio, consiglio di sconfitta, EVE-Prime equa.
Prove in [director](evidence/chrono_shadows/director/README.md): 85/85 test, campagne A/B/C 20/20 con i
tre finali (fragile, caldo, esitante), zero frame con l'eroe occluso, flusso boss 13/13 su tre boss e
sul bundle APK, emulatore API 35 con WebView reale verde in CI
([#39687984453](https://github.com/Flexati/Adventure-city/actions/runs/39687984453)). Nessun telefono fisico, ascolto umano o test cieco.
Nuovo blocco Play: target API 36 obbligatorio dal 31/08/2026, package debug, nessun AAB
([checklist](PLAY_RELEASE_CHECKLIST.md)).

## Audit della base v0.8

### Produzione artistica Chrono Shadows — 2026-10-21

**Resta BLOCKED.** Il pacchetto candidato contiene 36 atlanti, 816 frame/moduli,
251 definizioni di animazione/posa e 28 Ogg originali. Nox/Lulù e la narrativa sono conservati.
Soltanto risorse compatibili con eventi e geometrie esistenti sono collegate al runtime;
NPC, alleati, negozi e boss di riserva non diventano automaticamente nuove funzionalità.

Le prove della v0.9 riportate sotto sono storiche. Le nuove prove sono nel
[rapporto Chrono Shadows](evidence/chrono_shadows/README.md): 74 test Node, viewport richieste,
audio campionato/lifecycle, prestazioni Chromium, sequenza di sconfitta nel gioco, bundle classico
e APK debug ricostruito. Non sono state eseguite prove su emulatore o telefono fisico in questa sessione,
né ascolto umano o verifiche termiche/sostenute. Il nuovo APK è un artefatto debug del branch dedicato,
non una release commerciale o una certificazione della qualità finale.

### Evidenza storica della base

La PR [#4](https://github.com/Flexati/Adventure-city/pull/4), branch `ccr-5ed8f6bd-u7sh6a`,
contiene davvero il gioco al commit `eb85a992ae73e2c067282b4d56a318926bf0c07a`.
Sono presenti 20 tappe, 11 missioni a piedi, 5 corse, 3 boss, scelte incrociate, salvataggi v6
con migrazione e quattro temi originali. I 58 test originali sono stati rieseguiti: tutti verdi.
Gli ZIP legacy e il workflow `transfer-city-adventure.yml` sono assenti da quel branch.
`main` non è stato modificato o fuso da questo intervento.

**Aggiornamento rispetto al resoconto precedente:** la
[CI v0.8 #39457856825](https://github.com/Flexati/Adventure-city/actions/runs/39457856825)
è verde sull'esatto commit v0.8. I log confermano compilazione APK, avvio dell'emulatore API 35
con SwiftShader e verifica del WebView reale (apertura, lifecycle, movimento, pausa e quattro
viewport). Questa prova riguarda **v0.8**, non certifica automaticamente le modifiche v0.9.

## Modifiche verificabili della v0.9

- **Geometria:** Blackout conserva il suo incrocio introduttivo. Le altre dieci missioni usano quattro
  strutture modulari: L, asse con camere laterali, galleria di contenimento, arena con coperture.
  Muri, disegno, visibilità, proiettili, arrivi e navigazione derivano dalla stessa griglia 24×24.
  Il riuso resta intenzionale: non sono dieci mappe uniche. Testure e terminali riusano gli asset
  esistenti, con palette cian per Nox e ambra per Lulù. La superficie viene composta una volta
  per missione; niente shader WebGL o generazione casuale durante il frame.
- **Finale:** illustrazione dedicata del ricongiungimento, coerente con i ritratti, con inquadratura
  centrale per verticale e orizzontale; tre sfondi vettoriali distinti per caldo, esitante e fragile.
  Il vetro sul davanzale e le due luci riprendono i motivi della storia. Provenienza in
  [art-v09.json](art-v09.json); nessun nuovo sprite di combattimento dichiarato.
- **SFX:** 14 voci procedurali, tra colpi, impatti, barriera, Black Pulse, radio, passi e UI.
  Rumore e impulso del riverbero sono deterministici e creati una sola volta. Massimo 24 voci,
  limitazione della frequenza degli eventi e disconnessione dei nodi alla fine delle code.
- **Musica e ambienti:** quattro temi ricomposti con pause di frase, controcanto più leggero e
  percussioni meno dense. Al massimo due stream, crossfade equal-power di 2,2 s, tensione con
  rilascio di 5 s e tema del ricongiungimento al ritorno del Duo. Ambienti sintetici di porto,
  sottosuolo/città e motore modulato dalla velocità. Nessuna richiesta di rete a runtime.
- **Mix:** bus musica, SFX e ambiente; ducking durante dialoghi/scelte e barks, filtro sotto 34 Hz,
  compressore master (soglia −7 dB, rapporto 16:1, attacco 3 ms, rilascio 160 ms). È protezione
  dinamica con margine misurato, non una promessa di limiter brick-wall true-peak.
- **Correzioni emerse dalla QA:** proiettili agganciati ai nuovi muri, arrivo di Lulù proiettato
  su pavimento valido; una risposta tardiva del vecchio decoder non può spegnere il tema nuovo.
  La maschera del buio usa ora una luce pre-renderizzata e riutilizzata. Il calcolo dei raggi evita ora centinaia di ricampionamenti per colpo, conservando il limite a 4 px.
  La mappa statica viene rasterizzata alla scala fisica corrente e copiata 1:1. Quando due degli ultimi trenta frame superano 10 ms la sola scena riduce il pixel ratio (da massimo 1.75 fino a minimo 1);
  HUD/testo/pulsanti DOM restano alla risoluzione nativa, le illustrazioni usano il dettaglio pieno.
  I tre raster sono preparati prima di giocare: circa 23 MiB per la cache statica a 390×844/DPR 1.75,
  riutilizzati e liberati al cambio di mappa o scala. Il costo RAM va verificato anche sul telefono.

## Evidenze v0.9 (2026-10-20)

| Prova | Esito e limiti |
|---|---|
| `npm test` | **67/67 PASS**, nessun test saltato; include vincibilità di tutte le missioni su entrambi i rami, navigazione, proiettili, arrivi, race dei decoder, migrazioni e bundle classico |
| Web Audio in Chromium | **PASS**: tutti i 14 SFX producono audio finito, non nullo, senza voci residue; due temi decodificati e 24 voci simultanee senza clipping (picco 0,745, circa −2,56 dBFS); [misure](evidence/v09/audio-render.json) |
| Lifecycle audio, mute, impostazioni durante la pausa, riavvio missione, ritorno al menu, ripresa finale e save corrotto | **PASS**, input reali nel browser; [report](evidence/v09/runtime.json) |
| Bundle Android classico in Chromium/CDP | **PASS**, verificatore di CI: apertura, native pause/resume, movimento, pausa e 4 viewport; [report](evidence/v09/android-renderer-proof.json). Non è un telefono |
| Campagna completa nel browser, scelte opposte | **A e B: 20/20 PASS**, zero errori. A: 1 morte, finale fragile (44); B: 0 morti, finale caldo (66). Clock browser accelerato, non prova di durata/FPS ([A](evidence/v09/campaign-a.json), [B](evidence/v09/campaign-b.json)). Il bot azzera correttamente il proprio stato sui retry |
| Tour visivo 4 viewport | **PASS**: 68 casi nel tour completo + 28 casi sulle risorse finali; nessun overflow o target fuori schermo; l’ultimo passaggio verifica anche entrambe le dimensioni ≥44 px ([tour completo](evidence/v09/tour.json), [tour finale](evidence/v09/final-tour.json)) |
| CI Web v0.9 | **PASS** al commit QA `6207acf`: [#39468089084](https://github.com/Flexati/Adventure-city/actions/runs/39468089084), 67 test, rendering Web Audio/lifecycle, 64 scenari; massimo p95 8,8 ms normale / 11,9 ms a 4× ([log sintetizzato](evidence/v09/ci-web-summary.json)) |
| Budget per frame | **PASS per il budget p95 del callback**: 64 scenari, audio attivo, DPR richiesto 1.75, raster software, quota 2 CPU. Massimo p95 **6,4 ms** normale e **9,2 ms** a CPU 4× ([dati](evidence/v09/performance.json)). **Non è PASS per 60 fps stabili nel profilo 4×**: vedere i picchi sotto |
| APK/emulatore v0.9 | **PASS** al commit QA `6207acf`: [CI Android #39468081324](https://github.com/Flexati/Adventure-city/actions/runs/39468081324), APK installato su API 35, tocchi fidati/input tastiera, musica attiva, pausa/ripresa nativa con sospensione DSP, movimento e 4 viewport ([prova](evidence/v09/android-emulator-proof.json)). Uscita audio dell’emulatore disabilitata: verifica dello stato audio, non ascolto umano |
| Telefono fisico, ascolto umano, test cieco | **NON ESEGUITI** |

Profilo normale: **7.521 frame**, p99 massimo **13,9 ms**, picco **19,7 ms**, rAF p95 massimo
**16,8 ms**, **zero** intervalli rAF oltre 25 ms. Profilo CPU 4×: **2.297 frame**, p99 massimo
**24,8 ms**, picco **101,6 ms**, rAF p95 massimo **33,4 ms**, **201** intervalli oltre 25 ms.
Il pixel ratio effettivo è registrato per ogni campione aggregato (minimo 1 nel profilo stress).
La prova iniziale a dettaglio pieno falliva il budget; anche il primo controller adattivo aveva
[2 casi fuori budget](evidence/v09/performance-first-adaptive.json). Questi risultati sono conservati,
non usati come prova di superamento. Il report finale ha 64 casi completi e nessun errore.

Il costo misurato del callback include logica e chiamate Canvas. Il raster asincrono e la
presentazione sono distinti: registriamo anche gli intervalli rAF. Nemmeno un p95 sotto 16 ms
sul server dimostra 60 fps stabili su un telefono economico o una sessione di 20 minuti.

## Punteggi editoriali provvisori (0–10)

Non sono voti dei giocatori e non sono una media di test verdi. Le colonne obiettivo indicano
il traguardo richiesto, non un risultato assegnato prima delle prove.

| Dimensione | v0.8 | v0.9 provvisorio | Motivo / limite |
|---|---:|---:|---|
| Prima impressione | 7.5 | 7.5 | menu originale; illustrazione del finale più curata |
| Primi 10 minuti | 7.0 | 7.0 | tutorial invariato; nessun nuovo giocatore |
| Controlli | 7.0 | 7.0 | layout verificato, nessuna prova su vetro |
| Combattimento | 7.0 | 7.5 | coperture, nuovi angoli, percorsi, impatti distinti; animazioni ancora a quattro frame |
| Guida | 6.5 | 6.5 | feedback motore migliorato, fisica e corse invariate |
| Varietà missioni | 7.0 | 8.0 | quattro geometrie nuove oltre al tutorial; tipi di missione distinti; alcuni layout ricorrono |
| Storia | 7.5 | 8.0 | finale illustrato; scrittura e durata non sono aumentate |
| Relazione | 7.5 | 8.0 | ricongiungimento con identità visiva e musicale; da valutare alla cieca |
| Arte | 6.5 | 7.5 | illustrazione e tre sfondi dedicati; mappe composte da texture esistenti |
| Animazione | 6.0 | 6.0 | non sono stati aggiunti nuovi atlanti d'azione |
| Audio | 5.5 | 7.0 | SFX, ambienti, transizioni e master nuovi, misure buone; manca l'ascolto umano |
| UI | 7.5 | 7.5 | pannelli esistenti e testo leggibile; nessun restyling completo |
| UX mobile | 7.0 | 7.0 | quattro viewport; mancano dita, speaker e lifecycle su telefono fisico |
| Prestazioni | 6.0 | 7.0 | profilo normale regolare, budget p95 superato anche a 4× con dettaglio adattivo; picchi nello stress e nessun telefono fisico |
| Rifinitura | 6.5 | 7.5 | risorse offline, race audio e collisioni coperte da regressioni |
| Finale | 7.0 | 8.0 | illustrazione e tre atmosfere; epilogo e due colpi restano interattivi |
| Rigiocabilità / scelte | 7.5 | 7.5 | scelte e rami invariati |
| Valore a €4,99 | 6.0 | 7.0 | ripetizione strutturale ridotta, audio più completo; durata e giudizio d'acquisto non validati |

**Obiettivi richiesti:** storia/relazione 8.5, combattimento 8, audio 7.5, valore 8.
Non sono ancora dimostrati. Durata umana 45–70 minuti: rimane una **stima ereditata**, non una
misura raccolta su questa release. I tempi dei bot sono riportati separatamente.

## Mancanze e condizioni per sbloccare

1. Eseguire il [protocollo cieco v0.9](BLIND_PLAYTEST_V09.md) con almeno cinque persone: nessuna
   confusione bloccante nei primi dieci minuti, almeno 4/5 finiscono, nessuna morte ingiusta irrisolta.
2. Provare il **nuovo** APK su Android medio e fascia economica, speaker e cuffie; controllare latenza,
   fatica sonora, crossfade, ripresa, crash/logcat e prestazioni sostenute. Non è possibile assegnare
   7.5 all'audio soltanto perché i campioni non clippano.
3. Le pose delle scene precedenti e gli atlanti di combattimento restano il limite d'animazione.
   Le dieci missioni riorganizzate usano quattro moduli, non dieci scenari disegnati individualmente.
4. Restano i criteri commerciali della base: ogni dimensione ≥8, nucleo ≥8.5, valore ≥8.5,
   emulatore corrente verde e almeno un telefono reale con 60 fps stabili o 30 fps regolari
   esplicitamente scelti e verificati. I target del brief non sono un'autorizzazione a dichiarare
   soddisfatti questi criteri senza prove.

## Build per il test cieco

Codice applicativo: `19a33fa133eebe366218f425573975f8d37a9e6a` (v0.9.0-rc.1).
Build e CI finali al commit QA `6207acf8c73352a7ad6040b07d406c84717c384a`;
`game/`, dipendenze e sorgenti Android sono identici al commit applicativo.
Le successive modifiche al report non richiedono un nuovo APK.
[APK debug della CI](https://github.com/Flexati/Adventure-city/blob/build/v09-rc-39468081324/dist/City_Adventure_v0.9_RC_debug.apk):
43.229.589 byte, SHA-256 `c2c816a0eb221ee083428180e9fdc48b81831f4256daa346638cb0a5163469e2`.
Usare un’installazione pulita, come richiesto dal protocollo. Questo APK non è un AAB di produzione.
Le successive modifiche di QA documentano le prove e rafforzano il verificatore: non modificano
il codice o gli asset di `game/`.
