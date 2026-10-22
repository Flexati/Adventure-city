import test from 'node:test';import assert from 'node:assert/strict';
import {newRun,tick,interactNode,startAttack} from '../game/campaign.mjs';
import {CAMPAIGN,FOOT,ACTS,stepPov,buildMission,newProgress,saveProgress,loadProgress} from '../game/missions.mjs';
import {STORY,BARKS,CHOICES,EPILOGUE,REACTIONS,SPEAKERS,resolveLines,resolveBark,reunionTier} from '../game/story-v08.mjs';
import {DRIVING_MISSIONS} from '../game/driving.mjs';
import {autoplay} from './helpers/autoplay.mjs';
const FLAGSETS=[
 {blackout_choice:'workshop',glass_truth:true,rooftop_answer:'them',clinic_hidden:true,heat:'self',channel_called:true,eve_kept:true,line_choice:'go'},
 {blackout_choice:'shelter',glass_truth:false,rooftop_answer:'ask',clinic_hidden:false,heat:'unit9',unit9_saved:true,channel_called:false,consent_channel_respected:true,eve_kept:false,line_choice:'stay'}
];
test('the campaign separates the two heroes after Ora zero and alternates their stories before the reunion',()=>{
 const ids=CAMPAIGN.map(s=>s.id);assert.equal(ids[0],'opening');assert.equal(ids.at(-1),'postcredits');assert.ok(ids.indexOf('reunion')<ids.indexOf('finale'));
 const split=ids.indexOf('separation');assert.ok(split>ids.indexOf('zero'));
 for(const step of CAMPAIGN.slice(0,split))if(step.type==='foot')assert.notEqual(FOOT[step.id].partner,false,step.id+' is played together');
 const solo=CAMPAIGN.slice(split+1,-1).filter(s=>s.type==='foot'||s.type==='drive');
 for(const step of solo.filter(s=>s.type==='foot'&&s.id!=='finale'))assert.equal(FOOT[step.id].partner,false,step.id+' is played alone');
 const povs=solo.map(stepPov);assert.ok(povs.filter(p=>p==='nox').length>=4&&povs.filter(p=>p==='lulu').length>=4,'both heroes carry the second half');
 let streak=1,max=1;for(let i=1;i<povs.length;i++){streak=povs[i]===povs[i-1]?streak+1:1;max=Math.max(max,streak);}assert.ok(max<=3,'no hero disappears for more than three steps');
 assert.ok(CAMPAIGN.some(s=>s.type==='drive'&&stepPov(s)==='lulu'),'Lulù drives after the split');
 assert.ok(CAMPAIGN.filter(s=>s.type==='drive'&&stepPov(s)==='nox').length>=3,'Nox keeps meaningful driving missions');
 for(const step of CAMPAIGN){assert.ok(ACTS[step.act],step.id);if(step.type==='drive')assert.ok(DRIVING_MISSIONS[step.drive],step.id);if(step.type==='foot')assert.ok(FOOT[step.id],step.id);}
});
test('missions use different verbs, not one repeated loop',()=>{
 const modes=new Set(Object.values(FOOT).map(c=>c.mode||(c.boss?'boss':'assault')));
 for(const m of ['assault','boss','defend','stealth'])assert.ok(modes.has(m),m);
 assert.ok(Object.values(FOOT).some(c=>c.dark),'a darkness mission exists');
 assert.ok(new Set(Object.values(FOOT).filter(c=>c.boss).map(c=>c.boss.kind)).size>=3,'three distinct bosses');
 assert.ok(new Set(DRIVING_MISSIONS.map(d=>d.mode||d.stopKind||'escape')).size>=4,'driving variants');
});
test('every story block, bark, choice and reaction resolves to short mobile-readable lines with known speakers',()=>{
 for(const step of CAMPAIGN)for(const key of [step.pre,step.post])if(key)assert.ok(STORY[key],step.id+' '+key);
 for(const flags of [{},...FLAGSETS])for(const [key,block] of Object.entries(STORY)){if(key==='reunion_close')continue;const lines=resolveLines(block,flags);assert.ok(lines.length>0,key);for(const l of lines){assert.ok(l.text.length<=240,key);assert.ok(l.speaker in SPEAKERS,key+' '+l.speaker);}}
 for(const flags of [{},...FLAGSETS])for(const [mission,table] of Object.entries(BARKS))for(const [k,line] of Object.entries(table)){const b=resolveBark(line,flags);if(b){assert.ok(b.speaker in SPEAKERS,mission+k);assert.ok(b.text.length<=160,mission+k);}}
 for(const [id,def] of Object.entries(CHOICES)){const opts=Object.entries(def.options);assert.equal(opts.length,2,id);for(const [k,o] of opts){assert.ok(o.label&&o.hint,id+k);if(REACTIONS[id])assert.ok(STORY[REACTIONS[id][k]],id+k);}}
 for(const step of CAMPAIGN.filter(s=>s.choice&&s.choice!=='blackout_power'))assert.ok(CHOICES[step.choice],step.id);
});
test('choices are not fake: each one changes a later mission, scene or the ending',()=>{
 const a=FLAGSETS[0],b=FLAGSETS[1];
 assert.notDeepEqual(buildMission('city',a,'workshop'),buildMission('city',b,'shelter'),'Officina/Rifugio changes Lulù’s defence');
 assert.equal(buildMission('archive',a).waves.length,buildMission('archive',b).waves.length,'the fixed refusal never adds trackers');
 assert.ok(buildMission('line',b).waves.length<buildMission('line',a).waves.length,'Unità 9 reaches Lulù’s line');
 assert.equal(buildMission('ascent',a).hpBonus,2);assert.equal(buildMission('ascent',b).hpBonus,undefined);
 assert.ok(buildMission('finale',a).windupBonus>0);assert.ok(buildMission('finale',b).damage>FOOT.finale.damage);
 assert.equal(buildMission('finale',a).partner,true);assert.equal(buildMission('finale',b).partner,true);
 assert.deepEqual(resolveLines(STORY.separation,a),resolveLines(STORY.separation,b),'rooftop answers never erase the violated consent');
 assert.deepEqual(resolveLines(STORY.archive_pre,a),resolveLines(STORY.archive_pre,b));
 assert.notDeepEqual(EPILOGUE.map(f=>f(a)),EPILOGUE.map(f=>f(b)));
 assert.equal(reunionTier(70),'warm');assert.equal(reunionTier(50),'tentative');assert.equal(reunionTier(40),'fragile');
 for(const tier of ['warm','tentative','fragile'])assert.ok(STORY['reunion_'+tier]);
});
test('every foot mission is winnable by an average player with ordinary inputs, on both branches',()=>{
 for(const step of CAMPAIGN.filter(s=>s.type==='foot'))for(const flags of FLAGSETS){
  const c=buildMission(step.id,flags,flags.blackout_choice);let wins=0;
  for(let seed=1;seed<=3;seed++){const s=newRun(c.pov,c.map,'power',flags.blackout_choice,{flags},c);s.finalConsent=true;const r=autoplay(s,{reaction:.3,dodgeRate:.55,seed});if(r.status==='cleared')wins++;}
  assert.ok(wins>=2,`${step.id} won ${wins}/3`);
 }
});
test('the opening mission is gentle and later missions apply real pressure',()=>{
 const hurts=id=>{const c=buildMission(id,{});const s=newRun(c.pov,c.map,'power',null,null,c);return autoplay(s,{reaction:.3,dodgeRate:.55,seed:3}).hurts;};
 assert.ok(hurts('blackout')<=3,'tutorial district forgives');assert.ok(hurts('zero')>=3,'Ora zero is a real fight');assert.ok(hurts('finale')>=3,'the finale is a real fight');
});
test('stealth: patrol cones raise the alarm, resonance blinds them and attacks from behind are silent',()=>{
 const c=buildMission('port',{});const s=newRun('lulu',1,'power',null,null,c);assert.ok(s.enemies.every(e=>e.state==='patrol'));
 const p=s.enemies[0];p.dir={x:1,y:0};s.x=p.x+120;s.y=p.y+10;for(let i=0;i<40&&!s.alarm;i++)tick(s,{},.05);assert.equal(s.alarm,true);assert.ok(s.events.some(e=>e.type==='alarm')||s.enemies.some(e=>e.hunting));
 const q=newRun('lulu',1,'power',null,null,c);const e=q.enemies[0];e.dir={x:1,y:0};q.x=e.x-90;q.y=e.y;q.fireCd=0;const hp=e.hp;assert.equal(startAttack(q,'gun',{x:1,y:0}),true);tick(q,{},.05);tick(q,{},.05);assert.ok(hp-e.hp>=c.damage*3,'silent takedown multiplier');
 const r=newRun('lulu',1,'power',null,null,c);const t=r.enemies[0];t.dir={x:1,y:0};r.x=t.x+100;r.y=t.y;t.state='stun';t.stun=5;for(let i=0;i<20;i++)tick(r,{},.05);assert.equal(r.alarm,false,'a stunned patrol sees nothing');
});
test('defend: the zone fills only while held and uncontested',()=>{
 const c=buildMission('city',{blackout_choice:'shelter'},'shelter');const s=newRun('lulu',0,'power','shelter',null,c);for(const e of s.enemies)e.hp=0;
 s.x=c.zone.x+400;s.y=c.zone.y;tick(s,{},.05);assert.equal(s.progress,0);s.x=c.zone.x;s.y=c.zone.y;s.inv=999;for(let i=0;i<20;i++)tick(s,{},.05);assert.ok(s.progress>0);
});
test('barrier blocks enemy shots and bodies; Black Pulse trades speed for a heat penalty',()=>{
 const c=buildMission('city',{},'workshop');const s=newRun('lulu',0,'power','workshop',null,c);assert.equal(s.signature,'barrier');s.face={x:1,y:0};tick(s,{duo:true},.05);assert.equal(s.barriers.length,1);assert.equal(s.barriers[0].life>11,true,'Dario’s kit lasts longer');
 const b=s.barriers[0];s.shots.push({x:b.x+120,y:b.y-34,vx:-430,vy:0,life:1});for(let i=0;i<10;i++)tick(s,{},.05);assert.equal(s.shots.length,0);assert.equal(s.hp,s.maxHp);
 const n=newRun('nox',3,'power',null,null,buildMission('below',{}));assert.equal(n.signature,'overdrive');n.duo=100;tick(n,{duo:true},.05);assert.ok(n.overdrive>0);for(let i=0;i<110;i++)tick(n,{},.05);assert.ok(n.heat>0||n.events.some(e=>e.type==='heat'));
});
test('the finale starts after reunion with Lulù supporting, never arriving mid-fight',()=>{
 const c=buildMission('finale',{line_choice:'go'}),s=newRun('nox',3,'power',null,null,c);
 assert.ok(s.partner);assert.equal(s.signature,'duo');assert.equal(c.join,undefined);
 const boss=s.enemies.find(e=>e.boss);boss.state='walk';boss.hp=1;s.inv=999;
 // Covering fire cannot end a boss. A final hit also requires the glass scene.
 s.partner.x=boss.x;s.partner.y=boss.y+40;s.partner.cd=0;tick(s,{},.05);assert.equal(boss.hp,1);
 s.x=boss.x;s.y=boss.y+60;startAttack(s,'gun',{x:0,y:-1});tick(s,{},.05);tick(s,{},.05);
 assert.equal(boss.hp,1);assert.equal(s.consentRequested,true);
 s.finalConsent=true;s.fireCd=0;s.action=null;startAttack(s,'gun',{x:0,y:-1});tick(s,{},.05);tick(s,{},.05);assert.equal(boss.hp,0);
});
test('the mirror boss reads a repeated rhythm and a counter breaks its guard',()=>{
 const c=buildMission('archive',{});const s=newRun('nox',2,'power',null,null,c);for(const n of s.nodes)n.on=true;for(const e of s.enemies)if(!e.boss)e.hp=0;const boss=s.enemies.find(e=>e.boss);boss.state='walk';boss.clock=0;
 s.actions=Array(8).fill('gun');s.inv=999;tick(s,{},.01);assert.ok(boss.guard>0,'guard raised');
 s.x=boss.x-80;s.y=boss.y;s.counterReady=.5;s.fireCd=0;s.action=null;startAttack(s,'gun',{x:1,y:0});tick(s,{},.05);tick(s,{},.05);assert.equal(boss.guard,0,'counter breaks the guard');
});
test('progress v7 keeps stable story IDs and rejects legacy campaigns without migrating',()=>{
 const p=newProgress();p.step=7;p.narrative.flags.glass_truth=true;p.cityChoice='shelter';
 const raw=JSON.parse(saveProgress(p)),r=loadProgress(JSON.stringify(raw));assert.equal(r.step,7);assert.equal(r.version,7);assert.equal(r.canon,8);
 assert.equal(r.narrative.flags.glass_truth,true);assert.equal(r.cityChoice,'shelter');
 for(const patch of [{stepId:'missing'},{status:'teleported'},{canon:6},{world:null},{narrative:null}])assert.equal(loadProgress(JSON.stringify({...raw,...patch})),null);
 for(const version of [4,5,6])assert.equal(loadProgress(JSON.stringify({...raw,version})),null);
 assert.equal(loadProgress('not json'),null);
});
