// Regional market weapons, armor/relics, diversified district catalogs, and hero progression moves.
// R22: the three machine guns and the plasma carbine were brought back to the band of the kit weapons (VX-9, R-12):
// as delivered they halved every boss fight for the audit bot (tools/probe_arsenal_r22.mjs).
export const MARKET_WEAPONS=Object.freeze(Object.fromEntries(Object.entries({
 mg_tempest:{name:'Mitragliatrice Tempest-9',short:'Tempest-9',proj:'tracer',damage:.42,range:335,magazine:40,reload:1.45,cooldown:.48,burst:5,pellets:1,spread:.05,pierce:1,color:'#7de8ff',price:55,desc:'Mitragliatrice compatta: raffiche da 5 colpi ad alta cadenza. Sblocca l’arma in arsenale.'},
 mg_vulcan:{name:'Mitragliatrice Vulcan',short:'Vulcan-8',proj:'heavy_tracer',damage:.36,range:365,magazine:64,reload:1.95,cooldown:.62,burst:8,pellets:1,spread:.07,pierce:1,color:'#ffb85c',price:95,desc:'Mitragliatrice pesante da 8 colpi a raffica e caricatore da 64. Sblocca l’arma in arsenale.'},
 mg_helix:{name:'Sub-Mitra Helix',short:'Helix-SMG',proj:'twin_tracer',damage:.20,range:300,magazine:48,reload:1.30,cooldown:.44,burst:4,pellets:2,spread:.06,pierce:1,color:'#94ffd8',price:80,desc:'Sub-mitragliatrice binata: doppio fascio rapido a corto-medio raggio. Sblocca l’arma.'},
 orb_nova:{name:'Cannone Sfera Nova',short:'Sfera Nova',proj:'orb',damage:2.0,range:430,magazine:6,reload:1.65,cooldown:.66,burst:1,pellets:1,spread:0,pierce:1,orbSpeed:300,orbRadius:78,color:'#ff9d52',price:85,desc:'Lancia una sfera d’energia esplosiva ad area che travolge i gruppi. Sblocca l’arma.'},
 orb_void:{name:'Proiettore Sfera Chronos',short:'Sfera Chronos',proj:'orb',damage:1.7,range:410,magazine:5,reload:1.75,cooldown:.72,burst:1,pellets:1,spread:0,pierce:1,stun:1.2,orbSpeed:265,orbRadius:90,color:'#70f2ff',price:105,desc:'Sfera d’energia temporale: esplode ad area e stordisce i bersagli. Sblocca l’arma.'},
 plasma_carbine:{name:'Carabina al Plasma',short:'Plasma-2',proj:'bolt',damage:1.05,range:390,magazine:18,reload:1.45,cooldown:.50,burst:2,pellets:1,spread:.02,pierce:1,orbSpeed:540,orbRadius:22,color:'#6fffb0',price:75,desc:'Doppia scarica di dardi al plasma ad alta velocità. Sblocca l’arma in arsenale.'},
 scatter_flak:{name:'Doppietta Flak Breaker',short:'Flak Breaker',proj:'flak',damage:.46,range:230,magazine:8,reload:1.60,cooldown:.70,burst:1,pellets:7,spread:.13,pierce:1,stun:.35,color:'#ffd478',price:70,desc:'Rosa a 7 schegge pesanti con breve stordimento ravvicinato. Sblocca l’arma.'},
 rail_lance:{name:'Lancia a Rotaia K-88',short:'Lancia K-88',proj:'rail',damage:2.7,range:540,magazine:5,reload:1.85,cooldown:.84,burst:1,pellets:1,spread:0,pierce:4,color:'#ffe89e',price:110,desc:'Raggio magnetico perforante fino a 4 nemici in linea. Sblocca l’arma in arsenale.'},
 arc_tesla:{name:'Bobina Arco Mk.II',short:'Arco Mk.II',proj:'arc',damage:1.2,range:345,magazine:10,reload:1.50,cooldown:.56,burst:1,pellets:1,spread:0,pierce:1,chain:3,chainRange:160,stun:.85,color:'#cfa6ff',price:90,desc:'Scarica a catena su 4 nemici vicini con stordimento prolungato. Sblocca l’arma.'}
}).map(([id,w])=>[id,Object.freeze({id,market:true,...w})])));

export const MARKET_GEAR_ITEMS=Object.freeze({
 rig_scout:{name:'Imbrago da corsa',price:60,stock:1,slot:'armor',hp:2,haste:.04,description:'+2 salute e tiro più rapido di 0,04 s.'},
 hazmat_coat:{name:'Cappotto schermato',price:75,stock:1,slot:'armor',hp:3,description:'+3 salute a ogni ingresso in missione.'},
 thermal_plate:{name:'Corazza geotermica',price:110,stock:1,slot:'armor',hp:4,damage:1,description:'+4 salute e +1 danno a ogni missione.'},
 chrono_lens:{name:'Lente Chronos',price:70,stock:1,slot:'relic',haste:.05,magicHaste:.4,description:'Riduce i tempi di tiro e abilità.'},
 core_capacitor:{name:'Condensatore d’Asse',price:95,stock:1,slot:'relic',movePower:1,magicHaste:.6,description:'Potenzia mosse speciali e sfere d’energia.'},
 bio_filter:{name:'Filtro simbiotico',price:65,stock:1,slot:'relic',nodeHeal:1,description:'+1 salute extra a ogni dispositivo attivato.'},
 ammo_belt:{name:'Bandoliera tattica',price:50,stock:1,slot:'relic',magBonus:2,haste:.02,description:'+2 colpi bonus ai caricatori e ricarica rapida.'}
});

// R22: the four campaign villages keep the base gear every smith sold before (coil, resonator, vest) and add one
// regional weapon; what did not fit moved to the shop of the same village.
export const REGION_CATALOG=Object.freeze({
 moon:{inn:[],smith:['coil','resonator','vest','mg_tempest'],shop:['medkit','ammo_belt']},
 ash_docks:{inn:[],smith:['mg_tempest','scatter_flak','turbo_mk2','vest'],shop:['medkit','rig_scout']},
 antenna_port:{inn:[],smith:['coil','plasma_carbine','rig_scout'],shop:['medkit','ammo_belt']},
 cathedral:{smith:['coil','resonator','vest','rail_lance','turbo_mk3'],relic:['echo','chrono_lens'],shop:['medkit'],info:['intel']},
 toxic:{smith:['coil','resonator','vest','mg_vulcan','toxic_attack','toxic_defense'],alchemist:['medkit','bio_filter','echo'],shop:['medkit','ammo_belt','scatter_flak','hazmat_coat'],info:['intel']},
 clockwork:{smith:['coil','resonator','vest','turbo_mk4','clockwork_attack','clockwork_defense'],shop:['medkit','plasma_carbine','rig_scout'],relic:['echo','core_capacitor','orb_void'],info:['intel']},
 clinic_ward:{inn:[],alchemist:['medkit','bio_filter','echo'],shop:['medkit','plasma_carbine','hazmat_coat']},
 node_commons:{smith:['orb_nova','arc_tesla','hazmat_coat'],relic:['core_capacitor','chrono_lens','echo'],info:['intel']},
 chalk_harbor:{inn:[],shop:['medkit','mg_helix','ammo_belt'],info:['intel']},
 lower_hearth:{inn:[],smith:['orb_nova','mg_vulcan','thermal_plate','turbo_mk4'],alchemist:['medkit','chrono_lens','bio_filter']},
 glass_terrace:{inn:[],relic:['chrono_lens','orb_void','echo'],shop:['medkit','scatter_flak','rig_scout']},
 sky_rail:{smith:['mg_helix','rail_lance','rig_scout','turbo_mk2'],shop:['medkit','arc_tesla'],info:['intel']},
 deep_archive:{alchemist:['medkit','bio_filter','arc_tesla'],relic:['core_capacitor','orb_nova','echo'],info:['intel']},
 axis_crown:{inn:[],smith:['mg_vulcan','orb_void','thermal_plate','turbo_mk5'],relic:['core_capacitor','rail_lance','echo']}
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
  {id:'nox_nova',act:4,minStep:'reunion',early:'app_axis',name:'Singolarità dell’Asse',short:'SINGOL.',kind:'orb',range:460,radius:140,orbSpeed:240,mult:5,bonus:4,stun:2.0,shift:.8,cd:4.8,color:'#c29eff',desc:'Sfera gravitazionale devastante: stordisce e rallenta il tempo.'}
 ]),
 lulu:Object.freeze([
  {id:'lulu_wave',act:1,minStep:'opening',name:'Onda di Risonanza',short:'RISONANZA',kind:'cone',range:240,mult:1,bonus:1,stun:2.2,cd:3.5,color:'#ff72d9',desc:'Onda frontale che stordisce i nemici e taglia le cime.'},
  {id:'lulu_orb',act:2,minStep:'app_breach',name:'Sfera Armonica',short:'SFERA',kind:'orb',range:420,radius:115,orbSpeed:275,mult:2.6,bonus:2,stun:2.5,heal:1,cd:4.0,color:'#ff9fe6',desc:'Sfera d’energia radiosa: stordisce ad area e cura +1 vita su colpo.'},
  {id:'lulu_aegis',act:3,minStep:'exp_chalk_marks',name:'Cupola d’Égida',short:'EGIDA',kind:'aegis',radius:185,mult:2.1,bonus:1,stun:2.2,inv:1.5,cd:4.2,color:'#ffd6f5',desc:'Onda circolare difensiva con 1,5 s di scudo invulnerabile.'},
  {id:'lulu_supernova',act:4,minStep:'reunion',early:'vega',name:'Coro Supernova',short:'CORO',kind:'chain_burst',range:380,chains:6,mult:3.6,bonus:2,stun:2.6,heal:1,cd:4.8,color:'#ffe49e',desc:'Fulgori armonici su tutti i nemici visibili +1 vita su colpo.'}
 ])
});
