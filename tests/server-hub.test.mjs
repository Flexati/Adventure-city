import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import http from 'node:http';import {spawn} from 'node:child_process';
import {createHubServer} from '../server.js';
// The pretest hub runs on the author's PC, where dist/play-upload holds the Play upload key and its password: only the game,
// the hub page, assets, docs and the debug APK may leave it, and no request may stop it.
const base=fs.mkdtempSync(path.join(os.tmpdir(),'chronos-hub-')),root=path.join(base,'hub');
const put=(rel,text)=>{const f=path.join(base,rel);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,text);};
put('hub/index.html','HUB');put('hub/game/index.html','GAME');put('hub/docs/gold/a.md','DOC');put('hub/game/x.jks','SECRET');put('hub/game/.hidden','HIDDEN');
put('hub/dist/play-upload/UPLOAD_KEY_CREDENTIALS.txt','PASSWORD');put('hub/dist/Chronos_Adventure_Nox_Lulu_debug.apk','APK');put('hub/dist/other.aab','AAB');
put('hub/.git/config','GIT');put('hub/.env','ENV');put('hub-secrets/k.txt','SIBLING');put('outside.txt','OUTSIDE');
fs.symlinkSync(path.join(base,'outside.txt'),path.join(root,'game/link.txt'));
function get(port,rawPath,method='GET'){return new Promise((resolve,reject)=>{const r=http.request({host:'127.0.0.1',port,path:rawPath,method},res=>{let body='';res.on('data',d=>body+=d);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));});r.setTimeout(4000,()=>r.destroy(new Error('no answer: '+rawPath)));r.on('error',reject);r.end();});}
async function withServer(dir,fn){const s=createHubServer(dir);await new Promise(r=>s.listen(0,'127.0.0.1',r));try{await fn(s.address().port);}finally{s.closeAllConnections();await new Promise(r=>s.close(r));}}

test('hub: serves the game, the hub page, docs and the debug APK',{timeout:20000},()=>withServer(root,async port=>{
 assert.equal((await get(port,'/')).body,'HUB');
 const redirect=await get(port,'/game');assert.equal(redirect.status,301);assert.equal(redirect.headers.location,'/game/');
 assert.equal((await get(port,'/game/')).body,'GAME');assert.equal((await get(port,'/game/index.html')).body,'GAME');
 assert.equal((await get(port,'/docs/gold/a.md')).body,'DOC');
 const apk=await get(port,'/dist/Chronos_Adventure_Nox_Lulu_debug.apk');assert.equal(apk.body,'APK');assert.match(apk.headers['content-disposition'],/attachment/);
}));

test('hub: never serves keys, passwords, dotfiles, other build output or files outside the repo',{timeout:20000},()=>withServer(root,async port=>{
 for(const p of ['/dist/play-upload/UPLOAD_KEY_CREDENTIALS.txt','/dist/other.aab','/.git/config','/.env','/game/.hidden','/game/x.jks','/..%2Fhub-secrets/k.txt','/game/..%2F..%2Fhub-secrets/k.txt','/%2e%2e/hub-secrets/k.txt','/game/%2e%2e/%2e%2e/outside.txt','/game/link.txt','/../outside.txt']){
  const r=await get(port,p);assert.ok(r.status>=400,p+' → '+r.status);
  for(const secret of ['PASSWORD','AAB','GIT','ENV','HIDDEN','SECRET','SIBLING','OUTSIDE'])assert.ok(!r.body.includes(secret),p+' leaks '+secret);
 }
 assert.equal((await get(port,'/','POST')).status,405);
}));

test('hub: a missing APK answers 404 with the build command',{timeout:20000},()=>{
 const bare=path.join(base,'bare');fs.mkdirSync(bare);fs.writeFileSync(path.join(bare,'index.html'),'BARE');
 return withServer(bare,async port=>{const r=await get(port,'/dist/Chronos_Adventure_Nox_Lulu_debug.apk');assert.equal(r.status,404);assert.match(r.body,/build_apk/);assert.equal((await get(port,'/')).body,'BARE');});
});

test('hub: the real process listens on 127.0.0.1 by default and survives a malformed URL; npm start stays the documented game server',{timeout:20000},async()=>{
 const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
 assert.equal(pkg.scripts.start,'python3 -m http.server 8080 --bind 127.0.0.1');assert.equal(pkg.scripts.hub,'node server.js');
 const env={...process.env,PORT:'0'};delete env.HOST;
 const child=spawn(process.execPath,['server.js'],{env,stdio:['ignore','pipe','pipe']});
 try{
  const line=await new Promise((resolve,reject)=>{child.stdout.once('data',d=>resolve(String(d)));child.once('exit',c=>reject(new Error('exit '+c)));});
  const m=line.match(/http:\/\/127\.0\.0\.1:(\d+)\//);assert.ok(m,line);
  assert.equal((await get(+m[1],'/%E0%A4%A')).status,400);
  assert.equal((await get(+m[1],'/game/index.html')).status,200,'still running after the malformed URL');
 }finally{child.kill();}
});
