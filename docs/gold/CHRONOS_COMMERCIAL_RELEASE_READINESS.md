# CHRONOS — Pronto per il commercio?

## 1. Verdetto

**`COMMERCIAL_RELEASE = BLOCKED`.** Lo stabilisce CLAUDE.md, e la ragione è concreta: mancano quattro cose che non si possono fare né fingere da qui.

| Cancello | Stato | Che cosa serve |
|---|---|---|
| Test automatici, lint, build | **PASS** [MISURATO]: `npm test` 520 su 520 | — |
| Peso di `app.js` | **PASS**: 456 320 su 458 752 | — |
| Campagna completa giocabile | **PASS [SIMULAZIONE]**: il bot arriva ai titoli di coda su tre rotte in CI | — |
| 5 playtest umani senza difetti gravi | **BLOCCATO** (0 su 5) | Persone vere, protocollo in `docs/gold/HUMAN_PLAYTEST_PROTOCOL.md` |
| Prova su telefono Android fisico | **BLOCCATO** | Un telefono e l'APK di prova |
| Acquisto Play di prova | **BLOCCATO** [FATTO] | Il manifest non chiede il permesso di acquisto e non esiste un ponte Java per `window.ChronosBilling` (`game/runtime.mjs:766`): oggi la demo non si chiude mai, e tutto il gioco è giocabile gratis. Serve il collegamento con la Play Console dell'autore |
| Firma con la chiave di produzione | **BLOCCATO** | Sul PC dell'autore; nessuna chiave è nel repo, ed è giusto così |

## 2. Valore a 5,99 € — che cosa regge e che cosa no

**Regge [FATTO]:**
- campagna di 44 passi in 4 atti, 9 boss, 14 villaggi, italiano e inglese;
- colonna sonora originale di 15 brani a loudness uniforme;
- intro dello studio con i tre frame dell'autore;
- nessuna pubblicità nel codice: nessun riferimento ad AdMob né all'SDK pubblicitario di Google nei file tracciati;
- nessuna microtransazione oltre allo sblocco unico (D18).

**Non regge ancora:**
- durata stimata dal bot di circa 80 minuti probabili, contro l'obiettivo di 150 [SIMULAZIONE, R35];
- varietà migliorata ma ancora corta: 5 ruoli di nemico, mappe generiche riusate;
- equilibrio delle armi di mercato fuori dai limiti, introdotto con la base `a9e3afd`;
- nessun ascolto umano della colonna sonora.

## 3. Pratiche escluse

Niente timer ingannevoli, niente scarsità finta, niente pressione artificiale, niente pubblicità invasiva. Il «radar dei segreti» indica dove guardare e non mette fretta.

## 4. Scheda dello store

La scheda va scritta quando i quattro cancelli sono aperti e con schermate del telefono vero. Quella proposta nella versione precedente di questo documento prometteva «60 fps stabili» e un «contrasto verificato» senza misura sul dispositivo, ed è stata tolta.
