# CHRONOS: Nox & Lulù

Nome pubblico definitivo: **CHRONOS: Nox & Lulù**. Nel logo, CHRONOS è il titolo e
NOX & LULÙ il sottotitolo. Il ciano di Nox e il rosa di Lulù compongono un orologio
spezzato attorno al frammento di vetro. La domanda del gioco resta:
«Puoi proteggere qualcuno senza possederne le scelte?»

Il marchio sostituisce Adventure City / City Adventure in menu, titolo browser,
accessibilità, impostazioni e pausa, crediti, epilogo, caricamento ed errori Android,
nome sotto l’icona, icona e file APK. Il seguito mantiene il titolo Chrono Shadows
all’interno di CHRONOS. Vanta, Elyon, Nox, Lulù e il canone v8 restano gli stessi.

Build: `0.10.0-v8.0-rc.2`, Android versionCode 13.
APK: `dist/Chronos_Nox_Lulu_v8_RC_debug.apk`.
Il download diretto usa `/raw/refs/heads/build/chronos-v8-rc-<run>/dist/Chronos_Nox_Lulu_v8_RC_debug.apk`
su GitHub; i repository privati richiedono l’accesso al proprio account.

Le chiavi dei salvataggi, i namespace Android e l’API diagnostica conservano i nomi
interni precedenti per mantenere i progressi v7. I documenti storici e le evidenze
delle vecchie build conservano i nomi originali. Il rebranding non introduce una
migrazione o un azzeramento dei progressi della campagna v8.

Verifica locale: 94 test superati; menu, impostazioni e ingresso nel prologo
controllati con input browser su 360×800, 390×844, 412×915 e 844×390, senza overflow.
La CI verifica inoltre il titolo effettivamente caricato nella WebView Android.
