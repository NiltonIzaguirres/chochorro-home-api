import { env } from '@/env'
import { InvalidTypeError } from '@/use-cases/erros/invalid-type-error'
import { makeCreateFile } from '@/use-cases/factories/make-create-file'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function uploadImagePet(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const uploadImageParamsSchema = z.object({
    id: z.string(),
  })

  const data = await request.file()

  if (!data) {
    throw new Error('No file uploaded')
  }

  const { id } = uploadImageParamsSchema.parse(request.params)

  const createFile = makeCreateFile()

  try {
    const { file } = await createFile.execute({
      fileData: data.file,
      fileName: data.filename,
      mimeType: data.mimetype,
      uploadDir: env.UPLOAD_DIR,
      petId: id,
    })

    reply.status(201).send({
      file: {
        ...file,
        url: env.APP_DOMAIN,
      },
    })
  } catch (err) {
    if (err instanceof InvalidTypeError) {
      reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
