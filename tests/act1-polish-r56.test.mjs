// R56 (D96): Act I polish. Pure logic plus source-level guards for what only the browser draws (the browser proof is
// tools/verify_act1_polish_r56.cjs). No story text is written here: the three new strings are UI (the stage-progress label).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {blackoutAlpha} from '../game/visuals.mjs';
import {freeEndLines,COMPETING_HOOKS,FREE_TEASER_LINES} from '../game/native-bridge.mjs';
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

test('Act I ends on ONE hook: the free app drops Veyra\'s "can you drive it" line, the paid app keeps every line',()=>{
 const end=STORY.docks_veyra_end,hook=COMPETING_HOOKS.docks_veyra[0];
 assert.equal(end.at(-1).text,hook,'the competing hook is the last line of docks_veyra_end');
 const free=freeEndLines(true,'docks_veyra',end),paid=freeEndLines(false,'docks_veyra',end);
 assert.equal(free.length,end.length-1);assert.ok(!free.some(l=>l.text===hook));
 assert.deepEqual(paid,end,'paid app: untouched');
 for(const step of CAMPAIGN.filter(s=>s.id!=='docks_veyra'))assert.deepEqual(freeEndLines(true,step.id,[{speaker:'X',text:'a'}]),[{speaker:'X',text:'a'}]);
 assert.match(FREE_TEASER_LINES[0].text,/breccia/,'the teaser then opens on the breach');
 assert.match(rt,/say\(freeEndLines\(storeGate\.free,step\.id,/);
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

test('the teaser has art (the Act II card image, already shipped) and no stale toast; the unlock screen puts the purchase under the pitch',()=>{
 assert.ok(fs.existsSync(new URL('../game/art/atti/atto_2.webp',import.meta.url)));
 assert.match(html,/<div id="teaser-art" hidden aria-hidden="true"><\/div>/);
 assert.match(css,/#teaser-art\{[^}]*art\/atti\/atto_2\.webp/);
 assert.match(css,/\.reduced-motion #teaser-art\{animation:none\}/);
 assert.match(rt,/clearNotice\(\);\n if\(!progress\.narrative\.flags\['free\.act1_teaser'\]\)\{panel\('teaser-art',true\);await say\(FREE_TEASER_LINES\);panel\('teaser-art',false\)/);
 const card=html.slice(html.indexOf('id="store-panel"'));
 assert.ok(card.indexOf('id="store-buy"')<card.indexOf('id="store-acts"'),'buy comes before the list of locked acts');
 assert.ok(card.indexOf('class="store-hero"')>0);
 for(const n of [2,3,4])assert.ok(fs.existsSync(new URL(`../game/art/atti/atto_${n}.webp`,import.meta.url)));
 assert.match(rt,/art\/atti\/atto_'\+\(ix\+2\)\+'\.webp/);
});

test('heroes: darker ground shadow, stronger halo, the partner gets a thin ring (readability on busy maps)',()=>{
 assert.match(rt,/function drawHero\(actor,name,partner=false\)\{circle\(actor\.x,actor\.y\+2,23,'#000000a8'\)/);
 assert.match(rt,/if\(partner\)circle\(actor\.x,actor\.y\+4,20/);
});
