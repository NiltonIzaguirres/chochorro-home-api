import { FilesRepository } from '@/repositories/files-repository'
import fs from 'node:fs'
import path from 'path'
import { randomUUID } from 'node:crypto'
import { InvalidTypeError } from './erros/invalid-type-error'
import { FailedToUploadFileError } from './erros/failed-to-upload-file-error'
import { env } from '@/env'
import { PetsRepository } from '@/repositories/pets-repository'
import { UnauthorizedError } from './erros/unauthorized-error'

interface CreateFileUseCaseRequest {
  fileData: NodeJS.ReadableStream
  fileName: string
  mimeType: string
  uploadDir: string
  petId: string
  sub: string
}

interface CreateFileUseCaseResponse {
  file: {
    id: string
    name: string
    key: string
    createdAt: Date
    petId: string
    imageURL: string
  }
}

export class CreateFileUseCase {
  constructor(
    private readonly repository: FilesRepository,
    private petsRepository: PetsRepository,
  ) {}

  async execute({
    fileData,
    fileName,
    mimeType,
    uploadDir,
    petId,
    sub,
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

    const pet = await this.petsRepository.findById(petId)

    if (pet?.orgId !== sub) {
      throw new UnauthorizedError()
    }

    const fileKey = randomUUID().concat('-').concat(fileName)
    const uploadPath = path.join(uploadDir, fileKey)
    try {
      const writableStream = fs.createWriteStream(uploadPath)
      await fileData.pipe(writableStream)
    } catch (err) {
      throw new FailedToUploadFileError()
    }

    const file = await this.repository.create({
      key: fileKey,
      name: fileName,
      petId,
    })

    return {
      file: {
        ...file,
        imageURL: `${env.APP_DOMAIN}/${env.UPLOAD_DIR}/${file.key}`,
      },
    }
  }
}
