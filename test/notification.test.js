const expect = require("chai").expect
const request = require("supertest")
const mongoose = require("mongoose")
const { Business, Notification } = require("../models")
const app = require("../app")

describe("/api/v1/notifications/", () => {
  beforeEach(async () => {
    // before each test delete all users table data
    await Notification.deleteMany({})
    await Business.deleteMany({})
  })

  describe("POST /notifications", () => {
    it("crate notification", async () => {
      const register = await request(app)
        .post("/api/v1/businesses/register")
        .send({
          username: "test_merchants_4",
          password: "123123123",
          webhook_url: "http://localhost:3001/api/hook",
        })
      expect(register.status).to.equal(201)
      const token = register.body.token

      const res = await request(app)
        .post("/api/v1/notifications")
        .set("authorization", "Bearer " + token)
        .send({
          payment_id: "INV/123",
          business_id: register.body.data.business_id,
          amount: "1000",
        })

      expect(res.status).to.equal(202)
      const data = res.body
      expect(data).to.have.property("success").to.be.equal(true)
      expect(data).to.have.property("status_code").to.be.equal(202)
      expect(data).to.have.property("data")
      expect(data.data).to.have.property("_id")
      expect(data.data).to.have.property("payment_id")
      expect(data.data).to.have.property("amount")
      expect(data.data).to.have.property("created")
    })

    it("crate notification", async () => {
      const register = await request(app)
        .post("/api/v1/businesses/register")
        .send({
          username: "test_merchants_4",
          password: "123123123",
          webhook_url: "http://localhost:3001/api/hook",
        })
      expect(register.status).to.equal(201)
      const token = register.body.token

      const nof = await request(app)
        .post("/api/v1/notifications")
        .set("authorization", "Bearer " + token)
        .send({
          payment_id: "INV/123",
          business_id: register.body.data.business_id,
          amount: "1000",
        })

      const id = nof.body.data._id.toString()

      const res = await request(app)
        .get(`/api/v1/notifications/${id}`)
        .set("authorization", "Bearer " + token)

      expect(res.status).to.equal(200)
      const data = res.body
      expect(data).to.have.property("success").to.be.equal(true)
      expect(data).to.have.property("status_code").to.be.equal(200)
      expect(data).to.have.property("data")
      expect(data.data).to.have.property("_id")
      expect(data.data).to.have.property("payment_id")
      expect(data.data).to.have.property("amount")
      expect(data.data).to.have.property("created")
    })
  })
})
