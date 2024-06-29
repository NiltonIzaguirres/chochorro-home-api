import { FilesRepository } from '@/repositories/files-repository'
import { File } from '@prisma/client'
import fs from 'node:fs'
import path from 'path'
import { randomUUID } from 'node:crypto'
import { InvalidTypeError } from './erros/invalid-type-error'

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
    const imageMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
      'image/webp',
      'image/svg+xml',
    ]

    if (!imageMimeTypes.includes(mimeType)) {
      throw new InvalidTypeError()
    }

    const fileKey = randomUUID().concat('-').concat(fileName)
    const uploadPath = path.join(uploadDir, fileKey)
    try {
      const writableStream = fs.createWriteStream(uploadPath)
      await fileData.pipe(writableStream)
    } catch (err) {
      throw new Error('Failed to upload file')
    }

    const file = await this.repository.create({
      key: fileKey,
      name: fileName,
      petId,
    })

    return { file }
  }
}
