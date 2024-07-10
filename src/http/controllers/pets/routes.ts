import { FastifyInstance } from 'fastify'
import { fetchPets } from './fetch-pets'
import { createPet } from './create-pet'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { getPet } from './get-pet'
import { updatePet } from './update-pet'
import { uploadImagePet } from './upload-image'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', fetchPets)
  app.get('/pets/:id', getPet)

  app.patch('/pets/:id/save', { onRequest: [verifyJWT] }, updatePet)

  app.post('/pets', { onRequest: [verifyJWT] }, createPet)
  app.post('/pets/:id/image/upload', { onRequest: [verifyJWT] }, uploadImagePet)
}
