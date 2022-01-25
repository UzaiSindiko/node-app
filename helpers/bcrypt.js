const bcrypt = require("bcryptjs")

module.exports = {
  hash(inputPass) {
    return bcrypt.hashSync(inputPass, bcrypt.genSaltSync(10))
  },
  compare(inputPass, hash) {
    return bcrypt.compareSync(inputPass, hash)
  },
}
