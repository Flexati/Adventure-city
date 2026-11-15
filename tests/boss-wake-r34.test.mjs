// R34: a boss with no devices to switch on (Vega) starts awake, so wakeBoss never ran for it: its entrance barks
// (bossWake, bossWakeb) and the boss-appearance sound never played. The wake is now announced on the first tick.
import test from 'node:test';
import assert from 'node:assert/strict';
import {newRun,tick} from '../game/campaign.mjs';
import {buildMission,FOOT} from '../game/missions.mjs';
import {BARKS} from '../game/story-v08.mjs';
const run=id=>{const c=buildMission(id,{}),s=newRun(c.pov,c.map,'power',null,null,c);return {c,s};};
test('Vega announces her wake once, on the first tick, at the boss position',()=>{
 const {s}=run('vega');const b=s.enemies.find(e=>e.boss);assert.equal(s.nodes.length,0);assert.equal(b.state,'walk');
 tick(s,{},1/60);const w=s.events.filter(e=>e.type==='bossWake');assert.equal(w.length,1);assert.equal(w[0].kind,'vega');assert.equal(Math.round(w[0].x),Math.round(b.x));
 tick(s,{},1/60);assert.equal(s.events.filter(e=>e.type==='bossWake').length,0,'only once');
});
test('a boss with devices still wakes when the last device is on, not before',()=>{
 const {s}=run('forge_behemoth');tick(s,{},1/60);assert.equal(s.events.filter(e=>e.type==='bossWake').length,0);
 assert.equal(s.enemies.find(e=>e.boss).state,'dormant');
});
test('every boss mission that has entrance barks can wake its boss',()=>{
 for(const [id,def] of Object.entries(FOOT)){if(!BARKS[id]?.bossWake)continue;const {c,s}=run(id);assert.ok(c.boss,id+' has a boss');
  assert.ok(s.nodes.length>0||s.bossWakeDue===true,id+': devices to switch on, or a wake announced at the start');}
});
test('R35: the entrance of a device-less boss is marked as such, so the runtime does not save a boss checkpoint for it',()=>{
 const {s}=run('vega');tick(s,{},1/60);const w=s.events.find(e=>e.type==='bossWake');assert.equal(w.entrance,true);
 // a boss woken by its devices carries no such mark: that one is a real checkpoint
 const {s:f}=run('forge_behemoth');for(const n of f.nodes)n.on=true;f.nodes.forEach(n=>n.on=true);
 const woke=[];for(let i=0;i<5;i++){tick(f,{},1/60);woke.push(...f.events.filter(e=>e.type==='bossWake'));}
 for(const e of woke)assert.ok(!e.entrance,'wake by devices is not an entrance');
});
