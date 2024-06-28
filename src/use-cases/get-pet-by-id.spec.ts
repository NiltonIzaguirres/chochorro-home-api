import { describe, it, expect, beforeEach } from 'vitest'
import { GetPetByIdUseCase } from './get-pet-by-id'
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let petsRepository: InMemoryPetsRepository
let sut: GetPetByIdUseCase

describe('Get pet by id Use Case', () => {
  beforeEach(() => {
    petsRepository = new InMemoryPetsRepository()
    sut = new GetPetByIdUseCase(petsRepository)
  })

  it('should be able to get a pet by id', async () => {
    const pet = await petsRepository.create({
      name: 'John Doe',
      about: 'I am a pet owner',
      age: 2,
      energy: 5,
      independence: 'LOW',
      environment: 'LITTLE',
      shape: 'SMALL',
      orgId: 'org-id-01',
    })

    await expect(sut.execute({ id: pet.id })).resolves.toEqual({ pet })
  })

  it('should not be able to get a pet with invalid id', async () => {
    await expect(sut.execute({ id: 'invalid-id' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
