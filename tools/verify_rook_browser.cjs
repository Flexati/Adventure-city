// Seeded Blackout fixture, then ordinary keyboard/UI only. No gameplay state mutation.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
(async()=>{
 const {newProgress,saveProgress,stepIndex}=await import('../game/missions.mjs'),{makePolicy}=await import('../tests/helpers/autoplay.mjs');
 const out='/tmp/chronos-rook';fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:'/usr/bin/chromium'});const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true});
 const errors=[],requests=new Set(),seen=new Set(),checks=[];let held=new Set(),policy=makePolicy({reaction:.3,dodgeRate:.55,seed:2}),reloaded=false,complete=false,retries=0;
 const keys=async want=>{for(const key of held)if(!want.has(key))await p.keyboard.up(key);for(const key of want)if(!held.has(key))await p.keyboard.down(key);held=want;};
 const click=async id=>{await keys(new Set());await p.click(id);};
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());if(/rook.*\.(ogg|png)$/.test(r.url())&&r.status()===200)requests.add(r.url().split('/game/')[1]);});
 const progress=newProgress();progress.step=stepIndex('blackout');await p.addInitScript(raw=>{if(!sessionStorage.getItem('rook-fixture')){localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-v4-settings',JSON.stringify({sound:true,reduced:true,language:'it'}));localStorage.setItem('city-tutorial-v8','1');sessionStorage.setItem('rook-fixture','1');}sessionStorage.setItem('city-studio-shown','1');},saveProgress(progress));
 try{
 await p.clock.install();await p.goto('http://127.0.0.1:8090/game/');await p.waitForSelector('#continue',{state:'visible'});await click('#continue');
 for(let guard=0;guard<6500;guard++){
  await p.clock.runFor(100);const st=await p.evaluate(()=>window.cityAdventure.status());assert.deepEqual(errors,[]);
  if(await p.isVisible('#card')){await click('#card');continue;}
  if(await p.isVisible('#talk')){await click('#next-line');continue;}
  if(await p.isVisible('#city-choice')){await keys(new Set());const saved=await p.evaluate(()=>window.cityAdventure.progress());assert.equal(saved.status,'cleared');assert.equal(saved.narrative.flags['encounter.rook.completed'],true);assert.equal(saved.cityChoice,null);await p.screenshot({path:out+'/choice-after-rook.png'});await click('#choose-shelter');complete=true;break;}
  if(await p.isVisible('#result')){if(await p.isVisible('#retry')&&retries<2){retries++;policy=makePolicy({reaction:.3,dodgeRate:.65,seed:retries});await click('#retry');continue;}throw Error('Unexpected result before the Rook choice: '+await p.locator('#result').innerText());}
  if(!st.running||st.uiLock)continue;
  const s=await p.evaluate(()=>window.cityAdventure.snapshot()),boss=s.enemies.find(e=>e.bossKind==='rook');
  if(boss.state!=='dormant'&&!reloaded){
   await keys(new Set());assert.equal((await p.evaluate(()=>window.cityAdventure.progress())).checkpoint,'boss');await p.screenshot({path:out+'/checkpoint-before-reload.png'});await p.reload();await p.waitForSelector('#continue',{state:'visible'});await click('#continue');if(await p.isVisible('#card'))await click('#card');await p.clock.runFor(100);await p.waitForFunction(()=>window.cityAdventure.status().running);
   const restored=await p.evaluate(()=>window.cityAdventure.snapshot());assert.ok(restored.nodes.every(n=>n.on));assert.equal(restored.hp,restored.maxHp);assert.equal(restored.enemies.length,1);assert.equal(restored.enemies[0].hp,48);assert.deepEqual(restored.mines,[]);reloaded=true;checks.push('Rook checkpoint restores full boss/hero and secured relays; choice still pending');continue;
  }
  for(const [id,match]of [['aim',boss.state==='rookAim'],['mine',s.mines?.length>0],['phase-two',boss.phase===1]])if(match&&!seen.has(id)){seen.add(id);await p.screenshot({path:out+'/'+id+'.png'});}
  const i=policy(s),want=new Set();for(const [yes,key]of [[i.x>.3,'KeyD'],[i.x<-.3,'KeyA'],[i.y>.3,'KeyS'],[i.y<-.3,'KeyW'],[i.gun,'KeyJ'],[i.magic,'KeyL'],[i.dash,'ShiftLeft'],[i.duo,'KeyQ'],[i.interact,'KeyE']])if(yes)want.add(key);await keys(want);
 }
 assert.ok(complete,'reached city choice after defeating Rook');assert.ok(reloaded);assert.ok(seen.has('phase-two'));assert.ok(seen.has('aim'));assert.ok(seen.has('mine'));
 const status=await p.evaluate(()=>window.cityAdventure.status());assert.ok(status.audio.chronoPlayed.rook_aim>0);assert.ok(status.audio.chronoPlayed.rook_shot>0);assert.ok(status.audio.chronoPlayed.rook_mine>0);assert.ok(requests.has('audio/v10/rook_line.ogg'));assert.ok(requests.has('art/v09/rook.png'));
 const saved=await p.evaluate(()=>window.cityAdventure.progress());assert.equal(saved.cityChoice,'shelter');await p.reload();await p.waitForSelector('#continue',{state:'visible'});const after=await p.evaluate(()=>window.cityAdventure.progress()); // progress becomes active only on continue
 await click('#continue');await p.clock.runFor(100);assert.equal((await p.evaluate(()=>window.cityAdventure.progress())).cityChoice,'shelter');
 checks.push('relays → live Rook fight → phase two → choice in actual campaign','dedicated sprite, local score and SFX fetched/decoded/played','shelter choice persists after reload');
 const hash=crypto.createHash('sha256');for(const f of fs.readdirSync('game').filter(f=>f.endsWith('.mjs')).sort())hash.update(f).update(fs.readFileSync('game/'+f));
 fs.writeFileSync(out+'/report.json',JSON.stringify({sourceSha256:hash.digest('hex'),checks,retries,seen:[...seen],requests:[...requests],audio:status.audio,errors,fixture:'Seeded current Blackout, keyboard/UI only afterwards; accelerated browser clock',limits:'Not a human playtest, listening approval, full campaign traversal, physical Android test or commercial acceptance.'},null,2));console.log('PASS Rook browser fight, reload, assets/audio and saved choice');
 }catch(e){await keys(new Set());await p.screenshot({path:out+'/failure.png'});fs.writeFileSync(out+'/failure.json',JSON.stringify({error:e.message,status:await p.evaluate(()=>window.cityAdventure?.status()),snapshot:await p.evaluate(()=>window.cityAdventure?.snapshot()),errors},null,2));throw e;}finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
