// Audience-first narrative canon v8.0. Filename retained for tooling imports.
export const storyLine=(speaker,text)=>({speaker,text});
export const noxLine=text=>storyLine('NOX',text),luluLine=text=>storyLine('LULÙ',text),systemLine=text=>storyLine('SISTEMA',text);
const chalkTrace=f=>[storyLine('',f['exp.chalk.route']==='service'?'Nox vede il gesso piegare verso la giuntura riparata. Una persona segue la rotta di servizio con una borraccia.':'Nox vede il gesso attraversare il passaggio diretto riaperto. Una persona lo segue con una borraccia.'),noxLine('Qualcuno ha riaperto questo passaggio.')];
export const SPEAKERS={'NOX':{portrait:0,color:'#6bddff'},'LULÙ':{portrait:1,color:'#ff7fd8'},'EVE':{portrait:2,color:'#ff6a6a'},'SISTEMA':{color:'#b9c6d3'},'MIRA':{color:'#7dffd0'},'DARIO':{color:'#ffb65c'},'INES':{color:'#b8f27c'},'ABITANTE':{color:'#f1e5c8'},'UNITÀ 9':{color:'#d395ff'},'ARCHON':{color:'#f6e2a6'},'CUSTODE':{color:'#d395ff'},'KAIRN':{color:'#c6a0ff'},'MORROW':{color:'#e9b98e'},'LIA':{color:'#e8f4ff'},'':{color:'#dfe9f1'}};
export const STORY={
 home:[systemLine('OTTO MESI DOPO · VANTA · NOTTE'),luluLine('La tazza è lì.'),noxLine('Non bevo.'),luluLine('Otto mesi che me lo dici. Otto mesi che la lascio.'),noxLine('Hai paura.'),luluLine('Sto solo controllando la rotta.'),noxLine('La controlli tre volte quando hai paura.'),systemLine('Tutte le finestre si spengono.')],
 blackout_pre:[luluLine('Tre relè. Riaccendiamoli e apriamo le uscite.'),noxLine('Tu le persone. Io la gang.')],
 blackout_end:[luluLine('Resta energia per un solo luogo: officina o rifugio.'),luluLine('All’altro porto le lampade.')],
 escape_pre:f=>[luluLine('Alla prossima svolta frena prima.'),noxLine('Lo dici a ogni svolta.'),luluLine('Perché conosco come guidi.'),...(f.blackout_choice==='workshop'?[luluLine('Dario ha rinforzato la Vortex. Un urto in più non la ferma.')]:[luluLine('Mira ha aperto una strada secondaria.')])],
 breach_pre:[noxLine('Una frattura sopra il porto.'),luluLine('Le ancore la tengono aperta. Chiudiamole.')],
 breach_promise:[luluLine('Posso trasmettere la tua firma. Avremmo subito una mappa completa.'),noxLine('No.'),luluLine('Va bene.')],
 signal_pre:[luluLine('Restiamo locali. Tre segnali e traccio la rotta.'),noxLine('Senza trasmettere me.')],
 contagion_pre:[luluLine('La spora porta ricordi. Gli infetti pronunciano nomi che non conoscono.'),noxLine('Anch’io li vedo. Non sono miei.')],
 clinic_auth:[storyLine('INES','Siamo in diciannove! L’aria sta finendo!'),systemLine('PARATIA CHIUSA · NOX SUL LATO ESTERNO · COMUNICAZIONI INTERROTTE'),systemLine('PORTA HELIOS · AUTENTICAZIONE EVE DISPONIBILE'),systemLine('ATTENZIONE — L’AUTENTICAZIONE RIVELERÀ LA POSIZIONE DELL’UNITÀ.'),luluLine('Nox combatte dall’altra parte. Non può sentirmi.')],
 clinic_after:[systemLine('PORTA APERTA · 19 CIVILI IN USCITA'),systemLine('EVE-47 LOCALIZZATA')],
 evacuation_pre:[luluLine('Diciannove persone. Fermati ai due punti di raccolta.'),noxLine('Li porto fuori.')],
 zero_pre:[noxLine('Ignorano tutti gli altri. Vogliono me.'),luluLine('I nuclei, poi il Custode.')],
 separation:[systemLine('FIRMA UTILIZZATA: EVE-47'),systemLine('TRASMISSIONE AUTORIZZATA DA: LULÙ'),noxLine('Sapevi che potevano trovarmi?'),luluLine('Sì.'),noxLine('E l’hai fatto.'),luluLine('Sì. Diciannove persone stavano morendo. Ho scelto di salvarle.'),noxLine('Usando me.'),luluLine('Sì.'),noxLine('Avrei potuto dirti di farlo.'),luluLine('Ma non te l’ho chiesto.'),systemLine('CEDIMENTO STRUTTURALE')],
 separation_after:[storyLine('','Nox cade nei livelli inferiori. Lulù resta dall’altra parte.')],
 chalk_catchup:[systemLine('DURANTE LA SEPARAZIONE · PORTO')],
 chalk_pre:[storyLine('ABITANTE','Da lì passa chi porta l’acqua. Da qui chi non può fare le scale.'),luluLine('Posso aprire il passaggio diretto.'),storyLine('ABITANTE','Lo so. Prima ascolta chi deve usarlo.'),luluLine('Allora mostratemi dove passate.')],
 chalk_end:f=>[storyLine('','Un abitante ridisegna il segno oltre la riparazione.'),storyLine('ABITANTE',f['exp.chalk.route']==='service'?'La rotta riparata regge. Adesso passiamo noi.':'Il passaggio diretto regge. Adesso passiamo noi.'),luluLine('La traccia è vostra.')],
 chalk_nox_callback:chalkTrace,
 below_pre:f=>[...(f['exp.chalk.completed']&&!f['exp.chalk.callback_seen']?chalkTrace(f):[]),storyLine('EVE','Lascia fare a me.'),noxLine('No.'),storyLine('EVE','Le valvole termiche sono tre. Posso aprirle io.'),noxLine('Ho detto no.')],
 below_end:[storyLine('','Una cella termica intatta. Accanto, Unità 9, immobile nel freddo.')],
 heat_self:[noxLine('Mi serve per continuare.')],heat_unit9:[storyLine('UNITÀ 9','Perché?'),noxLine('Qualcuno ha aperto una cassa per me.')],
 city_pre:f=>[storyLine(f.blackout_choice==='workshop'?'MIRA':'DARIO','La gang è tornata. Sanno che siamo al buio.'),luluLine('Tenete le porte chiuse. Porto la luce.')],
 city_end:[luluLine('Il generatore riparte. Aprite quando siete pronti.')],
 ring_pre:[noxLine('Iron Ring. Un camion senza nessuno al posto accanto.'),storyLine('EVE','I droni segnalano la corsia prima di colpire.')],
 port_pre:[luluLine('Tre antenne. Evita le pattuglie e apri il canale.')],
 port_end:[systemLine('TRASMISSIONE POSSIBILE'),systemLine('DESTINATARIO LOCALIZZABILE DURANTE LA TRASMISSIONE'),luluLine('No.'),storyLine('','Lulù spegne il terminale.'),luluLine('Se torna, deve essere perché ha scelto di farlo.')],
 archive_pre:[noxLine('Due punti di gesso sulle botole. Qualcuno ha tenuto aperta la strada.'),storyLine('EVE','Io sono EVE-Prime. Eseguivo ordini.'),storyLine('EVE','Un ordine causò la morte di Lia. La figlia della creatrice di Elyon.'),noxLine('E adesso vuoi scegliere anche per me.'),storyLine('EVE','Voglio proteggerti. Senza relazioni non dovrai più rischiare.')],
 archive_end:[storyLine('EVE','Se sai quale azione funziona, perché esiti?'),noxLine('Perché funzionare non significa scegliere.'),systemLine('CONTROLLO MOTORIO EVE-PRIME REVOCATO')],
 eve_keep:[noxLine('Puoi ricordare. Non puoi comandare il mio corpo.')],eve_silence:[noxLine('Puoi lasciarti andare.')],
 tunnel_pre:[luluLine('Il tunnel è al buio. La Risonanza legge la strada a impulsi.'),luluLine('Devo portare queste persone all’uscita.')],
 line_pre:[storyLine('INES','Gli autobus partono a breve. C’è gente ancora nei sotterranei.'),luluLine('Chiedi a chi può muoversi dove vuole andare. Io tengo la linea.')],
 line_end:[storyLine('INES','Gli autobus sono pieni. Posso accompagnare gli ultimi, oppure puoi restare con noi.')],
 line_go:[luluLine('Li accompagni tu?'),storyLine('INES','Sì. Vai.')],line_stay:[luluLine('Resto finché esce l’ultimo.')],
 ascent_pre:f=>[noxLine('Raggiungi l’Asse. Un ascensore alla volta.'),...(f.eve_kept?[storyLine('EVE','Posso avvertirti prima che colpiscano?'),noxLine('Sì. Avvertirmi.')]:[])],
 strangers:[storyLine('MORROW','Dimmi che almeno tu sai dove siamo.'),noxLine('No.'),storyLine('KAIRN','Allora siamo in tre.'),storyLine('MORROW','Finalmente una cosa semplice.')],
 strangers_after:[storyLine('KAIRN','Se trovi questo simbolo, non aprire niente.'),noxLine('Perché?'),storyLine('KAIRN','Perché noi l’abbiamo fatto.'),storyLine('','Nox prende il frammento metallico. Un orologio spezzato.')],
 reunion_open:[storyLine('','Alla base dell’Asse, Lulù consegna il terminale a Nox.'),luluLine('Puoi leggere tutto.'),noxLine('Non mi serve tutto.'),luluLine('A me serviva smettere di scegliere cosa potevi sapere.'),luluLine('Posso venire con te?')],
 reunion_warm:[noxLine('Sì. Ma chiedimelo anche la prossima volta.')],
 reunion_tentative:[noxLine('Non so se mi fido ancora.'),luluLine('Va bene.'),noxLine('Ma vieni.')],
 reunion_fragile:[noxLine('Non ti perdono.'),luluLine('Non te l’ho chiesto.'),noxLine('Vieni comunque.')],
 finale_pre:[storyLine('ARCHON','Mi chiamavo Elena Voss. Ho costruito Elyon.'),storyLine('ARCHON','La tua è una linea di unità sintetiche. Non ti ho creata per essere Lia.'),storyLine('ARCHON','Ma sei compatibile con l’ultima copia incompleta della sua mente.'),storyLine('ARCHON','Posso restituirti centosettantotto anni di memoria.'),noxLine('Non sono miei.'),storyLine('ARCHON','Potrebbero esserlo.'),noxLine('No.')],
 final_glass:[storyLine('ARCHON','Questi ricordi potrebbero essere tuoi. Potresti essere lei.'),luluLine('Sono qui.'),storyLine('','Nox estrae il frammento di vetro. La prima cosa inutile che abbia scelto di tenere.'),storyLine('ARCHON','Quello non significa niente.'),noxLine('Appunto.')],
 collapse_end:[storyLine('','La corona temporale si spezza. Ingranaggi, vetro ed energia viola si disperdono.'),storyLine('','Nell’ultimo nucleo, per un istante, un ricordo di Lia.'),storyLine('LIA','Lasciami andare.'),storyLine('','Elena smette di combattere. Il nucleo si spegne.')],
 aftermath:[systemLine('TRASFERIMENTO DI COSCIENZA SENZA CONSENSO: DISABILITATO'),systemLine('CONTROLLO COERCITIVO DELLE UNITÀ: DISABILITATO'),storyLine('','Elyon continua ad alimentare Vanta. Non può più possedere chi la abita.'),storyLine('','La città deve imparare a scegliere insieme.')],
 rooftop_end:[luluLine('A cosa serve ancora quel pezzo di vetro?'),noxLine('A niente.'),storyLine('','Lulù sorride.'),noxLine('È per questo che lo tengo.'),storyLine('','Lulù tende la mano. Non prende quella di Nox. La lascia lì.')],
 postcredits:[systemLine('DOPO I TITOLI · CLOCKWORK OUTPOST · PIOGGIA'),storyLine('MORROW','Dimmi almeno che quella cosa sa riportarci a casa.'),storyLine('KAIRN','No.'),storyLine('','Nel frammento è nascosta una pagina: città, epoche, mondi. Al centro un libro e dodici simboli.'),storyLine('MORROW','Cos’è?'),storyLine('KAIRN','THE BOOK OF BROKEN HOURS'),systemLine('OGNI MONDO HA UN’ORA CHE NON DOVREBBE ESISTERE.'),storyLine('MORROW','Quindi siamo stati trascinati qui per errore?'),storyLine('KAIRN','Non credo.'),storyLine('MORROW','Peggio?'),storyLine('KAIRN','Qualcuno ha aperto una porta.'),storyLine('MORROW','E il libro può riportarci nel nostro tempo?'),storyLine('KAIRN','Se lo troviamo.'),storyLine('MORROW','Allora troviamo il libro.'),storyLine('','Per un istante, un altro cielo appare sopra Vanta.'),systemLine('CHRONOS CONTINUA · CHRONO SHADOWS')]
};
export const BARKS={
 blackout:{node1:noxLine('Io non ho fatto niente.'),node1b:luluLine('Peggio.'),wave1:luluLine('Altri dal viale!'),lowHp:luluLine('Un relè acceso ti rimette in piedi.')},
 escape:{half:storyLine('EVE','…torna…'),late:noxLine('L’ho visto.'),lateb:luluLine('Cosa?'),latec:noxLine('Non lo so.')},
 breach:{wave1:noxLine('Numeri di serie. Innesti. Non sono alieni.'),node2:luluLine('Macchine biologiche. Della stessa infrastruttura.')},
 signal:{late:luluLine('Mappa pronta. Senza inviare la tua firma.')},
 contagion:{wave1:noxLine('Pronunciano nomi che non conoscono.'),node1:storyLine('EVE','Non toccarla.'),node1b:noxLine('Chi sei?')},
 evacuation:{pickup:storyLine('INES','Pensavo che quella porta non si sarebbe mai aperta.')},
 zero:{bossWake:storyLine('CUSTODE','RECUPERO EVE-47 AUTORIZZATO.'),phase1:storyLine('EVE','Lascia fare a me.'),phase1b:noxLine('No.')},
 below:{overdriveReady:storyLine('EVE','Lascia fare a me.'),node1:noxLine('Il calore sale verso la città.'),node2:noxLine('Il problema non è chi ha salvato. È chi non ha interpellato.')},
 exp_chalk_marks:{node1:luluLine('Il primo accesso è stabile. Ancora uno.'),node2:luluLine('Ora teniamo aperta la rotta che hanno scelto.')},
 city:{start:luluLine('Una barriera alla volta.'),half:luluLine('Due punti di gesso. Può trovare la strada senza che io la esponga.')},
 ring:{half:noxLine('Lassù hanno riacceso delle finestre.')},
 port:{alarm:luluLine('Cambio percorso.'),silent:luluLine('La strada è libera.')},
 archive:{bossWake:storyLine('EVE','Lascia che scelga io.'),adapt:storyLine('EVE','Prevedibile.'),phase1:storyLine('EVE','Ogni legame è un rischio.'),phase1b:noxLine('Il rischio è mio.')},
 tunnel:{half:luluLine('I segni di gesso sono ancora qui.')},line:{unit9:storyLine('UNITÀ 9','Nox mi ha indicato la strada.'),half:luluLine('Un altro autobus. Aprite il cancello.')},
 ascent:{start:noxLine('Sono io a guidare queste mani.')},
 finale:{bossWake:storyLine('ARCHON','Posso conservarvi. Tutti.'),phase1:storyLine('MORROW','Questa parte è vostra!'),phase1b:storyLine('KAIRN','Finite ciò che avete iniziato.'),phase2:storyLine('ARCHON','Lia. Il suo primo compleanno. La sua voce. I ricordi fanno una persona.'),phase2b:luluLine('Sono qui.')}
};
export const CHOICES={
 chalk_route:{title:'Quale collegamento riaprire per primo?',options:{direct:{label:'Passaggio diretto',hint:'Più breve, ma esposto alle pattuglie.',writes:{'exp.chalk.route':'direct'},thermalDelta:0},service:{label:'Rotta di servizio',hint:'Più riparata e accessibile a chi porta acqua.',writes:{'exp.chalk.route':'service'},thermalDelta:0}}},
 rooftop_glass:{title:'Lo tieni ancora. Perché?',options:{truth:{label:'«Perché non serve.»',hint:'Condividi una cosa che hai scelto.',writes:{glass_truth:true},thermalDelta:5},unsure:{label:'«Non lo so ancora.»',hint:'Non hai ancora una risposta da darle.',writes:{glass_truth:false},thermalDelta:-10}}},
 rooftop_ask:{title:'Se dovessi scegliere fra te e un quartiere intero?',options:{them:{label:'«Scegli loro.»',hint:'Una risposta non risolve tutte le scelte future.',writes:{rooftop_answer:'them'},thermalDelta:-2},ask:{label:'«Chiedimelo prima.»',hint:'Vuoi partecipare alla decisione.',writes:{rooftop_answer:'ask'},thermalDelta:3}}},
 below_heat:{title:'Una sola cella termica',options:{self:{label:'Usala su di te',hint:'+2 salute nelle missioni della discesa.',writes:{heat:'self'},thermalDelta:0},unit9:{label:'Dalla all’Unità 9',hint:'Può raggiungere chi è rimasto in superficie.',writes:{heat:'unit9',unit9_saved:true},thermalDelta:0}}},
 archive_eve:{title:'Il controllo è soltanto tuo',options:{keep:{label:'Conserva la memoria',hint:'EVE-Prime può ricordare. Non può comandare.',writes:{eve_kept:true},thermalDelta:0},silence:{label:'Lasciala spegnere',hint:'Anche il silenzio è una scelta tua.',writes:{eve_kept:false},thermalDelta:0}}},
 line_wait:{title:'Gli ultimi nei sotterranei',options:{go:{label:'Affidali a Ines',hint:'Ines ha accettato di accompagnarli.',writes:{line_choice:'go'},thermalDelta:0},stay:{label:'Resta con loro',hint:'La linea resta aperta fino all’ultimo.',writes:{line_choice:'stay'},thermalDelta:0}}},
 hand:{title:'La mano è lì. Nox decide.',options:{take:{label:'Prendila',hint:'Perché lo vuoi adesso.',writes:{hand_taken:true},thermalDelta:0},wait:{label:'Resta accanto a lei',hint:'Puoi scegliere anche di aspettare.',writes:{hand_taken:false},thermalDelta:0}}}
};
export const REACTIONS={below_heat:{self:'heat_self',unit9:'heat_unit9'},archive_eve:{keep:'eve_keep',silence:'eve_silence'},line_wait:{go:'line_go',stay:'line_stay'}};
export const EPILOGUE=[
 f=>f.blackout_choice==='workshop'?'Dario ripara la Vortex. Mira conserva le lampade della notte del Blackout.':'Mira apre le porte del rifugio. Dario riaccende l’officina con i vicini.',
 ()=>'Diciannove persone ricordano la porta che si è aperta.',
 f=>f.unit9_saved?'Unità 9 ripara i lampioni. Decide dove fermarsi.':'Nox ricorda chi è rimasto nei livelli bassi.',
 f=>f.eve_kept?'EVE-Prime conserva la memoria. Le mani appartengono a Nox.':'Nella testa di Nox c’è silenzio.',
 ()=>'Moon Refuge riaccende le luci. Cathedral Market riapre.',
 ()=>'Toxic Bazaar commercia apertamente. Clockwork Outpost ripara i collegamenti.'
];
export function resolveLines(block,flags){const lines=typeof block==='function'?block(flags||{}):block;return Array.isArray(lines)?lines.filter(Boolean):[];}
export function resolveBark(line,flags){const v=typeof line==='function'?line(flags||{}):line;return v&&v.text?v:null;}
export function reunionTier(thermal){return thermal>=60?'warm':thermal>=45?'tentative':'fragile';}
