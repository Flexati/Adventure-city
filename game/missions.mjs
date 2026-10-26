import {campaignArsenalV9} from './weapons-v9.mjs';
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
 blackout:{...actOne('blackout'),pov:'nox',task:'Riaccendi i relè',boss:{kind:'rook',hp:48,openingAdds:['raider','raider']},goal:'Riaccendi i 3 relè, poi affronta Rook'},
 breach:{...actOne('breach'),pov:'lulu',task:'Chiudi le ancore',boss:{kind:'anchor',hp:90,openingAdds:['raider']},goal:'Chiudi le 3 ancore, poi ferma The Anchor'},
 contagion:{...actOne('contagion'),pov:'lulu',task:'Attiva i filtri',midEvent:{atNode:2,id:'clinic_auth'}},
 zero:{...actOne('zero'),pov:'nox',task:'Spegni i nuclei'},
 exp_chalk_marks:{id:'exp_chalk_marks',name:'Segni di Gesso',district:'Porto',threat:'Pattuglie di manutenzione',goal:'Riattiva i due accessi, poi proteggi il collegamento',kind:1,map:1,ambience:'port',color:'#f8d9a0',hp:12,speed:74,weapon:'Pistola di servizio',damage:3,cooldown:.32,magic:true,partner:false,pov:'lulu',mode:'chalk',nodeLabel:'ACCESSO',task:'Apri gli accessi',channel:.65,hold:24,waveEvery:12,
  waves:[['raider','shooter'],['breaker','raider'],['shooter','raider']],end:'Il gesso continua oltre la riparazione. Gli abitanti attraversano da soli.'},
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
 ascent:{id:'ascent',name:'10 · Risalita',district:'Asse orbitale',threat:'Custodi',goal:'Sblocca i 3 ascensori dell’asse',kind:3,map:3,color:'#d395ff',hp:22,speed:70,weapon:'Risonatore',damage:5,cooldown:.28,magic:true,partner:false,pov:'nox',midEvent:{atNode:1,id:'strangers'},nodeLabel:'ASCENSORE',task:'Sblocca gli ascensori',
  waves:[['raider','shooter','raider'],['breaker','shooter','brute'],['signal','breaker','shooter','raider']],end:'La piattaforma dell’asse. In cima qualcuno ti aspetta. Non è Lulù.'},
 finale:{id:'finale',name:'11 · Ora uno',district:'Piattaforma dell’asse',threat:'Archon',goal:'Spegni le 3 ancore dell’asse, poi Archon',kind:3,map:3,color:'#f6e2a6',hp:22,speed:72,weapon:'Risonatore',damage:5,cooldown:.28,magic:true,partner:true,pov:'nox',nodeLabel:'ANCORA',task:'Spegni le ancore',tint:'#2b1a05',
  waves:[['raider','shooter'],['breaker','shooter','raider'],['brute','signal','shooter']],boss:{kind:'archon',hp:460,at:{x:770,y:430}},end:'Archon si spegne. Per la prima volta da centosettantotto anni, l’asse è in silenzio.'}
};
// POV, act, music and copy for every step. Drives index driving.mjs missions.
export const CAMPAIGN=[
 {id:'opening',type:'scene',act:1,pov:'nox',title:'Due colpi',music:'title'},
 {id:'home',type:'scene',act:1,pov:'both',title:'Otto mesi dopo',music:'reunion'},
 {id:'blackout',type:'foot',act:1,pre:'blackout_pre',post:'blackout_end',choice:'blackout_power',music:'blackout'},
 {id:'escape',type:'drive',act:1,drive:0,pov:'nox',pre:'escape_pre',music:'driving'},
 {id:'moon',type:'hub',act:1,pov:'both',title:'Moon Refuge',music:'reunion'},
 {id:'breach',type:'foot',act:2,pre:'breach_pre',post:'breach_promise',music:'breach'},
 {id:'signal',type:'drive',act:2,drive:1,pov:'nox',pre:'signal_pre',music:'driving'},
 {id:'rooftop',type:'scene',act:2,pov:'both',title:'Tetto del porto',music:'reunion'},
 {id:'cathedral',type:'hub',act:2,pov:'both',title:'Cathedral Quarter',music:'reunion'},
 {id:'contagion',type:'foot',act:2,pre:'contagion_pre',music:'contagion'},
 {id:'evacuation',type:'drive',act:2,drive:2,pov:'nox',pre:'evacuation_pre',music:'driving'},
 {id:'zero',type:'foot',act:2,pre:'zero_pre',music:'zero'},
 {id:'separation',type:'scene',act:2,pov:'both',title:'La firma',music:'danger'},
 {id:'exp_chalk_marks',type:'foot',act:3,pre:'chalk_pre',post:'chalk_end',music:'chalk_route'},
 {id:'below',type:'foot',act:3,pre:'below_pre',post:'below_end',choice:'below_heat',music:'nox'},
 {id:'city',type:'foot',act:3,pre:'city_pre',post:'city_end',music:'lulu'},
 {id:'ring',type:'drive',act:3,drive:3,pov:'nox',pre:'ring_pre',music:'driving'},
 {id:'toxic',type:'hub',act:3,pov:'nox',title:'Toxic Slum Bazaar',music:'nox'},
 {id:'port',type:'foot',act:3,pre:'port_pre',post:'port_end',music:'lulu'},
 {id:'archive',type:'foot',act:3,pre:'archive_pre',post:'archive_end',choice:'archive_eve',music:'danger'},
 {id:'tunnel',type:'drive',act:3,drive:4,pov:'lulu',pre:'tunnel_pre',music:'driving'},
 {id:'clockwork',type:'hub',act:3,pov:'nox',title:'Clockwork Outpost',music:'nox'},
 {id:'line',type:'foot',act:3,pre:'line_pre',post:'line_end',choice:'line_wait',music:'lulu'},
 {id:'ascent',type:'foot',act:3,pre:'ascent_pre',music:'nox'},
 {id:'reunion',type:'scene',act:3,pov:'both',title:'Posso venire con te?',music:'reunion'},
 {id:'finale',type:'foot',act:3,pre:'finale_pre',music:'danger'},
 {id:'collapse',type:'escape',act:3,pov:'nox',title:'Esci dall’Asse',music:'danger'},
 {id:'aftermath',type:'scene',act:3,pov:'both',title:'La città sceglie',music:'reunion'},
 {id:'rooftop_end',type:'scene',act:3,pov:'both',title:'A niente',music:'reunion'},
 {id:'credits',type:'scene',act:3,pov:'both',title:'Chronos Adventure: Nox & Lulú',music:'reunion'},
 {id:'postcredits',type:'scene',act:3,pov:'nox',title:'Chrono Shadows',music:'danger'}
];
export const ACTS={1:'ATTO I · LA CITTÀ AL BUIO',2:'ATTO II · LA BRECCIA',3:'ATTO III · DUE STRADE'};
export const stepIndex=id=>CAMPAIGN.findIndex(s=>s.id===id);
export function stepPov(step){return step.type==='foot'?FOOT[step.id].pov:step.pov;}
// Choices change the next missions mechanically; the result is a fresh object, the canon stays untouched.
export function buildMission(id,flags={},cityChoice=null){
 const base=FOOT[id];if(!base)return null;const c={...base,waves:base.waves.map(w=>[...w]),...missionLayout(id,base.pov)};
 const solo=c.partner===false&&c.pov==='nox';
 if(solo&&flags.heat==='self'&&id!=='below')c.hpBonus=2;
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
 return campaignArsenalV9(c,flags);
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
  if(world.hub.returnStep!==step){
   // A v7 hub stored its return index before Segni di Gesso was inserted.
   if(!missedChalk||world.hub.returnStep!==step-1)return null;
   world.hub.returnStep=step;
  }
  if(world.hub.returnStep>=CAMPAIGN.length)return null;
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
