import test from 'node:test';
import assert from 'node:assert/strict';
import {TURBO_TIERS,MARKET_TURBO_ITEMS} from '../game/arsenal-data.mjs';
import {HUB_ITEMS} from '../game/hubs.mjs';
import {RACES_V9,RACE_SERIES_V9,newRaceV9,tickRaceV9,raceCurveAt,raceNextCurve,turboDefV12,unlockedTurbosV12,bestUnlockedTurboV12} from '../game/racing-v9.mjs';
import {newDrive,driveTick} from '../game/driving.mjs';
import {CHAPTERS,newRun,startAttack,tick} from '../game/campaign.mjs';
import {translateText,localeStatus,EN_TEXT} from '../game/locale.mjs';

test('TURBO_TIERS progression, unlocks and hub market integration',async ()=>{
 assert.equal(TURBO_TIERS.length,5);
 for(let i=1;i<TURBO_TIERS.length;i++){
  const prev=TURBO_TIERS[i-1],cur=TURBO_TIERS[i];
  assert.ok(cur.tier>prev.tier);
  assert.ok(cur.topBonus>prev.topBonus);
  assert.ok(cur.accelBonus>prev.accelBonus);
  assert.ok(cur.duration>prev.duration);
  assert.ok(cur.nitroCost<prev.nitroCost);
  assert.ok(cur.nitroGainMult>prev.nitroGainMult);
  assert.ok(cur.curveGrip>prev.curveGrip);
  assert.ok(cur.drivingBonus>prev.drivingBonus);
  assert.ok(cur.pitch>prev.pitch);
 }
 assert.deepEqual(unlockedTurbosV12(1,null,null),['turbo_mk1']);
 assert.equal(bestUnlockedTurboV12(1,null,null),'turbo_mk1');
 assert.ok(unlockedTurbosV12(1,{events:{ash_docks:{completed:true}}},null).includes('turbo_mk2'));
 assert.equal(unlockedTurbosV12(4,null,null).length,5);
 assert.equal(bestUnlockedTurboV12(4,null,null),'turbo_mk5');
 assert.ok(unlockedTurbosV12(1,null,{inventory:{turbo_mk3:1}}).includes('turbo_mk3'));
 for(const id of Object.keys(MARKET_TURBO_ITEMS)){
  assert.ok(Object.hasOwn(HUB_ITEMS,id));
  assert.equal(HUB_ITEMS[id].slot,'turbo');
 }
 const {newProgress,saveProgress,loadProgress}=await import('../game/missions.mjs');
 const pr=newProgress();pr.world.equipment.turbo='turbo_mk5';
 const reloaded=loadProgress(saveProgress(pr));
 assert.ok(reloaded&&reloaded.world.equipment.turbo==='turbo_mk5');
});

test('progressive turbos deliver noticeably faster race acceleration, boost and corner grip',()=>{
 const runWith=(turboId)=>{
  const s=newRaceV9('ash_docks',{turboId});
  for(let t=0;t<3.1;t+=0.05)tickRaceV9(s,{throttle:0,brake:0,steer:0,nitro:false},0.05);
  s.cars[0].nitro=100;
  let maxSpeed=0,boostTime=0;
  for(let t=0;t<6;t+=0.05){
   tickRaceV9(s,{throttle:1,brake:0,steer:0,nitro:t<0.2},0.05);
   maxSpeed=Math.max(maxSpeed,s.cars[0].speed);
   if(s.cars[0].boost>0)boostTime+=0.05;
  }
  return {distance:s.cars[0].distance,maxSpeed,boostTime,nitroLeft:s.cars[0].nitro};
 };
 const mk1=runWith('turbo_mk1'),mk3=runWith('turbo_mk3'),mk5=runWith('turbo_mk5');
 assert.ok(mk3.maxSpeed>mk1.maxSpeed+40,`mk3 maxSpeed ${mk3.maxSpeed} <= mk1 ${mk1.maxSpeed}`);
 assert.ok(mk5.maxSpeed>mk3.maxSpeed+40,`mk5 maxSpeed ${mk5.maxSpeed} <= mk3 ${mk3.maxSpeed}`);
 assert.ok(mk5.distance>mk3.distance&&mk3.distance>mk1.distance);
 assert.ok(mk5.boostTime>mk3.boostTime&&mk3.boostTime>mk1.boostTime);
 assert.ok(mk5.nitroLeft>mk1.nitroLeft,'mk5 spends less nitro per activation (30 vs 50)');

 // Corner grip test: MK V experiences less outward lateral drift on peak curve at speed
 const cornerDrift=(turboId)=>{
  const s=newRaceV9('aurelia_span',{turboId});
  s.status='racing';s.countdown=0;
  const p=s.cars[0];
  p.distance=6350;p.speed=450;p.x=360;
  tickRaceV9(s,{throttle:1,brake:0,steer:0,nitro:false},0.05);
  return Math.abs(p.x-360);
 };
 assert.ok(cornerDrift('turbo_mk5')<cornerDrift('turbo_mk1'));
});

test('all 7 circuits have curves, advance warnings and mirrored rev: geometry',()=>{
 for(const id of RACE_SERIES_V9){
  const r=RACES_V9[id];
  assert.ok(Array.isArray(r.curves)&&r.curves.length>=3,`${id} missing curves`);
  const c0=r.curves[0];
  const mid=(c0.from+c0.to)/2;
  assert.ok(Math.abs(raceCurveAt(r,mid))>=0.3,`${id} zero curve at midpoint`);
  const warn=raceNextCurve(r,c0.from-300,950);
  assert.ok(warn&&warn.active===false&&warn.dir===c0.dir,`${id} warning mismatch`);
  const inside=raceNextCurve(r,mid,950);
  assert.ok(inside&&inside.active===true&&inside.dir===c0.dir,`${id} active curve mismatch`);
  const rev=RACES_V9['rev:'+id];
  assert.ok(rev&&rev.curves.length===r.curves.length);
  for(const rc of rev.curves){
   assert.ok(rc.from>=0&&rc.to<=rev.length&&rc.from<rc.to);
   const orig=r.curves.find(oc=>Math.abs((r.length-oc.to)-rc.from)<1e-6);
   assert.ok(orig&&rc.dir===-orig.dir,`${id} rev curve not mirrored`);
  }
 }
});

test('driving interludes stay compatible by default and scale cleanly with Vortex turbos',()=>{
 const base=newDrive(0,null);
 assert.equal(base.turbo,undefined);
 for(let i=0;i<60;i++)driveTick(base,{throttle:1,brake:0,steer:0,nitro:true},0.05);
 const boosted=newDrive(0,null,'turbo_mk5');
 assert.equal(boosted.turbo,'turbo_mk5');
 let firedNitro=false;
 for(let i=0;i<60;i++){
  driveTick(boosted,{throttle:1,brake:0,steer:0,nitro:i===5},0.05);
  if(boosted.events.some(e=>e.type==='nitro'&&e.tier===5))firedNitro=true;
 }
 assert.ok(firedNitro,'expected nitro tier 5 event in driving interlude');
 assert.ok(boosted.speed>base.speed+40);
});

test('Act II-IV difficulty scales fairly and cinematic special moves emit full animation state',()=>{
 const a1=newRun('nox',1,'power',null,{},{...CHAPTERS[1],act:1,magic:true,combatV9:true,layout:undefined,start:{x:760,y:900},nodes:[],waves:[['raider']]});
 const a4=newRun('nox',3,'power',null,{},{...CHAPTERS[1],act:4,magic:true,combatV9:true,layout:undefined,start:{x:760,y:900},nodes:[],waves:[['raider']]});
 assert.ok(a4.enemies[0].moveSpeed>a1.enemies[0].moveSpeed);
 assert.ok(a4.enemies[0].recovery<a1.enemies[0].recovery);
 assert.equal(a4.enemies[0].windup,a1.enemies[0].windup);

 // Nox Flurry: 360 rays + ammo refill + moveAnim
 const sFlurry=newRun('nox',2,'power',null,{},{...CHAPTERS[2],act:3,magic:true,combatV9:true,moveSelection:'nox_flurry',layout:undefined,start:{x:760,y:900},nodes:[],waves:[['raider']]});
 sFlurry.arsenal.ammo[sFlurry.arsenal.active]=1;
 sFlurry.enemies[0].x=810;sFlurry.enemies[0].y=900;
 assert.ok(startAttack(sFlurry,'magic',{x:1,y:0}));
 let sawFlurry=false;
 for(let i=0;i<20;i++){
  tick(sFlurry,{move:{x:0,y:0}},0.05);
  if(sFlurry.events.some(e=>e.type==='magic'&&e.moveId==='nox_flurry'&&e.rays===8&&e.r>100))sawFlurry=true;
 }
 assert.ok(sawFlurry);
 assert.ok(sFlurry.moveAnim>0||sFlurry.moveKind==='nox_flurry');
 assert.ok(sFlurry.arsenal.ammo[sFlurry.arsenal.active]>1);

 // Nox Nova: orbLaunch + moveId
 const sNova=newRun('nox',3,'power',null,{},{...CHAPTERS[3],act:4,magic:true,combatV9:true,moveSelection:'nox_nova',layout:undefined,start:{x:760,y:900},nodes:[],waves:[['raider']]});
 sNova.enemies[0].x=900;sNova.enemies[0].y=900;
 assert.ok(startAttack(sNova,'magic',{x:1,y:0}));
 let sawNovaLaunch=false;
 for(let i=0;i<15;i++){
  tick(sNova,{move:{x:0,y:0}},0.05);
  if(sNova.events.some(e=>e.type==='orbLaunch'&&e.moveId==='nox_nova'))sawNovaLaunch=true;
 }
 assert.ok(sawNovaLaunch);

 // Lulu Aegis: invulnerable shield + aegis event
 const sAegis=newRun('lulu',2,'power',null,{},{...CHAPTERS[2],act:3,magic:true,combatV9:true,moveSelection:'lulu_aegis',layout:undefined,start:{x:760,y:900},nodes:[],waves:[['raider']]});
 sAegis.enemies[0].x=820;sAegis.enemies[0].y=900;
 assert.ok(startAttack(sAegis,'magic',{x:1,y:0}));
 let sawAegis=false;
 for(let i=0;i<15;i++){
  tick(sAegis,{move:{x:0,y:0}},0.05);
  if(sAegis.events.some(e=>e.type==='aegis'&&e.moveId==='lulu_aegis'&&e.r>=180))sawAegis=true;
 }
 assert.ok(sawAegis&&sAegis.inv>=1.0);

 // Lulu Supernova: chain lightning + heal
 const sSup=newRun('lulu',3,'power',null,{},{...CHAPTERS[3],act:4,magic:true,combatV9:true,moveSelection:'lulu_supernova',layout:undefined,start:{x:760,y:900},nodes:[],waves:[['raider','shooter']]});
 sSup.hp=Math.max(1,sSup.maxHp-2);
 const prevHp=sSup.hp;
 sSup.enemies[0].x=840;sSup.enemies[0].y=900;
 sSup.enemies[1].x=880;sSup.enemies[1].y=920;
 assert.ok(startAttack(sSup,'magic',{x:1,y:0}));
 let sawSup=false;
 for(let i=0;i<15;i++){
  tick(sSup,{move:{x:0,y:0}},0.05);
  if(sSup.events.some(e=>e.type==='supernova'&&e.moveId==='lulu_supernova'&&e.hits.length>=1))sawSup=true;
 }
 assert.ok(sawSup&&sSup.hp>prevHp);
});

test('all turbo names, shorts, descriptions and dynamic UI prompts translate cleanly to English',()=>{
 for(const t of TURBO_TIERS){
  assert.notEqual(translateText(t.name,'en'),t.name,t.name);
  assert.notEqual(translateText(t.desc,'en'),t.desc,t.desc);
  assert.ok(Object.hasOwn(EN_TEXT,t.short),t.short);
  translateText(t.short,'en');
  assert.notEqual(translateText('Nuovo Turbo sbloccato: '+t.name,'en'),'Nuovo Turbo sbloccato: '+t.name);
  assert.notEqual(translateText('Assetto Vortex: '+t.short,'en'),'Assetto Vortex: '+t.short);
 }
 for(const s of ['◀ CURVA SX','CURVA DX ▶','SORPASSO!','SINGOLARITÀ','ÉGIDA','Assetto Vortex','Mossa speciale sbloccata: Singolarità dell’Asse','Mossa attiva: Coro Supernova']){
  assert.notEqual(translateText(s,'en'),s,s);
 }
 assert.deepEqual(localeStatus().untranslated,[]);
});
