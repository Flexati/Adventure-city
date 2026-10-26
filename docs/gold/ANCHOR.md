# The Anchor — card dell'incontro (2 di 17)

Stato: **IMPLEMENTATO e INTEGRATO nella Breccia, verificato con test e browser; arte in FORME PROTOTIPO DICHIARATE.** Le famiglie `boss.anchor.*` restano OPEN finché sprite, arena, VFX e audio propri non sono prodotti. COMMERCIAL_RELEASE = BLOCKED.

## Card

| Voce | Contenuto |
|---|---|
| Collocazione | Breccia (Lulù con Nox partner), dopo le tre ancore: la sequenza V9 «Breccia e The Anchor». Le ancore alimentavano la breccia; spente, si sveglia ciò che la teneva ferma. |
| Risposta sbagliata (A6) | Tenere fermo equivale a proteggere. |
| Immagine d'ingresso | Un nucleo d'ormeggio che non si muove, legato a tre bitte da cime tese e luminose. |
| Bisogno | Tenere la breccia esattamente dov'è. |
| Regola | Finché almeno una cima è tesa il nucleo è «ORMEGGIATO»: nessun danno da colpi, partner o abilità. Tagliate tutte, il nucleo è «ESPOSTO» fino al primo ri-ormeggio (10 s, 7,5 s in fase 2, con conto alla rovescia visibile su ogni bitta). |
| Risposta del giocatore | Muoversi attorno al nucleo, tagliare le cime e colpire nella finestra. Kit complementare: la Risonanza di Lulù taglia una cima con un solo lancio e interrompe la spazzata in carica; i colpi ne servono due per cima; Nox in supporto spara solo alle cime finché il nucleo è ormeggiato. La mira assistita fa lo stesso. |
| Attacchi | **Cima:** corsia arancione tratteggiata che segue l'eroina, si blocca al 55% e diventa rossa con frecce che avanzano; colpisce solo dentro la corsia e i muri la fermano. Avviso «CIMA IN TENSIONE» / «ESCI DALLA LINEA» sopra l'eroina. Il nucleo spazza solo se l'eroina è a portata (600). **Peso:** se l'eroina gli sta addosso (<190), cerchio rosso condiviso sul punto in cui si trova. |
| Escalation | Sotto metà vita: due corsie a ventaglio, ri-ormeggio più rapido, due Raider. |
| Vulnerabilità | Il nucleo esposto, aranciato. |
| Conclusione | Le cime cadono per sempre. Nel nucleo, un ago di guida intatto: Nox lo tiene, «Tessa saprà a cosa serve» (nessuna conoscenza inventata dell'H-17). |
| Mondo dopo | Flag `encounter.anchor.completed`, componente `weapon.anchor_component` nelle ricompense dell'arsenale; H-17 resta bloccata finché non arriva il componente di Vega. Testo di fine missione invariato. |
| Checkpoint e retry | Il risveglio salva il checkpoint; ritentativo e ricarica riprendono dal boss con le ancore chiuse e le cime ricostruite. |

## Coerenza narrativa

Nessuna nuova conoscenza per Lulù o Nox, nessuna rivelazione sulla frattura. Gli stranieri non c'entrano. Il componente è un oggetto, non un potere.

Salvataggi v7 già oltre la Breccia: nessun ri-gioco forzato (D08). Il componente serve solo insieme a quello di Vega, che non esiste ancora; quando Vega entrerà in gioco servirà una politica di recupero come quella di Rook.

## Direzione artistica

Forme procedurali dichiarate nel codice (`enemySprite`, `drawThreats`): nucleo ellittico con rivetti rotanti, bitte con fasce gialle, cime tratteggiate in tensione. Bastano a leggere regola e telegrafi; **non sono arte finale** e non chiudono nessuna famiglia. Le richieste precise sono nel foglio Astra (P1, G11-G12 e A5) con forma e tempi già fissati dal modello.

Audio riusato per ora: `barrier` (ormeggio/ri-ormeggio), `alarm` (carica della cima), `impact` (spazzata), `node` (nucleo esposto).

## Prove

- `tests/anchor.test.mjs`: 7 test sul modello reale (scudo, mira assistita, esposizione e ri-ormeggio, Risonanza che taglia e interrompe, corsia bloccata con colpo solo all'interno, fase 2, sconfitta definitiva e ricostruzione al retry).
- Test di vincibilità della campagna con giocatore medio simulato: Breccia vinta 3/3 per seed su entrambi i rami. Il pilota di test ha imparato due verbi nuovi (uscire dalla corsia, raggiungere una cima): una risposta umana ordinaria, non un indebolimento del boss.
- Browser `tools/verify_anchor_browser.cjs` a 390×844 e 844×390: avviso didattico, risveglio ormeggiato, corsia telegrafata, nucleo esposto, ricarica pagina al checkpoint, vittoria con input da tastiera, flag e componente salvati, zero errori. Rapporti `anchor-browser-report-*.json`, strisce `anchor-*-strip.png`.

## Difetti trovati e corretti durante il blocco

1. La mira assistita puntava il nucleo schermato: 88 colpi sprecati per partita simulata. Ora preferisce le cime.
2. Il colpo ravvicinato usava un telegrafo nuovo che il giocatore non conosceva: ora usa il cerchio rosso condiviso.
3. La Risonanza non bastava a tagliare una cima (3 danni contro 4): regola esplicita, un'abilità che raggiunge una cima la taglia.
4. Corsia troppo tenue e spazzate lanciate fuori portata: corsia più opaca con frecce di carica, e il nucleo spazza solo a portata.

## Lacune

Sprite, arena, VFX e audio propri; IT/EN rivisti da persone; Anchor Beast come nemico distinto; prova su Android e con giocatori nuovi.
