import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error'
import { makeAuthenticate } from '@/use-cases/factories/make-authenticate'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticate = makeAuthenticate()
    const { org } = await authenticate.execute({ email, password })

    const token = await reply.jwtSign({}, { sign: { sub: org.id } })

    reply.status(200).send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      reply.status(401).send(err.message)
    }

    throw err
  }
}
