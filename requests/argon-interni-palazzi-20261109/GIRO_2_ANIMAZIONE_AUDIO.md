# Richiesta ad Argon, secondo giro, parte 2: movimento e suono

10 novembre 2026 · decisione D53 · `COMMERCIAL_RELEASE = BLOCKED`

Leggi prima `GIRO_2.md`: il **testo della sezione 1 (metodo e stile) e le regole di pubblicazione valgono anche qui**. Stesso ramo, cartelle `deliveries/argon-asset-giro2-20261110/<gruppo>/`.

**Obiettivo dell'autore:** tutto il gioco deve muoversi e suonare in modo naturale, dall'apertura al menu, ai villaggi, alle persone, al combattimento. Niente scene ferme.

**Chi fa cosa.** Argon consegna i *materiali*: pose, espressioni, strisce di fotogrammi, immagini larghe, suoni. Il movimento lo costruisce Claude nel codice (tempi, casualità, parallasse, particelle, mix audio). Argon non scrive codice e non tocca i file del gioco.

## Ordine di lavoro

| Ordine | Gruppo | Cosa | File |
|---|---|---|---|
| 1 | V | Volti che vivono: espressioni dei ritratti | 16 immagini |
| 2 | G | Gesti delle persone dei villaggi | 12 immagini |
| 3 | F | Piccole animazioni d'ambiente | 6 immagini |
| 4 | M | Apertura e menu | 6 immagini |
| 5 | A | Suoni | 96 file audio |

Come nel primo file: **fai prima una prova** (un volto del gruppo V, una persona del gruppo G, tre suoni del gruppo A) e aspetta il via.

## Gruppo V: volti che vivono (16 immagini)

Per ognuno degli 8 ritratti entrati nel gioco, **due immagini** che ripetono lo stesso ritratto con un'espressione diversa. Allega il ritratto originale (`deliveries/argon-asset-20261109/I/<nome>.png` del primo giro) e chiedi una modifica dell'immagine, non una nuova generazione.

```
Edit the attached portrait. Keep EVERYTHING identical to the pixel where possible: same framing, same background,
same clothes, same hands, same light. Change ONLY the face as described. Output 768x1024, opaque.
```

| File | Cambia solo |
|---|---|
| `<nome>_occhi.png` | occhi chiusi, come a metà di un battito di ciglia |
| `<nome>_parla.png` | bocca socchiusa mentre parla, sopracciglia appena alzate |

Nomi: `moon_shop`, `cathedral_smith`, `cathedral_info`, `toxic_smith`, `clockwork_shop`, `clockwork_relic`, `clockwork_info`, `cathedral_gate_guard`. Per `cathedral_info` (volto coperto da mezza maschera) la seconda immagine mostra la testa appena inclinata invece della bocca.

## Gruppo G: gesti delle persone dei villaggi (12 immagini)

Oggi le persone dei villaggi hanno solo «fermo» e «cammina». Servono gesti del loro mestiere. Un'immagine per persona: 1536 × 1024, fondo magenta `#FF00FF`, **otto pose in due righe da quattro**, figure alte circa 300 px, ben separate, vista di tre quarti dall'alto come gli sprite di oggi. Allega il foglio di oggi (`game/art/chrono/<id>.png`) come riferimento d'identità: stesso personaggio, pose nuove.

Pose, sempre in quest'ordine: respira 1 · respira 2 (spalle un po' più alte) · gira la testa a sinistra · gira la testa verso chi guarda · gesto del mestiere 1 · gesto 2 · gesto 3 · saluta con la mano.

| File | Persona | Gesto del mestiere |
|---|---|---|
| `gesti_innkeeper.png` | locandiere | asciuga un boccale, lo alza alla luce, lo posa |
| `gesti_merchant.png` | commerciante | pesa la merce, conta sulle dita, porge un sacchetto |
| `gesti_blacksmith.png` | fabbro | alza il martello, batte (scintille), esamina il pezzo |
| `gesti_relic_priestess.png` | custode delle reliquie | solleva una lanterna, traccia un cerchio con la mano, china il capo |
| `gesti_alchemist.png` | alchimista | versa da una fiala, agita, annusa e si ritrae |
| `gesti_informant.png` | informatore | si guarda alle spalle, si china a sussurrare, incrocia le braccia |
| `gesti_gate_guard.png` | guardia della porta | sposta il peso, batte l'alabarda a terra, fa cenno di passare |
| `gesti_child.png` | bambino del rifugio | salta, indica qualcosa, si nasconde dietro le mani |
| `gesti_mechanic.png` | meccanica | stringe un bullone, si asciuga la fronte, alza il pollice |
| `gesti_elder.png` | anziano | si appoggia al bastone, annuisce, indica lontano |
| `gesti_worker.png` | operaio | solleva una cassa, la porta, la posa |
| `gesti_wanderer.png` | viandante incappucciato | si stringe nel mantello, guarda il cielo, si siede |

Se un foglio di riferimento non esiste con quel nome, usa la descrizione e scrivilo in `CONSEGNA.md`.

## Gruppo F: piccole animazioni d'ambiente (6 immagini)

Ogni immagine: 1536 × 1024, fondo magenta `#FF00FF`, **quattro oggetti in quattro righe, ognuno ripetuto in sei fotogrammi da sinistra a destra** che formano un ciclo continuo (l'ultimo torna al primo). Ogni fotogramma deve essere diverso dal precedente.

| File | Le quattro righe |
|---|---|
| `anim_fuoco.png` | fiamma di torcia · braciere · fuoco di forgia con scintille · candela |
| `anim_acqua.png` | gocciolio · riflesso su pozzanghera · getto di tubo rotto · bolle verdi tossiche |
| `anim_aria.png` | fumo di camino · vapore da una grata · polvere nel fascio di luce · foglie o carte mosse dal vento |
| `anim_luce.png` | lampione che sfarfalla · insegna luminosa senza scritte · cristallo viola che pulsa · lanterna che oscilla |
| `anim_meccanica.png` | ingranaggio che gira · pendolo · ventola · stantuffo |
| `anim_vita.png` | gatto che si lecca · topo che corre · uccello che becca e vola via · bandiera che sventola |

## Gruppo M: apertura e menu (6 immagini)

Immagini larghe e ricche su cui Claude muove la camera e aggiunge luci e particelle. 2048 × 1152, opache. **Lascia il terzo centrale-basso più calmo** (lì stanno titolo e pulsanti). Nox e Lulù non compaiono: al massimo due sagome lontane e scure, di spalle.

| File | Scena |
|---|---|
| `menu_citta.png` | la città di Vanta di notte vista da un tetto: torri al neon, il porto in lontananza, un grande orologio spezzato senza numeri nel cielo, pioggia leggera |
| `menu_citta_luci.png` | **la stessa identica immagine** (modifica, non nuova generazione) con solo le luci: finestre, neon e riflessi su fondo nero. Serve per far pulsare le luci |
| `apertura_1.png` | una strada della città all'alba, vuota, con una sola auto sportiva scura parcheggiata e due tazze su un muretto |
| `apertura_2.png` | il momento del Blackout: le luci della città si spengono a ondate, un fascio viola sale dal centro |
| `apertura_3.png` | un rifugio sotterraneo illuminato da lampade calde, gente seduta vista da lontano e di spalle |
| `apertura_4.png` | un ponte immenso al tramonto con l'auto sportiva che si allontana, piccola, verso la città |

## Gruppo A: suoni (96 file)

Solo se hai un **modello di generazione audio**. Se non lo hai, non consegnare nulla per questo gruppo e scrivilo.

```
Format for every file: OGG Vorbis, 44.1 kHz, quality 5. Effects in mono, ambiences and music in stereo.
Peak below -1 dBFS, no clipping, no silence longer than 30 ms at the start, clean tail with no click.
No spoken words in any language, no singing with lyrics, no recognisable melodies from existing works.
No samples from libraries, films, games or recordings: generated audio only.
In CONSEGNA.md write, for every file: the model that generated it, the prompt, the duration.
Variants must really differ (different performance), not the same file at another pitch.
```

| Cartella | File | Cosa | Durata |
|---|---|---|---|
| `passi/` | `passo_<superficie>_1..4.ogg` per `pietra`, `metallo`, `legno`, `acqua`, `sabbia`, `cemento` (24) | un solo passo ciascuno | 0,15–0,3 s |
| `voci/` | `voce_<tipo>_<umore>_1..2.ogg`; tipi `uomo`, `donna`, `anziano`, `bambino`; umori `saluto`, `pensa`, `ride`, `preoccupato` (32) | versi senza parole: «mh», risatina, sospiro, «oh» | 0,3–0,9 s |
| `villaggi/` | `<villaggio>_<n>.ogg`, 4 per `moon`, `cathedral`, `toxic`, `clockwork` (16) | suoni singoli d'ambiente: tazza posata, campana lontana, sfiato di tubo, ticchettio, risata lontana, porta | 0,5–3 s |
| `menu/` | `menu_tema.ogg`, `menu_strato_archi.ogg`, `menu_strato_pulsazione.ogg` (3) | tema del menu lento e notturno; i due strati sono lo stesso brano a tempo, con solo quello strumento, per aggiungerli e toglierli | 60–90 s, ciclo continuo |
| `interfaccia/` | `tocco_1..3`, `conferma_1..2`, `indietro_1..2`, `errore_1`, `pagina_1..2` (10) | suoni brevi e morbidi, da orologeria: scatti, molle, piccoli rintocchi | 0,05–0,4 s |
| `gare/` | `motore_basso.ogg`, `motore_alto.ogg`, `scheggia_1..4.ogg`, `fila_completa.ogg`, `ultimo_avviso.ogg`, `riparazione.ogg` (9) | due cicli di motore (basso e alto regime) da mescolare; note cristalline in scala ascendente per le schegge | motori 2–4 s in ciclo; gli altri 0,2–1 s |
| `combattimento/` | `fendente_1..2.ogg` (2) | sibili d'arma che taglia l'aria, senza impatto | 0,2–0,4 s |

## Cosa costruisce Claude con questi materiali

- **Volti:** battito di ciglia a intervalli casuali, bocca che si muove mentre scorre il testo, respiro leggero.
- **Persone dei villaggi:** gesti del mestiere a caso, testa che si gira verso il giocatore quando passa, saluto quando si avvicina.
- **Scene:** camera che scorre piano sulle immagini larghe, luci che pulsano, pioggia e polvere, interni con fiamme e vapore vivi.
- **Audio:** passi che seguono la superficie, varianti scelte a rotazione con piccole differenze di tono e volume, voci legate all'umore della frase, musica del menu a strati, motore che segue la velocità.
- **Sempre:** l'opzione «riduci movimento» ferma tutto ciò che non serve a giocare; ogni scena resta leggibile senza audio.
