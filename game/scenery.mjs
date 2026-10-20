import {TILE_SIZE,GRID_SIZE} from './layouts.mjs';
// One cached 1536² surface per active mission. Pixel textures and props come from the existing art.
export function buildMapSurface(layout,backdrop,props,palette){
 const surface=document.createElement('canvas');surface.width=surface.height=1536;const g=surface.getContext('2d');g.imageSmoothingEnabled=false;
 const iw=backdrop.naturalWidth,ih=backdrop.naturalHeight,ts=TILE_SIZE;
 g.fillStyle='#050b13';g.fillRect(0,0,1536,1536);
 const open=(x,y)=>x>=0&&y>=0&&x<GRID_SIZE&&y<GRID_SIZE&&layout.cells[y*GRID_SIZE+x];
 for(let y=0;y<GRID_SIZE;y++)for(let x=0;x<GRID_SIZE;x++){
  const px=x*ts,py=y*ts,hash=(x*13+y*17)%5;
  if(open(x,y)){
   // Samples are inside the central road, away from baked buildings and zebra crossings.
   const sx=(.425+(hash%2)*.045)*iw,sy=(.39+Math.floor(hash/2)*.045)*ih;
   g.drawImage(backdrop,sx,sy,iw*.075,ih*.075,px,py,ts,ts);
   g.fillStyle='#0b1d2940';g.fillRect(px,py,ts,ts);
   g.strokeStyle='#adc9d20b';g.lineWidth=1;g.strokeRect(px+.5,py+.5,ts-1,ts-1);
   for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]])if(!open(x+dx,y+dy)){
    g.fillStyle='#050912';if(dx)g.fillRect(px+(dx>0?ts-12:0),py,12,ts);else g.fillRect(px,py+(dy>0?ts-12:0),ts,12);
    g.strokeStyle=palette+'bb';g.lineWidth=2;g.beginPath();const ax=px+(dx>0?ts-7:dx<0?7:0),ay=py+(dy>0?ts-7:dy<0?7:0);g.moveTo(ax,ay);g.lineTo(ax+(dy?ts:0),ay+(dx?ts:0));g.stroke();
   }
  }else{
   g.drawImage(backdrop,iw*(.06+(hash%2)*.1),ih*(.06+(hash%3)*.07),iw*.10,ih*.10,px,py,ts,ts);
   g.fillStyle='#030a16bb';g.fillRect(px,py,ts,ts);
  }
 }
 // Restrained palette grade is baked once, including the art, rather than a per-frame shader.
 g.globalCompositeOperation='soft-light';g.fillStyle=palette;g.globalAlpha=.28;g.fillRect(0,0,1536,1536);g.globalAlpha=1;g.globalCompositeOperation='source-over';
 // Inset perimeter bulkheads: silhouettes exactly follow the collision tiles.
 for(let y=1;y<23;y++)for(let x=1;x<23;x++)if(!open(x,y)&&[[-1,0],[1,0],[0,-1],[0,1]].some(([dx,dy])=>open(x+dx,y+dy))){
  const px=x*ts,py=y*ts;g.strokeStyle='#52607070';g.lineWidth=2;g.strokeRect(px+5,py+5,54,54);g.fillStyle='#a1b4be25';g.fillRect(px+12,py+12,40,3);
  if((x+y)%3===0&&props?.naturalWidth){const cw=props.naturalWidth/4,ch=props.naturalHeight/4;g.drawImage(props,cw*3,ch*3,cw,ch,px+4,py-12,56,76);}
 }
 g.font='700 20px monospace';g.textAlign='center';g.fillStyle=palette;g.fillText(layout.label,layout.start.x,layout.start.y+65);
 for(let i=0;i<layout.nodes.length;i++){const n=layout.nodes[i];g.strokeStyle=palette+'55';g.setLineDash([7,9]);g.lineWidth=2;g.strokeRect(n.x-64,n.y-64,128,128);g.setLineDash([]);g.fillStyle='#d7e6e688';g.font='14px monospace';g.fillText('0'+(i+1),n.x,n.y-78);}
 return surface;
}
