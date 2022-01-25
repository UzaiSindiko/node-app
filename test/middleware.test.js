const expect = require("chai").expect
const request = require("supertest")
const mongoose = require("mongoose")
const { Business } = require("../models")
const app = require("../app")

const auth = require("../middleware/auth")
const error = require("../middleware/errorHandler")

describe("middleware", () => {
  before(async () => {
    // before each test delete all users table data
    await Business.deleteMany({})
  })

  describe("auth middleware", () => {
    it("auth", async () => {
      const register = await request(app)
        .post("/api/v1/businesses/register")
        .send({
          username: "test_merchants_5",
          password: "123123123",
          webhook_url: "http://localhost:3001/api/hook",
        })
      const token = register.body.token

      const req = {
        headers: {
          authorization: "Bearer " + token,
        },
      }

      auth.authentication(req, {}, () => {})
      expect(req).to.have.property("user")
    })
  })
})
