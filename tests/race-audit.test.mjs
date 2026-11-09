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
