# CHRONOS Adventure: Nox & Lulù — Combattimento e audio

## Benchmark e Pilastro 1: joystick e mappatura input

2 novembre 2026 · **approvato dall'autore** (D27: C1, N1, N2) · `COMMERCIAL_RELEASE = BLOCKED`

Repo letto: `Flexati/Adventure-city`, ramo `work/chronos-adventure-commercial`, commit `583e68b`. **Questo documento non modifica il codice del gioco.**

**Il team**
- **GSD**, Game Systems Designer Senior: combattimento, input touch, frame data, sensazione di gioco.
- **AD**, Audio Director: suono adattivo, musica, spazializzazione, vibrazione.

**Legenda**
- **[FATTO]**: verificato nel codice (`file:riga`) o su una fonte esterna (link in fondo).
- **[IPOTESI]**: valore proposto o deduzione, sempre con la ragione.
- **Frame a 60 Hz:** 1 frame = 1000 ms ÷ 60 = 16,67 ms. Per convertire: frame = secondi ÷ 0,01667.
- **dp:** 1 dp = 25,4 mm ÷ 160 = 0,159 mm. Nel WebView con `width=device-width` (`game/index.html:1`), 1 px CSS corrisponde a 1 dp **[IPOTESI]**: si verifica sul telefono, perché `devicePixelRatio` deve essere uguale alla densità divisa per 160.

**Stato di ogni regola nelle tabelle**
- **OGGI**: è già nel codice.
- **CORREZIONE**: cambia il momento in cui il gioco legge il tocco. Durate, hitbox e danni restano uguali.
- **NUOVO**: non c'è ancora. Serve il tuo sì.
- **NO**: scartato, con il motivo.

---

## 0. Il brief confrontato con il codice

Prima di progettare ho letto il codice. Su 8 punti il brief e il gioco reale non coincidono.

| # | Il brief dice | Il codice dice | Cosa faccio |
|---|---|---|---|
| 1 | Premium a 4,99 € | Il prezzo deciso è 5,99 €, confermato due volte | Uso 5,99 € |
| 2 | Simulazione a passo fisso 60 Hz, deterministica | **Passo variabile.** Ogni frame usa il tempo reale trascorso, limitato a 50 ms (`runtime.mjs:963`, `campaign.mjs:288`) **[FATTO]** | I frame di questo documento sono i secondi del codice convertiti a 60 Hz. Su un telefono a 30 fps la finestra della Perfect Dodge (0,14 s) dura 4 aggiornamenti, non 8. Il passo fisso lo propongo nel Pilastro 4 |
| 3 | Duo: la Resonance di Lulù apre la finestra di contrattacco di Nox | Il Duo è un colpo che si usa a barra piena: danno ×2 entro 300 px, stordimento 1,2 s, +2 vita, 1 s di invulnerabilità (`campaign.mjs:303`). Il contrattacco (0,6 s) si apre solo con la Perfect Dodge (`campaign.mjs:204`) **[FATTO]** | Il Duo del brief è una meccanica nuova: la tratto nel Pilastro 2 |
| 4 | Chrono Shift da costruire | Non esiste. La Perfect Dodge però rallenta già tutto il gioco, **Nox compreso**, al 40 % per 0,16 s (`runtime.mjs:737`, `963`) **[FATTO]** | Pilastro 2 |
| 5 | Gamepad Bluetooth opzionale | Nessun gamepad: solo touch e tastiera (`input-v9.mjs:3`) **[FATTO]** | Mappatura al §1.6, come NUOVO |
| 6 | Vibrazione tramite un bridge Android | Usa `navigator.vibrate` del WebView, senza bridge, e **solo nelle gare** (`runtime.mjs:310–315`). `navigator.vibrate` accetta durate, non intensità **[FATTO]**, MDN | Pilastri 3 e 4 |
| 7 | Attacco con trascinamento per mirare | Confermato. Il colpo parte quando **alzi il dito**. Se hai trascinato oltre 12 px la mira è manuale, altrimenti è automatica (`runtime.mjs:667`) **[FATTO]** | Resta così (§1.3) |
| 8 | Pulsanti riposizionabili e auto-combo opzionale | In Fase 3 hai escluso i pulsanti spostabili insieme al «Colpo assistito» (decisione 3) | È l'unica domanda, alla fine |

---

## Benchmark

**Nessuna sostituzione.** In Fase 1 avevo sostituito Hades e Katana Zero perché cercavamo giochi da confrontare sul mercato mobile. Qui studiamo **sistemi**, e un sistema si studia anche su PC o console. Per ogni gioco, la riga «Non prendere» dice cosa non funziona su un telefono.

**Avviso sulle fonti.** Nessuno di questi studi pubblica i propri frame data. I numeri sui frame vengono da wiki e forum dei giocatori: li segno **[IPOTESI]** anche quando la fonte esiste.

### 1. Hades (Supergiant Games)
- **Cosa fa.** Lo scatto rende invulnerabili. Se premi mentre il personaggio è occupato, il gioco ricorda il comando per un breve tempo **[IPOTESI]**, da forum Steam. Per Hades II i giocatori parlano di circa mezzo secondo.
- **Perché funziona.** Un tocco dato poco prima non va perso: l'azione parte appena può.
- **Da prendere.** Un buffer corto per schivata e attacco (§1.4).
- **Da non prendere per il mobile.** Un buffer lungo come quello riportato per Hades II. Sul vetro i tocchi involontari sono più frequenti: l'azione partirebbe quando il giocatore ha già cambiato idea **[IPOTESI]**.

### 2. Dead Cells, versione mobile (Motion Twin / Playdigious, 2019)
- **Cosa fa.** Due modalità di controllo, Original e Auto-Hit. Pulsanti spostabili e ridimensionabili. Supporto ai controller esterni **[FATTO]**, scheda App Store. Tra i controlli c'è anche lo swipe per schivare **[FATTO]**, Siliconera.
- **Perché funziona.** Ognuno adatta i comandi alla propria mano.
- **Da prendere.** La schivata resta un pulsante dedicato. Secondo il blog di sviluppo ripreso da TouchArcade, lo swipe da solo non era piacevole da usare **[IPOTESI]**: la pagina oggi non è raggiungibile (errore 403).
- **Da non prendere.** Auto-Hit, cioè l'attacco automatico: va contro la tua decisione di Fase 3 sul «Colpo assistito».

### 3. Hyper Light Drifter (Heart Machine, 2016)
- **Cosa fa.** Lo scatto si concatena a ritmo: se ripremi al momento giusto, la catena continua. La wiki dei giocatori parla di soglie intorno ai 250–300 ms **[IPOTESI]**: la pagina oggi non è raggiungibile (errore 402).
- **Perché funziona.** Lo scatto diventa un linguaggio: chi tiene il ritmo si sente padrone.
- **Da prendere.** Il telegraph leggibile. CHRONOS lo fa già: il cerchio rosso segue l'eroe per il 55 % del caricamento, poi si ferma (`campaign.mjs:333`) **[FATTO]**.
- **Da non prendere.** Catene a ritmo stretto: sul vetro non senti il pulsante, e il tempo fine è più difficile **[IPOTESI]**.

### 4. Katana Zero (Askiisoft, 2019)
- **Cosa fa.** Il rallentatore si attiva con un tasto e dura quanto una barra. Quando il tempo rallenta, la musica rallenta e si deforma con lui **[FATTO]**, recensioni. Che sia una scelta voluta dallo studio è **[IPOTESI]**: non ho trovato interviste.
- **Perché funziona.** Senti lo stato del tempo senza guardare la barra.
- **Da prendere.** Il «suono del tempo lento» per il Chrono Shift: tono più basso e filtro passa-basso, sempre con un segnale visivo.
- **Da non prendere.** Il rallentatore gestito a mano: è un pulsante in più su 6". In CHRONOS il rallentamento parte da solo dopo la Perfect Dodge.

### 5. Sekiro (FromSoftware, 2019)
- **Cosa fa.** Il deflect: premi la guardia poco prima del colpo, annulli il danno e riempi la postura del nemico. Se premi a raffica, la finestra si stringe. La wiki Fextralife indica 12 frame (0,2 s), una penalità che si azzera dopo 30 frame o dopo un deflect riuscito **[IPOTESI]**: altre fonti dei giocatori danno numeri diversi.
- **Perché funziona.** Il deflect riuscito ha un suono metallico netto e una scintilla: lo senti prima ancora di vederlo **[FATTO]**, guide e forum.
- **Da prendere.** Due suoni diversi per schivata normale e Perfect Dodge. La penalità anti-raffica in CHRONOS c'è già: lo scatto ha 1,1 s di ricarica (`campaign.mjs:293`) **[FATTO]**.
- **Da non prendere.** La guardia tenuta e la postura: un pulsante in più, e una finestra di 0,2 s su touch più la latenza del vetro **[IPOTESI]**.

### 6. DOOM (id Software, 2016) e Hi-Fi Rush (Tango Gameworks, 2023)
- **Cosa fa DOOM.** La musica di combattimento di Mick Gordon, presentata alla GDC 2017 **[FATTO]**. La musica è fatta di strati e loop combinati durante lo scontro **[IPOTESI]**: lo dice un articolo secondario, non il talk.
- **Cosa fa Hi-Fi Rush.** Tutto è costruito su un BPM fisso. Ogni animazione, anche se premuta un po' prima o un po' dopo, viene interpolata per **cadere sul beat** **[FATTO]**: intervista al director John Johanas su Gameranx.
- **Da prendere.** Strati musicali che entrano con l'intensità. Cambi di sezione solo sul beat.
- **Da non prendere.** L'azione agganciata al beat: il gioco deve funzionare senza audio (vincolo 8), e il ritmo non si vede. Nemmeno molti stem insieme: oggi il motore tiene al massimo **2 flussi musicali** (`audio-engine.mjs:40`) **[FATTO]**.

---

## Pilastro 1 — Joystick e mappatura input

### 1.1 Cosa c'è oggi **[FATTO]**

| Elemento | Valore | Dove |
|---|---|---|
| Joystick flottante, a piedi | Compare sotto il dito in qualsiasi punto della mappa. Raggio **46 px** (7,3 mm). Zona morta interna **8 px** = 8 ÷ 46 = **17,4 %**. Curva lineare. Niente zona morta esterna: oltre 46 px l'anello segue il dito e la forza resta 1. Niente aggancio a 8 direzioni, niente smoothing | `runtime.mjs:675–683`, `input-v9.mjs:8–14` |
| Joystick fisso, a piedi | 118 px in basso a sinistra. Raggio 38 px, zona morta 8 px = **21,1 %** | `style.css:143`, `runtime.mjs:668` |
| Joystick di guida | Solo sinistra e destra. Raggio 56 px, zona morta 5 px = **8,9 %** | `runtime.mjs:676` |
| Velocità | Camminata 205 unità/s. Scatto 660 unità/s per 0,18 s = 118,8 unità | `campaign.mjs:293–294` |
| SPARA e PULSE | Il colpo parte **quando alzi il dito**. Trascinamento oltre 12 px (1,9 mm): mira manuale. Mentre tieni premuto, una linea tratteggiata mostra dove andrà il colpo | `runtime.mjs:667`, `runtime.mjs:896` |
| Mira automatica | Il nemico visibile più vicino entro la gittata, **a 360°**. Il bersaglio di prima resta agganciato se è entro 1,25 volte la distanza del più vicino. Con The Anchor colpisce prima i cavi | `campaign.mjs:106` |
| SCHIVA | Parte con l'evento `click`, cioè **quando alzi il dito**. Durante la ricarica il pulsante è disattivato | `runtime.mjs:666`, `runtime.mjs:918` |
| Buffer | **Nessuno.** Un tocco su SPARA durante un'azione, o su SCHIVA in ricarica, va perso | `runtime.mjs:969`, `campaign.mjs:114` |
| Due comandi nello stesso frame | Ordine fisso: schivata → movimento → SPARA → PULSE → Duo → ATTIVA. SPARA e PULSE si escludono e vince SPARA; gli altri convivono | `campaign.mjs:293–346` |
| Pulsanti | 86 × 52 px (13,7 × 8,3 mm). SPARA 180 × 64 px. Distanza tra pulsanti 8 px | `style.css:145–147` |
| Tastiera | WASD e frecce: movimento. J o Spazio: spara. L: Pulse. Shift: schiva. Q: Duo. E: attiva. R: ricarica. V: cambia arma. H: cura | `input-v9.mjs:3`, `runtime.mjs:688` |
| Accessibilità | Opzioni «movimento ridotto» (niente tremolio e niente rallentamento) e «vibrazione» | `runtime.mjs:50`, `runtime.mjs:654` |

### 1.2 Joystick: le decisioni

Prevale il **GSD**: è una questione di controllo, non di suono.

| Parametro | Decisione | Perché |
|---|---|---|
| Tipo | **Flottante, come oggi.** Resta anche quello fisso | Compare dove appoggi il pollice: non serve guardare dove sta |
| Raggio | **46 px, come oggi** (7,3 mm) | Un pollice lo percorre senza spostare la mano **[IPOTESI]**: da confermare nel test 1 del Pilastro 5 |
| Zona morta interna | **8 px = 17,4 %, come oggi** (1,3 mm) | Assorbe il tremolio del pollice fermo. È uguale al `TOUCH_SLOP` di Android (8 dp) **[FATTO]** |
| Zona morta esterna | **Nessuna, come oggi** | L'anello segue il dito: la piena velocità si raggiunge già superando il bordo |
| Curva | **Lineare, come oggi** | Una curva esponenziale aiuta la mira fine, ma qui il joystick muove l'eroe: velocità prevedibili contano di più |
| Aggancio a 8 direzioni | **No** | Con 8 direzioni l'errore può arrivare a 22,5°. Per uscire dal cerchio rosso serve l'angolo libero |
| Smoothing | **No**, né sul joystick né sul movimento | Una media mobile con α = 0,5 ritarda di (1 − α) ÷ α = **1 frame = 16,67 ms**. Se serve, si ammorbidisce solo l'animazione dello sprite (Presentation), mai l'input |

### 1.3 Mappatura dell'intenzione

| Intenzione | Decisione | Perché |
|---|---|---|
| **Tocco = colpo leggero** | **OGGI.** Tocco senza trascinare = colpo con mira automatica | È il colpo base |
| **Tieni premuto oltre N ms = colpo caricato** | **NO** nella Parte I | Tenere premuto SPARA oggi vuol dire *mirare*. Un colpo caricato sullo stesso pulsante renderebbe il gesto ambiguo. E aggiungerebbe una meccanica, contro la tua regola «nessun altro miglioramento». Se un giorno servisse, la soglia sarebbe 400 ms, come il tempo di pressione lunga di Android **[FATTO]** |
| **Swipe veloce = schivata direzionale** | **NO** | Vedi il calcolo sotto |
| **Tocco nella finestra del telegraph = Perfect Dodge** | **OGGI**, ma serve la **CORREZIONE C1** | Vedi sotto |
| **Parata (parry)** | **NO** | Un pulsante in più. La Perfect Dodge ha già il ruolo della parata |

**Perché niente swipe (calcolo).**
- Su CHRONOS ogni punto della mappa è già joystick. Uno swipe sulla mappa si confonde con un cambio di direzione veloce.
- Per invertire la direzione, il pollice passa da +46 px a −46 px: 92 px. Se lo fa in 80 ms **[IPOTESI]**, la velocità è 92 ÷ 80 = **1,15 px/ms**.
- La soglia minima di fling di Android è 50 dp/s = **0,05 px/ms** **[FATTO]**. Anche una soglia molto più alta, 0,8 px/ms, verrebbe superata da 1,15 px/ms.
- Risultato: la schivata partirebbe da sola mentre il giocatore cambia direzione. La lezione di Dead Cells porta allo stesso punto.

**Correzione C1: SCHIVA al tocco, non al rilascio.**
- **Oggi.** SCHIVA parte con l'evento `click`, che arriva quando il dito si alza (`runtime.mjs:666`) **[FATTO]**.
- **Il problema.** La finestra della Perfect Dodge è di 0,14 s = **8,4 frame** dall'inizio dello scatto (`campaign.mjs:293`) **[FATTO]**. Il giocatore preme guardando il cerchio rosso, ma lo scatto parte solo al rilascio.
- **Quanto pesa.** Se un tocco dura 100 ms con ±30 ms di variazione **[IPOTESI]**:
  - la finestra si sposta di 100 ms rispetto a quando il dito tocca il vetro;
  - la variazione sfuoca la finestra di 60 ms, cioè 60 ÷ 140 = **43 %**.
- **La correzione.** SCHIVA parte all'evento `pointerdown`, quando il dito tocca. Stessa cosa per DUO e ATTIVA, per coerenza. Durate, finestre e hitbox restano identiche: cambia solo il momento in cui il gioco legge il tocco. Tastiera e accessibilità (Invio e Spazio sul pulsante) restano come sono.
- **Prevale il GSD.**

**SPARA resta al rilascio.**
- Al momento del tocco il gioco non può sapere se trascinerai per mirare.
- Il costo è la durata del tocco, che misureremo nel Pilastro 5.
- Mentre tieni premuto, la linea tratteggiata conferma già il tocco: questo è il riscontro immediato.

### 1.4 Combo, buffer e priorità

- **Combo:** CHRONOS **non ha combo**. Ha colpi singoli con ricarica: C-9, 0,4 s (`weapons-v9.mjs:3`) **[FATTO]**. Quindi non servono cancel window tra colpi.
- **Cancel:** la schivata funziona **già** in qualsiasi momento di un attacco. Lo scatto parte anche mentre l'azione di sparo è in corso (`campaign.mjs:293` contro `302`) **[FATTO]**. Non cambia nulla.

**Nuovo N1: buffer di 100 ms (6 frame).**

| Regola | Valore |
|---|---|
| Comandi con buffer | SCHIVA, SPARA, PULSE. Il Duo no: si preme solo a barra piena. ATTIVA no: dipende dalla distanza dal nodo |
| Durata | **100 ms di tempo di gioco = 6 frame** a 60 Hz (100 ÷ 16,67 = 6,0) **[IPOTESI]** |
| Come funziona | Un tocco che non può partire (ricarica o azione in corso) viene tenuto per 100 ms. A ogni aggiornamento si riprova. Dopo 100 ms si scarta |
| Un solo tocco per comando | Il tocco più recente sostituisce quello vecchio |
| Mira di SPARA in buffer | Se avevi trascinato, tiene la direzione manuale. Altrimenti la mira automatica si calcola quando il colpo parte |
| Perfect Dodge | La finestra di 0,14 s parte quando lo scatto parte davvero, come oggi |
| Effetto sui pulsanti | SCHIVA e PULSE in ricarica non vanno più disattivati (`disabled`), perché un pulsante disattivato non riceve il tocco. Si mostrano «in ricarica» con un riempimento visivo |

**Perché 100 ms e non 500.**
- 100 ms è il 25 % della ricarica di C-9 (100 ÷ 400).
- Copre un tocco dato «un attimo prima», non un'intenzione vecchia.
- Il mezzo secondo riportato per Hades II, su touch, farebbe partire azioni a cui il giocatore ha già rinunciato.

**Due comandi nello stesso frame.** Si tiene l'ordine di oggi: schivata, movimento, SPARA, PULSE, Duo, ATTIVA. Si escludono solo SPARA e PULSE, e vince SPARA. Sul touch quel caso non succede: il gioco segue un solo pulsante di mira alla volta (`aimTouch`, `runtime.mjs:667`) **[FATTO]**.

### 1.5 Mira

| Mira | Decisione |
|---|---|
| **Automatica** | **OGGI, invariata.** Il nemico visibile più vicino entro la gittata dell'arma: C-9 310, VX-9 340, R-12 195, H-17 500, ARC-7 320 (`weapons-v9.mjs:3–7`). Copre 360°, senza cono. Aggancio stabile a 1,25 volte. I cavi di The Anchor vengono prima **[FATTO]** |
| **Perché niente cono** | Il GSD lo esclude: su 6" si spara mentre si arretra. Un cono legato alla direzione di marcia mancherebbe proprio i nemici che ti inseguono |
| **Priorità ai nemici che stanno per colpire** | **NO** per ora: cambierebbe il comportamento della mira, ed è un miglioramento in più |
| **Manuale** | **OGGI, invariata.** Trascini oltre 12 px da SPARA o PULSE, la linea tratteggiata mostra la traiettoria e il colpo parte al rilascio. Se torni entro 12 px, la mira torna automatica |

### 1.6 Gamepad (NUOVO N2, a una condizione)

**La condizione.** Prima di scrivere codice si verifica sul telefono che il WebView veda il gamepad con l'API Gamepad **[IPOTESI]**: è il test 5 del Pilastro 5. Se non lo vede, il gamepad resta fuori dalla Parte I.

Mappatura «standard» W3C: gli indici dei pulsanti sono **[FATTO]**, le soglie **[IPOTESI]**.

| Controllo (indice W3C) | Azione | Soglie |
|---|---|---|
| Stick sinistro (`axes` 0, 1) | Movimento | Zona morta radiale 15 %, piena forza dal 95 %, curva lineare |
| Stick destro (`axes` 2, 3) | Mira manuale, con la stessa linea tratteggiata | Zona morta 25 %. Sotto la soglia la mira è automatica |
| Pulsante in basso, A (`buttons` 0), o grilletto destro (7) | SPARA, al rilascio come su touch | Grilletto premuto oltre il 30 % |
| Pulsante a destra, B (1) | SCHIVA, alla pressione | — |
| Pulsante a sinistra, X (2) | PULSE | — |
| Pulsante in alto, Y (3) | DUO | — |
| Spalla destra (5) | ATTIVA | — |
| Spalla sinistra (4) | Cambia arma | — |
| Croce su (12) e giù (13) | Ricarica e Cura | — |
| Start (9) | Pausa | — |

Il gamepad usa lo **stesso buffer N1 e la stessa mira automatica**: nessuna regola speciale.

### 1.7 Accessibilità

| Voce | Decisione |
|---|---|
| Area minima di tocco | Android raccomanda **48 × 48 dp** **[FATTO]**. CHRONOS: 86 × 52 px, SPARA 180 × 64 **[FATTO]**. Rispettata |
| Pulsanti riposizionabili | **Esclusi in Fase 3** (decisione 3). Vedi la domanda |
| Tenere premuto o attivare con un tocco (hold-to-toggle) | A piedi nessun comando va tenuto premuto, tranne la mira, che per natura è un trascinamento **[FATTO]**. In guida l'acceleratore va tenuto: un acceleratore fisso rientra nella stessa esclusione di Fase 3 |
| Auto-combo | **Non applicabile**: non ci sono combo **[FATTO]**. Il bisogno è già coperto dalla mira automatica |
| Senza audio | Ogni comando ha un segnale visivo: scintille dello scatto (`runtime.mjs:736`), linea del colpo, scritta «PERFETTA» con anello (`runtime.mjs:737`), anello del Duo. Il buffer N1 non ha bisogno di segnali: deve solo funzionare |
| Movimento ridotto e vibrazione | Opzioni già presenti **[FATTO]** |

### 1.8 Il punto di vista dell'Audio Director

- **AD-1. Il suono arriva quando parte l'azione, non al tocco.** Lo scatto suona all'evento `dash`, il colpo al frame di uscita (0,09 s dopo l'inizio = 5,4 frame, `campaign.mjs:302`) **[FATTO]**. Un tocco in buffer suona quando l'azione parte davvero.
- **AD-2. Obiettivo di latenza: dal tocco al primo suono ≤ 100 ms** **[IPOTESI]**. Il contesto audio chiede già la latenza «interactive» (`audio-engine.mjs:14`) **[FATTO]**. Il valore reale (`baseLatency` + `outputLatency`) cambia da telefono a telefono: si misura nel Pilastro 5.
- **AD-3. Nessuna vibrazione sui tocchi normali.** Vibrare a ogni colpo consuma batteria e copre i segnali importanti. La vibrazione resta per Perfect Dodge, colpo subito e Duo: i dettagli nei Pilastri 3 e 4.

**Conflitto dichiarato.**
- **L'AD voleva** un «clic» quando si preme SPARA, per confermare subito il tocco, visto che il colpo parte al rilascio.
- **Il GSD ha detto no.** Ogni colpo avrebbe due suoni, il clic arriverebbe circa 100 ms prima dello sparo e confonderebbe il tempo. La conferma immediata c'è già, ed è visiva: la linea tratteggiata.
- **Prevale il GSD**, per la regola dello schermo da 6": il giocatore capisce meglio una linea che vede sotto il dito di un suono che arriva prima del colpo.

---

## Tabella di output: gesto → condizione → azione → soglie

| # | Gesto | Condizione | Azione | Soglie numeriche | Stato |
|---|---|---|---|---|---|
| 1 | Tocco e trascinamento sulla mappa | A piedi, hub, fuga, camminata iniziale; dito fuori dai pulsanti | Compare il joystick flottante, l'eroe si muove | Raggio 46 px (7,3 mm). Zona morta 8 px (17,4 %). Lineare. Forza 1 oltre il bordo, l'anello segue | OGGI |
| 2 | Trascinamento sul joystick fisso | A piedi | Movimento | Raggio 38 px. Zona morta 8 px (21,1 %) | OGGI |
| 3 | Tocco e trascinamento sulla mappa | Guida e gare | Sterzo | Solo asse X. Raggio 56 px. Zona morta 5 px (8,9 %) | OGGI |
| 4 | Tocco su SPARA senza trascinare | Arma pronta | Colpo con mira automatica, al rilascio | Spostamento ≤ 12 px. Colpo esce 0,09 s = 5,4 frame dopo il rilascio | OGGI |
| 5 | Trascinamento da SPARA o PULSE | Spostamento > 12 px | Mira manuale con linea, colpo al rilascio | Soglia 12 px (1,9 mm) | OGGI |
| 6 | Tocco su SPARA durante la ricarica o un'azione | Mancano ≤ 100 ms | Il colpo parte al primo frame utile | Buffer 100 ms = 6 frame | NUOVO N1 |
| 7 | Tocco su SCHIVA | Ricarica finita | Scatto nella direzione di marcia | **Parte al tocco** (`pointerdown`). Scatto 0,18 s = 10,8 frame. Invulnerabilità 0,30 s = 18 frame. Ricarica 1,1 s = 66 frame | OGGI + CORREZIONE C1 |
| 8 | Tocco su SCHIVA durante la ricarica | Mancano ≤ 100 ms | Lo scatto parte appena la ricarica finisce | Buffer 100 ms = 6 frame | NUOVO N1 |
| 9 | Tocco su SCHIVA nella finestra del telegraph | Il colpo nemico arriva entro 0,14 s dall'inizio dello scatto | Perfect Dodge: contrattacco pronto, +14 al Duo | Finestra 0,14 s = 8,4 frame. Contrattacco valido 0,6 s = 36 frame | OGGI + CORREZIONE C1 |
| 10 | Tocco su PULSE | Abilità sbloccata, ricarica finita | Nox: colpo potente. Lulù: Resonance ad area, stordisce | Uscita 0,27 s = 16,2 frame. Ricarica 3,5 o 4,5 s. Resonance: 240 px, stordimento 2,2 s | OGGI (+ N1) |
| 11 | Tocco su DUO | Barra al 100 % | Duo | **Al tocco** (C1). Raggio 300 px, stordimento 1,2 s | OGGI + C1 |
| 12 | Tocco su ATTIVA | Entro 85 px da un nodo libero | Attivazione: resta entro 95 px | **Al tocco** (C1). 0,45 s Lulù, 0,8 s Nox | OGGI + C1 |
| 13 | Tenere premuto SPARA fermo | — | Colpo caricato | — | NO |
| 14 | Swipe veloce sulla mappa | — | Schivata direzionale | Conflitto: inversione del joystick ≈ 1,15 px/ms | NO |
| 15 | Stick sinistro del gamepad | Gamepad visto dal WebView | Movimento | Zona morta 15 %, piena forza dal 95 % | NUOVO N2 |
| 16 | Stick destro + A o grilletto destro | Come sopra | Mira manuale e colpo | Zona morta 25 %. Grilletto oltre il 30 % | NUOVO N2 |
| 17 | B, X, Y, spalle, croce, Start | Come sopra | Schiva, Pulse, Duo, Attiva, Cambia arma, Ricarica, Cura, Pausa | Stesso buffer N1 | NUOVO N2 |

---

## Riepilogo delle proposte

| Codice | Cosa | Tocca tempi o hitbox? | File interessati |
|---|---|---|---|
| **C1** | SCHIVA, DUO e ATTIVA partono al tocco, non al rilascio | No: cambia solo il momento in cui si legge il tocco | `game/runtime.mjs` (riga 666) |
| **N1** | Buffer di 100 ms per SCHIVA, SPARA e PULSE; i pulsanti in ricarica non vengono più disattivati | No: le durate restano uguali | `game/runtime.mjs` (input e righe 914–918), `game/campaign.mjs` (`tick`), nuovi test in `tests/` |
| **N2** | Gamepad, solo se il WebView lo vede | No | `game/input-v9.mjs`, `game/runtime.mjs` |

**Nessuna di queste è applicata.** Le scriverà Claude nel terminale (Remote Control) solo dopo il tuo sì, con i test esistenti (`tests/perfect-dodge.test.mjs`, `tests/input-v9.test.mjs`) più quelli nuovi.

---

## Fonti

- Hades, invulnerabilità e buffer (forum dei giocatori): [Steam, Hades](https://steamcommunity.com/app/1145350/discussions/0/4357872738330399478), [Steam, Hades II](https://steamcommunity.com/app/1145360/discussions/0/6197594023015140998), [PC Gamer](https://www.pcgamer.com/hades-guide-tips-and-tricks)
- Dead Cells mobile: [App Store](https://apps.apple.com/ph/app/dead-cells/id1389752090), [Siliconera](https://www.siliconera.com/dead-cells-heads-to-smartphones-with-a-new-mobile-friendly-interface/), [TouchArcade, blog di sviluppo](https://toucharcade.com/2019/05/07/dead-cells-mobile-blog-post/) (oggi 403)
- Hyper Light Drifter: [wiki Abilities and Upgrades](https://hyperlightdrifter.fandom.com/wiki/Abilities_and_Upgrades) (oggi 402), [Steam](https://steamcommunity.com/app/257850/discussions/0/365163686057644206)
- Katana Zero: [The Xbox Hub](https://www.thexboxhub.com/katana-zero-review/), [Gamegeeker](https://gamegeeker.com/it/games/katana-zero-460950/review)
- Sekiro: [Fextralife, Deflection](https://sekiroshadowsdietwice.wiki.fextralife.com/Deflection), [Push Square](https://www.pushsquare.com/news/2019/03/guide_sekiro_shadows_die_twice_combat_-_posture_deflections_shinobi_prosthetic_and_stealth)
- DOOM: [GDC 2017](https://gdconf.com/news/gdc-2017-get-behind-scenes-look-composing-music-doom), [PCGamesN](https://www.pcgamesn.com/doom/doom-soundtrack-talk-GDC)
- Hi-Fi Rush: [Gameranx](https://gameranx.com/updates/id/436553/article/hi-fi-rush-is-a-huge-technical-achievement-heres-how-tango-gameworks-pulled-it-off/)
- Android: [ViewConfiguration.java](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/view/ViewConfiguration.java) (TOUCH_SLOP 8 dp, fling minimo 50 dp/s, pressione lunga 400 ms), [Accessibilità, 48 dp](https://developer.android.com/guide/topics/ui/accessibility/apps), [VibrationEffect](https://developer.android.com/reference/android/os/VibrationEffect)
- Web: [MDN, Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API), [W3C Gamepad, mappatura standard](https://w3c.github.io/gamepad/)
