// M-I1 interiors: real taps on #interact, the scene in both orientations, shop, ask, errand, leave, English.
const {chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');
const [url='http://127.0.0.1:8080/game/',outDir='docs/evidence/v10.3/interiors']=process.argv.slice(2);
(async()=>{
 const {makeSave}=require('./qa_v8.cjs'),{stepIndex}=await import('../game/missions.mjs'),{hubPoints}=await import('../game/hubs.mjs');
 fs.mkdirSync(outDir,{recursive:true});
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium'}),report={checked_at:new Date().toISOString(),cases:[]};
 for(const [w,h] of [[390,844],[844,390]])for(const lang of ['it','en'])for(const [hub,pointId] of [['moon','smith'],['moon','inn'],['moon','child'],['cathedral','relic']]){
  const p=await b.newPage({viewport:{width:w,height:h},hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  const raw=JSON.parse(await makeSave(hub));Object.assign(raw.narrative.flags,{separated:false,reunited:false,'encounter.rook.completed':true,'weapon.tessa':true});const pt=hubPoints(hub).find(q=>q.id===pointId);raw.world.hub={id:hub,pov:'nox',reason:'campaign',returnStep:stepIndex(hub),x:pt.x,y:pt.y};raw.world.coins=200;
  await p.goto(url);await p.evaluate(({raw,lang})=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-adventure-progress-v7',JSON.stringify(raw));localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:true,language:lang}));},{raw,lang});await p.reload();
  await p.waitForFunction(()=>window.cityAdventure?.status().mode==='menu'&&window.cityAdventure.status().loaded);await p.click('#continue');for(let i=0;i<20&&await p.evaluate(()=>window.cityAdventure.status().mode!=='hub');i++){if(await p.isVisible('#card'))await p.click('#card');else if(await p.isVisible('#talk'))await p.click('#next-line');await p.waitForTimeout(400);}await p.waitForFunction(()=>window.cityAdventure.status().mode==='hub'&&window.cityAdventure.status().running);
  await p.waitForSelector('#interact',{state:'visible'});await p.click('#interact');await p.waitForSelector('#interior',{state:'visible'});
  const c={hub,point:pointId,size:`${w}x${h}`,lang,steps:[]};
  const fits=async()=>p.evaluate(()=>[...document.querySelectorAll('#interior-options button,#interior-line,.interior-plate')].every(e=>{const r=e.getBoundingClientRect();return r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1&&r.width>0;}));
  assert.ok(await fits(),'layout fits '+JSON.stringify(c));c.name=await p.textContent('#interior-name');c.greeting=await p.textContent('#interior-line');
  await p.screenshot({path:`${outDir}/${hub}_${pointId}_${w}x${h}_${lang}.png`});
  if(await p.locator('[data-action="ask"]').count()){const before=c.greeting;await p.click('[data-action="ask"]');c.ask=await p.textContent('#interior-line');assert.notEqual(c.ask,before);c.steps.push('ask');}
  if(await p.locator('[data-action="shop"]').count()){await p.click('[data-action="shop"]');const buy=p.locator('#interior-options [data-action^="buy:"]').first();if(await buy.count()){const coins=(await p.evaluate(()=>window.cityAdventure.progress())).world.coins;await buy.click();await p.waitForTimeout(150);const after=(await p.evaluate(()=>window.cityAdventure.progress())).world.coins;c.bought=coins-after;assert.ok(after<coins,'purchase spends coins');}
   assert.ok(await fits(),'shop fits');await p.screenshot({path:`${outDir}/${hub}_${pointId}_${w}x${h}_${lang}_shop.png`});await p.click('[data-action="back"]');c.steps.push('shop');}
  const job=p.locator('#interior-options [data-action^="job:"]');if(await job.count()){await job.click();const q=(await p.evaluate(()=>window.cityAdventure.progress())).world.quests;c.job=Object.keys(q);assert.ok(Object.keys(q).length>0,'errand accepted in person');c.steps.push('job');}
  await p.click('[data-action="leave"]');await p.waitForSelector('#interior',{state:'hidden'});await p.waitForTimeout(100);
  const st=await p.evaluate(()=>({mode:window.cityAdventure.status().mode,running:window.cityAdventure.status().running,untranslated:window.cityAdventure.locale().untranslated}));
  assert.equal(st.mode,'hub');if(lang==='en')c.untranslated=st.untranslated;
  c.errors=errors;assert.deepEqual(errors,[]);report.cases.push(c);await p.close();
 }
 const missing=[...new Set(report.cases.flatMap(c=>c.untranslated||[]))];report.untranslated=missing;
 fs.writeFileSync(`${outDir}/interiors-browser.json`,JSON.stringify(report,null,1)+'\n');console.log(JSON.stringify({cases:report.cases.length,untranslated:missing}));await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
