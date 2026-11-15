// R20-a: the packaged page (bootstrap.js, en.js, app.js as classic scripts) starts without errors and speaks English.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),p=await b.newPage({viewport:{width:390,height:844},hasTouch:true}),errors=[];
 p.on('pageerror',e=>errors.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errors.push(m.text());});
 await p.goto(process.argv[2]||'http://127.0.0.1:8090/android/build/assets/game/index.html');await p.waitForTimeout(4500);
 const out=await p.evaluate(()=>({resume:translateText('Riprendi','en'),story:Object.keys(STORY_EN_TEXT).length,world:Object.keys(WORLD_EN_TEXT).length,runtime:Object.keys(RUNTIME_EN_TEXT).length,interiors:Object.keys(INTERIOR_EN_TEXT).length,missing:localeStatus().untranslated.length}));
 await b.close();assert.deepEqual(errors,[]);assert.equal(out.resume,'Resume');assert.ok(out.story>50&&out.world>50&&out.runtime>50&&out.interiors>20);
 console.log('Bundle EN PASS',JSON.stringify(out));})().catch(e=>{console.error(e);process.exit(1);});
