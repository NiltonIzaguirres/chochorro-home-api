import fastify from 'fastify'
import fastifyMultipart from '@fastify/multipart'

export const app = fastify()

app.register(fastifyMultipart)
