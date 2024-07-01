import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { CreatePetUseCase } from '../create-pet'

export function makeCreatePet() {
  const petsRepository = new PrismaPetsRepository()
  const createPetUseCase = new CreatePetUseCase(petsRepository)
  return createPetUseCase
}
