# CHRONOS — Revisione ricorsiva del codice (cicli A–E)

Ogni lotto è passato dai cicli A (implementazione), B (revisione indipendente), C (prova avversaria), D (correzione) ed E (approvazione con la prova). Il tetto è di tre giri per lotto. Qui sono registrati anche gli errori di chi scrive.

## Lotto 1 — Mira trascinata (D72)

- **Giro 1.** Il campo `aimLive` passa la direzione del pollice. `npm test` fallisce su `directional-fire-r1`, che manda solo `aim` durante l'azione.
- **Giro 2.** Il tick usa `aimLive` quando esiste e `aim` quando non c'è. 502 su 502. `aim_r28` 7 su 7.
- **Errore di processo, mio.** Un commit è partito con un test nuovo che falliva (`9a5deeb`). È stato corretto dopo 6 minuti (`690b127`).

## Lotto 2 — Budget dei fotogrammi di «below»

- **Giro 1.** Taglio delle celle fuori inquadratura. La CI cade di nuovo: 16,7 ms su 412×915.
- **Giro 2.** Profilo dei tempi inclusivi: `drawWorld` costa 91 ms/s contro i 60 di R37, e la differenza sta in due funzioni nuove. Taglio esteso a particelle e forzieri. Prova di controllo: con le due funzioni spente il p95 è 8,4–11,4 ms, con il taglio 11,6–12,0 ms. CI verde.
- **Approvazione con riserva.** Il margine sul limite resta sottile ed è scritto.

## Lotto 3 — HUD tattico arrivato con `fbc2a05`

- **Giro 1.** Il radar segue il forziere più vicino; altezza in pixel logici.
- **Giro 2.** L'avviso del punto debole si spostava sotto la barra del boss: spostato dentro la barra.
- **Giro 3.** A 320×568 il riquadro dell'obiettivo copriva le parole: allineate a destra sotto i 340 px.
- **Errore di processo, mio.** La CI di `bea86f3` è caduta perché D81 non era citata in testa a `STATO.md`. I test locali erano stati lanciati prima di scrivere D81. Corretto in `084a8fa`.

## Lotto 4 — Colonna sonora R38

- **Giro 1.** Controllo dell'armonia: 30 note fuori accordo in 9 brani. Rimedio: gli accordi seguono la melodia e la settima minore è ammessa sugli accordi minori. Una sostituzione rompeva il contrappunto di «danger»: la coda di Nox scende al quinto grado.
- **Giro 2.** 15 brani su 15 conformi al Gate 2.
- **Collegamento al gioco.** Tre test e due verifiche nel browser aspettavano i file vecchi; aggiornati al file nuovo senza cambiarne lo scopo.

## Lotto 5 — Varietà delle missioni (MS-3)

- **Giro 1.** Due tappe ibride. Il mio script di prova non premeva il pulsante dell'evento della clinica, che il bot vero invece preme: era un limite della prova, non un difetto del gioco.
- **Giro 2.** Le due tappe arrivano fino alla fine nel browser.
- **Prova a regime.** `audit_combat` 50 su 50 prima e dopo.

## Mai fatto per ottenere il verde

- Nessun test cancellato, saltato o indebolito.
- Nessun limite alzato: la guardia di `app.js` e i 16 ms del p95 sono rimasti gli stessi.
- I test cambiati controllano lo stesso comportamento sul file nuovo.
