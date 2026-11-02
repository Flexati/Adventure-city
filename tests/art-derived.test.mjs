import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {PNG} from 'pngjs';
import {runChecks,decode,signalBand,hexRgb} from '../tools/art_derived_checks.mjs';
import {BOSSES,CONTRACT,CELLS,STAGES,PACKAGE,build,brief,paletteProblems,sha256} from '../tools/build_boss_v2.mjs';

// ---------- Boss v2 package (D30) ----------
test('boss v2 palettes keep the body out of the reserved bands and attacks in the danger band',()=>{
 assert.deepEqual(BOSSES.flatMap(paletteProblems),[]);
 // The v01 colours that motivated v2 really are in Nox's band (or danger), so the check is not vacuous.
 for(const [hex,band] of [['#9AE8FF','nox'],['#59E0FF','nox'],['#FF8A4A','pericolo']])assert.equal(signalBand(...hexRgb(hex)),band,hex);
});

test('boss contract: 28 frames on an 8-column grid of 320 px cells, 288 px subject from 230 u at 1.25 px/u',()=>{
 assert.equal(CELLS.length,28);assert.equal(CONTRACT.stati.reduce((n,[,k])=>n+k,0),28);
 assert.equal(Math.round(CONTRACT.altezza_disegnata_u*CONTRACT.densita_px_u),CONTRACT.altezza_soggetto);
 assert.deepEqual(CONTRACT.tela,[CONTRACT.cella[0]*CONTRACT.colonne,CONTRACT.cella[1]*Math.ceil(CELLS.length/CONTRACT.colonne)]);
 for(const boss of BOSSES){const b=brief(boss);assert.equal(b.immagini_generate,0);assert.equal(b.stato,'PROMPT_READY');assert.equal(b.palette_distretto.file,null);}
});

test('the committed boss v2 package is exactly what the tool builds, and builds are deterministic',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'boss-v2-'));
 try{
  for(const dir of ['game/art/v05','game/art/chrono','requests/gpt-preproduzione-310-20261029/riferimenti'])fs.mkdirSync(path.join(tmp,dir),{recursive:true});
  for(const file of ['game/art/v05/nox_walk.png','game/art/chrono/shadow_reaper.png','game/art/chrono/cathedral_bone_tyrant.png','game/art/chrono/toxic_forge_behemoth.png','requests/gpt-preproduzione-310-20261029/riferimenti/ref_boss.png'])fs.copyFileSync(file,path.join(tmp,file));
  const result=build(tmp);assert.equal(result.prompts,BOSSES.length*STAGES.length);
  // Per boss: 4 identity variants + 2 of part A + parts B, C, D once = 9 images.
  assert.equal(result.images,BOSSES.length*9);
  const committed=JSON.parse(fs.readFileSync(`requests/${PACKAGE}/INDICE.json`,'utf8')),fresh=JSON.parse(fs.readFileSync(path.join(tmp,'requests',PACKAGE,'INDICE.json'),'utf8'));
  assert.deepEqual(fresh,committed);
  for(const entry of committed.prompts){assert.equal(sha256(fs.readFileSync(entry.prompt)),entry.sha256,entry.prompt);assert.equal(sha256(fs.readFileSync(entry.brief)),entry.brief_sha256,entry.brief);
   assert.match(fs.readFileSync(entry.prompt,'utf8'),/PROMPT_READY\*\* · nessuna immagine generata/);}
 }finally{fs.rmSync(tmp,{recursive:true,force:true});}
});

// ---------- The ten checks, proved on synthetic sheets ----------
const OUTLINE=hexRgb('#141C28'),FILL=hexRgb('#8FB8C8');
function sheet({width=640,height=320,cell=320,heights=[288,288],shift=[0,0],paint=null}={}){
 const png=new PNG({width,height});
 heights.forEach((h,i)=>{const cx=i*cell,left=cx+110+shift[i],bottom=cell-17;
  for(let y=bottom-h+1;y<=bottom;y++)for(let x=left;x<left+100;x++){const edge=y<bottom-h+3||y>bottom-2||x<left+2||x>=left+98;const o=(y*width+x)*4;const [r,g,b]=edge?OUTLINE:FILL;png.data[o]=r;png.data[o+1]=g;png.data[o+2]=b;png.data[o+3]=255;}});
 paint?.(png);return png;
}
const spec=(extra={})=>({tela:[640,320],cella:[320,320],altezza_soggetto:288,celle:['fermo','fermo'],stato_riferimento:'fermo',altezza_libera:['sconfitto'],max_colori:64,bande_proprie:[],pericolo_max_pct:5,budget_byte:1e6,palette:['#141C28','#8FB8C8'],...extra});
const RAW=Buffer.from('grezzo di prova'),RAW_SHA=crypto.createHash('sha256').update(RAW).digest('hex');
const run=(png,extra={},raw=RAW)=>runChecks(png,spec({grezzo_sha256:RAW_SHA,...extra}),{rawBuffer:raw,derivedBytes:PNG.sync.write(png).length});
const set=(png,x,y,[r,g,b],a=255)=>{const o=(y*png.width+x)*4;png.data[o]=r;png.data[o+1]=g;png.data[o+2]=b;png.data[o+3]=a;};

test('a clean synthetic sheet passes all ten checks',()=>{
 const report=run(sheet());
 assert.equal(report.result,'PASS',JSON.stringify(report.checks,null,1));
 assert.equal(Object.keys(report.checks).length,10);
});

test('missing inputs are NON_VERIFICABILE, never PASS',()=>{
 const report=runChecks(sheet(),spec({palette:null,budget_byte:null}),{});
 assert.equal(report.checks.c07_colori.result,'NON_VERIFICABILE');assert.equal(report.checks.c10_peso_originale.result,'NON_VERIFICABILE');
 assert.equal(report.result,'INCOMPLETO');
});

test('each check fails on its own defect',()=>{
 const cases={
  c01_misure:[sheet(),{tela:[2560,1280]}],
  c02_griglia:[sheet({paint:p=>set(p,5,100,OUTLINE)})],
  c03_alfa_binaria:[sheet({paint:p=>set(p,150,150,FILL,200)})],
  c04_alone_verde:[sheet({paint:p=>set(p,150,150,[30,220,40])})],
  c05_altezza:[sheet({heights:[288,250]})],
  c06_pivot:[sheet({shift:[0,9]})],
  c07_colori:[sheet({paint:p=>{for(let i=0;i<70;i++)set(p,130+i,150,[60+i,90,120]);}})],
  c08_colori_riservati:[sheet({paint:p=>{for(let y=40;y<140;y++)for(let x=115;x<200;x++)set(p,x,y,hexRgb('#7DF0F4'));}})],
  c09_contorno:[sheet({paint:p=>{for(let y=0;y<320;y++)for(let x=0;x<640;x++){const o=(y*640+x)*4;if(p.data[o+3]&&p.data[o]===OUTLINE[0])set(p,x,y,[220,220,210]);}}})],
  c10_peso_originale:[sheet(),{},Buffer.from('grezzo modificato')]
 };
 for(const [id,[png,extra={},raw]] of Object.entries(cases)){const report=run(png,extra,raw);assert.equal(report.checks[id].result,'FAIL',`${id}: ${JSON.stringify(report.checks[id])}`);assert.equal(report.result,'FAIL');}
});

test('free-height states (defeat) are excluded from the ±8 % family rule only',()=>{
 assert.equal(run(sheet({heights:[288,160]}),{celle:['fermo','sconfitto']}).checks.c05_altezza.result,'PASS');
 assert.equal(run(sheet({heights:[288,160]}),{celle:['fermo','attacco']}).checks.c05_altezza.result,'FAIL');
});

// ---------- Registry of derived assets ----------
test('derived registry: every listed derivative is checked; a missing file is neither PASS nor FAIL',t=>{
 const registry=JSON.parse(fs.readFileSync('assets/production/v10.3/derived/REGISTRO.json','utf8'));
 assert.ok(Array.isArray(registry.assets));
 for(const asset of registry.assets){
  assert.ok(fs.existsSync(asset.brief),asset.brief);
  if(!fs.existsSync(asset.derivato)){t.diagnostic(`${asset.asset_id}: derivato mancante, nessun PASS`);continue;}
  const buffer=fs.readFileSync(asset.derivato),b=JSON.parse(fs.readFileSync(asset.brief,'utf8'));
  const report=runChecks(decode(buffer),{...b,grezzo_sha256:asset.grezzo_sha256},{rawBuffer:asset.grezzo&&fs.existsSync(asset.grezzo)?fs.readFileSync(asset.grezzo):null,derivedBytes:buffer.length});
  assert.notEqual(report.result,'FAIL',`${asset.asset_id}: ${JSON.stringify(report.checks)}`);
 }
 t.diagnostic(`${registry.assets.length} derivati nel registro`);
});
