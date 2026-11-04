# CHRONOS — Audit di qualità per il pretest (4 novembre 2026)

Base `f055e93`. Il gioco è stato giocato in Chromium a 360×800, 390×844, 412×915 e 844×390, dalla prima partita fino ai passi della demo (fino a «La firma»). Legenda: **[FATTO]** misurato (fonte), **[IPOTESI]** non verificato (motivo). Le schermate di prova stanno in `/dev/shm`, quindi non sopravvivono a un riavvio: i numeri sono qui.

| # | Problema | Prova | Stato |
|---|---|---|---|
| 1 | Etichetta del distretto tagliata con «…» in verticale (testo a 10 px) | spazio 96/126/148 px a 360/390/412, testo fino a 216 px, 8 passi su 12; `game/style.css:100` | corretto in P1 |
| 2 | Il toast del tutorial resta sulla scena dopo | `game/runtime.mjs:484`, `hideGameplay()` | corretto in P1 |
| 3 | Il dialogo in missione copre Nox e i comandi | pannello da y=677 a 844 (167 px su 844, 20%) | P3 |
| 4 | Apertura «batti due volte»: nessun invito al tocco; un doppio clic rapido non ha avanzato per 31 s | due tocchi a 450 ms passano in 0,66 s; **[IPOTESI]** finestra del doppio tocco, da provare sul telefono | P3 |
| 5 | Pausa: lingua 66×19 px, muro di testo con tasti, in orizzontale controlli fuori vista | `game/index.html:19`; controlli a y −214…−9 in 844×390 | corretto in P1 (parziale: 360×640, 568×320, 1024×521) |
| 6 | Tastiera in un gioco solo mobile | `game/input-v9.mjs:3`, `game/runtime.mjs:729`, `game/locale.mjs:28,37` | pausa in P1, resto P2 (D39) |
| 7 | Fine demo: carta di solo testo, senza arte né anticipazione | schermata di sblocco a 390×844 | P5 |
| 8 | Crediti senza versione | pagina Crediti; `android/AndroidManifest.xml:1` ha `versionName` | P4 |
| 9 | 9,4 s prima del menù (4,1 s di caricamento + 5,3 s di filmato); logo con bordo netto a destra; pulsante audio bilingue | misurato su desktop | P3 |
| 10 | Guida in orizzontale: strada su circa il 32% della larghezza | x da 288 a 556 su 844 | P4 |
| 11 | Aspetto «prototipo»: pavimento a rumore, palazzi ripetuti come muri | **[IPOTESI]** qualità percepita | P4 |
| 12 | Etichette del mondo molto piccole | `game/runtime.mjs:829` (13 px, 11–12 px in vari punti, poi scalati dalla camera) | P4 |
| 13 | Il menù ritaglia Nox a sinistra | schermata del menù a 390×844 | P3 |
| 14 | «Otto mesi dopo»: circa 34 s di sola lettura | `CHRONOS_FASE_3_SINTESI.md` §D | solo proposta M7 |
| + | `observe_missions.cjs` carica sempre «Blackout» | `p.step=i` non è più valido | P2 |

Verificato e a posto: nessun pulsante di gioco sotto 44 px (i checkbox da 22 px stanno in etichette da 308×44), nessuno scorrimento orizzontale, nessun errore JS, ingresso in azione in 12,6 s da «NUOVA STORIA» con 12 battute e 482 caratteri. Non misurato: leggibilità del combattimento senza audio né colore, frame su telefono vero (M1).
