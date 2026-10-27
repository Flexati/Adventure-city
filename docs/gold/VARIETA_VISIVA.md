# Varietà visiva — piano

Indicazione dell'autore: nessuna perdita di varietà visiva, più varianti per armi, strade e il resto. Il piano segue tre regole, quelle dei grandi giochi d'azione:

1. **La varietà non cambia il gioco.** Hitbox, tempi e posizioni restano quelli del modello. Una variante cambia l'aspetto, mai il punto dove si colpisce o ci si scontra (contratti verificati dagli strumenti in `tools/verify_terra_*.py`).
2. **La varietà si ricorda.** Le varianti si alternano in sequenze fisse per gara o luogo, non a caso a ogni partita: il giocatore impara il percorso dai riferimenti (la banchina prima del secondo checkpoint, le gru nel tratto stretto).
3. **I protagonisti non si ridisegnano.** Le varianti di personaggi e armi si compongono dentro una maschera sopra lo sheet in gioco; fuori dalla maschera i pixel sono identici.

## Stato e giri

| Famiglia | Oggi in gioco | Giro | Varianti |
|---|---|---|---|
| Armi impugnate | C-9 base, VX-9, R-12 con tiro e ricarica; H-17 e ARC-7 usano lo sheet C-9 senza ricarica | Terra 1 (G6/G7) | H-17 e ARC-7 con tiro e ricarica propri: ogni arma ha la sua silhouette |
| Strade di Ash Docks | `driving_road` unica per tre gare | Terra 1 (G4) | Banchina, gru, deposito; giorno e notte (mappe luci); giunto comune |
| Container in gara | **Quattro modelli in due stati (Terra 1, integrato)** | Fatto | Attuale, ruggine, cobalto, verde, assegnati per posizione nel percorso |
| Auto dei rivali | Riuso dell'atlante V5 (D06) | Terra 2 | Un'auto per rivale, nello stile dell'auto di Veyra |
| Nemici delle quattro famiglie | Un aspetto per famiglia (sheet puliti D13) | Terra 2 | Varianti per distretto con accessori e colori dentro maschera; varianti «élite» riconoscibili a colpo d'occhio |
| Oggetti dei distretti | `district_props` unico | Censimento, poi Terra 3 | Da definire dopo il censimento di cosa si ripete di più sullo schermo |
| Strade di Solkara e Aurelia Span | Regioni non ancora nel gioco | Quando le regioni esistono | Stesso metodo del giunto comune |

## Uso delle varianti di Ash Docks (dopo la consegna)

- **Ash Docks · La sfida di Veyra:** banchina e deposito alternati, gru prima dell'ultimo checkpoint.
- **Ash Docks · Fra le gru:** gru per la maggior parte del percorso, banchina all'arrivo.
- **Ash Docks · Luci spente:** tutte e tre, di notte.
- **Container:** il modello dipende dalla posizione dell'ostacolo nel percorso, così ogni ostacolo ha sempre lo stesso aspetto.

Le sequenze esatte si fissano all'integrazione, provando la leggibilità a 390×844 e 844×390.
