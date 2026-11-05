// @vitest-environment node
// (jsdom's Uint8Array is a different realm from the one jose's WebCrypto key check expects.)
import { jwtVerify } from 'jose'
import { describe, expect, it } from 'vitest'
import { devAssistGrant } from './devGrant'

describe('devAssistGrant', () => {
  it('signs a join grant for the local dev server with its public dev key', async () => {
    const grant = await devAssistGrant('msc-support')
    expect(grant.url).toBe('ws://localhost:7880')
    expect(grant.room).toBe('msc-support')

    const { payload, protectedHeader } = await jwtVerify(grant.token, new TextEncoder().encode('secret'), {
      issuer: 'devkey',
    })
    expect(protectedHeader.alg).toBe('HS256')
    expect(payload.sub).toMatch(/^dev-expert-[0-9a-f]+$/)
    expect(payload.video).toEqual({ room: 'msc-support', roomJoin: true, canPublish: true, canSubscribe: true })
    expect(payload.exp! - payload.iat!).toBe(6 * 3600)
  })

  it('gives every call its own identity', async () => {
    const ids = new Set<string | undefined>()
    for (let i = 0; i < 5; i++) {
      const { payload } = await jwtVerify((await devAssistGrant('r')).token, new TextEncoder().encode('secret'))
      ids.add(payload.sub)
    }
    expect(ids.size).toBeGreaterThan(1)
  })
})
