import { makeGetPetById } from '@/use-cases/factories/make-get-pet-by-id'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function getPet(request: FastifyRequest, reply: FastifyReply) {
  const getPetParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getPetParamsSchema.parse(request.params)

  const getPetById = makeGetPetById()

  const { pet } = await getPetById.execute({
    id,
  })

  reply.status(200).send({ pet })
}
