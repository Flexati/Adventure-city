# The Anchor — card dell'incontro (2 di 17)

Stato: **IMPLEMENTATO e INTEGRATO nella Breccia, verificato con test e browser; nucleo, bitte e audio dalla consegna Astra 20261027 (D09), cime e corsie ancora procedurali.** Le famiglie `boss.anchor.*` restano OPEN: lo sheet del nucleo ha correzioni tecniche, cavo e VFX della spazzata sono respinti. COMMERCIAL_RELEASE = BLOCKED.

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

Nucleo: `game/art/v10/anchor_core.png`, otto righe di stati scelte dal modello (`anchorFrame`: riposo, carica della cima, rilascio, recupero, peso, danno, sconfitta, esposto). Bitte: `anchor_bollards.png` (tesa, tagliata, ri-ormeggio negli ultimi 2 s). Lo sheet viene da Astra G11/G12 con riancoraggio tecnico (`tools/build_anchor_sheets.py`). Dalle correzioni f727255 anche le cime (segmento Astra ripetuto lungo la linea, fermo con movimento ridotto) e la corsia della spazzata (atlante: carica fino al lock, lock, colpo) usano arte consegnata; la hitbox 560×64 e i tempi restano quelli di `ANCHOR_RULES`. Le estremità delle cime sono nude: il terminale è stato respinto. Le forme procedurali precedenti restano solo come ripiego, se gli sheet non si caricano.

Audio A5: `anchor_moor`, `anchor_line_tension` (1,25 s, picco al lock), `anchor_sweep`, `anchor_line_cut`, `anchor_weight` (alla caduta del peso), `anchor_exposed`, `anchor_relink` e il loop `anchor_fight_loop` finché il nucleo è sveglio. Solo controlli tecnici, nessun ascolto umano. Dettaglio in [ASTRA_INTEGRAZIONE_20261027.md](ASTRA_INTEGRAZIONE_20261027.md).

## Prove

- `tests/anchor.test.mjs`: 8 test sul modello reale (scudo, mira assistita, esposizione e ri-ormeggio, Risonanza che taglia e interrompe, corsia bloccata con colpo solo all'interno, fase 2, sconfitta definitiva e ricostruzione al retry, pose dello sheet guidate dagli stati).
- Test di vincibilità della campagna con giocatore medio simulato: Breccia vinta 3/3 per seed su entrambi i rami. Il pilota di test ha imparato due verbi nuovi (uscire dalla corsia, raggiungere una cima): una risposta umana ordinaria, non un indebolimento del boss.
- Browser `tools/verify_anchor_browser.cjs` a 390×844 e 844×390: avviso didattico, risveglio ormeggiato, vista ravvicinata del nucleo, corsia telegrafata, nucleo esposto, ricarica pagina al checkpoint, vittoria con input da tastiera, flag e componente salvati, zero errori. Rapporti `anchor-browser-report-*.json`, strisce `anchor-*-strip.png`.

## Difetti trovati e corretti durante il blocco

1. La mira assistita puntava il nucleo schermato: 88 colpi sprecati per partita simulata. Ora preferisce le cime.
2. Il colpo ravvicinato usava un telegrafo nuovo che il giocatore non conosceva: ora usa il cerchio rosso condiviso.
3. La Risonanza non bastava a tagliare una cima (3 danni contro 4): regola esplicita, un'abilità che raggiunge una cima la taglia.
4. Corsia troppo tenue e spazzate lanciate fuori portata: corsia più opaca con frecce di carica, e il nucleo spazza solo a portata.

## Lacune

Terminale del cavo (respinto); revisione artistica e ascolto umano; IT/EN rivisti da persone; Anchor Beast come nemico distinto; prova su Android e con giocatori nuovi.
