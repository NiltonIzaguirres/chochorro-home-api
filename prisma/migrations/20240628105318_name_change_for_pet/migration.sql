/*
  Warnings:

  - You are about to drop the column `dogId` on the `files` table. All the data in the column will be lost.
  - You are about to drop the `dogs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `petId` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dogs" DROP CONSTRAINT "dogs_orgId_fkey";

-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_dogId_fkey";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "dogId",
ADD COLUMN     "petId" TEXT NOT NULL;

-- DropTable
DROP TABLE "dogs";

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "shape" "ShapeLevel" NOT NULL,
    "energy" "TraitLevel" NOT NULL,
    "independence" "TraitLevel" NOT NULL,
    "environment" "EnvironmentLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orgId" TEXT NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
