import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'
import { CreateFileUseCase } from '../create-file'
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository'

export function makeCreateFile() {
  const filesRepository = new PrismaFilesRepository()
  const petsRepository = new PrismaPetsRepository()
  const createFileUseCase = new CreateFileUseCase(
    filesRepository,
    petsRepository,
  )
  return createFileUseCase
}
