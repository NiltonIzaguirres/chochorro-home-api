import { FilesRepository } from '@/repositories/files-repository'
import fs from 'node:fs'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import path from 'node:path'
import { FileNotFoundInDiskError } from './erros/file-not-found-in-disk-erro'
import { UnauthorizedError } from './erros/unauthorized-error'
import { PetsRepository } from '@/repositories/pets-repository'

interface DeleteFileUseCaseRequest {
  id: string
  sub: string
  uploadDir: string
}

export class DeleteFileUseCase {
  constructor(
    private filesRepository: FilesRepository,
    private petsRepository: PetsRepository,
  ) {}

  async execute({
    id,
    sub,
    uploadDir,
  }: DeleteFileUseCaseRequest): Promise<void> {
    const file = await this.filesRepository.findById(id)

    if (!file) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.findById(file.petId)

    if (pet?.orgId !== sub) {
      throw new UnauthorizedError()
    }

    const pathFile = path.join(uploadDir, file.key)

    const fileExistsInDisk = await fs.existsSync(pathFile)

    if (!fileExistsInDisk) {
      throw new FileNotFoundInDiskError()
    }

    await fs.promises.unlink(pathFile)

    await this.filesRepository.delete(file.id)
  }
}
