#!/usr/bin/env bash
set -euo pipefail

# Builds the expert web app for threadx.ai/assist into example/build/web.
# Called by LMS/threadx-web/scripts/build_all.sh, which copies example/build/web into
# build/web/assist. The output path is kept from the Flutter app this replaced, so build_all.sh
# needs no change; nothing else lives under example/.
#
# Needs Node 20+ and npm. Ignores FLUTTER_VERSION, which build_all.sh exports for its own build.
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$REPO_DIR/example/build/web"

cd "$REPO_DIR"
npm ci
npx tsc -b
npx vite build --outDir "$OUT_DIR" --emptyOutDir
