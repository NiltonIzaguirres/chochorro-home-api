import { Prisma, Requirement } from '@prisma/client'
import { RequirementsRepository } from '../requirements-repository'
import { randomUUID } from 'crypto'

export class InMemoryRequirementsRepository implements RequirementsRepository {
  public requirements: Requirement[] = []

  async create(
    data: Prisma.RequirementUncheckedCreateInput,
  ): Promise<Requirement> {
    const requirements = {
      id: randomUUID(),
      petId: data.petId,
      text: data.text,
    }

    this.requirements.push(requirements)

    return requirements
  }

  async findByPetId(id: string): Promise<Requirement[]> {
    return this.requirements.filter((requirement) => requirement.petId === id)
  }
}
