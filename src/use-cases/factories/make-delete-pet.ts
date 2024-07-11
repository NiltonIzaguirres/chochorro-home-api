import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { DeletePetUseCase } from '../delete-pet'

export function makeDeletePet() {
  const petsRepository = new PrismaPetsRepository()
  const deletePetUseCase = new DeletePetUseCase(petsRepository)
  return deletePetUseCase
}
