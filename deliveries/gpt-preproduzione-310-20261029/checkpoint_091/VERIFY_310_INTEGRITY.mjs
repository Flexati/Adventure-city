#!/usr/bin/env node
// Eseguire dalla root del repository: node deliveries/gpt-preproduzione-310-20261029/checkpoint_091/VERIFY_310_INTEGRITY.mjs
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(dir,'../../../');
const csv=fs.readFileSync(path.join(dir,'MANIFEST_310_EXPECTED_623.csv'),'utf8').trim().split(/\r?\n/).slice(1);
let present=0,missing=0,mismatch=0,awaitingArtReview=0;const failures=[];
for(const row of csv){const [p,status,sha,bytes]=row.split(',');if(!p.startsWith('deliveries/gpt-preproduzione-310-20261029/')||!p.endsWith('.png'))throw Error('Bad path '+p);
const f=path.join(repo,p);if(!fs.existsSync(f)){missing++;continue}present++;if(status.startsWith('CANDIDATE'))awaitingArtReview++;
const b=fs.readFileSync(f);if(b.length<24||b.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||b.toString('ascii',12,16)!=='IHDR'){mismatch++;failures.push(p+':PNG');continue}
if(bytes&&b.length!==Number(bytes)){mismatch++;failures.push(p+':SIZE');continue}
if(sha&&crypto.createHash('sha256').update(b).digest('hex')!==sha){mismatch++;failures.push(p+':SHA256')}
}
console.log(JSON.stringify({expected:csv.length,present,missing,mismatch,awaitingArtReview,COMMERCIAL_RELEASE:'BLOCKED',failures:failures.slice(0,30)},null,2));
if(csv.length!==623||missing||mismatch)process.exitCode=1;
// Note: verifica solo i bytes locali, non prova l'identità degli upload Drive/GitHub né la qualità artistica.
