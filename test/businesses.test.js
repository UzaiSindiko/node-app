const expect = require("chai").expect
const request = require("supertest")
const mongoose = require("mongoose")
const { Business } = require("../models")
const app = require("../app")

describe("/api/v1/businesses/", () => {
  beforeEach(async () => {
    // before each test delete all users table data
    await Business.deleteMany({})
  })

  describe("POST /register", () => {
    it("crate business setting and add webhook url", async () => {
      const res = await request(app).post("/api/v1/businesses/register").send({
        username: "test_merchants",
        password: "123123123",
        webhook_url: "http://localhost:3001/api/hook",
      })
      expect(res.status).to.equal(201)
      const data = res.body
      expect(data).to.have.property("token")
      expect(data).to.have.property("success").to.be.equal(true)
      expect(data).to.have.property("status_code").to.be.equal(201)
      expect(data).to.have.property("data")
      expect(data.data).to.have.property("webhook_url")
      expect(data.data).to.have.property("username")
      expect(data.data).to.have.property("_id")
      expect(data.data).to.have.property("createdAt")
      expect(data.data).to.have.property("updatedAt")
      expect(data.data).to.have.property("business_id")
      expect(data.data).to.have.property("secretKey")
    })
  })

  describe("POST /login", () => {
    it("login business setting", async () => {
      await request(app).post("/api/v1/businesses/register").send({
        username: "test_merchants_2",
        password: "123123123",
        webhook_url: "http://localhost:3001/api/hook",
      })
      const res = await request(app).post("/api/v1/businesses/login").send({
        username: "test_merchants_2",
        password: "123123123",
      })
      expect(res.status).to.equal(200)
      const data = res.body
      expect(data).to.have.property("token")
      expect(data).to.have.property("success").to.be.equal(true)
      expect(data).to.have.property("status_code").to.be.equal(200)
      expect(data).to.have.property("data")
      expect(data.data).to.have.property("webhook_url")
      expect(data.data).to.have.property("username")
      expect(data.data).to.have.property("_id")
      expect(data.data).to.have.property("createdAt")
      expect(data.data).to.have.property("updatedAt")
      expect(data.data).to.have.property("business_id")
      expect(data.data).to.have.property("secretKey")
    })
  })

  describe("PATCH /", () => {
    it("update business setting", async () => {
      const register = await request(app)
        .post("/api/v1/businesses/register")
        .send({
          username: "test_merchants_3",
          password: "123123123",
          webhook_url: "http://localhost:3001/api/hook",
        })
      expect(register.status).to.equal(201)
      const token = register.body.token

      const res = await request(app)
        .patch("/api/v1/businesses")
        .set("authorization", "Bearer " + token)
        .send({
          username: "merchant_updated",
          webhook_url: "http://localhost:3001/api/hook",
        })
      expect(res.status).to.equal(200)
      const data = res.body
      expect(data).to.have.property("token")
      expect(data).to.have.property("success").to.be.equal(true)
      expect(data).to.have.property("status_code").to.be.equal(200)
      expect(data).to.have.property("data")
      expect(data.data).to.have.property("webhook_url")
      expect(data.data).to.have.property("username")
      expect(data.data).to.have.property("_id")
      expect(data.data).to.have.property("createdAt")
      expect(data.data).to.have.property("updatedAt")
      expect(data.data).to.have.property("business_id")
      expect(data.data).to.have.property("secretKey")
    })
  })

  describe("POST /:id/test", () => {
    it("testing the webhook url", async () => {
      const register = await request(app)
        .post("/api/v1/businesses/register")
        .send({
          username: "test_merchants_3",
          password: "123123123",
          webhook_url: "http://localhost:3001/api/hook",
        })
      expect(register.status).to.equal(201)
      const id = register.body.data.business_id
      const token = register.body.token

      const res = await request(app)
        .post(`/api/v1/businesses/${id}/test`)
        .set("authorization", "Bearer " + token)
        .send({
          username: "merchant_updated",
          webhook_url: "http://localhost:3001/api/hook",
        })
      expect(res.status).to.equal(200)
      const data = res.body
      expect(data).to.have.property("success").to.be.equal(true)
      expect(data).to.have.property("status_code").to.be.equal(200)
    })

    it("fail testing the webhook url, not login", async () => {
      const register = await request(app)
        .post("/api/v1/businesses/register")
        .send({
          username: "test_merchants_3",
          password: "123123123",
          webhook_url: "http://localhost:3001/api/hook",
        })
      expect(register.status).to.equal(201)
      const id = register.body.data.business_id
      const token = register.body.token

      const res = await request(app)
        .post(`/api/v1/businesses/${id}/test`)
        // .set("authorization", "Bearer " + token)
        .send({
          username: "merchant_updated",
          webhook_url: "http://localhost:3001/api/hook",
        })
      expect(res.status).to.equal(400)
    })
  })
})
