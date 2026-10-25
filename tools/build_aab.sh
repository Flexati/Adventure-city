#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SDK_DIR="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
BUNDLETOOL_JAR="${BUNDLETOOL_JAR:-}"
VERSION_CODE="${AAB_VERSION_CODE:-1}"
OUTPUT="${AAB_OUTPUT:-$PROJECT_ROOT/dist/Chronos_Adventure_Nox_Lulu_vcode${VERSION_CODE}_test.aab}"
KEYSTORE="${AAB_KEYSTORE:-$PROJECT_ROOT/android/build/aab-test.keystore}"
KEY_ALIAS="${AAB_KEY_ALIAS:-chronostest}"
STORE_PASSWORD="${AAB_STORE_PASSWORD:-android}"
KEY_PASSWORD="${AAB_KEY_PASSWORD:-android}"

if [[ -z "$SDK_DIR" ]]; then
  echo 'Set ANDROID_SDK_ROOT to an SDK with platform 35 and build-tools 35.0.0.' >&2
  exit 1
fi
if [[ -z "$BUNDLETOOL_JAR" || ! -f "$BUNDLETOOL_JAR" ]]; then
  echo 'Set BUNDLETOOL_JAR to bundletool-all 1.18.3 or newer.' >&2
  exit 1
fi
if [[ ! "$VERSION_CODE" =~ ^[1-9][0-9]*$ ]]; then
  echo 'AAB_VERSION_CODE must be a positive integer.' >&2
  exit 1
fi

BT="$SDK_DIR/build-tools/35.0.0"
PLATFORM="$SDK_DIR/platforms/android-35/android.jar"
for required in "$BT/aapt2" "$BT/d8" "$BT/apksigner" "$PLATFORM"; do
  if [[ ! -e "$required" ]]; then
    echo "Missing Android build dependency: $required" >&2
    exit 1
  fi
done

mkdir -p "$PROJECT_ROOT/android/build" "$PROJECT_ROOT/dist" "$(dirname "$OUTPUT")"
BUILD_DIR="$(mktemp -d "$PROJECT_ROOT/android/build/aab.XXXXXX")"
mkdir -p "$BUILD_DIR/assets" "$BUILD_DIR/classes" "$BUILD_DIR/dex" "$BUILD_DIR/module"

sed -E "s/android:versionCode=\"[0-9]+\"/android:versionCode=\"$VERSION_CODE\"/" \
  "$PROJECT_ROOT/android/AndroidManifest.xml" > "$BUILD_DIR/AndroidManifest.xml"

python3 "$PROJECT_ROOT/tools/prepare_android_assets.py"
cp -a "$PROJECT_ROOT/android/build/assets/." "$BUILD_DIR/assets/"
"$BT/aapt2" compile --dir "$PROJECT_ROOT/android/res" -o "$BUILD_DIR/resources.zip"
"$BT/aapt2" link --proto-format -o "$BUILD_DIR/base-linked.apk" -I "$PLATFORM" \
  --manifest "$BUILD_DIR/AndroidManifest.xml" -A "$BUILD_DIR/assets" "$BUILD_DIR/resources.zip"

mapfile -t JAVA_SOURCES < <(find "$PROJECT_ROOT/android/src" -name '*.java' -type f | sort)
java --module jdk.compiler/com.sun.tools.javac.Main --source 8 --target 8 -encoding UTF-8 \
  -classpath "$PLATFORM" -d "$BUILD_DIR/classes" "${JAVA_SOURCES[@]}"
mapfile -t CLASS_FILES < <(find "$BUILD_DIR/classes" -name '*.class' -type f | sort)
"$BT/d8" --lib "$PLATFORM" --min-api 26 --output "$BUILD_DIR/dex" "${CLASS_FILES[@]}"

unzip -q "$BUILD_DIR/base-linked.apk" -d "$BUILD_DIR/module"
mkdir -p "$BUILD_DIR/module/manifest" "$BUILD_DIR/module/dex"
mv "$BUILD_DIR/module/AndroidManifest.xml" "$BUILD_DIR/module/manifest/AndroidManifest.xml"
cp "$BUILD_DIR/dex/classes.dex" "$BUILD_DIR/module/dex/classes.dex"
(cd "$BUILD_DIR/module" && zip -q -r "$BUILD_DIR/base.zip" . -x 'META-INF/*')

java -jar "$BUNDLETOOL_JAR" build-bundle \
  --modules="$BUILD_DIR/base.zip" --output="$BUILD_DIR/unsigned.aab"

if [[ ! -f "$KEYSTORE" ]]; then
  keytool -genkeypair -keystore "$KEYSTORE" -storepass "$STORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" -alias "$KEY_ALIAS" -keyalg RSA -keysize 2048 \
    -validity 10000 -dname 'CN=Chronos AAB Test,O=Chronos Test,C=IT' >/dev/null
fi

cp "$BUILD_DIR/unsigned.aab" "$OUTPUT"
java --module jdk.jartool/sun.security.tools.jarsigner.Main \
  -keystore "$KEYSTORE" -storepass "$STORE_PASSWORD" -keypass "$KEY_PASSWORD" \
  -sigalg SHA256withRSA -digestalg SHA-256 "$OUTPUT" "$KEY_ALIAS" >/dev/null
java --module jdk.jartool/sun.security.tools.jarsigner.Main \
  -verify -strict -keystore "$KEYSTORE" -storepass "$STORE_PASSWORD" "$OUTPUT" >/dev/null
java -jar "$BUNDLETOOL_JAR" validate --bundle="$OUTPUT" >/dev/null

APKS="$BUILD_DIR/derived.apks"
java -jar "$BUNDLETOOL_JAR" build-apks --bundle="$OUTPUT" --output="$APKS" \
  --mode=universal --ks="$KEYSTORE" --ks-key-alias="$KEY_ALIAS" \
  --ks-pass="pass:$STORE_PASSWORD" --key-pass="pass:$KEY_PASSWORD" >/dev/null
unzip -q "$APKS" universal.apk -d "$BUILD_DIR/derived"
"$BT/apksigner" verify --verbose "$BUILD_DIR/derived/universal.apk" >/dev/null

BADGING="$BUILD_DIR/badging.txt"
"$BT/aapt2" dump badging "$BUILD_DIR/derived/universal.apk" > "$BADGING"
grep -q "versionCode='$VERSION_CODE'" "$BADGING"
grep -q "package: name='com.cityadventure.pizzaprotocol.debug'" "$BADGING"

sha256sum "$OUTPUT"
stat -c 'AAB bytes: %s' "$OUTPUT"
grep -m1 '^package:' "$BADGING"
printf 'AAB: %s\n' "$OUTPUT"
printf 'Signing: generated/local test key; not a Play production upload key.\n'
