import { makeGetOrgProfileById } from '@/use-cases/factories/make-get-org-profile-by-id'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getOrgProfileById = makeGetOrgProfileById()

  const { org } = await getOrgProfileById.execute({
    id: request.user.sub,
  })

  reply.status(200).send({
    org: {
      ...org,
      password_hash: undefined,
    },
  })
}
