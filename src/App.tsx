import { lazy, Suspense } from 'react'
import { assistDevRoom } from './devRoom'
import Gate from './Gate'
import { Spinner } from './ui'

// The dev-room session pulls in the dev token signer. Behind import.meta.env.DEV, so production
// builds drop it entirely.
const DevSession = import.meta.env.DEV ? lazy(() => import('./DevSession')) : null

export default function App() {
  if (DevSession && assistDevRoom) {
    return (
      <Suspense fallback={<Spinner />}>
        <DevSession />
      </Suspense>
    )
  }
  return <Gate />
}
