# Narrative Hook Matrix V10.3

Fonte: codice del ramo `work/chronos-adventure-commercial`, in particolare:
- `game/missions.mjs` (CAMPAIGN, FOOT, buildMission);
- `game/story-v08.mjs` (STORY, BARKS, CHOICES, EPILOGUE);
- `game/narrative.mjs`, `game/hubs.mjs`, `game/driving.mjs`;
- le scene in `game/runtime.mjs`.

**Stati:**
- **EXISTS**: il contenuto c'è nel codice ed è raggiungibile nei giri automatici completi A e B (`docs/evidence/v10.2/playtime/`).
- **PROPOSED**: progettato ma non realizzato.

Nessuna riga è VERIFIED come effetto sul giocatore: nessuna persona ha ancora giocato. I minuti sono stime probabili della rotta A (`PLAYTIME_ESTIMATE`, ESTIMATE_NOT_HUMAN).

Canone: Nox è maschile, Lulù femminile. Il salvataggio dei 19 civili (Lulù autentica la firma EVE-47 per aprire la porta HELIOS) è la causa morale della frattura.

## Le 31 tappe

| # | step_id | min | dramatic_question | player_objective | emotional_stake | gameplay_novelty | discovery | reward | consequence | next_hook | payoff_step | status |
|---|---|---:|---|---|---|---|---|---|---|---|---|---|
| 1 | opening | 0,2 | Chi c'è nella capsula? | Rispondere ai due colpi, accettare il nome | Il primo legame | Tocco a ritmo (due colpi) | Sigla EVE-47 · NOX SERIES | Frammento di vetro | Flag dei beat d'apertura | «A cosa serve?» «A niente.» | final_glass, rooftop_end | EXISTS |
| 2 | home | 0,6 | Cosa teme Lulù? | Guardare | Routine di coppia (la tazza) | Scena | Otto mesi insieme; Lulù ricontrolla la rotta quando ha paura | — | Rito della tazza | Le finestre si spengono | moon (tazza ripresa) | EXISTS |
| 3 | blackout | 3,4 | Chi ha spento il quartiere? | 3 relè, poi Rook | Proteggere le persone | Primo combattimento, primo boss | Il relè riconosce EVE-47 senza codice | Kit e armi (Tessa) | Scelta officina/rifugio | «Il relè mi conosce» | zero (registro col nome), archive | EXISTS |
| 4 | escape | 1,3 | Riusciranno a uscire? | Guidare fino al porto | Fiducia di guida | Prima guida | Voce «…torna…» | — | Il dialogo cambia con la scelta del Blackout | Chi parla? | below, archive (EVE) | EXISTS |
| 5 | moon | 0,6 | Dove si può vivere senza Elyon? | Hub: incarichi facoltativi | Comunità | Hub, economia, gare facoltative | Mira ex soccorritrice | Monete, equipaggiamento | Le lampade si riaccendono (incarico) | Una vecchia porta riaperta | cathedral, postcredits | EXISTS |
| 6 | breach | 1,7 | Cosa esce dalla breccia? | 3 ancore, poi The Anchor | Prima scelta di non trasmettere la firma | Boss con fasi (cime e esposizione) | Le creature hanno numeri di serie più vecchi della città | Componente H-17 (in sospeso) | Promessa: niente trasmissione | Chi ha costruito le creature? | aftermath (debole, vedi registro) | EXISTS |
| 7 | signal | 1,0 | C'è una rotta senza esporre Nox? | 3 segnali in guida | La promessa mantenuta | Guida a tappe | Mappa senza firma | — | Rafforza la promessa | — | separation (la promessa viene rotta) | EXISTS |
| 8 | rooftop | 0,7 | Cosa li tiene insieme? | Due scelte di dialogo | Intimità | Scelte che spostano la fiducia (termico) | Nox tiene il vetro | — | Fiducia ±, poi tono del ricongiungimento | «Chiedimelo prima» | reunion, rooftop_end | EXISTS |
| 9 | cathedral | 0,4 | Perché gli orologi battono tredici volte? | Hub | Città che riapre | Hub con reliquie | Simbolo non Elyon, orologio spezzato (segreto) | Monete | Il mercato riapre (incarico) | Simbolo dell'orologio spezzato | postcredits (seguito dichiarato) | EXISTS |
| 10 | contagion | 2,0 | Si possono salvare i 19? | 3 filtri; evento HELIOS | **Il dilemma**: Lulù sola, Nox dall'altra parte | Evento a metà missione | La porta si apre con l'autenticazione EVE | 19 civili salvi | EVE-47 localizzata | Che cosa ha fatto Lulù? | separation | EXISTS |
| 11 | evacuation | 1,2 | Arriveranno tutti? | Guida con 2 fermate | Responsabilità | Guida con raccolta | Ines | — | I civili ricordano | — | aftermath, line | EXISTS |
| 12 | zero | 1,9 | Perché vogliono solo Nox? | 3 nuclei, poi il Custode | Nox braccato | Boss di recupero | Registro con il nome di Nox | — | Recupero in corso | Il registro | separation, archive | EXISTS |
| 13 | separation | 0,6 | Lulù l'ha fatto sapendo? | Guardare | **Frattura** | Scena con crollo | «Sì. Ho scelto di salvarle.» | — | Due storie separate | Si ritroveranno? | reunion | EXISTS |
| 14 | exp_chalk_marks | 1,9 | Lulù sa chiedere prima di decidere? | Scelta della rotta, difesa | Imparare ad ascoltare | Scelta di percorso con effetto sulla mappa | Il gesso è dei residenti | — | Rotta scelta e richiamo per Nox | Due punti di gesso | below, archive, tunnel | EXISTS |
| 15 | below | 2,1 | Nox può restare sé stesso con EVE in testa? | 3 valvole al buio | Solitudine | Missione al buio | EVE vuole il controllo | Cella termica | Scelta: sé o Unità 9 | Unità 9 | line (alleato), aftermath | EXISTS |
| 16 | city | 1,8 | Il quartiere regge senza di lui? | Difesa | Lulù protegge da sola | Difesa a tempo, cambia con la scelta | Lulù lascia segni senza esporlo | — | Il generatore riparte | — | aftermath | EXISTS |
| 17 | ring | 1,2 | Nox sa ancora guidare da solo? | Uscire dall'anello | Assenza di Lulù (posto vuoto) | Inseguimento coi droni | Finestre riaccese | — | — | — | — | EXISTS |
| 18 | toxic | 0,4 | Si vive senza Elyon? | Un incarico + preparazione (obbligatori) | Dignità dei mutati | Preparazione obbligatoria | L'Archivio legge chi lo attraversa | Componente | Preparazione per l'Archivio | Isolare l'impianto | archive | EXISTS |
| 19 | port | 0,9 | Lulù trasmetterà di nuovo? | Stealth, 3 antenne | Rifiuto di ripetere l'errore | Stealth | Trasmissione possibile | — | Lulù spegne: «Deve scegliere» | — | reunion | EXISTS |
| 20 | archive | 2,3 | Chi è EVE? | 3 archivi, poi EVE-Prime | Identità | Boss specchio | Lia, la figlia della creatrice di Elyon | Controllo motorio | Scelta: EVE conservata o spenta | Chi ha creato Elyon? | finale | EXISTS |
| 21 | tunnel | 1,1 | Lulù troverà la strada? | Guida al buio | Lulù sola alla guida | Guida a impulsi | I segni di gesso restano | — | — | — | reunion | EXISTS |
| 22 | clockwork | 0,3 | Chi sono i due caduti dal cielo? | Un incarico + preparazione | Mistero | Hub | Due stranieri | Componente | — | Stranieri | ascent | EXISTS |
| 23 | line | 4,0 | Lulù resterà fino all'ultimo? | Difesa lunga | Responsabilità civile | Difesa con alleato Unità 9 (se salvato) | — | — | Scelta: Ines o resta | — | finale (bonus), aftermath | EXISTS |
| 24 | ascent | 1,6 | Chi aspetta in cima? | 3 ascensori | Determinazione | Evento Kairn/Morrow | Frammento: orologio spezzato | Frammento | Avviso di EVE, se conservata | «Non è Lulù» | reunion, postcredits | EXISTS |
| 25 | reunion | 0,4 | Si fideranno ancora? | Guardare | **Ricongiungimento** in 3 toni | Esito della fiducia | — | Lulù torna | Il tono dipende da termico e scelte | Archon | finale | EXISTS |
| 26 | finale | 2,3 | Nox accetterà i ricordi? | Ancore, poi Archon, con partner | Consenso | Boss con partner e pulsante «Il diritto di dire no» | Elena Voss, Lia | — | — | — | collapse | EXISTS |
| 27 | collapse | 0,5 | Usciranno vivi? | Fuga | Tensione | Fuga | — | — | — | — | aftermath | EXISTS |
| 28 | aftermath | 1,4 | Cosa resta alla città? | Guardare | Conseguenze | Epiloghi per hub e scelte | Elyon non può più possedere | — | Incarichi richiamati | — | — | EXISTS |
| 29 | rooftop_end | 0,6 | La mano? | Scelta finale | Fiducia | Scelta | «A niente» | — | Mano presa o lasciata | — | — | EXISTS |
| 30 | credits | 0,4 | — | — | — | — | — | — | — | — | — | EXISTS |
| 31 | postcredits | 0,9 | Chi ha aperto la porta? | Guardare | Seguito | Scena | The Book of Broken Hours | — | — | **Seguito dichiarato** | Chrono Shadows (seguito) | EXISTS |

## Registro dei misteri

| Mistero | Aperto in | Chiuso in | Esito |
|---|---|---|---|
| Identità di Nox (EVE-47) | opening | archive, finale | chiuso |
| Vetro «a niente» | opening | final_glass, rooftop_end | chiuso |
| Il relè riconosce Nox | blackout | zero, archive | chiuso |
| Voce «…torna…» | escape | below, archive | chiuso |
| Creature con numeri di serie più vecchi della città | breach | — | **debole**: un solo bark e un richiamo implicito in aftermath. Proposta P2 |
| La spora porta ricordi, nomi sconosciuti | contagion | — | **debole**: implicito nei ricordi di Lia. Proposta P2 |
| Chi lascia i segni di gesso | chalk, city | tunnel (per il giocatore) | **non chiuso per Nox**: nel ricongiungimento non lo dice mai. Proposta P1 |
| Orologi a tredici colpi, orologio spezzato, stranieri | cathedral, clockwork, ascent | postcredits | **seguito dichiarato** (Book of Broken Hours) |
| Componente H-17 | breach | — | **aperto per mancanza di contenuto**: serve Vega (D08). Espansione E2 |

## Domande lunghe e dove si tengono vive

| Domanda | Tenuta viva da | Rischio |
|---|---|---|
| Nox e Lulù si fideranno di nuovo? | rooftop → separation → chalk/port/tunnel → reunion → rooftop_end | Solo 2 scelte (più un beat) muovono la fiducia: troppo poche per 13 tappe separate. Proposta P1 |
| Rapporto fra EVE, Elyon e anomalie | escape → below → archive → finale | Buono |
| Cosa vogliono gli antagonisti | zero (recupero) → archive → finale | Rook, Anchor e Custode hanno poco movente esplicito. Proposta P3 |
| Libertà delle persone sotto il sistema | hub, chalk, aftermath | Buono, ma gli hub dicono «prima/dopo» solo nell'epilogo. Proposta P4 |

## Proposte di gancio (PROPOSED, nessuna realizzata)

- **P1 — Fiducia nella separazione.** Tre piccole decisioni che spostano il termico, una per tappa:
  - in chalk, Lulù chiede il permesso ai residenti;
  - in port, il terminale spento;
  - in below, il rifiuto di EVE.

  Nel ricongiungimento, Nox nomina i due punti di gesso (chiusura del mistero). Va scritto come testo nuovo autorizzato. Il formato dei salvataggi non cambia: si aggiungono solo flag.
- **P2 — Numeri di serie e spora.** Una riga negli archivi dell'Archivio collega le creature della breccia e la spora a Elyon. Chiude due misteri deboli senza inventare un nuovo canone. La formulazione va approvata dall'autore.
- **P3 — Movente dei boss.** Una riga d'ingresso e una di sconfitta per Rook, Anchor e Custode, sullo stile di Veyra.
- **P4 — Prima e dopo negli hub.** Gli incarichi completati cambiano un oggetto o un personaggio visibile nell'hub, e non solo il testo dell'epilogo.
