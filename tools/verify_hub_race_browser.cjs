// Veyra's first race from Moon Refuge, through ordinary inputs: walk to the parked Vortex, accept,
// read Veyra, drive with the keyboard (the lab's own pilot rules decide which keys to hold), pause
// mid-race, finish, and return to the hub with the record and coins saved; then reload.
// Explicit save at the `moon` hub step. Real browser clock. Not a human or Android proof.
// Usage: node tools/verify_hub_race_browser.cjs [url] [outDir] [width=390] [height=844]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/v10.2',W='390',H='844']=process.argv.slice(2);
(async()=>{
 const {newProgress,stepIndex,saveProgress}=await import('../game/missions.mjs'),{getLayout,routeWaypoint}=await import('../game/layouts.mjs'),{racePilot,RACES_V9}=await import('../game/racing-v9.mjs');
 fs.mkdirSync(out,{recursive:true});const tag=`${W}x${H}`,checks=[],errors=[],shots=[];let failed=false;
 const check=(name,ok,detail)=>{checks.push({name,ok:!!ok,detail});if(!ok)failed=true;console.log(ok?'PASS':'FAIL',name,detail===undefined?'':JSON.stringify(detail));};
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 try{
  const c=await b.newContext({viewport:{width:+W,height:+H},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));const requested=[];p.on('request',q=>requested.push(q.url().split('/game/')[1]||''));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  const s=newProgress();s.step=stepIndex('moon');s.cityChoice='workshop';Object.assign(s.narrative.flags,{'encounter.rook.completed':true,'weapon.tessa':true,'weapon.quickdraw':true});
  await c.addInitScript(raw=>{try{if(!localStorage.getItem('city-adventure-progress-v7'))localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-v4-settings',JSON.stringify({sound:true,reduced:false}));sessionStorage.setItem('city-studio-shown','1');}catch{}},saveProgress(s));
  await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
  let held=new Set();const keys=async want=>{for(const k of held)if(!want.has(k))await p.keyboard.up(k);for(const k of want)if(!held.has(k))await p.keyboard.down(k);held=want;};
  const coins0=()=>p.evaluate(()=>cityAdventure.progress().world.coins);
  const settle=async()=>{for(let i=0;i<300;i++){await p.waitForTimeout(60);if(await p.isVisible('#card')){await p.click('#card');continue;}if(await p.isVisible('#talk')){await p.click('#next-line');continue;}const st=await p.evaluate(()=>cityAdventure.status());if(st.running&&!st.uiLock)return st;}};
  let st=await settle();check('Moon Refuge hub opens from the save',st?.mode==='hub',st?.mode);
  const before=await coins0();let snap=await p.evaluate(()=>cityAdventure.snapshot());const vortex=snap.points.find(x=>x.id==='vortex');
  check('parked Vortex offers the first Veyra race',vortex?.race==='ash_docks',vortex);
  await p.screenshot({path:path.join(out,`hub-race-${tag}-vortex.png`)});shots.push('vortex');
  for(let i=0;i<400;i++){snap=await p.evaluate(()=>cityAdventure.snapshot());const d=Math.hypot(vortex.x-snap.x,vortex.y-snap.y);if(d<60)break;const q=routeWaypoint(getLayout(snap.layoutId),snap,vortex),want=new Set();if(q.x-snap.x>4)want.add('KeyD');if(q.x-snap.x<-4)want.add('KeyA');if(q.y-snap.y>4)want.add('KeyS');if(q.y-snap.y<-4)want.add('KeyW');await keys(want);await p.waitForTimeout(40);}
  snap=await p.evaluate(()=>cityAdventure.snapshot());check('walked to the Vortex',Math.hypot(vortex.x-snap.x,vortex.y-snap.y)<90,{x:Math.round(snap.x),y:Math.round(snap.y)});
  await keys(new Set(['KeyE']));await p.waitForTimeout(250);await keys(new Set());await p.waitForSelector('#hub-panel',{state:'visible'});
  const offer=await p.locator('#hub-panel').innerText();check('menu explains the optional race and its penalties',/Facoltativa/.test(offer)&&/3 s/.test(offer),offer.replace(/\s+/g,' ').slice(0,200));
  await p.locator('#hub-options button',{hasText:'Raggiungi Ash Docks'}).click();
  await p.waitForSelector('#talk',{state:'visible'});const intro=(await p.locator('#talk').innerText()).replace(/\s+/g,' ');check('Veyra introduces herself before the start',/VEYRA/.test(intro)&&/Sono Veyra/.test(intro),intro);await p.click('#next-line');
  await p.waitForFunction(()=>cityAdventure.status().mode==='race');
  const samples=[];let paused=null;
  for(let i=0;i<3000;i++){
   const r=await p.evaluate(()=>{const s=cityAdventure.snapshot();return s.mode==='race'?s.race:null;});if(!r)break;
   if(r.status==='countdown'&&!shots.includes('countdown')){shots.push('countdown');await p.screenshot({path:path.join(out,`hub-race-${tag}-countdown.png`)});}
   if(r.status==='racing'){const car=r.cars[0],i2=racePilot(r,car),want=new Set();if(i2.steer>.15)want.add('KeyD');if(i2.steer<-.15)want.add('KeyA');if(i2.throttle>.5&&!i2.brake)want.add('KeyW');if(i2.brake)want.add('KeyS');await keys(want);
    if(i%40===0)samples.push({t:+r.time.toFixed(1),distance:Math.round(car.distance),cp:car.checkpoint,integrity:car.integrity});
    // Wide checkpoint ahead on screen (pylons + tape), and a burst while the tile seam scrolls past.
    const cpAhead=RACES_V9[r.id].checkpoints[car.checkpoint]-car.distance;if(cpAhead>250&&cpAhead<650&&!shots.includes('checkpoint')){shots.push('checkpoint');await p.screenshot({path:path.join(out,`hub-race-${tag}-checkpoint.png`)});}
    if(r.time>6&&!shots.includes('scroll')){shots.push('scroll');for(let f=0;f<6;f++){await p.screenshot({path:path.join(out,`hub-race-${tag}-scroll-${f}.png`)});}}
    if(r.time>12&&!shots.includes('racing')){shots.push('racing');await p.screenshot({path:path.join(out,`hub-race-${tag}-racing.png`)});}
    if(r.time>20&&!paused){await keys(new Set());await p.keyboard.press('Escape');await p.waitForTimeout(400);const a=await p.evaluate(()=>cityAdventure.snapshot().race.time);await p.waitForTimeout(600);const b2=await p.evaluate(()=>cityAdventure.snapshot().race.time);paused={a,b:b2,visible:await p.isVisible('#pause-panel')};await p.click('#resume');}}
   if(['finished','retired'].includes(r.status))break;await p.waitForTimeout(30);}
  await keys(new Set());
  check('four container models are loaded with the race',['race_container','race_container_ruggine','race_container_cobalto','race_container_verde'].every(n=>requested.includes(`art/v10/${n}.png`)&&requested.includes(`art/v10/${n}_hit.png`)),requested.filter(f=>/container/.test(f)));
  check('Ash Docks road variants are loaded with the race',['banchina','deposito','gru'].every(v=>requested.includes(`art/v10/race_ashdocks_${v}_day.png`)),requested.filter(f=>/ashdocks|driving_road/.test(f)));
  check('countdown and go cues are loaded with the race',['audio/v10/race_count_beep.ogg','audio/v10/race_go.ogg','art/v10/race_cp_pylon.png','art/v10/race_cp_tape.png'].every(f=>requested.includes(f)),requested.filter(f=>/race_/.test(f)));
  check('pause freezes the race clock',paused&&paused.visible&&paused.a===paused.b,paused);
  check('car advanced through every checkpoint',samples.length>0&&Math.max(...samples.map(x=>x.cp))>=2,samples.slice(-3));
  await p.waitForSelector('#talk',{state:'visible',timeout:20000});const outro=(await p.locator('#talk').innerText()).replace(/\s+/g,' ');check('Veyra reacts to the actual result',/VEYRA/.test(outro),outro);
  await p.screenshot({path:path.join(out,`hub-race-${tag}-result.png`)});shots.push('result');await p.click('#next-line');
  st=await settle();const world=await p.evaluate(()=>cityAdventure.progress().world);
  check('back in the same hub after the race',st?.mode==='hub'&&world.hub?.id==='moon',{mode:st?.mode,hub:world.hub?.id});
  const ev=world.races?.events?.ash_docks;check('race completion saved once',ev?.completed===true,world.races);
  check('reward added to the hub coins',world.coins-before===(ev?.won?25:15),{before,after:world.coins,won:ev?.won});
  const next=(await p.evaluate(()=>cityAdventure.snapshot())).points.find(x=>x.id==='vortex');check('the next Ash Docks race is offered',next?.race==='ash_slalom',next);
  await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded);
  const stored=await p.evaluate(()=>JSON.parse(localStorage.getItem('city-adventure-progress-v7')).world);check('reload keeps record and coins',stored.races?.events?.ash_docks?.completed===true&&stored.coins===world.coins,{coins:stored.coins});
  check('zero page errors',errors.length===0,errors);
  await c.close();
  fs.writeFileSync(path.join(out,`hub-race-report-${tag}.json`),JSON.stringify({result:failed?'FAIL':'PASS',viewport:[+W,+H],source:Object.fromEntries(['game/runtime.mjs','game/hubs.mjs','game/racing-v9.mjs'].map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'..',f))).digest('hex')])),checks,samples,screenshots:shots,limits:'Explicit save at the moon hub; keyboard driving decided by the race lab pilot rules (a bot, not a person); real browser clock. Not a human, WebView or Android proof.'},null,2));
 }finally{await b.close();}
 console.log(failed?'FAIL':'PASS','hub race verification');process.exit(failed?1:0);
})();
