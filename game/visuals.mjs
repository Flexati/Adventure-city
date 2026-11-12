// Four equally spaced frames per row. Atlas metadata is kept outside the renderer.
import {WEAPONS_V9} from './weapons-v9.mjs';
export const DISTRICT_ART=['gang_states','alien_states','infected_states','custodian_states'];
export const DISTRICT_MAPS=['city','port','clinic','fracture'];
export const MUSIC_CUES=['blackout','breach','contagion','zero'];
export const BOSS_NAMES={rook:'ROOK',anchor:'THE ANCHOR',custode:'CUSTODE DEL NODO',mirror:'EVE-PRIME',archon:'ARCHON',tyrant:'BONE TYRANT',behemoth:'FORGE BEHEMOTH',reaper:'SHADOW REAPER',vega:'VEGA'};
// R20-c: bosses drawn from a Chrono strip with the shared pose names (idle, anticipation, attack, ...).
export const BOSS_SHEETS={archon:'chrono_overlord',tyrant:'cathedral_bone_tyrant',behemoth:'toxic_forge_behemoth',reaper:'shadow_reaper',vega:'vega'};
// Reload sheets keep the equipped sheets' pixel density with 20 px of headroom per cell for raised
// barrels (tools/build_reload_sheets.py); the draw is scaled so feet and size match the gun frames.
export const RELOAD_ATLAS=Object.freeze({nox:Object.freeze({vx9:'nox_vx9_reload',h17:'nox_h17_reload'}),lulu:Object.freeze({r12:'lulu_r12_reload',arc7:'lulu_arc7_reload'})});
// Equipped gun sheets; H-17/ARC-7 are composed on the VX-9/R-12 sheets (Terra round 2, tools/fit_arc7_cells.py).
export const GUN_ATLAS=Object.freeze({nox:Object.freeze({vx9:'nox_vx9_gun',h17:'nox_h17_gun'}),lulu:Object.freeze({r12:'lulu_r12_gun',arc7:'lulu_arc7_gun'})});
export const RELOAD_DRAW_SCALE=321.25/301.25;
const gunRow=dir=>Math.abs(dir.x)>.45&&dir.y<-.5?3:Math.abs(dir.x)>.55?0:dir.y<0?1:2;
// The Anchor sheet (game/art/v10/anchor_core.png, 4x8 cells of 384x256, base at y 246): rows idle,
// line charge, release, recovery, weight, damage, defeat, exposed. Poses follow the model's states and
// clocks; they never drive timing.
export const ANCHOR_SHEET=Object.freeze({cell:[384,256],base:[191,246],bodyWidth:246});
export function anchorFrame(e,t,reduced=false){
 const step=k=>Math.min(3,Math.max(0,Math.floor(k*4))),loop=fps=>reduced?0:Math.floor(t*fps)%4;
 if(e.hp<=0)return {row:6,col:step(1-(e.deathAnim||0)/.7)};
 if(e.hurtAnim>0)return {row:5,col:step(1-e.hurtAnim/.24)};
 if(e.state==='anchorSweep')return {row:1,col:step(e.clock/e.windup)};
 if(e.state==='warn')return {row:4,col:e.clock<e.windup*.5?0:1};
 if(e.state==='recover'){if(e.attack==='slam')return {row:4,col:e.clock<.25?2:3};return e.clock<.3?{row:2,col:step(e.clock/.3)}:{row:3,col:step((e.clock-.3)/.8)};}
 if(e.exposed)return {row:7,col:loop(6)};
 return {row:0,col:loop(4)};
}
// Bollard strip (game/art/v10/anchor_bollards.png, 3 cells of 128x192): taut, cut, re-mooring. The
// rope stub points left in the art; it is mirrored toward the core.
export const BOLLARD_SHEET=Object.freeze({cell:[128,192],base:[87,121],ropeY:100});
export function bollardFrame(m,relinkTotal){if(m.hp>0)return 0;return !m.released&&m.relink>0&&m.relink<=Math.min(2,relinkTotal)?2:1;}
// Veyra's car (art/v10/race_veyra_car.png, 4x2 cells of 384x256, car centred at 192,128): row 0
// intact, damaged, heavily damaged, smoking; row 1 parked 3/4, braking, night lights A/B.
export const VEYRA_CAR=Object.freeze({cell:[384,256],centre:[192,128],bodyHeight:196});
// The rivals' sheets (race_rival02_car, race_rival03_car) use the same cells, centre, body height and frames.
export const RACE_CAR_ART=Object.freeze({veyra:'race_veyra_car',rival_2:'race_rival02_car',rival_3:'race_rival03_car'});
// Race props by region (Terra round 3 and GPT, checked by tools/compose_terra_race_props.py). Art only:
// every prop is drawn in the rectangle the race model already uses, so hitboxes and timings do not move.
// Obstacles and crane loads share the container template (128x192, collision box 16,22-111,168).
const RACE_CONTAINER_MODELS=['race_container','race_container_ruggine','race_container_cobalto','race_container_verde'];
export const RACE_PROPS=Object.freeze({
 porto:Object.freeze({obstacles:[...RACE_CONTAINER_MODELS,'race_obstacle_porto_bobina','race_obstacle_porto_casse'],loads:['race_crane_load_porto_reti','race_crane_load_porto_tubi'],pad:'race_pad_nitro_porto',slicks:['race_slick_olio_a','race_slick_olio_b'],finish:'race_finish_porto'}),
 sabbia:Object.freeze({obstacles:['race_obstacle_sabbia_cassa','race_container_ruggine','race_obstacle_sabbia_cisterna','race_container'],loads:['race_obstacle_sabbia_cassa'],pad:'race_pad_nitro_sabbia',slicks:['race_slick_sabbia_a','race_slick_sabbia_b'],finish:'race_finish_sabbia'}),
 ponte:Object.freeze({obstacles:['race_obstacle_ponte_barriera','race_container_cobalto','race_obstacle_ponte_carrello','race_container_verde'],loads:['race_obstacle_ponte_carrello'],pad:'race_pad_nitro_ponte',slicks:['race_slick_olio_a','race_slick_olio_b'],finish:'race_finish_ponte'})});
export const RACE_CRANE=Object.freeze({day:'race_crane_beam_porto_day',night:'race_crane_beam_porto_night',trolley:'race_crane_trolley_porto',post:'race_barrier_post_porto',gap:'race_barrier_gap_porto'});
export function raceRegion(mode){return ['sand','storm'].includes(mode)?'sabbia':['bridges','duel'].includes(mode)?'ponte':'porto';}
// Containers keep their V10 '_hit' sheets; the new props use '_colpito'.
export function racePropHit(model){return RACE_CONTAINER_MODELS.includes(model)?model+'_hit':model+'_colpito';}
export const RACE_PROP_ART=Object.freeze([...new Set([...Object.values(RACE_PROPS).flatMap(r=>[...r.obstacles,...r.loads].flatMap(m=>[m,racePropHit(m)]).concat(r.pad,r.slicks,r.finish)),...Object.values(RACE_CRANE)])].filter(n=>!RACE_CONTAINER_MODELS.includes(n)&&!RACE_CONTAINER_MODELS.some(m=>n===m+'_hit')));
export function veyraCarFrame(car,night,t,reduced=false){if(night)return {row:1,col:reduced?2:2+Math.floor(t*3)%2};const i=car.integrity??100;return {row:0,col:i>70?0:i>35?1:i>15?2:3};}
// Auto del giocatore (atlante race_vortex_car, Argon giro 2): stesse celle di VEYRA_CAR; col nitro attivo
// mostra la vista con le fiammate (riga 1, colonna 0), salvo di notte, dove contano i fari.
export function vortexCarFrame(car,night,t,reduced=false){if(!night&&car.boost>0&&!reduced)return {row:1,col:0};return veyraCarFrame(car,night,t,reduced);}
export function heroFrame(s,actor,name,partner=false){
 const dir=(!partner&&s.action?.dir)||s.face;
 if(!partner&&s.status==='failed')return {atlas:name+'_actions',row:2,col:3,flip:dir.x<0};
 if(!partner&&s.hurtAnim>0)return {atlas:name+'_actions',row:1,col:Math.min(3,Math.floor((.28-s.hurtAnim)/.28*4)),flip:dir.x<0};
 if(s.duoAnim>0)return {atlas:name+'_actions',row:3,col:Math.min(3,Math.floor((.65-s.duoAnim)/.65*4)),flip:dir.x<0};
 if(!partner&&s.dash>0)return {atlas:name+'_actions',row:0,col:Math.min(3,Math.floor((.18-s.dash)/.18*4)),flip:dir.x<0};
 if(!partner&&s.action){
  const equipped=s.action.kind==='gun'&&s.arsenal?.active;
  const atlas=GUN_ATLAS[name]?.[equipped]||name+'_'+s.action.kind;
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
// G1 visual hit-stop (P2:165): the hit enemy's pose holds after a 1-frame white flash; the
// simulation never pauses. Frames at 60 fps: gun 2, Pulse 4, defeating hit 6, support fire none.
export const HITSTOP_FRAME=1/60;
export function hitstopFrames(e){return e.type==='down'?6:e.type==='impact'?{gun:2,magic:4}[e.source]||0:0;}
// Real seconds; a remainder under half of this frame counts as spent, so float rounding never adds a frame.
export function hitstopStep(h,dt){h.t-=dt;h.flash-=dt;if(h.flash<=dt/2)h.flash=0;return h.t>dt/2;}
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

// Overlays only block the band where they actually sit: in landscape the thumbs occupy the corners
// and the centre stays free. The horizontal framing does not depend on the band, so the hero's
// screen column is known first and the band is closed by the overlays covering that column only.
export function cameraScale(w,h){return w<650?.66:h<=520&&w>h?.62:Math.min(.95,h/760);}
export function bandBottom(overlays,x,h,margin=36){const tops=overlays.filter(o=>o.l-margin<=x&&x<=o.r+margin).map(o=>o.t);return tops.length?Math.max(0,h-Math.min(...tops)+6):0;}
export function framePlayCamera(target,w,h,scale,top,overlays,size){
 const x=frameCamera(target,w,h,scale,top,0,size).x,bottom=bandBottom(overlays,(target.x-x)*scale,h);
 return {...frameCamera(target,w,h,scale,top,bottom,size),bottom};
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
