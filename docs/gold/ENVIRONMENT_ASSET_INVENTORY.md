# CHRONOS ADVENTURE: NOX & LULÙ — Inventario e Manifesto degli Asset Ambientali (V3)

Data di verifica: 2026-11-09  
Ramo di riferimento: `work/chronos-adventure-commercial`

---

## 1. Manifesto degli Atlanti e Sfondi Ambientali Runtime (§11.1 · `[VERIFICATO NEL REPOSITORY]`)

Tutti i file elencati sono presenti nel repository, inclusi nel pacchetto Android (`215` risorse locali verificate da `tools/prepare_android_assets.py`) e caricati in `game/runtime.mjs`. Dimensioni in pixel, peso in byte e hash SHA-256 sono stati verificati direttamente sui binari del repository.

| Asset ID (`images[...]`) | Percorso Runtime | Dimensioni (px) | Peso (byte) | SHA-256 (primi 16 hex) | Griglia / Struttura Interna | Ruolo Ambientale e Contratto di Collisione | Stato |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `chrono_environment` | `game/art/chrono/environment.png` | `512×512` | `540.529` | `1e54ade87ac2637a` | Atlante `4×4` (16 celle da `128×128` px) | **Cella 0**: grana di pavé scuro usata per strade/arene (`NONE`, calpestabile) e grana litica dei tetti (`SOLID` nei lotti `#`). **Celle 1–15**: elementi scultorei/isometrici su trasparenza (esclusi dal tiling ripetitivo a tappeto). | `[INTEGRATO NEL RUNTIME]` |
| `district_props` | `game/art/v05/district_props.png` | `1536×1024` | `2.225.340` | `d1abc9918c9602d1` | Atlante `4×4` (4 righe distretto × 4 colonne da `384×256` px) | **Riga 0** (`moon`/`city`): relè elettrici, casse corazzate, barricate.<br>**Riga 1** (`cathedral`/`port`): ancore, torrette, fari.<br>**Riga 2** (`toxic`/`clinic`): serbatoi bio, camere, barriere.<br>**Riga 3** (`clockwork`/`fracture`): obelischi e nodi cronometrici.<br>Usato per: nodi missione (`SOLID`/`INTERACT`), coperture `2×2` (`SOLID`), landmark e prop d'hub (`NONE`). | `[INTEGRATO NEL RUNTIME]` |
| `chrono_interiors` | `game/art/chrono/interiors.png` | `512×512` | `385.863` | `1d12dceb0d78ca88` | Atlante `2×2` (4 scene da `256×256` px) | Fondali dedicati per le scene d'interno dei servizi hub (`smith`, `vendor`, `inn`, `clinic`) aperte tramite `#interior`. | `[INTEGRATO NEL RUNTIME]` |
| `city` | `game/art/city.png` | `864×864` | `600.823` | `e5813fe2ab0654ee` | Scena urbana top-down completa (`864×864` px) | 4 quadranti architettonici (`iw * 0.42 × ih * 0.42`) mappati sui macro-isolati perimetrali (`SOLID`) delle missioni del Distretto 0 (`blackout`, `city`) e come fondale per scene narrative. | `[INTEGRATO NEL RUNTIME]` |
| `port` | `game/art/port.png` | `864×864` | `562.927` | `0942d8fa0f02e8ea` | Scena portuale top-down completa (`864×864` px) | 4 quadranti architettonici (banchine, gru, canali d'acqua, container) mappati sui macro-isolati perimetrali (`SOLID`) delle missioni del Distretto 1 (`breach`, `port`, `below`, `exp_chalk_marks`). | `[INTEGRATO NEL RUNTIME]` |
| `clinic` | `game/art/clinic.png` | `864×864` | `562.831` | `e5679afbaa77fc75` | Scena bio-industriale top-down completa (`864×864` px) | 4 quadranti architettonici (laboratori, condotte verdi, vasche) mappati sui macro-isolati perimetrali (`SOLID`) delle missioni del Distretto 2 (`contagion`, `archive`). | `[INTEGRATO NEL RUNTIME]` |
| `fracture` | `game/art/fracture.png` | `864×864` | `592.623` | `95f0baee493b9fbe` | Scena cronometrica/frattura top-down (`864×864` px) | 4 quadranti architettonici (faglia spazio-temporale, torri d'ottone) mappati sui macro-isolati perimetrali (`SOLID`) delle missioni del Distretto 3 (`zero`, `line`, `ascent`, `finale`). | `[INTEGRATO NEL RUNTIME]` |
| `chalk_route_art` | `game/art/v07/chalk_route_art.png` | `360×320` | `89.412` | `Verificato in runtime.mjs` | Decalcomania direzionale in gesso | Segni diegetici a terra per la missione d'esplorazione `exp_chalk_marks` e il callback in `below` (`NONE`, calpestabile). | `[INTEGRATO NEL RUNTIME]` |
| `chalk_flask_states` | `game/art/v07/chalk_flask_states.png` | `192×64` | `14.208` | `Verificato in runtime.mjs` | Striscia `4×1` (`48×64` px per frame) | Fiale d'acqua posizionate accanto ai nodi di `exp_chalk_marks` e ai civili di `below` (`NONE`). | `[INTEGRATO NEL RUNTIME]` |

---

## 2. Catalogo dei Kit Procedurali + Pixel-Art per Area (§11.2 · `[INTEGRATO NEL RUNTIME]`)

### 2.1 Kit Architettonici dei 4 Hub (`game/village-art.mjs` + `game/villages.mjs`)

| Hub ID | Tema (`VILLAGE_THEMES`) | Tetti Edifici (`buildings`) | Facciate Frontali e Soglie (`d`) | Landmark Centrale (`768, 768`) | Varianti Prop (`x`) su Suolo Calpestabile (`NONE`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `moon` | `sky:#080d16`, `street:#223042`, `plaza:#2b3d54`, `roof:#1b293b`, `wall:#131d2a`, `trim:#4c7296`, `glow:#ffbe6b`, `accent:#5fd4ff` | Grana cella `0` + doghe orizzontali `#131d2a` ogni `16` px + lucernari alternati `#5fd4ff33` / `#ffbe6b33` | Parete sud alta `24` px con finestre illuminate (`#ffbe6b` / `#5fd4ff`) e porte `d` ad arco con tappeto luminoso `56×36` px | Pozzo Lunare concentrico (`r = 78, 60, 42` px) + 4 piloni ambrati + sprite centrale `district_props` `(col 0, row 0)` | `kind 0`: lampione portuale con alone `#ffbe6b`<br>`kind 1`: cassa da carico ferrata con fascia `#5fd4ff`<br>`kind 2`: panchina in legno su suolo + dettagli `district_props` |
| `cathedral` | `sky:#090b12`, `street:#263246`, `plaza:#32415a`, `roof:#242d40`, `wall:#181f2e`, `trim:#7386ab`, `glow:#ffd27a`, `accent:#7ce2ff` | Grana cella `0` + contrafforti verticali ogni `24` px con nervature `#7386ab66` e pinnacoli `#ffd27a88` | Parete sud con bifore verticali a doppia luce e portali liturgici su soglia `d` | Rosone a 8 raggi dorati (`r = 84, 62, 34` px) + sprite centrale `district_props` `(col 0, row 1)` | `kind 0`: braciere sacro su piedistallo<br>`kind 1`: leggio/reliquiario con codice miniato<br>`kind 2`: panca da navata + dettagli `district_props` |
| `toxic` | `sky:#070d0a`, `street:#223127`, `plaza:#2b4032`, `roof:#1d2e24`, `wall:#142019`, `trim:#4d7a5e`, `glow:#8ff26b`, `accent:#ff9c4a` | Grana cella `0` + lamiera grecata verticale ogni `14` px + sfiati bio-chimici `#8ff26b26` | Parete sud in lamiera con oblò verdi/arancio e portelloni stagni su soglia `d` | Vasca di decantazione bio-chimica (`r = 80, 62, 46` px) + 4 condotte radiali + sprite `district_props` `(col 0, row 2)` | `kind 0`: fusto tossico con anello `#8ff26b`<br>`kind 1`: valvola a pressione con manometro `#ff9c4a`<br>`kind 2`: cassa bazar + dettagli `district_props` |
| `clockwork` | `sky:#0b0912`, `street:#2d2438`, `plaza:#3a2e48`, `roof:#2a2036`, `wall:#1c1526`, `trim:#8b6da8`, `glow:#ffca64`, `accent:#6de6ff` | Grana cella `0` + anelli d'ottone concentrici e perni `#6de6ff88` al centro di ciascun lotto | Parete sud in bronzo con quadranti luminosi e portali sincronizzati su soglia `d` | Astrolabio / Ingranaggio Madre (`r = 84, 64, 42` px) a 8 denti d'ottone + sprite `district_props` `(col 0, row 3)` | `kind 0`: colonna cronometrica con nucleo `#6de6ff`<br>`kind 1`: banco d'ingranaggi in ottone `#ffca64`<br>`kind 2`: terminale di calcolo + dettagli `district_props` |

---

## 3. Audit dei File Orfani o Vietati al Tiling (`[VERIFICATO NEL REPOSITORY]`)

- **Celle `1..15` di `game/art/chrono/environment.png`**:
  - Contengono lastre ad alto contrasto (`cella 1`) e miniature di singoli edifici isometrici (`celle 8..11`) o rocce/alberi isolati (`celle 12..15`).
  - **Regola vincolante applicata**: queste celle **non** vengono più usate come tile ripetuti sul pavimento o sui muri dei layout in `scenery.mjs` o `village-art.mjs`. Solo la **cella `0`** (`0, 0, 128, 128`) viene impiegata per la grana materica di asfalto e coperture.
