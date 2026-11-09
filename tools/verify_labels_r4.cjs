// R4 in Chromium: every text drawn on the world canvas is at least 11.5 px on screen (audit #12 measured 6.8-7.9 px on phones),
// in a village, in a mission with relays and in an underground mission, at small portrait, tall portrait and landscape.
// Usage: node tools/verify_labels_r4.cjs <url> <out-dir>   (the output goes outside the repo)
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const qa=require('./qa_v8.cjs');
const [url='http://127.0.0.1:8090/game/',out]=process.argv.slice(2);
if(!out){console.error('Usage: node tools/verify_labels_r4.cjs <url> <out-dir> (the output goes outside the repo)');process.exit(2);}
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),checks=[],errors=[];
 try{
  for(const step of ['moon','blackout','below'])for(const [width,height] of [[360,800],[390,844],[844,390]]){
   const c=await browser.newContext({viewport:{width,height},hasTouch:true,deviceScaleFactor:2}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
   await p.goto(url);await qa.seed(p,url,step);await p.waitForTimeout(500);
   // One frame of fillText calls on #world, sized in CSS pixels through the current transform and the canvas backing ratio.
   const labels=await p.evaluate(()=>new Promise(resolve=>{const seen=[],orig=CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText=function(text,x,y){if(this.canvas.id==='world'){const m=this.font.match(/(\d+(?:\.\d+)?)px/),t=this.getTransform();if(m)seen.push({text:String(text).slice(0,40),px:+(m[1]*Math.hypot(t.a,t.b)/(this.canvas.width/this.canvas.clientWidth)).toFixed(2)});}return orig.apply(this,arguments);};
    requestAnimationFrame(()=>requestAnimationFrame(()=>{CanvasRenderingContext2D.prototype.fillText=orig;resolve(seen);}));}));
   assert.ok(labels.length>0,step+' draws labels');
   const small=labels.filter(l=>l.px<11.5);
   assert.deepEqual(small,[],`${step} ${width}x${height}: labels under 11.5 px on screen`);
   // R6: the off-map margins are painted to every corner of the world canvas (no black corner beside the controls in landscape).
   const corners=await p.evaluate(()=>{const c=document.getElementById('world'),g=c.getContext('2d'),n=12;return [[0,0],[c.width-n,0],[0,c.height-n],[c.width-n,c.height-n]].map(([x,y])=>{const d=g.getImageData(x,y,n,n).data;let s=0;for(let i=0;i<d.length;i+=4)s+=d[i]+d[i+1]+d[i+2]+(255-d[i+3])*3;return Math.round(s/(d.length/4)/3);});});
   assert.ok(corners.every(v=>v>=12),`${step} ${width}x${height}: unpainted world corner ${corners}`);
   checks.push({id:`labels-${step}-${width}x${height}`,result:'PASS',count:labels.length,corners,min:Math.min(...labels.map(l=>l.px))});
   await p.screenshot({path:path.join(out,`labels-${step}-${width}x${height}.png`)});await c.close();
  }
  assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(out,'labels-r4.json'),JSON.stringify({ok:true,checks,errors},null,1));console.log('R4 labels PASS · '+checks.length+' checks');
 }catch(e){fs.writeFileSync(path.join(out,'labels-r4.json'),JSON.stringify({ok:false,checks,errors,failure:String(e.stack||e)},null,1));console.error(e);process.exitCode=1;}
 finally{await browser.close();}
})();
