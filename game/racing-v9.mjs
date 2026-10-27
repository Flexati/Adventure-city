// Competitive events are separate from the five narrative driving interludes.
export const RACES_V9=Object.freeze({
 ash_docks:{id:'ash_docks',name:{it:'Ash Docks · La sfida di Veyra',en:'Ash Docks · Veyra’s challenge'},length:13000,limit:180,mode:'docks',checkpoints:[3200,6800,10200],gates:[],hazards:[{at:1800,x:265},{at:4200,x:455},{at:5500,x:360},{at:8300,x:265},{kind:'barrier',at:9000,gap:452},{at:11500,x:455}],pads:[{at:2500,x:360},{at:6000,x:268},{at:12200,x:360}]},
 ash_slalom:{id:'ash_slalom',name:{it:'Ash Docks · Fra le gru',en:'Ash Docks · Between the cranes'},length:12500,limit:180,mode:'precision',checkpoints:[2600,5200,8000,10800],checkpointXs:[240,470,240,470],checkpointWidth:72,gates:[],hazards:[{at:1400,x:455},{kind:'swing',at:3900,x:360},{at:6700,x:455},{kind:'swing',at:9500,x:360}],pads:[{at:4500,x:452},{at:11600,x:360}]},
 ash_night:{id:'ash_night',name:{it:'Ash Docks · Luci spente',en:'Ash Docks · Lights out'},length:13500,limit:190,mode:'night',visibility:430,checkpoints:[3100,6800,10800],gates:[],hazards:[{at:1700,x:265},{kind:'slick',at:2400,x:360,w:80},{at:4800,x:455},{at:8500,x:360},{kind:'slick',at:9400,x:268,w:80},{at:12000,x:265}],pads:[{at:5600,x:360},{at:12600,x:360}]},
 solkara:{id:'solkara',name:{it:'Solkara · Fra i convogli',en:'Solkara · Between convoys'},length:15000,limit:200,mode:'sand',checkpoints:[3800,7800,11800],gates:[],hazards:[{at:1900,x:265,moving:true},{at:5400,x:455,moving:true},{kind:'slick',at:7000,x:452,w:90},{at:9500,x:360,moving:true},{kind:'slick',at:11000,x:268,w:90},{at:13000,x:265,moving:true}],pads:[{at:3000,x:360},{at:14000,x:360}]},
 solkara_storm:{id:'solkara_storm',name:{it:'Solkara · Il fronte di sabbia',en:'Solkara · The sand front'},length:16000,limit:220,mode:'storm',visibility:520,wind:65,checkpoints:[3300,7000,10600,14000],checkpointXs:[280,440,280,440],checkpointWidth:100,gates:[],hazards:[{at:1800,x:455},{at:5000,x:265},{kind:'barrier',at:5900,gap:452},{at:8800,x:455},{kind:'slick',at:11800,x:360,w:90},{at:12500,x:360}],pads:[{at:2400,x:360}]},
 aurelia_span:{id:'aurelia_span',name:{it:'Aurelia Span · Ponti del tempo',en:'Aurelia Span · Bridges of time'},length:14000,limit:210,mode:'bridges',checkpoints:[3200,7200,11200],gates:[4700,9700],hazards:[{at:2000,x:455},{at:6300,x:265},{kind:'barrier',at:8200,gap:268},{at:12500,x:360}],pads:[{at:5600,x:360},{at:13200,x:360}]},
 veyra_duel:{id:'veyra_duel',name:{it:'Aurelia Span · La linea di Ash',en:'Aurelia Span · Ash’s line'},length:16500,limit:230,mode:'duel',duel:true,checkpoints:[3600,7600,11800,14900],checkpointXs:[260,460,260,460],checkpointWidth:85,gates:[5200,9900,13300],hazards:[{at:1900,x:455},{at:6500,x:265},{kind:'barrier',at:8700,gap:452},{at:11000,x:455},{kind:'swing',at:15700,x:360}],pads:[{at:3000,x:360},{at:7100,x:452},{at:14300,x:360}]}
});
export const RACE_SERIES_V9=Object.freeze(['ash_docks','ash_slalom','ash_night','solkara','solkara_storm','aurelia_span','veyra_duel']);
export function availableRacesV9(record){const next=RACE_SERIES_V9.find(id=>!record.events[id]?.completed);return RACE_SERIES_V9.filter(id=>record.events[id]?.completed||id===next);}
export function raceCheckpointX(race,index){return race.checkpointXs?.[index]??360;}
export function raceVisibility(race){return race.visibility||1400;}
// Ash Docks road variants (Terra round 1, G4): one 720x1440 tile per 1440 scrolled px (distance x .65).
// The sequence is fixed per race, so the player learns the course by its landmarks.
export const RACE_ROAD_TILE=1440,RACE_SCROLL=.65;
const ASH_ROAD_SEQUENCES={
 ash_docks:{time:'day',pick:(i,r)=>i===Math.floor(r.checkpoints.at(-1)*RACE_SCROLL/RACE_ROAD_TILE)?'gru':i%2?'deposito':'banchina'},
 ash_slalom:{time:'day',pick:(i,r)=>i>=Math.floor((r.length-1500)*RACE_SCROLL/RACE_ROAD_TILE)?'banchina':'gru'},
 ash_night:{time:'night',pick:i=>['banchina','gru','deposito'][(i%3+3)%3]}
};
export function raceRoadTile(race,i){const a=ASH_ROAD_SEQUENCES[race.id];return a?`race_ashdocks_${a.pick(i,race)}_${a.time}`:null;}
export function raceRoadArt(race){if(!ASH_ROAD_SEQUENCES[race.id])return [];const last=Math.ceil((race.length+2000)*RACE_SCROLL/RACE_ROAD_TILE),out=new Set();for(let i=-2;i<=last;i++)out.add(raceRoadTile(race,i));return [...out];}
const raceClamp=(n,a,b)=>Math.max(a,Math.min(b,n));
// Obstacle kinds: container (default; `moving` slides across), 'barrier' (a row of containers with one
// open lane at `gap`), 'swing' (a crane load swinging over three lanes), 'slick' (oil or sand: no damage,
// the car loses grip and speed). Pads are nitro strips: crossing one gives a short boost.
// A barrier is containers on every lane but `gap`; each one collides like a single container (|dx|<55).
export const RACE_LANES=Object.freeze([176,268,360,452,544]),RACE_PAD_HALF=60,NITRO_COST=50,NITRO_BOOST=2.2,PAD_BOOST=1.3,START_BOOST=1.2,START_WINDOW=.6;
export function raceHazardX(h,time){if(h.kind==='barrier')return h.gap;if(h.kind==='swing')return h.x+Math.sin(time*.9+h.at/700)*(h.amp||150);return h.x+(h.moving?Math.sin(time*.65+h.at)*80:0);}
const solid=h=>h.kind!=='slick';
export function raceGateOpen(time,index){return (time+index*2)%9<5.5;}
export function newRaceV9(id='ash_docks'){
 if(!Object.hasOwn(RACES_V9,id))throw Error('Unknown race');
 return {version:1,id,time:0,countdown:3,countdownCalled:null,status:'countdown',events:[],cars:[
  {id:'player',name:'Nox',x:360,skill:1},{id:'veyra',name:'Veyra “Ash” Kor',x:265,skill:.98},
  {id:'rival_2',name:'02',x:455,skill:.89},{id:'rival_3',name:'03',x:170,skill:.84}
 ].filter(c=>!RACES_V9[id].duel||['player','veyra'].includes(c.id)).map(c=>({...c,distance:0,speed:0,vx:0,integrity:100,checkpoint:0,penalty:0,finishTime:null,inv:0,hits:[],recoveries:0,nitro:0,boost:0,slick:0,launch:null,drafting:false}))};
}
export function raceStandings(s){return [...s.cars].sort((a,b)=>{
 if(a.finishTime!==null||b.finishTime!==null)return (a.finishTime??Infinity)-(b.finishTime??Infinity)||a.id.localeCompare(b.id);
 return b.distance-a.distance||a.id.localeCompare(b.id);
});}
export function racePilot(s,car){
 const race=RACES_V9[s.id],ahead=race.hazards.filter(h=>!car.hits.includes(h.at)&&h.at-car.distance>-65&&h.at-car.distance<Math.min(600,raceVisibility(race)));
 let target=car.id==='veyra'?315:360;
 const near=ahead.sort((a,b)=>a.at-b.at)[0];
 const pad=(race.pads||[]).find(q=>q.at-car.distance>0&&q.at-car.distance<500);
 if(pad&&(!near||near.at>pad.at))target=pad.x;
 if(near){const hx=raceHazardX(near,s.time+Math.max(0,near.at-car.distance)/Math.max(150,car.speed));target=near.kind==='barrier'?hx:hx>=360?Math.min(210,hx-170):Math.max(510,hx+170);}
 const cp=race.checkpoints[car.checkpoint];if(cp&&cp-car.distance<550&&cp-car.distance>0)target=raceCheckpointX(race,car.checkpoint);
 const gate=race.gates.findIndex(at=>at>car.distance&&at-car.distance<430);
 const brake=gate>=0&&!raceGateOpen(s.time,gate)&&race.gates[gate]-car.distance<car.speed*.7;
 const clear=!race.hazards.some(h=>solid(h)&&!car.hits.includes(h.at)&&h.at-car.distance>0&&h.at-car.distance<900);
 return {steer:raceClamp((target-car.x)/90,-1,1),throttle:brake?0:car.skill,brake:brake?1:0,nitro:clear&&!brake&&car.nitro>=NITRO_COST&&(car.id==='player'||s.cars[0].distance-car.distance>-600)};
}
export function tickRaceV9(s,input={},dt){
 s.events=[];if(!['countdown','racing'].includes(s.status)||!Number.isFinite(dt)||dt<=0)return;
 dt=Math.min(dt,.05);
 if(s.status==='countdown'){s.countdown=Math.max(0,s.countdown-dt);
  // Perfect start: throttle pressed in the last START_WINDOW s of the countdown and held. Earlier is a wheelspin: no boost.
  const p0=s.cars[0];if(Number.isFinite(input.throttle)&&input.throttle>0)p0.launch??=s.countdown;else p0.launch=null;
  // One call per shown number (3, 2, 1) for the countdown cue; zero is the start itself.
  const shown=Math.ceil(s.countdown-1e-9);if(shown>0&&shown!==s.countdownCalled){s.countdownCalled=shown;s.events.push({type:'count',n:shown});}
  if(s.countdown<1e-8){s.countdown=0;s.status='racing';s.events.push({type:'start'});
   for(const car of s.cars){const good=car.id==='player'?car.launch!==null&&car.launch<=START_WINDOW:car.id==='veyra';if(good){car.boost=START_BOOST;s.events.push({type:'perfectStart',car:car.id});}else if(car.id==='player'&&car.launch!==null)s.events.push({type:'wheelspin',car:car.id});car.launch=null;}}return;}
 const race=RACES_V9[s.id],previousTime=s.time;s.time+=dt;
 for(const car of s.cars){
  if(car.finishTime!==null)continue;
  const controls=car.id==='player'?input:racePilot(s,car);
  const finite=(v,min,max)=>Number.isFinite(v)?raceClamp(v,min,max):0;
  const throttle=finite(controls.throttle,0,1),brake=finite(controls.brake,0,1),steer=finite(controls.steer,-1,1);
  car.inv=Math.max(0,car.inv-dt);
  if(controls.nitro&&car.nitro>=NITRO_COST&&car.boost<=0){car.nitro-=NITRO_COST;car.boost=NITRO_BOOST;s.events.push({type:'nitro',car:car.id});}
  const boosting=car.boost>0;car.boost=Math.max(0,car.boost-dt);car.slick=Math.max(0,car.slick-dt);
  const top=(['sand','storm'].includes(race.mode)?440:470)+(boosting?130:0);
  car.speed=raceClamp(car.speed+(throttle*225+(boosting?320:0)-brake*550-22-car.speed*.06)*dt,0,top);
  car.vx+=(steer*(90+car.speed*.3)-car.vx)*Math.min(1,dt*(car.slick>0?2:8.5));
  if(car.slick>0)car.speed*=1-dt*.55;
  const wind=['sand','storm'].includes(race.mode)?Math.sin(s.time*.8+car.distance/2200)*(race.wind||22):0;
  car.x=raceClamp(car.x+(car.vx+wind)*dt,110,610);
  if(car.x<145||car.x>575)car.speed*=1-dt*.9;
  const before=car.distance;car.distance+=car.speed*dt;
  for(let i=0;i<race.gates.length;i++){
   const at=race.gates[i];if(before<=at-45&&car.distance>=at-45&&!raceGateOpen(s.time,i)){car.distance=at-45;car.speed=0;}
  }
  function impact(){if(car.inv>0)return;car.integrity-=35;car.inv=.8;car.speed*=.5;car.boost=0;s.events.push({type:'impact',car:car.id});}
  // Rivals fill the gauge more slowly than the player and burn it only when not clearly ahead (see racePilot).
  const gain=(n,type)=>{car.nitro=Math.min(100,car.nitro+n*(car.id==='player'?1:car.id==='veyra'?1:.5));if(type)s.events.push({type,car:car.id});};
  if((car.x<115||car.x>605)&&car.speed>110)impact();
  for(const h of race.hazards){
   const dx=Math.abs(raceHazardX(h,s.time)-car.x);
   if(h.kind==='slick'){if(Math.abs(h.at-car.distance)<130&&dx<(h.w||75)){if(car.slick<=0)s.events.push({type:'slick',car:car.id});car.slick=.35;}continue;}
   if(!car.hits.includes(h.at)&&Math.abs(h.at-car.distance)<65&&(h.kind==='barrier'?RACE_LANES.some(x=>x!==h.gap&&Math.abs(x-car.x)<55):dx<55)){car.hits.push(h.at);impact();continue;}
   // A near miss (or threading a barrier's open lane) fills the nitro gauge.
   if(before<h.at&&car.distance>=h.at&&!car.hits.includes(h.at)&&(h.kind==='barrier'||dx<115))gain(h.kind==='barrier'?20:22,'nearMiss');
  }
  for(const q of race.pads||[])if(before<q.at&&car.distance>=q.at&&Math.abs(q.x-car.x)<RACE_PAD_HALF){car.boost=Math.max(car.boost,PAD_BOOST);s.events.push({type:'pad',car:car.id});}
  const lead=s.cars.find(o=>o!==car&&o.distance-car.distance>40&&o.distance-car.distance<260&&Math.abs(o.x-car.x)<50);
  if(lead&&car.speed>260){gain(6*dt);if(!car.drafting)s.events.push({type:"draft",car:car.id});}car.drafting=!!lead&&car.speed>260;
  const cp=race.checkpoints[car.checkpoint];
  if(cp&&car.distance>=cp){
   const cpX=raceCheckpointX(race,car.checkpoint);
   if(Math.abs(car.x-cpX)<=(race.checkpointWidth||165)){car.checkpoint++;s.events.push({type:'checkpoint',car:car.id,index:car.checkpoint});if(Math.abs(car.x-cpX)<=Math.max(25,(race.checkpointWidth||165)*.3))gain(15,'perfectCheckpoint');}
   else{car.distance=cp-180;car.x=cpX;car.speed=0;car.penalty+=3;car.recoveries++;s.events.push({type:'missedCheckpoint',car:car.id});}
  }
  if(car.integrity<=0){car.distance=car.checkpoint?race.checkpoints[car.checkpoint-1]+40:0;car.x=360;car.speed=0;car.integrity=100;car.penalty+=5;car.recoveries++;car.inv=2;s.events.push({type:'recovery',car:car.id});}
  if(car.distance>=race.length&&car.checkpoint===race.checkpoints.length){
   const fraction=car.distance>before?raceClamp((race.length-before)/(car.distance-before),0,1):1;
   car.finishTime=previousTime+dt*fraction+car.penalty;car.distance=race.length;car.speed=0;s.events.push({type:'finish',car:car.id});
  }
 }
 // Apply penalties as actual waiting time at the line. Otherwise an early penalized
 // finisher would incorrectly lock a win before an unpenalized rival could arrive.
 const player=s.cars[0];
 if(player.finishTime!==null&&s.time>=player.finishTime){s.status='finished';s.events.push({type:'raceFinished'});}
 else if(s.time>=race.limit){s.status='retired';s.events.push({type:'timeout'});}
}
export function raceResultV9(s){
 if(s.status!=='finished')return null;
 const p=s.cars[0],rank=1+s.cars.filter(c=>c.id!=='player'&&c.finishTime!==null&&c.finishTime<p.finishTime).length;
 return {race:s.id,rank,time:p.finishTime,penalty:p.penalty,checkpoints:p.checkpoint,recoveries:p.recoveries};
}
export function newRaceRecordV9(){return {version:1,coins:0,events:{}};}
export function recordRaceV9(record,s){
 const result=raceResultV9(s);if(!result)return {record,reward:0};
 const old=record.events[s.id],first=!old,firstWin=result.rank===1&&!old?.won;
 const reward=(first?15:0)+(firstWin?10:0);
 return {record:{version:1,coins:record.coins+reward,events:{...record.events,[s.id]:{completed:true,won:!!old?.won||result.rank===1,bestTime:Math.min(old?.bestTime??Infinity,result.time),bestRank:Math.min(old?.bestRank??4,result.rank)}}},reward};
}
export function loadRaceRecordV9(raw){try{
 const r=JSON.parse(raw);if(r.version!==1||!r.events||Array.isArray(r.events)||!Number.isInteger(r.coins)||r.coins<0)return null;
 let total=0;for(const [id,e] of Object.entries(r.events)){
  if(!Object.hasOwn(RACES_V9,id)||e.completed!==true||typeof e.won!=='boolean'||!Number.isFinite(e.bestTime)||e.bestTime<=0||!Number.isInteger(e.bestRank)||e.bestRank<1||e.bestRank>(RACES_V9[id].duel?2:4)||e.won!==(e.bestRank===1))return null;
  total+=15+(e.won?10:0);
 }
 if(total!==r.coins)return null;return r;
}catch{return null;}}
