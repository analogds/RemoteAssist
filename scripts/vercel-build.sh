#!/usr/bin/env bash
set -euo pipefail

# Pin an exact Flutter version rather than "latest stable" for reproducible,
# faster builds and to insulate this deploy from a future Dart 4 / Flutter 4.0
# stable release breaking the pubspec.yaml sdk constraint.
FLUTTER_VERSION="3.41.9"
FLUTTER_ROOT="$(pwd)/.flutter-sdk"

if [ ! -x "$FLUTTER_ROOT/bin/flutter" ]; then
  echo "Installing Flutter ${FLUTTER_VERSION}..."
  curl -fsSL -o /tmp/flutter.tar.xz \
    "https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_${FLUTTER_VERSION}-stable.tar.xz"
  mkdir -p "$(dirname "$FLUTTER_ROOT")"
  tar -xJf /tmp/flutter.tar.xz -C "$(dirname "$FLUTTER_ROOT")"
  mv "$(dirname "$FLUTTER_ROOT")/flutter" "$FLUTTER_ROOT"
fi

export PATH="$FLUTTER_ROOT/bin:$PATH"
git config --global --add safe.directory "$FLUTTER_ROOT"
flutter config --no-analytics
flutter doctor -v

# Compile the E2EE web worker (mirrors .github/workflows/deploy-web.yaml).
flutter pub get
dart compile js ./web/e2ee.worker.dart -o ./example/web/e2ee.worker.dart.js

cd example
flutter pub get
flutter build web --release
# No --base-href needed: Vercel serves from domain root, unlike GitHub Pages'
# /client-sdk-flutter/ subpath in deploy-web.yaml.
