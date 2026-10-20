// Pending browser smoke test; not a substitute for real-device or human playtests.
// Start the local server from PLAY.md; install Playwright and its Chromium separately.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
 for(const [width,height] of [[1280,800],[390,844],[844,390]]){
  const page=await browser.newPage({viewport:{width,height},hasTouch:width<900});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8080/game/');
  await page.locator('#start').click();
  for(let i=0;i<4;i++)await page.locator('#dialog-options button').click();
  assert.equal(await page.locator('#dialogue').isHidden(),true);
  const x=await page.evaluate(()=>window.cityAdventure.snapshot().x);
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(400);await page.keyboard.up('ArrowRight');
  assert((await page.evaluate(()=>window.cityAdventure.snapshot().x))>x);
  await page.locator('#pause').click();
  const a=await page.evaluate(()=>window.cityAdventure.snapshot().playtime);
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(()=>window.cityAdventure.snapshot().playtime),a);
  await page.locator('#easy').check();await page.locator('#resume').click();
  await page.screenshot({path:`ui-${width}x${height}.png`});
  assert.deepEqual(errors,[]);await page.close();console.log(`PASS smoke ${width}x${height}`);
 }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
