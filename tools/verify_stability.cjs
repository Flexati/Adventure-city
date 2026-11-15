// Q1 stability checks in real Chromium: injected faults only, never a full-campaign claim.
// S1 one frame fault, S2 repeated frame faults, S3 a missing hub image, S4 background guard, S5 recovery panel stays silent and unsaved, S5b the packaged Android bootstrap ignores errors after the start, S6/S6b a mission image that fails to load in startFoot/startDrive opens the recovery panel, S7 a held button is released when the game goes to the background, M-S1 save cost.
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const [url='http://127.0.0.1:8090/game/',out='stability-q1.json',androidUrl=new URL('/android/build/assets/game/',url).href]=process.argv.slice(2);
const PROBE='qa-stability-probe';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const origin=new URL(url).origin,external=[],checks=[];
 const {makeSave,seed}=require('./qa_v8.cjs'),{stepIndex}=await import('../game/missions.mjs'),{hubPoints}=await import('../game/hubs.mjs');
 const {makePolicy}=await import('../tests/helpers/autoplay.mjs');
 async function scenario(id,expectedErrors,body){
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true}),errors=[],aborted=[],row={id,result:'PASS',measures:{},failures:[]};
  await context.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin){external.push(u.origin);return route.abort();}if(row.abort&&row.abort.test(u.pathname)){aborted.push(u.pathname);return route.abort();}return route.continue();});
  const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
  try{await body(p,row);}catch(e){row.result='FAIL';row.failures.push(String(e.message||e).split('\n')[0]);}
  // Only the injected faults may reach the page: anything else is a regression.
  const unexpected=errors.filter(m=>!expectedErrors.some(r=>r.test(m)));
  if(unexpected.length){row.result='FAIL';row.failures.push('unexpected page errors: '+JSON.stringify(unexpected));}
  row.pageErrors=errors.length;row.aborted=aborted;delete row.abort;
  await context.close();checks.push(row);console.log(`${row.id} ${row.result} ${JSON.stringify(row.measures)}${row.failures.length?' :: '+row.failures.join(' | '):''}`);
 }
 const status=p=>p.evaluate(()=>window.cityAdventure.status());
 const lastFrame=p=>p.evaluate(()=>window.cityAdventure.performance().at(-1)?.id??0);
 // Records, in page time, the first moment #fault-panel becomes visible (null while it does not exist).
 const watchPanel=p=>p.evaluate(()=>{window.__faultPanelAt=null;const el=document.getElementById('fault-panel');if(!el)return false;const mark=()=>{if(!el.hidden&&window.__faultPanelAt===null)window.__faultPanelAt=performance.now();};new MutationObserver(mark).observe(el,{attributes:true,attributeFilter:['hidden']});mark();return true;});
 const visibleButtons=p=>p.evaluate(()=>[...document.querySelectorAll('button')].filter(b=>b.getClientRects().length&&getComputedStyle(b).visibility!=='hidden').map(b=>b.id||b.textContent.trim()));
 try{
  await scenario('S1-single-frame-fault',[new RegExp(PROBE)],async(p,row)=>{
   await seed(p,url,'below');assert.equal((await status(p)).mode,'foot');await p.waitForTimeout(300);
   const before=await lastFrame(p);
   await p.evaluate(probe=>{const proto=CanvasRenderingContext2D.prototype,original=proto.fillRect;window.__probeAt=null;proto.fillRect=function(...args){proto.fillRect=original;window.__probeAt=performance.now();throw new Error(probe+' S1');};},PROBE);
   await p.waitForFunction(()=>window.__probeAt!==null,null,{timeout:2000});
   const at=await p.evaluate(()=>window.cityAdventure.performance().at(-1)?.id??0);await p.waitForTimeout(1000);
   const after=await lastFrame(p),st=await status(p);
   Object.assign(row.measures,{framesBeforeProbe:before,framesIn1000msAfterThrow:after-at,mode:st.mode,running:st.running,faultPanelHidden:await p.evaluate(()=>document.getElementById('fault-panel')?.hidden??null),faultsTotal:st.faults?.total??null});
   assert.ok(after-at>=30,`frames after one fault: ${after-at} (want >= 30)`);
   assert.equal(st.mode,'foot');assert.equal(row.measures.faultPanelHidden,true,'fault panel stays hidden after one fault');assert.equal(row.measures.faultsTotal,1,'one fault recorded');
  });
  await scenario('S2-repeated-frame-faults',[new RegExp(PROBE)],async(p,row)=>{
   await seed(p,url,'below');const expected=await p.evaluate(()=>window.cityAdventure.progress());
   const exists=await watchPanel(p);
   await p.evaluate(probe=>{window.__probeAt=null;CanvasRenderingContext2D.prototype.fillRect=function(){if(window.__probeAt===null)window.__probeAt=performance.now();throw new Error(probe+' S2');};},PROBE);
   await p.waitForFunction(()=>window.__probeAt!==null,null,{timeout:2000});
   await p.waitForFunction(()=>window.__faultPanelAt!==null,null,{timeout:2000}).catch(()=>{});
   const t=await p.evaluate(()=>({first:window.__probeAt,panel:window.__faultPanelAt})),st=await status(p);
   Object.assign(row.measures,{panelExists:exists,msFirstFaultToPanel:t.panel===null?null:t.panel-t.first,running:st.running,faults:st.faults??null});
   assert.ok(exists,'#fault-panel exists');assert.ok(t.panel!==null&&t.panel-t.first<=250,`ms to panel: ${row.measures.msFirstFaultToPanel} (want <= 250)`);assert.equal(st.running,false,'simulation stops on recovery');
   await p.click('#fault-reload');
   await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu',null,{timeout:15000});
   const menu=await status(p);row.measures.afterReload={mode:menu.mode,continueVisible:await p.isVisible('#continue'),saveSource:menu.saveSource};
   assert.equal(row.measures.afterReload.continueVisible,true);assert.equal(menu.saveSource,'primary');
   await p.click('#continue');for(let i=0;i<40&&!(await status(p)).running;i++){if(await p.isVisible('#card'))await p.click('#card');else if(await p.isVisible('#talk'))await p.click('#next-line');else await p.waitForTimeout(80);}
   const restored=await p.evaluate(()=>window.cityAdventure.progress());row.measures.stepId={before:expected.stepId,after:restored?.stepId??null};
   assert.equal(restored.stepId,expected.stepId);
  });
  await scenario('S3-missing-hub-image',[/^port$/],async(p,row)=>{
   // art/port.png is the Cathedral Quarter map (DISTRICT_MAPS[1]); it is not core art, so only this hub entry asks for it.
   row.abort=/\/art\/port\.png$/;row.measures.abortedImage='art/port.png (DISTRICT_MAPS[1], hub cathedral)';
   const raw=JSON.parse(await makeSave('cathedral',{flags:{separated:true,reunited:false}})),point=hubPoints('cathedral').find(x=>x.id==='smith');raw.world.hub={id:'cathedral',pov:'nox',reason:'campaign',returnStep:stepIndex('cathedral'),x:point.x,y:point.y};
   await p.goto(url);await p.evaluate(raw=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v7',raw);},JSON.stringify(raw));
   await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
   const exists=await watchPanel(p);
   await p.evaluate(()=>{window.__enterAt=performance.now();document.getElementById('continue').click();});
   await p.waitForFunction(()=>window.__faultPanelAt!==null,null,{timeout:5000}).catch(()=>{});
   const t=await p.evaluate(()=>({enter:window.__enterAt,panel:window.__faultPanelAt,now:performance.now()})),st=await status(p);
   Object.assign(row.measures,{panelExists:exists,msEnterToPanel:t.panel===null?null:t.panel-t.enter,msObserved:t.now-t.enter,mode:st.mode,running:st.running,visibleButtons:await visibleButtons(p),faults:st.faults??null});
   assert.ok(exists,'#fault-panel exists');assert.ok(t.panel!==null&&t.panel-t.enter<=500,`ms to panel: ${row.measures.msEnterToPanel} (want <= 500)`);
   assert.deepEqual(row.measures.visibleButtons,['fault-reload'],'the recovery button is the only action');
  });
  await scenario('S4-background-guard',[],async(p,row)=>{
   await seed(p,url,'below');await p.waitForTimeout(300);
   const hide=hidden=>p.evaluate(hidden=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>hidden});Object.defineProperty(document,'visibilityState',{configurable:true,get:()=>hidden?'hidden':'visible'});document.dispatchEvent(new Event('visibilitychange'));},hidden);
   await hide(true);const t0=await p.evaluate(()=>window.cityAdventure.snapshot().time);await p.waitForTimeout(3000);
   const t1=await p.evaluate(()=>window.cityAdventure.snapshot().time),st=await status(p);
   Object.assign(row.measures,{hiddenDeltaTime:t1-t0,paused:st.paused,lifecycleMuted:st.lifecycleMuted,audioContext:st.audio.context});
   assert.equal(t1-t0,0);assert.equal(st.paused,true);assert.equal(st.lifecycleMuted,true);assert.equal(st.audio.context,'suspended');
   await hide(false);await p.click('#resume');
   // The game's frame for the next vsync is already queued, so this callback runs right after exactly one game frame.
   const first=await p.evaluate(()=>new Promise(resolve=>{const a=window.cityAdventure.snapshot().time,id=window.cityAdventure.performance().at(-1)?.id??0;requestAnimationFrame(()=>resolve({delta:window.cityAdventure.snapshot().time-a,frames:(window.cityAdventure.performance().at(-1)?.id??0)-id}));}));
   // frameStep clamps dt to .05 s, but snapshot().time is a running sum: (a+.05)-a can round to .05000000000000004 (1 ulp of a is about 1e-16 for a of a few seconds).
   // EPS only absorbs that rounding: 1e-9 is 7 orders below a 50 ms frame, so a broken clamp (dt of 51 ms or more) still fails.
   const EPS=1e-9;
   const after=await status(p);Object.assign(row.measures,{firstFrameDeltaTime:first.delta,framesMeasured:first.frames,pausedAfterResume:after.paused});
   assert.equal(after.paused,false);assert.equal(first.frames,1,'exactly one game frame measured');assert.ok(first.delta>=0&&first.delta<=.05+EPS,`first frame delta ${first.delta}`);
  });
  await scenario('S5-recovery-panel-lifecycle',[new RegExp(PROBE)],async(p,row)=>{
   await seed(p,url,'below');
   // Counts every write the game makes to its progress keys (primary and backup) after this point.
   await p.evaluate(()=>{window.__progressSets=0;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(/progress/.test(key))window.__progressSets++;return original.call(this,key,value);};});
   await watchPanel(p);
   await p.evaluate(probe=>{CanvasRenderingContext2D.prototype.fillRect=function(){throw new Error(probe+' S5');};},PROBE);
   await p.waitForFunction(()=>window.__faultPanelAt!==null,null,{timeout:3000});
   const probeState=()=>p.evaluate(()=>{const s=window.cityAdventure.status();return {running:s.running,lifecycleMuted:s.lifecycleMuted,audio:s.audio.context,musicPaused:s.audio.musicPaused,progressSets:window.__progressSets};});
   const hide=hidden=>p.evaluate(hidden=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>hidden});document.dispatchEvent(new Event('visibilitychange'));},hidden);
   const open=await probeState(),steps={open};
   await p.evaluate(()=>window.dispatchEvent(new Event('blur')));await p.waitForTimeout(200);steps.blur=await probeState();
   await p.evaluate(()=>window.dispatchEvent(new Event('focus')));await p.waitForTimeout(600);steps.focus=await probeState();
   await hide(true);await p.waitForTimeout(200);steps.hidden=await probeState();
   await hide(false);await p.waitForTimeout(1200);steps.visible=await probeState();
   row.measures.steps=steps;
   assert.equal(open.running,false,'the recovery panel stopped the simulation');assert.equal(open.audio,'suspended','audio is suspended while the panel opens');assert.equal(open.progressSets,0,'opening the panel writes nothing');
   for(const name of ['blur','focus','hidden','visible']){assert.equal(steps[name].audio,'suspended',`audio context after ${name}`);assert.equal(steps[name].musicPaused,true,`music paused after ${name}`);assert.equal(steps[name].progressSets,0,`progress writes after ${name}`);}
  });
  await scenario('S5b-android-bootstrap-late-error',[new RegExp(PROBE)],async(p,row)=>{
   // Packaged bundle (bootstrap.js + app.js): an error after the game has loaded belongs to #fault-panel, not to the start-failed screen.
   await p.goto(androidUrl);await p.waitForFunction(()=>window.cityAdventure?.status().loaded);
   row.measures.bootstrapScript=await p.evaluate(()=>!!document.querySelector('script[src="bootstrap.js"]'));
   row.measures.recoveryBefore=await p.locator('#startup-recovery').count();
   await p.evaluate(probe=>{setTimeout(()=>{throw new Error(probe+' S5b');},0);},PROBE);
   await p.waitForFunction(()=>window.cityAdventure.status().faults?.total>=1,null,{timeout:3000}).catch(()=>{});
   await p.waitForTimeout(300);
   const st=await status(p);Object.assign(row.measures,{recoveryAfter:await p.locator('#startup-recovery').count(),faultsTotal:st.faults?.total??null,running:st.running,mode:st.mode});
   assert.equal(row.measures.bootstrapScript,true,'the packaged bootstrap.js is the one under test');assert.equal(row.measures.recoveryBefore,0);
   assert.equal(row.measures.faultsTotal,1,'the runtime recorded the late error');assert.equal(row.measures.recoveryAfter,0,'#startup-recovery stays closed after the start');
  });
  // A mission whose first images fail to load (startFoot / startDrive catch) must open #fault-panel, not stay on a dead card.
  const missionAssetScenario=(id,stepId,pattern,label)=>scenario(id,[],async(p,row)=>{
   row.abort=pattern;row.measures.abortedImage=label;
   const raw=await makeSave(stepId);
   await p.goto(url);await p.evaluate(raw=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v7',raw);},raw);
   await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
   const exists=await watchPanel(p);
   await p.click('#continue');await p.waitForSelector('#card',{state:'visible',timeout:5000});
   // The card is the last thing before startFoot asks for the images: its click starts the load that fails (startFoot or startDrive).
   await p.evaluate(()=>{window.__enterAt=performance.now();document.getElementById('card').click();});
   await p.waitForFunction(()=>window.__faultPanelAt!==null,null,{timeout:5000}).catch(()=>{});
   const t=await p.evaluate(()=>({enter:window.__enterAt,panel:window.__faultPanelAt,now:performance.now()})),st=await status(p);
   Object.assign(row.measures,{panelExists:exists,msEnterToPanel:t.panel===null?null:t.panel-t.enter,msObserved:t.now-t.enter,mode:st.mode,running:st.running,visibleButtons:await visibleButtons(p),faults:st.faults??null});
   assert.ok(exists,'#fault-panel exists');assert.ok(t.panel!==null&&t.panel-t.enter<=500,`ms to panel: ${row.measures.msEnterToPanel} after ${Math.round(row.measures.msObserved)} ms; mode ${st.mode}, running ${st.running}, buttons ${JSON.stringify(row.measures.visibleButtons)} (want panel <= 500)`);
   assert.equal(st.running,false,'simulation stays stopped');assert.deepEqual(row.measures.visibleButtons,['fault-reload'],'the recovery button is the only action');
   await p.click('#fault-reload');
   await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu',null,{timeout:15000});
   row.measures.afterReload={mode:(await status(p)).mode,continueVisible:await p.isVisible('#continue')};
   assert.equal(row.measures.afterReload.continueVisible,true,'#continue is offered after the reload');
  });
  // art/v09/chalk_route.svg (chalk_route_art) is requested only by startFoot for exp_chalk_marks and below (runtime.mjs, startFoot extra list).
  await missionAssetScenario('S6-missing-mission-asset-foot','below',/\/art\/v09\/chalk_route\.svg$/,'art/v09/chalk_route.svg (chalk_route_art, startFoot of below)');
  // art/v05/driving_cars.png is requested only by startDrive (and hub races, which this seed never reaches).
  await missionAssetScenario('S6b-missing-mission-asset-drive','signal',/\/art\/v05\/driving_cars\.png$/,'art/v05/driving_cars.png (driving_cars, startDrive of signal)');
  // S7 (R17): Lulù's terminal in 'contagion' (2nd node, runtime.mjs clinicEvent) is the only hold reachable with ordinary inputs in about 30 s (the other one is the Archon finale).
  // A blur while the finger stays down must release the press: performance.now() keeps running in the background, so a stale start used to confirm the choice on return.
  await scenario('S7-hold-released-on-blur',[],async(p,row)=>{
   await seed(p,url,'contagion');
   const policy=makePolicy({reaction:.3,dodgeRate:.7,seed:7}),held=new Set(),deadline=Date.now()+90000;
   while(!(await p.isVisible('#hold'))){
    assert.ok(Date.now()<deadline,'no hold panel within 90 s of ordinary input');
    if(await p.isVisible('#talk')){await p.click('#next-line');continue;}
    const s=await p.evaluate(()=>window.cityAdventure.snapshot()),i=policy(s),want=new Set();assert.equal(s.status,'playing','the automatic player must survive until the terminal');
    for(const [yes,key] of [[i.x>.3,'KeyD'],[i.x<-.3,'KeyA'],[i.y>.3,'KeyS'],[i.y<-.3,'KeyW'],[i.gun,'KeyJ'],[i.magic,'KeyL'],[i.dash,'ShiftLeft'],[i.duo,'KeyQ'],[i.interact,'KeyE']])if(yes)want.add(key);
    for(const k of [...held])if(!want.has(k)){await p.keyboard.up(k);held.delete(k);}for(const k of want)if(!held.has(k)){await p.keyboard.down(k);held.add(k);}await p.waitForTimeout(50);
   }
   for(const k of held)await p.keyboard.up(k);
   const fill=()=>p.evaluate(()=>document.getElementById('hold-fill').style.width);
   const box=await p.locator('#hold-button').boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();
   await p.waitForTimeout(250);row.measures.fillWhileHeld=await fill();
   await p.evaluate(()=>window.dispatchEvent(new Event('blur')));
   await p.waitForTimeout(1400);
   const st=await status(p);Object.assign(row.measures,{holdVisibleAfter1400ms:await p.isVisible('#hold'),fillAfter1400ms:await fill(),uiLock:st.uiLock});
   assert.ok(parseFloat(row.measures.fillWhileHeld)>0,'the press was filling before the blur: '+row.measures.fillWhileHeld);
   assert.equal(row.measures.holdVisibleAfter1400ms,true,'the hold panel is still open: the choice was not confirmed by itself');
   assert.equal(parseFloat(row.measures.fillAfter1400ms||'0'),0,'#hold-fill width is 0, got '+row.measures.fillAfter1400ms);
   assert.ok(st.uiLock>0,'the dialogue lock is still held');
   // Control: after the release a press that is really held to the end still confirms.
   await p.mouse.up();await p.mouse.down();await p.waitForFunction(()=>document.getElementById('hold').hidden,null,{timeout:3000});await p.mouse.up();
   row.measures.completesWhenHeld=true;
  });
  await scenario('M-S1-save-cost',[],async(p,row)=>{
   await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded);
   Object.assign(row.measures,await p.evaluate(async({base,key})=>{
    const {createProgressStore}=await import(new URL('progress-store.mjs',base).href),{newProgress,saveProgress,loadProgress}=await import(new URL('missions.mjs',base).href);
    const store=createProgressStore({storage:()=>localStorage,key,serialize:saveProgress,deserialize:loadProgress}),progress=newProgress(),times=[];
    for(let i=0;i<200;i++){progress.stats.seconds=i;const t=performance.now(),r=store.write(progress);times.push(performance.now()-t);if(!r.ok)throw new Error('write failed at '+i);}
    const chars=localStorage.getItem(key).length+localStorage.getItem(key+'.backup').length;localStorage.removeItem(key);localStorage.removeItem(key+'.backup');
    return {writes:times.length,meanMs:times.reduce((a,b)=>a+b,0)/times.length,maxMs:Math.max(...times),storedChars:chars,probeKeyRemoved:localStorage.getItem(key)===null&&localStorage.getItem(key+'.backup')===null};
   },{base:url,key:PROBE}));
   assert.equal(row.measures.writes,200);assert.equal(row.measures.probeKeyRemoved,true);
  });
  if(external.length){checks.push({id:'no-external-requests',result:'FAIL',failures:[JSON.stringify([...new Set(external)])]});}
  const failed=checks.filter(c=>c.result!=='PASS').map(c=>c.id);
  fs.writeFileSync(out,JSON.stringify({environment:{browser:browser.version(),viewport:'390x844'},procedure:'seeded checkpoints, injected Canvas faults and one aborted local image; measurement only for M-S1',checks,external,failed},null,2)+'\n');
  console.log(failed.length?'Stability FAIL: '+failed.join(', '):'Stability S1-S7, S5b, S6b and M-S1 PASS');
  if(failed.length)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
