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
  boss.hp=boss.max;boss.guard=0;boss.weakExposed=1.5;boss.state='walk';
  s.status='playing';s.hp=s.maxHp;s.x=boss.x;s.y=boss.y+80;s.fireCd=0;s.action=null;s.arsenal=null;
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

test('DIFETTO 2: runtime.mjs caches ropePattern instead of recreating CanvasPattern every frame',()=>{
 const src=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
 assert.ok(src.includes('let ropeTile=null,ropePattern=null;'),'ropePattern cache declaration missing');
 assert.ok(src.includes("if(!ropePattern)ropePattern=ctx.createPattern(ropeTile,'repeat');"),'ropePattern lazy initialization missing');
});

test('DIVERSIFICAZIONE: 45 unique shopkeepers, Oren only in moon.inn, no canon portrait duplicated, 56 street inhabitants diversified',async()=>{
 const {INTERIORS,NPC_PORTRAIT,interiorFor,interiorAsk}=await import('../game/interiors.mjs');
 const {HUBS,hubPoints}=await import('../game/hubs.mjs');
 const names=[],orenRooms=[];
 for(const [hubId,services] of Object.entries(INTERIORS)){
  for(const [svc,def] of Object.entries(services)){
   names.push(def.npc);
   const sc=interiorFor(hubId,hubPoints(hubId).find(p=>p.kind==='service'&&p.service===svc));
   if(sc.portrait==='art/npc/oren.jpg')orenRooms.push(`${hubId}.${svc}`);
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

