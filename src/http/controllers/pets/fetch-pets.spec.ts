import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

describe('Fetch pets (E2E)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should fetch pets', async () => {
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

    await prisma.pet.create({
      data: {
        name: 'John Doe',
        city: 'New York',
        type: 'cat',
        about: 'A friendly and playful dog',
        age: 10,
        energy: 3,
        independence: 'HIGH',
        environment: 'LITTLE',
        shape: 'MEDIUM',
        orgId: createdOrg.id,
      },
    })

    await prisma.pet.create({
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

    const response = await request(app.server).get('/pets').query({
      age: 3,
      type: 'dog',
      city: 'San Francisco',
      energy: 5,
      independence: 'LOW',
      environment: 'WIDE',
      shape: 'SMALL',
      page: 1,
    })

    expect(response.status).toBe(200)
    expect(response.body.pets).toHaveLength(1)
    expect(response.body.pets[0]).toEqual(
      expect.objectContaining({ type: 'dog' }),
    )
  })
})
