import { beforeEach, describe, expect, it } from 'vitest'
import { FetchFileUseCase } from './fetch-file'
import { InMemoryFilesRepository } from '@/repositories/in-memory/in-memory-files-repository'

let filesRepository: InMemoryFilesRepository
let sut: FetchFileUseCase

describe('Fetch File Use Case', async () => {
  beforeEach(async () => {
    filesRepository = new InMemoryFilesRepository()
    sut = new FetchFileUseCase(filesRepository)
  })

  it('should be able to get files by id', async () => {
    await filesRepository.create({
      name: 'files-example.png',
      key: 'key_example-files_example.png',
      petId: 'pet-id-01',
    })

    await filesRepository.create({
      name: 'files-example2.png',
      key: 'key_example2-files_example2.png',
      petId: 'pet-id-01',
    })

    await filesRepository.create({
      name: 'files-example3.png',
      key: 'key_example3-files_example3.png',
      petId: 'pet-id-02',
    })

    const { files } = await sut.execute({
      petId: 'pet-id-01',
    })

    expect(files).toHaveLength(2)
    expect(files[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'files-example.png',
        key: 'key_example-files_example.png',
        url: expect.any(String),
        createdAt: expect.any(Date),
      }),
    )
    expect(files[1]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'files-example2.png',
        key: 'key_example2-files_example2.png',
        url: expect.any(String),
        createdAt: expect.any(Date),
      }),
    )
  })
})
