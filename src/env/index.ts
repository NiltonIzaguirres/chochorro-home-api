import 'dotenv/config'
import { z } from 'zod'

const dotenvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_PORT: z.coerce.number().default(3333),
  APP_HOST: z.coerce.string().default('0.0.0.0'),
  APP_DOMAIN: z.coerce.string(),
  JWT_SECRET: z.coerce.string(),
})

const _env = dotenvSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid environment variables.', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
