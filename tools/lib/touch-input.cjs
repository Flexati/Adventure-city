// Touch input for the automatic checks (D39: the game is mobile-only, so checks play it with fingers, not keys).
//
//   const {createTouchInput}=require('./lib/touch-input.cjs');
//   const touch=await createTouchInput(page);      // page = Playwright Chromium page with the game loaded
//
// Verbs (always await each call before the next one; the helper keeps one list of fingers down):
//   move(x,y)            x,y in -1..1 (y>0 = down). A finger lands on a free spot of the canvas and drags: the floating
//                        stick of game/runtime.mjs (canvas.onpointerdown/floatMove) takes it anywhere on the screen (rule 8).
//                        A vector of length m<1 gives a stick strength m. Calling it again changes the direction of the
//                        same finger. In driving modes the same finger steers on the x axis only.
//   stopMove()           lift the movement finger.
//   tap(id)              touch the on-screen button #id once (dash, interact, duo, magic, gun, weapon-change, weapon-reload,
//                        heal, pulse, nitro, ...). SPARA/PULSE act on release, SCHIVA/DUO/ATTIVA on touch-down: the game decides.
//   hold(id) / release(id)   keep a finger on #id (accelerate, brake, ...) / lift it.
//   drive({steer,accelerate,brake,pulse})   driving: steer -1..1 on the wheel #drive-stick, accelerate/brake keep a finger on
//                        #accelerate/#brake while true (and lift it when false), pulse taps #pulse.
//   release()            lift every finger.
//   apply(intent,{threshold})   the autoplay policy output {x,y,gun,magic,dash,duo,interact} as fingers: x,y beyond
//                        threshold become an 8-way move (what the old W/A/S/D keys did), dash/duo/interact one tap per call.
//                        gun/magic mean "keep firing", which with a touch screen is mashing the button: the game fires on release
//                        and keeps a tap for only INPUT_BUFFER=0.1 s (campaign.mjs), so a tap per call (~0.5 s apart on this PC)
//                        would miss most cooldowns. While a call says gun/magic, the helper re-taps them in the background every
//                        ~100 ms, one at a time (the game keeps one aimTouch and one pending SPARA/PULSE per frame), and stops
//                        when a call no longer says so, on release(), or 2 s after the last call.
//
// tap/hold return true when the touch was delivered and false when the game would not receive it (button hidden, disabled or
// covered by another element: counted in touch.skipped). An id that does not exist in the page throws.
// Cost: this PC needs ~16-50 ms per browser round trip, and the game keeps running meanwhile, so apply/drive use one page probe
// plus one dispatch per kind of touch (move, press, release). Every public call is serialized, background mashing included.
//
// Why CDP Input.dispatchTouchEvent: several fingers at once (move + shoot + dash) with distinct touchPoint ids, real
// pointerdown/pointermove/pointerup with pointerType "touch". Playwright's page.touchscreen only does single taps.
// Conventions measured in Chromium 149 here: touchStart/touchMove list every finger that is down; touchEnd lists the fingers
// that are released. Emulation.setTouchEmulationEnabled is sent at creation, so a page made without hasTouch:true works too.
//
// Known limit, worked around on purpose: with another finger already down Chromium does not synthesize "click" for a second
// finger (measured: pointerdown + pointerup arrive, no click). Buttons that listen only to click (weapon-change, weapon-reload,
// heal, pulse in game/runtime.mjs) would then never fire while the stick finger is down. For those, after the real touch, the
// helper calls element.click() and counts it in touch.stats.syntheticClicks. This is a check-side workaround and also a
// finding to confirm on a real device; it adds nothing to the product.
'use strict';

// Buttons whose handler is on pointerdown/pointerup, not on click (game/runtime.mjs onTap and the loops near oneShotActions, PRESS_ACTIONS in input-v9.mjs).
// weapon-change, weapon-reload, heal and pulse used to wait for click and were dead with a second finger down; onTap fixed the game, so no synthetic click here.
const POINTER_DRIVEN=new Set(['dash','duo','interact','gun','magic','accelerate','brake','nitro','weapon-change','weapon-reload','heal','pulse']);
// Floating stick geometry from game/runtime.mjs floatMove: radial R=46 dead zone 8; axis (driving) R=56 dead zone 5.
const RADIAL={dead:8,radius:46},AXIS={dead:5,radius:56};
// Wheel #drive-stick: axialControlValue(dx) with its default dead zone 5 and radius 36 (game/input-v9.mjs).
const WHEEL={dead:5,radius:36};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));

// Page-side probe, one round trip: where each requested button can be touched, and (stick) where a free finger can land.
// It only reads; arm (button ids) resets the click counters used to see whether a real click followed the touch.
function probe({buttons,stick,arm}){
 const out={buttons:{}};
 for(const id of buttons){
  const el=document.getElementById(id);
  if(!el){out.buttons[id]={state:'missing'};continue;}
  const style=getComputedStyle(el);
  if(el.hidden||style.display==='none'||style.visibility==='hidden'||!el.getClientRects().length){out.buttons[id]={state:'hidden'};continue;}
  if(el.disabled){out.buttons[id]={state:'disabled'};continue;}
  const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,top=document.elementFromPoint(x,y);
  out.buttons[id]=!top||!(top===el||el.contains(top))?{state:'covered',by:top?(top.id||top.tagName):null}:{state:'ok',x,y};
 }
 if(arm.length){
  const t=window.__touchInput??={clicks:{}};
  if(!t.listening){t.listening=true;window.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(b)t.clicks[b.id]=(t.clicks[b.id]||0)+1;},true);}
  for(const id of arm)t.clicks[id]=0;
 }
 if(stick){
  const world=document.getElementById('world'),float=document.getElementById('float-stick'),driving=document.getElementById('driving-controls');
  const w=innerWidth,h=innerHeight,margin=70;let start=null;
  for(const [fx,fy] of [[.5,.45],[.5,.3],[.5,.6],[.3,.45],[.7,.45],[.5,.2],[.3,.3],[.7,.3],[.5,.7],[.3,.6],[.7,.6]]){
   const x=Math.max(margin,Math.min(w-margin,w*fx)),y=Math.max(margin,Math.min(h-margin,h*fy));
   if(document.elementFromPoint(x,y)===world){start={x,y};break;}
  }
  out.stick={w,h,start,axis:!driving.hidden,floatHidden:float.hidden,left:parseFloat(float.style.left),top:parseFloat(float.style.top)};
 }
 return out;
}
const clicksOf=ids=>ids.map(id=>window.__touchInput?.clicks[id]||0);
const clickButton=id=>document.getElementById(id).click();

async function createTouchInput(page){
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:10});
 const fingers=new Map(),skipped={hidden:0,disabled:0,covered:0},stats={syntheticClicks:0};
 let lastMove=null,chain=Promise.resolve(),driveProbe={at:0,buttons:{}},lastPulse=0;
 const DRIVE_IDS=['drive-stick','accelerate','brake'],DRIVE_PROBE_TTL_MS=1000,PULSE_PACE_MS=500;
 const mash={targets:[],stamp:0,turn:0,running:false,error:null};

 // Serialization: one touch operation at a time, so the finger list is never read half-updated by the mashing loop.
 const serial=fn=>{const run=chain.then(fn);chain=run.then(()=>undefined,()=>undefined);return run;};
 const send=(type,points)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(f=>({x:f.x,y:f.y,id:f.id,radiusX:4,radiusY:4,force:.8}))});
 const freeId=()=>{const used=new Set([...fingers.values()].map(f=>f.id));let id=1;while(used.has(id))id++;return id;};
 async function down(name,x,y){const f={id:freeId(),x,y};fingers.set(name,f);await send('touchStart',[...fingers.values()]);return f;}
 async function dragTo(name,x,y){const f=fingers.get(name);f.x=x;f.y=y;await send('touchMove',[...fingers.values()]);}
 async function up(name){const f=fingers.get(name);fingers.delete(name);await send('touchEnd',[f]);}

 // One page round trip for everything a call needs. An id that is not in the page is a mistake in the caller: throw.
 async function ask(buttons,{stick=false}={}){
  const arm=fingers.size>0?buttons.filter(id=>!POINTER_DRIVEN.has(id)):[];
  const r=await page.evaluate(probe,{buttons,stick,arm});
  for(const [id,g] of Object.entries(r.buttons))if(g.state==='missing')throw Error('touch-input: no element #'+id+' in the page');
  return r;
 }
 const usable=(g)=>{if(g.state==='ok')return true;skipped[g.state]++;return false;};

 // Press every usable button in one touchStart, lift them in one touchEnd. Returns the ids that were really touched.
 async function pressAll(ids,states){
  const ok=ids.filter(id=>usable(states[id]));
  if(!ok.length)return ok;
  const click=fingers.size>0?ok.filter(id=>!POINTER_DRIVEN.has(id)):[];// decided before our own fingers are added
  const names=ok.map(id=>'tap:'+id),mine=[];
  for(const [i,id] of ok.entries()){const f={id:freeId(),x:states[id].x,y:states[id].y};fingers.set(names[i],f);mine.push(f);}
  await send('touchStart',[...fingers.values()]);
  for(const name of names)fingers.delete(name);
  await send('touchEnd',mine);
  if(click.length){
   await sleep(25);
   const got=await page.evaluate(clicksOf,click);
   for(const [i,id] of click.entries())if(!got[i]){await page.evaluate(clickButton,id);stats.syntheticClicks++;}
  }
  return ok;
 }
 async function tap(id){const r=await ask([id]);return (await pressAll([id],r.buttons)).length===1;}

 async function hold(id){
  const r=await ask([id]),g=r.buttons[id],name='hold:'+id;
  if(fingers.has(name)){if(g.state==='ok')return true;await up(name);return false;}
  if(!usable(g))return false;
  await down(name,g.x,g.y);return true;
 }
 async function release(id){
  if(id===undefined){
   const all=[...fingers.values()];fingers.clear();lastMove=null;mash.targets=[];driveProbe={at:0,buttons:{}};
   if(all.length)await send('touchEnd',all);
   return;
  }
  if(fingers.has('hold:'+id))await up('hold:'+id);
 }

 // Movement finger, given the stick probe g of this very moment.
 async function moveWith(g,x,y){
  // The game drops the stick on pause/blur/panels: the float ring is then hidden while our finger is still "down".
  if(fingers.has('move')&&g.floatHidden){await up('move');lastMove=null;}
  const strength=g.axis?Math.min(1,Math.abs(x)):Math.min(1,Math.hypot(x,y));
  if(!(strength>0)){await stopMove();return true;}
  const geo=g.axis?AXIS:RADIAL;
  let ox,oy;
  if(!fingers.has('move')){
   if(!g.start)throw Error('touch-input: no free canvas spot for the movement finger');
   await down('move',g.start.x,g.start.y);ox=g.start.x;oy=g.start.y;
   if((await ask([],{stick:true})).stick.floatHidden){await up('move');return false;}
  }else{ox=g.left;oy=g.top;}
  const ux=g.axis?Math.sign(x):x/Math.hypot(x,y),uy=g.axis?0:y/Math.hypot(x,y);
  const dist=strength>=1?geo.radius+.5:geo.dead+strength*(geo.radius-geo.dead);
  const tx=Math.max(2,Math.min(g.w-2,ox+ux*dist)),ty=Math.max(2,Math.min(g.h-2,oy+uy*dist));
  const key=tx.toFixed(1)+','+ty.toFixed(1);
  if(key!==lastMove){await dragTo('move',tx,ty);lastMove=key;}
  return true;
 }
 async function move(x,y){
  if(!(Math.hypot(x,y)>0)){await stopMove();return true;}
  return moveWith((await ask([],{stick:true})).stick,x,y);
 }
 async function stopMove(){if(fingers.has('move')){await up('move');lastMove=null;}}

 async function drive({steer=0,accelerate=false,brake=false,pulse=false}={}){
  const s=Math.max(-1,Math.min(1,steer));
  // Steering must reach the game as soon as possible: the button positions are probed at most once a second, and the
  // pulse (cooldown 1.2 s in the game) is tapped at most once a second.
  const pulseNow=pulse&&Date.now()-lastPulse>=PULSE_PACE_MS;
  const need=[...(s!==0?['drive-stick']:[]),...(accelerate||fingers.has('hold:accelerate')?['accelerate']:[]),...(brake||fingers.has('hold:brake')?['brake']:[])];
  let r={buttons:driveProbe.buttons};
  if(pulseNow||Date.now()-driveProbe.at>=DRIVE_PROBE_TTL_MS||need.some(id=>driveProbe.buttons[id]?.state!=='ok')){
   r=await ask([...new Set([...need,...DRIVE_IDS,...(pulseNow?['pulse']:[])])]);
   driveProbe={at:Date.now(),buttons:r.buttons};
  }
  let ok=true;
  if(s===0){if(fingers.has('drive'))await up('drive');}
  else{
   const g=r.buttons['drive-stick'];
   if(!usable(g)){if(fingers.has('drive'))await up('drive');ok=false;}
   else{
    const x=g.x+Math.sign(s)*(Math.abs(s)>=1?WHEEL.radius+1:WHEEL.dead+Math.abs(s)*(WHEEL.radius-WHEEL.dead));
    if(fingers.has('drive'))await dragTo('drive',x,g.y);else await down('drive',x,g.y);
   }
  }
  for(const [id,on] of [['accelerate',accelerate],['brake',brake]]){
   const name='hold:'+id;
   if(!on){if(fingers.has(name))await up(name);continue;}
   const g=r.buttons[id];
   if(fingers.has(name)){if(g.state!=='ok'){await up(name);ok=false;}}
   else if(usable(g))await down(name,g.x,g.y);else ok=false;
  }
  if(pulseNow){lastPulse=Date.now();ok=(await pressAll(['pulse'],r.buttons)).length===1&&ok;}
  return ok;
 }

 // Background re-tap of SPARA/PULSE while the last apply() asked for them. Positions come from that apply()'s probe.
 const MASH_PACE_MS=100,MASH_TTL_MS=2000;
 function startMash(){
  if(mash.running)return;
  mash.running=true;
  (async()=>{
   try{
    while(mash.targets.length&&Date.now()-mash.stamp<MASH_TTL_MS){
     await sleep(MASH_PACE_MS);
     await serial(async()=>{
      if(!mash.targets.length)return;
      const t=mash.targets[mash.turn++%mash.targets.length];
      await pressAll([t.id],{[t.id]:{state:'ok',x:t.x,y:t.y}});
     });
    }
   }catch(error){mash.error=error;}
   finally{mash.running=false;}
  })();
 }
 async function applyImpl(intent,{threshold=.08}={}){
  if(mash.error){const e=mash.error;mash.error=null;throw e;}
  const dx=intent.x>threshold?1:intent.x<-threshold?-1:0,dy=intent.y>threshold?1:intent.y<-threshold?-1:0;
  const once=['dash','duo','interact'].filter(id=>intent[id]),fire=['gun','magic'].filter(id=>intent[id]);
  const needStick=dx!==0||dy!==0||fingers.has('move'),ids=[...once,...fire];
  const r=ids.length||needStick?await ask(ids,{stick:needStick}):{buttons:{}};
  if(dx||dy)await moveWith(r.stick,dx,dy);else await stopMove();
  const usableFire=fire.filter(id=>r.buttons[id].state==='ok');
  mash.targets=usableFire.map(id=>({id,x:r.buttons[id].x,y:r.buttons[id].y}));mash.stamp=Date.now();
  const first=usableFire.length?[usableFire[mash.turn++%usableFire.length]]:[];
  await pressAll([...once,...first],r.buttons);
  for(const id of fire)if(r.buttons[id].state!=='ok')usable(r.buttons[id]);// count what could not be touched
  if(mash.targets.length)startMash();
 }

 return {
  move:(x,y)=>serial(()=>move(x,y)),stopMove:()=>serial(stopMove),tap:id=>serial(()=>tap(id)),hold:id=>serial(()=>hold(id)),
  release:id=>serial(()=>release(id)),drive:o=>serial(()=>drive(o)),apply:(intent,o)=>serial(()=>applyImpl(intent,o)),
  skipped,stats,fingers:()=>[...fingers.keys()],
 };
}

module.exports={createTouchInput};
