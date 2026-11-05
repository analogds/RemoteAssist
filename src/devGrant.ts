import { SignJWT } from 'jose'
import { assistDevRoom } from './devRoom'
import type { AssistGrant } from './grant'

/**
 * A grant for `room` on `livekit-server --dev`, signed here with its public dev credentials
 * (devkey / secret). Each call is a new identity, so every tab is its own participant.
 */
export async function devAssistGrant(room: string = assistDevRoom): Promise<AssistGrant> {
  const identity = `dev-expert-${Math.floor(Math.random() * 0x10000).toString(16)}`
  const token = await new SignJWT({
    name: 'Dev Expert',
    video: { room, roomJoin: true, canPublish: true, canSubscribe: true },
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('devkey')
    .setSubject(identity)
    .setIssuedAt()
    .setExpirationTime('6h')
    .sign(new TextEncoder().encode('secret'))
  return { url: 'ws://localhost:7880', token, room }
}
