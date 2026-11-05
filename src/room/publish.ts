import { ScreenSharePresets, type RoomOptions } from 'livekit-client'

/** Screen share capture, used by the controls' share toggle. */
export const SCREEN_SHARE_CAPTURE = { audio: true, resolution: ScreenSharePresets.h1080fps15.resolution }

// Fixed publish settings: the old Connect page's defaults (simulcast, adaptive stream, dynacast,
// VP8), with the camera and screen encodings it used.
export const ROOM_OPTIONS: RoomOptions = {
  adaptiveStream: true,
  dynacast: true,
  publishDefaults: {
    simulcast: true,
    videoCodec: 'vp8',
    videoEncoding: { maxBitrate: 5_000_000, maxFramerate: 30 },
    screenShareEncoding: { maxBitrate: 3_000_000, maxFramerate: 15 },
  },
}

/**
 * What to tell the user when starting a screen share fails, or undefined when they just closed
 * the browser's picker. Chrome rejects both a cancel and a macOS block with NotAllowedError; only
 * the block says "by system".
 */
export function shareFailure(e: Error): string | undefined {
  if (e.name === 'NotAllowedError' && /system/i.test(e.message)) {
    return 'Screen sharing is blocked. Allow screen recording for your browser in System Settings > Privacy & Security.'
  }
  if (e.name === 'NotAllowedError' || e.name === 'AbortError') return undefined
  return `Could not share the screen: ${e.message}`
}
