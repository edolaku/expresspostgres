/*
  Warnings:

  - You are about to drop the column `userId` on the `Pegawai` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pegawai" DROP CONSTRAINT "Pegawai_userId_fkey";

-- DropIndex
DROP INDEX "Pegawai_userId_key";

-- AlterTable
ALTER TABLE "Pegawai" DROP COLUMN "userId";
