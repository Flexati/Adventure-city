// Regional market weapons, armor/relics, diversified district catalogs, and hero progression moves.
// R22: the three machine guns and the plasma carbine were brought back to the band of the kit weapons (VX-9, R-12):
// as delivered they halved every boss fight for the audit bot (tools/probe_arsenal_r22.mjs).
export const MARKET_WEAPONS=Object.freeze(Object.fromEntries(Object.entries({
 mg_tempest:{name:'Mitragliatrice Tempest-9',short:'Tempest-9',proj:'tracer',damage:.40,range:345,magazine:40,reload:1.35,cooldown:.20,burst:5,pellets:1,spread:.05,pierce:1,fastWindup:true,color:'#7de8ff',price:55,desc:'Mitragliatrice compatta: raffiche da 5 colpi con accelerazione continua. Sblocca l’arma in arsenale.'},
 mg_vulcan:{name:'Mitragliatrice Vulcan',short:'Vulcan-8',proj:'heavy_tracer',damage:.27,range:380,magazine:64,reload:1.65,cooldown:.19,burst:8,pellets:1,spread:.07,pierce:1,fastWindup:true,color:'#ffb85c',price:95,desc:'Mitragliatrice pesante da 8 colpi a raffica continua e caricatore da 64. Sblocca l’arma in arsenale.'},
 mg_helix:{name:'Sub-Mitra Helix',short:'Helix-SMG',proj:'twin_tracer',damage:.17,range:315,magazine:50,reload:1.25,cooldown:.17,burst:5,pellets:2,spread:.06,pierce:1,fastWindup:true,color:'#94ffd8',price:80,desc:'Sub-mitragliatrice binata: doppio fascio ad altissima cadenza. Sblocca l’arma.'},
 mg_shredder:{name:'Mitragliatrice Rotativa V-12',short:'Rotativa V-12',proj:'shredder_tracer',damage:.25,range:370,magazine:72,reload:1.65,cooldown:.16,burst:6,pellets:1,spread:.055,pierce:1,fastWindup:true,color:'#58e8ff',price:125,desc:'Gatling multicanne a spin-up rapido: aumenta la cadenza tenendo premuto. Sblocca l’arma.'},
 orb_nova:{name:'Cannone Sfera Nova',short:'Sfera Nova',proj:'orb',damage:2.0,range:430,magazine:6,reload:1.65,cooldown:.66,burst:1,pellets:1,spread:0,pierce:1,orbSpeed:300,orbRadius:78,color:'#ff9d52',price:85,desc:'Lancia una sfera d’energia esplosiva ad area che travolge i gruppi. Sblocca l’arma.'},
 orb_void:{name:'Proiettore Sfera Chronos',short:'Sfera Chronos',proj:'orb',damage:1.7,range:410,magazine:5,reload:1.75,cooldown:.72,burst:1,pellets:1,spread:0,pierce:1,stun:1.2,orbSpeed:265,orbRadius:90,color:'#70f2ff',price:105,desc:'Sfera d’energia temporale: esplode ad area e stordisce i bersagli. Sblocca l’arma.'},
 plasma_carbine:{name:'Carabina al Plasma',short:'Plasma-2',proj:'bolt',damage:1.05,range:390,magazine:24,reload:1.35,cooldown:.36,burst:3,pellets:1,spread:.02,pierce:1,orbSpeed:560,orbRadius:22,color:'#6fffb0',price:75,desc:'Tripla scarica di dardi al plasma ad alta velocità. Sblocca l’arma in arsenale.'},
 scatter_flak:{name:'Doppietta Flak Breaker',short:'Flak Breaker',proj:'flak',damage:.46,range:230,magazine:8,reload:1.60,cooldown:.70,burst:1,pellets:7,spread:.13,pierce:1,stun:.35,color:'#ffd478',price:70,desc:'Rosa a 7 schegge pesanti con breve stordimento ravvicinato. Sblocca l’arma.'},
 rail_lance:{name:'Lancia a Rotaia K-88',short:'Lancia K-88',proj:'rail',damage:2.7,range:540,magazine:5,reload:1.85,cooldown:.84,burst:1,pellets:1,spread:0,pierce:4,color:'#ffe89e',price:110,desc:'Raggio magnetico perforante fino a 4 nemici in linea. Sblocca l’arma in arsenale.'},
 arc_tesla:{name:'Bobina Arco Mk.II',short:'Arco Mk.II',proj:'arc',damage:1.2,range:345,magazine:10,reload:1.50,cooldown:.56,burst:1,pellets:1,spread:0,pierce:1,chain:3,chainRange:160,stun:.85,color:'#cfa6ff',price:90,desc:'Scarica a catena su 4 nemici vicini con stordimento prolungato. Sblocca l’arma.'},
 flame_pyre:{name:'Lanciafiamme Pyre-4',short:'Pyre-4',proj:'flame',damage:.15,range:220,magazine:48,reload:1.55,cooldown:.24,burst:4,pellets:3,spread:.14,pierce:2,fastWindup:true,color:'#ff7a36',price:100,desc:'Getto termico continuo a cono che brucia più nemici in mischia. Sblocca l’arma.'},
 cryo_shard:{name:'Proiettore Crio-Schegge',short:'Crio-Shard',proj:'cryo',damage:.55,range:310,magazine:18,reload:1.45,cooldown:.48,burst:2,pellets:3,spread:.10,pierce:1,stun:.55,color:'#6bffb8',price:95,desc:'Raffica criogenica a ventaglio che rallenta e stordisce i nemici. Sblocca l’arma.'},
 sniper_chronos:{name:'Fucile Chronos-99',short:'Chronos-99',proj:'sniper',damage:3.1,range:600,magazine:6,reload:1.75,cooldown:.90,burst:1,pellets:1,spread:0,pierce:4,color:'#ffd88a',price:130,desc:'Fucile di precisione a lunga gittata con perforazione ad alta energia. Sblocca l’arma.'}
}).map(([id,w])=>[id,Object.freeze({id,market:true,...w})])));

export const MARKET_GEAR_ITEMS=Object.freeze({
 rig_scout:{name:'Imbrago da corsa',price:60,stock:1,slot:'armor',hp:2,haste:.04,description:'+2 salute e tiro più rapido di 0,04 s.'},
 hazmat_coat:{name:'Cappotto schermato',price:75,stock:1,slot:'armor',hp:3,description:'+3 salute a ogni ingresso in missione.'},
 thermal_plate:{name:'Corazza geotermica',price:110,stock:1,slot:'armor',hp:4,damage:1,description:'+4 salute e +1 danno a ogni missione.'},
 chrono_lens:{name:'Lente Chronos',price:70,stock:1,slot:'relic',haste:.05,magicHaste:.4,description:'Riduce i tempi di tiro e abilità.'},
 core_capacitor:{name:'Condensatore d’Asse',price:95,stock:1,slot:'relic',movePower:1,magicHaste:.6,description:'Potenzia mosse speciali e sfere d’energia.'},
 bio_filter:{name:'Filtro simbiotico',price:65,stock:1,slot:'relic',nodeHeal:1,description:'+1 salute extra a ogni dispositivo attivato.'},
 ammo_belt:{name:'Bandoliera tattica',price:50,stock:1,slot:'relic',magBonus:2,haste:.02,description:'+2 colpi bonus ai caricatori e ricarica rapida.'},
 kinetic_dampener:{name:'Compensatore cinetico',price:85,stock:1,slot:'relic',magBonus:2,haste:.06,description:'Stabilizza le raffiche: +2 colpi al caricatore e -0,06 s recupero.'},
 overclock_core:{name:'Nucleo Overclock',price:125,stock:1,slot:'relic',damage:1,magicHaste:.7,description:'+1 danno a tutte le armi e abilità speciali più rapide.'}
});

// R22: the four campaign villages keep the base gear every smith sold before (coil, resonator, vest) and add one
// regional weapon; what did not fit moved to the shop of the same village.
export const REGION_CATALOG=Object.freeze({
 moon:{inn:[],smith:['coil','resonator','vest','mg_tempest'],shop:['medkit','ammo_belt']},
 ash_docks:{inn:[],smith:['mg_tempest','scatter_flak','turbo_mk2','vest'],shop:['medkit','rig_scout','kinetic_dampener']},
 antenna_port:{inn:[],smith:['coil','plasma_carbine','rig_scout'],shop:['medkit','ammo_belt','cryo_shard']},
 cathedral:{smith:['coil','resonator','vest','rail_lance','turbo_mk3'],relic:['echo','chrono_lens'],shop:['medkit'],info:['intel']},
 toxic:{smith:['coil','resonator','vest','mg_vulcan','toxic_attack','toxic_defense'],alchemist:['medkit','bio_filter','echo'],shop:['medkit','ammo_belt','scatter_flak','hazmat_coat','flame_pyre'],info:['intel']},
 clockwork:{smith:['coil','resonator','vest','turbo_mk4','clockwork_attack','clockwork_defense','mg_shredder'],shop:['medkit','plasma_carbine','rig_scout'],relic:['echo','core_capacitor','orb_void'],info:['intel']},
 clinic_ward:{inn:[],alchemist:['medkit','bio_filter','echo','cryo_shard'],shop:['medkit','plasma_carbine','hazmat_coat']},
 node_commons:{smith:['orb_nova','arc_tesla','hazmat_coat','mg_shredder'],relic:['core_capacitor','chrono_lens','echo','overclock_core'],info:['intel']},
 chalk_harbor:{inn:[],shop:['medkit','mg_helix','ammo_belt','kinetic_dampener'],info:['intel']},
 lower_hearth:{inn:[],smith:['orb_nova','mg_vulcan','thermal_plate','turbo_mk4','flame_pyre'],alchemist:['medkit','chrono_lens','bio_filter']},
 glass_terrace:{inn:[],relic:['chrono_lens','orb_void','echo','overclock_core'],shop:['medkit','scatter_flak','rig_scout']},
 sky_rail:{smith:['mg_helix','rail_lance','rig_scout','turbo_mk2','sniper_chronos'],shop:['medkit','arc_tesla'],info:['intel']},
 deep_archive:{alchemist:['medkit','bio_filter','arc_tesla','cryo_shard'],relic:['core_capacitor','orb_nova','echo'],info:['intel']},
 axis_crown:{inn:[],smith:['mg_vulcan','orb_void','thermal_plate','turbo_mk5','sniper_chronos'],relic:['core_capacitor','rail_lance','echo','overclock_core']}
});

export const TURBO_TIERS=Object.freeze([
 Object.freeze({id:'turbo_mk1',tier:1,name:'Turbo MK I · Iniettore Base',short:'MK I Base',price:0,unlockAct:1,unlockRaces:0,topBonus:0,accelBonus:0,duration:2.2,nitroCost:50,nitroGainMult:1,curveGrip:1,drivingBonus:0,jets:2,color:'#59e0ff',glow:'#e9feff',pitch:1,desc:'Assetto di serie della Vortex: spinta equilibrata per i moli.'}),
 Object.freeze({id:'turbo_mk2',tier:2,name:'Turbo MK II · Twin-Scroll Banchina',short:'MK II Twin',price:65,unlockAct:2,unlockRaces:1,topBonus:28,accelBonus:35,duration:2.55,nitroCost:45,nitroGainMult:1.12,curveGrip:1.14,drivingBonus:35,jets:2,color:'#6effc8',glow:'#f0fff8',pitch:1.12,desc:'+28 vel. max, +0,35 s nitro, costo 45%, tenuta in curva +14%.'}),
 Object.freeze({id:'turbo_mk3',tier:3,name:'Turbo MK III · Compressore al Plasma',short:'MK III Plasma',price:90,unlockAct:2,unlockRaces:3,topBonus:54,accelBonus:70,duration:2.95,nitroCost:40,nitroGainMult:1.24,curveGrip:1.28,drivingBonus:70,jets:3,color:'#ffd257',glow:'#fff6d1',pitch:1.26,desc:'+54 vel. max, 3 scarichi al plasma, costo nitro 40%, tenuta +28%.'}),
 Object.freeze({id:'turbo_mk4',tier:4,name:'Turbo MK IV · Reattore Chrono Apex',short:'MK IV Chrono',price:120,unlockAct:3,unlockRaces:5,topBonus:82,accelBonus:110,duration:3.35,nitroCost:35,nitroGainMult:1.38,curveGrip:1.44,drivingBonus:110,jets:4,color:'#ff6ae6',glow:'#ffe8fb',pitch:1.42,desc:'+82 vel. max, 4 ugelli Chrono, carica +38%, tenuta in curva +44%.'}),
 Object.freeze({id:'turbo_mk5',tier:5,name:'Turbo MK V · Overdrive Quantistico',short:'MK V Apex',price:160,unlockAct:4,unlockRaces:7,topBonus:115,accelBonus:155,duration:3.8,nitroCost:30,nitroGainMult:1.55,curveGrip:1.65,drivingBonus:150,jets:4,color:'#b78cff',glow:'#ffffff',pitch:1.60,desc:'Massimo stadio Vortex: +115 vel. max, 3,8 s boost, costo 30%, tenuta +65%.'})
]);

export const MARKET_TURBO_ITEMS=Object.freeze(Object.fromEntries(TURBO_TIERS.filter(t=>t.price>0).map(t=>[t.id,Object.freeze({name:t.name,price:t.price,stock:1,slot:'turbo',turboId:t.id,description:t.desc})])));

// R23: `early` is the stage from which the fourth move is granted. Act IV holds one foot mission (the finale, Nox):
// without it Lulù could never cast hers and Nox only once.
export const HERO_MOVES=Object.freeze({
 nox:Object.freeze([
  {id:'nox_pulse',act:1,minStep:'opening',name:'Impulso Chrono',short:'PULSE',kind:'beam',range:420,mult:3,bonus:2,cd:3.5,color:'#6bddff',desc:'Raggio perforante ad alto impatto che illumina il buio.'},
  {id:'nox_orb',act:2,minStep:'app_breach',name:'Sfera d’Energia Oscura',short:'SFERA',kind:'orb',range:440,radius:110,orbSpeed:280,mult:3.5,bonus:3,stun:1.4,cd:4.0,color:'#58e8ff',desc:'Lancia una sfera d’energia che esplode ad area e stordisce.'},
  {id:'nox_flurry',act:3,minStep:'exp_chalk_marks',name:'Tempesta di Zero',short:'TEMPESTA',kind:'nova_shot',radius:190,rays:8,mult:2.6,bonus:2,stun:.7,refill:.5,cd:4.2,color:'#9be6ff',desc:'Scarica a 360° e ricarica istantaneamente metà caricatore.'},
  {id:'nox_slash',act:3,minStep:'lower_levels',name:'Fendente Cinetico',short:'FENDENTE',kind:'blade_dash',range:250,radius:115,dashDist:150,mult:3.6,bonus:3,stun:1.1,cd:3.8,color:'#5cf2ff',desc:'Scatto in avanti con fendente plasma ad arco e stordimento.'},
  {id:'nox_nova',act:4,minStep:'reunion',early:'app_axis',name:'Singolarità dell’Asse',short:'SINGOL.',kind:'orb',range:460,radius:140,orbSpeed:240,mult:5,bonus:4,stun:2.0,shift:.8,cd:4.8,color:'#c29eff',desc:'Sfera gravitazionale devastante: stordisce e rallenta il tempo.'}
 ]),
 lulu:Object.freeze([
  {id:'lulu_wave',act:1,minStep:'opening',name:'Onda di Risonanza',short:'RISONANZA',kind:'cone',range:240,mult:1,bonus:1,stun:2.2,cd:3.5,color:'#ff72d9',desc:'Onda frontale che stordisce i nemici e taglia le cime.'},
  {id:'lulu_orb',act:2,minStep:'app_breach',name:'Sfera Armonica',short:'SFERA',kind:'orb',range:420,radius:115,orbSpeed:275,mult:2.6,bonus:2,stun:2.5,heal:1,cd:4.0,color:'#ff9fe6',desc:'Sfera d’energia radiosa: stordisce ad area e cura +1 vita su colpo.'},
  {id:'lulu_aegis',act:3,minStep:'exp_chalk_marks',name:'Cupola d’Égida',short:'EGIDA',kind:'aegis',radius:185,mult:2.1,bonus:1,stun:2.2,inv:1.5,cd:4.2,color:'#ffd6f5',desc:'Onda circolare difensiva con 1,5 s di scudo invulnerabile.'},
  {id:'lulu_stasis',act:3,minStep:'exp_chalk_marks',name:'Campo di Stasi',short:'STASI',kind:'stasis_field',radius:235,mult:2.4,bonus:2,stun:3.0,shift:1.0,cd:4.4,color:'#8cf7ff',desc:'Cupola temporale che congela i nemici e attiva Chrono Shift.'},
  {id:'lulu_supernova',act:4,minStep:'reunion',early:'vega',name:'Coro Supernova',short:'CORO',kind:'chain_burst',range:380,chains:6,mult:3.6,bonus:2,stun:2.6,heal:1,cd:4.8,color:'#ffe49e',desc:'Fulgori armonici su tutti i nemici visibili +1 vita su colpo.'}
 ])
});

const SL=(speaker,text)=>({speaker,text});
export const KEY_CHARACTER_ARCS={
 moon:{
  service:f=>f.blackout_choice==='workshop'?'smith':'inn',
  npc:f=>f.blackout_choice==='workshop'?'Dario':'Oren e Mira',
  cta:'Piano di sfondamento · Atto II',
  lockNote:'Prima di salire sul carico verso i moli, coordina la rotta dell’Atto II con il referente del quartiere.',
  title:'Come forzare il cordone verso l’Atto II?',
  lines:f=>f.blackout_choice==='workshop'
   ?[SL('DARIO','Il ponte dell’officina regge, ma la gang presidia gli ingressi verso i moli.'),SL('NOX','Scegliamo dove colpire prima che muovano le gru.'),SL('DARIO','Aggiriamo i container o blindiamo la Vortex e l’equipaggiamento.')]
   :[SL('MIRA','Le vie secondarie del rifugio portano dritte al vecchio scalo, ma servono rifornimenti.'),SL('LULÙ','Ognuno qui copre un tratto di strada.'),SL('MIRA','Decidete se aprire un varco rapido o rinforzare le difese per la traversata.')],
  options:{
   flank:{id:'flank',label:'Incursione sui fianchi',hint:'Dario/Mira aprono i vicoli: +1 danno in tutto l’Atto II (moli e breccia) +12 monete.',thermalDelta:2,reward:{coins:12,scrap:10},notice:'Piano sbloccato: +1 danno verso la Breccia · +12 monete e +10 rottami.'},
   armor:{id:'armor',label:'Corazza di convoglio',hint:'Rinforzo strutturale: +2 salute massima in tutto l’Atto II (moli e breccia) +1 kit.',thermalDelta:4,reward:{coins:8,medkit:1},notice:'Piano sbloccato: +2 salute verso la Breccia · +8 monete e +1 kit.'}
  }
 },
 cathedral:{
  service:'relic',
  npc:'Maelis · Custode delle reliquie',
  cta:'Sigillo della Cattedrale · Atto II',
  lockNote:'Maelis custodisce le chiavi della navata inferiore. Parla con lei nella Sacrestia prima di partire.',
  title:'Quale dottrina portate sotto la Cattedrale?',
  lines:()=>[SL('CUSTODE','Sotto l’altare i quadranti battono un’ora divisa. Qualcosa ascolta dalla navata e dalle corsie.'),SL('LULÙ','Dobbiamo raggiungere il Nodo senza lasciare nessuno indietro.'),SL('CUSTODE','Prendete il sigillo spezzato o la lampada del santuario: cambierà il modo in cui resisterete laggiù.')],
  options:{
   seal:{id:'seal',label:'Sigillo di risonanza',hint:'Carica le mosse speciali: +1 potenza abilità al Tiranno, Clinico e Nodo +15 rottami.',thermalDelta:1,reward:{scrap:15,coins:10},notice:'Dottrina sbloccata: +1 potenza mosse speciali · +15 rottami.'},
   sanctuary:{id:'sanctuary',label:'Lampada del santuario',hint:'Ogni relè o nodo acceso cura +1 salute in più sotto la Cattedrale +1 kit medico.',thermalDelta:5,reward:{medkit:1,coins:10},notice:'Dottrina sbloccata: +1 cura ai nodi · +1 kit medico.'}
  }
 },
 toxic:{
  service:'info',
  npc:'Vesper · Informatore',
  cta:'Codici dell’Archivio · Atto III',
  lockNote:'Solo Vesper conosce i ponti asciutti e i passaggi cifrati dell’Atto III. Incontralo nel Retro del bazar.',
  title:'Come attraversare le acque tossiche e l’Archivio?',
  lines:()=>[SL('ABITANTE','Elyon setaccia ogni segnale verso la fonderia e la città sommersa. Anche in solitaria siete tracciati.'),SL('NOX','Non restiamo fermi ad aspettare le pattuglie.'),SL('ABITANTE','Scegliete tra filtri chimici a tenuta o bypass sui caricatori magnetici.')],
  options:{
   purify:{id:'purify',label:'Filtri di bonifica',hint:'Tenuta anti-spore: +2 salute massima in fonderia, porto e Archivio +1 kit medico.',thermalDelta:4,reward:{medkit:1,coins:12},notice:'Passaggio sbloccato: +2 salute sull’Atto III · +1 kit medico.'},
   cipher:{id:'cipher',label:'Codici di sovraccarico',hint:'Bypass magnetico: +2 colpi nel caricatore in tutto l’Atto III +18 rottami.',thermalDelta:1,reward:{scrap:18,coins:12},notice:'Passaggio sbloccato: +2 munizioni per caricatore · +18 rottami.'}
  }
 },
 clockwork:{
  service:'smith',
  npc:'Rika Dorn · Maestra Fonditrice',
  cta:'Chiave dell’Asse · Atto IV',
  lockNote:'Rika Dorn ha fuso l’innesto per gli ascensori dell’Asse. Passa alla Fonderia prima dello scontro finale.',
  title:'Come tarare la salita verso l’Asse?',
  lines:()=>[SL('ABITANTE','Lassù gli ascensori tagliano il passo a chi esita. Ogni secondo contro Archon pesa.'),SL('NOX','Questa è l’ultima salita.'),SL('ABITANTE','Posso alleggerire i giunti per la velocità di tiro o caricare le molle per l’impatto puro.')],
  options:{
   bypass:{id:'bypass',label:'Scappamento rapido',hint:'Giunti alleggeriti: +6 velocità e cadenza più rapida su Linea, Asse e Finale.',thermalDelta:3,reward:{coins:16,scrap:12},notice:'Taratura sbloccata: +6 velocità e cadenza sull’Atto IV.'},
   overload:{id:'overload',label:'Molla da sfondamento',hint:'Pressione massima: +1 danno in tutti gli scontri verso Archon +1 kit medico.',thermalDelta:2,reward:{coins:12,medkit:1},notice:'Taratura sbloccata: +1 danno sull’Atto IV · +1 kit.'}
  }
 },
 ash_docks:{service:'smith',npc:'Kael · Mastro Gruista',cta:'Rotta dei Moli · Argani',title:'Come usare le gru dello scalo?',lines:()=>[SL('ABITANTE','Le chiatte bloccano il canale esterno. Possiamo recuperare acciaio o aprirci corsie rapide.')],options:{winch:{id:'winch',label:'Recupera i container',hint:'+20 rottami e +15 monete dai fondali.',thermalDelta:2,reward:{scrap:20,coins:15},notice:'Gru sbloccate: +20 rottami e +15 monete.'},lane:{id:'lane',label:'Apri la corsia piloti',hint:'+1 kit medico e +22 monete dal molo.',thermalDelta:3,reward:{coins:22,medkit:1},notice:'Corsia piloti aperta: +22 monete e +1 kit.'}}},
 antenna_port:{service:'inn',npc:'Nereo · Operatore d’Ascolto',cta:'Rotta Costiera · Frequenze',title:'Quale canale aprire nella nebbia?',lines:()=>[SL('ABITANTE','I fari costieri trasmettono rotte civili e depositi sommersi.')],options:{rescue:{id:'rescue',label:'Canale convogli civili',hint:'+18 monete, +1 kit e segnale più pulito.',thermalDelta:4,reward:{coins:18,medkit:1},notice:'Canale aperto: +18 monete e +1 kit medico.'},salvage:{id:'salvage',label:'Frequenza relitti',hint:'+25 rottami dalle boe del porto.',thermalDelta:1,reward:{scrap:25,coins:10},notice:'Relitti recuperati: +25 rottami e +10 monete.'}}},
 clinic_ward:{service:'inn',npc:'Ines · Custode dell’Anamnesi',cta:'Registro Corsie · Memoria',title:'Come proteggere i registri della clinica?',lines:()=>[SL('INES','Queste piastrine appartengono a chi è passato di qui durante l’evacuazione.')],options:{archive:{id:'archive',label:'Metti in salvo i nomi',hint:'+1 kit medico, +15 monete e +4 intesa.',thermalDelta:4,reward:{coins:15,medkit:1},notice:'Nomi salvati: +15 monete e +1 kit medico.'},supplies:{id:'supplies',label:'Apri la farmacia sigillata',hint:'+2 kit medici e +12 rottami.',thermalDelta:2,reward:{medkit:2,scrap:12},notice:'Farmacia aperta: +2 kit medici e +12 rottami.'}}},
 node_commons:{service:'relic',npc:'Vera · Guardiana delle Turbine',cta:'Sfiati del Nodo · Energia',title:'Dove deviare il surplus del Nodo?',lines:()=>[SL('ABITANTE','Le turbine hanno accumulato carica extra dopo la caduta del Custode.')],options:{grid:{id:'grid',label:'Alimenta le case del blocco',hint:'+24 monete e +3 intesa civica.',thermalDelta:3,reward:{coins:24,medkit:1},notice:'Surplus deviato: +24 monete e +1 kit.'},cell:{id:'cell',label:'Condensa celle di ricambio',hint:'+28 rottami per la forgia.',thermalDelta:1,reward:{scrap:28,coins:10},notice:'Celle condensate: +28 rottami e +10 monete.'}}},
 chalk_harbor:{service:'info',npc:'Salvo · Maestro d’Ascia',cta:'Chiusa Salmastra · Scafo',title:'Cosa recuperare dal cantiere?',lines:()=>[SL('ABITANTE','La marea bassa scopre le chiglie vecchie sotto la falesia.')],options:{hull:{id:'hull',label:'Tempratura al sale fossile',hint:'+22 rottami e +15 monete.',thermalDelta:2,reward:{scrap:22,coins:15},notice:'Tempratura completata: +22 rottami e +15 monete.'},chart:{id:'chart',label:'Carte delle correnti',hint:'+25 monete e +1 kit medico.',thermalDelta:3,reward:{coins:25,medkit:1},notice:'Carte recuperate: +25 monete e +1 kit.'}}},
 lower_hearth:{service:'inn',npc:'Agata · Cuoca della Brace',cta:'Galleria Bassa · Scorte',title:'Come distribuire il calore della caldaia?',lines:()=>[SL('ABITANTE','Le gallerie basse tengono insieme gli operai con poco.')],options:{hearth:{id:'hearth',label:'Scalda il livello superiore',hint:'+20 monete, +1 kit e +4 intesa.',thermalDelta:4,reward:{coins:20,medkit:1},notice:'Livello riscaldato: +20 monete e +1 kit.'},metal:{id:'metal',label:'Recupera lega dalla fucina',hint:'+26 rottami e +12 monete.',thermalDelta:1,reward:{scrap:26,coins:12},notice:'Lega recuperata: +26 rottami e +12 monete.'}}},
 glass_terrace:{service:'shop',npc:'Cassian · Ottico delle Lenti',cta:'Prismi della Terrazza · Luce',title:'Come orientare gli specchi della cupola?',lines:()=>[SL('ABITANTE','I prismi leggono la tensione dei cavi intorno all’Asse.')],options:{lens:{id:'lens',label:'Focalizza le serre',hint:'+2 kit medici e +18 monete.',thermalDelta:4,reward:{coins:18,medkit:2},notice:'Serre illuminate: +18 monete e +2 kit.'},prism:{id:'prism',label:'Smonta i prismi rari',hint:'+24 rottami e +20 monete.',thermalDelta:1,reward:{scrap:24,coins:20},notice:'Prismi raccolti: +24 rottami e +20 monete.'}}},
 sky_rail:{service:'info',npc:'Tarek · Vedetta di Scambio',cta:'Binario Sospeso · Convogli',title:'Quale scambio sbloccare sui piloni?',lines:()=>[SL('ABITANTE','Da quassù ogni convoglio di Vanta ha un orario preciso.')],options:{cargo:{id:'cargo',label:'Devia il vagone scorte',hint:'+30 rottami e +20 monete.',thermalDelta:2,reward:{scrap:30,coins:20},notice:'Vagone deviato: +30 rottami e +20 monete.'},signal:{id:'signal',label:'Apri la linea passeggeri',hint:'+28 monete e +1 kit medico.',thermalDelta:4,reward:{coins:28,medkit:1},notice:'Linea aperta: +28 monete e +1 kit.'}}},
 deep_archive:{service:'relic',npc:'Solen · Archivista dei Quarzi',cta:'Bobine dei Fondatori · Memoria',title:'Cosa liberare dai cilindri di quarzo?',lines:()=>[SL('ABITANTE','Le memorie dei fondatori mostrano come nacque Vanta prima di Archon.')],options:{names:{id:'names',label:'Restituisci i ricordi ai quartieri',hint:'+25 monete, +1 kit e +4 intesa.',thermalDelta:4,reward:{coins:25,medkit:1},notice:'Ricordi liberati: +25 monete e +1 kit.'},blueprints:{id:'blueprints',label:'Estrai schemi d’officina',hint:'+32 rottami e +16 monete.',thermalDelta:2,reward:{scrap:32,coins:16},notice:'Schemi estratti: +32 rottami e +16 monete.'}}},
 axis_crown:{service:'relic',npc:'Seraphina · Cantora dell’Ora Uno',cta:'Campane dell’Asse · Alba',title:'Quale accordo suonare sull’Ora Uno?',lines:()=>[SL('ABITANTE','Centosettantotto anni senza un solo suono libero tra le nuvole.')],options:{dawn:{id:'dawn',label:'Accorda le campane all’alba',hint:'+30 monete, +2 kit e +5 intesa.',thermalDelta:5,reward:{coins:30,medkit:2},notice:'Campane accordate: +30 monete e +2 kit.'},echo:{id:'echo',label:'Raccogli i risonatori celesti',hint:'+35 rottami e +22 monete.',thermalDelta:2,reward:{scrap:35,coins:22},notice:'Risonatori raccolti: +35 rottami e +22 monete.'}}}
};
export function keyCharacterArc(hubId,flags={}){
 const a=KEY_CHARACTER_ARCS[hubId];if(!a)return null;
 return {
  hubId,
  service:typeof a.service==='function'?a.service(flags):a.service,
  npc:typeof a.npc==='function'?a.npc(flags):a.npc,
  cta:a.cta,lockNote:a.lockNote||'',title:a.title,lines:a.lines,options:a.options
 };
}
export function keyArcTexts(){
 const out=['★ CHIAVE','Rotta bloccata · ','Segui la freccia verso ','★ Rintraccia ','Sblocca missione'];
 const variants=[{blackout_choice:'workshop'},{blackout_choice:'shelter'}];
 for(const a of Object.values(KEY_CHARACTER_ARCS)){
  if(typeof a.npc==='string')out.push(a.npc);
  if(a.lockNote)out.push(a.lockNote);
  out.push(a.cta,a.title);
  for(const f of variants)for(const l of a.lines(f))out.push(l.text);
  for(const o of Object.values(a.options))out.push(o.label,o.hint,o.notice);
 }
 return out;
}

const I=(place,npc,job,greet,before,apart,after,lore)=>({place,npc,job,greet,ask:{before,apart,after},lore});
export const INTERIORS={
 moon:{
  inn:I('Locanda della Luna','Oren · Locandiere','moon_lamps','Entra, entra. Qui il buio resta fuori dalla porta.',
   'Mira conta le lampade ogni sera. Se ne manca una, non dorme.',
   'Oggi entri senza nessuno al fianco. La tazza in più la lascio lo stesso.',
   'Due tazze di nuovo. Lo sapevo che sarebbe tornata la normalità.',
   'La locanda era una stazione di ricarica. Le prese ci sono ancora, sotto la vernice.'),
  smith:I('Officina di Dario','Dario','moon_roof','Attento al banco: è caldo. Come sempre.',
   'La Vortex regge, ma ogni curva la sento io nelle ossa. Trattala bene.',
   'Ripari tutto da solo adesso? Allora impara a chiedere gli attrezzi.',
   'Il motore ha un suono nuovo. Più tranquillo. Come voi due.',
   'Questa chiave l’ho fatta con un pezzo di relè di Elyon. Funziona meglio dell’originale.'),
  shop:I('Banco del rifugio','Nadia · Rigattiera','','Prezzi giusti, merce asciutta. Guarda pure.',
   'Le batterie arrivano dal porto. Quando il porto si ferma, mi fermo anch’io.',
   'Si vende poco in questi giorni. La gente compra solo quello che serve per restare.',
   'Ho rimesso la vetrina. Non la mettevo da prima del Blackout.',
   'Questo banco è fatto con le porte del vecchio ascensore. Non chiedermi come le ho portate giù.')},
 cathedral:{
  smith:I('Forgia del Chiostro','Garrick · Mastro Forgiatore','','La pietra qui tiene il calore. Si lavora bene.',
   'Gli ingranaggi dei quadranti non sono di Elyon. Non li ha fatti nessuno che conosco.',
   'Una mano sola sul manubrio, eh? Ti preparo qualcosa che regge l’urto.',
   'Avete riportato la luce in tutte e due le navate. Si sente nel metallo.',
   'Il bronzo delle campane suona anche quando nessuno lo tocca. Lo ignoro e lavoro.'),
  relic:I('Sacrestia delle reliquie','Maelis · Custode delle reliquie','cathedral_clocks','Parla piano. Gli orologi ascoltano.',
   'Tre quadranti, tre ore diverse. Uno di loro dice la verità.',
   'Chi firma per salvare gli altri porta un peso che non si vede. Lo riconosco negli occhi.',
   'I quadranti hanno smesso di litigare. Per ora.',
   'Sotto l’altare c’è un orologio spezzato inciso nella pietra. È più vecchio della cattedrale.'),
  shop:I('Mercato coperto','Tomas Vale · Commerciante del Porto','cathedral_route','Eccoti al banco nuovo. Quello vecchio è rimasto al porto.',
   'Se riapri i cancelli, il mercato torna. E io smetto di dormire qui dietro.',
   'La gente chiede di voi. Rispondo che ognuno fa la sua strada.',
   'Il porto mi ha richiamato. Ho detto di aspettare: qui ho clienti fedeli.',
   'Al porto ho visto la Vortex passare senza fermarsi. Pensavo fosse un sogno.'),
  info:I('Stanza delle voci','Corvo · Confessore delle Voci','','Siediti. Qui si paga con le domande giuste.',
   'Elyon sente tutto quello che passa nei cavi. Qui non ci sono cavi.',
   'Una firma, diciannove persone salve. In città nessuno sa se ringraziare o avere paura.',
   'Il segnale di Elyon è più debole da quando siete tornati insieme. Coincidenze.',
   'Questa stanza era un confessionale. Le voci restano le stesse, cambiano solo i peccati.')},
 toxic:{
  smith:I('Officina dei tubi','Sara · Saldatrice dei Tubi','','Qui si salda con quello che l’acqua lascia.',
   'Niente cavi di Elyon in questo quartiere. Solo mani e pazienza.',
   'Non è un buon posto per stare da soli. Ma lavori bene, te lo concedo.',
   'L’acqua scorre pulita fino al ponte. Prima non arrivava a metà.',
   'Ogni tubo porta il nome di chi l’ha montato. Il mio è quello che perde.'),
  alchemist:I('Laboratorio dell’alchimista','Ilyra · Alchimista','toxic_water','Non toccare le fiale verdi. Le altre puoi annusarle.',
   'Le pompe autonome tengono vivo il quartiere. Se una si ferma, si ferma un pezzo di noi.',
   'Ho un filtro per il corpo. Per il resto devi trovarlo da te.',
   'Sorridete di più tutti e due. Fa bene ai polmoni, l’ho misurato.',
   'Queste ricette erano di mia madre. Lei le scriveva sul retro dei moduli di Elyon.'),
  shop:I('Bazar dei filtri','Mara · Filtraia del Bazar','','Filtri, guarnizioni, fortuna in bottiglia. L’ultima non funziona.',
   'Chi arriva qui ha perso qualcosa. Io vendo quello che aiuta a restare.',
   'Ti vedo passare spesso, sempre senza nessuno. Ti faccio lo sconto dei solitari.',
   'Due clienti invece di uno. Il bazar ringrazia.',
   'Questa radio ripara le altre radio. Non chiedermi chi ha riparato lei.'),
  info:I('Retro del bazar','Vesper · Informatore','toxic_route','Parla basso. Anche l’acqua porta le voci.',
   'L’Archivio legge chi lo attraversa. Isola il tuo impianto prima di entrare.',
   'Elyon cerca la firma EVE-47. Ogni giorno un po’ più vicino.',
   'Da quando siete insieme, Elyon sbaglia le previsioni. Mi piace.',
   'I ponti asciutti li ho segnati io. Chi non può attraversare l’acqua merita una strada.')},
 clockwork:{
  smith:I('Fonderia degli ingranaggi','Rika Dorn · Maestra Fonditrice','','Mani lontane dai denti. Gli ingranaggi non perdonano.',
   'Questi pezzi non seguono le misure di Elyon. Seguono qualcosa di più vecchio.',
   'Lavori come chi ha qualcosa da dimostrare. Va bene, ma bevi acqua.',
   'Il ritmo delle macchine è cambiato. Più regolare. Non so perché.',
   'Ho fuso un ingranaggio impossibile. Gira in entrambi i sensi. Lo tengo per ricordo.'),
  shop:I('Magazzino dell’Asse','Orson · Magazziniere dell’Asse','','Ricambi, molle, orologi che non segnano l’ora. Scegli.',
   'Qui ogni cosa ha due prezzi: quello giusto e quello di Elyon.',
   'Gli stranieri caduti dal cielo hanno comprato tutto il mio olio. Poi sono spariti.',
   'Siete tornati insieme. Allora metto da parte le molle buone.',
   'Questa molla l’ho trovata dentro un automa spento. Era ancora carica.'),
  relic:I('Camera delle fondamenta','Vasco · Custode delle Fondamenta','clockwork_links','Le fondamenta sono più vecchie della città. Cammina piano.',
   'Gli orologi non seguono la stessa ora. Uno di loro aspetta qualcuno.',
   'Il tempo qui si allunga per chi è solo. Non lasciarti fermare.',
   'Gli orologi segnano finalmente la stessa ora. È la prima volta da quando ci sono io.',
   'Su questa pietra c’è lo stesso orologio spezzato della cattedrale. Qualcuno è passato prima di Elyon.'),
  info:I('Torre delle molle','Cael · Vedetta delle Molle','clockwork_shelter','Abbassa la testa: la trave è bassa e le notizie pesano.',
   'Dicono che l’Asse si apra solo per chi conosce l’ora giusta. Nessuno la conosce.',
   'Le passerelle laterali portano fuori. Nessuno dovrebbe restare chiuso qui dentro.',
   'La meccanica ha rifatto l’innesto della Vortex. Adesso il sedile in più non scricchiola.',
   'Gli automi si riparano da soli. Io controllo che non diventino troppo bravi.')},
 ash_docks:{
  inn:I('Mensa del Molo','Bram · Oste del Molo','ash_lights','Siediti vicino alla stufa: il vento del bacino taglia la pelle.',
   'Le lanterne sul pontile tengono lontani i droni ciechi. Se si spengono, chiudiamo le paratie.',
   'Una panca vuota accanto a te? Ti tengo il brodo caldo finché non tornate in due.',
   'Il pontile brilla tutto. Non vedevo tante barche rientrare insieme da anni.',
   'Sotto queste assi c’è ancora l’acqua salata del primo scavo.'),
  smith:I('Officina delle Gru','Kael · Mastro Gruista','ash_cranes','Occhio alle catene: qui si raddrizzano ganci da tre tonnellate.',
   'Gli argani del bacino sono bloccati dalla ruggine. Senza gru, il molo muore.',
   'Viaggi leggero ma colpisci duro. Ti tempero la lama con l’olio delle turbine.',
   'Avete rimesso in moto l’intero scalo. Il metallo canta quando lavorate insieme.',
   'Questi bulloni portano il marchio della vecchia compagnia portuale, prima di Elyon.'),
  shop:I('Emporio della Chiatta','Sora · Mercante della Chiatta',null,'Merce recuperata dai fondali, asciugata e garantita.',
   'Chi scende nei condotti compra corde e batterie. Chi torna vivo compra da bere.',
   'Fai scorta prima di scendere: là sotto nessuno ti farà credito.',
   'Da quando il molo è sicuro, arrivano carichi anche dai canali esterni.',
   'Questa bussola punta sempre verso l’Asse, non verso il nord.')},
 antenna_port:{
  inn:I('Cabina d’Ascolto','Nereo · Operatore d’Ascolto','antenna_beacons','Metti le cuffie. Quello che senti non è vento, è traffico cifrato.',
   'I fari costieri battono un codice antico. Ricalibrali e vedrai cosa nasconde la nebbia.',
   'Ho intercettato il nome EVE-47 su tre canali diversi. Qualcuno ha firmato col proprio sangue.',
   'I vostri due segnali viaggiano in fase perfetta. Elyon non riesce più a separarli.',
   'Le antenne non sono state costruite per parlare con la città, ma con qualcosa là fuori.'),
  smith:I('Officina del Traliccio','Elia · Fabbro dei Tralicci','antenna_cables','Le scintille qui non vengono dalla forgia, ma dalle antenne sopra il tetto.',
   'I condensatori sui tetti stanno cedendo. Se saltano, perdiamo la finestra sul porto.',
   'Da solo contro i ricevitori di Elyon? Ti servo una schermatura doppia.',
   'I tralicci cantano pulito adesso. Nessun ronzio di fondo.',
   'Costruivo parabole per le navi d’alta quota. Ora le uso per ascoltare chi mente.'),
  shop:I('Banco delle Onde','Dalia · Commerciante delle Onde',null,'Valvole, cavi schermati e viveri da banchina. Scegli in fretta.',
   'Il mare porta relitti, il cielo porta segnali. Io vendo tutto quello che resta in mezzo.',
   'Le pattuglie cercano due ombre, ma oggi ne vedo una sola. Tieni il profilo basso.',
   'Il mercato delle frequenze è tornato libero. Persino i pescherecci trasmettono musica.',
   'Dentro questa radio c’è registrata la prima trasmissione di Vanta.')},
 clinic_ward:{
  inn:I('Cappella dell’Anamnesi','Ines · Custode dell’Anamnesi','clinic_beds','Ogni piastrina appesa qui apparteneva a qualcuno che Elyon voleva dimenticare.',
   'Nelle corsie chiuse sono rimaste delle piastrine d’argento. Riportamele, ti prego.',
   'Chi rinuncia a se stesso per proteggere un altro lascia un’eco che nessuna macchina cancella.',
   'Siete entrambi qui. Allora il registro dei dispersi oggi perde due righe.',
   'La prima paziente del distretto portava il numero zero. Il suo letto non è mai stato rifatto.'),
  alchemist:I('Spezieria Bianca','Vane · Speziale del Chiostro','clinic_filters','Camice pulito e mani ferme. Dimmi dove fa male.',
   'I distillatori nei sotterranei sono rimasti accesi. Ho bisogno di quei sieri puri.',
   'Il tuo battito è accelerato. Non puoi portare il peso di due vite senza riposare.',
   'L’aria del chiostro sa di menta e ozono. Avete guarito anche questo quartiere.',
   'Sulle vecchie cartelle cliniche non ci sono nomi, solo orari di nascita.'),
  shop:I('Dispensa del Chiostro','Marta · Dispensiera',null,'Bende sterili, filtri respiratori e razioni ad alta resa.',
   'I medici di Elyon curavano solo chi serviva al turno successivo. Qui curiamo tutti.',
   'Prendi una dose in più. Chi cammina da solo non ha chi lo rialza.',
   'Le corsie stanno diventando appartamenti. La gente vuole vivere qui, non solo sopravvivere.',
   'Questo armadietto aveva il sigillo del primario. L’abbiamo aperto con un piede di porco.')},
 node_commons:{
  smith:I('Officina del Condotto','Bran Kess · Fabbro del Condotto','node_seals','Guanti isolanti obbligatori. Qui si lavora col rame vivo.',
   'I sezionatori di Elyon ci rubano metà della potenza. Sganciali e avremo corrente vera.',
   'Un impianto sotto sforzo scalda il doppio. Lascia che ti rinforzi le giunture.',
   'Con voi due in giro, i droni di manutenzione non osano più scendere nei pozzi.',
   'Ho inciso il nostro simbolo su ogni trasformatore. Così sanno di chi è la luce.'),
  relic:I('Sala delle Turbine','Vera · Guardiana delle Turbine','node_plates','Qui il pavimento trema sempre, ma il caffè non si rovescia mai.',
   'Se apriamo gli sfiati secondari, avremo acqua calda per tutte le famiglie del blocco.',
   'Hai lo sguardo di chi ha visto il centro della rete. Siediti prima di crollare.',
   'Sentite questo ronzio? È il Nodo che lavora per noi, non il contrario.',
   'Il bancone è ricavato dal coperchio di un reattore di prima generazione.'),
  info:I('Archivio dei Turni','Lio · Analista dei Turni',null,'Io non guardo le telecamere: guardo i consumi elettrici. Non mentono mai.',
   'Quando il Custode è caduto, tre sottostazioni hanno cambiato frequenza da sole.',
   'Metà della rete cerca una ragazza, l’altra metà teme un ragazzo. Bel lavoro.',
   'Il registro centrale ha smesso di calcolare le probabilità. Siete fuori scala.',
   'Sotto il Nodo c’è una mappa di Vanta disegnata prima che nascesse il primo cittadino.')},
 chalk_harbor:{
  inn:I('Locanda della Scogliera','Giona · Locandiere della Falesia','chalk_cisterns','Togli il gesso dagli stivali prima di entrare, il resto è offerto.',
   'I teli frangivento sulle terrazze si stanno strappando. Senza, la polvere ci seppellirà.',
   'Il mare bianco fa sembrare tutto più lontano. Ma chi aspetti sa dove trovarti.',
   'Avete portato il sereno fin sulla falesia. Stasera si mangia pesce fresco.',
   'Quando la marea scende del tutto, si vedono i tetti di un quartiere ancora più antico.'),
  shop:I('Mercato del Sale','Talia · Mercante del Sale',null,'Cristalli puri, corde catramate e lampade a olio di scoglio.',
   'Saliamo e scendiamo con le ceste ogni ora. Le gambe fanno male, ma siamo liberi.',
   'Ti do una bussola a peso: funziona anche dove i campi magnetici impazziscono.',
   'I mercanti della cattedrale sono scesi fino a qui per comprare il nostro sale.',
   'Dentro questi blocchi di gesso a volte troviamo monete che nessuno sa leggere.'),
  info:I('Cantiere delle Chiglie','Salvo · Maestro d’Ascia','chalk_steps','Il sale mangia il ferro, ma quello che forgio io mangia il sale.',
   'Le chiuse salmastre sono incrostate. Spacca i blocchi di cristallo e l’acqua tornerà a girare.',
   'Braccio teso e passo corto: combatti come chi non può permettersi un errore.',
   'La Vortex ha tenuto il sale e la pietra. Merita una lucidatura da ammiraglia.',
   'Usiamo ossa di cetaceo fossile per temprare l’acciaio. Vecchia ricetta dei cantieri.')},
 lower_hearth:{
  inn:I('Mensa della Brace','Agata · Cuoca della Brace','lower_valves','Prendi una scodella. Finché la caldaia brucia, nessuno resta a stomaco vuoto.',
   'I condotti della fuliggine sono saturi. Se li liberi, potremo scaldare anche il livello superiore.',
   'Chi divide il pane quando ha fame non resta mai davvero solo. Ricordatelo.',
   'C’è posto per tutti e due vicino al fuoco grande. È festa in tutta la galleria.',
   'La prima scintilla di questa fornace fu accesa con una batteria della vecchia guardia.'),
  smith:I('Fucina del Maglio','Rocco · Battitore del Maglio','lower_lamps','Qui non usiamo mantici: usiamo il fiato della terra.',
   'Due tubazioni madri stanno perdendo pressione. Stringi le flange prima che il freddo entri.',
   'Ti ho visto tenere la linea là fuori. Questo acciaio è duro quanto la tua testa.',
   'Due cuori battono meglio di uno, specie quando intorno tutto trema.',
   'Il maglio centrale batte sessanta colpi al minuto. È il polso della città bassa.'),
  alchemist:I('Distilleria Termica','Miriam · Distillatrice Termica',null,'Vapore condensato, sali minerali e tonici contro la stanchezza.',
   'L’acqua che sale dalle rocce profonde è sterile ma carica di ferro. Va dosata col contagocce.',
   'Prendi questo decotto: scioglie il gelo dalle dita e tiene sveglia la mente.',
   'Ho creato una miscela nuova per festeggiare. Sa di cannella e libertà.',
   'I funghi che crescono vicino ai tubi caldi assorbono le radiazioni di fondo.')},
 glass_terrace:{
  inn:I('Serra dei Cristalli','Livia · Custode della Serra','glass_mirrors','Cammina tra i vasi con cautela: queste piante respirano luce pura.',
   'Le lenti solari sul tetto sono fuori asse. Raddrizzale e le erbe mediche fioriranno.',
   'Anche un ramo spezzato può fare radici se trova il terreno giusto. Non disperare.',
   'Guarda: le orchidee di vetro si sono aperte tutte insieme. Sentono quando torna l’armonia.',
   'Questi semi provengono dai giardini orbitali, caduti durante il primo inverno.'),
  shop:I('Galleria delle Lenti','Cassian · Ottico delle Lenti','glass_boats','Vetri ottici, prismi di ricambio e provviste scelte.',
   'Quando arriva la tempesta d’alta quota, solo le imposte blindate salvano le vetrate.',
   'Un cliente silenzioso oggi. Ti incarto la merce nella seta termica, resiste a tutto.',
   'La luce che entra dalle cupole oggi sembra oro liquido. Prendi quello che vuoi.',
   'Se guardi l’Asse attraverso questo prisma, vedi i cavi che lo tengono legato.'),
  relic:I('Padiglione degli Specchi','Selen · Guardiana degli Specchi',null,'Ogni specchio conserva l’immagine di chi ci si è fermato davanti.',
   'I nobili di Vanta venivano qui per dimenticare la fuliggine. Ora ci abitano i giardinieri.',
   'Nello specchio vedo una figura sola, ma l’ombra dietro di te ha ancora due profili.',
   'Gli specchi non tremano più. La città ha smesso di avere paura del cielo.',
   'Dietro il mosaico centrale c’è inciso il progetto originale della Terrazza.')},
 sky_rail:{
  smith:I('Hangar dei Piloni','Ada · Capofficina dei Piloni','sky_switches','Tieniti alla ringhiera! Quando passa un convoglio, l’officina oscilla.',
   'Gli scambi magnetici sulla linea esterna sono bloccati. Sbloccali o i vagoni deraglieranno.',
   'Correre sui binari sospesi richiede fegato. Ti sistemo gli scarponi e il telaio.',
   'I treni viaggiano a pieno carico tra tutti i quartieri. Avete unito la città.',
   'Questa trave d’acciaio è stata saldata in volo da mia nonna.'),
  shop:I('Vagone Dispensa','Milo · Vivandiere del Convoglio',null,'Tutto quello che serve per un viaggio lungo, stipato in tre metri quadri.',
   'Compro alla stazione bassa e vendo al capolinea. Il segreto è non guardare giù.',
   'Biglietto singolo? Non importa, il ritorno è sempre compreso per chi resiste.',
   'Oggi offro io il rifornimento. La linea del cielo è finalmente nostra.',
   'Il vecchio controllore timbrava i biglietti con un orologio a tredici ore.'),
  info:I('Torre di Scambio','Tarek · Vedetta di Scambio','sky_signals','Da quassù vedo ogni convoglio di Vanta. Nessuno si muove in segreto.',
   'I freni d’emergenza sui piloni sono sabotati. Riattivali prima dell’ultimo carico.',
   'Un treno blindato è salito verso l’Asse a luci spente. Portava una sola passeggera.',
   'Le rotaie cantano una canzone nuova. Non ci sono più convogli prigione.',
   'I binari non finiscono all’Asse: c’è una rampa che punta dritta verso le nuvole.')},
 deep_archive:{
  alchemist:I('Camera di Decantazione','Nora · Chimica Crio-Spore','deep_capsules','Parla piano, le vasche di raffreddamento reagiscono alle vibrazioni della voce.',
   'I pozzi criogenici stanno bollendo. Apri i circuiti freddi o i nastri fonderanno.',
   'La tua mente ha sopportato un’intrusione profonda. Questo tonico pulisce le sinapsi.',
   'Il liquido nelle colonne è diventato limpido come acqua di fonte. È finita.',
   'Usavano il freddo per rallentare i pensieri delle copie. Noi lo usiamo per conservarne la storia.'),
  relic:I('Sala delle Bobine','Solen · Archivista dei Quarzi','deep_tapes','Ogni cilindro di quarzo qui dentro è una vita intera. Non farli cadere.',
   'Tre celle di memoria portano ancora il blocco di Elyon. Spezza i sigilli e restituiscile.',
   'Chi porta il marchio quarantasei e chi porta il quarantasette non erano destinati a incontrarsi.',
   'Le bobine girano libere. Per la prima volta, i ricordi appartengono a chi li ha vissuti.',
   'Nella prima fila ci sono i ricordi dei fondatori. Avevano paura del buio quanto noi.'),
  info:I('Pozzo degli Indici','Eren · Vecchio Cartografo',null,'Qui non cerchiamo segreti: cerchiamo le pagine che sono state strappate.',
   'EVE-Prime non era un’arma, era una diga. Qualcuno aveva paura di ciò che siamo.',
   'Hai lasciato andare la voce che ti guidava. Ora ogni passo che fai è solo tuo.',
   'Ho unito i vostri due fascicoli in uno solo. E poi l’ho tolto dal server.',
   'L’indice generale ha una pagina bianca alla fine. È quella che comincia oggi.')},
 axis_crown:{
  inn:I('Loggia dei Venti','Aurel · Intendente dei Venti',null,'Rifornimenti d’élite per chi cammina sopra le nuvole.',
   'Quassù l’aria è sottile ma i pensieri sono chiari. Prendi il meglio che ho.',
   'Anche sulla soglia dell’ultima porta, un buon equipaggiamento fa la differenza.',
   'Niente più pedaggi, niente più codici d’accesso. La Corona è aperta a tutta Vanta.',
   'Vendo frammenti del vecchio guscio di Archon come portafortuna. Vanno a ruba.'),
  smith:I('Forgia d’Apogeo','Valen · Forgiatore d’Apogeo','crown_anchors','A questa quota il fuoco brucia azzurro. L’acciaio qui diventa eterno.',
   'I morsetti orbitali tengono la terrazza in gabbia. Sganciali e il cielo si aprirà.',
   'Sei arrivato fin quassù con le tue gambe. Lascia che renda le tue armi degne della cima.',
   'Le catene dell’Asse sono spezzate. Non ho mai forgiato sotto una luce così bella.',
   'Questo metallo viene da un meteorite catturato il giorno in cui fu acceso Archon.'),
  relic:I('Santuario dell’Ora Uno','Seraphina · Cantora dell’Ora Uno','crown_bells','Ascolta: per la prima volta in centosettantotto anni, non c’è nessun conto alla rovescia.',
   'Le campane del vento sono rimaste mute troppo a lungo. Accordale per salutare l’alba.',
   'Chi ti aspetta oltre la piattaforma non cerca vendetta, cerca una risposta.',
   'L’Ora Uno è iniziata, e voi due siete qui per vederla. Custodirò questo momento.',
   'Sul pavimento di marmo c’è una meridiana solare. Funziona solo quando le nuvole si aprono.')}
};
