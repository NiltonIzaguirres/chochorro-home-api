import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { CreateFileUseCase } from './create-file'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'
import path from 'path'
import fs from 'node:fs'
import { InvalidTypeError } from './erros/invalid-type-error'
import { FailedToUploadFileError } from './erros/failed-to-upload-file-error'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { UnauthorizedError } from './erros/unauthorized-error'

const TEST_DIR_FROM = path.join(process.cwd(), 'test', 'assets')
const TEST_DIR_TO = path.join(process.cwd(), 'tmp')

let filesRepository: InMemoryFilesRepository
let petsRepository: InMemoryPetsRepository
let sut: CreateFileUseCase

describe('Create pet Use Case', async () => {
  beforeEach(async () => {
    filesRepository = new InMemoryFilesRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new CreateFileUseCase(filesRepository, petsRepository)
    await fs.mkdirSync(TEST_DIR_TO, { recursive: true })
  })

  afterEach(async () => {
    const files = fs.readdirSync(TEST_DIR_TO)

    files.forEach((file) => {
      const filePath = path.join(TEST_DIR_TO, file)
      fs.unlinkSync(filePath)
    })
  })

  it('should be able to create a image pet', async () => {
    const pet = await petsRepository.create({
      name: 'John Doe',
      city: 'San Francisco',
      type: 'dog',
      about: 'A friendly and playful dog',
      age: 3,
      energy: 5,
      independence: 'LOW',
      environment: 'WIDE',
      shape: 'BIG',
      orgId: 'org123',
    })

    const { file } = await sut.execute({
      fileData: await fs.createReadStream(
        path.join(TEST_DIR_FROM, 'test-svg.svg'),
      ),
      mimeType: 'image/svg+xml',
      fileName: 'test-svg.svg',
      petId: pet.id,
      uploadDir: TEST_DIR_TO,
      sub: pet.orgId,
    })

    expect(file).toEqual({
      id: expect.any(String),
      key: expect.stringContaining('test-svg'),
      name: 'test-svg.svg',
      petId: pet.id,
      createdAt: expect.any(Date),
      imageURL: expect.any(String),
    })
  })

  it('should not be able to upload different mimeType', async () => {
    await expect(
      sut.execute({
        fileData: await fs.createReadStream(
          path.join(TEST_DIR_FROM, 'test-pdf.pdf'),
        ),
        mimeType: 'application/pdf',
        fileName: 'test-pdf.pdf',
        petId: 'org123',
        uploadDir: TEST_DIR_TO,
        sub: 'org123',
      }),
    ).rejects.toBeInstanceOf(InvalidTypeError)
  })

  it('should return error if unable to save file', async () => {
    const pet = await petsRepository.create({
      name: 'John Doe',
      city: 'San Francisco',
      type: 'dog',
      about: 'A friendly and playful dog',
      age: 3,
      energy: 5,
      independence: 'LOW',
      environment: 'WIDE',
      shape: 'BIG',
      orgId: 'org123',
    })

    const fileData = await fs.createReadStream(
      path.join(TEST_DIR_FROM, 'test-svg.svg'),
    )

    vi.spyOn(fileData, 'pipe').mockImplementation(() => {
      throw new Error()
    })

    await expect(
      sut.execute({
        fileData,
        mimeType: 'image/svg+xml',
        fileName: 'test-svg.svg',
        petId: pet.id,
        uploadDir: TEST_DIR_TO,
        sub: pet.orgId,
      }),
    ).rejects.toBeInstanceOf(FailedToUploadFileError)
  })

  it('should throw an error when trying to upload a file with wrong sub id', async () => {
    const pet = await petsRepository.create({
      name: 'John Doe',
      city: 'San Francisco',
      type: 'dog',
      about: 'A friendly and playful dog',
      age: 3,
      energy: 5,
      independence: 'LOW',
      environment: 'WIDE',
      shape: 'BIG',
      orgId: 'org123',
    })

    await expect(
      sut.execute({
        fileData: await fs.createReadStream(
          path.join(TEST_DIR_FROM, 'test-svg.svg'),
        ),
        mimeType: 'image/svg+xml',
        fileName: 'test-svg.svg',
        petId: pet.id,
        uploadDir: TEST_DIR_TO,
        sub: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
