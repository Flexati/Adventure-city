// The ten automatic checks of the art pipeline (CHRONOS_ARTE_P2_PIPELINE.md, section 4; decision D30).
// Read-only: the checks decode a derived PNG with pngjs and measure it against its brief. Each check returns
// PASS, FAIL or NON_VERIFICABILE (a missing input, such as the district palette or the Pillar 3 budget).
// NON_VERIFICABILE is never counted as PASS.
//
// CLI: node tools/art_derived_checks.mjs <derived.png> <spec.json> [raw.png]
import fs from 'node:fs';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {PNG} from 'pngjs';

// Same bands and "signal look" threshold as tools/art_style_audit.py (Pillar 1, rule P4).
export const BANDS=Object.freeze({pericolo:[340,40],nox:[175,200],lulu:[275,325],interattivo:[140,170]});
export const SIGNAL=Object.freeze({s:.35,v:.9});
export const MARGIN=12,GREEN_HALO=120,PURE_BLACK=8;

export function hsv(r,g,b){
 r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
 let h=0;if(d>1e-9){if(max===r)h=((g-b)/d)%6;else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360;}
 return {h,s:max>0?d/max:0,v:max};
}
export const inBand=(h,[from,to])=>from<=to?h>=from&&h<=to:h>=from||h<=to;
export function signalBand(r,g,b){const {h,s,v}=hsv(r,g,b);if(s<SIGNAL.s||v<SIGNAL.v)return null;for(const [id,band] of Object.entries(BANDS))if(inBand(h,band))return id;return null;}
export const hexRgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
const luma=(r,g,b)=>.299*r+.587*g+.114*b;
const median=values=>{if(!values.length)return null;const s=[...values].sort((a,b)=>a-b),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2;};
const pass=(detail)=>({result:'PASS',detail}),fail=(detail)=>({result:'FAIL',detail}),unknown=(detail)=>({result:'NON_VERIFICABILE',detail});

export const decode=buffer=>PNG.sync.read(buffer);

// Opaque mask, cell boxes and per-cell measures shared by checks 2, 5, 6 and 9.
function cells(png,[cw,ch]){
 const out=[];
 for(let cy=0;cy+ch<=png.height;cy+=ch)for(let cx=0;cx+cw<=png.width;cx+=cw){
  let top=Infinity,bottom=-1,left=Infinity,right=-1,count=0;
  for(let y=cy;y<cy+ch;y++)for(let x=cx;x<cx+cw;x++){if(png.data[(y*png.width+x)*4+3]<128)continue;count++;if(y<top)top=y;if(y>bottom)bottom=y;if(x<left)left=x;if(x>right)right=x;}
  const index=out.length;
  if(!count){out.push({index,empty:true,cx,cy});continue;}
  const height=bottom-top+1,footFrom=bottom-Math.max(1,Math.round(height*.12))+1,feetX=[];
  for(let y=footFrom;y<=bottom;y++)for(let x=cx;x<cx+cw;x++)if(png.data[(y*png.width+x)*4+3]>=128)feetX.push(x-cx);
  out.push({index,empty:false,cx,cy,top:top-cy,bottom:bottom-cy,left:left-cx,right:right-cx,height,feetRow:bottom-cy,feetX:median(feetX)});
 }
 return out;
}

export function runChecks(png,spec,{rawBuffer=null,derivedBytes=null}={}){
 const [W,H]=spec.tela,[CW,CH]=spec.cella,checks={};
 const opaque=i=>png.data[i*4+3]>=128;

 // 1. Decode and canvas size.
 checks.c01_misure=png.width===W&&png.height===H?pass(`${png.width}×${png.height}`):fail(`${png.width}×${png.height}, atteso ${W}×${H}`);

 // 2. Grid multiple of the cell, nothing opaque in the 12 px margin of any cell.
 let marginHits=0;
 if(png.width%CW||png.height%CH)checks.c02_griglia=fail(`${png.width}×${png.height} non è multiplo della cella ${CW}×${CH}`);
 else{for(let y=0;y<png.height;y++)for(let x=0;x<png.width;x++){const lx=x%CW,ly=y%CH;if((lx<MARGIN||ly<MARGIN||lx>=CW-MARGIN||ly>=CH-MARGIN)&&opaque(y*png.width+x))marginHits++;}
  checks.c02_griglia=marginHits?fail(`${marginHits} pixel opachi nei ${MARGIN} px di margine`):pass(`celle ${CW}×${CH}, margine ${MARGIN} px libero`);}

 // 3. Binary alpha. 4. No green halo on opaque pixels (greenness = G − max(R, B), as tools/gpt_chroma.py).
 let partial=0,halo=0,opaqueCount=0;const colours=new Map(),bands={pericolo:0,nox:0,lulu:0,interattivo:0};
 for(let i=0;i<png.width*png.height;i++){const r=png.data[i*4],g=png.data[i*4+1],b=png.data[i*4+2],a=png.data[i*4+3];
  if(a!==0&&a!==255)partial++;if(a<128)continue;opaqueCount++;
  if(g-Math.max(r,b)>=GREEN_HALO)halo++;
  const key=(r<<16)|(g<<8)|b;colours.set(key,(colours.get(key)||0)+1);
  const band=signalBand(r,g,b);if(band)bands[band]++;}
 checks.c03_alfa_binaria=partial?fail(`${partial} pixel con alfa fra 1 e 254`):pass('solo 0 e 255');
 checks.c04_alone_verde=halo?fail(`${halo} pixel opachi con verdezza ≥ ${GREEN_HALO}`):pass('nessun pixel opaco verde');

 // 5. Height: the reference state is S2 ±2 %; every other cell within ±8 % of it, except free-height states.
 const all=cells(png,[CW,CH]),used=all.filter(c=>!c.empty),stateOf=index=>spec.celle?.[index]??null;
 if(!used.length){checks.c05_altezza=fail('nessuna cella con il soggetto');checks.c06_pivot=fail('nessuna cella con il soggetto');}
 else{
  const ref=used.filter(c=>stateOf(c.index)===spec.stato_riferimento),refHeights=(ref.length?ref:used).map(c=>c.height),refMedian=median(refHeights),target=spec.altezza_soggetto;
  const refBad=refHeights.filter(h=>Math.abs(h-target)>target*.02),free=new Set(spec.altezza_libera||[]);
  const familyBad=used.filter(c=>!free.has(stateOf(c.index))&&Math.abs(c.height-refMedian)>refMedian*.08);
  checks.c05_altezza=refBad.length||familyBad.length?fail(`riferimento ${refHeights.join('/')} px (atteso ${target} ±2 %); celle fuori ±8 %: ${familyBad.map(c=>c.index+':'+c.height).join(', ')||'nessuna'}`):pass(`riferimento ${refMedian} px; ${used.length} celle entro ±8 %`);
  // 6. Pivot: feet on the same row ±1 px and the same centre ±2 px.
  const rows=used.map(c=>c.feetRow),xs=used.map(c=>c.feetX),rowSpan=Math.max(...rows)-Math.min(...rows),xSpan=Math.max(...xs)-Math.min(...xs);
  checks.c06_pivot=rowSpan<=2&&xSpan<=4?pass(`riga dei piedi ${Math.min(...rows)}–${Math.max(...rows)}, centro ${Math.min(...xs)}–${Math.max(...xs)}`):fail(`riga dei piedi varia di ${rowSpan} px (max 2), centro di ${xSpan} px (max 4)`);
 }

 // 7. Colour count; palette share only when the district palette file exists.
 const palette=spec.palette?new Set(spec.palette.map(hex=>{const [r,g,b]=hexRgb(hex);return (r<<16)|(g<<8)|b;})):null;
 if(colours.size>spec.max_colori)checks.c07_colori=fail(`${colours.size} colori, limite ${spec.max_colori}`);
 else if(!palette)checks.c07_colori=unknown(`${colours.size} colori (limite ${spec.max_colori} rispettato); palette del distretto non ancora estratta`);
 else{let inside=0;for(const [key,n] of colours)if(palette.has(key))inside+=n;const share=inside/Math.max(1,opaqueCount),need=spec.quota_palette??.75;
  checks.c07_colori=share>=need?pass(`${colours.size} colori; ${(share*100).toFixed(1)} % dei pixel nella palette`):fail(`${(share*100).toFixed(1)} % nella palette, minimo ${need*100} %`);}

 // 8. Reserved colours: owners may use their band; danger ≤ 5 % on enemies and bosses; any other band ≤ 1 %.
 const owned=new Set(spec.bande_proprie||[]),pct=Object.fromEntries(Object.entries(bands).map(([k,n])=>[k,100*n/Math.max(1,opaqueCount)]));
 const over=Object.entries(pct).filter(([k,p])=>!owned.has(k)&&p>(k==='pericolo'?spec.pericolo_max_pct??5:1));
 checks.c08_colori_riservati=over.length?fail(over.map(([k,p])=>`${k} ${p.toFixed(2)} %`).join(', ')):pass(Object.entries(pct).map(([k,p])=>`${k} ${p.toFixed(2)} %`).join(', '));

 // 9. Outline: 2 px band on the silhouette edge (Rec. 601 luma, as the audit) ≤ 0.5 × interior; pure black ≤ 10 %.
 const N=png.width*png.height,dist=new Uint8Array(N).fill(255);
 for(let i=0;i<N;i++)if(opaque(i)){const x=i%png.width,y=(i/png.width)|0;let near=false;
  for(let dy=-2;dy<=2&&!near;dy++)for(let dx=-2;dx<=2;dx++){if(Math.abs(dx)+Math.abs(dy)>2)continue;const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=png.width||ny>=png.height||!opaque(ny*png.width+nx)){near=true;break;}}
  dist[i]=near?1:2;}
 const edge=[],inner=[];let black=0;
 for(let i=0;i<N;i++){if(dist[i]===255)continue;const r=png.data[i*4],g=png.data[i*4+1],b=png.data[i*4+2],l=luma(r,g,b);if(dist[i]===1){edge.push(l);if(r<=PURE_BLACK&&g<=PURE_BLACK&&b<=PURE_BLACK)black++;}else inner.push(l);}
 const edgeMedian=median(edge),innerMedian=median(inner),blackPct=100*black/Math.max(1,edge.length);
 if(edgeMedian==null||innerMedian==null)checks.c09_contorno=fail('soggetto troppo sottile per misurare bordo e interno');
 else checks.c09_contorno=edgeMedian<=innerMedian*.5&&blackPct<=10?pass(`bordo ${edgeMedian.toFixed(1)}, interno ${innerMedian.toFixed(1)}, nero puro ${blackPct.toFixed(1)} %`):fail(`bordo ${edgeMedian.toFixed(1)} (max ${(innerMedian*.5).toFixed(1)}), nero puro ${blackPct.toFixed(1)} % (max 10 %)`);

 // 10. Weight within the Pillar 3 budget, raw original unchanged (SHA-256 equal to the registry).
 const parts=[];let failed=false,missing=false;
 if(spec.budget_byte==null){missing=true;parts.push('budget del Pilastro 3 non ancora fissato');}
 else if(derivedBytes==null){missing=true;parts.push('peso del derivato non fornito');}
 else if(derivedBytes>spec.budget_byte){failed=true;parts.push(`${derivedBytes} byte, budget ${spec.budget_byte}`);}else parts.push(`${derivedBytes} byte entro ${spec.budget_byte}`);
 if(!spec.grezzo_sha256||!rawBuffer){missing=true;parts.push('grezzo o SHA-256 del registro assente');}
 else{const sha=crypto.createHash('sha256').update(rawBuffer).digest('hex');if(sha!==spec.grezzo_sha256){failed=true;parts.push('SHA-256 del grezzo diverso dal registro');}else parts.push('grezzo intatto');}
 checks.c10_peso_originale=failed?fail(parts.join('; ')):missing?unknown(parts.join('; ')):pass(parts.join('; '));

 const results=Object.values(checks).map(c=>c.result);
 return {result:results.includes('FAIL')?'FAIL':results.includes('NON_VERIFICABILE')?'INCOMPLETO':'PASS',checks,misure:{colori:colours.size,pixel_opachi:opaqueCount,celle_usate:used.length,bande_pct:pct}};
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const [derived,specPath,raw]=process.argv.slice(2);
 if(!derived||!specPath){console.error('uso: node tools/art_derived_checks.mjs <derivato.png> <spec.json> [grezzo.png]');process.exit(2);}
 const buffer=fs.readFileSync(derived),report=runChecks(decode(buffer),JSON.parse(fs.readFileSync(specPath,'utf8')),{rawBuffer:raw?fs.readFileSync(raw):null,derivedBytes:buffer.length});
 console.log(JSON.stringify(report,null,1));process.exit(report.result==='FAIL'?1:0);
}
