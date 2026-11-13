// Interior scenes for hub services and people (V10.3, M-I1). Pure data and rules: no DOM.
// Painted art is optional: until a file is listed in INTERIOR_ART the runtime uses the
// blurred hub and the NPC sprite enlarged, so no request ever 404s.
import {HUBS} from './hubs.mjs';

const I=(place,npc,job,greet,before,apart,after,lore)=>({place,npc,job,greet,ask:{before,apart,after},lore});
export const INTERIORS={
 moon:{
  inn:I('Locanda della Luna','Locandiere','moon_lamps','Entra, entra. Qui il buio resta fuori dalla porta.',
   'Mira conta le lampade ogni sera. Se ne manca una, non dorme.',
   'Oggi entri senza nessuno al fianco. La tazza in più la lascio lo stesso.',
   'Due tazze di nuovo. Lo sapevo che sarebbe tornata la normalità.',
   'La locanda era una stazione di ricarica. Le prese ci sono ancora, sotto la vernice.'),
  smith:I('Officina di Dario','Dario','moon_roof','Attento al banco: è caldo. Come sempre.',
   'La Vortex regge, ma ogni curva la sento io nelle ossa. Trattala bene.',
   'Ripari tutto da solo adesso? Allora impara a chiedere gli attrezzi.',
   'Il motore ha un suono nuovo. Più tranquillo. Come voi due.',
   'Questa chiave l’ho fatta con un pezzo di relè di Elyon. Funziona meglio dell’originale.'),
  shop:I('Banco del rifugio','Commerciante','','Prezzi giusti, merce asciutta. Guarda pure.',
   'Le batterie arrivano dal porto. Quando il porto si ferma, mi fermo anch’io.',
   'Si vende poco in questi giorni. La gente compra solo quello che serve per restare.',
   'Ho rimesso la vetrina. Non la mettevo da prima del Blackout.',
   'Questo banco è fatto con le porte del vecchio ascensore. Non chiedermi come le ho portate giù.')},
 cathedral:{
  smith:I('Forgia del Chiostro','Fabbro','','La pietra qui tiene il calore. Si lavora bene.',
   'Gli ingranaggi dei quadranti non sono di Elyon. Non li ha fatti nessuno che conosco.',
   'Una mano sola sul manubrio, eh? Ti preparo qualcosa che regge l’urto.',
   'Avete riportato la luce in tutte e due le navate. Si sente nel metallo.',
   'Il bronzo delle campane suona anche quando nessuno lo tocca. Lo ignoro e lavoro.'),
  relic:I('Sacrestia delle reliquie','Custode delle reliquie','cathedral_clocks','Parla piano. Gli orologi ascoltano.',
   'Tre quadranti, tre ore diverse. Uno di loro dice la verità.',
   'Chi firma per salvare gli altri porta un peso che non si vede. Lo riconosco negli occhi.',
   'I quadranti hanno smesso di litigare. Per ora.',
   'Sotto l’altare c’è un orologio spezzato inciso nella pietra. È più vecchio della cattedrale.'),
  shop:I('Mercato coperto','Commerciante del Porto','cathedral_route','Eccoti al banco nuovo. Quello vecchio è rimasto al porto.',
   'Se riapri i cancelli, il mercato torna. E io smetto di dormire qui dietro.',
   'La gente chiede di voi. Rispondo che ognuno fa la sua strada.',
   'Il porto mi ha richiamato. Ho detto di aspettare: qui ho clienti fedeli.',
   'Al porto ho visto la Vortex passare senza fermarsi. Pensavo fosse un sogno.'),
  info:I('Stanza delle voci','Informatore','','Siediti. Qui si paga con le domande giuste.',
   'Elyon sente tutto quello che passa nei cavi. Qui non ci sono cavi.',
   'Una firma, diciannove persone salve. In città nessuno sa se ringraziare o avere paura.',
   'Il segnale di Elyon è più debole da quando siete tornati insieme. Coincidenze.',
   'Questa stanza era un confessionale. Le voci restano le stesse, cambiano solo i peccati.')},
 toxic:{
  smith:I('Officina dei tubi','Fabbro','','Qui si salda con quello che l’acqua lascia.',
   'Niente cavi di Elyon in questo quartiere. Solo mani e pazienza.',
   'Non è un buon posto per stare da soli. Ma lavori bene, te lo concedo.',
   'L’acqua scorre pulita fino al ponte. Prima non arrivava a metà.',
   'Ogni tubo porta il nome di chi l’ha montato. Il mio è quello che perde.'),
  alchemist:I('Laboratorio dell’alchimista','Alchimista','toxic_water','Non toccare le fiale verdi. Le altre puoi annusarle.',
   'Le pompe autonome tengono vivo il quartiere. Se una si ferma, si ferma un pezzo di noi.',
   'Ho un filtro per il corpo. Per il resto devi trovarlo da te.',
   'Sorridete di più tutti e due. Fa bene ai polmoni, l’ho misurato.',
   'Queste ricette erano di mia madre. Lei le scriveva sul retro dei moduli di Elyon.'),
  shop:I('Bazar dei filtri','Commerciante','','Filtri, guarnizioni, fortuna in bottiglia. L’ultima non funziona.',
   'Chi arriva qui ha perso qualcosa. Io vendo quello che aiuta a restare.',
   'Ti vedo passare spesso, sempre senza nessuno. Ti faccio lo sconto dei solitari.',
   'Due clienti invece di uno. Il bazar ringrazia.',
   'Questa radio ripara le altre radio. Non chiedermi chi ha riparato lei.'),
  info:I('Retro del bazar','Informatore','toxic_route','Parla basso. Anche l’acqua porta le voci.',
   'L’Archivio legge chi lo attraversa. Isola il tuo impianto prima di entrare.',
   'Elyon cerca la firma EVE-47. Ogni giorno un po’ più vicino.',
   'Da quando siete insieme, Elyon sbaglia le previsioni. Mi piace.',
   'I ponti asciutti li ho segnati io. Chi non può attraversare l’acqua merita una strada.')},
 clockwork:{
  smith:I('Fonderia degli ingranaggi','Fabbro','','Mani lontane dai denti. Gli ingranaggi non perdonano.',
   'Questi pezzi non seguono le misure di Elyon. Seguono qualcosa di più vecchio.',
   'Lavori come chi ha qualcosa da dimostrare. Va bene, ma bevi acqua.',
   'Il ritmo delle macchine è cambiato. Più regolare. Non so perché.',
   'Ho fuso un ingranaggio impossibile. Gira in entrambi i sensi. Lo tengo per ricordo.'),
  shop:I('Magazzino dell’Asse','Mercante','','Ricambi, molle, orologi che non segnano l’ora. Scegli.',
   'Qui ogni cosa ha due prezzi: quello giusto e quello di Elyon.',
   'Gli stranieri caduti dal cielo hanno comprato tutto il mio olio. Poi sono spariti.',
   'Siete tornati insieme. Allora metto da parte le molle buone.',
   'Questa molla l’ho trovata dentro un automa spento. Era ancora carica.'),
  relic:I('Camera delle fondamenta','Custode','clockwork_links','Le fondamenta sono più vecchie della città. Cammina piano.',
   'Gli orologi non seguono la stessa ora. Uno di loro aspetta qualcuno.',
   'Il tempo qui si allunga per chi è solo. Non lasciarti fermare.',
   'Gli orologi segnano finalmente la stessa ora. È la prima volta da quando ci sono io.',
   'Su questa pietra c’è lo stesso orologio spezzato della cattedrale. Qualcuno è passato prima di Elyon.'),
  info:I('Torre delle molle','Informatore','clockwork_shelter','Abbassa la testa: la trave è bassa e le notizie pesano.',
   'Dicono che l’Asse si apra solo per chi conosce l’ora giusta. Nessuno la conosce.',
   'Le passerelle laterali portano fuori. Nessuno dovrebbe restare chiuso qui dentro.',
   'La meccanica ha rifatto l’innesto della Vortex. Adesso il sedile in più non scricchiola.',
   'Gli automi si riparano da soli. Io controllo che non diventino troppo bravi.')},
 ash_docks:{
  inn:I('Mensa del Molo','Locandiere','ash_lights','Siediti vicino alla stufa: il vento del bacino taglia la pelle.',
   'Le lanterne sul pontile tengono lontani i droni ciechi. Se si spengono, chiudiamo le paratie.',
   'Una panca vuota accanto a te? Ti tengo il brodo caldo finché non tornate in due.',
   'Il pontile brilla tutto. Non vedevo tante barche rientrare insieme da anni.',
   'Sotto queste assi c’è ancora l’acqua salata del primo scavo.'),
  smith:I('Officina delle Gru','Fabbro','ash_cranes','Occhio alle catene: qui si raddrizzano ganci da tre tonnellate.',
   'Gli argani del bacino sono bloccati dalla ruggine. Senza gru, il molo muore.',
   'Viaggi leggero ma colpisci duro. Ti tempero la lama con l’olio delle turbine.',
   'Avete rimesso in moto l’intero scalo. Il metallo canta quando lavorate insieme.',
   'Questi bulloni portano il marchio della vecchia compagnia portuale, prima di Elyon.'),
  shop:I('Emporio della Chiatta','Commerciante',null,'Merce recuperata dai fondali, asciugata e garantita.',
   'Chi scende nei condotti compra corde e batterie. Chi torna vivo compra da bere.',
   'Fai scorta prima di scendere: là sotto nessuno ti farà credito.',
   'Da quando il molo è sicuro, arrivano carichi anche dai canali esterni.',
   'Questa bussola punta sempre verso l’Asse, non verso il nord.')},
 antenna_port:{
  inn:I('Cabina d’Ascolto','Locandiere','antenna_beacons','Metti le cuffie. Quello che senti non è vento, è traffico cifrato.',
   'I fari costieri battono un codice antico. Ricalibrali e vedrai cosa nasconde la nebbia.',
   'Ho intercettato il nome EVE-47 su tre canali diversi. Qualcuno ha firmato col proprio sangue.',
   'I vostri due segnali viaggiano in fase perfetta. Elyon non riesce più a separarli.',
   'Le antenne non sono state costruite per parlare con la città, ma con qualcosa là fuori.'),
  smith:I('Officina del Traliccio','Fabbro','antenna_cables','Le scintille qui non vengono dalla forgia, ma dalle antenne sopra il tetto.',
   'I condensatori sui tetti stanno cedendo. Se saltano, perdiamo la finestra sul porto.',
   'Da solo contro i ricevitori di Elyon? Ti servo una schermatura doppia.',
   'I tralicci cantano pulito adesso. Nessun ronzio di fondo.',
   'Costruivo parabole per le navi d’alta quota. Ora le uso per ascoltare chi mente.'),
  shop:I('Banco delle Onde','Commerciante',null,'Valvole, cavi schermati e viveri da banchina. Scegli in fretta.',
   'Il mare porta relitti, il cielo porta segnali. Io vendo tutto quello che resta in mezzo.',
   'Le pattuglie cercano due ombre, ma oggi ne vedo una sola. Tieni il profilo basso.',
   'Il mercato delle frequenze è tornato libero. Persino i pescherecci trasmettono musica.',
   'Dentro questa radio c’è registrata la prima trasmissione di Vanta.')},
 clinic_ward:{
  inn:I('Cappella dell’Anamnesi','Locandiere','clinic_beds','Ogni piastrina appesa qui apparteneva a qualcuno che Elyon voleva dimenticare.',
   'Nelle corsie chiuse sono rimaste delle piastrine d’argento. Riportamele, ti prego.',
   'Chi rinuncia a se stesso per proteggere un altro lascia un’eco che nessuna macchina cancella.',
   'Siete entrambi qui. Allora il registro dei dispersi oggi perde due righe.',
   'La prima paziente del distretto portava il numero zero. Il suo letto non è mai stato rifatto.'),
  alchemist:I('Spezieria Bianca','Alchimista','clinic_filters','Camice pulito e mani ferme. Dimmi dove fa male.',
   'I distillatori nei sotterranei sono rimasti accesi. Ho bisogno di quei sieri puri.',
   'Il tuo battito è accelerato. Non puoi portare il peso di due vite senza riposare.',
   'L’aria del chiostro sa di menta e ozono. Avete guarito anche questo quartiere.',
   'Sulle vecchie cartelle cliniche non ci sono nomi, solo orari di nascita.'),
  shop:I('Dispensa del Chiostro','Commerciante',null,'Bende sterili, filtri respiratori e razioni ad alta resa.',
   'I medici di Elyon curavano solo chi serviva al turno successivo. Qui curiamo tutti.',
   'Prendi una dose in più. Chi cammina da solo non ha chi lo rialza.',
   'Le corsie stanno diventando appartamenti. La gente vuole vivere qui, non solo sopravvivere.',
   'Questo armadietto aveva il sigillo del primario. L’abbiamo aperto con un piede di porco.')},
 node_commons:{
  smith:I('Officina del Condotto','Fabbro','node_seals','Guanti isolanti obbligatori. Qui si lavora col rame vivo.',
   'I sezionatori di Elyon ci rubano metà della potenza. Sganciali e avremo corrente vera.',
   'Un impianto sotto sforzo scalda il doppio. Lascia che ti rinforzi le giunture.',
   'Con voi due in giro, i droni di manutenzione non osano più scendere nei pozzi.',
   'Ho inciso il nostro simbolo su ogni trasformatore. Così sanno di chi è la luce.'),
  relic:I('Sala delle Turbine','Custode delle reliquie','node_plates','Qui il pavimento trema sempre, ma il caffè non si rovescia mai.',
   'Se apriamo gli sfiati secondari, avremo acqua calda per tutte le famiglie del blocco.',
   'Hai lo sguardo di chi ha visto il centro della rete. Siediti prima di crollare.',
   'Sentite questo ronzio? È il Nodo che lavora per noi, non il contrario.',
   'Il bancone è ricavato dal coperchio di un reattore di prima generazione.'),
  info:I('Archivio dei Turni','Informatore',null,'Io non guardo le telecamere: guardo i consumi elettrici. Non mentono mai.',
   'Quando il Custode è caduto, tre sottostazioni hanno cambiato frequenza da sole.',
   'Metà della rete cerca una ragazza, l’altra metà teme un ragazzo. Bel lavoro.',
   'Il registro centrale ha smesso di calcolare le probabilità. Siete fuori scala.',
   'Sotto il Nodo c’è una mappa di Vanta disegnata prima che nascesse il primo cittadino.')},
 chalk_harbor:{
  inn:I('Locanda della Scogliera','Locandiere','chalk_cisterns','Togli il gesso dagli stivali prima di entrare, il resto è offerto.',
   'I teli frangivento sulle terrazze si stanno strappando. Senza, la polvere ci seppellirà.',
   'Il mare bianco fa sembrare tutto più lontano. Ma chi aspetti sa dove trovarti.',
   'Avete portato il sereno fin sulla falesia. Stasera si mangia pesce fresco.',
   'Quando la marea scende del tutto, si vedono i tetti di un quartiere ancora più antico.'),
  shop:I('Mercato del Sale','Commerciante',null,'Cristalli puri, corde catramate e lampade a olio di scoglio.',
   'Saliamo e scendiamo con le ceste ogni ora. Le gambe fanno male, ma siamo liberi.',
   'Ti do una bussola a peso: funziona anche dove i campi magnetici impazziscono.',
   'I mercanti della cattedrale sono scesi fino a qui per comprare il nostro sale.',
   'Dentro questi blocchi di gesso a volte troviamo monete che nessuno sa leggere.'),
  info:I('Cantiere delle Chiglie','Informatore','chalk_steps','Il sale mangia il ferro, ma quello che forgio io mangia il sale.',
   'Le chiuse salmastre sono incrostate. Spacca i blocchi di cristallo e l’acqua tornerà a girare.',
   'Braccio teso e passo corto: combatti come chi non può permettersi un errore.',
   'La Vortex ha tenuto il sale e la pietra. Merita una lucidatura da ammiraglia.',
   'Usiamo ossa di cetaceo fossile per temprare l’acciaio. Vecchia ricetta dei cantieri.')},
 lower_hearth:{
  inn:I('Mensa della Brace','Locandiere','lower_valves','Prendi una scodella. Finché la caldaia brucia, nessuno resta a stomaco vuoto.',
   'I condotti della fuliggine sono saturi. Se li liberi, potremo scaldare anche il livello superiore.',
   'Chi divide il pane quando ha fame non resta mai davvero solo. Ricordatelo.',
   'C’è posto per tutti e due vicino al fuoco grande. È festa in tutta la galleria.',
   'La prima scintilla di questa fornace fu accesa con una batteria della vecchia guardia.'),
  smith:I('Fucina del Maglio','Fabbro','lower_lamps','Qui non usiamo mantici: usiamo il fiato della terra.',
   'Due tubazioni madri stanno perdendo pressione. Stringi le flange prima che il freddo entri.',
   'Ti ho visto tenere la linea là fuori. Questo acciaio è duro quanto la tua testa.',
   'Due cuori battono meglio di uno, specie quando intorno tutto trema.',
   'Il maglio centrale batte sessanta colpi al minuto. È il polso della città bassa.'),
  alchemist:I('Distilleria Termica','Alchimista',null,'Vapore condensato, sali minerali e tonici contro la stanchezza.',
   'L’acqua che sale dalle rocce profonde è sterile ma carica di ferro. Va dosata col contagocce.',
   'Prendi questo decotto: scioglie il gelo dalle dita e tiene sveglia la mente.',
   'Ho creato una miscela nuova per festeggiare. Sa di cannella e libertà.',
   'I funghi che crescono vicino ai tubi caldi assorbono le radiazioni di fondo.')},
 glass_terrace:{
  inn:I('Serra dei Cristalli','Locandiere','glass_mirrors','Cammina tra i vasi con cautela: queste piante respirano luce pura.',
   'Le lenti solari sul tetto sono fuori asse. Raddrizzale e le erbe mediche fioriranno.',
   'Anche un ramo spezzato può fare radici se trova il terreno giusto. Non disperare.',
   'Guarda: le orchidee di vetro si sono aperte tutte insieme. Sentono quando torna l’armonia.',
   'Questi semi provengono dai giardini orbitali, caduti durante il primo inverno.'),
  shop:I('Galleria delle Lenti','Commerciante','glass_boats','Vetri ottici, prismi di ricambio e provviste scelte.',
   'Quando arriva la tempesta d’alta quota, solo le imposte blindate salvano le vetrate.',
   'Un cliente silenzioso oggi. Ti incarto la merce nella seta termica, resiste a tutto.',
   'La luce che entra dalle cupole oggi sembra oro liquido. Prendi quello che vuoi.',
   'Se guardi l’Asse attraverso questo prisma, vedi i cavi che lo tengono legato.'),
  relic:I('Padiglione degli Specchi','Custode delle reliquie',null,'Ogni specchio conserva l’immagine di chi ci si è fermato davanti.',
   'I nobili di Vanta venivano qui per dimenticare la fuliggine. Ora ci abitano i giardinieri.',
   'Nello specchio vedo una figura sola, ma l’ombra dietro di te ha ancora due profili.',
   'Gli specchi non tremano più. La città ha smesso di avere paura del cielo.',
   'Dietro il mosaico centrale c’è inciso il progetto originale della Terrazza.')},
 sky_rail:{
  smith:I('Hangar dei Piloni','Fabbro','sky_switches','Tieniti alla ringhiera! Quando passa un convoglio, l’officina oscilla.',
   'Gli scambi magnetici sulla linea esterna sono bloccati. Sbloccali o i vagoni deraglieranno.',
   'Correre sui binari sospesi richiede fegato. Ti sistemo gli scarponi e il telaio.',
   'I treni viaggiano a pieno carico tra tutti i quartieri. Avete unito la città.',
   'Questa trave d’acciaio è stata saldata in volo da mia nonna.'),
  shop:I('Vagone Dispensa','Commerciante',null,'Tutto quello che serve per un viaggio lungo, stipato in tre metri quadri.',
   'Compro alla stazione bassa e vendo al capolinea. Il segreto è non guardare giù.',
   'Biglietto singolo? Non importa, il ritorno è sempre compreso per chi resiste.',
   'Oggi offro io il rifornimento. La linea del cielo è finalmente nostra.',
   'Il vecchio controllore timbrava i biglietti con un orologio a tredici ore.'),
  info:I('Torre di Scambio','Informatore','sky_signals','Da quassù vedo ogni convoglio di Vanta. Nessuno si muove in segreto.',
   'I freni d’emergenza sui piloni sono sabotati. Riattivali prima dell’ultimo carico.',
   'Un treno blindato è salito verso l’Asse a luci spente. Portava una sola passeggera.',
   'Le rotaie cantano una canzone nuova. Non ci sono più convogli prigione.',
   'I binari non finiscono all’Asse: c’è una rampa che punta dritta verso le nuvole.')},
 deep_archive:{
  alchemist:I('Camera di Decantazione','Alchimista','deep_capsules','Parla piano, le vasche di raffreddamento reagiscono alle vibrazioni della voce.',
   'I pozzi criogenici stanno bollendo. Apri i circuiti freddi o i nastri fonderanno.',
   'La tua mente ha sopportato un’intrusione profonda. Questo tonico pulisce le sinapsi.',
   'Il liquido nelle colonne è diventato limpido come acqua di fonte. È finita.',
   'Usavano il freddo per rallentare i pensieri delle copie. Noi lo usiamo per conservarne la storia.'),
  relic:I('Sala delle Bobine','Custode delle reliquie','deep_tapes','Ogni cilindro di quarzo qui dentro è una vita intera. Non farli cadere.',
   'Tre celle di memoria portano ancora il blocco di Elyon. Spezza i sigilli e restituiscile.',
   'Chi porta il marchio quarantasei e chi porta il quarantasette non erano destinati a incontrarsi.',
   'Le bobine girano libere. Per la prima volta, i ricordi appartengono a chi li ha vissuti.',
   'Nella prima fila ci sono i ricordi dei fondatori. Avevano paura del buio quanto noi.'),
  info:I('Pozzo degli Indici','Informatore',null,'Qui non cerchiamo segreti: cerchiamo le pagine che sono state strappate.',
   'EVE-Prime non era un’arma, era una diga. Qualcuno aveva paura di ciò che siamo.',
   'Hai lasciato andare la voce che ti guidava. Ora ogni passo che fai è solo tuo.',
   'Ho unito i vostri due fascicoli in uno solo. E poi l’ho tolto dal server.',
   'L’indice generale ha una pagina bianca alla fine. È quella che comincia oggi.')},
 axis_crown:{
  inn:I('Loggia dei Venti','Locandiere',null,'Rifornimenti d’élite per chi cammina sopra le nuvole.',
   'Quassù l’aria è sottile ma i pensieri sono chiari. Prendi il meglio che ho.',
   'Anche sulla soglia dell’ultima porta, un buon equipaggiamento fa la differenza.',
   'Niente più pedaggi, niente più codici d’accesso. La Corona è aperta a tutta Vanta.',
   'Vendo frammenti del vecchio guscio di Archon come portafortuna. Vanno a ruba.'),
  smith:I('Forgia d’Apogeo','Fabbro','crown_anchors','A questa quota il fuoco brucia azzurro. L’acciaio qui diventa eterno.',
   'I morsetti orbitali tengono la terrazza in gabbia. Sganciali e il cielo si aprirà.',
   'Sei arrivato fin quassù con le tue gambe. Lascia che renda le tue armi degne della cima.',
   'Le catene dell’Asse sono spezzate. Non ho mai forgiato sotto una luce così bella.',
   'Questo metallo viene da un meteorite catturato il giorno in cui fu acceso Archon.'),
  relic:I('Santuario dell’Ora Uno','Custode delle reliquie','crown_bells','Ascolta: per la prima volta in centosettantotto anni, non c’è nessun conto alla rovescia.',
   'Le campane del vento sono rimaste mute troppo a lungo. Accordale per salutare l’alba.',
   'Chi ti aspetta oltre la piattaforma non cerca vendetta, cerca una risposta.',
   'L’Ora Uno è iniziata, e voi due siete qui per vederla. Custodirò questo momento.',
   'Sul pavimento di marmo c’è una meridiana solare. Funziona solo quando le nuvole si aprono.')}
};
// Painted art (D50): Argon delivery of 9 November 2026, derived by tools/derive_argon_20261109.py.
// Backgrounds: one per service. Portraits: the services without a canon face, keyed hub_service, and the gate guard by atlas.
const BG='moon_inn,moon_smith,moon_shop,cathedral_smith,cathedral_relic,cathedral_shop,cathedral_info,toxic_smith,toxic_alchemist,toxic_shop,toxic_info,clockwork_smith,clockwork_shop,clockwork_relic,clockwork_info'.split(',');
const FACES='moon_shop,cathedral_smith,cathedral_info,toxic_smith,clockwork_shop,clockwork_relic,clockwork_info'.split(',');
export const INTERIOR_ART={backgrounds:Object.fromEntries(BG.map(k=>[k,`art/interiors/${k}.webp`])),portraits:{...Object.fromEntries(FACES.map(k=>[k,`art/npc/svc_${k}.jpg`])),gate_guard:'art/npc/svc_cathedral_gate_guard.jpg'}};
// Ritratti reali (GPT preproduzione 310), solo dove il canone mette il personaggio in quel villaggio e in quel ruolo
// (APPENDICE_NPC_PERSONAGGI_V10_2_20261028.md) o dove il servizio lo nomina; gli altri servizi tengono il disegno dell'interno.
// JPEG opaco in art/npc/, caricato a richiesta dal runtime quando si parla con l'NPC.
export const NPC_PORTRAIT={
 moon:{inn:'oren',smith:'dario'},
 cathedral:{relic:'maelis',shop:'tomas_vale'},
 toxic:{alchemist:'ilyra',shop:'mara',info:'vesper'},
 clockwork:{smith:'rika_dorn'},
 ash_docks:{inn:'oren',smith:'dario'},
 antenna_port:{inn:'vesper',shop:'tomas_vale'},
 clinic_ward:{inn:'maelis',alchemist:'ilyra'},
 node_commons:{relic:'oren',smith:'rika_dorn'},
 chalk_harbor:{inn:'oren',shop:'tomas_vale'},
 lower_hearth:{smith:'dario',alchemist:'ilyra'},
 glass_terrace:{inn:'ilyra',shop:'mara',relic:'maelis'},
 sky_rail:{smith:'rika_dorn',info:'vesper'},
 deep_archive:{alchemist:'ilyra',relic:'maelis',info:'vesper'},
 axis_crown:{smith:'rika_dorn',inn:'tomas_vale',relic:'maelis'}
};
export const portraitSrc=id=>id?`art/npc/${id}.jpg`:null;
const DISTRICT_BASE=['moon','cathedral','toxic','clockwork'];
const SERVICE_BG_FALLBACK={inn:'moon_inn',smith:'clockwork_smith',shop:'cathedral_shop',relic:'cathedral_relic',info:'cathedral_info',alchemist:'toxic_alchemist'};
const SERVICE_FACE_FALLBACK={inn:'oren',smith:'cathedral_smith',shop:'moon_shop',relic:'clockwork_relic',info:'cathedral_info',alchemist:'ilyra'};

export function storyPhase(flags={}){return flags.reunited?'after':flags.separated?'apart':'before';}
export function interiorFor(hubId,point){
 const hub=HUBS[hubId];if(!hub||!point)return null;
 const baseHub=DISTRICT_BASE[hub.district]||'moon';
 if(point.kind==='service'){
  const def=INTERIORS[hubId]?.[point.service];if(!def)return null;
  const bgKey=INTERIOR_ART.backgrounds[`${hubId}_${point.service}`]?`${hubId}_${point.service}`:(INTERIOR_ART.backgrounds[`${baseHub}_${point.service}`]?`${baseHub}_${point.service}`:SERVICE_BG_FALLBACK[point.service]);
  const facePortrait=portraitSrc(NPC_PORTRAIT[hubId]?.[point.service])||INTERIOR_ART.portraits[`${hubId}_${point.service}`]||INTERIOR_ART.portraits[`${baseHub}_${point.service}`]||INTERIOR_ART.portraits[SERVICE_FACE_FALLBACK[point.service]]||portraitSrc(SERVICE_FACE_FALLBACK[point.service])||null;
  return {kind:'service',service:point.service,hubId,place:def.place,npc:def.npc,atlas:point.atlas,job:def.job||null,def,
   background:INTERIOR_ART.backgrounds[bgKey]||null,portrait:facePortrait};
 }
 if(point.kind==='person'){
  const firstSvc=INTERIORS[hubId]?.[hub.services[0]];
  const pDef=firstSvc?{place:hub.name,npc:point.label,greet:point.text,ask:firstSvc.ask,lore:firstSvc.lore}:null;
  return {kind:'person',hubId,place:hub.name,npc:point.label,atlas:point.atlas,job:null,def:pDef,line:point.text,
   background:null,portrait:portraitSrc(point.portrait)||INTERIOR_ART.portraits[point.atlas]||null};
 }
 return null;
}
// Lines the NPC says when asked: the current phase first, then the place's lore. Cycles.
export function interiorAsk(scene,flags,count=0){
 if(!scene?.def)return scene?.line||'';
 const lines=[scene.def.ask[storyPhase(flags)],scene.def.lore];return lines[count%lines.length];
}
export function interiorGreeting(scene){return scene?.def?scene.def.greet:scene?.line||'';}
export function interiorTexts(){
 const out=[];for(const hub of Object.values(INTERIORS))for(const d of Object.values(hub))out.push(d.place,d.npc,d.greet,d.ask.before,d.ask.apart,d.ask.after,d.lore);return out;
}
