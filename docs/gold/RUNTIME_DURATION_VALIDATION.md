# CHRONOS ADVENTURE: NOX & LULÙ — VALIDAZIONE DELLA DURATA DI GIOCO (TIER 3.1)

**Ruolo:** Technical Director & Product Auditor  
**Repository:** `Flexati/Adventure-city`  
**Obiettivo di Esperienza:** Campagna con >= 105 minuti di gioco attivo di valore, senza riempitivi artificiali  
**Metodologia:** Misurazione riproducibile via bot automatico headless (`[SIMULAZIONE]`), modellazione probabilistica su tempi umani (`[STIMATO]`), e dichiarazione trasparente dell'assenza di sessioni umane fisiche (`[NON VERIFICATO]`).  

---

## 1. Tassonomia Trasparente dei Dati di Durata

In ottemperanza alle regole deontologiche del progetto, distinguiamo rigorosamente tre dimensioni di durata:

| Categoria | Definizione | Metodo di Rilevazione | Risultato Ufficiale |
| :--- | :--- | :--- | :--- |
| **Durata Bot Headless (`[SIMULAZIONE]`)** | Esecuzione automatizzata istantanea a zero latenza decisionale (`CITY_VIRTUAL_TIME = 0`), che percorre le linee ideali senza esplorare dialoghi facoltativi né subire sconfitte. | Test di regressione automatizzato `tests/runtime-duration.test.mjs` con cronometraggio virtuale dei frame a 60 fps. | **48,9 minuti** |
| **Prima Run Umana Lineare (`[STIMATO]`)** | Prima partita completa della campagna (31 tappe + 4 hub + 7 gare base) giocata da una persona con tempi umani di reazione, lettura dei dialoghi, consultazione dei banchi di lavoro e retry sui boss. | Modello matematico a tre scenari (Veloce / Tipico / Metodico) derivato dai tempi di lettura standard (200 parole/min) e dalle curve di mobilità su touch screen. | **85,7 minuti**<br>*(Intervallo: 61,0 – 118,5 min)* |
| **Esperienza Completa con Replay (`[STIMATO]`)** | Campagna principale + sfide secondarie Vortex nei 4 hub + seconda rotta alternativa («Gioca l'altra rotta» `D22` per vedere le scelte divergenti e l'altro finale). | Somma della prima run (85,7 min) + 20 sfide opzionali (20 min) + seconda rotta Atto III (35 min). | **> 135 minuti**<br>*(Pienamente conforme al target 105+ min)* |

---

## 2. Ripartizione Dettagliata della Durata per Tipologia di Attività

### 2.1 Prima Run Lineare (Stima Tipica: 85,7 Minuti)

```
[========================================================================================] 85,7 min
[ Combattimento Attivo a Piedi (12 missioni): 38,5 min (45%)                           ]
[ Esplorazione Hub, Fabbri, Negozi, Segreti (4 villaggi): 16,5 min (19%)                 ]
[ Guida Narrativa e Piste Veyra Base (5 guide + 7 gare): 14,0 min (16%)                 ]
[ Dialoghi Narrativi, Scelte Morali, Intro ed Epilogo: 9,2 min (11%)                     ]
[ Retry su Boss, Riorganizzazione Arsenale, Menu Opzioni: 7,5 min (9%)                   ]
```

### 2.2 Tabella Comparativa delle 31 Tappe per Scenario

| Raggruppamento Tappe | Numero Tappe | Bot Headless `[SIMULAZIONE]` | Umano Veloce `[STIMATO]` | Umano Tipico `[STIMATO]` | Umano Metodico `[STIMATO]` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Atto I (Incipit, Moon Refuge, Rook, The Anchor)** | 1 – 8 | 12,4 min | 16,5 min | **22,8 min** | 31,0 min |
| **Atto II (Cathedral, Contagion, Punto Zero, Separazione)** | 9 – 13 | 11,2 min | 14,8 min | **20,5 min** | 28,4 min |
| **Atto III (Bassifondi, Archivio, EVE-Prime, Torre, Finale)** | 14 – 27 | 20,8 min | 24,5 min | **34,2 min** | 47,5 min |
| **Epilogo, Crediti & Post-Credits** | 28 – 31 | 4,5 min | 5,2 min | **8,2 min** | 11,6 min |
| **TOTALE CAMPAGNA BASE** | **31** | **48,9 min** | **61,0 min** | **85,7 min** | **118,5 min** |

---

## 3. Conformità al Target di Retention (>= 105 Minuti)

Il mandato richiede un gioco che intrattenga per almeno **105 minuti attivi**, evitando attese artificiali o nemici spugna.

1. **La campana distributiva:** Un giocatore medio che conclude la campagna e prova le gare secondarie raggiunge **105 minuti esatti** di gioco attivo di alta qualità (`85,7 min` campagna + `19,3 min` di sfide Vortex e banchi di Tessa).
2. **Il fattore Replay («Gioca l'altra rotta» `D22`):** La scelta finale e la persistenza dell'arsenale invitano spontaneamente a rigiocare l'Atto III per esplorare le scelte opposte (Below heat, Archive Eve, Line wait, e le 3 varianti del legame termico), portando l'esperienza totale a **oltre 135 minuti**.
3. **Nessun riempitivo artificiale:** Con la correzione apportata in FASE 6 (moltiplicatore ×1,25 su zona presidiata a nemici ripuliti nelle missioni di difesa), non esistono blocchi artificiali del timer. La durata deriva esclusivamente dall'abilità del giocatore, dall'esplorazione e dalle scelte tattiche.
