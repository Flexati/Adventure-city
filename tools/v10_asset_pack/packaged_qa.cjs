// Execute the exact classic-script Android resource directory in Chromium.
// This checks packaging regressions, NOT an Android WebView or physical device.
const {chromium}=require('playwright');
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const qa=require('../qa_v8.cjs');
const [url='http://127.0.0.1:8091/android/build/assets/game/',out='artifacts/v10/packaged-browser.json']=process.argv.slice(2);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/usr/bin/chromium'});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`HTTP ${r.status()} ${r.url()}`);});
  await page.goto(url);await page.waitForFunction(()=>window.cityAdventure?.status().loaded);
  const raw=await qa.makeSave('below');
  await page.evaluate(raw=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v7',raw);},raw);
  await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().loaded);await page.click('#continue');
  for(let i=0;i<80;i++){
   if(await page.isVisible('#card')){await page.click('#card');continue;}
   if(await page.isVisible('#talk')){await page.click('#next-line');continue;}
   if(await page.evaluate(()=>window.cityAdventure.status().running))break;
   await page.waitForTimeout(50);
  }
  await page.waitForFunction(()=>window.cityAdventure.status().audio.v10.decoded.length===10);
  await page.keyboard.down('KeyJ');await page.waitForTimeout(300);await page.keyboard.up('KeyJ');
  await page.keyboard.down('ShiftLeft');await page.waitForTimeout(160);await page.keyboard.up('ShiftLeft');
  await page.waitForFunction(()=>window.cityAdventure.status().audio.v10.played.dash>0);
  const active=await page.evaluate(()=>window.cityAdventure.status());
  assert.ok(active.audio.v10.played['shot:c9']>0);assert.deepEqual(active.audio.v10.errors,[]);
  await page.screenshot({path:'artifacts/v10/packaged-browser.png'});
  await page.evaluate(()=>window.dispatchEvent(new Event('citynativepause')));
  await page.waitForFunction(()=>window.cityAdventure.status().audio.context==='suspended');
  const paused=await page.evaluate(()=>window.cityAdventure.status());assert.equal(paused.paused,true);
  await page.evaluate(()=>window.dispatchEvent(new Event('citynativeresume')));await page.click('#resume');
  await page.waitForFunction(()=>window.cityAdventure.status().audio.context==='running');
  assert.deepEqual(errors,[]);
  const app=fs.readFileSync('android/build/assets/game/app.js');
  fs.writeFileSync(out,JSON.stringify({result:'PASS',browser:browser.version(),appSha256:crypto.createHash('sha256').update(app).digest('hex'),active,paused,errors,
   limits:['Exact packaged classic script in desktop Chromium; not Android WebView or physical-device evidence.','Seeded checkpoint; lifecycle notifications simulated.']},null,2)+'\n');
  console.log('Packaged classic script: boot, sampled SFX and simulated lifecycle PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
