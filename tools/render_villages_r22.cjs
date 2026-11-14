// R22: bakes the walkable map of every village exactly as the game does and writes it as PNG, so a person can look at
// the whole village at once. Usage: node tools/render_villages_r22.cjs <url> <out-dir> [id ...]   (output outside the repo)
const {chromium}=require('playwright'),fs=require('node:fs'),path=require('node:path');
const [url='http://127.0.0.1:8090/game/',out,...only]=process.argv.slice(2);
if(!out){console.error('Usage: node tools/render_villages_r22.cjs <url> <out-dir> [id ...]');process.exit(2);}
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||undefined}),p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url);
 const ids=await p.evaluate(async()=>Object.keys((await import('./hubs.mjs')).HUBS));
 for(const id of ids.filter(i=>!only.length||only.includes(i))){
  const data=await p.evaluate(async id=>{
   const [{HUBS},{getLayout},{buildMapSurface},{villageFamily},{DISTRICT_MAPS}]=await Promise.all(['./hubs.mjs','./layouts.mjs','./scenery.mjs','./village-art.mjs','./visuals.mjs'].map(m=>import(m)));
   const load=src=>new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>rej(new Error(src));im.src=src;});
   const h=HUBS[id],fam=['moon','cathedral','toxic','clockwork'][villageFamily(id)];
   const [bg,houses,env]=await Promise.all([load('art/'+DISTRICT_MAPS[h.district]+'.png'),load('art/v10/case_'+fam+'.webp'),load('art/chrono/environment.png')]);
   const s=buildMapSurface(getLayout(h.layout),bg,houses,h.color,env,h.district),c=document.createElement('canvas');c.width=s.width;c.height=s.height;c.getContext('2d').drawImage(s,0,0);
   return c.toDataURL('image/png').split(',')[1];
  },id);
  fs.writeFileSync(path.join(out,id+'.png'),Buffer.from(data,'base64'));
 }
 // The six procedural mission maps (the painted ones are images already), once per district that uses them.
 if(!only.length)for(const [lay,d] of [['yard',0],['arena',0],['elbow',1],['gallery',1],['spine',1],['gallery',2],['arena',3],['elbow',3],['spine',3],['arena',2]]){
  const data=await p.evaluate(async([lay,d])=>{
   const [{getLayout},{buildMapSurface},{DISTRICT_MAPS}]=await Promise.all(['./layouts.mjs','./scenery.mjs','./visuals.mjs'].map(m=>import(m)));
   const load=src=>new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>rej(new Error(src));im.src=src;});
   const [bg,props,env]=await Promise.all([load('art/'+DISTRICT_MAPS[d]+'.png'),load('art/v05/district_props.png'),load('art/chrono/environment.png')]);
   const s=buildMapSurface(getLayout(lay),bg,props,['#419eb9','#5bb7d5','#9ad36a','#bba1ed'][d],env,d),c=document.createElement('canvas');c.width=s.width;c.height=s.height;c.getContext('2d').drawImage(s,0,0);
   return c.toDataURL('image/png').split(',')[1];
  },[lay,d]);
  fs.writeFileSync(path.join(out,`mission_${lay}_${d}.png`),Buffer.from(data,'base64'));
 }
 await browser.close();if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log('villages rendered: '+(only.length||ids.length));
})();
