const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.json("token yoq")
  }
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader
  try {
    const decoded = jwt.verify(token, "secretKey")
    req.user = decoded
    next()
  } catch (error) {
    console.log(error)
    return res.json("token xato")
  }

}

module.exports = authMiddleware