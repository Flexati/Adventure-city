import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {execFileSync} from 'node:child_process';
import {CHRONO_MANIFEST} from '../game/chrono-manifest.mjs';
import {chronoAnimation,chronoFrame} from '../game/chrono-art.mjs';
// Q3 weight plan: the APK copy of CHRONO_MANIFEST drops documentation fields. Every value the game reads must be identical.
execFileSync('python3',['tools/prepare_android_assets.py'],{stdio:'pipe'});
const app=fs.readFileSync('android/build/assets/game/app.js','utf8');
const line=app.split('\n').find(l=>l.startsWith('const CHRONO_MANIFEST='));
const lean=new Function(line+';return CHRONO_MANIFEST;')();
const READ=['frame_count','fps','loop','sprite_height','pivot_x','pivot_y','frame_rectangles','draw_height'];

test('Q3: every animation resolves to the same frames, pivots and timing in the lean APK manifest',()=>{
 assert.equal(lean.animations.length,CHRONO_MANIFEST.animations.length);
 for(const full of CHRONO_MANIFEST.animations){
  const id=full.character_id,name=full.animation_id,a=chronoAnimation(id,name,lean),b=chronoAnimation(id,name);
  assert.ok(a,id+'/'+name);for(const k of READ)assert.deepEqual(a[k],b[k],id+'/'+name+' '+k);
  for(const t of [0,.13,.5,1.7,9])for(const reduced of [false,true])assert.deepEqual(chronoFrame(a,t,reduced),chronoFrame(b,t,reduced));
 }
 for(const [id,atlas] of Object.entries(CHRONO_MANIFEST.atlases))assert.equal(lean.atlases[id].path,atlas.path,id);
});

test('Q3: game code reads only the kept fields from an animation object',()=>{
 assert.ok(!('collision_box' in lean.animations[0])&&!('animation_quality' in lean.animations[0]),'documentation fields are dropped');
 // Animation objects only leave chrono-art.mjs through chronoAnimation(); runtime.mjs holds them as anim/animation.
 const code=['chrono-art.mjs','runtime.mjs'].map(f=>fs.readFileSync('game/'+f,'utf8')).join('\n');
 const read=new Set([...code.matchAll(/\b(?:anim|animation)\??\.([a-z_]+)/g)].map(m=>m[1]));
 assert.ok(read.has('frame_rectangles')&&read.has('draw_height'),'scanner finds real reads');
 for(const k of read)assert.ok(READ.includes(k),k+' is read by game code: keep it in tools/prepare_android_assets.py');
 assert.match(code,/manifest\.animations\.find\(a=>a\.character_id===id&&a\.animation_id===name\)/);
 assert.deepEqual([...code.matchAll(/CHRONO_MANIFEST\.(\w+)/g)].map(m=>m[1]),['atlases'],'only atlases[id].path is read directly');
 assert.match(code,/CHRONO_MANIFEST\.atlases\[id\]\.path/);
});

test('Q3: app.js keeps at least 64 KiB of room under the 512 KiB entry budget',()=>{
 const size=Buffer.byteLength(app);assert.ok(size<=524288-65536,'app.js '+size+' bytes');
});
