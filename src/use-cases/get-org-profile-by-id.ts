import { OrgsRepository } from '@/repositories/orgs-repository'
import { Org } from '@prisma/client'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

interface GetOrgProfileByIdUseCaseRequest {
  id: string
}

interface GetOrgProfileByIdUseCaseResponse {
  org: Org
}

export class GetOrgProfileByIdUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute({
    id,
  }: GetOrgProfileByIdUseCaseRequest): Promise<GetOrgProfileByIdUseCaseResponse> {
    const org = await this.orgsRepository.findById(id)

    if (!org) {
      throw new ResourceNotFoundError()
    }

    return { org }
  }
}
