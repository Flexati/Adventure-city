# enemy.prism.02 — Prism · v02

Stato: **PROMPT_READY** · nessuna immagine generata · CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore) · `COMMERCIAL_RELEASE = BLOCKED`

Produzione: GPT Immagine, poi controllo del team

**Allegati da caricare in GPT** (cartella `riferimenti/`): `ref_nemici.png`

**Consegna**: ramo `delivery/gpt-preproduzione-310-20261029`, cartella `deliveries/gpt-preproduzione-310-20261029/enemy/enemy_prism/`, file: `v02.png`, `v02_vfx.png`

Master atteso nel registro dopo i controlli: `assets/preproduction/v10.2/variants/enemy/enemy_prism/v02.png`

```
Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna lo sprite sheet del nemico Prism, variante territoriale.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Famiglia Custodian; ruolo in combattimento: rifrange, contrastato dalla mobilità. Nemico futuro: concept di preproduzione, nessun valore di gioco.
Variante territoriale: Custodian: superfici traslucide azzurre, una direzione di rifrazione.

2. SOGGETTO, MATERIALI E COLORI
- Corpo e silhouette: scafo sfaccettato con emettitore orientabile.
- Movimento: gira su se stesso a scatti.
- Colore dell'avviso d'attacco e degli effetti: #9AE8FF (unico per questo nemico).
- Materiali vissuti coerenti con la famiglia Custodian; la silhouette deve distinguersi dalle altre classi anche in nero pieno, non solo per tinta.

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
- Gli effetti B usano solo il colore #9AE8FF con nucleo chiaro.

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
