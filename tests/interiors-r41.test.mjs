// R41 (D84): «mi serve qualcosa che sia professionale AAA, con interni grafici ultra». Argon's 45 painted rooms are the
// stage of every service; the keeper stands in front, large (HD figure where Argon drew it, else the keeper's sprite).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {INTERIORS,INTERIOR_ART,interiorFor} from '../game/interiors.mjs';
import {hubPoints} from '../game/hubs.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url));
const reg=JSON.parse(read('assets/production/r41/REGISTRO_ARGON_20261117.json')).derivati;
const keys=Object.entries(INTERIORS).flatMap(([h,v])=>Object.keys(v).map(k=>h+'_'+k));

test('all 45 services have their own painted room, on record with the hash of the file in the game',()=>{
 assert.equal(keys.length,45);
 for(const k of keys){const path=INTERIOR_ART.backgrounds[k];assert.equal(path,`art/interiors/${k}.webp`,k);
  const b=read('game/'+path),e=reg.find(x=>x.derivato==='game/'+path);assert.ok(e,k+' on record');
  assert.equal(crypto.createHash('sha256').update(b).digest('hex'),e.sha256,k+' is the registered file');
  assert.equal(b.subarray(0,4).toString(),'RIFF');assert.equal(b.subarray(8,12).toString(),'WEBP');}
});

test('a service opens on its own room, and the HD figure only where it is exactly that keeper',()=>{
 for(const [hub,svcs] of Object.entries(INTERIORS))for(const svc of Object.keys(svcs)){
  const pt=hubPoints(hub).find(p=>p.kind==='service'&&p.service===svc);if(!pt)continue;
  const sc=interiorFor(hub,pt);assert.equal(sc.background,`art/interiors/${hub}_${svc}.webp`,hub+'/'+svc);
  assert.equal(sc.stage,INTERIOR_ART.stage[hub+'_'+svc]||null);}
 for(const [k,path] of Object.entries(INTERIOR_ART.stage)){const b=read('game/'+path);assert.equal(b.readUInt32BE(12),0x49484452,'PNG');
  assert.ok(b.readUInt32BE(16)<=600&&b.readUInt32BE(20)<=800,k+' figure size');assert.ok(reg.some(e=>e.derivato==='game/'+path&&e.lotto==='I2'),k+' on record');}
 assert.deepEqual(Object.keys(INTERIOR_ART.stage).sort(),['cathedral_info','cathedral_relic','cathedral_smith','moon_inn','moon_shop','moon_smith']);
});

test('the painted room is not covered: no code-drawn room over it, no hub hint over the keeper',()=>{
 const rt=read('game/runtime.mjs').toString();
 assert.match(rt,/if\(s\.background\)\{g\.imageSmoothingEnabled=false;if\(hd\)/);
 assert.match(rt,/else drawChronosInteriorRoom\(g,cw,ch,s,tint/,'the drawn room stays only for scenes without a painting');
 assert.match(rt,/lock\(\);panel\('interior',true\);clearTimeout\(notice\.later\);\$\('notice'\)\.classList\.remove\('on'\);/);
 assert.match(rt,/settings\.reduced\?1:1\+\.007\*Math\.sin\(ts\*1\.7\)/,'breathing stops with reduced motion');
});

test('the Android shell serves every room and every HD figure',()=>{
 const java=fs.readdirSync(new URL('../android/src/jaguarZcreatorZ13/app/',import.meta.url)).includes('AssetRoutes.java')?read('android/src/jaguarZcreatorZ13/app/AssetRoutes.java').toString():'';
 for(const k of keys)assert.ok(java.includes('|'+k+'|')||java.includes('('+k+'|')||java.includes('|'+k+')'),k+' route');
 for(const k of Object.keys(INTERIOR_ART.stage))assert.ok(java.includes(k),k+' figure route');
 assert.match(read('tools/prepare_android_assets.py').toString(),/\(GAME\/'art\/npc\/hd'\)\.glob\('\*\.png'\)/);
});
