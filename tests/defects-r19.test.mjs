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
