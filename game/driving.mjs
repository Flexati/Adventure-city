import {TURBO_TIERS} from './arsenal-data.mjs';
// Driving interludes. Nox drives the Vortex while the two travel together; after the split each drives alone.
export const DRIVING_MISSIONS=[
 {id:'escape',title:'Fuga dal Cantiere',music:'driving',winMode:'sprint',winRule:'SPRINT DI FUGA · Raggiungi il porto o scatena 3 scatti ad alta velocità',brief:'Nox al volante, Lulú al fianco. Sfonda il blocco della gang sul viadotto e porta la Vortex in salvo ad Ash Docks.',distance:14000,limit:95,goal:'Sfonda il blocco fino al porto',stops:[],driver:'nox',passenger:'lulu',vehicle:'vortex'},
 {id:'signal',title:'Sotto la breccia',music:'port_stealth',winMode:'radar_sync',winRule:'SINCRONIA RADAR · Attraversa i portali o taglia il traguardo in pieno Turbo',brief:'La frattura distorce i sensori. Attraversa i portali olografici azzurri con Lulú per agganciare la frequenza della breccia.',distance:15500,limit:105,goal:'Sincronizza i 3 portali radar',stops:[{at:3800,x:265},{at:7800,x:455},{at:11800,x:360}],stopKind:'pass',driver:'nox',passenger:'lulu',vehicle:'vortex'},
 {id:'evacuation',title:'L’ultima evacuazione',music:'veyra_championship',winMode:'rescue',winRule:'CONVOGLIO SOCCORSI · Carica le squadre nelle piazzole verdi e difendi lo scafo',brief:'I rifugi crollano. Nox tiene la strada mentre Lulú guida l’imbarco dei superstiti nelle due piazzole di emergenza.',distance:16000,limit:125,goal:'Carica i superstiti nei 2 varchi verdi',stops:[{at:4800,x:265},{at:10500,x:455}],stopKind:'hold',driver:'nox',passenger:'lulu',vehicle:'vortex'},
 {id:'ring',title:'Anello di ferro',music:'danger',winMode:'gauntlet',winRule:'SLALOM ANTI-DRONE · Schiva i puntamenti orbitali per sovraccaricare il motore',brief:'Nox guida da solo il mezzo pesante sull’Anello. Ogni scarica drone schivata alimenta la spinta verso Lulú.',distance:16000,limit:110,goal:'Sopravvivi ai droni ed esci dall’anello',stops:[],driver:'nox',passenger:null,vehicle:'truck',mode:'chase'},
 {id:'tunnel',title:'Tunnel muto',music:'veyra_championship_night',winMode:'sonar',winRule:'ECO DI RISONANZA · Usa l’impulso nel buio e segui le tracce luminose',brief:'Lulú guida la Vortex nel tunnel sommerso dal silenzio. Ogni impulso di Risonanza squarcia il buio e rivela la via verso Nox.',distance:15500,limit:110,goal:'Segui i 3 echi di gesso nel buio',stops:[{at:4000,x:360},{at:8200,x:265},{at:12200,x:455}],stopKind:'pass',driver:'lulu',passenger:null,vehicle:'vortex',mode:'dark'},
 {id:'veyra_proof',title:'La prova di Veyra',music:'nox',winMode:'sprint',winRule:'BANCHINA CORTA · Tieni la Vortex dritta fino al molo',brief:'Veyra resta sul predellino. Una banchina, niente pubblico: dimostrate che la Vortex vi riconosce.',distance:7200,limit:100,goal:'Porta la Vortex fino in fondo alla banchina',stops:[],driver:'nox',passenger:'lulu',vehicle:'vortex'}
];
export const LANES=[170,265,360,455,550];
export function newDrive(index=0,cityChoice=null,turboId=null){if(!Number.isInteger(index)||index<0||index>=DRIVING_MISSIONS.length)throw new Error('Invalid driving mission');let seed=271+index*113;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const c=DRIVING_MISSIONS[index];
 const workshop=cityChoice==='workshop'&&(index===0||c.vehicle==='vortex'&&index>2);
 const maxIntegrity=(c.vehicle==='truck'?6:5)+(workshop?1:0);
 const turbo=c.vehicle==='vortex'&&turboId?TURBO_TIERS.find(t=>t.id===turboId&&t.tier>=2)||null:null;
 return {version:1,index,driver:c.driver,passenger:c.passenger,vehicle:c.vehicle,mode:c.mode||null,winMode:c.winMode,music:c.music,x:360,vx:0,speed:0,distance:0,time:0,hp:maxIntegrity,maxIntegrity,cityChoice,inv:0,impact:0,shoulder:false,status:'playing',events:[],mastery:0,
  ...(turbo?{turbo:turbo.id,nitro:50,boost:0}:{}),
  stops:c.stops.map(s=>({...s,done:false,hold:0})),strikes:[],strikeClock:3,seed:seed,pulse:0,pulseCd:0,autoPulse:1.2,
  hazards:Array.from({length:Math.floor(c.distance/500)},(_,i)=>({id:i,at:900+i*470,x:LANES[Math.floor(rand()*5)],hit:false})).filter(h=>c.stops.every(p=>Math.abs(p.at-h.at)>450)&&(index!==0||cityChoice!=='shelter'||h.id%3!==0)&&(c.mode!=='chase'||h.id%2===0))};}
function driveRand(s){s.seed=(s.seed*1664525+1013904223)>>>0;return s.seed/4294967296;}
export function driveTick(s,input,dt){s.events=[];if(s.status!=='playing')return;dt=Math.max(0,Math.min(.05,dt));s.time+=dt;s.inv=Math.max(0,s.inv-dt);s.impact=Math.max(0,(s.impact||0)-dt);const c=DRIVING_MISSIONS[s.index];
 const tDef=s.turbo?TURBO_TIERS.find(t=>t.id===s.turbo):null;
 if(tDef){s.boost=Math.max(0,(s.boost||0)-dt);s.nitro=Math.min(100,(s.nitro||0)+dt*12*tDef.nitroGainMult);
  if(input.nitro&&s.nitro>=tDef.nitroCost&&s.boost<=0){s.nitro-=tDef.nitroCost;s.boost=tDef.duration*.75;s.mastery=(s.mastery||0)+1;s.events.push({type:'nitro',tier:tDef.tier});}}
 const boosting=!!(tDef&&s.boost>0);
 const throttle=Math.max(0,Math.min(1,input.throttle||0)),brake=Math.max(0,Math.min(1,input.brake||0));
 const top=(s.vehicle==='truck'?430:470)+(boosting?tDef.drivingBonus:0),ratio=s.speed/top,engine=throttle*(175+95*(1-ratio))+(boosting?160:0),drag=(throttle?18:58)+ratio*32;
 s.speed=Math.max(0,Math.min(top,s.speed+(engine-brake*520-drag)*dt));
 const steering=Math.max(-1,Math.min(1,input.steer||0)),desired=steering*(85+s.speed*.28);
 s.vx+=(desired-s.vx)*Math.min(1,dt*(s.vehicle==='truck'?7:8.5));s.x=Math.max(105,Math.min(615,s.x+s.vx*dt));
 s.shoulder=s.x<145||s.x>575;if(s.shoulder)s.speed=Math.max(0,s.speed*(1-dt*.7));s.distance+=s.speed*dt;
 function crash(kind='hit'){if(s.inv>0)return;s.hp--;s.inv=.85;s.impact=.3;s.speed*=.58;s.events.push({type:'driveHit',kind});}
 if((s.x<114||s.x>606)&&s.speed>115)crash();
 for(const h of s.hazards)if(!h.hit&&Math.abs(h.at-s.distance)<75&&Math.abs(h.x-s.x)<53){h.hit=true;crash();}
 // Chase: a drone marks the lane under the vehicle, then strikes it. Dodging a strike charges mastery speed!
 if(s.mode==='chase'){s.strikeClock-=dt;if(s.strikeClock<=0&&s.distance<c.distance-600){const lane=LANES.reduce((a,b)=>Math.abs(b-s.x)<Math.abs(a-s.x)?b:a);s.strikes.push({x:lane,warn:1.2,t:0});s.strikeClock=1.9+driveRand(s)*1.2;s.events.push({type:'strikeWarn',x:lane});}
  for(const k of s.strikes){k.t+=dt;if(!k.done&&k.t>=k.warn){k.done=true;s.events.push({type:'strike',x:k.x});if(Math.abs(k.x-s.x)<56)crash('strike');else{s.mastery=(s.mastery||0)+1;s.speed=Math.min(top,s.speed+35);}}}
  s.strikes=s.strikes.filter(k=>k.t<k.warn+.35);}
 // Dark: hazards are visible only near the headlights or while a Resonance pulse travels the road.
 if(s.mode==='dark'){s.pulse=Math.max(0,s.pulse-dt);s.pulseCd=Math.max(0,s.pulseCd-dt);s.autoPulse-=dt;
  if((input.pulse&&s.pulseCd===0)||s.autoPulse<=0){s.pulse=1.1;s.pulseCd=1.2;s.autoPulse=2.6;s.events.push({type:'pulse'});}
  if(s.pulse>0){const reach=300+(1.1-s.pulse)*1100;for(const h of s.hazards)if(!h.seen&&h.at-s.distance<reach)h.seen=true;}}
 for(const p of s.stops){if(p.done)continue;const near=Math.abs(p.at-s.distance)<170&&Math.abs(p.x-s.x)<66;
 if(c.stopKind==='pass'&&near){p.done=true;s.mastery=(s.mastery||0)+1;s.events.push({type:'checkpoint'});}
 else if(c.stopKind==='hold'){p.hold=near&&s.speed<55?p.hold+dt:0;if(p.hold>=.8){p.done=true;s.mastery=(s.mastery||0)+1;s.events.push({type:'pickup'});}}
 }
 if(s.hp<=0){s.status='failed';s.reason=s.vehicle==='truck'?'Il camion non regge più. Cambia corsia appena diventa rossa.':'La Vortex è troppo danneggiata.';}
 else if(s.time>c.limit){s.status='failed';s.reason='Tempo esaurito: dosa acceleratore e freno.';}
 else if(s.distance>=c.distance){if(s.stops.every(p=>p.done))s.status='cleared';else{s.status='failed';s.reason=c.stopKind==='pass'?(s.index===4?'Hai mancato un segno di gesso.':'Hai saltato un segnale azzurro.'):'Mancano soccorsi a bordo. Fermati nei punti verdi.';}}
 if(s.status!=='playing')s.events.push({type:s.status==='cleared'?'driveCleared':'driveFailed'});
}
// What the driver can see of a hazard: always on clear roads, near the lights or inside a pulse in the dark.
export function hazardVisible(s,h){return s.mode!=='dark'||!!h.seen||h.at-s.distance<300;}
