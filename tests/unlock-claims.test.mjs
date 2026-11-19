import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
// The game ships as a paid upfront release on Google Play (5,99 €, no ads, no IAP): the dormant unlock screen is removed.
const html=fs.readFileSync('game/index.html','utf8'),rt=fs.readFileSync('game/runtime.mjs','utf8'),css=fs.readFileSync('game/style.css','utf8');

test('paid upfront release: no dormant in-app unlock screen or billing hooks remain',()=>{
 assert.doesNotMatch(html,/id="unlock"|id="menu-unlock"|5,99\s*€/,'index.html has no unlock modal or button');
 assert.doesNotMatch(rt,/showUnlock|demoLocked|ChronosBilling|DEMO_END|5,99\s*€/,'runtime.mjs has no paywall or billing bridge');
 assert.doesNotMatch(css,/\.unlock-card|#unlock/,'style.css has no unlock styles');
});
