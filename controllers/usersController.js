import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()



export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
}

export const handlerNewUser = async (req, res) => {
    const {
        username,
        password,
        role,
        bidang
    } = req.body

    if (!username || !password || !role || !bidang) {
        return res.status(400).json({ "message": 'username, password, and role are required' })
    }

    // cek duplikasi username
    const duplicate = await prisma.user.findMany({
        where: {
            username: username
        }
    })

    if (duplicate.length !== 0) return res.status(409).json({ "message": `${username} already exists` })

    try {
        const saltRounds = 10
        // encrypt password
        const passwordHash = await bcrypt.hash(password, saltRounds)

        // masukkan user baru ke database:
        const newUser = await prisma.user.create({
            data: {
                "username": username,
                "password": passwordHash,
                "role": role,
                "bidang": bidang
            }
        })
        // console.log(usersDB.users);
        res.status(201).json({ "success": `new user ${newUser.username} created` })
    } catch (error) {
        res.status(500).json({ "message": error.message })
    }
}

export const updateUser = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.params.cuid
        }
    })
    if (!user) {
        return res.status(400).json({ "message": "user not found." });
    }
    try {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
        const updatedUser = await prisma.user.update({
            where: {
                id: req.params.cuid
            },
            data: {
                "username": req.body.username,
                "password": passwordHash,
                "role": req.body.role,
                "bidang": req.body.bidang
            }
        })
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}

export const deleteUser = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            id: req.params.cuid
        }
    })
    if (!user) {
        return res.status(400).json({ "message": "user not found." });
    }
    try {
        const deletedUser = await prisma.user.delete({
            where: {
                id: req.params.cuid
            }
        })
        res.json(`${deletedUser.username} telah dihapus`);
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
}