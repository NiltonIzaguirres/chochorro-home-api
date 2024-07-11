import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'
import { DeleteFileUseCase } from '../delete-file'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'

export function makeDeleteFile() {
  const filesRepository = new PrismaFilesRepository()
  const petsRepository = new PrismaPetsRepository()
  const deleteFileUseCase = new DeleteFileUseCase(
    filesRepository,
    petsRepository,
  )
  return deleteFileUseCase
}
