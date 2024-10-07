import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    // console.log('authHeader dari verifyJWT: ',authHeader);
    // console.log('header dari verifyJWT: ',req.headers);

    // jika tidak ada authHeader atau ada authHeader tp tidak diawali dengan Bearer, maka kirim status 401
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

    // console.log('authHeader dari verifyJWT: ',authHeader); // bearer token

    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403) //invalid token
        req.userId = decoded.userInfo.userId
        req.user = decoded.userInfo.username
        req.role = decoded.userInfo.role
        req.bidang = decoded.userInfo.bidang
        // console.log('req.user dari verifyJWT: ', req.user);
        // console.log('req.roles dari verifyJWT: ', req.roles);
        // console.log('req.bidang dari verifyJWT: ', req.bidang);
        // console.log('decoded dari verifyJWT: ', decoded);

        next()
    })
}