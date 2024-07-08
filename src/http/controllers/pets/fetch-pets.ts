import { makeFetchPetsByQuery } from '@/use-cases/factories/make-fetch-pets-by-query'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function fetchPets(request: FastifyRequest, reply: FastifyReply) {
  const fetchQueryParamsSchema = z.object({
    age: z.coerce.number().int().min(1).optional(),
    type: z.string().optional(),
    city: z.string().optional(),
    energy: z.coerce.number().int().optional(),
    independence: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    environment: z.enum(['LITTLE', 'MEDIUM', 'WIDE']).optional(),
    shape: z.enum(['SMALL', 'MEDIUM', 'BIG']).optional(),
    page: z.coerce.number().int().min(1).default(1),
  })

  const { age, page, city, energy, environment, independence, shape, type } =
    fetchQueryParamsSchema.parse(request.query)

  const getPets = await makeFetchPetsByQuery()
  const { pets } = await getPets.execute({
    query: {
      age,
      type,
      city,
      energy,
      independence,
      environment,
      shape,
    },
    page,
  })

  reply.status(200).send({ pets })
}
