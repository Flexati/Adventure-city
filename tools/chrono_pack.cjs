// Deterministic technical atlas packing; artwork comes from retained image_gen originals.
// Run after copying generated sources. No artboard is sliced into a runtime atlas.
const fs=require('fs'),path=require('path'),{PNG}=require('pngjs');
const ROOT=path.join(__dirname,'..'),SOURCE=path.join(ROOT,'assets/chrono_shadows/production_sources');
const OUT=path.join(ROOT,'game/art/chrono'),CELL=128,PIVOT=120;
fs.mkdirSync(OUT,{recursive:true});
const read=n=>PNG.sync.read(fs.readFileSync(path.join(SOURCE,n+'.png')));
const write=(n,p)=>fs.writeFileSync(path.join(OUT,n+'.png'),PNG.sync.write(p));
const manifest={schema_version:1,world_tile_size:64,coordinate_system:'frame pixels; boxes relative to ground pivot; world scale = draw_height / sprite_height',collision_policy:'Documentation only: existing campaign geometry and damage calculations remain authoritative.',atlases:{},animations:[],sources:[]};
function cell(im,col,row,cols,rows){
 const x=Math.round(col*im.width/cols),y=Math.round(row*im.height/rows),w=Math.round((col+1)*im.width/cols)-x,h=Math.round((row+1)*im.height/rows)-y;
 const p=new PNG({width:w,height:h});
 for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){const a=((y+yy)*im.width+x+xx)*4,b=(yy*w+xx)*4;im.data.copy(p.data,b,a,a+4);if(p.data[b+3]<64)p.data.fill(0,b,b+4);else p.data[b+3]=255;}
 return p;
}
function bounds(p){let l=p.width,t=p.height,r=-1,b=-1;for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++)if(p.data[(y*p.width+x)*4+3]){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}if(r<l)throw Error('empty source cell');return {x:l,y:t,w:r-l+1,h:b-t+1};}
// Segment globally before packing. Generated weapons may cross nominal grid lines;
// clipping cells would cut their tips and leak those tips into a neighbor's frame.
function segmentedFrames(im,cols,rows){
 const n=im.width*im.height,labels=new Int32Array(n),queue=new Int32Array(n),components=[null];let label=0;
 for(let start=0;start<n;start++)if(!labels[start]&&im.data[start*4+3]>=64){
  label++;let head=0,tail=0;queue[tail++]=start;labels[start]=label;const overlap=new Uint32Array(cols*rows);let l=im.width,t=im.height,r=0,b=0;
  while(head<tail){const i=queue[head++],x=i%im.width,y=Math.floor(i/im.width);l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);overlap[Math.min(rows-1,Math.floor(y/im.height*rows))*cols+Math.min(cols-1,Math.floor(x/im.width*cols))]++;
   for(let yy=Math.max(0,y-1);yy<=Math.min(im.height-1,y+1);yy++)for(let xx=Math.max(0,x-1);xx<=Math.min(im.width-1,x+1);xx++){const j=yy*im.width+xx;if(!labels[j]&&im.data[j*4+3]>=64){labels[j]=label;queue[tail++]=j;}}
  }components.push({label,pixels:tail,overlap,box:{x:l,y:t,w:r-l+1,h:b-t+1}});
 }
 const used=new Set(),result=[];
 for(let i=0;i<cols*rows;i++){
  const best=components.slice(1).filter(c=>!used.has(c.label)).sort((a,b)=>b.overlap[i]-a.overlap[i])[0];if(!best||best.overlap[i]<100)throw Error('No isolated figure in cell '+i);used.add(best.label);
  const box=best.box,p=new PNG({width:box.w,height:box.h});for(let y=0;y<box.h;y++)for(let x=0;x<box.w;x++){const j=(box.y+y)*im.width+box.x+x;if(labels[j]===best.label){im.data.copy(p.data,(y*box.w+x)*4,j*4,j*4+4);p.data[(y*box.w+x)*4+3]=255;}}result.push(p);
 }return result;
}
function blit(dst,src,box,dx,dy,w,h){for(let y=0;y<h;y++)for(let x=0;x<w;x++){const sx=box.x+Math.min(box.w-1,Math.floor(x/w*box.w)),sy=box.y+Math.min(box.h-1,Math.floor(y/h*box.h));const a=(sy*src.width+sx)*4,b=((dy+y)*dst.width+dx+x)*4;if(dx+x>=0&&dy+y>=0&&dx+x<dst.width&&dy+y<dst.height)src.data.copy(dst.data,b,a,a+4);}}
function packedActors(frames,columns=frames.length,target=104){
 const bb=frames.map(bounds),anchors=frames.map((p,i)=>{const b=bb[i],xs=[];for(let y=b.y+Math.floor(b.h*.88);y<b.y+b.h;y++)for(let x=b.x;x<b.x+b.w;x++)if(p.data[(y*p.width+x)*4+3])xs.push(x-b.x);xs.sort((a,b)=>a-b);return xs[Math.floor(xs.length/2)]+.5;});
 const extent=Math.max(...bb.map((b,i)=>Math.max(anchors[i],b.w-anchors[i])));let scale=Math.min(target/bb[0].h,112/Math.max(...bb.map(b=>b.h)),122/extent);
 const width=Math.max(128,Math.ceil((2*extent*scale+12)/16)*16),out=new PNG({width:columns*width,height:Math.ceil(frames.length/columns)*CELL});
 for(let i=0;i<frames.length;i++){const b=bb[i],w=Math.round(b.w*scale),h=Math.round(b.h*scale);blit(out,frames[i],b,i%columns*width+Math.round(width/2-anchors[i]*scale),Math.floor(i/columns)*CELL+PIVOT-h,w,h);}
 return {out,width,columns,anchor_method:'Median opaque foot pixels in lower 12% of each isolated pose; constant ground baseline; weapon reach determines cell width'};
}
function addAnim(id,name,atlas,indices,{fps=6,loop=false,layer='actor',audio=null,quality='keyframes',integrated=false}={}){
 const width=manifest.atlases[atlas]?.cell_width||CELL,columns=manifest.atlases[atlas]?.atlas_columns||indices.length;
 const a={character_id:id,animation_id:name,frame_count:indices.length,fps,loop,sprite_width:width,sprite_height:CELL,pivot_x:width/2,pivot_y:PIVOT,collision_box:{x:-16,y:-10,width:32,height:20,space:'world',source:'campaign.mjs moveActor(): x +/-16, y +/-10; anchor is actor XY ground point'},attack_box:null,attack_box_policy:'Existing role attackRadius, target and release timing are authoritative; artwork cannot apply damage.',effect_layer:layer,audio_event:audio,atlas_reference:atlas,frame_rectangles:indices.map(i=>({x:i%columns*width,y:Math.floor(i/columns)*CELL,width,height:CELL})),status:integrated?'integrated':'cleaned',animation_quality:quality};manifest.animations.push(a);return a;
}
function packRows(source,ids,cols,rows,kind){
 const im=read(source),segmented=segmentedFrames(im,cols,rows);manifest.sources.push({path:'assets/chrono_shadows/production_sources/'+source+'.png',tool:'image_gen.imagegen',model:'not exposed by tool',original_dimensions:[im.width,im.height],transformations:['global connected-component isolation; preserves weapons crossing nominal grid','alpha threshold 64; detached glow/particles removed','nearest-neighbor resampling','fixed ground pivot','transparent 6px gutters'],license:'Generated in this session; provider terms apply; no independent rights clearance claimed.'});
 for(let row=0;row<ids.length;row++){
  const id=ids[row],frames=segmented.slice(row*cols,(row+1)*cols),packed=packedActors(frames),out=packed.out;
  write(id,out);manifest.atlases[id]={path:'art/chrono/'+id+'.png',width:out.width,height:out.height,cell_width:packed.width,atlas_columns:cols,anchor_method:packed.anchor_method,bytes:fs.statSync(path.join(OUT,id+'.png')).size,frame_count:cols,source,source_row:row,reserve:true};
  if(kind==='enemy'){for(const [name,indices,opt]of [['idle',[0],{loop:true}],['walk',[1,2],{fps:6,loop:true}],['anticipation',[3],{}],['attack',[4],{audio:'impact'}],['recover',[5],{}],['hurt',[6],{}],['defeat',[7],{}]])addAnim(id,name,id,indices,opt);}
  if(kind==='ally'){for(const [name,indices,opt]of [['idle',[0],{loop:true}],['walk',[1,2],{loop:true}],['anticipation',[3],{}],['attack',[3,4],{fps:8}],['special',[3,4],{fps:8,audio:id==='demon_hunter_survivor'?'chainsaw':'chrono_energy'}],['hurt',[5],{}],['defeat',[5],{}]])addAnim(id,name,id,indices,{...opt,quality:'pose sequence; hurt/defeat share kneeling keyframe; needs inbetweens'});}
  if(kind==='boss'){for(const [name,indices]of [['idle',[0]],['anticipation',[1]],['attack',[2]],['phase_transition',[3]],['stagger',[3]],['core_exposed',[4]],['final_hit',[5]],['collapse',[6]],['reward_portal',[7]],['defeat',[3,4,5,6,7]]])addAnim(id,name,id,indices,{fps:5,loop:name==='idle',quality:'defeat keyframes; core_exposed must hold for player final hit'});}
  if(kind==='npc'){for(const [name,indices,opt]of [['idle',[0],{loop:true}],['walk',[1,2],{loop:true}],['talk',[0,3],{loop:true,fps:3}],['gesture',[3,4],{fps:4}],['shop_interaction',[0,4,5],{fps:4}],['sell',[4,5],{fps:4}],['receive_item',[5,0],{fps:4}]])addAnim(id,name,id,indices,{...opt,quality:'short pose animation; no shop mechanics implemented'});}
 }
}
packRows('allies',['desert_chrono_fighter','demon_hunter_survivor','chrono_huntress','iron_penitent','toxic_brawler','valkyrie_striker'],6,6,'ally');
packRows('undead',['skeleton_shield_bearer','ghoul_runner','crawling_corpse','plague_cultist_caster','toxic_mutant_zombie'],8,6,'enemy');
packRows('tech',['chrono_drone','purple_guard','mech_hound','toxic_bomber','flame_alchemist','striker_unit'],8,6,'enemy');
for(const id of ['desert_chrono_fighter','demon_hunter_survivor','chrono_huntress','iron_penitent','toxic_brawler','valkyrie_striker'])if(fs.existsSync(path.join(SOURCE,id+'-full.png'))){
 const source=id+'-full',im=read(source);let frames;try{frames=segmentedFrames(im,4,6);}catch(e){(manifest.rejections||=[]).push({source,reason:e.message,status:'generation rejected; previous pose sheet retained'});continue;}
 const packed=packedActors(frames,8),out=packed.out;write(id,out);
 manifest.atlases[id]={path:'art/chrono/'+id+'.png',width:out.width,height:out.height,cell_width:packed.width,atlas_columns:8,anchor_method:packed.anchor_method,frame_count:24,reserve:true,source};manifest.animations=manifest.animations.filter(a=>a.character_id!==id);
 for(const [r,name,fps,loop]of [[0,'idle',4,true],[1,'walk',8,true],[2,'attack',10,false],[3,'special',8,false],[4,'hurt',12,false],[5,'defeat',6,false]])addAnim(id,name,id,[r*4,r*4+1,r*4+2,r*4+3],{fps,loop,quality:'four distinct generated frames per animation; reserve, not a campaign feature',audio:id==='demon_hunter_survivor'?(name==='attack'?'chainsaw':name==='special'?'shotgun':null):name==='special'?'chrono_energy':null});
 manifest.sources.push({path:'assets/chrono_shadows/production_sources/'+source+'.png',tool:'image_gen.imagegen',model:'not exposed by tool',image_reference:'assets/chrono_shadows/production_sources/allies.png',reference_artboards:['scheda_sprite_eroi_chrono_shadows.webp','scheda_sprite_neon_di_adventure_city.webp'],transformations:['global component isolation','alpha threshold 64','nearest-neighbor normalization','fixed ground pivot','transparent gutters'],license:'Session generation; provider terms apply.'});
}
for(const [source,ids,cols,rows,kind]of [['bosses',['chrono_overlord','shadow_reaper','cathedral_bone_tyrant','toxic_forge_behemoth'],8,4,'boss'],['npc_a',['gate_guard','blacksmith','potion_alchemist','relic_priestess','innkeeper'],6,5,'npc'],['npc_b',['mechanic','masked_informant','scavenger_kid','traveling_bard','civilian'],6,5,'npc']])if(fs.existsSync(path.join(SOURCE,source+'.png')))packRows(source,ids,cols,rows,kind);
// Sample sheet has custom animation layout; skeleton is not the shield-bearing reserve variant.
{
 const im=read('sample'),segmented=segmentedFrames(im,6,4);for(const [id,rows]of [['merchant',[0,1]],['skeleton_swordsman',[2,3]]]){
  const frames=rows.flatMap(r=>segmented.slice(r*6,r*6+6));if(id==='skeleton_swordsman'){const walk=segmentedFrames(read('undead'),8,6);frames.push(walk[41],walk[42]);}const columns=id==='skeleton_swordsman'?7:6,packed=packedActors(frames,columns,100),out=packed.out;write(id,out);manifest.atlases[id]={path:'art/chrono/'+id+'.png',width:out.width,height:out.height,cell_width:packed.width,atlas_columns:columns,anchor_method:packed.anchor_method,frame_count:frames.length,reserve:true,source:'sample',additional_source:id==='skeleton_swordsman'?'undead row 6 walk frames 2 and 3':null};
 }
 for(const [name,seq,opt]of [['idle',[0,1,2,1],{loop:true,fps:3}],['walk',[6,7,8,9,10,11],{loop:true,fps:8}],['talk',[0,2,0,1],{loop:true,fps:4}],['gesture',[0,3,4,5],{}],['shop_interaction',[0,3,4,5],{}],['sell',[3,4,5],{}],['receive_item',[4,3,0],{}]])addAnim('merchant',name,'merchant',seq,{...opt,quality:'generated sample; no shop mechanics implemented'});
 for(const [name,seq,opt]of [['idle',[0],{loop:true}],['walk',[12,13],{loop:true,quality:'two unique locomotion frames from cleaned undead row 6; six-frame defeat comes from sample'}],['anticipation',[1,2],{}],['attack',[3],{}],['recover',[4],{}],['hurt',[5],{}],['defeat',[6,7,8,9,10,11],{fps:8}]])addAnim('skeleton_swordsman',name,'skeleton_swordsman',seq,opt);
}
// Complete NPC/enemy passes replace the initial pose sets only after segmentation succeeds.
const completeEnemies=['skeleton_swordsman','skeleton_shield_bearer','ghoul_runner','crawling_corpse','plague_cultist_caster','toxic_mutant_zombie','chrono_drone','purple_guard','mech_hound','toxic_bomber','flame_alchemist','striker_unit'];
const completeNpcs=['merchant','gate_guard','blacksmith','potion_alchemist','relic_priestess','innkeeper','mechanic','masked_informant','scavenger_kid','traveling_bard','civilian'];
for(const id of [...completeEnemies,...completeNpcs])if(fs.existsSync(path.join(SOURCE,id+'-complete.png'))){
 const source=id+'-complete',im=read(source);let frames;try{frames=segmentedFrames(im,4,6);}catch(e){(manifest.rejections||=[]).push({source,reason:e.message,status:'generation rejected; initial set retained'});continue;}
 const packed=packedActors(frames,8),out=packed.out;write(id,out);manifest.atlases[id]={path:'art/chrono/'+id+'.png',width:out.width,height:out.height,cell_width:packed.width,atlas_columns:8,anchor_method:packed.anchor_method,frame_count:24,reserve:id!=='purple_guard',source};manifest.animations=manifest.animations.filter(a=>a.character_id!==id);
 const enemy=completeEnemies.includes(id),specs=enemy?[['idle',[0,1,2,3],4,true],['walk',[4,5,6,7],6,true],['anticipation',[8,9,10,11],4/.95,false],['attack',[12,13],2/.15,false],['recover',[14,15],2/.7,false],['hurt',[16,17,18,19],4/.24,false],['defeat',[20,21,22,23],4/.7,false]]:[['idle',[0,1,2,3],4,true],['walk',[4,5,6,7],8,true],['talk',[8,9,10,11],6,true],['gesture',[12,13,14,15],6,false],['shop_interaction',[12,13,16,17,18,19],6,false],['sell',[16,17,18,19],6,false],['receive_item',[20,21,22,23],6,false]];
 for(const [name,indices,fps,loop]of specs)addAnim(id,name,id,indices,{fps,loop,quality:enemy?'four-frame state cycles; contact/recovery split the attack row; live AI phase timing is authoritative':'four unique frames per NPC state; resource only, no economy or quest added'});
 manifest.sources.push({path:'assets/chrono_shadows/production_sources/'+source+'.png',tool:'image_gen.imagegen',model:'not exposed by tool',image_reference:'assets/chrono_shadows/production_sources/identity_references/'+id+'.png',reference_artboards:enemy?[completeEnemies.indexOf(id)<6?'scheda_sprite_di_nemici_non_morti.webp':'foglio_sprite_cyber_fantasy_al_neon.webp']:['scheda_pixel_art_npc_della_città_gotica.webp'],transformations:['global connected-component isolation','alpha threshold 64','foot-pivot normalization','weapon-sized cell width','nearest-neighbor packing'],license:'Session generation; provider terms apply.'});
}
// Environment atlas keeps all modular source cells; floor and facade roles are explicit.
{
 const im=read('environment'),out=new PNG({width:4*CELL,height:4*CELL});
 for(let r=0;r<4;r++)for(let c=0;c<4;c++){const p=cell(im,c,r,4,4);blit(out,p,{x:0,y:0,w:p.width,h:p.height},c*CELL,r*CELL,CELL,CELL);}write('environment',out);
 const names=['old_town_ground','refuge_ground','cathedral_ground','toxic_ground','clockwork_ground','necropolis_ground','inn_ground','workshop_ground','ruined_facade','cathedral_facade','clocktower','toxic_shack','gateway','bridge','stairs','lift'];manifest.environment={atlas_reference:'environment',tiles:names.map((id,i)=>({id,frame_rectangle:{x:i%4*CELL,y:Math.floor(i/4)*CELL,width:CELL,height:CELL},purpose:i<8?'floor':'decorative module; collision/layout integration required',status:[0,2,3,7,8,9,10,11].includes(i)?'integrated':'cleaned'})),world_floor_size:64};manifest.atlases.environment={path:'art/chrono/environment.png',width:512,height:512,reserve:false,source:'environment'};
}
if(fs.existsSync(path.join(SOURCE,'fx.png'))){
 const im=read('fx'),ids=['chrono_rings','shockwave','energy_burst','debris','bone_fragments','gear_debris','toxic_splash','shadow_dissipation','portal_spiral','relic_shards','smoke','finish_flash','impact','muzzle_flash'],out=new PNG({width:CELL*4,height:CELL*14});
 for(let i=0;i<ids.length;i++){
  for(let c=0;c<4;c++){const p=cell(im,(i%2)*4+c,Math.floor(i/2),8,7);blit(out,p,{x:0,y:0,w:p.width,h:p.height},c*CELL+8,i*CELL+8,CELL-16,CELL-16);}
  const a=addAnim(ids[i],'play','effects',[0,1,2,3],{fps:12,layer:'effect',quality:'four generated FX frames; reduced motion uses small first frame'});a.pivot_y=64;a.collision_box=null;a.frame_rectangles.forEach(f=>f.y=i*CELL);a.reduced_motion={frame_index:0,opacity:.45,max_height:80,suppress:ids[i]==='finish_flash'};
 }
 write('effects',out);manifest.atlases.effects={path:'art/chrono/effects.png',width:out.width,height:out.height,frame_count:56,reserve:false,source:'fx'};
}
if(fs.existsSync(path.join(SOURCE,'interiors.png'))){
 const im=read('interiors'),out=new PNG({width:4*CELL,height:4*CELL});for(let r=0;r<4;r++)for(let c=0;c<4;c++){const p=cell(im,c,r,4,4);blit(out,p,{x:0,y:0,w:p.width,h:p.height},c*CELL+4,r*CELL+4,CELL-8,CELL-8);}write('interiors',out);
 manifest.atlases.interiors={path:'art/chrono/interiors.png',width:512,height:512,reserve:true,source:'interiors'};
 manifest.interiors=['blacksmith','gunsmith','alchemy_shop','relic_shop','food_stand','upgrade_station','inn_save_room','secret_workshop','gothic_door','shop_shutter','sewer_grate','secret_passage','merchant_awning','lantern','statue','lift_lever'].map((id,i)=>({id,atlas_reference:'interiors',frame_rectangle:{x:i%4*CELL,y:Math.floor(i/4)*CELL,width:CELL,height:CELL},status:'cleaned',functionality:'visual resource only; no new shop, economy, quest or traversal system'}));
}
manifest.kits=[['moon_refuge_village',1,8],['cathedral_quarter_market',2,9],['toxic_slum_bazaar',3,11],['clockwork_outpost',4,10],['ruined_old_town',0,8],['village_refuge_streets',1,8],['cathedral_sanctuary',2,9],['toxic_market_labyrinth',3,11],['clockwork_elevation_zone',4,10],['necropolis_approach',5,9]].map(([id,floor,facade])=>({id,floor_tile:floor,facade_tile:facade,atlas_reference:'environment',status:'modular kit; not a new campaign map',modules:['gateway','bridge','stairs','lift','sewer_grate','gothic_door','secret_passage']}));
// Record actual source and reference families, including unused rejected attempt.
for(const source of ['sample','environment','fx','interiors'])if(fs.existsSync(path.join(SOURCE,source+'.png')))manifest.sources.push({path:'assets/chrono_shadows/production_sources/'+source+'.png',tool:'image_gen.imagegen',model:'not exposed by tool',transformations:source==='sample'?['component segmentation','alpha threshold','nearest-neighbor packing','fixed ground pivot']:['regular module extraction','nearest-neighbor packing','transparent gutters'],license:'Generated in session; provider terms apply; no independent clearance claimed.'});
const references={allies:['scheda_sprite_eroi_chrono_shadows.webp','scheda_sprite_neon_di_adventure_city.webp'],undead:['scheda_sprite_di_nemici_non_morti.webp'],tech:['foglio_sprite_cyber_fantasy_al_neon.webp'],bosses:['scheda_boss_di_crono_ombre.webp','fasi_di_sconfitta_dei_boss_pixel_art.webp'],npc_a:['scheda_pixel_art_npc_della_città_gotica.webp'],npc_b:['scheda_pixel_art_npc_della_città_gotica.webp'],sample:['scheda_pixel_art_npc_della_città_gotica.webp','scheda_sprite_di_nemici_non_morti.webp'],environment:['set_di_piastrelle_per_città_gotica_in_rovina.webp','guida_pixel_art_di_adventure_city.webp'],interiors:['tavola_pixel_art_degli_interni_avventura.webp'],fx:['fasi_di_sconfitta_dei_boss_pixel_art.webp']};
for(const s of manifest.sources){const name=path.basename(s.path,'.png');s.reference_artboards=references[name]||s.reference_artboards||[];s.reference_method=s.image_reference?'Image edit of retained generated identity reference':'Artboards visually inspected by agent and translated into verbal art direction; not automatically sliced';if(name==='desert_chrono_fighter-full'||name==='valkyrie_striker-full'){s.image_reference=s.path.replace('-full.png','-rejected.png');s.repairs='Removed external energy bridges using image_gen edit; separate runtime FX retained.';}}
manifest.legacy_heroes=['nox','lulu'].map(character_id=>({character_id,status:'integrated; preserved from v0.9 without identity changes',atlases:['walk','actions','gun','magic'].map(kind=>{const relative=`art/v05/${character_id}_${kind}.png`,im=PNG.sync.read(fs.readFileSync(path.join(ROOT,'game',relative))),w=im.width/4,h=im.height/4;return {atlas_reference:relative,sprite_width:w,sprite_height:h,pivot_x:w/2,pivot_y:h-6*h/112,frame_count:16,frame_rectangles:Array.from({length:16},(_,i)=>({x:i%4*w,y:Math.floor(i/4)*h,width:w,height:h})),convention:'Exact fractional 4x4 sampling preserved from runtime.mjs; directional/state timing stays in visuals.mjs',collision_box:{source:'campaign.mjs and layouts.mjs; unchanged'},attack_box:{source:'campaign.mjs release(); unchanged'}};})}));
for(const a of manifest.animations){if(['chrono_overlord','shadow_reaper','cathedral_bone_tyrant','toxic_forge_behemoth'].includes(a.character_id))a.hit_box={half_width:34,space:'world',source:'campaign.mjs release(): boss lateral hit width before projectile thickness'};if(['attack','special','anticipation'].includes(a.animation_id))a.attack_box={shape:'dynamic AABB around live circle/projectile',source:'campaign.mjs actor.attackRadius, target and release()/fireShot()',authority:'existing runtime role/phase; not a new hit box or damage trigger'};}
for(const a of manifest.animations)if(['purple_guard','chrono_overlord'].includes(a.atlas_reference)||a.atlas_reference==='effects'&&['impact','muzzle_flash','energy_burst','chrono_rings','gear_debris','debris'].includes(a.character_id)){a.status='integrated';a.validation='Technical and browser evidence tracked separately in docs/evidence/chrono_shadows';}
fs.writeFileSync(path.join(OUT,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const shipping=new Set(['environment','effects','purple_guard','chrono_overlord']);
const runtime={...manifest,sources:undefined,legacy_heroes:undefined,atlases:Object.fromEntries(Object.entries(manifest.atlases).filter(([id])=>shipping.has(id))),animations:manifest.animations.filter(a=>shipping.has(a.atlas_reference))};
fs.writeFileSync(path.join(ROOT,'game/chrono-manifest.mjs'),'// Generated shipping subset by tools/chrono_pack.cjs; reserves live in art/chrono/manifest.json.\nexport const CHRONO_MANIFEST='+JSON.stringify(runtime)+';\n');
// This directory contains tool outputs only. Original generations remain under assets/.
const expected=new Set(Object.values(manifest.atlases).map(a=>path.basename(a.path)));
for(const name of fs.readdirSync(OUT))if(name.endsWith('.png')&&!expected.has(name))fs.unlinkSync(path.join(OUT,name));
console.log(Object.keys(manifest.atlases).length+' atlases; '+manifest.animations.length+' animations/pose sequences');
