import { useMediaDeviceSelect, useRoomContext, useTrackToggle } from '@livekit/components-react'
import { Track } from 'livekit-client'
import { Check, ChevronUp, Mic, MicOff, MonitorOff, MonitorUp, PhoneOff, Video, VideoOff, Volume2 } from 'lucide-react'
import { useCallback, useState, type ReactNode } from 'react'
import { deviceName } from '../devices'
import { SCREEN_SHARE_CAPTURE, shareFailure } from './publish'
import { useOutsideClose } from './useOutsideClose'

const iconButton = 'flex items-center justify-center rounded-full p-3 text-neutral-50 hover:bg-white/10 disabled:opacity-50'

/** The bar under the video: mic, speaker, camera, screen share, leave. */
export default function Controls() {
  const mic = useTrackToggle({ source: Track.Source.Microphone })
  const camera = useTrackToggle({ source: Track.Source.Camera })
  const screen = useTrackToggle({ source: Track.Source.ScreenShare, captureOptions: SCREEN_SHARE_CAPTURE })
  const [error, setError] = useState<string>()
  const run = (p: Promise<unknown>) => p.catch((e: Error) => setError(e.message))
  const share = () =>
    screen.toggle().catch((e: Error) => {
      const outcome = shareFailure(e)
      if (outcome) setError(outcome)
    })
  const canPickOutput = typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype

  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3">
      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}{' '}
          <button className="underline" onClick={() => setError(undefined)}>
            Dismiss
          </button>
        </p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          className={iconButton}
          disabled={mic.pending}
          onClick={() => void run(mic.toggle())}
          title={mic.enabled ? 'Mute microphone' : 'Unmute microphone'}
          aria-label={mic.enabled ? 'Mute microphone' : 'Unmute microphone'}
        >
          {mic.enabled ? <Mic className="size-6" /> : <MicOff className="size-6 text-red-400" />}
        </button>
        <DeviceMenu kind="audioinput" label="Microphone" onError={setError} />

        {canPickOutput && (
          <>
            <span className="ml-3 p-3" aria-hidden>
              <Volume2 className="size-6" />
            </span>
            <DeviceMenu kind="audiooutput" label="Speaker" onError={setError} />
          </>
        )}

        <button
          className={`${iconButton} ml-3`}
          disabled={camera.pending}
          onClick={() => void run(camera.toggle())}
          title={camera.enabled ? 'Turn camera off' : 'Turn camera on'}
          aria-label={camera.enabled ? 'Turn camera off' : 'Turn camera on'}
        >
          {camera.enabled ? <Video className="size-6" /> : <VideoOff className="size-6 text-red-400" />}
        </button>
        <DeviceMenu kind="videoinput" label="Camera" onError={setError} />

        <button
          className={`${iconButton} ml-3`}
          disabled={screen.pending}
          onClick={() => void share()}
          title={screen.enabled ? 'Stop sharing screen' : 'Share screen'}
          aria-label={screen.enabled ? 'Stop sharing screen' : 'Share screen'}
        >
          {screen.enabled ? <MonitorOff className="size-6" /> : <MonitorUp className="size-6" />}
        </button>

        <LeaveButton />
      </div>
    </div>
  )
}

/** A chevron that opens the device list for one kind, with the active device checked. */
function DeviceMenu(props: { kind: MediaDeviceKind; label: string; onError: (m: string) => void }) {
  const room = useRoomContext()
  // Must be stable: useMediaDeviceSelect rebuilds its device observer whenever onError changes,
  // and an inline function made that happen on every render, in an endless loop.
  const { onError } = props
  // A denied permission is already in the room's device banner (Call.tsx); don't say it twice.
  const handleError = useCallback((e: Error) => e.name !== 'NotAllowedError' && onError(e.message), [onError])
  const { devices, activeDeviceId, setActiveMediaDevice } = useMediaDeviceSelect({
    kind: props.kind,
    room,
    onError: handleError,
  })
  const [open, setOpen] = useState(false)
  const ref = useOutsideClose(open, () => setOpen(false))

  return (
    <div ref={ref} className="relative">
      <button
        className="rounded-full p-1 text-neutral-300 hover:bg-white/10"
        onClick={() => setOpen((o) => !o)}
        title={`Choose ${props.label.toLowerCase()}`}
        aria-label={`Choose ${props.label.toLowerCase()}`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <ChevronUp className="size-4" />
      </button>
      {open && (
        <Menu>
          {devices.length === 0 && <div className="px-3 py-1.5 text-neutral-400">No {props.label.toLowerCase()} found</div>}
          {devices.map((d, i) => (
            <button
              key={d.deviceId || i}
              role="menuitemradio"
              aria-checked={d.deviceId === activeDeviceId}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-white/10"
              onClick={() => {
                setOpen(false)
                setActiveMediaDevice(d.deviceId).catch((e: Error) => props.onError(e.message))
              }}
            >
              <Check className={`size-4 shrink-0 ${d.deviceId === activeDeviceId ? '' : 'invisible'}`} />
              <span className="truncate">{deviceName(d, i, props.label)}</span>
            </button>
          ))}
        </Menu>
      )}
    </div>
  )
}

function LeaveButton() {
  const room = useRoomContext()
  const [confirming, setConfirming] = useState(false)
  const ref = useOutsideClose(confirming, () => setConfirming(false))
  return (
    <div ref={ref} className="relative ml-3">
      <button
        className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-700"
        onClick={() => setConfirming(true)}
      >
        <PhoneOff className="size-5" /> Leave
      </button>
      {confirming && (
        <Menu align="right">
          <div className="px-3 py-2">Leave the call?</div>
          <div className="flex justify-end gap-1 px-2 pb-1">
            <button className="rounded px-3 py-1.5 hover:bg-white/10" onClick={() => setConfirming(false)}>
              Cancel
            </button>
            <button className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700" onClick={() => void room.disconnect()}>
              Leave
            </button>
          </div>
        </Menu>
      )}
    </div>
  )
}

function Menu({ children, align = 'left' }: { children: ReactNode; align?: 'left' | 'right' }) {
  return (
    <div
      role="menu"
      className={`absolute bottom-full z-20 mb-2 max-w-80 min-w-56 rounded-md bg-neutral-800 py-1 text-sm text-white shadow-lg ${align === 'right' ? 'right-0' : 'left-0'}`}
    >
      {children}
    </div>
  )
}
