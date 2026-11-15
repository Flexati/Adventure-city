# Kairn e Morrow — integrazione dei master fedeli alla foto dell'autore

Stato: **INTEGRATO, verificato in browser.** Famiglie `character.{kairn,morrow}.sprite_animation_set` e `action_sfx_family` restano OPEN per il gate commerciale (revisione umana, dispositivo, diritti). COMMERCIAL_RELEASE = BLOCKED.

## Problema del giocatore (osservato prima della modifica)

- Nella Risalita Morrow e Kairn parlavano **prima** di comparire: gli alleati venivano creati solo dopo il dialogo.
- Per 8 s ripetevano in loop la posa d'attacco, fermi, indipendentemente dai colpi reali; il danno arrivava come un raggio istantaneo su qualsiasi nemico della mappa. Kairn, un lottatore, "sparava".
- L'aspetto (combattente calvo, cacciatrice rossa) non seguiva più l'ultima scelta dell'autore.

## Risultato atteso e criterio di accettazione

Comparsa in scena con anelli temporali e tema "Due uomini al varco" prima della prima battuta. Poi due personalità leggibili: Kairn chiude la distanza e colpisce a pugni; Morrow copre col fucile fino a 270 unità e passa alla motosega sotto le 70. Guardano il bersaglio; tra un'azione e l'altra tornano in attesa; il colpo arriva sul frame di rilascio e il suono parte sullo stesso evento. Invarianti: danno `max(4, danno missione × 3)`, cadenza 0,7 s, finestra di 8 s di gioco, nessun bersaglio boss, nessun controllo del giocatore, nessuna conoscenza nuova.

## Direzione artistica

- `kairn-master.png` e `morrow-master.png` (4×4, verso destra) seguono `strangers-author-reference.jpg`: Kairn capelli scuri, gilet borchiato, petto scoperto, fasce ai polsi; Morrow capelli corti scuri, camicia blu, imbracatura, motosega e fucile.
- `tools/build_stranger_sheets.py` isola ogni posa per componenti connesse, ancora i piedi su una linea di terra costante usando solo il corpo principale (archi della motosega, lampi e fumo non spostano il suolo) e incolla in celle uniformi con gutter trasparenti. Nel master le pose di attesa scivolavano di ~40 px: ora sono ferme. Nessun ridisegno né ridimensionamento.
- Altezza in scena: figura in attesa = 112 unità (Nox circa 100), coerente con adulti più alti delle protagoniste.
- Lato sinistro per specchiatura: la mano armata di Morrow si specchia. Il canone non lega la motosega a un braccio specifico; da rivedere se l'autore lo richiede.
- Gli atlanti storici `desert_chrono_fighter` e `demon_hunter_survivor` restano nel repository come baseline e nel manifest come riserva, ma non sono più caricati né confezionati per Android.

## Coerenza narrativa

Regole V8.5 rispettate: non giocabili, non spiegano la Frattura né il Libro, non sconfiggono Archon (bersagli boss esclusi e testati), compaiono brevemente come supporto AI. Le battute esistenti non cambiano; ora sono pronunciate da personaggi visibili. Flag `strangers_met` e `broken_clock_fragment` salvati e conservati dopo reload.

## Asset e audio

- Due sheet NEW: `game/art/v10/kairn.png` (1332×1152) e `morrow.png` (1676×1232), dichiarati in `game/art/chrono/manifest.json` e `game/chrono-manifest.mjs`.
- Tre SFX e un tema prodotti da Codex, ora integrati: `kairn_impact` (pugno), `morrow_saw` (motosega), `morrow_shot` (fucile) sul frame di rilascio; `strangers_rift` scelto dal selettore musicale dinamico mentre gli stranieri sono in scena, poi ritorno alla traccia della missione.
- Mix: RMS del tema −24 dBFS, simile agli altri cue v10 e circa 10 dB sotto le tracce v09; il brano finisce in dissolvenza a 24 s, quindi un loop oltre i 24 s si sentirebbe. Nella Risalita il segmento dura meno. Ascolto umano assente.
- Pacchetto Android e `AssetRoutes.java` aggiornati.

## Prove

- `npm test` 185/185, di cui 5 nuovi test in `tests/strangers.test.mjs`: avvicinamento e pugno al frame di rilascio, fucile/motosega secondo la distanza, finestra di 8 s e nessun boss colpito, danno e cadenza invariati, atlanti puliti con frame distinti e manifest coerenti.
- Browser, a 390×844 e 844×390: `docs/evidence/v10.2/strangers-browser-report-*.json` e strisce `strangers-*-strip.png` (arrivo, combattimento a 1,2/3/5 s, uscita, post-titoli). Salvataggio esplicito al passo `ascent`, gioco da tastiera con la policy deterministica della campagna, orologio reale. 15 controlli PASS per viewport.
- Prima versione corretta durante la prova: con `allyTime=0` alla comparsa il loop avviava subito il dialogo d'uscita; Kairn restava contro le pareti e inseguiva nemici lontani. Corretti con finestra impostata alla comparsa, `routeWaypoint` e raggio di 420 unità attorno a Nox.

## Rischio da decidere prima della release

Il riferimento scelto dall'autore produce figure molto vicine a personaggi noti di altre opere (un uomo in camicia blu con motosega e fucile a canne; un lottatore a petto nudo con gilet borchiato). Non è un giudizio legale, ma per un prodotto a pagamento serve una revisione di somiglianza/diritti prima della pubblicazione. Anche il sangue nei frame della motosega può incidere sulla classificazione d'età. Nessuna licenza è stata attestata.

## Lacune

Ritratti/gesti narrativi (`portrait_or_story_gestures`), frame di danno/morte non necessari finché gli alleati non subiscono danni, confronto umano della leggibilità, WebView e Android fisico, ascolto e mix.
