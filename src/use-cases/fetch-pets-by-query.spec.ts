import { describe, it, expect, beforeEach } from 'vitest'
import { FetchPetsByQueryUseCase } from './fetch-pets-by-query'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

let petsRepository: InMemoryPetsRepository
let sut: FetchPetsByQueryUseCase
describe('Fetch pets by query Use Case', async () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new FetchPetsByQueryUseCase(petsRepository)
  })

  it('should fetch pets with query params', async () => {
    await petsRepository.create({
      name: 'John Doe',
      about: 'A friendly and playful dog',
      age: 3,
      energy: 5,
      independence: 'LOW',
      environment: 'WIDE',
      shape: 'BIG',
      orgId: 'org123',
    })

    await petsRepository.create({
      name: 'Get pet',
      about: 'This pet',
      age: 20,
      energy: 3,
      independence: 'MEDIUM',
      environment: 'MEDIUM',
      shape: 'SMALL',
      orgId: 'org123',
    })

    const { pets } = await sut.execute({
      age: 20,
      energy: 3,
      environment: 'MEDIUM',
      independence: 'MEDIUM',
      shape: 'SMALL',
    })

    expect(pets).toHaveLength(1)
    expect(pets[0]).toEqual(
      expect.objectContaining({
        name: 'Get pet',
        about: 'This pet',
      }),
    )
  })
})
