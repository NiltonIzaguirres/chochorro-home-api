import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate (E2E)', () => {
  // TODO: Implement E2E tests for authenticate endpoint
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to authenticate', async () => {
    await request(app.server).post('/orgs').send({
      email: 'john@example.com',
      password: 'password123',
      address: '123 Main',
      cep: '99999-999',
      phone: '99999999999',
      nameOfPersonResponsible: 'John',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'john@example.com',
      password: 'password123',
    })

    expect(response.status).toBe(200)
  })
})
