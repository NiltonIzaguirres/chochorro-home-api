import { PrismaFilesRepository } from '@/repositories/prisma/prisma-files-repository'
import { FetchFileUseCase } from '../fetch-file'
export function makeFetchFile() {
  const filesRepository = new PrismaFilesRepository()
  const fetchFileUseCase = new FetchFileUseCase(filesRepository)
  return fetchFileUseCase
}
