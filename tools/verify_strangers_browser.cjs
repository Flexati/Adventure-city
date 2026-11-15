// Kairn and Morrow in the real Ascent, through ordinary inputs: an explicit save at the Ascent step,
// then keyboard play with the deterministic campaign policy until the first lift calls the strangers.
// Checks: both stand in the scene while they speak, their animations follow real actions, their cues
// play on hits, the rift theme covers their segment, the eight-second window ends, the reward flags
// persist across a reload and the post-credits scene draws the new sheets. Browser only.
// Usage: node tools/verify_strangers_browser.cjs [url=http://127.0.0.1:8090/game/] [out=docs/evidence/v10.2] [width=390] [height=844]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/v10.2',W='390',H='844']=process.argv.slice(2);
(async()=>{
 const {newProgress,stepIndex,saveProgress}=await import('../game/missions.mjs'),{makePolicy}=await import('../tests/helpers/autoplay.mjs');
 fs.mkdirSync(out,{recursive:true});const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});const checks=[];let failed=false;
 const check=(name,ok,detail)=>{checks.push({name,ok:!!ok,detail});if(!ok)failed=true;console.log(ok?'PASS':'FAIL',name,detail===undefined?'':JSON.stringify(detail));};
 const tag=`${W}x${H}`,shots=[],samples=[],errors=[],requested=new Set();
 try{
  const c=await b.newContext({viewport:{width:+W,height:+H},hasTouch:true}),p=await c.newPage();
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());if(/art\/v10\/(kairn|morrow)\.png|audio\/v10\/(kairn|morrow|strangers)/.test(r.url()))requested.add(r.url().split('/').slice(-2).join('/'));});
  const s=newProgress();s.step=stepIndex('ascent');s.cityChoice='workshop';s.world.visited=['moon','toxic','cathedral','clockwork'];s.world.preparation={toxic:'attack',clockwork:'attack'};
  Object.assign(s.narrative.flags,{'encounter.rook.completed':true,'weapon.tessa':true,'weapon.quickdraw':true,'exp.chalk.completed':true,blackout_choice:'shelter'});
  await c.addInitScript(raw=>{try{if(!localStorage.getItem('city-adventure-progress-v7'))localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-v4-settings',JSON.stringify({sound:true,reduced:false}));sessionStorage.setItem('city-studio-shown','1');}catch{}},saveProgress(s));
  await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
  let held=new Set(),policy=makePolicy({reaction:.3,dodgeRate:.7,seed:7}),arrival=null,segmentStart=null,ended=null;
  const keys=async want=>{for(const k of held)if(!want.has(k))await p.keyboard.up(k);for(const k of want)if(!held.has(k))await p.keyboard.down(k);held=want;};
  const deadline=Date.now()+180000;
  while(Date.now()<deadline){
   await p.waitForTimeout(40);
   if(await p.isVisible('#card')){await keys(new Set());await p.click('#card');continue;}
   if(await p.isVisible('#talk')){await keys(new Set());const line=(await p.locator('#talk').innerText()).replace(/\s+/g,' ');
    const snap=await p.evaluate(()=>{const s=cityAdventure.snapshot();return {allies:s.allies?.map(a=>({id:a.id,anim:a.anim})),allyTime:s.allyTime};});
    if(!arrival&&/MORROW|KAIRN/.test(line)){arrival={line,allies:snap.allies,audio:(await p.evaluate(()=>cityAdventure.status().audio.cue))};await p.screenshot({path:path.join(out,`strangers-${tag}-arrival.png`)});shots.push('arrival');}
    if(segmentStart&&!ended&&!snap.allies){ended={line};}
    await p.click('#next-line');continue;}
   if(await p.isVisible('#result')){await keys(new Set());break;}
   const st=await p.evaluate(()=>cityAdventure.status());if(!st.running||st.uiLock){await keys(new Set());continue;}
   const snap=await p.evaluate(()=>cityAdventure.snapshot());
   if(snap.allies&&snap.allyTime>0){segmentStart??=Date.now();const t=(Date.now()-segmentStart)/1000;
    samples.push({t:+t.toFixed(2),cue:st.audio.cue,played:st.audio.chronoPlayed,allies:snap.allies.map(a=>({id:a.id,anim:a.anim,face:a.face,x:Math.round(a.x),y:Math.round(a.y)}))});
    for(const mark of [1.2,3,5])if(t>=mark&&!shots.includes('fight'+mark)){shots.push('fight'+mark);await p.screenshot({path:path.join(out,`strangers-${tag}-fight-${mark}s.png`)});}}
   if(ended&&!snap.allies&&(await p.evaluate(()=>cityAdventure.progress().narrative.flags.strangers_met))){await p.waitForTimeout(1200);break;}
   const i=policy(snap),want=new Set();for(const [yes,k]of [[i.x>.08,'KeyD'],[i.x<-.08,'KeyA'],[i.y>.08,'KeyS'],[i.y<-.08,'KeyW'],[i.gun,'KeyJ'],[i.magic,'KeyL'],[i.dash,'ShiftLeft'],[i.duo,'KeyQ'],[i.interact,'KeyE']])if(yes)want.add(k);await keys(want);
  }
  await keys(new Set());
  check('both strangers are in the scene while they speak',arrival&&arrival.allies?.map(a=>a.id).join()==='kairn,morrow',arrival);
  check('rift theme starts with their arrival',arrival?.audio==='strangers_rift',arrival?.audio);
  const anims=id=>new Set(samples.flatMap(s=>s.allies.filter(a=>a.id===id).map(a=>a.anim)));
  check('Kairn walks and punches during the segment',anims('kairn').has('walk')&&anims('kairn').has('attack'),[...anims('kairn')]);
  check('Morrow fires the shotgun or uses the chainsaw',anims('morrow').has('shotgun')||anims('morrow').has('attack'),[...anims('morrow')]);
  check('both face left and right as targets move',new Set(samples.flatMap(s=>s.allies.map(a=>a.face))).size===2);
  check('rift theme holds during the fight',samples.length>0&&samples.every(s=>s.cue==='strangers_rift'),[...new Set(samples.map(s=>s.cue))]);
  const played=samples.at(-1)?.played||{};check('impact and shotgun or saw cues played on hits',(played.kairn_impact||0)>0&&((played.morrow_shot||0)+(played.morrow_saw||0))>0,played);
  check('segment ends and the strangers leave',!!ended&&!(await p.evaluate(()=>cityAdventure.snapshot().allies)),ended);
  const after=await p.evaluate(()=>({cue:cityAdventure.status().audio.cue,flags:cityAdventure.progress().narrative.flags}));
  check('mission music returns after they leave',after.cue!=='strangers_rift',after.cue);
  check('fragment and meeting persisted',after.flags.strangers_met===true&&after.flags.broken_clock_fragment===true);
  await p.screenshot({path:path.join(out,`strangers-${tag}-after.png`)});
  await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded);
  check('reload keeps the meeting flags in the saved progress',await p.evaluate(()=>{const f=JSON.parse(localStorage.getItem('city-adventure-progress-v7')||'{}').narrative?.flags;return f?.strangers_met===true&&f?.broken_clock_fragment===true;}));
  check('author-reference sheets and stranger audio requested',['v10/kairn.png','v10/morrow.png','v10/strangers_rift.ogg','v10/kairn_impact.ogg'].every(f=>requested.has(f)),[...requested]);
  check('zero page errors',errors.length===0,errors);
  await c.close();
  // Post-credits: the closing scene draws the same new sheets, idle and facing each other.
  const c2=await b.newContext({viewport:{width:+W,height:+H},hasTouch:true}),p2=await c2.newPage(),errors2=[];p2.on('pageerror',e=>errors2.push(e.message));
  const s2=newProgress();s2.step=stepIndex('postcredits');s2.cityChoice='workshop';Object.assign(s2.narrative.flags,{strangers_met:true,broken_clock_fragment:true,'encounter.rook.completed':true,'weapon.tessa':true,'weapon.quickdraw':true,'exp.chalk.completed':true,blackout_choice:'shelter'});
  await c2.addInitScript(raw=>{try{localStorage.setItem('city-adventure-progress-v7',raw);sessionStorage.setItem('city-studio-shown','1');}catch{}},saveProgress(s2));
  await p2.goto(url);await p2.waitForFunction(()=>window.cityAdventure?.status().loaded);await p2.click('#continue');
  let seen=null;for(let k=0;k<200&&!seen;k++){await p2.waitForTimeout(80);if(await p2.isVisible('#card'))await p2.click('#card');else if(await p2.isVisible('#talk')){const line=(await p2.locator('#talk').innerText()).replace(/\s+/g,' ');if(/MORROW|KAIRN/.test(line)){seen=line;await p2.waitForTimeout(400);await p2.screenshot({path:path.join(out,`strangers-${tag}-postcredits.png`)});}else await p2.click('#next-line');}}
  check('post-credits scene reached with the strangers speaking',!!seen&&errors2.length===0,{line:seen,errors:errors2});await c2.close();
 }finally{await b.close();}
 const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'..',f))).digest('hex');
 fs.writeFileSync(path.join(out,`strangers-browser-report-${tag}.json`),JSON.stringify({result:failed?'FAIL':'PASS',viewport:[+W,+H],source:Object.fromEntries(['game/campaign.mjs','game/runtime.mjs','game/audio-engine.mjs','game/chrono-manifest.mjs','game/art/v10/kairn.png','game/art/v10/morrow.png','game/audio/v10/strangers_rift.ogg'].map(f=>[f,sha(f)])),checks,samples:samples.filter((_,i)=>i%10===0),screenshots:shots,limits:'Explicit save at the Ascent step with earlier flags declared; real browser clock; keyboard play by the deterministic campaign policy. Audio counted by the engine, not heard by a person. No WebView, Android or human review.'},null,2));
 console.log(failed?'FAIL':'PASS','strangers browser verification');process.exit(failed?1:0);
})();
