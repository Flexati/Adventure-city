import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {NPC_PORTRAIT,INTERIORS} from '../game/interiors.mjs';
// Rule 6 (canon): a painted face appears only on an adopted character who lives in that village, or whom the service names.
const doc=fs.readFileSync('docs/gold/APPENDICE_NPC_PERSONAGGI_V10_2_20261028.md','utf8');
const canon=id=>doc.match(new RegExp('## [^\\n]* — character\\.'+id+'\\n[\\s\\S]*?\\*\\*Descrizione:\\*\\* ([^\\n]*)'))?.[1];
const VILLAGE={moon:'Moon Refuge',cathedral:'Cathedral Quarter',toxic:'Toxic Bazaar',clockwork:'Clockwork Outpost'};
test('NPC portraits follow the canon: adopted characters, in their own village or named by the service',()=>{
 let shown=0;
 for(const [hub,services] of Object.entries(NPC_PORTRAIT))for(const [service,id] of Object.entries(services)){
  const d=canon(id),def=INTERIORS[hub][service];assert.ok(d,id+' is in the NPC appendix');assert.ok(def,hub+'.'+service+' exists');
  assert.doesNotMatch(d,/NON adottata/,id+': proposal not adopted (D03)');
  const named=(def.npc+' '+def.place).toLowerCase().includes(id.split('_')[0]);
  assert.ok(named||d.startsWith(VILLAGE[hub]+':'),`${hub}.${service} (${def.npc}) shows ${id}: «${d}»`);
  assert.ok(fs.existsSync('game/art/npc/'+id+'.jpg'),id+'.jpg');shown++;
 }
 assert.ok(shown>=8,shown+' portraits');
});
