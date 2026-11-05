import type { TrackReferenceOrPlaceholder } from '@livekit/components-react'
import { Track, type Participant } from 'livekit-client'

const time = (d?: Date) => d?.getTime() ?? 0

/**
 * Remote cameras: live video first, so an expert who turned their camera off cannot take the main
 * view from the headset by talking. Then loudest, then most recently spoken, then earliest joined.
 */
function compareSpeakers(a: Participant, b: Participant): number {
  if (a.isCameraEnabled !== b.isCameraEnabled) return a.isCameraEnabled ? -1 : 1
  if (a.isSpeaking && b.isSpeaking) return b.audioLevel - a.audioLevel
  const spoke = time(b.lastSpokeAt) - time(a.lastSpokeAt)
  if (spoke !== 0) return spoke
  return time(a.joinedAt) - time(b.joinedAt)
}

/**
 * Tile order: the first one fills the main view and the rest go down the left strip. Screen shares
 * first (remote before local), then remote cameras by `compareSpeakers`, then the local camera last.
 */
export function orderTracks(refs: TrackReferenceOrPlaceholder[]): TrackReferenceOrPlaceholder[] {
  const isScreen = (r: TrackReferenceOrPlaceholder) => r.source === Track.Source.ScreenShare
  const screens = refs.filter(isScreen).sort((a, b) => Number(a.participant.isLocal) - Number(b.participant.isLocal))
  const cameras = refs.filter((r) => !isScreen(r))
  const remote = cameras.filter((r) => !r.participant.isLocal).sort((a, b) => compareSpeakers(a.participant, b.participant))
  const local = cameras.filter((r) => r.participant.isLocal)
  return [...screens, ...remote, ...local]
}

export const trackKey = (r: TrackReferenceOrPlaceholder) => `${r.participant.identity}:${r.source}`
