import { Prisma, File } from '@prisma/client'

export interface FilesRepository {
  create(data: Prisma.FileUncheckedCreateInput): Promise<File>
  delete(id: string): void
  findByPetId(petId: string): Promise<File | null>
}
