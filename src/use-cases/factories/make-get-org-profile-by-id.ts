import { PrismaOrgsRepository } from '@/repositories/prisma/prisma-orgs-repository'
import { GetOrgProfileByIdUseCase } from '../get-org-profile-by-id'

export function makeGetOrgProfileById() {
  const orgsRepository = new PrismaOrgsRepository()
  const getOrgProfileById = new GetOrgProfileByIdUseCase(orgsRepository)
  return getOrgProfileById
}
