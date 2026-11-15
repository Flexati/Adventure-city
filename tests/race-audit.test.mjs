// D49: the races are checked by simulation, like the combat (D48). tools/audit_races.mjs drives every race with the game's own pilot.
import test from 'node:test';import assert from 'node:assert/strict';
import {RACES_V9} from '../game/racing-v9.mjs';
import {playRace,raceLayoutIssues} from '../tools/audit_races.mjs';
const ids=Object.keys(RACES_V9);
test('D49: every race has a fair layout',()=>{for(const id of ids)assert.deepEqual(raceLayoutIssues(RACES_V9[id]),[],id);});
test('D49: an expert finishes every race without missing a checkpoint and takes gold in every time trial',()=>{
 for(const id of ids){const r=playRace(id,'esperto');assert.equal(r.status,'finished',id);assert.equal(r.missed,0,id);assert.equal(r.recoveries,0,id);assert.ok(r.rank<=3,id+' rank '+r.rank);if(RACES_V9[id].solo)assert.equal(r.medal,'gold',id);}});
test('D49: an average and a weak driver always reach the line unless eliminated, well inside the time limit',()=>{
 for(const id of ids)for(const skill of ['medio','debole']){const r=playRace(id,skill);assert.ok(r.status==='finished'||RACES_V9[id].elimination&&r.status==='eliminated',id+' '+skill+' '+r.status);if(r.time)assert.ok(r.time<r.limit-10,id+' '+skill);if(RACES_V9[id].solo&&skill==='medio')assert.ok(r.medal,id);}});
test('D49: rivals never miss a checkpoint and races stay close for an average driver',()=>{
 for(const id of ids){const r=playRace(id,'medio');assert.equal(r.rivalMissed,0,id);if(r.gap!==null)assert.ok(r.gap<6,id+' gap '+r.gap);}});
// D50: «migliorale e equilibrale arricchisci niente punti morti».
import {newRaceV9,tickRaceV9,raceMedal,SHARD_NITRO,CHECKPOINT_REPAIR} from '../game/racing-v9.mjs';
test('D50: the three medals mark three kinds of run, and a weak driver never needs a recovery',()=>{
 const got={esperto:new Set,medio:new Set,debole:new Set};
 for(const id of ids){const d=RACES_V9[id];if(d.solo){const [g,s,b]=d.medals;assert.equal(+(s-g).toFixed(1),1.2,id);assert.equal(+(b-g).toFixed(1),3.5,id);}
  for(const skill of Object.keys(got)){const r=playRace(id,skill);if(d.solo)got[skill].add(r.medal);if(skill==='debole'){assert.equal(r.recoveries,0,id);if(r.gap!==null)assert.ok(r.gap<8,id+' gap '+r.gap);}}}
 assert.deepEqual([...got.esperto],['gold']);assert.ok(!got.medio.has(null)&&!got.medio.has('bronze'),[...got.medio]+'');assert.ok(got.debole.has('bronze'),[...got.debole]+'');
});
test('D50: no dead stretch, shards charge the nitro, checkpoints repair, low-visibility rematches add no obstacle',()=>{
 for(const id of ids){const d=RACES_V9[id],marks=[500,...d.checkpoints,...d.gates,...d.hazards.map(h=>h.at),...(d.pads||[]).map(q=>q.at),...d.shards.map(q=>q.at),d.length-300].sort((a,b)=>a-b);
  for(let i=1;i<marks.length;i++)assert.ok(marks[i]-marks[i-1]<1100,id+' empty from '+marks[i-1]+' to '+marks[i]);
  for(const q of d.shards){assert.ok(q.x>=176&&q.x<=544,id);for(const h of d.hazards)assert.ok(Math.abs(h.at-q.at)>=380,id+' shard next to an obstacle');}}
 assert.equal(RACES_V9['rev:ash_night'].hazards.length,RACES_V9.ash_night.hazards.length);assert.equal(RACES_V9['rev:solkara_storm'].hazards.length,RACES_V9.solkara_storm.hazards.length);assert.ok(RACES_V9['rev:ash_docks'].hazards.length>RACES_V9.ash_docks.hazards.length);
 const s=newRaceV9('ash_docks');s.status='racing';s.countdown=0;const p=s.cars[0],q=RACES_V9.ash_docks.shards[0];p.distance=q.at-5;p.x=q.x;p.speed=400;tickRaceV9(s,{throttle:1},1/30);
 assert.deepEqual(p.shards,[q.at]);assert.equal(p.nitro,SHARD_NITRO);assert.ok(s.events.some(e=>e.type==='shard'));
 const cp=RACES_V9.ash_docks.checkpoints[0];p.distance=cp-5;p.x=360;p.integrity=30;tickRaceV9(s,{throttle:1},1/30);assert.equal(p.integrity,30+CHECKPOINT_REPAIR);
});
