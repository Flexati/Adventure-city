#!/usr/bin/env python3
"""Build the asset and audio request workbook for an external producer (GPT Astra).

Sources, never invented: the 442 requirement families of MATRICE_CONTENUTI_ASSET_V10_2.json,
the candidate links in docs/gold/ASSET_REGISTER.json, the 129 author audio briefs in
docs/production/v9/sources/03-audio-production.md, the V8.5 bible and the V10.2 mandate.
Each row states whether the family must be produced, only reviewed (a candidate exists) or is
already integrated, and gives runtime-compatible formats so delivered files can be integrated.

Usage: python3 tools/build_astra_requests.py
Writes docs/gold/astra/CHRONOS_RICHIESTE_ASTRA.xlsx and CSV copies of each sheet.
"""
import csv, json, re
from pathlib import Path
from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs/gold/astra"

# Canon one-liners taken from the bible V8.5 and the V10.2 mandate (A6, A7, sections 8-11, 2B).
DESC = {
 "boss.rook": "Fucile industriale, mine elettriche, coperture; seconda fase al buio con Breaker. Già integrato.",
 "boss.anchor": "INTEGRATO in forme prototipo (docs/gold/ANCHOR.md). Nucleo d'ormeggio immobile nella Breccia, legato a tre bitte da cime tese; ormeggiato è invulnerabile, con le cime tagliate è esposto. Attacchi: spazzata lungo una corsia lunga 560 e larga 64 (carica 1,25 s, blocco al 55%), peso a cerchio raggio 120 sull'eroina vicina. Dà il primo componente H-17.",
 "boss.volkov": "Distretto Clinico: la cura diventa controllo; spazio e procedure mostrano il limite. Non associare disabilità o mutazione a colpa morale. Dà il componente Aegis.",
 "boss.custode": "Custode del Nodo: un corpo riconosciuto è un corpo recuperabile; caccia e recupero di Nox, rivelazione della frattura.",
 "boss.vega": "Precisione come imposizione del proprio ritmo: finestre e allineamento; completa l'H-17.",
 "boss.eve_prime": "Stesso corpo di Nox (EVE): adatta e punisce le azioni ripetute, revoca il controllo motorio.",
 "boss.bone_tyrant": "Necropoli: sistema di conservazione funeraria fatto di molti resti; non negromanzia.",
 "boss.shadow_reaper": "Glass Flood: tratta un futuro possibile come destino; previsione annunciata, danno solo nell'evento reale.",
 "boss.forge_behemoth": "Toxic Forge: fabbrica automatica che produce senza scopo; ciclo industriale e interruzione leggibili.",
 "boss.root_engine": "Iron Orchard: mettere in sicurezza può cancellare ciò che nutre; si può stabilizzare o distruggere.",
 "boss.ram": "Ash Docks: convoglio corazzato collegato; parti con funzioni e separazione. Distinto dalle gare.",
 "boss.twelfth_observer": "Osservatorio del Mezzogiorno Perduto: umano che non distingue eventi reali e futuri possibili.",
 "boss.lamplight_king": "Noctis Vale: ruba lampade-memoria contro la volontà dei proprietari.",
 "boss.helix": "Guardiano delle condotte HELIOS: anello di servizio su rotaie, tubi riparati, numeri HELIOS consumati, calore arancio negli sfiati; i settori in pressione devono leggersi dal movimento.",
 "boss.sera_venn": "Capoconvoglio di Solkara: abiti protettivi scoloriti dal sole, esoscheletro da lavoro, strumenti non letali, telaio da sollevamento con segni dei convogli.",
 "boss.parallax": "Collaudatore dei ponti di Aurelia Span: corpo stretto sospeso a cavi, strumenti ottici, contrappesi, superfici chiare; proietta a terra la zona che bloccherà.",
 "boss.archon": "Elena Voss / Archon, culmine del gioco: tre fasi (Custode, città, Lia); ogni fase toglie alternative altrui, la sconfitta le restituisce. Colpo finale di Nox.",
 "region.necropolis": "Archivi verticali e campane sopra passaggi di servizio; la tredicesima campana suona nelle anomalie.",
 "region.glass_flood": "Ex distretto finanziario sommerso diventato riva; riflessi che mostrano azioni possibili.",
 "region.toxic_forge": "Sottocittà industriale sotto il Bazaar; ciclo produttivo che sovrasta il bisogno umano; filtri riparati.",
 "region.iron_orchard": "Serra biomeccanica verticale: raccolti dentro strutture industriali; gli abitanti rifiutano l'evacuazione.",
 "region.ash_docks": "Porto industriale esterno: gru e linee di carico contro un orizzonte aperto, turni, mezzi usurati, gare riconosciute.",
 "region.lost_noon": "Tutti gli orologi segnano le 12:00; stanze che compaiono e scompaiono; strumenti che misurano un mezzogiorno assente.",
 "region.solkara": "Città-convoglio nel deserto senza sistema centrale: ombra dei telai che viaggia con le persone.",
 "region.noctis_vale": "Città verticale in una gola senza sole: piccole luci-lampada ereditate in una profondità che non si riempie.",
 "region.aurelia_span": "Città su enormi ponti fra montagne; contrappesi, case predisposte allo spostamento annuale.",
 "race.ash_docks": "Prima gara di Veyra: carichi del porto, prima lettura della rivale. INTEGRATA nel gioco senza asset propri.",
 "race.ash_slalom": "Varchi stretti alternati fra le gru. INTEGRATA nel gioco senza asset propri.",
 "race.ash_switchyard": "Nuova: due rami annunciati, segnale di preparazione distinto dall'apertura; scambi del porto.",
 "race.ash_night": "Fari corti e carichi nel buio: velocità adeguata alla visibilità. INTEGRATA nel gioco senza asset propri.",
 "race.solkara": "Convogli in movimento e vento; i convogli trasportano persone, non sono bersagli.",
 "race.solkara_regularity": "Nuova: regolarità e finestre temporali, non massima velocità.",
 "race.solkara_storm": "Raffiche laterali e visibilità ridotta di sabbia.",
 "race.noctis_lightline": "Nuova: lampade che attivano settori in sequenza; forma, disposizione e suono indicano il tratto.",
 "race.aurelia_span": "Ponti ciclici: arrivare pronta, non disperata.",
 "race.veyra_duel": "Duello conclusivo solo Nox contro Veyra: ponti temporali e varchi di precisione.",
 "weapon.c9": "Pistola base condivisa (Nox e Lulù), colpo singolo, 12 colpi.",
 "weapon.vx9": "Carabina a raffica di tre di Nox: tre segmenti ciano e sfiato rame.",
 "weapon.r12": "Doppia canna corta a rosata di Lulù: camera magenta.",
 "weapon.h17": "H-17 Needle di Nox: precisione e perforazione di bersagli allineati (non attraversa i muri), 4 colpi, ricarica 1,8 s.",
 "weapon.arc7": "ARC-7 Choir di Lulù: colpo che si concatena fra bersagli entro distanza e visibilità e stordisce, 8 colpi, ricarica 1,5 s.",
 "mission.exp_chalk_marks": "Segni di Gesso: Lulù riapre due accessi, segna la rotta col gesso; un civile la segue dopo. INTEGRATA.",
 "mission.exp_interrupted_shift": "Il turno interrotto: squadra automatica HELIOS che chiude la strada agli abitanti; segnalatore «turno concluso» sopra una linea che non si ferma; nodi, supporti e scarichi collegati.",
 "mission.exp_borrowed_light": "Una luce prestata (Noctis Vale): un abitante presta una lampada di servizio a condizione di riportarla; alloggiamenti della zona sicura.",
 "character.nox": "Protagonista (lei). NON ridisegnare: modificare solo gli sheet V8 esistenti.",
 "character.lulu": "Protagonista. NON ridisegnare: modificare solo gli sheet V8 esistenti.",
 "character.veyra": "Veyra «Ash» Kor, pilota rivale del porto esterno: guarda la linea e il mezzo prima della persona; dura ma corretta, il rispetto cresce.",
 "character.elena": "Elena Voss (Archon umana): madre che non accetta la perdita; conserva stanze, registrazioni e sistemi fino al possesso.",
 "character.lia": "Lia Voss, figlia morta 178 anni prima: solo ricordo, frammenti e registrazioni. «Lasciami andare».",
 "character.eve_prime": "EVE-Prime: stesso corpo di Nox, ottimizza la sopravvivenza fino a considerare la libertà un difetto.",
 "character.mira": "Ex soccorritrice di Elyon che ha lasciato il sistema; Moon Refuge è la sua alternativa decentrata.",
 "character.dario": "Ripara oggetti obsoleti: riparare non è riportare com'era.",
 "character.ines": "Una dei diciannove civili salvati in clinica; diventa organizzatrice civile.",
 "character.unit9": "Unità di manutenzione con l'ordine di lavorare fino al completamento; sceglie di fermarsi prima.",
 "character.tessa": "Armaiola che consegna il kit dopo Rook. Integrata.",
 "character.kairn": "Straniero da un altro tempo: capelli scuri, gilet borchiato, petto scoperto, fasce ai polsi. Sprite integrato.",
 "character.morrow": "Straniero: capelli scuri corti, camicia blu, imbracatura, motosega e fucile; rumoroso, sarcastico, ha paura dei simboli temporali. Sprite integrato.",
 "character.sia": "Moon Refuge: bambina affascinata dalla Vortex, futura meccanica.",
 "character.eren": "Moon Refuge: vecchio cartografo che conosce tunnel assenti dalle mappe.",
 "character.oren": "Moon Refuge: locandiere, la vita ordinaria da proteggere.",
 "character.bran_kess": "Moon Refuge: fabbro che ricostruisce tecnologia Elyon senza i suoi sistemi di controllo.",
 "character.maelis": "Cathedral Quarter: custode di reliquie anteriori a Elyon.",
 "character.tomas_vale": "Cathedral Quarter: mercante del porto, scorte che cambiano con il distretto.",
 "character.tarek": "Cathedral Quarter: ex agente di sicurezza che cerca ordine in una città libera.",
 "character.mara": "Toxic Bazaar: Mara «Filtraia» Keld, mutata, fa filtri; la sua umanità non è mai messa in dubbio.",
 "character.vesper": "Toxic Bazaar: informatore mascherato che vende segreti di sistema ma non informazioni private.",
 "character.ilyra": "Toxic Bazaar: alchimista fra chimica, pratica di sopravvivenza e superstizione.",
 "character.rika_dorn": "Clockwork Outpost: meccanica che ripara automi senza cancellarne la memoria.",
 "character.neris": "Proposta NON adottata (D03).", "character.ivo": "Proposta NON adottata (D03).",
 "weapon.l6_cerniera": "Proposta NON adottata (D04).",
 "ability.melee": "Corpo a corpo: risposta ravvicinata con distanza e recupero chiari.",
 "ability.heavy_strike": "Solo Nox: colpo pesante più impegnativo.",
 "ability.dash": "Schiva: cambia posizione ed evita un colpo. In gioco.",
 "ability.perfect_dodge": "Schivata perfetta: finestra breve, rallentamento leggibile. In gioco.",
 "ability.counter": "Contrattacco dopo schivata perfetta. In gioco.",
 "ability.weapon_counter": "Solo Nox: contrattacco con l'arma.",
 "ability.pulse": "Pulse di Nox: impulso ad area. In gioco.",
 "ability.resonance": "Risonanza di Lulù: stordisce. In gioco.",
 "ability.resonance_arc": "Lulù sola: arco di risonanza.",
 "ability.barrier": "Lulù sola: protegge un'area con durata propria, non è una cura.",
 "ability.tether": "Lulù sola (Eden): collegamento.",
 "ability.node_override": "Lulù: forzatura di un nodo, più avanti nella campagna.",
 "ability.black_pulse": "Nox: prototipo a Iron Ring, poi governato dopo EVE-Prime; carica, fase attiva, recupero. In gioco come Overdrive.",
 "ability.null_driver": "Dopo EVE-Prime: revoca del controllo motorio; comportamento da completare prima dell'arte.",
 "ability.duo": "Attacco combinato della coppia. In gioco.",
 "ability.duo_switch": "Dopo la reunion: cambio protagonista insegnato senza combattimento pesante.",
 "ability.tag_actions": "Ascesa: azioni a staffetta con inizio, intervento e conclusione visibili.",
 "ability.axis_spine": "Spina dell'Asse: occasioni progettate dell'Ascesa.",
 "ability.final_sync": "Final Sync del finale: padronanza, decisione e colpo finale di Nox.",
 "ability.heal": "Uso della cura: un tocco, gesto breve che non blocca il joystick. In gioco (Medseal).",
 "ui.menu": "Menu con sfondo Vanta animato (esistente).", "ui.android_icon": "Icona Android (esistente).",
 "ui.joystick": "Joystick a due pollici.", "ui.fire": "Pulsante Spara.", "ui.dodge": "Pulsante Schiva.", "ui.ability": "Pulsante abilità (Pulse/Risonanza).",
 "ui.heal": "Pulsante Cura con quantità (Medseal esistente).", "ui.gadget": "Selettore e pulsante gadget (non sposta Spara/Schiva).",
 "ui.reload": "Ricarica e cambio arma nella barra armi.", "ui.duo": "Pulsante Duo e disponibilità.", "ui.health_bar": "Barra vita senza cuori.",
 "ui.vehicle": "Guida: sterzo, acceleratore, freno, integrità della Vortex.", "ui.dialogue": "Riquadro dialoghi, ritratti e scelte.",
 "ui.inventory": "Bagaglio/inventario.", "ui.shop": "Negozi e servizi degli hub.", "ui.race_result": "Risultato gara e rivalità Veyra.",
 "ui.pause_settings": "Pausa e impostazioni.", "ui.recovery": "Errore e recupero dei salvataggi.", "ui.save": "Indicatore di salvataggio.",
 "motif.free_seat": "Posto lasciato libero: gesto di premura prima della frattura, spazio vuoto dopo, nessuno lo occupa dopo la reunion.",
 "motif.chalk": "Segni di gesso: soluzione fragile, poi rete usata dagli abitanti, poi sfondo del dopo.",
 "motif.unused_channel": "Canale non usato: Lulù sceglie di non forzare il contatto; mostrare il costo.",
 "motif.interrupted_hand": "Mano interrotta: gesto di guida iniziato e fermato; torna alla reunion come offerta.",
 "motif.two_knocks": "Due colpi: da segnale pratico a domanda/risposta; può restare senza risposta.",
 "motif.returned_light": "Luce restituita: il valore è restituirla.",
 "motif.final_hand": "Mano finale: lasciare non determinato il gesto dell'altra.",
 "prop.chalk_sign": "Segno di gesso materiale (esistente).", "prop.helios_valve": "Valvola HELIOS con stati di pressione.",
 "prop.borrowed_lamp": "Lampada di servizio prestata, attrezzo del luogo senza poteri.", "prop.switchyard": "Scambio ferroviario del porto: preparazione, apertura, chiuso.",
 "prop.time_window": "Segnale finestra del convoglio: prima, dentro, dopo la finestra.", "prop.lightline": "Lampada di percorso Noctis: spenta, annuncio, attiva.",
 "prop.glass_shard": "Frammento di vetro levigato SENZA poteri: non contiene dati, non apre porte.", "prop.medkit": "Kit di cura (Medseal).",
 "enemy.raider": "Relay: assaltatore di base.", "enemy.breaker": "Relay: sfonda coperture.", "enemy.signal_tech": "Relay: supporto, va colpito per primo.",
 "enemy.enforcer": "Relay: corazzato pesante.", "enemy.skitter": "Maintenance: piccolo e rapido.", "enemy.spitter": "Maintenance: attacco a distanza, contrastato dalla mobilità.",
 "enemy.anchor_beast": "Maintenance: bestia-ancora collegata a The Anchor.", "enemy.drifter": "Infected: vagante.", "enemy.echo": "Infected: ripete azioni.",
 "enemy.carrier": "Infected: porta e diffonde.", "enemy.warden": "Custodian: guardiano.", "enemy.prism": "Custodian: rifrange, contrastato dalla mobilità.",
 "enemy.binder": "Custodian: lega/immobilizza.", "enemy.glassback": "Élite corazzata, contrastata da fiancheggiamento e perforazione.",
 "enemy.choir": "Élite da interrompere.", "enemy.seraph": "Élite aerea.",
}
# Existing runtime files found in the repository (search before requesting).
EXISTING = {
 "boss.custode.sprite_animation_set": ["game/art/v05/custodian_states.png"],
 "boss.eve_prime.sprite_animation_set": ["game/art/v05/nox_*.png (ritinto in runtime: stesso corpo)"],
 "character.nox.sprite_animation_set": ["game/art/v05/nox_walk.png", "nox_actions.png", "nox_gun.png", "nox_magic.png"],
 "character.lulu.sprite_animation_set": ["game/art/v05/lulu_walk.png", "lulu_actions.png", "lulu_gun.png", "lulu_magic.png"],
 "character.nox.portrait_or_story_gestures": ["game/art/v08/portraits.png"], "character.lulu.portrait_or_story_gestures": ["game/art/v08/portraits.png"],
 "character.eve_prime.portrait_or_story_gestures": ["game/art/v08/portraits.png"],
 "character.sia.sprite_animation_set": ["game/art/chrono/scavenger_kid.png"], "character.eren.sprite_animation_set": ["game/art/chrono/traveling_bard.png"],
 "character.oren.sprite_animation_set": ["game/art/chrono/innkeeper.png"], "character.bran_kess.sprite_animation_set": ["game/art/chrono/blacksmith.png"],
 "character.maelis.sprite_animation_set": ["game/art/chrono/relic_priestess.png"], "character.tomas_vale.sprite_animation_set": ["game/art/chrono/merchant.png"],
 "character.tarek.sprite_animation_set": ["game/art/chrono/gate_guard.png"], "character.mara.sprite_animation_set": ["game/art/chrono/toxic_mutant_zombie.png"],
 "character.vesper.sprite_animation_set": ["game/art/chrono/masked_informant.png"], "character.ilyra.sprite_animation_set": ["game/art/chrono/potion_alchemist.png"],
 "character.rika_dorn.sprite_animation_set": ["game/art/chrono/mechanic.png"],
 "weapon.c9.equipped_visual_animation": ["game/art/v05/nox_gun.png", "game/art/v05/lulu_gun.png"], "weapon.c9.weapon_icon": ["game/art/v05/weapon_icons.png"],
 "enemy.raider.sprite_animation_set": ["game/art/v05/gang_states.png (ruolo condiviso)"], "enemy.breaker.sprite_animation_set": ["game/art/v05/gang_states.png (ruolo condiviso)"],
 "enemy.drifter.sprite_animation_set": ["game/art/v05/infected_states.png (ruolo condiviso)"], "enemy.warden.sprite_animation_set": ["game/art/v05/custodian_states.png (ruolo condiviso)"],
 "region.necropolis.ambience_loop_set": ["game/audio/chrono/necropolis.ogg"], "region.toxic_forge.ambience_loop_set": ["game/audio/chrono/toxic_reactor.ogg"],
 "ui.menu.original_icon_states_or_layout": ["game/art/brand/vanta-clock.webp"], "prop.medkit.prop_visual_states": ["game/art/v09/medseal.svg"],
 "ability.heal.ability_sfx_family": ["game/audio/v10/heal_seal.ogg"], "ui.vehicle.original_icon_states_or_layout": ["game/art/v05/driving_cars.png", "game/art/v05/driving_road.png"],
}
INTEGRATED = {"boss.rook.sprite_animation_set", "boss.rook.telegraph_sfx_family", "boss.rook.boss_music_cues", "character.kairn.sprite_animation_set",
              "character.morrow.sprite_animation_set", "character.kairn.action_sfx_family", "character.morrow.action_sfx_family",
              "character.tessa.sprite_animation_set", "character.tessa.action_sfx_family", "weapon.vx9.equipped_visual_animation", "weapon.r12.equipped_visual_animation",
              "weapon.vx9.weapon_sfx_family", "weapon.r12.weapon_sfx_family", "mission.exp_chalk_marks.specific_prop_states",
              "mission.exp_chalk_marks.interaction_sfx_family", "mission.exp_chalk_marks.ambience_or_music_variant", "prop.chalk_sign.prop_visual_states"}
EXCLUDED = {"character.neris", "character.ivo", "weapon.l6_cerniera"}
IN_GAME_ABILITIES = {"ability.dash", "ability.perfect_dodge", "ability.counter", "ability.pulse", "ability.resonance", "ability.black_pulse", "ability.duo", "ability.heal", "ability.melee"}
P1 = {"boss.anchor", "character.veyra", "race.ash_docks", "race.ash_slalom", "race.ash_night", "region.ash_docks", "weapon.h17", "weapon.arc7", "motif.two_knocks"}
P1_FAMILIES = {"weapon.vx9.shot_impact_vfx", "weapon.r12.shot_impact_vfx", "weapon.c9.shot_impact_vfx", "character.kairn.portrait_or_story_gestures", "character.morrow.portrait_or_story_gestures"}
NOT_IN_GAME = {"boss.volkov", "boss.vega", "boss.root_engine", "boss.ram", "boss.twelfth_observer", "boss.lamplight_king", "boss.helix", "boss.sera_venn",
               "boss.parallax", "region.necropolis", "region.glass_flood", "region.toxic_forge", "region.iron_orchard", "region.lost_noon", "region.solkara", "region.noctis_vale",
               "region.aurelia_span", "race.ash_switchyard", "race.solkara", "race.solkara_regularity", "race.solkara_storm", "race.noctis_lightline", "race.aurelia_span",
               "race.veyra_duel", "mission.exp_interrupted_shift", "mission.exp_borrowed_light", "enemy.anchor_beast", "enemy.glassback", "enemy.choir", "enemy.seraph"}

SPRITE_MASTER = ("PNG RGBA trasparente, griglia uniforme 4 colonne; figura intera con piedi visibili, almeno 12 px di margine dalla cella, "
                 "nessuna parte che esce dalla cella; vista dall'alto 3/4 come Nox/Lulù; faccia a destra (il lato sinistro si ottiene specchiando); "
                 "figura umana alta 260-300 px nel master; luce dall'alto a sinistra; stessa densità di pixel di kairn-master.png")
VIS = {
 "sprite_animation_set": {
  "boss": ("Sprite sheet completo del boss", "7 righe × 4 frame: idle, movimento, anticipazione/telegrafo, attacco, recupero, danno, sconfitta (+ righe extra per ogni fase con forma diversa)", SPRITE_MASTER + "; boss alto 380-600 px nel master", "BOSS_<id>_sheet.png"),
  "enemy": ("Sprite sheet del nemico, silhouette propria (non una skin di altri)", "7 righe × 4 frame: idle, camminata, anticipazione, attacco, recupero, danno, sconfitta", SPRITE_MASTER, "ENEMY_<id>_sheet.png"),
  "character": ("Sprite in campo del personaggio", "4 righe × 4 frame: attesa, camminata, parla, gesto caratteristico", SPRITE_MASTER, "CHAR_<id>_sheet.png")},
 "portrait_or_story_gestures": ("Ritratto per i dialoghi", "4 espressioni: neutra, emozione principale, tensione, sollievo/chiusura", "PNG 512×512 per espressione, busto, sfondo trasparente, stessa resa di game/art/v08/portraits.png", "PORTRAIT_<id>_<expr>.png"),
 "attack_vfx_set": ("Effetti degli attacchi del boss", "per ogni attacco: telegrafo ×4, attivo ×4, impatto ×4, dissolvenza ×4", "atlante PNG RGBA, celle 128×128 (o 256×256 per aree grandi); bordi e forme leggibili anche senza colore", "VFX_<id>_<attacco>.png"),
 "attack_vfx": ("Effetto dell'attacco del nemico", "telegrafo ×4, attivo ×4, impatto ×4", "atlante PNG RGBA celle 128×128", "VFX_<id>.png"),
 "arena_visual_set": ("Arena del boss", "pavimento ×4 varianti, bordi/muri ×8, coperture/ostacoli ×6, marcatori di pericolo ×4, stato PRIMA e DOPO lo scontro", "tile PNG 128×128 senza giunture (1 tile = 64 unità di gioco), arena 24×24 tile; props su trasparente", "ARENA_<id>_*.png"),
 "environment_visual_set": ("Tileset della regione", "pavimento ×6, muri/facciate ×8, props di vita quotidiana ×12, illuminazione/insegne ×4, immagine PRIMA e DOPO l'intervento del giocatore", "tile PNG 128×128 senza giunture + props trasparenti; un'immagine-chiave 1920×1080 di riferimento", "REGION_<id>_*.png"),
 "track_visual_states": ("Elementi pista dall'alto", "tratto di strada del luogo (loop verticale), ostacoli specifici della gara ×3 stati (normale, colpito, superato), variante notte/tempesta se pertinente", "strada: PNG 720×1440 che si ripete in verticale come driving_road.png; ostacoli PNG RGBA 128×192", "RACE_<id>_*.png"),
 "route_signal_visuals": ("Segnali di percorso e checkpoint", "checkpoint attivo/superato, varco aperto/chiuso, segnale di preparazione", "PNG RGBA 128×256, forma diversa per ogni stato (non solo colore)", "RACE_<id>_signal_*.png"),
 "equipped_visual_animation": ("Protagonista con l'arma impugnata (NON ridisegnare Nox/Lulù: modificare solo arma e mani)", "sheet TIRO 4×4 (anticipo, rilascio, rinculo, recupero) + sheet RICARICA 4×4 (abbassa, estrai, inserisci, pronta); righe: lato, schiena, fronte, diagonale-schiena", "2 PNG RGBA 1305×1205 identici per griglia a game/art/v10/nox_vx9_gun.png", "<hero>_<arma>_gun.png, <hero>_<arma>_reload.png"),
 "weapon_icon": ("Icona dell'arma", "normale, selezionata, non disponibile", "PNG 128×128 nella grammatica di game/art/v05/weapon_icons.png", "ICON_<arma>_*.png"),
 "shot_impact_vfx": ("Proiettile e impatto dell'arma", "scia/proiettile ×4, impatto su corpo ×4, impatto su muro ×4", "atlante PNG RGBA celle 128×128", "VFX_<arma>_impact.png"),
 "action_animation": ("Animazione dell'azione per la protagonista (NON ridisegnare: modificare gli sheet esistenti)", "4 frame per 4 direzioni: anticipo, esecuzione, contatto, recupero", "PNG RGBA 1305×1205 come game/art/v05/<hero>_actions.png", "<hero>_<abilita>.png"),
 "ability_vfx": ("Effetto visivo dell'abilità", "carica ×4, attivo ×4, impatto/area ×4, fine ×4", "atlante PNG RGBA celle 256×256; il contorno dell'area deve coincidere con la portata reale", "VFX_<abilita>.png"),
 "original_icon_states_or_layout": ("Icona/componente UI originale", "normale, premuto, disattivato, cooldown/carica (+ errore o vuoto dove serve)", "SVG o PNG 192×192; grammatica cyberpunk CHRONOS di medseal.svg e weapon_icons.png; leggibile a 48 px e senza colore", "UI_<id>_*.svg"),
 "ui_feedback_family": ("Feedback visivo dello stato UI", "conferma, rifiuto con motivo, avviso, completato", "SVG/PNG 192×192 + micro-animazione 4 frame", "UI_<id>_feedback_*.png"),
 "android_icon_artwork_variants": ("Icona adattiva Android", "foreground, background, monocromatica", "PNG 432×432 per strato (zona sicura 264 px) + 512×512 Play", "ic_launcher_*.png"),
 "scene_staging_animation": ("Messa in scena della missione", "civile/abitanti: attesa, cammino, gesto ×4 frame", SPRITE_MASTER, "MISSION_<id>_staging.png"),
 "specific_prop_states": ("Oggetti specifici della missione", "tutti gli stati della meccanica (es. spento, in corso, attivo, guasto)", "PNG RGBA 128×128 per stato", "PROP_<id>_*.png"),
 "prop_visual_states": ("Oggetto", "tutti gli stati elencati nella descrizione", "PNG RGBA 128×128 per stato", "PROP_<id>_*.png"),
 "interaction_animation": ("Interazione con l'oggetto", "4 frame: avvicinamento mano, contatto, effetto, ritorno", "atlante PNG RGBA celle 256×256", "PROP_<id>_interact.png"),
 "authored_gesture_sequence": ("Sequenza di gesto narrativo (Nox/Lulù NON ridisegnati)", "6-8 frame per il gesto prima/trasformazione/payoff", "PNG RGBA alla scala degli sheet V8 (celle 326×301)", "MOTIF_<id>_*.png"),
 "memory_visual_sequence": ("Frammenti visivi del ricordo di Lia", "6 immagini-ricordo + 1 dissolvenza", "PNG 1920×1080 a bassa saturazione, nessun volto realistico di persone reali", "LIA_memory_*.png"),
}
AUD = {
 "telegraph_sfx_family": ("Suoni di avviso degli attacchi", "1 cue per ogni attacco telegrafato + 1 per l'impatto", "OGG ≤ 1,5 s, inizio immediato (< 10 ms di silenzio), deve anticipare il colpo"),
 "boss_music_cues": ("Musica del boss", "loop di scontro 60-90 s + stinger di cambio fase 3-6 s + chiusura 6-10 s", "OGG loop con giunzione senza dissolvenza a zero, 44,1/48 kHz"),
 "action_sfx_family": ("Suoni del personaggio", "3-5 cue: passo/presenza, gesto caratteristico, azione principale", "OGG ≤ 1,5 s"),
 "ability_sfx_family": ("Suoni dell'abilità", "carica, attivazione, impatto, fine/non disponibile", "OGG ≤ 1,5 s; il rifiuto deve distinguersi dal successo"),
 "interaction_sfx_family": ("Suoni d'interazione", "inizio, avanzamento, completato, interrotto", "OGG ≤ 1,2 s"),
 "race_sfx_family": ("Suoni di gara", "partenza semaforica, checkpoint, urto con ostacolo specifico, sorpasso rivale, arrivo", "OGG ≤ 1,5 s"),
 "weapon_sfx_family": ("Suoni dell'arma", "sparo, ricarica, a vuoto, cambio", "OGG ≤ 1 s; sparo distinguibile dalle altre quattro armi"),
 "ambience_or_music_variant": ("Brano/variante di ambiente", "1 loop + eventuale variante (notte, tensione)", "OGG loop 45-90 s, giunzione pulita"),
 "ambience_loop_set": ("Ambiente sonoro della regione", "2 loop: base e attività/pericolo", "OGG loop 45-90 s, mono-compatibile per altoparlante del telefono"),
 "music_cue_or_variant": ("Tema della regione", "1 loop esplorazione + 1 stinger arrivo", "OGG loop 60-120 s"),
 "memory_audio_or_soundscape": ("Paesaggio sonoro del ricordo di Lia", "1 traccia 40-60 s non in loop", "OGG; nessuna voce che imiti persone reali"),
 "two_knocks_signature_sfx": ("Firma sonora «Due colpi»", "colpo fisico ×2 varianti, risposta, assenza di risposta, versione ovattata a distanza", "OGG ≤ 1,5 s ciascuno; due colpi metallici fisici, non elettronici"),
 "ui_feedback_family": ("Suoni UI", "conferma, rifiuto, avviso, completato", "OGG ≤ 0,4 s, morbidi a basso volume"),
}
COMMON_AUDIO = "Master FLAC 48 kHz + OGG Vorbis; picco ≤ −1 dBFS; strumentale originale; partitura o parametri di sintesi allegati."
ALIASES = {"boss.custode": ["CUSTODE"], "boss.eve_prime": ["EVE-PRIME", "EVE PRIME"], "boss.archon": ["ARCHON", "ELENA"], "boss.helix": ["HELIOS", "HELIX"],
           "boss.rook": ["ROOK"], "region.ash_docks": ["ASH DOCKS", "PORT"], "character.lia": ["LIA"], "motif.two_knocks": ["TWO KNOCKS"], "ability.black_pulse": ["BLACK PULSE"],
           "ability.resonance": ["RESONANCE"], "ability.duo": ["DUO"], "ui.vehicle": ["VORTEX"], "race.ash_docks": ["VEYRA", "RACE"], "character.veyra": ["VEYRA"],
           "region.iron_orchard": ["IRON ORCHARD"], "region.necropolis": ["NECROPOLI"], "boss.volkov": ["VOLKOV", "CLINIC"], "boss.custode": ["CUSTODE", "NODO CENTRALE"]}

# Explicit brief links for contents whose prompts do not repeat the content name.
PROMPTS = {"boss.custode": [34, 35, 36, 37, 38], "boss.archon": [82, 83, 84, 85, 86, 87, 88, 89], "boss.eve_prime": [30, 69, 70, 71, 72, 73],
 "character.kairn": [74, 75, 76, 100], "character.morrow": [74, 75, 76, 99, 100], "character.lia": [67, 68, 89], "character.elena": [82, 89], "character.eve_prime": [30, 66],
 "motif.two_knocks": [1, 9], "motif.final_hand": [87, 91], "motif.unused_channel": [65], "prop.glass_shard": [11], "ability.resonance": [23], "ability.pulse": [95],
 "ability.black_pulse": [42], "ability.barrier": [46, 47], "ability.perfect_dodge": [102], "ability.counter": [103, 104], "ability.weapon_counter": [103, 104], "ability.dash": [105],
 "ability.duo": [4], "ability.tag_actions": [79], "ability.axis_spine": [80, 81], "ability.final_sync": [86, 87], "ability.node_override": [115],
 "enemy.signal_tech": [108, 106, 107, 112], "enemy.breaker": [109, 106, 112], "enemy.raider": [110, 107, 112], "enemy.enforcer": [111, 106, 112],
 "weapon.c9": [94], "ui.save": [118], "ui.shop": [116, 117], "ui.vehicle": [16, 17, 18, 19], "ui.dialogue": [124, 125], "ui.menu": [1, 121, 122, 123],
 "ui.pause_settings": [121, 122, 123], "ui.recovery": [126], "ui.health_bar": [6], "ui.race_result": [7, 127], "region.ash_docks": [21], "mission.exp_chalk_marks": [114, 115]}
for _id in ("enemy.skitter", "enemy.spitter", "enemy.anchor_beast", "enemy.drifter", "enemy.echo", "enemy.carrier", "enemy.warden", "enemy.prism", "enemy.binder", "enemy.glassback", "enemy.choir", "enemy.seraph"):
    PROMPTS[_id] = [106, 107, 112]


STYLE = ("Pixel art dettagliata per un'avventura d'azione premium su Android, vista dall'alto 3/4, fantascienza industriale abitata "
         "(metallo usurato, cavi riparati, luci di servizio, non solo neon), luce dall'alto a sinistra, sfondo trasparente, nessun testo, "
         "nessuna firma, nessun riferimento a persone o personaggi reali o di altre opere.")
# Ready-to-paste P1 prompts: the deliverables the game can integrate next.
P1_PROMPTS = [
 ("G1", "Grafica", "character.veyra.portrait_or_story_gestures", "PORTRAIT_veyra_{neutra,sfida,sorriso,rispetto}.png",
  f"Ritratto a mezzo busto di Veyra «Ash» Kor, pilota rivale di un porto industriale notturno: donna adulta, tuta da corsa usurata con toppe e patch di officina, occhiali da pilota alzati sulla fronte, mani segnate dal lavoro, sguardo che valuta la strada prima della persona. Quattro espressioni separate: neutra, sfida, sorriso trattenuto, rispetto. PNG 512×512 ciascuna, sfondo trasparente, resa coerente con game/art/v08/portraits.png. {STYLE}"),
 ("G2", "Grafica", "character.veyra.sprite_animation_set", "CHAR_veyra_sheet.png",
  f"Sprite sheet di Veyra «Ash» Kor (stesso personaggio di G1) in campo, griglia 4 colonne × 4 righe: riga 1 attesa appoggiata (4 frame), riga 2 camminata (4), riga 3 gesto «seguimi» verso l'auto (4), riga 4 braccia conserte che valuta (4). Faccia a destra, figura intera alta 260-300 px, almeno 12 px di margine in ogni cella, piedi visibili, stessa densità di pixel di kairn-master.png. {STYLE}"),
 ("G3", "Grafica", "race.ash_docks.track_visual_states", "RACE_veyra_car.png",
  f"Auto da corsa di Veyra vista esattamente dall'alto, stessa scala, prospettiva e resa dell'atlante game/art/v05/driving_cars.png (allegato): coupé basso, carrozzeria rosso ruggine con bande grigie e numero di gara senza testo leggibile, spoiler, luci posteriori arancio. Atlante 4×2 con celle 384×256: riga 1 intatta, danneggiata, molto danneggiata, con fumo; riga 2 vista 3/4 parcheggiata (per l'hub), frenata con scintille, due varianti di luci notte. {STYLE}"),
 ("G4", "Grafica", "race.ash_docks.track_visual_states", "RACE_ashdocks_road_day.png, RACE_ashdocks_road_night.png",
  f"Tratto di strada di gara nel porto industriale di Ash Docks visto dall'alto, 720×1440 px, che si ripete in verticale senza giunture come game/art/v05/driving_road.png: carreggiata a cinque corsie larga 460 px centrata (x 130-590), bordi con binari di gru, container impilati, bitte, pozzanghere d'olio, luci di banchina. Versione giorno-tramonto e versione notte con soli fari di servizio. {STYLE}"),
 ("G5", "Grafica", "race.ash_docks.route_signal_visuals", "RACE_ashdocks_container_{normale,colpito}.png, RACE_ashdocks_cp_{attivo,superato}.png, RACE_ashslalom_gate_{aperto,chiuso}.png",
  f"Elementi di gara visti dall'alto per Ash Docks: container da corsia 128×192 (normale e colpito/ammaccato), paletti di checkpoint del porto 128×256 (attivo luminoso e superato spento: forma diversa, non solo colore), varco fra due gru per lo slalom 256×128 (aperto e chiuso con sbarra). {STYLE}"),
 ("G6", "Grafica", "weapon.h17.equipped_visual_animation", "nox_h17_gun.png, nox_h17_reload.png",
  f"Modifica degli sheet esistenti di Nox (allegati game/art/v10/nox_vx9_gun.png e nox_vx9_reload.png): NON cambiare Nox, cambia solo l'arma in H-17 Needle, fucile di precisione lungo e sottile con canna ad ago, ottica corta e camera di caricamento a quattro colpi visibile. Due PNG 1305×1205 con la stessa griglia 4×4 e le stesse righe (lato, schiena, fronte, diagonale-schiena): TIRO (anticipo, rilascio, rinculo, recupero) e RICARICA (abbassa, estrai, inserisci, pronta). Nessuna parte fuori dalla cella. {STYLE}"),
 ("G7", "Grafica", "weapon.arc7.equipped_visual_animation", "lulu_arc7_gun.png, lulu_arc7_reload.png",
  f"Modifica degli sheet esistenti di Lulù (allegati game/art/v10/lulu_r12_gun.png e lulu_r12_reload.png): NON cambiare Lulù, cambia solo l'arma in ARC-7 Choir, emettitore compatto a bobine con tre anelli che si illuminano e un'antenna corta. Stesse due griglie 1305×1205 di G6 (tiro e ricarica). {STYLE}"),
 ("G8", "Grafica", "weapon.h17.weapon_icon", "ICON_h17_*.png, ICON_arc7_*.png",
  f"Icone 128×128 per H-17 Needle e ARC-7 Choir nella stessa grammatica di game/art/v05/weapon_icons.png (allegato): stati normale, selezionata, non disponibile; sagome distinte e leggibili a 32 px. {STYLE}"),
 ("G9", "Grafica", "weapon.vx9.shot_impact_vfx", "VFX_{c9,vx9,r12,h17,arc7}_impact.png",
  f"Cinque atlanti di effetti 4×3 con celle 128×128: per ogni arma una riga scia/proiettile, una impatto su corpo, una impatto su muro. C-9 colpo singolo pulito; VX-9 tre traccianti ciano ravvicinati; R-12 rosata magenta a ventaglio; H-17 ago bianco che attraversa e lascia una traccia lineare; ARC-7 arco elettrico violetto che salta fra punti. Forme diverse fra loro anche in scala di grigi. {STYLE}"),
 ("G10", "Grafica", "character.kairn.portrait_or_story_gestures", "PORTRAIT_kairn_{neutro,allarme}.png, PORTRAIT_morrow_{beffardo,paura}.png",
  f"Ritratti 512×512 a mezzo busto fedeli a strangers-author-reference.jpg e ai master kairn-master.png / morrow-master.png (allegati): Kairn (capelli scuri, gilet borchiato, petto scoperto, fasce ai polsi) neutro e in allarme; Morrow (capelli scuri corti, camicia blu, imbracatura) beffardo e con paura. Non devono somigliare a personaggi di film o fumetti esistenti più di quanto richieda il riferimento. {STYLE}"),
 ("G11", "Grafica", "boss.anchor.sprite_animation_set", "BOSS_anchor_sheet.png",
  f"Sprite sheet di The Anchor, macchina d'ormeggio industriale del porto che non si sposta mai: corpo largo e basso come un argano gigante (circa 2,5 volte la larghezza di Nox), anello di rivetti e bracci a ganascia, tre attacchi per le cime distribuiti a 120°, nucleo centrale protetto da piastre. 7 righe × 4 frame: idle ormeggiato (cime tese, rivetti che girano), carica della CIMA (si inclina verso il bersaglio), rilascio della cima, recupero, PESO (si solleva e ricade), danno, sconfitta (le ganasce si aprono e il nucleo si spegne). Più 1 riga NUCLEO ESPOSTO: piastre aperte e nucleo arancio incandescente (stati distinguibili anche in scala di grigi). Figura alta 380-480 px nel master, base ellittica a terra, vista dall'alto 3/4, celle uniformi con 12 px di margine. {STYLE}"),
 ("G12", "Grafica", "boss.anchor.arena_visual_set", "ARENA_anchor_bollard_{tesa,tagliata,riormeggio}.png, ARENA_anchor_cable.png, VFX_anchor_sweep.png",
  f"Elementi della Breccia per The Anchor: bitta d'ormeggio portuale 128×192 in tre stati (cima tesa con luce ciano, cima tagliata con moncone sfilacciato, ri-ormeggio con ganci che tornano); segmento di cima tesa 64×256 ripetibile in lunghezza; atlante VFX della spazzata 4×3 celle 256×128 (tensione, frustata, polvere d'impatto) leggibile come corsia larga 64 unità di gioco. {STYLE}"),
 ("A5", "Audio", "boss.anchor.telegraph_sfx_family", "anchor_moor.ogg, anchor_line_tension.ogg, anchor_sweep.ogg, anchor_line_cut.ogg, anchor_relink.ogg, anchor_exposed.ogg, anchor_weight.ogg, anchor_fight_loop.ogg",
  "Audio di The Anchor coerente con PROMPT 00 e 24 (spegnimento delle ancore della breccia): ormeggio iniziale (catene e argano), tensione della cima che sale per 1,25 s e si blocca al 55% con un cambio di timbro, frustata della spazzata, taglio di una cima (corda metallica che si spezza), ri-ormeggio (ganci e scatto), nucleo esposto (piastre che si aprono, ronzio caldo), peso che ricade. OGG ≤ 1,5 s ciascuno + loop di scontro 60-90 s con giunzione pulita, master FLAC 48 kHz, picco ≤ −1 dBFS, originali."),
 ("A1", "Audio", "motif.two_knocks.two_knocks_signature_sfx", "two_knocks_{a,b}.ogg, two_knocks_answer.ogg, two_knocks_unanswered.ogg, two_knocks_far.ogg",
  "Firma sonora «Due colpi» secondo i brief dell'autore PROMPT 01 e 09 (foglio «Brief audio autore»): due colpi fisici metallici su una superficie cava, non elettronici; due varianti, una risposta, una versione senza risposta (il silenzio dopo deve pesare), una versione ovattata a distanza. OGG ≤ 1,5 s + master FLAC 48 kHz, picco ≤ −1 dBFS."),
 ("A2", "Audio", "race.ash_docks.race_sfx_family", "race_start.ogg, race_checkpoint.ogg, race_container_hit.ogg, race_rival_pass.ogg, race_finish.ogg",
  "Effetti di gara per Ash Docks: semaforo di partenza in tre battute più il via, checkpoint del porto (campanello metallico breve), urto contro container (lamiera e cigolio), sorpasso di un'auto rivale (passaggio stereo ma comprensibile in mono), arrivo. OGG ≤ 1,5 s, inizio immediato, master FLAC 48 kHz, picco ≤ −1 dBFS, originali."),
 ("A3", "Audio", "race.ash_docks.ambience_or_music_variant", "veyra_championship.ogg, veyra_championship_night.ogg",
  "Tema del campionato di Veyra al porto: 92-100 BPM, basso analogico ruvido, percussioni industriali da banchina, motivo breve e asciutto che rappresenta la rivale (rispetto, non ostilità), spazio per motore ed effetti; variante notte più rarefatta. Coerente con la direzione PROMPT 00 (niente EDM, niente synthwave generica). Loop 60-90 s con giunzione pulita, OGG + FLAC."),
 ("A4", "Audio", "weapon.h17.weapon_sfx_family", "h17_shot.ogg, h17_reload.ogg, arc7_shot.ogg, arc7_reload.ogg",
  "Suoni di H-17 Needle (sparo secco e sibilante di precisione, coda breve; ricarica a quattro colpi meccanica) e ARC-7 Choir (scarica elettrica a più voci che salta, con piccolo coro di risonanze; ricarica a bobine che si ricaricano). Distinguibili da C-9, VX-9 e R-12 già in gioco. OGG ≤ 1 s, master FLAC, picco ≤ −1 dBFS."),
]


def briefs():
    text = (ROOT / "docs/production/v9/sources/03-audio-production.md").read_text()
    parts = re.split(r"^### PROMPT (\d+) — (.+)$", text, flags=re.M)
    out, section = [], ""
    heads = [(m.start(), m.group(1)) for m in re.finditer(r"^# (.+)$", text, flags=re.M)]
    for i in range(1, len(parts), 3):
        n, title, body = int(parts[i]), parts[i + 1].strip(), parts[i + 2]
        pos = text.find(f"### PROMPT {parts[i]} —")
        section = [h for p, h in heads if p < pos][-1] if any(p < pos for p, _ in heads) else ""
        body = re.split(r"^# ", body, flags=re.M)[0].replace("---", "").strip()
        out.append({"n": n, "title": title, "section": section.strip("\\ "), "text": body})
    return out


def main():
    matrix = json.loads((ROOT / "docs/production/v10.2/MATRICE_CONTENUTI_ASSET_V10_2.json").read_text())
    contents = {c["id"]: c for c in matrix["contents"]}
    links = {l["requirement_id"]: l["candidate_files"] for l in json.loads((ROOT / "docs/gold/ASSET_REGISTER.json").read_text())["requirement_links"]}
    bs = briefs()
    vis_rows, aud_rows = [], []
    for a in matrix["assets"]:
        fid, fam = a["id"], a["family"]
        cid = fid.rsplit(".", 1)[0]
        c = contents[cid]
        files = list(dict.fromkeys(links.get(fid, []) + EXISTING.get(fid, [])))
        if cid in EXCLUDED:
            action, prio = "NON PRODURRE — proposta non adottata", "—"
        elif fid in INTEGRATED:
            action, prio = "GIÀ INTEGRATO — non produrre", "—"
        else:
            action = "VERIFICARE ESISTENTE — produrre solo se non regge il confronto con i master nuovi" if files and not all(f.endswith(".mjs") for f in files) else "PRODURRE"
            if cid in P1 or fid in P1_FAMILIES: prio = "P1"
            elif cid in NOT_IN_GAME or (c["type"] == "ability" and cid not in IN_GAME_ABILITIES): prio = "P3"
            else: prio = "P2"
        if prio == "P3": action += " · concept/silhouette ora, file finali dopo la card dell'incontro" if action.startswith("PRODURRE") else ""
        desc = DESC.get(cid, "")
        name = c["name"]
        keys = [name.upper()] + ALIASES.get(cid, [])
        hits = {b["n"] for b in bs if any(k and k in (b["title"] + " " + b["section"]).upper() for k in keys)} | set(PROMPTS.get(cid, []))
        refs = [f"PROMPT {n:02d}" for n in sorted(hits)]
        base = {"Priorità": prio, "Azione": action, "ID famiglia": fid, "Contenuto": name, "Tipo": c["type"], "Famiglia": fam, "Descrizione canonica": desc,
                "File esistenti nel repository": "; ".join(files)}
        if fam in AUD or fam == "two_knocks_signature_sfx":
            what, states, fmt = AUD[fam]
            aud_rows.append({**base, "Cosa produrre": f"{what} — {name}", "Stati / cue": states, "Formato": fmt + " " + COMMON_AUDIO,
                             "Nome file": f"{fid}.<cue>.ogg", "Brief autore collegati": ", ".join(refs),
                             "Accettazione": "Ogni cue corrisponde a un evento reale del gioco; avvisi comprensibili senza musica; nessun clipping; loop senza scatto; diritti d'uso dichiarati."})
            if fam == "ui_feedback_family":
                pass
        if fam in VIS:
            spec = VIS[fam][c["type"]] if isinstance(VIS[fam], dict) and c["type"] in VIS[fam] else VIS[fam]
            if isinstance(spec, dict): spec = spec["character"]
            what, states, fmt, fname = spec
            vis_rows.append({**base, "Cosa produrre": f"{what} — {name}", "Stati / frame": states, "Formato": fmt,
                             "Nome file": fname.replace("<id>", cid.split(".", 1)[1]).replace("<arma>", cid.split(".", 1)[1]).replace("<abilita>", cid.split(".", 1)[1]),
                             "Accettazione": "Identità coerente con canone e riferimenti; ogni frame distinto e completo; nessuna parte tagliata; leggibile a 96-128 unità sullo schermo del telefono; forme distinguibili senza colore; diritti dichiarati."})
    order = {"P1": 0, "P2": 1, "P3": 2, "—": 3}
    vis_rows.sort(key=lambda r: (order[r["Priorità"]], r["Tipo"], r["ID famiglia"]))
    aud_rows.sort(key=lambda r: (order[r["Priorità"]], r["Tipo"], r["ID famiglia"]))
    brief_rows = [{"PROMPT": f"{b['n']:02d}", "Titolo": b["title"], "Sezione": b["section"], "Brief integrale dell'autore": b["text"],
                   "Consegna": f"AUDIO_PROMPT_{b['n']:03d}.ogg (+ FLAC master)", "Nota": "Brief dell'autore (indice, non obbligo di un brano per prompt). Usare insieme alle famiglie del foglio Audio."} for b in bs]
    return vis_rows, aud_rows, brief_rows


README = [
 ["CHRONOS Adventure: Nox & Lulù — richieste di produzione asset e audio per GPT Astra"],
 ["Generato da tools/build_astra_requests.py dalla matrice V10.2 (442 famiglie), dal registro asset e dai 129 brief audio dell'autore. Non è una lista inventata: ogni riga è un requisito del progetto."],
 [""],
 ["Come leggere"],
 ["Priorità P1", "Serve subito: contenuti già giocabili senza asset propri (gare di Veyra, Ash Docks), armi H-17/ARC-7, impatti delle armi, ritratti di Kairn e Morrow, firma «Due colpi»."],
 ["Priorità P2", "Contenuti già nel gioco con asset provvisori, condivisi o a bassa risoluzione."],
 ["Priorità P3", "Contenuti ancora da implementare: ora concept e tavole di silhouette; file finali dopo che l'incontro/meccanica esiste (regola del mandato: forma e tempi prima dello sprite)."],
 ["Azione PRODURRE", "Nessun candidato nel repository."],
 ["Azione VERIFICARE ESISTENTE", "Esiste un file: produrre solo se il confronto con i master nuovi (Kairn/Morrow, sheet V8) fallisce per stile o risoluzione."],
 ["Azione GIÀ INTEGRATO / NON PRODURRE", "Escluse dalla produzione; restano per completezza."],
 [""],
 ["Regole valide per tutto"],
 ["Correzione esplicita autore", "Lulù è la protagonista femminile. La precedente dicitura Nox è una lei non va applicata. Preservare identità e sheet esistenti."],
 ["Nox e Lulù", "NON ridisegnare. Ogni variante parte dagli sheet V8 esistenti e cambia solo arma, mani o effetto. Nox è femminile (lei)."],
 ["Stile", "Pixel art dettagliata vista dall'alto 3/4, fantascienza industriale abitata (non solo neon), luce dall'alto a sinistra, stessa densità di pixel di kairn-master.png / morrow-master.png."],
 ["Leggibilità", "Leggibile su telefono a 96-128 unità; colore sempre accompagnato da forma o simbolo; telegrafi visibili prima del danno."],
 ["Celle", "Griglie uniformi, figura intera, almeno 12 px di margine: nessuna parte oltre il bordo della cella (le pose che escono vengono respinte)."],
 ["Canone", "Vetro senza poteri; diciannove civili; gli stranieri non risolvono il finale; Lia è solo un ricordo; nessuna persona reale riconoscibile."],
 ["Audio", "Strumentale, originale, senza imitare opere esistenti; master FLAC 48 kHz + OGG; picco ≤ −1 dBFS; loop con giunzione pulita; avvisi comprensibili anche senza musica."],
 ["Consegna", "Per ogni file: nome indicato, master, eventuale partitura/parametri, e una riga di provenienza con strumento usato e condizioni d'uso reali. Non dichiarare licenze o ascolti non avvenuti."],
 ["Riferimenti da allegare", "assets/production/v10.2/handoff/kairn-master.png, morrow-master.png, strangers-author-reference.jpg; game/art/v05/nox_walk.png, lulu_walk.png, nox_actions.png, lulu_actions.png; game/art/v10/nox_vx9_gun.png, lulu_r12_gun.png; game/art/v05/driving_cars.png, driving_road.png, weapon_icons.png; game/art/v09/medseal.svg; game/art/v08/portraits.png; game/art/brand/vanta-clock.webp; docs/WORLD_CHARACTER_EXPANSION_BIBLE_V85.md"],
]


def write(vis, aud, brief):
    OUT.mkdir(parents=True, exist_ok=True)
    wb = Workbook()
    ws = wb.active; ws.title = "Leggimi"
    for row in README: ws.append(row)
    ws["A1"].font = Font(bold=True, size=14)
    for r in (4, 12): ws.cell(r, 1).font = Font(bold=True)
    ws.column_dimensions["A"].width = 34; ws.column_dimensions["B"].width = 140
    for row in ws.iter_rows():
        for cell in row: cell.alignment = Alignment(wrap_text=True, vertical="top")
    counts = {}
    for title, rows in (("Grafica", vis), ("Audio", aud), ("Brief audio autore", brief)):
        s = wb.create_sheet(title); cols = list(rows[0].keys()); s.append(cols)
        for r in rows: s.append([r[c] for c in cols])
        for i, c in enumerate(cols, 1):
            s.cell(1, i).font = Font(bold=True, color="FFFFFF"); s.cell(1, i).fill = PatternFill("solid", fgColor="1F3A4D")
            s.column_dimensions[get_column_letter(i)].width = 90 if c.startswith("Brief integrale") else 48 if c in ("Descrizione canonica", "Cosa produrre", "Stati / frame", "Stati / cue", "Formato", "Accettazione", "Azione") else 22
        fills = {"P1": "FCE4D6", "P2": "FFF2CC", "P3": "E2EFDA"}
        for row in s.iter_rows(min_row=2):
            for cell in row: cell.alignment = Alignment(wrap_text=True, vertical="top")
            if title != "Brief audio autore" and row[0].value in fills:
                row[0].fill = PatternFill("solid", fgColor=fills[row[0].value])
        s.freeze_panes = "A2"; s.auto_filter.ref = s.dimensions
        with open(OUT / f"{title.lower().replace(' ', '_')}.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=cols); w.writeheader(); w.writerows(rows)
        counts[title] = rows
    p1 = wb.create_sheet("P1 pronti da incollare", 1); p1.append(["#", "Tipo", "ID famiglia", "File da consegnare", "Prompt pronto"])
    for row in P1_PROMPTS: p1.append(list(row))
    for i, w in enumerate((6, 10, 40, 48, 140), 1): p1.column_dimensions[get_column_letter(i)].width = w
    for c in p1[1]: c.font = Font(bold=True, color="FFFFFF"); c.fill = PatternFill("solid", fgColor="7A2E1F")
    for row in p1.iter_rows(min_row=2):
        for cell in row: cell.alignment = Alignment(wrap_text=True, vertical="top")
    with open(OUT / "p1_pronti.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow(["#", "Tipo", "ID famiglia", "File da consegnare", "Prompt pronto"]); w.writerows(P1_PROMPTS)
    summary = wb.create_sheet("Riepilogo", 1); summary.append(["Foglio", "P1", "P2", "P3", "Già fatto / escluso", "Totale righe"])
    for t in ("Grafica", "Audio"):
        rows = counts[t]; summary.append([t] + [sum(1 for r in rows if r["Priorità"] == p) for p in ("P1", "P2", "P3", "—")] + [len(rows)])
    summary.append(["Brief audio autore", "", "", "", "", len(brief)])
    for c in summary[1]: c.font = Font(bold=True)
    wb.save(OUT / "CHRONOS_RICHIESTE_ASTRA.xlsx")
    return {t: {p: sum(1 for r in counts[t] if r["Priorità"] == p) for p in ("P1", "P2", "P3", "—")} for t in ("Grafica", "Audio")}


if __name__ == "__main__":
    v, a, b = main()
    print(write(v, a, b), "briefs", len(b))
