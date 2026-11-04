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
  fs.writeFileSync(out+'/report.json',JSON.stringify({browser:browser.version(),url,reports},null,2)+'\n');
  console.log('PASS branding, menu, settings and checkpoint continuation at 6 viewport sizes');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
