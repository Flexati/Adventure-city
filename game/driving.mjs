// Driving interludes. Nox is always the driver, independent of the on-foot hero.
export const DRIVING_MISSIONS=[
 {id:'escape',title:'Fuga dal Cantiere',brief:'Nox al volante. Evita la gang e raggiungi il porto con la Vortex intera.',distance:8500,limit:90,goal:'Raggiungi il porto',stops:[]},
 {id:'signal',title:'Sotto la breccia',brief:'Attraversa i tre segnali azzurri per tracciare una rotta fuori dalla breccia.',distance:10000,limit:100,goal:'Attraversa tutti e 3 i segnali',stops:[{at:2400,x:265},{at:4800,x:455},{at:7300,x:360}]},
 {id:'evacuation',title:'L’ultima evacuazione',brief:'Nox guida, Lulù coordina i soccorsi. Fermati nei due punti verdi e porta tutti al Nodo Centrale.',distance:11500,limit:120,goal:'Fermati e carica i soccorsi in 2 punti',stops:[{at:3400,x:265},{at:7300,x:455}]}
];
export function newDrive(index=0){if(!Number.isInteger(index)||index<0||index>2)throw new Error('Invalid driving mission');let seed=271+index*113;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const c=DRIVING_MISSIONS[index];return {version:1,index,driver:'nox',passenger:'lulu',x:360,vx:0,speed:0,distance:0,time:0,hp:5,inv:0,status:'playing',events:[],stops:c.stops.map(s=>({...s,done:false,hold:0})),hazards:Array.from({length:Math.floor(c.distance/500)},(_,i)=>({id:i,at:900+i*470,x:[170,265,360,455,550][Math.floor(rand()*5)],hit:false})).filter(h=>c.stops.every(p=>Math.abs(p.at-h.at)>450))};}
export function driveTick(s,input,dt){s.events=[];if(s.status!=='playing')return;dt=Math.max(0,Math.min(.05,dt));s.time+=dt;s.inv=Math.max(0,s.inv-dt);const c=DRIVING_MISSIONS[s.index];
 const throttle=Math.max(0,Math.min(1,input.throttle||0)),brake=Math.max(0,Math.min(1,input.brake||0));s.speed=Math.max(0,Math.min(470,s.speed+(throttle*210-brake*470-(throttle?25:75))*dt));
 const steering=Math.max(-1,Math.min(1,input.steer||0));s.vx+=(steering*(100+s.speed*.3)-s.vx)*Math.min(1,dt*9);s.x=Math.max(105,Math.min(615,s.x+s.vx*dt));s.distance+=s.speed*dt;
 function crash(){if(s.inv>0)return;s.hp--;s.inv=.85;s.speed*=.62;s.events.push({type:'driveHit'});}
 if((s.x<133||s.x>587)&&s.speed>80)crash();
 for(const h of s.hazards)if(!h.hit&&Math.abs(h.at-s.distance)<75&&Math.abs(h.x-s.x)<53){h.hit=true;crash();}
 for(const p of s.stops){if(p.done)continue;const near=Math.abs(p.at-s.distance)<170&&Math.abs(p.x-s.x)<66;
 if(s.index===1&&near){p.done=true;s.events.push({type:'checkpoint'});}
 else if(s.index===2){p.hold=near&&s.speed<55?p.hold+dt:0;if(p.hold>=.8){p.done=true;s.events.push({type:'pickup'});}}
 }
 if(s.hp<=0){s.status='failed';s.reason='La Vortex è troppo danneggiata.';}
 else if(s.time>c.limit){s.status='failed';s.reason='Tempo esaurito: dosa acceleratore e freno.';}
 else if(s.distance>=c.distance){if(s.stops.every(p=>p.done))s.status='cleared';else{s.status='failed';s.reason=s.index===1?'Hai saltato un segnale azzurro.':'Mancano soccorsi a bordo. Fermati nei punti verdi.';}}
 if(s.status!=='playing')s.events.push({type:s.status==='cleared'?'driveCleared':'driveFailed'});
}
