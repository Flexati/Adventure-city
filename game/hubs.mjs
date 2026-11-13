// Persistent hub economy and authored errands. Pure rules: no DOM, rendering or clock.
import {compileVillage,doorOf} from './villages.mjs';
import {newRaceRecordV9,recordRaceV9,loadRaceRecordV9,availableRaceModesV9,RACES_V9} from './racing-v9.mjs';
import {MARKET_WEAPONS,MARKET_GEAR_ITEMS,MARKET_TURBO_ITEMS,REGION_CATALOG} from './arsenal-data.mjs';
const hubPoint=(id,label,tx,ty,kind,extra={})=>({id,label,x:(tx+.5)*64,y:(ty+.5)*64,kind,...extra});
const hubJob=(id,title,brief,targets,reward,part,finish)=>({id,title,brief,targets,reward,part,finish});
export const HUBS={
 moon:{name:'Moon Refuge',layout:'moon',district:0,color:'#83cbb2',pov:'nox',services:['inn','smith','shop'],
  intro:['La Vortex si ferma tra finestre accese e lampade a batteria.','Lulù lascia una tazza anche per Nox. «Lo so che non ti serve.»','«Ormai la lasci sempre.»'],
  jobs:[hubJob('moon_lamps','Riaccendi le lampade','Mira cerca tre accumulatori: sono nelle nicchie del rifugio.',['cell_a','cell_b','cell_c'],45,null,'Tre finestre tornano accese. La bambina saluta la Vortex.'),hubJob('moon_roof','Ripara il tetto','Dario presta gli attrezzi. Sigilla due condotte e torna al fabbro.',['pipe_a','pipe_b'],40,null,'La locanda apre una stanza asciutta per chi arriva dal Cantiere.')],
  people:[
   ['child','Bambina','scavenger_kid','È quella la Vortex? La riconoscerei anche al buio.'],
   ['elder','Vecchio','traveling_bard','Quel segno sui relè? Sta anche sulle vecchie porte. Non mi piace che si siano riaperte.'],
   ['tessa_app','Apprendista di Tessa','mechanic','Tessa mi ha lasciato le chiavi del banco piccolo. Dice che ogni bullone racconta chi l’ha stretto.'],
   ['watch_m','Sentinella del vicolo','gate_guard','Dopo il Blackout abbiamo montato campane di vetro sui fili: se la gang torna, il vicolo suona prima.']
  ],
  secret:'Una biglia liscia. Nessuna funzione. Nox la fa rotolare fra le dita.',epilogue:'Le luci del rifugio funzionano anche quando Elyon tace.'},
 cathedral:{name:'Cathedral Quarter',layout:'cathedral',district:1,color:'#d6bd91',pov:'nox',services:['smith','relic','shop','info'],
  intro:['Sopra, vetrine illuminate. Sotto, un orologio batte tredici volte.','Il quadrante porta un simbolo che non è di Elyon. Nessuno sa quando sia stato montato.'],
  jobs:[hubJob('cathedral_clocks','Rileva gli orologi','La custode vuole confrontare tre quadranti che segnano ore diverse.',['clock_a','clock_b','clock_c'],50,null,'I quadranti discordano di un secondo. Poi tornano immobili.'),hubJob('cathedral_route','Apri il passaggio','Riapri due cancelli per far tornare il mercato del porto.',['gate_a','gate_b'],45,null,'Il commerciante del porto riapre il banco. Ricorderà chi ha liberato la strada.')],
  people:[
   ['priest','Custode delle reliquie','relic_priestess','Questi orologi sono più vecchi delle condotte. Non appartengono a Elyon.'],
   ['trader','Commerciante del Porto','merchant','Al porto mi hai visto scappare. Qui sto provando a ricominciare.'],
   ['guard','Guardia della porta','gate_guard','Le pattuglie del porto assoldano cacciatori da fuori. Qui la porta resta aperta: per entrare non serve un nome.'],
   ['bell_c','Campanaro cieco','traveling_bard','Io non guardo le lancette: ascolto il bronzo. Quando la tredicesima ora batte, l’aria cambia peso.']
  ],
  secret:'Dietro il quadrante: un orologio spezzato inciso nella pietra.',epilogue:'Cathedral Market riapre. Le persone decidono insieme gli orari della corrente.'},
 toxic:{name:'Toxic Slum Bazaar',layout:'toxic',district:2,color:'#b7c56b',pov:'nox',services:['smith','alchemist','shop','info'],
  intro:['L’acqua corre in tubi montati a mano. Nessun cavo raggiunge Elyon.','Una persona mutata vende filtri. Un’altra ripara una radio. Nessuno aspetta che qualcuno venga a salvarli.'],
  jobs:[hubJob('toxic_water','Ripara le pompe','L’alchimista ti presta una chiave: riattiva tre pompe autonome.',['pump_a','pump_b','pump_c'],55,'toxic','L’acqua riparte senza Elyon. Il fabbro ti consegna un componente isolato.'),hubJob('toxic_route','Traccia la via asciutta','Segna due ponti sicuri per chi non può attraversare l’acqua.',['bridge_a','bridge_b'],50,'toxic','Il mercato apre il percorso. Un secondo componente è pronto in officina.')],
  people:[
   ['mutant','Filtraia','toxic_mutant_zombie','Queste mani le ho ancora. Il filtro l’ho fatto io. Vuoi vedere come?'],
   ['scout','Informatore','masked_informant','L’Archivio legge chi lo attraversa. Isola il tuo impianto prima di entrare.'],
   ['radio_t','Riparatrice di radio','mechanic','Con due valvole vecchie e un filo di rame prendiamo le voci di tutta Vanta senza passare dai ripetitori.'],
   ['kid_t','Ragazzo dei canali','scavenger_kid','Sotto le passerelle conosco ogni sasso asciutto. I droni pesano troppo e affondano nel fango!']
  ],
  secret:'Una stanza di manutenzione trasformata in cucina comune. Il suo interruttore non è collegato a Elyon.',epilogue:'Il Bazaar commercia apertamente. Le pompe restano di chi le mantiene.'},
 clockwork:{name:'Clockwork Outpost',layout:'clockwork',district:3,color:'#bba1ed',pov:'nox',services:['smith','shop','relic','info'],
  intro:['Un automa ripara un altro automa con un ingranaggio impossibile.','Gli orologi non seguono la stessa ora. Le loro fondamenta sono precedenti a Elyon.'],
  jobs:[hubJob('clockwork_links','Ripara i collegamenti','La meccanica prepara un innesto. Riallinea tre distributori.',['link_a','link_b','link_c'],60,'clockwork','I collegamenti tornano attivi. Un componente schermato è pronto.'),hubJob('clockwork_shelter','Apri una via di fuga','Sblocca due passerelle laterali prima di salire all’Asse.',['walk_a','walk_b'],55,'clockwork','La via di fuga è pronta. La meccanica ti offre un secondo componente.')],
  people:[
   ['mechanic','Meccanica','mechanic','Ieri ho visto due uomini cadere dal cielo. Uno conosceva i colpi prima che arrivassero.'],
   ['merchant','Mercante','merchant','L’altro aveva un’arma rumorosa. E una lama che girava. Mai visto niente del genere a Vanta.'],
   ['clock_w','Orologiaia dell’avamposto','relic_priestess','Ogni pendolo qui oscilla col battito di chi l’ha caricato. Le macchine ricordano chi le tratta con rispetto.'],
   ['sentry_w','Vedetta del ponte','gate_guard','Da questo parapetto si vede l’ombra dell’Asse. Quando le nuvole si aprono, sembra una spada piantata nel cielo.']
  ],
  secret:'Dietro una ruota ferma, lo stesso simbolo di orologio spezzato.',epilogue:'Gli automi riparano i collegamenti. Nessuna voce assegna loro un padrone.'},
 ash_docks:{name:'Banchina di Cenere',layout:'ash_docks',district:0,color:'#58d9ff',pov:'nox',services:['inn','smith','shop'],
  intro:['Tra i container salmastri i meccanici di Veyra scaldano i motori attorno ai bidoni accesi.','Qui nessuno chiede da dove vieni: conta solo se tieni la corsia quando cade la nebbia.'],
  jobs:[hubJob('ash_cranes','Sblocca gli argani','Kael vuole liberare tre carrucole bloccate dalla salsedine.',['crane_a','crane_b','crane_c'],45,null,'Le gru tornano a girare sopra i moli. Gli scaricatori ti aprono la scorciatoia.'),hubJob('ash_lights','Accendi le boe','Riattiva due fari di corsia lungo il canale delle chiatte.',['buoy_a','buoy_b'],40,null,'Il canale brilla nel buio. Le barche rientrano senza urtare le secche.')],
  people:[
   ['racer','Meccanico di pista','mechanic','Veyra ha regolato i freni al millimetro. Dice che finalmente ha trovato qualcuno che non frena in curva.'],
   ['docker','Scaricatore','civilian','Quando il Cantiere è andato al buio, abbiamo tenuto accesi i generatori a gasolio per tutta la banchina.'],
   ['navigator_a','Pilota di chiatte','merchant','Conosco le secche di cenere a memoria. Dove i radar di Elyon vedono muro, io vedo un canale largo dieci metri.'],
   ['kid_a','Vedetta delle gru','scavenger_kid','Dalla cima della gru numero quattro si vedono le scintille delle corse prima ancora di sentire i motori!']
  ],
  secret:'Sotto una tela cerata: una targa di cantiere limata via per non farla leggere a Elyon.',epilogue:'Alla Banchina di Cenere le gru lavorano a turno libero e le corse notturne illuminano il molo.'},
 antenna_port:{name:'Borgo delle Antenne',layout:'antenna_port',district:1,color:'#6ec6ff',pov:'lulu',services:['inn','smith','shop'],
  intro:['Le grandi parabole sopra i tetti vibrano a ogni onda che batte contro la diga foranea.','I pescatori appendono reti di rame per schermare le case dai segnali della Breccia.'],
  jobs:[hubJob('antenna_cables','Tendi i tiranti','Il fabbro del molo cerca tre giunti controvento allentati dalla tempesta.',['cable_a','cable_b','cable_c'],45,null,'I tiranti cantano col vento ma non cedono. Il borgo dorme senza tremare.'),hubJob('antenna_beacons','Orienta gli specchi','Allinea due riflettori costieri verso la diga esterna.',['mirror_a','mirror_b'],45,null,'La luce taglia la foschia. Le vedette distinguono le barche dalle creature.')],
  people:[
   ['watcher','Vedetta del molo','gate_guard','Prima che si aprisse la Breccia, le antenne ricevevano un battito regolare: due colpi e una pausa.'],
   ['fisher','Rammendatrice','civilian','Cuciamo fili d’ottone nelle vele. Confondono i droni e tengono calde le mani.'],
   ['telegraph_p','Telegrafista del faro','masked_informant','Trasmetto bollettini meteo usando il vecchio codice navale. Per Elyon è solo rumore di pioggia.'],
   ['harper_p','Suonatore di banchina','traveling_bard','Ho accordato le corde della chitarra sulla frequenza del faro grande: quando si spegne, la nota cala.']
  ],
  secret:'Una bussola marina il cui ago punta fisso verso il Nodo Centrale invece che a nord.',epilogue:'Il Borgo delle Antenne trasmette bollettini del mare aperto a chiunque navighi fuori portata.'},
 clinic_ward:{name:'Chiostro Clinico',layout:'clinic_ward',district:2,color:'#b8f27c',pov:'lulu',services:['inn','alchemist','shop'],
  intro:['Sotto il portico di vetro i volontari bollono garze e distribuiscono maschere pulite.','Ogni finestra porta un nastro verde per dire a chi passa fuori che dentro l’aria è sicura.'],
  jobs:[hubJob('clinic_filters','Cambia le cartucce','L’erborista ti affida tre filtri a carbone per le bocchette del cortile.',['cart_a','cart_b','cart_c'],50,null,'L’aria nel chiostro torna leggera. I pazienti tolgono le maschere per respirare.'),hubJob('clinic_beds','Apri il padiglione','Sblocca due paratie interne per accogliere le famiglie delle corsie chiuse.',['ward_a','ward_b'],45,null,'Il padiglione si riempie di voci. Nessuno resta chiuso oltre le grate.')],
  people:[
   ['nurse','Infermiera di turno','potion_alchemist','Lulù ha firmato dove i primari sono scappati. Qui nessuno dimentica quei diciannove nomi.'],
   ['child_c','Ragazzo convalescente','scavenger_kid','Dalla finestra ho visto i convogli partire. Quando guarisco voglio guidarne uno anch’io.'],
   ['surgeon_c','Medico fuori ruolo','civilian','Mi hanno tolto il camice perché curavo chi non aveva credito. Qui nel chiostro il camice non serve.'],
   ['porter_c','Barelliere del portico','gate_guard','Abbiamo portato fuori i letti uno a uno mentre i filtri tremavano. Nessuno è rimasto indietro.']
  ],
  secret:'Un quaderno di turno con diciannove righe scritte a mano: accanto a ognuna c’è scritto «respira».',epilogue:'Il Chiostro Clinico resta aperto giorno e notte, gestito da chi è rimasto durante il contagio.'},
 node_commons:{name:'Anello del Nodo',layout:'node_commons',district:3,color:'#d395ff',pov:'nox',services:['smith','relic','info'],
  intro:['Nelle gallerie anulari intorno al Nodo, i tecnici dissidenti hanno staccato i terminali dalla rete centrale.','Qui il ronzio dell’Ora Zero arriva attutito da pareti di piombo e vecchi nastri magnetici.'],
  jobs:[hubJob('node_seals','Isola le paratie','Schiaccia tre valvole di telemetria perché Elyon non veda chi abita nell’anello.',['seal_a','seal_b','seal_c'],50,null,'I monitor diventano neri. L’intero settore sparisce dalle mappe del Custode.'),hubJob('node_plates','Recupera le piastre','Raccogli due memorie di rame cadute nei condotti di raffreddamento.',['plate_a','plate_b'],50,null,'L’archivista legge i registri: le serie EVE avevano un nome prima del numero.')],
  people:[
   ['tech','Tecnico dissidente','masked_informant','Ho lavorato tre anni sotto il Nodo. Quando ho scoperto cosa cancellavano, ho spento la mia console.'],
   ['keeper_n','Archivista dell’anello','relic_priestess','Conserviamo su lastra ciò che Elyon riscrive in digitale. La pietra non accetta aggiornamenti.'],
   ['welder_n','Saldatrice dei pozzi','mechanic','I cavi madri passano sotto i nostri piedi. Basta una pinza isolata per far capire al Nodo chi comanda.'],
   ['cook_n','Cuoco del terzo turno','innkeeper','Scaldo le razioni sul coperchio delle turbine. Non sarà alta cucina, ma sa di casa.']
  ],
  secret:'Una piastra di collaudo con inciso «SERIE 47 · RIFIUTO DELL’ORDINE AUTOMATICO».',epilogue:'L’Anello del Nodo custodisce la memoria storica della città senza filtri né censure.'},
 chalk_harbor:{name:'Molo dei Segni',layout:'chalk_harbor',district:1,color:'#f8d9a0',pov:'lulu',services:['inn','shop','info'],
  intro:['Sui muri umidi del molo, due tratti di gesso bianco indicano i pontili che reggono il peso.','Le portatrici d’acqua si passano le taniche cantando il ritmo dei gradini.'],
  jobs:[hubJob('chalk_cisterns','Riempi le cisterne','Apri tre condotte d’acqua dolce lungo il camminamento riparato.',['cist_a','cist_b','cist_c'],45,null,'Le cisterne traboccano d’acqua pulita. Le file ai secchi finiscono prima di sera.'),hubJob('chalk_steps','Rinforza le rampe','Fissa due passerelle inclinate per i carrelli e per chi non può fare le scale.',['ramp_a','ramp_b'],45,null,'I carrelli salgono senza scosse. Gli anziani attraversano il molo da soli.')],
  people:[
   ['carrier','Portatrice d’acqua','civilian','Quel segno col gesso l’hai lasciato tu, vero? Adesso lo disegniamo su ogni porta sicura.'],
   ['bard_c','Cantastorie del molo','traveling_bard','Canto le strade che cambiano. Quando la gente si fida di un segno, la città è già metà libera.'],
   ['mason_c','Scalpellino del sale','blacksmith','Incido frecce nella pietra dove il gesso potrebbe lavarsi con la pioggia. La rotta deve restare.'],
   ['girl_c','Staffetta delle cisterne','scavenger_kid','Porto il gesso nelle tasche! Se una pattuglia chiude un vicolo, ne segniamo subito un altro.']
  ],
  secret:'Una scatola di latta piena di gessetti bianchi asciutti, lasciata sotto l’arco per chi passa.',epilogue:'Al Molo dei Segni l’acqua arriva in ogni casa lungo la rotta tracciata col gesso.'},
 lower_hearth:{name:'Focolare Basso',layout:'lower_hearth',district:3,color:'#ff7a6a',pov:'nox',services:['inn','smith','alchemist'],
  intro:['Vicino alle grandi tubature geotermiche, chi vive nei livelli bassi ha costruito case tiepide col metallo di scarto.','Il vapore sale lento tra i panni stesi e le lampade ad arco riparate a mano.'],
  jobs:[hubJob('lower_valves','Bilancia il vapore','Regola tre sfiatatoi per mandare il calore verso i dormitori comuni.',['vent_a','vent_b','vent_c'],50,null,'Un tepore costante riempie le stanze. Nessuno batte più i denti nel sonno.'),hubJob('lower_lamps','Alimenta i bracieri','Collega due bobine termiche ai lampioni della piazza.',['braz_a','braz_b'],45,null,'I lampioni si accendono di rosso caldo. Anche il fondo della città ha il suo sole.')],
  people:[
   ['miner','Fuochista dei condotti','blacksmith','Quando hai aperto le valvole là sotto, ci hai ridato l’inverno mite. Qui giù il freddo mordeva il ferro.'],
   ['healer_l','Speziale del vapore','potion_alchemist','Uso la condensa calda per distillare sciroppi. Chi scende qui trova sempre una tazza fumante.'],
   ['unit_friend','Meccanico dell’Unità 9','mechanic','Quel grosso automa si è fermato ad reggere la trave del nostro tetto. Gli abbiamo dipinto un sole sulla spalla.'],
   ['weaver_l','Tessitrice termica','civilian','Intreccio fibre di vetro recuperate dai tubi. Tengon caldo più della lana e non bruciano mai.']
  ],
  secret:'Un lampione numerato «09» con i fili intrecciati a regola d’arte da mani meccaniche.',epilogue:'Il Focolare Basso scalda i quartieri inferiori dividendo il vapore in parti uguali.'},
 glass_terrace:{name:'Terrazze di Vetro',layout:'glass_terrace',district:1,color:'#7fe8e0',pov:'nox',services:['inn','relic','shop'],
  intro:['Sopra le strade sommerse dalla marea, i tetti delle torri sono uniti da ponti di funi e lastre trasparenti.','L’acqua qui sotto riflette il cielo spezzato come uno specchio liquido.'],
  jobs:[hubJob('glass_mirrors','Pulisci gli eliografi','Libera tre specchi di segnalazione dal sale cristallizzato.',['heli_a','heli_b','heli_c'],55,null,'I raggi rimbalzano da una torre all’altra. I tetti isolati tornano a parlarsi.'),hubJob('glass_boats','Assicura le chiatte','Lega due imbarcazioni di soccorso agli anelli della terrazza.',['boat_a','boat_b'],50,null,'Le chiatte sono pronte. Chi era rimasto sulle torri lontane sbarca in piazza.')],
  people:[
   ['diver','Recuperatore di marea','merchant','Sotto tre metri d’acqua ci sono ancora le vecchie insegne. Ripesco solo ciò che serve ai vivi.'],
   ['seer_g','Osservatrice dei riflessi','relic_priestess','Lo Shadow Reaper mostrava dieci futuri per farti tremare. Tu hai guardato l’unico vero.'],
   ['glass_b','Soffiatore di lenti','blacksmith','Fondo i vetri rotti delle torri per farne fanali. Anche ciò che si spezza può tornare a far luce.'],
   ['rower_g','Traghettatrice delle funi','civilian','Con la mia barca passo tra i campanili sommersi. La gente non ha più paura dell’acqua alta.']
  ],
  secret:'Un prisma di vetro molato che scompone la luce dei fari in due soli colori: ciano e rosa.',epilogue:'Le Terrazze di Vetro uniscono le torri sommerse con una flotta di chiatte libere.'},
 sky_rail:{name:'Scalo Sopraelevato',layout:'sky_rail',district:3,color:'#ffb65c',pov:'lulu',services:['smith','shop','info'],
  intro:['Tra i piloni del binario alto il vento fischia nei cavi d’acciaio mentre i convogli attendono il via libera.','I ferrovieri hanno trasformato i vagoni fermi in officine, cucine e posti di guardia.'],
  jobs:[hubJob('sky_switches','Sblocca gli scambi','Ingrassa tre leve manuali lungo il fascio dei binari esterni.',['sw_a','sw_b','sw_c'],55,null,'Gli scambi scattano con un colpo netto. I binari verso le colline sono aperti.'),hubJob('sky_signals','Alza i semafori','Ripristina due lanterne di via libera in cima al viadotto.',['sig_a','sig_b'],50,null,'Luce verde su tutta la tratta. I macchinisti salutano con due fischi brevi.')],
  people:[
   ['rail','Capostazione Toren','mechanic','Vega teneva questo binario come un fucile puntato. Adesso ci passano i treni degli sfollati.'],
   ['courier','Staffetta del viadotto','masked_informant','Dall’alto vediamo tutta Vanta: dove si accende una luce, sappiamo che siete passati voi.'],
   ['brakeman','Frenatore di coda','gate_guard','Ho sganciato i vagoni di Elyon in corsa perché non portassero via i ragazzi del quartiere.'],
   ['singer_s','Viaggiatrice col violino','traveling_bard','Suono sul tetto del vagone mensa. Il vento porta la melodia giù fino ai cortili del porto.']
  ],
  secret:'Un biglietto ferroviario obliterato due volte, senza destinazione, con scritto sul retro «Andata e ritorno».',epilogue:'Lo Scalo Sopraelevato collega i quattro angoli di Vanta senza dogane né posti di blocco.'},
 deep_archive:{name:'Volta delle Spore',layout:'deep_archive',district:2,color:'#ff6a88',pov:'nox',services:['alchemist','relic','info'],
  intro:['Al confine dell’Archivio EVE, le vecchie camere di quarantena sono fiorite di licheni bioluminescenti innocui.','Chi è sfuggito agli esperimenti vive qui sotto, custodendo i nomi di chi era stato cancellato.'],
  jobs:[hubJob('deep_capsules','Sigilla le vasche','Chiudi tre cilindri di coltura rimasti aperti nel corridoio basso.',['cap_a','cap_b','cap_c'],55,null,'Le spore aggressive si spengono. Resta solo la luce calma dei licheni.'),hubJob('deep_tapes','Salva le bobine','Metti al sicuro due nastri vocali prima che l’umidità li cancelli.',['tape_a','tape_b'],50,null,'Le voci tornano chiare: sono messaggi lasciati da chi ha costruito le prime unità.')],
  people:[
   ['survivor_a','Ex-soggetto d’archivio','toxic_mutant_zombie','Volevano farci credere di essere copie. Ma due copie non hanno paura in modo diverso.'],
   ['scribe_a','Custode delle bobine','relic_priestess','Quando hai tolto le mani a EVE-Prime, il coro nelle pareti ha smesso di gridare.'],
   ['botanist_a','Coltivatore di licheni','potion_alchemist','Queste spore luminose mangiano la ruggine dei server e restituiscono ossigeno pulito.'],
   ['child_a','Bambina dei corridoi','scavenger_kid','Ho disegnato fiori sulle porte blindate! Così nessuno sbaglia più strada nel buio.']
  ],
  secret:'Un cilindro di vetro vuoto con l’etichetta staccata dall’interno a colpi di nocche.',epilogue:'La Volta delle Spore trasforma i laboratori sepolti in un giardino sotterraneo aperto a tutti.'},
 axis_crown:{name:'Atrio della Corona',layout:'axis_crown',district:3,color:'#f6e2a6',pov:'nox',services:['inn','smith','relic'],
  intro:['Sospeso sotto la piattaforma sommitale dell’Asse, l’atrio d’oro antico raccoglie chi è salito fin qui per vedere l’Ora Uno.','Tra le colonne silenziose l’aria profuma di ozono e di pioggia che sta per cominciare.'],
  jobs:[hubJob('crown_anchors','Stabilizza i piloni','Stringi tre morsetti di tenuta perché la terrazza regga l’urto dell’Asse.',['pil_a','pil_b','pil_c'],60,null,'I piloni smettono di vibrare. La piattaforma resta salda sopra le nuvole.'),hubJob('crown_bells','Accorda i diapason','Tocca due risonatori armonici per calmare il campo statico.',['bell_a','bell_b'],55,null,'Un accordo grave attraversa l’atrio. Le scintille si posano come neve.')],
  people:[
   ['warden_c','Guardiano dissidente','gate_guard','Centosettantotto anni a fare la guardia a una voce registrata. Oggi apro io il cancello.'],
   ['bard_a','Cronista dell’Asse','traveling_bard','Qualunque cosa accada là sopra, scriverò che siete saliti in due e per scelta vostra.'],
   ['artificer_c','Artefice delle guglie','mechanic','Ho visto Kairn e Morrow tenere il varco là fuori. Non sapevo che esistessero altri mondi oltre la tempesta.'],
   ['pilgrim_c','Pellegrina delle nuvole','civilian','Sono salita dal livello più basso solo per vedere il sole vero sopra la coltre di fumo.']
  ],
  secret:'Inciso sul parapetto più alto: due iniziali graffiate col metallo accanto a un frammento di vetro.',epilogue:'L’Atrio della Corona diventa un belvedere libero sopra le nuvole di Vanta.'}
};
export const REGION_HUB=Object.freeze({
 'Cantiere Est':'moon','Ash Docks':'ash_docks','Porto delle Antenne':'antenna_port','Cathedral Quarter':'cathedral',
 'Distretto Clinico':'clinic_ward','Nodo Centrale':'node_commons','Porto':'chalk_harbor','Livelli bassi':'lower_hearth',
 'Toxic Slum Bazaar':'toxic','Glass Flood':'glass_terrace','Binario sopraelevato':'sky_rail','Sotto il Distretto Clinico':'deep_archive',
 'Asse orbitale':'clockwork','Piattaforma dell’asse':'axis_crown'
});
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
 clockwork_defense:{name:'Schermo difensivo',part:'clockwork',rank:2,style:'defense',description:'Per l’Asse: scherma l’impianto, +2 salute.'},
 ...Object.fromEntries(Object.entries(MARKET_WEAPONS).map(([id,w])=>[id,{name:w.name,price:w.price,stock:1,slot:'weapon',arsenalId:id,description:w.desc}])),
 ...MARKET_GEAR_ITEMS,
 ...MARKET_TURBO_ITEMS
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
export function newWorld(){return {coins:30,scrap:0,parts:{toxic:0,clockwork:0},inventory:{},equipment:{},stock:{},quests:{},secrets:[],visited:[],rewards:[],preparation:{},hub:null};}
export function validateWorld(w){
 if(!w||!Number.isInteger(w.coins)||w.coins<0||w.coins>100000)return null;
 if(w.scrap!==undefined&&(!Number.isInteger(w.scrap)||w.scrap<0||w.scrap>100000))return null;
 const record=v=>v&&typeof v==='object'&&!Array.isArray(v);
 if(![w.parts,w.inventory,w.equipment,w.stock,w.quests,w.preparation].every(record))return null;
 if(!['toxic','clockwork'].every(k=>Number.isInteger(w.parts[k])&&w.parts[k]>=0&&w.parts[k]<=2))return null;
 if(![w.secrets,w.visited,w.rewards].every(a=>Array.isArray(a)&&a.every(v=>typeof v==='string'&&v.length<80)&&new Set(a).size===a.length))return null;
 if(w.visited.some(id=>!HUBS[id]))return null;
 if(Object.entries(w.inventory).some(([id,n])=>!HUB_ITEMS[id]||!Number.isInteger(n)||n<0||n>100))return null;
 if(Object.entries(w.equipment).some(([slot,id])=>!['weapon','armor','relic','turbo'].includes(slot)||(slot==='turbo'?(id!=='turbo_mk1'&&!MARKET_TURBO_ITEMS[id]):(!w.inventory[id]||HUB_ITEMS[id]?.slot!==slot))))return null;
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
const LULU_SPLIT_HUBS=new Set(['moon','cathedral','antenna_port','clinic_ward','chalk_harbor','sky_rail']);
export function availableHubs(p,pov='nox'){
 const w=p.world;if(!w)return [];const split=p.narrative.flags.separated&&!p.narrative.flags.reunited&&!p.narrative.flags.story_complete;
 return w.visited.filter(id=>!split||(pov==='lulu'?LULU_SPLIT_HUBS.has(id):!LULU_SPLIT_HUBS.has(id)));
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
export function hubReputation(p,hubId){const jobs=HUBS[hubId]?.jobs||[];return jobs.filter(j=>p?.world?.quests?.[j.id]?.status==='complete').length;}
export function hubDiscount(p,hubId){return Math.min(.2,hubReputation(p,hubId)*.1);}
export function itemPrice(p,hubId,itemId){const item=HUB_ITEMS[itemId];if(!item||item.part)return 0;return Math.max(1,Math.round(item.price*(1-hubDiscount(p,hubId))));}
export function hubCatalog(id,service){return [...(REGION_CATALOG[id]?.[service]||[])];}
export function buyHubItem(p,hubId,service,itemId){
 const w=p.world,item=HUB_ITEMS[itemId];if(!item||!w.visited.includes(hubId)||!HUBS[hubId].services.includes(service)||!hubCatalog(hubId,service).includes(itemId))return {ok:false,reason:'Non disponibile qui.'};
 if(item.part){if(w.preparation[item.part])return {ok:false,reason:'Preparazione già installata.'};if(w.parts[item.part]<1)return {ok:false,reason:'Completa un incarico locale per ottenere il componente.'};w.parts[item.part]--;w.preparation[item.part]=item.style;}
 else{const key=hubId+':'+itemId,price=itemPrice(p,hubId,itemId);if((w.stock[key]||0)>=item.stock)return {ok:false,reason:'Scorta esaurita.'};if(!item.consumable&&itemId!=='intel'&&w.inventory[itemId])return {ok:false,reason:'Già nel bagaglio.'};if(w.coins<price)return {ok:false,reason:'Monete insufficienti. Gli incarichi indicano la ricompensa.'};w.coins-=price;w.stock[key]=(w.stock[key]||0)+1;w.inventory[itemId]=(w.inventory[itemId]||0)+1;if(item.slot)w.equipment[item.slot]=itemId;}
 if(itemId==='glass_bead')p.narrative.flags.useless_bought=true;
 if(itemId==='intel'&&!w.secrets.includes(hubId+':map'))w.secrets.push(hubId+':map');
 return {ok:true,price:item.part?0:itemPrice(p,hubId,itemId)};
}
export function sellHubItem(p,itemId){
 const w=p?.world,item=HUB_ITEMS[itemId];if(!w||!item||item.part||!item.price||!(w.inventory[itemId]>0))return {ok:false,reason:'Oggetto non vendibile.'};
 const coins=Math.max(1,Math.round(item.price*.6));w.inventory[itemId]--;if(w.inventory[itemId]===0){delete w.inventory[itemId];if(item.slot&&w.equipment[item.slot]===itemId)delete w.equipment[item.slot];}
 w.coins=Math.min(100000,w.coins+coins);return {ok:true,coins};
}
export function exchangeScrap(p,amount=null){
 const w=p?.world;if(!w)return {ok:false,reason:'Nessun rottame da scambiare.'};
 const have=w.scrap||0,take=amount==null?have:Math.min(have,Math.floor(amount));if(take<1)return {ok:false,reason:'Nessun rottame da scambiare.'};
 const coins=Math.max(1,Math.floor(take*1.2));w.scrap=have-take;w.coins=Math.min(100000,w.coins+coins);return {ok:true,spent:take,coins};
}
export function claimCombatLoot(p,s){
 if(!p?.world||!s)return {coins:0,scrap:0};
 const coins=Math.max(0,s.bountyCoins|0),scrap=Math.max(0,s.bountyScrap|0);
 if(coins)p.world.coins=Math.min(100000,p.world.coins+coins);if(scrap)p.world.scrap=Math.min(100000,(p.world.scrap||0)+scrap);return {coins,scrap};
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
 const copy={...c};let hp=0,damage=0,haste=0,magicHaste=0,movePower=0,nodeHeal=0,magBonus=0;
 for(const id of Object.values(p.world.equipment)){const item=HUB_ITEMS[id];if(!item)continue;hp+=item.hp||0;damage+=item.damage||0;haste+=item.haste||0;magicHaste+=item.magicHaste||0;movePower+=item.movePower||0;nodeHeal+=item.nodeHeal||0;magBonus+=item.magBonus||0;copy.cooldown+=item.slow||0;if(item.slot==='weapon'){copy.weapon=item.name;if(item.arsenalId)copy.equippedWeapon=item.arsenalId;}if(item.resonance)copy.resonanceBonus=1;}
 const market=Object.keys(p.world.inventory).filter(id=>p.world.inventory[id]>0&&HUB_ITEMS[id]?.arsenalId);
 if(market.length)copy.marketWeapons=market;if(haste)copy.cooldown=Math.max(.14,copy.cooldown-haste);
 if(magicHaste)copy.magicHaste=magicHaste;if(movePower)copy.movePower=movePower;if(nodeHeal)copy.nodeHeal=nodeHeal;if(magBonus)copy.magBonus=magBonus;
 for(const style of (c.pov==='nox'?Object.values(p.world.preparation):[])){if(style==='attack')damage++;else hp+=2;}
 copy.hpBonus=(copy.hpBonus||0)+hp;copy.damage+=damage;return copy;
}
export function rewardMission(p,id){if(p.world.rewards.includes(id))return false;p.world.rewards.push(id);p.world.coins+=20;return true;}
