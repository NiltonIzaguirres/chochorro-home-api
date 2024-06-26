import { app } from './app'
import { env } from './env'

app.listen({ host: env.APP_HOST, port: env.APP_PORT }, () =>
  console.log(`🚀 Server listening on port: ${env.APP_PORT}`),
)
