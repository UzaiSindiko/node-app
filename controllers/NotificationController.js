const axios = require("axios")
const mongoose = require("mongoose")
const Business = mongoose.model("Business")
const Notification = mongoose.model("Nof")
const config = require("../config/config")
const helpers = require("../helpers")
const agenda = require("../connect/agenda")
const jobNames = require("../config/jobNames")

const {
  checkType: { isString },
} = require("../helpers")

class NofController {
  static async nof(req, res, next) {
    try {
      const { payment_id, business_id, amount } = req.body

      isString(payment_id, business_id)

      const business = await Business.findOne({ business_id })
        .select("-password")
        .lean()

      if (!business) {
        throw {
          status: 404,
          msg: "not found",
        }
      }

      const nof = await Notification.create({
        business_id,
        payment_id: payment_id,
        business: business._id,
        webhook_url: business.webhook_url,
        status: "STARTED",
        created: Date.now(),
        amount: Number(amount),
      })

      const payload = {
        nofId: nof._id,
        amount,
        payment_id,
        webhook_url: business.webhook_url,
        secretKey: business.secretKey,
        time: new Date().toLocaleString(),
        created: nof.created,
      }

      agenda.now(jobNames.CALL_WEBHOOK_API, payload)

      res.status(202).json({
        success: true,
        status_code: 202,
        data: {
          _id: nof._id,
          payment_id,
          amount,
          created: nof.created,
        },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getNof(req, res, next) {
    try {
      const { id } = req.params

      const nof = await Notification.findById({
        _id: id,
      })

      res.status(200).json({
        success: true,
        status_code: 200,
        data: {
          _id: nof._id,
          payment_id: nof.payment_id,
          status: nof.status,
          amount: nof.amount,
          created: nof.created,
        },
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = NofController
