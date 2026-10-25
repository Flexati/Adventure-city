import {getLayout,routeWaypoint} from '../../game/layouts.mjs';
// Deterministic "average player" policy used to prove every foot mission is winnable through
// ordinary inputs (move, shoot, dodge, ability, interact). It never edits mission state.
import {tick,distance,unit,visible} from '../../game/campaign.mjs';
export function makePolicy({reaction=.22,dodgeRate=.75,seed=7}={}){
 let r=seed>>>0;const rand=()=>(r=(r*1664525+1013904223)>>>0)/4294967296;
 const noticed=new Map();
 const toward=(s,t)=>{const p=visible(s,{...t,layoutId:s.layoutId})?t:routeWaypoint(getLayout(s.layoutId),s,t);return unit({x:p.x-s.x,y:p.y-s.y});};
 return (s)=>{
  const live=s.enemies.filter(e=>e.hp>0&&e.state!=='dormant'),inp={x:0,y:0};
  const threats=live.filter(e=>(e.state==='warn'&&e.target&&!e.ranged&&distance(s,e.target)<(e.attackRadius||0)+18)||(e.state==='charge'&&distance(s,e)<260));
  for(const e of threats){if(!noticed.has(e.id+':'+e.state+e.pattern))noticed.set(e.id+':'+e.state+e.pattern,{t:s.time,ok:rand()<dodgeRate});}
  const shot=s.shots.find(b=>Math.hypot(b.x-s.x,b.y+34-s.y)<90);
  const danger=threats.find(e=>{const n=noticed.get(e.id+':'+e.state+e.pattern);return n&&n.ok&&s.time-n.t>reaction&&(e.state==='charge'?e.clock>e.windup-.2:e.clock>e.windup-.3);});
  if((danger||shot&&rand()<dodgeRate*.06)&&s.dashCd===0){const from=danger?(danger.state==='charge'?danger:danger.target):{x:shot.x,y:shot.y+34};const u=unit({x:s.x-from.x+.01,y:s.y-from.y});inp.x=u.y;inp.y=-u.x;if(danger&&danger.state!=='charge'){inp.x=u.x;inp.y=u.y;}inp.dash=true;return inp;}
  if(s.duo>=100&&live.length)inp.duo=true;
  if(s.c.mode==='defend'||s.c.mode==='chalk'&&s.nodes.every(n=>n.on)){const z=s.c.zone;if(distance(s,z)>z.r*.5){const u=unit({x:z.x-s.x,y:z.y-s.y});inp.x=u.x;inp.y=u.y;}if(live.some(e=>distance(s,e)<380&&visible(s,e))){inp.gun=true;inp.magic=true;}return inp;}
  const node=s.nodes.find(n=>!n.on);
  const near=live.filter(e=>distance(s,e)<380&&visible(s,e)).sort((a,b)=>distance(s,a)-distance(s,b));
  if(s.c.mode==='stealth'&&node){const u=toward(s,node);if(distance(s,node)>60){inp.x=u.x;inp.y=u.y;}else inp.interact=true;if(near.length&&(s.alarm||near[0].state==='walk')){inp.gun=true;inp.magic=true;}return inp;}
  if(near.length){inp.gun=true;inp.magic=true;const e=near[0],d=distance(s,e);if(d<140){const u=unit({x:s.x-e.x,y:s.y-e.y});inp.x=u.x*.7;inp.y=u.y*.7;}return inp;}
  const tgt=live.sort((a,b)=>distance(s,a)-distance(s,b))[0];
  if(node&&(!tgt||s.c.boss)){if(distance(s,node)>60){const u=toward(s,node);inp.x=u.x;inp.y=u.y;}else if(!s.channel)inp.interact=true;return inp;}
  if(tgt){const u=toward(s,tgt);inp.x=u.x;inp.y=u.y;return inp;}
  if(node){if(distance(s,node)>60){const u=toward(s,node);inp.x=u.x;inp.y=u.y;}else if(!s.channel)inp.interact=true;}
  return inp;
 };
}
export function autoplay(s,opts={},limit=900){const policy=makePolicy(opts);let hurts=0,perfects=0;const dt=1/30;
 while(s.status==='playing'&&s.time<limit){tick(s,policy(s),dt);for(const e of s.events){if(e.type==='hurt')hurts++;if(e.type==='perfectDodge')perfects++;}}
 return {status:s.status,time:s.time,hp:s.hp,hurts,perfects,kills:s.kills};}
