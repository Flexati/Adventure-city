// Brief v2 and GPT prompts for the four Part I bosses to regenerate (D23, D28, D30).
// Writes requests/gpt-boss-v2-20261102/ only: briefs, prompts, references and INDICE.json with SHA-256.
// Deterministic: the same briefs always give byte-identical prompts. Published versions are never edited:
// a change means a v3 brief, not a rewrite of v2.
//
// Usage: node tools/build_boss_v2.mjs [repo_root]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {PNG} from 'pngjs';
import {signalBand,hexRgb} from './art_derived_checks.mjs';

export const PACKAGE='gpt-boss-v2-20261102';
export const VERSION=2;

// Boss contract (CHRONOS_ARTE_P2_PIPELINE.md, section 6): 230 u × 1.25 px/u = 287.5 → 288 px, cell 320, 8 columns.
export const CONTRACT=Object.freeze({
 altezza_disegnata_u:230,densita_px_u:1.25,altezza_soggetto:288,cella:[320,320],colonne:8,tela:[2560,1280],max_colori:64,
 stati:[['fermo',4],['cammina',4],['preparazione',4],['attacco',4],['recupero',2],['colpito',2],['cambio_fase',4],['sconfitto',4]],
 stato_riferimento:'fermo',altezza_libera:['sconfitto','colpito'],pericolo_max_pct:5,bande_proprie:[]
});
// Cell index → state, row by row: 4 rows of 8, 28 frames, the last 4 cells empty.
export const CELLS=Object.freeze(CONTRACT.stati.flatMap(([state,n])=>Array(n).fill(state)));

// GPT returns at most 1536 × 1024 in the existing pipeline (every 310 prompt uses it). The sheet is therefore drawn in
// four parts of 8 poses on a 4 × 2 grid (cells 384 × 512), then cut, scaled with Lanczos and laid out by the cleaning step.
export const PARTS=Object.freeze([
 {id:'A',stati:[['fermo',4],['cammina',4]],varianti:2,nota:'Questa parte fissa proporzioni e costume dello sheet: se ne fanno 2 varianti e si sceglie la migliore'},
 {id:'B',stati:[['preparazione',4],['attacco',4]],varianti:1,nota:'Si parte dalla variante scelta della parte A'},
 {id:'C',stati:[['recupero',2],['colpito',2],['cambio_fase',4]],varianti:1,nota:'Si parte dalla variante scelta della parte A'},
 {id:'D',stati:[['sconfitto',4],['effetti',4]],varianti:1,nota:'Gli effetti della riga 2 sono un asset separato dal boss'}
]);

const RESERVED_WORDS='nessun ciano o azzurro brillante (è il colore di Nox), nessun magenta, rosa o viola-rosa brillante (è di Lulù), nessun verde acqua o menta brillante (indica gli oggetti da usare)';

export const BOSSES=Object.freeze([
 {id:'bone_tyrant',nome:'Cathedral Bone Tyrant',distretto:'necropoli',distretto_nome:'la Necropoli della Cattedrale',
  identita:"sistema di conservazione funeraria fatto di molti resti e custodie; architettura archivistica, NON negromanzia",
  materiali:'osso levigato come avorio d\'archivio, legno scuro di teche, lacca rosso scuro, bronzo ossidato con patina verde spenta',
  mossa:'pannelli e custodie mobili che si aprono con un anticipo evidente; serrature e montacarichi sincronizzati',
  riferimento:'cathedral_bone_tyrant.png',
  palette:{'#241C18':'contorno, tono più scuro del legno','#3A3028':'legno, ombra','#6E6458':'pietra e legno, base','#A89C88':'osso, ombra','#C8C0B0':'osso, base','#E8E0D0':'osso, luce','#5A141C':'lacca, ombra','#8A1E2A':'lacca, base','#3E625C':'bronzo ossidato, ombra','#5E8A80':'bronzo ossidato, base (verde spento)'},
  effetti:{'#FF6343':'avviso e colpo','#FFB74B':'impatto'},
  sostituzioni:[['#7AE8D8','#5E8A80 e #3E625C','verde acqua brillante al confine fra «interattivo» e Nox: diventa bronzo ossidato spento']],
  audio:'serrature sincronizzate, montacarichi, campana'},
 {id:'forge_behemoth',nome:'Toxic Forge Behemoth',distretto:'toxic_forge',distretto_nome:'la Toxic Forge',
  identita:'fabbrica automatica enorme con bracci da pressa, rulli e nastri; nessuna faccia animale obbligatoria',
  materiali:'ghisa scura, ottone e rame consumati, nastri di gomma, residui tossici verde-giallo',
  mossa:'i bracci da pressa si sollevano e si fermano un istante prima di scendere; rulli che indicano la fase di compressione',
  riferimento:'toxic_forge_behemoth.png',
  palette:{'#1E1A1E':'contorno, tono più scuro della ghisa','#3A3438':'ghisa, ombra','#5A5458':'ghisa, base','#8A8288':'acciaio, luce','#7A4A1E':'rame, ombra','#C8822E':'ottone, base','#D89A3A':'ottone, luce e bagliore del forno sul corpo','#6E8A3A':'residuo tossico, ombra','#A8D86A':'residuo tossico, base','#C8FF8A':'residuo tossico, luce'},
  effetti:{'#FF8A4A':'calore, avviso e colpo','#FF6343':'impatto'},
  sostituzioni:[['#FF8A4A sul corpo','#D89A3A','l\'arancio brillante è il colore del pericolo: resta solo negli effetti d\'attacco']],
  audio:'pressa, sirena di ciclo, vapore'},
 {id:'shadow_reaper',nome:'Shadow Reaper',distretto:'glass_flood',distretto_nome:'Glass Flood',
  identita:'figura sottile fra acqua e vetro che tratta un futuro possibile come destino; nessuna lama stereotipata obbligatoria',
  materiali:'vetro bagnato, tessuto pesante intriso d\'acqua, riflessi spezzati, nucleo viola-blu',
  mossa:'il riflesso mostra il colpo possibile con un tratto discontinuo, poi arriva il colpo vero',
  riferimento:'shadow_reaper.png',
  palette:{'#141C28':'contorno, tono più scuro del tessuto','#1E2A3A':'tessuto, ombra','#34465E':'tessuto, base','#5C7890':'vetro, ombra','#8FB8C8':'vetro, base (azzurro spento)','#D8E4EC':'riflessi','#4A3A9A':'nucleo, ombra','#6A4ED8':'nucleo, base (viola-blu)'},
  effetti:{'#FF6343':'avviso e colpo','#FFB74B':'impatto'},
  sostituzioni:[['#9AE8FF','#8FB8C8','ciano brillante di Nox: diventa azzurro vetro spento'],['magenta del nucleo (3,9 % nella banda di Lulù nella striscia di oggi)','#6A4ED8','viola-blu, fuori dalla banda di Lulù']],
  audio:'vetro che vibra, acqua, eco'},
 {id:'vega',nome:'Vega',distretto:null,distretto_nome:'un poligono di precisione',
  identita:'tiratrice disciplinata con armatura leggera, mirino e taccuino di allineamento; completa l\'H-17',
  materiali:'armatura leggera bianca e grigia, tessuto tecnico scuro, lenti del mirino blu',
  mossa:'una linea diritta di preparazione prima del tiro, poi il recupero visibile',
  riferimento:null,
  palette:{'#121216':'contorno, tono più scuro del tessuto','#1A1A1E':'tessuto tecnico, ombra','#4A4E56':'tessuto tecnico, base','#8A8E96':'armatura, ombra','#C8CACE':'armatura, base','#E8E8EC':'armatura, luce','#2A4A8A':'lenti, ombra','#4A78D8':'lenti, base (blu, non ciano)','#A8C0E8':'lenti, riflesso'},
  effetti:{'#FF6343':'linea di mira e colpo','#FFB74B':'impatto'},
  sostituzioni:[['#59E0FF','#4A78D8 e #A8C0E8','ciano brillante di Nox: le lenti diventano blu']],
  audio:'respiro, scatto di precisione'}
]);

export function brief(boss){
 return {
  asset_id:`boss.${boss.id}.sheet`,versione:VERSION,pacchetto:PACKAGE,stato:'PROMPT_READY',immagini_generate:0,
  decisioni:['D23','D28','D30'],
  soggetto:{nome:boss.nome,identita:boss.identita,materiali:boss.materiali,mossa:boss.mossa,arena:boss.distretto_nome},
  vista:'dall\'alto 3/4, come la camera del gioco',
  luce:'una sola, dall\'alto a sinistra; ombre a gradini in basso a destra; nessuna ombra a terra (regole L1-L3)',
  palette_id:boss.distretto,palette_distretto:{file:null,stato:'DA_ESTRARRE',nota:'P2: la palette di 64 colori del distretto non esiste ancora; il controllo 7 resta NON_VERIFICABILE finché non c\'è'},
  colori:boss.palette,colori_effetti_attacco:boss.effetti,sostituzioni_v01:boss.sostituzioni.map(([da,a,perche])=>({da,a,perche})),
  colori_vietati:{bande:{nox:[175,200],lulu:[275,325],interattivo:[140,170]},aspetto_segnale:{saturazione_min:.35,luminosita_min:.9},pericolo:'340-40°, solo negli effetti d\'attacco; sul corpo ≤ 5 %'},
  contorno:{spessore_px:2,colore:'il tono più scuro della rampa del materiale',nero_puro_max_pct:10},
  sfondo:{colore:'#00FF00',margine_min_px:40},
  tela:CONTRACT.tela,cella:CONTRACT.cella,colonne:CONTRACT.colonne,altezza_soggetto:CONTRACT.altezza_soggetto,
  altezza_disegnata_u:CONTRACT.altezza_disegnata_u,densita_px_u:CONTRACT.densita_px_u,
  stati:Object.fromEntries(CONTRACT.stati),celle:CELLS,stato_riferimento:CONTRACT.stato_riferimento,altezza_libera:CONTRACT.altezza_libera,
  max_colori:CONTRACT.max_colori,bande_proprie:CONTRACT.bande_proprie,pericolo_max_pct:CONTRACT.pericolo_max_pct,budget_byte:null,
  varianti:{identita:4,sheet_parte_A:2,sheet_parti_BCD:1},
  parti_grezze:PARTS.map(p=>({id:p.id,tela:[1536,1024],griglia:[4,2],stati:Object.fromEntries(p.stati),varianti:p.varianti})),
  riferimenti:[...(boss.riferimento?[`ref_striscia_${boss.id}.png`]:[]),'ref_boss.png','ref_scala.png'],
  restrizioni:['nessun testo, marchio o logo leggibile','nessun valore di gioco disegnato (danni, hitbox, tempi, raggi)','Nox e Lulù non si ridisegnano: compaiono solo come sagoma di scala nel riferimento','Kairn e Morrow non compaiono','nessun civile usato come arma o bersaglio','nessun personaggio o stile riconoscibile di altre opere'],
  consegna:{ramo:`delivery/${PACKAGE}`,cartella:`deliveries/${PACKAGE}/${boss.id}/`},
  derivato:`assets/production/v10.3/derived/boss.${boss.id}.sheet/v${VERSION}/sheet.png`
 };
}

const list=entries=>Object.entries(entries).map(([hex,role])=>`${hex}: ${role}`).join('; ');
// Rows of each raw part: 4 cells per row.
const ROWS={A:['Riga 1: fermo, 4 pose che respirano appena.','Riga 2: cammina, 4 pose di un passo completo.'],B:['Riga 1: preparazione dell\'attacco, 4 pose in cui la sagoma cambia forma.','Riga 2: attacco, 4 pose.'],C:['Riga 1: recupero, 2 pose; poi colpito, 2 pose.','Riga 2: cambio di fase, 4 pose.'],D:['Riga 1: sconfitto, 4 pose in sequenza fino a terra.','Riga 2: solo effetti, senza il boss: avviso, attacco, impatto, ritorno a riposo. L\'avviso cresce di forma ed è tratteggiato, il colpo è pieno: si leggono anche senza colore.']};
const deliveryNames=(boss,stage)=>stage==='identita'?['a','b','c','d'].map(v=>`identita_v2${v}.png`):(PARTS.find(p=>p.id===stage).varianti===2?[`sheet_${stage}_v2a.png`,`sheet_${stage}_v2b.png`]:[`sheet_${stage}_v2.png`]);

function common(boss){
 return [
  `2. SOGGETTO, MATERIALI E COLORI\n- ${boss.nome}: ${boss.identita}.\n- Materiali: ${boss.materiali}.\n- Colori del corpo, solo questi o loro mezzi toni: ${list(boss.palette)}.\n- Colori degli effetti d'attacco, mai sul corpo: ${list(boss.effetti)}.\n- Vietato sul corpo: ${RESERVED_WORDS}; arancio o rosso brillante solo negli effetti d'attacco.`,
  `3. STILE\nPixel art HD come gli sprite dei boss del gioco (ref_boss.png): contorno scuro di 2 px nel tono più scuro di ogni materiale, non nero puro; ombre a gradini, da 2 a 4 toni per materiale; nessuna sfumatura morbida, nessun aspetto 3D o fotografico. Luci proprie (nuclei, forni) piccole e solo dove servono a leggere l'attacco.`,
  `4. CAMERA, LUCE E PROPORZIONI\nCamera del gioco dall'alto 3/4. Una sola luce dall'alto a sinistra: le ombre cadono in basso a destra. Nessuna ombra a terra: la disegna il gioco. Il boss è alto circa il doppio di Nox (ref_scala.png: la sagoma nera è Nox, il riquadro grigio è l'altezza del boss); Nox NON va disegnato.`
 ];
}
const RESTRICTIONS=`8. RESTRIZIONI\n- nessun testo, numero, marchio o logo leggibile; simboli solo inventati e illeggibili\n- nessun valore di gioco disegnato: niente danni, hitbox, raggi o tempi\n- Nox e Lulù non compaiono; Kairn e Morrow non compaiono\n- nessun civile usato come arma o bersaglio; nessuna demonizzazione di persone, malattia o disabilità\n- nessun personaggio, opera o stile riconoscibile di altre proprietà intellettuali; nessuna persona reale\n- il disegno non deve far leggere un pericolo dove non c'è`;
const BACKGROUND=`7. SFONDO E FORMATO\nPNG 1536×1024. Sfondo verde puro #00FF00 piatto su tutta l'immagine; almeno 40 px di verde su ogni lato di ogni posa. Nessun alone verde sul soggetto e nessun colore del soggetto vicino al verde.`;

export function prompt(boss,stage){
 const b=brief(boss),files=deliveryNames(boss,stage),folder=b.consegna.cartella;
 const refs=b.riferimenti.join(', ');
 let title,identity,produce,family;
 if(stage==='identita'){
  title=`identità (${b.varianti.identita} varianti)`;
  identity=`1. IDENTITÀ\nDisegna l'identità del boss ${boss.nome} (arena: ${boss.distretto_nome}). ${boss.riferimento?'La striscia di oggi (ref_striscia_'+boss.id+'.png) è solo un riferimento di idea: ridisegna il boss più grande e più leggibile, non copiarla.':'Non esiste ancora una striscia di gioco: questa tavola fissa l\'identità.'} Mossa tipica: ${boss.mossa}.`;
  produce=`5. IMMAGINE DA PRODURRE\nTre pose affiancate, stessa scala, ciascuna alta circa 700 px: riposo, preparazione dell'attacco, attacco. La preparazione deve cambiare la forma della sagoma, non solo il colore. Genera questo prompt ${b.varianti.identita} volte, una variante per volta.`;
  family=`6. COERENZA\nLe tre pose sono lo stesso boss: costume, accessori e proporzioni identici.`;
 }else{
  const part=PARTS.find(p=>p.id===stage);
  title=`sheet, parte ${stage}`;
  const rows=ROWS[stage].join(' ');
  identity=`1. IDENTITÀ\nSheet del boss ${boss.nome} approvato nell'identità: allega l'immagine d'identità scelta${stage==='A'?'':' e la parte A scelta'}. Stesso costume, stessi colori, stesse proporzioni.`;
  produce=`5. IMMAGINE DA PRODURRE\nGriglia di 4 colonne × 2 righe, celle di 384 × 512 px, una posa per cella, centrata, con i piedi sulla stessa riga in ogni cella. ${rows}${part.varianti>1?' Genera questo prompt '+part.varianti+' volte.':''}`;
  family=`6. COERENZA\nIn ogni cella il boss ha la stessa altezza (circa 430 px in piedi), lo stesso punto d'appoggio e la stessa luce. ${part.nota}.`;
 }
 const body=[identity,...common(boss),produce,family,BACKGROUND,RESTRICTIONS].join('\n\n');
 return `# boss.${boss.id} — ${boss.nome} · v${VERSION} · ${title}\n\nStato: **PROMPT_READY** · nessuna immagine generata · \`COMMERCIAL_RELEASE = BLOCKED\`\n\n**Allegati** (cartella \`riferimenti/\`): ${refs}\n\n**Consegna**: ramo \`${b.consegna.ramo}\`, cartella \`${folder}\`, file: ${files.map(f=>'`'+f+'`').join(', ')}\n\nBrief: \`brief/boss.${boss.id}.sheet.v${VERSION}.json\`\n\n\`\`\`\nSei l'illustratore di CHRONOS Adventure: Nox & Lulù.\n\n${body}\n\`\`\`\n\nBrief audio per il team (non va disegnato): ${boss.audio}; anticipo, attacco e recupero hanno suoni distinti.\n`;
}

export const STAGES=['identita','A','B','C','D'];
export const sha256=data=>crypto.createHash('sha256').update(data).digest('hex');

// Problems the test asserts are empty: body colours in a reserved band, attack colours outside the danger band.
export function paletteProblems(boss){
 const out=[];
 for(const hex of Object.keys(boss.palette)){const band=signalBand(...hexRgb(hex));if(band)out.push(`${boss.id} ${hex} corpo nella banda ${band}`);}
 for(const hex of Object.keys(boss.effetti)){const band=signalBand(...hexRgb(hex));if(band!=='pericolo')out.push(`${boss.id} ${hex} effetto fuori dal pericolo (${band})`);}
 if(Object.keys(boss.palette).length+Object.keys(boss.effetti).length>CONTRACT.max_colori)out.push(`${boss.id} troppi colori`);
 return out;
}

// Scale reference: Nox's real first walk frame as a black silhouette at 1.25 px/u (112 u → 140 px), beside a grey
// frame 288 px tall for the boss (230 u). No text: GPT must not learn to draw labels.
function scaleReference(root){
 const source=PNG.sync.read(fs.readFileSync(path.join(root,'game/art/v05/nox_walk.png')));
 const cw=326,ch=301;let top=ch,bottom=-1,left=cw,right=-1;
 for(let y=0;y<ch;y++)for(let x=0;x<cw;x++)if(source.data[(y*source.width+x)*4+3]>=128){top=Math.min(top,y);bottom=Math.max(bottom,y);left=Math.min(left,x);right=Math.max(right,x);}
 const sh=bottom-top+1,sw=right-left+1,th=140,tw=Math.round(sw*th/sh);
 const out=new PNG({width:420,height:340});
 for(let i=0;i<out.width*out.height;i++){out.data[i*4]=out.data[i*4+1]=out.data[i*4+2]=255;out.data[i*4+3]=255;}
 const ground=320,noxX=40;
 for(let y=0;y<th;y++)for(let x=0;x<tw;x++){const sx=left+Math.floor(x*sw/tw),sy=top+Math.floor(y*sh/th);if(source.data[(sy*source.width+sx)*4+3]>=128){const o=((ground-th+y)*out.width+noxX+x)*4;out.data[o]=out.data[o+1]=out.data[o+2]=0;}}
 const bx=200,bw=180,bt=ground-288;
 for(let y=bt;y<ground;y++)for(let x=bx;x<bx+bw;x++){const border=y<bt+3||y>=ground-3||x<bx+3||x>=bx+bw-3;const o=(y*out.width+x)*4;const v=border?96:200;out.data[o]=out.data[o+1]=out.data[o+2]=v;}
 for(let x=20;x<400;x++){const o=(ground*out.width+x)*4;out.data[o]=out.data[o+1]=out.data[o+2]=128;}
 return PNG.sync.write(out);
}

export function build(root){
 const dir=path.join(root,'requests',PACKAGE);
 for(const sub of ['brief','prompt','riferimenti'])fs.mkdirSync(path.join(dir,sub),{recursive:true});
 const sources=[],refs={};
 const copy=(from,to)=>{const data=fs.readFileSync(path.join(root,from));fs.writeFileSync(path.join(dir,'riferimenti',to),data);sources.push({file:to,source:from,sha256:sha256(data)});};
 copy('requests/gpt-preproduzione-310-20261029/riferimenti/ref_boss.png','ref_boss.png');
 for(const boss of BOSSES)if(boss.riferimento)copy('game/art/chrono/'+boss.riferimento,`ref_striscia_${boss.id}.png`);
 const scale=scaleReference(root);fs.writeFileSync(path.join(dir,'riferimenti','ref_scala.png'),scale);
 sources.push({file:'ref_scala.png',source:'game/art/v05/nox_walk.png (prima cella, solo sagoma)',sha256:sha256(scale)});
 fs.writeFileSync(path.join(dir,'riferimenti','SORGENTI.json'),JSON.stringify({nota:'Solo arte reale del gioco; le strisce da 128 px restano invariate in game/art/chrono/ (D28).',sorgenti:sources},null,1)+'\n');
 const index=[];
 for(const boss of BOSSES){
  const b=brief(boss),briefText=JSON.stringify(b,null,1)+'\n',briefPath=`brief/boss.${boss.id}.sheet.v${VERSION}.json`;
  fs.writeFileSync(path.join(dir,briefPath),briefText);
  for(const stage of STAGES){
   const text=prompt(boss,stage),promptPath=`prompt/boss.${boss.id}.${stage==='identita'?'identita':'sheet_'+stage}.v${VERSION}.md`;
   fs.writeFileSync(path.join(dir,promptPath),text);
   index.push({asset_id:b.asset_id,fase:stage,versione:VERSION,prompt:`requests/${PACKAGE}/${promptPath}`,sha256:sha256(text),brief:`requests/${PACKAGE}/${briefPath}`,brief_sha256:sha256(briefText),
    riferimenti:b.riferimenti,consegna:deliveryNames(boss,stage).map(f=>b.consegna.cartella+f),stato:'PROMPT_READY',immagini_generate:0});
  }
 }
 const images=index.reduce((n,e)=>n+e.consegna.length,0);
 fs.writeFileSync(path.join(dir,'INDICE.json'),JSON.stringify({pacchetto:PACKAGE,nota:'Un prompt pronto non è un\'immagine. COMMERCIAL_RELEASE = BLOCKED.',ramo_consegna:`delivery/${PACKAGE}`,immagini_da_generare:images,prompts:index},null,1)+'\n');
 return {prompts:index.length,images};
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
 const root=path.resolve(process.argv[2]||'.');
 const problems=BOSSES.flatMap(paletteProblems);if(problems.length){console.error(problems.join('\n'));process.exit(1);}
 const {prompts,images}=build(root);console.log(`${PACKAGE}: ${prompts} prompt, ${images} immagini da generare`);
}
