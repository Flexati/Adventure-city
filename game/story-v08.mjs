// v0.8 campaign copy. Rules and persistence live in narrative.mjs and missions.mjs; this file is words only.
// A block is an array of {speaker,text} or a function of narrative flags returning one.
const storyLine=(speaker,text)=>({speaker,text});
export const SPEAKERS={
 'NOX':{portrait:0,color:'#6bddff'},'LULÙ':{portrait:1,color:'#ff7fd8'},'EVE':{portrait:2,color:'#ff6a6a'},
 'SISTEMA':{color:'#b9c6d3'},'MIRA':{color:'#7dffd0'},'DARIO':{color:'#ffb65c'},'INES':{color:'#b8f27c'},
 'UNITÀ 9':{color:'#d395ff'},'ARCHON':{color:'#f6e2a6'},'CUSTODE':{color:'#d395ff'},'':{color:'#dfe9f1'}
};
export const STORY={
 blackout_pre:[storyLine('LULÙ','Mi chiamo Lulù. Mappo le reti di questo quartiere, e qualcuno le sta spegnendo.'),storyLine('LULÙ','Tre relè tengono chiuse le uscite. Riaccendiamoli. Sai sparare?'),storyLine('NOX','Credo di sì. Non so perché.')],
 blackout_end:[storyLine('LULÙ','La gang è scappata. Resta una batteria sola: officina o rifugio.'),storyLine('LULÙ','Non posso accenderli entrambi. Scegli tu: io porto le lampade all’altro.')],
 escape_pre:f=>[storyLine('NOX','Si guida così?'),storyLine('LULÙ','Si guida così. Acceleratore a destra, freno a sinistra. Portala intera fino al porto.'),...(f.blackout_choice==='workshop'?[storyLine('LULÙ','Dario ha rinforzato la Vortex. Un urto in più non la ferma.')]:f.blackout_choice==='shelter'?[storyLine('LULÙ','Mira mi ha dato una strada secondaria. Meno traffico, meno guai.')]:[])],
 breach_pre:[storyLine('NOX','Quella luce sopra il porto si muove.'),storyLine('LULÙ','Sono ancore: tengono aperta la breccia. Tu tieni lontane le creature, io le chiudo.')],
 breach_promise:[storyLine('LULÙ','Il terminale riconosce la tua firma. Se invio una scansione completa, ci danno una rotta pulita.'),storyLine('NOX','Non inviarla.'),storyLine('LULÙ','Ci farebbe risparmiare un’ora.'),storyLine('NOX','Non so chi la riceverebbe. Non inviarla.'),storyLine('LULÙ','Va bene. Restiamo locali. Promesso.')],
 signal_pre:[storyLine('LULÙ','Tre segnali azzurri. Passaci sopra e costruisco la mappa della breccia.'),storyLine('NOX','E poi?'),storyLine('LULÙ','Poi sapremo da dove arriva tutto questo.')],
 contagion_pre:[storyLine('LULÙ','Gli infetti seguono il rumore. Filtri prima, poi il corridoio.'),storyLine('NOX','C’è qualcuno dietro quella porta sigillata. Li sento respirare.')],
 clinic_auth:[storyLine('INES','Siamo in diciannove qui dentro! L’aria sta finendo!'),storyLine('SISTEMA','PORTA HELIOS · AUTENTICAZIONE EVE RICHIESTA'),storyLine('LULÙ','La firma di Nox è nel mio terminale, dal porto. Nox è a trenta metri, sotto attacco.'),storyLine('SISTEMA','Avviso: la trasmissione rivelerà la posizione dell’unità EVE.'),storyLine('LULÙ','Non c’è tempo per chiedere.')],
 clinic_after:[storyLine('SISTEMA','PORTA APERTA · 19 CIVILI IN USCITA'),storyLine('SISTEMA','UNITÀ EVE LOCALIZZATA')],
 clinic_hide:[storyLine('LULÙ','Glielo dirò io. Dopo. Quando saranno al sicuro.')],
 clinic_keep:[storyLine('LULÙ','Lo leggerà. E io dovrò esserci, mentre lo legge.')],
 evacuation_pre:[storyLine('LULÙ','Diciannove persone, due punti di raccolta. Fermati del tutto, o non salgono.'),storyLine('NOX','Chi ha aperto quella porta?'),storyLine('LULÙ','Guida, Nox.')],
 zero_pre:[storyLine('NOX','I Custodi non attaccano la città. Guardano me.'),storyLine('LULÙ','Allora restiamo vicini. I nuclei, poi il guardiano.')],
 separation:f=>[
  storyLine('SISTEMA','REGISTRO · DISTRETTO CLINICO · AUTENTICAZIONE EVE-47'),
  storyLine('SISTEMA','FIRMA TRASMESSA DA: LULÙ'+(f.clinic_hidden?' · AVVISO CANCELLATO':'')),
  storyLine('NOX','Sapevi che potevano trovarmi?'),storyLine('LULÙ','Sapevo che poteva succedere.'),storyLine('NOX','E l’hai fatto.'),
  storyLine('LULÙ','Sì. Ho scelto diciannove persone che soffocavano. E ho scelto anche il rischio per te, senza chiedertelo.'),
  f.rooftop_answer==='ask'?storyLine('NOX','Sul tetto ti avevo chiesto una cosa sola. Chiedimelo prima.'):storyLine('NOX','Ti avevo detto di scegliere loro. Non ti avevo detto di scegliere al posto mio.'),
  ...(f.clinic_hidden?[storyLine('NOX','E poi l’hai cancellato.'),storyLine('LULÙ','Volevo dirtelo io. Non ci sono riuscita in tempo.')]:[storyLine('NOX','Almeno l’hai lasciato dove potevo leggerlo.'),storyLine('LULÙ','Non volevo che lo scoprissi da una macchina. Né che non lo scoprissi affatto.')]),
  storyLine('SISTEMA','CEDIMENTO STRUTTURALE · LIVELLO 0'),storyLine('LULÙ','Nox! La mano!')],
 separation_after:[storyLine('','Il Nodo si spacca in due. Nox precipita verso i livelli bassi.'),storyLine('','Lulù resta sul lato della città, con la Vortex e diciannove persone da portare a casa.')],
 below_pre:[storyLine('EVE','Nessuno ti guarda. È più semplice così.'),storyLine('NOX','Fa freddo.'),storyLine('EVE','Temperatura sotto soglia. Le valvole termiche sono tre. Le guide ti cercano.')],
 below_end:[storyLine('','Nell’ultima valvola c’è una cella termica intatta. Accanto, una sagoma sintetica raggomitolata: UNITÀ 9.'),storyLine('','È fredda quanto te.')],
 heat_self:[storyLine('EVE','Efficiente.'),storyLine('NOX','Necessario. Non è la stessa cosa.')],
 heat_unit9:[storyLine('UNITÀ 9','…Perché?'),storyLine('NOX','Perché qualcuno l’ha fatto per me. Due volte.')],
 city_pre:f=>f.blackout_choice==='workshop'?[storyLine('MIRA','Lulù! La gang è tornata al rifugio: sanno che è al buio.'),storyLine('LULÙ','Allora la luce la porto io. Tenete le porte chiuse.')]:[storyLine('DARIO','L’officina è al buio e la gang vuole i ricambi della Vortex.'),storyLine('LULÙ','Tienimi aperto il portone. Ci penso io.')],
 city_end:f=>[storyLine(f.blackout_choice==='workshop'?'MIRA':'DARIO','Se ne sono andati. Grazie.'),storyLine('LULÙ','Non l’ho fatto per farmi perdonare. L’ho fatto perché eravate al buio.')],
 ring_pre:[storyLine('NOX','Un camion di manutenzione. Nessuno al posto accanto.'),storyLine('EVE','Le guide ti hanno visto. I droni colpiscono una corsia alla volta: cambia corsia quando diventa rossa.')],
 port_pre:[storyLine('LULÙ','I Custodi pattugliano il porto. Cercano la firma di Nox, non me.'),storyLine('LULÙ','Tre antenne. Fuori dalla loro luce, alle spalle se serve. Silenzio.')],
 port_end:[storyLine('SISTEMA','CANALE HELIOS APERTO · DESTINATARIO: EVE-47 · LIVELLI BASSI'),storyLine('LULÙ','Potrei dire a Nox che sono qui. Che aspetto.'),storyLine('SISTEMA','Avviso: la trasmissione rivelerà la posizione del destinatario.'),storyLine('LULÙ','Di nuovo.')],
 channel_call:[storyLine('LULÙ','Perdonami. Volevo solo che lo sapessi.')],
 channel_silent:[storyLine('LULÙ','Non stavolta. Se torna, sarà perché ha scelto di farlo.')],
 archive_pre:f=>f.channel_called?[storyLine('SISTEMA','MESSAGGIO IN ARRIVO · LULÙ: «Sono viva. Ti aspetto.»'),storyLine('NOX','È viva.'),storyLine('EVE','E le guide sanno di nuovo dove sei.')]:[storyLine('NOX','Due punti di gesso su ogni botola. Due colpi.'),storyLine('NOX','Lulù è passata di qui. E non ha chiamato.')],
 archive_end:[storyLine('','EVE-Prime si spegne a metà. Nel silenzio resta una voce: la sua memoria di Lia, l’unica testimone.')],
 eve_keep:[storyLine('NOX','Puoi ricordare. Non puoi scegliere al posto mio.'),storyLine('EVE','…Ricevuto.')],
 eve_silence:[storyLine('NOX','Mi dispiace per Lia. Ma il mio corpo non è il tuo archivio.')],
 tunnel_pre:[storyLine('LULÙ','Il posto accanto è vuoto. Lo guardo lo stesso.'),storyLine('LULÙ','Il tunnel è al buio. La Risonanza legge la strada a impulsi: tocca IMPULSO per vedere più lontano.')],
 line_pre:[storyLine('INES','Lulù. Gli ultimi autobus partono a breve, e i Custodi scendono dalla collina.'),storyLine('LULÙ','Tengo la linea finché partono.')],
 line_end:[storyLine('INES','Gli autobus sono pieni. C’è ancora gente nei sotterranei, ma l’asse si sta aprendo.'),storyLine('INES','Se vai adesso, arrivi in tempo per Nox.')],
 line_go:[storyLine('LULÙ','Ines, portali fuori tu. Ti prego.')],
 line_stay:[storyLine('LULÙ','Nox non mi ha chiesto di arrivare in tempo. Queste persone sì.')],
 ascent_pre:f=>[storyLine('NOX','L’asse è sopra di me. Da qualche parte, lassù, c’è la città.'),f.eve_kept?storyLine('EVE','Se vuoi, ti avverto prima che colpiscano.'):storyLine('NOX','Silenzio. Finalmente solo il mio respiro.'),...(f.channel_called?[storyLine('NOX','I Custodi seguono ancora la traccia di quel messaggio.')]:[])],
 finale_pre:[storyLine('ARCHON','EVE-47. Il corpo che mia figlia non ha potuto avere.'),storyLine('NOX','Non sono un corpo in prestito.'),storyLine('ARCHON','Allora sei un errore da correggere.')],
 reunion_open:[storyLine('LULÙ','Ho i registri. Tutti: il clinico, HELIOS. E il controllo del mio impianto.'),storyLine('LULÙ','Ho salvato quelle persone usando qualcosa che era tuo. Non so se lo rifarei. So che non avevo il diritto di decidere per te.')],
 reunion_warm:[storyLine('NOX','Non ti chiedo di non sbagliare più. Ti chiedo di chiedermelo.'),storyLine('LULÙ','Allora te lo chiedo adesso. Posso restare?')],
 reunion_tentative:[storyLine('NOX','Non so ancora come si torna a fidarsi.'),storyLine('LULÙ','Neanch’io. Possiamo impararlo piano?')],
 reunion_fragile:[storyLine('NOX','Mi hai trovato due volte senza chiedermelo.'),storyLine('LULÙ','E stavolta ho aspettato che fossi tu a venire.')],
 reunion_knock:[storyLine('LULÙ','Se mi senti, batti due volte.')],
 reunion_close:{warm:'Resta un momento.',tentative:'Siediti qui. Non andare via subito.',fragile:'Stasera non ti perdono. Ma resta finché smette di piovere.'}
};
// Non-blocking lines during play. Keys: mission id → trigger → line(s). Triggers: start, wave1, wave2, node1, node2, bossWake, phase1, phase2, adapt, alarm, perfect, lowHp, half, join, overdriveReady, barrier.
export const BARKS={
 blackout:{wave1:storyLine('LULÙ','Altri dal viale! Restiamo vicini.'),node1:storyLine('NOX','Dentro il relè c’è un connettore HELIOS. Più vecchio del quartiere.'),node2:storyLine('LULÙ','Quello col casco carica a testa bassa. Quando il cerchio si chiude, spostati.'),perfect:storyLine('LULÙ','Come hai fatto? Eri già altrove prima che colpisse.'),lowHp:storyLine('LULÙ','Respira. Un relè acceso ti rimette in piedi.')},
 escape:{half:storyLine('LULÙ','Quel segnale rosso a sinistra non è sulla mia mappa.'),late:storyLine('NOX','Neanche sulla mia. Eppure lo vedo.')},
 breach:{wave1:storyLine('NOX','Non sono alieni. Hanno numeri di serie.'),node2:storyLine('LULÙ','Questa porta tecnica… Nox, si è aperta prima che la toccassi.'),lowHp:storyLine('NOX','Lulù, indietro! Usa la Risonanza e respira.')},
 signal:{late:storyLine('LULÙ','Mappa completa. Strano: il centro della breccia segue noi.')},
 contagion:{wave1:storyLine('NOX','Li sento… ricordano cose che non sono loro.'),node1:storyLine('EVE','Non toccarla.'),node1b:storyLine('LULÙ','Nox? Con chi parli?'),after:storyLine('NOX','La porta si è aperta da sola?'),afterb:storyLine('LULÙ','…Andiamo. Ultimo filtro.')},
 evacuation:{pickup:storyLine('INES','Grazie. Chiunque abbia aperto quella porta, grazie.')},
 zero:{bossWake:storyLine('CUSTODE','RECUPERO UNITÀ EVE-47 · AUTORIZZATO'),phase1:storyLine('EVE','Lascia fare a me. Non dovrai sentirlo.'),phase1b:storyLine('NOX','No.'),phase2:storyLine('LULÙ','Ancora un colpo! Nox, adesso!')},
 below:{overdriveReady:storyLine('EVE','Lascia fare a me. BLACK PULSE è pronto.'),node1:storyLine('NOX','Valvola aperta. Il calore sale da qualche parte, sopra di me.'),node2:storyLine('EVE','Ha scambiato la tua posizione con diciannove sconosciuti.'),node2b:storyLine('NOX','Erano persone. Il problema non è chi ha salvato. È chi non ha interpellato.'),lowHp:storyLine('EVE','Danno critico. Lasciami il comando.')},
 city:{start:storyLine('LULÙ','Una barriera alla volta. Non devo vincere: devo tenere.'),half:storyLine('LULÙ','La cassa di Nox è ancora qui. Due ammaccature sul coperchio, all’altezza della mano.'),late:storyLine('LULÙ','Segno le botole con due punti di gesso. Se Nox risale, troverà l’uscita senza che nessuno senta niente.')},
 ring:{half:storyLine('NOX','Le finestre del Cantiere sono accese. Qualcuno è tornato lassù.')},
 port:{alarm:storyLine('LULÙ','Mi hanno vista. Cambio piano: niente più silenzio.'),silent:storyLine('LULÙ','Giù. Senza un suono.'),node1:storyLine('LULÙ','Prima antenna. Nessuno si è girato.')},
 archive:{node1:storyLine('EVE','Lia. Il dispositivo. «A ogni costo.»'),node2:storyLine('NOX','Non l’ho fatto io. Ma so quanto sarebbe facile farlo.'),bossWake:storyLine('EVE','Ti mostro come si fa, senza esitare.'),adapt:storyLine('EVE','Prevedibile. Cambia ritmo, se ci riesci.'),phase1:storyLine('EVE','Ogni legame è una ferita aperta.'),phase1b:storyLine('NOX','Allora resta aperta. È mia.')},
 tunnel:{half:f=>f.channel_called?storyLine('LULÙ','Un drone mi segue da quando ho trasmesso. Me lo merito.'):storyLine('LULÙ','Due punti di gesso sul muro. Li ho fatti io, tre ore fa.')},
 line:{unit9:storyLine('UNITÀ 9','Mi manda EVE-47. Ha detto: «Se mi senti…» Non ha finito la frase.'),unit9b:storyLine('LULÙ','…Batti due volte.'),half:storyLine('LULÙ','Il Nodo si è raffreddato dal basso. Qualcuno ha aperto le valvole. Nox.')},
 ascent:{start:f=>f.unit9_saved?storyLine('NOX','Le porte di servizio sono aperte. Unità 9 è passata di qui.'):null,bossWake:null},
 finale:{bossWake:storyLine('ARCHON','Ogni copia di Lia ha chiesto di andarsene. Le ho tenute tutte.'),join:storyLine('LULÙ','Se mi senti, batti due volte!'),joinb:storyLine('NOX','Ti sento. Duo, adesso.'),phase2:storyLine('ARCHON','Lia non voleva restare. Lo so. Lo so.'),warn:storyLine('EVE','Tre secondi. Spostati.')}
};
export const CHOICES={
 rooftop_glass:{title:'Perché lo tieni?',options:{truth:{label:'«Perché non serve.»',hint:'Dille la verità, anche se suona strana.',writes:{glass_truth:true},thermalDelta:3},unsure:{label:'«Non lo so ancora.»',hint:'Tieni la risposta per te.',writes:{glass_truth:false},thermalDelta:0}}},
 rooftop_ask:{title:'Se dovessi scegliere tra te e un quartiere intero…',options:{them:{label:'«Scegli loro.»',hint:'Le persone prima di te.',writes:{rooftop_answer:'them'},thermalDelta:0},ask:{label:'«Chiedimelo prima.»',hint:'Vuoi essere parte della decisione.',writes:{rooftop_answer:'ask'},thermalDelta:2}}},
 clinic_log:{title:'UNITÀ EVE LOCALIZZATA',options:{hide:{label:'Cancella l’avviso',hint:'Glielo dirai tu, quando sarà finita.',writes:{clinic_hidden:true},thermalDelta:-8},keep:{label:'Lascialo nel registro',hint:'Lo leggerà. Senza filtri.',writes:{clinic_hidden:false},thermalDelta:-3}}},
 below_heat:{title:'Una sola cella termica',options:{self:{label:'Usala su di te',hint:'+2 punti vita per tutta la discesa.',writes:{heat:'self'},thermalDelta:0},unit9:{label:'Dalla all’Unità 9',hint:'Resterai al freddo. Qualcuno ricorderà.',writes:{heat:'unit9',unit9_saved:true},thermalDelta:0}}},
 port_channel:{title:'Chiamare Nox?',options:{call:{label:'Trasmetti: «Sono viva. Ti aspetto.»',hint:'Nox lo saprà. Anche le guide.',writes:{channel_called:true},thermalDelta:-6},silent:{label:'Non chiamare',hint:'Lascia che sia Nox a scegliere.',writes:{channel_called:false,consent_channel_respected:true},thermalDelta:10}}},
 archive_eve:{title:'La testimone',options:{keep:{label:'Conserva la sua memoria',hint:'Ricorderà Lia. Non comanderà più.',writes:{eve_kept:true},thermalDelta:2},silence:{label:'Spegnila del tutto',hint:'Silenzio, e mani più ferme.',writes:{eve_kept:false},thermalDelta:0}}},
 line_wait:{title:'L’asse si apre',options:{go:{label:'Vai adesso',hint:'Arriverai prima nella battaglia finale.',writes:{line_choice:'go'},thermalDelta:0},stay:{label:'Resta finché esce l’ultimo',hint:'Nessuno rimane sotto. Arriverai tardi.',writes:{line_choice:'stay'},thermalDelta:4}}}
};
export const EPILOGUE=[
 f=>f.blackout_choice==='workshop'?'L’officina ripara la Vortex senza mai chiedere un soldo. Il rifugio ha comprato lampade nuove.':'Il rifugio tiene sempre una branda libera per Lulù. L’officina ha riaperto un mese dopo.',
 ()=>'Ines lavora ancora al Distretto Clinico. Diciannove persone festeggiano lo stesso compleanno: quello della porta.',
 f=>f.unit9_saved?'Unità 9 ripara i lampioni del Cantiere. Batte due colpi su ogni palo che riaccende.':'La cella termica scalda ancora il petto di Nox. Certe notti sembra un debito.',
 f=>f.eve_kept?'EVE-Prime ricorda Lia. Non comanda più niente.':'Nella testa di Nox c’è silenzio. A volte è pace. A volte è solo silenzio.',
 f=>f.channel_called?'Lulù non trasmette più niente senza chiedere. Ha imparato il prezzo dalla parte sbagliata.':'Lulù ha ancora il gesso sulle dita. Disegna due punti sulle porte che contano.',
 f=>f.line_choice==='stay'?'Nessuno è rimasto nei sotterranei.':'Ines ha portato fuori gli ultimi dai sotterranei. Ci ha messo tutta la notte.'
];
export function resolveLines(block,flags){const lines=typeof block==='function'?block(flags||{}):block;return Array.isArray(lines)?lines.filter(Boolean):[];}
export function resolveBark(line,flags){const v=typeof line==='function'?line(flags||{}):line;return v&&v.text?v:null;}
// Reaction lines played right after a choice, by choice id and option.
export const REACTIONS={clinic_log:{hide:'clinic_hide',keep:'clinic_keep'},below_heat:{self:'heat_self',unit9:'heat_unit9'},port_channel:{call:'channel_call',silent:'channel_silent'},archive_eve:{keep:'eve_keep',silence:'eve_silence'},line_wait:{go:'line_go',stay:'line_stay'}};
export function reunionTier(thermal){return thermal>=62?'warm':thermal>=45?'tentative':'fragile';}
