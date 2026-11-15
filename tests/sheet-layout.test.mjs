import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import {createRequire} from 'node:module';
import {SHEET_LAYOUT} from '../game/sheet-layout.mjs';
import {drawLegacySprite} from '../game/chrono-art.mjs';
const {PNG}=createRequire(import.meta.url)('pngjs');
const read=p=>PNG.sync.read(fs.readFileSync(p));
const draw=(im,row,col)=>{let call;const g={save(){},restore(){},translate(){},scale(){},drawImage(...a){call=a;}};drawLegacySprite(g,im,row,col,0,0,112);return call;};

test('cleaned sheets keep every pose where the old quarter drew it, lifting only rows with cut feet',()=>{
 assert.equal(Object.keys(SHEET_LAYOUT).length,14);
 for(const [key,L] of Object.entries(SHEET_LAYOUT)){
  const [folder,file]=key.split('/'),now=read('game/art/'+key),old=read(`assets/source/sheets_v05_v10_original/${folder}_${file}`);
  assert.equal(now.width,4*L.CW,key);assert.equal(now.height,4*L.CH,key);
  assert.equal(old.width/4,L.cw,key);assert.equal(old.height/4,L.ch,key);
  const im={naturalWidth:now.width,naturalHeight:now.height,src:'http://x/game/art/'+key};
  const legacy={naturalWidth:old.width,naturalHeight:old.height,src:'http://x/game/art/legacy.png'};
  for(let r=0;r<4;r++){
   const ox=0,oy=Math.round(r*L.ch),y=oy+Math.round(L.ch*.55);let x=-1;
   for(let i=Math.round(L.cw*.2);i<Math.round(L.cw*.8);i++)if(old.data[(y*old.width+i)*4+3]===255){x=i;break;}
   if(x<0)continue;
   const nx=L.px+(x-ox),ny=r*L.CH+L.top+(y-oy)-L.lift[r];
   assert.deepEqual([...now.data.subarray((ny*now.width+nx)*4,(ny*now.width+nx)*4+4)],[...old.data.subarray((y*old.width+x)*4,(y*old.width+x)*4+4)],`${key} row ${r}: pixel moved only by the row lift`);
   const a=draw(im,r,0),b=draw(legacy,r,0),s=112/L.ch;
   const screen=(c,px,py)=>[c[5]+(px-c[1])*c[7]/c[3],c[6]+(py-c[2])*c[8]/c[4]];
   const [x1,y1]=screen(a,nx,ny),[x0,y0]=screen(b,x,y);
   assert.ok(Math.abs(x1-x0)<s,`${key} row ${r}: same screen x`);
   assert.ok(Math.abs(y1-(y0-L.lift[r]*s))<=s*.51,`${key} row ${r}: screen y moves by the lift (half-pixel rounding of fractional cells)`);
  }
 }
});

test('tinted copies of a cleaned sheet use its layout',()=>{
 const L=SHEET_LAYOUT['v05/nox_walk.png'],canvas={width:4*L.CW,height:4*L.CH,layoutSrc:'http://x/game/art/v05/nox_walk.png'};
 const c=draw(canvas,1,2);assert.deepEqual(c.slice(1,5),[2*L.CW,L.CH,L.CW,L.CH]);
});
