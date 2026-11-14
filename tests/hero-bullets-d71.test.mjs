// R25 (D71): «I proiettili di Nox e Lulù non ci sono». The shot was a 6 px streak alive for 0.16 s: on a phone nobody saw it.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newRun,tick} from '../game/campaign.mjs';
import {buildMission} from '../game/missions.mjs';
const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
test('a gun shot becomes a painted bullet that flies to where the shot ended and bursts there',()=>{
 assert.match(rt,/function heroBullet\(e,color\)\{/);
 assert.match(rt,/life=clamp\(d\/1300,\.13,\.3\)/,'1300 px/s, never shorter than 0.13 s nor longer than 0.30 s');
 assert.match(rt,/if\(!e\.bolt&&!energy&&heroBullet\(e,col\)\);else if\(!e\.bolt\)fx\.push\(\{type:'beam'/,'bullets fly, energy weapons and moves keep the bolt');
 assert.match(rt,/else if\(f\.type==='bullet'\)\{[^\n]*ctx\.rotate\(f\.a\);ctx\.beginPath\(\);ctx\.rect\(-tr,-110,tr\+220,220\);ctx\.clip\(\);ctx\.imageSmoothingEnabled=false;ctx\.drawImage\(f\.im,Math\.min\(2,Math\.floor\(p\*3\)\)\*128,0,128,128,-144,-97,200,200\)/,'the bullet row of the weapon sheet, turned towards the target; R28: nothing of it is drawn behind the barrel');
 assert.match(rt,/f\.type==='bullet'&&f\.life<=0&&f\.end\)\)fx\.push\(\{type:'vfx',im:f\.im,row:f\.end/,'it bursts on arrival: row 1 on a foe, row 2 on a wall');
 assert.match(rt,/extra\.push\('vfx_c9'\);if\(def\.combatV9\)/,'the bullet sheet is loaded in every foot mission, also before the kit of Tessa');
 assert.ok(!/row:0,x:e\.x\+e\.dir\.x\*26/.test(rt),'the bullet sprite is no longer parked at the muzzle');
 assert.match(rt,/e\.type==='partnerShot'\)\{[^\n]*heroBullet\(from,pc\)/,'the partner fires bullets too');
});
test('the sheet the bullet is cut from exists and has its three rows of four 128 px cells',()=>{
 for(const n of ['vfx_c9','vfx_vx9','vfx_r12']){const b=fs.readFileSync(new URL(`../game/art/v10/${n}.png`,import.meta.url));assert.deepEqual([b.readUInt32BE(16),b.readUInt32BE(20)],[512,384],n);}
});
test('damage is still dealt on the release frame: the bullet is only what the player sees (D62)',()=>{
 const c=buildMission('docks_veyra',{'weapon.tessa':true}),s=newRun('nox',1,'power',null,null,c);s.x=800;s.y=1184; // the open street, floor to the east
 s.enemies=[{id:1,role:'raider',x:s.x+140,y:s.y,hp:9,max:9,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:0,windup:9,attackRadius:1,recovery:9,reach:1}];
 let shotAt=null,hurtAt=null;for(let i=0;i<40&&hurtAt===null;i++){tick(s,i===0?{gun:true,aim:{x:1,y:0}}:{},1/60);if(shotAt===null&&s.events.some(e=>e.type==='shot'))shotAt=i;if(s.enemies[0].hp<9)hurtAt=i;}
 assert.notEqual(shotAt,null);assert.equal(hurtAt,shotAt,'the foe loses health on the same tick the shot leaves');
});
