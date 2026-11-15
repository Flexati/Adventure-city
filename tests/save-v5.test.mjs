import test from 'node:test';
import assert from 'node:assert/strict';
import {newRun,saveRun,loadRun,nextDistrict,chooseCity} from '../game/campaign.mjs';

test('new saves use schema v5 and preserve narrative state across load and district transition',()=>{
 const s=newRun('lulu',0,'shield');
 assert.equal(s.version,5);
 s.narrative.thermal=73;
 s.narrative.flags.glass_owned=true;
 s.narrative.beatsSeen.push('glass_pickup');
 s.status='cleared';
 assert.equal(chooseCity(s,'shelter'),true);
 const raw=saveRun(s);
 const parsed=JSON.parse(raw);assert.equal(parsed.version,5);
 const restored=loadRun(raw);
 assert.equal(restored.narrative.thermal,73);
 assert.equal(restored.narrative.flags.glass_owned,true);
 assert.equal(restored.narrative.flags.blackout_choice,'shelter');
 assert.equal(restored.narrative.choices.blackout_power,'shelter');
 const next=nextDistrict(restored,'power');
 assert.equal(next.narrative.thermal,73);
 assert.equal(next.narrative.flags.glass_owned,true);
});

test('v4 checkpoints migrate safely into v5 narrative state',()=>{
 const raw=JSON.stringify({version:4,hero:'nox',level:0,upgrade:'power',status:'cleared',cityChoice:'workshop'});
 const s=loadRun(raw);
 assert.equal(s.version,5);
 assert.equal(s.cityChoice,'workshop');
 assert.equal(s.narrative.thermal,50);
 assert.equal(s.narrative.flags.blackout_choice,'workshop');
 assert.equal(s.narrative.choices.blackout_power,'workshop');
});

test('v5 rejects corrupt narrative payloads and invalid status instead of partially loading',()=>{
 const base={version:5,hero:'nox',level:0,upgrade:'power',status:'playing',cityChoice:null,narrative:{version:1,thermal:50,flags:{},choices:{},beatsSeen:[]}};
 assert.ok(loadRun(JSON.stringify(base)));
 assert.equal(loadRun(JSON.stringify({...base,narrative:{...base.narrative,thermal:101}})),null);
 assert.equal(loadRun(JSON.stringify({...base,narrative:{...base.narrative,beatsSeen:['ok','ok']}})),null);
 assert.equal(loadRun(JSON.stringify({...base,status:'teleported'})),null);
});
