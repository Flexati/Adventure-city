# Consegna Pilota — Rifacimento Intro JaguarzCreatorz (`JAGUAR_INTRO`)

- **Dipartimenti responsabili:** Brand/Motion Artist, Art Director, Technical Artist, QA
- **Stato:** `[FATTO]` Pilota consegnato (`jaguar_logo_model_sheet.png` + prova 64×64 `jaguar_mark_1color_64px.png` + livelli tipografici separati `wordmark_layer_16x9.png` e `wordmark_layer_9x16.png`). Key art full-bleed `16:9` e `9:16` in coda per esaurimento quota giornaliera (`generic::resource_exhausted`).
- **Proposta per `docs/gold/DECISIONI.md` (NON scritta come approvata, in attesa di conferma dell'autore):**
  > **D58** | Rifacimento dell'intro dello studio JaguarzCreatorz (sostituisce la clausola di D34 sull'intro invariata) | Su istruzione dell'autore (11 novembre 2026), l'intro attuale in `game/video/jaguarzcreatorz-720.mp4` e `-1080.mp4` viene sostituita da una nuova identità di marca full-bleed (`1920×1080` e `1080×1920`) basata su Model Sheet approvato (frontale, 3/4, profilo, marchio monocromatico leggibile a 64 px) e livello tipografico separato `JAGUARZCREATORZ / PRESENTS`.

| File | Dimensioni | KB | SHA-256 | Stato | Note |
|---|---|---|---|---|---|
| `jaguar_logo_model_sheet.png` | 1920×1080 | 1061.6 KB | `99484e2a6479e4045117d376c57645a9752a9451b7ae03efd62568586270063b` | `NEURAL_MODEL_SHEET_PILOT` | Model Sheet del marchio JaguarzCreatorz (4 viste su fondo #0B1626: Frontale simmetrica, 3/4 ruggente con profondità volumetrica, Profilo, e Marchio vettoriale monocromatico bianco puro leggibile a 64×64 px). Generato con models/gemini-4-argon. |
| `jaguar_mark_1color_64px.png` | 64×64 | 10.0 KB | `8ebb459e368a07bd19686e1f18a701354b53a7338547371f3741a6f71a313395` | `DERIVED_64PX_READABILITY_PROOF` | Marchio monocromatico bianco su sfondo trasparente (64×64 px) estratto dal quadrante in basso a destra del Model Sheet per verifica di leggibilità a 64 px. |
| `wordmark_layer_16x9.png` | 1920×1080 | 33.5 KB | `ef5827365038c8e5a1e1b66445392a030999cafbe017c9cbb9901aac76d6c47b` | `SEPARATE_TRANSPARENT_WORDMARK_LAYER` | Livello tipografico trasparente separato 16:9 (1920×1080) con dicitura esatta verificata lettera per lettera: 'JAGUARZCREATORZ' + 'PRESENTS'. |
| `wordmark_layer_9x16.png` | 1080×1920 | 30.1 KB | `734a80fce9268160e83f61d70e97593249b0c5bd9510c5e337b0511307638fb5` | `SEPARATE_TRANSPARENT_WORDMARK_LAYER` | Livello tipografico trasparente separato 9:16 (1080×1920) con dicitura esatta verificata lettera per lettera: 'JAGUARZCREATORZ' + 'PRESENTS'. |
