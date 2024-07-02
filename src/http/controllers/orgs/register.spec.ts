import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server).post('/orgs').send({
      email: 'john@example.com',
      password: 'password123',
      address: '123 Main',
      cep: '99999-999',
      phone: '99999999999',
      nameOfPersonResponsible: 'John',
    })

    expect(response.statusCode).toEqual(201)
  })
})
