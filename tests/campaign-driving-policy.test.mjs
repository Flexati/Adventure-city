import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import drivingKeys from '../tools/campaign-driving-policy.cjs';
import originalKeys from './fixtures/campaign-driving-policy-v8.cjs';
import {newDrive,driveTick} from '../game/driving.mjs';
const input=keys=>({steer:Number(keys.has('KeyD'))-Number(keys.has('KeyA')),throttle:Number(keys.has('KeyW')),brake:Number(keys.has('KeyS'))});
function run(d,cadence,until=()=>false,policy=drivingKeys){let next=d.time,keys;while(d.status==='playing'&&!until(d)){if(d.time>=next){keys=policy(d);next=d.time+cadence;}driveTick(d,input(keys),.016);}return d;}
for(const path of ['a','b'])test(`historical CI ${path}: rescue pickup survives delayed control updates`,()=>{
 const snapshot=JSON.parse(fs.readFileSync(new URL(`../docs/evidence/v9/historical-ci-${path}-failure.json`,import.meta.url))).snapshot.driving;
 for(const cadence of [.13,.25,.4,.65]){
  const d=run(structuredClone(snapshot),cadence,s=>s.stops[0].done);
  assert.equal(d.stops[0].done,true,`pickup at ${cadence}s cadence`);
  assert.ok(d.time-snapshot.time<3,'pickup must finish without another retry');
 }
});
for(const choice of ['workshop','shelter'])test(`evacuation ${choice}: both rescues and finish with irregular input cadence`,()=>{
 for(const cadence of [.13,.25,.4]){
  const d=run(newDrive(2,choice),cadence);assert.equal(d.status,'cleared',`${cadence}s: ${d.reason}`);
  assert.ok(d.stops.every(s=>s.done));assert.ok(d.hp>0);assert.ok(d.time<=125);
 }
});

test('baseline driver reproduces missed rescues when inputs arrive every 130–250 ms',()=>{
 for(const cadence of [.13,.25]){
  const old=run(newDrive(2,'workshop'),cadence,()=>false,originalKeys);
  assert.equal(old.status,'failed');assert.ok(old.stops.every(s=>!s.done));
  const fixed=run(newDrive(2,'workshop'),cadence);assert.equal(fixed.status,'cleared');
 }
});
