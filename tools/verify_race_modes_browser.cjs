// Vortex challenge modes (D17) from Moon Refuge with Ash Docks already completed: walk to the Vortex,
// open each mode, race it with the lab pilot's keys (timed start, nitro on Space), and check what the
// mode promises: Time trial alone with a medal on the time, Elimination dropping cars at the gates,
// Rematch on the reversed course. Then reload and check the challenge record.
// Explicit save at the `moon` hub step. Real browser clock. Not a human or Android proof.
// Usage: node tools/verify_race_modes_browser.cjs [url] [outDir] [width=390] [height=844]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/v10.2',W='390',H='844']=process.argv.slice(2);
(async()=>{
 const {newProgress,stepIndex,saveProgress}=await import('../game/missions.mjs'),{getLayout,routeWaypoint}=await import('../game/layouts.mjs'),{racePilot,RACES_V9,raceMedal}=await import('../game/racing-v9.mjs');
 fs.mkdirSync(out,{recursive:true});const tag=`${W}x${H}`,checks=[],errors=[],shots=[];let failed=false;
 const check=(name,ok,detail)=>{checks.push({name,ok:!!ok,detail});if(!ok)failed=true;console.log(ok?'PASS':'FAIL',name,detail===undefined?'':JSON.stringify(detail));};
 const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
 try{
  const c=await b.newContext({viewport:{width:+W,height:+H},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  const s=newProgress();s.step=stepIndex('moon');s.cityChoice='workshop';Object.assign(s.narrative.flags,{'encounter.rook.completed':true,'weapon.tessa':true,'weapon.quickdraw':true});
  s.world.races={version:1,coins:15,events:{ash_docks:{completed:true,won:false,bestTime:30,bestRank:2}}};
  await c.addInitScript(raw=>{try{if(!localStorage.getItem('city-adventure-progress-v7'))localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-v4-settings',JSON.stringify({sound:true,reduced:false}));sessionStorage.setItem('city-studio-shown','1');}catch{}},saveProgress(s));
  await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
  let held=new Set();const keys=async want=>{for(const k of held)if(!want.has(k))await p.keyboard.up(k);for(const k of want)if(!held.has(k))await p.keyboard.down(k);held=want;};
  const settle=async()=>{for(let i=0;i<300;i++){await p.waitForTimeout(60);if(await p.isVisible('#card')){await p.click('#card');continue;}if(await p.isVisible('#talk')){await p.click('#next-line');continue;}const st=await p.evaluate(()=>cityAdventure.status());if(st.running&&!st.uiLock)return st;}};
  const toVortex=async()=>{let snap=await p.evaluate(()=>cityAdventure.snapshot());const v=snap.points.find(x=>x.id==='vortex');if(!v)return null;
   for(let i=0;i<400;i++){snap=await p.evaluate(()=>cityAdventure.snapshot());if(Math.hypot(v.x-snap.x,v.y-snap.y)<60)break;const q=routeWaypoint(getLayout(snap.layoutId),snap,v),want=new Set();if(q.x-snap.x>4)want.add('KeyD');if(q.x-snap.x<-4)want.add('KeyA');if(q.y-snap.y>4)want.add('KeyS');if(q.y-snap.y<-4)want.add('KeyW');await keys(want);await p.waitForTimeout(40);}
   await keys(new Set(['KeyE']));await p.waitForTimeout(250);await keys(new Set());await p.waitForSelector('#hub-panel',{state:'visible'});return v;};
  const drive=async id=>{let r=null,seen={cars:0,out:0,boost:false};
   for(let i=0;i<4000;i++){r=await p.evaluate(()=>{const s=cityAdventure.snapshot();return s.mode==='race'?s.race:null;});if(!r)break;
    seen.cars=Math.max(seen.cars,r.cars.length);seen.out=Math.max(seen.out,r.cars.filter(x=>x.out).length);
    if(r.status==='countdown'){await keys(new Set(r.countdown<.45?['KeyW']:[]));continue;}
    if(r.status!=='racing')break;const car=r.cars[0],a=racePilot(r,car),want=new Set();if(a.steer>.15)want.add('KeyD');if(a.steer<-.15)want.add('KeyA');if(a.throttle>.5&&!a.brake)want.add('KeyW');if(a.brake)want.add('KeyS');if(a.nitro)want.add('Space');await keys(want);if(car.boost>0)seen.boost=true;
    if(r.time>8&&!shots.includes(id)){shots.push(id);await p.screenshot({path:path.join(out,`race-modes-${tag}-${id.replace(':','-')}.png`)});}
    await p.waitForTimeout(30);}
   await keys(new Set());return {last:r,seen};};
  const play=async(mode,label)=>{
   await toVortex();const menu=(await p.locator('#hub-options').innerText()).replace(/\s+/g,' ');
   await p.locator('#hub-options button',{hasText:label}).click();await p.waitForSelector('#hub-panel',{state:'visible'});
   await p.locator('#hub-options button',{hasText:'La sfida di Veyra'}).click();
   await p.waitForSelector('#talk',{state:'visible'});const intro=(await p.locator('#talk').innerText()).replace(/\s+/g,' ');await p.click('#next-line');
   await p.waitForFunction(()=>cityAdventure.status().mode==='race');const race=await p.evaluate(()=>cityAdventure.snapshot().race.id);
   const res=await drive(race);await p.waitForSelector('#talk',{state:'visible',timeout:20000});const outro=(await p.locator('#talk').innerText()).replace(/\s+/g,' ');
   await settle();return {menu,intro,race,res,outro};};
  let st=await settle();check('Moon Refuge hub opens from the save',st?.mode==='hub',st?.mode);
  const tt=await play('tt','Contro il tempo');
  check('Vortex menu lists the series and the three challenges',/Sfida di Veyra/.test(tt.menu)&&/Contro il tempo/.test(tt.menu)&&/Eliminazione/.test(tt.menu)&&/Rivincita/.test(tt.menu),tt.menu.slice(0,200));
  check('Time trial: alone, medal times announced',tt.race==='tt:ash_docks'&&tt.res.seen.cars===1&&/Oro .* s, argento/.test(tt.intro),{race:tt.race,cars:tt.res.seen.cars,intro:tt.intro.slice(0,120)});
  let world=await p.evaluate(()=>cityAdventure.progress().world);const ttRec=world.races.modes?.['tt:ash_docks'];
  check('Time trial result saved with its medal',ttRec&&ttRec.medal===raceMedal(RACES_V9['tt:ash_docks'],ttRec.bestTime),{rec:ttRec,outro:tt.outro.slice(0,100)});
  const el=await play('elim','Eliminazione');
  check('Elimination: four cars, the last ones drop out at the gates',el.race==='elim:ash_docks'&&el.res.seen.cars===4&&el.res.seen.out>=1,el.res.seen);
  check('Veyra speaks after the elimination',/VEYRA/.test(el.outro),el.outro.slice(0,120));
  const rv=await play('rev','Rivincita');
  check('Rematch: the reversed course with Veyra',rv.race==='rev:ash_docks'&&rv.res.seen.cars===4&&/al contrario/i.test(rv.intro),{race:rv.race,intro:rv.intro.slice(0,120)});
  check('nitro used in the challenges',tt.res.seen.boost&&rv.res.seen.boost);
  world=await p.evaluate(()=>cityAdventure.progress().world);
  await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded);
  const stored=await p.evaluate(()=>JSON.parse(localStorage.getItem('city-adventure-progress-v7')).world);
  check('reload keeps the challenge record and coins',JSON.stringify(stored.races)===JSON.stringify(world.races)&&stored.coins===world.coins,{modes:Object.keys(stored.races?.modes||{}),coins:stored.coins});
  check('zero page errors',errors.length===0,errors);
  await c.close();
  fs.writeFileSync(path.join(out,`race-modes-report-${tag}.json`),JSON.stringify({result:failed?'FAIL':'PASS',viewport:[+W,+H],checks,screenshots:shots,limits:'Explicit save at the moon hub with Ash Docks completed; keyboard driving by the lab pilot rules; real browser clock. Not a human playtest or Android proof.'},null,1)+'\n');
 }finally{await b.close();}
 console.log(failed?'FAIL':'PASS','race modes verification');process.exit(failed?1:0);
})();
