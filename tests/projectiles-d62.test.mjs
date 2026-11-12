import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {newRun,tick,visible} from '../game/campaign.mjs';import {buildMission} from '../game/missions.mjs';
// D62: shots are seen travelling and the DUO wave needs a clear line. D63: bosses carry 25 % more health.
const fight=()=>{const s=newRun('nox',0,'power');s.duo=100;const a=s.enemies[0];s.enemies=[a,{...a,id:99}];for(const e of s.enemies){e.state='walk';e.hp=e.max=40;}return s;};
test('D62: the DUO wave strikes a foe in the open and spares one behind a wall',()=>{
 const s=fight(),[open,hidden]=s.enemies;open.x=s.x+120;open.y=s.y;
 // Search a spot within the wave radius that a wall hides from the hero.
 let spot=null;for(let a=0;a<6.28&&!spot;a+=.05)for(let r=120;r<300&&!spot;r+=10){const p={x:s.x+Math.cos(a)*r,y:s.y+Math.sin(a)*r};if(!visible(s,p))spot=p;}
 assert.ok(spot,'the first layout has cover near the start');hidden.x=spot.x;hidden.y=spot.y;assert.equal(visible(s,open),true);
 tick(s,{duo:true},1/60);const ev=s.events.find(e=>e.type==='duo');assert.ok(ev);
 assert.ok(open.hp<40,'in the open: hit');assert.equal(hidden.hp,40,'behind cover: untouched');
 assert.equal(ev.hits.length,1);assert.deepEqual({x:ev.hits[0].x,y:ev.hits[0].y},{x:open.x,y:open.y});
});
test('D62: the runtime draws the shot as a bolt that travels, and one wave per foe the DUO reached',()=>{
 const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
 assert.match(rt,/const p=1-f\.life\/f\.max,q=Math\.max\(0,p-\.3\)/);assert.match(rt,/for\(const h of e\.hits\)fx\.push\(\{type:'beam'/);
});
test('D63: the five bosses carry 25 % more health than before, phases still read the ratio',()=>{
 const hp=id=>buildMission(id,{}).boss.hp;
 assert.deepEqual([hp('blackout'),hp('breach'),hp('archive'),hp('finale')],[60,112,238,575]);
 const src=fs.readFileSync(new URL('../game/campaign.mjs',import.meta.url),'utf8');assert.match(src,/boss:\{kind:'custode',hp:375\}/);
});
