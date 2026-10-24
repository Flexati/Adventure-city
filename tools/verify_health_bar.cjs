// Browser evidence for the shared life/integrity HUD. Seeded states are not campaign-completion evidence.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out='artifacts/v9-health-bar']=process.argv.slice(2);

(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()} ${r.url()}`);});
 async function seed(step,change=()=>{}){
  const data=JSON.parse(await qa.makeSave(step));change(data);
  await page.goto(url);await page.evaluate(raw=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:false}));localStorage.setItem('city-adventure-progress-v7',raw);},JSON.stringify(data));
  await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');await page.click('#continue');
  for(let k=0;k<80;k++){
   if(await page.isVisible('#card')){await page.click('#card');continue;}
   if(await page.isVisible('#talk')){await page.click('#next-line');continue;}
   const status=await page.evaluate(()=>window.cityAdventure.status());if(status.running)return status;await page.waitForTimeout(60);
  }
  throw Error(`Seed ${step} did not become playable`);
 }
 const meter=id=>page.$eval(id,el=>({hidden:el.hidden,now:Number(el.getAttribute('aria-valuenow')),max:Number(el.getAttribute('aria-valuemax')),label:el.getAttribute('aria-label'),classes:[...el.classList],fill:parseFloat(el.querySelector('[data-meter-fill]').style.width),lag:parseFloat(el.querySelector('[data-meter-lag]').style.width),text:el.querySelector('output').textContent,rect:el.getBoundingClientRect().toJSON()}));
 const cases=[];

 await seed('below',save=>{save.world.inventory.vest=1;save.world.inventory.medkit=2;save.world.equipment.armor='vest';});
 let health=await meter('#health');assert.deepEqual([health.now,health.max,health.hidden],[10,10,false]);assert.match(health.label,/NOX · VITA: 10 su 10/);cases.push({name:'full_modified_max',health});
 await page.screenshot({path:path.join(out,'full-390x844.png')});
 await page.waitForFunction(()=>Number(document.querySelector('#health').getAttribute('aria-valuenow'))<10,null,{timeout:20000});
 health=await meter('#health');assert.ok(health.now>0&&health.now<health.max);assert.equal(health.fill,health.now/health.max*100);assert.ok(health.lag>health.fill,'damage lag should briefly preserve the previous width');cases.push({name:'partial_damage_queue',health});
 const beforeHeal=await page.evaluate(()=>window.cityAdventure.progress().world.inventory.medkit);await page.click('#bag');await page.click('[data-action="item:medkit"]');await page.waitForFunction(()=>Number(document.querySelector('#health').getAttribute('aria-valuenow'))===10);
 health=await meter('#health');const afterHeal=await page.evaluate(()=>window.cityAdventure.progress().world.inventory.medkit);assert.equal(afterHeal,beforeHeal-1);assert.equal(health.fill,100);assert.equal(health.lag,100);cases.push({name:'healed_to_limit',health,kits:[beforeHeal,afterHeal]});
 await page.click('#bag');await page.click('[data-action="item:medkit"]');await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>window.cityAdventure.progress().world.inventory.medkit),afterHeal,'full health must not consume a kit');
 const beforePause=await meter('#health');await page.click('#pause');await page.waitForTimeout(500);assert.deepEqual(await meter('#health'),beforePause);await page.click('#resume');cases.push({name:'pause_resume_stable',health:beforePause});
 await page.waitForFunction(()=>Number(document.querySelector('#health').getAttribute('aria-valuenow'))<=3,null,{timeout:25000});health=await meter('#health');assert.ok(health.classes.includes('low'));assert.match(health.label,/livello basso/);assert.match(await page.$eval('#health [data-meter-label]',el=>el.textContent),/BASSA/);cases.push({name:'low_non_color_warning',health});await page.screenshot({path:path.join(out,'low-390x844.png')});
 await page.waitForFunction(()=>!document.querySelector('#result').hidden,null,{timeout:20000});health=await meter('#health');assert.equal(health.now,0);assert.ok(health.classes.includes('empty'));cases.push({name:'zero',health});

 await seed('collapse');health=await meter('#health');assert.deepEqual([health.now,health.max,health.hidden],[8,8,false]);assert.equal(await page.$eval('#integrity',el=>el.hidden),true);cases.push({name:'escape_life',health});
 await seed('escape');const integrity=await meter('#integrity');assert.deepEqual([integrity.now,integrity.max,integrity.hidden],[6,6,false]);assert.equal(await page.$eval('#health',el=>el.hidden),true);assert.equal(await page.$eval('#coins',el=>el.hidden),true);cases.push({name:'vehicle_integrity_separate',integrity});
 await seed('moon');assert.equal(await page.$eval('#coins',el=>el.hidden),false);assert.equal(await page.$eval('#health',el=>el.hidden),true);assert.equal(await page.$eval('#integrity',el=>el.hidden),true);cases.push({name:'hub_coins_separate',coins:await page.$eval('#coins',el=>({text:el.textContent,label:el.getAttribute('aria-label')}))});
 await seed('finale',save=>{save.checkpoint='boss';});const boss=await meter('#bossbar');assert.equal(boss.hidden,false);assert.equal(boss.max,460);assert.equal(await page.$eval('#health',el=>el.hidden),false);const bossLayout=await page.evaluate(()=>{const boss=document.querySelector('#bossbar').getBoundingClientRect(),bag=document.querySelector('#bag').getBoundingClientRect();return {boss:boss.toJSON(),bag:bag.toJSON(),overlap:!(boss.right<=bag.left||bag.right<=boss.left||boss.bottom<=bag.top||bag.bottom<=boss.top)};});assert.equal(bossLayout.overlap,false);cases.push({name:'boss_separate',boss,layout:bossLayout});await page.screenshot({path:path.join(out,'boss-390x844.png')});

 await page.setViewportSize({width:844,height:390});await seed('below',save=>{save.world.inventory.vest=1;save.world.equipment.armor='vest';});health=await meter('#health');const layout=await page.evaluate(()=>{const h=document.querySelector('#hud').getBoundingClientRect(),v=document.querySelector('#health').getBoundingClientRect(),p=document.querySelector('#pause').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth>innerWidth,hud:{left:h.left,right:h.right,top:h.top,bottom:h.bottom},health:{left:v.left,right:v.right,top:v.top,bottom:v.bottom},pause:{left:p.left,right:p.right,top:p.top,bottom:p.bottom},viewport:{width:innerWidth,height:innerHeight}};});assert.equal(layout.overflow,false);assert.ok(layout.hud.left>=0&&layout.hud.right<=layout.viewport.width&&layout.hud.top>=0);cases.push({name:'landscape_safe_area',health,layout});await page.screenshot({path:path.join(out,'full-844x390.png')});

 assert.deepEqual(errors,[]);const report={result:'PASS',url,environment:{browser:'system Chromium',touch:true,viewports:['390x844','844x390']},cases,limits:['Seeded browser states are targeted HUD evidence, not a New Story campaign completion run.','System Chromium is not an Android WebView or physical-device test.','Visual readability still requires human review on target phones.'],errors};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
 await browser.close();console.log(`Health/integrity HUD PASS · ${cases.length} cases`);
})().catch(e=>{console.error(e);process.exit(1);});
