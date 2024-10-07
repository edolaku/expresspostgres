export const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // console.log('req.roles dari verifyRoles: ', req.role);
        // console.log('req.user dari verifyRoles: ', req.user);


        if (!req?.role) return res.sendStatus(401)
        const rolesArray = [...allowedRoles]
        // console.log('roles array dari verifyRoles: ', rolesArray);
        // console.log('roles dari verifyRoles: ', req.roles);

        // cari roles dari user dan bandingkan dengan rolesArray dan cari value true
        const result = rolesArray.some(role => req.role.includes(role))
        // console.log('result dari verifyRoles: ', result);
        if (!result) return res.sendStatus(401)

        next()
    }
}