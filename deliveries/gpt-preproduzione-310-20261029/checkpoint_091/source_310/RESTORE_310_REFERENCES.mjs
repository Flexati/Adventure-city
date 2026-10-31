#!/usr/bin/env node
// Reconstruct byte-identical canonical reference ZIP from 12 Git text shards.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url)),name='CHRONOS_310_RIFERIMENTI_CANONICI_CHECKPOINT_083.zip';
let str='';for(let i=1;i<=12;i++){str+=fs.readFileSync(path.join(dir,'reference_archive_parts','ref.zip.b64.part'+String(i).padStart(2,'0')+'.txt'),'utf8')}
const bin=Buffer.from(str,'base64'),sha=crypto.createHash('sha256').update(bin).digest('hex'),expected='ca3130707cfc24388ed7b6b890426bd6286a2fdcaef8a63277333a17280ee423';
if(bin.length!==12391492||sha!==expected||bin.subarray(0,4).toString('hex')!=='504b0304')throw Error('Reference ZIP checksum/signature invalid');
const output=path.join(dir,name);if(fs.existsSync(output)){let existing=crypto.createHash('sha256').update(fs.readFileSync(output)).digest('hex');if(existing!==expected)throw Error('Existing ZIP differs; refuse overwrite');console.log('Reference ZIP already verified');}
else {fs.writeFileSync(output,bin,{flag:'wx'});console.log('Restored complete 16-file reference ZIP, SHA-256 verified');}
