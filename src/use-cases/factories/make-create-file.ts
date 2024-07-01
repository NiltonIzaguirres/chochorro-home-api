import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'
import { CreateFileUseCase } from '../create-file'

export function makeCreateFile() {
  const filesRepository = new PrismaFilesRepository()
  const createFileUseCase = new CreateFileUseCase(filesRepository)
  return createFileUseCase
}
