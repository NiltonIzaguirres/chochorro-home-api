import { FastifyInstance } from 'fastify'
import { fetchPets } from './fetch-pets'
import { createPet } from './create-pet'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', fetchPets)

  app.post('/pets', { onRequest: [verifyJWT] }, createPet)
}
