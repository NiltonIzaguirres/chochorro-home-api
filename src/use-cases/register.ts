import { OrgsRepository } from '../repositories/orgs-repository'
import { hash } from 'bcryptjs'
import type { Org } from '@prisma/client'
import { OrgAlreadyExistsError } from './erros/org-already-exists-error'

interface RegisterUseCaseRequest {
  nameOfPersonResponsible: string
  email: string
  password: string
  cep: string
  address: string
  phone: string
}

interface RegisterUseCaseResponse {
  org: Org
}

export class RegisterUseCase {
  constructor(private orgsRepository: OrgsRepository) {}
  async execute({
    address,
    cep,
    email,
    nameOfPersonResponsible,
    password,
    phone,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const orgWithSameEmail = await this.orgsRepository.findByEmail(email)

    if (orgWithSameEmail) {
      throw new OrgAlreadyExistsError()
    }

    const org = await this.orgsRepository.create({
      nameOfPersonResponsible,
      address,
      cep,
      email,
      phone,
      password_hash: await hash(password, 6),
    })

    return { org }
  }
}
