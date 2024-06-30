import { env } from '@/env'
import { FilesRepository } from '@/repositories/files-repository'

interface FetchFileUseCaseRequest {
  petId: string
}

interface FetchFileUseCaseResponse {
  files: {
    id: string
    url: string
    name: string
    key: string
    createdAt: Date
    petId: string
  }[]
}

export class FetchFileUseCase {
  constructor(private filesRepository: FilesRepository) {}
  async execute({
    petId,
  }: FetchFileUseCaseRequest): Promise<FetchFileUseCaseResponse> {
    const filesWithSamePetId = await this.filesRepository.findByPetId(petId)

    const files = filesWithSamePetId.map((file) => ({
      id: file.id,
      url: `${env.APP_DOMAIN}/public/uploads/${file.key}`,
      name: file.name,
      key: file.key,
      createdAt: file.createdAt,
      petId: file.petId,
    }))

    return { files }
  }
}
