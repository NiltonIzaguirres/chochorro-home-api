import { makeCreatePet } from '@/use-cases/factories/make-create-pet'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createPet(request: FastifyRequest, reply: FastifyReply) {
  const createPetBodySchema = z.object({
    name: z.string(),
    type: z.string(),
    city: z.string(),
    about: z.string(),
    age: z.coerce.number(),
    energy: z.coerce.number().min(1).max(5),
    independence: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    environment: z.enum(['LITTLE', 'MEDIUM', 'WIDE']),
    shape: z.enum(['SMALL', 'MEDIUM', 'BIG']),
  })

  const {
    about,
    age,
    city,
    energy,
    environment,
    independence,
    name,
    shape,
    type,
  } = createPetBodySchema.parse(request.body)
  const createPet = makeCreatePet()
  const { pet } = await createPet.execute({
    about,
    age,
    city,
    energy,
    environment,
    independence,
    name,
    shape,
    type,
    orgId: request.user.sub,
  })

  reply.status(201).send({ pet })
}
