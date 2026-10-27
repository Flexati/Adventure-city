import test from 'node:test';import assert from 'node:assert/strict';
import {RACES_V9,RACE_SERIES_V9,availableRacesV9,newRaceV9,tickRaceV9,racePilot,raceResultV9,raceStandings,recordRaceV9,newRaceRecordV9,loadRaceRecordV9,raceGateOpen,raceRoadTile,raceRoadArt,RACE_ROAD_TILE,RACE_SCROLL,raceHazardX,RACE_LANES,RACE_MODES_V9,raceModesFor,raceMedal,availableRaceModesV9,NITRO_COST,NITRO_BOOST,PAD_BOOST,START_BOOST} from '../game/racing-v9.mjs';
import {veyraLineV9,veyraRivalryV9} from '../game/veyra-v9.mjs';
// A full-skill test driver also times the start (throttle in the last half second of the countdown).
function finish(id,skill=1){const s=newRaceV9(id);s.cars[0].skill=skill;for(let i=0;i<15000&&!['finished','retired'].includes(s.status);i++){const input=racePilot(s,s.cars[0]);if(s.status==='countdown')input.throttle=skill>=1&&s.countdown<.5?1:0;tickRaceV9(s,input,.025);}return s;}
test('all seven competitive races finish through ordinary steering, throttle and brake, with required checkpoints',()=>{
 assert.equal(RACE_SERIES_V9.length,7);
 for(const id of RACE_SERIES_V9){const s=finish(id);assert.equal(s.status,'finished',id);assert.equal(s.cars[0].checkpoint,RACES_V9[id].checkpoints.length);assert.ok(raceResultV9(s).rank<=s.cars.length);assert.ok(s.cars.some(c=>c.id==='veyra'&&c.distance>0));}
});

test('the seven-race rivalry advances on completion, resolves without requiring wins and preserves old results',()=>{
 let record=newRaceRecordV9();assert.deepEqual(availableRacesV9(record),['ash_docks']);
 for(const id of RACE_SERIES_V9){
  assert.ok(availableRacesV9(record).includes(id));
  const state=finish(id,.8);assert.equal(state.status,'finished');record=recordRaceV9(record,state).record;
  record=loadRaceRecordV9(JSON.stringify(record));assert.ok(record);
  for(const lang of ['it','en'])for(const phase of ['intro','win','lose'])assert.ok(veyraLineV9(id,phase,lang).length>30);
 }
 assert.equal(veyraRivalryV9(record).resolved,true);assert.equal(veyraRivalryV9(record).completed,7);
 const replay=recordRaceV9(record,finish('ash_docks',.8));assert.equal(replay.reward,0);assert.equal(veyraRivalryV9(replay.record).completed,7);
 assert.equal(newRaceV9('veyra_duel').cars.length,2);
 const old={version:1,coins:15,events:{solkara:{completed:true,won:false,bestTime:90,bestRank:3}}};
 assert.deepEqual(loadRaceRecordV9(JSON.stringify(old)),old);assert.deepEqual(availableRacesV9(old),['ash_docks','solkara']);
});
test('countdown, finished and retired states cannot advance the vehicle',()=>{
 const s=newRaceV9();tickRaceV9(s,{throttle:1},.05);assert.equal(s.cars[0].distance,0);assert.equal(s.time,0);
 for(const status of ['finished','retired']){s.status=status;const before=JSON.stringify(s.cars);tickRaceV9(s,{throttle:1},.05);assert.equal(JSON.stringify(s.cars),before);}
});
test('missing a checkpoint resets before that gate instead of skipping it',()=>{
 const s=newRaceV9();s.status='racing';const p=s.cars[0];p.distance=3199;p.speed=470;p.x=560;tickRaceV9(s,{throttle:1},.05);assert.equal(p.checkpoint,0);assert.equal(p.distance,3020);assert.equal(p.penalty,3);assert.equal(p.x,360);
});
test('closed temporal bridges block every car and reopen on the same clock',()=>{
 const s=newRaceV9('aurelia_span');s.status='racing';s.time=6;assert.equal(raceGateOpen(s.time,0),false);
 for(const c of s.cars){c.distance=4654;c.speed=470;c.checkpoint=1;}
 tickRaceV9(s,{throttle:1},.05);for(const c of s.cars){assert.ok(c.distance<=4655);assert.equal(c.speed,0);}
 s.time=9;for(let i=0;i<50;i++)tickRaceV9(s,{throttle:1},.05);assert.ok(s.cars.every(c=>c.distance>4700));
});
test('penalized finish waits for rival arrival and produces the correct winner',()=>{
 const s=newRaceV9();s.status='racing';s.time=40;for(const c of s.cars){c.checkpoint=3;c.distance=12999;c.speed=470;}
 s.cars[0].penalty=3;tickRaceV9(s,{throttle:1},.05);assert.equal(s.status,'racing');assert.equal(raceResultV9(s),null);
 for(let i=0;i<70;i++)tickRaceV9(s,{},.05);assert.equal(s.status,'finished');assert.equal(raceResultV9(s).rank,4);assert.notEqual(raceStandings(s)[0].id,'player');
});
test('completion grants progress without victory and replay cannot farm credits',()=>{
 const s=finish('ash_docks',.7);assert.equal(s.status,'finished');assert.ok(raceResultV9(s).rank>1);
 const first=recordRaceV9(newRaceRecordV9(),s);assert.equal(first.reward,15);assert.equal(first.record.events.ash_docks.completed,true);
 assert.equal(recordRaceV9(first.record,s).reward,0);assert.deepEqual(loadRaceRecordV9(JSON.stringify(first.record)),first.record);
 const winning=finish('ash_docks',1);assert.equal(raceResultV9(winning).rank,1);const improvement=recordRaceV9(first.record,winning);assert.equal(improvement.reward,10);assert.equal(recordRaceV9(improvement.record,winning).reward,0);
});
test('damage recovery preserves checked gates and allows continuing',()=>{
 const s=newRaceV9();s.status='racing';const p=s.cars[0];p.checkpoint=1;p.distance=4199;p.x=455;p.speed=470;p.integrity=20;tickRaceV9(s,{throttle:1},.05);
 assert.equal(p.integrity,100);assert.equal(p.checkpoint,1);assert.equal(p.distance,3240);assert.equal(p.penalty,5);assert.equal(s.status,'racing');
});
test('invalid saved records and non-finite controls cannot corrupt progression',()=>{
 for(const raw of ['{','null',JSON.stringify({version:1,coins:99,events:{}}),JSON.stringify({version:1,coins:15,events:{unknown:{completed:true,won:false,bestTime:40,bestRank:2}}})])assert.equal(loadRaceRecordV9(raw),null);
 const s=newRaceV9();s.status='racing';tickRaceV9(s,{throttle:Infinity,steer:NaN,brake:-Infinity},.05);assert.ok(s.cars.every(c=>Number.isFinite(c.x)&&Number.isFinite(c.distance)));
 assert.throws(()=>newRaceV9('unknown'));
});
test('the countdown calls 3, 2 and 1 once each and the start comes at zero',()=>{
 const s=newRaceV9('ash_docks'),calls=[];let start=null;
 for(let t=0;t<3.5;t+=1/60){tickRaceV9(s,{},1/60);for(const e of s.events){if(e.type==='count')calls.push([e.n,+t.toFixed(3)]);if(e.type==='start'&&start===null)start=t;}}
 assert.deepEqual(calls.map(c=>c[0]),[3,2,1]);assert.ok(calls[0][1]<.05,'3 sounds as the countdown begins');
 assert.ok(Math.abs(calls[1][1]-1)<.05&&Math.abs(calls[2][1]-2)<.05,'one call per second');assert.ok(Math.abs(start-3)<.05,'go at zero');
});

test('Ash Docks races draw a fixed sequence of road variants, other regions keep the old road',()=>{
 const tile=d=>Math.floor(d*RACE_SCROLL/RACE_ROAD_TILE),seq=(id,n=8)=>Array.from({length:n},(_,i)=>raceRoadTile(RACES_V9[id],i));
 assert.deepEqual([...new Set(seq('ash_docks'))].sort(),['race_ashdocks_banchina_day','race_ashdocks_deposito_day','race_ashdocks_gru_day']);
 assert.equal(raceRoadTile(RACES_V9.ash_docks,tile(RACES_V9.ash_docks.checkpoints.at(-1))),'race_ashdocks_gru_day');
 assert.equal(raceRoadTile(RACES_V9.ash_slalom,tile(1000)),'race_ashdocks_gru_day');
 assert.equal(raceRoadTile(RACES_V9.ash_slalom,tile(RACES_V9.ash_slalom.length)),'race_ashdocks_banchina_day');
 assert.ok(seq('ash_night').every(n=>n.endsWith('_night')));assert.equal(raceRoadTile(RACES_V9.ash_night,-1),'race_ashdocks_deposito_night');
 assert.deepEqual(seq('ash_docks',4),seq('ash_docks',4),'same course, same roads');
 for(const id of ['solkara','solkara_storm','aurelia_span','veyra_duel']){assert.equal(raceRoadTile(RACES_V9[id],0),null);assert.deepEqual(raceRoadArt(RACES_V9[id]),[]);}
 assert.equal(raceRoadArt(RACES_V9.ash_night).length,3);
});

const racing=(id='ash_docks')=>{const s=newRaceV9(id);s.status='racing';s.countdown=0;return s;};
test('perfect start: throttle in the last moment of the countdown boosts, too early only spins the wheels',()=>{
 const run=from=>{const s=newRaceV9('ash_docks');const ev=[];while(s.status==='countdown'){tickRaceV9(s,{throttle:s.countdown<=from?1:0},.025);ev.push(...s.events.map(e=>e.type+':'+e.car));}return {s,ev};};
 const good=run(.5);assert.ok(good.ev.includes('perfectStart:player'));assert.equal(good.s.cars[0].boost,START_BOOST);
 const early=run(3);assert.ok(early.ev.includes('wheelspin:player'));assert.equal(early.s.cars[0].boost,0);
 const none=run(-1);assert.ok(!none.ev.some(e=>e.endsWith(':player')));
});
test('nitro spends half a gauge for a timed boost and needs enough charge',()=>{
 const s=racing(),p=s.cars[0];p.speed=300;p.distance=100;p.nitro=NITRO_COST-1;tickRaceV9(s,{throttle:1,nitro:true},.02);assert.equal(p.boost,0);
 p.nitro=100;tickRaceV9(s,{throttle:1,nitro:true},.02);assert.ok(s.events.some(e=>e.type==='nitro'&&e.car==='player'));assert.equal(p.nitro,100-NITRO_COST);assert.ok(Math.abs(p.boost-(NITRO_BOOST-.02))<1e-9);
 for(let i=0;i<60;i++)tickRaceV9(s,{throttle:1},.02);assert.ok(p.speed>470,'boost lifts the top speed');
});
test('pads, near misses and barriers: boost, charge and an open lane to thread',()=>{
 let s=racing(),p=s.cars[0],pad=RACES_V9.ash_docks.pads[0];p.distance=pad.at-5;p.x=pad.x;p.speed=400;tickRaceV9(s,{throttle:1},.02);assert.ok(s.events.some(e=>e.type==='pad'&&e.car==='player'));assert.ok(p.boost>PAD_BOOST-.05);
 s=racing();p=s.cars[0];const h=RACES_V9.ash_docks.hazards[0];p.distance=h.at-80;p.x=h.x+90;p.speed=400;for(let i=0;i<20;i++)tickRaceV9(s,{throttle:1},.02);assert.equal(p.hits.length,0);assert.ok(p.nitro>=22);
 const bar=RACES_V9.ash_docks.hazards.find(z=>z.kind==='barrier');
 s=racing();p=s.cars[0];p.distance=bar.at-90;p.x=bar.gap;p.speed=400;for(let i=0;i<20;i++)tickRaceV9(s,{throttle:1},.02);assert.equal(p.hits.length,0,'the open lane is safe');
 s=racing();p=s.cars[0];p.distance=bar.at-90;p.x=bar.gap>360?200:520;p.speed=400;p.boost=1;for(let i=0;i<20;i++)tickRaceV9(s,{throttle:1},.02);assert.deepEqual(p.hits,[bar.at]);assert.equal(p.integrity,65);assert.equal(p.boost,0,'a hit cancels the boost');
});
test('slicks cost grip and speed but no integrity',()=>{
 const sl=RACES_V9.ash_night.hazards.find(z=>z.kind==='slick'),s=racing('ash_night'),p=s.cars[0];p.distance=sl.at-100;p.x=sl.x;p.speed=400;
 const ev=[];for(let i=0;i<10;i++){tickRaceV9(s,{throttle:1,steer:1},.02);ev.push(...s.events.map(e=>e.type));}
 assert.ok(ev.includes('slick'));assert.equal(p.integrity,100);assert.ok(p.speed<400);
});
test('every course is fair: unique obstacle marks, barrier gaps on lanes and away from checkpoints, pads clear of obstacles',()=>{
 for(const r of Object.values(RACES_V9)){
  const ats=r.hazards.map(h=>h.at);assert.equal(new Set(ats).size,ats.length,r.id);
  for(const h of r.hazards.filter(h=>h.kind==='barrier')){assert.ok(RACE_LANES.includes(h.gap),r.id);assert.ok(r.checkpoints.every(c=>Math.abs(c-h.at)>=700),r.id+' barrier near a checkpoint');assert.ok(r.gates.every(g=>Math.abs(g-h.at)>=500),r.id+' barrier near a gate');}
  for(const q of r.pads||[])assert.ok(r.hazards.every(h=>h.kind==='slick'||Math.abs(h.at-q.at)>=400),r.id+' pad on top of an obstacle');
  for(const h of r.hazards.filter(h=>h.kind==='swing'))for(let t=0;t<30;t+=.1){const x=raceHazardX(h,t);assert.ok(x>=200&&x<=520,r.id);}
 }
});

test('challenge modes: time trial alone with more pads, elimination, rematch backwards and harder',()=>{
 const ids=Object.keys(RACES_V9).filter(id=>id.includes(':'));assert.equal(ids.length,20);assert.ok(!ids.includes('elim:veyra_duel'));
 for(const id of ids){const s=finish(id);assert.ok(['finished','eliminated'].includes(s.status),id);}
 const tt=RACES_V9['tt:ash_docks'];assert.equal(newRaceV9(tt.id).cars.length,1);assert.ok(tt.pads.length>RACES_V9.ash_docks.pads.length);
 const [g,sv,b]=tt.medals;assert.ok(g<sv&&sv<b);assert.equal(raceMedal(tt,g),'gold');assert.equal(raceMedal(tt,b+.1),null);
 assert.equal(raceMedal(tt,raceResultV9(finish(tt.id)).time),'gold','a clean run with a perfect start earns gold');
 const rev=RACES_V9['rev:ash_docks'],base=RACES_V9.ash_docks;
 assert.deepEqual(rev.checkpoints,base.checkpoints.map(c=>base.length-c).reverse());assert.ok(rev.hazards.length>base.hazards.length);
 assert.ok(newRaceV9(rev.id).cars.find(c=>c.id==='veyra').skill>newRaceV9('ash_docks').cars.find(c=>c.id==='veyra').skill);
 assert.equal(raceRoadTile(rev,0),raceRoadTile(base,0),'same road art');
});
test('elimination: the last car still running drops out at the early checkpoints, then a duel',()=>{
 const s=newRaceV9('elim:ash_docks');s.status='racing';const out=[];
 for(let i=0;i<20000&&!['finished','eliminated'].includes(s.status);i++){tickRaceV9(s,racePilot(s,s.cars[0]),.025);out.push(...s.events.filter(e=>e.type==='eliminated'));}
 assert.equal(out.length,2);assert.deepEqual(out.map(e=>e.index),[0,1]);assert.equal(s.cars.filter(c=>!c.out).length,2);
 const lose=newRaceV9('elim:ash_docks');lose.status='racing';lose.cars[0].skill=0;
 for(let i=0;i<20000&&lose.status==='racing';i++)tickRaceV9(lose,{throttle:0},.025);assert.equal(lose.status,'eliminated');assert.equal(raceResultV9(lose),null);
});
test('challenge records: unlock per completed course, medals and wins pay once, saves validate',()=>{
 let rec=newRaceRecordV9();assert.deepEqual(availableRaceModesV9(rec),[]);
 rec=recordRaceV9(rec,finish('ash_docks')).record;assert.deepEqual(availableRaceModesV9(rec),raceModesFor('ash_docks'));
 const tt=recordRaceV9(rec,finish('tt:ash_docks'));assert.equal(tt.medal,'gold');assert.equal(tt.reward,20);assert.equal(recordRaceV9(tt.record,finish('tt:ash_docks')).reward,0);
 const rv=recordRaceV9(tt.record,finish('rev:ash_docks'));assert.ok([5,20].includes(rv.reward));
 assert.deepEqual(loadRaceRecordV9(JSON.stringify(rv.record)),rv.record);
 assert.equal(loadRaceRecordV9(JSON.stringify({...rv.record,coins:rv.record.coins+1})),null);
 assert.equal(loadRaceRecordV9(JSON.stringify({...rv.record,modes:{...rv.record.modes,'tt:ash_docks':{...rv.record.modes['tt:ash_docks'],medal:'silver'}}})),null,'medal must match the time');
 assert.equal(loadRaceRecordV9(JSON.stringify({...newRaceRecordV9(),coins:0,modes:{'tt:ash_slalom':{completed:true,won:true,bestTime:30,bestRank:1,medal:'bronze'}}})),null,'locked course');
 assert.equal(loadRaceRecordV9(JSON.stringify({...newRaceRecordV9(),events:{'tt:ash_docks':{completed:true,won:true,bestTime:30,bestRank:1}},coins:25})),null,'modes never sit in the series events');
});
