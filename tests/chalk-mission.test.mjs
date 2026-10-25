import test from 'node:test';
import assert from 'node:assert/strict';
import {CAMPAIGN,buildMission,newProgress,saveProgress,loadProgress,finishCatchup,stepIndex} from '../game/missions.mjs';
import {newRun,tick} from '../game/campaign.mjs';
import {rewardMission} from '../game/hubs.mjs';
import {STORY,CHOICES,resolveLines} from '../game/story-v08.mjs';
import {autoplay} from './helpers/autoplay.mjs';
import {getLayout,layoutWalkable} from '../game/layouts.mjs';

test('chalk mission is causally between separation and Nox finding the physical trace',()=>{
 const ids=CAMPAIGN.map(step=>step.id);
 assert.equal(ids[ids.indexOf('separation')+1],'exp_chalk_marks');
 assert.equal(ids[ids.indexOf('exp_chalk_marks')+1],'below');
 assert.equal(resolveLines(STORY.below_pre,{}).some(line=>line.text.includes('gesso')),false);
 const trace=resolveLines(STORY.below_pre,{'exp.chalk.completed':true});
 assert.ok(trace.some(line=>line.text.includes('gesso')));
 assert.ok(trace.some(line=>line.speaker==='NOX'&&line.text.includes('Qualcuno')));
 const service=resolveLines(STORY.below_pre,{'exp.chalk.completed':true,'exp.chalk.route':'service'});
 assert.ok(service.some(line=>line.text.includes('rotta di servizio')));
 assert.equal(resolveLines(STORY.below_pre,{'exp.chalk.completed':true,'exp.chalk.callback_seen':true}).some(line=>line.text.includes('gesso')),false);
 const archive=resolveLines(STORY.archive_pre,{'exp.chalk.completed':true,'exp.chalk.route':'service'});
 assert.ok(archive.some(line=>line.speaker==='NOX'&&line.text.includes('Qualcuno')));
 assert.equal(archive.some(line=>line.speaker==='NOX'&&line.text.includes('Lulù')),false,'Nox has no evidence that Lulù made the marks');
});

test('both chalk routes are reachable, distinct, and finish through ordinary play',()=>{
 for(const [route,option] of Object.entries(CHOICES.chalk_route.options)){
  const flags={...option.writes};
  const c=buildMission('exp_chalk_marks',flags);
  assert.ok(layoutWalkable(getLayout(c.layout),c.zone.x,c.zone.y,40),route);
  const run=newRun('lulu',0,'power',null,{flags},c);
  for(const enemy of run.enemies)enemy.hp=0;
  run.x=c.zone.x;run.y=c.zone.y;tick(run,{},.05);
  assert.equal(run.progress,0,'a route cannot be held before both access points work');
  const result=autoplay(newRun('lulu',0,'power',null,{flags},c),{reaction:.3,dodgeRate:.55,seed:7});
  assert.equal(result.status,'cleared',route);
  const p=newProgress();p.step=CAMPAIGN.findIndex(step=>step.id==='below');p.narrative.flags['exp.chalk.route']=route;p.narrative.flags['exp.chalk.completed']=true;
  const restored=loadProgress(saveProgress(p));
  assert.equal(restored.narrative.flags['exp.chalk.route'],route);
  assert.equal(restored.narrative.flags['exp.chalk.completed'],true);
  assert.equal(restored.step,p.step);
 }
 assert.notDeepEqual(buildMission('exp_chalk_marks',{'exp.chalk.route':'direct'}).zone,buildMission('exp_chalk_marks',{'exp.chalk.route':'service'}).zone);
});

test('a v7 boss save catches up without losing checkpoint, choices, currency or rewards',()=>{
 const old=newProgress();old.step=stepIndex('archive');old.checkpoint='boss';old.cityChoice='shelter';old.world.coins=87;old.narrative.flags.separated=true;
 const payload=JSON.parse(saveProgress(old));delete payload.catchup;
 const migrated=loadProgress(JSON.stringify(payload));
 assert.equal(migrated.step,stepIndex('exp_chalk_marks'));
 assert.deepEqual(migrated.catchup,{stepId:'archive',status:'playing',checkpoint:'boss',hub:null});
 assert.equal(migrated.cityChoice,'shelter');assert.equal(migrated.world.coins,87);
 const resumed=loadProgress(saveProgress(migrated));assert.deepEqual(resumed.catchup,migrated.catchup);
 resumed.narrative.flags['exp.chalk.route']='service';resumed.narrative.flags['exp.chalk.completed']=true;resumed.status='cleared';
 assert.equal(rewardMission(resumed,'exp_chalk_marks'),true);assert.equal(rewardMission(resumed,'exp_chalk_marks'),false);
 assert.equal(finishCatchup(resumed),true);assert.equal(finishCatchup(resumed),false);
 assert.equal(resumed.step,stepIndex('archive'));assert.equal(resumed.checkpoint,'boss');assert.equal(resumed.world.coins,107);
 const final=loadProgress(saveProgress(resumed));assert.equal(final.step,stepIndex('archive'));assert.equal(final.checkpoint,'boss');assert.equal(final.catchup,null);
});

test('a v7 hub return index is repaired through its stable step ID and restored after catch-up',()=>{
 const old=newProgress();old.step=stepIndex('toxic');old.narrative.flags.separated=true;old.world.visited.push('toxic');
 old.world.hub={id:'toxic',reason:'campaign',pov:'nox',returnStep:old.step-1,x:800,y:864};
 const payload=JSON.parse(saveProgress(old));delete payload.catchup;
 const migrated=loadProgress(JSON.stringify(payload));assert.equal(migrated.step,stepIndex('exp_chalk_marks'));
 assert.equal(migrated.world.hub,null);assert.equal(migrated.catchup.hub.returnStepId,'toxic');
 assert.equal(migrated.catchup.hub.x,800);assert.equal(migrated.catchup.hub.y,864);
 const resumed=loadProgress(saveProgress(migrated));resumed.narrative.flags['exp.chalk.completed']=true;resumed.status='cleared';
 assert.equal(finishCatchup(resumed),true);assert.equal(resumed.step,stepIndex('toxic'));
 assert.deepEqual(resumed.world.hub,{id:'toxic',reason:'campaign',pov:'nox',returnStep:stepIndex('toxic'),x:800,y:864});
 assert.deepEqual(loadProgress(saveProgress(resumed)).world.hub,resumed.world.hub);
});

test('catch-up cannot restore before victory or through an invalid return ID',()=>{
 const p=newProgress();p.step=stepIndex('line');const raw=JSON.parse(saveProgress(p));delete raw.catchup;
 const migrated=loadProgress(JSON.stringify(raw));assert.equal(finishCatchup(migrated),false);
 for(const change of [{stepId:'missing'},{stepId:'blackout'},{hub:{id:'toxic',returnStepId:'archive'}}]){
  const payload=JSON.parse(saveProgress(migrated));payload.catchup={...payload.catchup,...change};assert.equal(loadProgress(JSON.stringify(payload)),null);
 }
});
