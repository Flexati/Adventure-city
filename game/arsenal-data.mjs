// Regional market weapons, armor/relics, diversified district catalogs, and hero progression moves.
export const MARKET_WEAPONS=Object.freeze(Object.fromEntries(Object.entries({
 mg_tempest:{name:'Mitragliatrice Tempest-9',short:'Tempest-9',proj:'tracer',damage:.58,range:335,magazine:40,reload:1.45,cooldown:.34,burst:5,pellets:1,spread:.05,pierce:1,color:'#7de8ff',price:55,desc:'Mitragliatrice compatta: raffiche da 5 colpi ad alta cadenza. Sblocca l’arma in arsenale.'},
 mg_vulcan:{name:'Mitragliatrice Vulcan',short:'Vulcan-8',proj:'heavy_tracer',damage:.66,range:365,magazine:64,reload:1.95,cooldown:.50,burst:8,pellets:1,spread:.07,pierce:1,color:'#ffb85c',price:95,desc:'Mitragliatrice pesante da 8 colpi a raffica e caricatore da 64. Sblocca l’arma in arsenale.'},
 mg_helix:{name:'Sub-Mitra Helix',short:'Helix-SMG',proj:'twin_tracer',damage:.46,range:300,magazine:48,reload:1.30,cooldown:.28,burst:4,pellets:2,spread:.06,pierce:1,color:'#94ffd8',price:80,desc:'Sub-mitragliatrice binata: doppio fascio rapido a corto-medio raggio. Sblocca l’arma.'},
 orb_nova:{name:'Cannone Sfera Nova',short:'Sfera Nova',proj:'orb',damage:2.0,range:430,magazine:6,reload:1.65,cooldown:.66,burst:1,pellets:1,spread:0,pierce:1,orbSpeed:300,orbRadius:78,color:'#ff9d52',price:85,desc:'Lancia una sfera d’energia esplosiva ad area che travolge i gruppi. Sblocca l’arma.'},
 orb_void:{name:'Proiettore Sfera Chronos',short:'Sfera Chronos',proj:'orb',damage:1.7,range:410,magazine:5,reload:1.75,cooldown:.72,burst:1,pellets:1,spread:0,pierce:1,stun:1.2,orbSpeed:265,orbRadius:90,color:'#70f2ff',price:105,desc:'Sfera d’energia temporale: esplode ad area e stordisce i bersagli. Sblocca l’arma.'},
 plasma_carbine:{name:'Carabina al Plasma',short:'Plasma-2',proj:'bolt',damage:1.25,range:390,magazine:18,reload:1.45,cooldown:.44,burst:2,pellets:1,spread:.02,pierce:1,orbSpeed:540,orbRadius:22,color:'#6fffb0',price:75,desc:'Doppia scarica di dardi al plasma ad alta velocità. Sblocca l’arma in arsenale.'},
 scatter_flak:{name:'Doppietta Flak Breaker',short:'Flak Breaker',proj:'flak',damage:.58,range:230,magazine:8,reload:1.60,cooldown:.70,burst:1,pellets:7,spread:.13,pierce:1,stun:.35,color:'#ffd478',price:70,desc:'Rosa a 7 schegge pesanti con breve stordimento ravvicinato. Sblocca l’arma.'},
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

export const REGION_CATALOG=Object.freeze({
 moon:{inn:[],smith:['coil','mg_tempest','vest'],shop:['medkit','ammo_belt','glass_bead']},
 ash_docks:{inn:[],smith:['mg_tempest','scatter_flak','vest'],shop:['medkit','rig_scout','glass_bead']},
 antenna_port:{inn:[],smith:['coil','plasma_carbine','rig_scout'],shop:['medkit','ammo_belt','glass_bead']},
 cathedral:{smith:['resonator','rail_lance','vest'],relic:['echo','chrono_lens'],shop:['medkit','glass_bead'],info:['intel']},
 toxic:{smith:['scatter_flak','mg_vulcan','hazmat_coat','toxic_attack','toxic_defense'],alchemist:['medkit','bio_filter','echo'],shop:['medkit','ammo_belt','glass_bead'],info:['intel']},
 clockwork:{smith:['orb_void','rail_lance','rig_scout','clockwork_attack','clockwork_defense'],shop:['medkit','plasma_carbine','glass_bead'],relic:['echo','core_capacitor'],info:['intel']},
 clinic_ward:{inn:[],alchemist:['medkit','bio_filter','echo'],shop:['medkit','plasma_carbine','hazmat_coat','glass_bead']},
 node_commons:{smith:['orb_nova','arc_tesla','hazmat_coat'],relic:['core_capacitor','chrono_lens','echo'],info:['intel']},
 chalk_harbor:{inn:[],shop:['medkit','mg_helix','ammo_belt','glass_bead'],info:['intel']},
 lower_hearth:{inn:[],smith:['orb_nova','mg_vulcan','thermal_plate'],alchemist:['medkit','chrono_lens','bio_filter']},
 glass_terrace:{inn:[],relic:['chrono_lens','orb_void','echo'],shop:['medkit','scatter_flak','rig_scout','glass_bead']},
 sky_rail:{smith:['mg_helix','rail_lance','rig_scout'],shop:['medkit','arc_tesla','glass_bead'],info:['intel']},
 deep_archive:{alchemist:['medkit','bio_filter','arc_tesla'],relic:['core_capacitor','orb_nova','echo'],info:['intel']},
 axis_crown:{inn:[],smith:['mg_vulcan','orb_void','thermal_plate'],relic:['core_capacitor','rail_lance','echo']}
});

export const HERO_MOVES=Object.freeze({
 nox:Object.freeze([
  {id:'nox_pulse',act:1,minStep:'opening',name:'Impulso Chrono',short:'PULSE',kind:'beam',range:420,mult:3,bonus:2,cd:3.5,color:'#6bddff',desc:'Raggio perforante ad alto impatto che illumina il buio.'},
  {id:'nox_orb',act:2,minStep:'app_breach',name:'Sfera d’Energia Oscura',short:'SFERA',kind:'orb',range:440,radius:110,orbSpeed:280,mult:3.5,bonus:3,stun:1.4,cd:4.0,color:'#58e8ff',desc:'Lancia una sfera d’energia che esplode ad area e stordisce.'},
  {id:'nox_flurry',act:3,minStep:'exp_chalk_marks',name:'Tempesta di Zero',short:'TEMPESTA',kind:'nova_shot',radius:190,rays:8,mult:2.6,bonus:2,stun:.7,refill:.5,cd:4.2,color:'#9be6ff',desc:'Scarica a 360° e ricarica istantaneamente metà caricatore.'},
  {id:'nox_nova',act:4,minStep:'reunion',name:'Singolarità dell’Asse',short:'SINGOL.',kind:'orb',range:460,radius:140,orbSpeed:240,mult:5,bonus:4,stun:2.0,shift:.8,cd:4.8,color:'#c29eff',desc:'Sfera gravitazionale devastante: stordisce e rallenta il tempo.'}
 ]),
 lulu:Object.freeze([
  {id:'lulu_wave',act:1,minStep:'opening',name:'Onda di Risonanza',short:'RISONANZA',kind:'cone',range:240,mult:1,bonus:1,stun:2.2,cd:3.5,color:'#ff72d9',desc:'Onda frontale che stordisce i nemici e taglia le cime.'},
  {id:'lulu_orb',act:2,minStep:'app_breach',name:'Sfera Armonica',short:'SFERA',kind:'orb',range:420,radius:115,orbSpeed:275,mult:2.6,bonus:2,stun:2.5,heal:1,cd:4.0,color:'#ff9fe6',desc:'Sfera d’energia radiosa: stordisce ad area e cura +1 vita su colpo.'},
  {id:'lulu_aegis',act:3,minStep:'exp_chalk_marks',name:'Cupola d’Égida',short:'EGIDA',kind:'aegis',radius:185,mult:2.1,bonus:1,stun:2.2,inv:1.5,cd:4.2,color:'#ffd6f5',desc:'Onda circolare difensiva con 1,5 s di scudo invulnerabile.'},
  {id:'lulu_supernova',act:4,minStep:'reunion',name:'Coro Supernova',short:'CORO',kind:'chain_burst',range:380,chains:6,mult:3.6,bonus:2,stun:2.6,heal:1,cd:4.8,color:'#ffe49e',desc:'Fulgori armonici su tutti i nemici visibili +1 vita su colpo.'}
 ])
});
