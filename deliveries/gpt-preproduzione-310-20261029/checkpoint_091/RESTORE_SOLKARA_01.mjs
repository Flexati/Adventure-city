#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const pre='deliveries/gpt-preproduzione-310-20261029/checkpoint_091/solkara_01_chunks';
const out='deliveries/gpt-preproduzione-310-20261029/region/region_solkara/v01.png';
const sha='56c9ce00ee07a68579c0ca70ab222ee9e3eb86ed16b2cd62c9e59d782f4ace50';
const files=[1,2,3,4].map(i=>path.join(root,pre,'v01.png.part'+String(i).padStart(2,'0')));
const buffers=files.map(f=>fs.readFileSync(f));
const bytes=Buffer.concat(buffers);const got=crypto.createHash('sha256').update(bytes).digest('hex');
if(bytes.length!==3771982||got!==sha||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||bytes.readUInt32BE(16)!==1536||bytes.readUInt32BE(20)!==1024)throw Error('Source PNG verification failed');
const dest=path.join(root,out);fs.mkdirSync(path.dirname(dest),{recursive:true});
if(fs.existsSync(dest)){const existing=crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex');if(existing!==sha)throw Error('Unexpected existing destination PNG');}
else fs.writeFileSync(dest,bytes,{flag:'wx'});
console.log('PASS recovered canonical Solkara 01 day',bytes.length,got);
