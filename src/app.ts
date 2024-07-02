import fastify from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { orgsRoutes } from './http/controllers/orgs/routes'

export const app = fastify()

app.register(fastifyMultipart)

app.register(orgsRoutes)

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/public/',
})
