import {
  isTrackReference,
  useConnectionQualityIndicator,
  useIsMuted,
  useIsSpeaking,
  useMultibandTrackVolume,
  useParticipantTracks,
  VideoTrack,
  type TrackReference,
  type TrackReferenceOrPlaceholder,
} from '@livekit/components-react'
import { ConnectionQuality, Track, VideoQuality, type RemoteTrackPublication } from 'livekit-client'
import { Mic, MicOff, Monitor, SlidersHorizontal, VideoOff, Wifi, WifiOff } from 'lucide-react'
import { useState } from 'react'
import { useOutsideClose } from './useOutsideClose'

const QUALITY_COLOR: Partial<Record<ConnectionQuality, string>> = {
  [ConnectionQuality.Excellent]: 'text-green-500',
  [ConnectionQuality.Good]: 'text-orange-500',
  [ConnectionQuality.Poor]: 'text-red-500',
}

// Hook arguments kept as module constants: LiveKit's hooks re-subscribe when these change identity.
const WAVEFORM_OPTIONS = { bands: 5 }
const MIC_SOURCES = [Track.Source.Microphone]
const SCREEN_AUDIO_SOURCES = [Track.Source.ScreenShareAudio]

/** One participant's camera or screen share, with its name bar and speaking outline. */
export default function ParticipantTile({ trackRef, className = '' }: { trackRef: TrackReferenceOrPlaceholder; className?: string }) {
  const p = trackRef.participant
  const isScreen = trackRef.source === Track.Source.ScreenShare
  const speaking = useIsSpeaking(p)
  const videoMuted = useIsMuted(trackRef)
  const showVideo = isTrackReference(trackRef) && !videoMuted && !!trackRef.publication.track

  const audioSource = isScreen ? Track.Source.ScreenShareAudio : Track.Source.Microphone
  const audioRef = useParticipantTracks(isScreen ? SCREEN_AUDIO_SOURCES : MIC_SOURCES, p.identity)[0] as
    | TrackReference
    | undefined
  const audioMuted = useIsMuted(audioRef ?? { participant: p, source: audioSource })
  const audioAvailable = !!audioRef && !audioMuted && (p.isLocal || audioRef.publication.isSubscribed)
  const { quality } = useConnectionQualityIndicator({ participant: p })

  return (
    <div className={`overflow-hidden bg-neutral-900 ${className}`}>
      <div className="relative size-full">
        {showVideo ? (
          <VideoTrack trackRef={trackRef} className="size-full object-contain" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <VideoOff className="size-[30%] max-h-24 text-primary" aria-label="No video" />
          </div>
        )}
        {audioAvailable && audioRef.publication.track && <Waveform trackRef={audioRef} />}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-stretch">
          {!p.isLocal && isTrackReference(trackRef) && (
            <div className="flex justify-end">
              <TrackMenu pub={trackRef.publication as RemoteTrackPublication} />
            </div>
          )}
          <div className="flex items-center justify-end gap-1.5 bg-black/30 px-2.5 py-1.5 text-sm text-white">
            <span className="truncate">{p.name ? `${p.name} (${p.identity})` : p.identity}</span>
            {isScreen ? (
              <Monitor className="size-4 shrink-0" aria-label="Screen share" />
            ) : audioAvailable ? (
              <Mic className="size-4 shrink-0" aria-label="Microphone on" />
            ) : (
              <MicOff className="size-4 shrink-0 text-red-500" aria-label="Microphone off" />
            )}
            {quality !== ConnectionQuality.Unknown &&
              (quality === ConnectionQuality.Poor || quality === ConnectionQuality.Lost ? (
                <WifiOff className="size-4 shrink-0 text-red-500" aria-label="Poor connection" />
              ) : (
                <Wifi className={`size-4 shrink-0 ${QUALITY_COLOR[quality] ?? ''}`} aria-label={`${quality} connection`} />
              ))}
          </div>
        </div>
        {speaking && !isScreen && <div className="pointer-events-none absolute inset-0 border-[5px] border-primary" />}
      </div>
    </div>
  )
}

/** Five live level bars over the tile while the participant's audio is on. */
function Waveform({ trackRef }: { trackRef: TrackReference }) {
  const bands = useMultibandTrackVolume(trackRef, WAVEFORM_OPTIONS)
  return (
    <div className="pointer-events-none absolute inset-2.5 flex items-center justify-center gap-1" aria-hidden>
      {bands.map((v, i) => (
        <div key={i} className="w-2 rounded-full bg-white/80" style={{ height: `${8 + Math.min(1, v) * 92}px` }} />
      ))}
    </div>
  )
}

/** Per-tile receive settings for a remote video: subscription, max quality and frame rate. */
function TrackMenu({ pub }: { pub: RemoteTrackPublication }) {
  const [open, setOpen] = useState(false)
  const ref = useOutsideClose(open, () => setOpen(false))

  const item = (label: string, action: () => void) => (
    <button
      key={label}
      role="menuitem"
      className="block w-full px-3 py-1.5 text-left hover:bg-white/10"
      onClick={() => {
        action()
        setOpen(false)
      }}
    >
      {label}
    </button>
  )

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Video settings"
        aria-label="Video settings"
        aria-haspopup="menu"
        aria-expanded={open}
        className="bg-black/30 p-1.5 text-white hover:bg-black/50"
      >
        <SlidersHorizontal className="size-4" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 bottom-full z-10 mb-1 min-w-36 rounded-md bg-neutral-800 py-1 text-sm text-white shadow-lg">
          {pub.isSubscribed ? item('Unsubscribe', () => pub.setSubscribed(false)) : item('Subscribe', () => pub.setSubscribed(true))}
          <div className="px-3 pt-2 pb-1 text-xs text-neutral-400">Max quality</div>
          {item('High', () => pub.setVideoQuality(VideoQuality.HIGH))}
          {item('Medium', () => pub.setVideoQuality(VideoQuality.MEDIUM))}
          {item('Low', () => pub.setVideoQuality(VideoQuality.LOW))}
          <div className="px-3 pt-2 pb-1 text-xs text-neutral-400">Frame rate</div>
          {[30, 15, 8].map((fps) => item(`${fps} fps`, () => pub.setVideoFPS(fps)))}
        </div>
      )}
    </div>
  )
}
