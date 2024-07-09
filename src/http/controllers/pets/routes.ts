import { FastifyInstance } from 'fastify'
import { fetchPets } from './fetch-pets'
import { createPet } from './create-pet'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { getPet } from './get-pet'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', fetchPets)

  app.get('/pets/:id', getPet)

  app.post('/pets', { onRequest: [verifyJWT] }, createPet)
}
