# STATO DELLA CODA — Consegna `argon-design-aaa-20261117` (Decisione D84)

- **Repository**: `https://github.com/Flexati/Adventure-city`
- **Ramo di partenza**: `work/chronos-adventure-commercial` (commit `a3a80f2b7e3cd6ae93b25fbfaf2c2351f92d5c8c`, discendente di `bfab467`)
- **Ramo di consegna**: `delivery/argon-design-aaa-20261117`
- **Cartella di consegna**: `deliveries/argon-design-aaa-20261117/`
- **Strumenti verificati e utilizzati**:
  - Generatore d'immagini raster per lotti I1 e I2 (diritti d'uso commerciale completi)
  - Sintetizzatore polifonico DSP in Python 3 (`numpy 2.2.6`, `scipy 1.15.3`) per composizione e rendering a 48 kHz 24 bit stereo del lotto M1 (diritti d'uso commerciale completi, 100 % originale)
  - `ffmpeg 4.4.2` con filtri `ebur128=peak=true`, `astats=metadata=0` e codec `libopus` / `pcm_s24le`
  - Python 3 con `Pillow 12.3.0` per pulizia sfondi, alfa binaria, mappatura palette A0 e misurazione dei 10 controlli

## Quadro sinottico dei lotti (consegnati + saltati + mancanti = totale previsto)

| Lotto | Descrizione | Previsti | Consegnati | Saltati | Mancanti | Somma |
|---|---|---:|---:|---:|---:|---:|
| **A0** | Palette di distretto e villaggio (`.json`) | 26 | 26 | 0 | 0 | 26 |
| **I1** | Interni 1920×1080 PNG + 1280×720 WebP + report + scheda | 45 | 45 | 0 | 0 | 45 |
| **I2** | Ritratti personaggi interni 1200×1600 PNG + derivato + report + scheda | 45 | 6 | 1 | 38 | 45 |
| **A1** | Boss (5 boss × 11 immagini a 288 px) | 55 | 0 | 0 | 55 | 55 |
| **A2** | Nemici (3 nemici: `identita` + stati del manifest) | 18 | 0 | 0 | 18 | 18 |
| **A3** | Effetti (14 strisce a 4 pose) | 14 | 0 | 0 | 14 | 14 |
| **A4** | Kit interfaccia «vetro color notte» (1 cornice + 16 icone) | 17 | 0 | 0 | 17 | 17 |
| **M1** | Colonna sonora originale (15 brani: WAV + OGG + metrics + scheda) | 15 | 15 | 0 | 0 | 15 |

---

## 1. CONSEGNATI (in ordine di lotto)

### Lotto A0 — 26 palette su 26
- `A0_palette/cantiere_est.json` (Cantiere Est)
- `A0_palette/porto_delle_antenne.json` (Porto delle Antenne)
- `A0_palette/distretto_clinico.json` (Distretto Clinico)
- `A0_palette/nodo_centrale.json` (Nodo Centrale)
- `A0_palette/porto.json` (Porto)
- `A0_palette/livelli_bassi.json` (Livelli bassi)
- `A0_palette/sotto_il_distretto_clinico.json` (Sotto il Distretto Clinico)
- `A0_palette/asse_orbitale.json` (Asse orbitale)
- `A0_palette/piattaforma_dell_asse.json` (Piattaforma dell’asse)
- `A0_palette/ash_docks.json` (Ash Docks)
- `A0_palette/cathedral_quarter.json` (Cathedral Quarter)
- `A0_palette/toxic_slum_bazaar.json` (Toxic Slum Bazaar)
- `A0_palette/glass_flood.json` (Glass Flood)
- `A0_palette/binario_sopraelevato.json` (Binario sopraelevato)
- `A0_palette/moon_refuge.json` (Moon Refuge)
- `A0_palette/clockwork_outpost.json` (Clockwork Outpost)
- `A0_palette/banchina_di_cenere.json` (Banchina di Cenere)
- `A0_palette/borgo_delle_antenne.json` (Borgo delle Antenne)
- `A0_palette/chiostro_clinico.json` (Chiostro Clinico)
- `A0_palette/anello_del_nodo.json` (Anello del Nodo)
- `A0_palette/molo_dei_segni.json` (Molo dei Segni)
- `A0_palette/focolare_basso.json` (Focolare Basso)
- `A0_palette/terrazze_di_vetro.json` (Terrazze di Vetro)
- `A0_palette/scalo_sopraelevato.json` (Scalo Sopraelevato)
- `A0_palette/volta_delle_spore.json` (Volta delle Spore)
- `A0_palette/atrio_della_corona.json` (Atrio della Corona)

### Lotto I1 — 45 interni su 45 (grezzo PNG 1920×1080 + derivato WebP 1280×720 + `.report.json` + scheda JSON)
- `I1_interni/grezzo/moon_inn.png` · `I1_interni/derivato/moon_inn.webp` · `I1_interni/derivato/moon_inn.report.json` · `I1_interni/schede/moon_inn.json` (Moon Refuge — Locanda della Luna)
- `I1_interni/grezzo/moon_smith.png` · `I1_interni/derivato/moon_smith.webp` · `I1_interni/derivato/moon_smith.report.json` · `I1_interni/schede/moon_smith.json` (Moon Refuge — Officina di Dario)
- `I1_interni/grezzo/moon_shop.png` · `I1_interni/derivato/moon_shop.webp` · `I1_interni/derivato/moon_shop.report.json` · `I1_interni/schede/moon_shop.json` (Moon Refuge — Banco del rifugio)
- `I1_interni/grezzo/cathedral_smith.png` · `I1_interni/derivato/cathedral_smith.webp` · `I1_interni/derivato/cathedral_smith.report.json` · `I1_interni/schede/cathedral_smith.json` (Cathedral Quarter — Forgia del Chiostro)
- `I1_interni/grezzo/cathedral_relic.png` · `I1_interni/derivato/cathedral_relic.webp` · `I1_interni/derivato/cathedral_relic.report.json` · `I1_interni/schede/cathedral_relic.json` (Cathedral Quarter — Sacrestia delle reliquie)
- `I1_interni/grezzo/cathedral_shop.png` · `I1_interni/derivato/cathedral_shop.webp` · `I1_interni/derivato/cathedral_shop.report.json` · `I1_interni/schede/cathedral_shop.json` (Cathedral Quarter — Mercato coperto)
- `I1_interni/grezzo/cathedral_info.png` · `I1_interni/derivato/cathedral_info.webp` · `I1_interni/derivato/cathedral_info.report.json` · `I1_interni/schede/cathedral_info.json` (Cathedral Quarter — Stanza delle voci)
- `I1_interni/grezzo/toxic_smith.png` · `I1_interni/derivato/toxic_smith.webp` · `I1_interni/derivato/toxic_smith.report.json` · `I1_interni/schede/toxic_smith.json` (Toxic Slum Bazaar — Officina dei tubi)
- `I1_interni/grezzo/toxic_alchemist.png` · `I1_interni/derivato/toxic_alchemist.webp` · `I1_interni/derivato/toxic_alchemist.report.json` · `I1_interni/schede/toxic_alchemist.json` (Toxic Slum Bazaar — Laboratorio dell’alchimista)
- `I1_interni/grezzo/toxic_shop.png` · `I1_interni/derivato/toxic_shop.webp` · `I1_interni/derivato/toxic_shop.report.json` · `I1_interni/schede/toxic_shop.json` (Toxic Slum Bazaar — Bazar dei filtri)
- `I1_interni/grezzo/toxic_info.png` · `I1_interni/derivato/toxic_info.webp` · `I1_interni/derivato/toxic_info.report.json` · `I1_interni/schede/toxic_info.json` (Toxic Slum Bazaar — Retro del bazar)
- `I1_interni/grezzo/clockwork_smith.png` · `I1_interni/derivato/clockwork_smith.webp` · `I1_interni/derivato/clockwork_smith.report.json` · `I1_interni/schede/clockwork_smith.json` (Clockwork Outpost — Fonderia degli ingranaggi)
- `I1_interni/grezzo/clockwork_shop.png` · `I1_interni/derivato/clockwork_shop.webp` · `I1_interni/derivato/clockwork_shop.report.json` · `I1_interni/schede/clockwork_shop.json` (Clockwork Outpost — Magazzino dell’Asse)
- `I1_interni/grezzo/clockwork_relic.png` · `I1_interni/derivato/clockwork_relic.webp` · `I1_interni/derivato/clockwork_relic.report.json` · `I1_interni/schede/clockwork_relic.json` (Clockwork Outpost — Camera delle fondamenta)
- `I1_interni/grezzo/clockwork_info.png` · `I1_interni/derivato/clockwork_info.webp` · `I1_interni/derivato/clockwork_info.report.json` · `I1_interni/schede/clockwork_info.json` (Clockwork Outpost — Torre delle molle)
- `I1_interni/grezzo/ash_docks_inn.png` · `I1_interni/derivato/ash_docks_inn.webp` · `I1_interni/derivato/ash_docks_inn.report.json` · `I1_interni/schede/ash_docks_inn.json` (Banchina di Cenere — Mensa del Molo)
- `I1_interni/grezzo/ash_docks_smith.png` · `I1_interni/derivato/ash_docks_smith.webp` · `I1_interni/derivato/ash_docks_smith.report.json` · `I1_interni/schede/ash_docks_smith.json` (Banchina di Cenere — Officina delle Gru)
- `I1_interni/grezzo/ash_docks_shop.png` · `I1_interni/derivato/ash_docks_shop.webp` · `I1_interni/derivato/ash_docks_shop.report.json` · `I1_interni/schede/ash_docks_shop.json` (Banchina di Cenere — Emporio della Chiatta)
- `I1_interni/grezzo/antenna_port_inn.png` · `I1_interni/derivato/antenna_port_inn.webp` · `I1_interni/derivato/antenna_port_inn.report.json` · `I1_interni/schede/antenna_port_inn.json` (Borgo delle Antenne — Cabina d’Ascolto)
- `I1_interni/grezzo/antenna_port_smith.png` · `I1_interni/derivato/antenna_port_smith.webp` · `I1_interni/derivato/antenna_port_smith.report.json` · `I1_interni/schede/antenna_port_smith.json` (Borgo delle Antenne — Officina del Traliccio)
- `I1_interni/grezzo/antenna_port_shop.png` · `I1_interni/derivato/antenna_port_shop.webp` · `I1_interni/derivato/antenna_port_shop.report.json` · `I1_interni/schede/antenna_port_shop.json` (Borgo delle Antenne — Banco delle Onde)
- `I1_interni/grezzo/clinic_ward_inn.png` · `I1_interni/derivato/clinic_ward_inn.webp` · `I1_interni/derivato/clinic_ward_inn.report.json` · `I1_interni/schede/clinic_ward_inn.json` (Chiostro Clinico — Cappella dell’Anamnesi)
- `I1_interni/grezzo/clinic_ward_alchemist.png` · `I1_interni/derivato/clinic_ward_alchemist.webp` · `I1_interni/derivato/clinic_ward_alchemist.report.json` · `I1_interni/schede/clinic_ward_alchemist.json` (Chiostro Clinico — Spezieria Bianca)
- `I1_interni/grezzo/clinic_ward_shop.png` · `I1_interni/derivato/clinic_ward_shop.webp` · `I1_interni/derivato/clinic_ward_shop.report.json` · `I1_interni/schede/clinic_ward_shop.json` (Chiostro Clinico — Dispensa del Chiostro)
- `I1_interni/grezzo/node_commons_smith.png` · `I1_interni/derivato/node_commons_smith.webp` · `I1_interni/derivato/node_commons_smith.report.json` · `I1_interni/schede/node_commons_smith.json` (Anello del Nodo — Officina del Condotto)
- `I1_interni/grezzo/node_commons_relic.png` · `I1_interni/derivato/node_commons_relic.webp` · `I1_interni/derivato/node_commons_relic.report.json` · `I1_interni/schede/node_commons_relic.json` (Anello del Nodo — Sala delle Turbine)
- `I1_interni/grezzo/node_commons_info.png` · `I1_interni/derivato/node_commons_info.webp` · `I1_interni/derivato/node_commons_info.report.json` · `I1_interni/schede/node_commons_info.json` (Anello del Nodo — Archivio dei Turni)
- `I1_interni/grezzo/chalk_harbor_inn.png` · `I1_interni/derivato/chalk_harbor_inn.webp` · `I1_interni/derivato/chalk_harbor_inn.report.json` · `I1_interni/schede/chalk_harbor_inn.json` (Molo dei Segni — Locanda della Scogliera)
- `I1_interni/grezzo/chalk_harbor_shop.png` · `I1_interni/derivato/chalk_harbor_shop.webp` · `I1_interni/derivato/chalk_harbor_shop.report.json` · `I1_interni/schede/chalk_harbor_shop.json` (Molo dei Segni — Mercato del Sale)
- `I1_interni/grezzo/chalk_harbor_info.png` · `I1_interni/derivato/chalk_harbor_info.webp` · `I1_interni/derivato/chalk_harbor_info.report.json` · `I1_interni/schede/chalk_harbor_info.json` (Molo dei Segni — Cantiere delle Chiglie)
- `I1_interni/grezzo/lower_hearth_inn.png` · `I1_interni/derivato/lower_hearth_inn.webp` · `I1_interni/derivato/lower_hearth_inn.report.json` · `I1_interni/schede/lower_hearth_inn.json` (Focolare Basso — Mensa della Brace)
- `I1_interni/grezzo/lower_hearth_smith.png` · `I1_interni/derivato/lower_hearth_smith.webp` · `I1_interni/derivato/lower_hearth_smith.report.json` · `I1_interni/schede/lower_hearth_smith.json` (Focolare Basso — Fucina del Maglio)
- `I1_interni/grezzo/lower_hearth_alchemist.png` · `I1_interni/derivato/lower_hearth_alchemist.webp` · `I1_interni/derivato/lower_hearth_alchemist.report.json` · `I1_interni/schede/lower_hearth_alchemist.json` (Focolare Basso — Distilleria Termica)
- `I1_interni/grezzo/glass_terrace_inn.png` · `I1_interni/derivato/glass_terrace_inn.webp` · `I1_interni/derivato/glass_terrace_inn.report.json` · `I1_interni/schede/glass_terrace_inn.json` (Terrazze di Vetro — Serra dei Cristalli)
- `I1_interni/grezzo/glass_terrace_shop.png` · `I1_interni/derivato/glass_terrace_shop.webp` · `I1_interni/derivato/glass_terrace_shop.report.json` · `I1_interni/schede/glass_terrace_shop.json` (Terrazze di Vetro — Galleria delle Lenti)
- `I1_interni/grezzo/glass_terrace_relic.png` · `I1_interni/derivato/glass_terrace_relic.webp` · `I1_interni/derivato/glass_terrace_relic.report.json` · `I1_interni/schede/glass_terrace_relic.json` (Terrazze di Vetro — Padiglione degli Specchi)
- `I1_interni/grezzo/sky_rail_smith.png` · `I1_interni/derivato/sky_rail_smith.webp` · `I1_interni/derivato/sky_rail_smith.report.json` · `I1_interni/schede/sky_rail_smith.json` (Scalo Sopraelevato — Hangar dei Piloni)
- `I1_interni/grezzo/sky_rail_shop.png` · `I1_interni/derivato/sky_rail_shop.webp` · `I1_interni/derivato/sky_rail_shop.report.json` · `I1_interni/schede/sky_rail_shop.json` (Scalo Sopraelevato — Vagone Dispensa)
- `I1_interni/grezzo/sky_rail_info.png` · `I1_interni/derivato/sky_rail_info.webp` · `I1_interni/derivato/sky_rail_info.report.json` · `I1_interni/schede/sky_rail_info.json` (Scalo Sopraelevato — Torre di Scambio)
- `I1_interni/grezzo/deep_archive_alchemist.png` · `I1_interni/derivato/deep_archive_alchemist.webp` · `I1_interni/derivato/deep_archive_alchemist.report.json` · `I1_interni/schede/deep_archive_alchemist.json` (Volta delle Spore — Camera di Decantazione)
- `I1_interni/grezzo/deep_archive_relic.png` · `I1_interni/derivato/deep_archive_relic.webp` · `I1_interni/derivato/deep_archive_relic.report.json` · `I1_interni/schede/deep_archive_relic.json` (Volta delle Spore — Sala delle Bobine)
- `I1_interni/grezzo/deep_archive_info.png` · `I1_interni/derivato/deep_archive_info.webp` · `I1_interni/derivato/deep_archive_info.report.json` · `I1_interni/schede/deep_archive_info.json` (Volta delle Spore — Pozzo degli Indici)
- `I1_interni/grezzo/axis_crown_inn.png` · `I1_interni/derivato/axis_crown_inn.webp` · `I1_interni/derivato/axis_crown_inn.report.json` · `I1_interni/schede/axis_crown_inn.json` (Atrio della Corona — Loggia dei Venti)
- `I1_interni/grezzo/axis_crown_smith.png` · `I1_interni/derivato/axis_crown_smith.webp` · `I1_interni/derivato/axis_crown_smith.report.json` · `I1_interni/schede/axis_crown_smith.json` (Atrio della Corona — Forgia d’Apogeo)
- `I1_interni/grezzo/axis_crown_relic.png` · `I1_interni/derivato/axis_crown_relic.webp` · `I1_interni/derivato/axis_crown_relic.report.json` · `I1_interni/schede/axis_crown_relic.json` (Atrio della Corona — Santuario dell’Ora Uno)

### Lotto I2 — 6 ritratti su 45 (grezzo PNG 1200×1600 su `#FF00FF` + derivato PNG alfa binaria + `.report.json` + scheda JSON)
- `I2_ritratti/grezzo/moon_inn.png` · `I2_ritratti/derivato/moon_inn.png` · `I2_ritratti/derivato/moon_inn.report.json` · `I2_ritratti/schede/moon_inn.json` (Moon Refuge — Oren · Locandiere)
- `I2_ritratti/grezzo/moon_smith.png` · `I2_ritratti/derivato/moon_smith.png` · `I2_ritratti/derivato/moon_smith.report.json` · `I2_ritratti/schede/moon_smith.json` (Moon Refuge — Dario)
- `I2_ritratti/grezzo/moon_shop.png` · `I2_ritratti/derivato/moon_shop.png` · `I2_ritratti/derivato/moon_shop.report.json` · `I2_ritratti/schede/moon_shop.json` (Moon Refuge — Nadia · Rigattiera)
- `I2_ritratti/grezzo/cathedral_smith.png` · `I2_ritratti/derivato/cathedral_smith.png` · `I2_ritratti/derivato/cathedral_smith.report.json` · `I2_ritratti/schede/cathedral_smith.json` (Cathedral Quarter — Garrick · Mastro Forgiatore)
- `I2_ritratti/grezzo/cathedral_relic.png` · `I2_ritratti/derivato/cathedral_relic.png` · `I2_ritratti/derivato/cathedral_relic.report.json` · `I2_ritratti/schede/cathedral_relic.json` (Cathedral Quarter — Maelis · Custode delle reliquie)
- `I2_ritratti/grezzo/cathedral_info.png` · `I2_ritratti/derivato/cathedral_info.png` · `I2_ritratti/derivato/cathedral_info.report.json` · `I2_ritratti/schede/cathedral_info.json` (Cathedral Quarter — Corvo · Confessore delle Voci)

### Lotto M1 — 15 brani musicali su 15 (WAV 48 kHz 24 bit stereo + OGG Opus 48 kHz stereo 76–80 kbps + `-metrics.json` + `.scheda.json`)
- `M1_musica/title.wav` · `M1_musica/title.ogg` · `M1_musica/title-metrics.json` · `M1_musica/title.scheda.json` (Menu principale)
- `M1_musica/refuge.wav` · `M1_musica/refuge.ogg` · `M1_musica/refuge-metrics.json` · `M1_musica/refuge.scheda.json` (Rifugio e officina di Tessa)
- `M1_musica/nox.wav` · `M1_musica/nox.ogg` · `M1_musica/nox-metrics.json` · `M1_musica/nox.scheda.json` (Tappe di Nox)
- `M1_musica/lulu.wav` · `M1_musica/lulu.ogg` · `M1_musica/lulu-metrics.json` · `M1_musica/lulu.scheda.json` (Tappe di Lulu)
- `M1_musica/danger.wav` · `M1_musica/danger.ogg` · `M1_musica/danger-metrics.json` · `M1_musica/danger.scheda.json` (Azione, atti I-II)
- `M1_musica/danger_b.wav` · `M1_musica/danger_b.ogg` · `M1_musica/danger_b-metrics.json` · `M1_musica/danger_b.scheda.json` (Azione, atti III-IV)
- `M1_musica/drive.wav` · `M1_musica/drive.ogg` · `M1_musica/drive-metrics.json` · `M1_musica/drive.scheda.json` (Guida della Vortex)
- `M1_musica/race.wav` · `M1_musica/race.ogg` · `M1_musica/race-metrics.json` · `M1_musica/race.scheda.json` (Gare di Veyra)
- `M1_musica/boss.wav` · `M1_musica/boss.ogg` · `M1_musica/boss-metrics.json` · `M1_musica/boss.scheda.json` (Combattimenti contro i Boss)
- `M1_musica/vega.wav` · `M1_musica/vega.ogg` · `M1_musica/vega-metrics.json` · `M1_musica/vega.scheda.json` (Duello con Vega)
- `M1_musica/eve.wav` · `M1_musica/eve.ogg` · `M1_musica/eve-metrics.json` · `M1_musica/eve.scheda.json` (Archivio ed EVE-47)
- `M1_musica/depths.wav` · `M1_musica/depths.ogg` · `M1_musica/depths-metrics.json` · `M1_musica/depths.scheda.json` (Sotterranei e furtivita)
- `M1_musica/promise.wav` · `M1_musica/promise.ogg` · `M1_musica/promise-metrics.json` · `M1_musica/promise.scheda.json` (La promessa)
- `M1_musica/reunion.wav` · `M1_musica/reunion.ogg` · `M1_musica/reunion-metrics.json` · `M1_musica/reunion.scheda.json` (Il ricongiungimento)
- `M1_musica/archon.wav` · `M1_musica/archon.ogg` · `M1_musica/archon-metrics.json` · `M1_musica/archon.scheda.json` (Finale con Archon)

---

## 2. SALTATI (con il motivo)

- `I2_ritratti/grezzo/toxic_shop.png` (Mara · Filtraia del Bazar, Toxic Slum Bazaar): la prima generazione ha restituito uno sfondo dipinto invece di `#FF00FF` piatto; il tentativo successivo di rigenerazione ha incontrato l'esaurimento della quota giornaliera del generatore di immagini (`generic::resource_exhausted`). Nessun segnaposto consegnato.

---

## 3. MANCANTI (da riprendere dalla prima voce nella prossima sessione)

### Lotto I2 — 38 ritratti mancanti (per esaurimento quota del generatore d'immagini)
- `I2_ritratti/grezzo/cathedral_shop.png`
- `I2_ritratti/grezzo/toxic_smith.png`
- `I2_ritratti/grezzo/toxic_alchemist.png`
- `I2_ritratti/grezzo/toxic_info.png`
- `I2_ritratti/grezzo/clockwork_smith.png`
- `I2_ritratti/grezzo/clockwork_shop.png`
- `I2_ritratti/grezzo/clockwork_relic.png`
- `I2_ritratti/grezzo/clockwork_info.png`
- `I2_ritratti/grezzo/ash_docks_inn.png`
- `I2_ritratti/grezzo/ash_docks_smith.png`
- `I2_ritratti/grezzo/ash_docks_shop.png`
- `I2_ritratti/grezzo/antenna_port_inn.png`
- `I2_ritratti/grezzo/antenna_port_smith.png`
- `I2_ritratti/grezzo/antenna_port_shop.png`
- `I2_ritratti/grezzo/clinic_ward_inn.png`
- `I2_ritratti/grezzo/clinic_ward_alchemist.png`
- `I2_ritratti/grezzo/clinic_ward_shop.png`
- `I2_ritratti/grezzo/node_commons_smith.png`
- `I2_ritratti/grezzo/node_commons_relic.png`
- `I2_ritratti/grezzo/node_commons_info.png`
- `I2_ritratti/grezzo/chalk_harbor_inn.png`
- `I2_ritratti/grezzo/chalk_harbor_shop.png`
- `I2_ritratti/grezzo/chalk_harbor_info.png`
- `I2_ritratti/grezzo/lower_hearth_inn.png`
- `I2_ritratti/grezzo/lower_hearth_smith.png`
- `I2_ritratti/grezzo/lower_hearth_alchemist.png`
- `I2_ritratti/grezzo/glass_terrace_inn.png`
- `I2_ritratti/grezzo/glass_terrace_shop.png`
- `I2_ritratti/grezzo/glass_terrace_relic.png`
- `I2_ritratti/grezzo/sky_rail_smith.png`
- `I2_ritratti/grezzo/sky_rail_shop.png`
- `I2_ritratti/grezzo/sky_rail_info.png`
- `I2_ritratti/grezzo/deep_archive_alchemist.png`
- `I2_ritratti/grezzo/deep_archive_relic.png`
- `I2_ritratti/grezzo/deep_archive_info.png`
- `I2_ritratti/grezzo/axis_crown_inn.png`
- `I2_ritratti/grezzo/axis_crown_smith.png`
- `I2_ritratti/grezzo/axis_crown_relic.png`

### Lotto A1 — 55 immagini boss mancanti (per esaurimento quota del generatore d'immagini)
- `A1_boss/cathedral_bone_tyrant/grezzo/identita.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/idle.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/walk.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/anticipation.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/attack.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/stagger.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/phase_transition.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/core_exposed.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/final_hit.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/collapse_reward_portal.png (Tiranno d'Ossa)`
- `A1_boss/cathedral_bone_tyrant/grezzo/defeat.png (Tiranno d'Ossa)`
- `A1_boss/toxic_forge_behemoth/grezzo/identita.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/idle.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/walk.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/anticipation.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/attack.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/stagger.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/phase_transition.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/core_exposed.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/final_hit.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/collapse_reward_portal.png (Behemoth della Forgia)`
- `A1_boss/toxic_forge_behemoth/grezzo/defeat.png (Behemoth della Forgia)`
- `A1_boss/shadow_reaper/grezzo/identita.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/idle.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/walk.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/anticipation.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/attack.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/stagger.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/phase_transition.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/core_exposed.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/final_hit.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/collapse_reward_portal.png (Shadow Reaper)`
- `A1_boss/shadow_reaper/grezzo/defeat.png (Shadow Reaper)`
- `A1_boss/vega/grezzo/identita.png (Vega)`
- `A1_boss/vega/grezzo/idle.png (Vega)`
- `A1_boss/vega/grezzo/walk.png (Vega)`
- `A1_boss/vega/grezzo/anticipation.png (Vega)`
- `A1_boss/vega/grezzo/attack.png (Vega)`
- `A1_boss/vega/grezzo/stagger.png (Vega)`
- `A1_boss/vega/grezzo/phase_transition.png (Vega)`
- `A1_boss/vega/grezzo/core_exposed.png (Vega)`
- `A1_boss/vega/grezzo/final_hit.png (Vega)`
- `A1_boss/vega/grezzo/collapse_reward_portal.png (Vega)`
- `A1_boss/vega/grezzo/defeat.png (Vega)`
- `A1_boss/chrono_overlord/grezzo/identita.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/idle.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/walk.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/anticipation.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/attack.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/stagger.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/phase_transition.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/core_exposed.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/final_hit.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/collapse_reward_portal.png (Archon (Chrono Overlord))`
- `A1_boss/chrono_overlord/grezzo/defeat.png (Archon (Chrono Overlord))`

### Lotto A2 — 18 immagini nemici mancanti (per esaurimento quota del generatore d'immagini)
- `A2_nemici/gang_shooter/grezzo/identita.png`
- `A2_nemici/gang_shooter/grezzo/idle.png`
- `A2_nemici/gang_shooter/grezzo/move.png`
- `A2_nemici/gang_shooter/grezzo/attack.png`
- `A2_nemici/gang_shooter/grezzo/hit.png`
- `A2_nemici/gang_shooter/grezzo/defeat.png`
- `A2_nemici/gang_breaker/grezzo/identita.png`
- `A2_nemici/gang_breaker/grezzo/idle.png`
- `A2_nemici/gang_breaker/grezzo/move.png`
- `A2_nemici/gang_breaker/grezzo/attack.png`
- `A2_nemici/gang_breaker/grezzo/hit.png`
- `A2_nemici/gang_breaker/grezzo/defeat.png`
- `A2_nemici/gang_signal/grezzo/identita.png`
- `A2_nemici/gang_signal/grezzo/idle.png`
- `A2_nemici/gang_signal/grezzo/move.png`
- `A2_nemici/gang_signal/grezzo/attack.png`
- `A2_nemici/gang_signal/grezzo/hit.png`
- `A2_nemici/gang_signal/grezzo/defeat.png`

### Lotto A3 — 14 immagini effetti mancanti (per esaurimento quota del generatore d'immagini)
- `A3_effetti/muzzle_flash/grezzo/muzzle_flash.png`
- `A3_effetti/impact/grezzo/impact.png`
- `A3_effetti/chrono_rings/grezzo/chrono_rings.png`
- `A3_effetti/shockwave/grezzo/shockwave.png`
- `A3_effetti/energy_burst/grezzo/energy_burst.png`
- `A3_effetti/debris/grezzo/debris.png`
- `A3_effetti/bone_fragments/grezzo/bone_fragments.png`
- `A3_effetti/gear_debris/grezzo/gear_debris.png`
- `A3_effetti/toxic_splash/grezzo/toxic_splash.png`
- `A3_effetti/shadow_dissipation/grezzo/shadow_dissipation.png`
- `A3_effetti/portal_spiral/grezzo/portal_spiral.png`
- `A3_effetti/relic_shards/grezzo/relic_shards.png`
- `A3_effetti/smoke/grezzo/smoke.png`
- `A3_effetti/finish_flash/grezzo/finish_flash.png`

### Lotto A4 — 17 immagini interfaccia mancanti (per esaurimento quota del generatore d'immagini)
- `A4_ui/cornice_pannello.png`
- `A4_ui/icone/spara.png`
- `A4_ui/icone/schiva.png`
- `A4_ui/icone/magia.png`
- `A4_ui/icone/duo.png`
- `A4_ui/icone/interagisci.png`
- `A4_ui/icone/ricarica.png`
- `A4_ui/icone/cambia_arma.png`
- `A4_ui/icone/pausa.png`
- `A4_ui/icone/bagaglio.png`
- `A4_ui/icone/mappa.png`
- `A4_ui/icone/incarichi.png`
- `A4_ui/icone/cura.png`
- `A4_ui/icone/opzioni.png`
- `A4_ui/icone/audio.png`
- `A4_ui/icone/vibrazione.png`
- `A4_ui/icone/lingua.png`
