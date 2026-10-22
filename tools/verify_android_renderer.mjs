// Runs against the debug APK's actual Android WebView over adb-forwarded CDP.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let tabs=[];for(let i=0;i<60;i++){try{tabs=await(await fetch('http://127.0.0.1:9222/json')).json();if(tabs.length)break;}catch{}await wait(500);}
assert.ok(tabs.length,'Android WebView must expose a real page');
const socket=new WebSocket(tabs[0].webSocketDebuggerUrl.replace(/localhost:\d+|127\.0\.0\.1:\d+/,'127.0.0.1:9222'));
await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
let id=0;const pending=new Map();
socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}};
async function command(method,params={}){
 const request=++id;
 const reply=await Promise.race([
  new Promise(resolve=>{pending.set(request,resolve);socket.send(JSON.stringify({id:request,method,params}));}),
  wait(15000).then(()=>{throw Error('CDP command timed out: '+method);})
 ]);
 assert.ok(!reply.error,JSON.stringify(reply.error));
 return reply.result||{};
}
async function evaluate(expression){
 const reply=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
 assert.ok(!reply.exceptionDetails,JSON.stringify(reply));
 return reply.result.value;
}
await command('Page.enable');
let ready=false;for(let i=0;i<80;i++){ready=await evaluate('Boolean(window.cityAdventure && window.cityAdventure.status().loaded && window.cityAdventure.status().mode==="menu")');if(ready)break;await wait(500);}
assert.ok(ready,'Game assets must finish loading and reach the title screen');
const brand=await evaluate('document.title');assert.equal(brand,'CHRONOS: Nox & Lulù','APK must ship the current title');
assert.equal(await evaluate('Boolean(document.getElementById("startup-recovery"))'),false);
const maps=await evaluate('Object.values(performance.getEntriesByType("resource")).filter(x=>x.name.includes("art/")).length');assert.ok(maps>5);
// CDP touch input is trusted by WebView. HTMLElement.click() cannot unlock gesture-gated media.
const click=async id=>{
 // WebView can expose a modal before its entrance animation/layout has settled.
 // Wait for the real hit target, preserving trusted touch and gesture-gated audio.
 let point,last,stable=0;
 for(let i=0;i<60;i++){
  const r=await evaluate(`(()=>{const e=document.getElementById(${JSON.stringify(id)}),r=e.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;return {x,y,hit:!e.hidden&&r.width>0&&r.height>0&&e.contains(document.elementFromPoint(x,y))};})()`);
  stable=r.hit&&last&&Math.abs(r.x-last.x)<.5&&Math.abs(r.y-last.y)<.5?stable+1:0;last=r;
  if(stable>=2){point={x:r.x,y:r.y};break;}await wait(60);
 }
 assert.ok(point,'Stable touch target not reached: '+id);
 await command('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await wait(60);await command('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
};
// Exercise the phone's actual joystick; keyboard dispatch can wait indefinitely for an IME on WebView.
async function moveUp(ms){
 const point=await evaluate('(()=>{const r=document.getElementById("stick").getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2-32};})()');
 await command('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await wait(ms);await command('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
}
async function expectAudio(label,playing){let status;for(let i=0;i<16;i++){status=await evaluate('window.cityAdventure.status().audio');if(status.context===(playing?'running':'suspended')&&status.musicPaused===!playing)return status;await wait(150);}assert.fail(label+': '+JSON.stringify(status));}
const visibleEl=id=>evaluate(`(()=>{const e=document.getElementById(${JSON.stringify(id)}),r=e.getBoundingClientRect();return !e.hidden&&r.width>0&&r.height>0;})()`);
async function expectMode(mode){for(let i=0;i<80;i++){if(await evaluate(`Boolean(window.cityAdventure&&window.cityAdventure.status().loaded&&window.cityAdventure.status().mode===${JSON.stringify(mode)})`))return;await wait(150);}assert.fail('Mode '+mode+' not reached: '+JSON.stringify(await evaluate('window.cityAdventure.status()')));}
async function expectVisible(id){for(let i=0;i<80;i++){if(await visibleEl(id))return;await wait(100);}assert.fail('Control not visible: '+id);}
if(process.argv.includes('--resume-proof')){
 const key='city-adventure-progress-v7';
 const persisted=await evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`);
 const backup=await evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(key+'.backup')}))`);
 assert.equal(persisted.version,7);assert.equal(persisted.integrity.algorithm,'fnv1a32-utf16');assert.equal(backup.version,7);
 assert.equal(persisted.narrative.flags.opening_completed,true,'Opening progress must survive process death');
 assert.equal(await visibleEl('continue'),true,'A killed/restarted app must offer Continue');
 await click('continue');await expectVisible('card');await click('card');
 for(let i=0;i<80;i++){if(await visibleEl('talk'))await click('next-line');if(await evaluate('window.cityAdventure.status().running&&!window.cityAdventure.status().uiLock'))break;await wait(150);}
 const resumed=await evaluate('window.cityAdventure.progress()');assert.equal(resumed.stepId,persisted.stepId);assert.deepEqual(resumed.world,persisted.world);assert.deepEqual(resumed.narrative,persisted.narrative);
 // Leave play before injecting disk corruption: normal lifecycle/autosave writes
 // would otherwise legitimately replace the fault with the live valid checkpoint.
 await click('pause');await expectVisible('menu-return');await click('menu-return');await expectMode('menu');
 // Explicit native-WebView storage fault; this is a recovery test, not campaign completion.
 await evaluate(`(()=>{const k=${JSON.stringify(key)},x=JSON.parse(localStorage.getItem(k));x.world.coins+=1;localStorage.setItem(k,JSON.stringify(x));return true;})()`);
 await command('Page.reload');await expectMode('menu');
 assert.equal(await evaluate('window.cityAdventure.status().saveSource'),'backup','Checksum failure must select the validated backup');
 assert.equal(await visibleEl('continue'),true);
 const proof={brand,procedure:'Run by workflow after adb am force-stop and fresh am start; then explicit checksum fault + Page.reload',saveVersion:7,openingPreserved:true,stepPreserved:resumed.stepId,worldPreserved:true,narrativePreserved:true,checksumRecovery:true,status:await evaluate('window.cityAdventure.status()')};
 fs.writeFileSync('android-save-proof.json',JSON.stringify(proof,null,2));socket.close();console.log('PASS: native process restart preserves schema-7 progress and checksum corruption selects backup.');
}else{
await click('start');await wait(300);
assert.equal(await visibleEl('card'),true,'Mission card must introduce the opening');await click('card');await expectMode('scene');
const openingShown=await visibleEl('opening');assert.ok(openingShown,'Opening must follow New Story');
await evaluate('window.dispatchEvent(new Event("citynativepause"));true');
assert.equal(await evaluate('window.cityAdventure.status().lifecycleMuted'),true,'Native pause must mute lifecycle audio state');
await evaluate('window.dispatchEvent(new Event("citynativeresume"));true');
assert.equal(await evaluate('window.cityAdventure.status().lifecycleMuted'),false,'Native resume must clear lifecycle mute during opening');
assert.equal(await visibleEl('opening'),true,'Native lifecycle must not skip the opening');
const nativeLifecycle=true;
await click('opening-surface');await wait(120);await click('opening-surface');await expectVisible('opening-name');
await click('opening-name');await wait(120);await click('opening-name');await expectMode('openingWalk');
for(let i=0;i<12;i++){const y=await evaluate('window.cityAdventure.snapshot().y');if(y<1190)break;await moveUp(200);}
await expectVisible('interact');await click('interact');
for(let i=0;i<80;i++){if(await visibleEl('talk'))await click('next-line');else if(await visibleEl('card'))await click('card');if(await evaluate('window.cityAdventure.status().mode==="foot"&&window.cityAdventure.status().running&&!window.cityAdventure.status().uiLock'))break;await wait(150);}
assert.ok(await evaluate('window.cityAdventure.status().running&&!window.cityAdventure.status().uiLock'),'Dialogue must finish before movement is sampled');
const activeAudio=await expectAudio('Music must start after trusted touches',true);
const progress=await evaluate('window.cityAdventure.progress()');
assert.equal(progress.version,7,'Android runtime must use progress schema v7');
assert.equal(progress.narrative.flags.opening_completed,true,'Opening must commit persistent narrative state');
const stored=await evaluate('JSON.parse(localStorage.getItem("city-adventure-progress-v7")).stepId');assert.equal(stored,'blackout','Progress must be saved at Blackout');
assert.equal(await evaluate('JSON.parse(localStorage.getItem("city-adventure-progress-v7")).integrity.algorithm'),'fnv1a32-utf16');
assert.equal(await evaluate('JSON.parse(localStorage.getItem("city-adventure-progress-v7.backup")).version'),7);
const before=await evaluate('window.cityAdventure.snapshot()');assert.equal(before.mode,'foot');
await moveUp(350);
const after=await evaluate('window.cityAdventure.snapshot()');assert.ok(after.y<before.y,'Real Android movement responds to input');assert.ok(after.time>before.time);
await click('pause');await expectAudio('Pause must suspend music and DSP',false);const paused=await evaluate('window.cityAdventure.snapshot().time');await wait(400);assert.equal(await evaluate('window.cityAdventure.snapshot().time'),paused);await click('resume');const resumedAudio=await expectAudio('Resume must restore music and DSP',true);

const viewports=[
 {name:'360x800',width:360,height:800},
 {name:'390x844',width:390,height:844},
 {name:'412x915',width:412,height:915},
 {name:'844x390',width:844,height:390}
];
const viewportProof={};
async function captureViewport(v){
 await command('Emulation.setDeviceMetricsOverride',{width:v.width,height:v.height,deviceScaleFactor:1,mobile:true,screenWidth:v.width,screenHeight:v.height});
 await wait(180);
 const layout=await evaluate(`(()=>{const ids=['pause','interact','duo','dash','magic','gun','stick'];const rects={};for(const id of ids){const el=document.getElementById(id);const r=el.getBoundingClientRect();rects[id]={left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height,hidden:el.hidden||getComputedStyle(el).display==='none'};}return {width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,rects};})()`);
 assert.equal(layout.width,v.width,v.name+' viewport width');
 assert.equal(layout.height,v.height,v.name+' viewport height');
 assert.ok(layout.scrollWidth<=v.width+1,v.name+' must not horizontally overflow');
 for(const [id,r] of Object.entries(layout.rects)){
  if(r.hidden)continue;
  assert.ok(r.left>=-1&&r.right<=v.width+1&&r.top>=-1&&r.bottom<=v.height+1,`${v.name} ${id} must remain on-screen`);
  if(id!=='stick')assert.ok(r.height>=47.5,`${v.name} ${id} must retain a 48px touch target`);
 }
 const shot=await command('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
 assert.ok(shot.data,'CDP screenshot data missing for '+v.name);
 fs.writeFileSync('viewport-'+v.name+'.png',Buffer.from(shot.data,'base64'));
 viewportProof[v.name]=layout;
}
for(const v of viewports)await captureViewport(v);
await command('Emulation.clearDeviceMetricsOverride');

const proof={brand,trustedTouch:true,activeAudio,resumedAudio,ready,maps,openingShown,nativeLifecycle,saveVersion:progress.version,openingCompleted:progress.narrative.flags.opening_completed===true,movement:{before:before.y,after:after.y},pause:true,viewports:viewportProof,status:await evaluate('window.cityAdventure.status()')};
fs.writeFileSync('android-renderer-proof.json',JSON.stringify(proof,null,2));
socket.close();console.log('PASS: real Android renderer loaded, trusted touch/audio/opening/lifecycle/movement/pause and contract viewports verified.');
}
