# Android App Bundle di test

`tools/build_aab.sh` produce un AAB tecnicamente valido con le risorse offline
della campagna, genera APK derivati tramite bundletool e ne verifica firma,
package e versionCode. Per la richiesta corrente il valore predefinito è `1`.

```sh
ANDROID_SDK_ROOT=/path/to/android-sdk \
BUNDLETOOL_JAR=/path/to/bundletool-all-1.18.3.jar \
npm run android:aab:test
```

Output predefinito: `dist/Chronos_Adventure_Nox_Lulu_vcode1_test.aab`.

Il bundle conserva intenzionalmente il package di test
`com.cityadventure.pizzaprotocol.debug`, `targetSdkVersion 35` e
`debuggable=true`. Se non viene indicato `AAB_KEYSTORE`, lo script crea una
chiave locale di test ignorata da Git. Questo artefatto serve a collaudare il
formato AAB: non va caricato come prima release Play perché package e chiave
diventerebbero vincoli permanenti. La release Play richiede applicationId scelto
dal titolare, target API conforme al momento dell’invio, variante non debug e
upload key privata conservata dal titolare.

## Variante Play

`tools/build_play_aab.sh` fissa il package `JaguarZcreatorZ13.app`, target API
36, `debuggable=false`, `versionCode 1` e `versionName 1.0.0`. A differenza della
build di test, rifiuta di procedere senza un keystore di upload già esistente:

```sh
PLAY_UPLOAD_KEYSTORE=/path/upload.jks \
PLAY_UPLOAD_KEY_ALIAS=alias \
PLAY_UPLOAD_STORE_PASSWORD='…' \
PLAY_UPLOAD_KEY_PASSWORD='…' \
ANDROID_SDK_ROOT=/path/android-sdk \
BUNDLETOOL_JAR=/path/bundletool-all-1.18.3.jar \
npm run android:aab:play
```

Il certificato di distribuzione Google con SHA-256
`D4:B5:3E:09:45:1D:2D:3B:C8:80:47:8C:98:03:49:BF:79:7D:A8:7E:8F:0C:66:F4:96:69:5F:E9:71:6B:2E:27`
è pubblico e serve per Digital Asset Links; non sostituisce la chiave privata di
upload richiesta da questo comando.

Una nuova chiave di upload può essere creata una sola volta per directory con
`npm run android:key:play`. Lo script non sovrascrive mai materiale esistente,
usa password casuali, imposta permessi locali restrittivi e salva keystore,
certificato PEM e credenziali sotto `dist/play-upload/`, escluso da Git.
