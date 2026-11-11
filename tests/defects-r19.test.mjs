import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {createProgressStore} from '../game/progress-store.mjs';
import {setVitalMeter} from '../game/hud.mjs';
import {newProgress,saveProgress,loadProgress} from '../game/missions.mjs';
// R19 defect audit. Each test was written failing first, then the fix went in (docs/gold/AUDIT_DIFETTI_R19.md).
const KEY='k';
function storage({failOn=null}={}){const data=new Map();return {data,getItem:k=>data.has(k)?data.get(k):null,setItem(k,v){if(failOn&&failOn(k))throw new Error('QuotaExceededError');data.set(k,v);}};}
const store=s=>createProgressStore({storage:()=>s,key:KEY,serialize:saveProgress,deserialize:loadProgress});

test('H2 (by design, proposal open): a backup slot that refuses the write stops the save, and the caller is told',()=>{
 const s=storage(),st=store(s),p=newProgress();assert.equal(st.write(p,{newGame:true}).ok,true);
 const before=s.data.get(KEY);p.step=3;
 const out=store({...s,setItem(k,v){if(k===KEY+'.backup')throw new Error('QuotaExceededError');s.data.set(k,v);}}).write(p);
 assert.equal(out.ok,false,'the runtime shows its save warning on ok:false');assert.equal(s.data.get(KEY),before,'the previous checkpoint is intact');
 assert.equal(store(s).read().source,'primary');
});

test('H2: when the primary slot refuses the write the old checkpoint survives and the caller is told',()=>{
 const s=storage(),p=newProgress();store(s).write(p,{newGame:true});p.step=5;
 const out=store({...s,setItem(k,v){if(k===KEY)throw new Error('QuotaExceededError');s.data.set(k,v);}}).write(p);
 assert.equal(out.ok,false);assert.equal(store(s).read().progress.step,0,'no half-written state');
});

test('H3: a save without an integrity field is legacy data, still validated by the schema',()=>{
 const s=storage(),raw=saveProgress(newProgress());s.data.set(KEY,raw);
 assert.equal(store(s).read().source,'primary','schema-7 data written before the checksum existed still loads');
 const bad=JSON.parse(raw);bad.stepId='not-a-stage';s.data.set(KEY,JSON.stringify(bad));
 assert.notEqual(store(s).read().source,'primary','without a checksum the schema check still rejects impossible values');
});

function meter(){const node=()=>({style:{},textContent:''}),parts={'[data-meter-fill]':node(),'[data-meter-lag]':node(),output:node(),'[data-meter-label]':node()},classes=new Set(),attrs={};
 return {dataset:{},parts,classes,attrs,querySelector:q=>parts[q],classList:{toggle:(c,on)=>on?classes.add(c):classes.delete(c)},setAttribute:(k,v)=>{attrs[k]=v;}};}

test('H4: in English the low and empty states are written on the bar and spoken in English',()=>{
 const m=meter();setVitalMeter(m,2,8,'NOX · HEALTH',{immediate:true});
 assert.equal(m.parts['[data-meter-label]'].textContent,'NOX · LOW');assert.equal(m.attrs['aria-label'],'NOX · HEALTH: 2 of 8, low');
 setVitalMeter(m,0,6,'VORTEX · INTEGRITY',{immediate:true});assert.equal(m.parts['[data-meter-label]'].textContent,'VORTEX · ZERO');
 const it=meter();setVitalMeter(it,2,8,'NOX · VITA',{immediate:true});assert.equal(it.attrs['aria-label'],'NOX · VITA: 2 su 8, livello basso','Italian is unchanged');
});

test('H6: the collapse escape hides the buttons its simulation does not read',()=>{
 const rt=fs.readFileSync('game/runtime.mjs','utf8'),tr=fs.readFileSync('game/traversal.mjs','utf8');
 assert.ok(!/input\.dash/.test(tr),'tickCollapse reads movement only');
 assert.match(rt,/mode='escape';[^\n]*\n panel\('hud',true\);panel\('controls',true\);for\(const id of \['gun','magic','duo','dash'\]\)panel\(id,false\);/);
});

test('H1 / D60: the premium build carries no purchase bridge, so the whole game is open and no paywall can appear',()=>{
 const java=fs.readdirSync('android/src/com/cityadventure/pizzaprotocol/debug').map(f=>fs.readFileSync('android/src/com/cityadventure/pizzaprotocol/debug/'+f,'utf8')).join('\n');
 assert.ok(!/addJavascriptInterface|BillingClient|ChronosBilling/.test(java),'no native bridge');
 assert.ok(!/ChronosBilling/.test(fs.readFileSync('game/android_bootstrap.js','utf8')),'the bootstrap does not define it either');
 const manifest=fs.readFileSync('android/AndroidManifest.xml','utf8');
 assert.deepEqual([...manifest.matchAll(/uses-permission android:name="([^"]+)"/g)].map(m=>m[1]),['android.permission.VIBRATE'],'no billing, network or ad permission');
 const rt=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(rt,/function demoLocked\(\)\{try\{const b=billing\(\);return !!b&&!b\.isUnlocked\(\);\}catch\{return false;\}\}/,'without a bridge the demo lock is off');
 assert.match(rt,/panel\('menu-unlock',demoLocked\(\)\)/,'the unlock entry of the menu is hidden when the game is open');
});

test('P0 (found on a phone): every on-foot mission shows SPARA and SCHIVA again after a scene that hid them',()=>{
 const rt=fs.readFileSync('game/runtime.mjs','utf8'),configure=rt.match(/function configureControls\(\)\{[^\n]*/)[0];
 const hiders=[...rt.matchAll(/for\(const id of \[([^\]]*)\]\)panel\(id,false\)/g)].map(m=>m[1]).filter(h=>h.includes("'gun'"));
 assert.ok(hiders.length>=3&&hiders.every(h=>h.includes("'dash'")),'opening walk, hub and escape hide the combat buttons');
 for(const id of ['gun','dash'])assert.ok(configure.includes(`panel('${id}',true)`),id+' is shown again when a mission configures its controls');
 assert.match(rt,/panel\('bag',true\);configureControls\(\);/,'startFoot calls it on every mission');
});

test('P1 (found on a phone): a boss that is not awake yet is not drawn standing still in the arena',()=>{
 const rt=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(rt,/\.\.\.s\.enemies\.filter\(e=>e\.state!=='dormant'&&\(e\.hp>0\|\|e\.deathAnim>0\)\)\.map\(/,'dormant enemies are left out of the actors drawn');
 assert.ok(!/a\.state==='dormant'\?\.55/.test(rt),'no half-transparent idle boss');
 const cm=fs.readFileSync('game/campaign.mjs','utf8');
 assert.match(cm,/b\.state=s\.nodes\.length\?'dormant':'walk'/,'the simulation is untouched: the boss still wakes when the devices are on');
});

test('P1 (found on a phone): the camera does not jump in one frame when the control band under the hero changes',async()=>{
 const {framePlayCamera}=await import('../game/visuals.mjs');
 // 844x390 landscape: stick bottom-left, weapon bar in the centre, actions bottom-right (same rectangles as tests/play-band.test.mjs).
 const overlays=[{l:16,r:134,t:256},{l:144,r:444,t:318},{l:492,r:828,t:310},{l:740,r:828,t:250}],w=844,h=390,scale=1,size=1536;
 let worst=0;for(let x=20;x<820;x++){const a=framePlayCamera({x,y:900},w,h,scale,60,overlays,size),b=framePlayCamera({x:x+1,y:900},w,h,scale,60,overlays,size);worst=Math.max(worst,Math.abs(a.y-b.y));}
 assert.ok(worst>20,'the target height really is a step function: one pixel of walking moves it by '+worst.toFixed(1)+' px');
 const rt=fs.readFileSync('game/runtime.mjs','utf8');
 assert.match(rt,/camera\.x=c\.x;const d=c\.y-camera\.y;camera\.y=Math\.abs\(d\)>260\?c\.y:camera\.y\+d\*\.2;\}/,'the runtime eases towards the target and snaps only on a real teleport');
 let y=0,maxStep=0;for(let i=0;i<30;i++){const d=worst-y,step=d*.2;maxStep=Math.max(maxStep,step);y+=step;}
 assert.ok(maxStep<=worst*.2+1e-9&&worst-y<1,'largest single-frame move is a fifth of the jump and it settles within half a second');
});
