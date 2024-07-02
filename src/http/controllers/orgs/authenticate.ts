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
    await authenticate.execute({ email, password })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      reply.status(401).send(err.message)
    }

    throw err
  }

  reply.status(200).send('ok')
}
