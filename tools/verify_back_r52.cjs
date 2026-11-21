// R52 (D93): the Back button in the real page, on the screens that block the story. window.__chronosBack() is what the
// Android activity asks first: true = the page handled it (no pause, no «Tornare al telefono?»), false = the activity asks.
// Real flows where the game reaches them quickly (the opening on a first night and a second one, the cup moment); the
// screens that come only after a won stage or a long fight (Tessa's kit, the blackout choice, the press-and-hold, the knock)
// are put on screen by the check itself, so for those the proof is the routing, not the story flow that leads there.
const {chromium}=require('playwright');const fs=require('fs');const {seed,makeSave}=require('./qa_v8.cjs');
const URL=process.argv[2]||'http://127.0.0.1:8090/game/',OUT='docs/evidence/r52';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});const report={checks:[]};
 const ok=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail!=null?' · '+detail:''));};
 const page=await browser.newPage({viewport:{width:412,height:860}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const back=()=>page.evaluate(()=>window.__chronosBack());
 const state=()=>page.evaluate(()=>({mode:window.cityAdventure.status().mode,pause:!document.getElementById('pause-panel').hidden,open:[...document.querySelectorAll('section:not([hidden]),header:not([hidden])')].map(e=>e.id).filter(Boolean)}));
 const settle=async()=>{await page.waitForTimeout(250);};
 // 1 · the opening, first night: no skip button, Back is swallowed and nothing moves
 await page.goto(URL);await page.evaluate(()=>{localStorage.clear();sessionStorage.clear();});
 await seed(page,URL,'opening');await page.evaluate(()=>localStorage.removeItem('city-opening-seen-v8'));
 await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu');await page.click('#continue');
 await page.waitForFunction(()=>!document.getElementById('opening').hidden,null,{timeout:15000}).catch(()=>{});
 const skipHidden=await page.evaluate(()=>document.getElementById('opening-skip').hidden);
 const r1=await back();await settle();const s1=await state();
 ok('opening, first night: skip is hidden, Back is handled and the opening stays',skipHidden&&r1===true&&s1.open.includes('opening')&&!s1.pause,JSON.stringify({skipHidden,r1,open:s1.open}));
 await page.screenshot({path:OUT+'/opening_first_night.png'});
 // 2 · the opening again: the skip button is on screen, Back is the skip
 await page.evaluate(()=>localStorage.setItem('city-opening-seen-v8','1'));
 await page.reload();await page.waitForFunction(()=>window.cityAdventure?.status().mode==='menu');await page.click('#continue');
 await page.waitForFunction(()=>!document.getElementById('opening').hidden,null,{timeout:15000}).catch(()=>{});
 const skipShown=await page.evaluate(()=>!document.getElementById('opening-skip').hidden);
 const r2=await back();await page.waitForTimeout(600);const s2=await state();
 ok('opening, seen before: Back skips it, the game goes on, no exit question',skipShown&&r2===true&&!s2.open.includes('opening')&&!s2.pause,JSON.stringify({skipShown,r2,mode:s2.mode,open:s2.open}));
 // 3 · the cup moment: a real story choice
 await seed(page,URL,'home',{stopOnDialogue:true});let seen=false;
 for(let k=0;k<80;k++){if(await page.isVisible('#choice')){seen=true;break;}if(await page.isVisible('#talk'))await page.click('#next-line');else if(await page.isVisible('#card'))await page.click('#card');await page.waitForTimeout(120);}
 const r3=seen?await back():null;await settle();const s3=await state();
 ok('story choice: Back is handled, the choice stays open and unresolved',seen&&r3===true&&s3.open.includes('choice')&&!s3.pause,JSON.stringify({r3,open:s3.open}));
 const picked=await page.evaluate(()=>JSON.parse(window.cityAdventure.progress?JSON.stringify(window.cityAdventure.progress()):'{}'));
 ok('…and nothing was chosen on the player\'s behalf',!(picked.narrative?.choices||{}).home_cup,JSON.stringify((picked.narrative||{}).choices||{}));
 // 4 · Tessa's kit, the knock, the press-and-hold and the blackout choice (workshop or shelter) come after a won stage or a long
 // fight: put on screen by the check, in the middle of a running stage
 await seed(page,URL,'city');await settle();
 for(const [id,expectCancel] of [['field-kit',false],['knock',false],['hold',true],['city-choice',false]]){
  if((await state()).pause){await back();await settle();}// a pause left by the previous screen is not this screen's doing
  await page.evaluate(i=>{document.getElementById(i).hidden=false;},id);
  const r=await back();await settle();const s=await state();
  ok(id+': Back is handled, the screen stays, the game is not paused',r===true&&s.open.includes(id)&&!s.pause,JSON.stringify({r,pause:s.pause}));
  await page.evaluate(i=>{document.getElementById(i).hidden=true;},id);
 }
 // 5 · control: with nothing open Back still pauses a running stage, and with the pause open it resumes
 const r6=await back();await settle();const s6=await state();ok('control: nothing open, Back pauses the running stage',r6===true&&s6.pause,JSON.stringify(s6.pause));
 const r7=await back();await settle();const s7=await state();ok('control: Back again resumes',r7===true&&!s7.pause);
 ok('no page errors',!errors.length,errors.join(' | '));
 fs.writeFileSync(OUT+'/verify_back_r52.json',JSON.stringify(report,null,1)+'\n');await browser.close();process.exit(report.checks.every(c=>c.pass)?0:1);})();
