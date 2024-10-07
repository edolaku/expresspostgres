-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bidang" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "refreshKey" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subkeg" (
    "subkegId" TEXT NOT NULL,
    "subkeg" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subkeg_pkey" PRIMARY KEY ("subkegId")
);

-- CreateTable
CREATE TABLE "Aktfts" (
    "aktftsId" TEXT NOT NULL,
    "aktfts" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subkegId" TEXT NOT NULL,

    CONSTRAINT "Aktfts_pkey" PRIMARY KEY ("aktftsId")
);

-- CreateTable
CREATE TABLE "Rincian" (
    "rincianId" TEXT NOT NULL,
    "rincian" TEXT NOT NULL,
    "vol1" INTEGER NOT NULL,
    "sat1" TEXT NOT NULL,
    "vol2" INTEGER NOT NULL,
    "sat2" TEXT NOT NULL,
    "vol3" INTEGER NOT NULL,
    "sat3" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktftsId" TEXT NOT NULL,

    CONSTRAINT "Rincian_pkey" PRIMARY KEY ("rincianId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subkeg" ADD CONSTRAINT "Subkeg_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Aktfts" ADD CONSTRAINT "Aktfts_subkegId_fkey" FOREIGN KEY ("subkegId") REFERENCES "Subkeg"("subkegId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rincian" ADD CONSTRAINT "Rincian_aktftsId_fkey" FOREIGN KEY ("aktftsId") REFERENCES "Aktfts"("aktftsId") ON DELETE RESTRICT ON UPDATE CASCADE;
