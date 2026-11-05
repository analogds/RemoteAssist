import { useState } from 'react'
import type { AssistGrant } from './grant'
import PreJoin, { type JoinChoices } from './PreJoin'
import Call from './room/Call'

function message(e: unknown): string {
  return e instanceof Error ? e.message : String(e)
}

/**
 * Device selection, then the call; leaving the call comes back here. A fresh grant is fetched on
 * every Join, since a token only lives 10 minutes (functions/tokenGrant.js).
 */
export default function Session({ getGrant }: { getGrant: () => Promise<AssistGrant> }) {
  const [call, setCall] = useState<{ grant: AssistGrant; choices: JoinChoices }>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const join = async (choices: JoinChoices) => {
    setBusy(true)
    setError(undefined)
    try {
      setCall({ grant: await getGrant(), choices })
    } catch (e) {
      setError(`Could not join: ${message(e)}`)
    } finally {
      setBusy(false)
    }
  }

  if (!call) return <PreJoin onJoin={(c) => void join(c)} busy={busy} error={error} />
  return (
    <Call
      grant={call.grant}
      choices={call.choices}
      onLeave={(err) => {
        setCall(undefined)
        if (err) setError(`Disconnected: ${message(err)}`)
      }}
    />
  )
}
