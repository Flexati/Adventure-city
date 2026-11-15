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

test('studio intro (D61): key art plus CSS lightning, no video and no buttons, bounded time, static brand kept',()=>{
 assert.match(html,/<section id="studio"[^>]*>.*<b class="z1">z<\/b>.*<b class="z2">z<\/b>/);
 assert.match(css,/\.studio-mark \.z1\{--glow:var\(--nox\)\}/);
 assert.match(css,/\.studio-mark \.z2\{--glow:var\(--lulu\)/);
 const runtime=fs.readFileSync('game/runtime.mjs','utf8'),studio=html.match(/<section id="studio".*?<\/section>/s)[0];
 assert.ok(!/<video|<button|studio-skip|studio-sound/.test(studio),'nothing to press in the intro');
 assert.ok(!/studio-video|studio-skip|studio-sound|\.mp4/.test(runtime+css),'no leftover video code');
 assert.match(runtime,/timer=setTimeout\(end,settings\.reduced\?1200:4400\)/,'bounded time: 4.4 s, 1.2 s with reduced motion');
 assert.match(css,/@keyframes studioWord\{0%\{opacity:0/,'D66: the name comes first');assert.match(css,/animation:studioArt 3\.2s 1\.25s/,'D66: then the jaguar');assert.match(css,/animation:studioBoom 1\.5s 1\.5s/,'D66: then the boom');
 assert.match(runtime,/el\.onclick=end/,'a tap passes through');
 assert.match(css,/url\(art\/brand\/jaguar_keyart_9x16\.webp\)/);assert.match(css,/url\(art\/brand\/jaguar_keyart_16x9\.webp\)/);
 for(const a of JSON.parse(fs.readFileSync('assets/production/v10.3/derived/REGISTRO_ARGON_INTRO_20261112.json','utf8')).assets)assert.ok(fs.existsSync(a.derivato),a.derivato);
});

test('Android wrapper pairs native pause with native resume dispatch',()=>{
 const java=fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java','utf8');
 assert.match(java,/citynativepause/);
 assert.match(java,/citynativeresume/);
 assert.match(java,/onResume\(\)[\s\S]*resumeGame\(\)/);
});

test('Android activity handles window and system configuration changes without being recreated',()=>{
 const manifest=fs.readFileSync('android/AndroidManifest.xml','utf8');
 const declared=manifest.match(/<activity\b[^>]*android:configChanges="([^"]*)"/);
 assert.ok(declared,'MainActivity must declare android:configChanges');
 const handled=declared[1].split('|');
 for(const change of ['orientation','screenSize','screenLayout','smallestScreenSize','density','fontScale','locale','layoutDirection','keyboardHidden','uiMode'])assert.ok(handled.includes(change),`configChanges must include ${change}`);
});

test('Android back-button exit dialog resumes the game when dismissed without a choice',()=>{
 const java=fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java','utf8');
 const back=java.match(/onBackPressed\(\)\s*\{[\s\S]*?\.show\(\);/);
 assert.ok(back,'onBackPressed must build and show the exit dialog');
 assert.match(back[0],/pauseGame\(\)/);
 assert.match(back[0],/\.setOnCancelListener\(\s*\w+\s*->\s*resumeGame\(\)\s*\)/,'cancelling the dialog (tap outside or Back) must resume the paused game');
});
