import test from 'node:test';import assert from 'node:assert/strict';
import {newRun,visible,GUN_RANGE} from '../game/campaign.mjs';
import {WEAPONS_V9} from '../game/weapons-v9.mjs';
import {makePolicy} from './helpers/autoplay.mjs';
// One walking raider straight east of the hero in the open centre band of the default map.
const duel=(combatV9,gap)=>{const s=newRun('nox',0,'power',null,null,{id:'policy_probe',hp:24,speed:50,damage:5,cooldown:.4,magic:false,partner:false,combatV9,weaponRewards:[],start:{x:700,y:730},nodes:[],waves:[['raider']]});
 const e=s.enemies[0];s.enemies=[e];e.state='walk';e.x=s.x+gap;e.y=s.y;assert.ok(visible(s,e),'probe enemy in line of sight');return s;};
test('the average-player bot closes in when the nearest enemy is beyond the active weapon range, and only then',()=>{
 const c9=duel(true,350);assert.equal(c9.arsenal.active,'c9');assert.equal(WEAPONS_V9.c9.range,310);
 for(const s of [c9,duel(false,350)]){const inp=makePolicy({seed:1})(s);assert.equal(inp.gun,true);assert.equal(inp.magic,true);assert.ok(inp.x*1+inp.y*0>.9,`moves toward the enemy at 350 px (range ${s.arsenal?WEAPONS_V9[s.arsenal.active].range:GUN_RANGE})`);}
 const held=makePolicy({seed:1})(duel(true,250));assert.equal(held.gun,true);assert.equal(held.x,0);assert.equal(held.y,0);
 const back=makePolicy({seed:1})(duel(true,120));assert.equal(back.gun,true);assert.ok(back.x<0,'retreats under 140 px');
});
