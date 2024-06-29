import { Prisma, File } from '@prisma/client'
import { FilesRepository } from '../files-repository'
import { randomUUID } from 'crypto'

export class InMemoryFilesRepository implements FilesRepository {
  public items: File[] = []

  async create({ key, name, petId }: Prisma.FileUncheckedCreateInput) {
    const file = {
      id: randomUUID(),
      key,
      name,
      petId,
      createdAt: new Date(),
    }

    this.items.push(file)

    return file
  }

  async delete(id: string) {
    const index = this.items.findIndex((item) => item.id === id)

    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async findByPetId(petId: string) {
    const file = this.items.filter((item) => item.petId === petId)

    return file
  }
}
