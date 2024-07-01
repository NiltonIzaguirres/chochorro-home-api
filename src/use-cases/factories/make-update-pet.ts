import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { UpdatePetUseCase } from '../update-pet'

export function makeUpdatePet() {
  const petsRepository = new PrismaPetsRepository()
  const updatePetUseCase = new UpdatePetUseCase(petsRepository)
  return updatePetUseCase
}
