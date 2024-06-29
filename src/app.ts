import fastify from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import path from 'path'

export const app = fastify()

app.register(fastifyMultipart)

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/public/',
})
