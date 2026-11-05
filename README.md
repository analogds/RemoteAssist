# ThreadX Remote Assist

The expert side of Remote Assist: a web app at **threadx.ai/assist** where ThreadX staff join a live video call with a field worker wearing a RealWear headset. Built with React, Vite and the [LiveKit JS SDK](https://github.com/livekit/client-sdk-js).

| Path | What it is |
|---|---|
| `src/` | The web app (React 19, TypeScript, Tailwind 4) |
| `functions/` | Firebase callable `remoteAssistToken`, which mints LiveKit tokens for the headset and the web app |
| `scripts/build-assist.sh` | Production build, called by the LMS deploy |
| `scripts/dev-room.sh` | Local LiveKit server plus a fake headset, for UI work |

## How it works

1. **Gate** (`src/Gate.tsx`). `/assist` is served from the same origin as the ThreadX LMS, so the LMS's Firebase sign-in is already present. The gate calls `remoteAssistToken`. That function decides access: moderators and admins get through, learners see "for ThreadX staff", and signed-out visitors are sent back to the LMS.
2. **Device selection** (`src/PreJoin.tsx`). Choose a camera and microphone, with a preview. Each **Join** fetches a fresh token, because tokens live 10 minutes.
3. **Call** (`src/room/`). The headset feed fills the view and other participants stack down the left edge. The bar underneath has mic, speaker, camera, screen share and leave. The chart button at top right shows live stats for the main tile.

## Develop

Needs Node 22 and, for a local call, `brew install livekit livekit-cli ffmpeg`.

```sh
npm install
scripts/dev-room.sh                              # terminal 1: LiveKit dev server + fake headset in room msc-support
VITE_ASSIST_DEV_ROOM=msc-support npm run dev     # terminal 2
open http://localhost:3002/assist/
```

With `VITE_ASSIST_DEV_ROOM` set, dev builds skip the sign-in gate (which can't pass on localhost) and sign their own token for the local server using its public dev key. Each browser tab joins as a separate expert. Production builds never include that code.

Without `VITE_ASSIST_DEV_ROOM`, `npm run dev` shows the real gate. On localhost it ends at "Sign in to ThreadX".

```sh
npm run lint
npm test          # Vitest
npm run build     # type-check + production build into dist/
```

## Deploy

This repo doesn't deploy itself. `LMS/threadx-web/scripts/build_all.sh` (threadx flavor) runs `scripts/build-assist.sh`. That script builds into `example/build/web`, and build_all.sh copies the result to `/assist` on Firebase Hosting with the rest of the LMS. Merging to `main` means the next LMS deploy ships it.

The token function deploys separately from `functions/`, with `firebase deploy --only functions:remote-assist`. Its secrets are `REMOTE_ASSIST_LIVEKIT_URL`, `REMOTE_ASSIST_LIVEKIT_API_KEY` and `REMOTE_ASSIST_LIVEKIT_API_SECRET`; the room comes from `functions/.env.<projectId>`.
