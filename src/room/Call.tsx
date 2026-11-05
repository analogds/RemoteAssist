import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react'
import { DisconnectReason, MediaDeviceFailure, type RoomOptions } from 'livekit-client'
import { useMemo, useState } from 'react'
import type { AssistGrant } from '../grant'
import type { JoinChoices } from '../PreJoin'
import { ROOM_OPTIONS } from './publish'
import RoomView from './RoomView'

const DEVICE_FAILURE_TEXT: Record<MediaDeviceFailure, string> = {
  [MediaDeviceFailure.PermissionDenied]: 'permission was denied. Allow camera and microphone for this site, then turn them on below',
  [MediaDeviceFailure.NotFound]: 'no device was found',
  [MediaDeviceFailure.DeviceInUse]: 'it is in use by another app',
  [MediaDeviceFailure.Other]: 'the browser reported an error',
}

// getUserMedia's error names for a camera or mic that would not open. LiveKit's
// MediaDeviceFailure.getFailure files every other Error under Other, so it can't tell them apart.
const DEVICE_ERRORS = new Set(['NotFoundError', 'DevicesNotFoundError', 'NotAllowedError', 'PermissionDeniedError', 'NotReadableError', 'TrackStartError', 'OverconstrainedError'])

/** Why the call ended, or undefined when the user hung up. */
function dropReason(reason?: DisconnectReason): Error | undefined {
  if (reason === DisconnectReason.CLIENT_INITIATED) return undefined
  return new Error(reason === undefined ? 'connection lost' : `the call ended (${DisconnectReason[reason]})`)
}

export default function Call(props: {
  grant: AssistGrant
  choices: JoinChoices
  onLeave: (error?: Error) => void
}) {
  const { choices } = props
  // One message per device that failed to open, so a camera and a mic failure both show, once each.
  const [deviceErrors, setDeviceErrors] = useState<Partial<Record<string, string>>>({})
  const options = useMemo<RoomOptions>(
    () => ({ ...ROOM_OPTIONS, videoCaptureDefaults: { resolution: choices.resolution } }),
    [choices.resolution],
  )
  const reportDevice = (failure: MediaDeviceFailure | undefined, kind?: MediaDeviceKind) => {
    const what = kind === 'videoinput' ? 'camera' : kind === 'audioinput' ? 'microphone' : 'camera or microphone'
    const message = `Could not open the ${what}: ${DEVICE_FAILURE_TEXT[failure ?? MediaDeviceFailure.Other]}.`
    setDeviceErrors((prev) => ({ ...prev, [kind ?? 'device']: message }))
  }
  return (
    <LiveKitRoom
      className="h-full bg-neutral-950 text-neutral-50"
      serverUrl={props.grant.url}
      token={props.grant.token}
      connect
      options={options}
      video={choices.videoDeviceId === undefined ? false : { deviceId: choices.videoDeviceId || undefined }}
      audio={choices.audioDeviceId === undefined ? false : { deviceId: choices.audioDeviceId || undefined }}
      onDisconnected={(reason) => props.onLeave(dropReason(reason))}
      // A camera or mic that fails to open is reported here too: stay in the call and say so,
      // since the expert can still see and hear the headset. Anything else ends the call.
      onError={(e) => {
        if (DEVICE_ERRORS.has(e.name)) reportDevice(MediaDeviceFailure.getFailure(e))
        else props.onLeave(e)
      }}
      onMediaDeviceFailure={reportDevice}
    >
      <RoomView
        deviceErrors={Object.values(deviceErrors).filter((m): m is string => !!m)}
        onDismissDeviceErrors={() => setDeviceErrors({})}
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}
