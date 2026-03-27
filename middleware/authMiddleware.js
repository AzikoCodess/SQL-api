const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json("token yoq")
    }
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader
    try {
        const decoded = jwt.verify(token, "secretKey")
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json("token xato")
    }

}

module.exports = authMiddleware