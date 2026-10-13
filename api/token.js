import { randomUUID } from 'node:crypto';
import { AccessToken } from 'livekit-server-sdk';

// 1-64 printable characters; no control characters.
const ROOM_NAME = /^[^\x00-\x1f\x7f]{1,64}$/u;

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const room = req.query.room;
  if (!room || typeof room !== 'string') {
    res.status(400).json({ error: 'Missing "room" query parameter' });
    return;
  }
  if (!ROOM_NAME.test(room)) {
    res.status(400).json({ error: 'Invalid "room": use 1-64 printable characters' });
    return;
  }

  const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    res.status(500).json({
      error: 'Server misconfigured: set LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET in Vercel project env vars',
    });
    return;
  }

  // The server picks the identity so a caller cannot pose as another participant.
  const identity = `user-${randomUUID().slice(0, 8)}`;

  // Short TTL: the token is only needed to join; LiveKit refreshes it for connected clients.
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, { identity, ttl: '10m' });
  at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });

  const token = await at.toJwt();
  res.status(200).json({ url: LIVEKIT_URL, token });
}
