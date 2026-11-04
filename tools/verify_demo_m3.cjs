// M3 (D20, D22) in Chromium: demo end after «La firma» with a simulated purchase bridge, the same save without the bridge,
// and «Gioca l'altra rotta» from the ending. The bridge is a stub: this is not Play Billing evidence (that is M4, on a phone).
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const [url='http://127.0.0.1:8090/game/',out]=process.argv.slice(2);
if(!out){console.error('Usage: node tools/verify_demo_m3.cjs <url> <out.json> (the output goes outside the repo)');process.exit(2);}
const KEY='city-adventure-progress-v7';
(async()=>{
 const {makeSave}=require('./qa_v8.cjs'),{CAMPAIGN}=await import('../game/missions.mjs');
 const after=CAMPAIGN[CAMPAIGN.findIndex(s=>s.id==='separation')+1].id;
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),checks=[],errors=[];
 const page=async(bridge,raw)=>{const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
  if(bridge)await c.addInitScript(()=>{window.ChronosBilling={unlocked:false,buys:0,isUnlocked(){return this.unlocked;},price(){return '5,99 €';},purchase(){this.buys++;setTimeout(()=>{this.unlocked=true;window.chronosBillingResult(true);},60);}};});
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(url);
  await p.evaluate(([k,raw])=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem(k,raw);},[KEY,raw]);
  await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');return {c,p};};
 const inView=async(p,sel)=>{const b=await p.locator(sel).boundingBox();assert.ok(b&&b.x>=0&&b.y>=0&&b.x+b.width<=390&&b.y+b.height<=844,sel+' inside 390x844');assert.ok(b.height>=44,sel+' touch target >= 44 px');};
 try{
  const raw=await makeSave(after);
  // 1. With the bridge and no purchase: Continue opens the unlock screen, «Più tardi» returns to the menu, the screen comes back.
  let {c,p}=await page(true,raw);
  assert.equal(await p.isVisible('#menu-unlock'),true);
  await p.click('#continue');await p.waitForSelector('#unlock:not([hidden])');
  assert.equal(await p.textContent('#unlock-price'),'5,99 €');assert.equal((await p.evaluate(()=>window.cityAdventure.status())).running,false);
  for(const s of ['#unlock-buy','#unlock-later'])await inView(p,s);
  checks.push({id:'demo-gate-after-la-firma',result:'PASS',step:after});
  await p.click('#unlock-later');await p.waitForSelector('#menu:not([hidden])');assert.equal(await p.isHidden('#unlock'),true);
  await p.click('#continue');await p.waitForSelector('#unlock:not([hidden])');
  checks.push({id:'later-returns-to-menu-and-screen-returns',result:'PASS'});
  // 2. Purchase: the shell answers, the screen closes and the step starts; the save is the same.
  await p.click('#unlock-buy');await p.waitForSelector('#unlock',{state:'hidden'});
  await p.waitForFunction(()=>window.cityAdventure.status().mode!=='menu');
  assert.equal((await p.evaluate(()=>window.cityAdventure.progress())).stepId,after);assert.equal(await p.evaluate(()=>window.ChronosBilling.buys),1);
  checks.push({id:'purchase-enters-the-next-step',result:'PASS'});await c.close();
  // 3. Without the bridge (web, debug builds, anything before M4): the same save plays on, no screen, no menu entry.
  ({c,p}=await page(false,raw));assert.equal(await p.isVisible('#menu-unlock'),false);
  await p.click('#continue');await p.waitForFunction(()=>window.cityAdventure.status().mode!=='menu');assert.equal(await p.isHidden('#unlock'),true);
  checks.push({id:'no-bridge-full-game',result:'PASS'});await c.close();
  // 4. «Gioca l'altra rotta»: only the options taken, then a new game that keeps weapons and upgrades.
  const done=JSON.parse(await makeSave('postcredits',{status:'cleared'}));done.upgrade='shield';done.narrative.choices={blackout_power:'workshop',promise_trust:'honest',hand:'take'};done.narrative.flags['weapon.quickdraw']=true;
  ({c,p}=await page(false,JSON.stringify(done)));await p.click('#continue');
  for(let k=0;k<80&&!(await p.isVisible('#ending'));k++){if(await p.isVisible('#card'))await p.click('#card');else if(await p.isVisible('#talk'))await p.click('#next-line');else await p.waitForTimeout(100);}
  await p.waitForSelector('#ending:not([hidden])');await p.click('#ending-replay');await p.waitForSelector('#replay:not([hidden])');
  const log=await p.$$eval('#replay-log li',l=>l.map(li=>li.textContent));assert.equal(log.length,3);assert.ok(log[2].includes('Prendila'));assert.ok(!log.join('').includes('Resta accanto a lei'),'no option not taken');
  for(const s of ['#replay-start','#replay-cancel'])await inView(p,s);
  await p.click('#replay-start');await p.waitForFunction(()=>window.cityAdventure.status().mode!=='ending');
  const np=await p.evaluate(()=>window.cityAdventure.progress());
  assert.equal(np.stepId,CAMPAIGN[0].id);assert.equal(np.upgrade,'shield');assert.equal(np.narrative.flags['weapon.quickdraw'],true);assert.equal(np.narrative.flags['weapon.tessa'],true);assert.equal(np.narrative.flags.replay_route,true);assert.deepEqual(np.narrative.choices,{});
  checks.push({id:'replay-route-keeps-kit',result:'PASS',choicesShown:log.length});await c.close();
  assert.deepEqual(errors,[]);
  fs.writeFileSync(out,JSON.stringify({ok:true,checks,errors},null,1));console.log('M3 demo and replay PASS · '+checks.length+' checks');
 }catch(e){fs.writeFileSync(out,JSON.stringify({ok:false,checks,errors,failure:String(e.stack||e)},null,1));console.error(e);process.exitCode=1;}
 finally{await browser.close();}
})();
