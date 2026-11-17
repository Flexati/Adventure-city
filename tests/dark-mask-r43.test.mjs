// R43: dark stages (below, archive, finale's dark phases) spent a third of the frame painting the shadow mask at half
// size (CI: «below» p95 17–19 ms at CPU ×4, limit 16). The mask is soft by nature: a quarter-size mask looks the same
// (docs/gold/STATO.md, R43) and the lights out of view are not stamped.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
test('the shadow mask is a quarter of the screen and skips lights out of view',()=>{
 const rt=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(rt,/function drawDark\(w,h\)\{const s=state,sw=Math\.ceil\(canvas\.width\/4\),sh=Math\.ceil\(canvas\.height\/4\);/);
 assert.match(rt,/if\(px\+rr<0\|\|py\+rr<0\|\|px-rr>sw\|\|py-rr>sh\)return;/);
});
