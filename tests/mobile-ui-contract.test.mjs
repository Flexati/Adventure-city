import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync('game/style.css','utf8');
const html=fs.readFileSync('game/index.html','utf8');

test('premium mobile controls retain 48px minimum critical targets',()=>{
 assert.match(css,/^button\{[^}]*min-height:48px/m);
 assert.match(css,/#hud button\{[^}]*min-height:48px[^}]*min-width:48px/);
 assert.match(css,/\.title>button\{[^}]*min-height:48px/);
 assert.match(css,/#menu #start\{[^}]*min-height:58px/);
 assert.match(css,/\.actions button\{[^}]*min-height:52px/);
 assert.match(css,/#gun\{[^}]*min-height:64px/);
 assert.match(css,/#opening-name,#opening-pick\{[^}]*min-height:54px/);
 assert.match(css,/#driving-controls button\{[^}]*min-height:65px/);
 assert.match(css,/#choice-options button,#city-choice button\{[^}]*min-height:84px/);
 assert.match(html,/<button id="pause" aria-label="Pausa"><span class="pause-icon" aria-hidden="true"><\/span><\/button>/);
 assert.doesNotMatch(html,/Ⅱ/,'pause control must not depend on a missing Unicode glyph');
});

test('gameplay overlays respect safe areas on every edge they touch',()=>{
 assert.match(css,/#hud\{[^}]*safe-area-inset-top[^}]*safe-area-inset-left[^}]*safe-area-inset-right/);
 assert.match(css,/#controls\{[^}]*safe-area-inset-bottom[^}]*safe-area-inset-left[^}]*safe-area-inset-right/);
 assert.match(css,/#talk\{[^}]*safe-area-inset-bottom[^}]*safe-area-inset-left[^}]*safe-area-inset-right/);
 assert.match(css,/#driving-controls\{[^}]*safe-area-inset-left[^}]*safe-area-inset-right[^}]*safe-area-inset-bottom/);
 assert.match(css,/\.modal\{[^}]*safe-area-inset-top[^}]*safe-area-inset-right[^}]*safe-area-inset-bottom[^}]*safe-area-inset-left/);
});

test('progressive disclosure: secondary actions start hidden and the menu is a single clear call to action',()=>{
 for(const id of ['interact','duo','magic'])assert.match(html,new RegExp(`<button id="${id}" hidden>`));
 assert.match(html,/<button id="start" class="primary">NUOVA STORIA/);
 assert.doesNotMatch(html,/data-hero=/,'point of view belongs to each mission, not to a menu toggle');
});

test('studio film is skippable with bounded fallback and retains the static brand',()=>{
 assert.match(html,/<section id="studio"[^>]*>.*<b class="z1">z<\/b>.*<b class="z2">z<\/b>/);
 assert.match(css,/\.studio-mark \.z1\{--glow:var\(--nox\)\}/);
 assert.match(css,/\.studio-mark \.z2\{--glow:var\(--lulu\)/);
 const runtime=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(html,/<video id="studio-video" playsinline muted preload="none"/);
 assert.match(runtime,/\$\('studio-skip'\)\.onclick=end/);
 assert.match(runtime,/timer=setTimeout\(end,8500\)/,'bounded fallback for the six-second author film');
 assert.match(runtime,/video\.onended=end/);
 assert.match(runtime,/video\.pause\(\);video\.removeAttribute\('src'\)/,'release decoder and stop audio when leaving');
});

test('Android wrapper pairs native pause with native resume dispatch',()=>{
 const java=fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java','utf8');
 assert.match(java,/citynativepause/);
 assert.match(java,/citynativeresume/);
 assert.match(java,/onResume\(\)[\s\S]*resumeGame\(\)/);
});
