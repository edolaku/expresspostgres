import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()



export const getPegawai = async (req, res) => {
    const pegawai = await prisma.pegawai.findMany();
    res.json(pegawai);
}

export const handlerNewPegawai = async (req, res) => {
    const {
        nama, nip, jabatan, pangkat, bidang
    } = req.body

    if (!nama || !nip || !jabatan || !pangkat || !bidang) {
        return res.status(400).json({ "message": 'input kolom belum lengkap' })
    }

    // cek duplikasi nip
    const duplicate = await prisma.pegawai.findMany({
        where: {
            nip: nip
        }
    })

    if (duplicate.length !== 0) return res.status(409).json({ "message": `${nip} sudah terdaftar` })

    try {
        // masukkan pegawai baru ke database:
        const newPegawai = await prisma.pegawai.create({
            data: {
                nama: nama,
                nip: nip,
                jabatan: jabatan,
                pangkat: pangkat,
                bidang: bidang,
            }
        })
        // console.log(usersDB.users);
        res.status(201).json({ "success": `${newPegawai.nama} telah ditambahkan` })
    } catch (error) {
        res.status(500).json({ "message": error.message })
    }
}

export const updatePegawai = async (req, res) => {
    const { nama, nip, jabatan, pangkat, bidang } = req.body
    const pegawai = await prisma.pegawai.findMany({
        where: {
            id: parseInt(req.params.id)
        }
    })
    if (!pegawai.length) {
        return res.status(400).json({ "message": "pegawai tidak ditemukan" });
    }
    try {
        const updatedUser = await prisma.pegawai.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                nama: nama,
                nip: nip,
                jabatan: jabatan,
                pangkat: pangkat,
                bidang: bidang,
            }
        })
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}


export const deletePegawai = async (req, res) => {
    const pegawai = await prisma.pegawai.findMany({
        where: {
            id: parseInt(req.params.id)
        }
    })

    if (!pegawai.length) {
        return res.status(400).json({ "message": "pegawai tidak ditemukan" });
    }
    try {
        const deletedPegawai = await prisma.pegawai.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.json(`${deletedPegawai.nama} telah dihapus`);
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}