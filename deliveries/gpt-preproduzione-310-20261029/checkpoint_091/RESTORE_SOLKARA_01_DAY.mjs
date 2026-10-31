#!/usr/bin/env node
// Exact-byte recovery from prior-chat source; no lossy re-encoding.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const partsDir=path.join(here,'upload_solkara_01');
const filename='v01.png';
const expectedBytes=3771982;
const expectedSHA256='56c9ce00ee07a68579c0ca70ab222ee9e3eb86ed16b2cd62c9e59d782f4ace50';
let encoded='';
for(let i=1;i<=6;i++){
 const f=path.join(partsDir,filename+'.b64.part'+String(i).padStart(2,'0')+'.txt');
 encoded+=fs.readFileSync(f,'utf8').replace(/\s+/g,'');
}
const b=Buffer.from(encoded,'base64');
const digest=crypto.createHash('sha256').update(b).digest('hex');
if(b.length!==expectedBytes||digest!==expectedSHA256||b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||b.readUInt32BE(16)!==1536||b.readUInt32BE(20)!==1024)throw Error('STOP: source corruption or invalid PNG');
const dest=path.resolve(here,'../region/region_solkara/v01.png');
fs.mkdirSync(path.dirname(dest),{recursive:true});
if(fs.existsSync(dest)){
 if(crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex')!==digest)throw Error('STOP: existing destination SHA differs; refusing overwrite');
 console.log('Already present and verified',dest);
}else {
 fs.writeFileSync(dest,b,{flag:'wx'});
 console.log('Recovered exact-byte PNG',dest,digest);
}
