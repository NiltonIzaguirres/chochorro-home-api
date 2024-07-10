import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { CreateFileUseCase } from './create-file'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'
import path from 'path'
import fs from 'node:fs'
import { InvalidTypeError } from './erros/invalid-type-error'
import { FailedToUploadFileError } from './erros/failed-to-upload-file-error'

const TEST_DIR_FROM = path.join(process.cwd(), 'test', 'assets')
const TEST_DIR_TO = path.join(process.cwd(), 'tmp')
let filesRepository: InMemoryFilesRepository
let sut: CreateFileUseCase

describe('Create pet Use Case', async () => {
  beforeEach(async () => {
    filesRepository = new InMemoryFilesRepository()
    sut = new CreateFileUseCase(filesRepository)
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
    const { file } = await sut.execute({
      fileData: await fs.createReadStream(
        path.join(TEST_DIR_FROM, 'test-svg.svg'),
      ),
      mimeType: 'image/svg+xml',
      fileName: 'test-svg.svg',
      petId: 'org123',
      uploadDir: TEST_DIR_TO,
    })

    expect(file).toEqual({
      id: expect.any(String),
      key: expect.stringContaining('test-svg'),
      name: 'test-svg.svg',
      petId: 'org123',
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
      }),
    ).rejects.toBeInstanceOf(InvalidTypeError)
  })

  it('should return error if unable to save file', async () => {
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
        petId: 'org123',
        uploadDir: TEST_DIR_TO,
      }),
    ).rejects.toBeInstanceOf(FailedToUploadFileError)
  })
})
