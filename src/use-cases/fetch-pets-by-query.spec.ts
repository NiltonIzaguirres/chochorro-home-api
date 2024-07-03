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

  it('should fetch pets without params', async () => {
    await petsRepository.create({
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

    await petsRepository.create({
      name: 'Get pet',
      city: 'San Francisco',
      type: 'dog',
      about: 'This pet',
      age: 20,
      energy: 3,
      independence: 'MEDIUM',
      environment: 'MEDIUM',
      shape: 'SMALL',
      orgId: 'org123',
    })

    const { pets } = await sut.execute({
      query: {},
    })

    expect(pets).toHaveLength(2)
    expect(pets[0]).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        about: 'A friendly and playful dog',
      }),
    )
  })

  it('should fetch pets with query params', async () => {
    await petsRepository.create({
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

    await petsRepository.create({
      name: 'Get pet',
      city: 'San Francisco',
      type: 'dog',
      about: 'This pet',
      age: 20,
      energy: 3,
      independence: 'MEDIUM',
      environment: 'MEDIUM',
      shape: 'SMALL',
      orgId: 'org123',
    })

    const { pets } = await sut.execute({
      query: {
        age: 20,
        type: 'dog',
        city: 'San Francisco',
        energy: 3,
        environment: 'MEDIUM',
        independence: 'MEDIUM',
        shape: 'SMALL',
      },
    })

    expect(pets).toHaveLength(1)
    expect(pets[0]).toEqual(
      expect.objectContaining({
        name: 'Get pet',
        about: 'This pet',
      }),
    )
  })

  it('should be able to fetch paginated pets with query params', async () => {
    for (let i = 1; i <= 22; i++) {
      await petsRepository.create({
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
    }

    const { pets } = await sut.execute({
      query: {
        type: 'dog',
        city: 'San Francisco',
      },
      page: 2,
    })

    expect(pets).toHaveLength(2)
    expect(pets[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        type: 'dog',
        city: 'San Francisco',
      }),
    )
  })
})
