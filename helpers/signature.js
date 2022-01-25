const CryptoJS = require("crypto-js")

module.exports = ({ payload, secretKey }) => {
  if (payload) {
    if (typeof payload === "string") {
      payload = payload.toString()
    } else if (typeof payload === "object") {
      payload = JSON.stringify(payload)
    } else {
      throw "invalid payload type: " + typeof payload
    }
  } else {
    payload = ""
  }

  const signatureString = payload
  const signature = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(signatureString, secretKey)
  )

  return signature
}
