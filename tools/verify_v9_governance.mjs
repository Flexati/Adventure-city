import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

// A passing legacy campaign is not proof that the approved expansion ships.
export function v9ContentCoverage(scope,cards,evidence){
 const target=scope.minimum_commercial||{};
 const groups={region:target.mandatory_regions||[],boss:target.boss_encounters||[],race:target.competitive_races||[],rival:['veyra'],weapon:['c9','vx9','r12','h17','arc7'],language:scope.localization?.release_languages||[]};
 const required=Object.entries(groups).flatMap(([kind,ids])=>ids.map(id=>`${kind}:${id}`));
 const accepted=new Set();
 for(const card of cards){
  if(card.status!=='ACCEPTED'||card.integration!=='campaign')continue;
  const proof=(card.evidence||[]).map(id=>evidence.get(id)).filter(e=>e?.result==='PASS');
  if(!proof.some(e=>['runtime','android'].includes(e.category)))continue;
  for(const subject of card.covers||[]){
   if(subject.startsWith('language:')&&!proof.some(e=>e.category==='human'))continue;
   if(required.includes(subject))accepted.add(subject);
  }
 }
 return {required:required.length,accepted:accepted.size,missing:required.filter(id=>!accepted.has(id))};
}

export function verifyV9Governance(root){
 const dir=path.join(root,'docs/production/v9'),errors=[];
 const read=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
 const requirements=read('requirements.json'),pack=read('evidence.json'),gates=read('gates.json');
 const evidence=new Map(pack.entries.map(e=>[e.id,e]));
 const coverage=v9ContentCoverage(read('scope-charter.json'),read('completion-cards.json'),evidence);
 if(evidence.size!==pack.entries.length)errors.push('Duplicate evidence IDs');
 if(new Set(requirements.map(r=>r.id)).size!==requirements.length)errors.push('Duplicate requirement IDs');
 const required=['id','area','decision','dependencies','owner','cost','risk','acceptance','evidence','status'];
 for(const r of requirements){
  for(const field of required)if(r[field]===undefined||r[field]===null||r[field]==='')errors.push(`${r.id}: missing ${field}`);
  for(const id of r.evidence||[])if(!evidence.has(id))errors.push(`${r.id}: unknown evidence ${id}`);
  if(r.status==='VERIFIED'&&!(r.evidence||[]).some(id=>evidence.get(id)?.result==='PASS'&&evidence.get(id).requirements.includes(r.id)))errors.push(`${r.id}: VERIFIED without linked PASS evidence`);
 }
 const ids=new Set(requirements.map(r=>r.id));
 for(const e of pack.entries){
  for(const field of ['id','requirements','commit','build','environment','procedure','result','owner','date','anomalies','category','artifacts'])if(e[field]===undefined||e[field]===null||e[field]==='')errors.push(`${e.id}: missing ${field}`);
  for(const id of e.requirements||[])if(!ids.has(id))errors.push(`${e.id}: unknown requirement ${id}`);
  if(!['technical','runtime','android','performance','human','narrative'].includes(e.category))errors.push(`${e.id}: invalid category`);
  if(e.result==='PASS'&&!(e.artifacts||[]).length)errors.push(`${e.id}: PASS without artifacts`);
  for(const a of e.artifacts||[]){
   const file=path.resolve(root,a.path);
   if(!file.startsWith(path.resolve(root)+path.sep)){errors.push(`${e.id}: artifact outside repository`);continue;}
   if(!fs.existsSync(file)){errors.push(`${e.id}: missing artifact ${a.path}`);continue;}
   const sha=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
   if(sha!==a.sha256)errors.push(`${e.id}: artifact checksum mismatch ${a.path}`);
  }
 }
 const ordered=['G0','G1','G2','G3','G4','G4.5','G5'];
 for(let i=0;i<ordered.length;i++){
  const id=ordered[i],gate=gates.gates[id];
  if(!gate){errors.push(`${id}: missing gate`);continue;}
  if(gate.status!=='PASS')continue;
  if(i>0&&gates.gates[ordered[i-1]]?.status!=='PASS')errors.push(`${id}: predecessor has not passed`);
  const critical=requirements.filter(r=>r.gate===id&&r.critical);
  if(!critical.length)errors.push(`${id}: no critical requirements`);
  for(const r of critical)if(r.status!=='VERIFIED')errors.push(`${id}: unverified ${r.id}`);
  if(!gate.decisionEvidence?.length)errors.push(`${id}: no gate decision evidence`);
  for(const ev of gate.decisionEvidence||[])if(evidence.get(ev)?.result!=='PASS')errors.push(`${id}: missing PASS decision ${ev}`);
  if(id==='G4.5'&&!gate.decisionEvidence.some(ev=>evidence.get(ev)?.category==='human'))errors.push('G4.5: human playtest evidence required');
  if(id==='G1'&&read('scope-charter.json').status!=='APPROVED')errors.push('G1: Scope Charter is not approved');
  if(id==='G4'){
   for(const card of read('completion-cards.json'))if(card.status!=='ACCEPTED'||!(card.evidence||[]).some(ev=>evidence.get(ev)?.result==='PASS'))errors.push(`G4: incomplete ${card.id}`);
   for(const subject of coverage.missing)errors.push(`G4: missing campaign proof for ${subject}`);
  }
 }
 if(gates.BASELINE_STATUS==='VERIFIED'&&gates.gates.G0.status!=='PASS')errors.push('Baseline cannot be VERIFIED before G0');
 if(gates.COMMERCIAL_RELEASE==='PASS'&&ordered.some(id=>gates.gates[id].status!=='PASS'))errors.push('Commercial release cannot pass before every gate');
 return {ok:errors.length===0,errors,requirements:requirements.length,evidence:pack.entries.length,coverage,gates:Object.fromEntries(ordered.map(id=>[id,gates.gates[id]?.status]))};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const result=verifyV9Governance(process.cwd());console.log(JSON.stringify(result,null,2));if(!result.ok)process.exitCode=1;}catch(e){console.error(e.message);process.exitCode=1;}
}
