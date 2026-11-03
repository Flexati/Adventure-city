// Gamepad QA for D27/N2. A scripted pad replaces navigator.getGamepads in desktop Chromium.
// It proves the mapping and the runtime wiring, not that an Android WebView or a real controller exposes the pad.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/v10.3/gamepad']=process.argv.slice(2);

(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
 await context.addInitScript(()=>{
  const pad={id:'QA scripted standard pad',index:0,connected:true,mapping:'standard',timestamp:0,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,touched:false,value:0}))};
  let list=[pad,null,null,null];
  Object.defineProperty(navigator,'getGamepads',{configurable:true,value:()=>list});
  window.__qaPad={
   axes:(...values)=>{values.forEach((v,i)=>{pad.axes[i]=v;});},
   button:(index,value)=>{pad.buttons[index]={pressed:value>.5,touched:value>0,value};},
   connect:()=>{list=[pad,null,null,null];window.dispatchEvent(new Event('gamepadconnected'));},
   disconnect:()=>{list=[null,null,null,null];window.dispatchEvent(new Event('gamepaddisconnected'));}
  };
 });
 const page=await context.newPage(),errors=[],checks=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(url);await page.evaluate(()=>localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:true})));
 await qa.seed(page,url,'below');
 const controls=()=>page.evaluate(()=>window.cityAdventure.controls());
 const snap=()=>page.evaluate(()=>window.cityAdventure.snapshot());
 const status=()=>page.evaluate(()=>window.cityAdventure.status());
 const padCall=(name,...args)=>page.evaluate(([n,a])=>window.__qaPad[n](...a),[name,args]);
 const wait=ms=>page.waitForTimeout(ms);
 // The game reads the pad once per frame (pollGamepad in frame()), so after a pad change wait for n more game frames:
 // frame k+1 starts after the change and reads it, k+2 is margin. The fixed waits stay after settle(), so they only grow.
 const settle=async(n=2)=>{const k=await page.evaluate(()=>window.cityAdventure.performance().at(-1)?.id??0);
  try{await page.waitForFunction(([k,n])=>(window.cityAdventure.performance().at(-1)?.id??0)>=k+n,[k,n],{timeout:5000});}
  catch(error){if(error.name!=='TimeoutError')throw error;throw new Error(`the game did not run ${n} frames within 5000 ms after a pad change (last frame ${k})`,{cause:error});}};
 assert.equal((await status()).mode,'foot');

 let input=await controls();assert.equal(input.gamepad.seen,false,'no polling before the browser reports a pad');
 await padCall('connect');await settle();await wait(80);input=await controls();assert.equal(input.gamepad.seen,true);
 checks.push({id:'connect-gate',result:'PASS',detail:'polling starts only after gamepadconnected'});

 let before=await snap();await padCall('axes',.1,.1,0,0);await settle();await wait(250);input=await controls();let after=await snap();
 assert.deepEqual(input.gamepad.move,{x:0,y:0});assert.ok(Math.hypot(after.x-before.x,after.y-before.y)<1,'left stick inside the 15 % deadzone must not move the hero');
 checks.push({id:'move-deadzone',result:'PASS',detail:'axes (0.1, 0.1), magnitude 0.141 < 0.15'});

 before=await snap();await padCall('axes',1,0,0,0);await settle();await wait(300);input=await controls();after=await snap();await padCall('axes',0,0,0,0);await settle();await wait(60);
 assert.ok(Math.abs(input.gamepad.move.x-1)<1e-9&&input.gamepad.move.y===0);assert.ok(after.x-before.x>20,`hero must move right, moved ${after.x-before.x}`);
 checks.push({id:'move-full',result:'PASS',detail:`axes (1, 0) moved the hero ${Math.round(after.x-before.x)} units in 300 ms`});

 assert.equal((await snap()).dashCd,0);await padCall('button',1,1);await settle();await wait(60);const dashed=await snap();await padCall('button',1,0);await settle();await wait(60);
 assert.ok(dashed.dashCd>0,'B must start a dash on press');
 checks.push({id:'dash-on-press',result:'PASS',detail:'button 1 (B) set dashCd while still held'});

 await wait(1200);const ammo0=(await snap()).arsenal.ammo.c9;
 await padCall('axes',0,0,0,-1);await padCall('button',0,1);await settle();await wait(120);input=await controls();const held=await snap();
 assert.deepEqual(input.gamepad.preview,{kind:'gun',dir:{x:0,y:-1}},'holding A with the right stick shows the aimed preview');assert.equal(held.arsenal.ammo.c9,ammo0,'SPARA must not fire on press');
 await padCall('button',0,0);await settle();await wait(120);const fired=await snap();await padCall('axes',0,0,0,0);await settle();
 assert.equal(fired.arsenal.ammo.c9,ammo0-1,'SPARA must fire on release');assert.ok(Math.abs(fired.aim.x)<1e-9&&Math.abs(fired.aim.y+1)<1e-9,`shot must follow the right stick, aim ${JSON.stringify(fired.aim)}`);input=await controls();assert.equal(input.gamepad.preview,null);
 checks.push({id:'gun-on-release-aimed',result:'PASS',detail:`A held: preview up, ammo ${ammo0}; released: ammo ${fired.arsenal.ammo.c9}, aim (${fired.aim.x}, ${fired.aim.y})`});

 await padCall('axes',.2,0,0,.2);await settle();await wait(60);input=await controls();assert.equal(input.gamepad.aim,null,'right stick inside the 25 % deadzone keeps automatic aim');await padCall('axes',0,0,0,0);await settle();
 checks.push({id:'aim-deadzone',result:'PASS',detail:'axes 2-3 (0, 0.2): magnitude 0.2 < 0.25'});

 await padCall('button',7,.2);await settle();await wait(60);input=await controls();assert.equal(input.gamepad.held.gun,false,'trigger at 20 % is not a press');
 await padCall('button',7,.5);await settle();await wait(60);input=await controls();assert.equal(input.gamepad.held.gun,true,'trigger at 50 % is a press');await padCall('button',7,0);await settle();await wait(80);
 checks.push({id:'trigger-threshold',result:'PASS',detail:'button 7 at 0.2 ignored, at 0.5 held (threshold 0.3)'});

 await padCall('button',9,1);await settle();await wait(80);assert.equal((await status()).paused,true,'Start pauses');await padCall('button',9,0);await settle();await wait(80);
 await padCall('button',9,1);await settle();await wait(80);assert.equal((await status()).paused,false,'Start resumes');await padCall('button',9,0);await settle();await wait(80);
 checks.push({id:'start-pause-toggle',result:'PASS',detail:'button 9 pauses and resumes'});

 await padCall('axes',1,0,0,0);await settle();await wait(80);await padCall('disconnect');await settle();await wait(80);input=await controls();
 assert.deepEqual(input.gamepad.move,{x:0,y:0},'disconnect clears movement');
 checks.push({id:'disconnect-clears',result:'PASS',detail:'movement returns to zero after gamepaddisconnected'});

 assert.deepEqual(errors,[]);
 const report={result:'PASS',environment:{browser:browser.version(),viewport:'390x844',pad:'scripted navigator.getGamepads, mapping standard'},checks,errors,
  limits:['Desktop Chromium with a scripted pad: it does not prove that the Android WebView exposes a real controller (Pillar 5, test 5).','Seeded mission state, not a campaign run.','No human comfort test.']};
 fs.writeFileSync(path.join(out,'gamepad_browser_report.json'),JSON.stringify(report,null,1)+'\n');
 await browser.close();console.log(`Gamepad N2 PASS · ${checks.length} checks`);
})().catch(error=>{console.error(error);process.exit(1);});
