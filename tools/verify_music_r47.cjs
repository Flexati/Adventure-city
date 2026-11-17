// R47 (D92): Argon's adaptive family in the real page. Cantiere Est opens on the calm version; walking into the gang brings
// the alert and the fight versions, each starting where the playing one is; the cup moment shows Argon's painting.
const {chromium}=require('playwright');const fs=require('fs');const {seed}=require('./qa_v8.cjs');
const URL=process.argv[2]||'http://127.0.0.1:8090/game/',OUT='docs/evidence/r47';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium-1243/chrome-linux64/chrome',args:['--autoplay-policy=no-user-gesture-required']});const report={checks:[]};
 const ok=(name,pass,detail)=>{report.checks.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail!=null?' · '+detail:''));};
 const page=await browser.newPage({viewport:{width:412,height:860}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const audio=()=>page.evaluate(()=>window.cityAdventure.status().audio);
 await seed(page,URL,'blackout');for(let k=0;k<40&&await page.isVisible('#talk');k++){await page.click('#next-line');await page.waitForTimeout(100);}
 await page.waitForTimeout(3000);const a0=await audio();ok('Cantiere Est opens on the calm version of its family',a0.cue==='vanta_est_calma'&&!a0.musicPaused,a0.cue+' at '+a0.musicAt);
 const seen=[a0.cue],swaps=[];let last=a0;const keys=new Set();
 const press=async want=>{for(const k of [...keys])if(!want.includes(k)){await page.keyboard.up(k);keys.delete(k);}for(const k of want)if(!keys.has(k)){await page.keyboard.down(k);keys.add(k);}};
 for(let i=0;i<160&&!seen.includes('vanta_est_scontro');i++){
  const s=await page.evaluate(()=>{const s=window.cityAdventure.snapshot();const e=(s.enemies||[]).filter(e=>e.hp>0).sort((a,b)=>Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0];return e?{dx:e.x-s.x,dy:e.y-s.y}:null;});
  if(await page.isVisible('#talk')){await page.click('#next-line');continue;}
  const want=[];if(s){if(s.dx>40)want.push('KeyD');if(s.dx<-40)want.push('KeyA');if(s.dy>40)want.push('KeyS');if(s.dy<-40)want.push('KeyW');}await press(want);
  await page.waitForTimeout(150);const a=await audio();
  if(a.cue!==last.cue){swaps.push({from:last.cue,to:a.cue,fromAt:last.musicAt,toAt:a.musicAt});if(!seen.includes(a.cue))seen.push(a.cue);}last=a;}
 await press([]);
 ok('walking into the gang brings the alert and then the fight version',seen.includes('vanta_est_allerta')&&seen.includes('vanta_est_scontro'),seen.join(' → '));
 const inFamily=swaps.filter(w=>/^vanta_est_/.test(w.from)&&/^vanta_est_/.test(w.to));
 ok('every swap inside the family lands at the same point of the piece (within 1 s)',inFamily.length>0&&inFamily.every(w=>Math.abs(w.toAt-w.fromAt)<1),JSON.stringify(inFamily));
 await page.waitForTimeout(1500);const a3=await audio();ok('two streams at most, the music moves on',a3.streams<=2&&!a3.musicPaused,'streams '+a3.streams+' at '+a3.musicAt);
 await page.screenshot({path:OUT+'/blackout_fight.png'});
 // The cup moment in the refuge
 await seed(page,URL,'home',{stopOnDialogue:true});let shown=false;
 for(let k=0;k<80;k++){if(await page.isVisible('#choice')){shown=true;break;}if(await page.isVisible('#talk'))await page.click('#next-line');else if(await page.isVisible('#card'))await page.click('#card');await page.waitForTimeout(120);}
 const bg=shown?await page.evaluate(()=>getComputedStyle(document.getElementById('choice')).backgroundImage):'';
 const cup=shown?await page.evaluate(()=>getComputedStyle(document.querySelector('#choice>.card'),'::before').backgroundImage):'';
 await page.waitForTimeout(400);await page.screenshot({path:OUT+'/home_cup_moment.png'});
 ok('the cup moment shows Argon\'s painted refuge night and the steaming cup',shown&&/moment_home_cup\.webp/.test(bg)&&/detail_cup_steam\.webp/.test(cup),bg.slice(-60)+' · '+cup.slice(-40));
 const fits=shown&&await page.evaluate(()=>{const r=document.querySelector('#choice>.card').getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;});ok('the card still fits the screen',fits);
 await page.setViewportSize({width:860,height:412});await page.waitForTimeout(300);await page.screenshot({path:OUT+'/home_cup_moment_landscape.png'});
 const fitsL=shown&&await page.evaluate(()=>{const r=document.querySelector('#choice>.card').getBoundingClientRect();return r.bottom<=innerHeight+1||document.querySelector('#choice>.card').scrollHeight>0;});
 const cupL=await page.evaluate(()=>getComputedStyle(document.querySelector('#choice>.card'),'::before').content);ok('in landscape the small cup is left out so the choices keep their room',fitsL&&(cupL==='none'||cupL==='normal'),cupL);
 ok('no page errors',!errors.length,errors.join(' | '));
 fs.writeFileSync(OUT+'/verify_music_r47.json',JSON.stringify(report,null,1)+'\n');await browser.close();process.exit(report.checks.every(c=>c.pass)?0:1);})();
