#!/usr/bin/env node
// Restore Aurelia Span 04 day (original exact bytes) from Git-backed Base64 shards.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url)),name='v04.png',expectedBytes=3764401,expectedSha='075ab39f4afbba9144bd5f6f305d93033143d433d5f685f25af6e70889385579';
let b64='';for(let i=1;i<=4;i++)b64+=fs.readFileSync(path.join(here,'backup_008_shards',name+'.b64.part'+String(i).padStart(2,'0')+'.txt'),'utf8');
const b=Buffer.from(b64,'base64'),sha=crypto.createHash('sha256').update(b).digest('hex');
if(b.length!==expectedBytes||sha!==expectedSha||b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||b.readUInt32BE(16)!==1536||b.readUInt32BE(20)!==1024)throw Error('PNG checksum or dimensions invalid');
const dest=path.resolve(here,'../region/region_aurelia_span/v04.png');fs.mkdirSync(path.dirname(dest),{recursive:true});
if(fs.existsSync(dest)){if(crypto.createHash('sha256').update(fs.readFileSync(dest)).digest('hex')!==sha)throw Error('Existing image differs; refusing overwrite');console.log('Already verified');}
else{fs.writeFileSync(dest,b,{flag:'wx'});console.log('Recovered verified original '+dest);}
