import { act, render, screen } from '@testing-library/react'
import { DisconnectReason, MediaDeviceFailure } from 'livekit-client'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import Call from './Call'

type RoomProps = {
  children: ReactNode
  onError: (e: Error) => void
  onMediaDeviceFailure: (failure?: MediaDeviceFailure, kind?: MediaDeviceKind) => void
  onDisconnected: (reason?: DisconnectReason) => void
}
let room: RoomProps

vi.mock('@livekit/components-react', () => ({
  LiveKitRoom: (p: RoomProps) => {
    room = p
    return <div>{p.children}</div>
  },
  RoomAudioRenderer: () => null,
}))
vi.mock('./RoomView', () => ({
  default: (p: { deviceErrors: string[] }) => (
    <div>
      {p.deviceErrors.map((m) => (
        <p key={m} role="alert">
          {m}
        </p>
      ))}
    </div>
  ),
}))

const grant = { url: 'wss://lk', token: 't', room: 'r' }
const choices = { videoDeviceId: '', audioDeviceId: '', resolution: { width: 1280, height: 720 } }
const deviceError = (name: string) => Object.assign(new Error('Permission denied'), { name })

function renderCall() {
  const onLeave = vi.fn<(e?: Error) => void>()
  render(<Call grant={grant} choices={choices} onLeave={onLeave} />)
  return onLeave
}

describe('Call', () => {
  it('stays in the call and reports it when the camera or mic cannot open', () => {
    const onLeave = renderCall()
    act(() => room.onError(deviceError('NotAllowedError')))
    expect(onLeave).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent(/permission/i)
  })

  it('reports a failed camera and a failed mic once each', () => {
    renderCall()
    act(() => room.onMediaDeviceFailure(MediaDeviceFailure.PermissionDenied, 'videoinput'))
    act(() => room.onMediaDeviceFailure(MediaDeviceFailure.PermissionDenied, 'audioinput'))
    act(() => room.onMediaDeviceFailure(MediaDeviceFailure.PermissionDenied, 'videoinput'))
    const alerts = screen.getAllByRole('alert').map((a) => a.textContent)
    expect(alerts).toHaveLength(2)
    expect(alerts[0]).toMatch(/camera/)
    expect(alerts[1]).toMatch(/microphone/)
  })

  it('leaves with the error when the connection itself fails', () => {
    const onLeave = renderCall()
    const err = new Error('could not establish signal connection')
    act(() => room.onError(err))
    expect(onLeave).toHaveBeenCalledWith(err)
  })

  it('leaves quietly when the user hung up', () => {
    const onLeave = renderCall()
    act(() => room.onDisconnected(DisconnectReason.CLIENT_INITIATED))
    expect(onLeave).toHaveBeenCalledTimes(1)
    expect(onLeave.mock.calls[0][0]).toBeUndefined()
  })

  it('leaves with a reason when the call dropped', () => {
    const onLeave = renderCall()
    act(() => room.onDisconnected(undefined))
    expect(onLeave.mock.calls[0][0]?.message).toMatch(/connection lost/i)

    const onLeave2 = renderCall()
    act(() => room.onDisconnected(DisconnectReason.ROOM_DELETED))
    expect(onLeave2.mock.calls[0][0]?.message).toMatch(/ROOM_DELETED/)
  })
})
