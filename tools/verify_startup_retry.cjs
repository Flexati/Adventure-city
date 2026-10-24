// Test the packaged Android JavaScript bootstrap in Chromium. Not native WebView proof.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const [url='http://127.0.0.1:8090/android/build/assets/game/',out='artifacts/v9-implementation/startup-retry.json']=process.argv.slice(2);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 try{
  const page=await browser.newPage();let fail=false;
  await page.route('**/app.js',r=>fail?r.abort('failed'):r.continue());
  await page.goto(url);await page.waitForFunction(()=>window.cityAdventure?.status().loaded);
  await page.evaluate(()=>localStorage.setItem('chronos-recovery-probe','preserve'));fail=true;await page.reload();await page.locator('#startup-recovery').waitFor();assert.equal(await page.locator('#startup-recovery').count(),1);
  fail=false;await page.locator('#startup-recovery button').click();await page.waitForFunction(()=>window.cityAdventure?.status().loaded);
  assert.equal(await page.locator('#startup-recovery').count(),0);assert.equal(await page.evaluate(()=>localStorage.getItem('chronos-recovery-probe')),'preserve');
  fs.writeFileSync(out,JSON.stringify({result:'PASS',procedure:'Abort actual packaged app.js once, press visible Retry, verify loaded game and storage',limit:'Chromium, not Android; native HTTP error and renderer crash still require device CI'},null,2)+'\n');console.log('PASS: packaged bootstrap resource failure and visible Retry');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
