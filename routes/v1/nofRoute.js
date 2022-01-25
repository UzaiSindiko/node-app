const router = require("express").Router()
const NotificationController = require("../../controllers/NotificationController")

router.post("/", NotificationController.nof)
router.get("/:id", NotificationController.getNof)

module.exports = router
