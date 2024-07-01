import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'
import { FetchPetsByQueryUseCase } from '../fetch-pets-by-query'

export function makeFetchPetsByQuery() {
  const petsRepository = new PrismaPetsRepository()
  const fetchPetsByQuery = new FetchPetsByQueryUseCase(petsRepository)
  return fetchPetsByQuery
}
