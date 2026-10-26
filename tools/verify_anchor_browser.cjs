// The Anchor in the real Breach, through ordinary inputs: explicit save at the Breach step, keyboard
// play by the deterministic campaign pilot until the anchors close and the boss wakes, then the fight.
// Checks: teaching notice, shield and lines drawn, sweep telegraph before its hit, exposure windows,
// boss checkpoint on reload, victory flags and the first H-17 component saved. Browser only.
// Usage: node tools/verify_anchor_browser.cjs [url] [outDir] [width=390] [height=844]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/v10.2',W='390',H='844']=process.argv.slice(2);
(async()=>{
 const {newProgress,stepIndex,saveProgress}=await import('../game/missions.mjs'),{makePolicy}=await import('../tests/helpers/autoplay.mjs');
 fs.mkdirSync(out,{recursive:true});const tag=`${W}x${H}`,checks=[],errors=[],shots=[],events={};let failed=false;
 const check=(name,ok,detail)=>{checks.push({name,ok:!!ok,detail});if(!ok)failed=true;console.log(ok?'PASS':'FAIL',name,detail===undefined?'':JSON.stringify(detail).slice(0,240));};
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 try{
  const c=await b.newContext({viewport:{width:+W,height:+H},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
  const s=newProgress();s.step=stepIndex('breach');s.cityChoice='workshop';s.world.visited=['moon'];Object.assign(s.narrative.flags,{'encounter.rook.completed':true,'weapon.tessa':true,'weapon.quickdraw':true,blackout_choice:'workshop'});
  await c.addInitScript(raw=>{try{if(!localStorage.getItem('city-adventure-progress-v7'))localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-v4-settings',JSON.stringify({sound:true,reduced:false}));sessionStorage.setItem('city-studio-shown','1');}catch{}},saveProgress(s));
  await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
  let held=new Set(),policy=makePolicy({reaction:.3,dodgeRate:.7,seed:3}),reloaded=false,notices=[];
  const keys=async want=>{for(const k of held)if(!want.has(k))await p.keyboard.up(k);for(const k of want)if(!held.has(k))await p.keyboard.down(k);held=want;};
  const deadline=Date.now()+240000;let won=false,retries=0;
  while(Date.now()<deadline){
   await p.waitForTimeout(35);
   if(await p.isVisible('#card')){await keys(new Set());await p.click('#card');continue;}
   if(await p.isVisible('#talk')){await keys(new Set());await p.click('#next-line');continue;}
   if(await p.isVisible('#result')){await keys(new Set());if(await p.isVisible('#retry')){retries++;await p.click('#retry');continue;}won=true;break;}
   const st=await p.evaluate(()=>cityAdventure.status());if(!st.running||st.uiLock){await keys(new Set());continue;}
   const snap=await p.evaluate(()=>cityAdventure.snapshot());if(snap.mode!=='foot')continue;
   const n=await p.locator('#notice').innerText().catch(()=>'');if(n&&!notices.includes(n))notices.push(n);
   const core=snap.enemies.find(e=>e.bossKind==='anchor'),moors=snap.enemies.filter(e=>e.role==='moor');
   if(core&&core.state!=='dormant'){
    for(const k of ['moored','sweep','exposed']){const ok=k==='moored'?moors.length===3&&moors.every(m=>m.hp>0):k==='sweep'?core.state==='anchorSweep'&&core.clock>core.windup*.4&&Math.hypot(snap.x-core.x,snap.y-core.y)<420:core.exposed&&core.hp>0;
     if(ok&&!shots.includes(k)){shots.push(k);await p.screenshot({path:path.join(out,`anchor-${tag}-${k}.png`)});events[k]=true;}}
    if(!reloaded&&core.hp<core.max*.8){reloaded=true;await keys(new Set());events.hpBeforeReload=core.hp;await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
     for(let i=0;i<200;i++){if(await p.isVisible('#card'))await p.click('#card');else if(await p.isVisible('#talk'))await p.click('#next-line');else if((await p.evaluate(()=>cityAdventure.status())).running)break;else await p.waitForTimeout(50);}
     const r=await p.evaluate(()=>{const s=cityAdventure.snapshot();const core=s.enemies.find(e=>e.bossKind==='anchor');return {core:core&&{state:core.state,hp:core.hp,max:core.max},nodes:s.nodes.map(n=>n.on),checkpoint:cityAdventure.progress().checkpoint};});
     events.afterReload=r;continue;}
   }
   const i=policy(snap),want=new Set();for(const [yes,k]of [[i.x>.08,'KeyD'],[i.x<-.08,'KeyA'],[i.y>.08,'KeyS'],[i.y<-.08,'KeyW'],[i.gun,'KeyJ'],[i.magic,'KeyL'],[i.dash,'ShiftLeft'],[i.duo,'KeyQ'],[i.interact,'KeyE']])if(yes)want.add(k);await keys(want);
  }
  await keys(new Set());
  check('teaching notice names the lines, the Resonance and the core',notices.some(t=>/tre cime/.test(t)&&/Risonanza/.test(t)),notices.slice(-4));
  check('boss wakes moored by three lines',events.moored);
  check('sweep lane telegraphed before it lands',events.sweep);
  check('core exposed after cutting every line',events.exposed);
  check('reload resumes at The Anchor checkpoint with anchors closed',events.afterReload?.checkpoint==='boss'&&events.afterReload.nodes.every(Boolean)&&events.afterReload.core?.state!=='dormant',events.afterReload);
  check('The Anchor defeated through ordinary inputs',won,{retries});
  if(won)await p.screenshot({path:path.join(out,`anchor-${tag}-victory.png`)});
  const f=await p.evaluate(()=>JSON.parse(localStorage.getItem('city-adventure-progress-v7')).narrative.flags);
  check('victory and first H-17 component saved',f['encounter.anchor.completed']===true&&f['weapon.anchor_component']===true,{anchor:f['encounter.anchor.completed'],component:f['weapon.anchor_component']});
  check('zero page errors',errors.length===0,errors);
  await c.close();
 }finally{await b.close();}
 const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'..',f))).digest('hex');
 fs.writeFileSync(path.join(out,`anchor-browser-report-${tag}.json`),JSON.stringify({result:failed?'FAIL':'PASS',viewport:[+W,+H],source:Object.fromEntries(['game/campaign.mjs','game/runtime.mjs','game/missions.mjs'].map(f=>[f,sha(f)])),checks,events,screenshots:shots,limits:'Explicit save at the Breach with earlier flags declared; keyboard play by the deterministic campaign pilot (a bot); real browser clock. Prototype procedural forms for The Anchor, not final art. No human, WebView or Android proof.'},null,2));
 console.log(failed?'FAIL':'PASS','anchor browser verification');process.exit(failed?1:0);
})();
