import { FastifyInstance } from 'fastify'
import { fetchPets } from './fetch-pets'

export async function petsRoutes(app: FastifyInstance) {
  app.get('/pets', fetchPets)
}
