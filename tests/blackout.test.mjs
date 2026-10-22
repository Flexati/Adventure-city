import test from 'node:test';
import assert from 'node:assert/strict';
import {newRun,chooseCity,cityOutcome,saveRun,loadRun,nextDistrict,tick} from '../game/campaign.mjs';
import {newDrive} from '../game/driving.mjs';
for(const choice of ['workshop','shelter'])test(`${choice}: decision survives checkpoint and district transition`,()=>{
 const s=newRun('lulu');assert.equal(chooseCity(s,choice),false);s.status='cleared';assert.equal(chooseCity(s,'bad'),false);assert.equal(chooseCity(s,choice),true);assert.equal(chooseCity(s,choice==='workshop'?'shelter':'workshop'),false);
 const restored=loadRun(saveRun(s));assert.equal(restored.cityChoice,choice);assert.equal(nextDistrict(restored,'shield').cityChoice,choice);assert.ok(cityOutcome(choice).returnText);
 const d=newDrive(0,choice),plain=newDrive(0);if(choice==='workshop'){assert.equal(d.hp,plain.hp+1);assert.deepEqual(d.hazards,plain.hazards);}else{assert.equal(d.hp,plain.hp);assert.ok(d.hazards.length<plain.hazards.length);}
 // Retrying a failed district preserves the committed city choice.
 const retry=newRun(s.hero,1,'power',restored.cityChoice);assert.equal(loadRun(saveRun(retry)).cityChoice,choice);
});
test('legacy checkpoint loads without choice; invalid city choices are rejected',()=>{
 assert.equal(loadRun(JSON.stringify({version:4,hero:'nox',level:0,upgrade:'power',status:'playing'})).cityChoice,null);
 assert.equal(loadRun(JSON.stringify({version:4,hero:'nox',level:0,upgrade:'power',status:'playing',cityChoice:'forged'})),null);
 const s=newRun();tick(s,{},.05);assert.equal(s.status,'playing');assert.equal(cityOutcome(null),null);
});
