#!/usr/bin/env node
// Restore exactly the original PNGs, never overwrite inconsistent existing files.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),target=path.resolve(here,'../region/region_aurelia_span');
const specs=[
  {
    "name": "v03.png",
    "bytes": 3438619,
    "sha256": "9f969cf4f332faa9f639f91bdb54b68d8e57b1c4030439369b6f80678a229f25",
    "count": 4
  },
  {
    "name": "v03_evento.png",
    "bytes": 3453727,
    "sha256": "d64b332554ce680280361184ed5d2a63cf46455b4270826954af4710ade1e5c4",
    "count": 4
  }
];
for(const s of specs){let encoded='';for(let i=1;i<=s.count;i++)encoded+=fs.readFileSync(path.join(here,'backup_007_shards',s.name+'.b64.part'+String(i).padStart(2,'0')+'.txt'),'utf8');
const data=Buffer.from(encoded,'base64');const digest=crypto.createHash('sha256').update(data).digest('hex');
if(data.length!==s.bytes||digest!==s.sha256||data.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||data.readUInt32BE(16)!==1536||data.readUInt32BE(20)!==1024)throw Error('SHA/PNG/dimensions failed: '+s.name);
const out=path.join(target,s.name);if(fs.existsSync(out)){const old=crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex');if(old!==digest)throw Error('Refuse overwrite '+out);console.log('Already exists valid '+s.name);continue}
fs.mkdirSync(target,{recursive:true});fs.writeFileSync(out,data,{flag:'wx'});console.log('Restored '+s.name)}
console.log('Now commit the two canonical images and rerun the full inventory; commercial release remains blocked.');
