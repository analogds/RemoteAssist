#!/usr/bin/env bash
set -euo pipefail

# Builds the expert web app (example/) for threadx.ai/assist into example/build/web.
# Called by LMS/threadx-web/scripts/build_all.sh, which copies the output into build/web/assist.
#
# Uses the same Flutter as the LMS release (3.35.2, the live site's version): run it with that
# SDK first on PATH, as build_all.sh is. FLUTTER_VERSION is inherited from build_all.sh.
FLUTTER_VERSION="${FLUTTER_VERSION:-3.35.2}"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

ACTUAL_FLUTTER="$(flutter --version --machine 2>/dev/null | sed -n 's/.*"frameworkVersion": *"\([^"]*\)".*/\1/p')"
if [ "$ACTUAL_FLUTTER" != "$FLUTTER_VERSION" ]; then
  echo "Flutter ${ACTUAL_FLUTTER:-not found} is on PATH; Remote Assist builds with Flutter $FLUTTER_VERSION. Run:" >&2
  echo "  PATH=\"\$HOME/flutter-sdks/$FLUTTER_VERSION/bin:\$PATH\" $0" >&2
  exit 1
fi

# Compile the E2EE web worker (mirrors .github/workflows/deploy-web.yaml).
cd "$REPO_DIR"
flutter pub get
dart compile js ./web/e2ee.worker.dart -o ./example/web/e2ee.worker.dart.js

cd "$REPO_DIR/example"
flutter pub get
flutter build web --release --base-href /assist/
