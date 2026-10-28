# Batch 2 — armi H-17 e ARC-7, 64 celle (28 ottobre 2026)

`COMMERCIAL_RELEASE = BLOCKED`.

## Audit di partenza

`delivery/terra-giro2-armi-20261027` @ `ae58d43`: Terra aveva consegnato 32 celle su 64 (Nox, `nox_vx9_gun` e `nox_vx9_reload`). Le celle di Lulù erano assenti.

## Cosa è stato fatto

| Passo | Dove | Commit |
|---|---|---|
| Strumento `tools/fit_arc7_cells.py` e correzioni per cella `assets/source/weapon_masks/arc7_fit.json` | work | `60d4ca9` |
| 16 celle `lulu_r12_gun` (formato Terra `_edit.png`) con `FIT_REPORT.json` | delivery armi | `8b522a9` |
| 16 celle `lulu_r12_reload` | delivery armi | `ba69ad9` |
| `STATO.md` 64/64, `controlli/` con i rapporti del team, `PROVENIENZA.json` (byte e SHA-256 per cella) | delivery armi | `5b48775` |
| Sheet candidati `game/art/v10/{nox_h17_gun,nox_h17_reload,lulu_arc7_gun,lulu_arc7_reload}.png` collegati all'arma equipaggiata | work | questo commit |

### Come sono fatte le celle Lulù

Ogni cella è disegnata a partire dalle viste ARC-7 che Terra ha consegnato nel giro 1 (`arc7_side`, `arc7_back`, `arc7_front`, `arc7_diag_back`, `arc7_cell`):
1. Dentro la zona approvata si misurano l'asse, la lunghezza e la volata della R-12.
2. Si posa sopra la vista della riga (ruotata e ridotta). Se la vista esce dalla zona, viene rimpicciolita, non tagliata.
3. Il metallo vecchio rimasto scoperto si riempie dai pixel vicini: trasparente dove c'era sfondo, giacca dove c'era il braccio.
4. Le mani originali tornano sopra.
5. Lampo e scintille magenta diventano viola, il colore della scarica ARC-7.

Nella ricarica la cella di energia `arc7_cell` sostituisce il caricatore.

Volto, capelli e vestiti di Lulù fuori dalle zone non cambiano: il verificatore lo misura.

## Controlli eseguiti

Gli strumenti del team sono stati usati così come sono:
- composizione: `compose_terra_weapon_edits.py`;
- verifica: `verify_terra_weapon_sheet.py --zones`.

I rapporti sono in `armi/*_report.json`.

| Sheet | Esito |
|---|---|
| `nox_vx9_gun` → H-17 | PASS |
| `nox_vx9_reload` → H-17 | PASS |
| `lulu_r12_gun` → ARC-7 | **FAIL** sulla cella 2,1: «feet at 334, reference 337» |
| `lulu_r12_reload` → ARC-7 | PASS |

**Il FAIL.** Il verificatore prende come linea dei piedi il punto più basso del componente principale della figura:
- nel riferimento il lampo R-12 tocca il corpo e scende fino alla riga 337;
- nella candidata il lampo viola si stacca dal corpo.

L'alfa delle righe 325–337 della cella è identico fra le due immagini, quindi i piedi non si sono spostati. Il verificatore **non** è stato modificato e il FAIL resta registrato: serve la decisione del team.

**Altri controlli:**
- `npm test`: 217/217. Il registro `reload-production.json` ora include `nox.h17.reload` e `lulu.arc7.reload`, con SHA-256 verificati dal test.
- Laboratorio di combattimento V9 (Chromium):
  - per Nox con H-17 e Lulù con ARC-7 si caricano gli 8 sheet armati (200);
  - nessun errore di pagina;
  - lo screenshot è `armi/combat_lab_h17_arc7.png`;
  - a quella scala la leggibilità dell'arma **non** è giudicabile.

## Integrazione

`visuals.GUN_ATLAS` e `RELOAD_ATLAS` scelgono lo sheet dell'arma attiva:
- VX-9 → `nox_vx9_*`, H-17 → `nox_h17_*`;
- R-12 → `lulu_r12_*`, ARC-7 → `lulu_arc7_*`.

`chrono-art.mjs` dà agli sheet H-17/ARC-7 la stessa impaginazione pulita di VX-9/R-12, perché sono composti sopra di essi. Anche le rotte Android sono aggiornate.

Nella campagna H-17 e ARC-7 si sbloccano solo con il componente di Vega, che non è ancora nel gioco. Per ora sono quindi visibili **solo nel laboratorio**. Hitbox, tempi, danni e ricariche non sono cambiati.

## Lacune

- **Revisione artistica umana di tutte le 64 celle.** In alcune celle l'ARC-7 risulta più dettagliata e più grande del personaggio. Le impugnature non sono ridisegnate a mano. Il ritaglio delle celle frontali della ricarica è stato corretto a mano in 4 celle.
- **La cella 2,1 di `lulu_r12_gun`** (FAIL tecnico): serve la decisione del team.
- **Nessun dispositivo Android e nessun playtest.**

## Prossimo batch

**Batch 3 — gara:**
1. Correggere la ricomposizione: chiave G−max(R,B) e riduzione per area al posto di Lanczos con soppressione globale del verde.
2. Misurare i 15 candidati GPT di Ash Docks contro le maschere e le misure di gioco, tenendo come ripiego i 34 disegni procedurali.
