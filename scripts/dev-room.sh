#!/usr/bin/env bash
set -euo pipefail

# Local LiveKit room for UI work on the expert web app, with no ThreadX sign-in and no live feed.
# Starts `livekit-server --dev` on localhost:7880 and a fake headset that loops a POV clip into ROOM.
# Then, in another terminal:
#   cd example && ~/flutter-sdks/3.35.2/bin/flutter run -d chrome --dart-define=ASSIST_DEV_ROOM=msc-support
# Every Chrome tab joins as its own dev expert. Ctrl-C stops everything.
#
# Needs: brew install livekit livekit-cli ffmpeg
# Usage: scripts/dev-room.sh [ROOM]   (ROOM defaults to msc-support; must match ASSIST_DEV_ROOM)
#        HEADSET_VIDEO=/path/clip.mp4 scripts/dev-room.sh   to loop another clip
ROOM="${1:-msc-support}"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HEADSET_VIDEO="${HEADSET_VIDEO:-$REPO_DIR/../RemoteAssist-DemoVideo/assets/clips/s5pov.mp4}"
VIDEO_PORT=16400

for tool in livekit-server lk ffmpeg; do
  command -v "$tool" >/dev/null || { echo "$tool not found. Run: brew install livekit livekit-cli ffmpeg" >&2; exit 1; }
done
[ -f "$HEADSET_VIDEO" ] || { echo "Headset clip not found: $HEADSET_VIDEO (set HEADSET_VIDEO)" >&2; exit 1; }

trap 'kill $(jobs -p) 2>/dev/null; wait 2>/dev/null' EXIT

# --dev listens on localhost only, with the public dev credentials devkey / secret.
SERVER_LOG="${TMPDIR:-/tmp}/livekit-dev.log"
livekit-server --dev >"$SERVER_LOG" 2>&1 &
until nc -z localhost 7880 2>/dev/null; do sleep 0.2; done
echo "LiveKit dev server on ws://localhost:7880 (log: $SERVER_LOG)"

# lk reads H.264 from a socket, so ffmpeg loops the clip into one in real time.
ffmpeg -loglevel error -re -stream_loop -1 -i "$HEADSET_VIDEO" -an \
  -c:v libx264 -bsf:v h264_mp4toannexb -b:v 2M -profile:v baseline -pix_fmt yuv420p \
  -x264-params keyint=60 -bf 0 -max_delay 0 \
  -listen 1 -f h264 "tcp://127.0.0.1:$VIDEO_PORT" &
# No port probe here: ffmpeg serves exactly one connection, and a probe would take it.
sleep 1

echo "Fake headset joining room '$ROOM' with $(basename "$HEADSET_VIDEO"). Ctrl-C to stop."
lk --dev --url ws://localhost:7880 room join --identity headset-dev --publish "h264://127.0.0.1:$VIDEO_PORT" --fps 30 "$ROOM"
