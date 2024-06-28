import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

interface GetPetByIdUseCaseRequest {
  id: string
}

interface GetPetByIdUseCaseResponse {
  pet: Pet
}

export class GetPetByIdUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}

  async execute({
    id,
  }: GetPetByIdUseCaseRequest): Promise<GetPetByIdUseCaseResponse> {
    const pet = await this.petsRepository.findById(id)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    return { pet }
  }
}
