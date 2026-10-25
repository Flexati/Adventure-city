// A real-UI continuation of a pre-expansion v7 checkpoint; the fixture is only the old save.
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const out=process.argv[2]||'/tmp/chronos-chalk-migration';
(async()=>{
 const {newProgress,saveProgress,stepIndex}=await import('../game/missions.mjs');
 const {progressChecksum}=await import('../game/progress-store.mjs');
 const {makePolicy}=await import('../tests/helpers/autoplay.mjs');
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const cases=[];
 try{for(const target of ['archive','toxic']){
  const p=newProgress();p.step=stepIndex(target);p.narrative.flags.separated=true;
  if(target==='archive'){p.checkpoint='boss';p.world.preparation.toxic='attack';}
  else{p.world.visited.push('toxic');p.world.hub={id:'toxic',reason:'campaign',pov:'nox',returnStep:p.step-1,x:800,y:864};}
  const data=JSON.parse(saveProgress(p));delete data.catchup;
  data.integrity={algorithm:'fnv1a32-utf16',checksum:progressChecksum(JSON.stringify(data))};
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});await page.clock.install();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()} ${r.url()}`);});
  await page.addInitScript(raw=>localStorage.setItem('city-adventure-progress-v7',raw),JSON.stringify(data));
  await page.goto('http://127.0.0.1:8090/game/');await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu');
  await page.click('#continue');const policy=makePolicy({reaction:.3,dodgeRate:.65,seed:7});let held=new Set(),done=false;
  const keys=async want=>{for(const key of held)if(!want.has(key))await page.keyboard.up(key);for(const key of want)if(!held.has(key))await page.keyboard.down(key);held=want;};
  const started=Date.now();
  for(let guard=0;guard<16000;guard++){
   if(Date.now()-started>180000)throw Error(`Timeout continuing old ${target} save`);
   await page.clock.runFor(130);const st=await page.evaluate(()=>window.cityAdventure.status());
   if(errors.length)throw Error(errors.join('; '));
   if(st.step===target&&st.mode===(target==='toxic'?'hub':'foot')&&st.running){done=true;break;}
   if(await page.isVisible('#card')){await keys(new Set());await page.click('#card',{force:true});continue;}
   if(await page.isVisible('#talk')){await keys(new Set());await page.click('#next-line',{force:true});continue;}
   if(await page.isVisible('#choice')){await keys(new Set());await page.locator('#choice-options button').first().click();continue;}
   if(await page.isVisible('#result')){await keys(new Set());if(await page.isVisible('#power'))await page.click('#power');else await page.click('#next');continue;}
   if(st.step==='exp_chalk_marks'&&st.mode==='foot'&&st.running){const s=await page.evaluate(()=>window.cityAdventure.snapshot()),input=policy(s),want=new Set();for(const [yes,key]of [[input.x>.3,'KeyD'],[input.x<-.3,'KeyA'],[input.y>.3,'KeyS'],[input.y<-.3,'KeyW'],[input.gun,'KeyJ'],[input.magic,'KeyL'],[input.dash,'ShiftLeft'],[input.duo,'KeyQ'],[input.interact,'KeyE']])if(yes)want.add(key);await keys(want);}else await keys(new Set());
  }
  await keys(new Set());assert.ok(done,`${target} restored`);
  const progress=await page.evaluate(()=>window.cityAdventure.progress());
  assert.equal(progress.stepId,target);assert.equal(progress.catchup,null);assert.equal(progress.narrative.flags['exp.chalk.route'],'direct');
  assert.equal(progress.narrative.flags['exp.chalk.completed'],true);assert.equal(progress.narrative.flags['exp.chalk.callback_seen'],true);
  assert.equal(progress.world.rewards.filter(id=>id==='exp_chalk_marks').length,1);
  if(target==='archive'){assert.equal(progress.checkpoint,'boss');const toast=await page.locator('#notice').boundingBox(),boss=await page.locator('#bossbar').boundingBox(),bag=await page.locator('#bag').boundingBox();assert.ok(toast.y>=boss.y+boss.height,'checkpoint notice clears boss health');assert.ok(toast.x+toast.width<=bag.x,'checkpoint notice clears inventory button');}
  else{assert.equal(progress.world.hub.id,'toxic');assert.equal(progress.world.hub.returnStep,stepIndex('toxic'));}
  await page.screenshot({path:`${out}/${target}-restored.png`});cases.push({target,stepId:progress.stepId,checkpoint:progress.checkpoint,hub:progress.world.hub,coins:progress.world.coins,errors});await page.close();
 }
 fs.writeFileSync(`${out}/report.json`,JSON.stringify({fixture:'pre-expansion v7 checkpoints, supplied before page load',input:'real UI and keyboard',cases},null,2)+'\n');
 console.log('PASS two v7 catch-up continuations: archive boss and toxic hub');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
