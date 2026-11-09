// Exercise public branding, touch targets, local artwork, and existing-save continuation.
const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const [url='http://127.0.0.1:8090/game/',out='artifacts/chronos-adventure/brand']=process.argv.slice(2);
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const reports=[];
 try{
  for(const [width,height] of [[320,568],[360,800],[390,844],[412,915],[844,390],[1280,800]]){
   const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
   await page.goto(url);
   await page.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
   assert.equal(await page.title(),'Chronos Adventure: Nox & Lulú');
   assert.match(await page.locator('h1').innerText(),/CHRONOS\s*ADVENTURE\s*NOX\s*&\s*LULÚ/);
   const art=await page.evaluate(async()=>{const s=getComputedStyle(document.querySelector('.menu-backdrop')).backgroundImage;const src=s.match(/url\("?([^"\)]+)/)[1];const image=new Image();image.src=src;await image.decode();return {width:image.naturalWidth,height:image.naturalHeight,bytes:(await (await fetch(src)).arrayBuffer()).byteLength};});
   assert.ok(art.width>=1280&&art.bytes<600000,'art decoded within mobile transfer budget');
   assert.equal(await page.locator('.menu-rain').evaluate(e=>getComputedStyle(e).animationName),'none');
   assert.equal(await page.locator('.menu-backdrop').evaluate(e=>getComputedStyle(e).animationName),'none','reduced motion freezes the artwork');
   if(width===390){
    await page.emulateMedia({reducedMotion:'no-preference'});
    const backdrop=page.locator('.menu-backdrop');
    assert.equal(await backdrop.evaluate(e=>getComputedStyle(e).animationName),'menuPan');
    const first=await backdrop.evaluate(e=>getComputedStyle(e).transform);
    await page.waitForTimeout(250);
    const second=await backdrop.evaluate(e=>getComputedStyle(e).transform);
    assert.notEqual(first,second,'the illustrated background visibly moves over time');
    await page.emulateMedia({reducedMotion:'reduce'});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');
   for(const selector of ['#start','#menu-settings']){
    await page.locator(selector).scrollIntoViewIfNeeded();const box=await page.locator(selector).boundingBox();
    assert.ok(box.width>=48&&box.height>=48&&box.y>=0&&box.y+box.height<=height,selector+' reachable');
   }
   await page.locator('#menu-settings').tap();await page.locator('#options-close').tap();
   await page.locator('#start').scrollIntoViewIfNeeded();
   await page.screenshot({path:`${out}/menu-${width}x${height}.png`});
   await page.locator('#start').tap();
   if(await page.locator('#card').isVisible())await page.locator('#card').tap();
   await page.waitForFunction(()=>window.cityAdventure.status().step==='opening');
   // Reopen the real checkpoint created by New Story: no injected save fixtures.
   const checkpoint=await page.evaluate(()=>window.cityAdventure.progress());
   await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
   assert.equal(await page.locator('#continue').isVisible(),true);
   await page.locator('#continue').scrollIntoViewIfNeeded();
   const box=await page.locator('#continue').boundingBox();assert.ok(box.y>=0&&box.y+box.height<=height);
   await page.locator('#continue').tap();
   await page.waitForFunction(()=>window.cityAdventure.status().step==='opening');
   assert.equal((await page.evaluate(()=>window.cityAdventure.progress())).stepId,checkpoint.stepId);
   assert.deepEqual(errors,[]);reports.push({width,height,art,errors,checks:['title','decoded local art','touch settings','new story','reload continue','reduced motion','no horizontal overflow']});
   await context.close();
  }
  // D40 menu heroes: the tap hop rides on the running animations (the hero never fades out), and the in-game «Riduci movimento» freezes them.
  {const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'no-preference'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const menu=()=>page.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
   await page.goto(url);await menu();await page.waitForTimeout(1000);
   const hero=page.locator('.mh.nox'),top0=(await hero.boundingBox()).y;await hero.dispatchEvent('pointerdown');
   const samples=[];for(let i=0;i<16;i++){samples.push(await hero.evaluate(e=>({opacity:+getComputedStyle(e).opacity,top:e.getBoundingClientRect().top})));await page.waitForTimeout(75);}
   assert.ok(samples.every(s=>s.opacity>.99),'the hero stays visible through and after the hop: '+samples.map(s=>s.opacity.toFixed(2)).join(','));
   assert.ok(Math.min(...samples.map(s=>s.top))<top0-15,'the hero rises on tap');
   // R3: the opening, the first input of the game, shows where to tap after 2.5 s without a knock.
   const invite=()=>page.evaluate(()=>{const s=document.getElementById('opening-surface'),r=s.querySelector('.tap-invite');return {on:s.classList.contains('invite'),opacity:+getComputedStyle(r).opacity,anim:getComputedStyle(r).animationName};});
   const opening=async()=>{await page.click('#start');if(await page.isVisible('#restart'))await page.click('#confirm-new');await page.waitForSelector('#opening:not([hidden])');};
   await opening();await page.waitForTimeout(1000);assert.equal((await invite()).on,false,'no ring before 2.5 s');
   await page.waitForTimeout(1900);const shown=await invite();assert.ok(shown.on&&shown.anim==='tapInvite','ring after 2.5 s '+JSON.stringify(shown));
   await page.locator('#opening-surface').tap();assert.equal((await invite()).on,false,'the first knock hides the ring');
   await page.waitForTimeout(2800);assert.equal((await invite()).on,true,'waiting for the second knock brings it back');
   await page.locator('#opening-surface').tap();await page.waitForSelector('#opening-choice:not([hidden])');assert.equal((await invite()).on,false);
   await page.evaluate(()=>localStorage.setItem('city-v4-settings',JSON.stringify({reduced:true})));await page.reload();await menu();
   assert.equal(await hero.evaluate(e=>getComputedStyle(e).animationName),'none','«Riduci movimento» freezes the menu heroes');
   const still=(await hero.boundingBox()).y;await hero.dispatchEvent('pointerdown');await page.waitForTimeout(250);assert.equal((await hero.boundingBox()).y,still,'no hop with reduced motion');
   await opening();await page.waitForTimeout(2900);const calm=await invite();assert.ok(calm.on&&calm.anim==='none'&&calm.opacity>.5,'reduced motion: a still ring '+JSON.stringify(calm));
   assert.deepEqual(errors,[]);reports.push({width:390,height:844,checks:['menu hero hop keeps the hero visible','in-game reduced motion freezes the menu heroes','opening tap invitation after 2.5 s, still under reduced motion'],samples});await context.close();}
  fs.writeFileSync(out+'/report.json',JSON.stringify({browser:browser.version(),url,reports},null,2)+'\n');
  console.log('PASS branding, menu, settings and checkpoint continuation at 6 viewport sizes');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
