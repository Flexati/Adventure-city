import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

test('Android flattened bundle includes v0.9 modules, assets and compiles as a classic script',()=>{
 execFileSync('python3',['tools/prepare_android_assets.py'],{stdio:'pipe'});
 const app=fs.readFileSync('android/build/assets/game/app.js','utf8');
 assert.doesNotMatch(app,/^\s*import\s/m);
 assert.doesNotMatch(app,/\bexport\s/);
 for(const name of ['createNarrativeState','V07_BEATS','CAMPAIGN','buildMission','STORY','REACTIONS','hazardVisible','mirrorFrame','AudioDirector','getLayout','buildMapSurface','radialControlVector'])assert.match(app,new RegExp(name));
 assert.doesNotThrow(()=>new Function(app));
 for(const file of ['art/v10/nox_vx9_gun.png','art/v10/lulu_r12_gun.png','art/v10/nox_vx9_reload.png','art/v10/lulu_r12_reload.png','art/brand/vanta-clock.webp','art/v08/portraits.png','audio/v08/nox.ogg','audio/v08/lulu.ogg','audio/v08/danger.ogg','audio/v08/reunion.ogg','art/v09/reunion.png','art/v09/warm.svg','art/v09/tentative.svg','art/v09/fragile.svg','audio/v09/nox.ogg','audio/v09/lulu.ogg','audio/v09/danger.ogg','audio/v09/reunion.ogg'])assert.ok(fs.statSync('android/build/assets/game/'+file).size>0,file);
});

test('Android asset routes allow every packaged file and nothing else',()=>{
 const java=fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java','utf8');
 const patterns=[...java.matchAll(/path\.matches\("([^"]+)"\)/g)].map(m=>new RegExp('^'+m[1].replace(/\\\\/g,'\\')+'$'));
 const exact=['/game/index.html','/game/app.js','/game/bootstrap.js','/game/style.css'];
 const root='android/build/assets/game/';const files=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true}))e.isDirectory()?walk(d+e.name+'/'):files.push((d+e.name).slice(root.length));};walk(root);
 for(const f of files){const p='/game/'+f;assert.ok(exact.includes(p)||patterns.some(r=>r.test(p)),'blocked packaged file '+f);}
 assert.ok(!patterns.some(r=>r.test('/game/../secret.png')));
});
