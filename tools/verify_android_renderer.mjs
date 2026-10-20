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
let ready=false;for(let i=0;i<60;i++){ready=await evaluate('Boolean(window.cityAdventure && window.cityAdventure.status().loaded)');if(ready)break;await wait(500);}
assert.ok(ready,'Game assets must finish loading');
assert.equal(await evaluate('Boolean(document.getElementById("startup-recovery"))'),false);
const maps=await evaluate('Object.values(performance.getEntriesByType("resource")).filter(x=>x.name.includes("art/")).length');assert.ok(maps>5);
await evaluate('document.getElementById("start").click();true');await wait(250);
const openingShown=await evaluate('!document.getElementById("opening").hidden');
let nativeLifecycle=false;
if(openingShown){
 await evaluate('window.dispatchEvent(new Event("citynativepause"));true');
 assert.equal(await evaluate('window.cityAdventure.status().lifecycleMuted'),true,'Native pause must mute lifecycle audio state');
 await evaluate('window.dispatchEvent(new Event("citynativeresume"));true');
 assert.equal(await evaluate('window.cityAdventure.status().lifecycleMuted'),false,'Native resume must clear lifecycle mute during opening');
 assert.equal(await evaluate('window.cityAdventure.status().opening'),true,'Native lifecycle must not skip the opening');
 nativeLifecycle=true;
 await evaluate('document.getElementById("opening-surface").click();document.getElementById("opening-surface").click();true');
 await evaluate('document.getElementById("opening-name").click();true');
 await evaluate('document.getElementById("opening-pick").click();true');
 await wait(800);
}
for(let i=0;i<6;i++){
 const talk=await evaluate('!document.getElementById("talk").hidden');if(!talk)break;
 await evaluate('document.getElementById("next-line").click();true');await wait(80);
}
const before=await evaluate('window.cityAdventure.snapshot()');
assert.equal(before.version,5,'Android runtime must use save schema v5');
assert.equal(before.narrative?.flags?.opening_completed,true,'v0.7 opening must commit persistent narrative state');
await evaluate('window.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyW"}));true');await wait(500);await evaluate('window.dispatchEvent(new KeyboardEvent("keyup",{code:"KeyW"}));true');
const after=await evaluate('window.cityAdventure.snapshot()');assert.ok(after.y<before.y,'Real Android movement responds to input');assert.ok(after.time>before.time);
await evaluate('document.getElementById("pause").click();true');const paused=await evaluate('window.cityAdventure.snapshot().time');await wait(400);assert.equal(await evaluate('window.cityAdventure.snapshot().time'),paused);await evaluate('document.getElementById("resume").click();true');

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

// Deterministic narrative integration path: setup skips combat skill, but uses real
// runtime handlers, persistence, city choice, driving transition and dialogue callbacks.
await evaluate(`paused=true;state.enemies.forEach(e=>e.hp=0);state.x=state.nodes[0].x;state.y=state.nodes[0].y;interactNode(state);const first=state.events.filter(e=>e.type==='node').at(-1);eventFx(first);true`);
assert.equal(await evaluate('state.narrative.flags.helios_connector_seen===true'),true,'First Blackout relay must persist HELIOS clue');
for(const i of [1,2])await evaluate(`state.x=state.nodes[${i}].x;state.y=state.nodes[${i}].y;interactNode(state);true`);
await evaluate('state.status="cleared";finish();paused=false;true');
assert.equal(await evaluate('!document.getElementById("city-choice").hidden'),true,'Blackout choice must appear');
await evaluate('document.getElementById("choose-workshop").click();true');
assert.equal(await evaluate('state.cityChoice'), 'workshop');
assert.equal(await evaluate('state.narrative.flags.blackout_choice'), 'workshop');
const savedChoice=await evaluate('JSON.parse(localStorage.getItem("city-adventure-campaign-v5")).narrative.flags.blackout_choice');
assert.equal(savedChoice,'workshop','Blackout choice must be in v5 save');

await evaluate('document.getElementById("power").click();true');
for(let i=0;i<40;i++){if(await evaluate('Boolean(drive)'))break;await wait(100);}
assert.equal(await evaluate('Boolean(drive)'),true,'Vortex transition must start');
for(let i=0;i<4;i++){if(!(await evaluate('!document.getElementById("talk").hidden')))break;await evaluate('document.getElementById("next-line").click();true');await wait(60);}
await evaluate('drive.status="cleared";drivingResult();true');
assert.equal(await evaluate('!document.getElementById("city-return").hidden'),true,'Blackout consequence callback must appear after drive');
await evaluate('document.getElementById("city-close").click();true');
await evaluate('document.getElementById("drive-next").click();true');
for(let i=0;i<50;i++){if(await evaluate('state.level===1'))break;await wait(100);}
assert.equal(await evaluate('state.level'),1,'Driving completion must enter Breach');
assert.equal(await evaluate('!document.getElementById("talk").hidden'),true,'Breach promise dialogue must appear');
for(let i=0;i<3;i++){await evaluate('document.getElementById("next-line").click();true');await wait(70);}
assert.equal(await evaluate('state.narrative.flags.helios_promise_respected===true'),true,'Breach promise beat must persist');
assert.equal(await evaluate('state.narrative.thermal'),53,'Breach promise must apply authored Thermal Anchoring delta');
const savedPromise=await evaluate('JSON.parse(localStorage.getItem("city-adventure-campaign-v5")).narrative.flags.helios_promise_respected===true');
assert.equal(savedPromise,true,'Breach promise must survive in v5 save');
for(let i=0;i<4;i++){if(!(await evaluate('!document.getElementById("talk").hidden')))break;await evaluate('document.getElementById("next-line").click();true');await wait(60);}
const narrativeIntegration={
 heliosConnectorSeen:await evaluate('state.narrative.flags.helios_connector_seen===true'),
 blackoutChoice:await evaluate('state.narrative.flags.blackout_choice'),
 heliosPromiseRespected:await evaluate('state.narrative.flags.helios_promise_respected===true'),
 thermal:await evaluate('state.narrative.thermal'),
 level:await evaluate('state.level')
};

const proof={ready,maps,openingShown,nativeLifecycle,saveVersion:before.version,openingCompleted:before.narrative?.flags?.opening_completed===true,movement:{before:before.y,after:after.y},pause:true,viewports:viewportProof,narrativeIntegration,status:await evaluate('window.cityAdventure.status()')};
fs.writeFileSync('android-renderer-proof.json',JSON.stringify(proof,null,2));
socket.close();console.log('PASS: real Android renderer loaded, opening/lifecycle/movement/pause and contract viewports verified.');
