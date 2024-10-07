/*
  Warnings:

  - A unique constraint covering the columns `[aktftsId]` on the table `Aktfts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aktfts]` on the table `Aktfts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nama]` on the table `Pegawai` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `Pegawai` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rincianId]` on the table `Rincian` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subkegId]` on the table `Subkeg` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subkeg]` on the table `Subkeg` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refreshKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Aktfts_aktftsId_key" ON "Aktfts"("aktftsId");

-- CreateIndex
CREATE UNIQUE INDEX "Aktfts_aktfts_key" ON "Aktfts"("aktfts");

-- CreateIndex
CREATE UNIQUE INDEX "Pegawai_nama_key" ON "Pegawai"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "Pegawai_nip_key" ON "Pegawai"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Rincian_rincianId_key" ON "Rincian"("rincianId");

-- CreateIndex
CREATE UNIQUE INDEX "Subkeg_subkegId_key" ON "Subkeg"("subkegId");

-- CreateIndex
CREATE UNIQUE INDEX "Subkeg_subkeg_key" ON "Subkeg"("subkeg");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshKey_key" ON "User"("refreshKey");
