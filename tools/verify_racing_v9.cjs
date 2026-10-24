const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const [url='http://127.0.0.1:8090/game/v9-race-lab.html',out='artifacts/v9-racing']=process.argv.slice(2);
(async()=>{
 fs.mkdirSync(out,{recursive:true});const {racePilot}=await import('../game/racing-v9.mjs');const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});const errors=[],checks=[];
 try{
  const context=await browser.newContext({viewport:{width:1280,height:950},hasTouch:true});const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.clock.install();await p.goto(url);await p.waitForFunction(()=>window.chronosRaceLab);const snap=()=>p.evaluate(()=>window.chronosRaceLab.snapshot());
  for(const id of ['ash_docks','solkara','aurelia_span']){
   await p.selectOption('#race',id);await p.click('#start');await p.clock.runFor(3200);
   await p.click('#pause');const frozen=await snap();await p.clock.runFor(500);assert.deepEqual(await snap(),frozen);await p.click('#start');
   const held=new Set();let frames=0;
   while((await snap()).status==='racing'&&frames++<1100){
    const s=await snap(),input=racePilot(s,s.cars[0]);const desired=new Set([...(input.throttle>.1?['ArrowUp']:[]),...(input.brake>.1?['ArrowDown']:[]),...(input.steer<-.12?['ArrowLeft']:input.steer>.12?['ArrowRight']:[])]);
    for(const k of held)if(!desired.has(k)){await p.keyboard.up(k);held.delete(k);}for(const k of desired)if(!held.has(k)){await p.keyboard.down(k);held.add(k);}
    await p.clock.runFor(200);
    if(frames===50)await p.screenshot({path:`${out}/${id}.png`,fullPage:true});
   }
   for(const k of held)await p.keyboard.up(k);
   const final=await snap();assert.equal(final.status,'finished',id);assert.equal(final.cars[0].checkpoint,3);assert.equal(await p.locator('#headline').textContent(),'Gara completata');
   checks.push({id,status:final.status,time:final.time,penalty:final.cars[0].penalty,checkpoints:final.cars[0].checkpoint});
  }
  const record=await p.evaluate(()=>window.chronosRaceLab.status().record);assert.equal(Object.keys(record.events).length,3);
  assert.equal(await p.evaluate(()=>localStorage.getItem('city-adventure-progress-v7')),null);
  await p.reload();await p.waitForFunction(()=>window.chronosRaceLab);assert.deepEqual(await p.evaluate(()=>window.chronosRaceLab.status().record),record);
  await p.setViewportSize({width:390,height:844});await p.selectOption('#language','en');await p.click('#start');await p.clock.runFor(3200);
  await p.locator('[data-hold="throttle"]').scrollIntoViewIfNeeded();const b=await p.locator('[data-hold="throttle"]').boundingBox(),cdp=await context.newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:b.x+b.width/2,y:b.y+b.height/2}]});await p.clock.runFor(1000);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok((await snap()).cars[0].speed>100);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await p.screenshot({path:out+'/mobile.png',fullPage:true});assert.deepEqual(errors,[]);
  fs.writeFileSync(out+'/browser.json',JSON.stringify({checks,errors,mobileTouch:true,pause:true,persistentResults:true,storyStorageUntouched:true,limit:'Accelerated browser clock with real keyboard/touch input; not human fun or native device evidence'},null,2)+'\n');console.log('PASS: three playable races, pause, persistent results, mobile touch and IT/EN');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
