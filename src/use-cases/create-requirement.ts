import { RequirementsRepository } from '@/repositories/requirements-repository'
import { Requirement } from '@prisma/client'

interface CreateRequirementUseCaseRequest {
  text: string
  petId: string
}

interface CreateRequirementUseCaseResponse {
  requirement: Requirement
}

export class CreateRequirementUseCase {
  constructor(private requirementsRepository: RequirementsRepository) {}

  async execute({
    text,
    petId,
  }: CreateRequirementUseCaseRequest): Promise<CreateRequirementUseCaseResponse> {
    const requirement = await this.requirementsRepository.create({
      text,
      petId,
    })

    return { requirement }
  }
}
