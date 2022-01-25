const jwt = require("jsonwebtoken")
const config = require("../config/config")

module.exports = {
  generateToken(payload) {
    return jwt.sign(payload, config.jwtSecret)
  },
  verify(token) {
    return jwt.verify(token, config.jwtSecret)
  },
}
