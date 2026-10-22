import test from 'node:test';import assert from 'node:assert/strict';
import {HUBS,HUB_ITEMS,hubPoints,newWorld,validateWorld,availableHubs,acceptHubJob,workHubTarget,finishHubJob,buyHubItem,equipHubItem,useHubMedicine,preparationNeeded,applyEquipment,rewardMission} from '../game/hubs.mjs';
import {newProgress,saveProgress,loadProgress,CAMPAIGN,stepIndex,buildMission} from '../game/missions.mjs';
import {getLayout,layoutWalkable,routeWaypoint} from '../game/layouts.mjs';
import {newRun,tick,moveActor,distance} from '../game/campaign.mjs';
import {newCollapse,tickCollapse,collapseWaypoint} from '../game/traversal.mjs';
import {STORY,CHOICES,resolveLines,reunionTier} from '../game/story-v08.mjs';
const visit=(p,id)=>{if(!p.world.visited.includes(id))p.world.visited.push(id);};
const job=(p,id,j)=>{assert.ok(acceptHubJob(p,id,j.id));for(const t of j.targets)assert.ok(workHubTarget(p,id,t));assert.ok(finishHubJob(p,id,j.id));};
test('four distinct hubs: every service, secret and errand can be reached with ordinary collision movement',()=>{
 const grids=new Set();for(const [id,h]of Object.entries(HUBS)){
  const l=getLayout(h.layout);grids.add(l.cells.join(''));assert.equal(h.jobs.length,2);
  for(const point of hubPoints(id)){
   assert.ok(layoutWalkable(l,point.x,point.y),id+' '+point.id);
   const actor={...l.start,layoutId:l.id};let k=0;while(distance(actor,point)>35&&k++<4000){const dest=routeWaypoint(l,actor,point),d=distance(actor,dest);moveActor(actor,(dest.x-actor.x)/Math.max(1,d)*5,(dest.y-actor.y)/Math.max(1,d)*5);}
   assert.ok(distance(actor,point)<=35,id+' reachable '+point.id);
  }
 }assert.equal(grids.size,4);
});
test('errands require acceptance and all targets; reward and components cannot duplicate across reload',()=>{
 const p=newProgress();visit(p,'toxic');const j=HUBS.toxic.jobs[0],before=p.world.coins;
 assert.equal(workHubTarget(p,'toxic',j.targets[0]),false);assert.equal(finishHubJob(p,'toxic',j.id),false);
 assert.ok(acceptHubJob(p,'toxic',j.id));assert.equal(finishHubJob(p,'toxic',j.id),false);
 for(const t of j.targets){assert.ok(workHubTarget(p,'toxic',t));assert.equal(workHubTarget(p,'toxic',t),false);}
 assert.ok(finishHubJob(p,'toxic',j.id));const r=loadProgress(saveProgress(p));assert.equal(finishHubJob(r,'toxic',j.id),false);assert.equal(acceptHubJob(r,'toxic',j.id),false);
 assert.equal(r.world.coins,before+j.reward);assert.equal(r.world.parts.toxic,1);
});
test('both mandatory preparations remain obtainable after spending every coin, for either specialization',()=>{
 for(const style of ['attack','defense']){const p=newProgress();p.world.coins=0;for(const [id,mission]of [['toxic','archive'],['clockwork','finale']]){
  visit(p,id);assert.ok(preparationNeeded(p,mission));assert.equal(buyHubItem(p,id,'smith',id+'_'+style).ok,false);
  job(p,id,HUBS[id].jobs[0]);p.world.coins=0;assert.ok(buyHubItem(p,id,'smith',id+'_'+style).ok);
  assert.equal(preparationNeeded(p,mission),null);assert.equal(buyHubItem(p,id,'smith',id+'_'+style).ok,false);
 }
 const base=buildMission('finale',{}),equipped=applyEquipment(p,base);if(style==='attack')assert.equal(equipped.damage,base.damage+2);else assert.equal(equipped.hpBonus,4);
 }});
test('shops validate local services, funds, finite stock, ownership and loadout; medicine is consumed once',()=>{
 const p=newProgress();visit(p,'moon');p.world.coins=1000;
 assert.equal(buyHubItem(p,'moon','info','intel').ok,false);assert.equal(buyHubItem(p,'clockwork','smith','coil').ok,false);
 assert.ok(buyHubItem(p,'moon','smith','coil').ok);assert.equal(buyHubItem(p,'moon','smith','coil').ok,false);assert.ok(equipHubItem(p,'coil'));assert.equal(equipHubItem(p,'vest'),false);
 for(let i=0;i<3;i++)assert.ok(buyHubItem(p,'moon','shop','medkit').ok);assert.equal(buyHubItem(p,'moon','shop','medkit').ok,false);
 const s=newRun();assert.equal(useHubMedicine(p,s),false);s.hp=1;assert.ok(useHubMedicine(p,s));assert.equal(s.hp,5);assert.equal(loadProgress(saveProgress(p)).world.inventory.medkit,2);
 p.world.coins=0;assert.equal(buyHubItem(p,'moon','smith','vest').ok,false);
 assert.ok(rewardMission(p,'blackout'));assert.equal(rewardMission(p,'blackout'),false);
});
test('separation restricts returns by protagonist and reunion reopens the connected city',()=>{
 const p=newProgress();p.world.visited=Object.keys(HUBS);p.narrative.flags.separated=true;
 assert.deepEqual(availableHubs(p,'nox'),['toxic','clockwork']);assert.deepEqual(availableHubs(p,'lulu'),['moon','cathedral']);
 p.narrative.flags.reunited=true;assert.equal(availableHubs(p,'nox').length,4);
});
test('hub location, inventory and errands round-trip, and corrupt transactions/checkpoints are rejected',()=>{
 const p=newProgress();visit(p,'moon');p.step=stepIndex('moon');p.world.hub={id:'moon',reason:'campaign',pov:'nox',returnStep:p.step,x:800,y:864};job(p,'moon',HUBS.moon.jobs[0]);
 assert.deepEqual(loadProgress(saveProgress(p)).world,p.world);
 for(const mutate of [w=>w.coins=-1,w=>w.parts.toxic=3,w=>w.equipment.weapon='vest',w=>w.hub.id='void',w=>w.hub.returnStep=10000,w=>w.inventory.evil=1,w=>w.quests.bad={},w=>w.visited.push('moon')]){const q=JSON.parse(saveProgress(p));mutate(q.world);assert.equal(loadProgress(JSON.stringify(q)),null);}
 assert.equal(validateWorld(newWorld()).coins,30);
});
test('fixed canon: refusal, reunion, three boss phases and complete ending precede the sequel hook',()=>{
 const ids=CAMPAIGN.map(s=>s.id);assert.ok(ids.indexOf('moon')<ids.indexOf('breach'));assert.ok(ids.indexOf('cathedral')<ids.indexOf('contagion'));assert.ok(ids.indexOf('reunion')<ids.indexOf('finale'));assert.ok(ids.indexOf('rooftop_end')<ids.indexOf('credits'));assert.ok(ids.indexOf('credits')<ids.indexOf('postcredits'));
 assert.equal(CHOICES.port_channel,undefined);assert.equal(CHOICES.clinic_log,undefined);assert.match(STORY.port_end.map(l=>l.text).join(' '),/spegne/);
 const tiers=new Set();for(const g of Object.values(CHOICES.rooftop_glass.options))for(const a of Object.values(CHOICES.rooftop_ask.options))tiers.add(reunionTier(50+3+3+g.thermalDelta+a.thermalDelta));assert.equal(tiers.size,3);
 assert.match(STORY.finale_pre.map(l=>l.text).join(' '),/Non ti ho creata/);assert.ok(STORY.final_glass.some(l=>l.speaker==='LULÙ'&&l.text==='Sono qui.'));
 for(const option of Object.values(CHOICES.archive_eve.options))assert.equal(option.thermalDelta,0);
});
test('collapse requires movement, telegraphs damage and can be escaped without losing a boss victory',()=>{
 const idle=newCollapse();for(let i=0;i<500;i++)tickCollapse(idle,{},.05);assert.equal(idle.status,'playing');
 const hit=newCollapse();hit.x=800;hit.y=1120;for(let i=0;i<40;i++)tickCollapse(hit,{},.05);assert.ok(hit.hp<8);
 const s=newCollapse();for(let i=0;i<6000&&s.status==='playing';i++){const to=collapseWaypoint(s),d=distance(s,to);tickCollapse(s,{x:(to.x-s.x)/Math.max(1,d),y:(to.y-s.y)/Math.max(1,d)},.05);}assert.equal(s.status,'cleared');
});
test('information purchases reveal each local secret, without blocking later districts or charging twice',()=>{
 const p=newProgress();p.world.coins=100;for(const id of ['cathedral','toxic','clockwork']){
  visit(p,id);assert.ok(buyHubItem(p,id,'info','intel').ok);assert.ok(p.world.secrets.includes(id+':map'));
  const balance=p.world.coins;assert.equal(buyHubItem(p,id,'info','intel').ok,false);assert.equal(p.world.coins,balance);
 }assert.equal(p.world.inventory.intel,3);
});
