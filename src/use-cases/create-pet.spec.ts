import { describe, expect, it, beforeEach } from 'vitest'
import { CreatePetUseCase } from './create-pet'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'

let petsRepository: InMemoryPetsRepository
let sut: CreatePetUseCase

describe('Create pet Use Case', async () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new CreatePetUseCase(petsRepository)
  })

  it('should be able to create a pet', async () => {
    const { pet } = await sut.execute({
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

    expect(pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
      }),
    )
  })
})
