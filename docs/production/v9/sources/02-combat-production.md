Questa è la matrice V9 pronta da usare come base operativa per sviluppo, asset, bilanciamento e QA.

:::writing{variant="document" id="73164" title="CHRONOS: Nox & Lulù — Matrice di Produzione Combat V9"}
# CHRONOS: NOX & LULÙ
## V9 — COMBAT / WEAPONS / ENEMIES PRODUCTION MATRIX

### Scopo

Trasformare la Weapon & Combat Bible V9 in un piano di produzione missione-per-missione.

Ogni missione deve rispondere a sette domande:

1. Cosa sa già fare il giocatore?
2. Cosa impara qui?
3. Quale arma o abilità diventa significativa?
4. Quale nemico verifica l'apprendimento?
5. Quale ricompensa modifica realmente il gameplay?
6. Quali asset servono?
7. Come dimostriamo che la missione funziona?

---

# 1. LEGENDA DI PRODUZIONE

**KEEP**\
Sistema V8 già esistente da mantenere.

**EXPAND**\
Sistema V8 esistente da approfondire.

**NEW**\
Contenuto V9 da implementare.

**P0**\
Necessario per il core commerciale.

**P1**\
Necessario per profondità e qualità premium.

**P2**\
Polish o contenuto secondario.

---

# 2. CURVA COMPLETA

| Fase | Obiettivo |
|---|---|
| Prologo | Movimento e identità |
| Blackout | Fondamenti del combattimento |
| Rook | Prima prova delle fondamenta |
| Breach | Abilità speciali e controllo |
| The Anchor | Cooperazione basilare |
| Clinica | Pressione + decisione narrativa |
| Volkov | Combattimento complesso |
| Ora Zero | Minaccia EVE e separazione |
| Nox solo | Precisione e Counter |
| Lulù sola | Controllo e routing |
| Iron Ring | Skill mastery |
| Vega | Duello tecnico |
| Eden | Kit avanzato Lulù |
| Archivio EVE | Preparazione endgame |
| EVE-Prime | Mastery anti-pattern |
| Ricongiungimento | Duo Switch |
| Ascesa | Cooperazione reale |
| Archon | Esame finale |
| Collasso | Mobilità sotto pressione |
| Finale | Risoluzione narrativa |

---

# 3. PROLOGO — DUE COLPI

**ID:** Opening\
**POV:** Nox\
**Stato:** KEEP / EXPAND\
**Priorità:** P0

### Obiettivo gameplay

Insegnare:

movimento;

interazione;

direzione;

uso dell'ambiente.

### Combat

Nessun vero combattimento.

### Kit

Nessuna arma.

### Nuovo apprendimento

Il giocatore deve capire immediatamente:

**muoviti → osserva → interagisci.**

### Asset

`opening_container`

`nox_wake`

`lulu_opening`

`glass_pickup`

### Gate

PASS soltanto se un giocatore nuovo raggiunge il frammento senza istruzioni esterne.

---

# 4. BLACKOUT — INGRESSO

**ID:** blackout\
**POV:** Nox/Lulù\
**Stato:** EXPAND\
**Priorità:** P0

### Kit disponibile

C-9

Melee

Dash.

### Nuovo apprendimento

Uso base della pistola.

Auto-aim.

Ricarica.

Combattimento ravvicinato.

Dash per evitare telegraph.

### Nemici

Relay Raider.

Breaker introdotto successivamente.

### Regola

Non introdurre Signal Tech ed Enforcer nei primi secondi.

Progressione:

2 Raider

→ Raider + Breaker

→ composizione completa.

### Reward

Nessun upgrade immediato.

Il premio è il controllo del primo relè.

### Asset

`relay_raider_v09`

`relay_breaker_v09`

`c9_fire_v09`

`nox_melee_v09`

`lulu_melee_v09`

### Gate

Il giocatore deve comprendere autonomamente che il cerchio nemico significa:

**esci dalla zona prima dell'impatto.**

---

# 5. BLACKOUT — RETE DEI RELÈ

**ID:** blackout-mid\
**Stato:** NEW / EXPAND\
**Priorità:** P0

### Nuovi nemici

Signal Tech.

Enforcer.

### Nuovo apprendimento

Priorità bersagli.

Non tutti i nemici devono essere eliminati nello stesso ordine.

### Encounter esempio

Signal Tech

+

2 Raider

+

Breaker.

Se Signal resta vivo:

rilevamento e pressione aumentano.

### Intento

Il giocatore comincia a pensare:

**“Chi devo eliminare prima?”**

anziché:

**“Qual è il nemico più vicino?”**

---

# 6. MINI-BOSS — ROOK

**ID:** blackout-rook\
**POV:** Nox\
**Stato:** NEW\
**Priorità:** P1

### Boss

ROOK — CAPORELÈ.

### Fase 1

Fucile industriale.

Mine elettriche.

Copertura.

2 Raider.

### Fase 2

Arena parzialmente al buio.

Breaker entra nel combattimento.

Rook cambia posizione.

### Meccanica verificata

Dash.

Target priority.

Uso della copertura.

### Reward

**C-9 QUICKDRAW COMPONENT**

### Unlock

C-9 Quickdraw.

### Asset

`rook_boss_v09`

`rook_weapon_v09`

`relay_mines_v09`

`blackout_dark_arena`

### Audio

Rook weapon.

Mine arm.

Power failure.

Boss motif breve.

### Gate

Il giocatore deve poter vincere senza tankare sistematicamente gli attacchi.

---

# 7. DECISIONE BLACKOUT

### Stato

KEEP.

Officina

oppure

Rifugio.

### Reward comune

Tessa consegna:

**VX-9 → Nox**

**R-12 → Lulù**

C-9 rimane disponibile.

### Funzione

Prima espansione dell'arsenale.

### Gate

Il giocatore deve capire:

**Switch Weapon**

entro il combattimento successivo.

---

# 8. VORTEX I — FUGA DAL CANTIERE

**Stato:** KEEP / EXPAND\
**Priorità:** P0

### Nuovo sistema

Guida.

### Comandi

Sterzo.

Accelerazione.

Freno.

### Nessun combattimento veicolare.

### Upgrade possibile

Se scelta Officina:

+ integrità Vortex.

Se Rifugio:

meno ostacoli.

### Gate

Nessun nuovo sistema combat viene introdotto qui.

La guida deve funzionare come pausa ritmica dopo Blackout.

---

# 9. MOON REFUGE

**Tipo:** Hub.

### Funzioni

Riposo.

Mercante.

Fabbro.

Dialoghi.

### Upgrade disponibili

C-9 Quickdraw se Rook sconfitto.

VX-9 Overclock ancora bloccato o costoso.

R-12 Choke ancora bloccato o costoso.

Piastre leggere.

### Regola

Non permettere di acquistare tutto immediatamente.

---

# 10. LA BRECCIA

**ID:** breach\
**POV:** Nox/Lulù\
**Stato:** EXPAND\
**Priorità:** P0

### Kit

C-9

VX-9

R-12

Melee

Dash

Pulse

Risonanza.

### Nuovo apprendimento

Abilità speciale.

### Nemici

Skitter.

Spitter.

### Progressione

Skitter insegna:

bersaglio veloce.

Spitter insegna:

pressione a distanza.

### Encounter avanzato

2 Skitter

+

1 Spitter.

### Gate

Pulse e Risonanza devono sembrare differenti dalle armi da fuoco.

---

# 11. ANCHOR BEAST

**Tipo:** Elite.

### Meccanica

Si ancora al terreno.

Aumenta la stabilità dei nemici vicini.

### Counterplay

Pulse.

Risonanza.

flanking.

### Funzione didattica

Preparazione al boss The Anchor.

---

# 12. BOSS — THE ANCHOR

**ID:** breach-anchor\
**Stato:** NEW\
**Priorità:** P1

### Fase 1

Cavi.

Skitter.

Zone telegraphed.

### Fase 2

Anchor immobilizzato.

Tre link energetici.

Lulù:

Risonanza sui link.

Nox:

colpisce il nucleo esposto.

### Fase 3 breve

Nucleo instabile.

Attacchi più rapidi.

Nessun mob aggiuntivo.

### Reward

**H-17 COMPONENT 1/2**

### Asset

`anchor_boss_v09`

`anchor_links_v09`

`breach_core_vfx`

### Gate

Il giocatore deve capire che sparare continuamente al boss chiuso è inutile.

---

# 13. VORTEX II — SOTTO LA BRECCIA

### Stato

KEEP.

### Funzione

Tre checkpoint/segnali.

Nessun nuovo combat system.

### Obiettivo

Cambio ritmo.

---

# 14. CATHEDRAL QUARTER

**Tipo:** Hub.

### Funzione

Orologiaia.

Mercato.

Indizi temporali.

Upgrade.

### Possibili acquisti

VX-9 Overclock.

R-12 Choke.

### Gate narrativo

Prima anticipazione concreta che alcune anomalie non appartengono a Elyon.

---

# 15. ULTIMA CORSIA

**ID:** contagion\
**Stato:** EXPAND\
**Priorità:** P0

### Nemici

Drifter.

Echo.

Carrier.

### Introduzione

Drifter:

melee semplice.

Echo:

movimento esplosivo.

Carrier:

controllo ambientale.

### Nuovo apprendimento

Combattere mentre si protegge un obiettivo.

Non basta eliminare nemici.

### Lulù

Risonanza diventa particolarmente utile.

### Nox

VX-9 per eliminare rapidamente Carrier.

---

# 16. VOLKOV — SETUP

**Stato:** NEW.

Volkov non appare improvvisamente come boss.

Prima vengono mostrati:

registri;

apparecchiature;

tentativi di cura;

pazienti conservati.

Il giocatore deve capire che Volkov ha iniziato come medico.

---

# 17. BOSS — VOLKOV

**ID:** clinical-volkov\
**Priorità:** P1

### Fase 1 — MEDICO

Volkov non attacca direttamente in modo aggressivo.

Utilizza:

droni;

barriere;

strumenti clinici.

Il giocatore distrugge il sistema di supporto.

### Fase 2 — ARCHIVIO VIVENTE

Volkov assorbe pattern da memorie conservate.

Alterna:

dash;

ranged;

melee;

area.

### Fase 3 — COLLASSO

Riduzione del combattimento diretto.

Il giocatore deve sopravvivere e aprire la via ai civili.

### Reward

**AEGIS CORE COMPONENT**

### Funzione narrativa

Il boss non viene “ucciso per ottenere loot”.

La ricompensa deriva dall'attrezzatura recuperata.

### Asset

`volkov_human_v09`

`volkov_archive_v09`

`clinical_drones_v09`

`memory_spore_vfx`

---

# 18. DECISIONE CLINICA

### Stato

KEEP.

19 civili vengono salvati.

La firma EVE di Nox viene esposta.

### Funzione

Il gameplay deve chiarire il costo della scelta prima della separazione.

---

# 19. VORTEX III — ULTIMA EVACUAZIONE

### Stato

KEEP / EXPAND.

Nox guida.

Lulù coordina.

### Obiettivo

Fermarsi nei punti di soccorso.

### Regola

Niente combattimento veicolare.

La tensione deriva da:

tempo;

integrità;

ostacoli;

fermate.

---

# 20. ORA ZERO

**Stato:** EXPAND\
**Priorità:** P0

### Nemici

Custodian Warden.

Prism.

### Boss tecnico

Custode maggiore.

### Nuovo apprendimento

Telegraph geometrici.

Target pesanti.

### Preparazione

Il giocatore viene portato verso:

Perfect Dodge.

Counter.

---

# 21. SEPARAZIONE

**Stato:** KEEP.

Nox e Lulù vengono divisi.

### Regola di produzione

Da questo momento i due kit devono evolversi diversamente.

---

# 22. N05 — NESSUNO AL COMANDO

**POV:** Nox.

### Focus

Sopravvivenza.

Mobilità.

Melee.

### Nuova mossa

**HEAVY STRIKE.**

### Nemici

Warden isolati.

unità leggere.

### Obiettivo didattico

Heavy Strike non deve essere uno spam attack.

Serve a punire finestre precise.

### Reward

Heavy Strike permanente.

### Gate

Il giocatore deve distinguere:

Quick Strike

da

Heavy Strike.

---

# 23. L05 — LA CITTÀ SENZA DI TE

**POV:** Lulù.

### Focus

Risonanza.

Routing.

Salvataggio tecnico.

### Nuova mossa

**RESONANCE ARC.**

### Nemici

Raider residui.

Signal Tech.

### Regola

Missione meno orientata alle kill.

### Gate

Almeno un obiettivo deve poter essere completato senza eliminare tutti i nemici.

---

# 24. N06 — MEMORIA UTILE

**POV:** Nox.

### Focus

Counter.

### Nuovo sistema

**COUNTER VARIANT PER ARMA.**

C-9:

quick shot.

VX-9:

burst concentrato.

### Nemici

Prism.

Warden.

### Gate

Almeno un encounter deve rendere il Counter nettamente utile senza renderlo obbligatorio.

---

# 25. L06 — LINEA ROSSA

**POV:** Lulù.

### Nuova mossa

**BARRIER CORRIDOR.**

### Gameplay

proteggere civili;

muovere energia;

aprire vie.

### Nemici

Spitter.

Signal/controller.

### Gate

Barrier deve avere:

utilità offensiva indiretta;

utilità difensiva;

utilità ambientale.

Non deve essere soltanto “+difesa”.

---

# 26. TOXIC SLUM BAZAAR

**Hub.**

### Funzione

Mercante.

Componenti.

Missioni opzionali.

Informazioni.

### Unlock commerciale

Piastre avanzate.

Mod weapon.

Informazioni su Iron Ring.

---

# 27. N07 — IRON RING

**POV:** Nox.\
**Priorità:** P0/P1.

### Focus

Skill challenge.

### Approcci

Prudente.

Aggressivo.

Stealth.

### Nuovo sistema

Preview di:

**BLACK PULSE.**

### Nemici

Fighter.

Shooter.

Arena controller.

### Regola

Gli avversari devono sembrare addestrati.

Non mob.

---

# 28. BOSS — VEGA

### Fase 1

Duello puro.

### Fase 2

Vega riconosce la direzione di Dash ripetuta.

### Fase 3

Black Pulse disponibile.

Il giocatore può:

usarlo;

non usarlo.

### Reward

**H-17 NEEDLE**

completata usando il componente ottenuto da The Anchor.

### Unlock

H-17 permanente per Nox.

### Gate

La vittoria deve essere possibile:

con Black Pulse;

senza Black Pulse.

---

# 29. L07 — EDEN

**POV:** Lulù.

### Focus

Infiltrazione e controllo.

### Nuova mossa

**TETHER.**

### Nuova arma

**ARC-7 CHOIR.**

### Acquisizione

Non da negozio.

Recuperata dalla tecnologia Eden.

### Nemici

Binder.

Prism.

support unit.

### Gate

Tether deve creare almeno tre soluzioni:

bloccare charger;

proteggere un terminale;

separare gruppo.

---

# 30. AEGIS CORE

Alla conclusione di Eden, il componente di Volkov viene integrato.

### Unlock

**AEGIS CORE**

per Lulù.

### Nuovo stato

Una carica Aegis massima.

### Utilizzi

Barrier potenziata.

Tether esteso.

Resonance Burst.

---

# 31. N08 — ARCHIVIO EVE

**POV:** Nox.

### Focus

Esplorazione.

Ricostruzione.

### Nessuna nuova arma.

Scelta intenzionale.

Il giocatore deve avere tempo per assimilare il kit già acquisito.

### Funzione narrativa

Preparazione EVE-Prime.

---

# 32. L08 — NON CHIAMARLA

**POV:** Lulù.

### Focus

Node Override.

### Nuova mossa

**NODE OVERRIDE.**

### Gameplay

disattivare sensori;

aprire vie;

modificare ambiente.

### Gate

La missione deve poter mostrare chiaramente:

“Lulù controlla i sistemi senza controllare Nox.”

---

# 33. CLOCKWORK OUTPOST

### Tipo

Hub misterioso.

### NPC

Kairn.

Morrow.

Automa.

Orologiaia/tecnici.

### Nessun nuovo combat unlock.

### Funzione

Respirazione narrativa prima di EVE-Prime.

---

# 34. N09 — EVE-PRIME / ZERO

**POV:** Nox.\
**Priorità:** P0.

### Kit atteso

C-9

VX-9

H-17

Melee

Heavy Strike

Dash

Perfect Dodge

Counter

Pulse

Black Pulse prototype.

### Boss mastery

EVE-Prime analizza:

Gun.

Melee.

Ability.

Pattern di Dash.

### Fase 1 — MIRROR

Replica ritmo.

### Fase 2 — PREDICTION

Punisce ripetizione.

### Fase 3 — REFUSAL

Il giocatore deve introdurre:

pause;

variazioni;

cambi arma.

### Reward

**NULL DRIVER.**

### Unlock

Black Pulse governato.

### Gate

È vietato vincere efficacemente spammando una sola azione.

---

# 35. L09 — LA VIA VERSO L'ASSE

**POV:** Lulù.

### Kit atteso

C-9

R-12

ARC-7

Risonanza

Tether

Barrier

Node Override

Aegis.

### Focus

Usare l'intero kit Lulù.

### Scelta

Nox velocemente

oppure

civili.

### Gate

La scelta deve cambiare almeno una condizione della missione Ascesa.

---

# 36. R01 — RICONGIUNGIMENTO

### Stato

KEEP / EXPAND.

### Nuovo sistema

**DUO II — SWITCH.**

### Funzione

Cambio POV.

### Nessun combattimento pesante immediato.

Il giocatore deve provare il cambio in ambiente sicuro.

### Gate

Switch compreso entro 60–90 secondi.

---

# 37. C01 — ASCESA

**POV:** Nox + Lulù.

### Priorità

P0.

### Focus

Vero gameplay cooperativo single-player.

### Struttura

Lulù:

terminali;

barriere;

energia.

Nox:

copertura;

elite;

pressione.

### Nuovo sistema

**TAG ACTIONS.**

Lulù → Nox:

Barrier residua breve.

Nox → Lulù:

colpo di copertura.

### Nemici

Warden.

Prism.

Binder.

Seraph.

### Regola encounter

Mai:

Seraph + numerosi Elite.

### Gate

Il giocatore deve avere motivo concreto per cambiare personaggio almeno 5 volte.

---

# 38. KAIRN & MORROW ASSIST

Durante una porzione dell'Ascesa.

### Regola

Scripted assist breve.

Non controllabili.

Non risolvono l'encounter.

### Kairn

Precision strike.

### Morrow

Knockback / motosega.

### Durata

Pochi secondi.

### Funzione

Creare mistero e payoff.

---

# 39. SPINA DELL'ASSE

Durante C01.

### Tipo

Relic / arma ambientale.

### Procedura

Lulù apre circuito.

Nox difende.

Lulù alimenta nodo A.

Lulù alimenta nodo B.

Switch Nox.

Mira.

Fuoco.

### Effetto

Grande evento audiovisivo.

### Regola

Non equipaggiabile nel normale inventario.

---

# 40. B01 — ARCHON: LA VERITÀ

### Tipo

Confronto narrativo.

### Nessun nuovo sistema.

### Funzione

Preparazione emotiva.

### Regola

Non inserire combattimento solo per paura di rallentare.

Serve contrasto prima del finale.

---

# 41. B02 — ARCHON / ELYON

**Priorità:** P0.

### Kit richiesto

Intero kit Nox.

Intero kit Lulù.

Duo Switch.

Tag Actions.

Spina dell'Asse.

---

# 42. ARCHON FASE I — LA CUSTODE

### Nemici

Warden.

Prism.

### Gameplay

Lulù apre nodi.

Nox protegge.

### Test

switch;

Barrier;

Counter;

target priority.

---

# 43. ARCHON FASE II — LA CITTÀ

### Arena

Mobile.

Coperture cambiano.

Percorsi si chiudono.

### Gameplay richiesto

Node Override.

Barrier.

Switch.

### Assist

Kairn/Morrow aprono una singola finestra.

### Regola

Non infliggono il danno decisivo.

---

# 44. ARCHON FASE III — LIA

### Filosofia

Meno mob.

Più precisione.

### Gameplay

telegraph multipli;

memorie ambientali;

nodi;

switch;

Perfect Dodge;

Counter.

### Regola fondamentale

Lulù non può dare il colpo finale.

---

# 45. FINAL SYNC

### Condizioni

Nodi aperti.

Nox attivo.

Lulù sincronizzata.

Duo disponibile.

### Sequenza

Lulù apre rete.

Switch Nox.

Black Pulse governato.

Telegraph finale.

Perfect Dodge.

Counter.

Final shot.

### Regola

Il giocatore deve eseguire almeno una parte della sequenza.

Non cutscene automatica.

---

# 46. COLLASSO

### POV

Nox.

### Kit rilevante

Dash.

Barrier residuale/supporto Lulù.

### Nessun nuovo sistema.

### Obiettivo

Dimostrare padronanza della mobilità.

---

# 47. FINALE

Nessun combattimento.

Scelta mano.

Conseguenze.

Post-credit.

Kairn.

Morrow.

Book of Broken Hours.

---

# 48. MATRICE RIASSUNTIVA DEGLI UNLOCK

| Punto campagna | Unlock |
|---|---|
| Blackout | C-9 / Melee / Dash |
| Blackout avanzato | Perfect Dodge |
| Rook | C-9 Quickdraw |
| Fine Blackout | VX-9 / R-12 |
| Breach | Pulse / Risonanza |
| The Anchor | H-17 component |
| Volkov | Aegis component |
| N05 | Heavy Strike |
| L05 | Resonance Arc |
| N06 | Weapon Counter |
| L06 | Barrier |
| Iron Ring | Black Pulse prototype |
| Vega | H-17 |
| Eden | Tether + ARC-7 |
| Fine Eden | Aegis Core |
| L08 | Node Override |
| EVE-Prime | Null Driver / Black Pulse governed |
| Reunion | Duo Switch |
| Ascesa | Tag Actions |
| Ascesa alta | Spina dell'Asse |
| Finale | Final Sync |

---

# 49. MATRICE BOSS → TEST DEL GIOCATORE

| Boss | Cosa verifica |
|---|---|
| Rook | Fondamentali |
| The Anchor | Nox + Lulù complementari |
| Volkov | Gestione arena |
| Vega | Precisione e timing |
| EVE-Prime | Varietà e consapevolezza |
| Archon | Padronanza completa |

Nessun boss deve essere soltanto:

**più HP + più danno.**

---

# 50. MATRICE NEMICI → COUNTER

| Nemico | Risposta naturale |
|---|---|
| Raider | Gun / melee |
| Breaker | Dash / Heavy Strike / Barrier |
| Signal Tech | Target priority |
| Enforcer | Perfect Dodge / Counter |
| Skitter | Tracking / area |
| Spitter | Mobility |
| Anchor Beast | Pulse / Resonance |
| Glassback | flank / H-17 |
| Drifter | melee |
| Echo | variazione movimento |
| Carrier | focus fire |
| Choir | interrupt |
| Warden | flank / Heavy |
| Prism | movement / dodge |
| Binder | Node Override / focus |
| Seraph | mastery completa |

---

# 51. ASSET PRODUCTION ORDER

## P0-A — HERO KIT

Nox:

`nox_heavy_strike_v09`

`nox_perfect_dodge_v09`

`nox_counter_v09`

`nox_black_pulse_v09`

Lulù:

`lulu_resonance_arc_v09`

`lulu_tether_v09`

`lulu_barrier_v09`

`lulu_override_v09`

---

## P0-B — WEAPONS

`c9_v09`

`vx9_v09`

`r12_v09`

`h17_v09`

`arc7_v09`

---

## P0-C — ENEMIES

Relay:

Raider\
Breaker\
Signal\
Enforcer.

Maintenance:

Skitter\
Spitter\
Anchor.

Infected:

Drifter\
Echo\
Carrier.

Custodian:

Warden\
Prism\
Binder.

---

## P1 — ELITES

Glassback.

Choir.

Seraph.

---

## P1 — BOSSES

Rook.

The Anchor.

Volkov.

Vega.

EVE-Prime.

Archon.

---

# 52. AUDIO PRODUCTION MATRIX

Ogni nuova azione necessita di:

anticipation;

activation;

impact;

failure/blocked state.

### Armi

C-9.

VX-9.

R-12.

H-17.

ARC-7.

### Abilità

Pulse.

Risonanza.

Tether.

Barrier.

Black Pulse.

Perfect Dodge.

Counter.

Final Sync.

### Nemici

Ogni ruolo deve avere almeno un cue di attacco distinguibile anche senza guardare direttamente il bersaglio.

---

# 53. QA GATE — NUOVA ARMA

Una nuova arma non è PASS perché “spara”.

Deve superare:

**Functional**

equip;

fire;

reload;

switch;

save/load.

**Combat**

danno;

range;

stagger;

boss interaction.

**Visual**

sprite corretto;

nessuna arma fluttuante;

recoil leggibile.

**Mobile**

touch target;

nessun input perso;

performance stabile.

**Narrative**

unlock nel punto corretto.

---

# 54. QA GATE — NUOVA MOSSA

Ogni mossa deve avere:

input chiaro;

feedback;

cooldown leggibile;

failure state;

animazione;

audio;

VFX;

test gameplay;

test save/load se persistente.

Non esistono abilità “implementate” solo perché la funzione è presente nel codice.

---

# 55. QA GATE — NEMICO

Ogni nemico richiede prova di:

silhouette.

telegraph.

attacco.

recovery.

hit reaction.

death/down.

audio cue.

counterplay.

mobile readability.

---

# 56. QA GATE — BOSS

Ogni boss deve superare:

fase 1;

transizione;

fase finale;

morte/sconfitta;

restart;

checkpoint;

save/load;

nessun softlock;

nessuna strategia dominante banale.

Tre playthrough minimi:

aggressivo;

difensivo;

player inesperto.

---

# 57. METRICHE PLAYTEST

Per ogni missione registrare:

Deaths.

Damage Taken.

Weapon Usage.

Ability Usage.

Perfect Dodge Rate.

Counter Rate.

Switch Count.

Time To Objective.

Confusion Events.

Boredom Events.

Missed Dialogue.

Restart.

Abandonment.

---

# 58. SOGLIE DI ALLARME

Se più del 50% dei tester ignora completamente un nuovo sistema:

**tutorial/design FAIL.**

Se un'arma viene utilizzata oltre l'80% del tempo dopo lo sblocco:

**balance warning.**

Se una nuova arma viene utilizzata meno del 10%:

**identity/value warning.**

Se un boss può essere sconfitto più rapidamente ignorando la sua meccanica principale:

**boss design FAIL.**

Se il giocatore non sa spiegare perché Nox e Lulù giocano diversamente:

**combat identity FAIL.**

---

# 59. ORDINE DI IMPLEMENTAZIONE

Non sviluppare tutto insieme.

### STRIKE 1 — ENEMY FOUNDATION

Relay roles.

Maintenance roles.

Infected roles.

Custodian roles.

### STRIKE 2 — HERO DEPTH

Heavy Strike.

Resonance Arc.

Barrier.

Tether.

Weapon Counters.

### STRIKE 3 — SPECIALIST WEAPONS

H-17.

ARC-7.

### STRIKE 4 — BOSSES

Rook.

Anchor.

Volkov.

Vega.

### STRIKE 5 — ADVANCED NOX

Black Pulse.

Body Mods.

Null Driver.

### STRIKE 6 — COOP

Duo Switch.

Tag Actions.

Spina dell'Asse.

### STRIKE 7 — FINAL BOSS

Archon V9.

Final Sync.

### STRIKE 8 — POLISH

Sprite.

VFX.

Audio.

haptics.

accessibility.

performance.

balance.

---

# 60. RELEASE RULE

Nessun aumento del numero delle armi può compensare:

controlli scadenti;

telegraph illeggibili;

animazioni incomplete;

boss monotoni;

frame drop;

input persi.

La V9 deve avere meno contenuti funzionanti bene piuttosto che cinquanta armi cosmeticamente differenti.

Il target finale è:

**3 armi realmente diverse per Nox.**

**3 armi realmente diverse per Lulù.**

**kit individuali profondi.**

**almeno quattro famiglie nemiche leggibili.**

**sei incontri boss con identità distinta.**

**progressione meccanica distribuita lungo tutta la campagna.**

**endgame che richiede ciò che il gioco ha insegnato.**

Questa è la matrice di produzione da usare per trasformare CHRONOS da build con un buon combat core a action-adventure premium con una curva di crescita completa.
:::

Il punto chiave è che ora ogni unlock ha **un luogo preciso, una ragione narrativa e un test successivo**: per esempio The Anchor prepara H-17, Vega ne completa l'acquisizione; Volkov fornisce il componente Aegis, Eden lo trasforma nel kit avanzato di Lulù; EVE-Prime certifica la mastery di Nox prima del combattimento cooperativo finale. Questo evita di aggiungere armi e mosse come contenuti isolati.
