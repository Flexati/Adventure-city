# CHRONOS Adventure: Nox & Lulù — Fase 1, benchmark

2 novembre 2026 · rivista: decisioni in [DECISIONI.md](../../gold/DECISIONI.md) (D18–D26) · `COMMERCIAL_RELEASE = BLOCKED`

> **Nota.** Questa fase conta 4 boss e 4 scelte. I numeri corretti (5 boss, 10 scelte salvate) sono nella [Fase 3](CHRONOS_FASE_3_SINTESI.md).

**Legenda**
- **[FATTO]**: verificato su una fonte esterna (link in fondo) o nel repo.
- **[IPOTESI]**: stima o giudizio del team, non verificato.

## Prospettiva che prevale: Product Analyst

La consegna chiede riferimenti *premium mobile*. Quindi i titoli sono scelti in base a due cose: se oggi si possono comprare su Android, e se esistono dati pubblici su prezzo e recensioni.

- **Game Designer:** ha valutato quanto ogni titolo è vicino a CHRONOS come meccanica. Ha un disaccordo, scritto al §4.
- **Tech Lead:** ha controllato soltanto le conversioni per mobile e i controlli touch.

## 1. Criteri di scelta

Ogni criterio vale da 0 a 2 punti, per un massimo di 10. I punteggi sono un giudizio del team **[IPOTESI]**.

| Criterio | Perché conta per CHRONOS |
|---|---|
| **A.** Si compra oggi su Android | CHRONOS esce sul Play Store. Servono i giochi che il giocatore Android trova accanto al nostro |
| **B.** Combattimento d'azione su touch | Perfect Dodge e contrattacco, con il joystick flottante |
| **C.** Narrativa, scelte, identità | Campagna con scelte che restano; tema «nessuno deve decidere chi sei al posto tuo» |
| **D.** Duo o veicoli | Nox con Lulù, e la Vortex, sono i tratti che ci distinguono |
| **E.** Dati pubblici su prezzo, DLC e recensioni | Servono in Fase 3 al punto E: demo, prezzo, momenti di acquisto |

## 2. Verifica dei 7 titoli proposti

| Titolo | Su mobile oggi **[FATTO]** | A | B | C | D | E | Tot. | Esito |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|---|
| **Hades** | Solo su iOS, tramite Netflix, da marzo 2024. Supergiant ha detto di non avere piani per Android. A giugno 2025 Netflix ha annunciato di toglierlo dal catalogo mobile a luglio 2025. Non ho trovato una versione a pagamento | 0 | 2 | 2 | 0 | 0 | **4** | **Sostituito** |
| **Katana Zero** | Su iOS e Android tramite Netflix da maggio 2024, nella stessa lista di rimozioni di luglio 2025. Devolver ha detto di volerlo riportare negli store come gioco a pagamento, ma non ho trovato il rilancio | 0 | 2 | 2 | 0 | 1 | **5** | **Sostituito** (disaccordo, §4) |
| **Dead Cells** | Android da giugno 2020, a pagamento: 9,99 $ di listino. DLC su mobile (listino App Store): 3,99 € per The Bad Seed, Fatal Falls e The Queen and the Sea, 7,99 € per Return to Castlevania | 2 | 2 | 0 | 0 | 2 | **6** | Resta |
| **GTA Chinatown Wars** | Android dal 2015, a pagamento: 4,99 $, cioè circa 4,49 € | 2 | 1 | 1 | 2 | 2 | **8** | Resta |
| **Brothers: A Tale of Two Sons** | Android da maggio 2016, lanciato in offerta a 3,29 €. Racconta senza parole | 2 | 0 | 2 | 2 | 1 | **7** | Resta |
| **Hyper Light Drifter** | Android con la «Special Edition» di Abylight, a pagamento, con una modalità e armi in più. Prezzo e voto cambiano molto tra le fonti (3,6 contro 4,6) | 2 | 2 | 1 | 0 | 1 | **6** | Resta |
| **Chrono Trigger** | Android dal 2012, a pagamento: 9,99 $. La prima conversione per mobile è stata criticata, poi rifatta con la «Upgrade Ver.». Ci sono lamentele per i crash | 2 | 0 | 2 | 1 | 2 | **7** | Resta |

**Da verificare sulla scheda del Play Store:**
- **GTA Chinatown Wars:** una fonte debole lo dà come «prova gratuita, poi sblocco» **[IPOTESI]**. Se è vero, diventa un secondo esempio del modello demo più sblocco.
- **Chrono Trigger:** il voto, 3,7 su Android contro 4,5 su iOS, viene da un sito aggregatore poco affidabile.

## 3. Le due sostituzioni (il massimo consentito)

### Hades → Children of Morta

**I fatti [FATTO]**
- Su Android e iOS dal 7 ottobre 2024, pubblicato da Playdigious, lo stesso editore mobile di Dead Cells.
- È la Complete Edition, con i due DLC inclusi. La co-op online è arrivata con un aggiornamento.
- Al lancio costava 9,99 € o $. Oggi i siti che seguono i prezzi lo danno più basso, ma i valori non coincidono.

**Perché va meglio di Hades**
- È top-down in pixel art, come CHRONOS.
- La storia di una famiglia avanza tra una partita e l'altra: è la stessa lezione di Hades.
- Ha più personaggi giocabili, con abilità diverse: è vicino a Nox e Lulù.
- **Ha recensioni Android sui controlli touch.** La critica più frequente riguarda la mira e la reattività quando arrivano molti nemici insieme. È la lezione più diretta per il nostro joystick flottante.

**Punteggio:** A2 · B2 · C2 · D2 · E2 = **10**.

### Katana Zero → Grimvalor

**I fatti [FATTO]**
- Su Android, il primo atto è gratuito (1–2 ore). Il resto si sblocca con un solo acquisto da 6,99 $, senza altre microtransazioni.
- Ha circa 6 milioni di installazioni e un voto di circa 4,7 (dati AppGoblin).
- È ancora aggiornato nel 2026.

**Da verificare:** Android Central parla di pubblicità nella parte gratuita. Conta, perché CHRONOS promette di non avere pubblicità forzata.

**Perché va meglio di Katana Zero**
- È l'unico titolo con **esattamente l'ipotesi di CHRONOS**: demo gratuita più sblocco unico, su un gioco d'azione Android e con dati pubblici.
- La schivata e le combo su touch sono molto lodate.

**Limite:** è un gioco d'azione 3D a scorrimento laterale, non top-down in pixel art. Lo usiamo per il modello di vendita e per i controlli, non per lo stile.

**Punteggio:** A2 · B2 · C0 · D0 · E2 = **6**.

## 4. Disaccordo del Game Designer

Il Game Designer avrebbe tenuto Katana Zero, perché tre sue idee sono le più vicine a Nox. Le teniamo come note di design, senza una scheda completa, e tornano in Fase 3 tra i pattern:

1. **Dialoghi interrompibili in tempo reale.** Si sceglie con il tempismo, non solo da un menu.
2. **Un'identità imposta da altri**, scoperta poco alla volta: è il caso di Nox ed EVE-47.
3. **Rimandare indietro i proiettili con il tempismo.** È vicino a Perfect Dodge più contrattacco.

Da Hades teniamo una nota: **la storia va avanti anche quando perdi.** Dopo ogni sconfitta c'è una battuta nuova.

**Alternativa:** puoi tenere Katana Zero al posto di Hyper Light Drifter. Si perde un gioco a pagamento su Android dello stesso genere; si guadagna il tema dell'identità.

## 5. Benchmark finale, con la domanda a cui risponde ciascuno

| # | Titolo | Domanda per CHRONOS | Prospettiva |
|---|---|---|---|
| 1 | Dead Cells | Come si porta un'azione veloce sul touch senza perdere precisione? Come si vendono DLC dopo un lancio a pagamento? | Tech Lead, Product |
| 2 | GTA Chinatown Wars | Come si alternano missioni a piedi e guida in top-down, con partite brevi da telefono? | Game Designer |
| 3 | Brothers | Come si rende chiaro un duo su un solo schermo? Quanto può essere corto un gioco narrativo a pagamento senza recensioni negative sulla durata? | Game Designer, Product |
| 4 | Hyper Light Drifter | Top-down in pixel art con lo scatto: cosa dicono i giocatori Android di difficoltà e controlli? | Game Designer |
| 5 | Chrono Trigger | Come si usano viaggio nel tempo, tecniche combinate (la nostra Mossa Duo) e finali multipli? Quanto pesa nelle recensioni una conversione per mobile fatta male? | Game Designer, Product |
| 6 | Children of Morta | Come si racconta una famiglia tra una partita e l'altra? Perché i controlli touch sono la critica principale? | Tech Lead, Game Designer |
| 7 | Grimvalor | Su Android il modello «primo atto gratis, poi sblocco unico» funziona per un gioco d'azione? | Product Analyst |

### Cosa nessun benchmark copre bene

- **Scelte che restano dentro un gioco d'azione:** le copre solo in parte Chrono Trigger, con i finali multipli.
- **Gare alternate alla campagna:** c'è solo GTA Chinatown Wars, che però non ha scelte.

In Fase 2 lo segnalo nei punti in cui serve, senza aggiungere titoli.

## 6. Punti del brief da chiarire prima della Fase 2

Fonte: il repo locale `Flexati/Adventure-city`, ramo `work/chronos-adventure-commercial`, commit `583e68b`.

1. **Prezzo.** Il brief dice 4,99 €. I documenti dalla v0.7 alla v9 dicono 4,99 €, ma il mandato V10.2 dice «Prezzo obiettivo: €5,99 una tantum». **Quale vale?**
2. **Stato del gioco.** Il brief parla di «vertical slice v0.7». Il repo è alla versione `0.10.0-v8.0-rc.2`, con 31 tappe per rotta e 4 boss in campagna (Rook, The Anchor, lo Specchio nell'Archivio, Archon). Il brief descrive una build più vecchia, oppure un'altra build?
3. **Durata.** Questa è una stima fatta dai test automatici, non una misura su giocatori: `ESTIMATE_NOT_HUMAN`, nessuna persona ha ancora giocato.
   - **Campagna obbligatoria, valore probabile:** 38–45 minuti (rotta A 41,9, B 44,5, C 37,9).
   - **Contenuti facoltativi:** circa 13 minuti in più.
   - **Obiettivo dell'autore:** almeno 105 minuti.

   Per il Product Analyst è il rischio commerciale più grande: un gioco da 5,99 € con meno di un'ora di campagna rischia recensioni «troppo corto». In Fase 2 riporto la durata di ogni benchmark per il confronto.
4. **Repo.** Il brief indica `amzajaguar-blip/chronos-adventure`, con la build `ChronosShatterPremium v2.0.0` e 8 checkpoint di Manus. Quel repo non è collegato a questa sessione: io lavoro su `Flexati/Adventure-city`. **Quale dei due è la fonte di verità** per le azioni «→ CHRONOS»? Per la Fase 2 non serve; per le Fasi 3 e 4 sì.
5. **Boss.** Il brief cita 8 boss nell'espansione V8.5, ma la campagna ne ha 4. Gli altri 4 sono da valutare nel taglio di scope (Fase 3, punto G)?

## Fonti

- Hades, solo iOS tramite Netflix: [GamesRadar](https://www.gamesradar.com/hades-our-2020-goty-and-one-of-the-best-roguelikes-of-all-time-is-coming-to-apple-phones-exclusively-through-netflix-games), [Mobile Matters](https://mobilematters.gg/guides/gaming/how-to-play-hades-on-netflix-does-it-support-android)
- Rimozioni Netflix di luglio 2025 (Hades, Katana Zero): [Game Informer](https://gameinformer.com/2025/06/25/netflix-is-delisting-over-20-games-from-its-mobile-library-next-month-including-hades), [9to5Mac](https://9to5mac.com/2025/06/24/netflix-is-pulling-the-plug-on-21-indie-games/), [What's on Netflix](https://www.whats-on-netflix.com/news/netflix-games/netflix-to-remove-over-20-mobile-games-including-monument-valley-trilogy-and-hades)
- Katana Zero su Netflix, Android e iOS: [TouchArcade](https://toucharcade.com/2024/05/21/katana-zero-mobile-download-android-iphone-netflix-games-release-now-available/), [laps4](https://www.laps4.com/preguntas-y-respuestas/netflix-elimino-katana-zero)
- Dead Cells su Android e i DLC: [TouchArcade, lancio Android](https://toucharcade.com/2020/06/03/dead-cells-download-android-google-play-price-playdigious-premium/), [TouchArcade, Bad Seed](https://toucharcade.com/2021/03/30/dead-cells-bad-seed-dlc-mobile-download-out-now-ios-android-price-playdigious-motion-twin/), [iPhoneSoft, Queen and the Sea](https://iphonesoft.fr/2022/04/07/dead-cells-accueille-dlc-the-queen-and-the-sea-divise-prix-deux), [App Store](https://apps.apple.com/ie/app/dead-cells/id1389752090)
- GTA Chinatown Wars su Android: [Pocket Gamer](https://www.pocketgamer.com/gta-chinatown-wars-hd/rockstar-finally-brings-gta-chinatown-wars-to-android-4-years-after-ios-version), [cashkr (fonte debole)](https://www.cashkr.com/articles/gta-games-on-phone)
- Brothers su Android: [Android Police](https://www.androidpolice.com/2016/05/28/story-focused-platformer-brothers-a-tale-of-two-sons-jumps-from-pc-and-consoles-to-the-play-store-for-3/), [Xataka Android](https://www.xatakandroid.com/juegos-android/brothers-a-tale-of-two-sons-la-aclamada-aventura-de-plataformas-y-puzles-llega-a-android)
- Hyper Light Drifter S.E. su Android: [Droidgamers](https://www.droidgamers.com/news/hyper-light-drifter-special-edition/), [App Pricing Lab](https://apppricinglab.com/app/google_play/com.abylight.HyperLightDrifter)
- Chrono Trigger su Android: [Droid Life](https://www.droid-life.com/2012/10/29/chrono-trigger-lands-in-google-play-cult-classic-for-9-99/), [Android Authority](https://www.androidauthority.com/chrono-trigger-upgraded-sale-980285), [App Pricing Lab](https://apppricinglab.com/app/google_play/com.square_enix.android_googleplay.chrono)
- Children of Morta su mobile: [Playdigious, lancio](https://playdigious.com/?p=4000), [Pocket Gamer](https://www.pocketgamer.com/children-of-morta/out-now), [recensione Pocket Gamer](https://www.pocketgamer.com/children-of-morta/review), [recensione 148Apps](https://www.148apps.com/children-of-morta/review), [App Pricing Lab](https://apppricinglab.com/app/google_play/com.playdigious.childrenofmorta)
- Grimvalor su Android: [Android Central](https://www.androidcentral.com/grimvalor-beautifully-polished-platformer-you-can-try-out-free-game-week), [TouchArcade, discussione dello sviluppatore](https://toucharcade.com/community/threads/grimvalor-by-direlight-a-dark-fantasy-rpg-hack-em-up-platformer.398266/), [AppGoblin](https://appgoblin.info/apps/com.direlight.grimvalor)
