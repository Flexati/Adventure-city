# CHRONOS — prompt di recupero asset mancanti (ultimo audit locale 099)

Questo pacchetto contiene i prompt canonici originali per i 122 output segnalati mancanti dall’ultimo audit locale del checkpoint 099. Il checkpoint 099 non è stato recuperato; gli output non sono verificabili byte-per-byte da questa sessione. Per il recupero effettivamente verificato usare anche l’audit del checkpoint 091.

## Ordine di ripresa

- 1–18: 48 varianti mappa/regione.
- 41–43: 3 tavole di composizione squadra Lulù.
- 50–52: 3 tavole di composizione squadra Nox.
- 259–262: 8 ritratti/personaggi (Tomás v03 e Vesper v01–v03).
- 263–310: 48 effetti VFX delle abilità.

Totale: 76 prompt/famiglie, 122 output attesi. I file Markdown sono i prompt originali estratti dall’indice 310 del checkpoint 083; il CSV associa ciascun output mancante al suo prompt. Non generare file placeholder. Dopo il backfill, riprendere la coda da 259 e poi completare 263–310.

Stato commerciale: BLOCKED; ogni output è candidato finché QA e revisione artistica non passano.

---

## Prompt 1/310 — region.ash_docks.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v01.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v01_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v01_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v01_props.png

**Prompt canonico:** `region.ash_docks.01.md`

<!-- 1/310 -->
# region.ash_docks.01 — Ash Docks · v01

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`, `ref_ash_docks.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/`, file: `v01.png`, `v01_notte.png`, `v01_evento.png`, `v01_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_ash_docks/v01.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Banchina dei carichi» della regione Ash Docks.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Porto industriale esterno: gru e linee di carico contro un orizzonte aperto, turni, mezzi usurati, gare riconosciute. È il porto dove Veyra «Ash» Kor corre con la sua auto color rame e dove la Vortex di Nox e Lulù affronta le gare.
Questo quartiere: Banchina dei carichi: gru, ormeggi, ganci e container salini, con lavoratori e corsie sgombre
Gli altri quartieri della stessa regione (Corridoio delle gru, Deposito Vortex, Scambi ferroviari) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: gru a portale rosso ruggine con controventi a X, pile di container nervati (ruggine, cobalto, verde scuro, ocra, grigio), capannoni con tetti in lamiera e lucernari, uffici di banchina prefabbricati, silos, bitte d'acciaio, recinzioni a rete.
- Suolo e strade: cemento a lastre con giunti scuri, strisce gialle di corsia, macchie d'olio iridescenti, binari incassati, tombini, pozzanghere salate.
- Attività commerciali visibili: officina di ricambi, banco del caffè dei portuali, deposito noleggio muletti, sportello turni, rivendita di cavi.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): portuali in giubbotto arancio ad alta visibilità e casco, gruisti, meccanici con tuta grigia, piloti locali, venditori di cibo caldo.
- Oggetti ambientali da distribuire nella scena: container nervato chiuso e aperto, bitta d'acciaio con cima, muletto giallo, gancio della gru, pallet con casse e cinghie arancio, barile d'olio, lampione al sodio, transenna a strisce, carrello portacavi, boa di salvataggio.
- Palette di riferimento (hex): #9A3A24, #2F5F8F, #3D7A52, #C08A2E, #4B4E52, #E3C04A, #1D4250, #F08A2C, #FFCF7A. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: cielo coperto e luce fredda grigio-azzurra, mare petrolio con creste chiare.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v01.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v01_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lampioni al sodio arancio a pozze circolari, luci ambra di segnalazione sulle gru, finestre calde, riflessi sull'asfalto bagnato.
C. v01_evento.png: MODIFICA l'immagine A con l'evento atmosferico: pioggia salina obliqua e nebbia di banchina che sale dal mare, pozzanghere che riflettono le luci. Strade e uscite restano leggibili.
D. v01_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: container nervato chiuso e aperto, bitta d'acciaio con cima, muletto giallo, gancio della gru, pallet con casse e cinghie arancio, barile d'olio, lampione al sodio, transenna a strisce, carrello portacavi, boa di salvataggio.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Ash Docks; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 2/310 — region.ash_docks.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v02.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v02_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v02_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v02_props.png

**Prompt canonico:** `region.ash_docks.02.md`

<!-- 2/310 -->
# region.ash_docks.02 — Ash Docks · v02

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`, `ref_ash_docks.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/`, file: `v02.png`, `v02_notte.png`, `v02_evento.png`, `v02_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_ash_docks/v02.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Corridoio delle gru» della regione Ash Docks.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Porto industriale esterno: gru e linee di carico contro un orizzonte aperto, turni, mezzi usurati, gare riconosciute. È il porto dove Veyra «Ash» Kor corre con la sua auto color rame e dove la Vortex di Nox e Lulù affronta le gare.
Questo quartiere: Corridoio delle gru: portali continui, rotaie e carichi oscillanti, ombre geometriche
Gli altri quartieri della stessa regione (Banchina dei carichi, Deposito Vortex, Scambi ferroviari) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: gru a portale rosso ruggine con controventi a X, pile di container nervati (ruggine, cobalto, verde scuro, ocra, grigio), capannoni con tetti in lamiera e lucernari, uffici di banchina prefabbricati, silos, bitte d'acciaio, recinzioni a rete.
- Suolo e strade: cemento a lastre con giunti scuri, strisce gialle di corsia, macchie d'olio iridescenti, binari incassati, tombini, pozzanghere salate.
- Attività commerciali visibili: officina di ricambi, banco del caffè dei portuali, deposito noleggio muletti, sportello turni, rivendita di cavi.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): portuali in giubbotto arancio ad alta visibilità e casco, gruisti, meccanici con tuta grigia, piloti locali, venditori di cibo caldo.
- Oggetti ambientali da distribuire nella scena: container nervato chiuso e aperto, bitta d'acciaio con cima, muletto giallo, gancio della gru, pallet con casse e cinghie arancio, barile d'olio, lampione al sodio, transenna a strisce, carrello portacavi, boa di salvataggio.
- Palette di riferimento (hex): #9A3A24, #2F5F8F, #3D7A52, #C08A2E, #4B4E52, #E3C04A, #1D4250, #F08A2C, #FFCF7A. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: cielo coperto e luce fredda grigio-azzurra, mare petrolio con creste chiare.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v02.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v02_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lampioni al sodio arancio a pozze circolari, luci ambra di segnalazione sulle gru, finestre calde, riflessi sull'asfalto bagnato.
C. v02_evento.png: MODIFICA l'immagine A con l'evento atmosferico: pioggia salina obliqua e nebbia di banchina che sale dal mare, pozzanghere che riflettono le luci. Strade e uscite restano leggibili.
D. v02_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: container nervato chiuso e aperto, bitta d'acciaio con cima, muletto giallo, gancio della gru, pallet con casse e cinghie arancio, barile d'olio, lampione al sodio, transenna a strisce, carrello portacavi, boa di salvataggio.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Ash Docks; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 3/310 — region.ash_docks.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v03.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v03_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v03_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v03_props.png

**Prompt canonico:** `region.ash_docks.03.md`

<!-- 3/310 -->
# region.ash_docks.03 — Ash Docks · v03

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`, `ref_ash_docks.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/`, file: `v03.png`, `v03_notte.png`, `v03_evento.png`, `v03_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_ash_docks/v03.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Deposito Vortex» della regione Ash Docks.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Porto industriale esterno: gru e linee di carico contro un orizzonte aperto, turni, mezzi usurati, gare riconosciute. È il porto dove Veyra «Ash» Kor corre con la sua auto color rame e dove la Vortex di Nox e Lulù affronta le gare.
Questo quartiere: Deposito Vortex: officina e mercato di ricambi, carrelli, tecnici e fari industriali
Gli altri quartieri della stessa regione (Banchina dei carichi, Corridoio delle gru, Scambi ferroviari) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: gru a portale rosso ruggine con controventi a X, pile di container nervati (ruggine, cobalto, verde scuro, ocra, grigio), capannoni con tetti in lamiera e lucernari, uffici di banchina prefabbricati, silos, bitte d'acciaio, recinzioni a rete.
- Suolo e strade: cemento a lastre con giunti scuri, strisce gialle di corsia, macchie d'olio iridescenti, binari incassati, tombini, pozzanghere salate.
- Attività commerciali visibili: officina di ricambi, banco del caffè dei portuali, deposito noleggio muletti, sportello turni, rivendita di cavi.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): portuali in giubbotto arancio ad alta visibilità e casco, gruisti, meccanici con tuta grigia, piloti locali, venditori di cibo caldo.
- Oggetti ambientali da distribuire nella scena: container nervato chiuso e aperto, bitta d'acciaio con cima, muletto giallo, gancio della gru, pallet con casse e cinghie arancio, barile d'olio, lampione al sodio, transenna a strisce, carrello portacavi, boa di salvataggio.
- Palette di riferimento (hex): #9A3A24, #2F5F8F, #3D7A52, #C08A2E, #4B4E52, #E3C04A, #1D4250, #F08A2C, #FFCF7A. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: cielo coperto e luce fredda grigio-azzurra, mare petrolio con creste chiare.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v03.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v03_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lampioni al sodio arancio a pozze circolari, luci ambra di segnalazione sulle gru, finestre calde, riflessi sull'asfalto bagnato.
C. v03_evento.png: MODIFICA l'immagine A con l'evento atmosferico: pioggia salina obliqua e nebbia di banchina che sale dal mare, pozzanghere che riflettono le luci. Strade e uscite restano leggibili.
D. v03_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: container nervato chiuso e aperto, bitta d'acciaio con cima, muletto giallo, gancio della gru, pallet con casse e cinghie arancio, barile d'olio, lampione al sodio, transenna a strisce, carrello portacavi, boa di salvataggio.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Ash Docks; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 4/310 — region.ash_docks.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v04.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v04_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v04_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/v04_props.png

**Prompt canonico:** `region.ash_docks.04.md`

<!-- 4/310 -->
# region.ash_docks.04 — Ash Docks · v04

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`, `ref_ash_docks.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_ash_docks/`, file: `v04.png`, `v04_notte.png`, `v04_evento.png`, `v04_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_ash_docks/v04.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Scambi ferroviari» della regione Ash Docks.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Porto industriale esterno: gru e linee di carico contro un orizzonte aperto, turni, mezzi usurati, gare riconosciute. È il porto dove Veyra «Ash» Kor corre con la sua auto color rame e dove la Vortex di Nox e Lulù affronta le gare.
Questo quartiere: Scambi ferroviari: leverismi, segnali di preparazione e svincoli, senza cambiare collisioni
Gli altri quartieri della stessa regione (Banchina dei carichi, Corridoio delle gru, Deposito Vortex) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: gru a portale rosso ruggine con controventi a X, pile di container nervati (ruggine, cobalto, verde scuro, ocra, grigio), capannoni con tetti in lamiera e lucernari, uffici di banchina prefabbricati, silos, bitte d'acciaio, recinzioni a rete.
- Suolo e strade: cemento a lastre con giunti scuri, strisce gialle di corsia, macchie d'olio iridescenti, binari incassati, tombini, pozzanghere salate.
- Attività commerciali visibili: officina di ricambi, banco del caffè dei portuali, deposito noleggio muletti, sportello turni, rivendita di cavi.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): portuali in giubbotto arancio ad alta visibilità e casco, gruisti, meccanici con tuta grigia, piloti locali, venditori di cibo caldo.
- Oggetti ambientali da distribuire nella scena: container nervato chiuso e aperto, bitta d'acciaio con cima, muletto giallo, gancio della gru, pallet con casse e cinghie arancio, barile d'olio, lampione al sodio, transenna a strisce, carrello portacavi, boa di salvataggio.
- Palette di riferimento (hex): #9A3A24, #2F5F8F, #3D7A52, #C08A2E, #4B4E52, #E3C04A, #1D4250, #F08A2C, #FFCF7A. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: cielo coperto e luce fredda grigio-azzurra, mare petrolio con creste chiare.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v04.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v04_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lampioni al sodio arancio a pozze circolari, luci ambra di segnalazione sulle gru, finestre calde, riflessi sull'asfalto bagnato.
C. v04_evento.png: MODIFICA l'immagine A con l'evento atmosferico: pioggia salina obliqua e nebbia di banchina che sale dal mare, pozzanghere che riflettono le luci. Strade e uscite restano leggibili.
D. v04_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: container nervato chiuso e aperto, bitta d'acciaio con cima, muletto giallo, gancio della gru, pallet con casse e cinghie arancio, barile d'olio, lampione al sodio, transenna a strisce, carrello portacavi, boa di salvataggio.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Ash Docks; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 5/310 — region.aurelia_span.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v01.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v01_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v01_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v01_props.png

**Prompt canonico:** `region.aurelia_span.01.md`

<!-- 5/310 -->
# region.aurelia_span.01 — Aurelia Span · v01

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/`, file: `v01.png`, `v01_notte.png`, `v01_evento.png`, `v01_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_aurelia_span/v01.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Arcata d'ingresso» della regione Aurelia Span.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Città su enormi ponti fra montagne; contrappesi, case predisposte allo spostamento annuale. Le gare di Aurelia Span corrono sui ponti.
Questo quartiere: Arcata d'ingresso: ponti giganti sospesi fra montagne, scale e parapetti leggibili
Gli altri quartieri della stessa regione (Quartiere dei contrappesi, Mercato sospeso, Passaggio dei collaudatori) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: impalcati di pietra chiara e acciaio sospesi fra pareti di montagna, torri dei cavi bianche, case a schiera su slitte con argani e contrappesi appesi sotto l'impalcato, parapetti traforati, scale a sbalzo, tende anti-vento.
- Suolo e strade: lastre di pietra chiara consumate, giunti di dilatazione d'acciaio, griglie che lasciano vedere il vuoto, segni delle slitte.
- Attività commerciali visibili: riparatori di funi, botteghe di tende, forno, bancarelle di pane e frutta secca, laboratorio dei collaudatori.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): abitanti con mantelline antivento blu e crema, operai degli argani con imbracature, collaudatori in tuta chiara, bambini con aquiloni.
- Oggetti ambientali da distribuire nella scena: contrappeso di ghisa con indicatore di fase, argano a manovella, lanterna da parapetto, tenda anti-vento, slitta di casa, cassetta di attrezzi dei collaudatori, strumento ottico su treppiede, bandiera segnavento.
- Palette di riferimento (hex): #E8E0CC, #B8B0A0, #3A6AB0, #C86A4A, #2A3A5A, #D8D2C4, #FFE2A8, #6A6458. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: sole alto e luce tersa d'alta quota, ombre nette, nebbia azzurra nel fondo della gola.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v01.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v01_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lanterne calde lungo i parapetti, luci di posizione rosse sulle torri, la gola nera sotto.
C. v01_evento.png: MODIFICA l'immagine A con l'evento atmosferico: raffiche di vento: tende tese, polvere di pietra, cavi che vibrano (solo come effetto). Strade e uscite restano leggibili.
D. v01_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: contrappeso di ghisa con indicatore di fase, argano a manovella, lanterna da parapetto, tenda anti-vento, slitta di casa, cassetta di attrezzi dei collaudatori, strumento ottico su treppiede, bandiera segnavento.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Aurelia Span; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 6/310 — region.aurelia_span.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v02.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v02_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v02_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v02_props.png

**Prompt canonico:** `region.aurelia_span.02.md`

<!-- 6/310 -->
# region.aurelia_span.02 — Aurelia Span · v02

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/`, file: `v02.png`, `v02_notte.png`, `v02_evento.png`, `v02_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_aurelia_span/v02.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Quartiere dei contrappesi» della regione Aurelia Span.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Città su enormi ponti fra montagne; contrappesi, case predisposte allo spostamento annuale. Le gare di Aurelia Span corrono sui ponti.
Questo quartiere: Quartiere dei contrappesi: case mobili, argani e funi con indicatori delle fasi
Gli altri quartieri della stessa regione (Arcata d'ingresso, Mercato sospeso, Passaggio dei collaudatori) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: impalcati di pietra chiara e acciaio sospesi fra pareti di montagna, torri dei cavi bianche, case a schiera su slitte con argani e contrappesi appesi sotto l'impalcato, parapetti traforati, scale a sbalzo, tende anti-vento.
- Suolo e strade: lastre di pietra chiara consumate, giunti di dilatazione d'acciaio, griglie che lasciano vedere il vuoto, segni delle slitte.
- Attività commerciali visibili: riparatori di funi, botteghe di tende, forno, bancarelle di pane e frutta secca, laboratorio dei collaudatori.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): abitanti con mantelline antivento blu e crema, operai degli argani con imbracature, collaudatori in tuta chiara, bambini con aquiloni.
- Oggetti ambientali da distribuire nella scena: contrappeso di ghisa con indicatore di fase, argano a manovella, lanterna da parapetto, tenda anti-vento, slitta di casa, cassetta di attrezzi dei collaudatori, strumento ottico su treppiede, bandiera segnavento.
- Palette di riferimento (hex): #E8E0CC, #B8B0A0, #3A6AB0, #C86A4A, #2A3A5A, #D8D2C4, #FFE2A8, #6A6458. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: sole alto e luce tersa d'alta quota, ombre nette, nebbia azzurra nel fondo della gola.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v02.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v02_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lanterne calde lungo i parapetti, luci di posizione rosse sulle torri, la gola nera sotto.
C. v02_evento.png: MODIFICA l'immagine A con l'evento atmosferico: raffiche di vento: tende tese, polvere di pietra, cavi che vibrano (solo come effetto). Strade e uscite restano leggibili.
D. v02_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: contrappeso di ghisa con indicatore di fase, argano a manovella, lanterna da parapetto, tenda anti-vento, slitta di casa, cassetta di attrezzi dei collaudatori, strumento ottico su treppiede, bandiera segnavento.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Aurelia Span; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 7/310 — region.aurelia_span.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v03.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v03_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v03_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v03_props.png

**Prompt canonico:** `region.aurelia_span.03.md`

<!-- 7/310 -->
# region.aurelia_span.03 — Aurelia Span · v03

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/`, file: `v03.png`, `v03_notte.png`, `v03_evento.png`, `v03_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_aurelia_span/v03.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Mercato sospeso» della regione Aurelia Span.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Città su enormi ponti fra montagne; contrappesi, case predisposte allo spostamento annuale. Le gare di Aurelia Span corrono sui ponti.
Questo quartiere: Mercato sospeso: tende anti-vento, botteghe, riparatori e passerelle pedonali
Gli altri quartieri della stessa regione (Arcata d'ingresso, Quartiere dei contrappesi, Passaggio dei collaudatori) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: impalcati di pietra chiara e acciaio sospesi fra pareti di montagna, torri dei cavi bianche, case a schiera su slitte con argani e contrappesi appesi sotto l'impalcato, parapetti traforati, scale a sbalzo, tende anti-vento.
- Suolo e strade: lastre di pietra chiara consumate, giunti di dilatazione d'acciaio, griglie che lasciano vedere il vuoto, segni delle slitte.
- Attività commerciali visibili: riparatori di funi, botteghe di tende, forno, bancarelle di pane e frutta secca, laboratorio dei collaudatori.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): abitanti con mantelline antivento blu e crema, operai degli argani con imbracature, collaudatori in tuta chiara, bambini con aquiloni.
- Oggetti ambientali da distribuire nella scena: contrappeso di ghisa con indicatore di fase, argano a manovella, lanterna da parapetto, tenda anti-vento, slitta di casa, cassetta di attrezzi dei collaudatori, strumento ottico su treppiede, bandiera segnavento.
- Palette di riferimento (hex): #E8E0CC, #B8B0A0, #3A6AB0, #C86A4A, #2A3A5A, #D8D2C4, #FFE2A8, #6A6458. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: sole alto e luce tersa d'alta quota, ombre nette, nebbia azzurra nel fondo della gola.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v03.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v03_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lanterne calde lungo i parapetti, luci di posizione rosse sulle torri, la gola nera sotto.
C. v03_evento.png: MODIFICA l'immagine A con l'evento atmosferico: raffiche di vento: tende tese, polvere di pietra, cavi che vibrano (solo come effetto). Strade e uscite restano leggibili.
D. v03_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: contrappeso di ghisa con indicatore di fase, argano a manovella, lanterna da parapetto, tenda anti-vento, slitta di casa, cassetta di attrezzi dei collaudatori, strumento ottico su treppiede, bandiera segnavento.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Aurelia Span; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 8/310 — region.aurelia_span.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v04.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v04_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v04_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/v04_props.png

**Prompt canonico:** `region.aurelia_span.04.md`

<!-- 8/310 -->
# region.aurelia_span.04 — Aurelia Span · v04

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_aurelia_span/`, file: `v04.png`, `v04_notte.png`, `v04_evento.png`, `v04_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_aurelia_span/v04.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Passaggio dei collaudatori» della regione Aurelia Span.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Città su enormi ponti fra montagne; contrappesi, case predisposte allo spostamento annuale. Le gare di Aurelia Span corrono sui ponti.
Questo quartiere: Passaggio dei collaudatori: schermi ottici e travi chiare; arena PARALLAX distinguibile
Gli altri quartieri della stessa regione (Arcata d'ingresso, Quartiere dei contrappesi, Mercato sospeso) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: impalcati di pietra chiara e acciaio sospesi fra pareti di montagna, torri dei cavi bianche, case a schiera su slitte con argani e contrappesi appesi sotto l'impalcato, parapetti traforati, scale a sbalzo, tende anti-vento.
- Suolo e strade: lastre di pietra chiara consumate, giunti di dilatazione d'acciaio, griglie che lasciano vedere il vuoto, segni delle slitte.
- Attività commerciali visibili: riparatori di funi, botteghe di tende, forno, bancarelle di pane e frutta secca, laboratorio dei collaudatori.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): abitanti con mantelline antivento blu e crema, operai degli argani con imbracature, collaudatori in tuta chiara, bambini con aquiloni.
- Oggetti ambientali da distribuire nella scena: contrappeso di ghisa con indicatore di fase, argano a manovella, lanterna da parapetto, tenda anti-vento, slitta di casa, cassetta di attrezzi dei collaudatori, strumento ottico su treppiede, bandiera segnavento.
- Palette di riferimento (hex): #E8E0CC, #B8B0A0, #3A6AB0, #C86A4A, #2A3A5A, #D8D2C4, #FFE2A8, #6A6458. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: sole alto e luce tersa d'alta quota, ombre nette, nebbia azzurra nel fondo della gola.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v04.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v04_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lanterne calde lungo i parapetti, luci di posizione rosse sulle torri, la gola nera sotto.
C. v04_evento.png: MODIFICA l'immagine A con l'evento atmosferico: raffiche di vento: tende tese, polvere di pietra, cavi che vibrano (solo come effetto). Strade e uscite restano leggibili.
D. v04_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: contrappeso di ghisa con indicatore di fase, argano a manovella, lanterna da parapetto, tenda anti-vento, slitta di casa, cassetta di attrezzi dei collaudatori, strumento ottico su treppiede, bandiera segnavento.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Aurelia Span; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 9/310 — region.solkara.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v01.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v01_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v01_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v01_props.png

**Prompt canonico:** `region.solkara.01.md`

<!-- 9/310 -->
# region.solkara.01 — Solkara · v01

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_solkara/`, file: `v01.png`, `v01_notte.png`, `v01_evento.png`, `v01_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_solkara/v01.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Piazza del convoglio» della regione Solkara.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Città-convoglio nel deserto senza sistema centrale: l'ombra dei telai viaggia con le persone. Le gare di Solkara corrono fra i convogli.
Questo quartiere: Piazza del convoglio: abitati su piattaforme mobili, tende e punti d'acqua
Gli altri quartieri della stessa regione (Via delle ruote, Officine itineranti, Finestra del passo) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: piattaforme su ruote gigantesche con case di tela e legno, telai di sollevamento, cisterne d'acqua, vele parasole a strisce, scale mobili fra un vagone e l'altro, banderuole.
- Suolo e strade: sabbia ocra con increspature del vento, solchi delle ruote, impronte, tavole posate come passerelle, teli stesi.
- Attività commerciali visibili: punti d'acqua, officine itineranti con cricchi e taniche, mercato di stoffe e spezie (senza stereotipi), tessitori di vele.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): abitanti con abiti protettivi chiari scoloriti dal sole, foulard e occhiali da sabbia, meccanici con guanti, bambini sulle scale.
- Oggetti ambientali da distribuire nella scena: tanica arancio, cricco da camion, cisterna d'acqua con rubinetto, vela parasole, ruota di ricambio, banderuola, cassa di stoffe, lanterna da telaio.
- Palette di riferimento (hex): #D8B070, #B88E52, #C84A3A, #E8E0CC, #3A6AB0, #5A4630, #3A8AB0, #FFCF7A. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: sole bianco e caldo, ombre corte e nette dei telai, aria tremolante.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v01.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v01_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lanterne calde appese ai telai, falò in bracieri chiusi, cielo indaco.
C. v01_evento.png: MODIFICA l'immagine A con l'evento atmosferico: tempesta di sabbia: velo ocra, telai coperti, visibilità ridotta ma percorso sempre leggibile. Strade e uscite restano leggibili.
D. v01_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: tanica arancio, cricco da camion, cisterna d'acqua con rubinetto, vela parasole, ruota di ricambio, banderuola, cassa di stoffe, lanterna da telaio.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Solkara; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 10/310 — region.solkara.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v02.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v02_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v02_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v02_props.png

**Prompt canonico:** `region.solkara.02.md`

<!-- 10/310 -->
# region.solkara.02 — Solkara · v02

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_solkara/`, file: `v02.png`, `v02_notte.png`, `v02_evento.png`, `v02_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_solkara/v02.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Via delle ruote» della regione Solkara.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Città-convoglio nel deserto senza sistema centrale: l'ombra dei telai viaggia con le persone. Le gare di Solkara corrono fra i convogli.
Questo quartiere: Via delle ruote: telaio su sabbia, banderuole, impronte e segni del vento
Gli altri quartieri della stessa regione (Piazza del convoglio, Officine itineranti, Finestra del passo) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: piattaforme su ruote gigantesche con case di tela e legno, telai di sollevamento, cisterne d'acqua, vele parasole a strisce, scale mobili fra un vagone e l'altro, banderuole.
- Suolo e strade: sabbia ocra con increspature del vento, solchi delle ruote, impronte, tavole posate come passerelle, teli stesi.
- Attività commerciali visibili: punti d'acqua, officine itineranti con cricchi e taniche, mercato di stoffe e spezie (senza stereotipi), tessitori di vele.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): abitanti con abiti protettivi chiari scoloriti dal sole, foulard e occhiali da sabbia, meccanici con guanti, bambini sulle scale.
- Oggetti ambientali da distribuire nella scena: tanica arancio, cricco da camion, cisterna d'acqua con rubinetto, vela parasole, ruota di ricambio, banderuola, cassa di stoffe, lanterna da telaio.
- Palette di riferimento (hex): #D8B070, #B88E52, #C84A3A, #E8E0CC, #3A6AB0, #5A4630, #3A8AB0, #FFCF7A. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: sole bianco e caldo, ombre corte e nette dei telai, aria tremolante.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v02.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v02_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lanterne calde appese ai telai, falò in bracieri chiusi, cielo indaco.
C. v02_evento.png: MODIFICA l'immagine A con l'evento atmosferico: tempesta di sabbia: velo ocra, telai coperti, visibilità ridotta ma percorso sempre leggibile. Strade e uscite restano leggibili.
D. v02_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: tanica arancio, cricco da camion, cisterna d'acqua con rubinetto, vela parasole, ruota di ricambio, banderuola, cassa di stoffe, lanterna da telaio.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Solkara; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 11/310 — region.solkara.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v03.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v03_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v03_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v03_props.png

**Prompt canonico:** `region.solkara.03.md`

<!-- 11/310 -->
# region.solkara.03 — Solkara · v03

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_solkara/`, file: `v03.png`, `v03_notte.png`, `v03_evento.png`, `v03_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_solkara/v03.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Officine itineranti» della regione Solkara.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Città-convoglio nel deserto senza sistema centrale: l'ombra dei telai viaggia con le persone. Le gare di Solkara corrono fra i convogli.
Questo quartiere: Officine itineranti: riparatori, piccoli mercati, taniche e cricchi
Gli altri quartieri della stessa regione (Piazza del convoglio, Via delle ruote, Finestra del passo) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: piattaforme su ruote gigantesche con case di tela e legno, telai di sollevamento, cisterne d'acqua, vele parasole a strisce, scale mobili fra un vagone e l'altro, banderuole.
- Suolo e strade: sabbia ocra con increspature del vento, solchi delle ruote, impronte, tavole posate come passerelle, teli stesi.
- Attività commerciali visibili: punti d'acqua, officine itineranti con cricchi e taniche, mercato di stoffe e spezie (senza stereotipi), tessitori di vele.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): abitanti con abiti protettivi chiari scoloriti dal sole, foulard e occhiali da sabbia, meccanici con guanti, bambini sulle scale.
- Oggetti ambientali da distribuire nella scena: tanica arancio, cricco da camion, cisterna d'acqua con rubinetto, vela parasole, ruota di ricambio, banderuola, cassa di stoffe, lanterna da telaio.
- Palette di riferimento (hex): #D8B070, #B88E52, #C84A3A, #E8E0CC, #3A6AB0, #5A4630, #3A8AB0, #FFCF7A. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: sole bianco e caldo, ombre corte e nette dei telai, aria tremolante.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v03.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v03_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lanterne calde appese ai telai, falò in bracieri chiusi, cielo indaco.
C. v03_evento.png: MODIFICA l'immagine A con l'evento atmosferico: tempesta di sabbia: velo ocra, telai coperti, visibilità ridotta ma percorso sempre leggibile. Strade e uscite restano leggibili.
D. v03_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: tanica arancio, cricco da camion, cisterna d'acqua con rubinetto, vela parasole, ruota di ricambio, banderuola, cassa di stoffe, lanterna da telaio.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Solkara; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 12/310 — region.solkara.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v04.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v04_notte.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v04_evento.png, deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v04_props.png

**Prompt canonico:** `region.solkara.04.md`

<!-- 12/310 -->
# region.solkara.04 — Solkara · v04

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_stile_mappe.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/region/region_solkara/`, file: `v04.png`, `v04_notte.png`, `v04_evento.png`, `v04_props.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/region/region_solkara/v04.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «Finestra del passo» della regione Solkara.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Città-convoglio nel deserto senza sistema centrale: l'ombra dei telai viaggia con le persone. Le gare di Solkara corrono fra i convogli.
Questo quartiere: Finestra del passo: segnali di regolarità su percorso, senza inventare meccaniche
Gli altri quartieri della stessa regione (Piazza del convoglio, Via delle ruote, Officine itineranti) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: piattaforme su ruote gigantesche con case di tela e legno, telai di sollevamento, cisterne d'acqua, vele parasole a strisce, scale mobili fra un vagone e l'altro, banderuole.
- Suolo e strade: sabbia ocra con increspature del vento, solchi delle ruote, impronte, tavole posate come passerelle, teli stesi.
- Attività commerciali visibili: punti d'acqua, officine itineranti con cricchi e taniche, mercato di stoffe e spezie (senza stereotipi), tessitori di vele.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): abitanti con abiti protettivi chiari scoloriti dal sole, foulard e occhiali da sabbia, meccanici con guanti, bambini sulle scale.
- Oggetti ambientali da distribuire nella scena: tanica arancio, cricco da camion, cisterna d'acqua con rubinetto, vela parasole, ruota di ricambio, banderuola, cassa di stoffe, lanterna da telaio.
- Palette di riferimento (hex): #D8B070, #B88E52, #C84A3A, #E8E0CC, #3A6AB0, #5A4630, #3A8AB0, #FFCF7A. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
Pixel art HD ad alta densità di dettaglio, come le mappe canoniche del gioco (riferimento ref_stile_mappe.png: city.png, port.png, clinic.png, fracture.png, strade di Ash Docks). Vista dall'alto 3/4 con camera alta, pixel netti e visibili ma piccoli (scala HD, non pixel giganti), contorni scuri sottili, ombreggiatura a gradini, luce principale dall'alto a sinistra. Ogni superficie è lavorata: tetti con impianti, condizionatori, parabole, tubi, casse, cavi, insegne inventate senza testo leggibile, crepe, macchie, pozzanghere con riflessi. Colori saturi e vivi, mai tinta unita piatta: ogni materiale ha almeno tre toni e micro-texture. La strada percorribile resta sempre leggibile rispetto agli edifici.

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: sole bianco e caldo, ombre corte e nette dei telai, aria tremolante.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. v04.png: il quartiere di giorno, 1536×1024, a tutto campo.
B. v04_notte.png: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: lanterne calde appese ai telai, falò in bracieri chiusi, cielo indaco.
C. v04_evento.png: MODIFICA l'immagine A con l'evento atmosferico: tempesta di sabbia: velo ocra, telai coperti, visibilità ridotta ma percorso sempre leggibile. Strade e uscite restano leggibili.
D. v04_props.png: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: tanica arancio, cricco da camion, cisterna d'acqua con rubinetto, vela parasole, ruota di ricambio, banderuola, cassa di stoffe, lanterna da telaio.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di Solkara; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non cambiare la geometria fra A, B e C
- nessuna scena generica neon intercambiabile: questa città ha la sua architettura
- nessuna arma puntata contro civili, nessun gore
- nessun elemento che sembri un pulsante o un indicatore di gioco
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 13/310 — enemy.breaker.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/enemy/enemy_breaker/v01.png, deliveries/gpt-preproduzione-310-20261029/enemy/enemy_breaker/v01_vfx.png

**Prompt canonico:** `enemy.breaker.01.md`

<!-- 13/310 -->
# enemy.breaker.01 — Breaker · v01

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_nemici.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/enemy/enemy_breaker/`, file: `v01.png`, `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/enemy/enemy_breaker/v01.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna lo sprite sheet del nemico Breaker, variante base.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Famiglia gang (Relay); ruolo in combattimento: sfonda coperture. Nemico già nel gioco: usa lo sheet originale allegato (ref_nemici.png) come base fedele, stessa scala e stesse proporzioni; il collider del codice non cambia.
Variante base: Base: figura bassa e larga, martello pneumatico e anticipo del colpo con spalle.

2. SOGGETTO, MATERIALI E COLORI
- Corpo e silhouette: figura bassa e larga, spalle enormi, martello pneumatico.
- Movimento: passo pesante, spalle che caricano il colpo.
- Colore dell'avviso d'attacco e degli effetti: #F08A2C (unico per questo nemico).
- Materiali vissuti coerenti con la famiglia gang (Relay); la silhouette deve distinguersi dalle altre classi anche in nero pieno, non solo per tinta.

3. STILE
Pixel art HD dettagliata come gli sprite nemici canonici (ref_nemici.png: gang, infetti, custodi, alieni) e i boss (ref_boss.png): contorno scuro, ombre a gradini, materiali vissuti, luci emissive solo dove servono a leggere l'attacco. Silhouette riconoscibile in nero pieno a 110 px.

4. ANGOLAZIONE, PROSPETTIVA, LUCE
Camera del gioco leggermente dall'alto, figura intera; altezza circa 220 px in ogni cella; luce dall'alto a sinistra; piedi sulla stessa linea in tutta la riga.

5. VISTE E ANIMAZIONI (proposta: tempi e frame definitivi li decide il codice)
A. v01.png: sprite sheet 1536×1024, griglia 8×4 di celle 192×256:
   - riga 1: fronte, schiena, lato destro, 3/4; poi idle 4 fotogrammi;
   - riga 2: camminata 6 fotogrammi; colpito 2 fotogrammi;
   - riga 3: anticipazione 4 fotogrammi (avviso leggibile, una sola lettura); attacco 4 fotogrammi;
   - riga 4: sconfitta 6 fotogrammi; 2 celle vuote.
B. v01_vfx.png: effetti separati 1536×512, quattro celle 384×512: avviso (telegraph), in volo, impatto, annullato.
Variante base: fissa silhouette, proporzioni e colori.

6. COERENZA DELLA FAMIGLIA
- Stessa figura in tutti i fotogrammi, contorno e palette costanti, nessun fotogramma tagliato dal bordo della cella.
- Base, territoriale ed élite sono lo stesso nemico: l'élite si riconosce subito per sagoma e accessori, non solo per colore.
- Gli effetti B usano solo il colore #F08A2C con nucleo chiaro.

7. SFONDO, FORMATO E RISOLUZIONE
A e B: PNG. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- la grafica non promette né nasconde un’area di danno: l’effetto copre solo la forma dell’attacco
- nessuna nuova resistenza, arma o potere non scritti nella variante
- nessun gore
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 14/310 — enemy.breaker.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/enemy/enemy_breaker/v02.png, deliveries/gpt-preproduzione-310-20261029/enemy/enemy_breaker/v02_vfx.png

**Prompt canonico:** `enemy.breaker.02.md`

<!-- 14/310 -->
# enemy.breaker.02 — Breaker · v02

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_nemici.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/enemy/enemy_breaker/`, file: `v02.png`, `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/enemy/enemy_breaker/v02.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna lo sprite sheet del nemico Breaker, variante territoriale.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Famiglia gang (Relay); ruolo in combattimento: sfonda coperture. Nemico già nel gioco: usa lo sheet originale allegato (ref_nemici.png) come base fedele, stessa scala e stesse proporzioni; il collider del codice non cambia.
Variante territoriale: Relay: attrezzo arrugginito, fasce ocra e schegge di cemento.

2. SOGGETTO, MATERIALI E COLORI
- Corpo e silhouette: figura bassa e larga, spalle enormi, martello pneumatico.
- Movimento: passo pesante, spalle che caricano il colpo.
- Colore dell'avviso d'attacco e degli effetti: #F08A2C (unico per questo nemico).
- Materiali vissuti coerenti con la famiglia gang (Relay); la silhouette deve distinguersi dalle altre classi anche in nero pieno, non solo per tinta.

3. STILE
Pixel art HD dettagliata come gli sprite nemici canonici (ref_nemici.png: gang, infetti, custodi, alieni) e i boss (ref_boss.png): contorno scuro, ombre a gradini, materiali vissuti, luci emissive solo dove servono a leggere l'attacco. Silhouette riconoscibile in nero pieno a 110 px.

4. ANGOLAZIONE, PROSPETTIVA, LUCE
Camera del gioco leggermente dall'alto, figura intera; altezza circa 220 px in ogni cella; luce dall'alto a sinistra; piedi sulla stessa linea in tutta la riga.

5. VISTE E ANIMAZIONI (proposta: tempi e frame definitivi li decide il codice)
A. v02.png: sprite sheet 1536×1024, griglia 8×4 di celle 192×256:
   - riga 1: fronte, schiena, lato destro, 3/4; poi idle 4 fotogrammi;
   - riga 2: camminata 6 fotogrammi; colpito 2 fotogrammi;
   - riga 3: anticipazione 4 fotogrammi (avviso leggibile, una sola lettura); attacco 4 fotogrammi;
   - riga 4: sconfitta 6 fotogrammi; 2 celle vuote.
B. v02_vfx.png: effetti separati 1536×512, quattro celle 384×512: avviso (telegraph), in volo, impatto, annullato.
MODIFICA la tua immagine v01.png dello stesso nemico (allegala): stesse pose, stesse posizioni nelle celle, stessa silhouette di base; aggiungi solo gli elementi della variante territoriale.

6. COERENZA DELLA FAMIGLIA
- Stessa figura in tutti i fotogrammi, contorno e palette costanti, nessun fotogramma tagliato dal bordo della cella.
- Base, territoriale ed élite sono lo stesso nemico: l'élite si riconosce subito per sagoma e accessori, non solo per colore.
- Gli effetti B usano solo il colore #F08A2C con nucleo chiaro.

7. SFONDO, FORMATO E RISOLUZIONE
A e B: PNG. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- la grafica non promette né nasconde un’area di danno: l’effetto copre solo la forma dell’attacco
- nessuna nuova resistenza, arma o potere non scritti nella variante
- nessun gore
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 15/310 — enemy.breaker.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/enemy/enemy_breaker/v03.png, deliveries/gpt-preproduzione-310-20261029/enemy/enemy_breaker/v03_vfx.png

**Prompt canonico:** `enemy.breaker.03.md`

<!-- 15/310 -->
# enemy.breaker.03 — Breaker · v03

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_nemici.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/enemy/enemy_breaker/`, file: `v03.png`, `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/enemy/enemy_breaker/v03.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna lo sprite sheet del nemico Breaker, variante élite.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Famiglia gang (Relay); ruolo in combattimento: sfonda coperture. Nemico già nel gioco: usa lo sheet originale allegato (ref_nemici.png) come base fedele, stessa scala e stesse proporzioni; il collider del codice non cambia.
Variante élite: Élite: spallacci triangolari arancio e doppio segno di attrezzo; nessuna nuova resistenza implicita.

2. SOGGETTO, MATERIALI E COLORI
- Corpo e silhouette: figura bassa e larga, spalle enormi, martello pneumatico.
- Movimento: passo pesante, spalle che caricano il colpo.
- Colore dell'avviso d'attacco e degli effetti: #F08A2C (unico per questo nemico).
- Materiali vissuti coerenti con la famiglia gang (Relay); la silhouette deve distinguersi dalle altre classi anche in nero pieno, non solo per tinta.

3. STILE
Pixel art HD dettagliata come gli sprite nemici canonici (ref_nemici.png: gang, infetti, custodi, alieni) e i boss (ref_boss.png): contorno scuro, ombre a gradini, materiali vissuti, luci emissive solo dove servono a leggere l'attacco. Silhouette riconoscibile in nero pieno a 110 px.

4. ANGOLAZIONE, PROSPETTIVA, LUCE
Camera del gioco leggermente dall'alto, figura intera; altezza circa 220 px in ogni cella; luce dall'alto a sinistra; piedi sulla stessa linea in tutta la riga.

5. VISTE E ANIMAZIONI (proposta: tempi e frame definitivi li decide il codice)
A. v03.png: sprite sheet 1536×1024, griglia 8×4 di celle 192×256:
   - riga 1: fronte, schiena, lato destro, 3/4; poi idle 4 fotogrammi;
   - riga 2: camminata 6 fotogrammi; colpito 2 fotogrammi;
   - riga 3: anticipazione 4 fotogrammi (avviso leggibile, una sola lettura); attacco 4 fotogrammi;
   - riga 4: sconfitta 6 fotogrammi; 2 celle vuote.
B. v03_vfx.png: effetti separati 1536×512, quattro celle 384×512: avviso (telegraph), in volo, impatto, annullato.
MODIFICA la tua immagine v01.png dello stesso nemico (allegala): stesse pose, stesse posizioni nelle celle, stessa silhouette di base; aggiungi solo gli elementi della variante élite.

6. COERENZA DELLA FAMIGLIA
- Stessa figura in tutti i fotogrammi, contorno e palette costanti, nessun fotogramma tagliato dal bordo della cella.
- Base, territoriale ed élite sono lo stesso nemico: l'élite si riconosce subito per sagoma e accessori, non solo per colore.
- Gli effetti B usano solo il colore #F08A2C con nucleo chiaro.

7. SFONDO, FORMATO E RISOLUZIONE
A e B: PNG. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- la grafica non promette né nasconde un’area di danno: l’effetto copre solo la forma dell’attacco
- nessuna nuova resistenza, arma o potere non scritti nella variante
- nessun gore
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 16/310 — enemy.echo.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/enemy/enemy_echo/v01.png, deliveries/gpt-preproduzione-310-20261029/enemy/enemy_echo/v01_vfx.png

**Prompt canonico:** `enemy.echo.01.md`

<!-- 16/310 -->
# enemy.echo.01 — Echo · v01

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_nemici.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/enemy/enemy_echo/`, file: `v01.png`, `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/enemy/enemy_echo/v01.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna lo sprite sheet del nemico Echo, variante base.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Famiglia infetti; ruolo in combattimento: ripete azioni. Nemico già nel gioco: usa lo sheet originale allegato (ref_nemici.png) come base fedele, stessa scala e stesse proporzioni; il collider del codice non cambia.
Variante base: Base: posa ripetuta in tre battute con pausa chiaramente identificabile.

2. SOGGETTO, MATERIALI E COLORI
- Corpo e silhouette: figura magra infetta, stoffa consumata, gesti a scatti.
- Movimento: posa ripetuta in tre battute con pausa chiara.
- Colore dell'avviso d'attacco e degli effetti: #7AA0FF (unico per questo nemico).
- Materiali vissuti coerenti con la famiglia infetti; la silhouette deve distinguersi dalle altre classi anche in nero pieno, non solo per tinta.

3. STILE
Pixel art HD dettagliata come gli sprite nemici canonici (ref_nemici.png: gang, infetti, custodi, alieni) e i boss (ref_boss.png): contorno scuro, ombre a gradini, materiali vissuti, luci emissive solo dove servono a leggere l'attacco. Silhouette riconoscibile in nero pieno a 110 px.

4. ANGOLAZIONE, PROSPETTIVA, LUCE
Camera del gioco leggermente dall'alto, figura intera; altezza circa 220 px in ogni cella; luce dall'alto a sinistra; piedi sulla stessa linea in tutta la riga.

5. VISTE E ANIMAZIONI (proposta: tempi e frame definitivi li decide il codice)
A. v01.png: sprite sheet 1536×1024, griglia 8×4 di celle 192×256:
   - riga 1: fronte, schiena, lato destro, 3/4; poi idle 4 fotogrammi;
   - riga 2: camminata 6 fotogrammi; colpito 2 fotogrammi;
   - riga 3: anticipazione 4 fotogrammi (avviso leggibile, una sola lettura); attacco 4 fotogrammi;
   - riga 4: sconfitta 6 fotogrammi; 2 celle vuote.
B. v01_vfx.png: effetti separati 1536×512, quattro celle 384×512: avviso (telegraph), in volo, impatto, annullato.
Variante base: fissa silhouette, proporzioni e colori.

6. COERENZA DELLA FAMIGLIA
- Stessa figura in tutti i fotogrammi, contorno e palette costanti, nessun fotogramma tagliato dal bordo della cella.
- Base, territoriale ed élite sono lo stesso nemico: l'élite si riconosce subito per sagoma e accessori, non solo per colore.
- Gli effetti B usano solo il colore #7AA0FF con nucleo chiaro.

7. SFONDO, FORMATO E RISOLUZIONE
A e B: PNG. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- la grafica non promette né nasconde un’area di danno: l’effetto copre solo la forma dell’attacco
- nessuna nuova resistenza, arma o potere non scritti nella variante
- nessun gore
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 17/310 — enemy.echo.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/enemy/enemy_echo/v02.png, deliveries/gpt-preproduzione-310-20261029/enemy/enemy_echo/v02_vfx.png

**Prompt canonico:** `enemy.echo.02.md`

<!-- 17/310 -->
# enemy.echo.02 — Echo · v02

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_nemici.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/enemy/enemy_echo/`, file: `v02.png`, `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/enemy/enemy_echo/v02.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna lo sprite sheet del nemico Echo, variante territoriale.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Famiglia infetti; ruolo in combattimento: ripete azioni. Nemico già nel gioco: usa lo sheet originale allegato (ref_nemici.png) come base fedele, stessa scala e stesse proporzioni; il collider del codice non cambia.
Variante territoriale: Infected: stoffa consumata blu scuro, segni di ripetizione in coda.

2. SOGGETTO, MATERIALI E COLORI
- Corpo e silhouette: figura magra infetta, stoffa consumata, gesti a scatti.
- Movimento: posa ripetuta in tre battute con pausa chiara.
- Colore dell'avviso d'attacco e degli effetti: #7AA0FF (unico per questo nemico).
- Materiali vissuti coerenti con la famiglia infetti; la silhouette deve distinguersi dalle altre classi anche in nero pieno, non solo per tinta.

3. STILE
Pixel art HD dettagliata come gli sprite nemici canonici (ref_nemici.png: gang, infetti, custodi, alieni) e i boss (ref_boss.png): contorno scuro, ombre a gradini, materiali vissuti, luci emissive solo dove servono a leggere l'attacco. Silhouette riconoscibile in nero pieno a 110 px.

4. ANGOLAZIONE, PROSPETTIVA, LUCE
Camera del gioco leggermente dall'alto, figura intera; altezza circa 220 px in ogni cella; luce dall'alto a sinistra; piedi sulla stessa linea in tutta la riga.

5. VISTE E ANIMAZIONI (proposta: tempi e frame definitivi li decide il codice)
A. v02.png: sprite sheet 1536×1024, griglia 8×4 di celle 192×256:
   - riga 1: fronte, schiena, lato destro, 3/4; poi idle 4 fotogrammi;
   - riga 2: camminata 6 fotogrammi; colpito 2 fotogrammi;
   - riga 3: anticipazione 4 fotogrammi (avviso leggibile, una sola lettura); attacco 4 fotogrammi;
   - riga 4: sconfitta 6 fotogrammi; 2 celle vuote.
B. v02_vfx.png: effetti separati 1536×512, quattro celle 384×512: avviso (telegraph), in volo, impatto, annullato.
MODIFICA la tua immagine v01.png dello stesso nemico (allegala): stesse pose, stesse posizioni nelle celle, stessa silhouette di base; aggiungi solo gli elementi della variante territoriale.

6. COERENZA DELLA FAMIGLIA
- Stessa figura in tutti i fotogrammi, contorno e palette costanti, nessun fotogramma tagliato dal bordo della cella.
- Base, territoriale ed élite sono lo stesso nemico: l'élite si riconosce subito per sagoma e accessori, non solo per colore.
- Gli effetti B usano solo il colore #7AA0FF con nucleo chiaro.

7. SFONDO, FORMATO E RISOLUZIONE
A e B: PNG. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- la grafica non promette né nasconde un’area di danno: l’effetto copre solo la forma dell’attacco
- nessuna nuova resistenza, arma o potere non scritti nella variante
- nessun gore
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 18/310 — enemy.echo.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/enemy/enemy_echo/v03.png, deliveries/gpt-preproduzione-310-20261029/enemy/enemy_echo/v03_vfx.png

**Prompt canonico:** `enemy.echo.03.md`

<!-- 18/310 -->
# enemy.echo.03 — Echo · v03

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_nemici.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/enemy/enemy_echo/`, file: `v03.png`, `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/enemy/enemy_echo/v03.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna lo sprite sheet del nemico Echo, variante élite.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Famiglia infetti; ruolo in combattimento: ripete azioni. Nemico già nel gioco: usa lo sheet originale allegato (ref_nemici.png) come base fedele, stessa scala e stesse proporzioni; il collider del codice non cambia.
Variante élite: Élite: afterimage separato dal corpo, mai dannoso fuori telegraph.

2. SOGGETTO, MATERIALI E COLORI
- Corpo e silhouette: figura magra infetta, stoffa consumata, gesti a scatti.
- Movimento: posa ripetuta in tre battute con pausa chiara.
- Colore dell'avviso d'attacco e degli effetti: #7AA0FF (unico per questo nemico).
- Materiali vissuti coerenti con la famiglia infetti; la silhouette deve distinguersi dalle altre classi anche in nero pieno, non solo per tinta.

3. STILE
Pixel art HD dettagliata come gli sprite nemici canonici (ref_nemici.png: gang, infetti, custodi, alieni) e i boss (ref_boss.png): contorno scuro, ombre a gradini, materiali vissuti, luci emissive solo dove servono a leggere l'attacco. Silhouette riconoscibile in nero pieno a 110 px.

4. ANGOLAZIONE, PROSPETTIVA, LUCE
Camera del gioco leggermente dall'alto, figura intera; altezza circa 220 px in ogni cella; luce dall'alto a sinistra; piedi sulla stessa linea in tutta la riga.

5. VISTE E ANIMAZIONI (proposta: tempi e frame definitivi li decide il codice)
A. v03.png: sprite sheet 1536×1024, griglia 8×4 di celle 192×256:
   - riga 1: fronte, schiena, lato destro, 3/4; poi idle 4 fotogrammi;
   - riga 2: camminata 6 fotogrammi; colpito 2 fotogrammi;
   - riga 3: anticipazione 4 fotogrammi (avviso leggibile, una sola lettura); attacco 4 fotogrammi;
   - riga 4: sconfitta 6 fotogrammi; 2 celle vuote.
B. v03_vfx.png: effetti separati 1536×512, quattro celle 384×512: avviso (telegraph), in volo, impatto, annullato.
MODIFICA la tua immagine v01.png dello stesso nemico (allegala): stesse pose, stesse posizioni nelle celle, stessa silhouette di base; aggiungi solo gli elementi della variante élite.

6. COERENZA DELLA FAMIGLIA
- Stessa figura in tutti i fotogrammi, contorno e palette costanti, nessun fotogramma tagliato dal bordo della cella.
- Base, territoriale ed élite sono lo stesso nemico: l'élite si riconosce subito per sagoma e accessori, non solo per colore.
- Gli effetti B usano solo il colore #7AA0FF con nucleo chiaro.

7. SFONDO, FORMATO E RISOLUZIONE
A e B: PNG. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- la grafica non promette né nasconde un’area di danno: l’effetto copre solo la forma dell’attacco
- nessuna nuova resistenza, arma o potere non scritti nella variante
- nessun gore
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 41/310 — character.lulu.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_lulu/v01.png

**Prompt canonico:** `character.lulu.01.md`

<!-- 41/310 -->
# character.lulu.01 — Lulù · v01

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: **il team compone la tavola dagli sheet reali** (non si chiede a GPT)

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_protagonisti.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_lulu/`, file: `v01.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_lulu/v01.png`

```
TAVOLA DA COMPORRE DAL TEAM, NON DA GENERARE.
Lulù è protagonista (femminile (canone)). Regola dell'autore: il corpo e il volto V8 non si ridisegnano. Questa tavola si compone solo con fotogrammi reali del gioco.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
protagonista: tecnica dei nodi e della risonanza. Variante 01: Esplorazione: preservare identità V8 e silhouette.

2. SOGGETTO, MATERIALI E COLORI
Fotogrammi reali, senza ritocchi: game/art/v05/lulu_walk.png (quattro direzioni), game/art/v05/lulu_actions.png, game/art/v08/portraits.png. Palette letta dagli sheet: #4E5A2E, #1A1A1E, #D8287A, #F2E2D0, #A060FF.

3. STILE
Lo stile è quello degli sheet originali: nessun filtro, nessun ridimensionamento non intero.

4. ANGOLAZIONE E COMPOSIZIONE
Quattro direzioni (fronte, schiena, lato, diagonale), posa idle, gesto della variante, ritratto da portraits.png, palette; stessa scala per tutte le figure, piedi sulla stessa linea.

5. VISTE E POSE
Scelte dal team fra le celle esistenti; per le varianti con arma solo celle già verificate (rapporti in docs/evidence/v10.2/production/armi/).

6. COERENZA
Identità garantita perché i pixel sono quelli del gioco: verifica SHA-256 delle sorgenti in v01.json.

7. FORMATO
PNG 1536×1024 opaco, intestazione con ID canonico.

8. RESTRIZIONI
- nessun pixel del personaggio modificato fuori dalle maschere già approvate
- se servirà un'immagine nuova (posa che non esiste), si chiede a GPT SOLO una modifica in maschera sopra la cella reale, come per H-17/ARC-7
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 42/310 — character.lulu.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_lulu/v02.png

**Prompt canonico:** `character.lulu.02.md`

<!-- 42/310 -->
# character.lulu.02 — Lulù · v02

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: **il team compone la tavola dagli sheet reali** (non si chiede a GPT)

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_protagonisti.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_lulu/`, file: `v02.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_lulu/v02.png`

```
TAVOLA DA COMPORRE DAL TEAM, NON DA GENERARE.
Lulù è protagonista (femminile (canone)). Regola dell'autore: il corpo e il volto V8 non si ridisegnano. Questa tavola si compone solo con fotogrammi reali del gioco.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
protagonista: tecnica dei nodi e della risonanza. Variante 02: ARC-7: impugnatura viola a tre anelli dentro maschera.

2. SOGGETTO, MATERIALI E COLORI
Fotogrammi reali, senza ritocchi: game/art/v10/lulu_arc7_gun.png (ARC-7 in maschera, 16 celle), game/art/v10/lulu_arc7_reload.png. Palette letta dagli sheet: #4E5A2E, #1A1A1E, #D8287A, #F2E2D0, #A060FF.

3. STILE
Lo stile è quello degli sheet originali: nessun filtro, nessun ridimensionamento non intero.

4. ANGOLAZIONE E COMPOSIZIONE
Quattro direzioni (fronte, schiena, lato, diagonale), posa idle, gesto della variante, ritratto da portraits.png, palette; stessa scala per tutte le figure, piedi sulla stessa linea.

5. VISTE E POSE
Scelte dal team fra le celle esistenti; per le varianti con arma solo celle già verificate (rapporti in docs/evidence/v10.2/production/armi/).

6. COERENZA
Identità garantita perché i pixel sono quelli del gioco: verifica SHA-256 delle sorgenti in v02.json.

7. FORMATO
PNG 1536×1024 opaco, intestazione con ID canonico.

8. RESTRIZIONI
- nessun pixel del personaggio modificato fuori dalle maschere già approvate
- se servirà un'immagine nuova (posa che non esiste), si chiede a GPT SOLO una modifica in maschera sopra la cella reale, come per H-17/ARC-7
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 43/310 — character.lulu.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_lulu/v03.png

**Prompt canonico:** `character.lulu.03.md`

<!-- 43/310 -->
# character.lulu.03 — Lulù · v03

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: **il team compone la tavola dagli sheet reali** (non si chiede a GPT)

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_protagonisti.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_lulu/`, file: `v03.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_lulu/v03.png`

```
TAVOLA DA COMPORRE DAL TEAM, NON DA GENERARE.
Lulù è protagonista (femminile (canone)). Regola dell'autore: il corpo e il volto V8 non si ridisegnano. Questa tavola si compone solo con fotogrammi reali del gioco.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
protagonista: tecnica dei nodi e della risonanza. Variante 03: Reunion: emozione espressa dalle mani e dalla postura, non da volto ridisegnato.

2. SOGGETTO, MATERIALI E COLORI
Fotogrammi reali, senza ritocchi: game/art/v05/lulu_actions.png (riga Duo), game/art/v09/reunion.png. Palette letta dagli sheet: #4E5A2E, #1A1A1E, #D8287A, #F2E2D0, #A060FF.

3. STILE
Lo stile è quello degli sheet originali: nessun filtro, nessun ridimensionamento non intero.

4. ANGOLAZIONE E COMPOSIZIONE
Quattro direzioni (fronte, schiena, lato, diagonale), posa idle, gesto della variante, ritratto da portraits.png, palette; stessa scala per tutte le figure, piedi sulla stessa linea.

5. VISTE E POSE
Scelte dal team fra le celle esistenti; per le varianti con arma solo celle già verificate (rapporti in docs/evidence/v10.2/production/armi/).

6. COERENZA
Identità garantita perché i pixel sono quelli del gioco: verifica SHA-256 delle sorgenti in v03.json.

7. FORMATO
PNG 1536×1024 opaco, intestazione con ID canonico.

8. RESTRIZIONI
- nessun pixel del personaggio modificato fuori dalle maschere già approvate
- se servirà un'immagine nuova (posa che non esiste), si chiede a GPT SOLO una modifica in maschera sopra la cella reale, come per H-17/ARC-7
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 50/310 — character.nox.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_nox/v01.png

**Prompt canonico:** `character.nox.01.md`

<!-- 50/310 -->
# character.nox.01 — Nox · v01

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: **il team compone la tavola dagli sheet reali** (non si chiede a GPT)

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_protagonisti.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_nox/`, file: `v01.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_nox/v01.png`

```
TAVOLA DA COMPORRE DAL TEAM, NON DA GENERARE.
Nox è protagonista (maschile (canone)). Regola dell'autore: il corpo e il volto V8 non si ridisegnano. Questa tavola si compone solo con fotogrammi reali del gioco.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
protagonista: pilota della Vortex e combattente con guanto Pulse. Variante 01: Esplorazione: preservare identità V8 e silhouette.

2. SOGGETTO, MATERIALI E COLORI
Fotogrammi reali, senza ritocchi: game/art/v05/nox_walk.png (quattro direzioni), game/art/v05/nox_actions.png (idle e gesto), game/art/v08/portraits.png. Palette letta dagli sheet: #F2F2F2, #1A1A1E, #2C6BD8, #7A4A2E, #59E0FF.

3. STILE
Lo stile è quello degli sheet originali: nessun filtro, nessun ridimensionamento non intero.

4. ANGOLAZIONE E COMPOSIZIONE
Quattro direzioni (fronte, schiena, lato, diagonale), posa idle, gesto della variante, ritratto da portraits.png, palette; stessa scala per tutte le figure, piedi sulla stessa linea.

5. VISTE E POSE
Scelte dal team fra le celle esistenti; per le varianti con arma solo celle già verificate (rapporti in docs/evidence/v10.2/production/armi/).

6. COERENZA
Identità garantita perché i pixel sono quelli del gioco: verifica SHA-256 delle sorgenti in v01.json.

7. FORMATO
PNG 1536×1024 opaco, intestazione con ID canonico.

8. RESTRIZIONI
- nessun pixel del personaggio modificato fuori dalle maschere già approvate
- se servirà un'immagine nuova (posa che non esiste), si chiede a GPT SOLO una modifica in maschera sopra la cella reale, come per H-17/ARC-7
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 51/310 — character.nox.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_nox/v02.png

**Prompt canonico:** `character.nox.02.md`

<!-- 51/310 -->
# character.nox.02 — Nox · v02

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: **il team compone la tavola dagli sheet reali** (non si chiede a GPT)

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_protagonisti.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_nox/`, file: `v02.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_nox/v02.png`

```
TAVOLA DA COMPORRE DAL TEAM, NON DA GENERARE.
Nox è protagonista (maschile (canone)). Regola dell'autore: il corpo e il volto V8 non si ridisegnano. Questa tavola si compone solo con fotogrammi reali del gioco.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
protagonista: pilota della Vortex e combattente con guanto Pulse. Variante 02: H-17: precisione bianco-nera e cellette azzurre solo in maschera.

2. SOGGETTO, MATERIALI E COLORI
Fotogrammi reali, senza ritocchi: game/art/v10/nox_h17_gun.png (H-17 in maschera, 16 celle), game/art/v10/nox_h17_reload.png. Palette letta dagli sheet: #F2F2F2, #1A1A1E, #2C6BD8, #7A4A2E, #59E0FF.

3. STILE
Lo stile è quello degli sheet originali: nessun filtro, nessun ridimensionamento non intero.

4. ANGOLAZIONE E COMPOSIZIONE
Quattro direzioni (fronte, schiena, lato, diagonale), posa idle, gesto della variante, ritratto da portraits.png, palette; stessa scala per tutte le figure, piedi sulla stessa linea.

5. VISTE E POSE
Scelte dal team fra le celle esistenti; per le varianti con arma solo celle già verificate (rapporti in docs/evidence/v10.2/production/armi/).

6. COERENZA
Identità garantita perché i pixel sono quelli del gioco: verifica SHA-256 delle sorgenti in v02.json.

7. FORMATO
PNG 1536×1024 opaco, intestazione con ID canonico.

8. RESTRIZIONI
- nessun pixel del personaggio modificato fuori dalle maschere già approvate
- se servirà un'immagine nuova (posa che non esiste), si chiede a GPT SOLO una modifica in maschera sopra la cella reale, come per H-17/ARC-7
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 52/310 — character.nox.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_nox/v03.png

**Prompt canonico:** `character.nox.03.md`

<!-- 52/310 -->
# character.nox.03 — Nox · v03

Stato: **PROMPT_READY** · nessuna immagine generata · contenuto già nel gioco · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: **il team compone la tavola dagli sheet reali** (non si chiede a GPT)

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_protagonisti.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_nox/`, file: `v03.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_nox/v03.png`

```
TAVOLA DA COMPORRE DAL TEAM, NON DA GENERARE.
Nox è protagonista (maschile (canone)). Regola dell'autore: il corpo e il volto V8 non si ridisegnano. Questa tavola si compone solo con fotogrammi reali del gioco.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
protagonista: pilota della Vortex e combattente con guanto Pulse. Variante 03: Controcolpo: postura riconoscibile, piedi e volto invariati.

2. SOGGETTO, MATERIALI E COLORI
Fotogrammi reali, senza ritocchi: game/art/v05/nox_actions.png (schiva e contraccolpo), game/art/v05/nox_gun.png. Palette letta dagli sheet: #F2F2F2, #1A1A1E, #2C6BD8, #7A4A2E, #59E0FF.

3. STILE
Lo stile è quello degli sheet originali: nessun filtro, nessun ridimensionamento non intero.

4. ANGOLAZIONE E COMPOSIZIONE
Quattro direzioni (fronte, schiena, lato, diagonale), posa idle, gesto della variante, ritratto da portraits.png, palette; stessa scala per tutte le figure, piedi sulla stessa linea.

5. VISTE E POSE
Scelte dal team fra le celle esistenti; per le varianti con arma solo celle già verificate (rapporti in docs/evidence/v10.2/production/armi/).

6. COERENZA
Identità garantita perché i pixel sono quelli del gioco: verifica SHA-256 delle sorgenti in v03.json.

7. FORMATO
PNG 1536×1024 opaco, intestazione con ID canonico.

8. RESTRIZIONI
- nessun pixel del personaggio modificato fuori dalle maschere già approvate
- se servirà un'immagine nuova (posa che non esiste), si chiede a GPT SOLO una modifica in maschera sopra la cella reale, come per H-17/ARC-7
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 259/310 — character.tomas_vale.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_tomas_vale/v03.png, deliveries/gpt-preproduzione-310-20261029/character/character_tomas_vale/v03_ritratti.png

**Prompt canonico:** `character.tomas_vale.03.md`

<!-- 259/310 -->
# character.tomas_vale.03 — Tomas Vale · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_npc_stile.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_tomas_vale/`, file: `v03.png`, `v03_ritratti.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_tomas_vale/v03.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna la tavola personaggio di Tomas Vale, variante 03.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Tomas Vale: mercante: le scorte cambiano con il distretto. Personalità visiva: affabile, pratico. Genere: maschile (proposta).
Variante 03: Rifornimento: cassette piene e gesto d'accoglienza.


2. SOGGETTO, MATERIALI E COLORI
- Aspetto: mercante del porto con gilet a righe, borsa delle scorte a tracolla, registro inventato, cappello a falda corta.
- Materiali con usura credibile: tessuti con pieghe e cuciture, cuoio graffiato, metallo con riflessi netti.
- Palette (hex): #8A3A2E, #C8B890, #3A5A6A, #6B4A2E.
- Gesto e attività della variante: Rifornimento: cassette piene e gesto d'accoglienza. Un oggetto di lavoro in mano o vicino quando la variante lo nomina.

3. STILE
Pixel art HD dettagliata come gli sprite canonici del gioco (riferimenti ref_protagonisti.png e ref_npc_stile.png): proporzioni realistiche leggermente stilizzate (circa 6,5 teste), contorno scuro di 1 pixel, ombreggiatura a gradini con 3-4 toni per materiale, riflessi netti su metallo e tessuti lucidi, luce dall'alto a sinistra. Volti leggibili anche a 110 px di altezza sullo schermo. Mai tinta unita: pieghe, cuciture, usura, accessori.

4. ANGOLAZIONE, PROSPETTIVA, LUCE, PROPORZIONI
- Figure intere in piedi, viste dalla camera del gioco (leggermente dall'alto), piedi tutti sulla stessa linea di base.
- Altezza della figura circa 300 px nell'immagine; stessa scala in tutte le pose.
- Luce dall'alto a sinistra, ombra propria a gradini, nessuna ombra portata a terra.

5. VISTE, POSE E VARIANTI DA PRODURRE
A. v03.png: model sheet 1536×1024 con sei figure in fila: fronte, schiena, lato destro, 3/4 di schiena, posa idle, gesto caratteristico della variante.
B. v03_ritratti.png: tre ritratti busto 512×512 affiancati (1536×512) come i ritratti del gioco (ref_protagonisti.png, portraits.png): emozioni neutra, tesa, serena; sfondo pittorico scuro della sua città, nessun testo.
MODIFICA la tua immagine v01.png dello stesso personaggio (allegala): stesso volto, stessi capelli, stessa corporatura; cambiano solo gli elementi della variante «Rifornimento».

6. COERENZA DELLA FAMIGLIA
- Lo stesso volto, gli stessi capelli e gli stessi colori in tutte le figure e nei tre ritratti.
- Le tre varianti dello stesso personaggio sono la stessa persona: cambia la situazione, non l'identità.
- Stile e scala coerenti con gli NPC del gioco (ref_npc_stile.png).

7. SFONDO, FORMATO E RISOLUZIONE
- A: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.
- B: PNG 1536×512, sfondo pittorico scuro.

8. RESTRIZIONI
- non cambiare volto, età, corporatura o colori fra le figure
- nessuna caricatura, nessuno stereotipo etnico o di disabilità
- nessun tratto aggressivo se la variante non lo chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 260/310 — character.vesper.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_vesper/v01.png, deliveries/gpt-preproduzione-310-20261029/character/character_vesper/v01_ritratti.png

**Prompt canonico:** `character.vesper.01.md`

<!-- 260/310 -->
# character.vesper.01 — Vesper · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_npc_stile.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_vesper/`, file: `v01.png`, `v01_ritratti.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_vesper/v01.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna la tavola personaggio di Vesper, variante 01.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Vesper: informatore del Toxic Bazaar. Personalità visiva: misterioso ma etico: vende segreti di sistema, mai informazioni private. Genere: non dichiarato (maschera).
Variante 01: Informatore: maschera originale e borsa a tracolla.


2. SOGGETTO, MATERIALI E COLORI
- Aspetto: informatore incappucciato con maschera originale a mezzo volto, borsa a tracolla, mantello viola scuro.
- Materiali con usura credibile: tessuti con pieghe e cuciture, cuoio graffiato, metallo con riflessi netti.
- Palette (hex): #3A2A4A, #7A5A8A, #C8B890, #2A2A2E.
- Gesto e attività della variante: Informatore: maschera originale e borsa a tracolla. Un oggetto di lavoro in mano o vicino quando la variante lo nomina.

3. STILE
Pixel art HD dettagliata come gli sprite canonici del gioco (riferimenti ref_protagonisti.png e ref_npc_stile.png): proporzioni realistiche leggermente stilizzate (circa 6,5 teste), contorno scuro di 1 pixel, ombreggiatura a gradini con 3-4 toni per materiale, riflessi netti su metallo e tessuti lucidi, luce dall'alto a sinistra. Volti leggibili anche a 110 px di altezza sullo schermo. Mai tinta unita: pieghe, cuciture, usura, accessori.

4. ANGOLAZIONE, PROSPETTIVA, LUCE, PROPORZIONI
- Figure intere in piedi, viste dalla camera del gioco (leggermente dall'alto), piedi tutti sulla stessa linea di base.
- Altezza della figura circa 300 px nell'immagine; stessa scala in tutte le pose.
- Luce dall'alto a sinistra, ombra propria a gradini, nessuna ombra portata a terra.

5. VISTE, POSE E VARIANTI DA PRODURRE
A. v01.png: model sheet 1536×1024 con sei figure in fila: fronte, schiena, lato destro, 3/4 di schiena, posa idle, gesto caratteristico della variante.
B. v01_ritratti.png: tre ritratti busto 512×512 affiancati (1536×512) come i ritratti del gioco (ref_protagonisti.png, portraits.png): emozioni neutra, tesa, serena; sfondo pittorico scuro della sua città, nessun testo.
Questa è la variante master (01): fissa volto, capelli, corporatura e abiti.

6. COERENZA DELLA FAMIGLIA
- Lo stesso volto, gli stessi capelli e gli stessi colori in tutte le figure e nei tre ritratti.
- Le tre varianti dello stesso personaggio sono la stessa persona: cambia la situazione, non l'identità.
- Stile e scala coerenti con gli NPC del gioco (ref_npc_stile.png).

7. SFONDO, FORMATO E RISOLUZIONE
- A: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.
- B: PNG 1536×512, sfondo pittorico scuro.

8. RESTRIZIONI
- non cambiare volto, età, corporatura o colori fra le figure
- nessuna caricatura, nessuno stereotipo etnico o di disabilità
- nessun tratto aggressivo se la variante non lo chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 261/310 — character.vesper.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_vesper/v02.png, deliveries/gpt-preproduzione-310-20261029/character/character_vesper/v02_ritratti.png

**Prompt canonico:** `character.vesper.02.md`

<!-- 261/310 -->
# character.vesper.02 — Vesper · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_npc_stile.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_vesper/`, file: `v02.png`, `v02_ritratti.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_vesper/v02.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna la tavola personaggio di Vesper, variante 02.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Vesper: informatore del Toxic Bazaar. Personalità visiva: misterioso ma etico: vende segreti di sistema, mai informazioni private. Genere: non dichiarato (maschera).
Variante 02: Trattativa: porge solo un foglio fittizio.


2. SOGGETTO, MATERIALI E COLORI
- Aspetto: informatore incappucciato con maschera originale a mezzo volto, borsa a tracolla, mantello viola scuro.
- Materiali con usura credibile: tessuti con pieghe e cuciture, cuoio graffiato, metallo con riflessi netti.
- Palette (hex): #3A2A4A, #7A5A8A, #C8B890, #2A2A2E.
- Gesto e attività della variante: Trattativa: porge solo un foglio fittizio. Un oggetto di lavoro in mano o vicino quando la variante lo nomina.

3. STILE
Pixel art HD dettagliata come gli sprite canonici del gioco (riferimenti ref_protagonisti.png e ref_npc_stile.png): proporzioni realistiche leggermente stilizzate (circa 6,5 teste), contorno scuro di 1 pixel, ombreggiatura a gradini con 3-4 toni per materiale, riflessi netti su metallo e tessuti lucidi, luce dall'alto a sinistra. Volti leggibili anche a 110 px di altezza sullo schermo. Mai tinta unita: pieghe, cuciture, usura, accessori.

4. ANGOLAZIONE, PROSPETTIVA, LUCE, PROPORZIONI
- Figure intere in piedi, viste dalla camera del gioco (leggermente dall'alto), piedi tutti sulla stessa linea di base.
- Altezza della figura circa 300 px nell'immagine; stessa scala in tutte le pose.
- Luce dall'alto a sinistra, ombra propria a gradini, nessuna ombra portata a terra.

5. VISTE, POSE E VARIANTI DA PRODURRE
A. v02.png: model sheet 1536×1024 con sei figure in fila: fronte, schiena, lato destro, 3/4 di schiena, posa idle, gesto caratteristico della variante.
B. v02_ritratti.png: tre ritratti busto 512×512 affiancati (1536×512) come i ritratti del gioco (ref_protagonisti.png, portraits.png): emozioni neutra, tesa, serena; sfondo pittorico scuro della sua città, nessun testo.
MODIFICA la tua immagine v01.png dello stesso personaggio (allegala): stesso volto, stessi capelli, stessa corporatura; cambiano solo gli elementi della variante «Trattativa».

6. COERENZA DELLA FAMIGLIA
- Lo stesso volto, gli stessi capelli e gli stessi colori in tutte le figure e nei tre ritratti.
- Le tre varianti dello stesso personaggio sono la stessa persona: cambia la situazione, non l'identità.
- Stile e scala coerenti con gli NPC del gioco (ref_npc_stile.png).

7. SFONDO, FORMATO E RISOLUZIONE
- A: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.
- B: PNG 1536×512, sfondo pittorico scuro.

8. RESTRIZIONI
- non cambiare volto, età, corporatura o colori fra le figure
- nessuna caricatura, nessuno stereotipo etnico o di disabilità
- nessun tratto aggressivo se la variante non lo chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 262/310 — character.vesper.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/character/character_vesper/v03.png, deliveries/gpt-preproduzione-310-20261029/character/character_vesper/v03_ritratti.png

**Prompt canonico:** `character.vesper.03.md`

<!-- 262/310 -->
# character.vesper.03 — Vesper · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_npc_stile.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/character/character_vesper/`, file: `v03.png`, `v03_ritratti.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/character/character_vesper/v03.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna la tavola personaggio di Vesper, variante 03.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Vesper: informatore del Toxic Bazaar. Personalità visiva: misterioso ma etico: vende segreti di sistema, mai informazioni private. Genere: non dichiarato (maschera).
Variante 03: Ritiro: nasconde appunti e lascia il mercato.


2. SOGGETTO, MATERIALI E COLORI
- Aspetto: informatore incappucciato con maschera originale a mezzo volto, borsa a tracolla, mantello viola scuro.
- Materiali con usura credibile: tessuti con pieghe e cuciture, cuoio graffiato, metallo con riflessi netti.
- Palette (hex): #3A2A4A, #7A5A8A, #C8B890, #2A2A2E.
- Gesto e attività della variante: Ritiro: nasconde appunti e lascia il mercato. Un oggetto di lavoro in mano o vicino quando la variante lo nomina.

3. STILE
Pixel art HD dettagliata come gli sprite canonici del gioco (riferimenti ref_protagonisti.png e ref_npc_stile.png): proporzioni realistiche leggermente stilizzate (circa 6,5 teste), contorno scuro di 1 pixel, ombreggiatura a gradini con 3-4 toni per materiale, riflessi netti su metallo e tessuti lucidi, luce dall'alto a sinistra. Volti leggibili anche a 110 px di altezza sullo schermo. Mai tinta unita: pieghe, cuciture, usura, accessori.

4. ANGOLAZIONE, PROSPETTIVA, LUCE, PROPORZIONI
- Figure intere in piedi, viste dalla camera del gioco (leggermente dall'alto), piedi tutti sulla stessa linea di base.
- Altezza della figura circa 300 px nell'immagine; stessa scala in tutte le pose.
- Luce dall'alto a sinistra, ombra propria a gradini, nessuna ombra portata a terra.

5. VISTE, POSE E VARIANTI DA PRODURRE
A. v03.png: model sheet 1536×1024 con sei figure in fila: fronte, schiena, lato destro, 3/4 di schiena, posa idle, gesto caratteristico della variante.
B. v03_ritratti.png: tre ritratti busto 512×512 affiancati (1536×512) come i ritratti del gioco (ref_protagonisti.png, portraits.png): emozioni neutra, tesa, serena; sfondo pittorico scuro della sua città, nessun testo.
MODIFICA la tua immagine v01.png dello stesso personaggio (allegala): stesso volto, stessi capelli, stessa corporatura; cambiano solo gli elementi della variante «Ritiro».

6. COERENZA DELLA FAMIGLIA
- Lo stesso volto, gli stessi capelli e gli stessi colori in tutte le figure e nei tre ritratti.
- Le tre varianti dello stesso personaggio sono la stessa persona: cambia la situazione, non l'identità.
- Stile e scala coerenti con gli NPC del gioco (ref_npc_stile.png).

7. SFONDO, FORMATO E RISOLUZIONE
- A: PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.
- B: PNG 1536×512, sfondo pittorico scuro.

8. RESTRIZIONI
- non cambiare volto, età, corporatura o colori fra le figure
- nessuna caricatura, nessuno stereotipo etnico o di disabilità
- nessun tratto aggressivo se la variante non lo chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 263/310 — ability.axis_spine.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_axis_spine/v01_vfx.png

**Prompt canonico:** `ability.axis_spine.01.md`

<!-- 263/310 -->
# ability.axis_spine.01 — Spina dell Asse · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_axis_spine/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_axis_spine/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Spina dell Asse, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: spina luminosa lungo un percorso già autorizzato. Colore unico della mossa: #FFE27A (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Piede saldo e mano verso asse della struttura.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFE27A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Spina dell Asse: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 264/310 — ability.axis_spine.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_axis_spine/v02_vfx.png

**Prompt canonico:** `ability.axis_spine.02.md`

<!-- 264/310 -->
# ability.axis_spine.02 — Spina dell Asse · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_axis_spine/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_axis_spine/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Spina dell Asse, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: spina luminosa lungo un percorso già autorizzato. Colore unico della mossa: #FFE27A (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Spina luminosa lungo percorso già autorizzato dalla missione.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFE27A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Spina dell Asse: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 265/310 — ability.axis_spine.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_axis_spine/v03_vfx.png

**Prompt canonico:** `ability.axis_spine.03.md`

<!-- 265/310 -->
# ability.axis_spine.03 — Spina dell Asse · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_axis_spine/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_axis_spine/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Spina dell Asse, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: spina luminosa lungo un percorso già autorizzato. Colore unico della mossa: #FFE27A (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Segnale di connessione al nodo, non proiettile generico.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFE27A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Spina dell Asse: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 266/310 — ability.axis_spine.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_axis_spine/v04_vfx.png

**Prompt canonico:** `ability.axis_spine.04.md`

<!-- 266/310 -->
# ability.axis_spine.04 — Spina dell Asse · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_axis_spine/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_axis_spine/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Spina dell Asse, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: spina luminosa lungo un percorso già autorizzato. Colore unico della mossa: #FFE27A (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Interfaccia rientra, nessuna porta aperta prima del codice.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFE27A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Spina dell Asse: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 267/310 — ability.black_pulse.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_black_pulse/v01_vfx.png

**Prompt canonico:** `ability.black_pulse.01.md`

<!-- 267/310 -->
# ability.black_pulse.01 — Black Pulse · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_black_pulse/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_black_pulse/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Black Pulse, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: impulso nero in negativo con bordo ciano. Colore unico della mossa: #0A0A10+#59E0FF (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Nox comprime il dispositivo, nero con bordo ciano.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #0A0A10+#59E0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Black Pulse: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 268/310 — ability.black_pulse.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_black_pulse/v02_vfx.png

**Prompt canonico:** `ability.black_pulse.02.md`

<!-- 268/310 -->
# ability.black_pulse.02 — Black Pulse · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_black_pulse/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_black_pulse/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Black Pulse, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: impulso nero in negativo con bordo ciano. Colore unico della mossa: #0A0A10+#59E0FF (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Impulso nero in negativo controllato, bordo brillante, centro non invisibile.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #0A0A10+#59E0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Black Pulse: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 269/310 — ability.black_pulse.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_black_pulse/v03_vfx.png

**Prompt canonico:** `ability.black_pulse.03.md`

<!-- 269/310 -->
# ability.black_pulse.03 — Black Pulse · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_black_pulse/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_black_pulse/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Black Pulse, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: impulso nero in negativo con bordo ciano. Colore unico della mossa: #0A0A10+#59E0FF (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Segno breve sulla zona coinvolta senza coprire nemici.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #0A0A10+#59E0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Black Pulse: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 270/310 — ability.black_pulse.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_black_pulse/v04_vfx.png

**Prompt canonico:** `ability.black_pulse.04.md`

<!-- 270/310 -->
# ability.black_pulse.04 — Black Pulse · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_black_pulse/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_black_pulse/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Black Pulse, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: impulso nero in negativo con bordo ciano. Colore unico della mossa: #0A0A10+#59E0FF (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Decompressione ciano con scia che non persiste.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #0A0A10+#59E0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Black Pulse: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 271/310 — ability.duo_switch.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_duo_switch/v01_vfx.png

**Prompt canonico:** `ability.duo_switch.01.md`

<!-- 271/310 -->
# ability.duo_switch.01 — Duo Switch · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_duo_switch/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_duo_switch/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Duo Switch, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: piccolo segnale di passaggio da A a B. Colore unico della mossa: #9FF7B8 (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Due sagome in pose speculari al centro sicuro.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #9FF7B8, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Duo Switch: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 272/310 — ability.duo_switch.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_duo_switch/v02_vfx.png

**Prompt canonico:** `ability.duo_switch.02.md`

<!-- 272/310 -->
# ability.duo_switch.02 — Duo Switch · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_duo_switch/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_duo_switch/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Duo Switch, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: piccolo segnale di passaggio da A a B. Colore unico della mossa: #9FF7B8 (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Segnale di passaggio piccolo e diretto dal giocatore A al B.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #9FF7B8, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Duo Switch: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 273/310 — ability.duo_switch.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_duo_switch/v03_vfx.png

**Prompt canonico:** `ability.duo_switch.03.md`

<!-- 273/310 -->
# ability.duo_switch.03 — Duo Switch · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_duo_switch/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_duo_switch/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Duo Switch, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: piccolo segnale di passaggio da A a B. Colore unico della mossa: #9FF7B8 (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Cambio controllo confermato da HUD, niente finto teletrasporto.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #9FF7B8, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Duo Switch: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 274/310 — ability.duo_switch.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_duo_switch/v04_vfx.png

**Prompt canonico:** `ability.duo_switch.04.md`

<!-- 274/310 -->
# ability.duo_switch.04 — Duo Switch · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_duo_switch/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_duo_switch/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Duo Switch, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: piccolo segnale di passaggio da A a B. Colore unico della mossa: #9FF7B8 (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Figura non controllata torna in idle senza scatti.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #9FF7B8, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Duo Switch: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 275/310 — ability.final_sync.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_final_sync/v01_vfx.png

**Prompt canonico:** `ability.final_sync.01.md`

<!-- 275/310 -->
# ability.final_sync.01 — Final Sync · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_final_sync/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_final_sync/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Final Sync, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: doppia luce verticale che si sincronizza. Colore unico della mossa: #FFFFFF+#FFD980 (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Mani separate dei protagonisti convergono su linea verticale.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFFFFF+#FFD980, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Final Sync: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 276/310 — ability.final_sync.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_final_sync/v02_vfx.png

**Prompt canonico:** `ability.final_sync.02.md`

<!-- 276/310 -->
# ability.final_sync.02 — Final Sync · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_final_sync/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_final_sync/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Final Sync, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: doppia luce verticale che si sincronizza. Colore unico della mossa: #FFFFFF+#FFD980 (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Luce doppia che si sincronizza senza annullare silhouette.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFFFFF+#FFD980, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Final Sync: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 277/310 — ability.final_sync.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_final_sync/v03_vfx.png

**Prompt canonico:** `ability.final_sync.03.md`

<!-- 277/310 -->
# ability.final_sync.03 — Final Sync · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_final_sync/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_final_sync/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Final Sync, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: doppia luce verticale che si sincronizza. Colore unico della mossa: #FFFFFF+#FFD980 (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Punto finale riservato al colpo di Nox secondo trama canonica.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFFFFF+#FFD980, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Final Sync: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 278/310 — ability.final_sync.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_final_sync/v04_vfx.png

**Prompt canonico:** `ability.final_sync.04.md`

<!-- 278/310 -->
# ability.final_sync.04 — Final Sync · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_final_sync/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_final_sync/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Final Sync, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: doppia luce verticale che si sincronizza. Colore unico della mossa: #FFFFFF+#FFD980 (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Dissolvenza e pausa narrativa invece di esplosione standard.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFFFFF+#FFD980, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Final Sync: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 279/310 — ability.heavy_strike.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_heavy_strike/v01_vfx.png

**Prompt canonico:** `ability.heavy_strike.01.md`

<!-- 279/310 -->
# ability.heavy_strike.01 — Heavy Strike · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_heavy_strike/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_heavy_strike/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Heavy Strike, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: arco pesante controllato, terra a tratti solidi. Colore unico della mossa: #FF8A2A (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Solo Nox alza arma con carico del torso chiaramente visibile.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FF8A2A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Heavy Strike: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 280/310 — ability.heavy_strike.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_heavy_strike/v02_vfx.png

**Prompt canonico:** `ability.heavy_strike.02.md`

<!-- 280/310 -->
# ability.heavy_strike.02 — Heavy Strike · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_heavy_strike/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_heavy_strike/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Heavy Strike, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: arco pesante controllato, terra a tratti solidi. Colore unico della mossa: #FF8A2A (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Colpo pesante ad arco controllato, terra a tratti solidi.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FF8A2A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Heavy Strike: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 281/310 — ability.heavy_strike.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_heavy_strike/v03_vfx.png

**Prompt canonico:** `ability.heavy_strike.03.md`

<!-- 281/310 -->
# ability.heavy_strike.03 — Heavy Strike · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_heavy_strike/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_heavy_strike/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Heavy Strike, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: arco pesante controllato, terra a tratti solidi. Colore unico della mossa: #FF8A2A (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Spostamento particelle solo nel punto di contatto.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FF8A2A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Heavy Strike: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 282/310 — ability.heavy_strike.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_heavy_strike/v04_vfx.png

**Prompt canonico:** `ability.heavy_strike.04.md`

<!-- 282/310 -->
# ability.heavy_strike.04 — Heavy Strike · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_heavy_strike/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_heavy_strike/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Heavy Strike, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: arco pesante controllato, terra a tratti solidi. Colore unico della mossa: #FF8A2A (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Recupero deliberato con braccia basse, niente speed-up grafico.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FF8A2A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Heavy Strike: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 283/310 — ability.node_override.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_node_override/v01_vfx.png

**Prompt canonico:** `ability.node_override.01.md`

<!-- 283/310 -->
# ability.node_override.01 — Node Override · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_node_override/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_node_override/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Node Override, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: tre glifi geometrici originali sul nodo. Colore unico della mossa: #7AF3A0 (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Lulù traccia una sequenza sulle superfici di nodo.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #7AF3A0, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Node Override: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 284/310 — ability.node_override.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_node_override/v02_vfx.png

**Prompt canonico:** `ability.node_override.02.md`

<!-- 284/310 -->
# ability.node_override.02 — Node Override · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_node_override/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_node_override/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Node Override, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: tre glifi geometrici originali sul nodo. Colore unico della mossa: #7AF3A0 (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Tre glifi geometrici originali su porta già attiva.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #7AF3A0, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Node Override: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 285/310 — ability.node_override.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_node_override/v03_vfx.png

**Prompt canonico:** `ability.node_override.03.md`

<!-- 285/310 -->
# ability.node_override.03 — Node Override · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_node_override/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_node_override/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Node Override, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: tre glifi geometrici originali sul nodo. Colore unico della mossa: #7AF3A0 (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Feedback apertura negata o concessa coerente con stato.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #7AF3A0, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Node Override: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 286/310 — ability.node_override.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_node_override/v04_vfx.png

**Prompt canonico:** `ability.node_override.04.md`

<!-- 286/310 -->
# ability.node_override.04 — Node Override · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_node_override/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_node_override/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Node Override, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: tre glifi geometrici originali sul nodo. Colore unico della mossa: #7AF3A0 (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Interfaccia si chiude e non lascia falsa interazione.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #7AF3A0, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Node Override: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 287/310 — ability.null_driver.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_null_driver/v01_vfx.png

**Prompt canonico:** `ability.null_driver.01.md`

<!-- 287/310 -->
# ability.null_driver.01 — Null Driver · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_null_driver/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_null_driver/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Null Driver, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox (subito). Forma riconoscibile: segnali verticali di revoca sulle articolazioni. Colore unico della mossa: #FF2A4A (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Nox mostra irrigidimento da comando esterno, senza debolezza caricaturale.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FF2A4A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Null Driver: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 288/310 — ability.null_driver.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_null_driver/v02_vfx.png

**Prompt canonico:** `ability.null_driver.02.md`

<!-- 288/310 -->
# ability.null_driver.02 — Null Driver · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_null_driver/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_null_driver/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Null Driver, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox (subito). Forma riconoscibile: segnali verticali di revoca sulle articolazioni. Colore unico della mossa: #FF2A4A (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Segnali verticali di revoca controllo sulle articolazioni.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FF2A4A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Null Driver: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 289/310 — ability.null_driver.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_null_driver/v03_vfx.png

**Prompt canonico:** `ability.null_driver.03.md`

<!-- 289/310 -->
# ability.null_driver.03 — Null Driver · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_null_driver/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_null_driver/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Null Driver, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox (subito). Forma riconoscibile: segnali verticali di revoca sulle articolazioni. Colore unico della mossa: #FF2A4A (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Due stati chiaro/rotto che indicano se il comando è ancora valido.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FF2A4A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Null Driver: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 290/310 — ability.null_driver.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_null_driver/v04_vfx.png

**Prompt canonico:** `ability.null_driver.04.md`

<!-- 290/310 -->
# ability.null_driver.04 — Null Driver · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_null_driver/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_null_driver/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Null Driver, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox (subito). Forma riconoscibile: segnali verticali di revoca sulle articolazioni. Colore unico della mossa: #FF2A4A (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Ripresa motoria, luci di interfaccia si spengono.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FF2A4A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Null Driver: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 291/310 — ability.perfect_dodge.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_perfect_dodge/v01_vfx.png

**Prompt canonico:** `ability.perfect_dodge.01.md`

<!-- 291/310 -->
# ability.perfect_dodge.01 — Perfect Dodge · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_perfect_dodge/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_perfect_dodge/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Perfect Dodge, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: scia minimale bianca contornata ciano. Colore unico della mossa: #FFFFFF+#59E0FF (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Personaggio preme sul piede posteriore, posa breve.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFFFFF+#59E0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Perfect Dodge: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 292/310 — ability.perfect_dodge.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_perfect_dodge/v02_vfx.png

**Prompt canonico:** `ability.perfect_dodge.02.md`

<!-- 292/310 -->
# ability.perfect_dodge.02 — Perfect Dodge · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_perfect_dodge/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_perfect_dodge/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Perfect Dodge, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: scia minimale bianca contornata ciano. Colore unico della mossa: #FFFFFF+#59E0FF (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Scia minimale bianca contornata ciano, niente lungo slow-motion inventato.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFFFFF+#59E0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Perfect Dodge: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 293/310 — ability.perfect_dodge.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_perfect_dodge/v03_vfx.png

**Prompt canonico:** `ability.perfect_dodge.03.md`

<!-- 293/310 -->
# ability.perfect_dodge.03 — Perfect Dodge · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_perfect_dodge/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_perfect_dodge/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Perfect Dodge, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: scia minimale bianca contornata ciano. Colore unico della mossa: #FFFFFF+#59E0FF (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Una scintilla di precisione solo se evento di schiva perfetta confermato.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFFFFF+#59E0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Perfect Dodge: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 294/310 — ability.perfect_dodge.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_perfect_dodge/v04_vfx.png

**Prompt canonico:** `ability.perfect_dodge.04.md`

<!-- 294/310 -->
# ability.perfect_dodge.04 — Perfect Dodge · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_perfect_dodge/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_perfect_dodge/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Perfect Dodge, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: scia minimale bianca contornata ciano. Colore unico della mossa: #FFFFFF+#59E0FF (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Ritorno alla corsa, scia in 1–2 fotogrammi.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFFFFF+#59E0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Perfect Dodge: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 295/310 — ability.resonance_arc.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_resonance_arc/v01_vfx.png

**Prompt canonico:** `ability.resonance_arc.01.md`

<!-- 295/310 -->
# ability.resonance_arc.01 — Resonance Arc · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_resonance_arc/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_resonance_arc/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Resonance Arc, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: arco violetto a segmenti discontinui. Colore unico della mossa: #B070FF (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Lulù orienta mano a falce, anelli viola ravvicinati.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #B070FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Resonance Arc: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 296/310 — ability.resonance_arc.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_resonance_arc/v02_vfx.png

**Prompt canonico:** `ability.resonance_arc.02.md`

<!-- 296/310 -->
# ability.resonance_arc.02 — Resonance Arc · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_resonance_arc/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_resonance_arc/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Resonance Arc, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: arco violetto a segmenti discontinui. Colore unico della mossa: #B070FF (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Arco violetto a segmenti discontinui controllato verso bersagli.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #B070FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Resonance Arc: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 297/310 — ability.resonance_arc.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_resonance_arc/v03_vfx.png

**Prompt canonico:** `ability.resonance_arc.03.md`

<!-- 297/310 -->
# ability.resonance_arc.03 — Resonance Arc · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_resonance_arc/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_resonance_arc/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Resonance Arc, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: arco violetto a segmenti discontinui. Colore unico della mossa: #B070FF (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Piccoli cristalli di risonanza sugli hit reali.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #B070FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Resonance Arc: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 298/310 — ability.resonance_arc.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_resonance_arc/v04_vfx.png

**Prompt canonico:** `ability.resonance_arc.04.md`

<!-- 298/310 -->
# ability.resonance_arc.04 — Resonance Arc · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_resonance_arc/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_resonance_arc/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Resonance Arc, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: arco violetto a segmenti discontinui. Colore unico della mossa: #B070FF (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Arco si disgrega, posa resta leggibile.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #B070FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Resonance Arc: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 299/310 — ability.tag_actions.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_tag_actions/v01_vfx.png

**Prompt canonico:** `ability.tag_actions.01.md`

<!-- 299/310 -->
# ability.tag_actions.01 — Tag Actions · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_tag_actions/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_tag_actions/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Tag Actions, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: gesto di chiamata e intervento del partner. Colore unico della mossa: #FFD24A (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Protagonista attivo anticipa con gesto di chiamata.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFD24A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Tag Actions: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 300/310 — ability.tag_actions.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_tag_actions/v02_vfx.png

**Prompt canonico:** `ability.tag_actions.02.md`

<!-- 300/310 -->
# ability.tag_actions.02 — Tag Actions · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_tag_actions/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_tag_actions/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Tag Actions, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: gesto di chiamata e intervento del partner. Colore unico della mossa: #FFD24A (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Intervento partner in una sola direzione leggibile.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFD24A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Tag Actions: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 301/310 — ability.tag_actions.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_tag_actions/v03_vfx.png

**Prompt canonico:** `ability.tag_actions.03.md`

<!-- 301/310 -->
# ability.tag_actions.03 — Tag Actions · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_tag_actions/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_tag_actions/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Tag Actions, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: gesto di chiamata e intervento del partner. Colore unico della mossa: #FFD24A (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Passaggio d'impulso o colpo solo se condizione implementata.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFD24A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Tag Actions: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 302/310 — ability.tag_actions.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_tag_actions/v04_vfx.png

**Prompt canonico:** `ability.tag_actions.04.md`

<!-- 302/310 -->
# ability.tag_actions.04 — Tag Actions · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_tag_actions/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_tag_actions/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Tag Actions, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox e Lulù. Forma riconoscibile: gesto di chiamata e intervento del partner. Colore unico della mossa: #FFD24A (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Rientro di entrambi con ordine stabile di layer.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #FFD24A, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Tag Actions: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 303/310 — ability.tether.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_tether/v01_vfx.png

**Prompt canonico:** `ability.tether.01.md`

<!-- 303/310 -->
# ability.tether.01 — Tether · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_tether/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_tether/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Tether, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: cavo d’energia sottile teso fra palmo e nodo. Colore unico della mossa: #5AE0FF (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Lulù estende il palmo, cavo d'energia sottile verso il nodo.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #5AE0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Tether: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 304/310 — ability.tether.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_tether/v02_vfx.png

**Prompt canonico:** `ability.tether.02.md`

<!-- 304/310 -->
# ability.tether.02 — Tether · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_tether/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_tether/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Tether, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: cavo d’energia sottile teso fra palmo e nodo. Colore unico della mossa: #5AE0FF (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Linea tesa con due capi ben visibili, geometria stabile.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #5AE0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Tether: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 305/310 — ability.tether.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_tether/v03_vfx.png

**Prompt canonico:** `ability.tether.03.md`

<!-- 305/310 -->
# ability.tether.03 — Tether · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_tether/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_tether/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Tether, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: cavo d’energia sottile teso fra palmo e nodo. Colore unico della mossa: #5AE0FF (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Vibrazione sul filo solo a connessione valida.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #5AE0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Tether: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 306/310 — ability.tether.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_tether/v04_vfx.png

**Prompt canonico:** `ability.tether.04.md`

<!-- 306/310 -->
# ability.tether.04 — Tether · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_lulu.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_tether/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_tether/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Tether, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Lulù. Forma riconoscibile: cavo d’energia sottile teso fra palmo e nodo. Colore unico della mossa: #5AE0FF (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Ritiro del cavo senza collisione residua.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #5AE0FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Tether: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 307/310 — ability.weapon_counter.01

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_weapon_counter/v01_vfx.png

**Prompt canonico:** `ability.weapon_counter.01.md`

<!-- 307/310 -->
# ability.weapon_counter.01 — Weapon Counter · v01

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_weapon_counter/`, file: `v01_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_weapon_counter/v01.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Weapon Counter, fase 1 di 4: anticipazione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: deviazione metallica con linea d’urto laterale. Colore unico della mossa: #C8E8FF (nessun'altra mossa usa questa combinazione).
Fase 1 (anticipazione): Anticipazione: Solo Nox ruota guardia e arma davanti alla spalla.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #C8E8FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v01_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Weapon Counter: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 308/310 — ability.weapon_counter.02

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_weapon_counter/v02_vfx.png

**Prompt canonico:** `ability.weapon_counter.02.md`

<!-- 308/310 -->
# ability.weapon_counter.02 — Weapon Counter · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_weapon_counter/`, file: `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_weapon_counter/v02.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Weapon Counter, fase 2 di 4: esecuzione.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: deviazione metallica con linea d’urto laterale. Colore unico della mossa: #C8E8FF (nessun'altra mossa usa questa combinazione).
Fase 2 (esecuzione): Esecuzione: Breve deviazione metallica con linea d'urto laterale.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #C8E8FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v02_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Weapon Counter: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 309/310 — ability.weapon_counter.03

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_weapon_counter/v03_vfx.png

**Prompt canonico:** `ability.weapon_counter.03.md`

<!-- 309/310 -->
# ability.weapon_counter.03 — Weapon Counter · v03

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_weapon_counter/`, file: `v03_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_weapon_counter/v03.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Weapon Counter, fase 3 di 4: impatto e feedback.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: deviazione metallica con linea d’urto laterale. Colore unico della mossa: #C8E8FF (nessun'altra mossa usa questa combinazione).
Fase 3 (impatto e feedback): Impatto/feedback: Scintille più fredde sul contatto, danno solo a evento valido.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #C8E8FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v03_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Weapon Counter: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

---


---

## Prompt 310/310 — ability.weapon_counter.04

**Output attesi:** deliveries/gpt-preproduzione-310-20261029/ability/ability_weapon_counter/v04_vfx.png

**Prompt canonico:** `ability.weapon_counter.04.md`

<!-- 310/310 -->
# ability.weapon_counter.04 — Weapon Counter · v04

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_vfx.png`, `ref_nox.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/ability/ability_weapon_counter/`, file: `v04_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/ability/ability_weapon_counter/v04.png`

```
Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa Weapon Counter, fase 4 di 4: recupero.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di Nox. Forma riconoscibile: deviazione metallica con linea d’urto laterale. Colore unico della mossa: #C8E8FF (nessun'altra mossa usa questa combinazione).
Fase 4 (recupero): Recupero: Arma torna pronta, spalla scende.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore #C8E8FF, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
Effetti in pixel art HD come i VFX canonici (ref_vfx.png: vfx_c9, vfx_vx9, vfx_r12, fx_atlas): forme nette, 3-4 livelli di luminosità a gradini (nucleo quasi bianco, colore pieno, alone scuro), particelle a pixel, nessun bagliore sfocato o gradiente morbido.

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
v04_vfx.png: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa (Weapon Counter: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. Sfondo verde puro #00FF00 piatto in tutta l'immagine (il team lo toglie). Nessuna ombra a terra fuori dal soggetto, nessun alone verde sul soggetto, nessun colore del soggetto vicino al verde: le parti verdi richieste vanno in verde oliva scuro, smeraldo scuro o menta chiara #9FF7B8. Almeno 40 px di verde su ogni lato.

8. RESTRIZIONI
- non disegnare Nox, Lulù o nemici
- il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura
- nessuna aura persistente se la fase non la chiede
- nessun marchio, logo o testo leggibile reale; scritte e simboli solo inventati e illeggibili
- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali
- nessuna persona reale riconoscibile
- non inventare valori di gioco: niente numeri di danno, hitbox, raggi o tempi scritti nell'immagine
- niente tinta unita piatta, niente sfumature morbide da pittura digitale, niente stile 3D o fotografico
```

