import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { AssistGrant } from './grant'
import type { JoinChoices } from './PreJoin'
import Session from './Session'

const choices: JoinChoices = { videoDeviceId: '', audioDeviceId: '', resolution: { width: 1280, height: 720 } }

vi.mock('./PreJoin', () => ({
  default: (p: { onJoin: (c: JoinChoices) => void; busy: boolean; error?: string }) => (
    <div>
      <button onClick={() => p.onJoin(choices)}>Join</button>
      {p.error && <p role="alert">{p.error}</p>}
    </div>
  ),
}))
vi.mock('./room/Call', () => ({
  default: (p: { grant: AssistGrant; onLeave: (e?: Error) => void }) => (
    <div>
      in call with {p.grant.token}
      <button onClick={() => p.onLeave()}>Leave</button>
      <button onClick={() => p.onLeave(new Error('signal lost'))}>Drop</button>
    </div>
  ),
}))

describe('Session', () => {
  it('fetches a fresh grant on every Join', async () => {
    let n = 0
    const getGrant = vi.fn(async () => ({ url: 'wss://lk', token: `t${++n}`, room: 'r' }))
    render(<Session getGrant={getGrant} />)

    await userEvent.click(screen.getByRole('button', { name: 'Join' }))
    expect(await screen.findByText('in call with t1')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Leave' }))
    await userEvent.click(screen.getByRole('button', { name: 'Join' }))
    expect(await screen.findByText('in call with t2')).toBeInTheDocument()
    expect(getGrant).toHaveBeenCalledTimes(2)
  })

  it('stays on device selection with the error when the grant fails', async () => {
    render(<Session getGrant={() => Promise.reject(new Error('permission denied'))} />)
    await userEvent.click(screen.getByRole('button', { name: 'Join' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not join: permission denied')
  })

  it('returns to device selection with the reason after a dropped call', async () => {
    render(<Session getGrant={async () => ({ url: 'u', token: 't', room: 'r' })} />)
    await userEvent.click(screen.getByRole('button', { name: 'Join' }))
    await userEvent.click(await screen.findByRole('button', { name: 'Drop' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Disconnected: signal lost')
  })
})
