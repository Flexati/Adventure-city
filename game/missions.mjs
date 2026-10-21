import {missionLayout} from './layouts.mjs';
import {CHAPTERS,loadRun} from './campaign.mjs';
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
 blackout:{...actOne('blackout'),pov:'nox',task:'Riaccendi i relè'},
 breach:{...actOne('breach'),pov:'lulu',task:'Chiudi le ancore'},
 contagion:{...actOne('contagion'),pov:'lulu',task:'Attiva i filtri',midEvent:{atNode:2,id:'clinic_auth'}},
 zero:{...actOne('zero'),pov:'nox',task:'Spegni i nuclei'},
 below:{id:'below',name:'05 · Sotto il Nodo',district:'Livelli bassi',threat:'Guide di Elyon',goal:'Apri le 3 valvole termiche',kind:3,map:3,color:'#ff6a6a',hp:20,speed:66,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:false,dark:true,tint:'#2a0710',pov:'nox',nodeLabel:'VALVOLA',task:'Apri le valvole',
  waves:[['raider','shooter','raider'],['shooter','raider','breaker'],['brute','shooter','raider'],['breaker','breaker','shooter']],end:'Il calore torna nelle mani. Sopra di te, qualcosa nel Nodo si raffredda.'},
 city:{id:'city',name:'06 · La città senza di te',district:'Cantiere Est',threat:'Gang dei Relè',goal:'Difendi il cancello finché torna la corrente',kind:0,map:0,color:'#ffb65c',hp:10,speed:76,weapon:'Pistola di servizio',damage:3,cooldown:.32,magic:true,partner:false,pov:'lulu',mode:'defend',zone:{x:768,y:730,r:150},hold:55,waveEvery:11,start:{x:768,y:800},
  waves:[['raider','raider'],['breaker','shooter'],['raider','raider','signal'],['breaker','shooter','raider'],['brute','raider','shooter']],end:'Il generatore riparte. Il quartiere torna a fare rumore.'},
 port:{id:'port',name:'07 · Porto spento',district:'Porto delle Antenne',threat:'Pattuglie di manutenzione',goal:'Raggiungi le 3 antenne senza farti vedere',kind:1,map:1,color:'#58d9ff',hp:9,speed:74,weapon:'Pistola a impulsi',damage:3,cooldown:.34,magic:true,partner:false,pov:'lulu',mode:'stealth',vision:240,cone:.6,channel:1.1,nodeLabel:'ANTENNA',task:'Raggiungi le antenne',start:{x:768,y:1350},tint:'#06131f',
  waves:[PATROLS,['breaker','shooter','raider','raider']],alarmWave:1,end:'Tre antenne in ascolto. Il porto non si è accorto di niente, o quasi.'},
 archive:{id:'archive',name:'08 · Archivio EVE',district:'Sotto il Distretto Clinico',threat:'Echi della spora',goal:'Leggi i 3 archivi, poi affronta EVE-Prime',kind:2,map:2,color:'#ff6a6a',hp:16,speed:66,weapon:'Risonatore',damage:4,cooldown:.30,magic:true,partner:false,dark:true,tint:'#1a0612',pov:'nox',nodeLabel:'ARCHIVIO',task:'Leggi gli archivi',marks:true,
  waves:[['raider','signal','raider'],['breaker','shooter','raider'],['brute','raider']],boss:{kind:'mirror',hp:190,at:{x:770,y:640}},end:'L’archivio tace. La cosa che ti parlava dall’interno non ha più le tue mani.'},
 line:{id:'line',name:'09 · La linea',district:'Distretto Clinico',threat:'Custodi',goal:'Tieni la linea finché partono gli autobus',kind:3,map:2,color:'#b8f27c',hp:16,speed:68,weapon:'Pistola a scarica',damage:4,cooldown:.30,magic:true,partner:false,pov:'lulu',mode:'defend',zone:{x:768,y:730,r:160},hold:56,waveEvery:11,start:{x:768,y:800},
  waves:[['raider','raider','shooter'],['breaker','raider'],['signal','shooter','raider'],['brute','breaker'],['raider','shooter','raider','breaker'],['brute','signal','shooter']],end:'Gli autobus partono. Dietro di loro, la collina è vuota.'},
 ascent:{id:'ascent',name:'10 · Risalita',district:'Asse orbitale',threat:'Custodi',goal:'Sblocca i 3 ascensori dell’asse',kind:3,map:3,color:'#d395ff',hp:22,speed:70,weapon:'Risonatore',damage:5,cooldown:.28,magic:true,partner:false,pov:'nox',nodeLabel:'ASCENSORE',task:'Sblocca gli ascensori',
  waves:[['raider','shooter','raider'],['breaker','shooter','brute'],['signal','breaker','shooter','raider']],end:'La piattaforma dell’asse. In cima qualcuno ti aspetta. Non è Lulù.'},
 finale:{id:'finale',name:'11 · Ora uno',district:'Piattaforma dell’asse',threat:'Archon',goal:'Spegni le 3 ancore dell’asse, poi Archon',kind:3,map:3,color:'#f6e2a6',hp:22,speed:72,weapon:'Risonatore',damage:5,cooldown:.28,magic:true,partner:false,pov:'nox',nodeLabel:'ANCORA',task:'Spegni le ancore',tint:'#2b1a05',
  waves:[['raider','shooter'],['breaker','shooter','raider'],['brute','signal','shooter']],boss:{kind:'archon',hp:460,at:{x:770,y:430}},join:{phase:2},end:'Archon si spegne. Per la prima volta da centosettantotto anni, l’asse è in silenzio.'}
};
// POV, act, music and copy for every step. Drives index driving.mjs missions.
export const CAMPAIGN=[
 {id:'opening',type:'scene',act:1,pov:'nox',title:'Due colpi',music:'title'},
 {id:'blackout',type:'foot',act:1,pre:'blackout_pre',post:'blackout_end',choice:'blackout_power',music:'blackout'},
 {id:'escape',type:'drive',act:1,drive:0,pov:'nox',pre:'escape_pre',music:'driving'},
 {id:'breach',type:'foot',act:1,pre:'breach_pre',post:'breach_promise',music:'breach'},
 {id:'signal',type:'drive',act:1,drive:1,pov:'nox',pre:'signal_pre',music:'driving'},
 {id:'rooftop',type:'scene',act:1,pov:'both',title:'Tetto del porto',music:'reunion'},
 {id:'contagion',type:'foot',act:1,pre:'contagion_pre',music:'contagion'},
 {id:'evacuation',type:'drive',act:1,drive:2,pov:'nox',pre:'evacuation_pre',music:'driving'},
 {id:'zero',type:'foot',act:1,pre:'zero_pre',music:'zero'},
 {id:'separation',type:'scene',act:1,pov:'both',title:'La firma',music:'danger'},
 {id:'below',type:'foot',act:2,pre:'below_pre',post:'below_end',choice:'below_heat',music:'nox'},
 {id:'city',type:'foot',act:2,pre:'city_pre',post:'city_end',music:'lulu'},
 {id:'ring',type:'drive',act:2,drive:3,pov:'nox',pre:'ring_pre',music:'driving'},
 {id:'port',type:'foot',act:2,pre:'port_pre',post:'port_end',choice:'port_channel',music:'lulu'},
 {id:'archive',type:'foot',act:2,pre:'archive_pre',post:'archive_end',choice:'archive_eve',music:'danger'},
 {id:'tunnel',type:'drive',act:2,drive:4,pov:'lulu',pre:'tunnel_pre',music:'driving'},
 {id:'line',type:'foot',act:3,pre:'line_pre',post:'line_end',choice:'line_wait',music:'lulu'},
 {id:'ascent',type:'foot',act:3,pre:'ascent_pre',music:'nox'},
 {id:'finale',type:'foot',act:3,pre:'finale_pre',music:'danger'},
 {id:'reunion',type:'scene',act:3,pov:'both',title:'Due colpi',music:'reunion'}
];
export const ACTS={1:'ATTO I · LA NOTTE DELLA FRATTURA',2:'ATTO II · DUE STRADE',3:'ATTO III · L’ASSE'};
export const stepIndex=id=>CAMPAIGN.findIndex(s=>s.id===id);
export function stepPov(step){return step.type==='foot'?FOOT[step.id].pov:step.pov;}
// Choices change the next missions mechanically; the result is a fresh object, the canon stays untouched.
export function buildMission(id,flags={},cityChoice=null){
 const base=FOOT[id];if(!base)return null;const c={...base,waves:base.waves.map(w=>[...w]),...missionLayout(id,base.pov)};
 const solo=c.partner===false&&c.pov==='nox';
 if(solo&&flags.heat==='self'&&id!=='below')c.hpBonus=2;
 if(id==='city'){const workshop=(cityChoice||flags.blackout_choice)==='workshop';c.site=workshop?'RIFUGIO':'OFFICINA';c.goal=`Difendi ${workshop?'il rifugio':'l’officina'} finché torna la corrente`;
  if(workshop)c.barrierLife=12;else{c.hold=46;c.waves.pop();}}
 if(id==='line'&&flags.unit9_saved){c.waves.pop();c.ally='unit9';}
 if((id==='archive'||id==='ascent')&&flags.channel_called)c.waves.push(['breaker','shooter','raider']);
 if(['ascent','finale'].includes(id)){if(flags.eve_kept)c.windupBonus=.15;else if(flags.eve_kept===false)c.damage+=1;}
 if(id==='finale')c.join={phase:flags.line_choice==='go'?1:2};
 return c;
}
export const PROGRESS_VERSION=6;
// The optional v6 checkpoint marks a boss already reached in the current, unfinished foot step.
// Older builds ignore the field; an invalid value is dropped without discarding the save.
export function bossCheckpoint(step,status,value){const s=CAMPAIGN[step];return value==='boss'&&status==='playing'&&s?.type==='foot'&&!!FOOT[s.id]?.boss?'boss':null;}
export function newProgress(){return {version:PROGRESS_VERSION,step:0,status:'playing',upgrade:'power',cityChoice:null,checkpoint:null,narrative:createNarrativeState(),stats:{deaths:0,seconds:0}};}
export function saveProgress(p){return JSON.stringify({version:PROGRESS_VERSION,step:p.step,status:p.status,upgrade:p.upgrade,cityChoice:p.cityChoice,checkpoint:bossCheckpoint(p.step,p.status,p.checkpoint),narrative:createNarrativeState(p.narrative||{}),stats:{deaths:p.stats?.deaths|0,seconds:Math.round(p.stats?.seconds||0)}});}
// v6 progress; v4/v5 district checkpoints migrate to the matching Act I mission.
export function loadProgress(raw){try{
 const x=JSON.parse(raw);
 if(x&&x.version===PROGRESS_VERSION){
  if(!Number.isInteger(x.step)||x.step<0||x.step>=CAMPAIGN.length)return null;
  if(!['playing','cleared'].includes(x.status)||!['power','shield'].includes(x.upgrade))return null;
  if(x.cityChoice!=null&&!['workshop','shelter'].includes(x.cityChoice))return null;
  const narrative=validateNarrativeState(x.narrative);if(!narrative)return null;
  return {version:PROGRESS_VERSION,step:x.step,status:x.status,upgrade:x.upgrade,cityChoice:x.cityChoice??null,checkpoint:bossCheckpoint(x.step,x.status,x.checkpoint),narrative,stats:{deaths:Math.max(0,x.stats?.deaths|0),seconds:Math.max(0,+x.stats?.seconds||0)}};
 }
 const legacy=loadRun(raw);if(!legacy)return null;
 const step=stepIndex(CHAPTERS[legacy.level].id);
 return {version:PROGRESS_VERSION,step,status:legacy.status==='cleared'?'cleared':'playing',upgrade:legacy.upgrade,cityChoice:legacy.cityChoice,checkpoint:null,narrative:legacy.narrative,stats:{deaths:0,seconds:0}};
}catch{return null;}}
