// Authored tile modules, compiled once. Geometry, collision, navigation and scenery share this grid.
export const TILE_SIZE=64,GRID_SIZE=24;
import {compileVillage} from './villages.mjs';
import {PAINTED_MAPS} from './painted-maps.mjs';
const layoutCache=new Map(),routeFields=new Map();
const tilePoint=(x,y)=>({x:(x+.5)*TILE_SIZE,y:(y+.5)*TILE_SIZE});
const LAYOUT_SPECS={
 yard:{label:'CANTIERE DEI RELÈ',rects:[[3,3,18,19]],start:[12,20],nodes:[[4,12],[12,4],[19,12]],entries:[[4,4],[19,4],[4,20],[19,20]],spawns:[[8,15],[16,15],[12,8]],boss:[12,8]},
 moon:{village:true,label:'MOON REFUGE',rects:[[3,10,18,5],[10,3,4,18],[4,4,5,7],[15,4,6,7],[4,15,5,6],[15,15,6,6]],start:[12,13],nodes:[],entries:[],spawns:[],boss:[12,12]},
 cathedral:{village:true,label:'CATHEDRAL QUARTER',rects:[[3,10,18,5],[10,3,4,18],[3,3,7,5],[15,3,7,5],[4,14,5,8],[15,14,7,8],[6,6,12,2]],start:[12,13],nodes:[],entries:[],spawns:[],boss:[12,12]},
 toxic:{village:true,label:'TOXIC SLUM BAZAAR',rects:[[3,10,18,5],[10,3,4,18],[4,4,5,7],[15,5,7,6],[3,15,6,6],[15,15,6,6],[7,18,10,3]],start:[12,13],nodes:[],entries:[],spawns:[],boss:[12,12]},
 clockwork:{village:true,label:'CLOCKWORK OUTPOST',rects:[],start:[12,13],nodes:[],entries:[],spawns:[],boss:[12,12]},
 ash_docks:{village:true,label:'ASH DOCKS HAVEN',rects:[],start:[12,13],nodes:[],entries:[],spawns:[],boss:[12,12]},
 antenna_port:{village:true,label:'ANTENNA HARBOUR',rects:[],start:[12,13],nodes:[],entries:[],spawns:[],boss:[12,12]},
 clinic_ward:{village:true,label:'CLINICAL CLOISTER',rects:[],start:[11,14],nodes:[],entries:[],spawns:[],boss:[12,12]},
 node_commons:{village:true,label:'NODE RING',rects:[],start:[11,13],nodes:[],entries:[],spawns:[],boss:[12,12]},
 chalk_harbor:{village:true,label:'CHALK WHARF',rects:[],start:[12,11],nodes:[],entries:[],spawns:[],boss:[12,12]},
 lower_hearth:{village:true,label:'LOWER HEARTH',rects:[],start:[12,12],nodes:[],entries:[],spawns:[],boss:[12,12]},
 glass_terrace:{village:true,label:'GLASS TERRACES',rects:[],start:[11,10],nodes:[],entries:[],spawns:[],boss:[12,12]},
 sky_rail:{village:true,label:'HIGHLINE DEPOT',rects:[],start:[12,12],nodes:[],entries:[],spawns:[],boss:[12,12]},
 deep_archive:{village:true,label:'SPORE VAULT',rects:[],start:[11,13],nodes:[],entries:[],spawns:[],boss:[12,12]},
 axis_crown:{village:true,label:'CROWN ATRIUM',rects:[],start:[11,10],nodes:[],entries:[],spawns:[],boss:[12,12]},
 elbow:{label:'CONDOTTO A GOMITO',rects:[[4,3,6,19],[4,3,18,7]],start:[7,20],nodes:[[7,14],[11,6],[20,6]],entries:[[7,21],[5,4],[20,4],[20,8]],spawns:[[7,11],[7,6],[15,6],[19,8]],boss:[18,6]},
 spine:{label:'ASSE DI SERVIZIO',rects:[[8,2,8,20],[5,3,14,5],[5,10,14,5],[5,17,14,5]],start:[12,20],nodes:[[6,19],[17,12],[11,4]],entries:[[9,2],[14,2],[6,20],[17,20]],spawns:[[10,15],[14,12],[10,7],[17,5]],boss:[12,5]},
 arena:{label:'PIATTAFORMA ORBITALE',circle:true,start:[12,20],nodes:[[5,12],[12,5],[19,12]],entries:[[12,3],[3,12],[20,12],[12,20]],spawns:[[8,11],[16,11],[12,7],[18,14]],boss:[12,9]},
 gallery:{label:'GALLERIA DI CONTENIMENTO',rects:[[3,8,19,8],[3,3,6,18],[16,3,6,18]],start:[5,19],nodes:[[5,5],[12,11],[19,5]],entries:[[5,3],[19,3],[5,20],[19,20]],spawns:[[5,10],[11,12],[19,10],[19,17]],boss:[12,12]}
};
export function getLayout(id){
 if(!id)return null;if(layoutCache.has(id))return layoutCache.get(id);
 // R20-c: a painted map (Argon) brings its own floor plan; the picture is the backdrop, the plan is the collision.
 const paint=PAINTED_MAPS[id],spec=paint||LAYOUT_SPECS[id];if(!spec)throw Error('Unknown layout '+id);
 const cells=Array(GRID_SIZE*GRID_SIZE).fill(0),village=spec.village?compileVillage(id):null;
 for(let y=0;y<GRID_SIZE;y++)for(let x=0;x<GRID_SIZE;x++){
  if(paint?parseInt(paint.m[y],16)>>(23-x)&1:village?village.cells[y*GRID_SIZE+x]:spec.circle?Math.hypot(x-11.5,y-11.5)<10:spec.rects.some(([rx,ry,w,h])=>x>=rx&&x<rx+w&&y>=ry&&y<ry+h))cells[y*GRID_SIZE+x]=1;
 }
 // Cover islands stay clear of the central fighting floor and all terminals.
 if(id==='yard')for(const [x,y] of [[8,10],[14,10],[8,16],[14,16]])for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)cells[(y+dy)*GRID_SIZE+x+dx]=0;
 if(id==='arena')for(const [x,y] of [[7,7],[15,7],[7,15],[15,15]])for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)cells[(y+dy)*GRID_SIZE+x+dx]=0;
 const walls=[];
 for(let y=0;y<GRID_SIZE;y++)for(let x=0;x<GRID_SIZE;){if(cells[y*GRID_SIZE+x]){x++;continue;}const from=x;while(x<GRID_SIZE&&!cells[y*GRID_SIZE+x])x++;const prev=walls.find(w=>w.x===from*TILE_SIZE&&w.w===(x-from)*TILE_SIZE&&w.y+w.h===y*TILE_SIZE);if(prev)prev.h+=TILE_SIZE;else walls.push({x:from*TILE_SIZE,y:y*TILE_SIZE,w:(x-from)*TILE_SIZE,h:TILE_SIZE});}
 const layout={id,paint:!!paint,label:spec.label,cells,walls,start:tilePoint(...spec.start),nodes:spec.nodes.map(p=>tilePoint(...p)),entries:spec.entries.map(p=>tilePoint(...p)),spawns:spec.spawns.map(p=>tilePoint(...p)),boss:tilePoint(...spec.boss),village};
 layoutCache.set(id,layout);return layout;
}
export function layoutWalkable(layout,x,y,margin=18){
 if(!layout)return true;
 return [x-margin,x+margin].every(px=>[y-margin,y+margin].every(py=>px>=0&&py>=0&&px<1536&&py<1536&&layout.cells[Math.floor(py/TILE_SIZE)*GRID_SIZE+Math.floor(px/TILE_SIZE)]===1));
}
export function nearestFloor(layout,point){
 if(!layout||layoutWalkable(layout,point.x,point.y))return {...point};
 let best=null,d=Infinity;for(let i=0;i<layout.cells.length;i++)if(layout.cells[i]){const p=tilePoint(i%24,Math.floor(i/24)),n=Math.hypot(p.x-point.x,p.y-point.y);if(n<d){best=p;d=n;}}return best;
}
// Reverse breadth-first field cached by destination tile; bounded memory, no allocations per enemy step.
export function routeWaypoint(layout,from,to){
 if(!layout)return to;
 const index=p=>Math.max(0,Math.min(23,Math.floor(p.y/TILE_SIZE)))*GRID_SIZE+Math.max(0,Math.min(23,Math.floor(p.x/TILE_SIZE)));
 let target=index(to);if(!layout.cells[target]){let best=Infinity;for(let i=0;i<layout.cells.length;i++)if(layout.cells[i]){const p=tilePoint(i%24,Math.floor(i/24)),d=Math.hypot(p.x-to.x,p.y-to.y);if(d<best){best=d;target=i;}}}
 const key=layout.id+':'+target;let field=routeFields.get(key);
 if(!field){field=new Int16Array(576).fill(-1);field[target]=target;const queue=[target];for(let k=0;k<queue.length;k++){const i=queue[k],x=i%24,y=Math.floor(i/24);for(const n of [x>0?i-1:-1,x<23?i+1:-1,y>0?i-24:-1,y<23?i+24:-1])if(n>=0&&layout.cells[n]&&field[n]===-1){field[n]=i;queue.push(n);}}if(routeFields.size>=64)routeFields.delete(routeFields.keys().next().value);routeFields.set(key,field);}
 const at=index(from),next=field[at];return next<0?from:at===target?tilePoint(target%24,Math.floor(target/24)):tilePoint(next%24,Math.floor(next/24));
}
export function missionLayout(id,pov){
 const assignments={blackout:'yard',breach:'elbow',contagion:'gallery',zero:'arena',exp_chalk_marks:'spine',below:'elbow',city:'arena',port:'gallery',archive:'gallery',line:'arena',ascent:'spine',finale:'arena',docks_veyra:'docks',glass_flood:'flood',glass_reaper:'reaper',vega:'vega',bone_tyrant:'tyrant',forge_behemoth:'behemoth',app_yard:'a_yard',app_breach:'a_breach',app_clinic:'a_clinic',app_node:'a_node',app_port:'a_port',app_archive:'a_archive',app_axis:'a_axis'};
 const key=assignments[id];if(!key)return {};
 const l=getLayout(key),props={layout:key,start:{...l.start},nodes:l.nodes.map(n=>({...n})),spawns:l.spawns.map(n=>({...n})),palette:pov==='lulu'?'#d99850':'#419eb9'};
 if(l.paint)props.paint=true;
 if(id==='vega')props.nodes=[];
 if(['city','line'].includes(id)){props.zone={x:800,y:800,r:id==='city'?150:160};props.start={x:800,y:870};}
 if(id==='exp_chalk_marks')props.nodes=props.nodes.slice(0,2);
 if(['below','archive'].includes(id))props.tint='#061621';
 if(id==='port')props.waves=[[{role:'patrol',path:[[5,9],[10,9],[10,13],[5,13]].map(p=>tilePoint(...p))},{role:'patrol',path:[[5,6],[5,15],[8,15],[8,6]].map(p=>tilePoint(...p))},{role:'patrol',path:[[12,11],[8,11],[8,9],[12,9]].map(p=>tilePoint(...p))},{role:'patrol',path:[[19,6],[19,13],[17,13],[17,6]].map(p=>tilePoint(...p))}],['shooter','breaker','shooter','raider','raider']];
 return props;
}
