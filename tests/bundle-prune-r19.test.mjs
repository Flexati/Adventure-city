import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {execFileSync} from 'node:child_process';
// R19 weight pass: exports that only tests call are left out of app.js. The game must not lose anything it calls.
execFileSync('python3',['tools/prepare_android_assets.py'],{stdio:'pipe'});
const app=fs.readFileSync('android/build/assets/game/app.js','utf8');
const pruned=JSON.parse(fs.readFileSync('android/build/pruned-exports.json','utf8'));
const shell=fs.readFileSync('game/index.html','utf8')+fs.readFileSync('game/android_bootstrap.js','utf8');
const word=n=>new RegExp('(?<![\\w$])'+n.replace(/\$/g,'\\$')+'(?![\\w$])');
const modules=fs.readdirSync('game').filter(f=>f.endsWith('.mjs')&&!f.startsWith('v9-'));

test('R19: every pruned export is gone from app.js and is not named by the page or the bootstrap',()=>{
 assert.ok(pruned.length>=10,'the pass removes something');
 for(const n of pruned){assert.ok(!word(n).test(app),n+' still in app.js');assert.ok(!word(n).test(shell),n+' named by the shell');}
});

test('R19: no game module calls a pruned export, so the bundle loses no behaviour',()=>{
 for(const n of pruned){
  const users=modules.filter(f=>{const src=fs.readFileSync('game/'+f,'utf8').replace(/^import .*?;\n/gm,'');return (src.match(new RegExp(word(n).source,'g'))||[]).length>(new RegExp('^export (?:async )?function '+n.replace(/\$/g,'\\$')+'\\(','m').test(src)?1:0);});
  assert.deepEqual(users,[],n+' is used by '+users.join(', '));
 }
});

test('R19: the pruned bundle still parses and keeps the exports the runtime calls',()=>{
 execFileSync(process.execPath,['--check','android/build/assets/game/app.js']);
 for(const n of ['newRun','tick','raceRoadTile','chronoEnemySheet','createNarrativeState'])assert.ok(word(n).test(app),n);
});

test('R19: app.js stays under the 458 752 byte guard',()=>{
 const size=Buffer.byteLength(app);assert.ok(size<=458752,'app.js '+size+' bytes');
});
