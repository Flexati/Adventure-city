import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rt = fs.readFileSync(new URL('../game/runtime.mjs', import.meta.url), 'utf8');
const hide = rt.slice(rt.indexOf('function hideGameplay()'), rt.indexOf('async function newGame()'));
const driveHud = rt.slice(rt.indexOf("setText('district','GUIDA · '"), rt.indexOf('function drawScene('));

test('hideGameplay clears hudCache so boss-active and stealth meter states re-apply after retry', () => {
  assert.ok(hide.includes('function hideGameplay()'), 'hideGameplay must be present');
  assert.ok(hide.includes("document.body.classList.remove('boss-active')"), 'hideGameplay must drop boss-active');
  assert.match(hide, /for\s*\(\s*const\s+k\s+in\s+hudCache\s*\)\s*delete\s+hudCache\s*\[\s*k\s*\]/, 'hideGameplay must reset hudCache so the next HUD pass reapplies cached classes');
  assert.ok(rt.includes("const hasBoss=!!boss;if(hudCache.boss!==hasBoss){hudCache.boss=hasBoss;document.body.classList.toggle('boss-active',hasBoss);}"), 'updateFootHud must re-apply boss-active from a cleared cache');
  assert.ok(rt.includes("if(hudCache.mAlert!==true){hudCache.mAlert=true;meter.classList.add('alert');}"), 'stealth meter must re-apply the alert class after a cache reset');
});

test('the driving timer meter keeps hudCache in sync with the alert class and fill width', () => {
  assert.ok(driveHud.includes("const mAlert=c.limit-d.time<15;if(hudCache.mAlert!==mAlert){hudCache.mAlert=mAlert;$('meter').classList.toggle('alert',mAlert);}"), 'driving HUD must write hudCache.mAlert when toggling #meter.alert');
  assert.ok(driveHud.includes("const mw=Math.max(0,100*(1-d.time/c.limit))+'%';if(hudCache.mw!==mw){hudCache.mw=mw;$('meter-fill').style.width=mw;}"), 'driving HUD must write hudCache.mw when updating the meter fill');
});
