import { Prisma, File } from '@prisma/client'

export interface FilesRepository {
  create(data: Prisma.FileUncheckedCreateInput): Promise<File>
  delete(id: string): void
  findById(id: string): Promise<File | null>
  findByPetId(petId: string): Promise<File[]>
}
