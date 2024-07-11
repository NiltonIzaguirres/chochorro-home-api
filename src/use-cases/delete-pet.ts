import { ResourceNotFoundError } from './erros/resource-not-found-error'
import { UnauthorizedError } from './erros/unauthorized-error'
import { PetsRepository } from '@/repositories/pets-repository'

interface DeletePetUseCaseRequest {
  id: string
  sub: string
}

export class DeletePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({ id, sub }: DeletePetUseCaseRequest): Promise<void> {
    const pet = await this.petsRepository.findById(id)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    if (pet.orgId !== sub) {
      throw new UnauthorizedError()
    }

    await this.petsRepository.delete(pet.id)
  }
}
