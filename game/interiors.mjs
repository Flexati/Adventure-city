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
   'Gli automi si riparano da soli. Io controllo che non diventino troppo bravi.')}
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
 clockwork:{smith:'rika_dorn'}
};
export const portraitSrc=id=>id?`art/npc/${id}.jpg`:null;

export function storyPhase(flags={}){return flags.reunited?'after':flags.separated?'apart':'before';}
export function interiorFor(hubId,point){
 const hub=HUBS[hubId];if(!hub||!point)return null;
 if(point.kind==='service'){
  const def=INTERIORS[hubId]?.[point.service];if(!def)return null;
  return {kind:'service',service:point.service,hubId,place:def.place,npc:def.npc,atlas:point.atlas,job:def.job||null,def,
   background:INTERIOR_ART.backgrounds[`${hubId}_${point.service}`]||null,portrait:portraitSrc(NPC_PORTRAIT[hubId]?.[point.service])||INTERIOR_ART.portraits[`${hubId}_${point.service}`]||null};
 }
 if(point.kind==='person')return {kind:'person',hubId,place:hub.name,npc:point.label,atlas:point.atlas,job:null,def:null,line:point.text,
  background:null,portrait:portraitSrc(point.portrait)||INTERIOR_ART.portraits[point.atlas]||null};
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
