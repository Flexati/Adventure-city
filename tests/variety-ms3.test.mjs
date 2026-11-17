// MS-3 (D78: «rottura della monotonia del gioco»). Measured before: 20 of 31 playable steps were the same loop «activate 3
// devices, one wave each», 9 foot missions shared one identical skeleton, 9 device missions came in a row, and the mid-mission
// call for help always arrived at the second device. Data-only changes, no timing or hitbox touched (rule 4).
import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPAIGN,buildMission} from '../game/missions.mjs';
import {getLayout} from '../game/layouts.mjs';
const flags={blackout_choice:'workshop'};
const foot=CAMPAIGN.filter(s=>s.type==='foot').map(s=>({id:s.id,c:buildMission(s.id,flags,'workshop',null)})).filter(x=>x.c);
const kind=c=>c.mode==='defend'?'defend':c.mode==='chalk'?'hybrid':c.mode==='stealth'?'stealth':c.boss?(c.nodes.length?'devices+boss':'duel'):'devices';
const skeleton=c=>[kind(c),c.nodes.length,c.channel||0,c.hold||0,c.waves.length,c.midEvent?.atNode??'-'].join('|');

test('no skeleton is shared by more than five foot missions (it was nine)',()=>{
 const count={};for(const {c} of foot){const k=skeleton(c);count[k]=(count[k]||0)+1;}
 assert.ok(Math.max(...Object.values(count))<=5,JSON.stringify(count));
 assert.ok(Object.keys(count).length>=14,'distinct skeletons: '+Object.keys(count).length);
});

test('hybrid missions «open, then hold»: the Last Ward (MS-3) and the chalk route; «Ritorno al cantiere» is stealth since R39 (Cursor, co-signed by the author)',()=>{
 const hybrid=foot.filter(({c})=>c.mode==='chalk').map(x=>x.id);
 assert.deepEqual(hybrid.sort(),['contagion','exp_chalk_marks']);
 assert.equal(foot.find(x=>x.id==='app_yard').c.mode,'stealth');
 for(const id of ['contagion']){const c=foot.find(x=>x.id===id).c,l=getLayout(c.layout);
  assert.equal(c.nodes.length,2,id);assert.ok(c.hold>0&&c.waveEvery>0,id);assert.ok(c.site&&c.holdGoal&&c.goal.includes('poi'),id);
  const cell=Math.floor(c.zone.y/64)*24+Math.floor(c.zone.x/64);assert.ok(l.cells[cell],id+' zone centre is on the floor');
  for(const n of c.nodes)assert.ok(Math.hypot(n.x-c.zone.x,n.y-c.zone.y)>c.zone.r,id+' devices are outside the zone');}
});

test('the longest run of device missions is six (it was nine) and the help call does not always come at the second device',()=>{
 let run=0,best=0;for(const {c} of foot){const k=kind(c);run=k==='devices'||k==='devices+boss'?run+1:0;best=Math.max(best,run);}
 assert.ok(best<=6,'run of device missions: '+best);
 const at={};for(const {c} of foot)if(c.midEvent)at[c.midEvent.atNode]=(at[c.midEvent.atNode]||0)+1;
 assert.ok((at[1]||0)>=4,JSON.stringify(at));
});
