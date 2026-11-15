# Richiesta a GPT 6.1 Terra — giro 2, armi con maschera (27 ottobre 2026)

Metodo approvato dall'autore (D14): Terra modifica solo dentro maschere disegnate dal team, il team ricompone e controlla.

| File | Contenuto |
|---|---|
| `PROMPT_TERRA.md` | Testo da incollare in Terra |
| `pacchetti/<sheet>/celle/` | 16 celle ingrandite ×3 su verde #00FF00, con la maschera di ciascuna |
| `pacchetti/<sheet>/<sheet>_zones.png` | Zone approvate sull'intero sheet (bianco = modificabile) |
| `pacchetti/<sheet>/<sheet>_zones_view.png` | Zone in magenta sopra lo sheet |
| `INDICE.json` | Byte e SHA-256 di ogni file |

Zone: `assets/source/weapon_masks/<sheet>.json` (poligoni per cella; viso e capelli esclusi), generate con `tools/make_terra_weapon_masks.py`.

Ritorno di Terra: `<sheet>_r<riga>c<colonna>_edit.png` per cella. Composizione: `tools/compose_terra_weapon_edits.py <zone.json> <cartella edit> <sheet nuovo.png>` (riduzione Lanczos, verde rimosso, `out = zona ? edit : riferimento`). Controllo: `tools/verify_terra_weapon_sheet.py <riferimento> <sheet nuovo> <sheet nuovo>_mask.png <rapporto> --zones=<sheet>_zones.png`.

| Sheet di partenza | Sheet prodotto | Arma |
|---|---|---|
| `nox_vx9_gun` | `nox_h17_gun` | H-17 «Needle» |
| `nox_vx9_reload` | `nox_h17_reload` | H-17 |
| `lulu_r12_gun` | `lulu_arc7_gun` | ARC-7 «Choir» |
| `lulu_r12_reload` | `lulu_arc7_reload` | ARC-7 |
