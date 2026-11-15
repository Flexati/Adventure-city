# Batch 1 — auto dei rivali e immagine store (28 ottobre 2026)

Branch `work/chronos-adventure-commercial`. `COMMERCIAL_RELEASE = BLOCKED`.

## Cosa c'era già (audit)

Sul ramo `delivery/gpt-rigenerazione-92-20261028` (@ `efdd7fe`) GPT ha consegnato 23 delle 92 immagini:
- 15 per la gara;
- per il rivale 02, la base e i 5 stati;
- per il rivale 03, solo la base;
- `store_feature.png`.

Il suo `STATO.md` dichiara che misure, rimozione del verde e sheet erano ancora da fare. Questo batch fa quel lavoro e completa le 5 varianti mancanti del rivale 03.

## File prodotti

| File | Come | Esito |
|---|---|---|
| `assets/source/rival_cars/derived/rival03_{danno1,danno2,danno3,notte_a,notte_b}.png` | `tools/derive_rival03_states.py` modifica la base GPT (seme 20261028). Graffi, ammaccature, cofano piegato, vetro incrinato, vernice scrostata, fumo; fari viola, fanali rossi, luci laterali viola. | RGBA, sagoma della base invariata (vedi rapporto) |
| `game/art/v10/race_rival02_car.png` | `tools/compose_rival_cars.py`, layout di Veyra 1536×512 | PASS tecnico |
| `game/art/v10/race_rival03_car.png` | idem | PASS tecnico |
| `assets/source/store/store_feature_1024x500_notitle.png` | ritaglio (307,190)-(1536,790) e riduzione LANCZOS | ritaglio fatto, titolo NON aggiunto |

Le copie delle immagini GPT in `assets/source/rival_cars/gpt/` e `assets/source/store/store_feature_gpt.png` sono identiche byte per byte ai file della consegna (stesso SHA-256). Byte, SHA-256, misure, strumento e condizioni d'uso di ogni file stanno in `assets/source/rival_cars/PROVENIENZA.json` e in `assets/source/store/PROVENIENZA.json`.

## Controlli eseguiti (misure reali)

`assets/source/rival_cars/rival0{2,3}_report.json`:

| Auto | Carrozzeria | Δ box vs base | IoU minimo | Verde residuo | Buchi interni | Esito |
|---|---|---|---|---|---|---|
| 02 | 196 px | ≤ 2 px (danno3: −2 in alto) | 0.977 (danno3, fumo escluso) | 0 | 0 | PASS |
| 03 | 196 px | ≤ 2 px | 0.987 | 0 | 0 | PASS |

- Chiave del verde: `tools/gpt_chroma.py`. Lo sfondo GPT misura (18,242,17) e non #00FF00. La chiave usa G−max(R,B) (sfondo ≥ 226). La soppressione dell'alone agisce solo sul bordo, quindi la vernice petrolio e il fanalino verde del rivale 02 restano.
- Gli stati sono riportati con lo stesso fattore di scala e lo stesso spostamento della base. Per questo danno e notte sono registrati sulla base.
- Nel `danno3` del 02, il fumo di GPT supera di 5 px il bordo alto della cella. È sfumato sui primi 10 px della cella (`fade_top_px`, scritto nel rapporto) invece di essere tagliato di netto.
- In gioco: `node tools/verify_race_modes_browser.cjs` (Chromium, 390×844) risulta tutto PASS, con 0 errori pagina. Lo screenshot `batch01_race_elim_rival02_390x844.png` mostra il rivale 02 con il suo nuovo sheet nella gara a eliminazione.
- Test: `npm test`, 217/217. Sono nuovi il test sugli sheet dei rivali e quello sulla chiave del verde.

## Integrazione

- `game/visuals.mjs`: con `RACE_CAR_ART`, ogni rivale ha il proprio sheet con le stesse celle e gli stessi fotogrammi di Veyra (danno per integrità, notte A/B).
- `game/runtime.mjs` disegna i rivali da quello sheet.
- Il rivale 03 non usa più l'auto V5 vista di lato.
- Le rotte Android (`AssetRoutes.java`) ammettono i due nuovi file.
- Hitbox, tempi e fisica non sono cambiati.

## Non conformità registrate (non nascoste)

- **Rivale 03, proporzione.** La carrozzeria GPT è larga:alta = 0,55, non 4:5. In gioco l'auto è alta 196 px come le altre ma più stretta, larga circa 108 px contro i 140 di Veyra. La collisione non dipende dal disegno. Serve una decisione: tenerla, perché auto «leggera e affilata», oppure chiedere una nuova base.
- **Rivale 02.** Ha un fanalino laterale verde scuro (28,152,80), contro la regola 3 del prompt. Non è un colore di chiave e resta opaco.
- **Varianti del rivale 03.** Sono dipinte da codice, non da un illustratore. Sono più semplici dei danni GPT del rivale 02, e il fumo è a sbuffi grigi a gradini. Serve una revisione artistica umana.
- **Store.** Il terzo sinistro del ritaglio contiene la punta dell'alettone della Vortex. Il titolo non c'è ancora.

## Stato dei 92 (separato dalle 310 tavole)

Il conteggio aggiornato è in `AUDIT_V10_2.md`. Le auto e lo store sono 13 su 13: presenti e controllati, 12 stati integrati negli sheet, lo store ritagliato ma senza titolo.

## Prossimo batch

**Batch 2: le 32 celle Lulù ARC-7** (`lulu_r12_gun`, `lulu_r12_reload`), dipinte nelle maschere approvate. Va anche controllato lo stato delle 32 celle Nox già consegnate.
