import { useEffect, useState } from 'react'

/**
 * The browser's devices of one kind, re-listed on `devicechange` and whenever `refreshKey`
 * changes. Browsers hide device names (and real ids) until the page has camera/mic permission, and
 * granting it does not fire `devicechange`, so callers bump `refreshKey` once a track has started.
 */
export function useDeviceList(kind: MediaDeviceKind, refreshKey: unknown): MediaDeviceInfo[] {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  useEffect(() => {
    let live = true
    const list = async () => {
      const all = (await navigator.mediaDevices?.enumerateDevices()) ?? []
      // Chrome also lists 'default'/'communications' aliases of a real device; keep them, as the
      // browser's own pickers do, but drop blank entries that only exist without permission.
      if (live) setDevices(all.filter((d) => d.kind === kind && (d.deviceId || d.label)))
    }
    void list()
    navigator.mediaDevices?.addEventListener('devicechange', list)
    return () => {
      live = false
      navigator.mediaDevices?.removeEventListener('devicechange', list)
    }
  }, [kind, refreshKey])
  return devices
}

/** Fallback when the browser still gives no name (permission refused). */
export function deviceName(d: MediaDeviceInfo, index: number, kind: string): string {
  return d.label || `${kind} ${index + 1}`
}

/** A boolean kept in localStorage, defaulting to true. */
export function useStoredFlag(key: string): [boolean, (v: boolean) => void] {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) !== 'false'
    } catch {
      return true
    }
  })
  const set = (v: boolean) => {
    setValue(v)
    try {
      localStorage.setItem(key, String(v))
    } catch {
      // Storage blocked: the choice just doesn't persist.
    }
  }
  return [value, set]
}
