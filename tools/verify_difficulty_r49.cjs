// R49 (D92): story mode in the real page. The Options switch is saved; the next stage starts with 4 more health.
const {chromium}=require('playwright');const fs=require('fs');const {seed}=require('./qa_v8.cjs');
const URL=process.argv[2]||'http://127.0.0.1:8090/game/',OUT='docs/evidence/r49';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});const report={checks:[]};
 const ok=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail!=null?' · '+detail:''));};
 const page=await browser.newPage({viewport:{width:412,height:860}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const hp=()=>page.evaluate(()=>{const s=window.cityAdventure.snapshot();return s.maxHp;});
 await seed(page,URL,'vega');const before=await hp();
 await page.keyboard.press('Escape');await page.click('#pause-options');await page.click('#tab-access');await page.waitForTimeout(200);
 await page.screenshot({path:OUT+'/options_story_mode.png'});await page.check('#opt-story');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('city-v4-settings')||'{}').story);
 ok('the switch sits in Accessibility and is saved',saved===true);
 await seed(page,URL,'vega');const after=await hp();
 ok('the next stage starts with 4 more health',after===before+4,before+' → '+after);
 const boss=await page.evaluate(()=>window.cityAdventure.snapshot().c.id);ok('Vega is the stage',boss==='vega',boss);
 ok('no page errors',!errors.length,errors.join(' | '));
 fs.writeFileSync(OUT+'/verify_difficulty_r49.json',JSON.stringify(report,null,1)+'\n');await browser.close();process.exit(report.checks.every(c=>c.pass)?0:1);})();
