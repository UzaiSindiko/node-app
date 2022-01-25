const { verify } = require("../helpers/jwt")
const mongoose = require("mongoose")

module.exports = {
  authentication(req, res, next) {
    try {
      let getToken
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        getToken = req.headers.authorization.split(" ")[1]
      }
      let decode = verify(getToken)
      req.user = decode.id
      req.username = decode.username
      next()
    } catch (err) {
      return res.status(400).json({
        msg: "login required",
      })
    }
  },
}
