// Four equally spaced frames per row. Atlas metadata is kept outside the renderer.
import {WEAPONS_V9} from './weapons-v9.mjs';
export const DISTRICT_ART=['gang_states','alien_states','infected_states','custodian_states'];
export const DISTRICT_MAPS=['city','port','clinic','fracture'];
export const MUSIC_CUES=['blackout','breach','contagion','zero'];
export const BOSS_NAMES={rook:'ROOK',custode:'CUSTODE DEL NODO',mirror:'EVE-PRIME',archon:'ARCHON'};
// Reload sheets keep the equipped sheets' pixel density with 20 px of headroom per cell for raised
// barrels (tools/build_reload_sheets.py); the draw is scaled so feet and size match the gun frames.
export const RELOAD_ATLAS=Object.freeze({nox:Object.freeze({vx9:'nox_vx9_reload'}),lulu:Object.freeze({r12:'lulu_r12_reload'})});
export const RELOAD_DRAW_SCALE=321.25/301.25;
const gunRow=dir=>Math.abs(dir.x)>.45&&dir.y<-.5?3:Math.abs(dir.x)>.55?0:dir.y<0?1:2;
export function heroFrame(s,actor,name,partner=false){
 const dir=(!partner&&s.action?.dir)||s.face;
 if(!partner&&s.status==='failed')return {atlas:name+'_actions',row:2,col:3,flip:dir.x<0};
 if(!partner&&s.hurtAnim>0)return {atlas:name+'_actions',row:1,col:Math.min(3,Math.floor((.28-s.hurtAnim)/.28*4)),flip:dir.x<0};
 if(s.duoAnim>0)return {atlas:name+'_actions',row:3,col:Math.min(3,Math.floor((.65-s.duoAnim)/.65*4)),flip:dir.x<0};
 if(!partner&&s.dash>0)return {atlas:name+'_actions',row:0,col:Math.min(3,Math.floor((.18-s.dash)/.18*4)),flip:dir.x<0};
 if(!partner&&s.action){
  const equipped=s.action.kind==='gun'&&s.arsenal?.active;
  const atlas=equipped==='vx9'&&name==='nox'?'nox_vx9_gun':equipped==='r12'&&name==='lulu'?'lulu_r12_gun':name+'_'+s.action.kind;
  const a=s.action,lastRelease=a.weapon&&a.shotsReleased>0?.09+(a.shotsReleased-1)*.065:Infinity;
  const col=a.weapon?(a.t<.09?0:a.t-lastRelease<.035?1:a.t-lastRelease<.085?2:3):Math.min(3,Math.floor(a.t/a.duration*4));
  return {atlas,row:gunRow(dir),col,flip:dir.x<0};
 }
 // The pose follows the model's reload timer; moving keeps the walk cycle so feet never slide.
 const reload=!partner&&s.arsenal?.reloadRemaining>0&&RELOAD_ATLAS[name]?.[s.arsenal.active];
 if(reload&&!(s.stride>.1)){const done=1-s.arsenal.reloadRemaining/WEAPONS_V9[s.arsenal.active].reload;return {atlas:reload,row:gunRow(dir),col:Math.max(0,Math.min(3,Math.floor(done*4))),flip:dir.x<0,scale:RELOAD_DRAW_SCALE};}
 return {atlas:name+'_walk',row:Math.abs(dir.x)>.4?2:dir.y<0?1:0,col:Math.floor(actor.walk)%4,flip:dir.x<0};
}
export function enemyFrame(e,kind){
 const atlas=DISTRICT_ART[kind];
 if(e.hp<=0)return {atlas,row:3,col:Math.min(3,Math.floor((.7-e.deathAnim)/.7*4)),flip:e.face<0};
 if(e.hurtAnim>0)return {atlas,row:2,col:Math.min(3,Math.floor((.24-e.hurtAnim)/.24*4)),flip:e.face<0};
 if(e.state==='warn'||e.state==='charge'||e.state==='volley')return {atlas,row:1,col:Math.min(1,Math.floor(e.clock/(e.windup||1)*2)),flip:e.face<0};
 if(e.state==='recover'&&e.clock<.4)return {atlas,row:1,col:e.clock<.15?2:3,flip:e.face<0};
 if(e.state==='stun')return {atlas,row:2,col:3,flip:e.face<0};
 if(e.state==='dormant')return {atlas,row:0,col:0,flip:false};
 return {atlas,row:0,col:Math.floor(e.walk)%4,flip:e.face<0};
}
// EVE-Prime borrows Nox's own animation, re-tinted by the renderer: the enemy is the same body.
export function mirrorFrame(e){
 const flip=e.face<0;
 if(e.hp<=0)return {atlas:'eve_actions',row:2,col:Math.min(3,Math.floor((.7-e.deathAnim)/.7*4)),flip};
 if(e.hurtAnim>0)return {atlas:'eve_actions',row:1,col:Math.min(3,Math.floor((.24-e.hurtAnim)/.24*4)),flip};
 if(e.state==='charge')return {atlas:'eve_actions',row:0,col:e.clock<e.windup?0:Math.min(3,1+Math.floor((e.clock-e.windup)/.15)),flip};
 if(e.state==='volley'||e.state==='warn')return {atlas:'eve_gun',row:0,col:Math.min(3,Math.floor(e.clock/(e.windup||1)*4)),flip};
 if(e.state==='dormant')return {atlas:'eve_walk',row:0,col:0,flip:false};
 return {atlas:'eve_walk',row:2,col:Math.floor(e.walk)%4,flip};
}
// The hero is framed inside the free band between HUD and touch controls. At the world's edge the
// map may slide under those overlays; the hero never does (90 world units leave room for the head).
export function frameCamera(target,w,h,scale,top,bottom,size){
 const viewW=w/scale,band=Math.max(1,h-top-bottom),minY=-top/scale-90,maxY=size-(h-bottom)/scale;
 const x=Math.max(0,Math.min(Math.max(0,size-viewW),target.x-viewW/2));
 const y=maxY<minY?(minY+maxY)/2:Math.max(minY,Math.min(maxY,target.y-(top+band*.56)/scale));
 return {x,y};
}

// A civilian follows a short repaired corridor, resting before each return trip.
// This is staging, with no collision, damage, story knowledge or reward authority.
export function chalkCivilianPose(time,route='direct',reduced=false){
 const x=route==='service'?480:512,travel=70/24,rest=2,cycle=2*(travel+rest);
 const t=reduced?0:Math.max(0,Number.isFinite(time)?time:0)%cycle;
 let y=1000,walking=false,returning=false,elapsed=0;
 if(t>=rest&&t<rest+travel){elapsed=t-rest;y-=elapsed*24;walking=true;}
 else if(t>=rest+travel&&t<2*rest+travel){y=930;returning=true;}
 else if(t>=2*rest+travel){elapsed=t-2*rest-travel;y=930+elapsed*24;walking=true;returning=true;}
 return {x,y,animation:walking?'walk':'idle',elapsed,flip:returning};
}

export function chalkFlaskFrame(node,channel,index){if(node.on)return 3;if(channel?.node!==index)return 0;return channel.t/channel.need<.5?1:2;}

// Frame the tactical duel inside the unobscured band when both actors can fit.
// If a narrow landscape cannot contain both, retain the hero's safe framing.
export function frameDuelCamera(base,hero,boss,w,h,top,bottom,scale){
 const next={...base};
 const xlo=Math.max(hero.x-(w-24)/scale,boss.x+64-(w-12)/scale),xhi=Math.min(hero.x-24/scale,boss.x-64-12/scale);
 const ylo=hero.y-(h-bottom)/scale,yhi=Math.min(hero.y-112-top/scale,boss.y-134-top/scale);
 if(xlo<=xhi)next.x=Math.max(xlo,Math.min(xhi,next.x));
 if(ylo<=yhi)next.y=Math.max(ylo,Math.min(yhi,next.y));
 return next;
}
