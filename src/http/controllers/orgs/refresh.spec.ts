import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (E2E)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should refresh the token', async () => {
    await request(app.server).post('/orgs').send({
      email: 'john@example.com',
      password: 'password123',
      address: '123 Main',
      cep: '99999-999',
      phone: '99999999999',
      nameOfPersonResponsible: 'John',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'john@example.com',
      password: 'password123',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', `${cookies}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({ token: expect.any(String) })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
