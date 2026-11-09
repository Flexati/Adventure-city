// Combat audit by simulation: every foot mission, played by the deterministic average-player bot (tests/helpers/autoplay.mjs)
// at two skill levels and several seeds. Reports clear time, hits taken, defeats and the incoherences a player would notice:
// enemies stuck in place, enemies inside walls, enemy shots fired without line of sight, missions that never end.
// Usage: node tools/audit_combat.mjs [out.json]      Pure simulation: no browser, no game state is edited.
import fs from 'node:fs';
import {newRun,tick,visible} from '../game/campaign.mjs';
import {CAMPAIGN,buildMission} from '../game/missions.mjs';
import {getLayout,GRID_SIZE,TILE_SIZE} from '../game/layouts.mjs';
import {makePolicy} from '../tests/helpers/autoplay.mjs';
const SKILLS={media:{reaction:.22,dodgeRate:.75},debole:{reaction:.35,dodgeRate:.45}},SEEDS=[1,2,3,4,5,6],DT=1/30,LIMIT=900;
const FLAGS={blackout_choice:'workshop',glass_truth:true,rooftop_answer:'them',clinic_hidden:true,heat:'self',channel_called:true,eve_kept:true,line_choice:'go'};
const out=process.argv[2];
function inWall(layout,a){if(!layout?.cells)return false;const x=Math.floor(a.x/TILE_SIZE),y=Math.floor(a.y/TILE_SIZE);return x>=0&&y>=0&&x<GRID_SIZE&&y<GRID_SIZE&&!layout.cells[y*GRID_SIZE+x];}
function play(id,skill,seed){
 const c=buildMission(id,FLAGS,'workshop'),s=newRun(c.pov||'nox',c.map,'power','workshop',null,c),policy=makePolicy({...SKILLS[skill],seed}),layout=getLayout(s.layoutId);
 const r={hurts:0,stuck:new Set(),walls:new Set(),blind:0,waves:[],bossAt:null};const still=new Map();
 while(s.status==='playing'&&s.time<LIMIT){
  tick(s,policy(s),DT);
  // The finale stops at 1 HP for the consent scene; this is what runtime.mjs finalConsentScene() does when it closes.
  if(s.events.some(e=>e.type==='finalConsent')){s.finalConsent=true;const b=s.enemies.find(e=>e.boss);if(b){b.guard=0;b.state='recover';b.clock=0;}}
  for(const e of s.events){if(e.type==='hurt')r.hurts++;if(e.type==='wave')r.waves.push(+s.time.toFixed(1));if(e.type==='bossWake')r.bossAt=+s.time.toFixed(1);
   if(e.type==='enemyShot'&&!e.volley){const a=s.enemies.find(x=>x.id===e.id);if(a&&!visible(a,{x:s.x,y:s.y,layoutId:s.layoutId}))r.blind++;}}
  for(const e of s.enemies){if(e.hp<=0||e.role==='moor'||e.bossKind==='anchor'||e.boss&&e.state==='dormant')continue;
   // The Anchor core is moored by canon (APPENDICE_BOSS_VARIANTI: «Nucleo d'ormeggio immobile»): it never counts as stuck.
   if(inWall(layout,e))r.walls.add(e.role+'#'+e.id);
   const k=still.get(e.id);const moving=!['dormant','stun','patrol','warn','charge','volley','recover'].includes(e.state)&&e.moveSpeed>0;
   if(!k||Math.hypot(e.x-k.x,e.y-k.y)>6)still.set(e.id,{x:e.x,y:e.y,t:s.time});else if(moving&&s.time-k.t>15)r.stuck.add(e.role+'#'+e.id+'@'+Math.round(e.x)+','+Math.round(e.y)+' '+e.state+(e.boss?' boss '+e.bossKind:''));}
 }
 return {status:s.status,time:+s.time.toFixed(1),hp:s.hp,hurts:r.hurts,kills:s.kills,left:s.enemies.filter(e=>e.hp>0&&e.role!=='moor').length,stuck:[...r.stuck],walls:[...r.walls],blindShots:r.blind,waves:r.waves,bossAt:r.bossAt};
}
const steps=CAMPAIGN.filter(x=>x.type==='foot').map(x=>x.id),report={};
for(const id of steps){report[id]={};for(const skill of Object.keys(SKILLS)){const runs=SEEDS.map(seed=>play(id,skill,seed)),won=runs.filter(r=>r.status==='won'||r.status==='cleared'||r.status==='complete'),times=runs.map(r=>r.time).sort((a,b)=>a-b);
 report[id][skill]={statuses:[...new Set(runs.map(r=>r.status))],wins:won.length,runs:runs.length,timeMedian:times[times.length>>1],timeMax:times.at(-1),hurtsMedian:runs.map(r=>r.hurts).sort((a,b)=>a-b)[runs.length>>1],
  stuck:[...new Set(runs.flatMap(r=>r.stuck))],walls:[...new Set(runs.flatMap(r=>r.walls))],blindShots:runs.reduce((n,r)=>n+r.blindShots,0),timeouts:runs.filter(r=>r.status==='playing').length};}}
console.log('tappa            abilità  esito              t mediano  t max  colpi presi  bloccati  nei muri  colpi alla cieca  timeout');
for(const [id,v] of Object.entries(report))for(const [skill,x] of Object.entries(v))console.log(id.padEnd(16),skill.padEnd(8),(x.statuses.join('/')+' '+x.wins+'/'+x.runs).padEnd(18),String(x.timeMedian).padStart(9),String(x.timeMax).padStart(6),String(x.hurtsMedian).padStart(12),String(x.stuck.length).padStart(9),String(x.walls.length).padStart(9),String(x.blindShots).padStart(17),String(x.timeouts).padStart(8));
if(out)fs.writeFileSync(out,JSON.stringify(report,null,1));
