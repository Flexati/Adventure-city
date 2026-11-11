# Stato della coda di generazione Argon (`STATO_CODA.md`)

Ultimo aggiornamento: 11 novembre 2026 (Giro 3 — arresto al raggiungimento del limite di quota del modello `models/gemini-4-argon`: `generic::resource_exhausted: You've reached your usage limit for this model`).

## Riepilogo sessione Giro 3

| Gruppo | Richieste | Consegnate | Saltate | Motivo delle saltate | Commit |
|---|---:|---:|---:|---|---|
| **R** (Rifacimento `gang_breaker_b`) | 1 | 1 | 0 | — | `5eabd01` |
| **U** (Interfaccia premium) | 8 | 8 | 0 | — | `09e39ba` |
| **N** (Nemici mancanti + riallineamento `gang_shooter_b` / `gang_breaker_b`) | 9 (+2 rifatti) | 11 | 0 | — | `d9da6bf` |
| **B** (Boss a 288 px) | 12 | 11 | 1 | Quota giornaliera modello immagini esaurita su `shadow_reaper_d.png` | `70c643c` |
| **T** (Terreno, palazzi, oggetti) | 11 | 11 | 0 | — | `b0c0891` |
| **C** (Schede dei quattro atti) | 4 | 4 | 0 | — | `b2fbd06` |
| **M** (Apertura e menu) | 6 | 0 | 6 | Quota giornaliera modello immagini esaurita | — |
| **V** (Volti che vivono) | 16 | 0 | 16 | Quota giornaliera modello immagini esaurita | — |
| **G** (Gesti delle persone dei villaggi) | 12 | 0 | 12 | Quota giornaliera modello immagini esaurita | — |
| **F** (Animazioni d'ambiente) | 6 | 0 | 6 | Quota giornaliera modello immagini esaurita | — |
| **A** (Suoni) | 104 | 0 | 104 | Assenza di modello di generazione audio nell'ambiente (vietato sintetizzare da codice) | `e776c13` |

---

## 1. File consegnati finora

### Già integrati / accettati nei giri 1 e 2
- **Interni (15)** e **Ritratti (8)** del Giro 1.
- **Gruppo P (6)**: `prova_nemico.png`, `prova_nemico_v2.png`, `prova_strada.png`, `prova_strada_v2.png`, `prova_terreno.png`, `prova_terreno_v2.png`.
- **Gruppo S (10)**: `strada_solkara_giorno.png` (+ `_v2`), `strada_solkara_tempesta.png` (+ `_v2`), `strada_aurelia_giorno.png` (+ `_v2`), `strada_aurelia_tramonto.png` (+ `_v2`), `auto_vortex.png` (+ `_v2`).
- **Gruppo N (Giro 2)**: `gang_shooter_a.png` (+ `_v2`), `gang_shooter_b_v2.png`, `gang_breaker_a.png`, `gang_signal_a.png`, `gang_signal_b.png`, `gang_brute_a.png` (+ `_v2`).
- **Gruppo T (Giro 2)**: `terreno_porto.png` (+ `_v2`).

### Consegnati nel Giro 3 (questa sessione: 46 PNG)
1. `R/gang_breaker_b.png` (e copiato anche in `N/gang_breaker_b.png`)
2. `U/ui_pulsanti.png`
3. `U/ui_pulsanti_tondi.png`
4. `U/ui_cornici.png`
5. `U/ui_icone_azione.png`
6. `U/ui_icone_menu.png`
7. `U/ui_hud.png`
8. `U/ui_medaglie.png`
9. `U/ui_emblema.png`
10. `N/gang_shooter_b.png` (riallineato allo stesso personaggio di `gang_shooter_a.png`)
11. `N/gang_brute_b.png`
12. `N/alien_breaker_a.png`
13. `N/alien_breaker_b.png`
14. `N/alien_brute_a.png`
15. `N/alien_brute_b.png`
16. `N/infected_brute_a.png`
17. `N/infected_brute_b.png`
18. `N/port_patrol_a.png`
19. `N/port_patrol_b.png`
20. `B/bone_tyrant_a.png`
21. `B/bone_tyrant_b.png`
22. `B/bone_tyrant_c.png`
23. `B/bone_tyrant_d.png`
24. `B/forge_behemoth_a.png`
25. `B/forge_behemoth_b.png`
26. `B/forge_behemoth_c.png`
27. `B/forge_behemoth_d.png`
28. `B/shadow_reaper_a.png`
29. `B/shadow_reaper_b.png`
30. `B/shadow_reaper_c.png`
31. `T/terreno_cantiere.png`
32. `T/terreno_clinica.png`
33. `T/terreno_nodo.png`
34. `T/palazzi_moon.png`
35. `T/palazzi_cathedral.png`
36. `T/palazzi_toxic.png`
37. `T/palazzi_clockwork.png`
38. `T/oggetti_cantiere.png`
39. `T/oggetti_porto.png`
40. `T/oggetti_clinica.png`
41. `T/oggetti_nodo.png`
42. `C/atto_1.png`
43. `C/atto_2.png`
44. `C/atto_3.png`
45. `C/atto_4.png`

---

## 2. File ancora mancanti, in ordine di ripresa per la prossima sessione

### Gruppo B (1 immagine rimanente)
1. `B/shadow_reaper_d.png` (1536×1024, fondo `#00FF00`, 4 pose: colpito, in ginocchio, caduta, a terra)

### Gruppo M — Apertura e menu (6 immagini)
2. `M/apertura_1_citta.png` (2048×1152, opaca)
3. `M/apertura_2_vortex.png` (2048×1152, opaca)
4. `M/apertura_3_breccia.png` (2048×1152, opaca)
5. `M/menu_sfondo_citta.png` (2048×1152, opaca)
6. `M/menu_primo_piano.png` (2048×1152, fondo `#FF00FF`)
7. `M/menu_elementi.png` (1536×1024, fondo `#FF00FF`)

### Gruppo V — Volti che vivono (16 immagini, 1024×1024)
8. `V/locanda_blink.png`
9. `V/locanda_talk.png`
10. `V/armaiolo_blink.png`
11. `V/armaiolo_talk.png`
12. `V/medico_blink.png`
13. `V/medico_talk.png`
14. `V/mercante_blink.png`
15. `V/mercante_talk.png`
16. `V/officina_blink.png`
17. `V/officina_talk.png`
18. `V/gilda_blink.png`
19. `V/gilda_talk.png`
20. `V/bacheca_blink.png`
21. `V/bacheca_talk.png`
22. `V/guardia_blink.png`
23. `V/guardia_talk.png`

### Gruppo G — Gesti delle persone dei villaggi (12 immagini, 1536×1024, fondo `#FF00FF`)
24. `G/moon_locandiera.png`
25. `G/moon_meccanico.png`
26. `G/moon_passante.png`
27. `G/cathedral_fabbro.png`
28. `G/cathedral_speziale.png`
29. `G/cathedral_pellegrino.png`
30. `G/toxic_tecnico.png`
31. `G/toxic_medico.png`
32. `G/toxic_raccoglitore.png`
33. `G/clockwork_orologiaio.png`
34. `G/clockwork_archivista.png`
35. `G/clockwork_pattuglia.png`

### Gruppo F — Animazioni d'ambiente (6 immagini, 1536×1024, fondo `#FF00FF`)
36. `F/fuoco_e_lanterne.png`
37. `F/fumo_e_vapore.png`
38. `F/elettricita_e_breccia.png`
39. `F/acqua_e_pioggia.png`
40. `F/ingranaggi_e_insegne.png`
41. `F/polvere_e_scintille.png`

### Gruppo A — Suoni (104 file OGG)
- Richiede un ambiente dotato di modello di generazione audio nativo (non disponibile in questo container).
