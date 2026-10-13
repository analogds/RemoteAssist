import { HttpsError } from 'firebase-functions/v2/https';
import { AccessToken } from 'livekit-server-sdk';

const deny = (message) => new HttpsError('permission-denied', message);

// Same contract as Step Builder's checkAccount (Step-Builder/functions/src/authz.ts), copied
// because it lives in another repo: users/{uid}.role is moderator or admin, the profile is not
// isDisabled, and the Auth account is not disabled. authDisabled is null when the Auth user
// does not exist.
export function checkAccount(profile, authDisabled) {
  if (!profile || authDisabled === null) throw deny('No ThreadX staff account.');
  if (profile.isDisabled === true || authDisabled) throw deny('This account is disabled.');
  const role = profile.role;
  if (role !== 'moderator' && role !== 'admin') throw deny('Remote Assist is for ThreadX staff.');
  return role;
}

/**
 * Decides who may join Remote Assist and under what LiveKit identity.
 *
 * A headset session (the `headset` claim minted by exchangePin) is let in as its own uid,
 * `headset-<operatorId>`. Anyone else must be a real LMS account that is an enabled moderator
 * or admin; anonymous and other custom-token sessions are refused.
 *
 * Deps are injected so the logic runs in a plain unit test:
 *   loadAccount(uid) -> { profile, authDisabled }
 *   getOperatorName(operatorId) -> string | null
 */
export async function authorize(auth, { loadAccount, getOperatorName }) {
  if (!auth) throw new HttpsError('unauthenticated', 'Sign-in is required.');
  const token = auth.token ?? {};

  if (token.headset === true) {
    const operatorId = typeof token.operatorId === 'string' ? token.operatorId : null;
    const operatorName = operatorId ? await getOperatorName(operatorId) : null;
    return { identity: auth.uid, name: operatorName || operatorId || auth.uid };
  }

  const provider = token.firebase?.sign_in_provider;
  if (provider === 'anonymous' || provider === 'custom') throw deny('Sign in with a ThreadX staff account.');

  const { profile, authDisabled } = await loadAccount(auth.uid);
  checkAccount(profile, authDisabled);
  const profileName = typeof profile?.displayName === 'string' ? profile.displayName.trim() : '';
  return { identity: auth.uid, name: profileName || token.name || token.email || auth.uid };
}

// The server fixes the room; the caller only gets a short-lived join token for it. LiveKit
// refreshes the token for connected clients, so 10 minutes only bounds the join.
export async function mintToken({ apiKey, apiSecret, identity, name, room }) {
  const at = new AccessToken(apiKey, apiSecret, { identity, name, ttl: '10m' });
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });
  return at.toJwt();
}
