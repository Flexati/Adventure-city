// Persistent hub economy and authored errands. Pure rules: no DOM, rendering or clock.
import {compileVillage,doorOf} from './villages.mjs';
import {newRaceRecordV9,recordRaceV9,loadRaceRecordV9,availableRaceModesV9,RACES_V9} from './racing-v9.mjs';
const hubPoint=(id,label,tx,ty,kind,extra={})=>({id,label,x:(tx+.5)*64,y:(ty+.5)*64,kind,...extra});
const hubJob=(id,title,brief,targets,reward,part,finish)=>({id,title,brief,targets,reward,part,finish});
export const HUBS={
 moon:{name:'Moon Refuge',layout:'moon',district:0,color:'#83cbb2',pov:'nox',services:['inn','smith','shop'],
  intro:['La Vortex si ferma tra finestre accese e lampade a batteria.','Lulù lascia una tazza anche per Nox. «Lo so che non ti serve.»','«Ormai la lasci sempre.»'],
  jobs:[hubJob('moon_lamps','Riaccendi le lampade','Mira cerca tre accumulatori: sono nelle nicchie del rifugio.',['cell_a','cell_b','cell_c'],45,null,'Tre finestre tornano accese. La bambina saluta la Vortex.'),hubJob('moon_roof','Ripara il tetto','Dario presta gli attrezzi. Sigilla due condotte e torna al fabbro.',['pipe_a','pipe_b'],40,null,'La locanda apre una stanza asciutta per chi arriva dal Cantiere.')],
  people:[['child','Bambina','scavenger_kid','È quella la Vortex? La riconoscerei anche al buio.'],['elder','Vecchio','traveling_bard','Quel segno sui relè? Sta anche sulle vecchie porte. Non mi piace che si siano riaperte.']],
  secret:'Una biglia liscia. Nessuna funzione. Nox la fa rotolare fra le dita.',epilogue:'Le luci del rifugio funzionano anche quando Elyon tace.'},
 cathedral:{name:'Cathedral Quarter',layout:'cathedral',district:1,color:'#d6bd91',pov:'nox',services:['smith','relic','shop','info'],
  intro:['Sopra, vetrine illuminate. Sotto, un orologio batte tredici volte.','Il quadrante porta un simbolo che non è di Elyon. Nessuno sa quando sia stato montato.'],
  jobs:[hubJob('cathedral_clocks','Rileva gli orologi','La custode vuole confrontare tre quadranti che segnano ore diverse.',['clock_a','clock_b','clock_c'],50,null,'I quadranti discordano di un secondo. Poi tornano immobili.'),hubJob('cathedral_route','Apri il passaggio','Riapri due cancelli per far tornare il mercato del porto.',['gate_a','gate_b'],45,null,'Il commerciante del porto riapre il banco. Ricorderà chi ha liberato la strada.')],
  people:[['priest','Custode delle reliquie','relic_priestess','Questi orologi sono più vecchi delle condotte. Non appartengono a Elyon.'],['trader','Commerciante del Porto','merchant','Al porto mi hai visto scappare. Qui sto provando a ricominciare.'],['guard','Guardia della porta','gate_guard','Le pattuglie del porto assoldano cacciatori da fuori. Qui la porta resta aperta: per entrare non serve un nome.']],
  secret:'Dietro il quadrante: un orologio spezzato inciso nella pietra.',epilogue:'Cathedral Market riapre. Le persone decidono insieme gli orari della corrente.'},
 toxic:{name:'Toxic Slum Bazaar',layout:'toxic',district:2,color:'#b7c56b',pov:'nox',services:['smith','alchemist','shop','info'],
  intro:['L’acqua corre in tubi montati a mano. Nessun cavo raggiunge Elyon.','Una persona mutata vende filtri. Un’altra ripara una radio. Nessuno aspetta che qualcuno venga a salvarli.'],
  jobs:[hubJob('toxic_water','Ripara le pompe','L’alchimista ti presta una chiave: riattiva tre pompe autonome.',['pump_a','pump_b','pump_c'],55,'toxic','L’acqua riparte senza Elyon. Il fabbro ti consegna un componente isolato.'),hubJob('toxic_route','Traccia la via asciutta','Segna due ponti sicuri per chi non può attraversare l’acqua.',['bridge_a','bridge_b'],50,'toxic','Il mercato apre il percorso. Un secondo componente è pronto in officina.')],
  people:[['mutant','Filtraia','toxic_mutant_zombie','Queste mani le ho ancora. Il filtro l’ho fatto io. Vuoi vedere come?'],['scout','Informatore','masked_informant','L’Archivio legge chi lo attraversa. Isola il tuo impianto prima di entrare.']],
  secret:'Una stanza di manutenzione trasformata in cucina comune. Il suo interruttore non è collegato a Elyon.',epilogue:'Il Bazaar commercia apertamente. Le pompe restano di chi le mantiene.'},
 clockwork:{name:'Clockwork Outpost',layout:'clockwork',district:3,color:'#bba1ed',pov:'nox',services:['smith','shop','relic','info'],
  intro:['Un automa ripara un altro automa con un ingranaggio impossibile.','Gli orologi non seguono la stessa ora. Le loro fondamenta sono precedenti a Elyon.'],
  jobs:[hubJob('clockwork_links','Ripara i collegamenti','La meccanica prepara un innesto. Riallinea tre distributori.',['link_a','link_b','link_c'],60,'clockwork','I collegamenti tornano attivi. Un componente schermato è pronto.'),hubJob('clockwork_shelter','Apri una via di fuga','Sblocca due passerelle laterali prima di salire all’Asse.',['walk_a','walk_b'],55,'clockwork','La via di fuga è pronta. La meccanica ti offre un secondo componente.')],
  people:[['mechanic','Meccanica','mechanic','Ieri ho visto due uomini cadere dal cielo. Uno conosceva i colpi prima che arrivassero.'],['merchant','Mercante','merchant','L’altro aveva un’arma rumorosa. E una lama che girava. Mai visto niente del genere a Vanta.']],
  secret:'Dietro una ruota ferma, lo stesso simbolo di orologio spezzato.',epilogue:'Gli automi riparano i collegamenti. Nessuna voce assegna loro un padrone.'}
};
export const HUB_ITEMS={
 coil:{name:'Pistola a bobina',price:40,stock:1,slot:'weapon',damage:1,description:'+1 danno ai colpi. Equipaggia dal bagaglio.'},
 resonator:{name:'Risonatore portatile',price:65,stock:1,slot:'weapon',damage:2,slow:.08,description:'+2 danno; colpi più lenti. Equipaggia dal bagaglio.'},
 vest:{name:'Giacca rinforzata',price:40,stock:1,slot:'armor',hp:2,description:'+2 salute a ogni ingresso in missione.'},
 echo:{name:'Reliquia di risonanza',price:35,stock:1,slot:'relic',resonance:true,description:'Risonanza stordisce più a lungo.'},
 medkit:{name:'Medicina',price:15,stock:3,consumable:true,description:'Recupera 4 salute durante una missione. Non si rigenera dopo una sconfitta.'},
 glass_bead:{name:'Un oggetto inutile',price:5,stock:1,description:'Non apre porte. Non aumenta nessun parametro.'},
 intel:{name:'Mappa delle nicchie',price:10,stock:1,description:'Segna la stanza nascosta di questo quartiere.'},
 toxic_attack:{name:'Isolamento offensivo',part:'toxic',rank:1,style:'attack',description:'Per l’Archivio: isola l’impianto, +1 danno.'},
 toxic_defense:{name:'Isolamento difensivo',part:'toxic',rank:1,style:'defense',description:'Per l’Archivio: isola l’impianto, +2 salute.'},
 clockwork_attack:{name:'Schermo offensivo',part:'clockwork',rank:2,style:'attack',description:'Per l’Asse: scherma l’impianto, +1 danno.'},
 clockwork_defense:{name:'Schermo difensivo',part:'clockwork',rank:2,style:'defense',description:'Per l’Asse: scherma l’impianto, +2 salute.'}
};
// Veyra's Ash Docks races are reached with the Vortex while following Nox in Vanta. Solkara and
// Aurelia Span belong to regions the campaign graph does not have yet, so they stay locked here.
// The record is optional in saves: older v7 worlds simply have not raced.
export const HUB_RACES=Object.freeze(['ash_docks','ash_slalom','ash_night']);
export function nextHubRace(p,pov='nox'){if(pov!=='nox')return null;const events=p?.world?.races?.events||{};return HUB_RACES.find(id=>!events[id]?.completed)||null;}
// Challenge modes (D17) on the Ash Docks courses already completed.
export function hubRaceModes(p,pov='nox'){if(pov!=='nox'||!p?.world?.races)return [];return availableRaceModesV9(p.world.races,HUB_RACES);}
export function claimHubRace(p,s){
 if(!HUB_RACES.includes(RACES_V9[s?.id]?.base||s?.id))return {reward:0,record:p.world.races||null};
 const {record,reward}=recordRaceV9(p.world.races||newRaceRecordV9(),s);
 p.world.races=record;p.world.coins+=reward;return {reward,record};
}
export function newWorld(){return {coins:30,parts:{toxic:0,clockwork:0},inventory:{},equipment:{},stock:{},quests:{},secrets:[],visited:[],rewards:[],preparation:{},hub:null};}
export function validateWorld(w){
 if(!w||!Number.isInteger(w.coins)||w.coins<0||w.coins>100000)return null;
 const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
 if(![w.parts,w.inventory,w.equipment,w.stock,w.quests,w.preparation].every(record))return null;
 if(!['toxic','clockwork'].every(k=>Number.isInteger(w.parts[k])&&w.parts[k]>=0&&w.parts[k]<=2))return null;
 if(![w.secrets,w.visited,w.rewards].every(a=>Array.isArray(a)&&a.every(v=>typeof v==='string'&&v.length<80)&&new Set(a).size===a.length))return null;
 if(w.visited.some(id=>!HUBS[id]))return null;
 if(Object.entries(w.inventory).some(([id,n])=>!HUB_ITEMS[id]||!Number.isInteger(n)||n<0||n>100))return null;
 if(Object.entries(w.equipment).some(([slot,id])=>!['weapon','armor','relic'].includes(slot)||!w.inventory[id]||HUB_ITEMS[id]?.slot!==slot))return null;
 if(Object.entries(w.stock).some(([key,n])=>!Number.isInteger(n)||n<0||n>3||!key.includes(':')))return null;
 const jobs=Object.values(HUBS).flatMap(h=>h.jobs);
 if(Object.entries(w.quests).some(([id,q])=>{const job=jobs.find(j=>j.id===id);return !job||!q||!['active','complete'].includes(q.status)||!Array.isArray(q.targets)||new Set(q.targets).size!==q.targets.length||q.targets.some(t=>!job.targets.includes(t))||(q.status==='complete'&&q.targets.length!==job.targets.length);}))return null;
 if(Object.entries(w.preparation).some(([k,v])=>!['toxic','clockwork'].includes(k)||!['attack','defense'].includes(v)))return null;
 if(w.races!==undefined&&(!loadRaceRecordV9(JSON.stringify(w.races))||Object.keys(w.races.events).some(id=>!HUB_RACES.includes(id))||Object.keys(w.races.modes||{}).some(id=>!HUB_RACES.includes(RACES_V9[id]?.base))))return null;
 if(w.hub!==null&&(!record(w.hub)||!HUBS[w.hub.id]||!['nox','lulu'].includes(w.hub.pov)||!Number.isInteger(w.hub.returnStep)||w.hub.returnStep<0||!['campaign','supply','epilogue'].includes(w.hub.reason)||![w.hub.x,w.hub.y].every(n=>Number.isFinite(n)&&n>=30&&n<=1506)))return null;
 return JSON.parse(JSON.stringify(w));
}
export function hubPoints(id,p=null){
 const h=HUBS[id];if(!h)return [];
 const plan=compileVillage(id)?.plan||{},P=(key,def)=>plan[key]||def;// villaggi progettati (game/villages.mjs); senza piano valgono i punti storici
 const points=[hubPoint('board','Incarichi',...P('board',[11,12]),'board'),hubPoint('exit','Prosegui',...P('exit',[20,12]),'exit'),hubPoint('travel','Collegamenti',...P('travel',[3,12]),'travel'),hubPoint('secret','Stanza nascosta',...P('secret',[19,19]),'secret')];
 const sites=[[6,6],[17,6],[6,18],[17,18]];
 h.services.forEach((service,i)=>points.push(hubPoint(service,({inn:'Locanda',smith:'Fabbro',shop:'Negozio',relic:'Reliquie',info:'Informazioni',alchemist:'Alchimista'})[service],...(doorOf(id,service)?[doorOf(id,service).x,doorOf(id,service).y]:sites[i]),'service',{service,atlas:({inn:'innkeeper',smith:'blacksmith',shop:'merchant',relic:'relic_priestess',info:'masked_informant',alchemist:'potion_alchemist'})[service]})));
 h.people.forEach(([pid,label,atlas,text],i)=>points.push(hubPoint(pid,label,...(plan.people?.[i]||[9+i*5,11]),'person',{atlas,text})));
 const targetSites=[[4,11],[8,13],[18,13],[11,5],[12,18]];
 h.jobs.flatMap(j=>j.targets).forEach((target,i)=>points.push(hubPoint(target,'Intervento '+(i+1),...(plan.targets?.[i]||targetSites[i]),'target')));
 const race=p&&nextHubRace(p,p.world.hub?.pov);if(race||(p&&hubRaceModes(p,p.world.hub?.pov).length))points.push(hubPoint('vortex','Vortex · Ash Docks',...P('vortex',[5,15]),'race',{race}));
 return points;
}
export function availableHubs(p,pov='nox'){
 const w=p.world;if(!w)return [];const split=p.narrative.flags.separated&&!p.narrative.flags.reunited&&!p.narrative.flags.story_complete;
 return w.visited.filter(id=>!split||(pov==='lulu'?['moon','cathedral'].includes(id):['toxic','clockwork'].includes(id)));
}
export function acceptHubJob(p,hubId,jobId){const j=HUBS[hubId]?.jobs.find(j=>j.id===jobId);if(!j||!p.world.visited.includes(hubId)||p.world.quests[jobId])return false;p.world.quests[jobId]={status:'active',targets:[]};return true;}
export function workHubTarget(p,hubId,target){
 const j=HUBS[hubId]?.jobs.find(j=>j.targets.includes(target)),q=j&&p.world.quests[j.id];
 if(!q||q.status!=='active'||q.targets.includes(target))return false;q.targets.push(target);return true;
}
export function finishHubJob(p,hubId,jobId){
 const j=HUBS[hubId]?.jobs.find(j=>j.id===jobId),q=j&&p.world.quests[jobId];
 if(!q||q.status!=='active'||q.targets.length!==j.targets.length)return false;
 q.status='complete';p.world.coins+=j.reward;if(j.part)p.world.parts[j.part]++;
 p.narrative.flags[j.id]=true;return true;
}
export function hubCatalog(id,service){
 if(service==='smith')return ['coil','resonator','vest',...(id==='toxic'?['toxic_attack','toxic_defense']:id==='clockwork'?['clockwork_attack','clockwork_defense']:[])];
 if(service==='relic')return ['echo'];if(service==='info')return ['intel'];
 if(service==='alchemist')return ['medkit','echo'];if(service==='shop')return ['medkit','glass_bead'];return [];
}
export function buyHubItem(p,hubId,service,itemId){
 const w=p.world,item=HUB_ITEMS[itemId];if(!item||!w.visited.includes(hubId)||!HUBS[hubId].services.includes(service)||!hubCatalog(hubId,service).includes(itemId))return {ok:false,reason:'Non disponibile qui.'};
 if(item.part){if(w.preparation[item.part])return {ok:false,reason:'Preparazione già installata.'};if(w.parts[item.part]<1)return {ok:false,reason:'Completa un incarico locale per ottenere il componente.'};w.parts[item.part]--;w.preparation[item.part]=item.style;}
 else{const key=hubId+':'+itemId;if((w.stock[key]||0)>=item.stock)return {ok:false,reason:'Scorta esaurita.'};if(!item.consumable&&itemId!=='intel'&&w.inventory[itemId])return {ok:false,reason:'Già nel bagaglio.'};if(w.coins<item.price)return {ok:false,reason:'Monete insufficienti. Gli incarichi indicano la ricompensa.'};w.coins-=item.price;w.stock[key]=(w.stock[key]||0)+1;w.inventory[itemId]=(w.inventory[itemId]||0)+1;if(item.slot)w.equipment[item.slot]=itemId;}
 if(itemId==='glass_bead')p.narrative.flags.useless_bought=true;
 if(itemId==='intel'&&!w.secrets.includes(hubId+':map'))w.secrets.push(hubId+':map');
 return {ok:true};
}
export function equipHubItem(p,id){const item=HUB_ITEMS[id];if(!item?.slot||!p.world.inventory[id])return false;p.world.equipment[item.slot]=id;return true;}
export function useHubMedicine(p,s,commit=()=>true){
 if(!s||s.status!=='playing'||!Number.isFinite(s.hp)||s.hp<=0||!Number.isFinite(s.maxHp)||s.hp>=s.maxHp||!(p.world.inventory.medkit>0))return false;
 const beforeHp=s.hp,beforeKits=p.world.inventory.medkit;
 p.world.inventory.medkit--;s.hp=Math.min(s.maxHp,s.hp+4);
 try{if(commit()===true)return true;}catch{}
 p.world.inventory.medkit=beforeKits;s.hp=beforeHp;return false;
}
export function preparationNeeded(p,id){if(id==='archive'&&!p.world.preparation.toxic)return 'Toxic Slum Bazaar: completa un incarico e installa un isolamento dal fabbro.';if(id==='finale'&&!p.world.preparation.clockwork)return 'Clockwork Outpost: completa un incarico e installa uno schermo dal fabbro.';return null;}
export function applyEquipment(p,c){
 const copy={...c};let hp=0,damage=0;
 for(const id of Object.values(p.world.equipment)){const item=HUB_ITEMS[id];hp+=item?.hp||0;damage+=item?.damage||0;copy.cooldown+=item?.slow||0;if(item?.slot==='weapon')copy.weapon=item.name;if(item?.resonance)copy.resonanceBonus=1;}
 for(const style of (c.pov==='nox'?Object.values(p.world.preparation):[])){if(style==='attack')damage++;else hp+=2;}
 copy.hpBonus=(copy.hpBonus||0)+hp;copy.damage+=damage;return copy;
}
export function rewardMission(p,id){if(p.world.rewards.includes(id))return false;p.world.rewards.push(id);p.world.coins+=20;return true;}
