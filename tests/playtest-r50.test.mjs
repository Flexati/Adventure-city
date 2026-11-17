// R50 (D92): what three simulated testers (a child, a parent, an action designer) saw on the screenshots, once verified
// on the screenshots themselves. Simulated testers are not people: docs/gold/PLAYTEST_KIT.md is for the real ones.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {EN_TEXT} from '../game/locale.mjs';
const rt=fs.readFileSync('game/runtime.mjs','utf8'),css=fs.readFileSync('game/style.css','utf8');

test('the boss bar goes under a goal on three lines, and the bubble and notices under the bar',()=>{
 assert.match(rt,/function placeBossBar\(\)\{const key=\$\('objective'\)\.textContent\+innerWidth\+'x'\+innerHeight;if\(key===bossBarKey\)return;/);
 assert.match(rt,/if\(boss\)\{panel\('bossbar',true\);placeBossBar\(\);/);
 assert.match(css,/\.boss-active #bark\{top:max\(calc\(145px \+ env\(safe-area-inset-top\)\),var\(--bossbar-bottom,0px\)\)\}/);
});

test('names near the edge of the screen stay whole',()=>{
 assert.match(rt,/const half=m\.a\*ctx\.measureText\(text\)\.width\/2,edge=8\*\(canvas\.width\/canvas\.clientWidth\|\|1\),sx=m\.a\*x\+m\.c\*y\+m\.e,cx=Math\.min\(Math\.max\(sx,edge\+half\),canvas\.width-edge-half\);/);
});

test('a notice never covers the pause menu, the Options or the Archive, nor the bubble in landscape',()=>{
 assert.match(css,/body:has\(#pause-panel:not\(\[hidden\]\),#options:not\(\[hidden\]\),#codex:not\(\[hidden\]\)\) #notice\{opacity:0\}/);
 assert.match(css,/@media\(max-height:520px\)\{#bark:not\(\[hidden\]\)~#notice\{top:/);
 const html=fs.readFileSync('game/index.html','utf8');assert.ok(html.indexOf('id="bark"')<html.indexOf('id="notice"'),'the sibling rule needs the bubble first');
});

test('the village hint says it plainly, in both languages',()=>{
 const t='Prima di partire, parla con chi ha ★ CHIAVE sopra la testa.';assert.ok(rt.includes(`notice('${t}')`));assert.ok(Object.hasOwn(EN_TEXT,t));
 assert.ok(!rt.includes('referente chiave'));assert.ok(fs.existsSync('docs/gold/PLAYTEST_KIT.md'));
});
