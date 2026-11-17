// R45 (D90): the bond in the real page. Seeds a save, plays the home moment and the roof to the ending screen.
const {chromium}=require('playwright');const fs=require('fs');const {seed}=require('./qa_v8.cjs');
const URL=process.argv[2]||'http://127.0.0.1:8090/game/',OUT='docs/evidence/r45';
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'});const report={checks:[]};
 const ok=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail?' · '+detail:''));};
 const page=await browser.newPage({viewport:{width:412,height:860},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // A · the cup at home
 await seed(page,URL,'home',{stopOnDialogue:true});let id='';
 for(let k=0;k<60&&!id;k++){if(await page.isVisible('#choice')){id=await page.$eval('#choice',e=>e.dataset.choiceId);break;}if(await page.isVisible('#talk'))await page.click('#next-line');await page.waitForTimeout(120);}
 ok('home: the cup moment opens after the evening lines',id==='home_cup',id);await page.screenshot({path:OUT+'/home_cup_choice.png'});
 await page.click('#choice-options button:nth-child(2)');await page.waitForTimeout(200);
 const notice=await page.textContent('#notice');ok('home: «Lulú lo ricorderà.» after the choice',/Lulú lo ricorderà/.test(notice||''),notice);
 const said=[];for(let k=0;k<12&&await page.isVisible('#talk');k++){said.push(await page.textContent('#line'));await page.click('#next-line');await page.waitForTimeout(100);}
 ok('home: her reaction, then the blackout',said.includes('Stasera non conto. Ci sei tu.')&&said.at(-1)==='Tutte le finestre si spengono.',said.join(' | '));
 // B · the roof to the ending screen, best ending
 const flags={'bond.home_cup':'window','bond.radio_dark':'answer','bond.chalk_word':'wait','bond.last_lift':'stay',glass_truth:true,strangers_met:true,strangers_trust:'keep',rooftop_answer:'them',heat:'unit9'};
 await seed(page,URL,'rooftop_end',{stopOnDialogue:true,thermal:70,flags});const lines=[];let mode='';
 for(let k=0;k<160;k++){mode=await page.evaluate(()=>window.cityAdventure.status().mode);if(mode==='ending')break;
  if(await page.isVisible('#choice')){await page.click('#choice-options button:nth-child(1)');}else if(await page.isVisible('#talk')){lines.push(await page.textContent('#line'));await page.click('#next-line');}else if(await page.isVisible('#credits-skip'))await page.click('#credits-skip');else if(await page.isVisible('#card'))await page.click('#card');await page.waitForTimeout(100);}
 ok('roof: the ending coda follows the hand',lines.includes('Prima. Come si fa.')&&lines.includes('Resto.'),lines.slice(-8).join(' | '));
 ok('the ending screen opens',mode==='ending',mode);await page.click('#credits-skip').catch(()=>{});await page.waitForTimeout(400);
 const name=await page.textContent('#ending-name'),last=await page.$$eval('#epilogue li',l=>l.at(-1)?.textContent);
 ok('the ending is named, numbered and counted',/^Finale 1 · Ora nuovaFinali scoperti: 1 su 5$/.test(name),name);
 ok('the epilogue closes on the bond',/due tazze/.test(last||''),last);
 await page.screenshot({path:OUT+'/ending_ora_nuova.png',fullPage:false});
 ok('no page errors',!errors.length,errors.join(' | '));
 fs.writeFileSync(OUT+'/verify_bond_r45.json',JSON.stringify(report,null,1)+'\n');await browser.close();process.exit(report.checks.every(c=>c.pass)?0:1);})();
