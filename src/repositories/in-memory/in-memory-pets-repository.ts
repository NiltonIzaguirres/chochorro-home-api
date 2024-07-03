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

  async findManyByQuery({ query, page }: FindManyPetsByQueryParams) {
    let filteredPets = this.items

    if (query?.age) {
      filteredPets = filteredPets.filter((pet) => pet.age === query.age)
    }

    if (query?.energy) {
      filteredPets = filteredPets.filter((pet) => pet.energy === query.energy)
    }

    if (query?.environment) {
      filteredPets = filteredPets.filter(
        (pet) => pet.environment === query.environment,
      )
    }

    if (query?.independence) {
      filteredPets = filteredPets.filter(
        (pet) => pet.independence === query.independence,
      )
    }

    if (query?.shape) {
      filteredPets = filteredPets.filter((pet) => pet.shape === query.shape)
    }

    if (query?.type) {
      filteredPets = filteredPets.filter((pet) => pet.type === query.type)
    }

    if (query?.city) {
      filteredPets = filteredPets.filter((pet) => pet.city === query.city)
    }

    const petsWithImages = filteredPets.map((pet) => ({
      ...pet,
      images: [
        {
          id: randomUUID(),
          name: 'Pet Image',
          key: `${pet.id}.jpg`,
          createdAt: new Date(),
          petId: pet.id,
        },
      ],
    }))

    return petsWithImages.slice((page - 1) * 20, page * 20)
  }

  async save(pet: Pet) {
    const petIndex = this.items.findIndex((item) => item.id === pet.id)

    if (petIndex >= 0) {
      this.items[petIndex] = pet
    }

    return pet
  }
}
