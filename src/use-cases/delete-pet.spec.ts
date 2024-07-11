import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { DeletePetUseCase } from './delete-pet'
import { UnauthorizedError } from './erros/unauthorized-error'

let petsRepository: InMemoryPetsRepository
let sut: DeletePetUseCase

describe('Delete Pet UseCase', () => {
  beforeEach(async () => {
    petsRepository = new InMemoryPetsRepository()
    sut = new DeletePetUseCase(petsRepository)
  })

  it('should be able to delete a pet', async () => {
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

    await sut.execute({
      id: pet.id,
      sub: pet.orgId,
    })

    await expect(await petsRepository.findById(pet.id)).toBeNull()
  })

  it('should throw an error when trying to delete a non-existent pet', async () => {
    await expect(
      sut.execute({
        id: 'non-existent-id',
        sub: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should throw an error when trying to delete a pet with wrong sub id', async () => {
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
        id: pet.id,
        sub: 'non-existent-id',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedError)
  })
})
