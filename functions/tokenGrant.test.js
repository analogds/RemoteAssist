import test from 'node:test';
import assert from 'node:assert/strict';
import { authorize, mintToken } from './tokenGrant.js';

const session = (uid, provider, extra = {}) => ({
  uid,
  token: { firebase: { sign_in_provider: provider }, email: `${uid}@example.com`, ...extra },
});
const headset = session('headset-op1', 'custom', { headset: true, deviceId: 'dev1', operatorId: 'op1' });

function deps(accounts = {}, operators = { op1: 'Ada' }) {
  const loaded = [];
  return {
    loaded,
    loadAccount: async (uid) => {
      loaded.push(uid);
      return accounts[uid] ?? { profile: null, authDisabled: null };
    },
    getOperatorName: async (id) => operators[id] ?? null,
  };
}

const enabled = (profile) => ({ profile, authDisabled: false });

test('a headset joins as its own uid, named after its operator', async () => {
  const d = deps();
  assert.deepEqual(await authorize(headset, d), { identity: 'headset-op1', name: 'Ada' });
  assert.deepEqual(d.loaded, [], 'a headset has no LMS profile to check');
});

test('a headset whose operator has no name falls back to the operator id', async () => {
  assert.equal((await authorize(headset, deps({}, {}))).name, 'op1');
});

test('an enabled moderator or admin joins as their uid', async () => {
  const d = deps({
    m1: enabled({ role: 'moderator', displayName: ' Pat Lee ' }),
    a1: enabled({ role: 'admin' }),
  });
  assert.deepEqual(await authorize(session('m1', 'password'), d), { identity: 'm1', name: 'Pat Lee' });
  assert.deepEqual(await authorize(session('a1', 'google.com', { name: 'Ada' }), d), { identity: 'a1', name: 'Ada' });
});

test('signed out is unauthenticated', async () => {
  await assert.rejects(authorize(undefined, deps()), { code: 'unauthenticated' });
});

test('everyone else is permission-denied', async () => {
  const d = deps({
    learner: enabled({ role: 'user' }),
    flagged: enabled({ role: 'admin', isDisabled: true }),
    authOff: { profile: { role: 'admin' }, authDisabled: true },
    staff: enabled({ role: 'admin' }),
  });
  const refused = [
    session('learner', 'password'),
    session('flagged', 'password'),
    session('authOff', 'password'),
    session('nobody', 'password'), // no profile, no Auth user
    session('staff', 'custom'), // custom token without the headset claim
    session('staff', 'anonymous'),
    { ...headset, token: { ...headset.token, headset: 'true' } }, // claim must be literally true
  ];
  for (const auth of refused) {
    await assert.rejects(authorize(auth, d), { code: 'permission-denied' }, auth.uid);
  }
});

test('the token is for the given identity and room, and lives 10 minutes', async () => {
  const jwt = await mintToken({
    apiKey: 'APItest',
    apiSecret: 'testsecrettestsecrettestsecret12',
    identity: 'headset-op1',
    name: 'Ada',
    room: 'msc-support',
  });
  const claims = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
  assert.equal(claims.sub, 'headset-op1');
  assert.equal(claims.name, 'Ada');
  assert.equal(claims.exp - claims.nbf, 600);
  assert.deepEqual(claims.video, { roomJoin: true, room: 'msc-support', canPublish: true, canSubscribe: true });
});
