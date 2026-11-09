import {RACES_V9,RACE_SERIES_V9,availableRacesV9,raceCheckpointX,raceVisibility,newRaceV9,tickRaceV9,raceStandings,raceGateOpen,raceHazardX,raceResultV9,newRaceRecordV9,loadRaceRecordV9,recordRaceV9} from './racing-v9.mjs';
import {veyraLineV9,veyraRivalryV9} from './veyra-v9.mjs';
const $=id=>document.getElementById(id),canvas=$('road'),ctx=canvas.getContext('2d');
const strings={it:{intro:'Sette gare · La rivalità con Veyra',start:'Parti',accelerate:'Accelera',brake:'Frena',event:'EVENTO',pause:'Pausa',resume:'Riprendi',restart:'Ricomincia',keys:'Frecce / WASD: sterzo e acceleratore · Spazio: freno · P: pausa',rules:'Completa tutti i checkpoint. Non serve vincere per avanzare. Un checkpoint mancato riporta al varco; i danni gravi riportano all’ultimo checkpoint.',penalties:'Checkpoint mancato: +3 s. Recupero veicolo: +5 s. Le penalità si scontano al traguardo.',separate:'Risultati salvati solo nella preview. Nessuna modifica alla storia.',combat:'Arena combattimento',campaign:'Campagna attuale',ash_docks:'Veyra ti aspetta al porto. Schiva i carichi e conserva velocità fra i varchi.',solkara:'I convogli si spostano. Il vento di sabbia spinge la macchina: correggi lo sterzo.',aurelia_span:'I ponti temporali si chiudono ciclicamente. Osserva il segnale e frena prima del varco.',position:'Posizione',integrity:'Integrità',checkpoints:'Checkpoint',time:'Tempo',penalty:'Penalità',go:'VIA',finish:'Gara completata',retired:'Tempo esaurito',again:'Riprova',reward:'crediti allenamento',saved:'Risultato salvato',storage:'Memoria non disponibile: il risultato resta in questa sessione.',hit:'Impatto! Conserva spazio per cambiare corsia.',missed:'Checkpoint mancato: +3 s.',recovery:'Veicolo recuperato: +5 s.',waiting:'Penalità al traguardo',open:'APERTO',closed:'ATTENDI'},en:{intro:'Seven races · The rivalry with Veyra',start:'Start',accelerate:'Accelerate',brake:'Brake',event:'EVENT',pause:'Pause',resume:'Resume',restart:'Restart',keys:'Arrows / WASD: steer and accelerate · Space: brake · P: pause',rules:'Complete every checkpoint. Winning is not required to progress. A missed checkpoint returns you to its gate; heavy damage returns you to the last checkpoint.',penalties:'Missed checkpoint: +3 s. Vehicle recovery: +5 s. Penalties are served at the finish.',separate:'Results are saved only in the preview. Story saves are untouched.',combat:'Combat arena',campaign:'Current campaign',ash_docks:'Veyra awaits at the docks. Dodge cargo and preserve speed between the gates.',solkara:'Convoys change lanes. Sand winds push your car: correct your steering.',aurelia_span:'Temporal bridges close periodically. Watch the signal and brake before the gate.',position:'Position',integrity:'Integrity',checkpoints:'Checkpoints',time:'Time',penalty:'Penalty',go:'GO',finish:'Race complete',retired:'Time expired',again:'Try again',reward:'training credits',saved:'Result saved',storage:'Storage unavailable: this result stays in this session.',hit:'Impact! Leave room to change lanes.',missed:'Missed checkpoint: +3 s.',recovery:'Vehicle recovered: +5 s.',waiting:'Serving finish penalty',open:'OPEN',closed:'WAIT'}};
Object.assign(strings.it,{intro:'Sette gare · La rivalità con Veyra',nextRace:'Prossima sfida',rivalry:'Rivalità',locked:'Da sbloccare',ash_slalom:'Varchi stretti alternati fra le gru: prepara la traiettoria prima del checkpoint.',ash_night:'Fari corti e carichi nel buio. Modera la velocità per mantenere spazio di manovra.',solkara_storm:'Raffiche laterali forti e visibilità ridotta. Correggi lo sterzo e cerca i varchi.',veyra_duel:'L’ultima sfida contro Veyra, senza altri piloti: ponti temporali e varchi di precisione.'});
Object.assign(strings.en,{intro:'Seven races · The rivalry with Veyra',nextRace:'Next challenge',rivalry:'Rivalry',locked:'Locked',ash_slalom:'Alternating narrow gates between the cranes. Set up your line before each checkpoint.',ash_night:'Short headlights and cargo in the dark. Ease off to leave room to react.',solkara_storm:'Strong crosswinds and limited visibility. Correct your steering and find the gates.',veyra_duel:'The final challenge against Veyra alone: temporal bridges and precision gates.'});
let lang='it',s=newRaceV9(),started=false,paused=false,last=0,record=newRaceRecordV9(),claimed=false,noticeKey='',noticeUntil=0;
const keys=new Set(),touch=new Map(),storeKey='chronos-v9-races-v1';
try{record=loadRaceRecordV9(localStorage.getItem(storeKey))||record;}catch{}
const t=k=>strings[lang][k];
function reset(){s=newRaceV9($('race').value);started=false;paused=false;claimed=false;keys.clear();touch.clear();noticeKey='';refresh();}
function pause(){if(!started||!['racing','countdown'].includes(s.status))return;paused=!paused;keys.clear();touch.clear();refresh();}
function raceChoices(){const available=availableRacesV9(record);$('race').replaceChildren(...RACE_SERIES_V9.map(id=>{const option=document.createElement('option');option.value=id;option.disabled=!available.includes(id);option.textContent=RACES_V9[id].name[lang]+(option.disabled?' · '+t('locked'):'');return option;}));$('race').value=s.id;}
function refresh(){document.documentElement.lang=lang;document.querySelectorAll('[data-text]').forEach(e=>e.textContent=t(e.dataset.text));$('pause').textContent=t(paused?'resume':'pause');$('brief').textContent=t(s.id);raceChoices();renderUI();}
function renderUI(){
 const c=s.cars[0],race=RACES_V9[s.id],standing=raceStandings(s);$('hud').textContent=`${t('position')} ${standing.findIndex(c=>c.id==='player')+1}/${s.cars.length}\n${t('integrity')} ${Math.max(0,c.integrity)}% · ${Math.round(c.speed*.24)} km/h\n${t('checkpoints')} ${c.checkpoint}/${race.checkpoints.length}\n${t('time')} ${s.time.toFixed(1)} s · +${c.penalty} s`;
 $('standings').replaceChildren(...standing.map(c=>{const li=document.createElement('li');li.className=c.id==='player'?'player':'';li.textContent=c.name+' · '+(c.finishTime!==null?c.finishTime.toFixed(1)+' s':Math.floor(c.distance/race.length*100)+'%');return li;}));
 const end=['finished','retired'].includes(s.status);$('overlay').hidden=started&&!paused&&!end;
 $('headline').textContent=paused?t('pause'):end?t(s.status==='finished'?'finish':'retired'):race.name[lang];
 const result=raceResultV9(s);$('summary').textContent=result?`${t('position')} ${result.rank}/${s.cars.length} · ${result.time.toFixed(2)} s · ${record.coins} ${t('reward')}`:t(s.id);
 const rivalry=veyraRivalryV9(record);$('rivalry').textContent=`Veyra “Ash” Kor · ${t('rivalry')} ${rivalry.completed}/${rivalry.total}`;
 const phase=result?(result.rank===1?'win':'lose'):'intro';$('rival-line').textContent=veyraLineV9(s.id,phase,lang);
 $('rival-dialogue').textContent='Veyra: '+veyraLineV9(s.id,phase,lang);
 $('next-race').hidden=!result||!RACE_SERIES_V9.some(id=>!record.events[id]?.completed);
 $('start').textContent=t(paused?'resume':end?'again':'start');
 $('notice').textContent=noticeKey&&s.time<noticeUntil?t(noticeKey):c.finishTime!==null&&s.status==='racing'?t('waiting'):'';
}
const raceArt={};
[['road_day','art/v10/race_ashdocks_banchina_day.png'],['road_night','art/v10/race_ashdocks_banchina_night.png'],['driving_road','art/v05/driving_road.png'],['driving_cars','art/v05/driving_cars.png'],['veyra','art/v10/race_veyra_car.png'],['rival_2','art/v10/race_rival02_car.png'],['rival_3','art/v10/race_rival03_car.png'],['container','art/v10/race_container.png'],['container_rust','art/v10/race_container_ruggine.png'],['cp_active','art/v10/race_cp_active.png'],['cp_passed','art/v10/race_cp_passed.png']].forEach(([k,src])=>{const im=new Image();im.onload=()=>{raceArt[k]=im;};im.src=src;});
function drawCar(c,y,night=false){
 ctx.save();ctx.translate(c.x,y);ctx.rotate(c.vx*.0006);
 if(c.id==='player'&&raceArt.driving_cars?.naturalWidth){
  const col=c.integrity>70?0:c.integrity>35?2:3,row=c.integrity>70?0:2,cw=raceArt.driving_cars.naturalWidth/4,ch=raceArt.driving_cars.naturalHeight/4;
  ctx.drawImage(raceArt.driving_cars,col*cw,row*ch,cw,ch,-58,-58,116,116);ctx.restore();return;
 }
 const rArt=raceArt[c.id];
 if(rArt?.naturalWidth){
  const col=night?2:(c.integrity>70?0:c.integrity>35?1:2),row=night?1:0;
  ctx.drawImage(rArt,col*384,row*256,384,256,-108,-72,216,144);ctx.restore();return;
 }
 ctx.fillStyle='#03080f';ctx.fillRect(-24,-38,48,80);ctx.fillStyle=c.id==='player'?'#74f4da':c.id==='veyra'?'#ed857c':'#b9a0ed';ctx.fillRect(-19,-35,38,70);ctx.fillStyle='#15263b';ctx.fillRect(-14,-20,28,18);ctx.fillStyle='#dcefff';ctx.fillRect(-18,-35,9,5);ctx.fillRect(9,-35,9,5);ctx.restore();
}
function draw(){
 const race=RACES_V9[s.id],p=s.cars[0],worldY=at=>720-(at-p.distance)*.65,night=race.mode==='night';
 const rIm=night?raceArt.road_night:raceArt.road_day,roadTex=rIm?.naturalWidth?rIm:raceArt.driving_road;
 if(roadTex?.naturalWidth){
  const tileH=720,off=(p.distance*.65)%tileH;
  for(let y=-tileH+off;y<900;y+=tileH)ctx.drawImage(roadTex,0,y,720,tileH);
 }else{
  ctx.fillStyle=['sand','storm'].includes(race.mode)?'#6a5143':['bridges','duel'].includes(race.mode)?'#172546':'#132c37';ctx.fillRect(0,0,720,900);ctx.fillStyle=night?'#101a25':'#253341';ctx.fillRect(130,0,460,900);
 }
 ctx.strokeStyle='#6d829088';ctx.lineWidth=3;ctx.setLineDash([35,35]);ctx.lineDashOffset=s.cars[0].distance*.65;for(const x of [170,265,360,455,550]){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,900);ctx.stroke();}ctx.setLineDash([]);
 for(let i=0;i<race.checkpoints.length;i++){const y=worldY(race.checkpoints[i]),x=raceCheckpointX(race,i),width=race.checkpointWidth||165;if(y<-40||y>950)continue;const done=i<p.checkpoint;ctx.fillStyle=done?'#647d84':'#77f5d2';ctx.fillRect(x-width,y,width*2,10);ctx.font='bold 22px system-ui';ctx.fillText('CP '+(i+1),x-width+10,y-12);}
 for(const [idx,h] of race.hazards.entries()){const y=worldY(h.at);if(y<-80||y>980||h.at-p.distance>raceVisibility(race))continue;const x=raceHazardX(h,s.time),cIm=idx%2?raceArt.container_rust:raceArt.container;if(cIm?.naturalWidth){ctx.drawImage(cIm,x-40,y-60,80,120);}else{ctx.fillStyle=h.moving?'#c7a46e':'#dd9071';ctx.fillRect(x-28,y-40,56,80);ctx.strokeStyle='#2e241d';ctx.lineWidth=4;ctx.strokeRect(x-24,y-36,48,72);}}
 race.gates.forEach((at,i)=>{const y=worldY(at);if(y<-70||y>980)return;const open=raceGateOpen(s.time,i);ctx.fillStyle=open?'#72ebd5':'#f4bd72';ctx.fillRect(130,y,460,open?5:18);ctx.font='bold 23px system-ui';ctx.fillText(t(open?'open':'closed'),280,y-18);});
 const finish=worldY(race.length);if(finish>-50&&finish<950){for(let x=130;x<590;x+=20)for(let row=0;row<2;row++){ctx.fillStyle=((x-130)/20+row)%2?'#fff':'#15202a';ctx.fillRect(x,finish+row*20,20,20);}}
 for(const c of s.cars){const y=c.id==='player'?720:worldY(c.distance);if(y>-80&&y<980&&c.distance-p.distance<=raceVisibility(race))drawCar(c,y,night);}
 if(race.visibility){const edge=worldY(p.distance+race.visibility),shade=ctx.createLinearGradient(0,0,0,edge+140);shade.addColorStop(0,race.mode==='storm'?'#6a5143ed':'#050911f2');shade.addColorStop(1,'#05091100');ctx.fillStyle=shade;ctx.fillRect(130,0,460,edge+140);}
 if(started&&s.status==='countdown'){ctx.fillStyle='#efffff';ctx.textAlign='center';ctx.font='bold 100px system-ui';ctx.fillText(Math.ceil(s.countdown),360,400);ctx.textAlign='left';}
}
function loop(now){const dt=Math.min(.05,(now-last)/1000||0);last=now;
 if(started&&!paused){const active=k=>keys.has(k)||[...touch.values()].includes(k);tickRaceV9(s,{steer:Number(active('right'))-Number(active('left')),throttle:Number(active('throttle')),brake:Number(active('brake'))},dt);
 for(const e of s.events)if(e.car==='player'&&['impact','missedCheckpoint','recovery'].includes(e.type)){noticeKey={impact:'hit',missedCheckpoint:'missed',recovery:'recovery'}[e.type];noticeUntil=s.time+3;}
 if(s.status==='finished'&&!claimed){claimed=true;record=recordRaceV9(record,s).record;try{localStorage.setItem(storeKey,JSON.stringify(record));noticeKey='saved';}catch{noticeKey='storage';}noticeUntil=s.time+30;raceChoices();}
 }draw();renderUI();requestAnimationFrame(loop);}
$('start').onclick=()=>{if(paused){pause();return;}if(['finished','retired'].includes(s.status))reset();started=true;refresh();};$('pause').onclick=pause;$('restart').onclick=reset;$('race').onchange=reset;$('language').onchange=e=>{lang=e.target.value;refresh();};
$('next-race').onclick=()=>{const next=RACE_SERIES_V9.find(id=>!record.events[id]?.completed);if(next){$('race').value=next;reset();}};
const mapping={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'throttle',KeyW:'throttle',ArrowDown:'brake',KeyS:'brake',Space:'brake'};
window.addEventListener('keydown',e=>{if(e.target.matches('select,input')||e.code==='Space'&&e.target.matches('button,a'))return;if(mapping[e.code]){e.preventDefault();keys.add(mapping[e.code]);}if(e.code==='KeyP'&&!e.repeat)pause();});window.addEventListener('keyup',e=>keys.delete(mapping[e.code]));
for(const b of document.querySelectorAll('[data-hold]')){b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);touch.set(e.pointerId,b.dataset.hold);};for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,e=>touch.delete(e.pointerId));}
window.addEventListener('blur',()=>{if(started&&!paused)pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&started&&!paused)pause();});
window.chronosRaceLab={snapshot:()=>structuredClone(s),status:()=>({started,paused,record:structuredClone(record)})};refresh();requestAnimationFrame(loop);
