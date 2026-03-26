const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/authMiddleware")
router.get("/test", (req, res) => {
    res.json("test ok")
})

router.post("/register", userController.register)
router.post("/login", userController.login)
router.get("/profile", authMiddleware, userController.profile)

module.exports = router