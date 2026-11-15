// Real WebView transport. No browser simulation and no gameplay state mutation.
import assert from 'node:assert/strict';
export const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function connectWebView(port=9222){
 let tabs;
 for(let i=0;i<60;i++){
  try{tabs=await(await fetch(`http://127.0.0.1:${port}/json`,{signal:AbortSignal.timeout(1500)})).json();if(tabs.some(t=>t.type==='page'))break;}catch{}
  await delay(250);
 }
 const tab=tabs?.find(t=>t.type==='page'&&t.url.startsWith('https://appassets.androidplatform.net/'));
 assert.ok(tab,'No local Android game WebView exposed through adb');
 const ws=new WebSocket(tab.webSocketDebuggerUrl.replace(/localhost:\d+|127\.0\.0\.1:\d+/,`127.0.0.1:${port}`));
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>{ws.close();reject(Error('WebView connection timeout'));},5000);ws.onopen=()=>{clearTimeout(timer);resolve();};ws.onerror=()=>{clearTimeout(timer);reject(Error('WebView connection failed'));};});
 let serial=0;const pending=new Map();
 ws.onmessage=event=>{const reply=JSON.parse(event.data),p=pending.get(reply.id);if(!p)return;pending.delete(reply.id);clearTimeout(p.timer);reply.error?p.reject(Error(JSON.stringify(reply.error))):p.resolve(reply.result||{});};
 ws.onclose=()=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Renderer connection closed'));}pending.clear();};
 const command=(method,params={},timeout=10000)=>new Promise((resolve,reject)=>{
  const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout: '+method));},timeout);
  pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}));
 });
 const evaluate=async expression=>{const r=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});assert.ok(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;};
 const ready=async()=>{for(let i=0;i<100;i++){if(await evaluate('Boolean(window.cityAdventure?.status().loaded && window.cityAdventure.status().mode === "menu")'))return;await delay(200);}throw Error('Local game did not reach a loaded menu');};
 return {command,evaluate,ready,close:()=>ws.close()};
}
