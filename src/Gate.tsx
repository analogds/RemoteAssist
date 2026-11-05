import { onAuthStateChanged } from 'firebase/auth'
import { useCallback, useEffect, useRef, useState } from 'react'
import { auth } from './firebase'
import { fetchAssistGrant } from './grant'
import Session from './Session'
import { Notice, Spinner } from './ui'

type Access = 'checking' | 'signedOut' | 'notStaff' | 'failed' | 'allowed'

/** Firebase callable errors carry `functions/<code>`; accept the bare code too. */
function errorCode(e: unknown): string | undefined {
  const code = (e as { code?: unknown } | null)?.code
  return typeof code === 'string' ? code.replace(/^functions\//, '') : undefined
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * Entry point at threadx.ai/assist. The LMS session is shared (same site, same Firebase app), so a
 * signed-in moderator or admin goes straight to device selection. Access is the token function's
 * decision, not the client's: the gate just asks it once per user.
 */
export default function Gate() {
  const [access, setAccess] = useState<Access>('checking')
  const [error, setError] = useState<string>()
  const checkedUid = useRef<string | null>(null)
  // Drops results from a check that a later sign-in or sign-out has superseded.
  const checkSeq = useRef(0)

  const check = useCallback(async () => {
    const seq = ++checkSeq.current
    setAccess('checking')
    try {
      await fetchAssistGrant()
      if (seq === checkSeq.current) setAccess('allowed')
    } catch (e) {
      if (seq !== checkSeq.current) return
      setError(errorMessage(e))
      const code = errorCode(e)
      setAccess(code === 'unauthenticated' ? 'signedOut' : code === 'permission-denied' ? 'notStaff' : 'failed')
    }
  }, [])

  useEffect(
    // Also fires when the user signs out of the LMS in another tab.
    () =>
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          checkedUid.current = null
          checkSeq.current++
          setAccess('signedOut')
        } else if (user.uid !== checkedUid.current) {
          checkedUid.current = user.uid
          void check()
        }
      }),
    [check],
  )

  switch (access) {
    case 'checking':
      return <Spinner label="Checking access" />
    case 'allowed':
      return <Session getGrant={fetchAssistGrant} />
    case 'signedOut':
      return (
        <Notice
          title="Sign in to ThreadX"
          body="Remote Assist uses your ThreadX account. Sign in, then open Remote Assist from the menu."
          action="Go to ThreadX"
        />
      )
    case 'notStaff':
      return (
        <Notice
          title="Remote Assist is for ThreadX staff"
          body="Ask a ThreadX admin if you need to take Remote Assist calls."
          action="Back to Dashboard"
        />
      )
    case 'failed':
      return (
        <Notice
          title="Remote Assist is unavailable"
          body={`Could not reach the Remote Assist service: ${error}`}
          action="Back to Dashboard"
          onRetry={() => void check()}
        />
      )
  }
}
