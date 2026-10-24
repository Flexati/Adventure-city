const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const [url='http://127.0.0.1:8090/game/v9-combat-lab.html',out='artifacts/v9-implementation']=process.argv.slice(2);
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const checks=[],errors=[];
 try{
  for(const viewport of [{width:1280,height:900},{width:390,height:844}]){
   const context=await browser.newContext({viewport,hasTouch:true}),p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
   await p.goto(url);await p.waitForFunction(()=>window.chronosCombatLab?.snapshot().loaded);
   const snap=()=>p.evaluate(()=>window.chronosCombatLab.snapshot());
   assert.equal((await snap()).arsenal.active,'c9');
   await p.click('[data-weapon="vx9"]');await p.waitForFunction(()=>window.chronosCombatLab.snapshot().arsenal.active==='vx9');await p.waitForTimeout(250);
   await p.locator('canvas').click({position:{x:10,y:10}});await p.keyboard.down('Space');await p.waitForTimeout(300);await p.keyboard.up('Space');
   assert.ok((await snap()).arsenal.ammo.vx9<24,'keyboard fires burst');
   await p.click('#reload');await p.waitForFunction(()=>window.chronosCombatLab.snapshot().arsenal.reloadRemaining>0);
   await p.click('#pause');const frozen=await snap();await p.waitForTimeout(300);assert.deepEqual(await snap(),frozen,'pause freezes combat and reload');
   await p.click('#save');await p.click('#lulu');assert.equal((await snap()).hero,'lulu');
   await p.click('[data-weapon="arc7"]');await p.waitForFunction(()=>window.chronosCombatLab.snapshot().arsenal.active==='arc7');
   await p.click('#load');assert.equal((await snap()).hero,'nox');assert.equal((await snap()).arsenal.active,'vx9');
   await p.waitForFunction(()=>window.chronosCombatLab.snapshot().arsenal.ammo.vx9===24);
   const point=await p.locator('[data-hold="up"]').boundingBox();const before=await snap();
   // CDP touch, including release, exercises the same pointer path as a phone.
   const cdp=await context.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x+point.width/2,y:point.y+point.height/2}]});await p.waitForTimeout(180);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.ok((await snap()).y<before.y);
   await p.selectOption('#language','en');assert.equal(await p.locator('h1').textContent(),'Combat V9 arena');
   assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.equal(await p.evaluate(()=>localStorage.getItem('city-adventure-progress-v7')),null,'training must not write story saves');
   await p.screenshot({path:`${out}/combat-${viewport.width}.png`,fullPage:true});checks.push({viewport,result:'PASS',keyboardFire:true,touchMovement:true,reloadPauseRestore:true,storyStorageUntouched:true});await context.close();
  }
  assert.deepEqual(errors,[]);fs.writeFileSync(out+'/combat-browser.json',JSON.stringify({checks,errors,limit:'Browser training arena only; not campaign integration or native Android evidence'},null,2)+'\n');console.log('PASS: desktop/mobile combat, touch, reload, pause, isolated saves and language switching');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
