import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync('game/style.css','utf8');
const html=fs.readFileSync('game/index.html','utf8');

test('premium mobile controls retain 48px minimum critical targets',()=>{
 assert.match(css,/#hud button\{[^}]*min-height:48px/);
 assert.match(css,/\.title>button\{min-height:48px/);
 assert.match(css,/#menu \.heroes button\{min-height:48px/);
 assert.match(css,/#menu #start\{min-height:48px/);
 assert.match(css,/#opening-name,#opening-pick\{[^}]*min-height:54px/);
 assert.match(css,/#driving-controls button\{[^}]*min-height:65px/);
});

test('gameplay overlays respect horizontal and bottom safe areas',()=>{
 assert.match(css,/#hud\{[^}]*safe-area-inset-left[^}]*safe-area-inset-right/);
 assert.match(css,/#controls\{[^}]*safe-area-inset-bottom[^}]*safe-area-inset-left[^}]*safe-area-inset-right/);
 assert.match(css,/#talk\{[^}]*safe-area-inset-bottom[^}]*safe-area-inset-left[^}]*safe-area-inset-right/);
 assert.match(css,/#driving-controls\{[^}]*safe-area-inset-left[^}]*safe-area-inset-right[^}]*safe-area-inset-bottom/);
});

test('player-facing hero copy exposes distinct combat identities',()=>{
 assert.match(html,/NOX<small>Precisione · schivata perfetta<\/small>/);
 assert.match(html,/LULÙ<small>Risonanza · controllo<\/small>/);
 assert.doesNotMatch(html,/L: magia/);
});

test('Android wrapper pairs native pause with native resume dispatch',()=>{
 const java=fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/MainActivity.java','utf8');
 assert.match(java,/citynativepause/);
 assert.match(java,/citynativeresume/);
 assert.match(java,/onResume\(\)[\s\S]*resumeGame\(\)/);
});
