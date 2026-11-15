# CONSEGNA · APPEND 1 — Villaggi Dipinti (`1536×1536`) e Analisi Tecnica / Fix Stutter `The Anchor`

## 1. Mappe Intere Dipinte dei Villaggi (`1536×1536`, Griglia `24×24` di `game/villages.mjs`)
- **`villaggio_moon.png`** (`Moon Refuge`, `1536×1536`, `3,172,678` B, SHA-256 `533b1db443528e8e7dda3a768a8081bb2d0f5b8945120001cef6de1ce54a7cce`): rifugio sotterraneo con tetti in lamiera verde-acqua, tubazioni in rame, lanterne calde e vasca ottagonale al centro (`x:11..12, y:10..11`). Tutti i 6 edifici (`I`, `S`, `K`, `R`, `A`, `B`) e le relative porte sud (`5,6`, `18,6`, `4,13`, `19,13`, `5,20`, `18,20`) coincidono al pixel con la griglia `24×24`.
- **`villaggio_cathedral.png`** (`Cathedral Quarter`, `1536×1536`, `4,133,531` B, SHA-256 `9e7830ffacfa200f95b7c08798ee4740e78500e4cc7da430b990578abf810177`): pietra chiara, ardesia bruna, vetrate ambrate, l'orologio dei tredici rintocchi sulla Cattedrale centrale `B` (`x:9..14, y:1..6`, porta `11,6`) e i 7 edifici allineati alla pianta `24×24`.
- **`villaggio_toxic.png`** (`Toxic Slum Bazaar`, `1536×1536`, `3,324,885` B, SHA-256 `51519503f8db4ea3885f9fa8ddfe123c1cc37aa052cb9ffd5307009eaabf264d`): lamiere e tende verdi, bidoni, pompe a mano, vasca chimica centrale (`x:10..13, y:10..11`) e insegne luminose senza scritte/lettere, allineati agli 8 edifici della pianta `24×24`.
- **Integrazione in `game/village-art.mjs` (`bakeVillage`, riga `123`)**: quando `bg.naturalWidth === 1536 && bg.naturalHeight === 1536`, la mappa dipinta viene disegnata direttamente `1:1` sull'intero villaggio.

## 2. DIFETTO 2 — Root-Cause e Fix degli Scatti nel Combattimento con `THE ANCHOR` (`La breccia`, Tappa 8)
1. **`game/runtime.mjs`, riga `902` (`drawRope`, chiamata da riga `994` in `drawThreats`) — Causa Primaria**:
   - `ctx.fillStyle = ctx.createPattern(ropeTile, 'repeat')` veniva invocato **ad ogni singolo frame per ciascuna delle 3 cime di ormeggio** (`180` allocazioni `CanvasPattern` al secondo a 60 FPS) non appena `core.state !== 'dormant'`.
   - **Fix applicato su `argon/loop-20261112` (`game/runtime.mjs:898–903`)**: `let ropeTile=null,ropePattern=null;` e `if(!ropePattern)ropePattern=ctx.createPattern(ropeTile,'repeat');`. Zero allocazioni per frame.
2. **`game/runtime.mjs`, riga `994` (`drawThreats`)**:
   - `ctx.setLineDash([14,8])` e `ctx.lineDashOffset` venivano mutati prima di `drawRope(...)` anche quando `drawRope` disegna con `fillRect`. Spostati nel solo ramo di fallback `if(!drawRope(...))`.
3. **`game/runtime.mjs`, righe `1004` e `1024` (`images.anchor_sweep`)**:
   - `game/art/v10/anchor_sweep.png` misura `2304×288` px (`> 2048 px` su asse X) ed è disegnata con `ctx.rotate(...)` durante `anchorSweep` e `lane`.
4. **`game/runtime.mjs`, riga `44` vs riga `175` (`prepareDistrict`)**:
   - `anchor_core`, `anchor_bollards`, `anchor_cable`, `anchor_cable_end`, `anchor_sweep` sono caricate alla riga `175` ma omesse dalla lista di scaricamento alla riga `44`.
