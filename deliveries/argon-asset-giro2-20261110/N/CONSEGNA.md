# Consegna Argon Giro 2 — Gruppo N (Nemici)

Modello di generazione immagini utilizzato: `models/gemini-4-argon (generate_image native image generation tool)`
Metodo: Generazione neurale diretta tramite tool `generate_image` (nessun placeholder o disegno da codice, come prescritto dalla regola: *"If the image model cannot produce something, do NOT replace it with a placeholder: skip it and write why in CONSEGNA.md. A missing image is fine; a fake one is not."*).

| File | Dimensioni | KB | SHA-256 | Modello | Prompt / Note |
|---|---|---|---|---|---|
| `gang_shooter_a.png` | 1536×1024 | 463.1 KB | `f19bacd056d82618…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_shooter (_a): membro della gang in giacca rosso scuro col cappuccio, fucile a pompa corto; pose: fermo in guardia, passo 1, passo 2, carica attacco, colpo, ritorno in guardia. |
| `gang_shooter_a_v2.png` | 1536×1024 | 644.7 KB | `3c5a6443ea453406…` | `models/gemini-4-argon (generate_image native image generation tool)` | Seconda variante indipendente di gang_shooter_a.png generata con il modello di immagini. |
| `gang_shooter_b.png` | 1536×1024 | 691.3 KB | `295c65e3695e20c4…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_shooter (_b): fermo che respira, colpito 1, colpito 2, in ginocchio, a terra, a terra immobile. |
| `gang_shooter_b_v2.png` | 1536×1024 | 628.2 KB | `a82c4bd526234967…` | `models/gemini-4-argon (generate_image native image generation tool)` | Seconda variante indipendente di gang_shooter_b.png generata con il modello di immagini. |
| `gang_breaker_a.png` | 1536×1024 | 832.2 KB | `734816d5316fa57f…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_breaker (_a): uomo largo con scudo ricavato dallo sportello di un armadio elettrico e piede di porco; pose d'azione e attacco. |
| `gang_breaker_b.png` | 1536×1024 | 931.8 KB | `3323c7672ddd10db…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_breaker (_b): fermo che respira, colpito 1, colpito 2, in ginocchio, a terra, a terra immobile. |
| `gang_signal_a.png` | 1536×1024 | 616.4 KB | `14f62c9499c31f0f…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_signal (_a): segnalatore con radio a zaino e antenna alta piegata, razzo luminoso in mano, senza armatura; pose di movimento e segnalazione. |
| `gang_signal_b.png` | 1536×1024 | 656.1 KB | `578378572c9ae2b3…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_signal (_b): fermo che respira, colpito 1, colpito 2, in ginocchio, a terra, a terra immobile. |
| `gang_signal_b_v2.png` | 1536×1024 | 665.3 KB | `a81920411aee55de…` | `models/gemini-4-argon (generate_image native image generation tool)` | Seconda variante indipendente di gang_signal_b.png generata con il modello di immagini. |
| `gang_brute_a.png` | 1536×1024 | 1431.1 KB | `cde2c16111c847ea…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_brute (_a): il colosso della prova (prova_nemico.png) in maschera da saldatore e grembiule di cuoio con mazza a bobina elettrica. |
| `gang_brute_a_v2.png` | 1536×1024 | 727.2 KB | `9d3440b53b3d2a0d…` | `models/gemini-4-argon (generate_image native image generation tool)` | Seconda variante indipendente di gang_brute_a.png (da prova_nemico_v2.png). |

### Immagini saltate (quota giornaliera del modello di immagini esaurita: `generic::resource_exhausted: You've reached your usage limit for this model`)
In conformità alla regola *"If the image model cannot produce something, do NOT replace it with a placeholder: skip it and write why in CONSEGNA.md"*, i seguenti file non sono stati sostituiti con figure tracciate da codice e sono elencati qui per il prossimo slot di quota del modello:
- `gang_breaker_a_v2.png`, `gang_breaker_b_v2.png`
- `gang_signal_a_v2.png`
- `gang_brute_b.png`, `gang_brute_b_v2.png`
- `alien_breaker_a.png`, `alien_breaker_a_v2.png`, `alien_breaker_b.png`, `alien_breaker_b_v2.png`
- `alien_brute_a.png`, `alien_brute_a_v2.png`, `alien_brute_b.png`, `alien_brute_b_v2.png`
- `infected_brute_a.png`, `infected_brute_a_v2.png`, `infected_brute_b.png`, `infected_brute_b_v2.png`
- `port_patrol_a.png`, `port_patrol_a_v2.png`, `port_patrol_b.png`, `port_patrol_b_v2.png`


## Aggiornamento Giro 3 — Completamento Gruppo N (11 immagini nuove/rifatte)

Tutte le coppie `_a` e `_b` degli 8 archetipi nemici (`gang_shooter`, `gang_breaker`, `gang_signal`, `gang_brute`, `alien_breaker`, `alien_brute`, `infected_brute`, `port_patrol`) sono ora complete e coerenti per singolo personaggio:

| File | Dimensioni | KB | SHA-256 | Modello | Prompt / Note |
|---|---|---|---|---|---|
| `gang_breaker_b.png` | 1536×1024 | 1168.2 KB | `562c031bbce457cf…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_breaker (_b) rifatto: stesso personaggio di gang_breaker_a.png senza scritte sullo scudo; 6 pose di reazione su fondo #FF00FF. |
| `gang_shooter_b.png` | 1536×1024 | 931.4 KB | `9cd7c3acf51b47db…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_shooter (_b) riallineato con gang_shooter_a.png come riferimento: stesso tiratore in giacca rosso scuro col cappuccio, visore e fucile a pompa corto; 6 pose di reazione su fondo #FF00FF. |
| `gang_brute_b.png` | 1536×1024 | 1291.8 KB | `41638a69130fbd75…` | `models/gemini-4-argon (generate_image native image generation tool)` | gang_brute (_b) con gang_brute_a.png come riferimento: stesso colosso in maschera da saldatore e grembiule di cuoio con mazza a bobina elettrica; pose di reazione e atterramento su fondo #FF00FF. |
| `alien_breaker_a.png` | 1536×1024 | 1178.2 KB | `59bb9bf5e4e01710…` | `models/gemini-4-argon (generate_image native image generation tool)` | alien_breaker (_a): predatore della breccia basso e corazzato a quattro zampe (scarabeo cornuto, mai umano), guscio viola con giunture ciano; 6 pose d'azione su fondo #FF00FF. |
| `alien_breaker_b.png` | 1536×1024 | 946.9 KB | `429d7772976321f4…` | `models/gemini-4-argon (generate_image native image generation tool)` | alien_breaker (_b) con alien_breaker_a.png come riferimento: stesso predatore corazzato a quattro zampe in 6 pose di reazione e sconfitta su fondo #FF00FF. |
| `alien_brute_a.png` | 1536×1024 | 1292.3 KB | `d3bcb25e4153cf0c…` | `models/gemini-4-argon (generate_image native image generation tool)` | alien_brute (_a): predatore alto e curvo con due avambracci enormi a forma d'ancora, testa piccola e nucleo ciano nel petto; 6 pose d'azione su fondo #FF00FF. |
| `alien_brute_b.png` | 1536×1024 | 993.1 KB | `1a444bb4ea8e82d0…` | `models/gemini-4-argon (generate_image native image generation tool)` | alien_brute (_b) con alien_brute_a.png come riferimento: stesso colosso alieno con avambracci ad ancora in 6 pose di reazione e sconfitta su fondo #FF00FF. |
| `infected_brute_a.png` | 1536×1024 | 1309.5 KB | `d64921faaf0b52f1…` | `models/gemini-4-argon (generate_image native image generation tool)` | infected_brute (_a): infermiere infetto e gonfio in camice strappato con braccio trasformato in clava di spore verde lime; 6 pose d'azione su fondo #FF00FF. |
| `infected_brute_b.png` | 1536×1024 | 1252.2 KB | `ee9976a8a16aa2d6…` | `models/gemini-4-argon (generate_image native image generation tool)` | infected_brute (_b) con infected_brute_a.png come riferimento: stesso infermiere infetto con clava di spore in 6 pose di reazione e sconfitta su fondo #FF00FF. |
| `port_patrol_a.png` | 1536×1024 | 1211.8 KB | `40c1e001aa2e55bf…` | `models/gemini-4-argon (generate_image native image generation tool)` | port_patrol (_a): guardia di manutenzione del porto in cappotto impermeabile grigio-verde col cappuccio, maschera e lunga asta con lampada d'ispezione; 6 pose d'azione su fondo #FF00FF. |
| `port_patrol_b.png` | 1536×1024 | 950.8 KB | `3cf916b40807af37…` | `models/gemini-4-argon (generate_image native image generation tool)` | port_patrol (_b) con port_patrol_a.png come riferimento: stessa guardia del porto in 6 pose di reazione e sconfitta su fondo #FF00FF. |

Immagini saltate nel Gruppo N (Giro 3): nessuna (tutti gli 8 nemici hanno ora `_a` e `_b` completi).
