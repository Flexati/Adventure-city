import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {CAMPAIGN,newProgress,saveProgress,loadProgress} from '../game/missions.mjs';
import {CHOICES} from '../game/story-v08.mjs';
// M3 (D20, D22): the demo ends after «La firma» only with the purchase bridge; «Gioca l'altra rotta» keeps weapons and upgrades.
const runtime=fs.readFileSync('game/runtime.mjs','utf8'),html=fs.readFileSync('game/index.html','utf8');
const fn=name=>{const i=runtime.indexOf('function '+name+'(');assert.ok(i>=0,name);return runtime.slice(i,runtime.indexOf('\n',i));};
const constLine=name=>{const i=runtime.indexOf('const '+name+'=');assert.ok(i>=0,name);return runtime.slice(i,runtime.indexOf('\n',i));};
const load=(names,deps)=>new Function(...Object.keys(deps),constLine('CITY_LOG')+'\n'+names.map(fn).join('\n')+'\nreturn {'+names.join(',')+'};')(...Object.values(deps));

test('M3: the demo boundary is «La firma» (separation) and the gate guards both entering a step and Continue',()=>{
 const i=CAMPAIGN.findIndex(s=>s.id==='separation');assert.ok(i>0);assert.equal(CAMPAIGN[i].title,'La firma');
 assert.match(runtime,/const DEMO_END=CAMPAIGN\.findIndex\(s=>s\.id==='separation'\)/);
 assert.match(runtime,/async function enterStep\(i,resumeCleared=false\)\{\n[^\n]*\n if\(i>DEMO_END&&demoLocked\(\)\)\{showUnlock\(i\);return;\}/);
 assert.match(runtime,/async function continueGame\(\)\{[^\n]*if\(progress\.step>DEMO_END&&demoLocked\(\)\)\{showUnlock\(progress\.step\);return;\}/);
 // «La firma» itself is still played: only the steps after it are gated.
 assert.doesNotMatch(runtime,/i>=DEMO_END&&demoLocked/);
});

test('M3: without the Android purchase bridge the game stays whole; with it, only an unpaid copy is a demo',()=>{
 const run=bridge=>{const window={ChronosBilling:bridge};return new Function('window',"const billing=()=>window.ChronosBilling;"+fn('demoLocked')+';return demoLocked();')(window);};
 assert.equal(run(undefined),false,'web, debug APK and builds before M4: full game');
 assert.equal(run({isUnlocked:()=>false}),true);
 assert.equal(run({isUnlocked:()=>true}),false);
 assert.equal(run({isUnlocked:()=>{throw Error('bridge down');}}),false,'a broken bridge never locks a player out');
});

test('M3: one unlock screen with price, «Sblocca» and «Più tardi», and one discreet menu entry, hidden by default',()=>{
 for(const id of ['unlock','unlock-price','unlock-buy','unlock-later'])assert.match(html,new RegExp('id="'+id+'"'));
 assert.match(html,/<button id="menu-unlock" class="ghost" hidden>Sblocca la storia completa<\/button>/);
 assert.match(html,/<p id="unlock-price">5,99 €<\/p>/);
 assert.match(runtime,/panel\('menu-unlock',demoLocked\(\)\);/);
 assert.doesNotMatch(html+runtime,/setInterval\([^)]*unlock|unlock[^;]*setTimeout/,'no timers or repeated reminders');
});

test('M3: the choice log lists only the options taken, in the order they were made',()=>{
 const {choiceLog}=load(['choiceLog'],{CHOICES});
 const log=choiceLog({choices:{blackout_power:'shelter',promise_trust:'honest',hand:'take',unknown:'x'}});
 assert.deepEqual(log,[['A chi restituiamo la luce?','Alimenta il rifugio'],[CHOICES.promise_trust.title,CHOICES.promise_trust.options.honest.label],[CHOICES.hand.title,'Prendila']]);
 assert.equal(log.flat().includes(CHOICES.hand.options.wait.label),false,'options not taken are never shown');
});

test('M3: «Gioca l\'altra rotta» keeps weapons and upgrades, resets story and choices, and survives a save round trip',()=>{
 const {replayProgress}=load(['replayProgress'],{newProgress});
 const old=newProgress();old.step=CAMPAIGN.length-1;old.status='cleared';old.upgrade='shield';
 old.world.inventory={medkit:2,vest:1};old.world.equipment={armor:'vest'};old.world.stock={'moon:vest':1};old.world.coins=999;
 Object.assign(old.narrative.flags,{'weapon.tessa':true,'weapon.quickdraw':true,story_complete:true,separated:true});old.narrative.choices={hand:'take'};old.narrative.thermal=80;
 const p=replayProgress(old);
 assert.equal(p.step,0);assert.equal(p.upgrade,'shield');
 assert.deepEqual(p.world.equipment,{armor:'vest'});assert.deepEqual(p.world.inventory,{medkit:2,vest:1});assert.equal(p.world.coins,newProgress().world.coins);
 assert.deepEqual(p.narrative.choices,{});assert.equal(p.narrative.thermal,newProgress().narrative.thermal);
 assert.deepEqual(p.narrative.flags,{'weapon.tessa':true,'weapon.quickdraw':true,replay_route:true});
 p.world.inventory.medkit=3;assert.equal(old.world.inventory.medkit,2,'the old save is copied, not shared');
 const back=loadProgress(saveProgress(p));
 assert.equal(back.step,0);assert.equal(back.upgrade,'shield');assert.equal(back.narrative.flags['weapon.quickdraw'],true);assert.equal(back.narrative.flags.replay_route,true);
});
