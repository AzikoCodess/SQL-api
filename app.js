const express = require("express")
const sqlite3 = require("sqlite3").verbose()

const app = express()
app.use(express.json())

const db = new sqlite3.Database("./db.db", (err) => {
  if (err) {
    console.log(err.message)
  } else {
    console.log("DB ulandi")
  }
})


// TABLE yaratish

db.run(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS orders(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product TEXT,
  price INTEGER,
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES users(id)
)
`)


// USER qo‘shish

app.post("/users", (req, res) => {

  const { name, age } = req.body

  const sql =
    "INSERT INTO users (name, age) VALUES (?,?)"

  db.run(sql, [name, age], function (err) {

    if (err) {
      return res.json(err.message)
    }

    res.json({
      id: this.lastID,
      name,
      age
    })

  })

})

app.get("/users/:id", (req, res) => {
  const { id } = req.params
  const sql = "SELECT * FROM users WHERE id = ?"
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.json(err.message)
    }
    res.json(row)
  })
})

app.put("/users/:id", (req, res) => {
  const { id } = req.params
  const { name, age } = req.body

  const sql = "UPDATE users SET name=?, age=? WHERE id=?"

  db.run(sql, [name, age, id], function (err) {
    if (err) {
      return res.json(err.message)
    }
    const user = {
      name, age, id
    }
    res.json({ message: "updated", user })
  })
})

app.delete("/delete/:id", (req, res) => {
  const { id } = req.params

  const sql = "DELETE FROM users WHERE id=?"

  db.run(sql, [id], function (err) {
    if (err) {
      return res.json(err.message)
    }
    res.json("deleted")
  })
})



app.listen(3000, () => {
  console.log("Server ishladi")
})