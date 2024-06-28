import { FilesRepository } from '@/repositories/files-repository'
import { File } from '@prisma/client'
import fs from 'node:fs'
import path from 'path'
import { randomUUID } from 'node:crypto'

interface CreateFileUseCaseRequest {
  fileData: NodeJS.ReadableStream
  fileName: string
  mimeType: string
  uploadDir: string
  petId: string
}

interface CreateFileUseCaseResponse {
  file: File
}

export class CreateFileUseCase {
  constructor(private readonly repository: FilesRepository) {}
  async execute({
    fileData,
    fileName,
    mimeType,
    uploadDir,
    petId,
  }: CreateFileUseCaseRequest): Promise<CreateFileUseCaseResponse> {
    try {
      const imageMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/tiff',
        'image/webp',
        'image/svg+xml',
      ]

      const fileKey = randomUUID().concat('-').concat(fileName)
      const uploadPath = path.join(uploadDir, fileKey)

      const writableStream = fs.createWriteStream(uploadPath)

      if (!imageMimeTypes.includes(mimeType)) {
        throw new Error('Invalid file type')
      }

      await fileData.pipe(writableStream)

      const file = await this.repository.create({
        key: fileKey,
        name: fileName,
        petId,
      })

      return { file }
    } catch (err) {
      console.log(err)
      throw new Error('Failed to upload file')
    }
  }
}
