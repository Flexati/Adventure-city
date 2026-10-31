# CHRONOS V10.2 — checkpoint073

Repository `Flexati/Adventure-city`; branch previsto `delivery/gpt-preproduzione-310-20261029`. Push GitHub previsto a pacchetto completo, non eseguito. `COMMERCIAL_RELEASE=BLOCKED`.

Sono inclusi 310 prompt individuali, `INDICE.json` con hash/allegati/file attesi/modo e 15 riferimenti originali con `SORGENTI.json`.

Produzione: 197 PNG candidati effettivamente presenti in 93 famiglie, zero approvati. Aggiunti Glass Flood prompt97–100, Iron Orchard prompt101–104, Lost Noon prompt105–108 e Necropolis · Corridoio memoriale prompt109 e Piazza delle campane prompt110, tutti candidati con QA aperta; prossimo prompt115 (parziale: completare prima le tre varianti mancanti).

Risonanza #A060FF: verificare circle VFX non misurabile; impatto condizionato a hit confermato dal codice e nessuno status icon. Tutti gli output `NEEDS_CORRECTION`.

Non inventare valori di gameplay; stati canonici restano `SPECIFIED_NOT_GENERATED` fino ai controlli. Completare pacchetto e QA, poi upload GitHub autorizzato e verifica remota; mantenere `COMMERCIAL_RELEASE=BLOCKED` fino ai gate.


## QA Glass Flood prompt 97

Quattro PNG 1536×1024 sono stati generati. Mantenerli come candidati: non promuovere a master. Team deve verificare stile pixel art, numero di abitanti, identità geometrica della notte, innalzamento della marea, leggibilità delle uscite e griglia/sfondo del foglio props.


## QA Glass Flood prompt 98

Quattro PNG 1536×1024 generati. Il foglio props contiene gli otto soggetti ma occupa due righe invece della griglia 4×3 prescritta. Mantenere tutti i file come candidati e chiedere al team verifica di stile, abitanti, geometria delle varianti e leggibilità delle uscite.


## QA Glass Flood prompt 99

Quattro PNG 1536×1024 generati. Il foglio props include gli otto soggetti ma li dispone su due file anziché nella griglia 4×3. Tenere tutto non approvato; il team deve validare stile, geometria delle varianti, abitanti e leggibilità delle uscite.


## QA Glass Flood prompt 100

Quattro PNG 1536×1024 generati. La tavola props contiene gli otto elementi su due righe anziché 4×3. Mantenere i candidati non approvati; verificare stile, geometria, leggibilità delle uscite e natura decorativa dei riflessi prima dell’uso.


## QA Iron Orchard prompt 101

Quattro PNG 1536×1024 generati. La tavola props contiene gli otto oggetti richiesti ma è in due file e non occupa tre righe. Tutti restano candidati non approvati. Il team deve validare stile, numero degli abitanti, geometria delle varianti e leggibilità del percorso.


## QA Iron Orchard prompt 102

Quattro PNG 1536×1024 generati. La tavola props contiene otto oggetti su due file, non sulla griglia 4×3. Mantieni i file come candidati non approvati; il team deve validare stile, abitanti, geometria delle varianti e leggibilità dei passaggi.


## QA Iron Orchard prompt 103

Quattro PNG 1536×1024 generati. La scheda props ha gli otto soggetti su due file, invece della griglia 4×3. Tutti restano candidati non approvati; team deve verificare la geometria delle varianti, la leggibilità di percorsi/uscite e l’assenza di numeri nelle spie.


## QA Iron Orchard prompt 104

Quattro PNG 1536×1024 generati. I props sono disposti su due righe, non sulla griglia 4×3. Tutti i file restano candidati; team deve validare stile, conteggio abitanti, geometria delle varianti e leggibilità di rifugi e uscite.


## QA Lost Noon prompt 105

Quattro PNG 1536×1024 generati. La tavola props è disposta su due righe invece che nella griglia 4×3; controllare la fedeltà degli oggetti richiesti. I clock hands appaiono fermi sulle 12, ma il team deve verificare tutte le varianti, lo stile e la leggibilità delle uscite.


## QA Lost Noon prompt 106

Quattro PNG 1536×1024 generati. Props impaginati su due file anziché griglia 4×3; controllare quadranti fermi alle 12. Tutti restano candidati non approvati; team deve verificare geometria, percorso e stile.


## QA Lost Noon prompt 107

Quattro PNG 1536×1024 generati. I props sono su due file anziché 4×3. Nella base un quadrante non è chiaramente fermo alle 12; team deve correggere/controllare tutti gli orologi, preservare le sovrapposizioni senza creare passaggi falsi e verificare uscite.


## QA Lost Noon prompt 108

Quattro PNG 1536×1024 generati. La tavola props usa due file invece di 4×3; confermare tutti i quadranti alle 12. Tutti i candidati restano non approvati e vanno confrontati con lo stile canonico e i requisiti delle varianti.


## QA Necropolis prompt 109

Quattro PNG 1536×1024 generati. I props sono disposti su due file anziché nella griglia 4×3. Verificare la distinzione tra campana civica e anomala, la geometria notte, la leggibilità di percorso/uscite durante l’evento sonoro e la fedeltà allo stile canonico.


## QA Necropolis prompt 110

Quattro PNG 1536×1024 presenti. La variante notte non mantiene la geometria della base; la variante evento deve essere controllata per la leggibilità degli anelli e del percorso. Props su due file invece della griglia 4×3. Tutti i file restano candidati `NEEDS_CORRECTION`, non approvati.


# QA prompt 111 — Necropoli · Livelli di manutenzione (v03)

Stato: quattro PNG candidati effettivamente presenti; nessuno approvato. `COMMERCIAL_RELEASE=BLOCKED`; GitHub non aggiornato. Prossimo prompt: 112.

| File | Dimensioni osservate | Rilievi QA |
|---|---:|---|
| `v03.png` | 1672×941 | Percorso centrale e uscite leggibili. Resa più illustrativa/3D che pixel-art canonica. Dimensioni errate. |
| `v03_notte.png` | 1672×941 | Composizione generale simile al master, ma la geometria non è identica pixel per pixel né certificata. Dimensioni errate. |
| `v03_evento.png` | 1672×941 | Onde sonore visibili, percorso leggibile; geometria non identica/certificata. Dimensioni errate. |
| `v03_props.png` | 1448×1086 | Otto oggetti su due file; manca la terza fila vuota della griglia 4×3. Dimensioni errate; verificare almeno 40 px di margine per cella. |

Tutti i file restano `NEEDS_CORRECTION`, `approved=false`. Non usarli come master/runtime. Il team deve rigenerare con formato 1536×1024, pixel art più aderente alle mappe canoniche, notte/evento con geometria identica, foglio props 4×3 con otto oggetti nelle prime otto celle e quattro celle vuote.

## Recupero integrità checkpoint 065

Il registro 065 elencava 232 percorsi PNG candidati, ma 60 di quei file non sono presenti nell'archivio 065 materializzato; sono stati esclusi dall'inventario attivo. I restanti 172 file registrati sono presenti. Le 15 immagini di riferimento sono escluse dal conteggio dei candidati. Dopo l'aggiunta di queste quattro tavole, il registro 066 contiene 197 PNG candidati effettivamente presenti in 93 famiglie con candidati; zero approvate. Il conteggio rettifica l'indice, non cancella i riferimenti al problema.


# QA prompt 112 — Necropoli · Camera del Bone Tyrant (v04)

Stato: quattro PNG candidati presenti; nessuno approvato. `COMMERCIAL_RELEASE=BLOCKED`; GitHub non aggiornato. Prossimo prompt: 113.

| File | Dimensioni osservate | Rilievi QA |
|---|---:|---|
| `v04.png` | 1672×941 | Passaggio centrale leggibile, macchina di conservazione riconoscibile e non occultistica. Resa più illustrativa/3D che pixel-art canonica; dimensioni errate. |
| `v04_notte.png` | 1672×941 | Composizione simile al master, ma geometria non identica né certificata pixel per pixel; dimensioni errate. |
| `v04_evento.png` | 1672×941 | Percorso leggibile, ma onde della campana poco distinguibili; geometria non identica/certificata; dimensioni errate. |
| `v04_props.png` | 1448×1086 | Otto oggetti occupano le prime due righe e la terza resta vuota; layout compatibile con 4×3, ma dimensioni errate e margini da controllare. |

Tutti restano `NEEDS_CORRECTION`, `approved=false`; non usare come master/runtime. Rigenerare 1536×1024 e avvicinare la resa al pixel art canonico. Le derivate devono mantenere geometria identica; rendere l’evento sonoro più leggibile senza coprire il percorso.


# QA prompt 113 — Noctis Vale · Terrazze nella gola (v01)

Stato: quattro PNG candidati presenti; nessuno approvato. `COMMERCIAL_RELEASE=BLOCKED`; GitHub non aggiornato. Prossimo prompt: 114.

| File | Rilievi QA |
|---|---|
| `v01.png` | Terrazze, ponti e abitanti riconoscibili; camminamenti sui lati leggibili. Il vuoto centrale domina, quindi il percorso non attraversa il centro come richiesto. Orientamento verticale e dimensioni diverse da 1536×1024; resa più illustrativa/3D che pixel-art canonica. |
| `v01_notte.png` | Geometria generale simile al master, ma i settori accesi in successione non risultano chiaramente distinguibili; formato non conforme. |
| `v01_evento.png` | La luce calda cambia ma la progressione per settori è poco leggibile; percorsi visibili; formato non conforme. |
| `v01_props.png` | Otto elementi su due file con terza fila vuota; la nicchia dichiarata vuota contiene una luce/candela; formato diverso da 1536×1024. |

Tutti restano `NEEDS_CORRECTION`, `approved=false`; nessun uso come master/runtime. Rigenerare le tre mappe in landscape 1536×1024 con percorso di gioco leggibile e continuità geometrica; chiarire il passaggio di luce per settori. Nel foglio, la nicchia deve essere vuota.


# QA prompt 114 — Noctis Vale · Mercato delle lampade (v02)

Stato: quattro PNG candidati presenti; nessuno approvato. `COMMERCIAL_RELEASE=BLOCKED`; GitHub non aggiornato. Prossimo prompt: 115.

| File | Dimensioni osservate | Rilievi QA |
|---|---:|---|
| `v02.png` | 1536×1024 | Mercato affollato, passaggio centrale continuo e layout distinto dalle terrazze. Stile illustrativo da confrontare con il pixel art canonico. |
| `v02_notte.png` | 1536×1024 | Geometria generale simile, ma alcune luci virano al magenta/rosso. Geometria pixel-per-pixel non verificata. |
| `v02_evento.png` | 1536×1024 | Progressione luminosa per settori leggibile, percorso visibile; geometria pixel-per-pixel non verificata. |
| `v02_props.png` | 1536×1024 | Otto oggetti nelle prime due righe; terza fila vuota. Nicchia vuota rispettata. Controllare verde #00FF00 e margini di 40 px. |

Tutti restano `approved=false` e in revisione di team. I formati sono conformi, ma nessuna tavola diventa master finché non sono completati controllo della geometria, confronto stilistico, misura dello sfondo e verifica dei margini.


# QA prompt 115 — Noctis Vale · Strada della luce (v03)

Stato: quattro PNG candidati presenti, nessuno approvato. Le varianti notte/evento sono generate da testo, senza riferimento immagine vincolante al master. `COMMERCIAL_RELEASE=BLOCKED`; GitHub non aggiornato.

| File | Dimensioni | Rilievi QA |
|---|---:|---|
| `v03.png` | 1536×1024 | Percorso centrale e settori di lampade visibili; confronto con mappa canonica ancora da fare. |
| `v03_notte.png` | 1536×1024 | Gola scura, strada centrale, mercati e lampade leggibili. Geometria non identica al master. |
| `v03_evento.png` | 1536×1024 | Percorso illuminato e passaggio caldo visibili; tre settori e geometria identica al master da verificare. |
| `v03_props.png` | 1536×1024 | Otto oggetti isolati e quattro celle vuote. Fondo normalizzato a #00FF00 uniforme; verificare corrispondenza in scena, margini e aloni. |

Famiglia completa come presenza file, ma `NEEDS_TEAM_REVIEW`: notte ed evento non sono edit del master, quindi la continuità 1:1 non è dimostrata. Tutti `approved=false`; nessun master/runtime. `next_prompt=117`.


# QA prompt 116 — Noctis Vale · Sala del Re delle Lampade (v04)

Stato: quattro PNG candidati presenti, nessuno approvato. Le varianti notte/evento sono generate da testo, senza riferimento immagine vincolante al master. `COMMERCIAL_RELEASE=BLOCKED`; GitHub non aggiornato.

| File | Dimensioni | Rilievi QA |
|---|---:|---|
| `v04.png` | 1536×1024 | Sala centrale con nicchie-lampada, percorso e diramazioni riconoscibili; verificare con i riferimenti canonici. |
| `v04_notte.png` | 1536×1024 | Candidato generato da testo; controllare notte e continuità geometrica. |
| `v04_evento.png` | 1536×1024 | Candidato generato da testo; controllare accensione a settori e continuità geometrica. |
| `v04_props.png` | 1536×1024 | Otto oggetti isolati e quattro celle vuote. Fondo normalizzato a #00FF00 uniforme; verificare corrispondenza in scena, margini e aloni. |

Tutti restano `approved=false`, `qa_status=NEEDS_TEAM_REVIEW`. Le varianti non sono edit vincolati al master. Nessuna famiglia approvata; `COMMERCIAL_RELEASE=BLOCKED`.


# QA prompt 117 — Toxic Forge · Mercato dei filtri (v01), parziale

Stato: presente una tavola props candidata; master diurno, notte ed evento non generati. Il tentativo GPT Image sul servizio collegato è stato rifiutato perché richiede un piano Basic; ImageGen nativo è ancora al limite giornaliero. `COMMERCIAL_RELEASE=BLOCKED`; GitHub non aggiornato. Il successivo asset da generare resta il master `v01.png` quando GPT Image torna disponibile.

| File | Dimensioni | Rilievi QA |
|---|---:|---|
| `v01_props.png` | 1536×1024 | Otto props in griglia 4×3, quattro celle vuote, sfondo #00FF00 uniforme e margini ampi. Candidata generata da Recraft e normalizzata; verificare forme, stile canonico, leggibilità e corrispondenza alla scena quando il master esiste. |

`generated=1/4`, mancanti `v01.png`, `v01_notte.png`, `v01_evento.png`. Nessuna approvazione; non usare come master/runtime. `next_prompt=117`.
