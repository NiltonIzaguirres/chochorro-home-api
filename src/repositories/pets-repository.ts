import { Pet, Prisma } from '@prisma/client'

export interface FindManyPetsByQueryParams {
  age?: number
  energy?: number
  independence?: 'LOW' | 'MEDIUM' | 'HIGH'
  environment?: 'LITTLE' | 'MEDIUM' | 'HIGH'
  shape?: 'SMALL' | 'MEDIUM' | 'BIG'
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  save(data: Pet): Promise<Pet>
  findManyByQuery(data: FindManyPetsByQueryParams): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
}
