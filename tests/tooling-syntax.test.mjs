import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

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
 for(const tool of ['verify_terra_weapon_sheet','build_ashdocks_roads','verify_terra_containers','clean_sheet_layout','prepare_ashdocks_from_terra','make_terra_weapon_masks','compose_terra_weapon_edits','race_props_lib','make_terra_race_props','compose_terra_race_props'])runs('python3',['-m','py_compile','tools/'+tool+'.py']);
});

test('race props round trip: masks filled pass, a short container footprint fails',()=>{
 const dir=mkdtempSync(join(tmpdir(),'race-props-'));
 try{
  execFileSync('python3',['-I','tools/make_terra_race_props.py',join(dir,'pkg')],{stdio:'pipe'});
  // A producer that fills every mask exactly: the contract holds for all 34 files.
  const fill=`import sys,glob,os\nfrom PIL import Image\nfor f in glob.glob(os.path.join(sys.argv[1],'*_mask.png')):\n m=Image.open(f).getchannel('A');im=Image.new('RGB',m.size,(0,255,0));im.paste((90,60,140),(0,0),m)\n if sys.argv[3] in f:im=Image.new('RGB',m.size,(0,255,0));im.paste((90,60,140),(40,40,200,300))\n im.save(os.path.join(sys.argv[2],os.path.basename(f).replace('_mask.png','_edit.png')))`;
  mkdirSync(join(dir,'ok'));mkdirSync(join(dir,'bad'));
  execFileSync('python3',['-I','-c',fill,join(dir,'pkg','modelli'),join(dir,'ok'),'@none@'],{stdio:'pipe'});
  const ok=execFileSync('python3',['-I','tools/compose_terra_race_props.py',join(dir,'ok'),join(dir,'out'),join(dir,'ok.json')],{stdio:'pipe'}).toString();
  assert.match(ok,/^PASS\n34 composed, 0 missing/);
  execFileSync('python3',['-I','-c',fill,join(dir,'pkg','modelli'),join(dir,'bad'),'porto_casse_mask'],{stdio:'pipe'});
  assert.throws(()=>execFileSync('python3',['-I','tools/compose_terra_race_props.py',join(dir,'bad'),join(dir,'out2')],{stdio:'pipe'}));
  const report=JSON.parse(readFileSync(join(dir,'ok.json'),'utf8'));
  assert.equal(report.assets.race_obstacle_porto_casse.box.join(),'16,22,111,168');
 }finally{rmSync(dir,{recursive:true,force:true});}
});
