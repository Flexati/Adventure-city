import {campaignArsenalV9,MARKET_WEAPON_IDS,HERO_MOVES} from './weapons-v9.mjs';
import {newWorld,validateWorld} from './hubs.mjs';
import {missionLayout} from './layouts.mjs';
import {CHAPTERS} from './campaign.mjs';
import {createNarrativeState,validateNarrativeState} from './narrative.mjs';
// The campaign script: one ordered list of scenes, foot missions and drives.
// Act I is played together with alternating point of view; after Ora zero the two stories split.
const actOne=id=>CHAPTERS.find(c=>c.id===id);
// Stealth patrol routes follow the shared crossroads layout of every district map.
const PATROLS=[
 {role:'patrol',path:[{x:620,y:600},{x:915,y:600},{x:915,y:860},{x:620,y:860}]},
 {role:'patrol',path:[{x:130,y:640},{x:470,y:640},{x:470,y:810},{x:130,y:810}]},
 {role:'patrol',path:[{x:700,y:110},{x:700,y:470},{x:840,y:470},{x:840,y:110}]},
 {role:'patrol',path:[{x:1430,y:800},{x:1100,y:800},{x:1100,y:640},{x:1430,y:640}]}
];
export const FOOT={
 blackout:{...actOne('blackout'),pov:'nox',task:'Riaccendi i relè',boss:{kind:'rook',hp:60,openingAdds:['raider','raider']},goal:'Riaccendi i 3 relè, poi affronta Rook'},
 breach:{...actOne('breach'),pov:'lulu',task:'Chiudi le ancore',boss:{kind:'anchor',hp:112,openingAdds:['raider']},goal:'Chiudi le 3 ancore, poi ferma The Anchor'},
 contagion:{...actOne('contagion'),pov:'lulu',task:'Attiva i filtri',midEvent:{atNode:2,id:'clinic_auth'}},
 zero:{...actOne('zero'),pov:'nox',task:'Spegni i nuclei'},
 exp_chalk_marks:{id:'exp_chalk_marks',name:'Segni di Gesso',district:'Porto',threat:'Pattuglie di manutenzione',goal:'Riattiva i due accessi, poi proteggi il collegamento',kind:1,map:1,ambience:'port',color:'#f8d9a0',hp:12,speed:74,weapon:'Pistola di servizio',damage:3,cooldown:.32,magic:true,partner:false,pov:'lulu',mode:'chalk',nodeLabel:'ACCESSO',task:'Apri gli accessi',channel:.65,hold:24,waveEvery:12,
  waves:[['raider','shooter'],['breaker','raider'],['shooter','raider']],end:'Il gesso continua oltre la riparazione. Gli abitanti attraversano da soli.'},
 below:{id:'below',name:'05 · Sotto il Nodo',district:'Livelli bassi',threat:'Guide di Elyon',goal:'Apri le 3 valvole termiche',kind:3,map:3,color:'#ff6a6a',hp:25,speed:66,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:false,dark:true,tint:'#2a0710',pov:'nox',nodeLabel:'VALVOLA',task:'Apri le valvole',
  waves:[['raider','shooter','signal'],['shooter','raider','breaker'],['brute','shooter','signal'],['breaker','breaker','shooter']],end:'Il calore torna nelle mani. Sopra di te, qualcosa nel Nodo si raffredda.'},
 city:{id:'city',name:'06 · La città senza di te',district:'Cantiere Est',threat:'Gang dei Relè',goal:'Difendi il cancello finché torna la corrente',kind:0,map:0,color:'#ffb65c',hp:10,speed:76,weapon:'Pistola di servizio',damage:3,cooldown:.32,magic:true,partner:false,pov:'lulu',mode:'defend',zone:{x:768,y:730,r:150},hold:55,waveEvery:11,start:{x:768,y:800},
  waves:[['raider','raider'],['breaker','shooter'],['raider','raider','signal'],['breaker','shooter','raider'],['brute','raider','shooter']],end:'Il generatore riparte. Il quartiere torna a fare rumore.'},
 port:{id:'port',name:'07 · Porto spento',district:'Porto delle Antenne',threat:'Pattuglie di manutenzione',goal:'Raggiungi le 3 antenne senza farti vedere',kind:1,map:1,color:'#58d9ff',hp:11,speed:82,weapon:'Pistola a impulsi',damage:3,cooldown:.34,magic:true,partner:false,pov:'lulu',mode:'stealth',vision:260,cone:.55,channel:1.35,nodeLabel:'ANTENNA',task:'Raggiungi le antenne',start:{x:768,y:1350},tint:'#06131f',
  waves:[PATROLS,['shooter','breaker','shooter','raider','raider']],alarmWave:1,end:'Tre antenne in ascolto. Il porto non si è accorto di niente, o quasi.'},
 archive:{id:'archive',name:'08 · Archivio EVE',district:'Sotto il Distretto Clinico',threat:'Echi della spora',goal:'Leggi i 3 archivi, poi affronta EVE-Prime',kind:2,map:2,color:'#ff6a6a',hp:16,speed:66,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:false,dark:true,tint:'#1a0612',pov:'nox',nodeLabel:'ARCHIVIO',task:'Leggi gli archivi',marks:true,
  waves:[['raider','signal','raider'],['breaker','shooter','raider'],['brute','raider']],boss:{kind:'mirror',hp:238,at:{x:770,y:640}},end:'L’archivio tace. La cosa che ti parlava dall’interno non ha più le tue mani.'},
 line:{id:'line',name:'09 · La linea',district:'Distretto Clinico',threat:'Custodi',goal:'Tieni la linea finché partono gli autobus',kind:3,map:2,color:'#b8f27c',hp:14,speed:68,weapon:'Pistola a scarica',damage:4,cooldown:.30,magic:true,partner:false,pov:'lulu',mode:'defend',zone:{x:768,y:730,r:160},hold:56,waveEvery:11,start:{x:768,y:800},
  waves:[['raider','raider','shooter'],['breaker','raider'],['signal','shooter','raider'],['brute','breaker'],['raider','shooter','raider','breaker'],['brute','signal','shooter']],end:'Gli autobus partono. Dietro di loro, la collina è vuota.'},
 ascent:{id:'ascent',name:'10 · Risalita',district:'Asse orbitale',threat:'Custodi',goal:'Sblocca i 3 ascensori dell’asse',kind:3,map:3,color:'#d395ff',hp:22,speed:70,weapon:'Risonatore',damage:5,cooldown:.28,magic:true,partner:false,pov:'nox',midEvent:{atNode:1,id:'strangers'},nodeLabel:'ASCENSORE',task:'Sblocca gli ascensori',
  waves:[['raider','shooter','raider'],['breaker','shooter','brute'],['signal','breaker','shooter','raider']],end:'La piattaforma dell’asse. In cima qualcuno ti aspetta. Non è Lulù.'},
 finale:{id:'finale',name:'11 · Ora uno',district:'Piattaforma dell’asse',threat:'Archon',goal:'Spegni le 3 ancore dell’asse, poi Archon',kind:3,map:3,color:'#f6e2a6',hp:22,speed:72,weapon:'Risonatore',damage:5,cooldown:.28,magic:true,partner:true,pov:'nox',nodeLabel:'ANCORA',task:'Spegni le ancore',tint:'#2b1a05',
  waves:[['raider','shooter'],['breaker','shooter','raider'],['brute','signal','shooter']],boss:{kind:'archon',hp:575,at:{x:770,y:430}},end:'Archon si spegne. Per la prima volta da centosettantotto anni, l’asse è in silenzio.'},
 // R20-c (D65): the stages of the 150-minute plan, on the painted maps of the Argon delivery.
 docks_veyra:{id:'docks_veyra',name:'Il porto esterno',district:'Ash Docks',threat:'Gang dei Relè',goal:'Recupera i 3 pezzi della Vortex',kind:0,map:1,color:'#58d9ff',hp:5,speed:70,weapon:'Pistola di servizio',damage:1,cooldown:.40,magic:true,partner:true,pov:'nox',nodeLabel:'PEZZO',task:'Recupera i pezzi',channel:1.5,midEvent:{id:'docks_veyra_mid',atNode:2,lines:'docks_veyra_mid',flag:'docks_veyra_secret',reward:{scrap:25,medkit:1},notice:'Stiva gru sbloccata: +25 rottami, +1 kit medico'},
  waves:[['raider','raider','shooter'],['shooter','raider','breaker'],['brute','raider','shooter'],['breaker','signal','shooter','raider']],end:'Tre pezzi sul sedile. Veyra indica la banchina: «Adesso fammi vedere se sai anche guidarla.»'},
 app_breach:{id:'app_breach',name:'Verso la breccia',district:'Porto delle Antenne',threat:'Predatori della breccia',goal:'Apri i 3 varchi verso la breccia',kind:1,map:1,color:'#58d9ff',hp:8,speed:78,weapon:'Pistola a impulsi',damage:2,cooldown:.36,magic:true,partner:true,pov:'lulu',nodeLabel:'VARCO',task:'Apri i varchi',channel:1.5,midEvent:{id:'app_breach_mid',atNode:2,lines:'app_breach_mid',flag:'app_breach_secret',reward:{scrap:25,medkit:1},notice:'Passerella di prua aperta: +25 rottami, +1 kit medico'},
  waves:[['raider','raider','shooter'],['shooter','raider','breaker'],['brute','shooter','signal'],['breaker','brute','shooter']],end:'L’ultimo varco cede. Oltre il muro, la frattura respira.'},
 bone_tyrant:{id:'bone_tyrant',name:'Il Tiranno d’Ossa',district:'Cathedral Quarter',threat:'Guardiani della navata',goal:'Spegni i 3 ceri, poi abbatti il Tiranno d’Ossa',kind:2,map:2,color:'#d6bd91',hp:12,speed:58,weapon:'Pistola a scarica',damage:3,cooldown:.32,magic:true,partner:true,pov:'nox',nodeLabel:'CERO',task:'Spegni i ceri',channel:1.5,midEvent:{id:'bone_tyrant_mid',atNode:2,lines:'bone_tyrant_mid',flag:'bone_tyrant_secret',reward:{scrap:30,medkit:1},notice:'Cripta dell’ossario aperta: +30 rottami, +1 kit medico'},
  waves:[['raider','shooter','raider'],['breaker','raider','signal'],['brute','shooter','breaker'],['brute','signal','shooter']],boss:{kind:'tyrant',hp:325},end:'Le ossa tornano ossa. Sotto l’altare, lo stesso orologio spezzato.'},
 app_clinic:{id:'app_clinic',name:'Corsie chiuse',district:'Distretto Clinico',threat:'Infetti',goal:'Sblocca le 3 porte della corsia',kind:2,map:2,color:'#b8f27c',hp:12,speed:58,weapon:'Pistola a scarica',damage:3,cooldown:.32,magic:true,partner:true,pov:'lulu',nodeLabel:'PORTA',task:'Sblocca le porte',channel:1.5,midEvent:{id:'app_clinic_mid',atNode:2,lines:'app_clinic_mid',flag:'app_clinic_secret',reward:{scrap:25,medkit:2},notice:'Deposito farmaci sbloccato: +25 rottami, +2 kit medici'},
  waves:[['raider','shooter','raider'],['breaker','raider','signal'],['brute','shooter','raider'],['brute','breaker','signal']],end:'Le porte restano aperte. Dall’altra parte qualcuno bussa ancora.'},
 app_node:{id:'app_node',name:'Sotto il Nodo Centrale',district:'Nodo Centrale',threat:'Custodi della frattura',goal:'Disattiva le 3 serrande del Nodo',kind:3,map:3,color:'#d395ff',hp:16,speed:74,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:true,pov:'nox',nodeLabel:'SERRANDA',task:'Disattiva le serrande',channel:1.5,midEvent:{id:'app_node_mid',atNode:2,lines:'app_node_mid',flag:'app_node_secret',reward:{scrap:30,medkit:1},notice:'Anello di raffreddamento aperto: +30 rottami, +1 kit medico'},
  waves:[['raider','shooter','shooter','breaker'],['breaker','shooter','raider','signal'],['brute','shooter','shooter','signal'],['brute','breaker','shooter','raider']],end:'Le serrande si alzano. Il Nodo vi aspettava.'},
 app_yard:{id:'app_yard',name:'Ritorno al cantiere',district:'Cantiere Est',threat:'Gang dei Relè',goal:'Riattiva i 3 quadri del cantiere',kind:0,map:0,color:'#ffb65c',hp:10,speed:76,weapon:'Pistola di servizio',damage:3,cooldown:.32,magic:true,partner:false,pov:'lulu',nodeLabel:'QUADRO',task:'Riattiva i quadri',channel:1.5,midEvent:{id:'app_yard_mid',atNode:2,lines:'app_yard_mid',flag:'app_yard_secret',reward:{scrap:25,medkit:1},notice:'Rimessa di Dario aperta: +25 rottami, +1 kit medico'},
  waves:[['raider','shooter','raider'],['breaker','raider','signal'],['brute','shooter','raider'],['breaker','brute','shooter']],end:'Il cantiere è di nuovo percorribile. Il cancello è poco più avanti.'},
 forge_behemoth:{id:'forge_behemoth',name:'La fonderia',district:'Toxic Slum Bazaar',threat:'Operai della fonderia',goal:'Chiudi le 3 valvole, poi ferma il Behemoth',kind:2,map:2,color:'#b7c56b',hp:18,speed:66,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:false,pov:'nox',nodeLabel:'VALVOLA',task:'Chiudi le valvole',channel:1.2,midEvent:{id:'forge_behemoth_mid',atNode:2,lines:'forge_behemoth_mid',flag:'forge_behemoth_secret',reward:{scrap:35,medkit:1},notice:'Camera delle scorie aperta: +35 rottami, +1 kit medico'},
  waves:[['raider','shooter'],['breaker','raider','signal'],['brute','shooter'],['breaker','shooter']],boss:{kind:'behemoth',hp:265},end:'Il bronzo si raffredda. Il Bazaar può riaprire le pompe senza paura.'},
 app_port:{id:'app_port',name:'Banchine spente',district:'Porto delle Antenne',threat:'Pattuglie di manutenzione',goal:'Spegni i 3 fari di guardia',kind:1,map:1,color:'#58d9ff',hp:9,speed:74,weapon:'Pistola a impulsi',damage:3,cooldown:.34,magic:true,partner:false,pov:'lulu',nodeLabel:'FARO',task:'Spegni i fari',channel:1.5,midEvent:{id:'app_port_mid',atNode:2,lines:'app_port_mid',flag:'app_port_secret',reward:{scrap:25,medkit:1},notice:' Pontile radar sbloccato: +25 rottami, +1 kit medico'},
  waves:[['raider','shooter','raider'],['breaker','raider','signal'],['brute','shooter','signal'],['brute','breaker','shooter']],end:'I fari si spengono. Le antenne sono oltre i container.'},
 glass_flood:{id:'glass_flood',name:'La riva delle torri',district:'Glass Flood',threat:'Sentinelle della marea',goal:'Accendi i 3 segnali dei pontili',kind:1,map:1,color:'#7fe8e0',hp:16,speed:66,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:false,pov:'nox',nodeLabel:'SEGNALE',task:'Accendi i segnali',channel:1.5,midEvent:{id:'glass_flood_mid',atNode:2,lines:'glass_flood_mid',flag:'glass_flood_secret',reward:{scrap:30,medkit:1},notice:'Terrazza sommersa aperta: +30 rottami, +1 kit medico'},
  waves:[['raider','shooter','breaker'],['breaker','raider','signal'],['brute','shooter','signal'],['brute','breaker','shooter']],end:'I pontili si illuminano. Una barca riporta a riva chi era rimasto sulle torri.'},
 glass_reaper:{id:'glass_reaper',name:'Colpi possibili',district:'Glass Flood',threat:'Shadow Reaper',goal:'Accendi i 3 fuochi, poi affronta lo Shadow Reaper',kind:1,map:1,color:'#c08cff',hp:18,speed:68,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:false,pov:'nox',nodeLabel:'FUOCO',task:'Accendi i fuochi',channel:1.2,midEvent:{id:'glass_reaper_mid',atNode:2,lines:'glass_reaper_mid',flag:'glass_reaper_secret',reward:{scrap:35,medkit:1},notice:'Specchio di marea infranto: +35 rottami, +1 kit medico'},
  waves:[['raider','shooter'],['breaker','raider','signal'],['brute','shooter'],['breaker','shooter']],boss:{kind:'reaper',hp:275},end:'L’ombra si chiude. Nox non ha scelto il colpo probabile: ha scelto il suo.'},
 app_archive:{id:'app_archive',name:'Scaffali sommersi',district:'Sotto il Distretto Clinico',threat:'Echi della spora',goal:'Apri i 3 sigilli dell’archivio',kind:2,map:2,color:'#ff6a6a',hp:16,speed:66,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:false,pov:'nox',nodeLabel:'SIGILLO',task:'Apri i sigilli',channel:1.5,midEvent:{id:'app_archive_mid',atNode:2,lines:'app_archive_mid',flag:'app_archive_secret',reward:{scrap:30,medkit:1},notice:'Capsula d’archivio aperta: +30 rottami, +1 kit medico'},
  waves:[['raider','shooter','breaker'],['breaker','raider','signal'],['brute','shooter','signal'],['brute','breaker','shooter']],end:'L’ultimo sigillo cede. Più in basso, una voce conosce già i tuoi passi.'},
 vega:{id:'vega',name:'La linea di Vega',district:'Binario sopraelevato',threat:'Vega',goal:'Rompi il ritmo di Vega',kind:3,map:2,color:'#ffb65c',hp:14,speed:68,weapon:'Pistola a scarica',damage:4,cooldown:.30,magic:true,partner:false,pov:'lulu',nodeLabel:'LINEA',task:'Spezza i tempi di Vega',midEvent:{id:'vega_mid',atPhase:1,lines:'vega_mid',flag:'vega_secret',reward:{scrap:35,medkit:1},notice:' Vettore di tiro aggirato: +35 rottami, +1 kit medico'},
  waves:[['raider','shooter','raider'],['shooter','breaker','signal'],['brute','shooter']],boss:{kind:'vega',hp:265},end:'Vega abbassa il fucile. «Hai smesso di contare i miei colpi.» Lascia a terra un componente.'},
 app_axis:{id:'app_axis',name:'Ai piedi dell’Asse',district:'Asse orbitale',threat:'Custodi',goal:'Allinea i 3 condotti dell’Asse',kind:3,map:3,color:'#d395ff',hp:22,speed:70,weapon:'Risonatore',damage:5,cooldown:.28,magic:true,partner:false,pov:'nox',nodeLabel:'CONDOTTO',task:'Allinea i condotti',channel:1.5,midEvent:{id:'app_axis_mid',atNode:2,lines:'app_axis_mid',flag:'app_axis_secret',reward:{scrap:40,medkit:2},notice:'Ponte dei condotti sbloccato: +40 rottami, +2 kit medici'},
  waves:[['raider','shooter','breaker'],['breaker','raider','signal'],['brute','shooter','signal'],['brute','breaker','shooter']],end:'I condotti si allineano. Gli ascensori sono sopra di te.'}
};
// POV, act, music and copy for every step. Drives index driving.mjs missions.
export const CAMPAIGN=[
 {id:'opening',type:'scene',act:1,pov:'nox',title:'Due colpi',music:'title_theme'},
 {id:'home',type:'scene',act:1,pov:'both',title:'Otto mesi dopo',music:'refuge_theme'},
 {id:'blackout',type:'foot',act:1,pre:'blackout_pre',post:'blackout_end',choice:'blackout_power',music:'blackout'},
 {id:'escape',type:'drive',act:1,drive:0,pov:'nox',pre:'escape_pre',music:'driving'},
 {id:'moon',type:'hub',act:1,pov:'both',title:'Moon Refuge',music:'refuge_theme'},
 {id:'docks_veyra',type:'foot',act:1,pre:'docks_veyra_pre',post:'docks_veyra_end',music:'docks_veyra'},
 {id:'app_breach',type:'foot',act:2,pre:'app_breach_pre',post:'app_breach_end',music:'breach'},
 {id:'breach',type:'foot',act:2,pre:'breach_pre',post:'breach_promise',music:'breach'},
 {id:'signal',type:'drive',act:2,drive:1,pov:'nox',pre:'signal_pre',music:'driving'},
 {id:'rooftop',type:'scene',act:2,pov:'both',title:'Tetto del porto',music:'promise_theme'},
 {id:'cathedral',type:'hub',act:2,pov:'both',title:'Cathedral Quarter',music:'refuge_theme'},
 {id:'bone_tyrant',type:'foot',act:2,pre:'bone_tyrant_pre',post:'bone_tyrant_end',music:'bone_tyrant'},
 {id:'app_clinic',type:'foot',act:2,pre:'app_clinic_pre',post:'app_clinic_end',music:'contagion'},
 {id:'contagion',type:'foot',act:2,pre:'contagion_pre',music:'contagion'},
 {id:'evacuation',type:'drive',act:2,drive:2,pov:'nox',pre:'evacuation_pre',music:'driving'},
 {id:'app_node',type:'foot',act:2,pre:'app_node_pre',post:'app_node_end',music:'zero'},
 {id:'zero',type:'foot',act:2,pre:'zero_pre',music:'warden_node'},
 {id:'separation',type:'scene',act:2,pov:'both',title:'La firma',music:'danger'},
 {id:'exp_chalk_marks',type:'foot',act:3,pre:'chalk_pre',post:'chalk_end',music:'chalk_route'},
 {id:'below',type:'foot',act:3,pre:'below_pre',post:'below_end',choice:'below_heat',music:'below_descent'},
 {id:'app_yard',type:'foot',act:3,pre:'app_yard_pre',post:'app_yard_end',music:'lulu'},
 {id:'city',type:'foot',act:3,pre:'city_pre',post:'city_end',music:'lulu'},
 {id:'ring',type:'drive',act:3,drive:3,pov:'nox',pre:'ring_pre',music:'driving'},
 {id:'toxic',type:'hub',act:3,pov:'nox',title:'Toxic Slum Bazaar',music:'toxic_bazaar'},
 {id:'forge_behemoth',type:'foot',act:3,pre:'forge_behemoth_pre',post:'forge_behemoth_end',music:'forge_behemoth'},
 {id:'app_port',type:'foot',act:3,pre:'app_port_pre',post:'app_port_end',music:'port_stealth'},
 {id:'port',type:'foot',act:3,pre:'port_pre',post:'port_end',music:'port_stealth'},
 {id:'glass_flood',type:'foot',act:3,pre:'glass_flood_pre',post:'glass_flood_end',music:'glass_flood'},
 {id:'glass_reaper',type:'foot',act:3,pre:'glass_reaper_pre',post:'glass_reaper_end',music:'glass_reaper'},
 {id:'vega',type:'foot',act:3,pre:'vega_pre',post:'vega_end',music:'vega_duel'},
 {id:'app_archive',type:'foot',act:3,pre:'app_archive_pre',post:'app_archive_end',music:'archive_theme'},
 {id:'archive',type:'foot',act:3,pre:'archive_pre',post:'archive_end',choice:'archive_eve',music:'archive_theme'},
 {id:'tunnel',type:'drive',act:3,drive:4,pov:'lulu',pre:'tunnel_pre',music:'driving'},
 {id:'clockwork',type:'hub',act:3,pov:'nox',title:'Clockwork Outpost',music:'clockwork_outpost'},
 {id:'line',type:'foot',act:3,pre:'line_pre',post:'line_end',choice:'line_wait',music:'lulu'},
 {id:'app_axis',type:'foot',act:3,pre:'app_axis_pre',post:'app_axis_end',music:'axis_ascent'},
 {id:'ascent',type:'foot',act:3,pre:'ascent_pre',music:'axis_ascent'},
 {id:'reunion',type:'scene',act:4,pov:'both',title:'Posso venire con te?',music:'reunion'},
 {id:'finale',type:'foot',act:4,pre:'finale_pre',music:'archon_finale'},
 {id:'collapse',type:'escape',act:4,pov:'nox',title:'Esci dall’Asse',music:'archon_finale'},
 {id:'aftermath',type:'scene',act:4,pov:'both',title:'La città sceglie',music:'reunion'},
 {id:'rooftop_end',type:'scene',act:4,pov:'both',title:'A niente',music:'reunion'},
 {id:'credits',type:'scene',act:4,pov:'both',title:'Chronos Adventure: Nox & Lulú',music:'reunion'},
 {id:'postcredits',type:'scene',act:4,pov:'nox',title:'Chrono Shadows',music:'archon_finale'}
];
export const ACTS={1:'ATTO I · LA CITTÀ AL BUIO',2:'ATTO II · LA BRECCIA',3:'ATTO III · DUE STRADE',4:'ATTO IV · ORA UNO'};
export const stepIndex=id=>CAMPAIGN.findIndex(s=>s.id===id);
export function stepPov(step){return step.type==='foot'?FOOT[step.id].pov:step.pov;}
// Choices change the next missions mechanically; the result is a fresh object, the canon stays untouched.
export function buildMission(id,flags={},cityChoice=null,world=null){
 const base=FOOT[id];if(!base)return null;const step=CAMPAIGN.find(x=>x.id===id);const c={...base,act:step?.act||(base.kind+1),waves:base.waves.map(w=>[...w]),...missionLayout(id,base.pov)};
 const solo=c.partner===false&&c.pov==='nox';
 if(solo&&flags.heat==='self'&&id!=='below')c.hpBonus=2;
 const choiceTier=(flags.blackout_choice==='workshop'?1:0)+(flags.glass_truth===false?1:0)+(flags.rooftop_answer==='ask'?1:0)+(flags.heat==='self'?1:0)+(flags.eve_kept===false?1:0)+(flags.line_choice==='stay'?1:0);
 if(choiceTier>0){c.choiceTier=choiceTier;c.choiceBonusCoins=choiceTier*6;}
 if(id==='bone_tyrant'&&flags.glass_truth===false&&c.boss)c.boss={...c.boss,hp:c.boss.hp+20};
 if(id==='forge_behemoth'&&flags.heat==='self'&&c.boss)c.boss={...c.boss,hp:c.boss.hp+20};
 if(id==='glass_reaper'&&flags.rooftop_answer==='ask'&&c.boss)c.boss={...c.boss,hp:c.boss.hp+18};
 if(id==='vega'&&flags.eve_kept===false&&c.boss)c.boss={...c.boss,hp:c.boss.hp+18};
 if(id==='city'){const workshop=(cityChoice||flags.blackout_choice)==='workshop';c.site=workshop?'RIFUGIO':'OFFICINA';c.goal=`Difendi ${workshop?'il rifugio':'l’officina'} finché torna la corrente`;
  if(workshop)c.barrierLife=12;else{c.hold=46;c.waves.pop();}}
 if(id==='exp_chalk_marks'){
  const route=flags['exp.chalk.route'],service=route==='service';
  c.site=route?(service?'ROTTA RIPARATA':'PASSAGGIO DIRETTO'):'COLLEGAMENTO';
  c.zone=service?{x:416,y:1248,r:142}:{x:1120,y:800,r:142};c.hold=service?29:22;
  if(route){c.holdGoal=`Proteggi ${service?'la rotta riparata':'il passaggio diretto'}`;c.goal=`Riattiva i due accessi, poi ${c.holdGoal.toLowerCase()}`;}
 }
 if(id==='line'&&flags.unit9_saved){c.waves.pop();c.ally='unit9';}

 if(['ascent','finale'].includes(id)){if(flags.eve_kept)c.windupBonus=.15;else if(flags.eve_kept===false)c.damage+=1;}
 if(id==='finale'){c.consentFinale=true;c.partner=true;delete c.join;if(flags.line_choice==='stay')c.hpBonus=(c.hpBonus||0)+1;}
 const market=world?Object.keys(world.inventory||{}).filter(k=>world.inventory[k]>0&&MARKET_WEAPON_IDS.includes(k)):[];
 const at=CAMPAIGN.findIndex(x=>x.id===id);c.moveUnlocks=(HERO_MOVES[c.pov]||[]).filter(m=>m.early&&at>=0&&at>=CAMPAIGN.findIndex(x=>x.id===m.early)).map(m=>m.id);
 c.moveSelection=flags['move.active.'+c.pov]||null;
 return campaignArsenalV9(c,flags,market);
}
export const PROGRESS_VERSION=7;
export const NARRATIVE_CANON=8;
const CHALK_STEP=stepIndex('exp_chalk_marks'),ROOK_STEP=stepIndex('blackout');
// Story steps are serialized by stable ID so later insertions cannot shift a checkpoint.
export function bossCheckpoint(step,status,value){const s=CAMPAIGN[step];return value==='boss'&&status==='playing'&&s?.type==='foot'&&!!FOOT[s.id]?.boss?'boss':null;}
export function newProgress(){return {version:PROGRESS_VERSION,canon:NARRATIVE_CANON,step:0,status:'playing',upgrade:'power',cityChoice:null,checkpoint:null,catchup:null,rookCatchup:null,narrative:createNarrativeState(),world:newWorld(),stats:{deaths:0,seconds:0}};}
export function saveProgress(p){return JSON.stringify({version:PROGRESS_VERSION,canon:NARRATIVE_CANON,stepId:CAMPAIGN[p.step]?.id,status:p.status,upgrade:p.upgrade,cityChoice:p.cityChoice,checkpoint:bossCheckpoint(p.step,p.status,p.checkpoint),catchup:p.catchup||null,rookCatchup:p.rookCatchup||null,narrative:createNarrativeState(p.narrative||{}),world:p.world,stats:{deaths:p.stats?.deaths|0,seconds:Math.round(p.stats?.seconds||0)}});}
export function loadProgress(raw){try{
 const x=JSON.parse(raw);if(!x||x.version!==PROGRESS_VERSION||x.canon!==NARRATIVE_CANON)return null;
 let step=stepIndex(x.stepId);if(step<0||!['playing','cleared'].includes(x.status)||!['power','shield'].includes(x.upgrade))return null;
 if(x.cityChoice!=null&&!['workshop','shelter'].includes(x.cityChoice))return null;
 const narrative=validateNarrativeState(x.narrative),world=validateWorld(x.world);if(!narrative||!world)return null;
 const missedChalk=step>CHALK_STEP&&!narrative.flags['exp.chalk.completed']&&!x.catchup;
 if(world.hub){
  // The step travels by stable ID; the hub's return index was stored before later stages were inserted
  // (Segni di Gesso, then the 13 stages of R20-c), so the ID wins and the index follows it.
  if(world.hub.returnStep>=CAMPAIGN.length)return null;
  world.hub.returnStep=step;
 }
 let catchup=null,status=x.status,checkpoint=bossCheckpoint(step,status,x.checkpoint);
 if(x.catchup){
  const saved=x.catchup,target=stepIndex(saved.stepId);
  if(step!==CHALK_STEP||target<=CHALK_STEP||!['playing','cleared'].includes(saved.status)||saved.hub!=null&&(!saved.hub.returnStepId||saved.hub.returnStepId!==saved.stepId))return null;
  const hub=saved.hub==null?null:{...saved.hub,returnStep:target};
  if(hub){delete hub.returnStepId;if(!validateWorld({...world,hub}))return null;}
  catchup={stepId:saved.stepId,status:saved.status,checkpoint:bossCheckpoint(target,saved.status,saved.checkpoint),hub:saved.hub==null?null:{...hub,returnStepId:saved.stepId}};
  if(catchup.hub)delete catchup.hub.returnStep;
 }else if(missedChalk){
  const hub=world.hub?{...world.hub,returnStepId:x.stepId}:null;if(hub)delete hub.returnStep;
  catchup={stepId:x.stepId,status:x.status,checkpoint,hub};world.hub=null;step=CHALK_STEP;status='playing';checkpoint=null;
 }
 let rookCatchup=null;
 if(x.rookCatchup){
  const book=x.rookCatchup,target=stepIndex(book.stepId);
  if(book.introSeen!=null&&typeof book.introSeen!=='boolean')return null;
  if(step!==ROOK_STEP||catchup||world.hub||target<ROOK_STEP||target===ROOK_STEP&&book.status!=='cleared'||!['playing','cleared'].includes(book.status)||!['power','shield'].includes(book.upgrade)||status==='cleared'&&!narrative.flags['encounter.rook.completed'])return null;
  if(book.hub&&book.hub.returnStepId!==book.stepId)return null;
  const hub=book.hub?{...book.hub,returnStep:target}:null;if(hub)delete hub.returnStepId;
  // Validate the original location and any interrupted Chalk recovery with existing schema rules.
  const original=loadProgress(JSON.stringify({...x,stepId:book.stepId,status:book.status,upgrade:book.upgrade,checkpoint:book.checkpoint,world:{...world,hub},catchup:book.catchup||null,rookCatchup:null}));if(!original)return null;
  rookCatchup={introSeen:book.introSeen===true,stepId:book.stepId,status:book.status,upgrade:book.upgrade,checkpoint:bossCheckpoint(target,book.status,book.checkpoint),hub:book.hub?{...book.hub}:null,catchup:book.catchup?JSON.parse(JSON.stringify(book.catchup)):null};
 }
 return {version:PROGRESS_VERSION,canon:NARRATIVE_CANON,step,status,upgrade:x.upgrade,cityChoice:x.cityChoice??null,checkpoint,catchup,rookCatchup,narrative,world,stats:{deaths:Math.max(0,x.stats?.deaths|0),seconds:Math.max(0,Number.isFinite(x.stats?.seconds)?x.stats.seconds:0)}};
}catch{return null;}}
export function finishCatchup(p){
 const saved=p.catchup;if(!saved||p.step!==CHALK_STEP||p.status!=='cleared'||!p.narrative.flags['exp.chalk.completed']||p.world.hub)return false;
 const step=stepIndex(saved.stepId);if(step<=CHALK_STEP)return false;
 p.step=step;p.status=saved.status;p.checkpoint=saved.checkpoint;
 if(saved.hub){const hub={...saved.hub,returnStep:step};delete hub.returnStepId;p.world.hub=hub;}
 p.catchup=null;return true;
}

// A presentation-time migration keeps the core v7 deserializer compatible with prior fixtures.
// Its bookmark can preserve an already running Chalk recovery, without nesting active missions.
export function prepareRookRecovery(p){
 const f=p.narrative.flags,won=f['encounter.rook.completed']===true;
 if(p.rookCatchup||won&&f['weapon.tessa']===true||p.step<ROOK_STEP||p.step===ROOK_STEP&&(p.status!=='cleared'||won))return false;
 const hub=p.world.hub?{...p.world.hub,returnStepId:CAMPAIGN[p.step].id}:null;if(hub)delete hub.returnStep;
 p.rookCatchup={introSeen:false,stepId:CAMPAIGN[p.step].id,status:p.status,upgrade:p.upgrade,checkpoint:p.checkpoint,hub,catchup:p.catchup?JSON.parse(JSON.stringify(p.catchup)):null};
 p.world.hub=null;p.catchup=null;p.step=ROOK_STEP;p.status=won?'cleared':'playing';p.checkpoint=won?null:'boss';return true;
}
export function finishRookRecovery(p){
 const book=p.rookCatchup;if(!book||p.step!==ROOK_STEP||p.status!=='cleared'||!p.narrative.flags['encounter.rook.completed']||!p.narrative.flags['weapon.tessa']||p.world.hub)return false;
 const hub=book.hub?{...book.hub,returnStep:stepIndex(book.stepId)}:null;if(hub)delete hub.returnStepId;
 const resumed={...p,step:stepIndex(book.stepId),status:book.status,upgrade:book.upgrade,checkpoint:book.checkpoint,world:{...p.world,hub},catchup:book.catchup,rookCatchup:null};
 const checked=loadProgress(saveProgress(resumed));if(!checked)return false;Object.assign(p,checked);return true;
}
