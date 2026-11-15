// R33: defects found by the review of R31-R32, each with its check.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newRun,tick} from '../game/campaign.mjs';
import {buildMission} from '../game/missions.mjs';
import {heroFrame} from '../game/visuals.mjs';
const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
test('every flash of a multi-pellet shot takes its own tint: the slot that spawnChronoFx fills, not the first one found',()=>{
 assert.match(rt,/function muzzleFire\(x,y,tx,ty,tint=null\)\{return spawnChronoFx\('muzzle_flash',x,y,Math\.atan2\(ty-y,tx-x\),tint\);\}/);
 assert.match(rt,/function spawnChronoFx\(id,x,y,a=null,tint=null\)\{[^\n]*Object\.assign\(f,\{id,x,y,a,tint,life:\.34,max:\.34\}\);return f;\}/);
 assert.ok(!/chronoFxPool\.find\(f=>f\.life>0&&f\.x===x/.test(rt),'no more lookup by position');
});
test('an enemy shot leaves from the bullet origin and carries its target; the foe turns to its target while aiming; no second flash',()=>{
 assert.match(rt,/muzzleFire\(e\.x,e\.y-34,e\.to\.x,e\.to\.y-34,'#ff5a36'\)/);
 assert.match(rt,/else if\(e\.type==='enemyShot'\)\{if\(!e\.to\|\|e\.volley\)fx\.push\(\{type:'flash'/,'the old orange flash stays only for volleys and shots without a target');
 const c=buildMission('app_breach',{}),s=newRun('lulu',1,'power',null,null,c);s.x=900;s.y=900;
 const f=s.enemies.find(e=>e.ranged);if(!f){return;}s.enemies=[f];f.x=700;f.y=900;f.state='warn';f.clock=0;f.windup=.7;f.face=1;
 tick(s,{},1/30);assert.equal(f.face,1,'hero on the right: facing right');
 s.x=500;tick(s,{},1/30);assert.equal(f.face,-1,'hero crosses to the left while it aims: the foe turns, the fire does not come out of its back');
});
test('the hero fire takes the colour of a weapon that has its own; the frame of a burst follows the real step of the weapon',()=>{
 assert.match(rt,/\/\^#\[0-9a-f\]\{6\}\$\/i\.test\(e\.color\|\|''\)&&e\.weapon!=='c9'\?e\.color:/);
 const s={face:{x:1,y:0},status:'playing',hurtAnim:0,duoAnim:0,dash:0,action:{kind:'gun',dir:{x:1,y:0},weapon:{id:'mg_helix'},shotsReleased:2,step:.045,t:.225,duration:.4}};
 assert.equal(heroFrame(s,s,'nox').col,3,'second shot of a .045 s burst, .085 s after it: the recoil is over');
 s.action.step=undefined;assert.equal(heroFrame(s,s,'nox').col,2,'with the default .065 s step the same instant is still the smoke frame: the step matters');
});
test('the three tints are built once per sheet and ahead of the shot',()=>{
 assert.match(rt,/if\(fireSheet!==sheet\)\{fireSheet=sheet;for\(const k of Object\.keys\(FIRE_TINT\)\)delete FIRE_TINT\[k\];\}/);
 assert.match(rt,/function warmFire\(\)\{[^\n]*for\(const c of \['#6bddff','#ff7fd8','#ff5a36'\]\)fireTint\(c\);\}/);
 assert.match(rt,/else if\(mode==='foot'&&state\)\{warmFire\(\);tick\(/);
});
