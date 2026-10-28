# CHRONOS V10.2 — Appendice E / Mosse e abilità, effetti di combattimento

28 ottobre 2026. 20 abilità canoniche, **80 tavole dei quattro momenti visivi**, comprese quelle ancora non integrate. Queste tavole sono specifiche di concept da generare subito; tempi, collider e meccaniche restano TBD se non sono nel codice. Stato baseline in `docs/gold/ASSET_NECESSARI.md`. Non reinterpretare gli eroi: Nox è maschile e Lulù è la protagonista femminile.

## Contratto

Per ogni mossa master a 4 direzioni (`side/back/front/diagonal-back`), quattro passaggi `anticipation/action/impact/recovery`, eventuali 2 frame di transizione su richiesta del runtime, VFX in layer separato, `SFX_CUE.md`, quattro fondali di prova (chiaro, scuro, porto, interior). Per i protagonisti cambiare solo le zone di mano/arma/effetto in maschera e preservare il resto dei pixel degli sheet V8. No FX continuativi che cancellino una preparazione di boss; niente nuove iframe inventate. I nomi qui sono ID di specifica, non abilità automaticamente attive.

## Barrier — ability.barrier

**Stato:** nel codice. Lulù sola: protegge un'area con durata propria, non è una cura.

1. **Anticipazione**: Lulù apre il palmo in basso, piccolo anello turchese alla scarpa. Il tempo non è definito dal disegno.
2. **Esecuzione**: Bordo di barriera ancorato al terreno, protezione distinguibile da cura. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Scintille sottili solo sul contorno sotto impatto reale. Il tempo non è definito dal disegno.
4. **Recupero**: Anello si richiude e lascia terreno pulito. Il tempo non è definito dal disegno.

## Counter — ability.counter

**Stato:** nel codice. Contrattacco dopo schivata perfetta. In gioco.

1. **Anticipazione**: Posa bassa dopo schiva riuscita, arma vicino al fianco. Il tempo non è definito dal disegno.
2. **Esecuzione**: Colpo breve in direzione opposta al nemico, contrassegno rosso-bianco. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Una sola scintilla d'impatto, assenza d'aura persistente. Il tempo non è definito dal disegno.
4. **Recupero**: Mano torna all'impugnatura e postura torna neutra. Il tempo non è definito dal disegno.

## Dash — ability.dash

**Stato:** nel codice. Schiva: cambia posizione ed evita un colpo. In gioco.

1. **Anticipazione**: Nox/Lulù inclina busto senza cambiare identità sprite. Il tempo non è definito dal disegno.
2. **Esecuzione**: Una traccia corta orientata al movimento, non teletrasporto. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Fase di invulnerabilità visualizzata solo se codice la concede. Il tempo non è definito dal disegno.
4. **Recupero**: Ritorno piedi a pivot originale, traccia sparisce. Il tempo non è definito dal disegno.

## Duo — ability.duo

**Stato:** nel codice. Attacco combinato della coppia. In gioco.

1. **Anticipazione**: Sguardi e postura complementari dei due protagonisti. Il tempo non è definito dal disegno.
2. **Esecuzione**: Traiettoria a croce fra i due senza confondere i collider. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Centro impatto con due colori riconoscibili e hit solo runtime. Il tempo non è definito dal disegno.
4. **Recupero**: I due recuperano separatamente e restano nelle posizioni vere. Il tempo non è definito dal disegno.

## Uso della cura — ability.heal

**Stato:** nel codice. Uso della cura: un tocco, gesto breve che non blocca il joystick. In gioco (Medseal).

1. **Anticipazione**: Mano al kit Medseal, segno di borsa chiara. Il tempo non è definito dal disegno.
2. **Esecuzione**: Gesto unico rapido con luce calda, nessuna area di protezione. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Feedback quantità cura solo quando applicata dal codice. Il tempo non è definito dal disegno.
4. **Recupero**: Luce chiusa e joystick utilizzabile. Il tempo non è definito dal disegno.

## Corpo a corpo — ability.melee

**Stato:** nel codice. Corpo a corpo: risposta ravvicinata con distanza e recupero chiari.

1. **Anticipazione**: Braccio arretrato e suola ancorata al terreno. Il tempo non è definito dal disegno.
2. **Esecuzione**: Arco corto davanti alla mano, nessuna portata falsa. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Impatto angolare con particelle solide. Il tempo non è definito dal disegno.
4. **Recupero**: Mano si riporta al fianco, tempo di recovery da codice. Il tempo non è definito dal disegno.

## Pulse — ability.pulse

**Stato:** nel codice. Pulse di Nox: impulso ad area. In gioco.

1. **Anticipazione**: Nox comprime guanto, energia ciano nello strumento. Il tempo non è definito dal disegno.
2. **Esecuzione**: Onda circolare in layer VFX, raggio esatto solo dopo binding runtime. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Scintille radiali brevi nei bersagli realmente colpiti. Il tempo non è definito dal disegno.
4. **Recupero**: Spire ciano tornano nel braccio. Il tempo non è definito dal disegno.

## Risonanza — ability.resonance

**Stato:** nel codice. Risonanza di Lulù: stordisce. In gioco.

1. **Anticipazione**: Lulù solleva avambraccio, tre segmenti violetto in sequenza. Il tempo non è definito dal disegno.
2. **Esecuzione**: Cerchio di risonanza violetto con interferenza a pixel netti. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Stordimento visivo sui nemici colpiti, mai su immuni. Il tempo non è definito dal disegno.
4. **Recupero**: Ultima nota visiva si spegne sul polso. Il tempo non è definito dal disegno.

## Spina dell Asse — ability.axis_spine

**Stato:** futuro. Spina dell'Asse: occasioni progettate dell'Ascesa.

1. **Anticipazione**: Piede saldo e mano verso asse della struttura. Il tempo non è definito dal disegno.
2. **Esecuzione**: Spina luminosa lungo percorso già autorizzato dalla missione. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Segnale di connessione al nodo, non proiettile generico. Il tempo non è definito dal disegno.
4. **Recupero**: Interfaccia rientra, nessuna porta aperta prima del codice. Il tempo non è definito dal disegno.

## Black Pulse — ability.black_pulse

**Stato:** futuro. Nox: prototipo a Iron Ring, poi governato dopo EVE-Prime; carica, fase attiva, recupero. In gioco come Overdrive.

1. **Anticipazione**: Nox comprime il dispositivo, nero con bordo ciano. Il tempo non è definito dal disegno.
2. **Esecuzione**: Impulso nero in negativo controllato, bordo brillante, centro non invisibile. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Segno breve sulla zona coinvolta senza coprire nemici. Il tempo non è definito dal disegno.
4. **Recupero**: Decompressione ciano con scia che non persiste. Il tempo non è definito dal disegno.

## Duo Switch — ability.duo_switch

**Stato:** futuro. Dopo la reunion: cambio protagonista insegnato senza combattimento pesante.

1. **Anticipazione**: Due sagome in pose speculari al centro sicuro. Il tempo non è definito dal disegno.
2. **Esecuzione**: Segnale di passaggio piccolo e diretto dal giocatore A al B. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Cambio controllo confermato da HUD, niente finto teletrasporto. Il tempo non è definito dal disegno.
4. **Recupero**: Figura non controllata torna in idle senza scatti. Il tempo non è definito dal disegno.

## Final Sync — ability.final_sync

**Stato:** futuro. Final Sync del finale: padronanza, decisione e colpo finale di Nox.

1. **Anticipazione**: Mani separate dei protagonisti convergono su linea verticale. Il tempo non è definito dal disegno.
2. **Esecuzione**: Luce doppia che si sincronizza senza annullare silhouette. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Punto finale riservato al colpo di Nox secondo trama canonica. Il tempo non è definito dal disegno.
4. **Recupero**: Dissolvenza e pausa narrativa invece di esplosione standard. Il tempo non è definito dal disegno.

## Heavy Strike — ability.heavy_strike

**Stato:** futuro. Solo Nox: colpo pesante più impegnativo.

1. **Anticipazione**: Solo Nox alza arma con carico del torso chiaramente visibile. Il tempo non è definito dal disegno.
2. **Esecuzione**: Colpo pesante ad arco controllato, terra a tratti solidi. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Spostamento particelle solo nel punto di contatto. Il tempo non è definito dal disegno.
4. **Recupero**: Recupero deliberato con braccia basse, niente speed-up grafico. Il tempo non è definito dal disegno.

## Node Override — ability.node_override

**Stato:** futuro. Lulù: forzatura di un nodo, più avanti nella campagna.

1. **Anticipazione**: Lulù traccia una sequenza sulle superfici di nodo. Il tempo non è definito dal disegno.
2. **Esecuzione**: Tre glifi geometrici originali su porta già attiva. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Feedback apertura negata o concessa coerente con stato. Il tempo non è definito dal disegno.
4. **Recupero**: Interfaccia si chiude e non lascia falsa interazione. Il tempo non è definito dal disegno.

## Null Driver — ability.null_driver

**Stato:** futuro. Dopo EVE-Prime: revoca del controllo motorio; comportamento da completare prima dell'arte.

1. **Anticipazione**: Nox mostra irrigidimento da comando esterno, senza debolezza caricaturale. Il tempo non è definito dal disegno.
2. **Esecuzione**: Segnali verticali di revoca controllo sulle articolazioni. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Due stati chiaro/rotto che indicano se il comando è ancora valido. Il tempo non è definito dal disegno.
4. **Recupero**: Ripresa motoria, luci di interfaccia si spengono. Il tempo non è definito dal disegno.

## Perfect Dodge — ability.perfect_dodge

**Stato:** futuro. Schivata perfetta: finestra breve, rallentamento leggibile. In gioco.

1. **Anticipazione**: Personaggio preme sul piede posteriore, posa breve. Il tempo non è definito dal disegno.
2. **Esecuzione**: Scia minimale bianca contornata ciano, niente lungo slow-motion inventato. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Una scintilla di precisione solo se evento di schiva perfetta confermato. Il tempo non è definito dal disegno.
4. **Recupero**: Ritorno alla corsa, scia in 1–2 fotogrammi. Il tempo non è definito dal disegno.

## Resonance Arc — ability.resonance_arc

**Stato:** futuro. Lulù sola: arco di risonanza.

1. **Anticipazione**: Lulù orienta mano a falce, anelli viola ravvicinati. Il tempo non è definito dal disegno.
2. **Esecuzione**: Arco violetto a segmenti discontinui controllato verso bersagli. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Piccoli cristalli di risonanza sugli hit reali. Il tempo non è definito dal disegno.
4. **Recupero**: Arco si disgrega, posa resta leggibile. Il tempo non è definito dal disegno.

## Tag Actions — ability.tag_actions

**Stato:** futuro. Ascesa: azioni a staffetta con inizio, intervento e conclusione visibili.

1. **Anticipazione**: Protagonista attivo anticipa con gesto di chiamata. Il tempo non è definito dal disegno.
2. **Esecuzione**: Intervento partner in una sola direzione leggibile. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Passaggio d'impulso o colpo solo se condizione implementata. Il tempo non è definito dal disegno.
4. **Recupero**: Rientro di entrambi con ordine stabile di layer. Il tempo non è definito dal disegno.

## Tether — ability.tether

**Stato:** futuro. Lulù sola (Eden): collegamento.

1. **Anticipazione**: Lulù estende il palmo, cavo d'energia sottile verso il nodo. Il tempo non è definito dal disegno.
2. **Esecuzione**: Linea tesa con due capi ben visibili, geometria stabile. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Vibrazione sul filo solo a connessione valida. Il tempo non è definito dal disegno.
4. **Recupero**: Ritiro del cavo senza collisione residua. Il tempo non è definito dal disegno.

## Weapon Counter — ability.weapon_counter

**Stato:** futuro. Solo Nox: contrattacco con l'arma.

1. **Anticipazione**: Solo Nox ruota guardia e arma davanti alla spalla. Il tempo non è definito dal disegno.
2. **Esecuzione**: Breve deviazione metallica con linea d'urto laterale. Il tempo non è definito dal disegno.
3. **Impatto/feedback**: Scintille più fredde sul contatto, danno solo a evento valido. Il tempo non è definito dal disegno.
4. **Recupero**: Arma torna pronta, spalla scende. Il tempo non è definito dal disegno.

## Acceptance

Tavole standalone realizzabili in anticipo e archiviate con `CONCEPT_ONLY`; sheet destinazione e misure definitive solo con un livello funzionante. Verifica PNG, byte e SHA-256, frame pivot e colori non confondibili con sfondo, maschere, origine e licenza. Immagini e audio non sono approvati senza prova runtime e revisione umana. `COMMERCIAL_RELEASE = BLOCKED`.
