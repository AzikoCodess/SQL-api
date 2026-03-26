const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.log(err.message)
  } else {
    console.log("DB ulandi")
  }
})
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  password TEXT,
  role TEXT
)
`)
module.exports = db