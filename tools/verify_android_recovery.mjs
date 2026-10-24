// Requires the installed test APK and an emulator/device. Performs a real renderer crash.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {connectWebView,delay} from './lib/android-cdp.mjs';
const adb=process.env.ADB||'adb',app='com.cityadventure.pizzaprotocol.debug';
const run=(...args)=>execFileSync(adb,args,{encoding:'utf8',timeout:20000}).trim();
const shell=(...args)=>run('shell',...args);
const proof={procedure:'Real adb radio changes, cold restart, CDP renderer crash, native Retry and resumed stored checkpoint',checks:[],result:'FAIL'};
const key='city-adventure-progress-v7';let c;
const radio={wifi:shell('settings','get','global','wifi_on'),data:shell('settings','get','global','mobile_data')};
async function attach(){
 let pid='';for(let i=0;i<60&&!pid;i++){try{pid=shell('pidof',app);}catch{}if(!pid)await delay(250);}
 assert.ok(pid,'App process missing');run('forward','tcp:9222',`localabstract:webview_devtools_remote_${pid}`);
 const session=await connectWebView();await session.ready();return session;
}
async function saved(){return c.evaluate(`({primary:localStorage.getItem(${JSON.stringify(key)}),backup:localStorage.getItem(${JSON.stringify(key+'.backup')})})`);}
async function waitForLifecycleMuted(expected,label){
 let actual;
 for(let i=0;i<40;i++){
  actual=await c.evaluate('window.cityAdventure.status().lifecycleMuted');
  if(actual===expected)return;
  await delay(250);
 }
 assert.equal(actual,expected,label);
}
async function waitForRadioSetting(name,expected){
 let actual;
 for(let i=0;i<40;i++){
  actual=shell('settings','get','global',name);
  if(actual===expected)return;
  await delay(250);
 }
 assert.equal(actual,expected,`${name} must reach the requested offline state`);
}
try{
 c=await attach();const before=await saved();assert.ok(before.primary&&before.backup,'Run the native gameplay verifier first to create actual progress');
 c.close();shell('svc','wifi','disable');shell('svc','data','disable');
 await waitForRadioSetting('wifi_on','0');await waitForRadioSetting('mobile_data','0');
 shell('am','force-stop',app);shell('am','start','-W','-n',app+'/.MainActivity');c=await attach();
 assert.deepEqual(await saved(),before,'Offline cold start must preserve both save copies');
 assert.equal(await c.evaluate('Boolean(document.getElementById("continue") && !document.getElementById("continue").hidden)'),true);
 assert.deepEqual(await c.evaluate('performance.getEntriesByType("resource").map(r=>r.name).filter(u=>/^https?:/.test(u)&&new URL(u).origin!==location.origin)'),[]);
 proof.checks.push({id:'offline-cold-start',result:'PASS',radiosDisabled:true,savesUnchanged:true});
 // Simulate recovery from a runtime failure, not a fake DOM error screen.
 await c.command('Page.crash',{},4000).catch(()=>{});c.close();
 let bounds;
 for(let i=0;i<40;i++){
  shell('uiautomator','dump','/sdcard/chronos-recovery.xml');
  const xml=shell('cat','/sdcard/chronos-recovery.xml');
  const node=(xml.match(/<node\b[^>]+>/g)||[]).find(n=>n.includes('content-desc="Riprova caricamento gioco"'));
  if(node){bounds=node.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);if(bounds)break;}
  await delay(250);
 }
 assert.ok(bounds,'Real renderer crash must display native Retry');
 const [x1,y1,x2,y2]=bounds.slice(1).map(Number);shell('input','tap',String(Math.round((x1+x2)/2)),String(Math.round((y1+y2)/2)));
 c=await attach();assert.deepEqual(await saved(),before,'Renderer crash and native Retry must preserve both save copies');
 assert.equal(await c.evaluate('Boolean(document.getElementById("startup-recovery"))'),false);
 proof.checks.push({id:'renderer-crash-native-retry-offline',result:'PASS',savesUnchanged:true});
 // A real OS background/resume must invoke native lifecycle callbacks.
 shell('input','keyevent','KEYCODE_HOME');
 await waitForLifecycleMuted(true,'HOME must dispatch the native pause callback');
 shell('am','start','-W','-n',app+'/.MainActivity');
 await waitForLifecycleMuted(false,'Foregrounding must dispatch the native resume callback');
 proof.checks.push({id:'os-background-resume',result:'PASS'});proof.result='PASS';
}catch(error){proof.error=error.stack;process.exitCode=1;console.error(error);}
finally{
 c?.close();
 for(const [name,state] of Object.entries(radio)){try{shell('svc',name,state==='1'?'enable':'disable');}catch(error){proof.restoreError=String(error);proof.result='FAIL';process.exitCode=1;}}
 fs.writeFileSync('android-recovery-proof.json',JSON.stringify(proof,null,2)+'\n');
}
console.log(proof.result+': native offline, renderer recovery and OS lifecycle');
