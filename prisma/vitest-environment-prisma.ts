import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import { randomUUID } from 'crypto'
import { Environment } from 'vitest'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

function getUploadDirectory() {
  if (!process.env.UPLOAD_DIR) {
    throw new Error('Please provide a UPLOAD_DIR environment variable.')
  }

  return 'tmp'
}

export default <Environment>{
  name: 'custom',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)
    const uploadDir = getUploadDirectory()

    process.env.DATABASE_URL = databaseURL
    process.env.UPLOAD_DIR = uploadDir

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA  IF EXISTS "${schema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
