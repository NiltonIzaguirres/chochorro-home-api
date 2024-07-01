import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'
import { DeleteFileUseCase } from '../delete-file'

export function makeDeleteFile() {
  const filesRepository = new PrismaFilesRepository()
  const deleteFileUseCase = new DeleteFileUseCase(filesRepository)
  return deleteFileUseCase
}
