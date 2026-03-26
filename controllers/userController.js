const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userService = require("../services/userService")

const register = (req, res) => {
    const { name, password } = req.body

    if (!name || !password) {
        return res.json("name va password kerak")
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.json(err.message)
        }
        userService.createUser(name, hash, (err, lastID) => {
            if (err) {
                return res.json(err.message)
            }

            res.json({
                message: "user created",
                id: lastID, name
            })
        })
    })
}

const login = (req, res) => {
    const { name, password } = req.body

    userService.findUserByName(name, (err, user) => {
        if (!user) {
            return res.json("User topilmadi")
        }

        bcrypt.compare(password, user.password, (err, ok) => {
            if (err) {
                return res.json(err.message)
            }
            if (!ok) {
                return res.json("Wrong password")
            }
            const token = jwt.sign({ id: user.id }, "secretKey")
            res.json({ token })
        })
    })
}

const profile = (req, res) => {
    res.json({
        message: "protected route",
        user: req.user
    })
}

module.exports = { register, login, profile }