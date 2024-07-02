import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryRequirementsRepository } from '@/repositories/in-memory/in-memory-requirements-repository'
import { FetchRequirements } from './fetch-requirements'

let requirementsRepository: InMemoryRequirementsRepository
let sut: FetchRequirements

describe('Fetch Requirement Use Case', async () => {
  beforeEach(async () => {
    requirementsRepository = new InMemoryRequirementsRepository()
    sut = new FetchRequirements(requirementsRepository)
  })

  it('should be able to get requirements by pet id', async () => {
    await requirementsRepository.create({
      text: 'requirement 01',
      petId: 'pet-id-01',
    })

    await requirementsRepository.create({
      text: 'requirement 01',
      petId: 'pet-id-01',
    })

    await requirementsRepository.create({
      text: 'requirement 01',
      petId: 'pet-id-02',
    })

    const { requirements } = await sut.execute({
      petId: 'pet-id-01',
    })

    expect(requirements).toHaveLength(2)
    expect(requirements[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        petId: 'pet-id-01',
      }),
    )
    expect(requirements[1]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        petId: 'pet-id-01',
      }),
    )
  })
})
