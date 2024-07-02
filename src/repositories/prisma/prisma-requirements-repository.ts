import { Prisma } from '@prisma/client'
import { RequirementsRepository } from '../requirements-repository'
import { prisma } from '@/lib/prisma'

export class PrismaRequirementsRepository implements RequirementsRepository {
  async create({ petId, text }: Prisma.RequirementUncheckedCreateInput) {
    const requirement = await prisma.requirement.create({
      data: {
        petId,
        text,
      },
    })

    return requirement
  }

  async findByPetId(petId: string) {
    const requirements = await prisma.requirement.findMany({
      where: {
        petId,
      },
    })

    return requirements
  }
}
