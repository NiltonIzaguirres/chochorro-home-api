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

  async findById(id: string) {
    const pet = await prisma.pet.findUnique({ where: { id } })

    return pet
  }

  async findManyByQuery({
    age,
    type,
    energy,
    environment,
    independence,
    shape,
  }: FindManyPetsByQueryParams) {
    const where: Prisma.PetWhereInput = {}

    if (age) {
      where.age = age
    }

    if (energy) {
      where.energy = energy
    }

    if (environment) {
      where.environment = environment
    }

    if (independence) {
      where.independence = independence
    }

    if (shape) {
      where.shape = shape
    }

    if (type) {
      where.type = type
    }

    const pets = await prisma.pet.findMany({
      where,
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
