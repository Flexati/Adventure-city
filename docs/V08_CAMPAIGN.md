# City Adventure v0.8 — Campagna completa "Due colpi"

Stato: **implementata e giocabile da NUOVA STORIA al finale** (browser, input reali).
Canone di riferimento: `NOX_LULU_NARRATIVE_FUSION_V60.md`. Questa versione realizza U1–U7 del canone e
porta il gioco fino al ricongiungimento, con una struttura più compatta degli Atti IV–VI originali.

## Struttura (20 tappe)

| # | Tappa | Tipo | POV | Verbo principale | Scelta / conseguenza |
|---|---|---|---|---|---|
| 0 | Due colpi | scena interattiva | Nox | battere due volte, rispondere, raccogliere il vetro | — |
| 1 | 01 · Blackout | a piedi (tutorial) | Nox + Lulù | muoversi, sparare, schivare, attivare | **Officina / Rifugio** |
| 2 | Fuga dal Cantiere | guida | Nox | evitare la gang | Officina: +1 integrità · Rifugio: meno ostacoli |
| 3 | 02 · La breccia | a piedi | **Lulù** + Nox | Risonanza, ancore | promessa HELIOS («Non inviarla») |
| 4 | Sotto la breccia | guida | Nox | tre segnali | — |
| 5 | Tetto del porto | scena calma | entrambi | dialogo | **Perché lo tieni?** · **Chiedimelo prima / Scegli loro** |
| 6 | 03 · Ultima corsia | a piedi + evento | **Lulù** + Nox | filtri, autenticazione tenuta premuta | **Cancella l’avviso / Lascialo nel registro** |
| 7 | L’ultima evacuazione | guida | Nox | fermarsi e caricare | i 19 salvati ringraziano |
| 8 | 04 · Ora zero | boss (Custode) | Nox + Lulù | nuclei, boss a fasi | — |
| 9 | La firma | scena | entrambi | confronto, crollo | il dialogo cambia con le scelte 5 e 6 |
| 10 | 05 · Sotto il Nodo | a piedi, **buio** | Nox da solo | luce, Pulse, Black Pulse | **Cella termica: te / Unità 9** |
| 11 | 06 · La città senza di te | **difesa** | Lulù da sola | barriere, tenere la zona | la zona dipende da Officina/Rifugio |
| 12 | Anello di ferro | guida **inseguimento** | Nox (camion) | cambiare corsia sotto i droni | — |
| 13 | 07 · Porto spento | **infiltrazione** | Lulù da sola | coni visivi, colpi silenziosi | **Chiamare Nox? / Non chiamare** |
| 14 | 08 · Archivio EVE | buio + **boss specchio** | Nox da solo | variare il ritmo | **Conserva / Spegni EVE-Prime** |
| 15 | Tunnel muto | guida **al buio** | Lulù (Vortex, sedile vuoto) | impulsi di Risonanza | — |
| 16 | 09 · La linea | difesa | Lulù da sola | tenere la linea | **Vai adesso / Resta** |
| 17 | 10 · Risalita | a piedi | Nox da solo | assalto | — |
| 18 | 11 · Ora uno | boss (Archon) | Nox → **Lulù arriva in battaglia** | il Duo ritorna | — |
| 19 | Due colpi | scena finale | entrambi | **il giocatore batte due volte** | 3 varianti di ricongiungimento + epilogo |

## Conseguenze incrociate (scelte vissute dall'altro protagonista)

- **Officina/Rifugio** (Blackout) → corsa 1, *La città senza di te* (luogo da difendere, kit barriere di Dario o aiuto di Mira), Vortex di Lulù nel tunnel, epilogo.
- **Chiedimelo prima / Scegli loro** (tetto) → la frase con cui Nox affronta Lulù nella separazione.
- **Cancella / Lascia nel registro** (clinico, POV Lulù) → registro letto da Nox in *La firma*, Thermal Anchoring.
- **Cella termica** (Nox) → +2 vita nelle missioni di Nox **oppure** Unità 9 raggiunge *la linea di Lulù* (un'ondata in meno, messaggio di Nox), epilogo.
- **Chiamare Nox?** (Lulù) → Nox sente la sua voce nell'Archivio **ma** le guide la seguono (ondate extra in *Archivio* e *Risalita*); in alternativa Nox trova i segni di gesso «• •».
- **EVE-Prime** (Nox) → nel finale EVE avvisa prima dei colpi (telegrafi più lunghi) **oppure** silenzio e mani più ferme (+1 danno).
- **Vai / Resta** (Lulù) → Lulù entra nella battaglia finale alla fase 1 o 2; epilogo dei sotterranei.
- **Thermal Anchoring** (somma delle scelte relazionali, nascosto) → variante del ricongiungimento: *calda*, *incerta*, *fragile*. Il ricongiungimento avviene sempre; cambia il modo.

Nessuna scelta ha etichette bene/male; ogni opzione mostra beneficio e costo con lo stesso peso visivo.

## Identità di gioco

- **Nox**: diretto, fisico. Schivata perfetta → contrattacco, Pulse (rivela nel buio), **Black Pulse** quando è da solo (danno e cadenza, poi surriscaldamento).
- **Lulù**: controllo. Risonanza ad area (stordisce, acceca le pattuglie), **Barriere** quando è da sola (bloccano corpi e proiettili), attivazione dispositivi più rapida, attacchi silenziosi.
- **Duo**: esiste solo quando sono insieme. Scompare con la separazione e torna nel finale quando Lulù arriva.

## Musica (originale, `tools/compose_soundtrack_v08.py`)

Motivo comune "due colpi" (due note ribattute + risposta). Nox: risposta discendente, registro basso.
Lulù: risposta ascendente negli arpeggi. Pericolo: motivo frigio e distorto. Ricongiungimento: le due
risposte alternate in maggiore. Nessuna citazione di musiche esistenti.

## Verifica

- `npm test` — logica, scelte, raggiungibilità di ogni missione su entrambi i rami (giocatore medio simulato), save v6 + migrazione v4/v5, bundle Android.
- `node tools/verify_campaign_browser.cjs <url> a|b <out>` — partita completa nel browser con input reali (tastiera/tap), due strategie di scelta opposte, screenshot per tappa.
- `tools/verify_android_renderer.mjs` — WebView Android reale (CI con emulatore) senza iniezione di stato.
