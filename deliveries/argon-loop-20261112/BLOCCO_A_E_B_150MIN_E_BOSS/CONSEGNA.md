# CONSEGNA · BLOCCO A & BLOCCO B — Espansione 150 Minuti (13 Tappe R20-c) e Kit 3 Mosse / 3 Fasi / Punti Deboli dei 4 Boss Nuovi

- **Ramo codice pubblicato su GitHub**: `argon/loop-20261112` (commit `b9eeec368180980ade1966eaaf82f86eb6db4f48`).
- **BLOCCO A (13 Tappe R20-c)**: `docks_veyra`, `app_breach`, `bone_tyrant`, `app_clinic`, `app_node`, `app_yard`, `forge_behemoth`, `app_port`, `glass_flood`, `glass_reaper`, `vega`, `app_archive`, `app_axis` portate a 4 ondate progressive, `channel: 1.5`, evento di metà missione `midEvent` con salvataggio civile + ricompensa segreta (`scrap` + `medkit`) + passaggio alla seconda zona, scena finale `<id>_end`, `BARKS` dedicati e traduzione inglese al 100%.
- **BLOCCO B (4 Boss Nuovi in `game/campaign.mjs`)**:
  - **Vega (`vega`, 265 HP)**: Cadenza `vegaTempo` (`MIRA 1/4..3/4` + `QUARTO COLPO`), Balzo con ventaglio, Trappola di mine; finestra di punto debole `weakExposed = 1.4 s` dopo il Quarto Colpo.
  - **Shadow Reaper (`reaper`, 315 HP)**: Passo d'ombra `reaperMirage` (2–3 copie nell'acqua + fendente), Falce incrociata in carica, Vortice d'ombra + eco; finestra di punto debole `weakExposed = 1.45 s` dopo `reaperMirage`.
  - **Bone Tyrant (`tyrant`, 325 HP)**: Schianto dell'ossario, Carica della navata, Coro delle reliquie (`volley` radiale + guardiano); finestra di punto debole `weakExposed = 1.6 s` dopo `volley`.
  - **Forge Behemoth (`behemoth`, 375 HP)**: Carica di sega termica (`charge` + scia di scorie), Eruzione di vapore acido (`r: 145`), Pioggia di scorie + 2 mine termiche; finestra di punto debole `weakExposed = 1.65 s` dopo la sega termica.
