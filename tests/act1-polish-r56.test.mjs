// R56 (D96): Act I polish, paid line (jaguarZcreatorZ13.app): the free app's teaser, unlock screen and hook trimming are not here.
// R56 (D96): Act I polish. Pure logic plus source-level guards for what only the browser draws (the browser proof is
// tools/verify_act1_polish_r56.cjs). No story text is written here: the three new strings are UI (the stage-progress label).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {blackoutAlpha} from '../game/visuals.mjs';
import {STORY} from '../game/story-v08.mjs';
import {CAMPAIGN} from '../game/missions.mjs';
import {translateText} from '../game/locale.mjs';
const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../game/style.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../game/index.html',import.meta.url),'utf8');

test('blackout darkness falls with every relay: dark at 0, almost lit at 3/3, clamped, never NaN',()=>{
 const a=[0,1/3,2/3,1].map(blackoutAlpha);
 assert.equal(a[0],.66);assert.equal(a[3],.14);
 for(let i=1;i<a.length;i++)assert.ok(a[i]<a[i-1],'each relay lights the quarter');
 assert.equal(blackoutAlpha(-5),.66);assert.equal(blackoutAlpha(9),.14);assert.equal(blackoutAlpha(undefined),.66);assert.equal(blackoutAlpha('x'),.66);
 assert.match(rt,/s\.mission==='blackout'\?blackoutShade\(s\.nodes\)/,'drawDark uses the relay share only on the blackout stage');
 assert.match(rt,/s\.c\.dark\|\|s\.rookDark\|\|s\.mission==='blackout'/,'the darkness pass runs on blackout');
});

test('paid app: Act I keeps every closing line (Veyra\'s "can you drive it" included), no teaser, no store',()=>{
 const end=STORY.docks_veyra_end;
 assert.equal(end.at(-1).text,'Adesso fatemi vedere se sapete anche guidarla.');
 assert.match(rt,/await say\(resolveLines\(STORY\[step\.post\],flags\(\)\)\);if\(id!==runId\)return;/);
 assert.doesNotMatch(rt,/freeEndLines|storeGate|FREE_TEASER_LINES|showStoreScreen/);
 assert.doesNotMatch(html,/teaser-art|store-panel/);
 assert.doesNotMatch(css,/#teaser-art|\.store-hero/);
});
test('the blackout opener is delivered as radio barks (same three lines, no blocking dialogue); other stages still pause for their lines',()=>{
 assert.match(rt,/const INLINE_PRE=new Set\(\['blackout'\]\)/);
 assert.match(rt,/if\(INLINE_PRE\.has\(step\.id\)\)\{for\(const l of pre\)barkQueue\.push\(l\)/);
 assert.equal(STORY.blackout_pre.length,3);
 assert.deepEqual(STORY.blackout_pre.map(l=>l.text),['Hanno spento l’intero isolato. Vedo tre relè lungo il cantiere.','Riaccendiamoli insieme e apriamo le uscite.','Io tengo lontana la gang. Tu metti in salvo le persone.'],'story text unchanged');
});

test('stage cards are short and show the position inside the act',()=>{
 const m=rt.match(/const CARD_MS=\{plain:(\d+),goal:(\d+)\}/);assert.ok(m);assert.ok(+m[1]<=1500&&+m[2]<=2800);
 assert.match(rt,/setTimeout\(close,goal\?CARD_MS\.goal:CARD_MS\.plain\)/);
 const perAct={};for(const s of CAMPAIGN)perAct[s.act]=(perAct[s.act]||0)+1;
 assert.equal(perAct[1],6);assert.equal(Object.values(perAct).reduce((a,b)=>a+b,0),CAMPAIGN.length);
 assert.equal(translateText('Atto 1 · Tappa 3 di 6 · ✓ Progressi salvati','en'),'Act 1 · Stage 3 of 6 · ✓ Progress saved');
 assert.equal(translateText('Atto 4 · Tappa 2 di 7','en'),'Act 4 · Stage 2 of 7');
 assert.equal(translateText('Tappa 3/44','en'),'Stage 3/44','the old label still translates (old saves/tools)');
});

test('screen shake: impacts add up under a cap, the offset is smooth (no per-frame random), reduced motion stays at zero',()=>{
 assert.ok(!/Math\.random\(\)-\.5\)\*shake/.test(rt),'no random-per-frame shake left');
 assert.match(rt,/function addShake\(n\)\{shake=Math\.min\(12,Math\.max\(shake,n\)\+n\*\.2\);\}/);
 assert.match(rt,/function shakeOffset\(\)\{if\(shake<=\.01\)return 0;/);
 assert.ok((rt.match(/settings\.reduced\?0:shakeOffset\(\)/g)||[]).length>=4,'the four draw paths keep the reduced-motion guard');
 assert.ok(!/(?<![\w.])shake=[1-9]/.test(rt),'no impact overwrites the shake with a bare number any more');
});

test('driving spectacle never draws under reduced motion and uses no random numbers',()=>{
 const fx=rt.slice(rt.indexOf('const SPEED_STREAKS'),rt.indexOf('function drawDriving('));
 assert.ok(fx.length>200&&!/Math\.random/.test(fx));
 assert.match(rt,/if\(!settings\.reduced\)drawDriveSpeedFx\(ctx,d,worldH,sideW\)/);
 assert.match(rt,/if\(!settings\.reduced&&d\.inv>0\)drawDriveSparks/);
});

test('one message channel: toasts sit under a visible bark; a boss fight keeps the bark clear of the Bagaglio button',()=>{
 assert.match(css,/body\.bark-on #notice\{top:calc\(var\(--bark-bottom/);
 assert.match(css,/\.boss-active #bark\{left:max\(10px,env\(safe-area-inset-left\)\);transform:none;max-width:calc\(100vw - 150px\)\}/);
 assert.match(rt,/document\.body\.classList\.add\('bark-on'\)/);
 assert.match(rt,/document\.body\.classList\.remove\('bark-on'\);clearNotice\(\)/,'hideGameplay clears it');
});

test('heroes: darker ground shadow, stronger halo, the partner gets a thin ring (readability on busy maps)',()=>{
 assert.match(rt,/function drawHero\(actor,name,partner=false\)\{circle\(actor\.x,actor\.y\+2,23,'#000000a8'\)/);
 assert.match(rt,/if\(partner\)circle\(actor\.x,actor\.y\+4,20/);
});
