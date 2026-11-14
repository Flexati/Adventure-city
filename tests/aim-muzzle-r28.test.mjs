// R28 (D72): «quando spara, quello che esce dalla canna non è coerente alla direzione di dove spara e la mira non assistita
// non funziona bene». The bullet now leaves the painted barrel of the pose on screen, the pose is the one nearest to the
// shot, and a manual aim takes the foe whose drawn body the ray from the barrel crosses.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newRun,tick,aimAt,pickAlong,attackPreview,startAttack} from '../game/campaign.mjs';
import {buildMission} from '../game/missions.mjs';
import {gunRowV9,muzzleV9,MUZZLE_V9,foeBodyV9} from '../game/weapons-v9.mjs';
const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
const vis=fs.readFileSync(new URL('../game/visuals.mjs',import.meta.url),'utf8');
const foe=(x,y,extra={})=>({id:1,role:'raider',x,y,hp:9,max:9,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:0,windup:9,attackRadius:1,recovery:9,reach:1,...extra});
const street=(hero='nox')=>{const c=buildMission('docks_veyra',{'weapon.tessa':true}),s=newRun(hero,1,'power',null,null,c);s.x=800;s.y=1184;return s;}; // open floor to the east
const deg=a=>({x:Math.cos(a*Math.PI/180),y:Math.sin(a*Math.PI/180)});

test('the pose is the one nearest to the angle of the shot: side, up-diagonal, up, down',()=>{
 for(const [a,row] of [[0,0],[-10,0],[40,0],[-20,3],[-33,3],[-55,3],[-70,1],[-90,1],[50,2],[90,2],[180,0],[-150,3],[130,2]])assert.equal(gunRowV9(deg(a)),row,a+' degrees');
 assert.match(vis,/const gunRow=gunRowV9;/,'the drawn pose uses the same rule');
});

test('the bullet leaves the barrel of that pose, mirrored when the hero faces left',()=>{
 assert.deepEqual(muzzleV9('nox','c9',{x:1,y:0}),{x:42,y:-66});
 assert.deepEqual(muzzleV9('nox','c9',{x:-1,y:0}),{x:-42,y:-66});
 assert.deepEqual(muzzleV9('nox','vx9',{x:0,y:-1}),{x:0,y:-97});
 assert.deepEqual(muzzleV9('lulu','arc7',deg(-35)),{x:43,y:-95},'ARC-7 is drawn on the R-12 cells');
 assert.deepEqual(muzzleV9('lulu','mg_tempest',{x:0,y:1}),{x:-4,y:-23},'market weapons use the service pistol sheet');
 assert.equal(Object.keys(MUZZLE_V9).length,4);
 const s=street(),e=foe(s.x+200,s.y);s.enemies=[e];let shot=null;
 for(let i=0;i<20&&!shot;i++){tick(s,i===0?{gun:true,aim:{x:1,y:0}}:{},1/60);shot=s.events.find(v=>v.type==='shot');}
 assert.ok(shot);assert.equal(shot.mx,42);assert.equal(shot.my,-66);assert.equal(shot.th,-foeBodyV9(e).h/2,'it lands on the chest of the foe it hit');
 assert.match(rt,/const x=e\.x\+\(e\.mx\?\?0\),y=e\.y\+\(e\.my\?\?-32\),tx=e\.to\.x,ty=e\.to\.y\+\(e\.th\?\?-32\)/,'the painted bullet flies from the barrel to that point');
 assert.match(rt,/e\.type==='shot'&&e\.mx!=null\?muzzleFire\(e\.x\+e\.mx,e\.y\+e\.my,e\.to\.x,e\.to\.y\+\(e\.th\?\?-32\)\)/,'the muzzle fire sits on the barrel, not on the belly (R29: and points where the shot goes)');
 assert.ok(!/x:x\+Math\.cos\(a\)\*Math\.min\(28,d\*\.5\)/.test(rt),'the old start, 28 px from the waist, is gone');
 assert.match(rt,/ty=e\.to\?e\.to\.y\+\(e\.th\?\?-32\):oy;/,'events without a target (impacts, nodes) do not reach for one: the first hit of R28 stopped the game in Chromium');
});

test('a manual aim from the barrel to the body of a foe hits it; before R28 the same aim missed',()=>{
 const s=street(),e=foe(s.x+220,s.y+30);s.enemies=[e];
 const m=muzzleV9('nox','c9',{x:1,y:0}),chest={x:e.x,y:e.y-foeBodyV9(e).h/2},d={x:chest.x-(s.x+m.x),y:chest.y-(s.y+m.y)};
 const n=Math.hypot(d.x,d.y),u={x:d.x/n,y:d.y/n},old=Math.abs((e.x-s.x)*u.y-(e.y-s.y)*u.x);
 assert.ok(old>25,`the old floor corridor missed it by ${old.toFixed(1)} px`);
 assert.equal(pickAlong(s,u,340,'gun'),e);
 for(let i=0;i<20&&e.hp===9;i++)tick(s,i===0?{gun:true,aim:d}:{},1/60);
 assert.ok(e.hp<9,'the foe the player pointed at is hit');
});

test('a manual aim that crosses no body still misses, and assisted aim is unchanged',()=>{
 const s=street(),e=foe(s.x+220,s.y);s.enemies=[e];
 for(let i=0;i<20;i++)tick(s,i===0?{gun:true,aim:{x:0,y:-1}}:{},1/60);
 assert.equal(e.hp,9,'pointing up does not hit a foe on the right');
 const a=aimAt(s,null,340);assert.ok(Math.abs(a.x-1)<1e-9&&Math.abs(a.y)<1e-9,'assisted aim still points at the nearest foe');
 const t=street(),f=foe(t.x+150,t.y-12);t.enemies=[f];assert.deepEqual(aimAt(t,{x:1,y:0},340),{x:1,y:0},'an aim that already takes the foe is kept as it is');
});

test('the preview line starts at the barrel and stops on the foe the shot will take',()=>{
 const s=street('lulu'),e=foe(s.x+180,s.y+40);s.enemies=[e];
 const m=muzzleV9('lulu','c9',{x:1,y:0}),p=attackPreview(s,'gun',{x:180,y:40-foeBodyV9(e).h/2-m.y});
 assert.equal(p.target?.id,e.id);assert.deepEqual(p.origin,{x:s.x+m.x,y:s.y+m.y});
 assert.match(rt,/const manual=aimView\.dir\|\|\(settings\.assist\?null:s\.face\),p=attackPreview\(s,aimView\.kind,manual\)/,'with assisted aim off an undragged press previews the facing, as the shot goes');
 assert.match(rt,/line\(o\.x,o\.y,ex,ey,'#eaffff',2\)/);
 assert.match(rt,/circle\(t\.x,t\.y,t\.r,'#ff5a6e',true,3\)/,'the foe is ringed in red');
});

test('the partner raises the gun when it fires, so its bullet leaves a barrel too',()=>{
 assert.match(rt,/pm=e\.ally\?\{x:e\.to\.x<e\.x\?-40:40,y:-52\}:muzzleV9\(s\.hero==='nox'\?'lulu':'nox','c9',d\)/);
 assert.match(rt,/f=pp\?\{atlas:name\+'_gun',row:gunRowV9\(pp\.dir\),col:pt<\.07\?1:pt<\.16\?2:3,flip:pp\.dir\.x<0\}:heroFrame\(state,actor,name,partner\)/);
});

test('the barrel table is measured on the sheets by a script, not guessed',()=>{
 const src=fs.readFileSync(new URL('../tools/measure_muzzles_r28.py',import.meta.url),'utf8');
 assert.match(src,/--check/);assert.match(src,/MUZZLE_V9 matches the sheets/);
});
