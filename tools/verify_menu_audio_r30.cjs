// R30 (D74): the studio intro roars and the menu music starts by itself.
//  A) Android-like: Chromium with --autoplay-policy=no-user-gesture-required, the policy the WebView gets from
//     setMediaPlaybackRequiresUserGesture(false). No input at all: the roar plays near the jaguar's landing and the menu
//     music (title_theme) plays.
//  B) An ordinary browser (a gesture is required): nothing may play late; the first tap on the menu starts the music.
//   node tools/verify_menu_audio_r30.cjs http://127.0.0.1:8090/game/ <out-dir>     (CHROMIUM=<chrome> if needed)
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const [url='http://127.0.0.1:8090/game/',out='/tmp/menu-audio-r30']=process.argv.slice(2);fs.mkdirSync(out,{recursive:true});
const audio=p=>p.evaluate(()=>window.cityAdventure?.status?.().audio||null);
async function run(policy){
 const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--autoplay-policy='+policy]}),errors=[];
 const p=await (await b.newContext({viewport:{width:390,height:844},hasTouch:true})).newPage();
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errors.push(m.text().slice(0,200));});
 await p.addInitScript(()=>{localStorage.setItem('city-tutorial-v8','1');window.__studioShownAt=null;new MutationObserver(()=>{const s=document.getElementById('studio');if(s&&!s.hidden&&window.__studioShownAt===null)window.__studioShownAt=performance.now();}).observe(document,{subtree:true,attributes:true,attributeFilter:['hidden']});});
 await p.goto(url);const samples=[];let roarAt=null;
 for(let k=0;k<40;k++){await p.waitForTimeout(250);const a=await audio(p),shown=await p.evaluate(()=>window.__studioShownAt),now=await p.evaluate(()=>performance.now()),menu=await p.evaluate(()=>!document.getElementById('menu')?.hidden);
  if(a){samples.push({t:+(now/1000).toFixed(2),context:a.context,cue:a.cue,musicPaused:a.musicPaused,sting:a.chronoPlayed?.sting||0,menu});if(roarAt===null&&a.chronoPlayed?.sting&&shown!=null)roarAt=+((now-shown)/1000).toFixed(2);}
  if(menu&&a&&!a.musicPaused&&k>12)break;}
 const before=samples.at(-1),r={policy,roarSeenWithin:roarAt,last:before,errors};
 if(policy==='user-gesture-required'){await p.waitForTimeout(1500);r.beforeTap=await audio(p);await p.mouse.click(195,300);await p.waitForTimeout(2500);r.afterTap=await audio(p);}
 await p.screenshot({path:path.join(out,`menu-${policy}.png`)});await b.close();return r;}
(async()=>{
 const A=await run('no-user-gesture-required'),B=await run('user-gesture-required');
 // [MISURATO] headless Chromium lets audio start even with --autoplay-policy=user-gesture-required, so case B cannot
 // reproduce a gesture-locked browser here: it is recorded for information and only its music-after-tap check gates.
 const pass={roarAndroid:A.roarSeenWithin!=null&&A.roarSeenWithin<3,menuMusicAndroid:A.last?.cue==='title_theme'&&A.last.musicPaused===false&&A.last.menu,
  menuMusicAfterTapBrowser:B.afterTap?.cue==='title_theme'&&B.afterTap.musicPaused===false,noErrors:!A.errors.length&&!B.errors.length};
 const report={url,A,B,pass,ok:Object.values(pass).every(Boolean)};fs.writeFileSync(path.join(out,'menu-audio-r30.json'),JSON.stringify(report,null,1));
 console.log(JSON.stringify(pass),report.ok?'PASS':'FAIL');process.exit(report.ok?0:1);
})();
