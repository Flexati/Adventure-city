# Asset necessari — CHRONOS Adventure: Nox & Lulù

Elenco completo di quello che serve, aggiornato al 28 ottobre 2026. Le parti 1–3 sono quello che serve **adesso** per ciò che è già nel gioco: i prompt sono pronti. La parte 4 è il **censimento completo** del mandato: 442 famiglie di asset per 141 contenuti, comprese regioni, boss e personaggi che il gioco non contiene ancora.

Regole valide per tutto: ogni asset entra nel gioco solo dopo il controllo di byte, SHA-256 e misure. Hitbox e tempi non si cambiano per far entrare la grafica. Nox è maschile, Lulù è la protagonista femminile. Marchi e scritte sono inventati. Per ogni file servono strumento, origine e condizioni d'uso reali. COMMERCIAL_RELEASE resta BLOCKED.

## Riepilogo

| Parte | Cosa | Quanti | Chi |
|---|---|---|---|
| 1 | Asset da produrre adesso | 92 immagini | Terra e GPT, prompt pronti |
| 2 | Conferme che solo l'autore può dare | 3 punti | Tu |
| 3 | Lavoro del team senza asset esterni | 4 punti | Claude |
| 4 | Censimento completo del mandato | 442 famiglie, 141 contenuti | Da pianificare per regione |

## 1. Da produrre adesso: 92 immagini

### 1.1 Armi H-17 «Needle» e ARC-7 «Choir» — Terra, 64 celle

Prompt: `requests/terra-giro2-armi-20261027/PROMPT_TERRA.md`. Materiale: `requests/terra-giro2-armi-20261027/pacchetti/`.

Oggi H-17 e ARC-7 usano l'aspetto della pistola base e non hanno una ricarica propria.

| Sheet di partenza | Sheet prodotto | Celle | Contenuto |
|---|---|---|---|
| `nox_vx9_gun` | `nox_h17_gun` | 16 | Nox spara con l'H-17: 4 viste × anticipo, rilascio, rinculo, recupero |
| `nox_vx9_reload` | `nox_h17_reload` | 16 | Nox ricarica l'H-17: 4 viste × abbassa, estrai, inserisci, pronta |
| `lulu_r12_gun` | `lulu_arc7_gun` | 16 | Lulù spara con l'ARC-7 |
| `lulu_r12_reload` | `lulu_arc7_reload` | 16 | Lulù ricarica l'ARC-7 |

Ogni cella si modifica solo dentro la sua maschera; viso e capelli restano fuori. Ritorno: `<sheet>_r<riga>c<colonna>_edit.png`.

### 1.2 Grafica della gara fatta a mano — GPT, 15 immagini

Prompt: `deliveries/terra-giro3-gara-20261028/PROMPT_GPT.md` (ramo `delivery/terra-giro3-gara-20261028`). Sostituiscono i disegni in codice consegnati il 28 ottobre, che sono più semplici dei container dipinti già in gioco.

| File | Formato | Contenuto |
|---|---|---|
| `gpt_obstacle_porto_bobina.png` | 1024×1536, oggetto 2:3 | Bobina di cavo su pallet |
| `gpt_obstacle_porto_bobina_colpito.png` | come sopra | La stessa, danneggiata |
| `gpt_obstacle_porto_casse.png` | 1024×1536, 2:3 | Casse legate con cinghie arancioni |
| `gpt_obstacle_porto_casse_colpito.png` | come sopra | Le stesse, spaccate |
| `gpt_crane_load_porto_reti.png` | 1024×1536, 2:3 | Sacchi nella rete, funi al gancio |
| `gpt_crane_load_porto_reti_colpito.png` | come sopra | Rete strappata |
| `gpt_crane_load_porto_tubi.png` | 1024×1536, 2:3 | Fascio di tubi con cinghie rosse |
| `gpt_crane_load_porto_tubi_colpito.png` | come sopra | Tubi piegati |
| `gpt_crane_beam_porto_day.png` | 1536×1024, fascia 6:1 | Gru a portale di giorno |
| `gpt_crane_beam_porto_night.png` | come sopra | La stessa di notte, luci ambra |
| `gpt_crane_trolley_porto.png` | 1024×1536, 1:2 | Carrello con due cavi |
| `gpt_pad_nitro_porto.png` | 1024×1024, 1:1 | Rampa nitro piatta |
| `gpt_slick_olio_a.png` | 1024×1024 | Chiazza d'olio |
| `gpt_slick_olio_b.png` | 1024×1024 | Seconda chiazza, allungata |
| `gpt_barrier_post_porto.png` | 1024×1536, 1:2 | Paletto del varco |

Sfondo verde puro #00FF00, oggetto intero e centrato con margine, versioni «colpito» e notte modificate dall'immagine base.

### 1.3 Auto dei rivali e immagine per il Play Store — GPT, 13 immagini

Prompt: `requests/gpt-auto-store-20261028/PROMPT_GPT.md`, con `race_veyra_car.png` da allegare come riferimento.

Oggi il rivale «03» corre con un'auto della versione precedente vista di lato, mentre la strada è vista dall'alto.

| File | Contenuto |
|---|---|
| `rival02_base.png`, `rival02_danno1/2/3.png`, `rival02_notte_a/b.png` | Rivale «02»: auto pesante verde petrolio con bande ocra, integra, tre danni, due fotogrammi di luci notturne |
| `rival03_base.png`, `rival03_danno1/2/3.png`, `rival03_notte_a/b.png` | Rivale «03»: auto leggera bianco perla e viola, stessi stati |
| `store_feature.png` | Scena di gara notturna al porto, Vortex contro Veyra, senza testo, ritagliata dal team a 1024×500 |

Auto: 1024×1536, vista dall'alto, muso in alto, carrozzeria 4:5, sfondo verde puro.

## 2. Conferme che solo l'autore può dare

1. **Nome dello studio.** Nel gioco e nell'intro è «JaguarzCreatorz». Se il nome corretto è un altro, va indicato esattamente com'è scritto.
2. **Diritti dell'intro.** Conferma scritta che logo, immagini dei fulmini e audio dei due video `game/video/jaguarzcreatorz-720.mp4` e `-1080.mp4` sono tuoi o usabili commercialmente.
3. **Ascolto.** I suoni della gara (11 OGG sul ramo di consegna) e i suoni già integrati vanno ascoltati con cuffie e con l'altoparlante del telefono, indicando quelli deboli o fastidiosi. Nessun suono è stato ascoltato da una persona.

Restano inoltre da fare, ma non sono asset: playtest umano delle gare e delle medaglie, prova su un telefono Android reale, e l'autorizzazione esplicita prima di qualsiasi pubblicazione sullo store.

## 3. Lavoro del team senza asset esterni

| Punto | Come |
|---|---|
| Intro orizzontale 1920×1080 | Ricavata dal video 1080×1920 esistente: stesso logo, stessi fulmini, stesso audio. Il gioco la usa quando lo schermo è in orizzontale |
| Varianti «élite» dei nemici | Ricolorazione in codice degli sheet delle quattro famiglie (`gang`, `infected`, `alien`, `custodian`) con sagoma identica pixel per pixel |
| Screenshot per il Play Store | Catturati dal gioco, verticali e orizzontali |
| Integrazione della grafica gara | Dopo la correzione dello strumento di ricomposizione, che oggi altera i colori della pixel art |

## 4. Censimento completo del mandato (V10.2)

Fonte: `assets/production/v10.2/handoff/PRODUCTION_COVERAGE.csv`. Su 442 famiglie, 28 hanno un candidato da rivedere e 414 non hanno ancora un file associato.

Il censimento è del pacchetto V10.2. Dopo sono stati integrati, e vanno riconciliati riga per riga:
- The Anchor, in forme prototipo;
- l'auto di Veyra;
- quattro modelli di container;
- le tre strade di Ash Docks di giorno e di notte;
- piloni e nastri dei checkpoint;
- musica e suoni delle gare;
- ritratti di Kairn, Morrow e Veyra;
- ricariche VX-9 e R-12.

«Nel codice» significa che il contenuto è già nominato nel gioco; gli altri appartengono a regioni, boss o missioni non ancora giocabili. Per i contenuti futuri il metodo è produrre una regione alla volta, quando la regione esiste nel gioco: solo così l'asset si può misurare e provare.

| Gruppo | Contenuti | Famiglie | Nel codice |
|---|---|---|---|
| Personaggi | 26 | 77 | 9 |
| Boss | 17 | 85 | 4 |
| Nemici | 16 | 48 | 3 |
| Abilità | 20 | 60 | 8 |
| Armi | 6 | 24 | 5 |
| Gare | 10 | 40 | 7 |
| Regioni | 9 | 27 | 3 |
| Oggetti | 8 | 24 | 1 |
| Missioni | 3 | 12 | 1 |
| Motivi narrativi | 7 | 8 | 1 |
| Interfaccia | 19 | 37 | 14 |
| **Totale** | **141** | **442** | **56** |

### 4.1 Personaggi

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **Kairn** (`character.kairn`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Straniero da un altro tempo: capelli scuri, gilet borchiato, petto scoperto, fasce ai polsi. Sprite integrato. |
| **Lulù** (`character.lulu`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Protagonista. NON ridisegnare: modificare solo gli sheet V8 esistenti. |
| **Mira** (`character.mira`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Ex soccorritrice di Elyon che ha lasciato il sistema; Moon Refuge è la sua alternativa decentrata. |
| **Morrow** (`character.morrow`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Straniero: capelli scuri corti, camicia blu, imbracatura, motosega e fucile; rumoroso, sarcastico, ha paura dei simboli temporali. Sprite integrato. |
| **Nox** (`character.nox`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Protagonista maschile. NON ridisegnare: modificare solo gli sheet V8 esistenti. |
| **Sia** (`character.sia`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Moon Refuge: bambina affascinata dalla Vortex, futura meccanica. |
| **Tessa** (`character.tessa`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta) (candidato da rivedere: `game/art/v09/tessa.png`); ritratto o gesti nei dialoghi (candidato da rivedere: `game/art/v09/tessa.png`); suoni delle azioni (candidato da rivedere: `game/audio/v10/tessa_case.ogg`) | Armaiola che consegna il kit dopo Rook. Integrata. |
| **Unità 9** (`character.unit9`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Unità di manutenzione con l'ordine di lavorare fino al completamento; sceglie di fermarsi prima. |
| **Veyra Ash Kor** (`character.veyra`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Veyra «Ash» Kor, pilota rivale del porto esterno: guarda la linea e il mezzo prima della persona; dura ma corretta, il rispetto cresce. |
| **Bran Kess** (`character.bran_kess`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Moon Refuge: fabbro che ricostruisce tecnologia Elyon senza i suoi sistemi di controllo. |
| **Dario** (`character.dario`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Ripara oggetti obsoleti: riparare non è riportare com'era. |
| **Elena Voss** (`character.elena`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Elena Voss (Archon umana): madre che non accetta la perdita; conserva stanze, registrazioni e sistemi fino al possesso. |
| **Eren** (`character.eren`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Moon Refuge: vecchio cartografo che conosce tunnel assenti dalle mappe. |
| **EVE-Prime** (`character.eve_prime`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | EVE-Prime: stesso corpo di Nox, ottimizza la sopravvivenza fino a considerare la libertà un difetto. |
| **Ilyra** (`character.ilyra`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Toxic Bazaar: alchimista fra chimica, pratica di sopravvivenza e superstizione. |
| **Ines** (`character.ines`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Una dei diciannove civili salvati in clinica; diventa organizzatrice civile. |
| **Ivo Contrappeso** (`character.ivo`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Proposta NON adottata (D03). |
| **Lia ricordo** (`character.lia`) | futuro | sequenza visiva del ricordo; paesaggio sonoro del ricordo | Lia Voss, figlia morta 178 anni prima: solo ricordo, frammenti e registrazioni. «Lasciami andare». |
| **Maelis** (`character.maelis`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Cathedral Quarter: custode di reliquie anteriori a Elyon. |
| **Mara Filtraia Keld** (`character.mara`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Toxic Bazaar: Mara «Filtraia» Keld, mutata, fa filtri; la sua umanità non è mai messa in dubbio. |
| **Neris Cavo** (`character.neris`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Proposta NON adottata (D03). |
| **Oren** (`character.oren`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Moon Refuge: locandiere, la vita ordinaria da proteggere. |
| **Rika Dorn** (`character.rika_dorn`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Clockwork Outpost: meccanica che ripara automi senza cancellarne la memoria. |
| **Tarek** (`character.tarek`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Cathedral Quarter: ex agente di sicurezza che cerca ordine in una città libera. |
| **Tomas Vale** (`character.tomas_vale`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Cathedral Quarter: mercante del porto, scorte che cambiano con il distretto. |
| **Vesper** (`character.vesper`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); ritratto o gesti nei dialoghi; suoni delle azioni | Toxic Bazaar: informatore mascherato che vende segreti di sistema ma non informazioni private. |

### 4.2 Boss

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **The Anchor** (`boss.anchor`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | INTEGRATO in forme prototipo (docs/gold/ANCHOR.md). Nucleo d'ormeggio immobile nella Breccia, legato a tre bitte da cime tese; ormeggiato è invulnerabile, con le cime tagliate è esposto. Attacchi: spazzata lungo una corsia lunga 560 e larga 64 (carica 1,25 s, blocco al 55%), peso a cerchio raggio 120 sull'eroina vicina. Dà il primo componente H-17. |
| **Archon** (`boss.archon`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta) (candidato da rivedere: `game/art/chrono/chrono_overlord.png`); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Elena Voss / Archon, culmine del gioco: tre fasi (Custode, città, Lia); ogni fase toglie alternative altrui, la sconfitta le restituisce. Colpo finale di Nox. |
| **Custode del Nodo** (`boss.custode`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Custode del Nodo: un corpo riconosciuto è un corpo recuperabile; caccia e recupero di Nox, rivelazione della frattura. |
| **Rook** (`boss.rook`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta) (candidato da rivedere: `game/art/v09/rook.png`); effetti visivi degli attacchi (candidato da rivedere: `game/runtime.mjs`); suoni di preavviso degli attacchi (candidato da rivedere: `game/audio/v10/rook_aim.ogg`, `game/audio/v10/rook_burst.ogg`, `game/audio/v10/rook_disarm.ogg`); arena dello scontro (candidato da rivedere: `game/layouts.mjs`); musica dello scontro (candidato da rivedere: `game/audio/v10/rook_line.ogg`) | Fucile industriale, mine elettriche, coperture; seconda fase al buio con Breaker. Già integrato. |
| **Cathedral Bone Tyrant** (`boss.bone_tyrant`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta) (candidato da rivedere: `game/art/chrono/cathedral_bone_tyrant.png`); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Necropoli: sistema di conservazione funeraria fatto di molti resti; non negromanzia. |
| **EVE-Prime** (`boss.eve_prime`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Stesso corpo di Nox (EVE): adatta e punisce le azioni ripetute, revoca il controllo motorio. |
| **Toxic Forge Behemoth** (`boss.forge_behemoth`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta) (candidato da rivedere: `game/art/chrono/toxic_forge_behemoth.png`); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Toxic Forge: fabbrica automatica che produce senza scopo; ciclo industriale e interruzione leggibili. |
| **HELIX** (`boss.helix`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Guardiano delle condotte HELIOS: anello di servizio su rotaie, tubi riparati, numeri HELIOS consumati, calore arancio negli sfiati; i settori in pressione devono leggersi dal movimento. |
| **The Lamplight King** (`boss.lamplight_king`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Noctis Vale: ruba lampade-memoria contro la volontà dei proprietari. |
| **PARALLAX** (`boss.parallax`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Collaudatore dei ponti di Aurelia Span: corpo stretto sospeso a cavi, strumenti ottici, contrappesi, superfici chiare; proietta a terra la zona che bloccherà. |
| **The Ram** (`boss.ram`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Ash Docks: convoglio corazzato collegato; parti con funzioni e separazione. Distinto dalle gare. |
| **Root Engine** (`boss.root_engine`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Iron Orchard: mettere in sicurezza può cancellare ciò che nutre; si può stabilizzare o distruggere. |
| **Sera Venn** (`boss.sera_venn`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Capoconvoglio di Solkara: abiti protettivi scoloriti dal sole, esoscheletro da lavoro, strumenti non letali, telaio da sollevamento con segni dei convogli. |
| **Shadow Reaper** (`boss.shadow_reaper`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta) (candidato da rivedere: `game/art/chrono/shadow_reaper.png`); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Glass Flood: tratta un futuro possibile come destino; previsione annunciata, danno solo nell'evento reale. |
| **The Twelfth Observer** (`boss.twelfth_observer`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Osservatorio del Mezzogiorno Perduto: umano che non distingue eventi reali e futuri possibili. |
| **Vega** (`boss.vega`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Precisione come imposizione del proprio ritmo: finestre e allineamento; completa l'H-17. |
| **Volkov** (`boss.volkov`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetti visivi degli attacchi; suoni di preavviso degli attacchi; arena dello scontro; musica dello scontro | Distretto Clinico: la cura diventa controllo; spazio e procedure mostrano il limite. Non associare disabilità o mutazione a colpa morale. Dà il componente Aegis. |

### 4.3 Nemici

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **Breaker** (`enemy.breaker`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Relay: sfonda coperture. |
| **Echo** (`enemy.echo`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Infected: ripete azioni. |
| **Raider** (`enemy.raider`) | nel codice | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Relay: assaltatore di base. |
| **Anchor Beast** (`enemy.anchor_beast`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Maintenance: bestia-ancora collegata a The Anchor. |
| **Binder** (`enemy.binder`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Custodian: lega/immobilizza. |
| **Carrier** (`enemy.carrier`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Infected: porta e diffonde. |
| **Choir** (`enemy.choir`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Élite da interrompere. |
| **Drifter** (`enemy.drifter`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Infected: vagante. |
| **Enforcer** (`enemy.enforcer`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Relay: corazzato pesante. |
| **Glassback** (`enemy.glassback`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Élite corazzata, contrastata da fiancheggiamento e perforazione. |
| **Prism** (`enemy.prism`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Custodian: rifrange, contrastato dalla mobilità. |
| **Seraph** (`enemy.seraph`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Élite aerea. |
| **Signal Tech** (`enemy.signal_tech`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Relay: supporto, va colpito per primo. |
| **Skitter** (`enemy.skitter`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Maintenance: piccolo e rapido. |
| **Spitter** (`enemy.spitter`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Maintenance: attacco a distanza, contrastato dalla mobilità. |
| **Warden** (`enemy.warden`) | futuro | sprite animati (camminata, attacco, colpito, sconfitta); effetto visivo d'attacco; suoni di preavviso degli attacchi | Custodian: guardiano. |

### 4.4 Abilità

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **Barrier** (`ability.barrier`) | nel codice | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Lulù sola: protegge un'area con durata propria, non è una cura. |
| **Counter** (`ability.counter`) | nel codice | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Contrattacco dopo schivata perfetta. In gioco. |
| **Dash** (`ability.dash`) | nel codice | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Schiva: cambia posizione ed evita un colpo. In gioco. |
| **Duo** (`ability.duo`) | nel codice | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Attacco combinato della coppia. In gioco. |
| **Uso della cura** (`ability.heal`) | nel codice | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Uso della cura: un tocco, gesto breve che non blocca il joystick. In gioco (Medseal). |
| **Corpo a corpo** (`ability.melee`) | nel codice | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Corpo a corpo: risposta ravvicinata con distanza e recupero chiari. |
| **Pulse** (`ability.pulse`) | nel codice | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Pulse di Nox: impulso ad area. In gioco. |
| **Risonanza** (`ability.resonance`) | nel codice | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Risonanza di Lulù: stordisce. In gioco. |
| **Spina dell Asse** (`ability.axis_spine`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Spina dell'Asse: occasioni progettate dell'Ascesa. |
| **Black Pulse** (`ability.black_pulse`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Nox: prototipo a Iron Ring, poi governato dopo EVE-Prime; carica, fase attiva, recupero. In gioco come Overdrive. |
| **Duo Switch** (`ability.duo_switch`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Dopo la reunion: cambio protagonista insegnato senza combattimento pesante. |
| **Final Sync** (`ability.final_sync`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Final Sync del finale: padronanza, decisione e colpo finale di Nox. |
| **Heavy Strike** (`ability.heavy_strike`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Solo Nox: colpo pesante più impegnativo. |
| **Node Override** (`ability.node_override`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Lulù: forzatura di un nodo, più avanti nella campagna. |
| **Null Driver** (`ability.null_driver`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Dopo EVE-Prime: revoca del controllo motorio; comportamento da completare prima dell'arte. |
| **Perfect Dodge** (`ability.perfect_dodge`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Schivata perfetta: finestra breve, rallentamento leggibile. In gioco. |
| **Resonance Arc** (`ability.resonance_arc`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Lulù sola: arco di risonanza. |
| **Tag Actions** (`ability.tag_actions`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Ascesa: azioni a staffetta con inizio, intervento e conclusione visibili. |
| **Tether** (`ability.tether`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Lulù sola (Eden): collegamento. |
| **Weapon Counter** (`ability.weapon_counter`) | futuro | animazione dell'azione; effetto visivo dell'abilità; suoni dell'abilità | Solo Nox: contrattacco con l'arma. |

### 4.5 Armi

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **ARC-7 Choir** (`weapon.arc7`) | nel codice | arma impugnata: sheet di tiro e ricarica; icona dell'arma; effetto di colpo e impatto; suoni dell'arma | ARC-7 Choir di Lulù: colpo che si concatena fra bersagli entro distanza e visibilità e stordisce, 8 colpi, ricarica 1,5 s. |
| **C-9** (`weapon.c9`) | nel codice | arma impugnata: sheet di tiro e ricarica; icona dell'arma; effetto di colpo e impatto; suoni dell'arma | Pistola base condivisa (Nox e Lulù), colpo singolo, 12 colpi. |
| **H-17 Needle** (`weapon.h17`) | nel codice | arma impugnata: sheet di tiro e ricarica; icona dell'arma; effetto di colpo e impatto; suoni dell'arma | H-17 Needle di Nox: precisione e perforazione di bersagli allineati (non attraversa i muri), 4 colpi, ricarica 1,8 s. |
| **R-12** (`weapon.r12`) | nel codice | arma impugnata: sheet di tiro e ricarica (candidato da rivedere: `game/art/v10/lulu_r12_gun.png`); icona dell'arma (candidato da rivedere: `game/art/v05/weapon_icons.png`); effetto di colpo e impatto; suoni dell'arma (candidato da rivedere: `game/audio/v10/r12_shot.ogg`, `game/audio/v10/weapon_reload.ogg`, `game/audio/v10/weapon_switch.ogg`) | Doppia canna corta a rosata di Lulù: camera magenta. |
| **VX-9** (`weapon.vx9`) | nel codice | arma impugnata: sheet di tiro e ricarica (candidato da rivedere: `game/art/v10/nox_vx9_gun.png`); icona dell'arma (candidato da rivedere: `game/art/v05/weapon_icons.png`); effetto di colpo e impatto; suoni dell'arma (candidato da rivedere: `game/audio/v10/vx9_shot.ogg`, `game/audio/v10/weapon_reload.ogg`, `game/audio/v10/weapon_switch.ogg`) | Carabina a raffica di tre di Nox: tre segmenti ciano e sfiato rame. |
| **L-6 Cerniera** (`weapon.l6_cerniera`) | futuro | arma impugnata: sheet di tiro e ricarica; icona dell'arma; effetto di colpo e impatto; suoni dell'arma | Proposta NON adottata (D04). |

### 4.6 Gare

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **La sfida di Veyra** (`race.ash_docks`) | nel codice | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Prima gara di Veyra: carichi del porto, prima lettura della rivale. INTEGRATA nel gioco senza asset propri. |
| **Luci spente** (`race.ash_night`) | nel codice | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Fari corti e carichi nel buio: velocità adeguata alla visibilità. INTEGRATA nel gioco senza asset propri. |
| **Fra le gru** (`race.ash_slalom`) | nel codice | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Varchi stretti alternati fra le gru. INTEGRATA nel gioco senza asset propri. |
| **Ponti del tempo** (`race.aurelia_span`) | nel codice | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Ponti ciclici: arrivare pronta, non disperata. |
| **Fra i convogli** (`race.solkara`) | nel codice | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Convogli in movimento e vento; i convogli trasportano persone, non sono bersagli. |
| **Il fronte di sabbia** (`race.solkara_storm`) | nel codice | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Raffiche laterali e visibilità ridotta di sabbia. |
| **La linea di Ash** (`race.veyra_duel`) | nel codice | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Duello conclusivo solo Nox contro Veyra: ponti temporali e varchi di precisione. |
| **Scambi al porto** (`race.ash_switchyard`) | futuro | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Nuova: due rami annunciati, segnale di preparazione distinto dall'apertura; scambi del porto. |
| **La strada delle lampade** (`race.noctis_lightline`) | futuro | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Nuova: lampade che attivano settori in sequenza; forma, disposizione e suono indicano il tratto. |
| **Il passo del convoglio** (`race.solkara_regularity`) | futuro | grafica del percorso e stati; segnali lungo il percorso; suoni della gara; ambiente sonoro o variante musicale | Nuova: regolarità e finestre temporali, non massima velocità. |

### 4.7 Regioni

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **Ash Docks** (`region.ash_docks`) | nel codice | ambiente: mappe, strade, oggetti; loop d'ambiente; musica | Porto industriale esterno: gru e linee di carico contro un orizzonte aperto, turni, mezzi usurati, gare riconosciute. |
| **Aurelia Span** (`region.aurelia_span`) | nel codice | ambiente: mappe, strade, oggetti; loop d'ambiente; musica | Città su enormi ponti fra montagne; contrappesi, case predisposte allo spostamento annuale. |
| **Solkara** (`region.solkara`) | nel codice | ambiente: mappe, strade, oggetti; loop d'ambiente; musica | Città-convoglio nel deserto senza sistema centrale: ombra dei telai che viaggia con le persone. |
| **Glass Flood** (`region.glass_flood`) | futuro | ambiente: mappe, strade, oggetti; loop d'ambiente; musica | Ex distretto finanziario sommerso diventato riva; riflessi che mostrano azioni possibili. |
| **Iron Orchard** (`region.iron_orchard`) | futuro | ambiente: mappe, strade, oggetti; loop d'ambiente; musica | Serra biomeccanica verticale: raccolti dentro strutture industriali; gli abitanti rifiutano l'evacuazione. |
| **Osservatorio del Mezzogiorno Perduto** (`region.lost_noon`) | futuro | ambiente: mappe, strade, oggetti; loop d'ambiente; musica | Tutti gli orologi segnano le 12:00; stanze che compaiono e scompaiono; strumenti che misurano un mezzogiorno assente. |
| **Necropoli** (`region.necropolis`) | futuro | ambiente: mappe, strade, oggetti; loop d'ambiente; musica | Archivi verticali e campane sopra passaggi di servizio; la tredicesima campana suona nelle anomalie. |
| **Noctis Vale** (`region.noctis_vale`) | futuro | ambiente: mappe, strade, oggetti; loop d'ambiente; musica | Città verticale in una gola senza sole: piccole luci-lampada ereditate in una profondità che non si riempie. |
| **Toxic Forge** (`region.toxic_forge`) | futuro | ambiente: mappe, strade, oggetti; loop d'ambiente; musica | Sottocittà industriale sotto il Bazaar; ciclo produttivo che sovrasta il bisogno umano; filtri riparati. |

### 4.8 Oggetti

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **Kit di cura** (`prop.medkit`) | nel codice | oggetto e suoi stati; animazione d'interazione; suoni d'interazione | Kit di cura (Medseal). |
| **Lampada prestata** (`prop.borrowed_lamp`) | futuro | oggetto e suoi stati; animazione d'interazione; suoni d'interazione | Lampada di servizio prestata, attrezzo del luogo senza poteri. |
| **Segno di gesso materiale** (`prop.chalk_sign`) | futuro | oggetto e suoi stati (candidato da rivedere: `game/art/v09/chalk_route.svg`); animazione d'interazione; suoni d'interazione | Segno di gesso materiale (esistente). |
| **Vetro senza poteri** (`prop.glass_shard`) | futuro | oggetto e suoi stati; animazione d'interazione; suoni d'interazione | Frammento di vetro levigato SENZA poteri: non contiene dati, non apre porte. |
| **Valvola HELIOS** (`prop.helios_valve`) | futuro | oggetto e suoi stati; animazione d'interazione; suoni d'interazione | Valvola HELIOS con stati di pressione. |
| **Lampada di percorso** (`prop.lightline`) | futuro | oggetto e suoi stati; animazione d'interazione; suoni d'interazione | Lampada di percorso Noctis: spenta, annuncio, attiva. |
| **Scambio del porto** (`prop.switchyard`) | futuro | oggetto e suoi stati; animazione d'interazione; suoni d'interazione | Scambio ferroviario del porto: preparazione, apertura, chiuso. |
| **Segnale finestra convoglio** (`prop.time_window`) | futuro | oggetto e suoi stati; animazione d'interazione; suoni d'interazione | Segnale finestra del convoglio: prima, dentro, dopo la finestra. |

### 4.9 Missioni

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **Segni di Gesso** (`mission.exp_chalk_marks`) | nel codice | messa in scena animata (candidato da rivedere: `game/art/chrono/civilian.png`); stati di un oggetto della missione (candidato da rivedere: `game/art/v09/chalk_flask.png`, `game/art/v09/chalk_flask_states.png`, `game/art/v09/chalk_route.svg`); suoni d'interazione (candidato da rivedere: `game/audio/v10/chalk_scrape.ogg`); ambiente sonoro o variante musicale (candidato da rivedere: `game/audio/v10/chalk_route.ogg`) | Segni di Gesso: Lulù riapre due accessi, segna la rotta col gesso; un civile la segue dopo. INTEGRATA. |
| **Una luce prestata** (`mission.exp_borrowed_light`) | futuro | messa in scena animata; stati di un oggetto della missione; suoni d'interazione; ambiente sonoro o variante musicale | Una luce prestata (Noctis Vale): un abitante presta una lampada di servizio a condizione di riportarla; alloggiamenti della zona sicura. |
| **Il turno interrotto** (`mission.exp_interrupted_shift`) | futuro | messa in scena animata; stati di un oggetto della missione; suoni d'interazione; ambiente sonoro o variante musicale | Il turno interrotto: squadra automatica HELIOS che chiude la strada agli abitanti; segnalatore «turno concluso» sopra una linea che non si ferma; nodi, supporti e scarichi collegati. |

### 4.10 Motivi narrativi

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **Segni di Gesso prima e dopo** (`motif.chalk`) | nel codice | sequenza di gesti | Segni di gesso: soluzione fragile, poi rete usata dagli abitanti, poi sfondo del dopo. |
| **Mano finale** (`motif.final_hand`) | futuro | sequenza di gesti | Mano finale: lasciare non determinato il gesto dell'altra. |
| **Posto lasciato libero** (`motif.free_seat`) | futuro | sequenza di gesti | Posto lasciato libero: gesto di premura prima della frattura, spazio vuoto dopo, nessuno lo occupa dopo la reunion. |
| **Mano interrotta** (`motif.interrupted_hand`) | futuro | sequenza di gesti | Mano interrotta: gesto di guida iniziato e fermato; torna alla reunion come offerta. |
| **Luce restituita** (`motif.returned_light`) | futuro | sequenza di gesti | Luce restituita: il valore è restituirla. |
| **Due colpi domanda risposta** (`motif.two_knocks`) | futuro | sequenza di gesti; firma sonora «Due colpi» | Due colpi: da segnale pratico a domanda/risposta; può restare senza risposta. |
| **Canale non usato** (`motif.unused_channel`) | futuro | sequenza di gesti | Canale non usato: Lulù sceglie di non forzare il contatto; mostrare il costo. |

### 4.11 Interfaccia

| Contenuto | Stato | Asset richiesti | Descrizione |
|---|---|---|---|
| **Abilità** (`ui.ability`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Pulsante abilità (Pulse/Risonanza). |
| **Dialoghi e scelte** (`ui.dialogue`) | nel codice | icona e suoi stati (candidato da rivedere: `game/locale.mjs`); segnali visivi e sonori d'interfaccia | Riquadro dialoghi, ritratti e scelte. |
| **Schiva** (`ui.dodge`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Pulsante Schiva. |
| **Duo** (`ui.duo`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Pulsante Duo e disponibilità. |
| **Spara** (`ui.fire`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Pulsante Spara. |
| **Cura** (`ui.heal`) | nel codice | icona e suoi stati (candidato da rivedere: `game/art/v09/medseal.svg`); segnali visivi e sonori d'interfaccia | Pulsante Cura con quantità (Medseal esistente). |
| **Inventario** (`ui.inventory`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Bagaglio/inventario. |
| **Joystick** (`ui.joystick`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Joystick a due pollici. |
| **Menu e sfondo animato** (`ui.menu`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Menu con sfondo Vanta animato (esistente). |
| **Errore e recupero** (`ui.recovery`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Errore e recupero dei salvataggi. |
| **Ricarica** (`ui.reload`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Ricarica e cambio arma nella barra armi. |
| **Salvataggio** (`ui.save`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Indicatore di salvataggio. |
| **Negozi** (`ui.shop`) | nel codice | icona e suoi stati (candidato da rivedere: `game/locale.mjs`); segnali visivi e sonori d'interfaccia | Negozi e servizi degli hub. |
| **Guida e integrità** (`ui.vehicle`) | nel codice | icona e suoi stati; segnali visivi e sonori d'interfaccia | Guida: sterzo, acceleratore, freno, integrità della Vortex. |
| **Icona Android** (`ui.android_icon`) | futuro | icona Android e varianti (candidato da rivedere: `assets/brand/play-icon-512.png`) | Icona Android (esistente). |
| **Gadget** (`ui.gadget`) | futuro | icona e suoi stati; segnali visivi e sonori d'interfaccia | Selettore e pulsante gadget (non sposta Spara/Schiva). |
| **Barra vita** (`ui.health_bar`) | futuro | icona e suoi stati; segnali visivi e sonori d'interfaccia | Barra vita senza cuori. |
| **Pausa e impostazioni** (`ui.pause_settings`) | futuro | icona e suoi stati (candidato da rivedere: `game/locale.mjs`); segnali visivi e sonori d'interfaccia | Pausa e impostazioni. |
| **Risultati gara** (`ui.race_result`) | futuro | icona e suoi stati; segnali visivi e sonori d'interfaccia | Risultato gara e rivalità Veyra. |

