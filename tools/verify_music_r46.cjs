// R46 (D91): the music follows the story in the real page. The radio moment brings Lulú's theme and gives the stage
// its piece back; the «Due strade» ending closes on Nox's theme; the score streams and moves.
const {chromium}=require('playwright');const fs=require('fs');const {seed}=require('./qa_v8.cjs');
const URL=process.argv[2]||'http://127.0.0.1:8090/game/',OUT='docs/evidence/r46';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',args:['--autoplay-policy=no-user-gesture-required']});const report={checks:[]};
 const ok=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail!=null?' · '+detail:''));};
 const page=await browser.newPage({viewport:{width:412,height:860}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const audio=()=>page.evaluate(()=>window.cityAdventure.status().audio);
 // A · the radio in the lower levels
 await seed(page,URL,'below',{stopOnDialogue:true});let during=null;
 for(let k=0;k<60;k++){if(await page.isVisible('#choice')){during=(await audio()).cue;break;}if(await page.isVisible('#talk'))await page.click('#next-line');await page.waitForTimeout(120);}
 ok('radio moment: Lulú\'s theme while her voice is on the radio',during==='lulu',during);
 await page.click('#choice-options button');for(let k=0;k<20&&await page.isVisible('#talk');k++){await page.click('#next-line');await page.waitForTimeout(100);}
 await page.waitForTimeout(400);const after=(await audio()).cue;ok('after the moment the stage gets its own piece back',after==='below_descent',after);
 await page.keyboard.down('KeyW');await page.waitForTimeout(1200);await page.keyboard.up('KeyW');const a1=await audio();await page.waitForTimeout(1500);const a2=await audio();
 ok('the score streams and moves on',a1.context==='running'&&!a2.musicPaused&&a2.musicAt>a1.musicAt,a1.musicAt+' → '+a2.musicAt);
 // B · «Due strade» closes on Nox's theme
 const cold={'bond.home_cup':'door','bond.radio_dark':'off','bond.chalk_word':'arrow','bond.last_lift':'quiet',glass_truth:false};
 await seed(page,URL,'rooftop_end',{stopOnDialogue:true,thermal:40,flags:cold});let mode='';
 for(let k=0;k<160;k++){mode=await page.evaluate(()=>window.cityAdventure.status().mode);if(mode==='ending')break;
  if(await page.isVisible('#choice'))await page.click('#choice-options button:nth-child(2)');else if(await page.isVisible('#talk'))await page.click('#next-line');else if(await page.isVisible('#credits-skip'))await page.click('#credits-skip');else if(await page.isVisible('#card'))await page.click('#card');await page.waitForTimeout(100);}
 const end=(await audio()).cue,name=await page.textContent('#ending-name');
 ok('the ending screen of «Due strade» plays Nox\'s theme',mode==='ending'&&end==='nox'&&/Due strade/.test(name),end+' · '+name);
 ok('no page errors',!errors.length,errors.join(' | '));
 fs.writeFileSync(OUT+'/verify_music_r46.json',JSON.stringify(report,null,1)+'\n');await browser.close();process.exit(report.checks.every(c=>c.pass)?0:1);})();
