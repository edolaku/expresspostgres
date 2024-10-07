import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
const EXP_REFRESH_TOKEN = '24h'
const EXP_ACCESS_TOKEN = '240s'



export const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    console.log("cookies dari refreshTokenController: ", JSON.stringify(cookies));
    // console.log("req.headers dari refreshTokenController: ", req.headers);
    if (!cookies?.jwt) return res.sendStatus(401)
    // console.log(cookies.jwt);
    const refreshToken = cookies.jwt
    // console.log("refresh token dari refreshTokenController: ", refreshToken);


    // hapus cookie
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    }) // secure: true -> only works on https

    // const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken)
    const foundUser = await prisma.user.findFirst({ where: { refreshKey: refreshToken } })
    console.log("foundUser dari refreshTokenController: ", JSON.stringify(foundUser));
    // console.log("edolaku dari refreshTokenController: ", JSON.stringify(edolaku.refreshKey));



    // detection refresh token reuse

    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                // console.log("err dari refreshTokenController: ",err);

                if (err) return res.sendStatus(403) // forbidden

                const hackedUser = await prisma.user.update({
                    where: {
                        username: decoded.username
                    },
                    data: {
                        refreshKey: null
                    }
                })
                // console.log("hackedUser dari refreshTokenController: ", JSON.stringify(hackedUser)); // hackedUser)
                // console.log(hackedUser)
            })
        return res.sendStatus(403) // forbidden
    }

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                await prisma.user.update({
                    where: {
                        username: foundUser.username
                    },
                    data: {
                        refreshKey: ""
                    }
                })
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403) // forbidden

            // jika refreshToken masih valid
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
                { expiresIn: EXP_ACCESS_TOKEN }
            )

            // generate new refresh token
            const newRefreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: EXP_REFRESH_TOKEN }
            )

            await prisma.user.update({
                where: {
                    username: foundUser.username
                },
                data: {
                    refreshKey: newRefreshToken
                }
            })
            res.cookie('jwt', newRefreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000
            }) // maxAge: 24 hours
            res.json({
                accessToken,
                role: foundUser.role,
                bidang: foundUser.bidang
            })
            // console.log("newRefreshToken dari refreshTokenController: ", newRefreshToken);
        })
}