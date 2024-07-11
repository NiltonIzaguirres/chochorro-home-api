import { Pet, Prisma } from '@prisma/client'
import { FindManyPetsByQueryParams, PetsRepository } from '../pets-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPetsRepository implements PetsRepository {
  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet = await prisma.pet.create({
      data,
    })

    return pet
  }

  async delete(id: string) {
    await prisma.pet.delete({
      where: { id },
      include: {
        images: true,
        Requirement: true,
      },
    })
  }

  async findById(id: string) {
    const pet = await prisma.pet.findUnique({ where: { id } })

    return pet
  }

  async findManyByQuery({ query, page }: FindManyPetsByQueryParams) {
    const where: Prisma.PetWhereInput = {}

    if (query?.age) {
      where.age = query.age
    }

    if (query?.energy) {
      where.energy = query.energy
    }

    if (query?.environment) {
      where.environment = query.environment
    }

    if (query?.independence) {
      where.independence = query.independence
    }

    if (query?.shape) {
      where.shape = query.shape
    }

    if (query?.type) {
      where.type = query.type
    }

    if (query?.city) {
      where.city = query.city
    }

    const pets = await prisma.pet.findMany({
      where,
      skip: (page - 1) * 20,
      take: 20,
      include: {
        images: {
          take: 1,
        },
      },
    })

    return pets
  }

  async save(data: Pet) {
    const pet = await prisma.pet.update({
      where: { id: data.id },
      data,
    })

    return pet
  }
}
