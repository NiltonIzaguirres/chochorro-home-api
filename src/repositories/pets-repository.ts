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

type FindManyByQueryResponse = ({
  images: {
    id: string
    name: string
    key: string
    createdAt: Date
    petId: string
  }[]
} & Pet)[]

export interface PetsRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  delete(id: string): Promise<void>
  save(data: Pet): Promise<Pet>
  findManyByQuery(
    data: FindManyPetsByQueryParams,
  ): Promise<FindManyByQueryResponse>
  findById(id: string): Promise<Pet | null>
}
