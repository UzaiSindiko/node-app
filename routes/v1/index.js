const router = require("express").Router()
const businessRoute = require("./businessRoute")
const nofRoute = require("./nofRoute")

router.use("/businesses", businessRoute)
router.use("/notifications", nofRoute)
module.exports = router
