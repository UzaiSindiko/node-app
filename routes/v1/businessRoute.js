const router = require("express").Router()
const BusinessController = require("../../controllers/BusinessController")
const { authentication: auth } = require("../../middleware/auth")

router.post("/register", BusinessController.register)
router.post("/login", BusinessController.login)
router.patch("/", auth, BusinessController.updateBusiness)
router.post("/:id/test", auth, BusinessController.checkUrl)

module.exports = router
