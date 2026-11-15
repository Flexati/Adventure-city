// Interfaccia premium di Argon (gruppo U): primo derivato, la cornice dei pannelli.
import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {readFileSync,existsSync} from 'node:fs';
const REG=JSON.parse(readFileSync('assets/production/v10.3/derived/REGISTRO_ARGON_UI_20261111.json','utf8'));
const css=readFileSync('game/style.css','utf8');

test('registro UI: ogni derivato esiste, ha lo SHA-256 esatto e il grezzo sul ramo di consegna a f21e19d',()=>{
 assert.ok(REG.assets.length>=1);
 for(const a of REG.assets){
  assert.equal(a.stato,'INTEGRATED');assert.ok(existsSync(a.derivato),a.derivato);
  assert.equal(createHash('sha256').update(readFileSync(a.derivato)).digest('hex'),a.derivato_sha256,a.derivato);
  for(const g of a.grezzo)assert.match(g,/^delivery\/argon-asset-giro2-20261110@f21e19d:deliveries\/argon-asset-giro2-20261110\/U\//);
 }
});

test('la cornice è solo disegno: border-image sui pannelli, senza cambiare bordo, margini o contenuto',()=>{
 assert.match(css,/^\.card\{border-image:url\(art\/ui\/frame_menu\.webp\) 100\/20px\/4px stretch\}$/m);
 assert.match(css,/^\.card\{max-width:520px;[^}]*border:1px solid #7bb5ca44;border-radius:20px;padding:24px;/m,'la regola di base dei pannelli resta com\'era');
 assert.match(css,/^ \.card\{border-image-width:13px;border-image-outset:3px\}$/m,'schermi bassi: cornice più sottile del margine interno');
 assert.ok(!/frame_menu/.test(readFileSync('game/runtime.mjs','utf8')),'nessun byte in app.js');
});

test('la cornice entra nell\'APK: copiata dal bundler e ammessa dalle rotte',()=>{
 assert.match(readFileSync('tools/prepare_android_assets.py','utf8'),/\(GAME\/'art\/ui'\)\.glob\('\*\.webp'\)/);
 assert.ok(readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/AssetRoutes.java','utf8').includes('"/game/art/ui/frame_menu\\\\.webp"'));
});
