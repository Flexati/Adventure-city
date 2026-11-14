// R23 (D69): what the review of the market arsenal, the special moves, the turbo stages and the curves fixed, kept fixed.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CAMPAIGN,FOOT,buildMission} from '../game/missions.mjs';
import {newRun} from '../game/campaign.mjs';
import {HUBS,HUB_ITEMS,hubCatalog} from '../game/hubs.mjs';
import {HERO_MOVES,MARKET_WEAPON_IDS,WEAPONS_V9} from '../game/weapons-v9.mjs';
import {TURBO_TIERS,MARKET_GEAR_ITEMS} from '../game/arsenal-data.mjs';
import {RACES_V9,newRaceV9,tickRaceV9,racePilot,raceResultV9} from '../game/racing-v9.mjs';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8');
test('no special move is dead content: each one can be cast in at least one mission of its hero',()=>{
 const seen={nox:new Set(),lulu:new Set()};
 for(const st of CAMPAIGN){if(!FOOT[st.id])continue;const c=buildMission(st.id,{}),s=newRun(c.pov||'nox',c.map,'power',null,null,c);for(const m of s.moves)seen[s.hero].add(m);}
 for(const hero of ['nox','lulu'])assert.deepEqual([...seen[hero]].sort(),HERO_MOVES[hero].map(m=>m.id).sort(),hero);
 const count=id=>CAMPAIGN.filter(st=>FOOT[st.id]).filter(st=>{const c=buildMission(st.id,{});return newRun(c.pov||'nox',c.map,'power',null,null,c).moves.includes(id);}).length;
 assert.ok(count('lulu_supernova')>=2,'Lulù keeps her fourth move for at least two missions');assert.ok(count('nox_nova')>=3,'Nox keeps his for at least three');
});
test('every market weapon, gear and paid turbo is on sale somewhere, and every shelf holds real items',()=>{
 const sold=new Set();
 for(const [id,h] of Object.entries(HUBS))for(const service of h.services)for(const item of hubCatalog(id,service)){assert.ok(HUB_ITEMS[item],`${id}/${service}: ${item} exists`);sold.add(item);}
 for(const id of [...MARKET_WEAPON_IDS,...Object.keys(MARKET_GEAR_ITEMS),...TURBO_TIERS.filter(t=>t.price>0).map(t=>t.id)])assert.ok(sold.has(id),id+' is sold in at least one village');
 for(const id of ['moon','cathedral','toxic','clockwork'])for(const base of ['coil','resonator','vest'])assert.ok(hubCatalog(id,'smith').includes(base),`${id} smith still sells ${base}`);
});
test('market weapons stay in the band of the kit weapons (sustained damage per second, one target)',()=>{
 const sustained=w=>{const perTrigger=w.damage*w.burst*(w.pellets||1),triggers=Math.floor(w.magazine/w.burst);return perTrigger*triggers/(triggers*w.cooldown+w.reload);};
 const kit=Math.max(sustained(WEAPONS_V9.vx9),sustained(WEAPONS_V9.r12));
 for(const id of MARKET_WEAPON_IDS)assert.ok(sustained(WEAPONS_V9[id])<=kit*1.35,`${id}: ${sustained(WEAPONS_V9[id]).toFixed(2)} against ${kit.toFixed(2)} of the kit`);
});
test('every circuit is finished by the pilot with every turbo stage, with finite numbers, and a higher stage is not slower',()=>{
 const drive=(id,turboId)=>{const s=newRaceV9(id,{turboId});let n=0;
  while(['countdown','racing'].includes(s.status)&&n++<60*400){const p=s.status==='countdown'?{throttle:0}:racePilot(s,s.cars[0]);tickRaceV9(s,p,1/60);
   for(const c of s.cars)for(const k of ['x','distance','speed','vx'])assert.ok(Number.isFinite(c[k]),`${id} ${turboId}: ${k} stays finite`);}
  assert.ok(!['countdown','racing'].includes(s.status),`${id} ${turboId}: the race ends (${s.status})`);
  // In Elimination being dropped at a gate is a legitimate ending; everywhere else the pilot must cross the line.
  const r=raceResultV9(s);if(!id.startsWith('elim:'))assert.ok(r&&Number.isFinite(r.time),`${id} ${turboId}: the race ends with a result (${s.status})`);return r?.time??null;};
 for(const id of Object.keys(RACES_V9)){const t1=drive(id,'turbo_mk1'),t5=drive(id,'turbo_mk5');for(const t of ['turbo_mk2','turbo_mk3','turbo_mk4'])drive(id,t);if(t1!=null&&t5!=null)assert.ok(t5<=t1+.5,`${id}: MK V ${t5.toFixed(1)} s, MK I ${t1.toFixed(1)} s`);}
});
test('the first race keeps the D64 obstacles together with its curves',()=>{
 const d=RACES_V9.ash_docks;assert.equal(d.hazards.length,8);assert.equal(d.pads.length,4);assert.ok(d.curves.length>=3);assert.ok(d.hazards.some(h=>h.kind==='slick')&&d.hazards.some(h=>h.moving));
});
test('boss stages keep their hand-tuned pace; the legacy moves keep their aim reach',()=>{
 const src=read('game/campaign.mjs');
 assert.match(src,/actScale=c\.boss\?0:/);assert.match(src,/s\.c\?\.boss\?0:Math\.max\(0,\(s\.c\?\.act/);
 assert.match(src,/\['beam','cone'\]\.includes\(move\.kind\)\?420:/);
});
test('a line spoken inside a shop shows above the shop; rejected VFX sheets are not requested; en.js is English only',()=>{
 assert.match(read('game/runtime.mjs'),/\$\('talk'\)\.classList\.toggle\('over-interior',!\$\('interior'\)\.hidden\)/);
 assert.match(read('game/style.css'),/#talk\.over-interior\{z-index:16\}/);
 assert.ok(!/vfx_h17|vfx_arc7/.test(read('game/runtime.mjs')));
 // The drive state holds the turbo as an id: reading `.id` of it always fell back to MK I (label, jets, nitro gauge).
 assert.ok(!/d\.turbo\.id|turbo\?\.id/.test(read('game/runtime.mjs')));
 assert.match(read('game/runtime.mjs'),/ if\(result\)notice\([^\n]+\n if\(newTurbo\)notice\(/,'the race result is announced even when a turbo unlocks');
 const py=read('tools/prepare_android_assets.py');assert.match(py,/\(DEST\/'en\.js'\)\.write_text\('\\n'\.join\(\(story_en,world_en,interiors_en,runtime_en\)\)\)/);
});
