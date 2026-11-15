# CHRONOS V10.2 — ogni contenuto ha una produzione audiovisiva associata

Aggiornamento del pacchetto V10.1 fornito dall'autore, 25 ottobre 2026.
Questa precisazione vincola la produzione e non modifica il canone, lo scope,
il prezzo di €5,99, l'obiettivo di circa due ore o i criteri di prova.
Stato del pacchetto: documentazione e requisiti, non asset del gioco prodotti.

## 1. Regola inderogabile

Ogni nuovo contenuto percepibile dal giocatore deve avere un ID, una card e
un pacchetto di asset associato. Ideazione, codice, asset e integrazione
sono parti dello stesso lavoro. Una nuova creazione non si chiude quando
funziona con un quadrato, un suono generico o una riga nel documento.

Per ciascun nuovo personaggio, arma, nemico, boss, gadget, mossa, oggetto,
missione, gara, ambiente, scena o componente UI, definire prima gli asset
necessari. Poi crearli o adattarli, verificarli, collegarli agli eventi e
provarli nella stessa build. Ogni contenuto nuovo richiede almeno un asset
specifico nuovo o adattato coerentemente; tutte le altre famiglie necessarie
restano obbligatorie. Un suono non sostituisce gli sprite di un personaggio,
né un ritratto sostituisce gli avvisi sonori richiesti da un attacco.

Le correzioni puramente tecniche e i flag non richiedono file audiovisivi
artificiali: collegarli al contenuto che servono. Un nuovo asset di messa
in scena o animazione può essere una sequenza authored che usa atlanti validi;
deve avere dati reali, timing, funzione e prova. Rinominare un file, copiarlo
senza trasformazione o scrivere un TODO non costituisce creazione.

## 2. Pacchetto minimo per tipologia

| Contenuto | Asset da associare secondo l'uso reale |
| --- | --- |
| Personaggio/NPC/rivale | Sprite e animazioni pertinenti, ritratto se usato, varianti/gesti richiesti e suoni delle azioni. Il doppiaggio non è implicito. |
| Nemico/boss | Aspetto, locomozione, anticipazioni, attacchi, reazioni e sconfitta; VFX e avvisi distinti; arena e cue delle fasi quando necessari. |
| Arma | Aspetto equipaggiato, pose/animazioni, icona, lampo/scia/impatto e famiglia audio di tiro, vuoto, ricarica e cambio. |
| Mossa/abilità/gadget/cura | Animazione o sequenza, icona/stati quando esposti, VFX della portata e famiglia SFX di attivazione, esito e fallimento. |
| Oggetto interattivo | Aspetto e stati, interazione/gesto, feedback visivo e sonoro necessari; collisione e uso coerenti. |
| Ambiente/regione | Layout/kit visivo appropriato, materiali, illuminazione, ambiente sonoro e musica o variante motivata. |
| Missione/scena | Asset di messa in scena, oggetti e gesti specifici; feedback di obiettivo, ambiente/transizioni e callback pertinenti; testi IT/EN. |
| Gara | Tracciato e varianti visive, segnaletica/stati, mezzi e rivali pertinenti, ambiente, avvisi e musica/variante se necessaria. |
| UI/HUD/menu | Icone originali e stati, superfici/layout, feedback dei controlli ed eventuale animazione; accessibilità e IT/EN. |

Non è necessario generare un brano per ogni oggetto o una voce per ogni riga.
Un silenzio deliberato è una scelta di regia, non una licenza per omettere
avvisi essenziali. Il pacchetto deve coprire ciò che il giocatore vede,
sente e deve capire, con personalità e senza moltiplicazione ornamentale.

## 3. Riuso e adattamento senza falsa produzione

Riutilizzare asset validi quando appropriati, citando ID, file, origine,
licenza e contenuto che li usa. Non rigenerare una C-9 valida perché viene
usata in un'altra scena. Per contenuti nuovi, il pacchetto non può però
essere soltanto un rinvio a un banco generico: deve includere l'asset
specifico creato o adattato che ne rende reale l'identità o la nuova azione.

Un adattamento richiede una trasformazione osservabile: nuove pose,
frame, variante di materiale, composizione sonora, animazione o sequenza
funzionale. Registrare sorgente, differenza e derivato. Non basta cambiare
il nome del file o una tinta per dichiarare un nuovo nemico completo.
Per una famiglia condivisa si può produrre un set comune e collegarlo a
più contenuti; evitare duplicazioni fisiche e conservare gli usi espliciti.

## 4. Collegamento contenuto → asset → evento → build → prova

Usare i registri del repository come fonte di stato; la matrice del pacchetto
è un seme da importarvi o riconciliare, non una seconda verità da lasciare
divergente. Ogni card contiene gli ID degli asset necessari. Ogni asset
indica tipo, brief, creazione/riuso/adattamento, contenuti serviti,
stato, file sorgente e runtime, hash, provenienza/diritti, revisione,
evento/scena d'uso, build e prove.

Stati asset: PLANNED → PRODUCED → TECH_CHECKED → INTEGRATED → VERIFIED.
Un prototipo è marcato PROTOTYPE, un file non conforme QUARANTINED e una
dipendenza esterna BLOCKED. La card rimane in preparazione o parziale finché
uno dei suoi asset necessari non è verificato nella build pertinente.
Non trasformare PLANNED in VERIFIED per chiudere il contatore.

Quando nasce un'idea ulteriore, creare contestualmente card e collegamenti
asset. Se viene scartata una proposta facoltativa, registrare la decisione
e disattivare i relativi requisiti senza cancellare contenuti obbligatori.
Neris, Ivo e L-6 restano proposte condizionali finché adottati; se adottati,
devono completare il pacchetto e non rimangono esenti dalla regola.

## 5. Coerenza artistica, narrativa e fisica

Ogni brief collega luogo, fazione, proprietario, funzione e momento della
storia ai riferimenti V8.5, palette, materiali, scala dei pixel, silhouette
e grammatica sonora. Nox/Lulù restano riconoscibili; una nuova arma non
sembra appartenere a un altro gioco. Non inventare proprietà, biografie
o rivelazioni per giustificare un asset casualmente generato.

Lo sprite parte dalla posa giusta, l'effetto dalla fonte giusta e il suono
dal momento reale dell'azione. Telegraph, area, collisione e danno concordano.
Un nuovo attacco necessita dei suoi segnali prima di poter essere accettato.
Correzioni dei tempi invalidano le prove audiovisive toccate dal cambiamento.
Applicare ART/NAR alle aggiunte, non solo alla campagna di base.

## 6. Produzione e controlli tecnici

Sprite/atlanti: dimensioni e coordinate conformi al renderer, alpha pulito,
pivot, scala, orientamenti, veri frame distinti, loop e transizioni; armi
in mano e appoggi coerenti. Il solo spritesheet statico non dimostra animazione.
Icone: set proprio, stati, contrasto, area touch e accessibilità.

Audio: master e derivato distribuito, durata, campionamento, canali, livelli,
assenza di clipping, loop/transizioni e variazioni pertinenti. Verificare
ascolto, mascheramento degli avvisi, ducking e resa su telefono/cuffie.
Un file decodificabile non dimostra coerenza musicale o licenza.

Integrazione: file realmente caricato e raggiungibile, evento corretto,
nessun errore di percorso, prestazioni/memoria, rilascio delle risorse,
pausa/ripresa e qualità ridotta con segnali essenziali preservati. Verificare
presenza nel pacchetto Android finale, non soltanto nel server di sviluppo.

Quote esaurite, servizi indisponibili e licenze incerte rimangono blocchi
dichiarati. Tentare alternative lecite autorizzate e proseguire sul lavoro
indipendente; non sostituire un requisito con un file vuoto o simulato.

## 7. Accettazione della card e criteri AS01–AS12

Questi sono controlli trasversali di produzione delle card. Non rinumerano
le 74 verifiche di base e non sono PASS ottenuti dalla revisione dei testi.

- [ ] AS01 — Ogni contenuto nuovo è registrato con ID e requisiti asset.
- [ ] AS02 — Il pacchetto copre tutte le famiglie necessarie alla tipologia.
- [ ] AS03 — Almeno un asset specifico nuovo/adattato per ogni nuova creazione.
- [ ] AS04 — Riuso/adattamento tracciato; nessuna copia rinominata come novità.
- [ ] AS05 — Stile, personaggio, luogo, cronologia e funzione coerenti.
- [ ] AS06 — Sprite/animazioni/icone conformi al renderer e alla leggibilità.
- [ ] AS07 — Audio prodotto, revisionato e conforme a mix/loop/avvisi pertinenti.
- [ ] AS08 — File e hash reali, provenienza e diritti verificati.
- [ ] AS09 — Collegamento a scena/evento e uso provato nella stessa build.
- [ ] AS10 — Save, varianti, retry, pause e qualità ridotta pertinenti provati.
- [ ] AS11 — File necessari inclusi e funzionanti nel pacchetto Android.
- [ ] AS12 — Zero asset obbligatori mancanti, prototipi o quarantene alla release.

Una famiglia non pertinente richiede motivazione circoscritta nella card,
non la rimozione indiscriminata dell'audio o della rappresentazione visiva.
Non usare AS01 per chiudere AS09: una mappatura non è integrazione.

## 8. Priorità e uso dei file di questo ZIP

Questa precisazione V10.2 prevale sulle formulazioni generiche relative
al riuso del pacchetto V10.1 soltanto per legame, produzione e accettazione
degli asset. Non autorizza retcon, riduzioni dei contenuti o false prove.
Prima validare comportamento e ingombri con prototipi, poi produrre asset
finali e integrarli nello stesso blocco prima di chiamarlo concluso.

La matrice JSON/CSV contiene requisiti iniziali, con stati PLANNED e percorsi
non ancora assegnati. Non contiene file audiovisivi del gioco. Il validatore
può controllare struttura e collegamenti tecnici, non giudicare da solo arte,
narrativa, ascolto, diritti o autenticità dei playtest. Anche un controllo
tecnico positivo richiede le revisioni e i gate previsti dal mandato.
