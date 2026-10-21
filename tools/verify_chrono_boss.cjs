// Final mission fixture, then ordinary player keys only. Virtual clock: not an FPS test.
const {chromium}=require('playwright'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
(async()=>{
 const {makePolicy}=await import('../tests/helpers/autoplay.mjs'),out='docs/evidence/chrono_shadows',b=await chromium.launch({executablePath:process.env.CHROMIUM||'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.clock.install();
 await p.goto('http://127.0.0.1:8090/game/');await p.evaluate(()=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:false}));localStorage.setItem('city-adventure-progress-v6',JSON.stringify({version:6,step:18,status:'playing',upgrade:'power',cityChoice:'workshop',narrative:{version:1,thermal:60,flags:{opening_completed:true,unit9_saved:true},choices:{},beatsSeen:[]},stats:{deaths:0,seconds:0}}));});await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
 let policy=makePolicy({reaction:.3,dodgeRate:.7,seed:7}),held=new Set(),deaths=0,won=false,phases=new Set(),lastBoss=null,lastCommand=[];const trace=[];
 async function keys(want){for(const k of held)if(!want.has(k))await p.keyboard.up(k);for(const k of want)if(!held.has(k))await p.keyboard.down(k);held=want;}
 const canvas=async(name)=>{const data=await p.$eval('#world',c=>c.toDataURL('image/png').split(',')[1]);fs.writeFileSync(path.join(out,name+'.png'),Buffer.from(data,'base64'));};
 for(let i=0;i<6000;i++){
  await p.clock.runFor(100);
  if(await p.isVisible('#card')){await p.click('#card');continue;}
  if(await p.isVisible('#talk')){await keys(new Set());await p.click('#next-line');continue;}
  if(await p.isVisible('#retry')){assert.ok(++deaths<=3,'boss fixture repeatedly failed');await p.click('#retry');policy=makePolicy({reaction:.3,dodgeRate:.7,seed:7+deaths});continue;}
  const s=await p.evaluate(()=>window.cityAdventure.snapshot());if(s.mode!=='foot')continue;const boss=s.enemies.find(e=>e.boss);
  if(boss&&boss.state!=='dormant'&&!phases.has(boss.phase)){phases.add(boss.phase);await canvas('boss-live-phase-'+boss.phase);trace.push({phase:boss.phase,hp:boss.hp,time:s.time});}
  if(boss?.hp<=0&&lastBoss?.hp>0){await keys(new Set());await canvas('boss-player-final-hit');for(let j=0;j<40;j++){const elapsed=await p.evaluate(()=>.7-window.cityAdventure.snapshot().enemies.find(e=>e.boss).deathAnim);if(elapsed>=.2)break;await p.clock.runFor(30);}await canvas('boss-collapse');for(let j=0;j<40;j++){const elapsed=await p.evaluate(()=>.7-window.cityAdventure.snapshot().enemies.find(e=>e.boss).deathAnim);if(elapsed>=.52)break;await p.clock.runFor(30);}await canvas('boss-reward-portal');won=true;trace.push({finalHit:{previousHp:lastBoss.hp,hp:boss.hp,playerCommands:lastCommand,deathAnim:boss.deathAnim}});break;}
  const input=policy(s),want=new Set();for(const [yes,key]of [[input.x>.3,'KeyD'],[input.x<-.3,'KeyA'],[input.y>.3,'KeyS'],[input.y<-.3,'KeyW'],[input.gun,'KeyJ'],[input.magic,'KeyL'],[input.dash,'ShiftLeft'],[input.duo,'KeyQ'],[input.interact,'KeyE']])if(yes)want.add(key);await keys(want);lastCommand=[...want];lastBoss=boss;
 }
 fs.writeFileSync(path.join(out,'boss-playthrough.json'),JSON.stringify({environment:'Chromium; seeded existing final mission; virtual clock; sound muted; not device/FPS evidence',input:'ordinary keys only after checkpoint fixture',won,deaths,trace,errors},null,2)+'\n');assert.ok(won);assert.deepEqual(errors,[]);await b.close();console.log('Existing final boss defeated by player inputs; visual sequence captured');
})().catch(e=>{console.error(e);process.exit(1)});
