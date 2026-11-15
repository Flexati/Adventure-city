// Terzo giro di Argon (11/11/2026): cinque fogli nemici e le schede dei quattro atti.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,existsSync} from 'node:fs';
import {chronoEnemySheet,chronoAnimation,chronoFrame} from '../game/chrono-art.mjs';

const REG=JSON.parse(readFileSync('assets/production/v10.3/derived/REGISTRO_ARGON_GIRO3_20261111.json','utf8'));

test('registro giro 3: 9 derivati INTEGRATED con SHA-256 esatti e grezzi sul ramo di consegna a f39dd3d',()=>{
 assert.equal(REG.assets.length,9);
 for(const a of REG.assets){
  assert.equal(a.stato,'INTEGRATED');assert.ok(existsSync(a.derivato),a.derivato);
  assert.equal(createHash('sha256').update(readFileSync(a.derivato)).digest('hex'),a.derivato_sha256,a.derivato);
  for(const g of a.grezzo)assert.match(g,/^delivery\/argon-asset-giro2-20261110@f39dd3d:deliveries\/argon-asset-giro2-20261110\//);
 }
});

test('ogni nemico nuovo occupa il suo ruolo e ha tutte le pose',()=>{
 assert.equal(chronoEnemySheet(0,'shooter','blackout'),'gang_shooter');
 assert.equal(chronoEnemySheet(0,'breaker','blackout'),'gang_breaker');
 assert.equal(chronoEnemySheet(1,'breaker','breach'),'alien_breaker');
 assert.equal(chronoEnemySheet(2,'brute','contagion'),'infected_brute');
 assert.equal(chronoEnemySheet(1,'patrol','port'),'port_patrol');
 assert.equal(chronoEnemySheet(1,'patrol','breach'),null,'la pattuglia esiste solo al porto');
 for(const id of ['gang_shooter','gang_breaker','alien_breaker','infected_brute','port_patrol'])
  for(const pose of ['idle','walk','anticipation','attack','recover','hurt','defeat'])assert.ok(chronoFrame(chronoAnimation(id,pose),.2),id+' '+pose);
});

test('schede degli atti: classe dell\'atto sulla scheda, quattro sfondi in CSS, file copiati e instradati',()=>{
 assert.match(readFileSync('game/runtime.mjs','utf8'),/card\.className=pov\+' a'\+step\.act;/);
 const css=readFileSync('game/style.css','utf8');
 for(const n of [1,2,3,4]){assert.ok(css.includes(`#card.a${n}{`));assert.ok(css.includes(`url(art/atti/atto_${n}.webp)`));assert.ok(existsSync(`game/art/atti/atto_${n}.webp`));}
 assert.match(readFileSync('tools/prepare_android_assets.py','utf8'),/art\/atti'\)\.glob\('\*\.webp'\)/);
 assert.match(readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java','utf8'),/art\/atti\/atto_\[1-4\]/);
});
