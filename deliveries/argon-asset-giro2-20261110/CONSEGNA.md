
---

## Aggiornamento Giro 3 — Lotto 3 (2026-11-11 — Key Art AAA JaguarzCreatorz + Palazzi AAA + Audio Title Theme Rev 2 Senza Ronzio)

### 1. JaguarzCreatorz Studio Intro (`JAGUAR_INTRO/`)
- `JAGUAR_INTRO/jaguar_intro_keyart_16x9.png` (`1920×1080`, PNG24, SHA-256: `042134e69dda279167b6c56b2670e16e4b056f604960786ea51c7a97717227a0`): **[FATTO]** Key Art neurale AAA full-bleed edge-to-edge senza alcun riquadro/box visibile, giaguaro bianco-argento scultoreo emergente dalla tempesta blu notte (`#080A14`–`#121828`) con fulmini ciano-bianchi (`#4DEEEA`, `#E6F9FF`) fino ai 4 bordi del frame, 3 piani di profondità reali, zero testo dipinto nell'arte.
- `JAGUAR_INTRO/jaguar_intro_keyart_9x16.png` (`1080×1920`, PNG24, SHA-256: `941d42adf889e82ccd4a6e9e61b83d994eaffbbf882ce07e341cb105a7654190`): **[FATTO]** Versione verticale mobile 9:16 full-bleed derivata dal master neurale AAA, pronta per l'abbinamento con il layer trasparente `wordmark_layer_9x16.png`.

### 2. Upgrade AAA Edifici Distretti (`T/`)
- `T/palazzi_cathedral.png` (`1536×1024`, PNG24 su `#FF00FF`, SHA-256: `4968fd1fc28b7fe6d7e4c0c899231b96fb31c3ddaa47c25d3506411156db297f`): **[FATTO]** 4 edifici completi del Distretto Cattedrale (Cattedrale Gotica con rosone ambrato, Armeria/Forgia con incudine e braci, Biblioteca del Chiostro con tetto in rame patinato, Bastione con stendardi solari e bracieri) in griglia 2×2 pulita su `#FF00FF`, zero testo.
- `T/palazzi_toxic.png` (`1536×1024`, PNG24 su `#FF00FF`, SHA-256: `20ed5c5fef318fe8549acf5e29dbb2293e0fb4d36d8b03d7710189244dd42ef1`): **[FATTO]** 4 edifici completi degli Slum Alchemici Tossici (Distilleria Alchemica con vasche verde acido, Fonderia Tossica con manometri luminosi, Stazione di Pompaggio fognaria con ruota idraulica, Bottega dell'Apotecario con fiale) in griglia 2×2 pulita su `#FF00FF`, zero testo.

### 3. Fix Musica Iniziale Senza Ronzio (`A/title_theme.ogg` — Rev 2 D44)
- **Causa del ronzio identificata (`[FATTO]`)**: In `tools/compose_title_theme_v10_3.py` (righe 69–117), la Rev 1 sovrapponeva agli stem orchestrali `title.ogg` e `danger.ogg` due onde a dente di sega detunate (`saw(f0) + saw(f0+0.35 Hz)`) saturate con `np.tanh(mono * 1.8)` più un drone continuo a `36.7 Hz` e rumore bianco nei tick. L'equalizzatore master (`+3 dB a 1600 Hz`, `+1.5 dB a 4000 Hz`) enfatizzava le armoniche superiori del dente di sega generando un ronzio continuo ("ronzio della musica iniziale").
- **Soluzione applicata (`[FATTO]`)**: Eliminati completamente i generatori `saw()` detunati, il rumore bianco dei tick e il drone a `36.7 Hz`; sostituiti con fondazione armonica pura (fondamentale + 2ª e 3ª armonica morbida in stile violoncello/contrabbasso) e rintocco armonico cristallino a `1480/2960 Hz`.
- **Metriche EBU R128 verificate (`A/title_theme-metrics.json`)**:
  - `sha256` (`title_theme.ogg`): `5f6b6b88f7f31224cffb4edcdac762be4adf2fb87c8b0dc81434c087b6ada419`
  - `sha256` (`title_theme-master.flac`): `3518dda09e43082041c866eeb748f0d3a0f27b05677de976b5c6b5ad6daa1fe8`
  - `integrated_lufs`: `-15.1 LUFS` (target `-15.0 ± 1.0 LUFS`)
  - `true_peak_dbfs`: `-1.5 dBTP` (sotto il limite `-1.0 dBTP`)
  - `phone_band_lufs`: `-19.2 LUFS` (sopra il minimo `-19.5 LUFS`)
  - `loop_boundary_step`: `0.0018` (sotto il limite `0.02`, giunzione loop impercettibile)
  - `clipped_samples`: `0`
