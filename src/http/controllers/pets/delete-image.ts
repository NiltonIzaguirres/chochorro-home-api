import { env } from '@/env'
import { FileNotFoundInDiskError } from '@/use-cases/erros/file-not-found-in-disk-erro'
import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error'
import { makeDeleteFile } from '@/use-cases/factories/make-delete-file'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deleteImagePet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteImageParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteImageParamsSchema.parse(request.params)

  const deleteFile = makeDeleteFile()

  try {
    await deleteFile.execute({ id, uploadDir: env.UPLOAD_DIR })
    reply.status(200).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404).send({ message: err.message })
    }
    if (err instanceof FileNotFoundInDiskError) {
      reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
