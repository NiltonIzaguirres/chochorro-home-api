import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

describe('Get pet by id (E2E)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should get pet by id', async () => {
    const createdOrg = await prisma.org.create({
      data: {
        email: 'john@example.com',
        password_hash: await hash('password123', 6),
        address: '123 Main',
        cep: '99999-999',
        phone: '99999999999',
        nameOfPersonResponsible: 'John',
      },
    })

    const pet = await prisma.pet.create({
      data: {
        name: 'John Doe',
        city: 'San Francisco',
        type: 'dog',
        about: 'A friendly and playful dog',
        age: 3,
        energy: 5,
        independence: 'LOW',
        environment: 'WIDE',
        shape: 'SMALL',
        orgId: createdOrg.id,
      },
    })

    const response = await request(app.server).get(`/pets/${pet.id}`)

    expect(response.status).toBe(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        type: 'dog',
        id: pet.id,
        name: 'John Doe',
        age: 3,
      }),
    )
  })
})
