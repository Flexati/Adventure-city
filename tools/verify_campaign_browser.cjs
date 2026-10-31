// NEW GAME → postcredits. Read-only snapshots and real UI inputs; never injects save/game state.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),os=require('node:os'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const [url='http://127.0.0.1:8090/game/',strategy='a',out='campaign-v8']=process.argv.slice(2);
const virtualTime=process.env.CITY_VIRTUAL_TIME==='1';
const deadlineMs=Number(process.env.CITY_CAMPAIGN_TIMEOUT_MS||25*60*1000);
assert.ok(['a','b','c'].includes(strategy),'strategy must be a, b or c');
assert.ok(Number.isFinite(deadlineMs)&&deadlineMs>0,'campaign timeout must be positive');
(async()=>{
 fs.mkdirSync(out,{recursive:true});const {makePolicy}=await import('../tests/helpers/autoplay.mjs');const {getLayout,routeWaypoint}=await import('../game/layouts.mjs');const {HUBS}=await import('../game/hubs.mjs');
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});const errors=[],steps=[],choices=[],hubChecks=[],seen=new Set();
 p.setDefaultTimeout(15000);
 const sourceHash=crypto.createHash('sha256');for(const f of fs.readdirSync('game').filter(f=>/\.(mjs|js|css|html)$/.test(f)).sort()){sourceHash.update(f);sourceHash.update(fs.readFileSync(path.join('game',f)));}
 const uiRaces=[];
 const metadata={commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),workingTreeDirty:!!execFileSync('git',['status','--porcelain','--untracked-files=no'],{encoding:'utf8'}).trim(),sourceSha256:sourceHash.digest('hex'),node:process.version,playwright:require('playwright/package.json').version,browser:b.version(),platform:os.platform(),release:os.release(),architecture:os.arch(),cpus:os.availableParallelism(),clock:virtualTime?'virtual':'wall',deadlineMs,startedAt:new Date().toISOString(),fixture:false,input:'real keyboard, pointer and UI; read-only state snapshots'};
 fs.writeFileSync(path.join(out,'environment.json'),JSON.stringify(metadata,null,2));
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
 if(virtualTime){await p.clock.install();p.waitForTimeout=ms=>p.clock.runFor(ms);}
 // Playtime measure (tools/estimate_playtime.mjs): virtual ms per step and activity, text actually advanced.
 // Each loop iteration advances the virtual clock by TICK ms and is attributed to exactly one activity, so no time is counted twice.
 const TICK=130,timing={},hubTiming={};let tickSpent=0;
 const T=step=>timing[step||'_menu']??=({action:{foot:0,drive:0,escape:0,openingWalk:0,hold:0},passive_ms:0,ui_bot_ms:0,talk_lines:0,talk_words:0,cards:0,card_words:0,choices:0,choice_words:0,results:0,result_words:0,retries:0,city_panels:0,city_words:0});
 const words=t=>(t||'').trim().split(/\s+/).filter(Boolean).length;
 const text=async sel=>{try{return await p.textContent(sel);}catch{return '';}};
 let lastHub=null,held=new Set(),policy=makePolicy({reaction:.3,dodgeRate:.65,seed:7}),lastStep=null,desiredAction=null,completed=false;
 const keys=async want=>{for(const k of held)if(!want.has(k))await p.keyboard.up(k);for(const k of want)if(!held.has(k))await p.keyboard.down(k);held=want;};
 const walk=(s,t,stop=24)=>{if(Math.hypot(t.x-s.x,t.y-s.y)<=stop)return new Set();const q=routeWaypoint(getLayout(s.layoutId),s,t),want=new Set();if(q.x-s.x>4)want.add('KeyD');if(q.x-s.x< -4)want.add('KeyA');if(q.y-s.y>4)want.add('KeyS');if(q.y-s.y< -4)want.add('KeyW');return want;};
 const click=async sel=>{await keys(new Set());try{await p.click(sel,{force:true,timeout:3000});}catch(e){
  // The game can finish a timed panel between isVisible and the pointer action.
  // Only tolerate disappearance; a still-visible but unclickable control remains a failure.
  if(await p.isVisible(sel))throw e;uiRaces.push({selector:sel,step:lastStep,message:e.message.split('\n')[0]});
 }};
 const start=Date.now();
 try{await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');if(process.env.CITY_LANGUAGE==='en'){await click('#menu-settings');await p.selectOption('#language','en');await click('#resume');}await click('#start');
 for(let guard=0;guard<80000;guard++){
  // Check before every branch: a locked UI must not bypass the deadline via continue.
  if(Date.now()-start>deadlineMs)throw Error('Bounded campaign timeout at '+lastStep);
  if(virtualTime)await p.clock.runFor(130);else await p.waitForTimeout(30);
  const st=await p.evaluate(()=>window.cityAdventure.status());if(errors.length)throw Error(errors.join('; '));
  if(st.running&&st.mode==='foot'&&['exp_chalk_marks','below'].includes(st.step)&&!seen.has(st.step)){seen.add(st.step);await p.screenshot({path:path.join(out,st.step+'-gameplay.png')});}
  if(guard%100===0)fs.writeFileSync(path.join(out,'live.json'),JSON.stringify({guard,elapsedMs:Date.now()-start,held:[...held],status:st,snapshot:await p.evaluate(()=>window.cityAdventure.snapshot())}));
  if(st.step&&st.step!==lastStep){console.log('STEP',st.step);steps.push(st.step);lastStep=st.step;policy=makePolicy({reaction:.3,dodgeRate:.65,seed:7});await p.screenshot({path:path.join(out,st.step+'.png')});}
  if(await p.isVisible('#ending')){completed=true;break;}
  if(await p.isVisible('#card')){const t=T(lastStep);t.cards++;t.card_words+=words(await text('#card'));t.ui_bot_ms+=TICK;await click('#card');continue;}
  if(await p.isVisible('#opening')){T(lastStep).ui_bot_ms+=TICK;for(const id of ['opening-surface','opening-name','opening-pick'])if(await p.isVisible('#'+id)){await click('#'+id);break;}continue;}
  if(await p.isVisible('#talk')){const t=T(lastStep);t.talk_lines++;t.talk_words+=words(await text('#line'));t.ui_bot_ms+=TICK;await click('#next-line');continue;}
  if(await p.isVisible('#field-kit')){const t=T(lastStep);t.city_panels++;t.city_words+=words(await text('#field-kit'));t.ui_bot_ms+=TICK;await click('#equip-kit');continue;}
  if(await p.isVisible('#city-choice')){const t=T(lastStep);t.choices++;t.choice_words+=words(await text('#city-choice'));t.ui_bot_ms+=TICK;await click(strategy==='b'?'#choose-shelter':'#choose-workshop');continue;}
  if(await p.isVisible('#city-return')){const t=T(lastStep);t.city_panels++;t.city_words+=words(await text('#city-return'));t.ui_bot_ms+=TICK;await click('#city-close');continue;}
  if(await p.isVisible('#choice')){
   const id=await p.getAttribute('#choice','data-choice-id');{const t=T(lastStep);t.choices++;t.choice_words+=words(await text('#choice'));t.ui_bot_ms+=TICK;}const picks={a:{promise_trust:0,promise_accept:0,rooftop_glass:0,rooftop_ask:1,chalk_route:0,below_heat:0,archive_eve:0,line_wait:0,hand:0},b:{promise_trust:2,promise_accept:1,rooftop_glass:1,rooftop_ask:0,chalk_route:1,below_heat:1,archive_eve:1,line_wait:1,hand:1},c:{promise_trust:1,promise_accept:0,rooftop_glass:1,rooftop_ask:1,chalk_route:1,below_heat:1,archive_eve:0,line_wait:0,hand:0}}[strategy];choices.push(id);await keys(new Set());await p.locator('#choice-options button').nth(picks[id]??0).click();continue;
  }
  if(await p.isVisible('#hold')){T(lastStep).action.hold+=1500+TICK;await keys(new Set());const box=await p.locator('#hold-button').boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.waitForTimeout(1500);await p.mouse.up();continue;}
  if(await p.isVisible('#hub-panel')){
   {const h=hubTiming[lastHub||'?']??={ms:0,panels:0,panel_words:0,by_activity:{}};h.panels++;h.panel_words+=words(await text('#hub-panel'));h.ui_bot_ms=(h.ui_bot_ms||0)+TICK;}
   await keys(new Set());const action=desiredAction&&p.locator('#hub-options button[data-action="'+desiredAction+'"]');
   if(action&&await action.count()){await action.click();hubChecks.push(desiredAction);}else await p.locator('#hub-options button').last().click();desiredAction=null;continue;
  }
  if(await p.isVisible('#result')){{const t=T(lastStep);t.results++;t.result_words+=words(await text('#result'));t.ui_bot_ms+=TICK;if(await p.isVisible('#retry'))t.retries++;}if(await p.isVisible('#retry')){await click('#retry');policy=makePolicy({reaction:.3,dodgeRate:.7,seed:19});}else if(await p.isVisible('#power'))await click(strategy==='b'?'#shield':'#power');else await click('#next');continue;}
  if(st.paused){T(lastStep).ui_bot_ms+=TICK;await click('#resume');continue;}
  if(!st.running||st.uiLock){T(lastStep).passive_ms+=TICK;await keys(new Set());continue;}
  const s=await p.evaluate(()=>window.cityAdventure.snapshot());
  if(st.mode==='hub'){
   const progress=await p.evaluate(()=>window.cityAdventure.progress()),h=HUBS[s.hub],w=progress.world;
   let point,job=h.jobs.find(j=>w.quests[j.id]?.status!=='complete');
   if(job){const q=w.quests[job.id];if(!q||q.targets.length===job.targets.length){point=s.points.find(pt=>pt.id==='board');desiredAction='job:'+job.id;}else point=s.points.find(pt=>pt.id===job.targets.find(t=>!q.targets.includes(t)));}
   else if(['toxic','clockwork'].includes(s.hub)&&!w.preparation[s.hub]){point=s.points.find(pt=>pt.id==='smith');desiredAction='buy:'+s.hub+(strategy==='b'?'_defense':'_attack');}
   else if(!w.secrets.includes(s.hub)){point=s.points.find(pt=>pt.id==='secret');}
   else if(!w.inventory[strategy==='b'?'vest':'coil']&&w.coins>=40){point=s.points.find(pt=>pt.id==='smith');desiredAction='buy:'+(strategy==='b'?'vest':'coil');}
   else point=s.points.find(pt=>pt.id==='exit');
   {lastHub=s.hub;const act=job?'job:'+job.id:desiredAction?.startsWith('buy:'+s.hub)?'preparation':point?.id==='secret'?'secret':desiredAction?'shop':'exit';const h=hubTiming[s.hub]??={ms:0,panels:0,panel_words:0,by_activity:{}};h.ms+=TICK;h.by_activity[act]=(h.by_activity[act]||0)+TICK;}
   const want=walk(s,point);if(!want.size)want.add('KeyE');await keys(want);
  }else if(st.mode==='openingWalk'){T(lastStep).action.openingWalk+=TICK;const t={x:480,y:1120},want=walk(s,t);if(!want.size)want.add('KeyE');await keys(want);}
  else if(st.mode==='escape'){T(lastStep).action.escape+=TICK;await keys(walk(s,s.goal,20));}
  else if(st.mode==='foot'){T(lastStep).action.foot+=TICK;
   const i=policy(s),want=new Set();for(const [yes,k]of [[i.x>.08,'KeyD'],[i.x<-.08,'KeyA'],[i.y>.08,'KeyS'],[i.y<-.08,'KeyW'],[i.gun,'KeyJ'],[i.magic,'KeyL'],[i.dash,'ShiftLeft'],[i.duo,'KeyQ'],[i.interact,'KeyE']])if(yes)want.add(k);await keys(want);
  }else if(st.mode==='drive'){T(lastStep).action.drive+=TICK;
   await keys(require('./campaign-driving-policy.cjs')(s.driving));
  }
 }
 await keys(new Set());assert.ok(completed,'campaign reached postcredits ending');const progress=await p.evaluate(()=>window.cityAdventure.progress());
 assert.ok(progress.narrative.flags.story_complete&&progress.narrative.flags.postcredits_seen);assert.equal(Object.values(progress.world.quests).filter(q=>q.status==='complete').length,8);assert.equal(Object.keys(progress.world.preparation).length,2);assert.ok(progress.narrative.flags.broken_clock_fragment);assert.equal(progress.narrative.flags.channel_called,undefined);
 assert.equal(progress.narrative.flags['exp.chalk.route'],strategy==='a'?'direct':'service');assert.equal(progress.narrative.flags['exp.chalk.completed'],true);assert.equal(progress.narrative.flags['exp.chalk.callback_seen'],true);
 await p.screenshot({path:path.join(out,'ending.png')});assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({strategy,environment:metadata,elapsedMs:Date.now()-start,timing:virtualTime?'accelerated browser clock; not human duration or FPS':'wall clock',steps,choices,hubChecks,playtime:{tick_ms:TICK,clock:virtualTime?'virtual':'wall',per_step:timing,hubs:hubTiming},progress,errors,uiRaces,locale:await p.evaluate(()=>window.cityAdventure.locale?.())},null,2));console.log('PASS',steps.length,'steps, 8 errands, 2 preparations, complete ending');
 }catch(e){
  // Save the original error even if the page or renderer has already crashed.
  const diagnostic={message:e.message,environment:metadata,elapsedMs:Date.now()-start,held:[...held],steps,choices,hubChecks,errors};
  fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify(diagnostic,null,2));
  for(const [key,fn]of [['status',()=>p.evaluate(()=>window.cityAdventure?.status())],['snapshot',()=>p.evaluate(()=>window.cityAdventure?.snapshot())],['progress',()=>p.evaluate(()=>window.cityAdventure?.progress())]]){try{diagnostic[key]=await Promise.race([fn(),new Promise((_,reject)=>{const t=setTimeout(()=>reject(Error('diagnostic timeout')),3000);t.unref();})]);}catch(failure){diagnostic[key]={unavailable:failure.message};}}
  fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify(diagnostic,null,2));
  try{await p.screenshot({path:path.join(out,'failure.png'),timeout:5000});}catch{}
  throw e;
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
