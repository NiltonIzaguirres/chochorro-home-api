import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { CreateFileUseCase } from './create-file'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'
import path from 'path'
// import * as fs from 'fs-extra'
import fs from 'fs'
import { InvalidTypeError } from './erros/invalid-type-error'

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
})
