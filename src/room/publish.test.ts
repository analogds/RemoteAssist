import { describe, expect, it } from 'vitest'
import { shareFailure } from './publish'

const err = (name: string, message: string) => Object.assign(new Error(message), { name })

describe('shareFailure', () => {
  it('says nothing when the user closes the picker', () => {
    expect(shareFailure(err('NotAllowedError', 'Permission denied'))).toBeUndefined()
    expect(shareFailure(err('AbortError', 'The user aborted a request.'))).toBeUndefined()
  })

  it('points to System Settings when macOS blocks screen recording', () => {
    expect(shareFailure(err('NotAllowedError', 'Permission denied by system'))).toMatch(/System Settings/)
  })

  it('reports anything else', () => {
    expect(shareFailure(err('NotReadableError', 'Could not start video source'))).toBe(
      'Could not share the screen: Could not start video source',
    )
  })
})
