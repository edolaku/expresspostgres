// import users from "../model/users.json" assert { type: "json" }
// import fsPromises from 'fs/promises'
// import path from 'path';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
// import { __dirname } from "../dirnameHandler.js";

// const usersDB = {
//     users,
//     setUsers: function (data) { this.users = data }
// }
const prisma = new PrismaClient();

export const handlerNewUser = async (req, res) => {
    const {
        username,
        password,
        role,
        bidang
        // refreshKey
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
                // "refreshKey": refreshKey
            }
        })
        // console.log(usersDB.users);
        res.status(201).json({ "success": `new user ${newUser.username} created` })
    } catch (error) {
        res.status(500).json({ "message": error.message })
    }
}