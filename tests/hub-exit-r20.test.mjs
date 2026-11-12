import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {HUBS} from '../game/hubs.mjs';
// R20-b: in the campaign, a hub is left only after both board errands are done (D65, 150-minute plan).
test('every hub has exactly two board errands and the exit asks for both',()=>{
 for(const id of ['moon','cathedral','toxic','clockwork'])assert.equal(HUBS[id].jobs.length,2,id);
 const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');
 assert.match(rt,/open=loc\.reason==='campaign'&&HUBS\[loc\.id\]\.jobs\.some\(j=>w\.quests\[j\.id\]\?\.status!=='complete'\)/);
 assert.match(rt,/if\(open\)\{hubTracked='board';notice\('Prima di partire: completa i due incarichi della bacheca\.'\);return;\}/);
});
test('the epilogue and free visits are not blocked by the campaign rule',()=>{
 const rt=fs.readFileSync(new URL('../game/runtime.mjs',import.meta.url),'utf8');assert.ok(rt.includes("open=loc.reason==='campaign'&&"));
});
