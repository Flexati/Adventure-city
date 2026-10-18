import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

test('Android flattened bundle includes v0.7 modules and compiles as a classic script',()=>{
 execFileSync('python3',['tools/prepare_android_assets.py'],{stdio:'pipe'});
 const app=fs.readFileSync('android/build/assets/game/app.js','utf8');
 assert.doesNotMatch(app,/^\s*import\s/m);
 assert.doesNotMatch(app,/\bexport\s/);
 assert.match(app,/createNarrativeState/);
 assert.match(app,/V07_BEATS/);
 assert.match(app,/V07_DIALOGUE/);
 assert.doesNotThrow(()=>new Function(app));
});
