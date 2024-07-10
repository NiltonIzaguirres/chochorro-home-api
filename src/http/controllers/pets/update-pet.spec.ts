import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'

describe('Update pet (E2E)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should update pet by id', async () => {
    const { token, createdOrg } = await createAndAuthenticateOrg(app)

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

    const response = await request(app.server)
      .patch(`/pets/${pet.id}/save`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        type: 'cat',
        city: 'New York',
        about: 'A friendly',
        age: 10,
        energy: 3,
        independence: 'MEDIUM',
        environment: 'MEDIUM',
        shape: 'MEDIUM',
        createdAt: pet.createdAt.toISOString(),
      })

    expect(response.status).toBe(200)
    expect(response.body.pet).toEqual(
      expect.objectContaining({
        type: 'cat',
        id: pet.id,
        name: 'John Doe',
        age: 10,
        energy: 3,
      }),
    )
  })
})
