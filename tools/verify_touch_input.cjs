// Self-test of tools/lib/touch-input.cjs on the real game in Chromium (U4a). Seeded states, real touch only.
// On foot ('below'): Nox walks in 4 directions with a floating-stick finger, fires, dashes, and does both while moving.
// Driving ('escape' and the dark 'tunnel'): accelerate, steer both ways, brake, pulse. Control run: the same observations with
// no helper call must show Nox and the car standing still. Run it once with hasTouch:true and once on a plain page.
// Usage: node tools/verify_touch_input.cjs [url] [out-dir]   (out-dir optional, outside the repo)
const {chromium}=require('playwright'),fs=require('node:fs'),assert=require('node:assert/strict');
const {createTouchInput}=require('./lib/touch-input.cjs'),qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out]=process.argv.slice(2);
const MIN_PX=40;// Nox must cover at least this many world pixels per direction

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),checks=[],errors=[];
 try{
  for(const hasTouch of [true,false]){
   const label=hasTouch?'hasTouch':'plain-page';
   const ctx=await browser.newContext({viewport:{width:390,height:844},hasTouch}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
   const snap=()=>page.evaluate(()=>window.cityAdventure.snapshot()),controls=()=>page.evaluate(()=>window.cityAdventure.controls());
   const status=()=>page.evaluate(()=>window.cityAdventure.status());
   const pass=(id,extra={})=>{checks.push({id:`${label}:${id}`,result:'PASS',...extra});console.log('PASS',`${label}:${id}`,JSON.stringify(extra));};

   // ---- On foot ----
   await qa.seed(page,url,'below');assert.equal((await status()).mode,'foot');
   const touch=await createTouchInput(page);
   // Control: with no touch Nox stays where he is.
   const still0=await snap();await page.waitForTimeout(1500);const still1=await snap();
   const idle=Math.hypot(still1.x-still0.x,still1.y-still0.y);assert.ok(idle<1,'control: without touch Nox moved '+idle);
   assert.deepEqual((await controls()).stick,{x:0,y:0,id:null});
   pass('control-no-touch-no-move',{movedPx:idle});

   for(const [name,vx,vy,axis,sign] of [['right',1,0,'x',1],['left',-1,0,'x',-1],['down',0,1,'y',1],['up',0,-1,'y',-1]]){
    const a=await snap();assert.equal(await touch.move(vx,vy),true,'move '+name+' delivered');await page.waitForTimeout(500);
    const c=await controls(),b=await snap();
    assert.ok(c.stick.id!==null,name+': the game holds a stick finger');assert.ok(Math.hypot(c.stick.x,c.stick.y)>.98,name+': full strength '+JSON.stringify(c.stick));
    const d=(b[axis]-a[axis])*sign;assert.ok(d>=MIN_PX,`${name}: moved ${d.toFixed(1)} px along ${axis}, want >= ${MIN_PX}`);
    pass('move-'+name,{px:Math.round(d)});
   }
   // Direction change keeps the same finger; the ring is not under the fixed #stick (any point of the screen works).
   {const ring=await page.evaluate(()=>{const f=document.getElementById('float-stick').getBoundingClientRect(),s=document.getElementById('stick').getBoundingClientRect();return {hidden:document.getElementById('float-stick').hidden,overlapsStick:f.right>s.left&&f.left<s.right&&f.bottom>s.top&&f.top<s.bottom};});
    assert.equal(ring.hidden,false);assert.equal(ring.overlapsStick,false,'the floating ring sits away from the fixed stick');pass('floating-stick-anywhere',ring);}
   await touch.move(.5,0);await page.waitForTimeout(80);let c=await controls();
   assert.ok(Math.abs(c.stick.x-.5)<.03&&Math.abs(c.stick.y)<.03,'half-strength vector '+JSON.stringify(c.stick));pass('move-half-strength',{stick:c.stick});
   await touch.stopMove();await page.waitForTimeout(150);c=await controls();assert.deepEqual(c.stick,{x:0,y:0,id:null});
   const halt0=await snap();await page.waitForTimeout(300);const halt1=await snap();assert.ok(Math.hypot(halt1.x-halt0.x,halt1.y-halt0.y)<1,'stopMove stops Nox');pass('stop-move');

   // Fire: SPARA acts on release.
   await page.waitForFunction(()=>{const s=window.cityAdventure.snapshot();return !s.fireCd&&!s.action;},null,{timeout:5000});
   const fire0=await snap();assert.equal(await touch.tap('gun'),true);
   const fired=await page.waitForFunction(n=>{const s=window.cityAdventure.snapshot();return s.actions.length>n||s.fireCd>0||s.shots.length>0;},fire0.actions.length,{timeout:2000}).then(()=>true);
   assert.ok(fired);const fire1=await snap();pass('fire-one-shot',{actionsBefore:fire0.actions.length,actionsAfter:fire1.actions.length,fireCd:fire1.fireCd,shots:fire1.shots.length});
   // Rapid fire: apply({gun:true}) keeps re-tapping (INPUT_BUFFER is 0.1 s, a single tap per call would miss most cooldowns) and stops with the next call.
   await page.waitForFunction(()=>!window.cityAdventure.snapshot().fireCd,null,{timeout:5000});
   const rf0=(await snap()).actions.length;await touch.apply({gun:true});await page.waitForTimeout(1300);const rf1=(await snap()).actions.length;
   assert.ok(rf1-rf0>=2,'mashing SPARA keeps firing (more than one tap): '+(rf1-rf0)+' shots in 1.3 s');
   await touch.apply({});await page.waitForTimeout(500);const rf2=(await snap()).actions.length;await page.waitForTimeout(600);const rf3=(await snap()).actions.length;
   assert.equal(rf3,rf2,'no more shots after apply({})');pass('rapid-fire-and-stop',{shotsIn1300ms:rf1-rf0,afterStop:rf3-rf2});
   // Dash: SCHIVA acts on touch-down.
   await page.waitForFunction(()=>window.cityAdventure.snapshot().dashCd===0,null,{timeout:5000});
   assert.equal(await touch.tap('dash'),true);await page.waitForTimeout(60);const dash=await snap();assert.ok(dash.dashCd>0&&dash.inv>0,'dash cooldown/invulnerability '+JSON.stringify({dashCd:dash.dashCd,inv:dash.inv}));
   pass('dash',{dashCd:dash.dashCd,inv:dash.inv});
   // Several fingers: keep moving while firing and dashing.
   await page.waitForFunction(()=>{const s=window.cityAdventure.snapshot();return s.dashCd===0&&!s.fireCd;},null,{timeout:5000});
   const m0=await snap();await touch.move(-1,0);await page.waitForTimeout(150);const before=(await snap()).actions.length;
   await touch.tap('gun');await touch.tap('dash');await page.waitForTimeout(450);
   c=await controls();const m1=await snap();
   assert.ok(c.stick.id!==null,'the movement finger survives taps made by other fingers');assert.ok(m0.x-m1.x>=MIN_PX,'still moving after the taps: '+JSON.stringify({m0:[m0.x,m0.y],m1:[m1.x,m1.y],stick:c.stick}));
   assert.ok(m1.actions.length>=before+2,'gun and dash both registered while moving: '+before+' -> '+m1.actions.length);
   assert.deepEqual(touch.fingers(),['move']);pass('move-fire-dash-together',{actions:m1.actions.length-before,dx:Math.round(m0.x-m1.x)});
   // Click-only button while the stick finger is down (weapon-change): see the Known limit note in touch-input.cjs.
   const weapon0=(await snap()).arsenal?.active;
   if(await page.isVisible('#weapon-change')){const synth=touch.stats.syntheticClicks;assert.equal(await touch.tap('weapon-change'),true);await page.waitForTimeout(150);
    const weapon1=(await snap()).arsenal.active;assert.notEqual(weapon1,weapon0,'weapon-change took effect while moving');assert.equal(touch.stats.syntheticClicks-synth,0,'the game itself reacts to a second finger: no synthetic click was needed');pass('weapon-change-while-moving',{from:weapon0,to:weapon1,syntheticClicks:touch.stats.syntheticClicks-synth});}
   else console.log('SKIP weapon-change: the button is not visible in this step');
   // A button that is not on screen is reported, not tapped.
   assert.equal(await touch.tap('pulse'),false);assert.ok(touch.skipped.hidden>0);pass('hidden-button-reported',{skipped:{...touch.skipped}});
   await touch.release();assert.deepEqual(touch.fingers(),[]);await page.waitForTimeout(100);assert.deepEqual((await controls()).stick,{x:0,y:0,id:null});pass('release-all');

   // ---- Driving, daylight ('escape') ----
   await qa.seed(page,url,'escape');assert.equal((await status()).mode,'drive');
   const t2=await createTouchInput(page);
   const d0=(await snap()).driving;await page.waitForTimeout(1500);const d1=(await snap()).driving;
   assert.ok(d1.distance-d0.distance<1&&d1.speed<1,'control: without touch the car stays at rest '+JSON.stringify({d0:d0.distance,d1:d1.distance,speed:d1.speed}));pass('control-no-touch-car-still',{distance:d1.distance,speed:d1.speed});
   assert.equal(await t2.drive({accelerate:true}),true);await page.waitForTimeout(1500);
   let d2=(await snap()).driving;assert.ok(d2.speed>20&&d2.distance>d1.distance+20,'accelerating '+JSON.stringify({speed:d2.speed,distance:d2.distance}));
   let ctl=await controls();assert.equal(ctl.driving.acceleratePointers,1);pass('accelerate',{speed:d2.speed,distance:d2.distance});
   const sx0=d2.x;assert.equal(await t2.drive({steer:1,accelerate:true}),true);await page.waitForTimeout(700);ctl=await controls();
   let d3=(await snap()).driving;assert.equal(ctl.stick.x,1);assert.ok(d3.x>sx0+10,'steer right moves the car '+sx0+' -> '+d3.x);
   assert.equal(ctl.driving.acceleratePointers,1,'accelerate finger still down while steering');pass('steer-right',{x0:sx0,x1:d3.x});
   assert.equal(await t2.drive({steer:-1,accelerate:true}),true);await page.waitForTimeout(900);ctl=await controls();const d4=(await snap()).driving;
   assert.equal(ctl.stick.x,-1);assert.ok(d4.x<d3.x-10,'steer left moves the car '+d3.x+' -> '+d4.x);pass('steer-left',{x1:d3.x,x2:d4.x});
   assert.equal(await t2.drive({steer:.5,accelerate:true}),true);await page.waitForTimeout(100);ctl=await controls();assert.ok(Math.abs(ctl.stick.x-.5)<.03,'half steer '+ctl.stick.x);pass('steer-half',{stick:ctl.stick.x});
   const sp0=(await snap()).driving.speed;assert.equal(await t2.drive({brake:true}),true);await page.waitForTimeout(900);ctl=await controls();const sp1=(await snap()).driving.speed;
   assert.equal(ctl.driving.acceleratePointers,0,'accelerate lifted');assert.equal(ctl.driving.brakePointers,1);assert.ok(sp1<sp0-5,'braking slows the car '+sp0+' -> '+sp1);pass('brake',{speed0:sp0,speed1:sp1});
   assert.equal(await t2.drive({pulse:true}),false);pass('pulse-hidden-in-daylight',{skipped:{...t2.skipped}});
   await t2.release();ctl=await controls();assert.deepEqual([ctl.driving.acceleratePointers,ctl.driving.brakePointers,ctl.stick.id],[0,0,null]);pass('drive-release-all');

   // ---- Driving, dark ('tunnel'): the pulse button ----
   await qa.seed(page,url,'tunnel');assert.equal((await status()).mode,'drive');
   const t3=await createTouchInput(page);
   await page.waitForFunction(()=>{const s=window.cityAdventure.snapshot().driving;return s.pulseCd===0;},null,{timeout:5000});
   assert.equal(await t3.drive({accelerate:true,pulse:true}),true);await page.waitForTimeout(150);
   const pd=(await snap()).driving;assert.ok(pd.pulseCd>0||pd.pulse>0,'pulse started '+JSON.stringify({pulse:pd.pulse,pulseCd:pd.pulseCd}));
   assert.equal((await controls()).driving.acceleratePointers,1);pass('pulse-in-dark-drive',{pulse:pd.pulse,pulseCd:pd.pulseCd,syntheticClicks:t3.stats.syntheticClicks});
   await t3.release();await ctx.close();
  }
  assert.deepEqual(errors,[]);
  if(out){fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/touch-input.json',JSON.stringify({ok:true,checks,errors},null,1));}
  console.log(`TOUCH INPUT PASS · ${checks.length} checks`);
 }catch(e){
  if(out){fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/touch-input.json',JSON.stringify({ok:false,checks,errors,failure:String(e.stack||e)},null,1));}
  console.error(e);process.exitCode=1;
 }finally{await browser.close();}
})();
