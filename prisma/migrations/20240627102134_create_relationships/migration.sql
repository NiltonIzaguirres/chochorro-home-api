/*
  Warnings:

  - Added the required column `orgId` to the `dogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dogId` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dogs" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "dogId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "dogs" ADD CONSTRAINT "dogs_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "orgs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_dogId_fkey" FOREIGN KEY ("dogId") REFERENCES "dogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
