import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'
import { prisma } from '@/lib/prisma'
import fs from 'node:fs'
import path from 'path'

const TEST_DIR_FROM = path.join(process.cwd(), 'test', 'assets')
const TEST_DIR_TO = path.join(process.cwd(), 'tmp')

describe('Upload Image (E2E)', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
    const files = fs.readdirSync(TEST_DIR_TO)

    files.forEach((file) => {
      const filePath = path.join(TEST_DIR_TO, file)
      fs.unlinkSync(filePath)
    })
  })

  it('should be able to upload image of pet', async () => {
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
      .post(`/pets/${pet.id}/image`)
      .attach('test-svg.svg', path.join(TEST_DIR_FROM, 'test-svg.svg'))
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(201)
    expect(response.body.file).toEqual(
      expect.objectContaining({
        name: 'test-svg.svg',
        id: expect.any(String),
        imageURL: expect.any(String),
      }),
    )
  })
})
