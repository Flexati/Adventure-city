// Runs against the debug APK's actual Android WebView over adb-forwarded CDP.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let tabs=[];for(let i=0;i<60;i++){try{tabs=await(await fetch('http://127.0.0.1:9222/json')).json();if(tabs.length)break;}catch{}await wait(500);}
assert.ok(tabs.length,'Android WebView must expose a real page');
const socket=new WebSocket(tabs[0].webSocketDebuggerUrl.replace(/localhost:\d+|127\.0\.0\.1:\d+/,'127.0.0.1:9222'));
await new Promise((r,j)=>{socket.onopen=r;socket.onerror=j;});
let id=0;const pending=new Map();socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}};
async function evaluate(expression){const request=++id;const reply=await Promise.race([new Promise(resolve=>{pending.set(request,resolve);socket.send(JSON.stringify({id:request,method:'Runtime.evaluate',params:{expression,returnByValue:true,awaitPromise:true}}));}),wait(15000).then(()=>{throw Error('CDP evaluation timed out');})]);assert.ok(!reply.result?.exceptionDetails,JSON.stringify(reply));return reply.result.result.value;}
let ready=false;for(let i=0;i<60;i++){ready=await evaluate('Boolean(window.cityAdventure && window.cityAdventure.status().loaded)');if(ready)break;await wait(500);}assert.ok(ready,'Game assets must finish loading');
assert.equal(await evaluate('Boolean(document.getElementById("startup-recovery"))'),false);
const maps=await evaluate('Object.values(performance.getEntriesByType("resource")).filter(x=>x.name.includes("art/")).length');assert.ok(maps>5);
await evaluate('document.getElementById("start").click();true');await wait(500);
await evaluate('document.getElementById("next-line").click();document.getElementById("next-line").click();true');
const before=await evaluate('window.cityAdventure.snapshot()');
await evaluate('window.dispatchEvent(new KeyboardEvent("keydown",{code:"KeyW"}));true');await wait(500);await evaluate('window.dispatchEvent(new KeyboardEvent("keyup",{code:"KeyW"}));true');
const after=await evaluate('window.cityAdventure.snapshot()');assert.ok(after.y<before.y,'Real Android movement responds to input');assert.ok(after.time>before.time);
await evaluate('document.getElementById("pause").click();true');const paused=await evaluate('window.cityAdventure.snapshot().time');await wait(400);assert.equal(await evaluate('window.cityAdventure.snapshot().time'),paused);await evaluate('document.getElementById("resume").click();true');
fs.writeFileSync('android-renderer-proof.json',JSON.stringify({ready,maps,movement:{before:before.y,after:after.y},pause:true,status:await evaluate('window.cityAdventure.status()')},null,2));socket.close();console.log('PASS: real Android renderer loaded, moved and paused.');
