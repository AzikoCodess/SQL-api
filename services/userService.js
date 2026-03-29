const db = require("../db")

const createUser = (name, password) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO users (name, password, role) VALUES (?, ?, ?)`

        db.run(sql, [name, password, "user"], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(this.lastID)
            }
        })
    })

}

const findUserByName = (name) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE name=?"
        db.get(sql, [name], (err, user) => {
            if (err) {
                reject(err)
            } else {
                resolve(user)
            }
        })
    })
}

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users"
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })

    })
}

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE id=?", [id], (err, row) => {
            if (err) reject(err)
            else resolve(row)
        })

    })
}

const updateUser = (id, name) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE users SET name=? WHERE id=?"
        db.run(sql, [name, id], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(this.changes)
            }
        })

    })
}

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM users WHERE id=?"
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(this.changes)
            }
        })

    })
}

//hech qachon parol qaytarma buni qogan kodga ham qoshish kerak 
const searchUsers = (name) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT id, name, role FROM users WHERE name LIKE ?`,
            [`%${name}%`], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows)
                }
            }
        )
    })
}

const getUsersPaginated = (limit, offset) => {
    return new Promise((resolve, reject) => {
        const sql = `
        SELECT id, name, role
        FROM users
        LIMIT ? OFFSET ?
        `
        db.all(sql, [limit, offset], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

const getUsersAdvenced = (options) => {
    return new Promise((resolve, reject) => {
        let { name, limit, offset, sort, order } = options

        let sql = `
        SELECT id, name, role
        FROM users, 
        WHERE 1=1
        `

        let params = []

        if (name) {
            sql += ` AND name LIKE ?`
            params.push(`%${name}%`)
        }

        if (sort) {
            const allowedSort = ["id", "sort"]

            if (allowedSort.includes(sort)) {
                const orderby = order === "desc" ? "DESC" : "ASC"
                sql += ` ORDER BY ${sort} ${orderby}`
            }
        }
    })
}

module.exports = {
    createUser,
    findUserByName,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    getUsersPaginated
}