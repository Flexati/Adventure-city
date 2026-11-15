import fs from 'node:fs';
import crypto from 'node:crypto';

// Mechanical index of the user's full audio chat. Production claims are authored
// separately; indexing a brief must never certify a generated or shipped sound.
const source='docs/production/v9/sources/03-audio-production.md';
const text=fs.readFileSync(source,'utf8');
const headings=[...text.matchAll(/^### PROMPT (\d+) — (.+)$/gm)];
if(headings.length!==129||headings.some((h,i)=>Number(h[1])!==i))throw Error('Audio source must contain prompts 00 through 128 exactly once and in order');
const entries=headings.map((h,i)=>{
 const body=text.slice(h.index,headings[i+1]?.index??text.length);
 return {id:`audio_${String(i).padStart(3,'0')}`,prompt:i,title:h[2],source_line:text.slice(0,h.index).split('\n').length,
  brief_sha256:crypto.createHash('sha256').update(body).digest('hex'),
  kind:i===0||i===128?'direction':'asset',status:'PENDING',integration:'none',artifacts:[],evidence:[]};
});
const file='docs/production/v9/audio-catalog.json';
if(fs.existsSync(file))throw Error('Catalog exists; preserve production records rather than overwrite them');
fs.writeFileSync(file,JSON.stringify({source,source_sha256:crypto.createHash('sha256').update(text).digest('hex'),entries},null,2)+'\n');
console.log('Indexed all 129 audio briefs; no production status granted');
