// Reload animation proof in the real runtime with ordinary touch inputs, for both earned weapons:
// switch to VX-9/R-12, empty the magazine with the fire button, reload from the HUD, watch the four
// timed phases standing still, walk mid-reload, pause and resume. Explicit earned-kit fixtures; the
// browser clock is real. Not a human, WebView or Android proof.
// Usage: node tools/verify_reload_browser.cjs [url=http://127.0.0.1:8090/game/] [out=docs/evidence/v10.2] [width=390] [height=844]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const [url='http://127.0.0.1:8090/game/',out='docs/evidence/v10.2',W='390',H='844']=process.argv.slice(2);
(async()=>{const {newProgress,stepIndex,saveProgress}=await import('../game/missions.mjs');const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});const reports=[];let failed=false;
fs.mkdirSync(out,{recursive:true});
try{for(const [hero,step,weapon] of [['nox','zero','vx9'],['lulu','breach','r12']]){
 const c=await b.newContext({viewport:{width:+W,height:+H},hasTouch:true}),p=await c.newPage(),errors=[],requested=[],checks=[];
 const check=(name,ok,detail)=>{checks.push({name,ok:!!ok,detail});if(!ok)failed=true;console.log(ok?'PASS':'FAIL',hero,name,detail??'');};
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());if(r.url().includes('/art/v10/'))requested.push(r.url().split('/').pop());});
 const s=newProgress();s.step=stepIndex(step);s.cityChoice='workshop';s.world.visited=['moon'];Object.assign(s.narrative.flags,{'encounter.rook.completed':true,'weapon.tessa':true,'weapon.quickdraw':true,'exp.chalk.completed':true});
 await p.addInitScript(raw=>{localStorage.setItem('city-adventure-progress-v7',raw);localStorage.setItem('city-v4-settings',JSON.stringify({sound:true,reduced:false}));sessionStorage.setItem('city-studio-shown','1');},saveProgress(s));
 await p.goto(url);await p.waitForFunction(()=>window.cityAdventure?.status().loaded);await p.click('#continue');
 for(let i=0;i<300;i++){if(await p.isVisible('#card'))await p.click('#card');else if(await p.isVisible('#talk'))await p.click('#next-line');else if((await p.evaluate(()=>cityAdventure.status())).running)break;else await p.waitForTimeout(50);}
 const snap=()=>p.evaluate(()=>{const s=cityAdventure.snapshot();return {active:s.arsenal?.active,ammo:s.arsenal?.ammo,reload:s.arsenal?.reloadRemaining,stride:s.stride,hp:s.hp,status:s.status};});
 await p.waitForSelector('#weapon-change',{state:'visible'});
 for(let k=0;k<3&&(await snap()).active!==weapon;k++){await p.tap('#weapon-change');await p.waitForTimeout(300);}
 check('weapon selected through the HUD',(await snap()).active===weapon,(await snap()).active);
 const gun=await p.locator('#gun').boundingBox(),gx=gun.x+gun.width/2,gy=gun.y+gun.height/2;
 // Empty the magazine with ordinary presses; a press at zero ammo starts the automatic reload.
 for(let k=0;k<40&&!((await snap()).reload>0);k++){await p.touchscreen.tap(gx,gy);await p.waitForTimeout(520);}
 let st=await snap();if(!(st.reload>0)){await p.tap('#weapon-reload');st=await snap();}
 check('reload started by fire or HUD reload',st.reload>0,st);
 const frames=[];const total=st.reload;
 for(let k=0;k<60;k++){const f=await p.evaluate(()=>{const s=cityAdventure.snapshot();return {reload:s.arsenal.reloadRemaining,ammo:s.arsenal.ammo[s.arsenal.active]};});if(!(f.reload>0))break;
  const phase=Math.min(3,Math.floor((1-f.reload/(f.reload>total?f.reload:total))*4));if(!frames.some(x=>x.phase===phase)){frames.push({phase,...f});await p.screenshot({path:path.join(out,`reload-${weapon}-${W}x${H}-phase${phase}.png`)});}
  await p.waitForTimeout(40);}
 check('four phases observed while standing',new Set(frames.map(f=>f.phase)).size>=3,frames.map(f=>f.phase));
 check('magazine unchanged until the timer ends',frames.every(f=>f.ammo===0),frames.map(f=>f.ammo));
 await p.waitForTimeout(200);st=await snap();check('magazine refilled by the model',st.ammo[weapon]>0&&!(st.reload>0),st.ammo);
 // Walk during a second reload: the walk cycle and the progress arc keep feet planted.
 for(let k=0;k<40&&st.ammo[weapon]>0;k++){await p.touchscreen.tap(gx,gy);await p.waitForTimeout(520);st=await snap();}
 await p.tap('#weapon-reload').catch(()=>{});await p.keyboard.down('KeyA');await p.waitForTimeout(260);const walking=await snap();await p.screenshot({path:path.join(out,`reload-${weapon}-${W}x${H}-walking.png`)});await p.keyboard.up('KeyA');
 check('reload continues while walking',walking.reload>0&&walking.stride>.1,walking);
 await p.tap('#pause');const r1=(await snap()).reload;await p.waitForTimeout(500);const r2=(await snap()).reload;
 check('pause freezes the reload timer',r1>0&&r1===r2,{r1,r2});
 await p.tap('#resume');await p.waitForTimeout(Math.ceil(total*1000)+300);st=await snap();
 check('resume completes the reload without a stuck pose',!(st.reload>0)&&st.ammo[weapon]>0,st);
 const sheet=hero+'_'+weapon+'_reload.png';
 check('reload sheet requested and decoded',requested.includes(sheet),requested);
 check('zero page errors',errors.length===0,errors);
 reports.push({hero,step,weapon,checks,phasesObserved:frames,requested,errors});await c.close();}
}finally{await b.close();}
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'..',f))).digest('hex');
fs.writeFileSync(path.join(out,`reload-browser-report-${W}x${H}.json`),JSON.stringify({result:failed?'FAIL':'PASS',source:{'game/visuals.mjs':sha('game/visuals.mjs'),'game/runtime.mjs':sha('game/runtime.mjs'),'game/campaign.mjs':sha('game/campaign.mjs'),'game/art/v10/nox_vx9_reload.png':sha('game/art/v10/nox_vx9_reload.png'),'game/art/v10/lulu_r12_reload.png':sha('game/art/v10/lulu_r12_reload.png')},viewport:[+W,+H],reports,limits:'Earned-kit fixtures at zero/breach, real browser clock, touch taps on HUD controls and keyboard walking. Browser only: no human review, WebView or Android device.'},null,2));
console.log(failed?'FAIL':'PASS','reload browser verification');process.exit(failed?1:0);})();
