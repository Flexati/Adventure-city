// R48 (D92): the review fixes in the real page. The Archive and Escape; the Archive in English.
const {chromium}=require('playwright');const fs=require('fs');const {seed}=require('./qa_v8.cjs');
const URL=process.argv[2]||'http://127.0.0.1:8090/game/',OUT='docs/evidence/r48';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});const report={checks:[]};
 const ok=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail!=null?' · '+detail:''));};
 const page=await browser.newPage({viewport:{width:412,height:860}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await seed(page,URL,'city');for(let k=0;k<40&&await page.isVisible('#talk');k++){await page.click('#next-line');await page.waitForTimeout(100);}
 await page.keyboard.press('Escape');await page.waitForTimeout(200);await page.click('#pause-codex');await page.waitForTimeout(200);
 ok('the Archive opens from the pause menu',await page.isVisible('#codex')&&!await page.isVisible('#pause-panel'));
 const t0=await page.evaluate(()=>window.cityAdventure.snapshot().time);
 await page.keyboard.press('Escape');await page.waitForTimeout(400);const t1=await page.evaluate(()=>window.cityAdventure.snapshot().time);
 ok('Escape with the Archive open goes back to the pause menu, the game stays still',!await page.isVisible('#codex')&&await page.isVisible('#pause-panel')&&t1===t0,'time '+t0+' → '+t1);
 await page.click('#pause-codex');await page.waitForTimeout(200);await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});
 await page.waitForTimeout(200);ok('going to the background with the Archive open does not stack the pause menu on it',await page.isVisible('#codex')&&!await page.isVisible('#pause-panel'));
 await page.click('#codex-close');await page.selectOption('#language','en');await page.waitForTimeout(300);await page.click('#pause-codex');await page.waitForTimeout(300);
 const roles=await page.$$eval('#codex-list .codex-entry:not(.locked) small',els=>els.map(e=>e.textContent));
 await page.screenshot({path:OUT+'/codex_en.png'});
 ok('in English the Archive roles are English',roles.length>1&&!roles.some(r=>/Armaiola|Officina|Pilota|Manutenzione/.test(r)),roles.slice(0,5).join(' | '));
 ok('no page errors',!errors.length,errors.join(' | '));
 fs.writeFileSync(OUT+'/verify_review_r48.json',JSON.stringify(report,null,1)+'\n');await browser.close();process.exit(report.checks.every(c=>c.pass)?0:1);})();
