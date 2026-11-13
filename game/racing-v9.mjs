// Competitive events are separate from the five narrative driving interludes.
import {TURBO_TIERS} from './arsenal-data.mjs';
export {TURBO_TIERS};
export function turboDefV12(id){return TURBO_TIERS.find(t=>t.id===id)||TURBO_TIERS[0];}
export function unlockedTurbosV12(act=1,races=null,world=null){
 const done=Object.keys(races?.events||{}).length+Object.keys(races?.modes||{}).length;
 return TURBO_TIERS.filter(t=>t.tier===1||act>=t.unlockAct||done>=t.unlockRaces||(world?.inventory?.[t.id]>0)||world?.equipment?.turbo===t.id).map(t=>t.id);
}
export function bestUnlockedTurboV12(act=1,races=null,world=null){
 const eq=world?.equipment?.turbo,list=unlockedTurbosV12(act,races,world);
 return eq&&list.includes(eq)?eq:list.at(-1)||'turbo_mk1';
}
const BASE_RACES={
 ash_docks:{id:'ash_docks',name:{it:'Ash Docks · La sfida di Veyra',en:'Ash Docks · Veyra’s challenge'},length:13000,limit:180,mode:'docks',checkpoints:[3200,6800,10200],gates:[],
  curves:[{from:2000,to:2950,dir:1,strength:.45},{from:6950,to:8100,dir:-1,strength:.55},{from:10350,to:11350,dir:1,strength:.5}],
  hazards:[{at:1800,x:265},{kind:'slick',at:3300,x:268,w:80},{at:4200,x:455},{at:5500,x:360},{at:7200,x:452,moving:true},{at:8300,x:265},{kind:'barrier',at:9000,gap:452},{at:11500,x:455}],pads:[{at:2500,x:360},{at:6000,x:268},{at:9800,x:452},{at:12200,x:360}]},
 ash_slalom:{id:'ash_slalom',name:{it:'Ash Docks · Fra le gru',en:'Ash Docks · Between the cranes'},length:12500,limit:180,mode:'precision',checkpoints:[2600,5200,8000,10800],checkpointXs:[240,470,240,470],checkpointWidth:72,gates:[],
  curves:[{from:1550,to:2450,dir:-1,strength:.65},{from:4050,to:5050,dir:1,strength:.7},{from:6850,to:7850,dir:-1,strength:.72},{from:9650,to:10650,dir:1,strength:.75}],
  hazards:[{at:1400,x:455},{kind:'swing',at:3900,x:360},{at:6700,x:455},{kind:'swing',at:9500,x:360}],pads:[{at:4500,x:452},{at:11600,x:360}]},
 ash_night:{id:'ash_night',name:{it:'Ash Docks · Luci spente',en:'Ash Docks · Lights out'},length:13500,limit:190,mode:'night',visibility:430,checkpoints:[3100,6800,10800],gates:[],
  curves:[{from:2550,to:3700,dir:1,strength:.68},{from:5750,to:6700,dir:-1,strength:.74},{from:9600,to:10700,dir:1,strength:.8}],
  hazards:[{at:1700,x:265},{kind:'slick',at:2400,x:360,w:80},{at:4800,x:455},{at:8500,x:360},{kind:'slick',at:9400,x:268,w:80},{at:12000,x:265}],pads:[{at:5600,x:360},{at:12600,x:360}]},
 solkara:{id:'solkara',name:{it:'Solkara · Fra i convogli',en:'Solkara · Between convoys'},length:15000,limit:200,mode:'sand',checkpoints:[3800,7800,11800],gates:[],
  curves:[{from:2150,to:3550,dir:1,strength:.72},{from:5550,to:6850,dir:-1,strength:.78},{from:9650,to:10950,dir:1,strength:.84},{from:13150,to:14300,dir:-1,strength:.85}],
  hazards:[{at:1900,x:265,moving:true},{at:5400,x:455,moving:true},{kind:'slick',at:7000,x:452,w:90},{at:9500,x:360,moving:true},{kind:'slick',at:11000,x:268,w:90},{at:13000,x:265,moving:true}],pads:[{at:3000,x:360},{at:14000,x:360}]},
 solkara_storm:{id:'solkara_storm',name:{it:'Solkara · Il fronte di sabbia',en:'Solkara · The sand front'},length:16000,limit:220,mode:'storm',visibility:520,wind:65,checkpoints:[3300,7000,10600,14000],checkpointXs:[280,440,280,440],checkpointWidth:100,gates:[],
  curves:[{from:2050,to:2900,dir:-1,strength:.68},{from:3650,to:4650,dir:1,strength:.72},{from:8950,to:10100,dir:-1,strength:.74},{from:12650,to:13520,dir:1,strength:.76}],
  hazards:[{at:1800,x:455},{at:5000,x:265},{kind:'barrier',at:5900,gap:452},{at:8800,x:455},{kind:'slick',at:11800,x:360,w:90},{at:12500,x:360}],pads:[{at:2400,x:360}]},
 aurelia_span:{id:'aurelia_span',name:{it:'Aurelia Span · Ponti del tempo',en:'Aurelia Span · Bridges of time'},length:14000,limit:210,mode:'bridges',checkpoints:[3200,7200,11200],gates:[4700,9700],
  curves:[{from:2150,to:3100,dir:1,strength:.76},{from:5750,to:7000,dir:-1,strength:.85},{from:8350,to:9500,dir:1,strength:.92},{from:11350,to:12450,dir:-1,strength:.88}],
  hazards:[{at:2000,x:455},{at:6300,x:265},{kind:'barrier',at:8200,gap:268},{at:12500,x:360}],pads:[{at:5600,x:360},{at:13200,x:360}]},
 veyra_duel:{id:'veyra_duel',name:{it:'Aurelia Span · La linea di Ash',en:'Aurelia Span · Ash’s line'},length:16500,limit:230,mode:'duel',duel:true,checkpoints:[3600,7600,11800,14900],checkpointXs:[260,460,260,460],checkpointWidth:85,gates:[5200,9900,13300],
  curves:[{from:2050,to:3300,dir:1,strength:.86},{from:5350,to:6350,dir:-1,strength:.92},{from:8850,to:9750,dir:1,strength:.96},{from:11950,to:13100,dir:-1,strength:.96},{from:13950,to:14650,dir:1,strength:.88}],
  hazards:[{at:1900,x:455},{at:6500,x:265},{kind:'barrier',at:8700,gap:452},{at:11000,x:455},{kind:'swing',at:15700,x:360}],pads:[{at:3000,x:360},{at:7100,x:452},{at:14300,x:360}]}
};
export const RACE_SERIES_V9=Object.freeze(['ash_docks','ash_slalom','ash_night','solkara','solkara_storm','aurelia_span','veyra_duel']);
export const RACE_MODES_V9=Object.freeze({tt:{it:'Contro il tempo',en:'Time trial'},elim:{it:'Eliminazione',en:'Elimination'},rev:{it:'Rivincita',en:'Rematch'}});
const TT_MEDALS=Object.fromEntries(Object.entries({ash_docks:26.2,ash_slalom:25.8,ash_night:27.2,solkara:32.1,solkara_storm:35.3,aurelia_span:27.9,veyra_duel:32.8}).map(([k,g])=>[k,[g,+(g+1.2).toFixed(1),+(g+3.5).toFixed(1)]]));
function modeRace(b,mode){
 const marks=[...b.checkpoints,...b.gates,...b.hazards.map(h=>h.at),...(b.pads||[]).map(q=>q.at)];
 const clear=(at,gap)=>at>800&&at<b.length-500&&marks.every(m=>Math.abs(m-at)>=gap);
 const r={...b,id:`${mode}:${b.id}`,base:b.id,variant:mode,name:{it:`${RACE_MODES_V9[mode].it} · ${b.name.it.split(' · ')[1]}`,en:`${RACE_MODES_V9[mode].en} · ${b.name.en.split(' · ')[1]}`}};
 if(mode==='tt'){const extra=[];for(let at=1500;at<b.length-600;at+=1100)if(clear(at,420))extra.push({at,x:[268,360,452][extra.length%3]});r.solo=true;r.pads=[...(b.pads||[]),...extra].sort((a,c)=>a.at-c.at);r.medals=TT_MEDALS[b.id];}
 if(mode==='elim')r.elimination=true;
 if(mode==='rev'){
  const back=at=>b.length-at,order=a=>[...a].sort((x,y)=>x.at-y.at);
  r.checkpoints=b.checkpoints.map(back).reverse();if(b.checkpointXs)r.checkpointXs=[...b.checkpointXs].reverse();
  r.gates=b.gates.map(back).reverse();r.pads=order((b.pads||[]).map(q=>({...q,at:back(q.at)})));
  r.curves=(b.curves||[]).map(c=>({from:back(c.to),to:back(c.from),dir:-c.dir,strength:c.strength})).sort((x,y)=>x.from-y.from);
  const hz=b.hazards.map(h=>({...h,at:back(h.at)})),marks2=[...r.checkpoints,...r.gates,...hz.map(h=>h.at),...r.pads.map(q=>q.at)];
  for(let at=2000,k=0;at<b.length-800&&!b.visibility;at+=2600)if(marks2.every(m=>Math.abs(m-at)>=(r.checkpoints.includes(m)?700:r.gates.includes(m)?500:450))){hz.push({at,x:[455,265,360][k++%3]});}
  r.hazards=order(hz);r.aggressive=true;r.limit=b.limit+10;
 }
 return r;
}
export const CHECKPOINT_REPAIR=20,SHARD_NITRO=4,SHARD_LINE_NITRO=12,SHARD_HALF=50;
export function raceShards(r){
 const marks=[500,...r.checkpoints,...r.gates,...r.hazards.map(h=>h.at),...(r.pads||[]).map(q=>q.at),r.length-300].sort((a,b)=>a-b),out=[];
 for(let i=1,line=0;i<marks.length;i++){const a=marks[i-1]+380,z=marks[i]-380;if(marks[i]-marks[i-1]<1100)continue;
  for(let at=a,k=0;at<=z;at+=170,k++)out.push({at:Math.round(at),x:Math.round(360+150*Math.sin(k*.8+line*1.7)),line});line++;}
 return out;
}
export const RACES_V9=Object.freeze(Object.fromEntries([
 ...Object.entries(BASE_RACES),
 ...Object.values(BASE_RACES).flatMap(b=>Object.keys(RACE_MODES_V9).filter(m=>!(m==='elim'&&b.duel)).map(m=>{const r=modeRace(b,m);return [r.id,r];}))
].map(([id,r])=>[id,{...r,shards:raceShards(r)}])));
export function raceModesFor(baseId){return Object.keys(RACE_MODES_V9).map(m=>`${m}:${baseId}`).filter(id=>Object.hasOwn(RACES_V9,id));}
export function raceMedal(race,time){if(!race.medals||!Number.isFinite(time))return null;const [g,s,b]=race.medals;return time<=g?'gold':time<=s?'silver':time<=b?'bronze':null;}
export function availableRacesV9(record){const next=RACE_SERIES_V9.find(id=>!record.events[id]?.completed);return RACE_SERIES_V9.filter(id=>record.events[id]?.completed||id===next);}
export function raceCheckpointX(race,index){return race.checkpointXs?.[index]??360;}
export function raceVisibility(race){return race.visibility||1400;}
export const RACE_ROAD_TILE=1440,RACE_SCROLL=.65;
const ROAD_SEQUENCES={
 ash_docks:{set:'ashdocks',time:'day',pick:(i,r)=>i===Math.floor(r.checkpoints.at(-1)*RACE_SCROLL/RACE_ROAD_TILE)?'gru':i%2?'deposito':'banchina'},
 ash_slalom:{set:'ashdocks',time:'day',pick:(i,r)=>i>=Math.floor((r.length-1500)*RACE_SCROLL/RACE_ROAD_TILE)?'banchina':'gru'},
 ash_night:{set:'ashdocks',time:'night',pick:i=>['banchina','gru','deposito'][(i%3+3)%3]},
 solkara:{set:'solkara',time:'day',pick:(i,r)=>i===Math.floor(r.checkpoints.at(-1)*RACE_SCROLL/RACE_ROAD_TILE)?'reti':i%2?'pozzo':'convogli'},
 solkara_storm:{set:'solkara',time:'storm',pick:i=>i%2?'pozzo':'convogli'},
 aurelia_span:{set:'aurelia',time:'day',pick:i=>(i%3+3)%3===1?'torri':'campata'},
 veyra_duel:{set:'aurelia',time:'dusk',pick:()=>'torri'}
};
export function raceRoadTile(race,i){const a=ROAD_SEQUENCES[race.base||race.id];return a?`race_${a.set}_${a.pick(i,BASE_RACES[race.base||race.id])}_${a.time}`:null;}
export function raceRoadArt(race){if(!ROAD_SEQUENCES[race.base||race.id])return [];const last=Math.ceil((race.length+2000)*RACE_SCROLL/RACE_ROAD_TILE),out=new Set();for(let i=-2;i<=last;i++)out.add(raceRoadTile(race,i));return [...out];}
const raceClamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function raceCurveAt(race,distance){
 if(!race?.curves?.length)return 0;
 let sum=0;
 for(const c of race.curves)if(distance>=c.from&&distance<=c.to){const t=(distance-c.from)/Math.max(1,c.to-c.from);sum+=c.dir*c.strength*Math.sin(Math.PI*t);}
 return raceClamp(sum,-1.2,1.2);
}
export function raceNextCurve(race,distance,lookahead=950){
 const now=raceCurveAt(race,distance);
 if(Math.abs(now)>=.12)return {dir:now>0?1:-1,strength:Math.abs(now),active:true,distanceTo:0};
 const next=(race?.curves||[]).find(c=>c.from>distance&&c.from-distance<=lookahead);
 return next?{dir:next.dir,strength:next.strength,active:false,distanceTo:next.from-distance}:null;
}
export const RACE_LANES=Object.freeze([176,268,360,452,544]),RACE_PAD_HALF=60,NITRO_COST=50,NITRO_BOOST=2.2,PAD_BOOST=1.3,START_BOOST=1.2,START_WINDOW=.6;
export function raceHazardX(h,time){if(h.kind==='barrier')return h.gap;if(h.kind==='swing')return h.x+Math.sin(time*.9+h.at/700)*(h.amp||150);return h.x+(h.moving?Math.sin(time*.65+h.at)*80:0);}
const solid=h=>h.kind!=='slick';
export function raceGateOpen(time,index){return (time+index*2)%9<5.5;}
export function newRaceV9(id='ash_docks',opts=null){
 if(!Object.hasOwn(RACES_V9,id))throw Error('Unknown race');
 const turbo=turboDefV12(opts?.turboId);
 return {version:1,id,turbo:turbo.id,time:0,countdown:3,countdownCalled:null,status:'countdown',events:[],eliminated:[],cars:[
  {id:'player',name:'Nox',x:360,skill:1},{id:'veyra',name:'Veyra “Ash” Kor',x:265,skill:.98},
  {id:'rival_2',name:'02',x:455,skill:.89},{id:'rival_3',name:'03',x:170,skill:.84}
 ].filter(c=>RACES_V9[id].solo?c.id==='player':!RACES_V9[id].duel||['player','veyra'].includes(c.id)).map(c=>({...c,skill:RACES_V9[id].aggressive&&c.id!=='player'?Math.min(1,c.skill+.04):c.skill,out:false,distance:0,speed:0,vx:0,integrity:100,checkpoint:0,penalty:0,finishTime:null,inv:0,hits:[],shards:[],recoveries:0,nitro:0,boost:0,slick:0,launch:null,drafting:false}))};
}
export function raceStandings(s){return [...s.cars].sort((a,b)=>{
 if(a.out!==b.out)return a.out?1:-1;
 if(a.finishTime!==null||b.finishTime!==null)return (a.finishTime??Infinity)-(b.finishTime??Infinity)||a.id.localeCompare(b.id);
 return b.distance-a.distance||a.id.localeCompare(b.id);
});}
export function racePilot(s,car){
 const race=RACES_V9[s.id],ahead=race.hazards.filter(h=>!car.hits.includes(h.at)&&h.at-car.distance>-65&&h.at-car.distance<Math.min(600,raceVisibility(race)));
 const curve=raceCurveAt(race,car.distance),aheadCurve=raceCurveAt(race,car.distance+170);
 let target=car.id==='veyra'?315:360;
 if(Math.abs(curve)>.1||Math.abs(aheadCurve)>.1)target+=(curve||aheadCurve)*24;
 const near=ahead.sort((a,b)=>a.at-b.at)[0];
 const pad=(race.pads||[]).find(q=>q.at-car.distance>0&&q.at-car.distance<500);
 if(pad&&(!near||near.at>pad.at))target=pad.x;
 if(near){const hx=raceHazardX(near,s.time+Math.max(0,near.at-car.distance)/Math.max(150,car.speed));target=near.kind==='barrier'?hx:hx>=360?Math.min(210,hx-170):Math.max(510,hx+170);}
 const cp=race.checkpoints[car.checkpoint];if(cp&&cp-car.distance<550&&cp-car.distance>0)target=raceCheckpointX(race,car.checkpoint);
 const gate=race.gates.findIndex(at=>at>car.distance&&at-car.distance<430);
 const brake=gate>=0&&!raceGateOpen(s.time,gate)&&race.gates[gate]-car.distance<car.speed*.7;
 const clear=!race.hazards.some(h=>solid(h)&&!car.hits.includes(h.at)&&h.at-car.distance>0&&h.at-car.distance<900);
 const cost=car.id==='player'?turboDefV12(s.turbo).nitroCost:NITRO_COST;
 return {steer:raceClamp((target-car.x)/90+curve*.62+aheadCurve*.18,-1,1),throttle:brake?0:car.skill,brake:brake?1:0,nitro:clear&&!brake&&car.nitro>=cost&&(car.id==='player'||s.cars[0].distance-car.distance>-600)};
}
export function tickRaceV9(s,input={},dt){
 s.events=[];if(!['countdown','racing'].includes(s.status)||!Number.isFinite(dt)||dt<=0)return;
 dt=Math.min(dt,.05);
 if(s.status==='countdown'){s.countdown=Math.max(0,s.countdown-dt);
  const p0=s.cars[0];if(Number.isFinite(input.throttle)&&input.throttle>0)p0.launch??=s.countdown;else p0.launch=null;
  const shown=Math.ceil(s.countdown-1e-9);if(shown>0&&shown!==s.countdownCalled){s.countdownCalled=shown;s.events.push({type:'count',n:shown});}
  if(s.countdown<1e-8){s.countdown=0;s.status='racing';s.events.push({type:'start'});
   for(const car of s.cars){const good=car.id==='player'?car.launch!==null&&car.launch<=START_WINDOW:car.id==='veyra';if(good){car.boost=START_BOOST;s.events.push({type:'perfectStart',car:car.id});}else if(car.id==='player'&&car.launch!==null)s.events.push({type:'wheelspin',car:car.id});car.launch=null;}}return;}
 const race=RACES_V9[s.id],previousTime=s.time,pTurbo=turboDefV12(s.turbo);s.time+=dt;
 for(const car of s.cars){
  if(car.finishTime!==null||car.out)continue;
  const isP=car.id==='player',controls=isP?input:racePilot(s,car);
  const finite=(v,min,max)=>Number.isFinite(v)?raceClamp(v,min,max):0;
  const throttle=finite(controls.throttle,0,1),brake=finite(controls.brake,0,1),steer=finite(controls.steer,-1,1);
  car.inv=Math.max(0,car.inv-dt);
  const nCost=isP?pTurbo.nitroCost:NITRO_COST,nDur=isP?pTurbo.duration:NITRO_BOOST;
  if(controls.nitro&&car.nitro>=nCost&&car.boost<=0){car.nitro-=nCost;car.boost=nDur;s.events.push({type:'nitro',car:car.id,tier:isP?pTurbo.tier:1});}
  const boosting=car.boost>0;car.boost=Math.max(0,car.boost-dt);car.slick=Math.max(0,car.slick-dt);
  const baseTop=(['sand','storm'].includes(race.mode)?440:470)+(isP?pTurbo.topBonus:0);
  const top=baseTop+(boosting?130+(isP?(pTurbo.tier-1)*10:0):0);
  const accel=225+(isP?pTurbo.accelBonus:0);
  car.speed=raceClamp(car.speed+(throttle*accel+(boosting?320+(isP?(pTurbo.tier-1)*25:0):0)-brake*550-22-car.speed*.06)*dt,0,top);
  car.vx+=(steer*(90+car.speed*.3)-car.vx)*Math.min(1,dt*(car.slick>0?2:8.5*(isP?Math.min(1.25,1+(pTurbo.tier-1)*.06):1)));
  if(car.slick>0)car.speed*=1-dt*.55;
  const curve=raceCurveAt(race,car.distance),grip=isP?pTurbo.curveGrip:1.08;
  const drift=-curve*Math.pow(car.speed/470,1.8)*165/grip;
  const wind=['sand','storm'].includes(race.mode)?Math.sin(s.time*.8+car.distance/2200)*(race.wind||22):0;
  car.x=raceClamp(car.x+(car.vx+wind+drift)*dt,110,610);
  if(Math.abs(curve)>.25&&!boosting)car.speed*=1-dt*Math.abs(curve)*(.07/grip);
  if(car.x<145||car.x>575)car.speed*=1-dt*1.05;
  const before=car.distance;car.distance+=car.speed*dt;
  for(let i=0;i<race.gates.length;i++){
   const at=race.gates[i];if(before<=at-45&&car.distance>=at-45&&!raceGateOpen(s.time,i)){car.distance=at-45;car.speed=0;}
  }
  function impact(){if(car.inv>0)return;car.integrity-=35;car.inv=.8;car.speed*=.5;car.boost=0;s.events.push({type:'impact',car:car.id});}
  const gain=(n,type)=>{car.nitro=Math.min(100,car.nitro+n*(isP?pTurbo.nitroGainMult:car.id==='veyra'?(race.aggressive?1.15:1):race.aggressive?.7:.5));if(type)s.events.push({type,car:car.id});};
  if((car.x<115||car.x>605)&&car.speed>110)impact();
  for(const h of race.hazards){
   const dx=Math.abs(raceHazardX(h,s.time)-car.x);
   if(h.kind==='slick'){if(Math.abs(h.at-car.distance)<130&&dx<(h.w||75)){if(car.slick<=0)s.events.push({type:'slick',car:car.id});car.slick=.35;}continue;}
   if(!car.hits.includes(h.at)&&Math.abs(h.at-car.distance)<65&&(h.kind==='barrier'?RACE_LANES.some(x=>x!==h.gap&&Math.abs(x-car.x)<55):dx<55)){car.hits.push(h.at);impact();continue;}
   if(before<h.at&&car.distance>=h.at&&!car.hits.includes(h.at)&&(h.kind==='barrier'||dx<115))gain(h.kind==='barrier'?20:22,'nearMiss');
  }
  if(car.id==='player')for(const q of race.shards){if(!(before<q.at&&car.distance>=q.at))continue;
   if(Math.abs(q.x-car.x)<SHARD_HALF){car.shards.push(q.at);gain(SHARD_NITRO,'shard');
    const line=race.shards.filter(o=>o.line===q.line);if(line.at(-1)===q&&line.every(o=>car.shards.includes(o.at)))gain(SHARD_LINE_NITRO,'shardLine');}}
  for(const q of race.pads||[])if(before<q.at&&car.distance>=q.at&&Math.abs(q.x-car.x)<RACE_PAD_HALF){car.boost=Math.max(car.boost,PAD_BOOST+(isP?(pTurbo.tier-1)*.2:0));s.events.push({type:'pad',car:car.id});}
  const lead=s.cars.find(o=>o!==car&&!o.out&&o.distance-car.distance>40&&o.distance-car.distance<260&&Math.abs(o.x-car.x)<50);
  if(lead&&car.speed>260){gain(6*dt);if(!car.drafting)s.events.push({type:'draft',car:car.id});}car.drafting=!!lead&&car.speed>260;
  const cp=race.checkpoints[car.checkpoint];
  if(cp&&car.distance>=cp){
   const cpX=raceCheckpointX(race,car.checkpoint);
   if(Math.abs(car.x-cpX)<=(race.checkpointWidth||165)){car.checkpoint++;car.integrity=Math.min(100,car.integrity+CHECKPOINT_REPAIR);s.events.push({type:'checkpoint',car:car.id,index:car.checkpoint});if(Math.abs(car.x-cpX)<=Math.max(25,(race.checkpointWidth||165)*.3))gain(15,'perfectCheckpoint');}
   else{car.distance=cp-180;car.x=cpX;car.speed=0;car.penalty+=3;car.recoveries++;s.events.push({type:'missedCheckpoint',car:car.id});}
  }
  if(car.integrity<=0){car.distance=car.checkpoint?race.checkpoints[car.checkpoint-1]+40:0;car.x=360;car.speed=0;car.integrity=100;car.penalty+=5;car.recoveries++;car.inv=2;s.events.push({type:'recovery',car:car.id});}
  if(car.distance>=race.length&&car.checkpoint===race.checkpoints.length){
   const fraction=car.distance>before?raceClamp((race.length-before)/(car.distance-before),0,1):1;
   car.finishTime=previousTime+dt*fraction+car.penalty;car.distance=race.length;car.speed=0;s.events.push({type:'finish',car:car.id});
  }
 }
 if(race.elimination)for(let k=0;k<race.checkpoints.length&&s.eliminated.length<s.cars.length-2;k++){
  if(s.eliminated.includes(k))continue;const alive=s.cars.filter(c=>!c.out),behind=alive.filter(c=>c.checkpoint<=k);
  if(behind.length!==1||alive.length<3)break;const loser=behind[0];loser.out=true;loser.speed=0;s.eliminated.push(k);s.events.push({type:'eliminated',car:loser.id,index:k});
  if(loser.id==='player'){s.status='eliminated';s.events.push({type:'raceFinished'});return;}
 }
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
const MEDAL_VALUE={bronze:5,silver:10,gold:20},modeCoins=(id,e)=>{const v=RACES_V9[id].variant;return v==='tt'?MEDAL_VALUE[e.medal]||0:5+(e.won?(v==='rev'?15:10):0);};
// Challenge modes unlock per course once its series race is completed.
export function availableRaceModesV9(record,courses=RACE_SERIES_V9){return courses.filter(id=>record.events[id]?.completed).flatMap(raceModesFor);}
function recordModeV9(record,s,result){
 const race=RACES_V9[s.id],old=record.modes?.[s.id],medal=raceMedal(race,result.time),order=[null,'bronze','silver','gold'];
 const best=order[Math.max(order.indexOf(old?.medal??null),order.indexOf(medal))];
 const entry={completed:true,won:!!old?.won||result.rank===1,bestTime:Math.min(old?.bestTime??Infinity,result.time),bestRank:Math.min(old?.bestRank??4,result.rank),medal:race.variant==='tt'?best:null};
 const reward=modeCoins(s.id,entry)-(old?modeCoins(s.id,old):0);
 return {record:{...record,coins:record.coins+reward,modes:{...(record.modes||{}),[s.id]:entry}},reward,medal};
}
export function recordRaceV9(record,s){
 const result=raceResultV9(s);if(!result)return {record,reward:0};
 if(RACES_V9[s.id].variant)return recordModeV9(record,s,result);
 const old=record.events[s.id],first=!old,firstWin=result.rank===1&&!old?.won;
 const reward=(first?15:0)+(firstWin?10:0);
 return {record:{...record,version:1,coins:record.coins+reward,events:{...record.events,[s.id]:{completed:true,won:!!old?.won||result.rank===1,bestTime:Math.min(old?.bestTime??Infinity,result.time),bestRank:Math.min(old?.bestRank??4,result.rank)}}},reward};
}
export function loadRaceRecordV9(raw){try{
 const r=JSON.parse(raw);if(r.version!==1||!r.events||Array.isArray(r.events)||!Number.isInteger(r.coins)||r.coins<0)return null;
 let total=0;for(const [id,e] of Object.entries(r.events)){
  if(!RACE_SERIES_V9.includes(id)||e.completed!==true||typeof e.won!=='boolean'||!Number.isFinite(e.bestTime)||e.bestTime<=0||!Number.isInteger(e.bestRank)||e.bestRank<1||e.bestRank>(RACES_V9[id].duel?2:4)||e.won!==(e.bestRank===1))return null;
  total+=15+(e.won?10:0);
 }
 if(r.modes!==undefined){if(!r.modes||typeof r.modes!=='object'||Array.isArray(r.modes))return null;
  for(const [id,e] of Object.entries(r.modes)){const race=RACES_V9[id];
   if(!race?.variant||!r.events[race.base]?.completed||e?.completed!==true||typeof e.won!=='boolean'||!Number.isFinite(e.bestTime)||e.bestTime<=0||!Number.isInteger(e.bestRank)||e.bestRank<1||e.bestRank>(race.solo?1:race.duel?2:4)||e.won!==(e.bestRank===1))return null;
   if(race.variant==='tt'?![null,'bronze','silver','gold'].includes(e.medal)||e.medal!==raceMedal(race,e.bestTime):e.medal!==null)return null;
   total+=modeCoins(id,e);}}
 if(total!==r.coins)return null;return r;
}catch{return null;}}
