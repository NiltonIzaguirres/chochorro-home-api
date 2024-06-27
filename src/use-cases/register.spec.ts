import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { RegisterUseCase } from './register'

let orgsRepository: InMemoryOrgsRepository
let sut: RegisterUseCase

describe('Register Use Case', async () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new RegisterUseCase(orgsRepository)
  })

  it('should be able to register', async () => {
    const { org } = await sut.execute({
      nameOfPersonResponsible: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      cep: '12345678',
      address: '123 Main St',
      phone: '1234567890',
    })

    expect(org).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
        password_hash: expect.any(String),
        createdAt: expect.any(Date),
      }),
    )
  })
})
