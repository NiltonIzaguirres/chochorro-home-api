import { ResourceNotFoundError } from '@/use-cases/erros/resource-not-found-error'
import { makeUpdatePet } from '@/use-cases/factories/make-update-pet'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updatePet(request: FastifyRequest, reply: FastifyReply) {
  const updatePetParamsSchema = z.object({ id: z.string().uuid() })
  const updatePetBodySchema = z.object({
    name: z.string(),
    type: z.string(),
    city: z.string(),
    about: z.string(),
    age: z.number(),
    energy: z.number().min(1).max(5),
    independence: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    environment: z.enum(['LITTLE', 'MEDIUM', 'WIDE']),
    shape: z.enum(['SMALL', 'MEDIUM', 'BIG']),
    createdAt: z.coerce.date(),
  })

  const petBody = updatePetBodySchema.parse(request.body)
  const { id } = updatePetParamsSchema.parse(request.params)

  const updatePet = makeUpdatePet()

  try {
    const { pet } = await updatePet.execute({
      ...petBody,
      id,
      orgId: request.user.sub,
    })
    reply.status(200).send({ pet })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      reply.status(404).send({ message: err.message })
    }

    throw err
  }
}
