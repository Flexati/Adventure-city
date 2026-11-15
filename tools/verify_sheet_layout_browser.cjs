// Draws every pose of the cleaned 4x4 sheets with the game's own drawLegacySprite, next to the
// original sheet drawn the old way, on a common ground line (actor.y). Checks in the browser that
// each sheet loads, that the layout is applied, and that no pose loses pixels at its cell edges.
// Usage: node tools/verify_sheet_layout_browser.cjs [base-url] [out-dir]
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'),fs=require('node:fs');
(async()=>{
 const base=process.argv[2]||'http://127.0.0.1:8090/',out=process.argv[3]||'docs/evidence/v10.2/sheet-layout';
 const b=await chromium.launch(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{});
 const p=await b.newPage({viewport:{width:1400,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await p.goto(base+'game/index.html');
 const result=await p.evaluate(async()=>{
  const {drawLegacySprite}=await import('./chrono-art.mjs'),{SHEET_LAYOUT}=await import('./sheet-layout.mjs');
  const load=src=>new Promise((ok,ko)=>{const im=new Image();im.onload=()=>ok(im);im.onerror=()=>ko(new Error(src));im.src=src;});
  const shots={},checks=[];
  for(const key of Object.keys(SHEET_LAYOUT)){
   const [folder,file]=key.split('/'),now=await load('art/'+key),old=await load(`../assets/source/sheets_v05_v10_original/${folder}_${file}`);
   const size=112,cellW=150,cellH=180,c=document.createElement('canvas');c.width=cellW*8;c.height=cellH*4;const g=c.getContext('2d');
   g.fillStyle='#40684c';g.fillRect(0,0,c.width,c.height);
   for(let r=0;r<4;r++)for(let col=0;col<4;col++)for(const [k,im] of [[0,old],[1,now]]){
    const x=(col*2+k)*cellW+cellW/2,y=r*cellH+cellH-24;
    g.fillStyle='#00000060';g.beginPath();g.ellipse(x,y,19,7,0,0,Math.PI*2);g.fill();
    drawLegacySprite(g,im,r,col,x,y,size,false);
    g.fillStyle=k?'#9fe9ff':'#ffd27a';g.fillRect(x-cellW/2+4,y,cellW-8,1);
   }
   shots[key]=c.toDataURL('image/png');
   // Layout applied: the stored image is the padded one and no opaque pixel sits on a stored cell edge.
   const L=SHEET_LAYOUT[key],t=document.createElement('canvas');t.width=now.naturalWidth;t.height=now.naturalHeight;const tg=t.getContext('2d');tg.drawImage(now,0,0);
   const data=tg.getImageData(0,0,t.width,t.height).data;let edge=0;
   for(let r=0;r<4;r++)for(let col=0;col<4;col++){const x0=col*L.CW,y0=r*L.CH;
    for(let x=x0;x<x0+L.CW;x++)for(const y of [y0,y0+L.CH-1])if(data[(y*t.width+x)*4+3]>64)edge++;}
   checks.push({key,stored:[now.naturalWidth,now.naturalHeight],expected:[4*L.CW,4*L.CH],edge_opaque_px:edge});
  }
  return {shots,checks};
 });
 fs.mkdirSync(out,{recursive:true});
 for(const [key,url] of Object.entries(result.shots))fs.writeFileSync(`${out}/browser-${key.replace('/','_')}`,Buffer.from(url.split(',')[1],'base64'));
 const bad=result.checks.filter(c=>c.stored[0]!==c.expected[0]||c.stored[1]!==c.expected[1]||c.edge_opaque_px>0);
 const report={result:errors.length||bad.length?'FAIL':'PASS',errors,checks:result.checks,
  note:'Left of each pair: original sheet drawn the old way; right: cleaned sheet through drawLegacySprite. Yellow/blue line: actor.y. Browser rendering only, no device or human review.'};
 fs.writeFileSync(`${out}/sheet-layout-browser-report.json`,JSON.stringify(report,null,1)+'\n');
 console.log(report.result,JSON.stringify(bad),errors.join('\n'));await b.close();process.exit(report.result==='PASS'?0:1);
})();
