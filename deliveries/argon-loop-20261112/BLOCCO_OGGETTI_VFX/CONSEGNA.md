# CONSEGNA — BLOCCO_OGGETTI_VFX_E_AUDIO_150MIN

## Scopo e Integrazione
1. **Logo Studio `jaguarzcreatorz` stile Supercell (`game/art/brand/jaguar_crest.svg`)**:
   - Emblema minimale ad alto impatto (testa di giaguaro geometrica in ossidiana e oro caldo con occhi ciano Nox `#6BDDFF` e rosa Lulù `#FF7FD8`), animato con `crestSlam` in `game/index.html` + `game/style.css` + `game/runtime.mjs`.
2. **Colonna Sonora Completa per ~150 Minuti (`14` nuove tracce `.ogg` in `game/audio/v10/`)**:
   - `docks_veyra.ogg`, `bone_tyrant.ogg`, `warden_node.ogg`, `below_descent.ogg`, `toxic_bazaar.ogg`, `forge_behemoth.ogg`, `port_stealth.ogg`, `glass_flood.ogg`, `glass_reaper.ogg`, `vega_duel.ogg`, `archive_theme.ogg`, `clockwork_outpost.ogg`, `axis_ascent.ogg`, `archon_finale.ogg`.
   - Ogni atto, distretto, villaggio e tutti i 9 boss (`rook`, `anchor`, `tyrant`, `custode`, `behemoth`, `reaper`, `vega`, `mirror`, `archon`) dispongono di un tema musicale dedicato e continuo.
3. **Sprite Sheet VFX Armi (`vfx_h17.png`, `vfx_arc7.png`) e Oggetti/Decorazioni Villaggi (`oggetti_moon.png`, `oggetti_cathedral.png`, `oggetti_toxic.png`, `oggetti_clockwork.png`)**:
   - `vfx_h17.png` (512×512, 4×4 celle 128×128): lancia railgun H-17, frantumazione cristallina, rimbalzo a parete, anelli sonici.
   - `vfx_arc7.png` (512×512, 4×4 celle 128×128): scarica ARC-7 Coro Elettrico, risonanza a catena, arco a terra, nova armonica.
   - `oggetti_moon.png`, `oggetti_cathedral.png`, `oggetti_toxic.png`, `oggetti_clockwork.png` (1536×1024, 4×3 celle, >179 KB ciascuno): lampioni, bracieri, banchi mercato, casse/botti/vasche pressurizzate e monumenti meccanici, integrati in `game/village-art.mjs` e animati in tempo reale in `drawVillageLife`.
4. **Sfida Dinamica Basata sulle Scelte (`game/missions.mjs` & `game/runtime.mjs`)**:
   - Le scelte narrative (`blackout_choice`, `glass_truth`, `rooftop_answer`, `heat`, `eve_kept`, `line_choice`) scalano la sfida dei boss e assegnano ricompense bonus (`choiceTier`, `choiceBonusCoins`).
