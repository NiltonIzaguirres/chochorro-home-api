import request from 'supertest'
import { describe } from 'node:test'
import { afterAll, beforeAll, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Profile (E2E)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should get the org profile', async () => {
    const { token } = await createAndAuthenticateOrg(app)
    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.org).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        email: 'john@example.com',
        nameOfPersonResponsible: 'John',
      }),
    )
  })
})
