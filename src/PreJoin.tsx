import {
  createLocalAudioTrack,
  createLocalVideoTrack,
  VideoPresets,
  VideoPresets43,
  type LocalAudioTrack,
  type LocalVideoTrack,
  type VideoResolution,
} from 'livekit-client'
import { VideoOff } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { deviceName, useDeviceList, useStoredFlag } from './devices'
import { openThreadX } from './threadx'
import { PrimaryButton, TextButton } from './ui'

const RESOLUTIONS: Record<string, { label: string; resolution: VideoResolution }> = {
  h480: { label: '640x480 (4:3)', resolution: VideoPresets43.h480.resolution },
  h540: { label: '960x540', resolution: VideoPresets.h540.resolution },
  h720: { label: '1280x720', resolution: VideoPresets.h720.resolution },
  h1080: { label: '1920x1080', resolution: VideoPresets.h1080.resolution },
}

export interface JoinChoices {
  /** undefined: camera off. '' : the browser's default camera. */
  videoDeviceId?: string
  audioDeviceId?: string
  resolution: VideoResolution
}

export default function PreJoin(props: { onJoin: (choices: JoinChoices) => void; busy: boolean; error?: string }) {
  const [videoEnabled, setVideoEnabled] = useStoredFlag('prejoin-enable-video')
  const [audioEnabled, setAudioEnabled] = useStoredFlag('prejoin-enable-audio')
  // '' until the user picks one: the preview then opens the browser's default device.
  const [videoChoice, setVideoChoice] = useState('')
  const [audioChoice, setAudioChoice] = useState('')
  const [resolutionKey, setResolutionKey] = useState('h720')
  // The device each preview track actually opened, shown as selected while the choice is ''.
  const [videoActive, setVideoActive] = useState('')
  const [audioActive, setAudioActive] = useState('')
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>()
  const [videoError, setVideoError] = useState<string>()
  const [audioError, setAudioError] = useState<string>()

  const videoInputs = useDeviceList('videoinput', videoActive)
  const audioInputs = useDeviceList('audioinput', audioActive)
  const resolution = RESOLUTIONS[resolutionKey].resolution

  // Camera preview. Stopped on every change and on unmount, so the device is free when the room opens it.
  useEffect(() => {
    if (!videoEnabled) return
    let track: LocalVideoTrack | undefined
    let live = true
    createLocalVideoTrack({ deviceId: videoChoice || undefined, resolution })
      .then(async (t) => {
        if (!live) return void t.stop()
        track = t
        setVideoTrack(t)
        setVideoActive((await t.getDeviceId()) ?? '')
        setVideoError(undefined)
      })
      .catch((e: Error) => live && setVideoError(`Camera: ${e.message}`))
    return () => {
      live = false
      track?.stop()
      setVideoTrack(undefined)
    }
  }, [videoEnabled, videoChoice, resolution])

  // Mic preview: asks for permission (which reveals device names) and checks the device opens.
  useEffect(() => {
    if (!audioEnabled) return
    let track: LocalAudioTrack | undefined
    let live = true
    createLocalAudioTrack({ deviceId: audioChoice || undefined })
      .then(async (t) => {
        if (!live) return void t.stop()
        track = t
        setAudioActive((await t.getDeviceId()) ?? '')
        setAudioError(undefined)
      })
      .catch((e: Error) => live && setAudioError(`Microphone: ${e.message}`))
    return () => {
      live = false
      track?.stop()
    }
  }, [audioEnabled, audioChoice])

  const videoEl = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = videoEl.current
    if (!videoTrack || !el) return
    videoTrack.attach(el)
    return () => void videoTrack.detach(el)
  }, [videoTrack])

  const join = () =>
    props.onJoin({
      videoDeviceId: videoEnabled ? videoChoice || videoActive : undefined,
      audioDeviceId: audioEnabled ? audioChoice || audioActive : undefined,
      resolution,
    })

  return (
    <div className="flex h-full flex-col bg-app-bg">
      <header className="flex h-14 shrink-0 items-center bg-primary px-4 text-xl font-medium text-white">
        Select Devices
      </header>
      <main className="flex flex-1 justify-center overflow-y-auto p-5">
        <div className="flex w-full max-w-[400px] flex-col gap-1">
          <div className="mx-auto mb-2.5 flex h-[240px] w-[320px] items-center justify-center overflow-hidden bg-black/55">
            {videoTrack ? (
              <video ref={videoEl} className="size-full object-cover" muted playsInline aria-label="Camera preview" />
            ) : (
              <VideoOff className="size-[72px] text-primary" aria-hidden />
            )}
          </div>

          <ToggleRow label="Camera" checked={videoEnabled} onChange={setVideoEnabled} />
          <DeviceSelect
            label="Camera device"
            kind="Camera"
            devices={videoInputs}
            value={videoChoice || videoActive}
            disabled={!videoEnabled}
            onChange={setVideoChoice}
          />
          <Select
            label="Camera resolution"
            value={resolutionKey}
            disabled={!videoEnabled}
            onChange={setResolutionKey}
            options={Object.entries(RESOLUTIONS).map(([value, r]) => ({ value, label: r.label }))}
          />

          <div className="mt-4" />
          <ToggleRow label="Microphone" checked={audioEnabled} onChange={setAudioEnabled} />
          <DeviceSelect
            label="Microphone device"
            kind="Microphone"
            devices={audioInputs}
            value={audioChoice || audioActive}
            disabled={!audioEnabled}
            onChange={setAudioChoice}
          />

          {[props.error, videoEnabled && videoError, audioEnabled && audioError].filter(Boolean).map((m) => (
            <p key={String(m)} role="alert" className="mt-4 text-sm text-primary-dark">
              {m}
            </p>
          ))}

          <PrimaryButton className="mt-6 flex items-center justify-center gap-2" disabled={props.busy} onClick={join}>
            {props.busy && (
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
            )}
            Join
          </PrimaryButton>
          <TextButton className="mt-2" onClick={openThreadX}>
            Back to Dashboard
          </TextButton>
        </div>
      </main>
    </div>
  )
}

function ToggleRow(props: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId()
  return (
    <div className="flex items-center justify-between py-1">
      <label htmlFor={id}>{props.label}:</label>
      <button
        id={id}
        role="switch"
        aria-checked={props.checked}
        onClick={() => props.onChange(!props.checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${props.checked ? 'bg-primary' : 'bg-neutral-300'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${props.checked ? 'translate-x-5' : ''}`}
        />
      </button>
    </div>
  )
}

function Select(props: {
  label: string
  value: string
  disabled?: boolean
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <select
      aria-label={props.label}
      value={props.value}
      disabled={props.disabled}
      onChange={(e) => props.onChange(e.target.value)}
      className="mb-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 disabled:opacity-50"
    >
      {props.placeholder !== undefined && <option value="">{props.placeholder}</option>}
      {props.options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

function DeviceSelect(props: {
  label: string
  kind: string
  devices: MediaDeviceInfo[]
  value: string
  disabled: boolean
  onChange: (id: string) => void
}) {
  // When off, show "<Kind> off" rather than the device, for camera and microphone alike.
  const known = !props.disabled && props.devices.some((d) => d.deviceId === props.value)
  return (
    <Select
      label={props.label}
      value={known ? props.value : ''}
      disabled={props.disabled || props.devices.length === 0}
      onChange={props.onChange}
      placeholder={props.disabled ? `${props.kind} off` : known ? undefined : `Default ${props.kind.toLowerCase()}`}
      options={props.devices.map((d, i) => ({ value: d.deviceId, label: deviceName(d, i, props.kind) }))}
    />
  )
}
