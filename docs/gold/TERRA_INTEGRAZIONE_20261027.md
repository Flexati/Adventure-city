# Integrazione Terra — giro 1 (27 ottobre 2026)

Consegna: ramo `delivery/terra-giro1-20261027`, commit `346e56b`. Byte e SHA-256 dei 17 file in `INDICE.json`: tutti corrispondono. Copia in `assets/production/v10.2/handoff/terra_giro1_20261027/` (master, export, script, provenienza, stato; lo ZIP duplicato non è conservato).

## Integrato

| Punto | File consegnati | In gioco | Controllo |
|---|---|---|---|
| G5b | `RACE_ashdocks_container_{ruggine,cobalto,verde}_{normale,colpito}.png` | `game/art/v10/race_container_{ruggine,cobalto,verde}[_hit].png` | `verify_terra_containers.py` PASS (riquadro esatto x 16–111, y 22–168). Verifica gare nel browser 390×844 e 844×390 PASS, con il caricamento dei quattro modelli. Prova: `docs/evidence/v10.2/terra-g5b-containers-390x844-strip.png` |

In gara ogni ostacolo ha sempre lo stesso modello, scelto dalla sua posizione nel percorso: attuale, ruggine, cobalto, verde, poi si ricomincia. Hitbox e posizioni non cambiano.

Note dal controllo:
- L'export porta il ritaglio dei master a 96×147 senza mantenere le proporzioni. L'allungamento orizzontale va da −1,4% a +4,4%: dichiarato nello script, non visibile alla scala di gioco.
- Il verde è vicino al container attuale, che è verde oliva. Si distinguono, ma è la coppia meno contrastata: da valutare nella revisione umana.

## G4 — strade di Ash Docks: integrato con composizione del team (ripresa, commit Terra `5b9105c`)

L'ambiente di esecuzione di Terra non partiva. Per sbloccare, Terra ha generato solo immagini e il team ha fatto composizione e controlli. Terra ha caricato in `deliveries/terra-giro1-20261027/master/` tre strade, tre mappe luci e un giunto. Terra stessa li dichiara tentativi, non master conformi: 887×1774 invece di almeno 1024×2048, oggetti che attraversano i bordi, giunto con due strisce, luci non allineate garantite. Byte e SHA-256 dei 19 file sono in `assets/production/v10.2/handoff/terra_giro1_20261027/INDICE_master_5b9105c.json`, la provenienza di Terra in `PROVENIENZA_master_5b9105c.json`. Le immagini restano sul ramo di consegna e non sono duplicate qui.

**Composizione (team, `tools/prepare_ashdocks_from_terra.py`).** Solo ricampionamento, nessun pixel ridipinto:
- Ogni fascia orizzontale (marciapiede, cordolo, carreggiata, cordolo, marciapiede), misurata sui tentativi, va sulla fascia del gioco: 0–117, 118–129, 130–589, 590–602, 603–719. La carreggiata cambia larghezza fra −4,8% e +5,5%.
- I marciapiedi si stringono in orizzontale: per 0,56 sulla banchina e fino a 0,67 sul deposito. In verticale la scala è 0,82: gli oggetti dei marciapiedi risultano più stretti del 18–32% rispetto al tentativo. A schermo si legge, ma va guardato nella revisione umana.
- Il giunto è la piastra inferiore del tentativo, ridimensionata a 720×48. La mappa luci del giunto è nera.
- Le mappe luci seguono la stessa trasformazione. Le luci cadono vicino ai lampioni (banchina quasi esatta, gru e deposito in prossimità), ma non sono allineate per costruzione.
- Gli oggetti tagliati dal bordo della tile ora passano sotto la piastra del giunto. Non sono chiusi con un paletto come chiedeva la richiesta: è la differenza dichiarata rispetto a G4.

**Controllo.** `tools/build_ashdocks_roads.py` dà PASS (cordoli a 130/590, nessuna segnaletica dipinta, luce ≤50%, trattini con ritmo esatto) e `--check` è PASS. Corpi composti in `handoff/terra_giro1_20261027/composti/`, rapporto in `docs/evidence/v10.2/ashdocks-roads-report.json`, anteprima in `docs/evidence/v10.2/terra-g4-roads-day-night.png`.

**In gioco.** Le sei tile `race_ashdocks_{banchina,gru,deposito}_{day,night}.png` sono nelle tre gare di Ash Docks, con sequenze fisse (`raceRoadTile` in `game/racing-v9.mjs`):
- La sfida di Veyra: banchina e deposito alternati, gru nella tile dell'ultimo checkpoint.
- Fra le gru: gru, poi banchina all'arrivo.
- Luci spente: banchina, gru, deposito di notte.

Solkara, Aurelia Span e la guida libera restano su `driving_road`. Corsie, ostacoli e hitbox non cambiano: le corsie del builder (222/314/406/498) separano gli stessi centri degli ostacoli (265/360/455). Ogni gara carica solo le sue tile; l'uscita le libera. La verifica gare nel browser è PASS a 390×844 e 844×390, compreso il caricamento delle tile (`docs/evidence/v10.2/hub-race-*-strip.png`). Peso: 11 MB di PNG in più nel pacchetto.

## Aperti

- **G6/G7 (armi):** in `master/` ci sono le viste isolate di H-17 e ARC-7, il caricatore, la cella e i due effetti (12 file, stessa provenienza). Il design varia un po' fra le viste. Un prototipo del team su una cella (Nox, lato) mostra che la composizione fatta solo con il codice non regge: per togliere la VX-9 bisogna separarla dal viso e dalla manica, e le mani vanno ridisegnate. Metodo approvato dall'autore e pronto: richiesta `requests/terra-giro2-armi-20261027/`. Il team ha disegnato le zone di modifica delle 64 celle (`assets/source/weapon_masks/*.json`: arma, mani, lampo e spazio per l'arma nuova; viso e capelli esclusi). Terra modifica le celle ingrandite solo dentro la maschera; il team ricompone (`tools/compose_terra_weapon_edits.py`) e controlla con `verify_terra_weapon_sheet.py --zones`, che verifica che le modifiche restino dentro le zone approvate. Questa regola sostituisce la stima della fascia della testa, che nelle viste di schiena cade sull'arma alzata. Prova a secco: composizione di una cella di prova, controllo PASS.

Nessun test di gioco umano, ascolto o approvazione artistica.
