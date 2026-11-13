import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {newRun,tick,resumeAtBoss} from '../game/campaign.mjs';
import {FOOT,CAMPAIGN,buildMission} from '../game/missions.mjs';
import {STORY,BARKS} from '../game/story-v08.mjs';
import {EN_TEXT} from '../game/locale.mjs';

test('BLOCCO B: 4 new bosses (vega, reaper, tyrant, behemoth) have 3 moves, 3 phases, and weak points',()=>{
 for(const [missionId,kind] of [['vega','vega'],['glass_reaper','reaper'],['bone_tyrant','tyrant'],['forge_behemoth','behemoth']]){
  const def=buildMission(missionId,{});
  const s=newRun(def.pov,0,'power',null,null,def);
  resumeAtBoss(s);
  const boss=s.enemies.find(e=>e.boss);
  assert.ok(boss,`missing boss for ${missionId}`);
  assert.equal(boss.bossKind,kind);
  boss.state='recover';boss.clock=.4;
  for(const [hpFrac,expectedPhase] of [[.9,0],[.6,1],[.25,2]]){
   boss.hp=Math.ceil(boss.max*hpFrac);
   for(let i=0;i<240;i++){s.inv=99;s.hp=s.maxHp;s.status='playing';tick(s,{x:0,y:0},1/30);}
   assert.equal(boss.phase,expectedPhase,`${kind} should transition to phase ${expectedPhase}`);
  }
  s.enemies=[boss];s.mines=[];s.shots=[];boss.hp=boss.max;boss.guard=0;boss.weakExposed=1.5;boss.state='stun';boss.stun=3;boss.clock=0;
  s.status='playing';s.hp=s.maxHp;s.x=def.start.x;s.y=def.start.y;boss.x=s.x;boss.y=s.y-60;s.fireCd=0;s.action=null;s.arsenal=null;
  const hpBefore=boss.hp,ev=[];
  for(let i=0;i<8;i++){tick(s,i===0?{gun:true,aim:{x:0,y:-1}}:{},1/30);ev.push(...s.events);}
  assert.ok(boss.hp<hpBefore,`${kind} should take damage when weak point is exposed`);
  assert.ok(ev.some(e=>e.type==='weakHit'),`${kind} should emit weakHit when hit during weakExposed`);
 }
});

test('BLOCCO A: 13 R20 stages have expanded waves, midEvent, end scenes, BARKS, and English translations',()=>{
 const ids=['docks_veyra','app_breach','bone_tyrant','app_clinic','app_node','app_yard','forge_behemoth','app_port','glass_flood','glass_reaper','vega','app_archive','app_axis'];
 for(const id of ids){
  const f=FOOT[id];
  const step=CAMPAIGN.find(c=>c.id===id);
  assert.ok(f.midEvent,`${id} must have a midEvent`);
  assert.ok(STORY[f.midEvent.lines]?.length>=3,`${id} midEvent story must have >=3 lines`);
  assert.equal(step.post,`${id}_end`,`${id} must have post scene ${id}_end`);
  assert.ok(STORY[`${id}_end`]?.length>=2,`${id}_end must have >=2 lines`);
  assert.ok(BARKS[id],`${id} must have BARKS`);
  if(id!=='vega')assert.ok(f.waves.length>=4,`${id} must have >=4 waves`);
  for(const block of [STORY[`${id}_pre`],STORY[f.midEvent.lines],STORY[`${id}_end`]]){
   for(const line of block){
    if(line.text)assert.ok(EN_TEXT[line.text],`Missing EN translation for: ${line.text}`);
   }
  }
 }
});

test('DIFETTO 2 (R21): the ropes of The Anchor are one pre-drawn strip, no canvas pattern is built or filled per frame',()=>{
 const src=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
 assert.ok(src.includes('let ropeStrip=null;const ROPE_TILES=20;'));assert.ok(src.includes('ctx.drawImage(ropeStrip,0,off,20,need,0,off,20,need);'));
 assert.ok(!src.includes('createPattern'),'no CanvasPattern anywhere in the runtime');
});
test('R21: the adaptive resolution also reacts to missed frames, not only to script cost',()=>{
 const src=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
 assert.ok(src.includes('const late=cost>10||gap>25&&gap<250?1:0;'));assert.ok(src.includes('if(qualitySlow>=3&&renderQuality>1){renderQuality=Math.max(1,renderQuality-.5);'));
});
test('R21: every village family has its four painted buildings, packaged and routed; flat boxes are only the fallback',async()=>{
 const {VILLAGE_HOUSES}=await import('../game/village-houses.mjs'),{villageFamily}=await import('../game/village-art.mjs'),{HUBS}=await import('../game/hubs.mjs');
 assert.equal(VILLAGE_HOUSES.length,4);for(const fam of VILLAGE_HOUSES){assert.equal(fam.length,4);for(const [w,h] of fam)assert.ok(w>100&&w<=512&&h>100&&h<=512);}
 const routes=fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java','utf8'),prep=fs.readFileSync('tools/prepare_android_assets.py','utf8');
 for(const n of ['moon','cathedral','toxic','clockwork']){assert.ok(fs.statSync('game/art/v10/case_'+n+'.webp').size>50000,n);assert.ok(prep.includes("'case_%s.webp'"));}
 assert.ok(routes.includes('case_(moon|cathedral|toxic|clockwork)'));
 for(const id of Object.keys(HUBS))assert.ok([0,1,2,3].includes(villageFamily(id)),id);
 const reg=JSON.parse(fs.readFileSync('assets/production/v10.3/derived/REGISTRO_ARGON_CASE_20261113.json','utf8'));assert.equal(reg.derivati.length,4);for(const d of reg.derivati)assert.match(d.sha256_originale,/^[0-9a-f]{64}$/);
});

test('DIVERSIFICAZIONE: 45 unique shopkeepers, Oren only in moon.inn, no canon portrait duplicated, 56 street inhabitants diversified',async()=>{
 const {INTERIORS,NPC_PORTRAIT,interiorFor,interiorAsk}=await import('../game/interiors.mjs');
 const {HUBS,hubPoints}=await import('../game/hubs.mjs');
 const names=[],orenRooms=[];
 for(const [hubId,services] of Object.entries(INTERIORS)){
  for(const [svc,def] of Object.entries(services)){
   names.push(def.npc);
   const sc=interiorFor(hubId,hubPoints(hubId).find(p=>p.kind==='service'&&p.service===svc));
   if(sc.portrait==='art/npc/oren.png')orenRooms.push(`${hubId}.${svc}`);
  }
 }
 assert.equal(names.length,45);
 assert.equal(new Set(names).size,45,'Every shopkeeper across all 14 villages must have a unique identity');
 assert.deepEqual(orenRooms,['moon.inn'],'Oren must only be innkeeper in Moon Refuge');
 const assignedPortraits=Object.values(NPC_PORTRAIT).flatMap(s=>Object.values(s));
 assert.equal(new Set(assignedPortraits).size,assignedPortraits.length,'No named character portrait in NPC_PORTRAIT is cloned across villages');
 for(const hubId of Object.keys(HUBS)){
  const people=hubPoints(hubId).filter(p=>p.kind==='person');
  assert.equal(people.length,4,`${hubId} has 4 street inhabitants`);
  const stories=people.map(p=>{const sc=interiorFor(hubId,p);return `${sc.line}|${interiorAsk(sc,{},0)}|${interiorAsk(sc,{},1)}`;});
  assert.equal(new Set(stories).size,4,`All 4 street inhabitants in ${hubId} must tell distinct stories`);
 }
});

