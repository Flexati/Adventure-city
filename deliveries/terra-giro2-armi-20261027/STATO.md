# Stato

**28 ottobre 2026. Celle consegnate: 64/64.**

| Sheet | Celle | Chi | Controllo del team (`compose_terra_weapon_edits.py` + `verify_terra_weapon_sheet.py --zones`) |
|---|---|---|---|
| `nox_vx9_gun` (H-17) | 16/16 | Terra, GPT Immagine | PASS |
| `nox_vx9_reload` (H-17) | 16/16 | Terra, GPT Immagine | PASS |
| `lulu_r12_gun` (ARC-7) | 16/16 | Claude, `tools/fit_arc7_cells.py` dalle viste ARC-7 di Terra giro 1 | FAIL su 1 cella, vedi sotto |
| `lulu_r12_reload` (ARC-7) | 16/16 | Claude, idem | PASS |

I rapporti completi sono in `controlli/<sheet>_report.json`. Le misure di adattamento di ogni cella Lulù (asse, vista, lunghezza vecchia e nuova) sono in `<sheet>/FIT_REPORT.json`.

## Celle Lulù: come sono fatte

Terra non ha consegnato le celle Lulù. Le ha fatte Claude con codice, senza un nuovo generatore d'immagini. Per ogni cella:
- si misura nella zona approvata l'asse della vecchia R-12;
- su quell'asse si posa la vista ARC-7 di Terra (lato, schiena, fronte o diagonale; per il caricatore sciolto si usa `arc7_cell`), ridotta e ruotata;
- il metallo vecchio rimasto scoperto viene riempito dai pixel vicini;
- le mani originali tornano sopra l'impugnatura;
- lampo e scintille magenta diventano viola.

Fuori dalle zone non cambia nessun pixel: il verificatore lo conferma su tutte e 64 le celle. Correzioni manuali registrate in `assets/source/weapon_masks/arc7_fit.json` sul ramo di lavoro: 4 celle frontali della ricarica, dove l'arma è tenuta di traverso.

## FAIL registrato: `lulu_r12_gun` cella 2,1 (fronte, sparo)

Il controllo «linea dei piedi» misura il componente principale della figura:
- nel riferimento il lampo R-12 tocca il corpo e arriva alla riga 337;
- nella candidata il lampo viola è staccato dal corpo, quindi il componente principale finisce ai piedi, riga 334.

I valori alfa delle righe 325–337 della cella sono identici fra riferimento e candidata, quindi i piedi non si sono mossi. Il FAIL resta comunque scritto così com'è: il verificatore non è stato modificato. Il team decide se accettare la cella o tenere quella vecchia.

## Non fatto / da rivedere

- **Revisione artistica umana di tutte le 64 celle.** Le ARC-7 sono incollate da viste ad alta risoluzione: in alcune celle l'arma è più grande e più dettagliata del personaggio. Le impugnature non sono ridisegnate a mano.
- **Integrazione in gioco.** H-17 e ARC-7 si sbloccano solo con il componente di Vega, che non è ancora nel gioco. Gli sheet composti sono candidati.
- **Nessun dispositivo Android, nessun playtest, nessuna approvazione dichiarata.**
