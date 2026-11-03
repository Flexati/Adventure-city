// Seeded interaction QA for E03. This proves input behavior, not campaign completion or human comfort.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out='artifacts/v9-controls']=process.argv.slice(2);

(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
 const page=await context.newPage(),errors=[],checks=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(url);await page.evaluate(()=>localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:true})));
 await qa.seed(page,url,'below');assert.equal((await page.evaluate(()=>window.cityAdventure.status())).mode,'foot');
 const cdp=await context.newCDPSession(page);
 const box=async id=>page.locator('#'+id).boundingBox();
 const controls=()=>page.evaluate(()=>window.cityAdventure.controls());
 const snap=()=>page.evaluate(()=>window.cityAdventure.snapshot());
 const start=async points=>cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points.map(({x,y,id})=>({x,y,id,radiusX:4,radiusY:4,force:.8}))});
 const move=async points=>cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:points.map(({x,y,id})=>({x,y,id,radiusX:4,radiusY:4,force:.8}))});
 const end=async()=>cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const cancel=async()=>cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});

 const stick=await box('stick'),center={x:stick.x+stick.width/2,y:stick.y+stick.height/2,id:0};
 const beforeCenter=await snap();await start([{...center,x:center.x+3,y:center.y-2}]);await page.waitForTimeout(180);
 let input=await controls(),afterCenter=await snap();assert.deepEqual([input.stick.x,input.stick.y],[0,0]);assert.ok(Math.hypot(afterCenter.x-beforeCenter.x,afterCenter.y-beforeCenter.y)<1,'deadzone must not move the actor');await end();checks.push({id:'center-deadzone',result:'PASS'});

 const beforeDiagonal=await snap();await start([{...center,x:center.x+34,y:center.y-34}]);await page.waitForTimeout(260);input=await controls();assert.ok(Math.abs(Math.hypot(input.stick.x,input.stick.y)-1)<.02);const afterDiagonal=await snap();assert.ok(afterDiagonal.x>beforeDiagonal.x&&afterDiagonal.y<beforeDiagonal.y,'diagonal touch must move both axes');await cancel();await page.waitForTimeout(120);input=await controls();assert.deepEqual({x:input.stick.x,y:input.stick.y,id:input.stick.id},{x:0,y:0,id:null});const stopped=await snap();await page.waitForTimeout(180);const stoppedLater=await snap();assert.ok(Math.hypot(stoppedLater.x-stopped.x,stoppedLater.y-stopped.y)<1,'pointer cancel must stop movement');checks.push({id:'diagonal-cancel-stop',result:'PASS'});

 const gun=await box('gun'),gunPoint={x:gun.x+gun.width/2,y:gun.y+gun.height/2,id:1};await start([center,gunPoint]);await page.waitForTimeout(100);input=await controls();assert.notEqual(input.stick.id,null);assert.equal(input.aim?.kind,'gun');await cancel();input=await controls();assert.equal(input.stick.id,null);assert.equal(input.aim,null);assert.equal(input.pending,null);checks.push({id:'two-thumb-and-cancel',result:'PASS'});

 await page.focus('#gun');const actionsBefore=(await snap()).actions.length;await page.keyboard.down('Space');input=await controls();assert.equal(input.keys.includes('Space'),false,'focused fire button must not also activate the global Space binding');await page.keyboard.up('Space');await page.waitForTimeout(80);assert.ok((await snap()).actions.length>actionsBefore,'focused fire button must still queue its own action');checks.push({id:'keyboard-event-isolation',result:'PASS'});

 await start([{...center,x:center.x+30}]);await page.waitForTimeout(80);await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.waitForTimeout(80);input=await controls();assert.equal((await page.evaluate(()=>window.cityAdventure.status())).paused,true);assert.deepEqual({x:input.stick.x,y:input.stick.y,id:input.stick.id},{x:0,y:0,id:null});assert.deepEqual(input.keys,[]);assert.equal(input.aim,null);await end().catch(()=>{});await page.click('#resume');checks.push({id:'blur-clears-all-input',result:'PASS'});

 // SCHIVA starts on the press (C1) and stays enabled while it recharges (N1). The settle wait absorbs headless frame stalls; the 60 ms window is the claim itself.
 await page.waitForFunction(()=>{const s=window.cityAdventure.status();return s.running&&!s.paused&&!s.uiLock&&window.cityAdventure.snapshot().dashCd===0;},null,{timeout:8000});await page.waitForTimeout(1500);
 const dashBox=await box('dash'),dashPoint={x:dashBox.x+dashBox.width/2,y:dashBox.y+dashBox.height/2,id:2};assert.equal(await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('button')?.id,dashPoint),'dash','the touch point must land on SCHIVA');
 await start([dashPoint]);await page.waitForTimeout(60);const pressed=await snap();assert.ok(pressed.dashCd>0,'SCHIVA must start on touchstart, with the finger still down');checks.push({id:'dash-on-touchstart',result:'PASS',dashCd:pressed.dashCd});
 const cooling=await page.evaluate(()=>{const b=document.getElementById('dash');return {dashCd:window.cityAdventure.snapshot().dashCd,disabled:b.disabled,cooling:b.classList.contains('cooling')};});await end();assert.ok(cooling.dashCd>0,'the cooldown must still be running');assert.equal(cooling.disabled,false,'SCHIVA must stay enabled while it recharges');assert.equal(cooling.cooling,true,'SCHIVA must show the cooling state while it recharges');checks.push({id:'dash-enabled-while-cooling',result:'PASS',...cooling});

 for(const [width,height] of [[360,800],[390,844],[412,915],[844,390]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(100);
  const layout=await page.evaluate(()=>{const selectors=['#stick','#pause','.actions button'];const rects=[];for(const el of document.querySelectorAll(selectors.join(','))){if(el.hidden||getComputedStyle(el).display==='none')continue;const r=el.getBoundingClientRect();rects.push({id:el.id,left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height});}const overlaps=[];for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];if(a.right>b.left&&b.right>a.left&&a.bottom>b.top&&b.bottom>a.top)overlaps.push([a.id,b.id]);}const s=window.cityAdventure.snapshot(),v=window.cityAdventure.view(),hud=document.querySelector('#hud').getBoundingClientRect(),ctl=document.querySelector('#controls').getBoundingClientRect(),feet=(s.y-v.y)*v.scale,head=feet-112*v.scale;return {width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,rects,overlaps,framing:{head,feet,hudBottom:hud.bottom,controlsTop:ctl.top}};});
  assert.equal(layout.overflow,false);assert.deepEqual(layout.overlaps,[]);for(const r of layout.rects){assert.ok(r.left>=-1&&r.top>=-1&&r.right<=width+1&&r.bottom<=height+1,`${width}x${height} ${r.id} off-screen`);if(r.id!=='stick')assert.ok(r.height>=47.5,`${width}x${height} ${r.id} below 48px`);}assert.ok(layout.framing.head>=layout.framing.hudBottom-1);assert.ok(layout.framing.feet<=layout.framing.controlsTop+1);checks.push({id:`layout-${width}x${height}`,result:'PASS',layout});await page.screenshot({path:path.join(out,`controls-${width}x${height}.png`)});
 }

 assert.deepEqual(errors,[]);const report={result:'PASS',environment:{browser:browser.version(),touch:true,viewports:['360x800','390x844','412x915','844x390']},checks,errors,limits:['Seeded mission state; not a New Story campaign-completion run.','Automated two-pointer and layout checks do not replace a two-person/two-thumb human comfort test.','Browser evidence is paired with the separately recorded Android WebView lifecycle run.']};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2)+'\n');
 await browser.close();console.log(`E03 controls PASS · ${checks.length} checks`);
})().catch(error=>{console.error(error);process.exit(1);});
