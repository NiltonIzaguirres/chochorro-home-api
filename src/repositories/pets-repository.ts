import { Pet, Prisma } from '@prisma/client'

export interface FindManyPetsByQuery {
  age?: number
  type?: string
  city?: string
  energy?: number
  independence?: 'LOW' | 'MEDIUM' | 'HIGH'
  environment?: 'LITTLE' | 'MEDIUM' | 'WIDE'
  shape?: 'SMALL' | 'MEDIUM' | 'BIG'
}

export interface FindManyPetsByQueryParams {
  query: FindManyPetsByQuery
  page: number
}

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  save(data: Pet): Promise<Pet>
  findManyByQuery(data: FindManyPetsByQueryParams): Promise<Pet[]>
  findById(id: string): Promise<Pet | null>
}
