import { FilesRepository } from '@/repositories/files-repository'
import fs from 'node:fs'
import { ResourceNotFoundError } from './erros/resource-not-found-error'
import path from 'node:path'
import { FileNotFoundInDiskError } from './erros/file-not-found-in-disk-erro'

interface DeleteFileUseCaseRequest {
  id: string
  uploadDir: string
}

export class DeleteFileUseCase {
  constructor(private filesRepository: FilesRepository) {}

  async execute({ id, uploadDir }: DeleteFileUseCaseRequest): Promise<void> {
    const file = await this.filesRepository.findById(id)

    if (!file) {
      throw new ResourceNotFoundError()
    }

    const pathFile = path.join(uploadDir, file.key)
    // delete file from disk
    const fileExistsInDisk = await fs.existsSync(pathFile)

    if (!fileExistsInDisk) {
      throw new FileNotFoundInDiskError()
    }

    await fs.promises.unlink(pathFile)

    await this.filesRepository.delete(file.id)
  }
}
