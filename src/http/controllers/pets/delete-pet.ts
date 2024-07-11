import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/erros/unauthorized-error'
import { makeDeletePet } from '@/use-cases/factories/make-delete-pet'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function deletePet(request: FastifyRequest, reply: FastifyReply) {
  const deletePetParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deletePetParamsSchema.parse(request.params)

  const deletePet = makeDeletePet()

  try {
    await deletePet.execute({
      id,
      sub: request.user.sub,
    })
    reply.status(200).send()
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404).send({ message: err.message })
    }
    if (err instanceof UnauthorizedError) {
      reply.status(403).send({ message: err.message })
    }

    throw err
  }
}
