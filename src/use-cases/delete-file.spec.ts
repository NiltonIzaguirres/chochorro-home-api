import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteFileUseCase } from './delete-file'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import path from 'path'
import fs from 'node:fs'
import { FileNotFoundInDiskError } from './erros/file-not-found-in-disk-erro'
import { UnauthorizedError } from './erros/unauthorized-error'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

const TEST_DIR_FROM = path.join(process.cwd(), 'test', 'assets')
const TEST_DIR_TO = path.join(process.cwd(), 'tmp')
const TEST_FILE_FROM = path.join(TEST_DIR_FROM, 'test-svg.svg')
const TEST_FILE_TO = path.join(TEST_DIR_TO, 'delete-file-test.svg')

let filesRepository: InMemoryFilesRepository
let petsRepository: InMemoryPetsRepository
let sut: DeleteFileUseCase

describe('Delete File UseCase', () => {
  beforeEach(async () => {
    filesRepository = new InMemoryFilesRepository()
    petsRepository = new InMemoryPetsRepository()
    sut = new DeleteFileUseCase(filesRepository, petsRepository)
  })

  it('should be able to delete a file', async () => {
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

    const file = await filesRepository.create({
      name: 'files-example.png',
      key: 'delete-file-test.svg',
      petId: pet.id,
    })

    await fs.promises
      .copyFile(TEST_FILE_FROM, TEST_FILE_TO, fs.constants.COPYFILE_FICLONE)
      .then(async () => {
        await sut.execute({
          id: file.id,
          sub: pet.orgId,
          uploadDir: TEST_DIR_TO,
        })
        expect(await filesRepository.findById(file.id)).toBeNull()
      })
  })

  it('should throw an error when trying to delete a file with wrong sub id', async () => {
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

    const file = await filesRepository.create({
      name: 'files-example.png',
      key: 'key_example-files_example.png',
      petId: pet.id,
    })

    await expect(
      sut.execute({
        id: file.id,
        sub: 'non-existent-id',
        uploadDir: '',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })

  it('should throw an error when trying to delete a non-existent file', async () => {
    await expect(
      sut.execute({
        id: 'non-existent-id',
        sub: 'non-existent-id',
        uploadDir: '/path-no-exist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should throw an error when trying to delete a non-existent file in disk', async () => {
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

    const file = await filesRepository.create({
      name: 'files-example.png',
      key: 'delete-file-test.svg',
      petId: pet.id,
    })

    await expect(
      sut.execute({
        id: file.id,
        sub: pet.orgId,
        uploadDir: '/path-no-exist',
      }),
    ).rejects.toBeInstanceOf(FileNotFoundInDiskError)
  })
})
