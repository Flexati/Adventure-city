import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import {createRequire} from 'node:module';import {createHash} from 'node:crypto';
import {createArsenalV9,WEAPONS_V9} from '../game/weapons-v9.mjs';
import {newRun,tick} from '../game/campaign.mjs';
import {heroFrame,RELOAD_ATLAS,RELOAD_DRAW_SCALE} from '../game/visuals.mjs';
const {PNG}=createRequire(import.meta.url)('pngjs');
const armed=(hero,id)=>{const s=newRun(hero,1);s.arsenal=createArsenalV9(hero,['tessa']);s.arsenal.active=id;return s;};

test('reload pose follows the model timer through lower, extract, insert and ready',()=>{
 for(const [hero,id] of [['nox','vx9'],['lulu','r12']]){
  const s=armed(hero,id);s.arsenal.ammo[id]=0;s.face={x:1,y:0};
  assert.ok(tick(s,{reload:true},.02)===undefined);assert.ok(s.arsenal.reloadRemaining>0,'reload starts from the ordinary input');
  const cols=[];while(s.arsenal.reloadRemaining>0){const f=heroFrame(s,s,hero);assert.equal(f.atlas,hero+'_'+id+'_reload');assert.equal(f.row,0);assert.equal(f.scale,RELOAD_DRAW_SCALE);assert.equal(s.arsenal.ammo[id],0,'renderer never refills');cols.push(f.col);tick(s,{},.02);}
  assert.deepEqual([...new Set(cols)],[0,1,2,3]);assert.equal(s.arsenal.ammo[id],WEAPONS_V9[id].magazine);
  assert.notEqual(heroFrame(s,s,hero).atlas,hero+'_'+id+'_reload','no pose remains after the timer ends');
 }
});

test('reload rows match the equipped sheet directions and mirror for the left side',()=>{
 const s=armed('nox','vx9');s.arsenal.reloadRemaining=1;
 for(const [face,row,flip] of [[{x:1,y:0},0,false],[{x:-1,y:0},0,true],[{x:0,y:-1},1,false],[{x:0,y:1},2,false],[{x:.6,y:-.8},3,false]]){s.face=face;const f=heroFrame(s,s,'nox');assert.equal(f.row,row);assert.equal(f.flip,flip);}
});

test('walking, hurt, dash, partner and C-9 keep their own frames during a reload',()=>{
 const s=armed('lulu','r12');s.arsenal.ammo.r12=0;tick(s,{reload:true},.02);
 tick(s,{x:1},.02);assert.ok(s.stride>.1);assert.equal(heroFrame(s,s,'lulu').atlas,'lulu_walk','feet keep the walk cycle while moving');
 tick(s,{},.02);assert.equal(heroFrame(s,s,'lulu').atlas,'lulu_r12_reload','stopping resumes the pose at the timer phase');
 s.hurtAnim=.2;assert.equal(heroFrame(s,s,'lulu').atlas,'lulu_actions');s.hurtAnim=0;
 s.dash=.1;assert.equal(heroFrame(s,s,'lulu').atlas,'lulu_actions');s.dash=0;
 assert.equal(heroFrame(s,s,'lulu',true).atlas,'lulu_walk');
 const c9=armed('nox','c9');c9.arsenal.ammo.c9=0;tick(c9,{reload:true},.02);assert.ok(c9.arsenal.reloadRemaining>0);assert.equal(heroFrame(c9,c9,'nox').atlas,'nox_walk');
});

test('runtime reload sheets keep equipped pixel density, clean cells and distinct poses',()=>{
 const report=JSON.parse(fs.readFileSync('assets/production/v10.2/reload-production.json','utf8'));
 assert.deepEqual(report.map(r=>r.runtime).sort(),Object.entries(RELOAD_ATLAS).flatMap(([,m])=>Object.values(m)).map(n=>'game/art/v10/'+n+'.png').sort());
 for(const r of report){
  const im=PNG.sync.read(fs.readFileSync(r.runtime)),ref=PNG.sync.read(fs.readFileSync(r.reference));
  assert.equal(im.width,ref.width);assert.ok(Math.abs(im.height/ref.height-RELOAD_DRAW_SCALE)<1e-3,r.id+' draw scale matches the sheet');
  assert.equal(createHash('sha256').update(fs.readFileSync(r.runtime)).digest('hex'),r.runtime_sha256);
  assert.equal(createHash('sha256').update(fs.readFileSync(r.master)).digest('hex'),r.master_sha256);
  assert.equal(r.max_clipped_opaque_px,0);assert.equal(WEAPONS_V9[r.weapon].reload,r.reload_seconds);
  const cw=im.width/4,ch=im.height/4;
  for(let row=0;row<4;row++){const hashes=[];for(let col=0;col<4;col++){const h=createHash('sha256');let opaque=0,edge=0;
   for(let y=Math.round(row*ch);y<Math.round((row+1)*ch);y++)for(let x=Math.round(col*cw);x<Math.round((col+1)*cw);x++){const a=im.data[(y*im.width+x)*4+3];h.update(Buffer.of(a));if(a>64){opaque++;if(y===Math.round(row*ch)||y===Math.round((row+1)*ch)-1)edge++;}}
   assert.ok(opaque>8000,r.id+' cell has a pose');assert.equal(edge,0,r.id+' pose touches a horizontal cell edge');hashes.push(h.digest('hex'));}
   assert.equal(new Set(hashes).size,4,r.id+' row '+row+' poses are distinct');}
 }
});
