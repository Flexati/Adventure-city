// R19: the first-person opening and its beat log, by touch-sized taps, in portrait and landscape.
// Proves the DOM contract and that nothing overflows; it is not human play.
const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/r19/opening']=process.argv.slice(2);
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),checks=[];
 for(const [w,h] of [[360,800],[390,844],[430,932],[844,390]]){
  const context=await browser.newContext({viewport:{width:w,height:h},hasTouch:true,deviceScaleFactor:1}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.evaluate(()=>{localStorage.clear();sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:true}));});
  await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');
  await page.click('#start');
  for(let k=0;k<30&&!(await page.isVisible('#opening'));k++){for(const id of ['#card','#next-line'])if(await page.isVisible(id)){await page.click(id);break;}await page.waitForTimeout(150);}
  assert.ok(await page.isVisible('#opening'),'a new game reaches the opening');
  const log=()=>page.evaluate(()=>{const l=document.getElementById('opening-beat-log');return {beats:l.dataset.beats,text:l.textContent,r:l.getBoundingClientRect().toJSON()};});
  const inside=r=>r.left>=0&&r.right<=w+.5&&r.top>=0&&r.bottom<=h+.5;
  let s=await log();assert.equal(s.beats,'0');assert.ok(inside(s.r),'log inside the screen');
  const surface=await page.locator('#opening-surface').boundingBox();assert.ok(surface.width>=48&&surface.height>=48,'tap target at least 48 px');
  await page.tap('#opening-surface');s=await log();assert.equal(s.beats,'1');assert.match(s.text,/●\s*○/);
  await page.tap('#opening-surface');s=await log();assert.equal(s.beats,'2');assert.match(s.text,/●\s*●/);
  await page.waitForFunction(()=>!document.getElementById('opening-choice').hidden,null,{timeout:5000});
  const choice=await page.evaluate(()=>({speaker:document.getElementById('opening-choice').dataset.speaker,tag:document.getElementById('opening-pov-tag')?.textContent||'',overflow:document.documentElement.scrollWidth>innerWidth+1,
   name:document.getElementById('opening-name').getBoundingClientRect().toJSON()}));
  assert.equal(choice.speaker,'lulu');assert.ok(choice.tag.length>0);assert.equal(choice.overflow,false,'no horizontal overflow');assert.ok(choice.name.height>=48&&inside(choice.name),'answer button reachable '+w+'x'+h+' '+JSON.stringify(choice.name));
  await page.waitForTimeout(700);await page.screenshot({path:`${out}/opening-${w}x${h}.png`});
  await page.tap('#opening-name');assert.equal(await page.evaluate(()=>document.getElementById('opening-choice').dataset.speaker),'nox');
  assert.deepEqual(errors,[]);checks.push({viewport:`${w}x${h}`,result:'PASS'});await context.close();
 }
 await browser.close();fs.writeFileSync(`${out}/opening.json`,JSON.stringify({evidence:'[SIMULAZIONE] Chromium headless, tocco emulato',checks},null,1)+'\n');console.log('PASS opening',checks.length,'formati');
})().catch(e=>{console.error(e);process.exit(1);});
