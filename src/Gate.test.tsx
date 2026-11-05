import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AssistGrant } from './grant'
import Gate from './Gate'

type AuthListener = (user: { uid: string } | null) => void
let authListener: AuthListener

vi.mock('./firebase', () => ({ auth: {}, functions: {} }))
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (_auth: unknown, cb: AuthListener) => {
    authListener = cb
    return () => {}
  },
}))
// A plain stub rather than vi.fn: Vitest 5 reports a vi.fn's rejected promise as a test failure
// once the mock has been reset or cleared, even though Gate catches it.
let grantResults: (() => Promise<AssistGrant>)[] = []
let grantCalls = 0
vi.mock('./grant', () => ({
  fetchAssistGrant: () => {
    const next = grantResults.length > 1 ? grantResults.shift()! : grantResults[0]
    grantCalls++
    return next ? next() : new Promise(() => {})
  },
}))
/** Results for the next calls, in order; the last one repeats. */
const willReturn = (...results: (() => Promise<AssistGrant>)[]) => (grantResults = results)
const ok = () => Promise.resolve(grant)
const fail = (code: string, message = code) => () => Promise.reject(callableError(code, message))
vi.mock('./Session', () => ({ default: () => <div>device selection</div> }))

const grant: AssistGrant = { url: 'wss://lk', token: 't', room: 'msc-support' }
const callableError = (code: string, message = code) => Object.assign(new Error(message), { code: `functions/${code}` })

/** A promise plus its resolve/reject, for holding a check open. */
function deferred<T>() {
  let resolve!: (v: T) => void
  let reject!: (e: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

async function signIn(uid: string | null) {
  await act(async () => authListener(uid ? { uid } : null))
}

beforeEach(() => {
  grantResults = []
  grantCalls = 0
})

describe('Gate', () => {
  it('shows a spinner until auth reports', () => {
    render(<Gate />)
    expect(screen.getByRole('status', { name: 'Checking access' })).toBeInTheDocument()
  })

  it('asks a signed-out visitor to sign in to ThreadX', async () => {
    render(<Gate />)
    await signIn(null)
    expect(screen.getByRole('heading', { name: 'Sign in to ThreadX' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to ThreadX' })).toBeInTheDocument()
    expect(grantCalls).toBe(0)
  })

  it('lets staff through to device selection', async () => {
    willReturn(ok)
    render(<Gate />)
    await signIn('staff')
    expect(await screen.findByText('device selection')).toBeInTheDocument()
  })

  it('treats an unauthenticated callable error as signed out', async () => {
    willReturn(fail('unauthenticated'))
    render(<Gate />)
    await signIn('stale')
    expect(await screen.findByRole('heading', { name: 'Sign in to ThreadX' })).toBeInTheDocument()
  })

  it('turns away a learner (permission-denied)', async () => {
    willReturn(fail('permission-denied'))
    render(<Gate />)
    await signIn('learner')
    expect(await screen.findByRole('heading', { name: 'Remote Assist is for ThreadX staff' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })

  it('reports other failures with a retry that can succeed', async () => {
    willReturn(fail('unavailable', 'service down'), ok)
    render(<Gate />)
    await signIn('staff')
    expect(await screen.findByRole('heading', { name: 'Remote Assist is unavailable' })).toBeInTheDocument()
    expect(screen.getByText(/service down/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('device selection')).toBeInTheDocument()
    expect(grantCalls).toBe(2)
  })

  it('checks once per user, and again for a different user', async () => {
    willReturn(ok)
    render(<Gate />)
    await signIn('a')
    await signIn('a') // token refresh: same uid
    expect(grantCalls).toBe(1)
    await signIn('b')
    expect(grantCalls).toBe(2)
  })

  it('goes back to sign-in when the user signs out in another tab', async () => {
    willReturn(ok)
    render(<Gate />)
    await signIn('staff')
    await screen.findByText('device selection')
    await signIn(null)
    expect(screen.getByRole('heading', { name: 'Sign in to ThreadX' })).toBeInTheDocument()
  })

  it('ignores a check that finishes after the user signed out', async () => {
    const pending = deferred<AssistGrant>()
    willReturn(() => pending.promise)
    render(<Gate />)
    await signIn('staff')
    await signIn(null)
    await act(async () => pending.resolve(grant))
    expect(screen.getByRole('heading', { name: 'Sign in to ThreadX' })).toBeInTheDocument()
    expect(screen.queryByText('device selection')).not.toBeInTheDocument()
  })
})
