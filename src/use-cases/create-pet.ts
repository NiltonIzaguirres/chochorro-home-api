import { PetsRepository } from '@/repositories/pets-repository'
import { Pet } from '@prisma/client'

interface CreatePetUseCaseRequest {
  name: string
  type: string
  city: string
  about: string
  age: number
  energy: number
  independence: 'LOW' | 'MEDIUM' | 'HIGH'
  environment: 'LITTLE' | 'MEDIUM' | 'WIDE'
  shape: 'SMALL' | 'MEDIUM' | 'BIG'
  orgId: string
}

interface CreatePetUseCaseResponse {
  pet: Pet
}

export class CreatePetUseCase {
  constructor(private petsRepository: PetsRepository) {}

  async execute({
    about,
    type,
    city,
    age,
    energy,
    independence,
    environment,
    name,
    orgId,
    shape,
  }: CreatePetUseCaseRequest): Promise<CreatePetUseCaseResponse> {
    const pet = await this.petsRepository.create({
      name,
      city,
      about,
      age,
      type,
      energy,
      independence,
      environment,
      shape,
      orgId,
    })

    return { pet }
  }
}
