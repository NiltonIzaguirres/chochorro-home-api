import { Pet, Prisma } from '@prisma/client'
import { FindManyPetsByQueryParams, PetsRepository } from '../pets-repository'
import { randomUUID } from 'crypto'

export class InMemoryPetsRepository implements PetsRepository {
  public items: Pet[] = []

  async create(data: Prisma.PetUncheckedCreateInput) {
    const pet: Pet = {
      id: randomUUID(),
      name: data.name,
      city: data.city,
      type: data.type,
      about: data.about,
      age: data.age,
      energy: data.energy,
      independence: data.independence,
      environment: data.environment,
      shape: data.shape,
      createdAt: new Date(),
      orgId: data.orgId,
    }

    this.items.push(pet)

    return pet
  }

  async findById(id: string) {
    const pet = this.items.find((item) => item.id === id)

    if (!pet) {
      return null
    }

    return pet
  }

  async findManyByQuery({
    age,
    type,
    city,
    energy,
    environment,
    independence,
    shape,
  }: FindManyPetsByQueryParams) {
    let filteredPets = this.items

    if (age) {
      filteredPets = filteredPets.filter((pet) => pet.age === age)
    }

    if (energy) {
      filteredPets = filteredPets.filter((pet) => pet.energy === energy)
    }

    if (environment) {
      filteredPets = filteredPets.filter((pet) => pet.age === age)
    }

    if (independence) {
      filteredPets = filteredPets.filter((pet) => pet.age === age)
    }

    if (shape) {
      filteredPets = filteredPets.filter((pet) => pet.age === age)
    }

    if (type) {
      filteredPets = filteredPets.filter((pet) => pet.type === type)
    }

    if (city) {
      filteredPets = filteredPets.filter((pet) => pet.type === type)
    }

    return filteredPets
  }

  async save(pet: Pet) {
    const petIndex = this.items.findIndex((item) => item.id === pet.id)

    if (petIndex >= 0) {
      this.items[petIndex] = pet
    }

    return pet
  }
}
