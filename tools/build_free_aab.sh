#!/usr/bin/env bash
# R55 (D95): the FREE app (jaguarZcreatorZ13.app.free): Act I free, one purchase (unlock_full_game) for the rest.
# Built with Gradle (android-free/) because Play Billing needs dependency resolution; the paid app keeps tools/build_play_aab.sh
# and is not touched. Same upload-key rules as the paid script: the key comes from the caller, this script never creates one.
#
#   export PLAY_UPLOAD_KEYSTORE=/path/upload.jks PLAY_UPLOAD_KEY_ALIAS=... PLAY_UPLOAD_STORE_PASSWORD=... PLAY_UPLOAD_KEY_PASSWORD=...
#   export ANDROID_SDK_ROOT=... (platform 36, build-tools 36.0.0)  JAVA_HOME=JDK 17  (gradle 8.13+ on PATH)
#   export BUNDLETOOL_JAR=... (optional, validates the bundle)  FREE_VERSION_CODE=1 (default)  FREE_EXPECTED_CERT_SHA256=... (optional)
#   bash tools/build_free_aab.sh
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
: "${PLAY_UPLOAD_KEYSTORE:?Set PLAY_UPLOAD_KEYSTORE to the private upload .jks or .keystore file.}"
: "${PLAY_UPLOAD_KEY_ALIAS:?Set PLAY_UPLOAD_KEY_ALIAS.}"
: "${PLAY_UPLOAD_STORE_PASSWORD:?Set PLAY_UPLOAD_STORE_PASSWORD.}"
: "${PLAY_UPLOAD_KEY_PASSWORD:?Set PLAY_UPLOAD_KEY_PASSWORD.}"
if [[ -z "${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}" ]]; then
  echo 'Set ANDROID_SDK_ROOT to an SDK with platform 36 and build-tools 36.0.0.' >&2; exit 1
fi
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
if [[ ! -f "$PLAY_UPLOAD_KEYSTORE" ]]; then
  echo "Upload keystore not found: $PLAY_UPLOAD_KEYSTORE (this script never creates one)." >&2; exit 1
fi
export FREE_VERSION_CODE="${FREE_VERSION_CODE:-1}"
export FREE_VERSION_NAME="${FREE_VERSION_NAME:-1.0.0}"
if [[ ! "$FREE_VERSION_CODE" =~ ^[1-9][0-9]*$ ]]; then
  echo 'FREE_VERSION_CODE must be a positive integer.' >&2; exit 1
fi
OUTPUT="${FREE_AAB_OUTPUT:-$PROJECT_ROOT/dist/Chronos_Adventure_Nox_Lulu_free_play_vcode${FREE_VERSION_CODE}.aab}"
mkdir -p "$(dirname "$OUTPUT")"

python3 "$PROJECT_ROOT/tools/prepare_android_assets.py"
( cd "$PROJECT_ROOT/android-free" && gradle --no-daemon -q :app:bundleRelease )
cp "$PROJECT_ROOT/android-free/app/build/outputs/bundle/release/app-release.aab" "$OUTPUT"

# Same signing step as the paid bundle (build_aab.sh): jarsigner, SHA256withRSA, then a strict verify.
java --module jdk.jartool/sun.security.tools.jarsigner.Main \
  -keystore "$PLAY_UPLOAD_KEYSTORE" -storepass "$PLAY_UPLOAD_STORE_PASSWORD" -keypass "$PLAY_UPLOAD_KEY_PASSWORD" \
  -sigalg SHA256withRSA -digestalg SHA-256 "$OUTPUT" "$PLAY_UPLOAD_KEY_ALIAS" >/dev/null
java --module jdk.jartool/sun.security.tools.jarsigner.Main \
  -verify -strict -keystore "$PLAY_UPLOAD_KEYSTORE" -storepass "$PLAY_UPLOAD_STORE_PASSWORD" "$OUTPUT" >/dev/null
BUNDLE_FINGERPRINT="$(LC_ALL=C keytool -printcert -jarfile "$OUTPUT" | sed -n 's/^[[:space:]]*SHA256: //p')"
if [[ -n "${FREE_EXPECTED_CERT_SHA256:-}" && "$BUNDLE_FINGERPRINT" != "$FREE_EXPECTED_CERT_SHA256" ]]; then
  echo 'Signed AAB certificate SHA-256 does not match FREE_EXPECTED_CERT_SHA256.' >&2; exit 1
fi

if [[ -n "${BUNDLETOOL_JAR:-}" && -f "$BUNDLETOOL_JAR" ]]; then
  java -jar "$BUNDLETOOL_JAR" validate --bundle="$OUTPUT" >/dev/null
  MANIFEST="$(java -jar "$BUNDLETOOL_JAR" dump manifest --bundle="$OUTPUT")"
  grep -q 'package="jaguarZcreatorZ13.app.free"' <<<"$MANIFEST"
  grep -q "android:versionCode=\"$FREE_VERSION_CODE\"" <<<"$MANIFEST"
  grep -q 'com.android.vending.BILLING' <<<"$MANIFEST"
  if grep -q 'android:debuggable="true"' <<<"$MANIFEST"; then echo 'The bundle is debuggable.' >&2; exit 1; fi
fi

sha256sum "$OUTPUT"
stat -c 'AAB bytes: %s' "$OUTPUT"
printf 'Signing certificate SHA-256: %s\n' "$BUNDLE_FINGERPRINT"
printf 'AAB: %s\n' "$OUTPUT"
