// R32 (D76): «il fuoco che esce dalla canna quando spari in qualsiasi sprite sheet deve essere coordinato e coerente con la
// direzione di mira di fuoco». The flash painted inside a sheet points along its pose only; it is shown only when the aim
// is within 15° of that axis, otherwise its blast-free neighbour frame is drawn and the turned muzzle fire shows the shot.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {flashFitsV9,flashColV9,gunRowV9} from '../game/weapons-v9.mjs';
import {heroFrame} from '../game/visuals.mjs';
const deg=a=>({x:Math.cos(a*Math.PI/180),y:Math.sin(a*Math.PI/180)});
test('the painted flash appears only within 15° of its pose axis, mirrored poses included',()=>{
 for(const a of [0,10,-15,80,90,100,-35,-25,-48,-80,-90,180,170,-145])assert.equal(flashFitsV9(deg(a)),true,a+'°');
 for(const a of [20,30,40,44,50,60,-60,135,145,-120])assert.equal(flashFitsV9(deg(a)),false,a+'°');
 assert.equal(flashColV9(1,deg(40)),0);assert.equal(flashColV9(2,deg(40)),3);assert.equal(flashColV9(1,deg(0)),1);assert.equal(flashColV9(0,deg(40)),0);
});
test('the hero sheet, the partner pose and Morrow follow the rule',()=>{
 const s={action:{kind:'gun',t:.1,duration:.3,dir:deg(40),weapon:{id:'c9'},shotsReleased:1},face:deg(40),status:'playing',hurtAnim:0,duoAnim:0,dash:0};
 assert.equal(heroFrame(s,s,'nox').col,0,'40°: the flash frame gives way to the aim frame');
 s.action.dir=deg(0);s.face=deg(0);assert.equal(heroFrame(s,s,'nox').col,1,'0°: the painted flash points the right way and stays');
 const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
 assert.match(rt,/col:flashColV9\(pt<\.07\?1:pt<\.16\?2:3,pp\.dir\)/,'partner');
 assert.match(rt,/anim=a\.id==='morrow'&&a\.anim==='shotgun'&&shotTilted\(a\)\?levelOnly\(base\):base/,'Morrow');
 assert.match(rt,/else muzzleFire\(e\.x\+pm\.x,e\.y\+pm\.y,e\.to\.x,e\.to\.y\+from\.th\);/,'Morrow has his turned muzzle fire');
});
