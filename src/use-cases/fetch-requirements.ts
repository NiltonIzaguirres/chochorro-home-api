import { RequirementsRepository } from '@/repositories/requirements-repository'
import { Requirement } from '@prisma/client'

interface FetchRequirementsRequest {
  petId: string
}

interface FetchRequirementsResponse {
  requirements: Requirement[]
}

export class FetchRequirements {
  constructor(private requirementsRepository: RequirementsRepository) {}
  async execute({
    petId,
  }: FetchRequirementsRequest): Promise<FetchRequirementsResponse> {
    const requirements = await this.requirementsRepository.findByPetId(petId)

    return { requirements }
  }
}
