// Play-band geometry in the real runtime: for each viewport the hero is walked to the centre and
// to both map edges with the keyboard; at every sample the hero's on-screen box must not overlap
// the stick, the action buttons, the heal button or the weapon bar, and the free band between HUD
// and controls is measured. Earned-kit fixture at `zero` so the weapon bar is shown.
// Usage: node tools/verify_play_band.cjs [url] [outDir] [label]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/v10.2',label='current']=process.argv.slice(2);
const VIEWPORTS=[[390,844],[360,780],[844,390],[915,412],[740,360],[1280,720]];
(async()=>{
 const {newProgress,stepIndex,saveProgress}=await import('../game/missions.mjs');const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});const rows=[];let failed=false;
 fs.mkdirSync(out,{recursive:true});
 try{for(const [W,H] of VIEWPORTS){
  const c=await b.newContext({viewport:{width:W,height:H},hasTouch:true}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
  const s=newProgress();s.step=stepIndex('zero');s.cityChoice='workshop';s.world.visited=['moon'];Object.assign(s.narrative.flags,{'encounter.rook.completed':true,'weapon.tessa':true,'weapon.quickdraw':true,'exp.chalk.completed':true});
  await c.addInitScript(raw=>{localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-v4-settings',JSON.stringify({sound:false,reduced:true}));sessionStorage.setItem('city-studio-shown','1');},saveProgress(s));
  await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
  for(let i=0;i<300;i++){if(await p.isVisible('#card'))await p.click('#card');else if(await p.isVisible('#talk'))await p.click('#next-line');else if((await p.evaluate(()=>cityAdventure.status())).running)break;else await p.waitForTimeout(50);}
  await p.waitForTimeout(300);
  const sample=()=>p.evaluate(()=>{const v=cityAdventure.view(),s=cityAdventure.snapshot(),k=v.scale,x=(s.x-v.x)*k,y=(s.y-v.y)*k,hero={l:x-30*k,r:x+30*k,t:y-100*k,b:y+8*k};
   const rect=id=>{const e=document.getElementById(id);if(!e||e.hidden||!e.offsetParent)return null;const r=e.getBoundingClientRect();return {id,l:r.left,r:r.right,t:r.top,b:r.bottom};};
   const overlays=['stick','gun','dash','magic','duo','interact','heal','weapon-controls'].map(rect).filter(Boolean),hud=document.getElementById('hud').getBoundingClientRect();
   const hits=overlays.filter(o=>o.l<hero.r&&o.r>hero.l&&o.t<hero.b&&o.b>hero.t).map(o=>o.id);
   const centre=overlays.filter(o=>o.l<innerWidth/2+60&&o.r>innerWidth/2-60);const bandBottom=Math.min(innerHeight,...centre.map(o=>o.t));
   return {scale:+k.toFixed(3),heroPx:Math.round(112*k),hero:{x:Math.round(x),y:Math.round(y)},hits,bandPx:Math.round(bandBottom-hud.bottom),weaponBar:overlays.find(o=>o.id==='weapon-controls')||null};});
  const samples=[];samples.push({at:'start',...await sample()});
  for(const [key,at] of [['KeyA','left edge'],['KeyD','right edge'],['KeyS','bottom'],['KeyW','top']]){await p.keyboard.down(key);await p.waitForTimeout(2600);await p.keyboard.up(key);await p.waitForTimeout(150);samples.push({at,...await sample()});}
  const name=`play-band-${label}-${W}x${H}.png`;await p.screenshot({path:path.join(out,name)});
  const overlap=samples.filter(x=>x.hits.length);const row={viewport:[W,H],scale:samples[0].scale,heroPx:samples[0].heroPx,bandPx:samples[0].bandPx,overlaps:overlap.map(x=>({at:x.at,hits:x.hits})),samples,screenshot:name,errors};
  if(overlap.length||errors.length)failed=true;rows.push(row);console.log(overlap.length?'FAIL':'PASS',`${W}x${H}`,'scale',row.scale,'hero',row.heroPx+'px','band',row.bandPx+'px',overlap.map(x=>x.at+':'+x.hits).join(' '));await c.close();}
 }finally{await b.close();}
 const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'..',f))).digest('hex');
 fs.writeFileSync(path.join(out,`play-band-${label}.json`),JSON.stringify({result:failed?'FAIL':'PASS',label,source:{'game/runtime.mjs':sha('game/runtime.mjs'),'game/visuals.mjs':sha('game/visuals.mjs'),'game/style.css':sha('game/style.css')},rows,limits:'Browser geometry with an earned-kit fixture at zero; hero box approximated as 60x108 world units around the ground point. Not a device or human comfort test.'},null,2));
 process.exit(failed?1:0);
})();
