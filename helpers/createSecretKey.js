const CryptoJS = require("crypto-js")
const config = require("../config/config")

module.exports = (payload) => {
  if (process.env.NODE_ENV === "testing") {
    return "test_key"
  }
  const signatureString = `${payload}`
  const signature = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(signatureString, config.secretKeySecret)
  )

  return signature
}
