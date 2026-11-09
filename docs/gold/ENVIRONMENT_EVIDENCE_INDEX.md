# CHRONOS ADVENTURE: NOX & LULÙ — Indice delle Evidenze Ambientali (V3)

Data di verifica: 2026-11-09  
Ramo di riferimento: `work/chronos-adventure-commercial`

---

## 1. Tassonomia dello Stato delle Evidenze (§4 & §20)

Ogni affermazione e artefatto di questa consegna è classificato con una delle seguenti etichette verificabili:
- `[VERIFICATO NEL REPOSITORY]`: file sorgente, asset o script presente nell'albero Git e verificato tramite hash/dimensione.
- `[INTEGRATO NEL RUNTIME]`: codice o asset effettivamente caricato ed eseguito da `game/runtime.mjs`, `game/scenery.mjs` o `game/village-art.mjs` (incluso in `android/build/assets/game/app.js`).
- `[VISUALMENTE VERIFICATO]`: schermata catturata dal runtime reale in esecuzione su Chromium headless (`390×844`, `deviceScaleFactor = 2`) e ispezionata visivamente.
- `[TEST AUTOMATICO]`: proprietà verificata dalla suite `node --test` (`346/346` test superati).
- `[BLOCCATO: PENDING_DEVICE_VALIDATION]`: validazione su hardware telefonico fisico Android (non simulabile in container Linux senza dispositivo fisico collegato via ADB).

---

## 2. Tabella degli Screenshot Runtime Verificati (§15 · `[VISUALMENTE VERIFICATO]`)

Tutte le 9 schermate sono state acquisite dal gioco reale tramite `tools/qa_v8.cjs` a risoluzione mobile `390×844` (`780×1688` px fisici a `2x` DPR) con **`0` errori di console o pagina**, e sono archiviate in `docs/evidence/env-v3/`.

| Area / Layout | Modalità / Step | Percorso File | Peso (byte) | SHA-256 (primi 16 hex) | Evidenza Visiva Verificata | Stato |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Moon Refuge (`moon`)** | Hub · Lulù | `docs/evidence/env-v3/hub-moon-390x844.png` | `1.463.472` | `f5db3a9cb62ad421` | Lastricato blu ardesia con grana pixel-art, Pozzo Lunare ciano/ambra in piazza, tetti a doghe con lucernari, prop senza cordoli murari. | `[VISUALMENTE VERIFICATO]` |
| **Cathedral Quarter (`cathedral`)** | Hub · Lulù | `docs/evidence/env-v3/hub-cathedral-390x844.png` | `1.280.318` | `935a5436deacf78f` | Pietra fredda e oro liturgico, Rosone a 8 raggi al centro della piazza, tetti a contrafforti gotici con pinnacoli, bifore ad arco. | `[VISUALMENTE VERIFICATO]` |
| **Toxic Slum Bazaar (`toxic`)** | Hub · Nox | `docs/evidence/env-v3/hub-toxic-390x844.png` | `1.274.179` | `159c0f5520b8b7a7` | Pavimento industriale drenante, Vasca bio-chimica verde reagente con 4 tubazioni, tetti in lamiera grecata, oblò verdi e fusti chimici. | `[VISUALMENTE VERIFICATO]` |
| **Clockwork Outpost (`clockwork`)** | Hub · Nox | `docs/evidence/env-v3/hub-clockwork-390x844.png` | `1.418.388` | `141eb427ba2655c4` | Pavimento inciso bronzo/viola, Astrolabio / Ingranaggio Madre a 8 denti d'ottone in piazza, tetti con anelli concentrici e nuclei ciano. | `[VISUALMENTE VERIFICATO]` |
| **Blackout (`yard`)** | Missione · Nox | `docs/evidence/env-v3/mission-blackout-yard-390x844.png` | `1.434.413` | `f2180c3cc4aab666` | **Risolta nota R5**: nessuna scacchiera chiara sul pavimento; nessuna casetta ripetuta; 4 coperture `2×2` con 4 prop distinti da `district_props.png`; auto `VORTEX`; margine inferiore 1:1 senza pixel stirati. | `[VISUALMENTE VERIFICATO]` |
| **Breach (`elbow`)** | Missione · Lulù | `docs/evidence/env-v3/mission-breach-elbow-390x844.png` | `1.360.170` | `bc7d117dae756ae8` | Condotto a L nel Porto delle Antenne: banchine e acqua portuale da `port.png` sui blocchi perimetrali e nel margine inferiore 1:1, ancora `01` ben leggibile. | `[VISUALMENTE VERIFICATO]` |
| **Contagion (`gallery`)** | Missione · Lulù | `docs/evidence/env-v3/mission-contagion-gallery-390x844.png` | `1.317.234` | `52c0397fa176b81c` | Galleria di Contenimento a doppia navata con pozzo bio-clinico da `clinic.png`, camere `01`/`02` e contrasto netto dei nemici sul pavimento scuro. | `[VISUALMENTE VERIFICATO]` |
| **Zero (`arena`)** | Missione · Nox | `docs/evidence/env-v3/mission-zero-arena-390x844.png` | `1.532.379` | `a10a33afc68f99fd` | Piattaforma Orbitale circolare con doppio anello di risonanza al centro, 4 piloni `2×2` con strutture cronometriche e cornice da `fracture.png`. | `[VISUALMENTE VERIFICATO]` |
| **Chalk Marks (`spine`)** | Esplorazione · Lulù | `docs/evidence/env-v3/explore-chalk-spine-390x844.png` | `1.335.784` | `8a807adfbc7653a5` | Asse di Servizio a spina di pesce con segni di gesso, quinte portuali laterali e margine inferiore `y > 1536` privo di scritte duplicate o pixel stirati. | `[VISUALMENTE VERIFICATO]` |

---

## 3. Evidenze da Test Automatici (`[TEST AUTOMATICO]`)

| Suite di Test | Comando | Risultato | Cosa Verifica |
| :--- | :--- | :--- | :--- |
| `tests/villages.test.mjs` | `node --test tests/villages.test.mjs` | `PASS (6/6)` | Validità delle 4 mappe ASCII `24×24`, presenza di strade/piazze/porte/prop, compilazione degli edifici e rendering offscreen di `drawVillageBackdrop` per tutti i 4 hub. |
| `tests/layouts.test.mjs` | `node --test tests/layouts.test.mjs` | `PASS` | Raggiungibilità BFS (`routeWaypoint`), calpestabilità di `start`, `nodes`, `entries`, `spawns`, `boss` e integrità geometrica di tutti i layout. |
| `tests/bundle-weight.test.mjs` | `node --test tests/bundle-weight.test.mjs` | `PASS (3/3)` | `android/build/assets/game/app.js = 456.876` byte (`<= 458.752` byte), `index.html = 17.441` byte (`<= 32.768` byte) e integrità di tutte le `215` risorse locali. |
| `tests/server-hub.test.mjs` | `node --test tests/server-hub.test.mjs` | `PASS` | Sicurezza di `server.js` (nessuna esecuzione di processi esterni, blocco path traversal, protezione API). |
| `tests/claude-guide.test.mjs` | `node --test tests/claude-guide.test.mjs` | `PASS` | Coerenza tra `CLAUDE.md`, `docs/gold/STATO.md` (citazione dell'ultima decisione `D44`), `docs/gold/DECISIONI.md` e `docs/gold/DOMANDE_APERTURE.md`. |
| Suite Completa (`npm test`) | `npm test` | **`PASS (346/346)`** | Tutte le 346 verifiche unitarie, di integrazione, sintassi Python (`python3 -I`), audio, salvataggi, boss, armi, corse e pacchettizzazione Android. |

---

## 4. Elementi in Attesa di Dispositivo Fisico (`[BLOCCATO: PENDING_DEVICE_VALIDATION]`)

- **Validazione tattile e termica su telefono Android fisico (`arm64-v8a`)**:
  - Il bundle Android (`android/build/assets/game/app.js` + `215` risorse) è pronto e verificato entro i limiti di memoria (`456.876` byte), ma il test manuale su smartphone fisico (30 minuti continui per misura termica e latenza audio hardware) resta classificato come `[BLOCCATO: PENDING_DEVICE_VALIDATION]`.
