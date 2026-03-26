const db = require("../db")

const createUser = (name, password, callback) => {
    const sql = `INSERT INTO users (name, password, role) VALUES (?, ?, ?)`

    db.run(sql, [name, password, "user"], function (err) {
        callback(err, this.lastID)
    })
}

const findUserByName = (name, callback) => {
    const sql = "SELECT * FROM users WHERE name=?"
    db.get(sql, [name], callback)
}

module.exports = { createUser, findUserByName }