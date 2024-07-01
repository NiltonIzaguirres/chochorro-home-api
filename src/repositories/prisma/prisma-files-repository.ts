import { Prisma } from '@prisma/client'
import { FilesRepository } from '../files-repository'
import { prisma } from '@/lib/prisma'

export class PrismaFilesRepository implements FilesRepository {
  async create(data: Prisma.FileUncheckedCreateInput) {
    const file = await prisma.file.create({
      data,
    })

    return file
  }

  async delete(id: string) {
    await prisma.file.delete({
      where: { id },
    })
  }

  async findById(id: string) {
    const file = await prisma.file.findUnique({ where: { id } })

    return file
  }

  async findByPetId(petId: string) {
    const files = await prisma.file.findMany({ where: { petId } })

    return files
  }
}
