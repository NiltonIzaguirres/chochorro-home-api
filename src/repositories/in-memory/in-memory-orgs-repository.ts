import { Org, Prisma } from '@prisma/client'
import { OrgsRepository } from '../orgs-repository'

export class InMemoryOrgsRepository implements OrgsRepository {
  public items: Org[] = []
  async create(data: Prisma.OrgCreateInput) {
    const org = {
      id: Date.now().toString(),
      cep: data.cep,
      email: data.email,
      address: data.address,
      nameOfPersonResponsible: data.nameOfPersonResponsible,
      password_hash: data.password_hash,
      phone: data.phone,
      createdAt: new Date(),
    }

    this.items.push(org)

    return org
  }

  async findByEmail(email: string) {
    const org = this.items.find((item) => item.email === email)

    if (!org) {
      return null
    }

    return org
  }

  async findById(id: string) {
    const org = await this.items.find((item) => item.id === id)

    if (!org) {
      return null
    }

    return org
  }
}
