import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
// M5 (D18): the official price is 5,99 €, one purchase. Live release documents must not drift back to 4,99.
const LIVE=['docs/PLAY_RELEASE_CHECKLIST.md','docs/RELEASE_GATE.md','docs/BLIND_PLAYTEST_V09.md','docs/production/v9/IMPLEMENTATION.md','docs/production/v9/requirements.json','docs/gold/RELEASE.md'];
const HISTORICAL=['docs/MASTER_DEVELOPMENT_PLAN_V70.md','docs/V07_ACCEPTANCE_MATRIX.md','docs/SPRITE_VISUAL_PRODUCTION_BIBLE_V70.md','docs/NARRATIVE_MISSION_PRODUCTION_MAP_V70.md','docs/production/v9/sources/05-commercial-mandate.md','docs/evidence/chrono_shadows/director/README.md'];
test('M5: live release documents quote 5,99 € and never 4,99',()=>{
 for(const f of LIVE)assert.doesNotMatch(fs.readFileSync(f,'utf8'),/4[,.]99\s*€|€\s*4[,.]99/,f);
 assert.match(fs.readFileSync('docs/PLAY_RELEASE_CHECKLIST.md','utf8'),/5,99 €/);
 assert.equal(JSON.parse(fs.readFileSync('docs/production/v9/scope-charter.json','utf8')).minimum_commercial.price_eur,5.99);
});
test('M5: historical documents keep their text and carry the 5,99 € note on top',()=>{
 for(const f of HISTORICAL){const head=fs.readFileSync(f,'utf8').slice(0,600);assert.match(head,/Nota \(M5, 4 novembre 2026\).*5,99 €.*D18/s,f);}
});
