import {
  useAudioPlayback,
  useConnectionState,
  useIsRecording,
  useSpeakingParticipants,
  useTracks,
} from '@livekit/components-react'
import { ConnectionState, Track } from 'livekit-client'
import { BarChart3, X } from 'lucide-react'
import { useState } from 'react'
import Controls from './Controls'
import { orderTracks, trackKey } from './order'
import ParticipantTile from './ParticipantTile'
import StatsPanel from './StatsPanel'

export default function RoomView(props: { deviceErrors: string[]; onDismissDeviceErrors: () => void }) {
  const refs = useTracks(
    [
      // Only participants with video get a tile, as in the old app, so an expert without a camera
      // never takes the main view from the headset by talking.
      { source: Track.Source.Camera, withPlaceholder: false },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  )
  // Re-render, and so re-sort, when the active speakers change.
  useSpeakingParticipants()
  const [main, ...strip] = orderTracks(refs)
  // Debug stats for the main tile; closed at the start of every call.
  const [showStats, setShowStats] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <Banners deviceErrors={props.deviceErrors} onDismissDeviceErrors={props.onDismissDeviceErrors} />
      <div className="relative flex-1 overflow-hidden">
        {main ? (
          <ParticipantTile key={trackKey(main)} trackRef={main} className="absolute inset-0" />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">Waiting for video…</div>
        )}
        {/* Other participants, stacked down the left edge over the main video. */}
        <div className="absolute top-0 bottom-0 left-0 flex w-[180px] flex-col overflow-y-auto" aria-label="Other participants">
          {strip.map((r) => (
            <ParticipantTile key={trackKey(r)} trackRef={r} className="h-[120px] w-[180px] shrink-0" />
          ))}
        </div>
        {main && (
          <div className="absolute top-0 right-0 flex flex-col items-end gap-1 p-1">
            <button
              onClick={() => setShowStats((s) => !s)}
              title={showStats ? 'Hide stats' : 'Show stats'}
              aria-label={showStats ? 'Hide stats' : 'Show stats'}
              className="rounded-full bg-black/30 p-2 text-white/70 hover:bg-black/50"
            >
              {showStats ? <X className="size-5" /> : <BarChart3 className="size-5" />}
            </button>
            {showStats && <StatsPanel key={main.participant.identity} participant={main.participant} />}
          </div>
        )}
      </div>
      <Controls />
    </div>
  )
}

function Banners(props: { deviceErrors: string[]; onDismissDeviceErrors: () => void }) {
  const { canPlayAudio, startAudio } = useAudioPlayback()
  const recording = useIsRecording()
  const state = useConnectionState()
  return (
    <div className="flex flex-col">
      {(state === ConnectionState.Reconnecting || state === ConnectionState.SignalReconnecting) && (
        <Banner>Connection lost. Reconnecting…</Banner>
      )}
      {!canPlayAudio && (
        <Banner>
          The browser blocked call audio.{' '}
          <button className="font-medium underline" onClick={() => void startAudio()}>
            Play audio
          </button>
        </Banner>
      )}
      {recording && <Banner>This call is being recorded.</Banner>}
      {props.deviceErrors.length > 0 && (
        <Banner>
          {props.deviceErrors.map((m) => (
            <span key={m} className="block">
              {m}
            </span>
          ))}
          <button className="font-medium underline" onClick={props.onDismissDeviceErrors}>
            Dismiss
          </button>
        </Banner>
      )}
    </div>
  )
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="bg-primary px-4 py-2 text-center text-sm text-white">
      {children}
    </div>
  )
}
