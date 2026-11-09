// Piante dei villaggi (D40). Dati e regole pure, senza DOM. 24×24 tile da 64 px.
// Legenda: # vuoto · . strada · , piazza · x piccolo ostacolo (cassa, lampione, vaso) · W vasca/fontana/pozzo (pieno)
// Lettere maiuscole = edifici pieni (un blocco rettangolare per lettera): I locanda · S fabbro · M negozio · R reliquie ·
// A informazioni o alchimista · F informazioni (bazar) · N cattedrale · K torre dell’orologio · H casa senza servizio.
// La porta di un edificio è la tile calpestabile subito sotto il centro del suo lato sud: lì sta il punto del servizio.
export const VILLAGE_SIZE=24;
const VILLAGE_WALK=new Set(['.',',']);
export const VILLAGES={
 moon:{name:"Rifugio sotto la città",mood:{"roof": "#2f6f66", "wall": "#1d3a40", "trim": "#83cbb2", "glow": "#ffd28a", "floor": "#142630", "plaza": "#1b3340"},
  map:["########################",
   "########################",
   "##....................##",
   "##.IIIIIII.MMMMM.SSSS.##",
   "##.IIIIIII.MMMMM.SSSS.##",
   "##.IIIIIII.MMMMM.SSSS.##",
   "##.IIIIIII.MMMMM.SSSS.##",
   "##.IIIIIII.MMMMM.SSSS.##",
   "##.IIIIIII.MMMMM.SSSS.##",
   "##x..................x##",
   "##.....,,,,,,,,,,.....##",
   "##.....,,,,,,,,,,.....##",
   "##.....,,,,,,,,,,.....##",
   "##.....,,,,,,,,,,.....##",
   "##.....,,,,,,,,,,.....##",
   "##x.....x.......x....x##",
   "##.HHHHH.HHH..........##",
   "##.HHHHH.HHH..........##",
   "##.HHHHH.HHH..........##",
   "##.HHHHH.HHH..........##",
   "##.HHHHH..............##",
   "##....................##",
   "########################",
   "########################"],
  serviceBy:{"S": "smith", "M": "shop", "I": "inn"},
  plan:{"board": [11, 12], "exit": [20, 12], "travel": [3, 12], "secret": [9, 20], "people": [[5, 11], [15, 15]], "targets": [[3, 9], [10, 9], [20, 9], [6, 15], [12, 19]], "vortex": [16, 18]}},
 cathedral:{name:"Quartiere della Cattedrale",mood:{"roof": "#6d5a43", "wall": "#3a3128", "trim": "#d6bd91", "glow": "#ffe3a1", "floor": "#1b1d26", "plaza": "#2a2732"},
  map:["########################",
   "########################",
   "####...NNNNNNNNNN...####",
   "####...NNNNNNNNNN...####",
   "##.SSSSNNNNNNNNNNAAAA.##",
   "##.SSSSNNNNNNNNNNAAAA.##",
   "##.SSSSNNNNNNNNNNAAAA.##",
   "##.SSSSNNNNNNNNNNAAAA.##",
   "##.SSSSNNNNNNNNNNAAAA.##",
   "##....x..........x....##",
   "##....,,,,,,,,,,,,....##",
   "##....,,,,,WW,,,,,....##",
   "##....,,,,,WW,,,,,....##",
   "##....,,,,,,,,,,,,....##",
   "##....,,,,,,,,,,,,....##",
   "##...x...x........x...##",
   "##.MMMMMM.HHHH.HHHHH..##",
   "##.MMMMMM.HHHH.HHHHH..##",
   "##.MMMMMM.HHHH.HHHHH..##",
   "##.MMMMMM......HHHHH..##",
   "###MMMMMM......HHHHH####",
   "####................####",
   "########################",
   "########################"],
  serviceBy:{"S": "smith", "N": "relic", "M": "shop", "A": "info"},
  plan:{"board": [8, 12], "exit": [20, 12], "travel": [3, 12], "secret": [20, 19], "people": [[18, 14], [15, 13], [20, 10]], "targets": [[7, 13], [15, 10], [11, 15], [4, 12], [19, 12]], "vortex": [12, 20]}},
 toxic:{name:"Bazar tossico",mood:{"roof": "#4b6a2e", "wall": "#262f1f", "trim": "#9be15d", "glow": "#b8ff7a", "floor": "#12190f", "plaza": "#1b2515"},
  map:["########################",
   "########################",
   "##....................##",
   "##.SSSSS..MMMMM..AAAA.##",
   "##.SSSSS..MMMMM..AAAA.##",
   "##.SSSSS..MMMMM..AAAA.##",
   "##.SSSSS..MMMMM..AAAA.##",
   "##....................##",
   "##x.....,,,,,,,,......##",
   "##......x,,,,,,x......##",
   "##.HHH..,,WWWW,,.FFFF.##",
   "##.HHH..,,WWWW,,.FFFF.##",
   "##.HHH..,,WWWW,,.FFFF.##",
   "##.HHH..,,,,,,,,.FFFF.##",
   "##......,,,,,,,,.....x##",
   "##......x......x......##",
   "##.HHHHH.........HHHH.##",
   "##.HHHHH..HHHHH..HHHH.##",
   "##.HHHHH..HHHHH..HHHH.##",
   "##.HHHHH..HHHHH..HHHH.##",
   "##....................##",
   "##.......x....x.......##",
   "########################",
   "########################"],
  serviceBy:{"S": "smith", "M": "shop", "A": "alchemist", "F": "info"},
  plan:{"board": [8, 12], "exit": [20, 8], "travel": [3, 8], "secret": [19, 20], "people": [[7, 8], [14, 14]], "targets": [[4, 15], [9, 14], [16, 8], [12, 9], [19, 15]], "vortex": [12, 15]}},
 clockwork:{name:"Avamposto ad ingranaggi",mood:{"roof": "#7a5a2a", "wall": "#33281a", "trim": "#e0a24a", "glow": "#ffc766", "floor": "#1d1710", "plaza": "#2a2216"},
  map:["########################",
   "########################",
   "#####..............#####",
   "#####..............#####",
   "#####..............#####",
   "##.SSSSSS......MMMMMM.##",
   "##.SSSSSS.x..x.MMMMMM.##",
   "##.SSSSSS.KKKK.MMMMMM.##",
   "##.SSSSSS.KKKK.MMMMMM.##",
   "##........KKKK........##",
   "##........KKKK........##",
   "##......,,,,,,,,......##",
   "##x.....,,,,,,,,.....x##",
   "##......,,,,,,,,......##",
   "##......x,,,,,,x......##",
   "##.RRRRR........AAAAA.##",
   "##.RRRRR.HHHHHH.AAAAA.##",
   "##.RRRRR.HHHHHH.AAAAA.##",
   "##.RRRRR.HHHHHH.AAAAA.##",
   "#####..............#####",
   "#####..............#####",
   "#####..............#####",
   "########################",
   "########################"],
  serviceBy:{"S": "smith", "M": "shop", "R": "relic", "A": "info"},
  plan:{"board": [11, 13], "exit": [20, 12], "travel": [3, 12], "secret": [12, 20], "people": [[7, 12], [16, 12]], "targets": [[6, 10], [16, 10], [8, 13], [15, 13], [12, 3]], "vortex": [9, 20]}},
};

const villageCache=new Map();
// Cells, buildings (with door and service), props and water of one village.
export function compileVillage(id){
 if(villageCache.has(id))return villageCache.get(id);
 const v=VILLAGES[id];if(!v)return null;
 const N=VILLAGE_SIZE,rows=v.map,cells=Array(N*N).fill(0),plaza=Array(N*N).fill(0);
 const at=(x,y)=>x>=0&&y>=0&&x<N&&y<N?rows[y][x]:'#';
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const c=rows[y][x];if(VILLAGE_WALK.has(c))cells[y*N+x]=1;if(c===',')plaza[y*N+x]=1;}
 const seen=new Set(),buildings=[],props=[],water=[];
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  const c=rows[y][x];if(seen.has(y*N+x))continue;
  if(c==='x'){props.push({x,y});seen.add(y*N+x);continue;}
  if(!/[A-Z]/.test(c))continue;
  let w=0,h=0;while(at(x+w,y)===c)w++;while(at(x,y+h)===c)h++;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++)seen.add((y+j)*N+x+i);
  if(c==='W'){water.push({x,y,w,h});continue;}
  const door={x:x+((w-1)>>1),y:y+h};
  buildings.push({letter:c,x,y,w,h,door,service:v.serviceBy[c]||null,house:!v.serviceBy[c]});
 }
 const out={id,name:v.name,mood:v.mood,cells,plaza,buildings,props,water,plan:v.plan};
 villageCache.set(id,out);return out;
}
export const doorOf=(id,service)=>compileVillage(id)?.buildings.find(b=>b.service===service)?.door||null;
