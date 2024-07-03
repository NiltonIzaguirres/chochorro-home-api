import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { refresh } from './refresh'
import { profile } from './profile'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function orgsRoutes(app: FastifyInstance) {
  app.post('/orgs', register)
  app.post('/sessions', authenticate)

  app.patch('/token/refresh', refresh)

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
