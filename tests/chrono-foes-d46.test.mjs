import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import {CHRONO_FOES,CHRONO_STEP_FOES,chronoEnemySheet,chronoEnemyHeight,chronoAnimation,chronoFrame,ChronoArtBank} from '../game/chrono-art.mjs';
import {CHAPTERS} from '../game/campaign.mjs';import {FOOT as MISSION_DEFS} from '../game/missions.mjs';import {HUBS} from '../game/hubs.mjs';
const {PNG}=createRequire(import.meta.url)('pngjs');
const full=JSON.parse(fs.readFileSync('game/art/chrono/manifest.json'));
// D45-D46: the author approved all twenty reserve sheets and left the placement to Claude.
const FOES=['mech_hound','striker_unit','chrono_drone','ghoul_runner','toxic_brawler','toxic_bomber','plague_cultist_caster','skeleton_swordsman','iron_penitent','flame_alchemist','skeleton_shield_bearer',
 'valkyrie_striker','chrono_huntress','demon_hunter_survivor','desert_chrono_fighter','crawling_corpse','cathedral_bone_tyrant','toxic_forge_behemoth','shadow_reaper'];
const missions=[...CHAPTERS.map(c=>[c.id,c]),...Object.entries(MISSION_DEFS)].filter(([,d])=>d.waves?.length);
const castOf=(id,d)=>{const m={};for(const r of new Set(d.waves.flat().map(r=>typeof r==='string'?r:r.role)))m[r]=chronoEnemySheet(d.kind,r,id);return m;};
test('D46: every reserve enemy sheet fights somewhere, one sheet keeps one role, the gate guard lives in the Cathedral Quarter',()=>{
 const seen=new Map();
 for(const [id,d] of missions)for(const [role,sheet] of Object.entries(castOf(id,d)))if(sheet){if(seen.has(sheet))assert.equal(seen.get(sheet),role,sheet+' changes role in '+id);seen.set(sheet,role);}
 for(const id of FOES)assert.ok(seen.has(id),id+' never appears in a mission');
 assert.ok(HUBS.cathedral.people.some(p=>p[2]==='gate_guard'));
 assert.deepEqual(castOf('blackout',CHAPTERS[0]),Object.fromEntries(Object.keys(castOf('blackout',CHAPTERS[0])).map(r=>[r,null])),'the Blackout gang keeps its own art');
 const src=fs.readFileSync('tools/prepare_android_assets.py','utf8'),routes=fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java','utf8');
 for(const id of [...FOES,'gate_guard']){assert.ok(src.includes(`'${id}'`),id+' packaged');assert.ok(routes.includes(id),id+' routed');}
});
test('D46: new faces are spread over the campaign: each Act III route meets four, the finale shows the reaper to both',()=>{
 const faces=ids=>new Set(ids.flatMap(id=>Object.values(castOf(id,missions.find(m=>m[0]===id)[1])).filter(Boolean)));
 const actII=faces(['breach','contagion','zero']);
 const nox=[...faces(['below','archive','ascent'])].filter(x=>!actII.has(x)),lulu=[...faces(['exp_chalk_marks','city','port','line'])].filter(x=>!actII.has(x));
 assert.equal(nox.length,4,'Nox route: '+nox);assert.equal(lulu.length,4,'Lulù route: '+lulu);
 assert.equal(chronoEnemySheet(3,'brute','finale'),'shadow_reaper');
 for(const [id,d] of missions){const cast=castOf(id,d);if(d.kind!==0)assert.ok(new Set(Object.values(cast).map(s=>s||'legacy')).size>=Math.min(3,Object.keys(cast).length),id+' needs distinct silhouettes');}
});
test('D46: generated frames equal the delivered manifest, fit the PNGs, cover every pose; figures share one world size',()=>{
 for(const id of [...FOES,'gate_guard']){const im=PNG.sync.read(fs.readFileSync('game/art/chrono/'+id+'.png'));
  for(const a of full.animations.filter(a=>a.character_id===id&&['idle','walk','anticipation','attack','recover','hurt','defeat','special'].includes(a.animation_id))){const b=chronoAnimation(id,a.animation_id);assert.ok(b,id+'/'+a.animation_id);
   assert.deepEqual(b.frame_rectangles.map(({x,y,width,height})=>({x,y,width,height})),a.frame_rectangles.map(({x,y,width,height})=>({x,y,width,height})),id+'/'+a.animation_id);
   for(const k of ['frame_count','pivot_x','pivot_y','sprite_height'])assert.equal(b[k],a[k],id+' '+k);
   for(const r of b.frame_rectangles){assert.ok(r.x+r.width<=im.width&&r.y+r.height<=im.height);for(let x=0;x<r.width;x++)assert.equal(im.data[(r.y*im.width+r.x+x)*4+3],0,id+' top gutter');}}
  if(id!=='gate_guard')for(const pose of ['idle','walk','anticipation','attack','recover','hurt','defeat'])assert.ok(chronoFrame(chronoAnimation(id,pose),.3),id+' has pose '+pose);
  // Opaque figure height in the idle frame, drawn at chronoEnemyHeight: 72 world px, 92 for brutes (±3).
  const r=chronoAnimation(id,'idle').frame_rectangles[0];let top=r.height;for(let y=0;y<r.height;y++)for(let x=0;x<r.width;x++)if(im.data[((r.y+y)*im.width+r.x+x)*4+3]>40){top=Math.min(top,y);break;}
  if(!['crawling_corpse','gate_guard'].includes(id))for(const brute of [false,true])assert.ok(Math.abs((120-top)*chronoEnemyHeight(id,brute)/128-(brute?92:72))<=3,id+' world height');
 }
});
test('D46: a mission decodes its own cast; hubs, the gang district and the escape from the Axis decode none',async()=>{
 const bank=new ChronoArtBank({imageFactory:()=>({naturalWidth:8,set src(v){this.url=v;if(v)queueMicrotask(()=>this.onload());},get src(){return this.url;}})});
 await bank.prepare(3,false,[],'below');assert.deepEqual(bank.status().decoded.sort(),['cathedral_bone_tyrant','crawling_corpse','effects','environment','flame_alchemist','iron_penitent','plague_cultist_caster','purple_guard','skeleton_shield_bearer','skeleton_swordsman'].sort());
 assert.equal(bank.get('crawling_corpse').src,'art/chrono/crawling_corpse.png');
 await bank.prepare(0,false,[],'city');assert.deepEqual(bank.status().decoded.sort(),['demon_hunter_survivor','desert_chrono_fighter','effects','environment']);
 await bank.prepare(2,false,[],false);assert.deepEqual(bank.status().decoded.sort(),['effects','environment']);
 const rt=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(rt,/chronoArt\.prepare\(h\.district,false,npcAssets,false\)/);assert.match(rt,/chronoArt\.prepare\(3,true,\[\],false\)/);assert.match(rt,/\],step\.id\);/);
});
test('D47: every original chrono cue ships and has a moment; every non-human reserve enemy has a fall sound',async()=>{
 const {chronoFoeFall}=await import('../game/chrono-art.mjs');
 const files=fs.readdirSync('game/audio/chrono').filter(f=>f.endsWith('.ogg')).map(f=>f.slice(0,-4));
 const pack=fs.readFileSync('tools/prepare_android_assets.py','utf8'),routes=fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java','utf8'),rt=fs.readFileSync('game/runtime.mjs','utf8')+fs.readFileSync('game/chrono-art.mjs','utf8')+fs.readFileSync('game/audio-engine.mjs','utf8');
 for(const n of files){assert.ok(pack.includes(`'${n}'`),n+' packaged');assert.match(routes,new RegExp(`audio/chrono/\\([^)]*\\b${n}\\b`),n+' routed');assert.ok(rt.includes(`'${n}'`),n+' is played somewhere');}
 const HUMANS=['valkyrie_striker','chrono_huntress','demon_hunter_survivor','desert_chrono_fighter'];
 for(const id of FOES)assert.equal(!!chronoFoeFall(id),!HUMANS.includes(id),id+' fall cue');
 assert.equal(chronoFoeFall('skeleton_swordsman'),'bone_break');assert.equal(chronoFoeFall('mech_hound'),'gear_break');assert.equal(chronoFoeFall('toxic_bomber'),'toxic_splash');
 // Cues travel on events only: the combat payloads gain the enemy id, nothing else in campaign.mjs changes.
 const camp=fs.readFileSync('game/campaign.mjs','utf8');assert.match(camp,/campaignEvent\(s,'enemyAttack',\{id:e\.id,/);assert.match(camp,/campaignEvent\(s,'enemyShot',\{id:e\.id,x:e\.x,y:e\.y\}/);
});
