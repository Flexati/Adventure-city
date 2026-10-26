// Release-flow proof in the real runtime, through ordinary inputs only:
// a boss is reached, its checkpoint is saved, the hero falls, the defeat explains why, a retry and
// a page reload both resume at the boss, and the player wins with the last hit.
// Optional CITY_VIRTUAL_TIME=1 advances the browser clock; never use it for FPS or human duration evidence.
// Usage: node tools/verify_release_flow.cjs <url> <outDir> [stepId=finale] [width=390] [height=844]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('fs'),path=require('path');
const [url='http://127.0.0.1:8090/index.html',out='release-flow',stepId='finale',W='390',H='844']=process.argv.slice(2);
const virtualTime=process.env.CITY_VIRTUAL_TIME==='1';
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const {makePolicy}=await import(path.resolve(__dirname,'../tests/helpers/autoplay.mjs'));
 const {CAMPAIGN,newProgress,saveProgress}=await import(path.resolve(__dirname,'../game/missions.mjs'));
 const step=CAMPAIGN.findIndex(s=>s.id===stepId);if(step<0)throw new Error('Unknown step '+stepId);
 const p=newProgress();p.step=step;p.world.preparation={toxic:'attack',clockwork:'attack'};p.cityChoice='shelter';Object.assign(p.narrative.flags,{blackout_choice:'shelter',line_choice:'stay',eve_kept:true,channel_called:false,
  // Saves past Blackout carry the Rook, Tessa and Chalk flags; without them the v7 recovery replays Rook first.
  'encounter.rook.completed':true,'weapon.tessa':true,'weapon.quickdraw':true,'exp.chalk.completed':true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const ctx=await browser.newContext({viewport:{width:+W,height:+H},deviceScaleFactor:1,hasTouch:true});
 await ctx.addInitScript(raw=>{try{sessionStorage.setItem('city-studio-shown','1');if(!localStorage.getItem('city-adventure-progress-v7'))localStorage.setItem('city-adventure-progress-v7',raw);}catch{}},saveProgress(p));
 const page=await ctx.newPage();const errors=[],checks=[],occlusion={samples:0,underControls:0,underHud:0,worstFeet:0,controlsTop:null};
 page.on('pageerror',e=>errors.push(e.message));
 if(virtualTime){await page.clock.install();page.waitForTimeout=ms=>page.clock.runFor(ms);}
 const check=(name,ok,detail)=>{checks.push({name,ok:!!ok,detail});console.log(ok?'PASS':'FAIL',name,detail??'');};
 const shot=name=>page.screenshot({path:path.join(out,name+'.png')});
 let held=new Set();
 async function setKeys(want){for(const k of [...held])if(!want.has(k)){await page.keyboard.up(k);held.delete(k);}for(const k of want)if(!held.has(k)){await page.keyboard.down(k);held.add(k);}}
 async function boot(){await page.goto(url);await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu'&&window.cityAdventure.status().loaded,null,{timeout:30000});await page.click('#continue');}
 async function settle(){for(let k=0;k<200;k++){if(virtualTime)await page.clock.runFor(100);
   if(await page.isVisible('#card')){await page.click('#card');continue;}
   if(await page.isVisible('#talk')){await page.click('#next-line');continue;}
   const st=await page.evaluate(()=>window.cityAdventure.status());if(st.mode==='foot'&&st.running&&!st.uiLock)return st;await page.waitForTimeout(60);}
  throw new Error('Mission did not start');}
 // Drive the hero with the deterministic policy until a condition; 'idle' keeps the hands off the controls.
 async function play(until,{idle=false,limit=4000}={}){const policy=makePolicy({reaction:.3,dodgeRate:.6,seed:5});
  for(let k=0;k<limit;k++){if(virtualTime)await page.clock.runFor(100);
   if(await page.isVisible('#talk')){await setKeys(new Set());await page.click('#next-line');continue;}if(await page.isVisible('#hold')){await setKeys(new Set());const box=await page.locator('#hold-button').boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(900);await page.mouse.up();continue;}
   const st=await page.evaluate(()=>window.cityAdventure.status());const snap=await page.evaluate(()=>window.cityAdventure.snapshot());
   const done=await until(st,snap);if(done){await setKeys(new Set());return done;}
   if(st.mode==='foot'&&snap.mode==='foot'&&st.running&&!st.uiLock&&!st.paused){
    const view=await page.evaluate(()=>{const v=window.cityAdventure.view(),c=document.getElementById('controls').getBoundingClientRect(),h=document.getElementById('hud').getBoundingClientRect();return {...v,controlsTop:c.top,hudBottom:h.bottom};});
    const feet=(snap.y-view.y)*view.scale,head=feet-112*view.scale;occlusion.samples++;occlusion.controlsTop=view.controlsTop;occlusion.worstFeet=Math.max(occlusion.worstFeet,feet);
    if(feet>view.controlsTop)occlusion.underControls++;if(head<view.hudBottom-1)occlusion.underHud++;
    if(idle){await setKeys(new Set());continue;}
    const inp=policy(snap),want=new Set();
    if(inp.x>.3)want.add('KeyD');if(inp.x<-.3)want.add('KeyA');if(inp.y>.3)want.add('KeyS');if(inp.y<-.3)want.add('KeyW');
    if(inp.gun)want.add('KeyJ');if(inp.magic)want.add('KeyL');if(inp.dash)want.add('ShiftLeft');if(inp.duo)want.add('KeyQ');if(inp.interact)want.add('KeyE');
    await setKeys(want);
   }else{if(await page.isVisible('#talk'))await page.click('#next-line');else if(await page.isVisible('#choice'))await page.click('#choice-options button');await setKeys(new Set());await page.waitForTimeout(60);}
  }
  const snap=await page.evaluate(()=>window.cityAdventure.snapshot());throw new Error('Condition not reached: '+JSON.stringify({hp:snap.hp,status:snap.status,time:snap.time,boss:snap.enemies?.filter(e=>e.boss).map(e=>({hp:e.hp,state:e.state,guard:e.guard}))}));}

 await boot();await page.waitForSelector('#card:not([hidden])');if(virtualTime)await page.clock.runFor(700);else await page.waitForTimeout(700);
 const card=await page.evaluate(()=>({goal:document.getElementById('card-goal').textContent,meta:document.getElementById('card-meta').textContent,title:document.getElementById('card-title').textContent}));
 await shot('01-card');
 check('card states goal, step and save',card.goal.length>12&&new RegExp('Tappa \\d+/'+CAMPAIGN.length+' · ✓ Progressi salvati').test(card.meta)&&!/^\d/.test(card.title),card);
 await settle();
 const objective=await page.textContent('#objective');check('HUD objective is a verb with progress',/^[A-Z][a-zà-ù]+ (i|le|gli) .+ 0\/3/.test(objective),objective);
 await shot('02-play-start');
 const woke=await play(async(st,snap)=>snap.enemies?.some(e=>e.boss&&e.state!=='dormant')&&snap);
 await page.waitForTimeout(400);
 const cp=await page.evaluate(()=>window.cityAdventure.progress());check('boss wake saves the checkpoint',cp.checkpoint==='boss',{checkpoint:cp.checkpoint});
 check('boss wake notice tells the player',/Checkpoint salvato/.test(await page.textContent('#notice')),await page.textContent('#notice'));
 await shot('03-boss-awake');
 // Hands off: the hero stands still until the boss lands its hits.
 await play(async()=>await page.isVisible('#retry'),{idle:true,limit:6000});
 const result=await page.evaluate(()=>({text:document.getElementById('result-text').textContent,tip:document.getElementById('result-tip').hidden?'':document.getElementById('result-tip').textContent}));
 await shot('04-defeat-tip');
 check('defeat names the restart point',/Riparti dallo scontro con/.test(result.text),result.text);
 check('defeat explains the last hit',result.tip.length>20,result.tip);
 await page.click('#retry');await settle();
 const retry=await page.evaluate(()=>window.cityAdventure.snapshot());
 check('retry resumes at the boss with devices on and full health',retry.nodes.every(n=>n.on)&&retry.enemies.length===1&&retry.enemies[0].boss&&retry.enemies[0].state!=='dormant'&&retry.hp===retry.maxHp,{nodes:retry.nodes.map(n=>n.on),enemies:retry.enemies.map(e=>e.role+':'+e.state),hp:retry.hp});
 await shot('05-retry-at-boss');
 // The checkpoint also survives closing the app: reload and continue from the menu.
 await boot();await settle();
 const reload=await page.evaluate(()=>({snap:window.cityAdventure.snapshot(),notice:document.getElementById('notice').textContent}));
 check('reload + Continue resumes at the boss',reload.snap.nodes.every(n=>n.on)&&reload.snap.enemies.every(e=>e.boss)&&reload.snap.enemies[0].state!=='dormant',{enemies:reload.snap.enemies.map(e=>e.role+':'+e.state),notice:reload.notice});
 let retries=0;
 await play(async()=>{if(await page.isVisible('#retry')){retries++;await page.click('#retry');await settle();return false;}return await page.isVisible('#result');},{limit:12000});
 check('boss beaten through ordinary inputs',retries<=3,{retriesAfterReload:retries});
 await shot('06-victory');
 const after=await page.evaluate(()=>window.cityAdventure.progress());
 check('victory clears the checkpoint',after.checkpoint===null&&(after.status==='cleared'),{checkpoint:after.checkpoint,status:after.status});
 check('hero never drawn under the touch controls',occlusion.underControls===0,occlusion);
 check('hero head never under the HUD',occlusion.underHud===0,{underHud:occlusion.underHud,samples:occlusion.samples});
 check('no page errors',errors.length===0,errors);
 const report={url,step:stepId,viewport:[+W,+H],timing:virtualTime?'accelerated browser clock; not duration or FPS evidence':'wall clock',card,objective,result,occlusion,checks,errors};
 fs.writeFileSync(path.join(out,'release-flow.json'),JSON.stringify(report,null,1));
 await browser.close();process.exit(checks.every(c=>c.ok)?0:1);
})().catch(e=>{console.error(e);process.exit(1);});
