import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const accessTokenExpiresIn = '8s'

export const refreshTokenExpiresIn = '15s'

export const handleLogin = async (req, res) => {
    const cookies = req.cookies
    console.log("cookies dari authController: ", cookies);

    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).json({ "message": 'username and password diperlukan' })
    }
    const foundUser = await prisma.user.findFirst({ where: { username: username } })
    if (!foundUser) { return res.status(401).json({ "message": "user tidak ditemukan" }) } //unauthorized
    // console.log("foundUser dari authController: ", foundUser);


    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)
    if (match) {
        // ambil value dari roles:
        // const role = foundUser.role
        // const bidang = foundUser.bidang
        // console.log("roles dari authController",roles);

        // create jwt
        const accessToken = jwt.sign(
            {
                "userInfo": {
                    "userId": foundUser.id,
                    "username": foundUser.username,
                    "role": foundUser.role,
                    "bidang": foundUser.bidang

                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            // { expiresIn: '240s' }
            { expiresIn: accessTokenExpiresIn }
        )
        const newRefreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: refreshTokenExpiresIn }
            // { expiresIn: '10s' }
        )

        if (cookies?.jwt) res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        }) // secure: true -> only works on https

        try {
            await prisma.user.update({
                where: {
                    id: foundUser.id
                },
                data: {
                    // refreshKey: [...newRefreshTokenArray, newRefreshToken]
                    refreshKey: newRefreshToken
                }
            })
        } catch (error) {
            console.log(error)
        }

        // kirim refresh token ke cookie di client
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000
        }) // maxAge: 24 hours

        // kirim access token yg dapat diambil oleh frontend
        res.json({
            accessToken,
            // role,
            // bidang
        })
    } else {
        res.status(401).json({ "message": "password tidak sesuai" })
    }
}




export const handleLogout = async (req, res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies
    console.log("cookies dari logoutController: ", cookies);

    if (!cookies?.jwt) return res.sendStatus(204) // No content
    const refreshToken = cookies.jwt

    // Is refreshToken in db?
    const foundUser = await prisma.user.findFirst({ where: { refreshKey: refreshToken } })
    // console.log("foundUser dari logoutController: ", foundUser);

    if (!foundUser) {
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        }) // secure: true -> only works on https
        return res.sendStatus(204)
    }
    // Delete refreshToken in db
    // const otherUsers = usersDB.users.filter(user => user.username !== foundUser.username)
    // const otherUsers = usersDB.users.filter(user => user.username !== foundUser.username)
    // foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken)
    // const currentUser = { ...foundUser, refreshToken: '' }
    const currentUser = await prisma.user.update({
        where: {
            id: foundUser.id
        },
        data: {
            refreshKey: null
        }
    })

    console.log("currentUser dari logoutController: ", currentUser);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false }) // secure: true -> only works on https
    res.status(204).json(currentUser);
}