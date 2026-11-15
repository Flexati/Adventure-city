import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newRun,tick} from '../game/campaign.mjs';
import {buildMission} from '../game/missions.mjs';
import {muzzleV9} from '../game/weapons-v9.mjs';
import {heroFrame} from '../game/visuals.mjs';

const DIRS=[
 ['RIGHT',{x:1,y:0}],
 ['LEFT',{x:-1,y:0}],
 ['UP',{x:0,y:-1}],
 ['DOWN',{x:0,y:1}],
 ['UP-RIGHT',{x:Math.SQRT1_2,y:-Math.SQRT1_2}],
 ['UP-LEFT',{x:-Math.SQRT1_2,y:-Math.SQRT1_2}],
 ['DOWN-RIGHT',{x:Math.SQRT1_2,y:Math.SQRT1_2}],
 ['DOWN-LEFT',{x:-Math.SQRT1_2,y:Math.SQRT1_2}]
];

function cosine(ax,ay,bx,by){
 const na=Math.hypot(ax,ay),nb=Math.hypot(bx,by);
 return na>0&&nb>0?(ax*bx+ay*by)/(na*nb):0;
}

test('R1.1: 01 · Blackout (non-V9 release) emits directional barrel muzzle offsets and aligned fire vectors in all 8 directions',()=>{
 for(const hero of ['nox','lulu']){
  for(const [label,dir] of DIRS){
   const s=newRun(hero,0,'power');
   s.x=800;s.y=1184;s.enemies=[];
   let shot=null;
   for(let i=0;i<20&&!shot;i++){
    tick(s,i===0?{gun:true,aim:dir}:{},1/60);
    shot=s.events.find(e=>e.type==='shot');
   }
   assert.ok(shot,`${hero} ${label}: shot event emitted in 01 · Blackout`);
   const expectedMuzzle=muzzleV9(hero,'c9',dir);
   assert.equal(shot.mx,expectedMuzzle.x,`${hero} ${label}: mx matches barrel`);
   assert.equal(shot.my,expectedMuzzle.y,`${hero} ${label}: my matches barrel`);
   const ox=shot.x+shot.mx,oy=shot.y+shot.my,tx=shot.to.x,ty=shot.to.y+(shot.th??-32);
   const cos=cosine(tx-ox,ty-oy,dir.x,dir.y);
   assert.ok(cos>0.999,`${hero} ${label}: muzzle fire vector cosine ${cos} must align with aim`);
  }
 }
});

test('R1.2: V9 weapons (pistols, rifles, shotguns, SMGs, bolts, orbs, rails, arcs) align barrel and fire vectors in all 8 directions',()=>{
 const cases=[
  ['nox','c9',{}],
  ['nox','vx9',{}],
  ['nox','h17',{'weapon.sable':true}],
  ['nox','mg_tempest',{inventory:{mg_tempest:1}}],
  ['nox','plasma_caster',{inventory:{plasma_caster:1}}],
  ['nox','rail_lance',{inventory:{rail_lance:1}}],
  ['lulu','c9',{}],
  ['lulu','r12',{}],
  ['lulu','arc7',{'weapon.sable':true}],
  ['lulu','orb_nova',{inventory:{orb_nova:1}}],
  ['lulu','arc_tesla',{inventory:{arc_tesla:1}}],
  ['lulu','flak_cannon',{inventory:{flak_cannon:1}}]
 ];
 for(const [hero,weaponId,extra] of cases){
  for(const [label,dir] of DIRS){
   const flags={'weapon.tessa':true,['weapon.active.'+hero]:weaponId,...(extra['weapon.sable']?{'weapon.sable':true}:{})};
   const def=buildMission('docks_veyra',flags,null,{inventory:extra.inventory||{}});
   const s=newRun(hero,1,'power',null,null,def);
   s.x=800;s.y=1184;s.enemies=[];
   let ev=null;
   for(let i=0;i<20&&!ev;i++){
    tick(s,i===0?{gun:true,aim:dir}:{},1/60);
    ev=s.events.find(e=>e.type==='shot'||e.type==='orbLaunch');
   }
   assert.ok(ev,`${hero} ${weaponId} ${label}: attack event emitted`);
   assert.ok(Number.isFinite(ev.mx)&&Number.isFinite(ev.my),`${hero} ${weaponId} ${label}: carries barrel mx/my`);
   if(ev.type==='shot'){
    const ox=ev.x+ev.mx,oy=ev.y+ev.my,tx=ev.to.x,ty=ev.to.y+(ev.th??-32);
    const cos=cosine(tx-ox,ty-oy,ev.dir.x,ev.dir.y);
    assert.ok(cos>0.999,`${hero} ${weaponId} ${label}: shot vector cosine ${cos} aligns with pellet dir`);
   }else{
    const cos=cosine(ev.dir.x,ev.dir.y,dir.x,dir.y);
    assert.ok(cos>0.999,`${hero} ${weaponId} ${label}: orbLaunch dir aligns with aim`);
   }
  }
 }
});

test('R1.3: Point-blank enemies and close walls never invert or flip the muzzle fire / bullet vector backwards',()=>{
 const def=buildMission('docks_veyra',{'weapon.tessa':true});
 for(const [label,dir] of DIRS){
  const s=newRun('nox',1,'power',null,null,def);
  s.x=800;s.y=1184;
  // Place enemy at point-blank distance (16 px from hero center, closer than barrel offset 42 px)
  s.enemies=[{id:1,role:'raider',x:s.x+dir.x*16,y:s.y+dir.y*16,hp:10,max:10,clock:0,state:'walk',walk:0,hurtAnim:0,deathAnim:0,face:-1,boss:false,moveSpeed:0,detectRange:0,windup:9,attackRadius:1,recovery:9,reach:1}];
  let shot=null;
  for(let i=0;i<20&&!shot;i++){
   tick(s,i===0?{gun:true,aim:dir}:{},1/60);
   shot=s.events.find(e=>e.type==='shot');
  }
  assert.ok(shot,`point-blank ${label}: shot emitted`);
  const ox=shot.x+shot.mx,oy=shot.y+shot.my,tx=shot.to.x,ty=shot.to.y+(shot.th??-32);
  const cos=cosine(tx-ox,ty-oy,dir.x,dir.y);
  assert.ok(cos>0.99,`point-blank ${label}: muzzle fire cosine ${cos} never flips backwards`);
 }
});

test('R1.4: Mid-attack aim direction changes update action.dir, character sprite facing, and barrel side without delay',()=>{
 const def=buildMission('docks_veyra',{'weapon.tessa':true,'weapon.active.nox':'vx9'});
 const s=newRun('nox',1,'power',null,null,def);
 s.x=800;s.y=1184;s.enemies=[];
 // Start firing RIGHT
 tick(s,{gun:true,aim:{x:1,y:0}},0.02);
 assert.ok(s.action,'action started');
 assert.equal(heroFrame(s,s,'nox').flip,false,'initially facing right');
 // Turn aim LEFT before first shot releases at t=0.09
 const shots=[];
 for(let i=0;i<15;i++){
  tick(s,{aim:{x:-1,y:0}},0.02);
  for(const e of s.events)if(e.type==='shot')shots.push(e);
 }
 assert.ok(shots.length>=1,'burst shots released');
 assert.ok(shots[0].dir.x<-0.99,'shot released to the LEFT after mid-windup aim turn');
 assert.ok(shots[0].mx<0,'barrel offset mx flipped to negative (LEFT side)');
});

test('R1.5: Enemy and boss ranged/charge attacks update facing toward target and emit directional shot targets',()=>{
 const s=newRun('nox',0,'power');
 s.x=800;s.y=1184;
 const foe={id:99,role:'gunner',ranged:true,x:700,y:1184,hp:10,max:10,clock:0,state:'warn',walk:0,hurtAnim:0,deathAnim:0,face:1,boss:false,moveSpeed:100,detectRange:400,windup:1.0,attackRadius:40,recovery:1,reach:260,target:{x:800,y:1184}};
 s.enemies=[foe];
 // Hero moves to the LEFT of the enemy during tracking window (clock < 0.6 * windup)
 s.x=580;
 tick(s,{},0.05);
 assert.equal(foe.face,-1,'enemy flips face to -1 when hero crosses to the left during windup');
 let enemyShot=null;
 for(let i=0;i<30&&!enemyShot;i++){
  tick(s,{},0.05);
  enemyShot=s.events.find(e=>e.type==='enemyShot');
 }
 assert.ok(enemyShot,'enemyShot emitted');
 assert.ok(foe.target&&foe.target.x<foe.x&&s.shots[0]?.vx<0,'enemyShot fires to the left toward tracked target');

 const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
 assert.match(rt,/function burst\(x,y,color,count=15,speed=160,dir=null\)/,'burst supports directional cone');
 assert.match(rt,/else if\(e\.type==='rookShot'\|\|e\.type==='enemyShot'\)/,'enemy and Rook shots emit directional muzzleFire');
});
