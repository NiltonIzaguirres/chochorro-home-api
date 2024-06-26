import { app } from './app'
import 'dotenv/config'

app.listen({ host: '0.0.0.0', port: process.env.APP_PORT }, () =>
  console.log(`🚀 Server listening on port: ${process.env.APP_PORT}`),
)
