import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {verifyV9Governance} from '../tools/verify_v9_governance.mjs';
import {HUBS,HUB_ITEMS,hubCatalog,newWorld} from '../game/hubs.mjs';

test('a gate cannot pass with unverified critical requirements or missing decision evidence',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'chronos-gates-'));
 try{
  fs.mkdirSync(path.join(root,'docs/production'),{recursive:true});fs.cpSync('docs/production/v9',path.join(root,'docs/production/v9'),{recursive:true});
  // Isolate the gate policy from the real pack's repository-relative artifacts.
  fs.writeFileSync(path.join(root,'docs/production/v9/evidence.json'),JSON.stringify({entries:[]}));
  const req=JSON.parse(fs.readFileSync(path.join(root,'docs/production/v9/requirements.json')));for(const r of req){r.evidence=[];r.status='PENDING';}
  fs.writeFileSync(path.join(root,'docs/production/v9/requirements.json'),JSON.stringify(req));
  const file=path.join(root,'docs/production/v9/gates.json'),g=JSON.parse(fs.readFileSync(file));g.gates.G0.status='PASS';fs.writeFileSync(file,JSON.stringify(g));
  const result=verifyV9Governance(root);assert.equal(result.ok,false);assert.ok(result.errors.some(e=>e.includes('unverified')));assert.ok(result.errors.some(e=>e.includes('decision evidence')));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('tampering with an evidence artifact invalidates its checksum',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'chronos-evidence-'));
 try{
  fs.mkdirSync(path.join(root,'docs/production'),{recursive:true});fs.cpSync('docs/production/v9',path.join(root,'docs/production/v9'),{recursive:true});fs.writeFileSync(path.join(root,'proof.txt'),'changed');
  const e={id:'E-TAMPER',requirements:['G0-SAVE'],commit:'test',build:'test',environment:'unit fixture',procedure:'tampered file',result:'PASS',owner:'test',date:'2026-10-22',anomalies:[],category:'technical',artifacts:[{path:'proof.txt',sha256:'0'.repeat(64)}]};
  fs.writeFileSync(path.join(root,'docs/production/v9/evidence.json'),JSON.stringify({entries:[e]}));
  const result=verifyV9Governance(root);assert.equal(result.ok,false);assert.ok(result.errors.some(e=>e.includes('checksum mismatch')));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('economy specification matches the authoritative prices, rewards and district availability',()=>{
 const spec=JSON.parse(fs.readFileSync('docs/production/v9/economy.json'));
 assert.deepEqual(spec.items,HUB_ITEMS);assert.equal(spec.currencies.coins.initial,newWorld().coins);
 assert.deepEqual(spec.currencies.coins.sources.errands,Object.fromEntries(Object.values(HUBS).flatMap(h=>h.jobs.map(j=>[j.id,j.reward]))));
 assert.deepEqual(spec.availability,Object.fromEntries(Object.entries(HUBS).map(([id,h])=>[id,Object.fromEntries(h.services.map(s=>[s,hubCatalog(id,s)]))])));
});

test('G5 cannot bypass the human G4.5 gate',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'chronos-human-gate-'));
 try{
  fs.mkdirSync(path.join(root,'docs/production'),{recursive:true});fs.cpSync('docs/production/v9',path.join(root,'docs/production/v9'),{recursive:true});
  const file=path.join(root,'docs/production/v9/gates.json'),g=JSON.parse(fs.readFileSync(file));g.gates.G4.status='PASS';g.gates.G5.status='PASS';g.gates['G4.5'].status='BLOCKED';fs.writeFileSync(file,JSON.stringify(g));
  assert.ok(verifyV9Governance(root).errors.includes('G5: predecessor has not passed'));
  delete g.gates['G4.5'];fs.writeFileSync(file,JSON.stringify(g));assert.ok(verifyV9Governance(root).errors.includes('G4.5: missing gate'));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
test('technical evidence cannot certify the human fun gate',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'chronos-human-proof-'));
 try{
  fs.mkdirSync(path.join(root,'docs/production'),{recursive:true});fs.cpSync('docs/production/v9',path.join(root,'docs/production/v9'),{recursive:true});
  const file=path.join(root,'docs/production/v9/gates.json'),g=JSON.parse(fs.readFileSync(file));g.gates['G4.5'].status='PASS';g.gates['G4.5'].decisionEvidence=['E-G0-UNIT'];fs.writeFileSync(file,JSON.stringify(g));
  assert.ok(verifyV9Governance(root).errors.includes('G4.5: human playtest evidence required'));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});
