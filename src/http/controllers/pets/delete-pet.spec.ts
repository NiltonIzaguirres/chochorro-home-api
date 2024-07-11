import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'
import { prisma } from '@/lib/prisma'

describe('Delete Pet (E2E)', async () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to delete pet', async () => {
    const { token, createdOrg } = await createAndAuthenticateOrg(app)

    const createdPet = await prisma.pet.create({
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

    const deletePetResponse = await request(app.server)
      .delete(`/pets/${createdPet.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(deletePetResponse.statusCode).toBe(200)
    expect(
      await prisma.pet.findUnique({
        where: {
          id: createdPet.id,
        },
      }),
    ).toBeNull()
  })
})
