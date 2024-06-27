import { beforeEach, describe, expect, it } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'

let orgsRepository: InMemoryOrgsRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', async () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new AuthenticateUseCase(orgsRepository)
  })

  it('should be able to authenticate', async () => {
    await orgsRepository.create({
      nameOfPersonResponsible: 'John Doe',
      email: 'johndoe@example.com',
      cep: '12345678',
      password_hash: await hash('password123', 6),
      address: '123 Main St',
      phone: '1234567890',
    })

    const { org } = await sut.execute({
      email: 'johndoe@example.com',
      password: 'password123',
    })

    expect(org).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
        password_hash: expect.any(String),
      }),
    )
  })

  it('should not be able to authenticate with wrong email', async () => {
    await orgsRepository.create({
      nameOfPersonResponsible: 'John Doe',
      email: 'johndoe@example.com',
      cep: '12345678',
      password_hash: await hash('password123', 6),
      address: '123 Main St',
      phone: '1234567890',
    })

    await expect(
      sut.execute({
        email: 'wrong@example.com',
        password: 'password123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
