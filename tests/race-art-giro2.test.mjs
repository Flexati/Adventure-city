// Consegna Argon giro 2 (10/11/2026): strade Solkara/Aurelia e atlante dell'auto Vortex nelle gare.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,existsSync} from 'node:fs';
import {RACES_V9,raceRoadArt,raceRoadTile,RACE_SCROLL,RACE_ROAD_TILE} from '../game/racing-v9.mjs';
import {vortexCarFrame,veyraCarFrame} from '../game/visuals.mjs';

const REG=JSON.parse(readFileSync('assets/production/v10.3/derived/REGISTRO_ARGON_GIRO2_20261110.json','utf8'));

test('registro giro 2: 9 derivati INTEGRATED, file presenti e SHA-256 esatti, grezzi sul ramo di consegna',()=>{
 assert.equal(REG.assets.length,9);
 for(const a of REG.assets){
  assert.equal(a.stato,'INTEGRATED');
  assert.ok(existsSync(a.derivato),a.derivato);
  assert.equal(createHash('sha256').update(readFileSync(a.derivato)).digest('hex'),a.derivato_sha256,a.derivato);
  for(const g of a.grezzo)assert.match(g,/^delivery\/argon-asset-giro2-20261110@e776c13:deliveries\/argon-asset-giro2-20261110\//);
  assert.equal(a.grezzo.length,a.grezzo_sha256.length);
 }
});

test('ogni gara ha una sequenza di strade e ogni tegola è un file reale in art/v10',()=>{
 for(const [id,r] of Object.entries(RACES_V9)){
  const names=raceRoadArt(r);
  assert.ok(names.length>0,`${id}: nessuna strada`);
  for(const n of names){
   const png=`game/art/v10/${n}.png`,webp=`game/art/v10/${n}.webp`;
   assert.ok(existsSync(png)||existsSync(webp),`${id}: manca ${n}`);
  }
 }
});

test('Solkara e Aurelia: punto di riferimento fisso e tegole coerenti col tempo della gara',()=>{
 const last=r=>Math.floor(r.checkpoints.at(-1)*RACE_SCROLL/RACE_ROAD_TILE);
 const solkara=RACES_V9.solkara;
 assert.equal(raceRoadTile(solkara,last(solkara)),'race_solkara_reti_day');
 for(const n of raceRoadArt(RACES_V9.solkara_storm))assert.match(n,/^race_solkara_(convogli|pozzo)_storm$/);
 for(const n of raceRoadArt(RACES_V9.aurelia_span))assert.match(n,/^race_aurelia_(campata|torri)_day$/);
 assert.deepEqual(raceRoadArt(RACES_V9.veyra_duel),['race_aurelia_torri_dusk']);
 // le varianti (tt/elim/rev) ereditano la strada della base
 assert.equal(raceRoadTile(RACES_V9['tt:solkara'],0),raceRoadTile(solkara,0));
});

test('atlante Vortex: WebP 1536x512 con canale alfa',()=>{
 const buf=readFileSync('game/art/v10/race_vortex_car.webp');
 assert.equal(buf.toString('ascii',0,4),'RIFF');
 assert.equal(buf.toString('ascii',8,12),'WEBP');
 assert.equal(buf.toString('ascii',12,16),'VP8X');
 const flags=buf[20];
 assert.ok(flags&0b10000,'manca il canale alfa');
 const w=1+(buf[24]|buf[25]<<8|buf[26]<<16),h=1+(buf[27]|buf[28]<<8|buf[29]<<16);
 assert.deepEqual([w,h],[1536,512]);
});

test('vortexCarFrame: nitro di giorno, fari di notte, integrità come i rivali',()=>{
 assert.deepEqual(vortexCarFrame({integrity:100,boost:.8},false,0),{row:1,col:0});
 assert.deepEqual(vortexCarFrame({integrity:100,boost:.8},false,0,true),{row:0,col:0});
 assert.deepEqual(vortexCarFrame({integrity:100,boost:.8},true,0,true),{row:1,col:2});
 for(const i of [100,60,25,5])assert.deepEqual(vortexCarFrame({integrity:i,boost:0},false,0),veyraCarFrame({integrity:i},false,0));
});

test('Android: i WebP delle gare sono copiati e instradati',()=>{
 assert.match(readFileSync('tools/prepare_android_assets.py','utf8'),/art\/v10'\)\.glob\('\*\.webp'\)/);
 const routes=readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java','utf8');
 assert.match(routes,/race_solkara_\(convogli\|pozzo\|reti\)_\(day\|storm\)/);
 assert.match(routes,/race_aurelia_\(campata\|torri\)_\(day\|dusk\)/);
 assert.match(routes,/race_vortex_car/);
});
