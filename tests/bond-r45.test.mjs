// R45 (D90): «scelte che influenzano relazione amore con Lulù e cambia finale varie variabili… coinvolgimento utente».
// Four bond moments, a heart worked out from saved flags, Lulú's «Sono qui» in the finale, five endings on the roof.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {bondOf,heartTier,endingOf,ENDINGS,BOND_MOMENTS} from '../game/bond.mjs';
import {CHOICES,CHOICE_NOTICES,REACTIONS,STORY,EPILOGUE,resolveLines} from '../game/story-v08.mjs';
import {buildMission,CAMPAIGN} from '../game/missions.mjs';
import {newRun,tick} from '../game/campaign.mjs';
import {EN_TEXT} from '../game/locale.mjs';
const MOMENTS=['home_cup','radio_dark','chalk_word','last_lift'];
const WARM={'bond.home_cup':'window','bond.radio_dark':'answer','bond.chalk_word':'wait','bond.last_lift':'stay',glass_truth:true};
const COLD={'bond.home_cup':'door','bond.radio_dark':'off','bond.chalk_word':'arrow','bond.last_lift':'quiet',glass_truth:false};
const rt=fs.readFileSync('game/runtime.mjs','utf8');

test('the heart comes from saved choices; an old save that never saw the moments sits in the middle, the canon ending',()=>{
 assert.equal(bondOf({}),40);assert.equal(heartTier(bondOf({})),'media');assert.equal(endingOf({},50,{}),'compagni');
 assert.equal(heartTier(bondOf(WARM)),'alta');assert.equal(heartTier(bondOf(COLD)),'bassa');
 assert.equal(heartTier(bondOf({'bond.home_cup':'hold','bond.radio_dark':'listen','bond.chalk_word':'sorry','bond.last_lift':'free'})),'alta','warm without being perfect is enough');
 assert.ok(bondOf({...WARM,hand_taken:true,promise_trust:'honest'})<=100);
});

test('five endings, each one reachable, from heart, trust and how the city went',()=>{
 assert.deepEqual(ENDINGS.map(e=>e[0]),['ora_nuova','alba','attesa','compagni','strade']);
 const best={...WARM,hand_taken:true,unit9_saved:true,strangers_trust:'keep'};
 assert.equal(endingOf(best,70,{quartieri:80}),'ora_nuova');
 assert.equal(endingOf(best,70,{quartieri:50}),'alba','the city did not follow: still dawn together');
 assert.equal(endingOf({...WARM,hand_taken:true},40,{}),'attesa','love without trust: she waits');
 assert.equal(endingOf({...WARM,hand_taken:false},80,{}),'attesa','the hand left there is a choice too');
 assert.equal(endingOf(COLD,80,{quartieri:90}),'strade');
 for(const [id] of ENDINGS){assert.ok(resolveLines(STORY['ending_'+id],{}).length>=4,id);const l=EPILOGUE.at(-1)({__bond:id});assert.ok(l&&Object.hasOwn(EN_TEXT,l),id);}
 assert.equal(EPILOGUE.at(-1)({}),null,'no ending, no line');
});

test('the four moments: three options, words only, both languages, a reaction and a «will remember» each',()=>{
 for(const id of MOMENTS){const c=CHOICES[id];assert.equal(Object.keys(c.options).length,3,id);assert.ok(Object.hasOwn(EN_TEXT,c.title),c.title);
  for(const [k,o] of Object.entries(c.options)){assert.equal(o.writes['bond.'+id],k);for(const t of [o.label,o.hint,CHOICE_NOTICES[id][k]]){assert.ok(Object.hasOwn(EN_TEXT,t),t);assert.doesNotMatch(t,/\d/,'no numbers next to a choice (A-02)');}
   const r=STORY[REACTIONS[id][k]];assert.ok(r?.length,id+k);for(const l of r)assert.ok(Object.hasOwn(EN_TEXT,l.text),l.text);}
  for(const l of resolveLines(STORY[id+'_pre'],{}))assert.ok(Object.hasOwn(EN_TEXT,l.text),l.text);}
 assert.deepEqual(BOND_MOMENTS,{below:'radio_dark',city:'chalk_word'});
 const ids=CAMPAIGN.map(s=>s.id);assert.ok(ids.indexOf('separation')<ids.indexOf('below')&&ids.indexOf('below')<ids.indexOf('city'),'the radio and the chalk come after the signature, while they are apart');
});

test('the reunion remembers what each of them did while apart',()=>{
 const said=f=>resolveLines(STORY.bond_reunion,f).map(l=>l.text);
 assert.ok(said({'bond.chalk_word':'wait'}).includes('Ho trovato il gesso. «Aspettami».'));
 assert.ok(said({'bond.chalk_word':'sorry'}).includes('L’avevo scritto su sei muri.'));
 assert.ok(said({'bond.radio_dark':'off'}).includes('Ho parlato per settimane a un canale vuoto.'));
 for(const f of [{},WARM,COLD])for(const t of said(f))assert.ok(Object.hasOwn(EN_TEXT,t),t);
});

test('a high heart brings Lulú into the finale once: «Sono qui» at low health; middle and low play it as tuned',()=>{
 assert.equal(buildMission('finale',WARM,null,{}).loveAid,true);assert.ok(!buildMission('finale',{},null,{}).loveAid);assert.ok(!buildMission('finale',COLD,null,{}).loveAid);
 for(const s of CAMPAIGN.filter(x=>x.type==='foot'&&x.id!=='finale'))assert.ok(!buildMission(s.id,WARM,null,{}).loveAid,s.id);
 const c=buildMission('finale',WARM,null,{}),s=newRun(c.pov,c.map,'power',null,{flags:WARM},c);s.finalConsent=true;s.partner=null;s.enemies=[];
 const k=s.capsules[0];s.x=k.x+40;s.y=k.y;s.hp=Math.ceil(s.maxHp*.3)+1;s.inv=0;k.fuse=k.max=.05;const before=s.hp,ev=[];
 for(let i=0;i<6;i++){tick(s,{},1/30);ev.push(...s.events.map(e=>e.type));}
 assert.ok(ev.includes('loveAid'));assert.equal(s.hp,before-1+3,'one hit taken, three back');assert.equal(s.loveCame,true);
 assert.match(rt,/else if\(e\.type==='loveAid'\)\{spawnChronoFx\('chrono_rings',s\.x,s\.y-40\);notice\('Lulú: «Sono qui\.» Ti rimette in piedi\.'\);\}/);
});

test('the runtime asks each moment once, closes the roof on the ending and shows which ending, in words',()=>{
 assert.match(rt,/async function moment\(id\)\{if\(progress\.narrative\.choices\[id\]\)return;/);
 assert.match(rt,/await say\(STORY\.home\.slice\(0,-1\)\);await w;await moment\('home_cup'\);await say\(STORY\.home\.slice\(-1\)\);/);
 assert.match(rt,/if\(first&&!atBoss&&BOND_MOMENTS\[step\.id\]\)await moment\(BOND_MOMENTS\[step\.id\]\);/);
 assert.match(rt,/await say\(resolveLines\(STORY\.bond_reunion,flags\(\)\)\);flag\('reunited',true\);persist\(\);await moment\('last_lift'\);/);
 assert.match(rt,/flag\('ending',end\);await say\(STORY\['ending_'\+end\]\);/);
 assert.match(rt,/remember\('chronos-ending-'\+end\);/);
 assert.match(rt,/localeView\.write\(\$\('choice-kicker'\),'UN MOMENTO'\);const k=await choose\(id\);localeView\.write\(\$\('choice-kicker'\),'SCEGLI'\);/);assert.ok(Object.hasOwn(EN_TEXT,'UN MOMENTO'));
 assert.match(fs.readFileSync('game/style.css','utf8'),/#choice:is\(\[data-choice-id=home_cup\],\[data-choice-id=radio_dark\],\[data-choice-id=chalk_word\],\[data-choice-id=last_lift\]\)>\.card\{/);
 assert.match(fs.readFileSync('game/index.html','utf8'),/<small>LA CITTÀ RICORDA<\/small><p id="ending-name" class="ending-name"><\/p>/);
 for(const t of ['Con Lulú: vi cercate con lo sguardo.','Con Lulú: vi guardate le spalle.','Con Lulú: vi parlate poco.','Lulú: «Sono qui.» Ti rimette in piedi.'])assert.ok(Object.hasOwn(EN_TEXT,t),t);
});
