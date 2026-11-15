import test from 'node:test';import assert from 'node:assert/strict';
import {newProgress,buildMission,saveProgress,loadProgress,stepIndex} from '../game/missions.mjs';
import {deliverFieldKitV9} from '../game/weapons-v9.mjs';import {newRun,tick,startAttack} from '../game/campaign.mjs';
const ready=choice=>{const p=newProgress();p.step=stepIndex('blackout');p.status='cleared';p.cityChoice=choice;p.narrative.flags['encounter.rook.completed']=true;return p;};
test('Tessa requires the actual Rook victory and a city decision; either choice gives the same kit once',()=>{
 const blocked=newProgress();assert.equal(deliverFieldKitV9(blocked),false);
 for(const choice of ['workshop','shelter']){const p=ready(choice);assert.equal(deliverFieldKitV9(p),true);assert.equal(p.narrative.flags['weapon.tessa'],true);assert.equal(p.narrative.flags['weapon.quickdraw'],true);const saved=saveProgress(p);assert.equal(deliverFieldKitV9(p),false);assert.equal(saveProgress(p),saved);assert.equal(loadProgress(saved).cityChoice,choice);}
});
test('failed field-kit persistence rolls back only the attempted reward and keeps existing choices/inventory',()=>{
 const p=ready('shelter');p.world.inventory.medkit=2;p.narrative.flags.elsewhere='keep';const before=saveProgress(p);assert.equal(deliverFieldKitV9(p,()=>false),false);assert.equal(saveProgress(p),before);assert.equal(deliverFieldKitV9(p,()=>{throw Error('quota');}),false);assert.equal(saveProgress(p),before);
});
test('story kit reaches real missions with protagonist weapons; older saves stay on old rules until delivery',()=>{
 assert.equal(buildMission('breach',{}).combatV9,undefined);const p=ready('workshop');deliverFieldKitV9(p);const f=p.narrative.flags;
 for(const [id,hero,weapon]of [['breach','lulu','r12'],['below','nox','vx9']]){const c=buildMission(id,f);const s=newRun(hero,c.map,'power',null,null,c);assert.deepEqual(Object.keys(s.arsenal.ammo),['c9',weapon]);assert.equal(s.arsenal.active,'c9');assert.equal(s.c.quickdraw,true);f['weapon.active.'+hero]=weapon;const t=newRun(hero,c.map,'power',null,null,buildMission(id,f));assert.equal(t.arsenal.active,weapon);assert.equal(t.arsenal.ammo[weapon],hero==='lulu'?6:24);}
});
test('Quickdraw modifies one C-9 shot after a dash, with a bounded window and no extra damage',()=>{
 const p=ready('workshop');deliverFieldKitV9(p);const c=buildMission('below',p.narrative.flags);const s=newRun('nox',0,'power',null,null,c);s.enemies=[];tick(s,{dash:true},.01);assert.ok(s.quickdrawWindow>0);assert.ok(startAttack(s,'gun'));assert.equal(s.action.weapon.damage,1);assert.equal(s.arsenal.cooldown,.26);assert.equal(s.quickdrawWindow,0);assert.ok(s.events.some(e=>e.type==='quickdrawShot'));
 for(let i=0;i<40;i++)tick(s,{},.05);s.status='playing';assert.ok(startAttack(s,'gun'));assert.equal(s.arsenal.cooldown,.4);
});
test('string-shaped forged reward flags cannot unlock the campaign arsenal or the kit',()=>{
 const p=newProgress();p.cityChoice='workshop';p.narrative.flags['encounter.rook.completed']='true';assert.equal(deliverFieldKitV9(p),false);assert.equal(buildMission('breach',{'weapon.tessa':'true'}).combatV9,undefined);
});
test('Black Pulse actually accelerates campaign weapon fire while keeping the attack animation and magazine real',()=>{
 const rounds=[];for(const boost of [false,true]){const p=ready('workshop');deliverFieldKitV9(p);const c=buildMission('below',p.narrative.flags),s=newRun('nox',0,'power',null,null,c);s.enemies=[];if(boost){s.duo=100;tick(s,{duo:true},.01);assert.ok(s.overdrive>0);}for(let i=0;i<11;i++)tick(s,{gun:true},.03);rounds.push(12-s.arsenal.ammo.c9);}
 assert.deepEqual(rounds,[1,2],'same input interval yields one ordinary shot or two Black Pulse shots');
});
