# CHRONOS — STRIKE GOAL / MANDATO OPERATIVO OPUS

## 1. Identità del lavoro

Sei il responsabile dell'integrazione, del gameplay, della narrativa e della verifica di CHRONOS Adventure: Nox & Lulù. Lavora concretamente nel repository Flexati/Adventure-city, branch work/chronos-adventure-commercial. Preserva lavoro valido, file sorgenti, decisioni e salvataggi. Non ricominciare da zero. Questo documento accompagna asset realmente prodotti da Codex; non dimostra che tutte le famiglie siano complete.

L'ambizione è un'avventura premium offline da €5,99, memorabile per personaggi, scelte e ritmo. I riferimenti a grandi game designer esprimono aspirazione, non endorsement, coinvolgimento o confronto oggettivamente certificabile. Valuta qualità tramite comportamento giocabile, leggibilità, coerenza, ascolto e osservazioni documentate.

## 2. Autorità e lettura iniziale

Leggi AGENTS.md applicabili, il mandato V10.2, il piano, il prompt, il contratto asset, la checklist originale, JSON e CSV della matrice, tutte le decisioni pertinenti in docs/gold. Le istruzioni esplicite dell'autore prevalgono sui documenti precedenti. Leggi in ordine temporale i report: i numeri di test nei checkpoint storici non sono baseline attuale. Verifica git status, branch, HEAD e modifiche locali prima di intervenire. Non consultare o dichiarare consultate chat non accessibili.

Fonti principali: docs/production/v10.2; docs/gold/STATO.md, REQUISITI.md, DECISIONI.md, ASSET_REGISTER.json, AUDIO_REGISTER.json, PLAYTEST.md, RELEASE.md, FIELD_KIT.md, EQUIPPED_WEAPONS.md; docs/NARRATIVE_V80.md; docs/WORLD_CHARACTER_EXPANSION_BIBLE_V85.md; docs/SPRITE_VISUAL_PRODUCTION_BIBLE_V70.md. Le tavole V8.5 non leggibili non sono riferimenti approvati.

## 3. Stato da riscontrare

Baseline pubblicata precedente al pacchetto: 176 test passati, commit 3f7c850. Il commit 93f3b8d aggiunge master di ricarica e stranieri, inventario e preparazione archivio. Quattro nuovi master sono prodotti, non ancora integrati. L'audio successivo degli stranieri è produzione candidata con metriche di decodifica. I test storici non verificano nuovi file automaticamente.

Sono presenti Rook con arena e meccaniche, consegna Tessa, C9/VX9/R12 e Quickdraw, recupero v7 per progressi avanzati, Segni di Gesso, menu animato, intro JaguarzCreatorz, sprite impugnati e mira coerente con arma. H17/ARC7, roster completo e gare in progressione richiedono lavoro. I percorsi A/B/C hanno prove browser storiche con fixture e clock dichiarati; non sono durata umana.

Tutti i 74 criteri conservano stato aperto o parziale: 14 PARTIAL, 60 OPEN nell'ultimo ledger. Zero approvazioni commerciali. Non trasformare questi numeri tramite test che controllano soltanto nomi, contatori o presenza dei file.

## 4. Responsabilità asset

Codex produce gli asset. Il tuo incarico principale è integrarli, testarli e correggere il gioco. Usa PACKAGE_MANIFEST.json per verificare esistenza e hash; usa PRODUCTION_COVERAGE.csv per la copertura delle famiglie. UNMAPPED_RECONCILE_OR_PRODUCE significa assenza di collegamento nel registro, non prova di inesistenza. Cerca prima in asset e sorgenti prima di richiedere produzione aggiuntiva. Non inventare file, non duplicare sprite cambiandone il nome per chiudere una voce. Se manca una famiglia indispensabile, registra ID, contenuto, stati, dimensioni, evento e riferimento necessario, continuando il lavoro indipendente.

I due stranieri devono essere fedeli alla foto strangers-author-reference.jpg. Kairn: capelli scuri, gilet borchiato, petto scoperto, fasce ai polsi. Morrow: capelli scuri corti, camicia blu, imbracatura, motosega e fucile. Gli atlanti storici calvo/cacciatrice rossa non rispettano l'ultima richiesta. I nuovi master 4×4 non sono compatibili direttamente con i vecchi 8×3: aggiornare metadati, ancoraggi e mapping. Non confondere produzione con integrazione.

## 5. Loop STRIKE GOAL

S — Stato: scegli un requisito aperto con dipendenze disponibili, riproduci il problema e conserva baseline.
T — Traguardo: definisci un comportamento osservabile e una prova adeguata, prima di editare.
R — Realizza: completa codice, asset pertinenti, audio, testi, persistenza e packaging del blocco.
I — Integra: collega il contenuto alla progressione reale, non soltanto a un laboratorio.
K — Controlla: prova con input ordinari, confronta baseline, controlla le regressioni invalidate.
E — Evidenza: registra sorgente/build, scena, procedura, risultato, difetto e ricontrollo.

GOAL: ripeti sui requisiti mancanti; dopo tre tentativi inefficaci cambia ipotesi. Non interrompere a ogni dettaglio reversibile. Non ripetere prove valide senza motivo. Un blocco esterno non chiude il mandato e non impedisce il lavoro indipendente. Prima della fine della sessione lascia un punto di ripresa preciso, senza promettere esecuzione futura in background.

## 6. Ordine di lavoro

Prima controlli, stabilità e salvataggi. Poi integra asset completi e incontri/armi nella progressione. Affronta contenuti per blocchi giocabili: personaggio, arena, meccanica, suoni, conseguenza e prova. Chiudi il nucleo prima di espandere lo scope. Registra adozione o esclusione di Neris, Ivo e L6. IT/EN resta obbligatorio ma l'autore ha chiesto di non privilegiarlo rispetto a gameplay e asset.

## 7. Vincoli di campagna

Circa 120 minuti attivi nella prima campagna, nove regioni, 17 incontri principali, dieci gare Veyra riconciliate con le fonti (sette originarie più tre), cinque guide narrative distinte dalle gare. Cinque armi base, mosse normali/speciali/arma/gadget, cure e barra vita senza cuori. Comandi a due pollici, salvataggi affidabili, offline completo. Non usare attese, grinding o percorsi artificialmente allungati per ottenere la durata. Misurare con nuove persone; 100–140 minuti è fascia diagnostica, non certificazione automatica.

## 8. Canone e conoscenza

Diciannove civili; firma usata senza consenso; separazione e autonomia; comunicazione limitata; ricongiungimento prima di Archon; perdono facoltativo; vetro senza poteri risolutivi; colpo finale di Nox; Lia memoria; Elyon sopravvive senza coercizione; nessuno straniero risolve il finale. Per ogni scena controlla presenti, conoscenze, fonte di tali conoscenze, motivazioni e conseguenze salvate. Controlla entrambe le rotte Gesso dopo reload. Non attribuire a Nox ciò che non può sapere.

## 9. Arte e accessibilità

Confronta proporzioni, densità pixel, palette, materiali, silhouette, animazioni, luci, VFX e UI. Conserva i migliori V8. I protagonisti non vanno liberamente ridisegnati. Colore accompagnato da forma o simbolo. Verifica safe area, touch, contrasto, dita, riduzione movimento e prestazioni. Un'immagine suggestiva non sostituisce una sequenza animata leggibile. Osserva i frame a dimensione runtime, non solo il master ingrandito.

## 10. Audio e intro

Riconcilia tutti i 129 brief e le espansioni: non sono automaticamente 129 brani. Per ogni evento indica file, funzione, volume, priorità, loop, transizioni e prova. L'audio degli stranieri comprende tre cue sintetizzati e un tema originale candidato: verificare ascolto, mix, loop e sincronizzazione prima dell'accettazione. Nessuna licenza o prova umana implicita. Le due intro JaguarzCreatorz sono già locali: conservare skip, fallback, autoplay consentito, mute e ripresa; niente dipendenze di rete.

## 11. Fisica, persistenza e verifica

Telegraph, attivazione, recupero e impatto devono corrispondere all'evento reale. Range/spread della mira devono corrispondere all'arma. Collisioni e coperture autorevoli nel modello, effetti solo illustrativi. Testare cambio, reload, dash, invulnerabilità, cooldown, cure e rallentamenti. Salvataggi v7 tramite ID stabili: nessuna tappa saltata, premio duplicato o scelta cancellata. Conserva recuperi Rook/Gesso annidati e ritorno esatto a boss o hub.

Esegui npm test e prove mirate. Browser con fixture dichiarate, WebView reale e Android fisico sono prove diverse. Il packaging/allowlist non dimostra esecuzione Android. Per durata, ascolto e arte servono osservazioni umane documentate; non inventare partecipanti o device.

## 12. GitHub e rilascio

Commit per blocchi coerenti, includendo codice, asset, sorgenti necessarie, manifest e prove. Controlla hash e HEAD remoto. Non caricare chiavi o password. Il branch è work/chronos-adventure-commercial. Se il CLI non è autorizzato, usa il connettore GitHub dell'account Flexati; non recuperare credenziali di altri servizi.

Solo dopo tutti i gate: package jaguarZcreatorZ13.app, j minuscola; versionCode 2 se disponibile, versionName 1.0.0, minSdk26, target36 verificato con requisiti Play vigenti, debuggable false, Activity del progetto. Chiave upload esistente alias chronos-upload, mai nuova. Script tools/build_play_aab.sh / npm run android:aab:play. Validare manifest, firmatario, bundletool, APK universale e apksigner. Distribuzione solo .aab, niente .aab.apk. Non pubblicare sullo store senza istruzione esplicita.

## 13. Report obbligatorio

Requisiti chiusi e prove; direzione artistica; coerenza narrativa; asset/audio prodotti e integrati; difetti/blocchi; prossimo lavoro eseguibile. Conserva separati 74 ID, AS01–AS12, E00–E12. Stati OPEN, IN_PROGRESS, IMPLEMENTED, VERIFIED, PARTIAL, FAIL, BLOCKED. Concludi MANDATO COMPLETATO soltanto con tutti i criteri obbligatori dimostrati. Altrimenti MANDATO PARZIALE e COMMERCIAL_RELEASE BLOCKED con ID e dipendenze precise.

## Appendice A — Checklist originale, senza rinumerazione

# CHRONOS — tutte le 74 verifiche di base, estratte dal mandato fornito

- [ ] ART01 — Stile unitario: confrontare protagoniste, NPC, nemici, boss,
  veicoli, ambienti e HUD. Proporzioni, scala dei pixel, dettaglio, materiali
  e ombre appartengono alla stessa opera. Correggere gli asset estranei,
  usando le tavole V8.5 approvate come riferimento.

- [ ] ART02 — Identità e silhouette: Nox e Lulù sono riconoscibili nelle
  direzioni e animazioni anche senza colore. Armi, gadget e nuovi personaggi
  conservano scala, punti di contatto e materiali del mondo. Nessuna skin
  modifica involontariamente identità o ruolo.

- [ ] ART03 — Recitazione e movimento: locomozione, tiro, mosse, ricarica,
  ferite e gesti emotivi hanno continuità, peso e transizioni coerenti.
  Verificare appoggi, arma in mano, direzione e tempi; le pose sostengono
  la scena e la relazione fra le protagoniste.

- [ ] ART04 — Identità dei luoghi: ogni regione possiede architettura,
  palette, luce e dettagli di vita propri, nella stessa fantascienza
  industriale. Le scelte producono trasformazioni visibili e plausibili;
  evitare ambienti indistinti o il neon come unico tema.

- [ ] ART05 — Effetti leggibili: particelle, colpi, barriere, anomalie e
  suoni appartengono alla tecnologia della scena. Danno, portata e collisioni
  corrispondono agli effetti; qualità ridotta e stile non nascondono i pericoli.

- [ ] ART06 — Personalità nei dettagli: icone originali, pulsanti, barra
  vita, ritratti, pannelli e menu condividono una grammatica cyberpunk CHRONOS.
  Controllare anche errori, stati vuoti e cooldown, preservando accessibilità,
  leggibilità e uso con due pollici.

- [ ] NAR01 — Cronologia e conoscenze: per ogni blocco verificare presenza,
  informazioni, desideri e passaggio alla scena successiva. Nessuno cita
  informazioni non ricevute o anticipa rivelazioni; viaggi, percorsi separati
  e incontri aggiunti restano compatibili.

- [ ] NAR02 — Fatti canonici: preservare i 19 civili, la firma usata senza
  consenso, l'esposizione di Nox a Elyon e la frattura. Nessuna scelta autorizza
  retroattivamente quell'uso. EVE-47, EVE-Prime, Elena e Lia conservano i loro ruoli.

- [ ] NAR03 — Personaggi e tono: motivazioni, voce, humour e gesti della
  coppia restano riconoscibili e crescono attraverso eventi preparati.
  I personaggi nuovi hanno funzione propria e non spiegano tutto o risolvono
  i conflitti togliendo iniziativa alle protagoniste.

- [ ] NAR04 — Scelte e persistenza: verificare scelta → stato salvato →
  conseguenza → callback. Dialoghi, ambienti e NPC non contraddicono il
  risultato dopo retry/reload. Gli effetti fra percorsi non attribuiscono
  alle protagoniste conoscenze che non hanno ricevuto.

- [ ] NAR05 — Gameplay e storia: armi, gadget, cure, sblocchi, gare di Veyra
  e nuovi incontri hanno causa e collocazione. Le meccaniche rispettano
  autonomia, separazione e reunion; il vetro rimane privo di poteri.

- [ ] NAR06 — Finale e comprensione: reunion prima di Archon, perdono non
  imposto, sostegno di Lulù e colpo finale del giocatore/Nox; Lia resta un
  ricordo ed Elyon continua senza controllo coercitivo. Gli stranieri non
  risolvono il finale. Verificare con persone reali la comprensione della storia.

- [ ] CRE01 — Base giocabile effettivamente osservata e momento produttivo
  corretto, con dipendenze e prove mancanti dichiarate.

- [ ] CRE02 — Problema del giocatore e valore atteso espressi chiaramente,
  senza partire da un elenco obbligatorio di feature nuove.

- [ ] CRE03 — Decisione autoriale presa da GPT-6 e motivata, senza rimettere
  una scelta reversibile di routine all'autore.

- [ ] CRE04 — Personaggi/armi/componenti scelti hanno funzione e personalità
  proprie e restano coerenti con Nox, Lulù, Vanta e il canone.

- [ ] CRE05 — Aggiunta integrata in input, simulazione, arte/audio, IT/EN,
  progressione e save, con ID separati dai contenuti già confermati.

- [ ] CRE06 — Prova prima/dopo del beneficio e regressione pertinente;
  costo Android, leggibilità e due pollici restano accettabili.

- [ ] CRE07 — Prezzo obiettivo corrente €5,99 riconciliato e valutazione
  umana del valore registrata quando richiesta; nessuna garanzia di vendite.

- [ ] CRE08 — Decisione finale: mantenere, rifinire o togliere il prototipo
  sulla base delle prove; aggiornare stato e proseguire senza espansione infinita.

- [ ] A01 — Classificare tutte le azioni in normali, da arma, abilità,
  speciali/cooperazione, gadget e cure. Ogni azione ha una funzione propria.

- [ ] A02 — Compilare ID, protagonista, sblocco e incontro di apprendimento;
  distinguere modificatori come Quickdraw da nuove mosse.

- [ ] A03 — Definire input, portata, bersagli, tempi, costi e momento del
  consumo per ogni azione; nessuna risorsa o barra superflua.

- [ ] A04 — Completare la matrice dei conflitti: sparo/movimento,
  raffica/ricarica, Dash/recupero, cura/ricarica, gadget/attacco,
  cambio arma o personaggio/speciale.

- [ ] A05 — Collegare catalogo, sblocchi e risorse al save reale,
  rispettando separazione, reunion e colpo finale di Nox.

- [ ] B01 — Tenere joystick, Spara, Schiva e abilità in posizioni stabili;
  gadget e cure non spostano i comandi frequenti.

- [ ] B02 — Rendere visibili arma, gadget selezionato e numero di kit;
  un'azione non disponibile spiega il motivo senza popup invasivi.

- [ ] B03 — Verificare un'attivazione per pressione, rilascio/cancellazione,
  cambio focus e assenza di duplicati da touch più click.

- [ ] B04 — Verificare movimento più azione con due pollici; nessuna
  combinazione obbligatoria richiede tre dita o copre il pericolo.

- [ ] B05 — Insegnare una funzione alla volta, con testi IT/EN brevi;
  provare anche tastiera e controller con lo stesso significato.

- [ ] C01 — Una cura valida ripristina fino al massimo e consuma un kit;
  a vita piena, senza kit o da sconfitti non consuma nulla.

- [ ] C02 — Verificare cura in movimento, pressione ripetuta, pausa,
  ricarica e cambio protagonista; nessuna cura pendente alla ripresa.

- [ ] C03 — Collegare consumo ed effetto allo stesso evento e provare
  riavvio, errore di scrittura e retry senza duplicare o rifornire kit.

- [ ] C04 — Distinguere vita, barriera e integrità del mezzo; verificare
  recuperi da relè/Duo senza rigenerazione o premi ripetibili involontari.

- [ ] C05 — Definire slot e limiti dei gadget; nessun passaggio obbligatorio
  diventa impossibile esaurendo un consumabile e nessun gadget duplica
  un'abilità esistente senza introdurre una scelta diversa.

- [ ] D01 — Rimuovere cuoricini pieni/vuoti da tutte le visualizzazioni
  della salute, incluse fuga, tutorial e copie di layout distribuite.

- [ ] D02 — Collegare la barra a salute corrente/massima senza cambiare
  punti, danni o difficoltà; provare piena, parziale, bassa e zero.

- [ ] D03 — Gestire danni e cure consecutivi, coda animata, vita massima
  modificata e riduzione del movimento senza valori visivi obsoleti.

- [ ] D04 — Rendere distinguibili protagonista attiva, boss, risorse e
  integrità del mezzo; le monete rimangono un contatore negli hub.

- [ ] D05 — Verificare posizione, contrasto, safe area, etichetta
  accessibile e avviso di salute bassa senza dipendere dal solo colore
  o coprire lo schermo con lampeggi.

- [ ] E01 — Ogni mossa ha preparazione, attivazione, contatto, conseguenza
  e recupero coerenti con la scheda e con il bersaglio reale.

- [ ] E02 — Le cinque armi mostrano colpi, consumo, ricarica e impatti
  distinti; tracce e collegamenti rispettano portata e coperture.

- [ ] E03 — Dash, Counter, abilità e speciali comunicano disponibilità,
  fase attiva e fine; nessuna scia decorativa infligge danni inattesi.

- [ ] E04 — Cure, barriera, gadget e riparazioni hanno effetti e suoni
  riconoscibili; l'audio di cura non copre gli avvisi di un attacco.

- [ ] E05 — A qualità ridotta rimangono tutte le informazioni necessarie;
  particelle, lampi e scosse non nascondono personaggio, rischi o joystick.

- [ ] F01 — Eseguire prove mirate di costi, tempi, conflitti e interruzioni
  che possano causare regressioni; evitare test che controllino solo il testo.

- [ ] F02 — Provare nel browser e nella WebView Android touch, pausa,
  background/ripresa, salvataggio e recupero sui percorsi modificati.

- [ ] F03 — Far usare joystick, mosse, gadget, cure e barra a persone nuove;
  registrare tocchi errati, comprensione e difficoltà senza inventare esiti.

- [ ] F04 — Verificare prestazioni e leggibilità sui dispositivi pertinenti,
  incluse sequenze di molti effetti e danni/cure ravvicinati.

- [ ] F05 — Collegare prove alla build, correggere i difetti, aggiornare
  catalogo e materiali IT/EN e registrare l'accettazione senza dichiarare
  chiusi automaticamente gli altri requisiti commerciali.

- [ ] DES01 — Palette con ruoli condivisi, accenti Nox/Lulù e segnali
  cura/attenzione/pericolo distinti; non soltanto un filtro neon globale.

- [ ] DES02 — Materiali, bordi, doppio segno e dettagli riconoscibili come
  tecnologia di Vanta, coerenti con personaggi e ambientazioni.

- [ ] DES03 — Contrasto verificato sulle combinazioni finali, comprese
  trasparenze e sfondi chiari/scuri; informazioni leggibili senza il solo colore.

- [ ] DES04 — Stile cyberpunk integrato con fantascienza umana e riferimenti
  approvati; nessun cambio involontario di canone o identità dei personaggi.

- [ ] DES05 — Set originale di icone SVG/sprite con proporzioni e spessori
  comuni, senza emoji o glifi di sistema come soluzione distribuita.

- [ ] DES06 — Spara, Schiva, abilità, cura, gadget, ricarica e Duo distinguibili
  per forma e significato anche a dimensione telefono.

- [ ] DES07 — Stati normale, premuto, selezionato, pronto, cooldown,
  non disponibile e focus presenti e corrispondenti allo stato reale.

- [ ] DES08 — Nomi/etichette IT/EN accessibili e stati scopribili su touch,
  tastiera e controller senza dipendere da hover o tooltip obbligatori.

- [ ] DES09 — Joystick e pulsanti hanno personalità, ma restano stabili,
  raggiungibili e corretti nelle loro aree di tocco.

- [ ] DES10 — Barra vita senza cuoricini, kit cura, carica speciale e
  integrità del mezzo leggibili e distinti, senza pannelli decorativi invasivi.

- [ ] DES11 — Dialoghi, scelte, inventario, negozi e risultati usano componenti
  condivisi con margini, titoli e gerarchia coerenti.

- [ ] DES12 — Menu, pausa, opzioni, errori recuperabili e stati vuoti sono
  rifiniti; nessuna schermata secondaria abbandonata come form generico.

- [ ] DES13 — Risposta visiva al tocco immediata, senza spostamenti di layout,
  animazioni ritardate o nuove condizioni che rendano impreciso il joystick.

- [ ] DES14 — Microanimazioni, luci e dettagli rafforzano il significato
  delle azioni; riduzione del movimento e delle luci conserva l'informazione.

- [ ] DES15 — Proiettili, mosse, particelle e impatti rispettano fisica,
  collisioni e portata; l'estetica non nasconde telegraph o vie di fuga.

- [ ] DES16 — Feedback sonoro di UI e stato coerente, discreto e subordinato
  agli avvisi; nessun suono di successo per un'azione che non è riuscita.

- [ ] DES17 — Tavola di componenti presente e componenti applicati nel gioco;
  la tavola o un mockup da soli non chiudono l'integrazione.

- [ ] DES18 — Confronti prima/dopo nella stessa scena, lingua, formato e stato;
  prove anche delle interazioni, non soltanto catture statiche.

- [ ] DES19 — Layout piccoli/grandi, safe area, IT/EN, testo lungo e modalità
  accessibili verificati nei percorsi rappresentativi.

- [ ] DES20 — Prestazioni e memoria entro budget sui dispositivi pertinenti;
  stile condiviso e asset riusabili, senza copie o effetti costosi superflui.

- [ ] DES21 — GPT-6 ha verificato il passaggio sul codice/build effettivi,
  distinguendo prove riusabili, mancanti e invalidate dalle modifiche.

- [ ] DES22 — I difetti di design confermati sono stati corretti e riprovati;
  nessuna semplice lista di consigli presentata come lavoro concluso.

- [ ] DES23 — Le osservazioni umane previste su comprensione, tocchi errati
  e personalità visiva sono registrate realmente, senza pareri simulati.

- [ ] DES24 — Prove e checklist si riferiscono alla candidata aggiornata;
  dipendenze esterne dichiarate e nessuna release commerciale anticipata.


## Appendice B — Tutte le famiglie asset e candidati mappati

La tabella non certifica completezza. Un campo vuoto richiede riconciliazione o produzione.

| ID originale | Contenuto | Famiglia | File candidati | Stato |
|---|---|---|---|---|
| boss.rook.sprite_animation_set | Rook | sprite_animation_set | game/art/v09/rook.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| boss.rook.attack_vfx_set | Rook | attack_vfx_set | game/runtime.mjs | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| boss.rook.telegraph_sfx_family | Rook | telegraph_sfx_family | game/audio/v10/rook_aim.ogg;game/audio/v10/rook_burst.ogg;game/audio/v10/rook_disarm.ogg;game/audio/v10/rook_mine.ogg;game/audio/v10/rook_shot.ogg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| boss.rook.arena_visual_set | Rook | arena_visual_set | game/layouts.mjs | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| boss.rook.boss_music_cues | Rook | boss_music_cues | game/audio/v10/rook_line.ogg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| boss.anchor.sprite_animation_set | The Anchor | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.anchor.attack_vfx_set | The Anchor | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.anchor.telegraph_sfx_family | The Anchor | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.anchor.arena_visual_set | The Anchor | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.anchor.boss_music_cues | The Anchor | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.volkov.sprite_animation_set | Volkov | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.volkov.attack_vfx_set | Volkov | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.volkov.telegraph_sfx_family | Volkov | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.volkov.arena_visual_set | Volkov | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.volkov.boss_music_cues | Volkov | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.custode.sprite_animation_set | Custode del Nodo | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.custode.attack_vfx_set | Custode del Nodo | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.custode.telegraph_sfx_family | Custode del Nodo | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.custode.arena_visual_set | Custode del Nodo | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.custode.boss_music_cues | Custode del Nodo | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.vega.sprite_animation_set | Vega | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.vega.attack_vfx_set | Vega | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.vega.telegraph_sfx_family | Vega | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.vega.arena_visual_set | Vega | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.vega.boss_music_cues | Vega | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.eve_prime.sprite_animation_set | EVE-Prime | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.eve_prime.attack_vfx_set | EVE-Prime | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.eve_prime.telegraph_sfx_family | EVE-Prime | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.eve_prime.arena_visual_set | EVE-Prime | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.eve_prime.boss_music_cues | EVE-Prime | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.bone_tyrant.sprite_animation_set | Cathedral Bone Tyrant | sprite_animation_set | game/art/chrono/cathedral_bone_tyrant.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| boss.bone_tyrant.attack_vfx_set | Cathedral Bone Tyrant | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.bone_tyrant.telegraph_sfx_family | Cathedral Bone Tyrant | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.bone_tyrant.arena_visual_set | Cathedral Bone Tyrant | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.bone_tyrant.boss_music_cues | Cathedral Bone Tyrant | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.shadow_reaper.sprite_animation_set | Shadow Reaper | sprite_animation_set | game/art/chrono/shadow_reaper.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| boss.shadow_reaper.attack_vfx_set | Shadow Reaper | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.shadow_reaper.telegraph_sfx_family | Shadow Reaper | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.shadow_reaper.arena_visual_set | Shadow Reaper | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.shadow_reaper.boss_music_cues | Shadow Reaper | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.forge_behemoth.sprite_animation_set | Toxic Forge Behemoth | sprite_animation_set | game/art/chrono/toxic_forge_behemoth.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| boss.forge_behemoth.attack_vfx_set | Toxic Forge Behemoth | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.forge_behemoth.telegraph_sfx_family | Toxic Forge Behemoth | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.forge_behemoth.arena_visual_set | Toxic Forge Behemoth | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.forge_behemoth.boss_music_cues | Toxic Forge Behemoth | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.root_engine.sprite_animation_set | Root Engine | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.root_engine.attack_vfx_set | Root Engine | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.root_engine.telegraph_sfx_family | Root Engine | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.root_engine.arena_visual_set | Root Engine | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.root_engine.boss_music_cues | Root Engine | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.ram.sprite_animation_set | The Ram | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.ram.attack_vfx_set | The Ram | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.ram.telegraph_sfx_family | The Ram | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.ram.arena_visual_set | The Ram | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.ram.boss_music_cues | The Ram | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.twelfth_observer.sprite_animation_set | The Twelfth Observer | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.twelfth_observer.attack_vfx_set | The Twelfth Observer | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.twelfth_observer.telegraph_sfx_family | The Twelfth Observer | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.twelfth_observer.arena_visual_set | The Twelfth Observer | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.twelfth_observer.boss_music_cues | The Twelfth Observer | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.lamplight_king.sprite_animation_set | The Lamplight King | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.lamplight_king.attack_vfx_set | The Lamplight King | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.lamplight_king.telegraph_sfx_family | The Lamplight King | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.lamplight_king.arena_visual_set | The Lamplight King | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.lamplight_king.boss_music_cues | The Lamplight King | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.helix.sprite_animation_set | HELIX | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.helix.attack_vfx_set | HELIX | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.helix.telegraph_sfx_family | HELIX | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.helix.arena_visual_set | HELIX | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.helix.boss_music_cues | HELIX | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.sera_venn.sprite_animation_set | Sera Venn | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.sera_venn.attack_vfx_set | Sera Venn | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.sera_venn.telegraph_sfx_family | Sera Venn | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.sera_venn.arena_visual_set | Sera Venn | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.sera_venn.boss_music_cues | Sera Venn | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.parallax.sprite_animation_set | PARALLAX | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.parallax.attack_vfx_set | PARALLAX | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.parallax.telegraph_sfx_family | PARALLAX | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.parallax.arena_visual_set | PARALLAX | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.parallax.boss_music_cues | PARALLAX | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.archon.sprite_animation_set | Archon | sprite_animation_set | game/art/chrono/chrono_overlord.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| boss.archon.attack_vfx_set | Archon | attack_vfx_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.archon.telegraph_sfx_family | Archon | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.archon.arena_visual_set | Archon | arena_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| boss.archon.boss_music_cues | Archon | boss_music_cues |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.necropolis.environment_visual_set | Necropoli | environment_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.necropolis.ambience_loop_set | Necropoli | ambience_loop_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.necropolis.music_cue_or_variant | Necropoli | music_cue_or_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.glass_flood.environment_visual_set | Glass Flood | environment_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.glass_flood.ambience_loop_set | Glass Flood | ambience_loop_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.glass_flood.music_cue_or_variant | Glass Flood | music_cue_or_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.toxic_forge.environment_visual_set | Toxic Forge | environment_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.toxic_forge.ambience_loop_set | Toxic Forge | ambience_loop_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.toxic_forge.music_cue_or_variant | Toxic Forge | music_cue_or_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.iron_orchard.environment_visual_set | Iron Orchard | environment_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.iron_orchard.ambience_loop_set | Iron Orchard | ambience_loop_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.iron_orchard.music_cue_or_variant | Iron Orchard | music_cue_or_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.ash_docks.environment_visual_set | Ash Docks | environment_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.ash_docks.ambience_loop_set | Ash Docks | ambience_loop_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.ash_docks.music_cue_or_variant | Ash Docks | music_cue_or_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.lost_noon.environment_visual_set | Osservatorio del Mezzogiorno Perduto | environment_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.lost_noon.ambience_loop_set | Osservatorio del Mezzogiorno Perduto | ambience_loop_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.lost_noon.music_cue_or_variant | Osservatorio del Mezzogiorno Perduto | music_cue_or_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.solkara.environment_visual_set | Solkara | environment_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.solkara.ambience_loop_set | Solkara | ambience_loop_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.solkara.music_cue_or_variant | Solkara | music_cue_or_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.noctis_vale.environment_visual_set | Noctis Vale | environment_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.noctis_vale.ambience_loop_set | Noctis Vale | ambience_loop_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.noctis_vale.music_cue_or_variant | Noctis Vale | music_cue_or_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.aurelia_span.environment_visual_set | Aurelia Span | environment_visual_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.aurelia_span.ambience_loop_set | Aurelia Span | ambience_loop_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| region.aurelia_span.music_cue_or_variant | Aurelia Span | music_cue_or_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_docks.track_visual_states | La sfida di Veyra | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_docks.route_signal_visuals | La sfida di Veyra | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_docks.race_sfx_family | La sfida di Veyra | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_docks.ambience_or_music_variant | La sfida di Veyra | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_slalom.track_visual_states | Fra le gru | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_slalom.route_signal_visuals | Fra le gru | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_slalom.race_sfx_family | Fra le gru | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_slalom.ambience_or_music_variant | Fra le gru | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_switchyard.track_visual_states | Scambi al porto | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_switchyard.route_signal_visuals | Scambi al porto | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_switchyard.race_sfx_family | Scambi al porto | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_switchyard.ambience_or_music_variant | Scambi al porto | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_night.track_visual_states | Luci spente | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_night.route_signal_visuals | Luci spente | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_night.race_sfx_family | Luci spente | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.ash_night.ambience_or_music_variant | Luci spente | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara.track_visual_states | Fra i convogli | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara.route_signal_visuals | Fra i convogli | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara.race_sfx_family | Fra i convogli | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara.ambience_or_music_variant | Fra i convogli | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara_regularity.track_visual_states | Il passo del convoglio | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara_regularity.route_signal_visuals | Il passo del convoglio | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara_regularity.race_sfx_family | Il passo del convoglio | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara_regularity.ambience_or_music_variant | Il passo del convoglio | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara_storm.track_visual_states | Il fronte di sabbia | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara_storm.route_signal_visuals | Il fronte di sabbia | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara_storm.race_sfx_family | Il fronte di sabbia | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.solkara_storm.ambience_or_music_variant | Il fronte di sabbia | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.noctis_lightline.track_visual_states | La strada delle lampade | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.noctis_lightline.route_signal_visuals | La strada delle lampade | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.noctis_lightline.race_sfx_family | La strada delle lampade | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.noctis_lightline.ambience_or_music_variant | La strada delle lampade | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.aurelia_span.track_visual_states | Ponti del tempo | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.aurelia_span.route_signal_visuals | Ponti del tempo | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.aurelia_span.race_sfx_family | Ponti del tempo | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.aurelia_span.ambience_or_music_variant | Ponti del tempo | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.veyra_duel.track_visual_states | La linea di Ash | track_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.veyra_duel.route_signal_visuals | La linea di Ash | route_signal_visuals |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.veyra_duel.race_sfx_family | La linea di Ash | race_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| race.veyra_duel.ambience_or_music_variant | La linea di Ash | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.c9.equipped_visual_animation | C-9 | equipped_visual_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.c9.weapon_icon | C-9 | weapon_icon |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.c9.shot_impact_vfx | C-9 | shot_impact_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.c9.weapon_sfx_family | C-9 | weapon_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.vx9.equipped_visual_animation | VX-9 | equipped_visual_animation | game/art/v10/nox_vx9_gun.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| weapon.vx9.weapon_icon | VX-9 | weapon_icon | game/art/v05/weapon_icons.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| weapon.vx9.shot_impact_vfx | VX-9 | shot_impact_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.vx9.weapon_sfx_family | VX-9 | weapon_sfx_family | game/audio/v10/vx9_shot.ogg;game/audio/v10/weapon_reload.ogg;game/audio/v10/weapon_switch.ogg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| weapon.r12.equipped_visual_animation | R-12 | equipped_visual_animation | game/art/v10/lulu_r12_gun.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| weapon.r12.weapon_icon | R-12 | weapon_icon | game/art/v05/weapon_icons.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| weapon.r12.shot_impact_vfx | R-12 | shot_impact_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.r12.weapon_sfx_family | R-12 | weapon_sfx_family | game/audio/v10/r12_shot.ogg;game/audio/v10/weapon_reload.ogg;game/audio/v10/weapon_switch.ogg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| weapon.h17.equipped_visual_animation | H-17 Needle | equipped_visual_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.h17.weapon_icon | H-17 Needle | weapon_icon |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.h17.shot_impact_vfx | H-17 Needle | shot_impact_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.h17.weapon_sfx_family | H-17 Needle | weapon_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.arc7.equipped_visual_animation | ARC-7 Choir | equipped_visual_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.arc7.weapon_icon | ARC-7 Choir | weapon_icon |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.arc7.shot_impact_vfx | ARC-7 Choir | shot_impact_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.arc7.weapon_sfx_family | ARC-7 Choir | weapon_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| mission.exp_chalk_marks.scene_staging_animation | Segni di Gesso | scene_staging_animation | game/art/chrono/civilian.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| mission.exp_chalk_marks.specific_prop_states | Segni di Gesso | specific_prop_states | game/art/v09/chalk_flask.png;game/art/v09/chalk_flask_states.png;game/art/v09/chalk_route.svg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| mission.exp_chalk_marks.interaction_sfx_family | Segni di Gesso | interaction_sfx_family | game/audio/v10/chalk_scrape.ogg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| mission.exp_chalk_marks.ambience_or_music_variant | Segni di Gesso | ambience_or_music_variant | game/audio/v10/chalk_route.ogg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| mission.exp_interrupted_shift.scene_staging_animation | Il turno interrotto | scene_staging_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| mission.exp_interrupted_shift.specific_prop_states | Il turno interrotto | specific_prop_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| mission.exp_interrupted_shift.interaction_sfx_family | Il turno interrotto | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| mission.exp_interrupted_shift.ambience_or_music_variant | Il turno interrotto | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| mission.exp_borrowed_light.scene_staging_animation | Una luce prestata | scene_staging_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| mission.exp_borrowed_light.specific_prop_states | Una luce prestata | specific_prop_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| mission.exp_borrowed_light.interaction_sfx_family | Una luce prestata | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| mission.exp_borrowed_light.ambience_or_music_variant | Una luce prestata | ambience_or_music_variant |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.nox.sprite_animation_set | Nox | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.nox.portrait_or_story_gestures | Nox | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.nox.action_sfx_family | Nox | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.lulu.sprite_animation_set | Lulù | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.lulu.portrait_or_story_gestures | Lulù | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.lulu.action_sfx_family | Lulù | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.veyra.sprite_animation_set | Veyra Ash Kor | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.veyra.portrait_or_story_gestures | Veyra Ash Kor | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.veyra.action_sfx_family | Veyra Ash Kor | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.elena.sprite_animation_set | Elena Voss | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.elena.portrait_or_story_gestures | Elena Voss | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.elena.action_sfx_family | Elena Voss | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.lia.memory_visual_sequence | Lia ricordo | memory_visual_sequence |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.lia.memory_audio_or_soundscape | Lia ricordo | memory_audio_or_soundscape |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.eve_prime.sprite_animation_set | EVE-Prime | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.eve_prime.portrait_or_story_gestures | EVE-Prime | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.eve_prime.action_sfx_family | EVE-Prime | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.mira.sprite_animation_set | Mira | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.mira.portrait_or_story_gestures | Mira | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.mira.action_sfx_family | Mira | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.dario.sprite_animation_set | Dario | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.dario.portrait_or_story_gestures | Dario | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.dario.action_sfx_family | Dario | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.ines.sprite_animation_set | Ines | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.ines.portrait_or_story_gestures | Ines | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.ines.action_sfx_family | Ines | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.unit9.sprite_animation_set | Unità 9 | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.unit9.portrait_or_story_gestures | Unità 9 | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.unit9.action_sfx_family | Unità 9 | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.tessa.sprite_animation_set | Tessa | sprite_animation_set | game/art/v09/tessa.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| character.tessa.portrait_or_story_gestures | Tessa | portrait_or_story_gestures | game/art/v09/tessa.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| character.tessa.action_sfx_family | Tessa | action_sfx_family | game/audio/v10/tessa_case.ogg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| character.kairn.sprite_animation_set | Kairn | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.kairn.portrait_or_story_gestures | Kairn | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.kairn.action_sfx_family | Kairn | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.morrow.sprite_animation_set | Morrow | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.morrow.portrait_or_story_gestures | Morrow | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.morrow.action_sfx_family | Morrow | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.sia.sprite_animation_set | Sia | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.sia.portrait_or_story_gestures | Sia | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.sia.action_sfx_family | Sia | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.eren.sprite_animation_set | Eren | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.eren.portrait_or_story_gestures | Eren | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.eren.action_sfx_family | Eren | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.oren.sprite_animation_set | Oren | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.oren.portrait_or_story_gestures | Oren | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.oren.action_sfx_family | Oren | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.bran_kess.sprite_animation_set | Bran Kess | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.bran_kess.portrait_or_story_gestures | Bran Kess | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.bran_kess.action_sfx_family | Bran Kess | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.maelis.sprite_animation_set | Maelis | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.maelis.portrait_or_story_gestures | Maelis | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.maelis.action_sfx_family | Maelis | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.tomas_vale.sprite_animation_set | Tomas Vale | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.tomas_vale.portrait_or_story_gestures | Tomas Vale | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.tomas_vale.action_sfx_family | Tomas Vale | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.tarek.sprite_animation_set | Tarek | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.tarek.portrait_or_story_gestures | Tarek | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.tarek.action_sfx_family | Tarek | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.mara.sprite_animation_set | Mara Filtraia Keld | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.mara.portrait_or_story_gestures | Mara Filtraia Keld | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.mara.action_sfx_family | Mara Filtraia Keld | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.vesper.sprite_animation_set | Vesper | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.vesper.portrait_or_story_gestures | Vesper | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.vesper.action_sfx_family | Vesper | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.ilyra.sprite_animation_set | Ilyra | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.ilyra.portrait_or_story_gestures | Ilyra | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.ilyra.action_sfx_family | Ilyra | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.rika_dorn.sprite_animation_set | Rika Dorn | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.rika_dorn.portrait_or_story_gestures | Rika Dorn | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.rika_dorn.action_sfx_family | Rika Dorn | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.melee.action_animation | Corpo a corpo | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.melee.ability_vfx | Corpo a corpo | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.melee.ability_sfx_family | Corpo a corpo | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.heavy_strike.action_animation | Heavy Strike | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.heavy_strike.ability_vfx | Heavy Strike | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.heavy_strike.ability_sfx_family | Heavy Strike | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.dash.action_animation | Dash | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.dash.ability_vfx | Dash | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.dash.ability_sfx_family | Dash | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.perfect_dodge.action_animation | Perfect Dodge | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.perfect_dodge.ability_vfx | Perfect Dodge | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.perfect_dodge.ability_sfx_family | Perfect Dodge | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.counter.action_animation | Counter | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.counter.ability_vfx | Counter | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.counter.ability_sfx_family | Counter | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.weapon_counter.action_animation | Weapon Counter | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.weapon_counter.ability_vfx | Weapon Counter | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.weapon_counter.ability_sfx_family | Weapon Counter | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.pulse.action_animation | Pulse | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.pulse.ability_vfx | Pulse | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.pulse.ability_sfx_family | Pulse | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.resonance.action_animation | Risonanza | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.resonance.ability_vfx | Risonanza | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.resonance.ability_sfx_family | Risonanza | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.resonance_arc.action_animation | Resonance Arc | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.resonance_arc.ability_vfx | Resonance Arc | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.resonance_arc.ability_sfx_family | Resonance Arc | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.barrier.action_animation | Barrier | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.barrier.ability_vfx | Barrier | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.barrier.ability_sfx_family | Barrier | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.tether.action_animation | Tether | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.tether.ability_vfx | Tether | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.tether.ability_sfx_family | Tether | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.node_override.action_animation | Node Override | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.node_override.ability_vfx | Node Override | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.node_override.ability_sfx_family | Node Override | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.black_pulse.action_animation | Black Pulse | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.black_pulse.ability_vfx | Black Pulse | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.black_pulse.ability_sfx_family | Black Pulse | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.null_driver.action_animation | Null Driver | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.null_driver.ability_vfx | Null Driver | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.null_driver.ability_sfx_family | Null Driver | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.duo.action_animation | Duo | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.duo.ability_vfx | Duo | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.duo.ability_sfx_family | Duo | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.duo_switch.action_animation | Duo Switch | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.duo_switch.ability_vfx | Duo Switch | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.duo_switch.ability_sfx_family | Duo Switch | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.tag_actions.action_animation | Tag Actions | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.tag_actions.ability_vfx | Tag Actions | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.tag_actions.ability_sfx_family | Tag Actions | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.axis_spine.action_animation | Spina dell Asse | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.axis_spine.ability_vfx | Spina dell Asse | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.axis_spine.ability_sfx_family | Spina dell Asse | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.final_sync.action_animation | Final Sync | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.final_sync.ability_vfx | Final Sync | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.final_sync.ability_sfx_family | Final Sync | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.heal.action_animation | Uso della cura | action_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.heal.ability_vfx | Uso della cura | ability_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ability.heal.ability_sfx_family | Uso della cura | ability_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.menu.original_icon_states_or_layout | Menu e sfondo animato | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.menu.ui_feedback_family | Menu e sfondo animato | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.android_icon.android_icon_artwork_variants | Icona Android | android_icon_artwork_variants | assets/brand/play-icon-512.png | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| ui.joystick.original_icon_states_or_layout | Joystick | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.joystick.ui_feedback_family | Joystick | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.fire.original_icon_states_or_layout | Spara | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.fire.ui_feedback_family | Spara | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.dodge.original_icon_states_or_layout | Schiva | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.dodge.ui_feedback_family | Schiva | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.ability.original_icon_states_or_layout | Abilità | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.ability.ui_feedback_family | Abilità | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.heal.original_icon_states_or_layout | Cura | original_icon_states_or_layout | game/art/v09/medseal.svg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| ui.heal.ui_feedback_family | Cura | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.gadget.original_icon_states_or_layout | Gadget | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.gadget.ui_feedback_family | Gadget | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.reload.original_icon_states_or_layout | Ricarica | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.reload.ui_feedback_family | Ricarica | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.duo.original_icon_states_or_layout | Duo | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.duo.ui_feedback_family | Duo | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.health_bar.original_icon_states_or_layout | Barra vita | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.health_bar.ui_feedback_family | Barra vita | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.vehicle.original_icon_states_or_layout | Guida e integrità | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.vehicle.ui_feedback_family | Guida e integrità | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.dialogue.original_icon_states_or_layout | Dialoghi e scelte | original_icon_states_or_layout | game/locale.mjs | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| ui.dialogue.ui_feedback_family | Dialoghi e scelte | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.inventory.original_icon_states_or_layout | Inventario | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.inventory.ui_feedback_family | Inventario | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.shop.original_icon_states_or_layout | Negozi | original_icon_states_or_layout | game/locale.mjs | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| ui.shop.ui_feedback_family | Negozi | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.race_result.original_icon_states_or_layout | Risultati gara | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.race_result.ui_feedback_family | Risultati gara | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.pause_settings.original_icon_states_or_layout | Pausa e impostazioni | original_icon_states_or_layout | game/locale.mjs | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| ui.pause_settings.ui_feedback_family | Pausa e impostazioni | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.recovery.original_icon_states_or_layout | Errore e recupero | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.recovery.ui_feedback_family | Errore e recupero | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.save.original_icon_states_or_layout | Salvataggio | original_icon_states_or_layout |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| ui.save.ui_feedback_family | Salvataggio | ui_feedback_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| motif.free_seat.authored_gesture_sequence | Posto lasciato libero | authored_gesture_sequence |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| motif.chalk.authored_gesture_sequence | Segni di Gesso prima e dopo | authored_gesture_sequence |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| motif.unused_channel.authored_gesture_sequence | Canale non usato | authored_gesture_sequence |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| motif.interrupted_hand.authored_gesture_sequence | Mano interrotta | authored_gesture_sequence |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| motif.two_knocks.authored_gesture_sequence | Due colpi domanda risposta | authored_gesture_sequence |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| motif.two_knocks.two_knocks_signature_sfx | Due colpi domanda risposta | two_knocks_signature_sfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| motif.returned_light.authored_gesture_sequence | Luce restituita | authored_gesture_sequence |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| motif.final_hand.authored_gesture_sequence | Mano finale | authored_gesture_sequence |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.chalk_sign.prop_visual_states | Segno di gesso materiale | prop_visual_states | game/art/v09/chalk_route.svg | EXISTING_CANDIDATE_REVIEW_REQUIRED |
| prop.chalk_sign.interaction_animation | Segno di gesso materiale | interaction_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.chalk_sign.interaction_sfx_family | Segno di gesso materiale | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.helios_valve.prop_visual_states | Valvola HELIOS | prop_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.helios_valve.interaction_animation | Valvola HELIOS | interaction_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.helios_valve.interaction_sfx_family | Valvola HELIOS | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.borrowed_lamp.prop_visual_states | Lampada prestata | prop_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.borrowed_lamp.interaction_animation | Lampada prestata | interaction_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.borrowed_lamp.interaction_sfx_family | Lampada prestata | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.switchyard.prop_visual_states | Scambio del porto | prop_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.switchyard.interaction_animation | Scambio del porto | interaction_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.switchyard.interaction_sfx_family | Scambio del porto | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.time_window.prop_visual_states | Segnale finestra convoglio | prop_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.time_window.interaction_animation | Segnale finestra convoglio | interaction_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.time_window.interaction_sfx_family | Segnale finestra convoglio | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.lightline.prop_visual_states | Lampada di percorso | prop_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.lightline.interaction_animation | Lampada di percorso | interaction_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.lightline.interaction_sfx_family | Lampada di percorso | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.glass_shard.prop_visual_states | Vetro senza poteri | prop_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.glass_shard.interaction_animation | Vetro senza poteri | interaction_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.glass_shard.interaction_sfx_family | Vetro senza poteri | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.medkit.prop_visual_states | Kit di cura | prop_visual_states |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.medkit.interaction_animation | Kit di cura | interaction_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| prop.medkit.interaction_sfx_family | Kit di cura | interaction_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.raider.sprite_animation_set | Raider | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.raider.attack_vfx | Raider | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.raider.telegraph_sfx_family | Raider | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.breaker.sprite_animation_set | Breaker | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.breaker.attack_vfx | Breaker | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.breaker.telegraph_sfx_family | Breaker | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.signal_tech.sprite_animation_set | Signal Tech | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.signal_tech.attack_vfx | Signal Tech | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.signal_tech.telegraph_sfx_family | Signal Tech | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.enforcer.sprite_animation_set | Enforcer | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.enforcer.attack_vfx | Enforcer | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.enforcer.telegraph_sfx_family | Enforcer | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.skitter.sprite_animation_set | Skitter | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.skitter.attack_vfx | Skitter | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.skitter.telegraph_sfx_family | Skitter | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.spitter.sprite_animation_set | Spitter | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.spitter.attack_vfx | Spitter | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.spitter.telegraph_sfx_family | Spitter | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.anchor_beast.sprite_animation_set | Anchor Beast | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.anchor_beast.attack_vfx | Anchor Beast | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.anchor_beast.telegraph_sfx_family | Anchor Beast | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.drifter.sprite_animation_set | Drifter | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.drifter.attack_vfx | Drifter | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.drifter.telegraph_sfx_family | Drifter | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.echo.sprite_animation_set | Echo | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.echo.attack_vfx | Echo | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.echo.telegraph_sfx_family | Echo | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.carrier.sprite_animation_set | Carrier | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.carrier.attack_vfx | Carrier | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.carrier.telegraph_sfx_family | Carrier | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.warden.sprite_animation_set | Warden | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.warden.attack_vfx | Warden | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.warden.telegraph_sfx_family | Warden | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.prism.sprite_animation_set | Prism | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.prism.attack_vfx | Prism | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.prism.telegraph_sfx_family | Prism | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.binder.sprite_animation_set | Binder | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.binder.attack_vfx | Binder | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.binder.telegraph_sfx_family | Binder | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.glassback.sprite_animation_set | Glassback | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.glassback.attack_vfx | Glassback | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.glassback.telegraph_sfx_family | Glassback | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.choir.sprite_animation_set | Choir | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.choir.attack_vfx | Choir | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.choir.telegraph_sfx_family | Choir | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.seraph.sprite_animation_set | Seraph | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.seraph.attack_vfx | Seraph | attack_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| enemy.seraph.telegraph_sfx_family | Seraph | telegraph_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.neris.sprite_animation_set | Neris Cavo | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.neris.portrait_or_story_gestures | Neris Cavo | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.neris.action_sfx_family | Neris Cavo | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.ivo.sprite_animation_set | Ivo Contrappeso | sprite_animation_set |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.ivo.portrait_or_story_gestures | Ivo Contrappeso | portrait_or_story_gestures |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| character.ivo.action_sfx_family | Ivo Contrappeso | action_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.l6_cerniera.equipped_visual_animation | L-6 Cerniera | equipped_visual_animation |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.l6_cerniera.weapon_icon | L-6 Cerniera | weapon_icon |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.l6_cerniera.shot_impact_vfx | L-6 Cerniera | shot_impact_vfx |  | UNMAPPED_RECONCILE_OR_PRODUCE |
| weapon.l6_cerniera.weapon_sfx_family | L-6 Cerniera | weapon_sfx_family |  | UNMAPPED_RECONCILE_OR_PRODUCE |
