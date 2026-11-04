import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {translateText,localeStatus} from '../game/locale.mjs';
// U2: a pause panel made for touch, and three small fixes. The pixel sizes are measured in a browser by tools/verify_hud_p1.cjs; this file keeps the source facts.
const html=fs.readFileSync('game/index.html','utf8'),runtime=fs.readFileSync('game/runtime.mjs','utf8'),css=fs.readFileSync('game/style.css','utf8');

test('U2: the pause help carries only touch hints and the save rule, no keyboard keys (D39)',()=>{
 const help=html.match(/<p id="pause-help">(.*?)<\/p>/)[1];
 assert.equal(help,'Spara: tiro assistito. Trascina e rilascia per mirare.<br>Il salvataggio riparte dall’inizio della missione, o dal boss se l’hai già raggiunto.');
 assert.doesNotMatch(help,/Tastiera|WASD/);
 assert.equal(translateText(help.split('<br>')[0],'en'),'Fire: assisted targeting. Drag and release to aim.');
 assert.equal(translateText(help.split('<br>')[1],'en'),'Your save restarts the mission, or the boss fight if you have reached it.');
});

test('U2: the pause panel groups settings and buttons in two blocks so landscape can use two columns',()=>{
 const card=html.match(/<section id="pause-panel".*?<\/section>/s)[0];
 assert.match(card,/<div class="pause-settings"><label>Lingua .*<\/p><\/div><div class="pause-actions"><button id="pause-options">.*<button id="menu-return">Menu principale<\/button><\/div><\/div><\/section>/s);
 assert.match(css,/@media\(max-height:520px\) and \(orientation:landscape\)\{\n #pause-panel \.card\{[^}]*display:grid;grid-template-columns:/);
 assert.match(css,/\.options-page select,#pause-panel select\{margin-left:auto;min-height:44px\}/);
});

test('U2: opening the pause focuses Resume without scrolling the card',()=>{
 assert.match(runtime,/audioDirector\.pause\(\);\$\('resume'\)\.focus\(\{preventScroll:true\}\);/);
});

test('U2: leaving a hub drops the scene first, so a failed save keeps its notice',()=>{
 assert.match(runtime,/progress\.world\.hub=null;running=false;hideGameplay\(\);persist\(\);/);
 assert.doesNotMatch(runtime,/persist\(\);hideGameplay\(\);/);
});

test('U2: the stealth meter may shrink with its chip',()=>{
 assert.match(css,/#meter\{[^}]*min-width:0\}/);
});

test('U2: the integrity label is translated, truck included',()=>{
 assert.match(runtime,/setVitalMeter\(\$\('integrity'\),s\.hp,s\.maxIntegrity,tr\(\(s\.vehicle==='truck'\?'CAMION':'VORTEX'\)\+' · INTEGRITÀ'\)/);
 assert.equal(translateText('VORTEX · INTEGRITÀ','en'),'VORTEX · INTEGRITY');
 assert.equal(translateText('CAMION · INTEGRITÀ','en'),'TRUCK · INTEGRITY');
 assert.deepEqual(localeStatus().untranslated,[]);
});
