import { FastifyInstance } from 'fastify'
import { fetchPets } from './fetch-pets'
import { createPet } from './create-pet'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { getPet } from './get-pet'
import { updatePet } from './update-pet'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', fetchPets)
  app.get('/pets/:id', getPet)

  app.patch('/pets/:id/save', { onRequest: [verifyJWT] }, updatePet)

  app.post('/pets', { onRequest: [verifyJWT] }, createPet)
}
