const express = require("express")
const sqlite3 = require("sqlite3").verbose()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
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
    password TEXT,
    role TEXT
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

app.post("/orders", (req, res) => {
  const { product, price, user_id } = req.body

  const sql = "INSERT INTO orders (product, price, user_id) VALUES (?,?,?)"

  db.run(sql, [product, price, user_id], function (err) {
    if (err) {
      return res.json(err.message)
    }
    res.json({
      id: this.lastID
    })
  })
})

app.get("/orders", (req, res) => {
  const sql = `
  SELECT
    orders.id,
    orders.product,
    orders.price,
    users.name
  FROM orders
  INNER JOIN users
  ON orders.user_id = users.id
  `

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json(err.message)
    }
    res.json(rows)
  })
})

app.get("/ordersLeft", (req, res) => {
  const sql = `
  SELECT
    users.name,
    orders.product
  FROM users
  LEFT JOIN orders
  ON users.id = orders.user_id
  `

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.json(err.message)
    }
    res.json(rows)
  })
})
//shunchaki ishlatib kordim lekn buni alohida yoz
app.get("/search", (req, res) => {
  const txt = req.query.txt
  const limit = req.query.limit
  console.log(txt)
  console.log(limit)
  if (txt) {
    const sql = `SELECT * FROM users WHERE name LIKE ?`
    db.all(sql, [`%${txt}%`], (err, rows) => {
      if (err) {
        return res.json(err.message)
      }
      res.json(rows)
    })
  } else if (limit) {
    const sqlLimit = "SELECT * FROM users LIMIT ?"
    db.all(sqlLimit, [limit], (err, rows) => {
      if (err) {
        return res.json(err.message)
      }
      res.json(rows)
    })
  }

})

app.get("/users", (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = 2
  const offset = (page - 1) * limit
  const sql = "SELECT * FROM users LIMIT ? OFFSET ?"

  db.all(sql, [limit, offset], (err, rows) => {
    res.json(rows)
  })

})

// const password = "546132"
// bcrypt.hash(password, 10, (err, hash) => {
//   console.log(hash)
//   console.log(err)
// })

app.post("/register", (req, res) => {
  const { name, password } = req.body
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.json(err.message)
    }
    const sql = "INSERT INTO users (name, password, role) VALUES (?,?,?)"
    db.run(sql, [name, hash, "user"], function (err) {
      if (err) {
        return res.json(err.message)
      }
      res.json("Created")
    })
  })
})

// bcrypt.compare("546132", "$2b$10$Y9pOSEH8A2lyy5Mv49Bwg.J8NyhBWIY.1N.1OeYIIPufPqiqLG4wO", (err, result) => {
//   console.log(result)
// })

app.post("/login", (req, res) => {
  const { name, password } = req.body

  const sql = "SElECT * FROM users WHERE name=?"
  db.get(sql, [name], (err, user) => {
    if (err) {
      return res.json(err.message)
    }
    if (!user) {
      return res.json("user yo'q")
    }
    bcrypt.compare(password, user.password, (err, ok) => {
      if (err) {
        return res.json(err.message)
      }
      if (!ok) {
        return res.json("wrong password")
      }
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role
        }, "secretKey"
      )
      res.json(token)
    })
  })
})

// const token = jwt.sign(
//   {id: 1},
//   "secret123"
// )
// const decoded = jwt.verify(token, "secret123")
// console.log(decoded)

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

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.json("Faqat admin")
  }
  next()
}

app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "protected route",
    user: req.user.id,
    role: req.user.role
  })
})

app.post("/refresh", (req, res) => {
  const { refreshToken } = req.body
  try {
    const decoded = jwt.verify(
      refreshToken, "refreshSecret"
    )
    const newAccess = jwt.sign(
      { id: decoded.id },
      "accessSecret"
    )
    res.json({ accessToken: newAccess })
  } catch (error) {
    res.json("refresh xato")
  }
})

app.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json("Admin panel")
})


app.listen(3000, () => {
  console.log("Server ishladi")
})