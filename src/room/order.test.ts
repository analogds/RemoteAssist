import type { TrackReferenceOrPlaceholder } from '@livekit/components-react'
import { Track, type Participant } from 'livekit-client'
import { describe, expect, it } from 'vitest'
import { orderTracks, trackKey } from './order'

function ref(identity: string, source: Track.Source, p: Partial<Participant> = {}): TrackReferenceOrPlaceholder {
  const participant = {
    identity,
    isLocal: false,
    isSpeaking: false,
    audioLevel: 0,
    isCameraEnabled: true,
    joinedAt: new Date(1000),
    ...p,
  } as Participant
  return { participant, source }
}
const cam = Track.Source.Camera
const screen = Track.Source.ScreenShare
const order = (refs: TrackReferenceOrPlaceholder[]) => orderTracks(refs).map(trackKey)

describe('orderTracks', () => {
  it('puts screen shares first (remote before local) and the local camera last', () => {
    expect(
      order([
        ref('me', cam, { isLocal: true }),
        ref('me', screen, { isLocal: true }),
        ref('headset', cam),
        ref('peer', screen),
      ]),
    ).toEqual(['peer:screen_share', 'me:screen_share', 'headset:camera', 'me:camera'])
  })

  it('keeps live video ahead of a camera-off talker, so the headset stays in the main view', () => {
    expect(
      order([
        ref('expert', cam, { isCameraEnabled: false, isSpeaking: true, audioLevel: 0.9, lastSpokeAt: new Date(50) }),
        ref('headset', cam),
      ]),
    ).toEqual(['headset:camera', 'expert:camera'])
  })

  it('ranks remote cameras with video: loudest, then latest speaker, then earliest joined', () => {
    expect(
      order([
        ref('quiet', cam, { isSpeaking: true, audioLevel: 0.2 }),
        ref('loud', cam, { isSpeaking: true, audioLevel: 0.9 }),
      ]),
    ).toEqual(['loud:camera', 'quiet:camera'])

    expect(
      order([
        ref('earlier', cam, { lastSpokeAt: new Date(10) }),
        ref('later', cam, { lastSpokeAt: new Date(20) }),
        ref('never', cam),
      ]),
    ).toEqual(['later:camera', 'earlier:camera', 'never:camera'])

    expect(order([ref('off', cam, { isCameraEnabled: false }), ref('on', cam)])).toEqual(['on:camera', 'off:camera'])

    expect(
      order([ref('second', cam, { joinedAt: new Date(2000) }), ref('first', cam, { joinedAt: new Date(1000) })]),
    ).toEqual(['first:camera', 'second:camera'])
  })
})
