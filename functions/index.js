import { setGlobalOptions } from 'firebase-functions/v2/options';
import { onCall } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { authorize, mintToken } from './tokenGrant.js';

// us-east1 is where the threadx-demo Firestore database and the other ThreadX functions live.
setGlobalOptions({ region: 'us-east1' });
initializeApp();

// Set with: firebase functions:secrets:set REMOTE_ASSIST_LIVEKIT_URL (and _API_KEY, _API_SECRET).
// Namespaced so this codebase never touches a secret the LMS or Step Builder owns.
const LIVEKIT_URL = defineSecret('REMOTE_ASSIST_LIVEKIT_URL');
const LIVEKIT_API_KEY = defineSecret('REMOTE_ASSIST_LIVEKIT_API_KEY');
const LIVEKIT_API_SECRET = defineSecret('REMOTE_ASSIST_LIVEKIT_API_SECRET');

// functions/.env.<projectId>: msc-support on threadx-demo, msc-support-staging on rehearsal.
const ROOM = defineString('REMOTE_ASSIST_ROOM');

async function loadAccount(uid) {
  const [snap, authDisabled] = await Promise.all([
    getFirestore().collection('users').doc(uid).get(),
    getAuth().getUser(uid).then(
      (u) => u.disabled,
      (err) => {
        if (err?.code === 'auth/user-not-found') return null;
        throw err;
      },
    ),
  ]);
  return { profile: snap.exists ? (snap.data() ?? null) : null, authDisabled };
}

async function getOperatorName(operatorId) {
  const snap = await getFirestore().collection('operators').doc(operatorId).get();
  const name = snap.get('name');
  return typeof name === 'string' && name.trim() ? name.trim() : null;
}

// Called by the headset (raw callable protocol) and by the /assist expert web app.
export const remoteAssistToken = onCall(
  { secrets: [LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET] },
  async (request) => {
    const { identity, name } = await authorize(request.auth, { loadAccount, getOperatorName });
    const room = ROOM.value();
    const token = await mintToken({
      apiKey: LIVEKIT_API_KEY.value(),
      apiSecret: LIVEKIT_API_SECRET.value(),
      identity,
      name,
      room,
    });
    return { url: LIVEKIT_URL.value(), token, room };
  },
);
