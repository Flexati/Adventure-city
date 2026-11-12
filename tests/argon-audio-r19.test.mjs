// Lotto 4 di Argon: sei suoni nel gioco, i cinque scartati con il loro motivo.
import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {readFileSync,existsSync,statSync} from 'node:fs';
const REG=JSON.parse(readFileSync('assets/production/v10.3/derived/REGISTRO_ARGON_AUDIO_20261112.json','utf8'));
const engine=readFileSync('game/audio-engine.mjs','utf8'),rt=readFileSync('game/runtime.mjs','utf8'),java=readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java','utf8'),prep=readFileSync('tools/prepare_android_assets.py','utf8');
const names=REG.assets.map(a=>a.derivato.match(/v10\/(.+)\.ogg$/)[1]);

test('registro audio: SHA-256 esatti, grezzi sul ramo di consegna a 10592a7, picchi riportati a -1 dBFS',()=>{
 assert.equal(REG.assets.length,6);
 for(const a of REG.assets){
  assert.equal(a.stato,'INTEGRATED');assert.ok(existsSync(a.derivato),a.derivato);assert.ok(statSync(a.derivato).size>3000&&statSync(a.derivato).size<20000,a.derivato+' size');
  assert.equal(createHash('sha256').update(readFileSync(a.derivato)).digest('hex'),a.derivato_sha256,a.derivato);
  assert.ok(a.picco_derivato<=.91&&a.picco_derivato>.8,a.derivato+' peak '+a.picco_derivato);assert.ok(a.picco_grezzo>1,'the originals went over digital zero: '+a.picco_grezzo);
  for(const g of a.grezzo)assert.match(g,/^delivery\/argon-asset-giro2-20261110@10592a7:deliveries\/argon-asset-giro2-20261110\/A\//);
 }
});

test('i sei suoni esclusi hanno il motivo scritto e non sono nel gioco',()=>{
 assert.deepEqual(REG.esclusi.map(e=>e.file).sort(),['audio_intro_jaguar_storm.ogg','sfx_alchemist_brew.ogg','sfx_melee_lulu_strike.ogg','sfx_melee_nox_slash.ogg','sfx_relic_chime.ogg','sfx_shop_buy_upgrade.ogg']);
 for(const e of REG.esclusi){assert.ok(e.motivo.length>20,e.file);assert.ok(!existsSync('game/audio/v10/'+e.file),e.file+' is not shipped');}
 assert.match(REG.esclusi.find(e=>e.file==='audio_intro_jaguar_storm.ogg').motivo,/ronzio/);
});

test('ogni suono è caricato dal motore, ammesso dalle rotte Android, copiato nel pacchetto e suonato da un evento',()=>{
 for(const n of names){
  assert.ok(engine.includes(`'${n}'`),n+' in the engine list');assert.ok(java.includes(n),n+' route');assert.ok(prep.includes(`'${n}'`),n+' copied');
  assert.ok(rt.includes(`'${n}'`),n+' played by the runtime');
 }
 assert.match(engine,/name\.startsWith\('sfx_'\)\|\|/,'sfx_ files are fetched from audio/v10');
 assert.match(rt,/audioDirector\.chronoSfx\('sfx_special_duo_wave'\)\|\|audio\('choice'\)/,'without the buffer the old cue still plays');
 assert.match(rt,/else audioDirector\.chronoSfx\('sfx_npc_greet_warm'\)\|\|audioDirector\.sfx\('ui'\)/);
});

test('gli originali chrono di acquisto, miglioria e reliquia restano quelli di D47',()=>{
 for(const n of ['purchase','upgrade','relic'])assert.ok(existsSync(`game/audio/chrono/${n}.ogg`),n);
});
