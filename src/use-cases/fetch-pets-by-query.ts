import { env } from '@/env'
import {
  FindManyPetsByQuery,
  PetsRepository,
} from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface PetObject extends Pet {
  imageURL: string
}

interface FetchPetsByQueryUseCaseRequest {
  query: FindManyPetsByQuery
  page?: number
}

interface FetchPetsByQueryUseCaseResponse {
  pets: PetObject[]
}

export class FetchPetsByQueryUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}
  async execute({
    query,
    page = 1,
  }: FetchPetsByQueryUseCaseRequest): Promise<FetchPetsByQueryUseCaseResponse> {
    const filteredPets = await this.petsRepository.findManyByQuery({
      query,
      page,
    })

    const pets = filteredPets.map((pet) => ({
      ...pet,
      imageURL: `${env.APP_DOMAIN}/${env.UPLOAD_DIR}/${pet.images[0]?.key}`,
    }))

    return { pets }
  }
}
