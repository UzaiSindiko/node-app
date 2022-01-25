const jobNames = require("../config/jobNames")
const config = require("../config/config")
const jobRetry = require("./jobRetry")
const axios = require("axios")
const helpers = require("../helpers")
const mongoose = require("mongoose")
const Notification = mongoose.model("Nof")

module.exports = function (agenda) {
  agenda.define(jobNames.CALL_WEBHOOK_API, async function (job, done) {
    try {
      const {
        retryCount,
        nofId,
        amount,
        payment_id,
        secretKey,
        webhook_url,
        created,
      } = job.attrs.data

      console.log(jobNames.CALL_WEBHOOK_API, job.attrs.data)

      if (!retryCount) {
        await Notification.updateOne(
          { _id: nofId, status: "STARTED" },
          {
            retry_count: retryCount,
            status: "INPROGRESS",
          }
        )
      } else if (retryCount >= config.maxJobRetries) {
        await Notification.updateOne(
          { _id: nofId },
          {
            status: "FAILED",
            retry_count: retryCount,
          }
        )
        return done()
      }
      const payload = {
        payment_id,
        amount,
        created,
      }

      const { data } = await axios({
        method: "POST",
        url: webhook_url,
        headers: {
          Signature: helpers.signature({
            payload,
            secretKey: secretKey,
          }),
        },
        data: payload,
      })

      if (data.success !== true || data.status_code !== 200) {
        throw {
          status: 400,
          msg: "invalid webhook url",
        }
      }

      await Notification.updateOne(
        { _id: nofId },
        {
          status: "SUCCESS",
          retry_count: retryCount,
        }
      )
    } catch (err) {
      console.log("err from corn job")
      done(JSON.stringify(err))
      jobRetry(
        { name: jobNames.CALL_WEBHOOK_API, id: job.attrs._id },
        job.attrs.data
      )
    }
  })
}
