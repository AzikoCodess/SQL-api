const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userService = require("../services/userService")

const register = async (req, res) => {
    const { name, password } = req.body

    if (!name || !password) {
        return res.status(400).json("name va password kerak")
    }
    try {
        const hash = await bcrypt.hash(password, 10)

        const id = await userService.createUser(name, hash)

        res.status(201).json({
            message: "user created",
            id, name
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }



}

// const login = (req, res) => {
//     const { name, password } = req.body

//     userService.findUserByName(name, (err, user) => {
//         if (!user) {
//             return res.json("User topilmadi")
//         }

//         bcrypt.compare(password, user.password, (err, ok) => {
//             if (err) {
//                 return res.json(err.message)
//             }
//             if (!ok) {
//                 return res.json("Wrong password")
//             }
//             const token = jwt.sign({ id: user.id }, "secretKey")
//             res.json({ token })
//         })
//     })
// }

const login = async (req, res) => {
    const { name, password } = req.body
    try {
        const user = await userService.findUserByName(name)
        if (!user) {
            return res.status(404).json("2User topilmadi")
        }

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) {
            return res.status(401).json("Wrong password")
        }

        const token = jwt.sign({ id: user.id }, "secretKey")
        res.status(200).json({ token })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const profile = (req, res) => {
    res.json({
        message: "protected route",
        user: req.user
    })
}

const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userService.getUserById(id)
        if (!user) {
            return res.status(404).json("1User topilmadi")
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const changes = await userService.updateUser(id, name)
        if (changes === 0) {
            return res.status(404).json({ message: "3User topilmadi" })
        }
        res.status(200).json({
            updated: changes
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const changes = await userService.deleteUser(id)
        if (changes === 0) {
            return res.status(404).json({ message: "5User topilmadi" })
        }
        res.status(200).json({
            deleted: changes
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const qidirUsers = async (req, res) => {
    try {
        const { name } = req.query
        let users
        if (name) {
            users = await userService.searchUsers(name)
        } else {
            users = await userService.getAllUsers()
        }
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getUsersPaginated = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                message: "page va limit 1 dan katta bo‘lishi kerak"
            })
        }

        const offset = (page - 1) * limit

        const users = await userService.getUsersPaginated(limit, offset)

        res.status(200).json({
            page, limit,
            data: users
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { register, login, profile, getUsers, getUser, updateUser, deleteUser, qidirUsers, getUsersPaginated }