// D39: «È un gioco full mobile». A player's keyboard does not play; only an automated browser (the verifiers) may.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8'),html=fs.readFileSync(new URL('../game/index.html',import.meta.url),'utf8');
test('play keys are read only when navigator.webdriver is true; Esc stays for the pause',()=>{
 assert.match(rt,/const KEYBOARD_PLAY=typeof navigator!=='undefined'&&navigator\.webdriver===true;/);
 assert.match(rt,/if\(e\.code==='Escape'\)\{[^}]*closeOptions\(\);return;\}if\(paused\)setPause\(false\);else setPause\(true\);return;\}if\(!running\|\|paused\|\|uiLock\|\|!KEYBOARD_PLAY\)return;/);
 assert.equal((rt.match(/addEventListener\('keydown'/g)||[]).length,2,'one handler for play (gated), one that only unlocks audio');
});
test('no text in the game tells the player about keyboard controls',()=>{
 assert.doesNotMatch(html,/WASD|Tastiera/);
 assert.match(html,/Muovi con il joystick\./);
});
