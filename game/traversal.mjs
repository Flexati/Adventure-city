import {getLayout,routeWaypoint} from './layouts.mjs';
import {moveActor,distance,clamp} from './campaign.mjs';
export function newCollapse(){const layout=getLayout('spine');return {layoutId:'spine',x:layout.start.x,y:layout.start.y,hero:'nox',walk:0,time:0,hp:8,maxHp:8,inv:0,status:'playing',face:{x:0,y:-1},dash:0,hurtAnim:0,goal:{x:800,y:224},hazards:[{x:800,y:1120},{x:800,y:800},{x:800,y:480}],events:[]};}
export function tickCollapse(s,input,dt){
 s.events=[];if(s.status!=='playing')return;dt=clamp(dt,0,.05)||0;s.time+=dt;s.inv=Math.max(0,s.inv-dt);
 const mag=Math.hypot(input.x||0,input.y||0),dx=(input.x||0)/Math.max(1,mag),dy=(input.y||0)/Math.max(1,mag);
 if(mag>.1)s.face={x:dx,y:dy};const old={x:s.x,y:s.y};moveActor(s,dx*225*dt,dy*225*dt);s.walk+=distance(old,s)*.065;
 const beat=s.time%2.8,previous=(s.time-dt)%2.8;
 if(previous<1.5&&beat>=1.5)for(const h of s.hazards)if(distance(s,h)<76&&s.inv<=0){s.hp--;s.inv=.8;s.events.push({type:'hurt',source:'melee'});}
 if(s.hp<=0)s.status='failed';else if(distance(s,s.goal)<70)s.status='cleared';
}
export function collapseWaypoint(s){return routeWaypoint(getLayout('spine'),s,s.goal);}
