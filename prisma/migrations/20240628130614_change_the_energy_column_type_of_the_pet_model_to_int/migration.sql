/*
  Warnings:

  - Changed the type of `energy` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "energy",
ADD COLUMN     "energy" INTEGER NOT NULL;
