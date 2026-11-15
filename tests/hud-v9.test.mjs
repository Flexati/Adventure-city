import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {meterModel} from '../game/hud.mjs';
import {newDrive} from '../game/driving.mjs';

test('life meter derives full, partial, low and zero states from current and maximum HP',()=>{
 assert.deepEqual(meterModel(8,8),{current:8,max:8,percent:100,low:false,empty:false,full:true});
 assert.equal(meterModel(5,10).percent,50);
 assert.equal(meterModel(2,8).low,true);
 assert.equal(meterModel(0,8).empty,true);
 assert.deepEqual(meterModel(14,12),{current:12,max:12,percent:100,low:false,empty:false,full:true});
 assert.equal(meterModel(-2,8).current,0);
});

test('vehicle integrity has its own maximum including the workshop reinforcement',()=>{
 const ordinary=newDrive(0),reinforced=newDrive(0,'workshop'),truck=newDrive(3);
 assert.deepEqual([ordinary.hp,ordinary.maxIntegrity],[5,5]);
 assert.deepEqual([reinforced.hp,reinforced.maxIntegrity],[6,6]);
 assert.deepEqual([truck.hp,truck.maxIntegrity],[6,6]);
});

test('distributed HUD uses numeric bars and no heart glyph rendering',()=>{
 const html=fs.readFileSync('game/index.html','utf8'),runtime=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(html,/id="health" class="vital-meter" role="meter"/);
 assert.match(html,/id="integrity" class="vital-meter integrity-meter" role="meter"/);
 assert.match(html,/id="coins" hidden aria-label="Monete"/);
 assert.match(runtime,/setVitalMeter\(\$\('health'\),s\.hp,s\.maxHp/);
 assert.match(runtime,/setVitalMeter\(\$\('integrity'\),s\.hp,s\.maxIntegrity/);
 assert.doesNotMatch(html+runtime,/[♥♡❤]/);
});
