import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {createRequire} from 'node:module';
import {CHRONO_FOES,chronoEnemySheet,chronoAnimation,chronoFrame,ChronoArtBank} from '../game/chrono-art.mjs';
import {CHAPTERS as CAMPAIGN} from '../game/campaign.mjs';
const {PNG}=createRequire(import.meta.url)('pngjs');
const full=JSON.parse(fs.readFileSync('game/art/chrono/manifest.json'));
const IN=['mech_hound','striker_unit','chrono_drone','ghoul_runner','toxic_brawler','toxic_bomber','plague_cultist_caster','skeleton_swordsman','iron_penitent','flame_alchemist','skeleton_shield_bearer'];
// D45: the author approved the reserve sheets and left the choice to Claude. Hero-like figures, the NPC-only guard and the
// one-frame boss rows stay out (canon: only Nox and Lulù lead; bosses keep their canon art).
const OUT=['gate_guard','valkyrie_striker','chrono_huntress','desert_chrono_fighter','demon_hunter_survivor','shadow_reaper','cathedral_bone_tyrant','toxic_forge_behemoth','crawling_corpse'];
test('D45: each family role gets its own sheet; the gang keeps its legacy art; excluded sheets never enter',()=>{
 assert.deepEqual(Object.values(CHRONO_FOES).flatMap(f=>Object.values(f)).sort(),[...IN].sort());
 assert.deepEqual(CHRONO_FOES[0],{},'Blackout gang unchanged');
 for(const kind of [1,2,3]){const roles=CAMPAIGN[kind].waves.flat(),sheets=new Set(roles.map(r=>chronoEnemySheet(kind,r)||'legacy'));
  for(const r of new Set(roles))if(CHRONO_FOES[kind][r])assert.equal(chronoEnemySheet(kind,r),CHRONO_FOES[kind][r]);
  assert.ok(sheets.size>=3,'kind '+kind+': at least three silhouettes in the waves, got '+[...sheets]);}
 assert.equal(chronoEnemySheet(3,'signal'),'purple_guard');assert.equal(chronoEnemySheet(1,'brute'),null);
 const src=fs.readFileSync('game/chrono-art.mjs','utf8')+fs.readFileSync('tools/prepare_android_assets.py','utf8')+fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java','utf8');
 for(const id of OUT)assert.ok(!src.includes(id),id+' must stay out of the game');
 for(const id of IN)assert.ok(fs.readFileSync('tools/prepare_android_assets.py','utf8').includes(`'${id}'`),id+' packaged');
});
test('D45: generated frames equal the delivered manifest and fit the real PNGs with clear gutters',()=>{
 for(const id of IN){const im=PNG.sync.read(fs.readFileSync('game/art/chrono/'+id+'.png'));
  for(const a of full.animations.filter(a=>a.character_id===id)){const b=chronoAnimation(id,a.animation_id);assert.ok(b,id+'/'+a.animation_id);
   assert.deepEqual(b.frame_rectangles,a.frame_rectangles.map(({x,y,width,height})=>({x,y,width,height})));
   for(const k of ['frame_count','loop','pivot_x','pivot_y','sprite_height'])assert.equal(b[k],a[k],id+' '+k);assert.ok(Math.abs(b.fps-a.fps)<1e-9);
   for(const r of b.frame_rectangles){assert.ok(r.x+r.width<=im.width&&r.y+r.height<=im.height);for(let x=0;x<r.width;x++)assert.equal(im.data[(r.y*im.width+r.x+x)*4+3],0,id+' top gutter');}}
  for(const pose of ['idle','walk','anticipation','attack','recover','hurt','defeat'])assert.ok(chronoFrame(chronoAnimation(id,pose),.3),id+' has pose '+pose);
 }
});
test('D45: missions decode their family sheets; hubs and the gang district do not',async()=>{
 const bank=new ChronoArtBank({imageFactory:()=>({naturalWidth:8,set src(v){this.url=v;if(v)queueMicrotask(()=>this.onload());},get src(){return this.url;}})});
 await bank.prepare(2);assert.deepEqual(bank.status().decoded.sort(),['effects','environment',...Object.values(CHRONO_FOES[2])].sort());
 assert.equal(bank.get('ghoul_runner').src,'art/chrono/ghoul_runner.png');
 await bank.prepare(2,false,[],false);assert.deepEqual(bank.status().decoded.sort(),['effects','environment']);
 await bank.prepare(0);assert.deepEqual(bank.status().decoded.sort(),['effects','environment']);
 assert.match(fs.readFileSync('game/runtime.mjs','utf8'),/chronoArt\.prepare\(h\.district,false,npcAssets,false\)/);
});
