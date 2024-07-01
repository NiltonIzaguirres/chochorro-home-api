import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import { UpdatePetUseCase } from './update-pet'

let petsRepository: InMemoryPetsRepository
let sut: UpdatePetUseCase

describe('Create pet Use Case', async () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new UpdatePetUseCase(petsRepository)
  })

  it('should be able to update a pet', async () => {
    const createdPet = await petsRepository.create({
      name: 'John Doe Smith',
      type: 'dog',
      about: 'A friendly',
      age: 33,
      energy: 1,
      independence: 'MEDIUM',
      environment: 'MEDIUM',
      shape: 'SMALL',
      orgId: 'org123',
    })

    const { pet } = await sut.execute({
      id: createdPet.id,
      type: 'cat',
      name: 'John Doe',
      about: 'A friendly and playful dog',
      age: 3,
      energy: 5,
      independence: 'LOW',
      environment: 'WIDE',
      shape: 'BIG',
      orgId: 'org123',
      createdAt: createdPet.createdAt,
    })

    expect(pet).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: 'John Doe',
        about: 'A friendly and playful dog',
        energy: 5,
      }),
    )
  })

  it('should throw an error when trying to update pet a non-existent', async () => {
    await expect(
      sut.execute({
        id: 'not-exist-id',
        type: 'cat',
        name: 'John Doe',
        about: 'A friendly and playful dog',
        age: 3,
        energy: 5,
        independence: 'LOW',
        environment: 'WIDE',
        shape: 'BIG',
        orgId: 'org123',
        createdAt: new Date(),
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
