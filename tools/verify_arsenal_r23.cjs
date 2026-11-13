// R23 (D69): the market arsenal, the regional economy and the special moves, exercised through the real UI in Chromium.
// A. Every shop of every village: each item on sale is bought with a tap, the wallet drops by the listed price, the
//    buttons fit the screen (or their list scrolls), scrap is exchanged, an item is sold. Then reload: the save holds.
// B. The bag: every owned weapon, every unlocked move and every turbo stage can be made active.
// C. Combat: each market weapon and each special move is fired in a live mission; ammunition drops, nothing throws.
// D. English: no line of the shops or the bag is left in Italian.
// Seeded saves, real browser clock. Not a human playtest and not a phone.
// Usage: node tools/verify_arsenal_r23.cjs <url> <out-dir>      (output outside the repo; ONLY_FIGHTS=1 runs part C alone)
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out]=process.argv.slice(2);
if(!out){console.error('Usage: node tools/verify_arsenal_r23.cjs <url> <out-dir>');process.exit(2);}
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const {stepIndex}=await import('../game/missions.mjs'),{HUBS,HUB_ITEMS,hubPoints,hubCatalog,itemPrice}=await import('../game/hubs.mjs'),{MARKET_WEAPON_IDS,HERO_MOVES,WEAPONS_V9}=await import('../game/weapons-v9.mjs'),{TURBO_TIERS}=await import('../game/arsenal-data.mjs');
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),errors=[],report={shops:[],bag:[],combat:[],english:[]};
 const page=async(lang)=>{const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});p.lang=lang;return p;};
 const boot=async(p,raw)=>{await p.goto(url);await p.evaluate(({raw,lang})=>{sessionStorage.setItem('city-studio-shown','1');localStorage.setItem('city-tutorial-v8','1');localStorage.setItem('city-adventure-progress-v7',JSON.stringify(raw));if(lang)localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:false,language:lang}));},{raw,lang:p.lang});
  await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded&&window.cityAdventure.status().mode==='menu');await p.click('#continue');};
 const hubSave=async(hub,service,world={})=>{const raw=JSON.parse(await qa.makeSave('finale',{flags:{separated:true,reunited:true,'weapon.tessa':true}})),pt=hubPoints(hub).find(q=>q.id===service)||hubPoints(hub)[0];
  Object.assign(raw.world,{coins:3000,scrap:40,visited:Object.keys(HUBS)},world);raw.world.hub={id:hub,pov:HUBS[hub].pov,reason:'campaign',returnStep:stepIndex('finale'),x:pt.x,y:pt.y};return raw;};
 const inHub=p=>p.waitForFunction(()=>window.cityAdventure.status().mode==='hub'&&window.cityAdventure.status().running);
 const world=p=>p.evaluate(()=>window.cityAdventure.progress().world);
 const fits=p=>p.evaluate(()=>{const bad=[];for(const el of document.querySelectorAll('#interior-options button,#hub-options button')){if(!el.offsetParent)continue;const r=el.getBoundingClientRect(),box=el.parentElement.getBoundingClientRect(),scrolls=el.parentElement.scrollHeight>el.parentElement.clientHeight+1||el.closest('.card')?.scrollHeight>el.closest('.card')?.clientHeight+1;
   if(r.height<44||r.left<0||r.right>innerWidth+1||(!scrolls&&(r.top<box.top-1||r.bottom>innerHeight+1)))bad.push(el.dataset.action||el.textContent);}return bad;});
 try{
  // A. Shops
  for(const hub of (process.env.ONLY_FIGHTS?[]:Object.keys(HUBS)))for(const service of HUBS[hub].services){
   const cat=hubCatalog(hub,service).filter(id=>!HUB_ITEMS[id].part);if(!cat.length)continue;
   const p=await page();await boot(p,await hubSave(hub,service));await inHub(p);
   await p.click('#interact');await p.waitForSelector('#interior',{state:'visible'});await p.click('#interior [data-action="shop"]');
   const listed=await p.$$eval('#interior-options [data-action^="buy:"]',els=>els.map(e=>e.dataset.action.slice(4)));
   assert.deepEqual(listed.filter(id=>cat.includes(id)),cat,`${hub}/${service} lists its catalogue`);assert.deepEqual(await fits(p),[],`${hub}/${service} buttons fit or scroll`);
   for(const id of cat){const before=await world(p),price=itemPrice({world:before},hub,id);await p.locator(`#interior-options [data-action="buy:${id}"]`).click();await p.waitForTimeout(90);
    if(await p.isVisible('#talk'))for(let k=0;k<6&&await p.isVisible('#talk');k++){await p.click('#next-line');await p.waitForTimeout(60);}
    const after=await world(p);assert.equal(after.inventory[id]>=1,true,`${hub}/${service}: ${id} is in the bag`);assert.equal(before.coins-after.coins,price,`${hub}/${service}: ${id} costs what the label says`);}
   const exch=p.locator('#interior-options [data-action="exchange"]');
   if(await exch.count()){const b=await world(p);await exch.click();await p.waitForTimeout(90);const a=await world(p);assert.equal(a.scrap,0);assert.equal(a.coins-b.coins,Math.floor(b.scrap/2),`${hub}/${service}: two scrap for one coin`);}
   const sell=p.locator('#interior-options [data-action="sellmenu"]');
   if(await sell.count()){await sell.click();await p.waitForTimeout(60);assert.deepEqual(await fits(p),[],`${hub}/${service} sell list fits or scrolls`);const first=p.locator('#interior-options [data-action^="sell:"]').first(),sid=(await first.getAttribute('data-action')).slice(5),b=await world(p);await first.click();await p.waitForTimeout(90);const a=await world(p);
    assert.equal(a.coins-b.coins,Math.max(1,Math.round(HUB_ITEMS[sid].price*.6)),`${hub}/${service}: ${sid} sells at 60 %`);await p.click('#interior-options [data-action="back"]');}
   await p.click('#interior-options [data-action="back"]');await p.click('#interior [data-action="leave"]');await p.waitForSelector('#interior',{state:'hidden'});
   const kept=await world(p);await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');await inHub(p);assert.deepEqual(await world(p),kept,`${hub}/${service}: the save survives a reload`);
   report.shops.push({hub,service,items:cat.length});await p.context().close();
  }
  // B. Bag: weapons, moves and turbo stages, in Italian and in English
  for(const lang of (process.env.ONLY_FIGHTS?[]:['it','en'])){
   const inv=Object.fromEntries([...MARKET_WEAPON_IDS,'vest','rig_scout','echo','chrono_lens','turbo_mk2','turbo_mk3'].map(k=>[k,1]));
   const p=await page(lang),raw=await hubSave('axis_crown','smith',{inventory:inv});await boot(p,raw);await inHub(p);
   const labels=[];
   const open=async()=>{await p.click('#bag');await p.waitForSelector('#hub-panel',{state:'visible'});};
   await open();assert.deepEqual(await fits(p),[],'bag buttons fit or scroll ('+lang+')');
   const actions=await p.$$eval('#hub-options button',els=>els.map(e=>e.dataset.action).filter(Boolean));labels.push(...await p.$$eval('#hub-options button',els=>els.map(e=>e.textContent)));
   assert.equal(actions.filter(a=>a.startsWith('move:')).length,HERO_MOVES[HUBS.axis_crown.pov].length,'act IV lists the four moves');
   assert.equal(actions.filter(a=>a.startsWith('turbo:')).length,TURBO_TIERS.length,'act IV lists the five turbo stages');
   await p.keyboard.press('Escape').catch(()=>{});
   for(const a of actions){if(!await p.isVisible('#hub-panel'))await open();await p.locator(`#hub-options [data-action="${a}"]`).click();await p.waitForTimeout(70);
    const pr=await p.evaluate(()=>window.cityAdventure.progress());
    if(a.startsWith('move:'))assert.equal(pr.narrative.flags['move.active.'+HUBS.axis_crown.pov],a.slice(5),a+' becomes the active move');
    if(a.startsWith('turbo:'))assert.equal(pr.world.equipment.turbo,a.slice(6),a+' is fitted');
    if(a.startsWith('item:')&&HUB_ITEMS[a.slice(5)].arsenalId)assert.equal(pr.world.equipment.weapon,a.slice(5),a+' is equipped');}
   if(lang==='en'){const left=await p.evaluate(()=>window.cityAdventure.locale().untranslated);assert.deepEqual(left,[],'English bag has no Italian line: '+JSON.stringify(left));report.english=labels;}
   const kept=await world(p);await p.reload();await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');await inHub(p);assert.deepEqual(await world(p),kept,'bag choices survive a reload');
   report.bag.push({lang,actions:actions.length});await p.context().close();
  }
  // C. Combat: every market weapon and every move, in a live mission of each hero
  const fights=[...MARKET_WEAPON_IDS.map((w,i)=>({step:i%2?'vega':'app_axis',weapon:w})),...HERO_MOVES.nox.map(m=>({step:'app_axis',move:m.id})),...HERO_MOVES.lulu.map(m=>({step:'vega',move:m.id}))]; // the fourth moves are granted from these very stages (`early`)
  for(const f of fights){
   const p=await page(),{FOOT}=await import('../game/missions.mjs'),pov=FOOT[f.step].pov||'nox';
   const raw=JSON.parse(await qa.makeSave(f.step,{flags:{'weapon.tessa':true,separated:true,...(f.weapon?{['weapon.active.'+pov]:f.weapon}:{}),...(f.move?{['move.active.'+pov]:f.move}:{})}}));
   raw.world.inventory=Object.fromEntries(MARKET_WEAPON_IDS.map(k=>[k,1]));await boot(p,raw);
   for(let k=0;k<80;k++){const st=await p.evaluate(()=>window.cityAdventure.status());if(st.running&&st.mode==='foot')break;if(await p.isVisible('#talk')){await p.click('#next-line');continue;}if(await p.isVisible('#card')){await p.click('#card');continue;}const ch=p.locator('#choice-options button:visible').first();if(await ch.count())await ch.click();await p.waitForTimeout(100);}
   const s0=await p.evaluate(()=>window.cityAdventure.snapshot());assert.equal(s0.mode??'foot','foot',f.step+' is live');
   if(f.weapon){assert.equal(s0.arsenal.active,f.weapon,f.weapon+' is the active weapon');assert.equal(s0.arsenal.ammo[f.weapon],WEAPONS_V9[f.weapon].magazine);}
   if(f.move)assert.equal(s0.activeMove,f.move,f.move+' is the active move');
   let fired=false,cast=false;
   for(let k=0;k<26;k++){await p.tap('#gun').catch(()=>{});if(f.move&&k%3===0)await p.tap('#magic').catch(()=>{});await p.waitForTimeout(120);const s=await p.evaluate(()=>window.cityAdventure.snapshot());
    if(f.weapon&&s.arsenal&&(s.arsenal.ammo[f.weapon]<WEAPONS_V9[f.weapon].magazine||s.arsenal.reloadRemaining>0))fired=true;if(f.move&&s.magicCd>0)cast=true;if(s.status&&s.status!=='playing')break;}
   if(f.weapon)assert.ok(fired,f.weapon+' spends ammunition when fired');if(f.move)assert.ok(cast,f.move+' goes on cooldown when cast');
   const st=await p.evaluate(()=>window.cityAdventure.status());assert.equal((st.faults?.count??st.faults?.total??0),0,'no runtime fault: '+JSON.stringify(st.faults));
   if(['mg_vulcan','orb_void','nox_nova','lulu_supernova'].includes(f.weapon||f.move))await p.screenshot({path:path.join(out,`fight-${f.weapon||f.move}.png`)});
   report.combat.push({step:f.step,weapon:f.weapon,move:f.move});await p.context().close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'arsenal-r23.json'),JSON.stringify({ok:true,...report,errors},null,1));console.log(`Arsenal R23 PASS · ${report.shops.length} shops, ${report.bag.length} bags, ${report.combat.length} fights`);
 }catch(e){fs.writeFileSync(path.join(out,'arsenal-r23.json'),JSON.stringify({ok:false,...report,errors,failure:String(e.stack||e)},null,1));console.error(String(e.message||e).slice(0,900));console.error('errors:',errors.slice(0,5));process.exitCode=1;}
 finally{await browser.close();}
})();
