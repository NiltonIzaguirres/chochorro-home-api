import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryRequirementsRepository } from '@/repositories/in-memory/in-memory-requirements-repository'
import { CreateRequirementUseCase } from './create-requirement'

let requirementsRepository: InMemoryRequirementsRepository
let sut: CreateRequirementUseCase

describe('Create requirement Use Case', async () => {
  beforeEach(() => {
    requirementsRepository = new InMemoryRequirementsRepository()
    sut = new CreateRequirementUseCase(requirementsRepository)
  })

  it('should be able to create a requirement', async () => {
    const { requirement } = await sut.execute({
      text: 'Requirement 01',
      petId: 'pet-id-01',
    })

    expect(requirement).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        text: 'Requirement 01',
        petId: 'pet-id-01',
      }),
    )
  })
})
