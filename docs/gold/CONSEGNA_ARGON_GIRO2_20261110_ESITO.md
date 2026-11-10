# Esito della consegna Argon — giro 2, lotto 1 (10 novembre 2026)

Ramo di consegna: `delivery/argon-asset-giro2-20261110` (HEAD `e776c13`, mai modificato).
Controllo fatto su Claude con occhi propri su tutte le 29 immagini (23 uniche) + i 10 `CONSEGNA.md`.

## Giudizio sul metodo nuovo (GIRO_2.md)

**[FATTO]** Il metodo funziona: tutte le immagini consegnate sono illustrazioni neurali vere, nessuna
figura geometrica tracciata da codice (fonte: ispezione visiva di tutte le immagini; hash in
`REGISTRO_ARGON_GIRO2_20261110.json`). Dove la quota del modello è finita, Argon ha saltato i file e
lo ha scritto nei `CONSEGNA.md`, senza segnaposto: esattamente ciò che il prompt chiedeva.
I «riusi» (gang_brute = nemico di prova, terreno_porto = terreno di prova) sono dichiarati nei
`CONSEGNA.md`, quindi onesti: contano una volta sola.

## Immagini accettate e integrate (9 derivati)

| Derivato | Origine | Uso |
|---|---|---|
| `race_solkara_convogli_day` | `S/strada_solkara_giorno.png` | tegola strada Solkara, giorno |
| `race_solkara_pozzo_day` | `S/strada_solkara_giorno_v2.png` | tegola strada Solkara, giorno |
| `race_solkara_reti_day` | `P/prova_strada_v2.png` | tegola-landmark all'ultimo checkpoint |
| `race_solkara_convogli_storm` | `S/strada_solkara_tempesta.png` | tegola Solkara, tempesta |
| `race_solkara_pozzo_storm` | `S/strada_solkara_tempesta_v2.png` | tegola Solkara, tempesta |
| `race_aurelia_campata_day` | `S/strada_aurelia_giorno.png` | tegola Aurelia Span, giorno |
| `race_aurelia_torri_day` | `S/strada_aurelia_giorno_v2.png` | tegola Aurelia Span, giorno |
| `race_aurelia_torri_dusk` | `S/strada_aurelia_tramonto_v2.png` | tegola del duello finale |
| `race_vortex_car` | `S/auto_vortex.png` | atlante dell'auto del giocatore (8 viste) |

Accettate e in attesa d'uso (si integrano quando il loro posto nel codice esiste):
`P/prova_nemico(.v2)` = `N/gang_brute_a(_v2)` (colosso con mazza a bobina, 2 fogli),
`N/gang_shooter_a(_v2)`, `N/gang_shooter_b(_v2)`, `N/gang_signal_a`, `N/gang_signal_b`,
`N/gang_breaker_a`, `P/prova_terreno(_v2)` = `T/terreno_porto(_v2)`.
I nemici si integrano quando ogni nemico ha il foglio d'azione **e** quello di reazione coerenti.

## Immagini scartate (2)

| File | Motivo |
|---|---|
| `N/gang_breaker_b.png` | scritta leggibile «CAUTION» sullo scudo in 2 pose (regola 9) **e** personaggio diverso dal suo foglio `_a` (soldato corazzato contro incappucciato): non può fare da foglio di reazione |
| `N/gang_signal_b_v2.png` | personaggio fuori stile rispetto a `gang_signal_a/b` (soldato verde militare contro segnalatore viola della gang): non è una variante dello stesso nemico |

## Limiti d'uso annotati

- `P/prova_strada.png` e `S/strada_aurelia_tramonto.png`: la carreggiata converge in prospettiva,
  quindi non diventano tegole di scorrimento. Restano buone come scene (menu, copertine) se serviranno.
- `S/strada_aurelia_giorno.png` ha il ponte con l'acqua turchese chiara: usata come variante «campata»
  accanto alle torri; il contrasto fra le due tegole dà i punti di riferimento del percorso.

## Cosa resta in coda ad Argon (quota esaurita, non scartato)

- **N**: breaker_a_v2, breaker_b (rifatto coerente con _a e senza scritte), signal_a_v2, brute_b(_v2), alieni, infetti, pattuglia del porto.
- **T**: terreni cantiere/clinica/nodo, palazzi 4 regioni, oggetti 4 set.
- **B**: 12 fogli boss. **V**: 16 espressioni. **G**: 12 fogli gesti. **F**: 6 fogli ambiente. **M**: 6 scene.
- **A (suoni)**: Argon dichiara di non avere un modello di generazione audio: il gruppo decade per lui;
  l'audio resta su questo tavolo (piano in `docs/gold/AUDIO_PLAN_V10_3.md`).

## Dove sono finiti i derivati

- Script: `tools/derive_argon_giro2_20261110.py` (strade 720×1440 WebP q84; atlante Vortex 1536×512
  celle 384×256 come `VEYRA_CAR`, fondo magenta rimosso con despill).
- Registro: `assets/production/v10.3/derived/REGISTRO_ARGON_GIRO2_20261110.json` (SHA-256 di grezzi e derivati).
- Prova nel browser: `tools/verify_race_roads_giro2.cjs` → `docs/evidence/v10.3/race-roads-giro2.json`
  e screenshot `race-roads-lab-*.png`.
