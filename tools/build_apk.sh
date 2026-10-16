#!/usr/bin/env bash
set -euo pipefail
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SDK_DIR="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
if [[ -z "$SDK_DIR" ]]; then echo 'Set ANDROID_SDK_ROOT to an SDK with platform 35 and build-tools 35.0.0.' >&2; exit 1; fi
BT="$SDK_DIR/build-tools/35.0.0"
PLATFORM="$SDK_DIR/platforms/android-35/android.jar"
BUILD_DIR="$PROJECT_ROOT/android/build"
mkdir -p "$BUILD_DIR/assets" "$BUILD_DIR/classes" "$BUILD_DIR/dex" "$PROJECT_ROOT/dist"
python3 "$PROJECT_ROOT/tools/build_preview.py"
cp "$PROJECT_ROOT/preview.html" "$BUILD_DIR/assets/game.html"
"$BT/aapt2" compile --dir "$PROJECT_ROOT/android/res" -o "$BUILD_DIR/resources.zip"
"$BT/aapt2" link -o "$BUILD_DIR/unsigned.apk" -I "$PLATFORM" --manifest "$PROJECT_ROOT/android/AndroidManifest.xml" -A "$BUILD_DIR/assets" "$BUILD_DIR/resources.zip"
mapfile -t JAVA_SOURCES < <(find "$PROJECT_ROOT/android/src" -name '*.java' -type f | sort)
java --module jdk.compiler/com.sun.tools.javac.Main --release 8 -classpath "$PLATFORM" -d "$BUILD_DIR/classes" "${JAVA_SOURCES[@]}"
mapfile -t CLASS_FILES < <(find "$BUILD_DIR/classes" -name '*.class' -type f | sort)
"$BT/d8" --lib "$PLATFORM" --min-api 26 --output "$BUILD_DIR/dex" "${CLASS_FILES[@]}"
(cd "$BUILD_DIR/dex" && zip -q -j "$BUILD_DIR/unsigned.apk" classes.dex)
"$BT/zipalign" -f 4 "$BUILD_DIR/unsigned.apk" "$BUILD_DIR/aligned.apk"
KEYSTORE="$BUILD_DIR/debug.keystore"
if [[ ! -f "$KEYSTORE" ]]; then
 keytool -genkeypair -keystore "$KEYSTORE" -storepass android -keypass android -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -dname 'CN=Android Debug,O=City Adventure Test,C=IT' >/dev/null 2>&1
fi
OUTPUT="$PROJECT_ROOT/dist/City_Adventure_Pizza_Protocol_v0.2_debug.apk"
"$BT/apksigner" sign --ks "$KEYSTORE" --ks-key-alias androiddebugkey --ks-pass pass:android --key-pass pass:android --out "$OUTPUT" "$BUILD_DIR/aligned.apk"
"$BT/apksigner" verify --verbose "$OUTPUT"
"$BT/zipalign" -c 4 "$OUTPUT"
sha256sum "$OUTPUT"
printf '\nAPK: %s\n' "$OUTPUT"
