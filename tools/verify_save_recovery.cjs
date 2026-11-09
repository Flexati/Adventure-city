// Declared fixtures and storage fault injection, never a full-campaign completion claim.
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const [url='http://127.0.0.1:8090/game/',out='save-recovery.json']=process.argv.slice(2);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const errors=[],external=[],checks=[],key='city-adventure-progress-v7',origin=new URL(url).origin;
 let context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
 const watch=async c=>{await c.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin===origin)return route.continue();external.push(u.origin);return route.abort();});};
 const open=async()=>{const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));return p;};
 const ready=async p=>p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
 const resume=async p=>{await p.click('#continue');for(let i=0;i<40;i++){if(await p.isVisible('#card'))await p.click('#card');else if(await p.isVisible('#talk'))await p.click('#next-line');else if((await p.evaluate(()=>window.cityAdventure.status())).running)return;else await p.waitForTimeout(80);}throw Error('Resume did not become playable');};
 try{
  await watch(context);let p=await open();
  await require('./qa_v8.cjs').seed(p,url,'below');await p.click('#pause');
  const expected=await p.evaluate(()=>window.cityAdventure.progress());
  await p.evaluate(()=>window.dispatchEvent(new Event('citynativepause')));
  assert.equal((await p.evaluate(()=>window.cityAdventure.status())).musicPaused,true);
  const storageState=await context.storageState();await context.close();
  context=await browser.newContext({storageState,viewport:{width:390,height:844},hasTouch:true});await watch(context);p=await open();
  await p.goto(url);await ready(p);await resume(p);
  const restored=await p.evaluate(()=>window.cityAdventure.progress());assert.equal(restored.stepId,expected.stepId);assert.deepEqual(restored.world,expected.world);assert.deepEqual(restored.narrative,expected.narrative);
  checks.push({id:'browser-process-recreation',result:'PASS',limit:'New browser context restored from storageState; not Android process-kill evidence'});
  await p.click('#pause');await p.click('#menu-return');
  const backup=await p.evaluate(key=>JSON.parse(localStorage.getItem(key+'.backup')),key);
  await p.evaluate(key=>{const raw=JSON.parse(localStorage.getItem(key));raw.world.coins+=1000;localStorage.setItem(key,JSON.stringify(raw));},key);
  await p.reload();await ready(p);assert.equal((await p.evaluate(()=>window.cityAdventure.status())).saveSource,'backup');assert.equal(await p.isVisible('#continue'),true);
  assert.match(await p.locator('#notice').textContent(),/copia di recupero/);await resume(p);assert.equal((await p.evaluate(()=>window.cityAdventure.progress())).world.coins,backup.world.coins);
  checks.push({id:'checksum-corruption-recovery',result:'PASS'});
  await p.click('#pause');await p.click('#menu-return');
  const old=await p.evaluate(key=>localStorage.getItem(key),key);
  await p.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Full','QuotaExceededError');};});
  await resume(p);
  // Notices deliberately preserve the previous message for 1.4 s; wait for the new one.
  await p.waitForFunction(()=>document.getElementById('notice').textContent.includes('Salvataggio non disponibile'));
  assert.equal(await p.evaluate(key=>localStorage.getItem(key),key),old);
  checks.push({id:'quota-failure-preserves-checkpoint',result:'PASS'});
  // The failed-save notice belongs to the session, not to the scene: going back to the menu must not wipe it.
  await p.waitForFunction(()=>!document.getElementById('notice').classList.contains('on'),null,{timeout:6000});
  await p.click('#pause');await p.click('#menu-return');await ready(p);
  assert.ok(await p.evaluate(()=>{const n=document.getElementById('notice');return n.classList.contains('on')&&n.textContent.includes('Salvataggio non disponibile');}),'«Menu principale» keeps the failed-save notice on screen');
  checks.push({id:'failed-save-notice-survives-menu-return',result:'PASS'});
  await p.reload();await ready(p);
  await p.evaluate(key=>{localStorage.setItem('city-adventure-progress-v6','legacy-preserved');localStorage.setItem(key,'{truncated');localStorage.setItem(key+'.backup','{truncated');},key);
  await p.reload();await ready(p);assert.equal(await p.isVisible('#continue'),false);assert.equal((await p.evaluate(()=>window.cityAdventure.status())).saveSource,'corrupt');assert.equal(await p.evaluate(()=>localStorage.getItem('city-adventure-progress-v6')),'legacy-preserved');
  checks.push({id:'unrecoverable-corruption-no-silent-legacy-migration',result:'PASS'});
  await p.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}}));
  await p.reload();await ready(p);assert.equal((await p.evaluate(()=>window.cityAdventure.status())).saveSource,'unavailable');assert.equal(await p.isVisible('#continue'),false);
  checks.push({id:'storage-denied-usable-menu',result:'PASS'});
  assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
  checks.push({id:'no-external-runtime-requests',result:'PASS',limit:'Local HTTP origin allowed; offline APK lifecycle still requires Android evidence'});
  fs.writeFileSync(out,JSON.stringify({environment:{browser:browser.version(),viewport:'390x844'},procedure:'seeded checkpoint + real UI + explicit storage faults',checks,errors,external},null,2)+'\n');
  console.log('Save recovery, quota, process recreation and local-only runtime PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
