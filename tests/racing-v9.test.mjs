import test from 'node:test';import assert from 'node:assert/strict';
import {RACES_V9,RACE_SERIES_V9,availableRacesV9,newRaceV9,tickRaceV9,racePilot,raceResultV9,raceStandings,recordRaceV9,newRaceRecordV9,loadRaceRecordV9,raceGateOpen} from '../game/racing-v9.mjs';
import {veyraLineV9,veyraRivalryV9} from '../game/veyra-v9.mjs';
function finish(id,skill=1){const s=newRaceV9(id);s.cars[0].skill=skill;for(let i=0;i<15000&&!['finished','retired'].includes(s.status);i++)tickRaceV9(s,racePilot(s,s.cars[0]),.025);return s;}
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
