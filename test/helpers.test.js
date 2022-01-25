const expect = require("chai").expect

const {
  bcrypt,
  jwt,
  checkType,
  signature,
  createSecretKey,
} = require("../helpers")

describe("helpers", () => {
  describe("bcrypt", () => {
    it("hash and compare", async () => {
      const hash = bcrypt.hash("password")
      const compare = bcrypt.compare("password", hash)
      expect(compare).to.equal(true)

      const compare2 = bcrypt.compare("password_not", hash)
      expect(compare2).to.equal(false)
    })
  })

  describe("jwt", () => {
    it("generateToken and verify token", async () => {
      const username = "uzai"
      const _id = "13345"
      const token = jwt.generateToken({
        username,
        _id,
      })

      const verify = jwt.verify(token)
      expect(verify.username).to.be.equal(username)
      expect(verify._id).to.be.equal(_id)
    })
  })

  describe("checkType", () => {
    it("checking type of data", async () => {
      const { isString, isArray, isObject, isBoolean, isNumber, isDate } =
        checkType

      expect(isString("str")).to.equal(true)
      try {
        isString(123)
      } catch (err) {
        expect(err.status).to.equal(400)
      }

      expect(isArray(["str", "lll", "ppp"])).to.equal(true)
      try {
        isArray(123)
      } catch (err) {
        expect(err.status).to.equal(400)
      }

      expect(isObject({ one: 1 })).to.equal(true)
      try {
        isObject(123)
      } catch (err) {
        expect(err.status).to.equal(400)
      }

      expect(isBoolean(true)).to.equal(true)
      try {
        isBoolean(123)
      } catch (err) {
        expect(err.status).to.equal(400)
      }

      expect(isNumber(123)).to.equal(true)
      try {
        isNumber("123")
      } catch (err) {
        expect(err.status).to.equal(400)
      }

      expect(isDate(new Date())).to.equal(true)
      try {
        isDate("123")
      } catch (err) {
        expect(err.status).to.equal(400)
      }
    })
  })

  describe("signature", () => {
    it("create signature", async () => {
      const signatureA = signature({
        payload: "1123",
        secretKey: "123",
      })

      const signatureB = signature({
        payload: "1123",
        secretKey: "123",
      })

      const signatureC = signature({
        payload: "1123",
        secretKey: "321",
      })

      expect(signatureA).to.be.equal(signatureB)
      expect(signatureA).not.to.be.equal(signatureC)
    })
  })

  describe("signature", () => {
    it("create signature", async () => {
      const secretKey = createSecretKey("asdf")

      expect(secretKey).to.be.a("string")
    })
  })
})
