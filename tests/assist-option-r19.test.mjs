import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newRun,tick} from '../game/campaign.mjs';
// R19 (D60): assisted aim is an option. Off = the shot leaves along the hero's facing; on = the nearest enemy, as before.
const rt=fs.readFileSync('game/runtime.mjs','utf8'),html=fs.readFileSync('game/index.html','utf8');
function setup(){const s=newRun('nox');s.inv=9999;const e=s.enemies.find(e=>e.hp>0&&e.state!=='dormant')||s.enemies[0];e.state='chase';s.x=e.x-120;s.y=e.y;for(const o of s.enemies)if(o!==e){o.hp=0;}return {s,e};}

test('assist on: a tap with no direction aims at the nearest enemy',()=>{
 const {s,e}=setup();s.face={x:0,y:-1};tick(s,{gun:true,aim:null},.016);
 assert.ok(s.action,'the shot starts');assert.ok(s.action.dir.x>.9,'towards the enemy on the right, not up');
});

test('assist off: the same tap fires along the facing direction',()=>{
 const {s}=setup();s.face={x:0,y:-1};tick(s,{gun:true,aim:s.face},.016);
 assert.ok(s.action,'the shot starts');assert.ok(Math.abs(s.action.dir.x)<1e-9&&s.action.dir.y===-1,'straight up, where the hero looks');
});

test('the option exists, defaults to on, is saved and is translated',()=>{
 assert.match(rt,/let settings=\{sound:true,haptics:true,assist:true,/);
 assert.match(rt,/aim:pending\?\.dir\|\|\(settings\.assist\?null:state\?\.face\)/,'a dragged aim always wins; facing is used only with assist off');
 assert.match(rt,/\$\('opt-assist'\)\.onchange=\(\)=>\{settings\.assist=\$\('opt-assist'\)\.checked;saveSettings\(\);\};/);
 assert.match(html,/<label><input id="opt-assist" type="checkbox"> Tiro assistito: mira da sola il nemico più vicino<\/label>/);
 assert.ok(fs.readFileSync('game/runtime-en.mjs','utf8').includes("'Tiro assistito: mira da sola il nemico più vicino':'Assisted aim: targets the nearest enemy by itself'"));
});
