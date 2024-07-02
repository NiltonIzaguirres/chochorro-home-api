import {
  FindManyPetsByQuery,
  PetsRepository,
} from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface FetchPetsByQueryUseCaseRequest {
  query: FindManyPetsByQuery
  page?: number
}

interface FetchPetsByQueryUseCaseResponse {
  pets: Pet[]
}

export class FetchPetsByQueryUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}
  async execute({
    query,
    page = 1,
  }: FetchPetsByQueryUseCaseRequest): Promise<FetchPetsByQueryUseCaseResponse> {
    const pets = await this.petsRepository.findManyByQuery({ query, page })

    return { pets }
  }
}
