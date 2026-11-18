import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

test('Android flattened bundle includes v0.9 modules, assets and compiles as a classic script',()=>{
 execFileSync('python3',['tools/prepare_android_assets.py'],{stdio:'pipe'});
 const app=fs.readFileSync('android/build/assets/game/app.js','utf8');
 assert.doesNotMatch(app,/^\s*import\s/m);
 assert.doesNotMatch(app,/\bexport\s/);
 for(const name of ['createNarrativeState','V07_BEATS','CAMPAIGN','buildMission','STORY','REACTIONS','hazardVisible','mirrorFrame','AudioDirector','getLayout','buildMapSurface','radialControlVector','interiorFor','INTERIOR_EN_TEXT','createFaultMonitor'])assert.match(app,new RegExp(name));
 assert.doesNotThrow(()=>new Function(app));
 for(const file of ['audio/v11/refuge.ogg','audio/v11/promise.ogg','audio/v11/title.ogg','audio/v11/danger_b.ogg','audio/v11/archon.ogg','art/v10/nox_vx9_gun.png','art/v10/lulu_r12_gun.png','art/v10/nox_vx9_reload.png','art/v10/lulu_r12_reload.png','art/brand/vanta-clock.webp','art/v08/portraits.png','art/v09/reunion.png','art/v09/warm.svg','art/v09/tentative.svg','art/v09/fragile.svg','audio/v11/nox.ogg','audio/v11/lulu.ogg','audio/v11/danger.ogg','audio/v11/reunion.ogg','audio/v86/nox_keepsake_chime.ogg','audio/v10/jaguar_roar.ogg','audio/v10/jaguar_intro_theme.ogg','art/brand/jaguar_intro_f1.webp','art/brand/jaguar_intro_f2.webp','art/brand/jaguar_intro_f3.webp'])assert.ok(fs.statSync('android/build/assets/game/'+file).size>0,file);
 assert.ok(!fs.existsSync('android/build/assets/game/audio/v08'),'duplicate audio/v08 directory must not be packaged in APK');
 // R38 (D74): the old music of v05 and v09 and the 24 music tracks of v10 stay in the repo but no longer ship.
 for(const dir of ['audio/v05','audio/v09'])assert.ok(!fs.existsSync('android/build/assets/game/'+dir),dir+' is the old music and must not be packaged');
 for(const old of ['title_theme','refuge_theme','archon_finale','vega_duel','veyra_championship'])assert.ok(!fs.existsSync('android/build/assets/game/audio/v10/'+old+'.ogg'),old+' is replaced by the R38 score');
 // Fase 0.2, kept through the merge of the new base: the flat sprint01 and v86 sheets are placeholders and do not ship.
 for(const dir of ['art/sprint01','art/v86'])assert.ok(!fs.existsSync('android/build/assets/game/'+dir),dir+' is placeholder art and must not be packaged');
});

test('Android asset routes allow every packaged file and nothing else',()=>{
 const java=fs.readFileSync('android/src/jaguarZcreatorZ13/app/AssetRoutes.java','utf8');
 const patterns=[...java.matchAll(/path\.matches\("([^"]+)"\)/g)].map(m=>new RegExp('^'+m[1].replace(/\\\\/g,'\\')+'$'));
 const exact=['/game/index.html','/game/app.js','/game/bootstrap.js','/game/en.js','/game/world.js','/game/style.css'];
 const root='android/build/assets/game/';const files=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true}))e.isDirectory()?walk(d+e.name+'/'):files.push((d+e.name).slice(root.length));};walk(root);
 for(const f of files){const p='/game/'+f;assert.ok(exact.includes(p)||patterns.some(r=>r.test(p)),'blocked packaged file '+f);}
 assert.ok(!patterns.some(r=>r.test('/game/../secret.png')));
});
