// D39 (R27): a player's keyboard does not play the game. The browser is made to look like a person's (navigator.webdriver
// false): WASD, J, Space, Shift, Q, K, H change nothing in a live mission, Esc still opens and closes the pause, the touch
// controls still move the hero. Usage: node tools/verify_no_keyboard_d39.cjs [url]
const {chromium}=require('playwright'),assert=require('node:assert/strict'),qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/']=process.argv.slice(2);
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),errors=[];
 try{const c=await b.newContext({viewport:{width:390,height:844},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
  await c.addInitScript(()=>Object.defineProperty(Navigator.prototype,'webdriver',{get:()=>false}));
  await qa.seed(p,url,'zero');for(let k=0;k<60;k++){const st=await p.evaluate(()=>window.cityAdventure.status());if(st.running&&st.mode==='foot')break;if(await p.isVisible('#talk')){await p.click('#next-line');continue;}if(await p.isVisible('#card')){await p.click('#card');continue;}await p.waitForTimeout(100);}
  assert.equal(await p.evaluate(()=>navigator.webdriver),false,'the page sees a person');
  const snap=()=>p.evaluate(()=>{const s=window.cityAdventure.snapshot();return {x:Math.round(s.x),y:Math.round(s.y),ammo:s.arsenal?JSON.stringify(s.arsenal.ammo):null,shots:(s.events||[]).length,magicCd:s.magicCd,dash:s.dash,activeMove:s.activeMove}});
  await p.waitForTimeout(600);const a=await snap();
  for(const k of ['KeyW','KeyA','KeyS','KeyD','ArrowUp']){await p.keyboard.down(k);await p.waitForTimeout(350);await p.keyboard.up(k);}
  for(const k of ['KeyJ','Space','ShiftLeft','KeyL','KeyQ','KeyK','KeyV','KeyR','KeyH','KeyE']){await p.keyboard.press(k);await p.waitForTimeout(120);}
  const z=await snap();assert.deepEqual([z.x,z.y],[a.x,a.y],'the keyboard does not move the hero');assert.equal(z.ammo,a.ammo,'nor shoot');assert.equal(z.magicCd,0,'nor cast');assert.equal(z.activeMove,a.activeMove,'nor switch move');
  await p.keyboard.press('Escape');await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>window.cityAdventure.status().paused),true,'Esc opens the pause');
  await p.keyboard.press('Escape');await p.waitForTimeout(200);assert.equal(await p.evaluate(()=>window.cityAdventure.status().paused),false,'Esc closes it');
  const box=await p.locator('#stick').boundingBox(),cx=box.x+box.width/2,cy=box.y+box.height/2;
  const cdp=await c.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx,y:cy,id:1}]});
  for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx,y:cy-6*i,id:1}]});await p.waitForTimeout(60);}
  await p.waitForTimeout(500);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const t=await snap();assert.ok(Math.hypot(t.x-z.x,t.y-z.y)>10,'the joystick still moves the hero ('+JSON.stringify([z,t])+')');
  assert.deepEqual(errors,[]);console.log('D39 no keyboard PASS · keys ignored, Esc pauses, joystick moves');
 }catch(e){console.error(String(e.message||e).slice(0,600));process.exitCode=1;}finally{await b.close();}
})();
