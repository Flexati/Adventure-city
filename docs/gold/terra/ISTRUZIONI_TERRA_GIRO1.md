# Istruzioni per GPT 6.1 Terra — giro 1

Repository `Flexati/Adventure-city`, ramo di riferimento `work/chronos-adventure-commercial`. Materiale: `requests/terra-giro1-20261027/` (misure, archivio con riferimenti e strumenti). Storia dei giri precedenti con Astra: `docs/gold/ASTRA_INTEGRAZIONE_20261027.md`.

## Cosa cambia rispetto ai giri con Astra

1. **Gli sheet in gioco sono stati puliti (D13).** Le pose non sconfinano più dalla cella, ogni cella ha un bordo vuoto di 1 px. Formati e celle nuovi sono in `MISURE.json`: le misure dei giri precedenti (1305×1205, piedi 299/300…) non valgono più.
2. **Le armi si cambiano dentro una maschera, non si ridisegna il personaggio.** Il generatore di immagini ridisegna tutto il quadro, quindi Nox e Lulù cambiano (giro 3: 1.865 pixel su 2.000 della testa diversi). Si lavora così: arma nuova generata a parte, poi composizione tecnica sopra il riferimento, toccando solo i pixel dichiarati nella maschera.
3. **La notte delle strade è una mappa di luci.** Terra non ridipinge la strada di notte: consegna la luce (lampioni, riflessi, finestre). Il gioco ricava la notte dal giorno, quindi la geometria è identica per costruzione.
4. **Il controllo lo fai tu prima di consegnare.** Nell'archivio ci sono gli stessi strumenti che uso io. Si consegna solo con PASS.

## Kit

`archivi/CHRONOS_TERRA_GIRO1_KIT.zip` è un mini-repository: si estrae, si entra nella cartella `kit/` e si lanciano i comandi da lì (Python 3 con numpy e Pillow).

```
kit/game/art/v10/          riferimenti in gioco (sheet armi puliti, ricariche, container)
kit/game/sheet-layout.mjs  celle degli sheet puliti (letto dal controllo)
kit/tools/                 verify_terra_weapon_sheet.py, build_ashdocks_roads.py, verify_terra_containers.py, lib/
kit/riferimenti/           icone H-17 e ARC-7, ricarica ARC-7 conservata (solo design), strada attuale, strada respinta (solo materiali e colori), prova della giunzione respinta
```

## 1. G6/G7 — quattro sheet delle armi

| File da consegnare | Riferimento (si parte da questo) | Formato | Celle |
|---|---|---|---|
| `nox_h17_gun.png` | `game/art/v10/nox_vx9_gun.png` | 1676×1348 | 4×4 da 419×337 |
| `nox_h17_reload.png` | `game/art/v10/nox_vx9_reload.png` | 1305×1285 | 4×4 da 326,25×321,25 (bordi arrotondati per eccesso da ,5) |
| `lulu_arc7_gun.png` | `game/art/v10/lulu_r12_gun.png` | 1508×1392 | 4×4 da 377×348 |
| `lulu_arc7_reload.png` | `game/art/v10/lulu_r12_reload.png` | 1305×1285 | come sopra |

Per ognuno anche la maschera, stesso formato: `<nome>_mask.png`, bianco opaco = pixel toccati, nero o trasparente = pixel del riferimento.

La ricarica ARC-7 conservata dal giro precedente era ridisegnata e più piccola (0,906×, piedi a 304 invece di 319): resta solo come riferimento di design e si rifà con questo metodo.

**Le armi.** Seguono le icone nel kit.
- **H-17 «Needle» (Nox):** fucile di precisione a lungo raggio, bianco e nero con celle azzurre e mirino; 4 colpi, ricarica 1,8 s, perfora due bersagli. Lampo stretto e lungo come un ago.
- **ARC-7 «Choir» (Lulù):** emettitore ad arco nero e viola con tre anelli e antenna; 8 colpi, ricarica 1,5 s, concatena tre bersagli e li stordisce. In bocca all'arma solo una scarica breve: la catena tra i bersagli la disegna il gioco.

**Le pose restano quelle del riferimento**, cella per cella. Righe: lato, schiena, fronte, diagonale-schiena. Colonne del tiro: anticipo, rilascio (lampo), rinculo, recupero. Colonne della ricarica: abbassa, estrai, inserisci, pronta.

**Procedura.**
1. Copia il riferimento.
2. Per ogni cella genera a parte arma, mani ed effetto, alla stessa densità di pixel dell'arma che sostituisci. Poi riducili con Pillow alla misura giusta.
3. Componi sulla copia: cancella l'arma vecchia, incolla quella nuova. Dove sotto l'arma vecchia manca il corpo (un pezzo di braccio o di giacca), completalo dentro la maschera nello stesso stile.
4. Salva la maschera di tutti i pixel toccati, poi applica `out = maschera ? nuovo : riferimento` (per esempio con `numpy.where`). Fuori dalla maschera i pixel devono restare identici byte per byte.
5. Controlla:
   `python3 -I tools/verify_terra_weapon_sheet.py game/art/v10/nox_vx9_gun.png <cartella>/nox_h17_gun.png <cartella>/nox_h17_gun_mask.png <cartella>/nox_h17_gun_report.json`
   Serve **PASS**. Lo strumento scrive anche `<report>.mask.png` (maschera in magenta sul riferimento): guardala e consegnala.

**Regole controllate dallo strumento.**
- Stesso formato del riferimento.
- Fuori dalla maschera, ogni valore RGBA è identico.
- Maschera e contenuto restano nella cella e non toccano il bordo di 1 px.
- In ogni cella la maschera copre al massimo il 40% della figura e il 60% della fascia della testa. Nella vista di schiena l'arma sta sopra la testa, per questo il 60%.
- La linea dei piedi è quella del riferimento (±2 px).

Nox è maschile, Lulù è la protagonista femminile: volto, capelli e vestiti non cambiano.

## 2. G4 — Ash Docks: tre strade, giorno e luci di notte

Il gioco compone ogni tile così: metà inferiore del giunto, corpo strada, metà superiore del giunto (720×1440). Tutte le varianti condividono lo stesso giunto, quindi qualunque variante può seguire qualunque altra senza raccordi da ridipingere. La segnaletica la disegna lo strumento, per ultima: trattini da 43 px ogni 144 px a x 222/314/406/498, ritmo esatto da una tile all'altra.

| File | Formato | Contenuto |
|---|---|---|
| `ASHDOCKS_road_banchina_body.png` | 720×1392 | Banchina: bitte, catene, acqua del porto oltre la ringhiera |
| `ASHDOCKS_road_gru_body.png` | 720×1392 | Binari e basi delle gru a portale lungo i marciapiedi |
| `ASHDOCKS_road_deposito_body.png` | 720×1392 | Pile di container e recinzioni oltre i marciapiedi |
| `ASHDOCKS_road_<variante>_light.png` | 720×1392 | Mappa luci notturna di quella variante |
| `ASHDOCKS_joint.png` | 720×48 | Giunto di dilatazione in acciaio su tutta la larghezza |
| `ASHDOCKS_joint_light.png` | 720×48 | Mappa luci del giunto (anche tutta nera) |

**Geometria, uguale per tutte.** Le misure sono in `MISURE.json`.
- Marciapiedi: x 0–117 e 603–719.
- Cordoli chiari: x 118–129 e 590–602.
- Carreggiata in asfalto scuro: x 130–589, cinque corsie.
- **Nessuna segnaletica orizzontale.**
- Il corpo è opaco. Nessun oggetto attraversa il bordo alto o basso del corpo: ringhiere e recinzioni finiscono con un paletto a 4–8 px dal bordo, perché lì inizia il giunto.
- Vista dall'alto 3/4 come le gare attuali, luce dall'alto a sinistra.

**Giunto.** Piastra d'acciaio con bulloni e bordi diritti alla riga 0 e alla riga 47, su carreggiata e marciapiedi.

**Mappa luci.** È nera o trasparente dove non c'è luce. Contiene pozze calde dei lampioni, luci rosse delle gru, finestre, riflessi sull'asfalto bagnato. Al massimo il 50% della tile è illuminato. Non ridipinge la strada: il gioco la somma al giorno scurito (×0,30 / 0,36 / 0,50).

**Controllo e anteprime.**
`python3 -I tools/build_ashdocks_roads.py <cartella> --out=<cartella>/anteprima`
Serve **PASS**. Le sei tile giorno e notte compaiono in `anteprima/`, con il rapporto (posizione e lunghezza dei trattini, giunzione). Consegna anche le anteprime.

## 3. G5b — container: tre varianti

`RACE_ashdocks_container_<variante>_{normale,colpito}.png`, varianti `ruggine`, `cobalto`, `verde`.
- 128×192, stessa vista di `game/art/v10/race_container.png`.
- Riquadro opaco x 16–111, y 22–168 (±2), base a y 168, 8 px vuoti sul bordo: è dove il gioco calcola l'urto.
- «Colpito»: ammaccatura e vernice graffiata dentro lo stesso riquadro.
- Marchi e scritte inventati: nessuna azienda reale.

Controllo: `python3 -I tools/verify_terra_containers.py <cartella>`. Serve **PASS**.

## Non produrre

Cavo e terminale di The Anchor, «Due colpi» (A1), cancelli di Aurelia Span, Veyra a piedi, e qualunque asset già integrato.

## Consegna

- Ramo `delivery/terra-giro1-20261027` di `Flexati/Adventure-city`, cartella `deliveries/terra-giro1-20261027/`.
- ZIP sotto i 20.000.000 byte ciascuno.
- `INDICE.json` con byte e SHA-256 di ogni file e archivio.
- `PROVENIENZA.json` con strumento, origine e condizioni d'uso reali per ogni file.
- Master e generazioni intermedie inclusi, rapporti e anteprime degli strumenti.
- Si consegna un punto solo con PASS. Se un punto non riesce, consegna gli altri e spiega in `STATO.md` cosa blocca, con le misure: niente compromessi non dichiarati.
- Non dichiarare ascolti, approvazioni artistiche o test di gioco non fatti.
