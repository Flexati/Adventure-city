Aggiornamento armi impugnate: due adattamenti reali VX-9/R-12 integrati e provati nel browser; dettagli e lacune in [EQUIPPED_WEAPONS.md](EQUIPPED_WEAPONS.md). E06/E10/AS10 PARTIAL, COMMERCIAL_RELEASE BLOCKED.

# CHRONOS Gold — decisioni

| ID | Decisione | Motivo e stato |
| --- | --- | --- |
| D01 | Recupero giocabile dei salvataggi v7 avanzati tramite ID stabili | Evita di saltare `Segni di Gesso` senza attribuire una scelta mai fatta. Implementato e provato su boss/hub; matrice completa di migrazione ancora aperta. |
| D02 | Nox dice «qualcuno» davanti al gesso dell'Archivio | Una traccia materiale non identifica Lulù. Implementato; revisione narrativa integrale aperta. |
| D03 | Neris «Cavo» e Ivo «Contrappeso»: proposta non adottata nella candidata attuale | Le gare base non sono ancora integrate e le loro silhouette, audio e comportamento non sono prodotti. Conservare la proposta nella matrice, non assegnarla implicitamente al roster. Rivalutare dopo l'integrazione Veyra. |
| D04 | L-6 «Cerniera»: proposta esclusa dal nucleo commerciale attuale | Le cinque armi base devono prima entrare nella campagna con asset, bilanciamento e save. La proposta non è un sesto sblocco promesso. Rivalutare solo davanti a una lacuna di combattimento riprodotta. |
| D05 | Gare Ash Docks di Veyra negli hub di Vanta, facoltative, solo seguendo Nox | Ash Docks è nel percorso di Nox (bibbia V8.5, grafo V9 punto 4) e la slice V9 chiede una gara Veyra dopo Moon. Inserirle come tappe obbligatorie avrebbe cambiato gli indici dei salvataggi v7 e richiesto una migrazione forzata; da hub non bloccano la storia, si salvano nel mondo e pagano solo primo completamento/prima vittoria. Conseguenza: non contano come durata obbligatoria. Solkara, Aurelia Span e il duello restano bloccati finché le regioni dopo il ricongiungimento non esistono. Implementato e provato in browser. |
| D06 | Veicoli delle gare: riuso dell'atlante di guida V5, nessun veicolo inventato per Veyra | La Vortex resta quella della campagna; Veyra usa la variante viola, i rivali il SUV e l'auto chiara (aggiornato da D09: Veyra ora usa l'auto Astra G3, con il suo ritratto). È un riuso dichiarato, non la chiusura delle famiglie `race.*`/`character.veyra`: veicolo e ritratto di Veyra restano richieste a Codex. I carichi del porto sono disegnati dove il modello applica la collisione. |
| D07 | Genere grammaticale di Nox: maschile | Istruzione esplicita dell'autore (86ba238): Lulù è la protagonista femminile. Corrette 4 battute di Veyra e 4 frasi inglesi che usavano il femminile per Nox; nessuna altra concordanza femminile riferita a Nox trovata nei testi di gioco. Bibbia V8.5 e mappe V7 restano storiche. |
| D08 | The Anchor nella Breccia; nessun ri-gioco forzato per i salvataggi v7 già oltre | La sequenza V9 colloca The Anchor nella Breccia e le sue ancore ne sono già la premessa. Il componente H-17 serve solo con quello di Vega, non ancora nel gioco: un recupero obbligatorio oggi costerebbe tempo al giocatore senza alcun effetto. Quando Vega esisterà, aggiungere un recupero come quello di Rook. |
| D09 | Consegna Astra 20261027: integrare solo ciò che passa il controllo, con correzioni tecniche dichiarate | Lo sheet di The Anchor entra con il riancoraggio delle righe 3-7 e la rimozione dei frammenti (nessun ridisegno), perché sostituisce forme prototipo e i difetti sono di impaginazione, non di disegno. Cavo, VFX della spazzata, strade, cancelli, sheet H-17/ARC-7 e icone H-17 sono respinti con una correzione richiesta, senza adattare hitbox o tempi. Ritratti alternativi e asset di armi non raggiungibili sono conservati ma non collegati. La variante «risposta» di «Due colpi» aspetta l'autore. Dettaglio: [ASTRA_INTEGRAZIONE_20261027.md](ASTRA_INTEGRAZIONE_20261027.md). |

Le tre scelte condizionali restano tracciate nel piano V10.2 e nella matrice; questa decisione non riduce le sette gare originali, le tre gare pianificate, i 17 incontri, le nove regioni o le cinque armi base.

## Decisioni dell'iterazione Rook

- **D05:** Rook chiude la tappa Blackout dopo il terzo relè. L'ordine Rook → scelta è rispettato senza inserire un indice numerico nuovo. Nessun avanzamento storico viene falsamente marcato come vittoria: il recupero giocabile dei v7 oltre Blackout resta da implementare e impedisce la chiusura E06.
- **D06:** su istruzione esplicita dell'autore, sospesa l'espansione IT/EN come priorità. Si conservano cataloghi, codice e prove già realizzati; il blocco prioritario è il combattimento nella campagna.
- **D07:** nuova composizione locale per Rook, distinta da Segni di Gesso, e cinque cue sintetizzati senza campioni esterni. Nessun file di un provider a crediti viene dichiarato generato. Ascolto, mix e diritti per release restano da verificare.
- **D08:** mantenuto il controllo dei danni del tutorial sui relè, aggiungendo controlli separati per Rook. Un'avversità del pilota browser non viene nascosta: due retry in una prova intermedia e zero nel ricontrollo finale, difficoltà umana ancora non misurata.

## Kit e recupero — decisioni successive

- **D09:** la lacuna D05 sul recupero Rook è risolta tecnicamente. Bookmark a ID stabile conserva anche un recupero Gesso già iniziato; una vittoria già registrata non viene ripetuta per recuperare Tessa. Non si riaccreditano le monete Blackout.
- **D10:** banco portatile di Tessa e consegna identica sulle due scelte; i vantaggi cittadini restano distinti. Testo nuovo autorizzato dalla libertà creativa, non attribuito a una fonte canonica assente.
- **D11:** Quickdraw modifica un tiro C-9 dopo Schiva (recupero 0,26 s, stesso danno, finestra 1 s). Nessuna sesta arma o pulsante aggiunto.
- **D12:** recupero di munizioni al checkpoint, come salute/nemici; selezione salvata per protagonista. Riserva illimitata del sistema V9 conservata, caricatore e tempo di ricarica reali. Le armi impugnate condividono ancora l'arte base: famiglie incomplete dichiarate.
- **D13:** vittoria salvata prima dei 900 ms cosmetici; checkpoint boss valido non torna al requisito iniziale nell'hub. Verifica tramite reload e ripresa reale nel browser.
