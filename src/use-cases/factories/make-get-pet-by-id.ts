import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { GetPetByIdUseCase } from '../get-pet-by-id'

export function makeGetPetById() {
  const petsRepository = new PrismaPetsRepository()
  const getPetByIdUseCase = new GetPetByIdUseCase(petsRepository)
  return getPetByIdUseCase
}
