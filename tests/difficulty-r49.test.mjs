// R49 (D92, the proposal of D86): a difficulty curve by act, made of waves and boss health only, and a story mode for
// whoever wants the tale without the fight. The simulation is the gate (tools/audit_combat.mjs, same bots as D48).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {CURVE,applyCurve} from '../game/difficulty.mjs';
import {buildMission,CAMPAIGN} from '../game/missions.mjs';
import {EN_TEXT} from '../game/locale.mjs';
const rt=fs.readFileSync('game/runtime.mjs','utf8');

test('the curve changes only waves and boss health, on stages that exist, and never the tutorial or the first act',()=>{
 const foot=new Set(CAMPAIGN.filter(s=>s.type==='foot').map(s=>s.id));
 for(const [id,k] of Object.entries(CURVE)){assert.ok(foot.has(id),id);assert.deepEqual(Object.keys(k).filter(x=>!['boss','add'].includes(x)),[],id+': only boss and add');
  assert.ok(CAMPAIGN.find(s=>s.id===id).act>=2,id+' is past Act I');if(k.boss)assert.ok(k.boss>1&&k.boss<=1.25,id);}
 const c=applyCurve({boss:{kind:'vega',hp:265},waves:[['raider'],['shooter','breaker'],['brute']]},'vega');
 assert.equal(c.boss.hp,305);
 assert.equal(buildMission('vega',{}).boss.hp,305);assert.equal(buildMission('blackout',{}).boss.hp,60,'Rook, the tutorial boss, as tuned');
 assert.match(fs.readFileSync('game/missions.mjs','utf8'),/applyCurve\(c,id\);\n  const solo=/);
});

test('the curve rises by act in the simulation, and the weak player still wins everything',{timeout:120000},()=>{
 const out=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'chronos-curve-')),'audit.json');
 execFileSync(process.execPath,['tools/audit_combat.mjs',out],{stdio:'pipe'});const r=JSON.parse(fs.readFileSync(out,'utf8'));
 const act=n=>CAMPAIGN.filter(s=>s.type==='foot'&&s.act===n&&r[s.id]).map(s=>r[s.id].media.hurtsMedian),mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
 assert.ok(mean(act(2))>mean(act(1)),'Act II is harder than Act I');assert.ok(mean(act(4))>mean(act(2))&&mean(act(4))>mean(act(3)),'the finale is the peak');
 for(const id of ['city','vega','archive'])assert.ok(r[id].media.hurtsMedian>=3,id+' is no longer harmless');
 assert.ok(r.vega.media.timeMedian>=34,'Vega, a boss, lasts long enough for her phases');
 for(const v of Object.values(r))assert.equal(v.debole.wins,v.debole.runs,'the weak player wins every stage');
});

test('story mode: more health from the next stage, from the Options, in both languages',()=>{
 assert.match(rt,/if\(settings\.story\)def\.hpBonus=\(def\.hpBonus\|\|0\)\+4;/);
 assert.match(rt,/\$\('opt-story'\)\.onchange=\(\)=>\{settings\.story=\$\('opt-story'\)\.checked;saveSettings\(\);\};/);
 const html=fs.readFileSync('game/index.html','utf8');assert.match(html,/<label><input id="opt-story" type="checkbox"> Modalità storia: più punti vita, dalla prossima tappa<\/label>/);
 assert.ok(Object.hasOwn(EN_TEXT,'Modalità storia: più punti vita, dalla prossima tappa'));
});
