import test from 'node:test';import assert from 'node:assert/strict';
import {newProgress,saveProgress,loadProgress,stepIndex,prepareRookRecovery,finishRookRecovery,finishCatchup} from '../game/missions.mjs';import {deliverFieldKitV9} from '../game/weapons-v9.mjs';
const old=(id='archive',chalk=true)=>{const p=newProgress();p.step=stepIndex(id);p.cityChoice='shelter';p.upgrade='shield';p.world.coins=123;p.world.inventory.medkit=2;p.world.rewards=['blackout'];p.narrative.choices.hand='no';if(chalk)p.narrative.flags['exp.chalk.completed']=true;if(id==='archive')p.checkpoint='boss';return loadProgress(saveProgress(p));};
const win=p=>{p.narrative.flags['encounter.rook.completed']=true;p.status='cleared';deliverFieldKitV9(p);};
test('Rook recovery retains an advanced v7 boss location, choices, upgrades, money and inventory',()=>{
 let p=old();const world=structuredClone(p.world),choices=structuredClone(p.narrative.choices);assert.equal(prepareRookRecovery(p),true);assert.equal(p.step,stepIndex('blackout'));assert.equal(p.checkpoint,'boss');assert.equal(p.rookCatchup.stepId,'archive');p=loadProgress(saveProgress(p));assert.ok(p);assert.equal(finishRookRecovery(p),false);win(p);assert.equal(finishRookRecovery(p),true);assert.equal(p.step,stepIndex('archive'));assert.equal(p.checkpoint,'boss');assert.equal(p.upgrade,'shield');assert.deepEqual(p.world,world);assert.deepEqual(p.narrative.choices,choices);assert.equal(prepareRookRecovery(p),false);
});
test('Rook recovery restores a hub by stable ID and exact saved coordinates',()=>{
 let p=old('toxic');p.world.hub={id:'toxic',reason:'campaign',pov:'nox',returnStep:p.step,x:800,y:864};const hub=structuredClone(p.world.hub);prepareRookRecovery(p);assert.equal(p.world.hub,null);assert.equal(p.rookCatchup.hub.returnStepId,'toxic');p=loadProgress(saveProgress(p));win(p);assert.equal(finishRookRecovery(p),true);assert.deepEqual(p.world.hub,hub);
});
test('an interrupted Chalk recovery resumes its chosen route and original bookmark after Rook',()=>{
 let p=old('archive',false);assert.equal(p.step,stepIndex('exp_chalk_marks'));p.narrative.flags['exp.chalk.route']='service';p.narrative.choices.chalk_route='service';const bookmark=structuredClone(p.catchup);prepareRookRecovery(p);p=loadProgress(saveProgress(p));assert.ok(p);win(p);assert.equal(finishRookRecovery(p),true);assert.equal(p.step,stepIndex('exp_chalk_marks'));assert.deepEqual(p.catchup,bookmark);assert.equal(p.narrative.choices.chalk_route,'service');p.status='cleared';p.narrative.flags['exp.chalk.completed']=true;assert.equal(finishCatchup(p),true);assert.equal(p.step,stepIndex('archive'));assert.equal(p.checkpoint,'boss');assert.equal(p.world.coins,123);
});
test('a proven Rook victory with missing Tessa handoff resumes at delivery without replaying the fight',()=>{
 const p=old();p.narrative.flags['encounter.rook.completed']=true;assert.equal(prepareRookRecovery(p),true);assert.equal(p.status,'cleared');assert.equal(p.checkpoint,null);assert.equal(loadProgress(saveProgress(p)).status,'cleared');assert.equal(finishRookRecovery(p),false);deliverFieldKitV9(p);assert.equal(finishRookRecovery(p),true);
});
test('forged Rook recovery destinations are rejected while ordinary v7 remains loadable',()=>{
 const p=old();prepareRookRecovery(p);const raw=JSON.parse(saveProgress(p));for(const patch of [{stepId:'missing'},{stepId:'home'},{upgrade:'free'},{hub:{id:'toxic',returnStepId:'line'}},{catchup:{stepId:'missing',status:'playing'}}]){assert.equal(loadProgress(JSON.stringify({...raw,rookCatchup:{...raw.rookCatchup,...patch}})),null);}
 const original=old();assert.ok(loadProgress(saveProgress(original)));
});
