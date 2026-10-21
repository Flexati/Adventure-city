import {CHRONO_MANIFEST} from './chrono-manifest.mjs';
export function drawLegacySprite(g,im,row,col,x,y,size,flip=false){const w=im?.naturalWidth||im?.width;if(!w)return;const h=im.naturalHeight||im.height,cw=w/4,ch=h/4;g.save();g.translate(x,y);if(flip)g.scale(-1,1);g.imageSmoothingEnabled=false;g.drawImage(im,col*cw,row*ch,cw,ch,-size*cw/ch/2,-size+6,size*cw/ch,size);g.restore();}
export function chronoAnimation(id,name,manifest=CHRONO_MANIFEST){return manifest.animations.find(a=>a.character_id===id&&a.animation_id===name)||null;}
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
 if(e.hp<=0)return {name:'defeat',elapsed:Math.max(0,.7-e.deathAnim)};
 if(e.hurtAnim>0)return {name:'hurt',elapsed:.24-e.hurtAnim};
 if(['warn','charge','volley'].includes(e.state))return {name:'anticipation',elapsed:e.clock};
 if(e.state==='recover')return {name:e.clock<.15?'attack':'recover',elapsed:e.clock};
 if(['dormant','stun'].includes(e.state))return {name:'idle',elapsed:0};
 return {name:'walk',elapsed:e.walk/6};
}
// All assets needed by the boss are decoded before the mission becomes interactive.
// Separate district textures make retirement explicit; no reference boards are loaded.
export class ChronoArtBank{
 constructor({imageFactory=()=>new Image()}={}){this.imageFactory=imageFactory;this.images=new Map();this.epoch=0;this.failures=[];}
 async prepare(kind,boss=false){
  const epoch=++this.epoch,want=new Set(['environment','effects']);if(kind===3)want.add('purple_guard');if(boss)want.add('chrono_overlord');
  const pending=await Promise.all([...want].map(async id=>{if(this.images.has(id))return [id,this.images.get(id)];const im=this.imageFactory();await new Promise((resolve,reject)=>{im.onload=resolve;im.onerror=()=>reject(Error('chrono:'+id));im.src=CHRONO_MANIFEST.atlases[id].path;});return [id,im];}));
  if(epoch!==this.epoch){for(const [id,im]of pending)if(this.images.get(id)!==im)im.src='';return false;}
  for(const [id,im]of this.images)if(!want.has(id)){im.src='';this.images.delete(id);}
  for(const [id,im]of pending)this.images.set(id,im);return true;
 }
 clear(){this.epoch++;for(const im of this.images.values())im.src='';this.images.clear();}
 get(id){return this.images.get(id);}
 status(){return {decoded:[...this.images.keys()],decodedBytes:[...this.images.values()].reduce((n,im)=>n+(im.naturalWidth||0)*(im.naturalHeight||0)*4,0),failures:[...this.failures]};}
}
