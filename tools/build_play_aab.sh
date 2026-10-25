#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
: "${PLAY_UPLOAD_KEYSTORE:?Set PLAY_UPLOAD_KEYSTORE to the private upload .jks or .keystore file.}"
: "${PLAY_UPLOAD_KEY_ALIAS:?Set PLAY_UPLOAD_KEY_ALIAS.}"
: "${PLAY_UPLOAD_STORE_PASSWORD:?Set PLAY_UPLOAD_STORE_PASSWORD.}"
: "${PLAY_UPLOAD_KEY_PASSWORD:?Set PLAY_UPLOAD_KEY_PASSWORD.}"
if [[ "$PLAY_UPLOAD_KEY_ALIAS" != 'chronos-upload' ]]; then
  echo 'PLAY_UPLOAD_KEY_ALIAS must be chronos-upload.' >&2
  exit 1
fi

export AAB_PACKAGE_NAME='jaguarZcreatorZ13.app'
export AAB_VERSION_CODE="${PLAY_VERSION_CODE:-2}"
export AAB_VERSION_NAME="${PLAY_VERSION_NAME:-1.0.0}"
export AAB_TARGET_SDK=36
export AAB_BUILD_TOOLS_VERSION=36.0.0
export AAB_DEBUGGABLE=false
export AAB_ACTIVITY_NAME='com.cityadventure.pizzaprotocol.debug.MainActivity'
export AAB_OUTPUT="${PLAY_AAB_OUTPUT:-$PROJECT_ROOT/dist/Chronos_Adventure_Nox_Lulu_play_vcode${AAB_VERSION_CODE}.aab}"
export AAB_KEYSTORE="$PLAY_UPLOAD_KEYSTORE"
export AAB_KEY_ALIAS="$PLAY_UPLOAD_KEY_ALIAS"
export AAB_STORE_PASSWORD="$PLAY_UPLOAD_STORE_PASSWORD"
export AAB_KEY_PASSWORD="$PLAY_UPLOAD_KEY_PASSWORD"
export AAB_REQUIRE_EXISTING_KEYSTORE=1
export AAB_EXPECTED_CERT_SHA256='6E:0A:ED:9C:FB:3F:92:30:E6:B7:8D:3F:95:E5:29:82:7D:2B:27:D4:C7:CF:79:BE:88:6B:9F:B6:64:51:59:DB'

exec bash "$PROJECT_ROOT/tools/build_aab.sh"
