import fastify from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastifyJWT from '@fastify/jwt'
import path from 'path'
import { orgsRoutes } from './http/controllers/orgs/routes'
import { env } from './env'

export const app = fastify()

app.register(fastifyMultipart)
app.register(fastifyJWT, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '10m',
  },
})

app.register(orgsRoutes)

app.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/public/',
})
