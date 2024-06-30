import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteFileUseCase } from './delete-file'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let filesRepository: InMemoryFilesRepository
let sut: DeleteFileUseCase

describe('Delete File UseCase', () => {
  beforeEach(async () => {
    filesRepository = new InMemoryFilesRepository()
    sut = new DeleteFileUseCase(filesRepository)
  })

  it('should throw an error when trying to delete a non-existent file', async () => {
    await expect(
      sut.execute({
        id: 'non-existent-id',
        uploadDir: '/path-no-exist',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
