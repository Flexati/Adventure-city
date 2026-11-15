import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {chronoFrame,drawChronoFrame,ChronoArtBank,chronoEnemyPose} from '../game/chrono-art.mjs';
import {newRun,tick} from '../game/campaign.mjs';
const {PNG}=createRequire(import.meta.url)('pngjs');
const manifest=JSON.parse(fs.readFileSync('game/art/chrono/manifest.json'));
test('Chrono frame rectangles fit actual RGBA atlases and actor frames have clear gutters and a ground pivot',()=>{
 const images=new Map(Object.entries(manifest.atlases).map(([id,a])=>[id,PNG.sync.read(fs.readFileSync('game/'+a.path))]));
 for(const im of images.values())assert.ok(im.width<=2048&&im.height<=2048,'mobile atlas dimension budget');
 for(const a of manifest.animations){const im=images.get(a.atlas_reference);assert.equal(a.frame_count,a.frame_rectangles.length);assert.ok(a.fps>0);assert.ok(a.pivot_x>=0&&a.pivot_x<a.sprite_width);for(const r of a.frame_rectangles){assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=im.width&&r.y+r.height<=im.height);let count=0;for(let y=0;y<r.height;y++)for(let x=0;x<r.width;x++){const alpha=im.data[((r.y+y)*im.width+r.x+x)*4+3];if(alpha)count++;if(x===0||y===0||x===r.width-1||y===r.height-1)assert.equal(alpha,0,a.character_id+' frame gutter');}assert.ok(count>20,a.character_id+' empty frame');}}
});
test('Every requested NPC and enemy has a complete state sheet with genuinely distinct locomotion frames',()=>{
 const ids=['skeleton_swordsman','skeleton_shield_bearer','ghoul_runner','crawling_corpse','plague_cultist_caster','toxic_mutant_zombie','chrono_drone','purple_guard','mech_hound','toxic_bomber','flame_alchemist','striker_unit','merchant','gate_guard','blacksmith','potion_alchemist','relic_priestess','innkeeper','mechanic','masked_informant','scavenger_kid','traveling_bard','civilian'];
 assert.ok(!manifest.rejections?.length,'rejected generations must be repaired before delivery');
 for(const id of ids){const atlas=manifest.atlases[id];assert.equal(atlas.frame_count,24,id+' state sheet');const im=PNG.sync.read(fs.readFileSync('game/'+atlas.path)),walk=manifest.animations.find(a=>a.character_id===id&&a.animation_id==='walk');assert.equal(walk.frame_count,4);const hashes=walk.frame_rectangles.map(r=>{const h=createHash('sha256');for(let y=0;y<r.height;y++)h.update(im.data.subarray(((r.y+y)*im.width+r.x)*4,((r.y+y)*im.width+r.x+r.width)*4));return h.digest('hex');});assert.ok(new Set(hashes).size>=2,id+' locomotion must not be a repeated static frame');assert.deepEqual(manifest.animations.find(a=>a.character_id===id).collision_box,{x:-16,y:-10,width:32,height:20,space:'world',source:'campaign.mjs moveActor(): x +/-16, y +/-10; anchor is actor XY ground point'});}
});
test('Metadata frames support arbitrary counts, clamp one-shots and respect fixed reduced-motion frames',()=>{
 const a=manifest.animations.find(a=>a.character_id==='merchant'&&a.animation_id==='walk');assert.equal(a.frame_count,4);assert.deepEqual(chronoFrame(a,20),a.frame_rectangles[Math.floor(20*a.fps)%a.frame_count]);assert.deepEqual(chronoFrame(a,20,true),a.frame_rectangles[0]);const defeat=manifest.animations.find(a=>a.character_id==='skeleton_swordsman'&&a.animation_id==='defeat');assert.deepEqual(chronoFrame(defeat,100),defeat.frame_rectangles.at(-1));
});
test('Drawing uses authored pivot and mirroring without changing collision or damage state',()=>{
 const calls=[],g={save(){},restore(){},translate(...v){calls.push(['translate',...v]);},scale(...v){calls.push(['scale',...v]);},drawImage(...v){calls.push(['draw',...v]);}},a=manifest.animations.find(a=>a.character_id==='merchant');assert.ok(drawChronoFrame(g,{width:1536},a,0,100,200,128,true));assert.deepEqual(calls[0],['translate',100,200]);assert.deepEqual(calls[1],['scale',-1,1]);assert.equal(calls[2][6],-a.pivot_x);assert.equal(calls[2][7],-a.pivot_y);
});
test('District bank preloads Archon, retires old decoded actors and clears all references',async()=>{
 const created=[],bank=new ChronoArtBank({imageFactory:()=>{const im={naturalWidth:128,naturalHeight:128,set src(v){this.url=v;if(v)queueMicrotask(()=>this.onload());},get src(){return this.url;}};created.push(im);return im;}});
 await bank.prepare(3,true);assert.ok(bank.get('chrono_overlord'));await bank.prepare(0);assert.equal(bank.get('chrono_overlord'),undefined);assert.ok(created.some(im=>im.src===''));assert.deepEqual(bank.status().decoded.sort(),['effects','environment','gang_breaker','gang_shooter','gang_signal']);bank.clear();assert.equal(bank.status().decodedBytes,0);
});
test('Visual poses preserve anticipation, release and recovery timing from live AI states',()=>{
 const e={hp:2,state:'warn',clock:.4,windup:1,walk:2};assert.equal(chronoEnemyPose(e).name,'anticipation');e.state='recover';e.clock=.05;assert.equal(chronoEnemyPose(e).name,'attack');e.clock=.3;assert.equal(chronoEnemyPose(e).name,'recover');e.hp=0;e.deathAnim=.35;assert.equal(chronoEnemyPose(e).name,'defeat');assert.equal(chronoEnemyPose(e).elapsed,.35);
 assert.equal(chronoEnemyPose({hp:2,state:'warn',clock:.75,windup:1.5}).progress,.5,'half of an actual long windup must remain half of the visual anticipation');
});
test('Support fire cannot finish a boss; a player attack releases the defeat animation',()=>{
 const s=newRun('nox',3),boss=s.enemies.find(e=>e.boss);for(const e of s.enemies)if(!e.boss)e.hp=0;
 boss.hp=1;boss.state='walk';boss.x=s.x+100;boss.y=s.y;s.inv=100;s.partner.x=s.x-30;s.partner.y=s.y;s.partner.cd=0;
 tick(s,{},.05);assert.equal(boss.hp,1,'automatic partner shot must leave final HP to player');
 for(let i=0;i<8&&boss.hp>0;i++)tick(s,{gun:true,aim:{x:1,y:0}},.05);
 assert.equal(boss.hp,0);assert.ok(boss.deathAnim>0);assert.ok(s.kills>0);
});
