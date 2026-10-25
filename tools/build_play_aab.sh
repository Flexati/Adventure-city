#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
: "${PLAY_UPLOAD_KEYSTORE:?Set PLAY_UPLOAD_KEYSTORE to the private upload .jks or .keystore file.}"
: "${PLAY_UPLOAD_KEY_ALIAS:?Set PLAY_UPLOAD_KEY_ALIAS.}"
: "${PLAY_UPLOAD_STORE_PASSWORD:?Set PLAY_UPLOAD_STORE_PASSWORD.}"
: "${PLAY_UPLOAD_KEY_PASSWORD:?Set PLAY_UPLOAD_KEY_PASSWORD.}"

export AAB_PACKAGE_NAME='jaguarZcreatorZ13.app'
export AAB_VERSION_CODE="${PLAY_VERSION_CODE:-1}"
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

exec bash "$PROJECT_ROOT/tools/build_aab.sh"
