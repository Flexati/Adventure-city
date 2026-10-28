#!/usr/bin/env python3
"""Write docs/gold/ASSET_NECESSARI.md: every asset the game still needs, in one document.

Part 1-3 are the current requests (written here by hand, with their prompts). Part 4 is generated
from the V10.2 census assets/production/v10.2/handoff/PRODUCTION_COVERAGE.csv (442 requirement
families of 141 contents), with the canon one-liners of tools/build_astra_requests.py; a content is
marked "nel codice" when its id appears in game/*.mjs today.

Usage: python3 tools/build_asset_needs_doc.py
"""
import ast
import collections
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/gold/ASSET_NECESSARI.md'
CSV = ROOT / 'assets/production/v10.2/handoff/PRODUCTION_COVERAGE.csv'

FAMILY = {
    'sprite_animation_set': 'sprite animati (camminata, attacco, colpito, sconfitta)', 'telegraph_sfx_family': 'suoni di preavviso degli attacchi',
    'portrait_or_story_gestures': 'ritratto o gesti nei dialoghi', 'action_sfx_family': 'suoni delle azioni', 'action_animation': "animazione dell'azione",
    'ability_vfx': "effetto visivo dell'abilità", 'ability_sfx_family': "suoni dell'abilità", 'original_icon_states_or_layout': 'icona e suoi stati',
    'ui_feedback_family': "segnali visivi e sonori d'interfaccia", 'attack_vfx_set': 'effetti visivi degli attacchi', 'arena_visual_set': 'arena dello scontro',
    'boss_music_cues': 'musica dello scontro', 'attack_vfx': "effetto visivo d'attacco", 'ambience_or_music_variant': 'ambiente sonoro o variante musicale',
    'interaction_sfx_family': "suoni d'interazione", 'track_visual_states': 'grafica del percorso e stati', 'route_signal_visuals': 'segnali lungo il percorso',
    'race_sfx_family': 'suoni della gara', 'environment_visual_set': 'ambiente: mappe, strade, oggetti', 'ambience_loop_set': "loop d'ambiente",
    'music_cue_or_variant': 'musica', 'prop_visual_states': 'oggetto e suoi stati', 'interaction_animation': "animazione d'interazione",
    'authored_gesture_sequence': 'sequenza di gesti', 'equipped_visual_animation': 'arma impugnata: sheet di tiro e ricarica', 'weapon_icon': "icona dell'arma",
    'shot_impact_vfx': 'effetto di colpo e impatto', 'weapon_sfx_family': "suoni dell'arma", 'scene_staging_animation': 'messa in scena animata',
    'specific_prop_states': "stati di un oggetto della missione", 'memory_visual_sequence': 'sequenza visiva del ricordo',
    'memory_audio_or_soundscape': 'paesaggio sonoro del ricordo', 'android_icon_artwork_variants': 'icona Android e varianti',
    'two_knocks_signature_sfx': 'firma sonora «Due colpi»'}
GROUP = {'character': 'Personaggi', 'boss': 'Boss', 'enemy': 'Nemici', 'ability': 'Abilità', 'weapon': 'Armi', 'race': 'Gare',
         'region': 'Regioni', 'prop': 'Oggetti', 'mission': 'Missioni', 'motif': 'Motivi narrativi', 'ui': 'Interfaccia'}

HEAD = """# Asset necessari — CHRONOS Adventure: Nox & Lulù

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
"""


def desc_map():
    tree = ast.parse((ROOT / 'tools/build_astra_requests.py').read_text())
    for n in tree.body:
        if isinstance(n, ast.Assign) and getattr(n.targets[0], 'id', '') == 'DESC':
            return ast.literal_eval(n.value)
    return {}


def main():
    rows = list(csv.DictReader(CSV.open()))
    desc = desc_map()
    code = ' '.join(p.read_text() for p in (ROOT / 'game').glob('*.mjs'))
    by = collections.OrderedDict()
    for r in rows:
        by.setdefault(r['content_id'], []).append(r)
    in_code = {cid for cid in by if re.search(r'\b' + re.escape(cid.split('.', 1)[1]) + r'\b', code)}
    lines = [HEAD]
    counts = collections.Counter()
    for prefix, title in GROUP.items():
        ids = [cid for cid in by if cid.startswith(prefix + '.')]
        fam = sum(len(by[c]) for c in ids)
        counts[title] = (len(ids), fam)
    lines.append('| Gruppo | Contenuti | Famiglie | Nel codice |\n|---|---|---|---|')
    for prefix, title in GROUP.items():
        ids = [cid for cid in by if cid.startswith(prefix + '.')]
        lines.append(f'| {title} | {len(ids)} | {sum(len(by[c]) for c in ids)} | {sum(c in in_code for c in ids)} |')
    lines.append(f'| **Totale** | **{len(by)}** | **{len(rows)}** | **{len(in_code)}** |\n')
    for prefix, title in GROUP.items():
        ids = [cid for cid in by if cid.startswith(prefix + '.')]
        lines.append(f'### 4.{list(GROUP).index(prefix) + 1} {title}\n')
        lines.append('| Contenuto | Stato | Asset richiesti | Descrizione |\n|---|---|---|---|')
        for cid in sorted(ids, key=lambda c: (c not in in_code, c)):
            fams = []
            for r in by[cid]:
                label = FAMILY.get(r['family'], r['family'])
                if r['production_status'].startswith('EXISTING'):
                    label += ' (candidato da rivedere: ' + ', '.join(f'`{f}`' for f in r['candidate_files'].split(';')[:3]) + ')'
                fams.append(label)
            name = by[cid][0]['content_name']
            state = 'nel codice' if cid in in_code else 'futuro'
            text = desc.get(cid, '').replace('|', '/')
            lines.append(f'| **{name}** (`{cid}`) | {state} | {"; ".join(fams)} | {text} |')
        lines.append('')
    OUT.write_text('\n'.join(lines) + '\n')
    print(OUT, len(rows), 'families', len(by), 'contents', len(in_code), 'in code')


if __name__ == '__main__':
    main()
