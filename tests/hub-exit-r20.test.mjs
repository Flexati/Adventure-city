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
test('R20-c: a save made inside a hub before the new stages were inserted still loads, at the same hub',async()=>{
 const {newProgress,saveProgress,loadProgress,stepIndex,CAMPAIGN}=await import('../game/missions.mjs');
 const p=newProgress();p.step=stepIndex('toxic');p.world.visited.push('toxic');p.narrative.flags['exp.chalk.completed']=true;p.world.hub={id:'toxic',reason:'campaign',pov:'nox',returnStep:p.step,x:800,y:864};
 const raw=JSON.parse(saveProgress(p));raw.world.hub.returnStep-=6;const back=loadProgress(JSON.stringify(raw));
 assert.ok(back,'not rejected');assert.equal(CAMPAIGN[back.step].id,'toxic');assert.equal(back.world.hub.returnStep,back.step);
});
test('R20-c: the campaign has 44 steps and the 13 new stages sit on painted maps',async()=>{
 const {CAMPAIGN,FOOT,buildMission}=await import('../game/missions.mjs'),{getLayout}=await import('../game/layouts.mjs'),{PAINTED_MAPS}=await import('../game/painted-maps.mjs');
 assert.equal(CAMPAIGN.length,44);const fresh=['docks_veyra','app_breach','bone_tyrant','app_clinic','app_node','app_yard','forge_behemoth','app_port','glass_flood','glass_reaper','vega','app_archive','app_axis'];
 for(const id of fresh){assert.ok(CAMPAIGN.some(s=>s.id===id),id);const c=buildMission(id,{});assert.equal(c.paint,true,id);assert.ok(PAINTED_MAPS[c.layout],id);assert.ok(fs.existsSync('game/art/maps/'+c.layout+'.webp'),id);
  const l=getLayout(c.layout),cell=p=>l.cells[Math.floor(p.y/64)*24+Math.floor(p.x/64)];assert.equal(cell(c.start),1,id+' start on the floor');for(const n of c.nodes)assert.equal(cell(n),1,id+' device on the floor');if(c.boss)assert.equal(cell(l.boss),1,id+' boss on the floor');}
 assert.deepEqual(buildMission('vega',{}).nodes,[]);
});
