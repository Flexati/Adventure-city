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
 let held=new Set(),policy=makePolicy({reaction:.3,dodgeRate:.65,seed:7}),lastStep=null,desiredAction=null,completed=false;
 const keys=async want=>{for(const k of held)if(!want.has(k))await p.keyboard.up(k);for(const k of want)if(!held.has(k))await p.keyboard.down(k);held=want;};
 const walk=(s,t,stop=24)=>{if(Math.hypot(t.x-s.x,t.y-s.y)<=stop)return new Set();const q=routeWaypoint(getLayout(s.layoutId),s,t),want=new Set();if(q.x-s.x>4)want.add('KeyD');if(q.x-s.x< -4)want.add('KeyA');if(q.y-s.y>4)want.add('KeyS');if(q.y-s.y< -4)want.add('KeyW');return want;};
 const click=async sel=>{await keys(new Set());try{await p.click(sel,{force:true,timeout:3000});}catch(e){
  // The game can finish a timed panel between isVisible and the pointer action.
  // Only tolerate disappearance; a still-visible but unclickable control remains a failure.
  if(await p.isVisible(sel))throw e;uiRaces.push({selector:sel,step:lastStep,message:e.message.split('\n')[0]});
 }};
 const start=Date.now();
 try{await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');await click('#start');
 for(let guard=0;guard<80000;guard++){
  // Check before every branch: a locked UI must not bypass the deadline via continue.
  if(Date.now()-start>deadlineMs)throw Error('Bounded campaign timeout at '+lastStep);
  if(virtualTime)await p.clock.runFor(130);else await p.waitForTimeout(30);
  const st=await p.evaluate(()=>window.cityAdventure.status());if(errors.length)throw Error(errors.join('; '));
  if(guard%100===0)fs.writeFileSync(path.join(out,'live.json'),JSON.stringify({guard,elapsedMs:Date.now()-start,held:[...held],status:st,snapshot:await p.evaluate(()=>window.cityAdventure.snapshot())}));
  if(st.step&&st.step!==lastStep){console.log('STEP',st.step);steps.push(st.step);lastStep=st.step;policy=makePolicy({reaction:.3,dodgeRate:.65,seed:7});await p.screenshot({path:path.join(out,st.step+'.png')});}
  if(await p.isVisible('#ending')){completed=true;break;}
  if(await p.isVisible('#card')){await click('#card');continue;}
  if(await p.isVisible('#opening')){for(const id of ['opening-surface','opening-name','opening-pick'])if(await p.isVisible('#'+id)){await click('#'+id);break;}continue;}
  if(await p.isVisible('#talk')){await click('#next-line');continue;}
  if(await p.isVisible('#city-choice')){await click(strategy==='b'?'#choose-shelter':'#choose-workshop');continue;}
  if(await p.isVisible('#city-return')){await click('#city-close');continue;}
  if(await p.isVisible('#choice')){
   const id=await p.getAttribute('#choice','data-choice-id');const picks={a:{rooftop_glass:0,rooftop_ask:1,below_heat:0,archive_eve:0,line_wait:0,hand:0},b:{rooftop_glass:1,rooftop_ask:0,below_heat:1,archive_eve:1,line_wait:1,hand:1},c:{rooftop_glass:1,rooftop_ask:1,below_heat:1,archive_eve:0,line_wait:0,hand:0}}[strategy];choices.push(id);await keys(new Set());await p.locator('#choice-options button').nth(picks[id]??0).click();continue;
  }
  if(await p.isVisible('#hold')){await keys(new Set());const box=await p.locator('#hold-button').boundingBox();await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();await p.waitForTimeout(1500);await p.mouse.up();continue;}
  if(await p.isVisible('#hub-panel')){
   await keys(new Set());const action=desiredAction&&p.locator('#hub-options button[data-action="'+desiredAction+'"]');
   if(action&&await action.count()){await action.click();hubChecks.push(desiredAction);}else await p.locator('#hub-options button').last().click();desiredAction=null;continue;
  }
  if(await p.isVisible('#result')){if(await p.isVisible('#retry')){await click('#retry');policy=makePolicy({reaction:.3,dodgeRate:.7,seed:19});}else if(await p.isVisible('#power'))await click(strategy==='b'?'#shield':'#power');else await click('#next');continue;}
  if(st.paused){await click('#resume');continue;}
  if(!st.running||st.uiLock){await keys(new Set());continue;}
  const s=await p.evaluate(()=>window.cityAdventure.snapshot());
  if(st.mode==='hub'){
   const progress=await p.evaluate(()=>window.cityAdventure.progress()),h=HUBS[s.hub],w=progress.world;
   let point,job=h.jobs.find(j=>w.quests[j.id]?.status!=='complete');
   if(job){const q=w.quests[job.id];if(!q||q.targets.length===job.targets.length){point=s.points.find(pt=>pt.id==='board');desiredAction='job:'+job.id;}else point=s.points.find(pt=>pt.id===job.targets.find(t=>!q.targets.includes(t)));}
   else if(['toxic','clockwork'].includes(s.hub)&&!w.preparation[s.hub]){point=s.points.find(pt=>pt.id==='smith');desiredAction='buy:'+s.hub+(strategy==='b'?'_defense':'_attack');}
   else if(!w.secrets.includes(s.hub)){point=s.points.find(pt=>pt.id==='secret');}
   else if(!w.inventory[strategy==='b'?'vest':'coil']&&w.coins>=40){point=s.points.find(pt=>pt.id==='smith');desiredAction='buy:'+(strategy==='b'?'vest':'coil');}
   else point=s.points.find(pt=>pt.id==='exit');
   const want=walk(s,point);if(!want.size)want.add('KeyE');await keys(want);
  }else if(st.mode==='openingWalk'){const t={x:480,y:1120},want=walk(s,t);if(!want.size)want.add('KeyE');await keys(want);}
  else if(st.mode==='escape'){await keys(walk(s,s.goal,20));}
  else if(st.mode==='foot'){
   const i=policy(s),want=new Set();for(const [yes,k]of [[i.x>.3,'KeyD'],[i.x<-.3,'KeyA'],[i.y>.3,'KeyS'],[i.y<-.3,'KeyW'],[i.gun,'KeyJ'],[i.magic,'KeyL'],[i.dash,'ShiftLeft'],[i.duo,'KeyQ'],[i.interact,'KeyE']])if(yes)want.add(k);await keys(want);
  }else if(st.mode==='drive'){
   const d=s.driving,stop=d.stops.find(x=>!x.done);let best=null;
   for(const lane of [170,265,360,455,550]){let cost=Math.abs(lane-d.x)/250;if(d.hazards.some(h=>!h.hit&&(d.mode!=='dark'||h.seen||h.at-d.distance<300)&&h.at>d.distance-60&&h.at<d.distance+560&&Math.abs(h.x-lane)<60))cost+=10;if(d.strikes.some(k=>!k.done&&Math.abs(k.x-lane)<62))cost+=8;if(stop&&stop.at-d.distance<1300)cost+=Math.abs(stop.x-lane)/40;if(!best||cost<best.cost)best={lane,cost};}
   const want=new Set();if(best.lane-d.x>14)want.add('KeyD');if(best.lane-d.x< -14)want.add('KeyA');const hold=stop&&d.index===2&&stop.at-d.distance<420&&stop.at-d.distance> -100;
   if(hold){if(d.speed>45)want.add('KeyS');else if(d.speed<30)want.add('KeyW');}else want.add('KeyW');if(d.mode==='dark')want.add('KeyP');await keys(want);
  }
 }
 await keys(new Set());assert.ok(completed,'campaign reached postcredits ending');const progress=await p.evaluate(()=>window.cityAdventure.progress());
 assert.ok(progress.narrative.flags.story_complete&&progress.narrative.flags.postcredits_seen);assert.equal(Object.values(progress.world.quests).filter(q=>q.status==='complete').length,8);assert.equal(Object.keys(progress.world.preparation).length,2);assert.ok(progress.narrative.flags.broken_clock_fragment);assert.equal(progress.narrative.flags.channel_called,undefined);
 await p.screenshot({path:path.join(out,'ending.png')});assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({strategy,environment:metadata,elapsedMs:Date.now()-start,timing:virtualTime?'accelerated browser clock; not human duration or FPS':'wall clock',steps,choices,hubChecks,progress,errors,uiRaces},null,2));console.log('PASS',steps.length,'steps, 8 errands, 2 preparations, complete ending');
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
