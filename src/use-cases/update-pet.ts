import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

interface UpdatePetUseCaseRequest extends Pet {}

interface UpdatePetUseCaseResponse {
  pet: Pet
}

export class UpdatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute(
    data: UpdatePetUseCaseRequest,
  ): Promise<UpdatePetUseCaseResponse> {
    const petExist = await this.petsRepository.findById(data.id)

    if (!petExist) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.save({
      ...data,
    })

    return { pet }
  }
}
