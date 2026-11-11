// D45-D46 in Chromium: every mission with enemies decodes its own cast (and nothing from other regions) and draws it;
// the Cathedral Quarter draws its gate guard. Usage: node tools/verify_foes_d46.cjs <url> <out-dir>   (output outside the repo)
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out]=process.argv.slice(2);
if(!out){console.error('Usage: node tools/verify_foes_d46.cjs <url> <out-dir>');process.exit(2);}
fs.mkdirSync(out,{recursive:true});
const STEPS=['breach','contagion','zero','exp_chalk_marks','below','city','port','archive','line','ascent','finale','cathedral','moon'];
// D47: cues each place must decode, the ambience it must play and the arrival stinger a hub must sound.
const MISSION_CUES=['bone_break','gear_break','toxic_splash','chainsaw','suspense_entry','suspense_appearance','suspense_activation','suspense_final','portal'],HUB_CUES=['purchase','upgrade','relic','crowd_shop'];
const AMBIENCE={below:'chrono_necropolis',moon:'chrono_refuge',cathedral:'chrono_cathedral'};
const RESERVE=/chrono\/(mech_hound|striker_unit|chrono_drone|ghoul_runner|toxic_brawler|toxic_bomber|plague_cultist_caster|skeleton_swordsman|iron_penitent|flame_alchemist|skeleton_shield_bearer|valkyrie_striker|chrono_huntress|demon_hunter_survivor|desert_chrono_fighter|crawling_corpse|cathedral_bone_tyrant|toxic_forge_behemoth|shadow_reaper|gate_guard|purple_guard|gang_signal)\.png/;
(async()=>{
 const {CHRONO_FOES,CHRONO_STEP_FOES,chronoEnemySheet}=await import('../game/chrono-art.mjs'),{FOOT}=await import('../game/missions.mjs'),{CHAPTERS}=await import('../game/campaign.mjs');
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),checks=[],errors=[];
 try{
  for(const step of STEPS){
   const def=FOOT[step]||CHAPTERS.find(c=>c.id===step)||{},hub=['cathedral','moon'].includes(step),cast=step==='cathedral'?['gate_guard']:step==='moon'?[]:[...new Set([...Object.values(CHRONO_FOES[def.kind]||{}),...Object.values(CHRONO_STEP_FOES[step]||{}),...(def.kind===3?['purple_guard']:[])])];
   const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,deviceScaleFactor:2}),p=await c.newPage();p.on('pageerror',e=>errors.push(step+': '+e.message));
   await qa.seed(p,url,step);
   // Some steps open on a route choice: take the first option, then let dialogue and cards run to live play.
   for(let k=0;k<60;k++){const st=await p.evaluate(()=>window.cityAdventure.status());if(st.running&&st.mode!=='card')break;
    if(await p.isVisible('#talk')){await p.click('#next-line');continue;}if(await p.isVisible('#card')){await p.click('#card');continue;}
    const choice=p.locator('button:visible').first();if(st.mode==='card'&&await choice.count())await choice.click();await p.waitForTimeout(100);}
   await p.waitForTimeout(400);
   const decoded=(await p.evaluate(()=>window.cityAdventure.status().chrono.decoded)).filter(id=>RESERVE.test(`chrono/${id}.png`));
   assert.deepEqual(decoded.sort(),[...cast].sort(),step+' decodes exactly its cast');
   const drawn=await p.evaluate(src=>new Promise(resolve=>{const re=new RegExp(src),seen={},orig=CanvasRenderingContext2D.prototype.drawImage;
    CanvasRenderingContext2D.prototype.drawImage=function(im,...r){if(this.canvas.id==='world'&&im?.src){const m=re.exec(im.src);if(m)seen[m[1]]=(seen[m[1]]||0)+1;}return orig.call(this,im,...r);};
    setTimeout(()=>{CanvasRenderingContext2D.prototype.drawImage=orig;resolve(seen);},4000);}),RESERVE.source);
   // The port opens with stealth patrols, which keep their legacy art: there the first wave draws no reserve sheet.
   const opening=step==='cathedral'||!hub&&def.waves[0].some(r=>chronoEnemySheet(def.kind,typeof r==='string'?r:r.role,step));
   if(opening)assert.ok(Object.keys(drawn).length>=1,step+' draws its cast: '+JSON.stringify(drawn));
   const audio=await p.evaluate(()=>window.cityAdventure.status().audio);
   for(const cue of hub?[...HUB_CUES,...(step==='cathedral'?['cathedral_bell']:[])]:[...MISSION_CUES,...(def.kind===0?['shotgun']:[])])assert.ok(audio.chronoDecoded.includes(cue),step+' decodes cue '+cue+' ('+audio.chronoDecoded+')');
   if(AMBIENCE[step])assert.equal(audio.ambience,AMBIENCE[step],step+' ambience');
   if(step==='cathedral')assert.ok(audio.chronoPlayed.cathedral_bell>=1,'the Cathedral bell sounds on arrival: '+JSON.stringify(audio.chronoPlayed));
   // In the Contagion the first wave is two ghouls: shooting until one falls must sound its bone break.
   if(step==='contagion'){for(let k=0;k<200&&!(await p.evaluate(()=>window.cityAdventure.status().audio.chronoPlayed.bone_break));k++){await p.tap('#gun').catch(()=>{});await p.waitForTimeout(140);}
    assert.ok((await p.evaluate(()=>window.cityAdventure.status().audio.chronoPlayed.bone_break))>=1,'a falling ghoul sounds bone_break');}
   checks.push({id:'foes-'+step,ambience:audio.ambience,result:'PASS',cast,drawn:Object.keys(drawn)});
   await p.screenshot({path:path.join(out,`foes-${step}-390x844.png`)});await c.close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'foes-d46.json'),JSON.stringify({ok:true,checks,errors},null,1));console.log('D46 foes PASS · '+checks.length+' places');
 }catch(e){fs.writeFileSync(path.join(out,'foes-d46.json'),JSON.stringify({ok:false,checks,errors,failure:String(e.stack||e)},null,1));console.error(String(e.message||e).slice(0,800));process.exitCode=1;}
 finally{await browser.close();}
})();
