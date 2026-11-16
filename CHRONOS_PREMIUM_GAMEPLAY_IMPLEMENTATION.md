# CHRONOS ADVENTURE: NOX & LULÙ — PREMIUM GAMEPLAY, VISUAL & FOMO IMPLEMENTATION (FASE 5 & FASE 6)

**Documento:** Dettaglio Tecnico delle Implementazioni di Gameplay, Grafica, Audio e FOMO Etico  
**Budget Critico:** `android/build/assets/game/app.js` = `453.155 byte` (limite guardia `458.752 byte`, hard limit `524.288 byte`)  

---

## 1. COMBATTIMENTO, MIRA DALLA CANNA E BALISTICA VISIBILE (`R25`, `R28`, `R29`)

### 1.1 Origine Canna Misurata al Pixel (`MUZZLE_V9` in `game/weapons-v9.mjs`)
- **Problema risolto:** Nelle versioni precedenti i colpi partivano dal centro della cintura (`32 px` sopra i piedi) anziché dalla canna impugnata (`66 px` nella posa laterale, `96 px` verso l'alto, `23 px` verso il basso).
- **Implementazione (`[FATTO]`):** `tools/measure_muzzles_r28.py --check` misura la posizione esatta della vampa dipinta su ogni posa di sparo di Nox e Lulù per tutte le famiglie d'arma (`C-9`, `VX-9/H-17`, `R-12/ARC-7`) e per le 13 armi di mercato (`drawHeldWeaponAndMuzzle` in `game/village-art.mjs:797-834`).

### 1.2 Pallottole Dipinte in Volo e Fuoco di Bocca Direzionale (`game/runtime.mjs:911, 928-933`)
- **Volo leggibile (`heroBullet`):** Ogni proiettile parte dalle coordinate `(x + mx, y + my)` della canna, vola a `1.300 px/s` (`0,13–0,30 s`) ruotato lungo l'angolo reale del tiro, lascia una tripla scia luminosa nel colore dell'eroe (`#6bddff` per Nox, `#ff72d9` per Lulù) più bossolo fisico (`type: 'casing'`) ed esplode sul bersaglio (riga 1 del foglio VFX) o contro il muro (riga 2).
- **Fuoco di bocca orientato (`muzzleFire`):** La vampa d'uscita viene ancorata alla base della canna e ruotata verso il punto d'impatto (`Math.atan2(ty - y, tx - x)`), raddrizzando la simmetria verticale quando si spara verso sinistra (`if (Math.cos(f.a) < 0) ctx.scale(1, -1)`).

### 1.3 Mira Manuale Intelligente (`attackPreview` & `pickAlong` in `game/campaign.mjs:508-514`)
- Trascinando il pulsante `SPARA` o `PULSE`, il raggio laser parte dalla canna e intercetta l'effettivo riquadro corporeo (`foeBodyV9`) del primo nemico in linea di vista (con `12 px` di tolleranza per il pollice), fermando la linea tratteggiata sul suo petto e circondandolo con un doppio anello di aggancio (`#ff5a6e` + `#ffffffaa`).

---

## 2. LEVEL DESIGN FISICO E VILLAGGI VIVI (`R22`, `R26`)

### 2.1 Piante Manuali 24×24 per le 13 Mappe Dipinte (`tools/painted_plans_r26.py`, `game/painted-maps.mjs`)
- Ogni mappa `1536×1536` (`docks_veyra`, `app_breach`, `bone_tyrant`, `app_clinic`, `app_node`, `app_yard`, `forge_behemoth`, `app_port`, `glass_flood`, `glass_reaper`, `vega`, `app_archive`, `app_axis`) ha una matrice `24×24` verificata casella per casella: container, presse, banchi, colonne spezzate e vasche d'acido sono solidi sia per il movimento sia per la visibilità dei colpi (`visible()`).

### 2.2 Lotti Lastricati e 16 Case Dipinte nei 14 Villaggi (`lotPlan`, `vLotGround` in `game/village-art.mjs:63-95`)
- Eliminato ogni riquadro nero sotto gli edifici: ciascuno dei **92 lotti edilizi** nei 14 villaggi è lastricato con la pietra di fondazione del proprio distretto (`LOT_TILE`), bordato da un cordolo rialzato con ombra di contatto e collegato alla strada da una soglia davanti alla porta.
- Se un lotto è più largo di `1,4 caselle` rispetto all'edificio principale, `lotPlan(b, H)` affianca automaticamente un secondo edificio dipinto della stessa famiglia architettonica, coprendo almeno il **78%** della larghezza del lotto.

---

## 3. IMPLEMENTAZIONE FOMO ETICO E FEEDBACK TATTICO (`computeTacticalHudState` & `drawComboStreakHud`)

Per massimizzare il coinvolgimento esplorativo e la leggibilità dei boss senza aggiungere un solo byte ad `app.js`, la logica e il rendering tattico sono stati ingegnerizzati in `game/village-art.mjs` (compilato in `world.js`) con traduzioni inglesi in `game/runtime-en.mjs` (compilato in `en.js`):

### 3.1 Radar Segreto Chronos (`secretRadar` in `game/village-art.mjs:898-921`)
- Quando una missione a piedi contiene un forziere segreto ancora chiuso (`!c.open`), `computeTacticalHudState(s)` calcola in tempo reale la distanza euclidea e l'angolo tra l'eroe e il forziere:
  - Tra `211 px` e `460 px`: compare sotto l'HUD sinistro il rilevatore ciano `◈ SEGRETO RILEVATO` (`◈ SECRET DETECTED`) con freccia direzionale orientata verso il forziere.
  - Entro `210 px`: il rilevatore passa in stato aureo ad alta priorità `✦ FORZIERE VICINO` (`✦ CHEST NEARBY`), guidando il giocatore alla scoperta prima che completi l'ultimo obiettivo della mappa.

### 3.2 Banner Tattico Punto Debole Boss (`bossAlert` in `game/village-art.mjs:922-931`)
- Quando un boss attivo espone il proprio punto debole (`boss.weakExposed > 0` dopo il quarto colpo di Vega, il miraggio dello Shadow Reaper, gli attacchi pesanti di Bone Tyrant e Forge Behemoth, oppure `boss.exposed` quando le 3 cime di The Anchor sono recise), compare sotto la barra vitale del boss il banner `◆ PUNTO DEBOLE ESPOSTO ◆` (`◆ WEAK POINT EXPOSED ◆`).
- Usa doppi rombi geometrici `◆`, cornice ad alto contrasto `#ffd48a` su sfondo `#191206e6` e rispetta l'opzione «Riduci movimento» (`reduced`), risultando immediatamente leggibile anche per giocatori con daltonismo o audio disattivato.
