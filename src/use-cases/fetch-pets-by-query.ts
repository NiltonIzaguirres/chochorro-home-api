import {
  FindManyPetsByQueryParams,
  PetsRepository,
} from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface FetchPetsByQueryUseCaseRequest extends FindManyPetsByQueryParams {}

interface FetchPetsByQueryUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByQueryUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}
  async execute({
    age,
    energy,
    environment,
    independence,
    shape,
  }: FetchPetsByQueryUseCaseRequest): Promise<FetchPetsByQueryUseCaseResponse> {
    const pets = await this.petsRepository.findManyByQuery({
      age,
      energy,
      environment,
      independence,
      shape,
    })

    return { pets }
  }
}
