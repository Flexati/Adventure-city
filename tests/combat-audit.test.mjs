import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {execFileSync} from 'node:child_process';
// D48: the combat audit by simulation (tools/audit_combat.mjs) is a gate. Every foot mission is won by the average-player bot
// at both skill levels and every seed, nothing gets stuck or inside walls, nothing runs out the clock, and no Act II fight
// is harmless (the Contagion used to land zero hits).
test('D48: every foot mission is winnable, coherent and never harmless',{timeout:120000},()=>{
 const out=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'chronos-audit-')),'audit.json');
 execFileSync(process.execPath,['tools/audit_combat.mjs',out],{stdio:'pipe'});const r=JSON.parse(fs.readFileSync(out,'utf8'));
 assert.equal(Object.keys(r).length,12);
 for(const [id,v] of Object.entries(r))for(const [skill,x] of Object.entries(v)){
  assert.equal(x.wins,x.runs,`${id} ${skill}: ${x.wins}/${x.runs} won`);assert.equal(x.timeouts,0,id+' timeout');
  assert.deepEqual(x.stuck,[],id+' stuck enemies');assert.deepEqual(x.walls,[],id+' enemies inside walls');}
 for(const id of ['breach','contagion','zero'])assert.ok(r[id].media.hurtsMedian>=2,id+' must threaten the average player');
 assert.ok(r.blackout.media.hurtsMedian<=r.zero.media.hurtsMedian,'the tutorial district stays gentler than Ora zero');
 assert.ok(r.finale.media.hurtsMedian>=r.zero.media.hurtsMedian,'the finale is at least as hard as Ora zero');
});
