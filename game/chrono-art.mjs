import {CHRONO_MANIFEST} from './chrono-manifest.mjs';
import {SHEET_LAYOUT} from './sheet-layout.mjs';
// Cleaned 4x4 sheets store padded cells (tools/clean_sheet_layout.py); the original quarter keeps the draw scale.
const sheetLayouts=new WeakMap();
// H-17/ARC-7 sheets are composed on the cleaned VX-9/R-12 sheets (same cells, same padding).
const SHEET_LAYOUT_ALIAS=Object.freeze({'v10/nox_h17_gun.png':'v10/nox_vx9_gun.png','v10/lulu_arc7_gun.png':'v10/lulu_r12_gun.png'});
function sheetLayout(im){if(!sheetLayouts.has(im)){const m=/art\/(v0[5-9]|v10)\/[^/?#]+\.png/.exec(im.layoutSrc||im.src||''),k=m?m[0].slice(4):null;sheetLayouts.set(im,k?SHEET_LAYOUT[SHEET_LAYOUT_ALIAS[k]||k]||null:null);}return sheetLayouts.get(im);}
export function drawLegacySprite(g,im,row,col,x,y,size,flip=false){const w=im?.naturalWidth||im?.width;if(!w)return;const L=sheetLayout(im);g.save();g.translate(x,y);if(flip)g.scale(-1,1);g.imageSmoothingEnabled=false;
 if(L){const s=size/L.ch;g.drawImage(im,col*L.CW,row*L.CH,L.CW,L.CH,-(L.cw/2+L.px)*s,-size+6-L.top*s,L.CW*s,L.CH*s);}
 else{const h=im.naturalHeight||im.height,cw=w/4,ch=h/4;g.drawImage(im,col*cw,row*ch,cw,ch,-size*cw/ch/2,-size+6,size*cw/ch,size);}
 g.restore();}
export function chronoAnimation(id,name,manifest=CHRONO_MANIFEST){return manifest.animations.find(a=>a.character_id===id&&a.animation_id===name)||FOE_ANIM[id+name]||null;}
export function chronoFrame(animation,elapsed,reduced=false){
 if(!animation||!animation.frame_count)return null;
 const count=animation.frame_count,index=reduced?0:Math.max(0,Math.floor(elapsed*animation.fps));
 return animation.frame_rectangles[animation.loop?index%count:Math.min(count-1,index)];
}
export function drawChronoFrame(g,image,animation,elapsed,x,y,height,flip=false,reduced=false){
 const f=chronoFrame(animation,elapsed,reduced);if(!f||!(image?.naturalWidth||image?.width))return false;
 const scale=height/animation.sprite_height;g.save();g.translate(x,y);if(flip)g.scale(-1,1);g.imageSmoothingEnabled=false;
 g.drawImage(image,f.x,f.y,f.width,f.height,-animation.pivot_x*scale,-animation.pivot_y*scale,f.width*scale,f.height*scale);g.restore();return true;
}
export function chronoEnemyPose(e){
 if(e.hp<=0)return {name:'defeat',elapsed:Math.max(0,.7-e.deathAnim),progress:Math.max(0,Math.min(1,(.7-e.deathAnim)/.7))};
 if(e.hurtAnim>0)return {name:'hurt',elapsed:.24-e.hurtAnim,progress:Math.max(0,Math.min(1,(.24-e.hurtAnim)/.24))};
 if(['warn','charge','volley'].includes(e.state))return {name:'anticipation',elapsed:e.clock,progress:Math.max(0,Math.min(1,e.clock/(e.windup||1)))};
 if(e.state==='recover')return {name:e.clock<.15?'attack':'recover',elapsed:e.clock,progress:e.clock<.15?e.clock/.15:Math.min(1,(e.clock-.15)/Math.max(.01,(e.recovery||.85)-.15))};
 if(['dormant','stun'].includes(e.state))return {name:'idle',elapsed:0};
 return {name:'walk',elapsed:e.walk/6};
}
// D45-D46: the reserve enemy sheets join the campaign as role silhouettes, region by region. Drawing only: hitboxes, AI,
// timing and damage stay in campaign.mjs. One sheet keeps one role everywhere, so a shape always means the same threat.
// Sheets are regular grids of 128 px rows: c = full state sheet, f = without anticipation/recover (special/idle stand in),
// n = NPC sheet (idle and walk only). The last value is the opaque figure height in the idle frame, used to draw every figure at the same world size (D46).
const FOE_POSES={c:[['idle',4,4,1],['walk',4,6,1],['anticipation',4,80/19],['attack',2,40/3],['recover',2,20/7],['hurt',4,50/3],['defeat',4,40/7]],f:[['idle',4,4,1],['walk',4,8,1],['attack',4,10],['special',4,8],['hurt',4,12],['defeat',4,6]],n:[['idle',4,4,1],['walk',4,8,1]]};
const FOE_CELLS={purple_guard:[208,'c',85],mech_hound:[256,'c',97],striker_unit:[224,'c',91],chrono_drone:[256,'c',102],ghoul_runner:[240,'c',81],toxic_brawler:[160,'f',90],toxic_bomber:[224,'c',104],plague_cultist_caster:[224,'c',91],skeleton_swordsman:[256,'c',88],iron_penitent:[208,'f',104],flame_alchemist:[176,'c',89],skeleton_shield_bearer:[192,'c',84],
 valkyrie_striker:[208,'f',83],chrono_huntress:[176,'f',104],demon_hunter_survivor:[192,'f',101],desert_chrono_fighter:[176,'f',104],crawling_corpse:[224,'c',85],gate_guard:[128,'n',104],gang_signal:[256,'c',87]};
// Family casts by district kind (Blackout gang, Breach, Contagion, Node), then the Act III regions that bring new faces.
export const CHRONO_FOES=[{signal:'gang_signal'},{raider:'mech_hound',shooter:'striker_unit',signal:'chrono_drone'},{raider:'ghoul_runner',breaker:'toxic_brawler',shooter:'toxic_bomber',signal:'plague_cultist_caster'},{raider:'skeleton_swordsman',breaker:'iron_penitent',shooter:'flame_alchemist',brute:'skeleton_shield_bearer',signal:'purple_guard'}];
// Cathedral Bone Tyrant, Toxic Forge Behemoth and Shadow Reaper are Part I bosses (D23, D28, D30): they never fill a wave.
const DOCKS={raider:'valkyrie_striker',shooter:'chrono_huntress'};
export const CHRONO_STEP_FOES={exp_chalk_marks:DOCKS,port:DOCKS,city:{raider:'demon_hunter_survivor',brute:'desert_chrono_fighter'},below:{raider:'crawling_corpse',signal:'plague_cultist_caster'}};
const FOE_ANIM={};
for(const [id,[cw,kind]] of Object.entries(FOE_CELLS)){let i=0;const add=(name,count,fps,loop,start=i)=>{FOE_ANIM[id+name]={frame_count:count,fps,loop:!!loop,sprite_height:128,pivot_x:cw/2,pivot_y:120,frame_rectangles:Array.from({length:count},(_,k)=>({x:(start+k)%8*cw,y:((start+k)>>3)*128,width:cw,height:128}))};i=start+count;};
 for(const [name,count,fps,loop] of FOE_POSES[kind])add(name,count,fps,loop);
 if(kind==='f'){FOE_ANIM[id+'anticipation']={...FOE_ANIM[id+'special'],loop:false};FOE_ANIM[id+'recover']={...FOE_ANIM[id+'idle'],loop:false};}}
// D47: what each figure sounds like when it falls (original cues from tools/chrono_audio.py).
const FOE_FALL={bone_break:'skeleton_swordsman skeleton_shield_bearer crawling_corpse ghoul_runner',gear_break:'mech_hound striker_unit chrono_drone iron_penitent purple_guard',toxic_splash:'toxic_brawler toxic_bomber plague_cultist_caster flame_alchemist'};
// The four human hunters fall with the ordinary impact only.
export function chronoFoeFall(id){return Object.keys(FOE_FALL).find(k=>FOE_FALL[k].split(' ').includes(id))||null;}
// Sheet for a regular enemy of this district kind in this mission; null keeps the legacy atlas.
export function chronoEnemySheet(kind,role,mission){return CHRONO_STEP_FOES[mission]?.[role]||CHRONO_FOES[kind]?.[role]||(kind===3?'purple_guard':null);}
// D46: world height that gives every figure the same size, a third larger for brutes.
export function chronoEnemyHeight(id,brute){return Math.round((brute?92:72)*128/(FOE_CELLS[id]?.[2]||85));}
function foeSheets(kind,mission){return new Set([...Object.values(CHRONO_FOES[kind]||{}),...Object.values(CHRONO_STEP_FOES[mission]||{})]);}
// All assets needed by the boss are decoded before the mission becomes interactive.
// Separate district textures make retirement explicit; no reference boards are loaded.
export class ChronoArtBank{
 constructor({imageFactory=()=>new Image()}={}){this.imageFactory=imageFactory;this.images=new Map();this.epoch=0;this.failures=[];this.lastLoadMs=0;}
 async prepare(kind,boss=false,extra=[],foes=true){
  const started=performance.now(),epoch=++this.epoch,want=new Set(['environment','effects',...extra]);if(kind===3)want.add('purple_guard');if(foes)for(const id of foeSheets(kind,foes))want.add(id);if(boss)want.add('chrono_overlord');
  const pending=await Promise.all([...want].map(async id=>{if(this.images.has(id))return [id,this.images.get(id)];const im=this.imageFactory();await new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=()=>reject(Error('chrono:'+id));im.src=FOE_CELLS[id]?`art/chrono/${id}.png`:CHRONO_MANIFEST.atlases[id].path;});if(im.decode)await im.decode();return [id,im];}));
  if(epoch!==this.epoch){for(const [id,im]of pending)if(this.images.get(id)!==im)im.src='';return false;}
  for(const [id,im]of this.images)if(!want.has(id)){im.src='';this.images.delete(id);}
  for(const [id,im]of pending)this.images.set(id,im);this.lastLoadMs=performance.now()-started;return true;
 }
 clear(){this.epoch++;for(const im of this.images.values())im.src='';this.images.clear();}
 get(id){return this.images.get(id);}
 status(){return {decoded:[...this.images.keys()],decodedBytes:[...this.images.values()].reduce((n,im)=>n+(im.naturalWidth||0)*(im.naturalHeight||0)*4,0),lastLoadMs:this.lastLoadMs,failures:[...this.failures]};}
}
