import test from 'node:test';import assert from 'node:assert/strict';
import {translateText,EN_TEXT} from '../game/locale.mjs';import {STORY,BARKS,CHOICES,resolveLines} from '../game/story-v08.mjs';
test('initial and chalk scenes have authored English for both physical consequences',()=>{
 for(const id of ['home','blackout_pre','blackout_end','escape_pre','chalk_catchup','chalk_pre','chalk_end','chalk_nox_callback','below_pre'])for(const flags of [{},{blackout_choice:'workshop','exp.chalk.route':'service','exp.chalk.completed':true},{blackout_choice:'shelter','exp.chalk.route':'direct','exp.chalk.completed':true}])for(const line of resolveLines(STORY[id],flags))assert.ok(Object.hasOwn(EN_TEXT,line.text),id+': '+line.text);
 for(const table of [BARKS.blackout,BARKS.exp_chalk_marks])for(const line of Object.values(table))assert.ok(Object.hasOwn(EN_TEXT,line.text));
 const choice=CHOICES.chalk_route;for(const value of [choice.title,...Object.values(choice.options).flatMap(o=>[o.label,o.hint])])assert.ok(Object.hasOwn(EN_TEXT,value),value);
});
test('dynamic quantities and labels translate without mutating source or hiding untranslated gaps',()=>{
 assert.equal(translateText('CURA · 3','en'),'HEAL · 3');assert.equal(translateText('NOX · VITA','en'),'NOX · HEALTH');assert.equal(translateText('SPARA','en'),'FIRE');assert.equal(translateText(' Lingua ','en'),' Language ');assert.equal(translateText('Tappa 14/31 · ✓ Progressi salvati','en'),'Stage 14/31 · ✓ Progress saved');assert.equal(translateText('Apri gli accessi 1/2','en'),'Open the access points 1/2');assert.equal(translateText('Apri gli accessi 0/2 · 2 nemici','en'),'Open the access points 0/2 · 2 enemies');assert.equal(translateText('Untranslated line','en'),'Untranslated line');assert.equal(translateText('CURA · 3','it'),'CURA · 3');
});

test('all story scenes, barks and choices have English without changing their state payloads',()=>{
 const variants=[{},...['direct','service'].flatMap(route=>[false,true].map(b=>({'exp.chalk.route':route,'exp.chalk.completed':true,blackout_choice:b?'workshop':'shelter',eve_kept:b,unit9_saved:b,hand_taken:b})))];
 for(const [id,scene]of Object.entries(STORY))for(const flags of variants)for(const line of resolveLines(scene,flags))assert.ok(Object.hasOwn(EN_TEXT,line.text),id+': '+line.text);
 for(const [id,table]of Object.entries(BARKS))for(const line of Object.values(table))assert.ok(Object.hasOwn(EN_TEXT,line.text),id+': '+line.text);
 for(const [id,c]of Object.entries(CHOICES)){const before=JSON.stringify(c);for(const source of [c.title,...Object.values(c.options).flatMap(o=>[o.label,o.hint])]){assert.ok(Object.hasOwn(EN_TEXT,source),id);translateText(source,'en');}assert.equal(JSON.stringify(c),before);}
});

test('current mission, hub and equipment source copy has English entries',async()=>{
 const {HUBS,HUB_ITEMS}=await import('../game/hubs.mjs'),{FOOT}=await import('../game/missions.mjs');const check=text=>{if(typeof text==='string')assert.ok(Object.hasOwn(EN_TEXT,text),text);};
 for(const h of Object.values(HUBS)){h.intro.forEach(check);check(h.secret);check(h.epilogue);h.people.forEach(p=>check(p[3]));h.jobs.forEach(j=>['title','brief','finish'].forEach(k=>check(j[k])));}
 for(const item of Object.values(HUB_ITEMS)){check(item.name);check(item.description);}
 for(const mission of Object.values(FOOT))for(const k of ['name','district','goal','task','end','nodeLabel','threat'])check(mission[k]);
});

test('runtime prompts discovered by English A/B traversals are translated or explicitly invariant',async()=>{
 const fs=await import('node:fs'),{LOCALE_INVARIANTS}=await import('../game/locale.mjs');
 for(const route of ['a','b']){const report=JSON.parse(fs.readFileSync(`docs/evidence/v10.2/campaign-en-${route}-report.json`));for(const text of report.locale.untranslated){if(LOCALE_INVARIANTS.has(text)||/^[\d.]+ (s|km\/h)$/.test(text)||/^(DUO|BLACK PULSE) \d+%$/.test(text))continue;assert.notEqual(translateText(text,'en'),text,text);}}
});
