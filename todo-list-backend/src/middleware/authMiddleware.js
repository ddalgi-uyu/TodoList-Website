import jwt from 'jsonwebtoken'

function authMiddleware(req, res, next) {
    const token = req.headers('authorization')

    if (!token) {
        res.status(401).json({message: "No token provided."})
    }

    jwt.verify(token, process, env.JWT_SECRET, (err, decode) => {
        if (err) {
            res.status(401).json({message: "Invalid token."})
        }

        req.userId = decoded.id //Decode token
        next()
    })
}

export default authMiddleware