/*
  Warnings:

  - Made the column `bidang` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "bidang" SET NOT NULL;
