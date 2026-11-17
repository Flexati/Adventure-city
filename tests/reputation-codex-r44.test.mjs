// R44 (D89): «Rendere le scelte più incisive… reputazione… cambiamenti di storia e livelli… alla finale tutto
// collegato con i risultati… l'epilogo… gli stranieri, ogni abitante, nemico o boss approfondito».
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {reputation,tierOf} from '../game/reputation.mjs';
import {buildMission,CAMPAIGN} from '../game/missions.mjs';
import {newRun,tick} from '../game/campaign.mjs';
import {CHOICES,CHOICE_NOTICES,EPILOGUE} from '../game/story-v08.mjs';
import {CODEX,CODEX_CATS,codexOpen} from '../game/codex.mjs';
import {EN_TEXT} from '../game/locale.mjs';
const GOOD={blackout_choice:'shelter',rooftop_answer:'them',heat:'unit9',line_choice:'stay'};
const BAD={blackout_choice:'workshop',rooftop_answer:'ask',heat:'self',line_choice:'go','exp.chalk.route':'direct'};

test('reputation comes from what was chosen and done; nothing chosen is the middle, so stages stay as tuned',()=>{
 const none=reputation({flags:{}},{});assert.deepEqual(Object.keys(none),['quartieri','stranieri','intesa','veyra']);
 assert.equal(tierOf(none.quartieri),'media');assert.equal(tierOf(reputation({flags:GOOD},{}).quartieri),'alta');assert.equal(tierOf(reputation({flags:BAD},{}).quartieri),'bassa');
 const errands={quests:{a:{status:'complete'},b:{status:'complete'},c:{status:'active'}}};assert.equal(reputation({flags:{}},errands).quartieri,54,'completed errands count');
 assert.equal(reputation({flags:{},thermal:72},{}).intesa,72,'the bond is the thermal the game already keeps');
 for(const s of CAMPAIGN.filter(x=>x.type==='foot')){const a=buildMission(s.id,{},null,{});assert.ok(!a.civicAid&&!a.civicCold&&!a.strangersAid,s.id+' unchanged');}
});

test('the districts help or press: one raider fewer at the start, or one more in the last wave; never in the tutorial or the stealth stage',()=>{
 const base=buildMission('line',{},null,{}),good=buildMission('line',GOOD,null,{}),bad=buildMission('line',BAD,null,{});
 assert.ok(good.civicAid);assert.equal(good.waves[0].length,base.waves[0].length-1);
 assert.ok(bad.civicCold);assert.equal(bad.waves.at(-1).length,base.waves.at(-1).length+1);assert.equal(bad.waves.at(-1).at(-1),'raider');
 assert.ok(!buildMission('blackout',GOOD,null,{}).civicAid);assert.ok(!buildMission('port',BAD,null,{}).civicCold);
 const rt=fs.readFileSync('game/runtime.mjs','utf8');assert.match(rt,/if\(def\.civicAid\)notice\(/);
});

test('the strangers ask nothing and explain nothing; keep the promise and they come back in the finale',()=>{
 const c=CHOICES.strangers_trust;assert.deepEqual(Object.keys(c.options),['keep','ask']);assert.ok(CHOICE_NOTICES.strangers_trust);
 for(const t of [c.title,...Object.values(c.options).flatMap(o=>[o.label,o.hint])]){assert.ok(Object.hasOwn(EN_TEXT,t),t);assert.doesNotMatch(t,/\d/,'no numbers next to a moral choice (A-02)');assert.doesNotMatch(t,/[Ff]rattura/,'they never explain the Fracture');}
 const kept={strangers_met:true,strangers_trust:'keep',broken_clock_fragment:true};
 const f=buildMission('finale',kept,null,{});assert.equal(f.strangersAid,true);assert.ok(!buildMission('finale',{strangers_met:true,strangers_trust:'ask'},null,{}).strangersAid);
 const s=newRun(f.pov,f.map,'power',null,{flags:kept},f);s.finalConsent=true;const boss=s.enemies.find(e=>e.boss);boss.state='walk';boss.hp=boss.max*.6;
 const ev=[];for(let i=0;i<3;i++){tick(s,{},1/30);ev.push(...s.events.map(e=>e.type));}
 assert.ok(ev.includes('strangersAid'));assert.deepEqual(s.allies.map(a=>a.id),['kairn','morrow']);
 assert.match(fs.readFileSync('game/runtime.mjs','utf8'),/await say\(STORY\.strangers_after\);[^\n]*await choose\('strangers_trust'\);/);
});

test('the epilogue closes on how it went, in words: the districts always, the strangers when they were met',()=>{
 const run=(flags,rep)=>EPILOGUE.map(fn=>fn({...flags,__rep:rep})).filter(Boolean);
 const high=run({strangers_met:true},{quartieri:80,stranieri:90}),low=run({},{quartieri:20,stranieri:20});
 assert.ok(high.some(l=>l.startsWith('Vanta si fida di voi')));assert.ok(high.some(l=>l.startsWith('Gli stranieri hanno mantenuto la parola')));
 assert.ok(low.some(l=>l.startsWith('Vanta vi guarda da lontano')));assert.ok(!low.some(l=>l.includes('stranieri')));
 for(const l of [...high,...low])assert.ok(Object.hasOwn(EN_TEXT,l),l);
 assert.match(fs.readFileSync('game/runtime.mjs','utf8'),/__rep:reputation\(progress\.narrative,progress\.world\)/);
});

test('the Archive: every page opens on a real stage, has both languages, and enemies and bosses say how to read them',()=>{
 const ids=new Set(CAMPAIGN.map(s=>s.id));assert.deepEqual(CODEX_CATS.map(c=>c[0]),['compagni','stranieri','nemici','boss','abitanti']);
 assert.equal(new Set(CODEX.map(e=>e.id)).size,CODEX.length,'unique pages');
 for(const e of CODEX){assert.ok(ids.has(e.after),e.id+' opens on '+e.after);assert.ok(e.it&&e.en,e.id);
  if(['nemici','boss'].includes(e.cat))assert.ok(e.tipIt&&e.tipEn,e.id+' reading tip');
  if(e.cat==='stranieri')assert.doesNotMatch(e.it+e.en,/[Ff]rattur|[Ff]racture/,'the strangers do not explain the Fracture');}
 assert.equal(CODEX.filter(e=>e.cat==='boss').length,9);assert.equal(CODEX.filter(e=>e.cat==='stranieri').length,2);
 assert.equal(codexOpen(CODEX.find(e=>e.id==='archon'),{step:0,world:{rewards:[]}},CAMPAIGN),false);
 assert.equal(codexOpen(CODEX.find(e=>e.id==='rook'),{step:1,world:{rewards:['blackout']}},CAMPAIGN),true);
 const html=fs.readFileSync('game/index.html','utf8'),rt=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(html,/<button id="pause-codex">Archivio<\/button>/);assert.match(html,/<section id="codex" class="modal" hidden/);
 assert.match(rt,/function openCodex\(cat=codexCat\)\{/);assert.match(rt,/if\(cat==='abitanti'\)\{const seen=new Set\(progress\?\.world\?\.visited\|\|\[\]\)/);
});
