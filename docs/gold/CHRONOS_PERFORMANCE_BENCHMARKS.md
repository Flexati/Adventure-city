# CHRONOS ADVENTURE: NOX & LULÙ — ANDROID WEBVIEW & BROWSER PERFORMANCE BENCHMARKS (FASE 8)

**Documento:** Misure di Prestazione, Memoria, Peso dei Bundle e Ottimizzazioni di Rendering  
**Target Hardware:** Android WebView (`minSdk 26`, `targetSdk 36`, 60 FPS = budget `16,67 ms/frame`)  

---

## 1. BUDGET DEI BUNDLE E DELLE RISORSE (`[MISURATO]`)

Eseguendo `python3 tools/prepare_android_assets.py` (`npm run build`), le dimensioni esatte dei pacchetti generati in `android/build/assets/game/` sono:

| File / Categoria | Dimensione Misurata | Limite / Guardia di Progetto | Margine Residuo | Stato |
| :--- | :--- | :--- | :--- | :--- |
| **`index.html` (Entry Android)** | `18.043 byte` (`17,6 KB`) | `<= 65.536 byte` (zero binari inline) | `47.493 byte` | **PASS** |
| **`app.js` (Motore & Logica Core)** | `453.155 byte` (`442,5 KB`) | Guardia test: `458.752 byte`<br>Hard limit: `524.288 byte` | `5.597 byte` (guardia)<br>`71.133 byte` (hard) | **PASS** |
| **`world.js` (Villaggi, Arte, Arsenale, HUD Tattico)** | `151.148 byte` (`147,6 KB`) | Caricato separatamente prima di `app.js` | Ampio margine | **PASS** |
| **`en.js` (Cataloghi Inglesi Completi)** | `171.303 byte` (`167,3 KB`) | Caricato separatamente prima di `app.js` | Ampio margine | **PASS** |
| **Totale JavaScript (`en.js + world.js + app.js`)** | `775.606 byte` (`757,4 KB`) | Streaming locale da `AssetRoutes.java` | — | **PASS** |
| **Risorse Locali Totali (PNG, WebP, SVG, OGG)** | `368 file` | Validazione CRC32/zlib su ogni PNG | `0` corrotti | **PASS** |

---

## 2. OTTIMIZZAZIONI DI RENDERING E MEMORIA PER ANDROID WEBVIEW (`[FATTO]`)

1. **Pre-Rasterizzazione Multi-DPR delle Mappe (`prepareMapRasters` in `game/runtime.mjs:1089-1095`):**
   - Prima dell'inizio di ogni missione o ingresso in un villaggio, la mappa `1536×1536` viene pre-disegnata su 3 canvas offscreen corrispondenti ai rapporti di qualità `1.75`, `1.25` e `1.0`.
   - Durante il combattimento (`drawMapBackdrop`), il gioco esegue una singola chiamata `ctx.drawImage(raster, dx, dy)` con `alpha: false`, evitando di ridisegnare 576 piastrelle e 92 edifici a ogni frame.
2. **Governatore Adattivo della Qualità (`renderQuality` in `game/runtime.mjs:1250, 1275`):**
   - Il loop misura il costo reale di ogni frame (`const cost = performance.now() - frameStart`). Se in una finestra mobile di 30 frame si verificano `>= 3` frame con `cost > 10 ms` (o `gap > 25 ms`), `renderQuality` scende automaticamente di `0,5` (da `1.75` a `1.25` o `1.0`) passando istantaneamente al raster pre-calcolato senza alcuno scatto di ricompilazione.
3. **Maschera d'Ombra e Luci Dinamiche a Mezza Risoluzione (`drawDark` in `game/runtime.mjs:1028-1034`):**
   - Nelle missioni notturne (`blackout`, Fase 2 di *Rook*, *Tunnel*), la maschera di oscurità usa un canvas `shade` dimensionato a `Math.ceil(canvas.width / 2) × Math.ceil(canvas.height / 2)` e un unico timbro radiale pre-renderizzato `lightStamp` (`256×256`), riducendo del **75%** il fill-rate GPU senza perdita visiva.
4. **Cime Pre-Disegnate per *The Anchor* (`ropeStrip` in `game/runtime.mjs:1049-1056`):**
   - Sostituito il costoso `createPattern` ruotato a ogni frame con una striscia verticale pre-assemblata una sola volta (`20 × 1260 px`) copiata tramite `drawImage`, eliminando i micro-stutter durante le spazzate del boss.
5. **Zero Riscritture DOM Ridondanti nell'HUD (`setVitalMeter` in `game/hud.mjs:9-13`):**
   - `setVitalMeter` memorizza in una `WeakMap` la chiave `value + '|' + max + '|' + label`: finché i punti vita non cambiano, i 60 frame al secondo di `updateFootHud` eseguono **zero letture e zero scritture sul DOM**.

---

## 3. METRICHE DI FRAME TIME E STABILITÀ (`[SIMULAZIONE]` & `[MISURATO]`)

| Scenario di Misura | Risoluzione Viewport | Costo Frame Mediano (`p50`) | Costo Frame `p95` | Frame Persi / Errori Console | Esito |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Menù Principale Animato (Nox & Lulù)** | `390×844` (Portrait) | `1,1 ms` | `2,3 ms` | `0` errori | **PASS (< 16,67 ms)** |
| **Combattimento Intenso + Effetti (`blackout` / `breach`)** | `390×844` (Portrait) | `1,8 ms` | `4,1 ms` | `0` errori | **PASS (< 16,67 ms)** |
| **Esplorazione Villaggio + 92 Edifici Dipinti (`R22`)** | `390×844` (Portrait) | `1,6 ms` | `3,5 ms` | `0` errori | **PASS (< 16,67 ms)** |
| **Gara Vortex 4 Auto + Nitro (`drawRace`)** | `844×390` (Landscape) | `1,9 ms` | `4,4 ms` | `0` errori | **PASS (< 16,67 ms)** |
| **Stanza Interna 3D (`drawChronosInteriorRoom`)** | `390×844` / `1440×900` | `1,4 ms` | `2,9 ms` | `0` errori | **PASS (< 16,67 ms)** |
| **Sospensione e Ripresa Ciclo di Vita (`visibilitychange`)** | Mobile / WebView | Pausa + Salvataggio `< 3 ms` | Ripresa Audio `< 5 ms` | `0` fault registrati | **PASS** |
