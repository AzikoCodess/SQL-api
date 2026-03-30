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

router.get("/search", userController.qidirUsers)
router.get("/paginated", userController.getUsersPaginated)
router.get("/advanced", userController.getUsersAdvencedController)

router.get("/", userController.getUsers)
router.get("/:id", userController.getUser)
router.put("/:id", userController.updateUser)
router.delete("/:id", userController.deleteUser)

module.exports = router