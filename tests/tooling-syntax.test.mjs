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

test('native recovery harness and CDP transport have valid syntax',()=>{
 runs(process.execPath,['--check','tools/verify_android_recovery.mjs']);
 runs(process.execPath,['--check','tools/lib/android-cdp.mjs']);
});

test('Terra contract tools and sheet layout builder have valid Python syntax',()=>{
 for(const tool of ['verify_terra_weapon_sheet','build_ashdocks_roads','verify_terra_containers','clean_sheet_layout','prepare_ashdocks_from_terra'])runs('python3',['-m','py_compile','tools/'+tool+'.py']);
});
