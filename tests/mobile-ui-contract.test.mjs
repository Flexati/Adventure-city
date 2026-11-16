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

test('studio intro (D78): the three frames of the author, then the name with the boom; no video and no buttons, bounded time, static brand kept',()=>{
 assert.match(html,/<section id="studio"[^>]*>.*<b class="z1">z<\/b>.*<b class="z2">z<\/b>/);
 assert.match(css,/\.studio-mark \.z1\{--glow:var\(--nox\)\}/);
 assert.match(css,/\.studio-mark \.z2\{--glow:var\(--lulu\)/);
 const runtime=fs.readFileSync('game/runtime.mjs','utf8'),studio=html.match(/<section id="studio".*?<\/section>/s)[0];
 assert.ok(!/<video|<button|studio-skip|studio-sound/.test(studio),'nothing to press in the intro');
 assert.ok(!/studio-video|studio-skip|studio-sound|\.mp4/.test(runtime+css),'no leftover video code');
 assert.match(runtime,/timer=setTimeout\(end,settings\.reduced\?1200:4400\)/,'bounded time: 4.4 s, 1.2 s with reduced motion');
 assert.match(runtime,/el\.onclick=end/,'a tap passes through');
 // D78 replaces the order of D66 (name, jaguar, boom) with the author's new frames: the head, the charged head, then the name.
 assert.match(studio,/<div class="studio-stage" aria-hidden="true"><i class="studio-ring"><\/i><i class="studio-f1"><\/i><i class="studio-f2"><\/i><i class="studio-f3"><\/i><\/div>/);
 for(const k of [1,2,3]){assert.match(css,new RegExp(`#studio \\.studio-f${k}\\{background-image:url\\(art/brand/jaguar_intro_f${k}\\.webp\\)`));assert.ok(fs.existsSync(`game/art/brand/jaguar_intro_f${k}.webp`));}
 assert.match(css,/@keyframes studioF1\{0%\{opacity:0[^}]*\}5%\{opacity:1/,'the head first, at once');
 assert.match(css,/@keyframes studioF2\{0%,18\.5%\{opacity:0\}19\.5%\{opacity:1/,'the charge at 0.85 s');
 assert.match(css,/@keyframes studioF3\{0%,39\.5%\{opacity:0\}41%\{opacity:1/,'the name at 1.8 s');
 assert.match(css,/animation:studioBoom 1\.5s 1\.7s/,'the boom peaks with the name (1.7 s + 6% of 1.5 s)');
 // Without animation every layer rests on the last picture, so reduced motion shows the name and nothing moves.
 assert.match(css,/#studio \.studio-f1\{[^}]*;opacity:0;animation:/);assert.match(css,/#studio \.studio-f2\{[^}]*;opacity:0;animation:/);assert.doesNotMatch(css,/#studio \.studio-f3\{[^}]*opacity:0/);
 assert.match(css,/\.reduced-motion #studio \.studio-art,\.reduced-motion #studio \.studio-flash,\.reduced-motion #studio \.studio-stage,\.reduced-motion #studio \.studio-stage i\{animation:none\}/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)\{#studio \.studio-art,#studio \.studio-flash,#studio \.studio-stage,#studio \.studio-stage i\{animation:none\}\}/);
 // Upright the stage is wider than the screen, so the name fills the width; the shock wave keeps a 1:1 shape.
 assert.match(css,/@media\(max-aspect-ratio:1\/1\)\{#studio \.studio-stage\{width:140vw;left:-1\.8vw;--k:1\.4\}\}/);
 assert.match(css,/#studio \.studio-stage \.studio-ring\{[^}]*aspect-ratio:1;border-radius:50%/);
 assert.match(css,/url\(art\/brand\/jaguar_keyart_9x16\.webp\)/);assert.match(css,/url\(art\/brand\/jaguar_keyart_16x9\.webp\)/);
 for(const a of JSON.parse(fs.readFileSync('assets/production/v10.3/derived/REGISTRO_ARGON_INTRO_20261112.json','utf8')).assets)assert.ok(fs.existsSync(a.derivato),a.derivato);
});

test('menu (D80): Nox and Lulù enter together, never one without the other',()=>{
 // The last `.mh.lulu{…}` with a delay is the one that wins (an older rule above it is overridden for every animation).
 const lulu=css.match(/\.mh\.lulu\{[^}]*animation-delay:[^}]*\}/g).at(-1),nox=css.match(/\.mh\.nox\{[^}]*\}/g).join('');
 assert.match(lulu,/animation-delay:-\.45s,0s;/,'Lulù: bob offset, then the same entrance start as Nox');
 assert.doesNotMatch(lulu,/-1\.8s/,'a delay longer than the 0.8 s entrance would hide Nox while Lulù is already there');
 assert.doesNotMatch(nox,/animation-delay/,'Nox enters at once, Lulù at the same moment');
 assert.match(css,/@keyframes heroIn\{from\{opacity:0;scale:\.82\}to\{opacity:1;scale:1\}\}/);
 assert.match(html,/<div class="mh nox"><\/div><div class="mh lulu"><\/div>/,'both heroes are in the menu markup');
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
