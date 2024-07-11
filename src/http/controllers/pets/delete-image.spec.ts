import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateOrg } from '@/utils/test/create-and-authenticate-org'
import { prisma } from '@/lib/prisma'

const TEST_FILE_FROM = path.join(
  process.cwd(),
  'test',
  'assets',
  'test-svg.svg',
)
const TEST_FILE_TO = path.join(process.cwd(), 'tmp', 'test-svg.svg')

describe('Delete Image (E2E)', async () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  it('should be able to delete image', async () => {
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

    const createdFile = await prisma.file.create({
      data: {
        name: 'test-svg.svg',
        key: 'test-svg.svg',
        petId: createdPet.id,
      },
    })

    await fs.promises
      .copyFile(TEST_FILE_FROM, TEST_FILE_TO, fs.constants.COPYFILE_FICLONE)
      .then(async () => {
        const deleteFileResponse = await request(app.server)
          .delete(`/pets/image/${createdFile.id}`)
          .set('Authorization', `Bearer ${token}`)

        expect(deleteFileResponse.statusCode).toBe(200)
        expect(
          await prisma.file.findUnique({
            where: {
              id: createdFile.id,
            },
          }),
        ).toBeNull()
      })
  })
})
