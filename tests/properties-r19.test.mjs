import test from 'node:test';import assert from 'node:assert/strict';
import {meterModel} from '../game/hud.mjs';
import {newRun,tick,moveActor,SIZE} from '../game/campaign.mjs';
import {newCollapse,tickCollapse} from '../game/traversal.mjs';
import {WEAPONS_V9,WEAPON_REWARDS_V9,createArsenalV9,fireWeaponV9,reloadWeaponV9,switchWeaponV9,tickArsenalV9,unlockedWeaponsV9,loadArsenalV9,saveArsenalV9} from '../game/weapons-v9.mjs';
import {getLayout,layoutWalkable,routeWaypoint} from '../game/layouts.mjs';
import {createProgressStore} from '../game/progress-store.mjs';
import {newProgress,saveProgress,loadProgress,CAMPAIGN} from '../game/missions.mjs';
// R19 property tests: seeded random, hundreds of cases each. A failure prints the seed and the case.
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const WEIRD=[0,-1,-1e9,NaN,Infinity,-Infinity,1e9,1e-12,.016,.05,3600];
const finite=(o,path='')=>{for(const [k,v] of Object.entries(o)){if(typeof v==='number')assert.ok(!Number.isNaN(v),path+k+' is NaN');}};

test('meterModel: percent stays in 0..100 and never NaN for any input',()=>{
 const r=rng(1),vals=[...WEIRD,undefined,null,'7'];
 for(let i=0;i<600;i++){const v=i<vals.length*vals.length?vals[i%vals.length]:(r()-.3)*50,m=i<vals.length*vals.length?vals[Math.floor(i/vals.length)%vals.length]:(r()-.2)*40,o=meterModel(v,m);
  assert.ok(o.percent>=0&&o.percent<=100,`percent ${o.percent} for ${v}/${m}`);assert.ok(o.current>=0&&o.current<=o.max&&o.max>0);assert.ok(!(o.low&&o.empty));}
});

test('arsenal: ammo stays within 0..magazine and timers stay finite under random play and odd dt',()=>{
 for(const hero of ['nox','lulu'])for(let seed=1;seed<=40;seed++){
  const r=rng(seed),a=createArsenalV9(hero,WEAPON_REWARDS_V9.filter(()=>r()<.6));
  for(let i=0;i<300;i++){
   const k=r();if(k<.45)fireWeaponV9(a);else if(k<.6)reloadWeaponV9(a);else if(k<.75){const kit=unlockedWeaponsV9(a.hero,a.rewards);switchWeaponV9(a,kit[Math.floor(r()*kit.length)]);}
   else tickArsenalV9(a,r()<.2?WEIRD[Math.floor(r()*WEIRD.length)]:r()*.1);
   for(const [id,n] of Object.entries(a.ammo))assert.ok(Number.isInteger(n)&&n>=0&&n<=WEAPONS_V9[id].magazine,`seed ${seed} step ${i}: ${id} ammo ${n}`);
   assert.ok(Number.isFinite(a.cooldown)&&a.cooldown>=0,`seed ${seed} step ${i}: cooldown ${a.cooldown}`);assert.ok(Number.isFinite(a.reloadRemaining)&&a.reloadRemaining>=0,`seed ${seed} step ${i}: reload ${a.reloadRemaining}`);
  }
  const back=loadArsenalV9(saveArsenalV9(a));assert.ok(back,'a legal arsenal round-trips');assert.deepEqual(back.ammo,a.ammo);
 }
});

test('arsenal: tampered saves are rejected, never thrown on',()=>{
 const a=createArsenalV9('nox',['tessa']),good=JSON.parse(saveArsenalV9(a));
 for(const edit of [o=>{o.ammo.c9=999;},o=>{o.ammo.c9=-1;},o=>{o.active='arc7';},o=>{o.hero='kairn';},o=>{o.cooldown=NaN;},o=>{o.rewards=['gold'];},o=>{delete o.ammo;},o=>{o.version=2;},o=>{o.reloadRemaining=1e9;}]){
  const o=JSON.parse(JSON.stringify(good));edit(o);assert.equal(loadArsenalV9(JSON.stringify(o)),null);}
 for(const raw of ['','{','null','[]','"x"',undefined])assert.equal(loadArsenalV9(raw),null);
});

test('combat tick: odd dt (0, negative, NaN, infinite, huge) never produces NaN, teleports or invalid health',()=>{
 for(const hero of ['nox','lulu'])for(const dt of WEIRD){
  const s=newRun(hero),x=s.x,y=s.y,hp=s.hp;
  for(let i=0;i<5;i++)tick(s,{x:1,y:0,gun:i%2===0},dt);
  finite(s,`dt ${dt}: `);assert.ok(Number.isFinite(s.x)&&Number.isFinite(s.y)&&Number.isFinite(s.time),`dt ${dt}: position/time`);
  assert.ok(Math.hypot(s.x-x,s.y-y)<=5*.05*400,`dt ${dt}: moved ${Math.hypot(s.x-x,s.y-y)} px in five frames`);assert.ok(s.hp<=hp&&s.hp>=0);
 }
});

test('collapse escape: odd dt never produces NaN and the hero stays on the walkable floor',()=>{
 for(const dt of WEIRD){const s=newCollapse();for(let i=0;i<5;i++)tickCollapse(s,{x:0,y:-1},dt);assert.ok(Number.isFinite(s.x)&&Number.isFinite(s.y)&&Number.isFinite(s.time),`dt ${dt}`);}
});

test('moveActor: random walks never leave the map and never end inside a wall',()=>{
 for(const id of ['yard','moon','cathedral','toxic','clockwork','elbow','spine','arena','gallery']){
  const layout=getLayout(id),r=rng(id.length*97),a={layoutId:id,x:layout.start.x,y:layout.start.y};
  for(let i=0;i<800;i++){moveActor(a,(r()-.5)*24,(r()-.5)*24);
   assert.ok(a.x>=0&&a.x<=SIZE&&a.y>=0&&a.y<=SIZE,`${id} step ${i}: left the map at ${a.x},${a.y}`);
   assert.ok(!layout.walls.some(w=>a.x+16>w.x&&a.x-16<w.x+w.w&&a.y+10>w.y&&a.y-10<w.y+w.h),`${id} step ${i}: inside a wall at ${a.x},${a.y}`);}
 }
});

test('routeWaypoint: from any walkable tile it returns a finite point on the map',()=>{
 for(const id of ['yard','elbow','spine','arena','gallery']){const layout=getLayout(id),r=rng(7);
  for(let i=0;i<200;i++){const from={x:r()*SIZE,y:r()*SIZE};if(!layoutWalkable(layout,from.x,from.y))continue;
   const p=routeWaypoint(layout,from,layout.start);assert.ok(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=SIZE&&p.y>=0&&p.y<=SIZE,`${id}: ${JSON.stringify(from)} -> ${JSON.stringify(p)}`);}
 }
});

test('saves: every stage round-trips, and 500 random corruptions never throw nor load a broken checkpoint',()=>{
 for(let i=0;i<CAMPAIGN.length;i++){const p=newProgress();p.step=i;const back=loadProgress(saveProgress(p));assert.ok(back,CAMPAIGN[i].id);assert.ok(Number.isInteger(back.step)&&back.step>=0&&back.step<=i,CAMPAIGN[i].id+': a bare step may be sent back to a missed mandatory stage, never forward');}
 const data=new Map(),st=createProgressStore({storage:()=>({getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}),key:'k',serialize:saveProgress,deserialize:loadProgress});
 const p=newProgress();st.write(p,{newGame:true});p.step=4;st.write(p);const good=data.get('k'),reference=st.read().progress,r=rng(11);
 for(let i=0;i<500;i++){
  const k=r(),at=Math.floor(r()*good.length);let bad;
  if(k<.3)bad=good.slice(0,at);else if(k<.6)bad=good.slice(0,at)+String.fromCharCode(33+Math.floor(r()*90))+good.slice(at+1);else if(k<.8)bad=good.slice(at)+good.slice(0,at);else bad=good+good.slice(0,at);
  data.set('k',bad);const out=st.read();
  if(bad===good){assert.equal(out.source,'primary');continue;}
  assert.ok(['backup','corrupt','primary'].includes(out.source));
  // H3: a hit on the name of the integrity field turns the save into legacy data (no checksum). The content is then untouched, so it must equal the real checkpoint.
  if(out.source==='primary'){assert.ok(!/"integrity":\{/.test(bad),'a save that still carries its checksum cannot pass damaged: case '+i);assert.deepEqual(out.progress,reference,'case '+i);}
  if(out.progress){assert.ok(Number.isInteger(out.progress.step)&&out.progress.step>=0&&out.progress.step<CAMPAIGN.length);}
 }
});
