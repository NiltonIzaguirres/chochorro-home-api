import { OrgsRepository } from '@/repositories/orgs-repository'

export class AuthenticateUseCase {
  constructor(private orgsRepository: OrgsRepository) {}

  async execute() {}
}
