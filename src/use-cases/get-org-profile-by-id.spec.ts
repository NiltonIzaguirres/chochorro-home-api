import { beforeEach, describe, expect, it } from 'vitest'
import { GetOrgProfileByIdUseCase } from './get-org-profile-by-id'
import { hash } from 'bcryptjs'
import { InMemoryOrgsRepository } from '@/repositories/in-memory/in-memory-orgs-repository'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let orgsRepository: InMemoryOrgsRepository
let sut: GetOrgProfileByIdUseCase

describe('Get org profile by ID use case', async () => {
  beforeEach(() => {
    orgsRepository = new InMemoryOrgsRepository()
    sut = new GetOrgProfileByIdUseCase(orgsRepository)
  })

  it('should return org profile', async () => {
    const createdOrg = await orgsRepository.create({
      nameOfPersonResponsible: 'John Doe',
      email: 'johndoe@example.com',
      cep: '12345678',
      password_hash: await hash('password123', 6),
      address: '123 Main St',
      phone: '1234567890',
    })

    const { org } = await sut.execute({ id: createdOrg.id })

    expect(org).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(Date),
      }),
    )
  })

  it('should not be able to find the ID', async () => {
    await expect(sut.execute({ id: 'not-exists' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    )
  })
})
