import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

function runs(command,args){
 assert.doesNotThrow(()=>execFileSync(command,args,{stdio:'pipe'}));
}

test('Android verifier has valid ESM syntax',()=>{
 runs(process.execPath,['--check','tools/verify_android_renderer.mjs']);
});

test('Android asset packager has valid Python syntax',()=>{
 runs('python3',['-m','py_compile','tools/prepare_android_assets.py']);
});

test('APK build script has valid shell syntax',()=>{
 runs('bash',['-n','tools/build_apk.sh']);
});
