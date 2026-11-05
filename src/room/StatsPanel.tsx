import {
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
  type Participant,
  type Track,
} from 'livekit-client'
import { useEffect, useState } from 'react'

type Stats = { audio: [string, string][]; video: [string, string][] }

const kbps = (track: Track) => `${Math.round(track.currentBitrate / 1000)} kbps`
const codec = (mimeType?: string) => mimeType?.split('/')[1]

/** One track's stats as label/value rows, the same rows the Flutter app showed. */
async function trackStats(track: Track): Promise<[string, string][]> {
  const rows: [string, string][] = []
  const add = (k: string, v: unknown) => v !== undefined && v !== '' && rows.push([k, String(v)])
  if (track instanceof RemoteVideoTrack) {
    const s = await track.getReceiverStats()
    add('rx', kbps(track))
    add('codec', codec(s?.mimeType))
    if (s) add('size', `${s.frameWidth ?? 0}x${s.frameHeight ?? 0}`)
    add('jitter', s?.jitter !== undefined ? `${s.jitter} s` : undefined)
    add('decoder', s?.decoderImplementation)
    add('frames received', s?.framesReceived)
    add('frames decoded', s?.framesDecoded)
    add('frames dropped', s?.framesDropped)
  } else if (track instanceof LocalVideoTrack) {
    const layers = await track.getSenderStats()
    add('tx', `total sent ${kbps(track)}`)
    for (const l of layers) add(`layer-${l.rid || 'f'}`, `${l.frameWidth}x${l.frameHeight} ${l.framesPerSecond ?? 0} fps`)
    add('qualityLimitationReason', layers[0]?.qualityLimitationReason)
  } else if (track instanceof RemoteAudioTrack) {
    const s = await track.getReceiverStats()
    add('rx', kbps(track))
    add('jitter', s?.jitter !== undefined ? `${s.jitter} s` : undefined)
    add('packets lost', s?.packetsLost)
    add('packets received', s?.packetsReceived)
  } else if (track instanceof LocalAudioTrack) {
    add('tx', kbps(track))
  }
  return rows
}

/** Live send/receive stats for a participant's tracks, refreshed every second. */
export default function StatsPanel({ participant }: { participant: Participant }) {
  const [stats, setStats] = useState<Stats>({ audio: [], video: [] })
  useEffect(() => {
    let live = true
    const poll = async () => {
      const next: Stats = { audio: [], video: [] }
      for (const pub of participant.trackPublications.values()) {
        if (!pub.track) continue
        const rows = await trackStats(pub.track).catch(() => [])
        next[pub.kind === 'audio' ? 'audio' : 'video'].push(...rows)
      }
      if (live) setStats(next)
    }
    void poll()
    const timer = setInterval(() => void poll(), 1000)
    return () => {
      live = false
      clearInterval(timer)
    }
  }, [participant])

  return (
    <div className="max-w-xs rounded-lg bg-black/50 px-3 py-2 text-sm text-white" aria-label="Call stats">
      <Section title="audio stats" rows={stats.audio} />
      <Section title="video stats" rows={stats.video} />
    </div>
  )
}

function Section({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <>
      <div className="text-base font-bold">{title}</div>
      {rows.map(([k, v], i) => (
        <div key={i}>
          {k}: {v}
        </div>
      ))}
    </>
  )
}
