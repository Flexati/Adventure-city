import {RACE_SERIES_V9} from './racing-v9.mjs';

// Authored rivalry beats: completing a race advances the relationship even when
// Nox loses. Replaying cannot farm respect; it is derived from distinct results.
const VEYRA_LINES_V9={
 ash_docks:{
  intro:['Sono Veyra. Qui mi chiamano Ash. Il traguardo è oltre i magazzini: fammi vedere come scegli una strada.','I’m Veyra. They call me Ash here. The finish is beyond the warehouses. Show me how you choose a road.'],
  win:['Va bene, Nox. Hai il mio tempo. Adesso vediamo se hai anche una linea.','All right, Nox. You beat my time. Now let’s see if you can hold a line.'],
  lose:['Sei arrivato. Conta anche quello. Torna fra le gru: lì la velocità da sola non ti salva.','You made it. That counts too. Meet me by the cranes. Speed alone won’t save you there.']},
 ash_slalom:{
  intro:['Fra queste gru non vince chi accelera prima. Guarda il varco dopo, non solo quello davanti al cofano.','Between these cranes, early acceleration means nothing. Look at the next gate, not just the one over your hood.'],
  win:['Hai smesso di inseguire la mia macchina. Stai guidando la tua. Mi piace.','You stopped chasing my car. You’re driving yours. I like that.'],
  lose:['Hai perso tempo, non la strada. Per la prossima tieni gli occhi sui segnali: correremo al buio.','You lost time, not your way. Watch the markers next time. We’ll be racing in the dark.']},
 ash_night:{
  intro:['Niente fari del porto stanotte. Se non vedi cosa arriva, rallenta. Non devi dimostrare nulla a un muro.','No dock lights tonight. If you can’t see what’s ahead, slow down. You have nothing to prove to a wall.'],
  win:['Hai saputo togliere il piede. Quella è una scelta che molti non imparano mai. Ci vediamo a Solkara.','You knew when to lift. Some drivers never learn that choice. See you in Solkara.'],
  lose:['La notte te la sei lasciata dietro. A Solkara troverai una strada che si muove anche quando tu vai dritta.','You left the night behind. In Solkara, the road moves even when you drive straight.']},
 solkara:{
  intro:['I convogli non gareggiano con noi. Hanno persone da portare a casa. Trova un varco senza trattarli da ostacoli da abbattere.','The convoys aren’t racing us. They have people to bring home. Find a gap without treating them as targets.'],
  win:['Lavoro pulito, Nox. Hai letto il movimento prima di entrarci. Il vento domani non sarà così gentile.','Clean work, Nox. You read the movement before committing. Tomorrow’s wind won’t be so kind.'],
  lose:['Hai attraversato il convoglio. Ora ascolta il volante: la prossima sfida arriva di lato.','You crossed the convoy. Now listen to the wheel. The next challenge comes from the side.']},
 solkara_storm:{
  intro:['Non combattere ogni raffica. Correggi, lascia respirare la macchina, poi scegli il prossimo varco.','Don’t fight every gust. Correct, let the car settle, then choose your next gate.'],
  win:['Non ti ho regalato niente. Questa te la sei presa tu. Ad Aurelia cambierà anche il tempo.','I gave you nothing. You earned this one. In Aurelia, even time will change.'],
  lose:['Il vento ti ha spostato, ma non ti ha fermato. Ad Aurelia ci servirà anche la pazienza.','The wind pushed you, but it didn’t stop you. In Aurelia we’ll need patience too.']},
 aurelia_span:{
  intro:['I ponti si aprono quando vogliono loro. Il trucco è arrivare pronto, non arrivare disperato.','The bridges open on their own schedule. The trick is to arrive ready, not desperate.'],
  win:['Hai trovato il ritmo. Rimane una corsa, Nox. Solo tu e io.','You found the rhythm. One race left, Nox. Just you and me.'],
  lose:['Adesso conosci il ritmo dei ponti. L’ultima sarà fra noi due, senza altre macchine a dividerci.','Now you know the bridges’ rhythm. The last race is between us, with no other cars in the way.']},
 veyra_duel:{
  intro:['Sette gare. Ti ho visto scegliere quando spingere e quando aspettare. Adesso porta fino in fondo la tua linea.','Seven races. I’ve seen you choose when to push and when to wait. Now follow your own line to the end.'],
  win:['La linea è tua, Nox. La prossima volta sarò io a inseguirti. E sì: ci sarà una prossima volta.','The line is yours, Nox. Next time I’ll be chasing you. And yes, there will be a next time.'],
  lose:['Oggi ho vinto io. Ma ormai so con chi sto correndo. Quando vorrai la rivincita, sai dove trovarmi.','I won today. But now I know who I’m racing. When you want a rematch, you know where to find me.']}
};

// Challenge modes (D17): Veyra speaks in Elimination and Rematch; Time trial is Nox alone.
const VEYRA_MODE_LINES_V9={
 elim:{
  intro:['Quattro auto, un solo traguardo. A ogni varco esce chi resta indietro. Non farti trovare in fondo, Nox.','Four cars, one finish line. At every gate whoever trails is out. Don’t be caught at the back, Nox.'],
  win:['Sei rimasto in piedi fino all’ultimo duello e l’hai vinto. Così si corre.','You lasted to the final duel and won it. That’s racing.'],
  lose:['Sei arrivato al duello. Il prossimo varco, però, lo prendo sempre io.','You made the duel. The last gate is still mine, though.'],
  out:['Fuori al varco. Succede. Rimettiti in fila e riprova.','Out at the gate. It happens. Line up and go again.']},
 rev:{
  intro:['Stesso porto, al contrario. Più container, e stavolta non ti lascio spazio.','Same docks, backwards. More containers, and this time I’m not leaving you room.'],
  win:['Al contrario e con me addosso. Va bene, Nox: rivincita tua.','Backwards and with me on your bumper. All right, Nox: the rematch is yours.'],
  lose:['La rivincita è mia. Ma l’hai resa difficile.','The rematch is mine. You made it hard, though.']}
};
export function veyraLineV9(raceId,phase='intro',language='it'){
 const mode=String(raceId).split(':');if(mode.length>1)return VEYRA_MODE_LINES_V9[mode[0]]?.[phase]?.[language==='en'?1:0]||'';
 return VEYRA_LINES_V9[raceId]?.[phase]?.[language==='en'?1:0]||'';
}
export function veyraRivalryV9(record){
 const completed=RACE_SERIES_V9.filter(id=>record.events[id]?.completed);
 const wins=completed.filter(id=>record.events[id].won).length;
 return {completed:completed.length,total:RACE_SERIES_V9.length,wins,
  stage:completed.length===7?'respect':completed.length>=4?'contender':completed.length>=1?'challenger':'first_meeting',
  resolved:completed.length===7};
}
