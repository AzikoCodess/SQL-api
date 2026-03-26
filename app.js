require("dotenv").config()
const express = require("express")
const userRoutes = require("./routes/userRoutes")
const app = express()

app.use(express.json())

app.use("/users", userRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running ${process.env.BASE_URL}`)
})