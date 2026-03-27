const db = require("../db")

const createUser = (name, password, callback) => {
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

const getAllUsers = (callback) => {
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
                resolve(this.lastID)
            }
        })

    })
}

const searchUsers = (name) => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT * FROM users WHERE name LIKE ?`,
            [`%${name}%`], (err, rows) => {
                if(err){
                    reject(err)
                } else {
                    resolve(rows)
                }
            }
        )
    })
}

module.exports = {
    createUser,
    findUserByName,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers
}