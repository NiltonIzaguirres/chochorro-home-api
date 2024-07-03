import request from 'supertest'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'

export async function createAndAuthenticateOrg(app: FastifyInstance) {
  await prisma.org.create({
    data: {
      email: 'john@example.com',
      password_hash: await hash('password123', 6),
      address: '123 Main',
      cep: '99999-999',
      phone: '99999999999',
      nameOfPersonResponsible: 'John',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'john@example.com',
    password: 'password123',
  })

  const token = authResponse.body.token

  return { token }
}
