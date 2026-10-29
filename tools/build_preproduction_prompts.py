"""Write one GPT image prompt per preproduction board (310), from the registry and the art direction.

Input:  docs/gold/VARIANTI_PREPRODUZIONE_V10_2_20261028.json (ids, variant text)
        tools/preproduction_art_direction.py (identity, materials, colours, references)
Output: requests/gpt-preproduzione-310-20261029/prompt/<category>/<asset_id>.md
        requests/gpt-preproduzione-310-20261029/INDICE.json (path, SHA-256, references, expected files)
        registry fields prompt_path / prompt_sha256 / prompt_status (status stays SPECIFIED_NOT_GENERATED:
        a prompt is not an image).

Every prompt has the eight sections of the brief: identity and story link, subject, style, camera and
light, views/poses/animations, family consistency, background/format, restrictions; then the list of
attachments and the exact delivery file names.

usage: build_preproduction_prompts.py [--registry]
"""
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import preproduction_art_direction as AD  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
REG = ROOT / 'docs/gold/VARIANTI_PREPRODUZIONE_V10_2_20261028.json'
REQ = 'requests/gpt-preproduzione-310-20261029'
DELIVERY_BRANCH = 'delivery/gpt-preproduzione-310-20261029'
DELIVERY_DIR = 'deliveries/gpt-preproduzione-310-20261029'


def short(desc):
    """Registry description without the repeated deliverable boilerplate."""
    for cut in (' Deliverable:', ' Master + viste', ' Sheet direzionale', ' Il tempo non è definito'):
        if cut in desc:
            desc = desc.split(cut)[0]
    return desc.strip().rstrip('.')


def variant_title(desc):
    return desc.split(':')[0].strip() if ':' in desc[:60] else desc[:40]


def bans(extra=()):
    return '\n'.join(f'- {b}' for b in list(extra) + AD.COMMON_BANS)


def out_dir(e):
    return f"{DELIVERY_DIR}/{e['category']}/{e['content_id'].replace('.', '_')}"


def status_line(in_code):
    return 'contenuto già nel gioco' if in_code else 'CONCEPT_ONLY: nessuna scena giocabile, si produce lo stesso (autorizzazione dell’autore)'


# ------------------------------------------------------------------ region
def region(e):
    r = AD.REGIONS[e['content_id']]
    n = e['variant_number']
    dname = r['districts'][n]
    others = ', '.join(v for k, v in r['districts'].items() if k != n)
    v = f"v{n:02d}"
    files = [f'{v}.png', f'{v}_notte.png', f'{v}_evento.png', f'{v}_props.png']
    text = f"""Sei l'illustratore di CHRONOS Adventure: Nox & Lulù, avventura d'azione per Android. Disegna il quartiere «{dname}» della regione {e['content_name']}.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
{r['canon']}
Questo quartiere: {short(e['description'])}
Gli altri quartieri della stessa regione ({others}) condividono materiali e palette ma hanno una funzione diversa: questo deve essere riconoscibile al primo sguardo.

2. SOGGETTO, MATERIALI E COLORI
- Architettura: {r['architecture']}.
- Suolo e strade: {r['ground']}.
- Attività commerciali visibili: {r['trades']}.
- Abitanti (almeno 14, piccoli come nel gioco, ognuno impegnato in un'attività riconoscibile: lavorare, trasportare, vendere, riparare, parlare, giocare): {r['people']}.
- Oggetti ambientali da distribuire nella scena: {', '.join(r['props'])}.
- Palette di riferimento (hex): {', '.join(r['palette'])}. Ogni materiale con almeno tre toni e micro-texture.

3. STILE
{AD.STYLE['environment']}

4. INQUADRATURA, PROSPETTIVA, LUCE E COMPOSIZIONE
- Camera alta in vista dall'alto 3/4 come le mappe del gioco: tetti visibili, facciate anteriori in scorcio.
- Composizione esplorabile: una strada o passaggio principale che attraversa l'immagine dal basso all'alto, almeno due uscite laterali, piazzette e incroci dove il giocatore può fermarsi; nessun vicolo chiuso ambiguo.
- Densità alta ai lati, percorso centrale libero e leggibile con il joystick.
- Luce del giorno: {r['day']}.

5. IMMAGINI DA PRODURRE, IN QUESTO ORDINE
A. {files[0]}: il quartiere di giorno, 1536×1024, a tutto campo.
B. {files[1]}: MODIFICA l'immagine A, non rigenerarla: stessa geometria, stessi edifici e stesse persone nelle stesse posizioni. Cambiano solo la luce e le finestre. Notte: {r['night']}.
C. {files[2]}: MODIFICA l'immagine A con l'evento atmosferico: {r['event']}. Strade e uscite restano leggibili.
D. {files[3]}: foglio degli oggetti isolati, 1536×1024 su verde puro #00FF00, griglia 4×3, un oggetto per cella, stessi oggetti e stesso stile della scena: {', '.join(r['props'][:12])}.

6. COERENZA DELLA FAMIGLIA
- A, B e C sono la stessa immagine: confrontabili pixel per pixel nella geometria.
- Stessa palette e stessi materiali in tutti e quattro i quartieri di {e['content_name']}; scala di persone ed edifici uguale alle mappe del gioco (ref_stile_mappe.png).
- Gli oggetti del foglio D sono identici a quelli disegnati nella scena.

7. SFONDO, FORMATO E RISOLUZIONE
- A, B, C: PNG 1536×1024, immagine piena senza bordi, senza cornici e senza didascalie.
- D: PNG 1536×1024. {AD.GREEN_RULES}

8. RESTRIZIONI
{bans(['non cambiare la geometria fra A, B e C', 'nessuna scena generica neon intercambiabile: questa città ha la sua architettura', 'nessuna arma puntata contro civili, nessun gore', 'nessun elemento che sembri un pulsante o un indicatore di gioco'])}
"""
    return text, files, r['refs'], r.get('in_code', False)


# ------------------------------------------------------------------ character
def character(e):
    c = AD.CHARACTERS[e['content_id']]
    n = e['variant_number']
    v = f"v{n:02d}"
    vt = short(e['description'])
    if c.get('protagonist'):
        return protagonist(e, c, vt)
    files = [f'{v}.png', f'{v}_ritratti.png']
    base_rule = ("Questa è la variante master (01): fissa volto, capelli, corporatura e abiti." if n == 1 else
                 f"MODIFICA la tua immagine v01.png dello stesso personaggio (allegala): stesso volto, stessi capelli, stessa corporatura; cambiano solo gli elementi della variante «{variant_title(vt)}».")
    not_adopted = c.get('not_adopted')
    if e['content_id'] == 'character.eve_prime':
        base_rule += (" EVE-Prime ha lo stesso corpo e lo stesso volto di Nox: NON ridisegnarli. Lavora come MODIFICA IN MASCHERA dei"
                      " fotogrammi reali di Nox allegati (ref_nox.png): dentro la maschera cambiano solo uniforme e segmenti di"
                      " interfaccia rossi; volto, capelli, mani e piedi restano i pixel di Nox. Ritratti: modifica di portraits.png"
                      " (cella di Nox) solo su abiti, luce e sfondo.")
    text = f"""Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna la tavola personaggio di {e['content_name']}, variante {n:02d}.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
{e['content_name']}: {c['activity']}. Personalità visiva: {c['personality']}. Genere: {c['gender']}.
Variante {n:02d}: {vt}.
{'ATTENZIONE: proposta NON adottata (decisione D03). Studio d’archivio, non entra nel gioco.' if not_adopted else ''}

2. SOGGETTO, MATERIALI E COLORI
- Aspetto: {c['look']}.
- Materiali con usura credibile: tessuti con pieghe e cuciture, cuoio graffiato, metallo con riflessi netti.
- Palette (hex): {', '.join(c['palette'])}.
- Gesto e attività della variante: {vt}. Un oggetto di lavoro in mano o vicino quando la variante lo nomina.

3. STILE
{AD.STYLE['character']}

4. ANGOLAZIONE, PROSPETTIVA, LUCE, PROPORZIONI
- Figure intere in piedi, viste dalla camera del gioco (leggermente dall'alto), piedi tutti sulla stessa linea di base.
- Altezza della figura circa 300 px nell'immagine; stessa scala in tutte le pose.
- Luce dall'alto a sinistra, ombra propria a gradini, nessuna ombra portata a terra.

5. VISTE, POSE E VARIANTI DA PRODURRE
A. {files[0]}: model sheet 1536×1024 con sei figure in fila: fronte, schiena, lato destro, 3/4 di schiena, posa idle, gesto caratteristico della variante.
B. {files[1]}: tre ritratti busto 512×512 affiancati (1536×512) come i ritratti del gioco (ref_protagonisti.png, portraits.png): emozioni neutra, tesa, serena; sfondo pittorico scuro della sua città, nessun testo.
{base_rule}

6. COERENZA DELLA FAMIGLIA
- Lo stesso volto, gli stessi capelli e gli stessi colori in tutte le figure e nei tre ritratti.
- Le tre varianti dello stesso personaggio sono la stessa persona: cambia la situazione, non l'identità.
- Stile e scala coerenti con gli NPC del gioco (ref_npc_stile.png).

7. SFONDO, FORMATO E RISOLUZIONE
- A: PNG 1536×1024. {AD.GREEN_RULES}
- B: PNG 1536×512, sfondo pittorico scuro.

8. RESTRIZIONI
{bans(['non cambiare volto, età, corporatura o colori fra le figure', 'nessuna caricatura, nessuno stereotipo etnico o di disabilità', 'nessun tratto aggressivo se la variante non lo chiede'])}
"""
    return text, files, c['refs'], e['content_id'] in IN_CODE_CHARS


IN_CODE_CHARS = {'character.kairn', 'character.lulu', 'character.mira', 'character.morrow', 'character.nox', 'character.sia',
                 'character.tessa', 'character.unit9', 'character.veyra'}


def protagonist(e, c, vt):
    """Nox and Lulù are never redrawn: the board is composed by the team from the real V8/V10 sheets."""
    n = e['variant_number']
    v = f"v{n:02d}"
    hero = 'nox' if e['content_id'] == 'character.nox' else 'lulu'
    sheets = {
        ('nox', 1): 'game/art/v05/nox_walk.png (quattro direzioni), game/art/v05/nox_actions.png (idle e gesto), game/art/v08/portraits.png',
        ('nox', 2): 'game/art/v10/nox_h17_gun.png (H-17 in maschera, 16 celle), game/art/v10/nox_h17_reload.png',
        ('nox', 3): 'game/art/v05/nox_actions.png (schiva e contraccolpo), game/art/v05/nox_gun.png',
        ('lulu', 1): 'game/art/v05/lulu_walk.png (quattro direzioni), game/art/v05/lulu_actions.png, game/art/v08/portraits.png',
        ('lulu', 2): 'game/art/v10/lulu_arc7_gun.png (ARC-7 in maschera, 16 celle), game/art/v10/lulu_arc7_reload.png',
        ('lulu', 3): 'game/art/v05/lulu_actions.png (riga Duo), game/art/v09/reunion.png',
    }[(hero, n)]
    files = [f'{v}.png']
    text = f"""TAVOLA DA COMPORRE DAL TEAM, NON DA GENERARE.
{e['content_name']} è protagonista ({c['gender']}). Regola dell'autore: il corpo e il volto V8 non si ridisegnano. Questa tavola si compone solo con fotogrammi reali del gioco.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
{c['activity']}. Variante {n:02d}: {vt}.

2. SOGGETTO, MATERIALI E COLORI
Fotogrammi reali, senza ritocchi: {sheets}. Palette letta dagli sheet: {', '.join(c['palette'])}.

3. STILE
Lo stile è quello degli sheet originali: nessun filtro, nessun ridimensionamento non intero.

4. ANGOLAZIONE E COMPOSIZIONE
Quattro direzioni (fronte, schiena, lato, diagonale), posa idle, gesto della variante, ritratto da portraits.png, palette; stessa scala per tutte le figure, piedi sulla stessa linea.

5. VISTE E POSE
Scelte dal team fra le celle esistenti; per le varianti con arma solo celle già verificate (rapporti in docs/evidence/v10.2/production/armi/).

6. COERENZA
Identità garantita perché i pixel sono quelli del gioco: verifica SHA-256 delle sorgenti in v{n:02d}.json.

7. FORMATO
PNG 1536×1024 opaco, intestazione con ID canonico.

8. RESTRIZIONI
- nessun pixel del personaggio modificato fuori dalle maschere già approvate
- se servirà un'immagine nuova (posa che non esiste), si chiede a GPT SOLO una modifica in maschera sopra la cella reale, come per H-17/ARC-7
{bans()}
"""
    return text, files, ['ref_protagonisti.png', f'ref_{hero}.png'], True


# ------------------------------------------------------------------ enemy
def enemy(e):
    m = AD.ENEMIES[e['content_id']]
    n = e['variant_number']
    v = f"v{n:02d}"
    kind = {1: 'base', 2: 'territoriale', 3: 'élite'}[n]
    vt = short(e['description'])
    files = [f'{v}.png', f'{v}_vfx.png']
    derive = ("Variante base: fissa silhouette, proporzioni e colori." if n == 1 else
              f"MODIFICA la tua immagine v01.png dello stesso nemico (allegala): stesse pose, stesse posizioni nelle celle, stessa silhouette di base; aggiungi solo gli elementi della variante {kind}.")
    legacy = ("Nemico già nel gioco: usa lo sheet originale allegato (ref_nemici.png) come base fedele, stessa scala e stesse proporzioni; il collider del codice non cambia." if m.get('in_code') else
              "Nemico futuro: concept di preproduzione, nessun valore di gioco.")
    text = f"""Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna lo sprite sheet del nemico {e['content_name']}, variante {kind}.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Famiglia {m['family']}; ruolo in combattimento: {m['role']}. {legacy}
Variante {kind}: {vt}.

2. SOGGETTO, MATERIALI E COLORI
- Corpo e silhouette: {m['body']}.
- Movimento: {m['motion']}.
- Colore dell'avviso d'attacco e degli effetti: {m['vfx']} (unico per questo nemico).
- Materiali vissuti coerenti con la famiglia {m['family']}; la silhouette deve distinguersi dalle altre classi anche in nero pieno, non solo per tinta.

3. STILE
{AD.STYLE['creature']}

4. ANGOLAZIONE, PROSPETTIVA, LUCE
Camera del gioco leggermente dall'alto, figura intera; altezza circa 220 px in ogni cella; luce dall'alto a sinistra; piedi sulla stessa linea in tutta la riga.

5. VISTE E ANIMAZIONI (proposta: tempi e frame definitivi li decide il codice)
A. {files[0]}: sprite sheet 1536×1024, griglia 8×4 di celle 192×256:
   - riga 1: fronte, schiena, lato destro, 3/4; poi idle 4 fotogrammi;
   - riga 2: camminata 6 fotogrammi; colpito 2 fotogrammi;
   - riga 3: anticipazione 4 fotogrammi (avviso leggibile, una sola lettura); attacco 4 fotogrammi;
   - riga 4: sconfitta 6 fotogrammi; 2 celle vuote.
B. {files[1]}: effetti separati 1536×512, quattro celle 384×512: avviso (telegraph), in volo, impatto, annullato.
{derive}

6. COERENZA DELLA FAMIGLIA
- Stessa figura in tutti i fotogrammi, contorno e palette costanti, nessun fotogramma tagliato dal bordo della cella.
- Base, territoriale ed élite sono lo stesso nemico: l'élite si riconosce subito per sagoma e accessori, non solo per colore.
- Gli effetti B usano solo il colore {m['vfx']} con nucleo chiaro.

7. SFONDO, FORMATO E RISOLUZIONE
A e B: PNG. {AD.GREEN_RULES}

8. RESTRIZIONI
{bans(['la grafica non promette né nasconde un’area di danno: l’effetto copre solo la forma dell’attacco', 'nessuna nuova resistenza, arma o potere non scritti nella variante', 'nessun gore'])}
"""
    return text, files, m['refs'], m.get('in_code', False)


# ------------------------------------------------------------------ boss
def boss(e):
    b = AD.BOSSES[e['content_id']]
    n = e['variant_number']
    v = f"v{n:02d}"
    vt = short(e['description'])
    files = [f'{v}.png', f'{v}_vfx.png'] + ([f'{v}_sprite.png'] if n == 1 else [])
    runtime = b.get('runtime') or "Nessun valore di gioco esiste: durata dell'avviso, hitbox, danno e area restano null; la tavola non li suggerisce con misure."
    if e['content_id'] == 'boss.eve_prime':
        b = dict(b, body=b['body'] + ". Corpo e volto sono quelli di Nox: nella scena e nello sprite si usano MODIFICHE IN MASCHERA dei fotogrammi reali di Nox (ref_nox.png), mai un nuovo disegno del suo volto")
    derive = ("Prima tavola: fissa l'identità del boss (anche lo sprite C)." if n == 1 else
              "Allega la tua v01.png e v01_sprite.png dello stesso boss: stesso corpo, stessi colori, stessa arena.")
    text = f"""Sei l'illustratore di CHRONOS Adventure: Nox & Lulù. Disegna la tavola {n} di 4 del boss {e['content_name']}: «{variant_title(vt)}».

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
{b['body']}.
Momento di questa tavola: {vt}.
Le quattro tavole sono quattro momenti di produzione, NON quattro fasi di gioco.

2. SOGGETTO, MATERIALI E COLORI
- Corpo, materiali e dettagli unici, riconoscibili in silhouette.
- Palette (hex): {', '.join(b['palette'])}.
- Arena: {b['arena']}, con zone sicure leggibili e uscite chiare.
- Attacco o stato del momento descritto, con l'avviso (telegraph) disegnato come effetto separato e chiaramente distinto dal colpo.

3. STILE
{AD.STYLE['creature']} Le arene seguono lo stile delle mappe (ref_stile_mappe.png).

4. ANGOLAZIONE, PROSPETTIVA, LUCE, PROPORZIONI
Camera del gioco dall'alto 3/4. Nella scena compare una sagoma di Nox alta come nel gioco, solo come confronto di scala: è una silhouette scura, NON va ridisegnato. Luce dell'arena coerente con la regione.

5. IMMAGINI DA PRODURRE
A. {files[0]}: scena 1536×1024 del momento: boss nell'arena, tre pose chiave del momento (anticipo, azione, recupero) in sovrapposizione leggera o in tre riquadri.
B. {files[1]}: effetti separati 1536×512 su verde: avviso, attacco, impatto, ritorno a riposo.
{('C. ' + files[2] + ": sprite del boss 1536×1024 su verde: quattro direzioni, colpito, sconfitto; stessa scala in ogni cella.") if n == 1 else ''}
{derive}

6. COERENZA DELLA FAMIGLIA
Stesso boss, stessi colori e stessa arena nelle quattro tavole; gli effetti hanno sempre lo stesso colore d'avviso.

7. SFONDO, FORMATO E RISOLUZIONE
- A: PNG 1536×1024 a tutto campo.
- B{' e C' if n == 1 else ''}: PNG. {AD.GREEN_RULES}

8. RESTRIZIONI
- Valori di gioco: {runtime}
{bans(['nessun civile usato come arma o bersaglio', 'nessuna demonizzazione di persone, malattia o disabilità', 'il disegno non deve poter causare una falsa lettura del pericolo'])}

Brief audio per il team (non va disegnato): {b['audio']}; anticipo, attacco e recupero hanno suoni distinti.
"""
    return text, files, b['refs'], b.get('in_code', False)


# ------------------------------------------------------------------ ability
def ability(e):
    a = AD.ABILITIES[e['content_id']]
    n = e['variant_number']
    v = f"v{n:02d}"
    phase = {1: 'anticipazione', 2: 'esecuzione', 3: 'impatto e feedback', 4: 'recupero'}[n]
    vt = short(e['description'])
    files = [f'{v}_vfx.png']
    heroes = a['who']
    refs = ['ref_vfx.png'] + (['ref_nox.png'] if 'Nox' in heroes else []) + (['ref_lulu.png'] if 'Lulù' in heroes else [])
    text = f"""Sei l'illustratore degli effetti di CHRONOS Adventure: Nox & Lulù. Disegna SOLO gli effetti della mossa {e['content_name']}, fase {n} di 4: {phase}.

1. IDENTITÀ E COLLEGAMENTO NARRATIVO
Mossa di {heroes}. Forma riconoscibile: {a['shape']}. Colore unico della mossa: {a['color']} (nessun'altra mossa usa questa combinazione).
Fase {n} ({phase}): {vt}.
Il team monta l'effetto sopra i fotogrammi reali di Nox e Lulù: i protagonisti NON si disegnano (regola dell'autore, identità V8).

2. SOGGETTO, MATERIALI E COLORI
- Solo energia, particelle, scie, anelli o segni descritti nella fase; nucleo quasi bianco, colore {a['color']}, alone scuro a gradini.
- Dimensionato per un personaggio alto circa 300 px: la mano o il piede da cui parte l'effetto è indicato con un piccolo segno «+» grigio nella cella, che il team toglie.

3. STILE
{AD.STYLE['vfx']}

4. DIREZIONE DELL'AZIONE, PROSPETTIVA, LUCE
Camera del gioco dall'alto 3/4; l'effetto ha una direzione leggibile; la luce emessa non copre il personaggio né i nemici.

5. IMMAGINI DA PRODURRE
{files[0]}: 1536×1024, griglia 4×2 di celle 384×512:
- riga 1: la fase vista nelle quattro direzioni di gioco (verso il basso, verso l'alto, di lato, in diagonale);
- riga 2: quattro fotogrammi della fase in sequenza, direzione di lato.

6. COERENZA DELLA FAMIGLIA
Le quattro fasi della mossa ({e['content_name']}: anticipazione, esecuzione, impatto, recupero) usano lo stesso colore e la stessa forma base; allega le tue immagini delle fasi precedenti. Anticipazione, attacco, impatto e recupero devono distinguersi a colpo d'occhio.

7. SFONDO, FORMATO E RISOLUZIONE
PNG 1536×1024. {AD.GREEN_RULES}

8. RESTRIZIONI
{bans(['non disegnare Nox, Lulù o nemici', 'il disegno non definisce tempi, iframe, hitbox o raggi: nessun cerchio di portata spacciato per misura', 'nessuna aura persistente se la fase non la chiede'])}
"""
    return text, files, refs, e['content_id'] in IN_CODE_ABIL


IN_CODE_ABIL = {'ability.barrier', 'ability.counter', 'ability.dash', 'ability.duo', 'ability.heal', 'ability.melee', 'ability.pulse', 'ability.resonance'}
BUILD = {'region': region, 'character': character, 'enemy': enemy, 'boss': boss, 'ability': ability}


def main(update_registry=False):
    reg = json.loads(REG.read_text())
    index = []
    for e in reg['entries']:
        text, files, refs, in_code = BUILD[e['category']](e)
        team = text.startswith('TAVOLA DA COMPORRE')
        dest = f"{out_dir(e)}"
        doc = [f"# {e['asset_id']} — {e['content_name']} · v{e['variant_number']:02d}", '',
               f"Stato: **PROMPT_READY** · nessuna immagine generata · {status_line(in_code)} · `COMMERCIAL_RELEASE = BLOCKED`", '',
               f"Produzione: {'**il team compone la tavola dagli sheet reali** (non si chiede a GPT)' if team else 'GPT Immagine, poi controllo del team'}", '',
               '**Allegati da caricare in GPT** (cartella `riferimenti/`): ' + ', '.join(f'`{r}`' for r in refs), '',
               f"**Consegna**: ramo `{DELIVERY_BRANCH}`, cartella `{dest}/`, file: " + ', '.join(f'`{f}`' for f in files), '',
               f"Master atteso nel registro dopo i controlli: `{e['expected_master_path']}`", '',
               '```', text.strip(), '```', '']
        path = ROOT / REQ / 'prompt' / e['category'] / f"{e['asset_id']}.md"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text('\n'.join(doc))
        b = path.read_bytes()
        rel = str(path.relative_to(ROOT))
        sha = hashlib.sha256(b).hexdigest()
        index.append({'asset_id': e['asset_id'], 'category': e['category'], 'prompt': rel, 'sha256': sha, 'bytes': len(b),
                      'production': 'TEAM_COMPOSITION' if team else 'GPT_IMAGE', 'references': refs,
                      'delivery': [f'{dest}/{f}' for f in files], 'master': e['expected_master_path'], 'content_in_code': in_code})
        if update_registry:
            e['prompt_path'], e['prompt_sha256'] = rel, sha
            e['prompt_status'] = 'PROMPT_READY'
    (ROOT / REQ / 'INDICE.json').write_text(json.dumps({'note': 'Un prompt pronto NON è un’immagine generata: lo stato delle tavole resta quello del registro.',
                                                       'delivery_branch': DELIVERY_BRANCH, 'prompts': index}, indent=1, ensure_ascii=False) + '\n')
    if update_registry:
        REG.write_text(json.dumps(reg, indent=2, ensure_ascii=False) + '\n')
    # one file with every prompt, contents already in the game first, then the future ones
    cat_order = {'region': 0, 'enemy': 1, 'boss': 2, 'character': 3, 'ability': 4}
    ordered = sorted(index, key=lambda i: (not i['content_in_code'], cat_order[i['category']]))
    parts = ['# CHRONOS V10.2 — tutti i 310 prompt di preproduzione', '',
             'Ordine: prima i contenuti già nel gioco, poi quelli futuri. Ogni prompt è anche un file a sé in `prompt/<categoria>/`.',
             'Un prompt pronto NON è un immagine generata. `COMMERCIAL_RELEASE = BLOCKED`.', '']
    for k, i in enumerate(ordered, 1):
        parts += [f'---', '', f'<!-- {k}/310 -->', (ROOT / i['prompt']).read_text()]
    (ROOT / REQ / 'TUTTI_I_PROMPT.md').write_text('\n'.join(parts))
    by = {}
    for i in index:
        by[(i['category'], i['production'])] = by.get((i['category'], i['production']), 0) + 1
    print(len(index), 'prompts', by)


if __name__ == '__main__':
    main('--registry' in sys.argv)
