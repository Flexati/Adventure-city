import crypto from 'node:crypto';

export function audioCoverageV9(catalog,source,evidence){
 const errors=[],headings=[...source.matchAll(/^### PROMPT (\d+) — (.+)$/gm)];
 const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
 if(catalog.source_sha256!==hash(source))errors.push('Audio catalog source hash mismatch');
 if(headings.length!==129||headings.some((h,i)=>Number(h[1])!==i))errors.push('Audio source must contain all 129 briefs');
 const entries=catalog.entries||[];
 if(entries.length!==129||new Set(entries.map(e=>e.id)).size!==129)errors.push('Audio catalog must contain 129 unique briefs');
 const accepted=[];
 for(let i=0;i<129;i++){
  const e=entries.find(e=>e.id===`audio_${String(i).padStart(3,'0')}`),h=headings[i];
  if(!e||!h){errors.push(`Missing audio brief ${i}`);continue;}
  const body=source.slice(h.index,headings[i+1]?.index??source.length);
  if(e.prompt!==i||e.title!==h[2]||e.brief_sha256!==hash(body))errors.push(`Audio brief ${i} does not match source`);
  const proof=(e.evidence||[]).map(id=>evidence.get(id)).filter(p=>p?.result==='PASS');
  if(e.status==='ACCEPTED'&&e.integration==='campaign'&&proof.some(p=>p.category==='human')&&proof.some(p=>['runtime','android'].includes(p.category))&&e.artifacts?.length)accepted.push(e.id);
 }
 return {required:129,accepted:accepted.length,missing:entries.filter(e=>!accepted.includes(e.id)).map(e=>e.id),errors};
}
