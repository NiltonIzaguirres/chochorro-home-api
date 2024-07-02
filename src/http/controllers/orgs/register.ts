import { OrgAlreadyExistsError } from '@/use-cases/erros/org-already-exists-error'
import { makeRegister } from '@/use-cases/factories/make-register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const bodyRequestSchema = z.object({
    nameOfPersonResponsible: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    cep: z.string().min(9).max(9),
    address: z.string(),
    phone: z.string().min(10).max(11),
  })

  const { nameOfPersonResponsible, email, password, cep, address, phone } =
    bodyRequestSchema.parse(request.body)

  try {
    const register = makeRegister()

    await register.execute({
      nameOfPersonResponsible,
      email,
      password,
      cep,
      address,
      phone,
    })
  } catch (err) {
    if (err instanceof OrgAlreadyExistsError) {
      reply.status(409).send({ message: err.message })
    }

    throw err
  }

  reply.status(201).send()
}
