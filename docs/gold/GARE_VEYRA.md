# Gare di Veyra nella campagna — Ash Docks (E07 / NAR05 / CRE05)

Stato: **IMPLEMENTATO e INTEGRATO negli hub, verificato in browser.** Famiglie `race.*` e `character.veyra.*` restano OPEN. Decisioni D05/D06 in [DECISIONI.md](DECISIONI.md).

## Problema del giocatore

Le sette gare V9 esistevano solo nel laboratorio separato, con auto disegnate come rettangoli: in campagna Veyra non esisteva e la rivalità prevista dalla slice V9 ("Blackout → Rook → fuga → Moon, Tessa e gara Veyra") mancava.

## Risultato

- Negli hub di Vanta, solo quando si segue Nox, la **Vortex parcheggiata** accanto ai Collegamenti offre la prossima gara Ash Docks della serie: `ash_docks` → `ash_slalom` → `ash_night`. Il menu spiega che è facoltativa, cosa sblocca e le penalità (+3 s checkpoint mancato, +5 s recupero).
- Veyra parla prima della partenza e reagisce al risultato reale (vittoria/sconfitta) con le battute V9 esistenti; un tempo scaduto lascia la sfida aperta.
- La gara usa il simulatore `racing-v9.mjs` invariato, i comandi della guida di campagna (stick sterzo, ACCELERA/FRENO, tastiera), la strada e le auto dell'atlante di guida; l'auto di Nox mostra i danni secondo l'integrità; i carichi del porto sono disegnati dove avviene la collisione; i rivali sovrapposti alla Vortex sono semitrasparenti perché il modello non prevede contatti fra auto.
- Pausa e ciclo di vita come nelle altre modalità; chiudere a metà gara riporta all'hub (la gara riparte). Ritorno all'hub nella stessa posizione.
- Persistenza: `world.races` facoltativo nei salvataggi v7 (assente nei salvataggi precedenti), validato contro le regole anti-farming del record V9; 15 monete al primo completamento, +10 alla prima vittoria, nessun premio dai replay; gare fuori dal grafo rifiutate.

## Coerenza narrativa

Canone corretto dall'autore (commit 86ba238): Lulù è la protagonista femminile, Nox è al maschile. Le battute di Veyra rivolte a Nox sono state accordate al maschile (IT) e i pronomi inglesi riferiti a Nox corretti; le fonti storiche V7/V8.5 che usano «her» per Nox sono superate da questa istruzione. Ash Docks è nel percorso di Nox; Lulù non viene presupposta a bordo (nessuna gara quando l'hub segue Lulù). La rivalità non tocca la frattura Nox/Lulù. Le battute di Veyra annunciano Solkara e Aurelia: oggi restano promesse aperte, coerenti con il grafo V9 che le colloca dopo il ricongiungimento, ma non ancora giocabili.

## Prove

- `tests/hub-races.test.mjs` (3 test): ordine e visibilità solo per Nox, premi una volta sola e niente farming, Solkara rifiutata, salvataggio/ricarica, salvataggi v7 senza record, record incoerenti rifiutati. Suite completa nel rapporto di commit.
- `tools/verify_hub_race_browser.cjs` a 390×844 e 844×390: cammino fino alla Vortex, accettazione, Veyra, gara guidata da tastiera secondo le regole del pilota V9 (un bot, non una persona), pausa che congela il cronometro, arrivo, ritorno all'hub, record e monete salvati, gara successiva offerta, ricarica pagina. 15 controlli PASS per viewport. Rapporti `hub-race-report-*.json`, strisce `hub-race-*-strip.png`.

## Lacune

Veicolo, ritratto e sprite di Veyra (richiesti a Codex), audio specifico delle gare (motore/folla/porto), resa orizzontale stretta condivisa con gli interludi di guida (scala limitata dall'altezza), le altre quattro gare e le tre nuove V10.2, durata e divertimento misurati con persone, Android fisico. Le gare sono facoltative: non contano nella durata obbligatoria.
