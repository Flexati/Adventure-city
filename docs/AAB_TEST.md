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
