import { httpsCallable } from 'firebase/functions'
import { functions } from './firebase'

/** A LiveKit join grant. The server picks the room; the caller only learns which one it is. */
export interface AssistGrant {
  url: string
  token: string
  room: string
}

/**
 * Asks the ThreadX `remoteAssistToken` callable (functions/index.js) for a fresh grant as the
 * signed-in user. Rejects with a FunctionsError: code `functions/unauthenticated` when signed out,
 * `functions/permission-denied` for a learner or a disabled account.
 */
export async function fetchAssistGrant(): Promise<AssistGrant> {
  const result = await httpsCallable<void, AssistGrant>(functions, 'remoteAssistToken')()
  const { url, token, room } = result.data
  return { url, token, room }
}
