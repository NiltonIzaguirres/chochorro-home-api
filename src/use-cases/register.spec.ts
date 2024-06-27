import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryOrgsRepository } from '../repositories/in-memory/in-memory-orgs-repository'
import { RegisterUseCase } from './register'
import { OrgAlreadyExistsError } from './erros/org-already-exists-error'
import { compare } from 'bcryptjs'

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

  it('should not be able to register with same email twice', async () => {
    await sut.execute({
      nameOfPersonResponsible: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      cep: '12345678',
      address: '123 Main St',
      phone: '1234567890',
    })

    await expect(
      sut.execute({
        nameOfPersonResponsible: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        cep: '12345678',
        address: '123 Main St',
        phone: '1234567890',
      }),
    ).rejects.toBeInstanceOf(OrgAlreadyExistsError)
  })

  it('should hash org password upon registration', async () => {
    const { org } = await sut.execute({
      nameOfPersonResponsible: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      cep: '12345678',
      address: '123 Main St',
      phone: '1234567890',
    })

    const isPasswordCorrectlyHashed = await compare(
      'password123',
      org.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
